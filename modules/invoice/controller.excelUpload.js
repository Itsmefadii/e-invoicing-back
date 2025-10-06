import { processExcelUpload } from './services.excelUpload.js';
import { sendSuccess, sendError, sendCreated } from '../../lib/utils/response.js';

/**
 * Handle Excel file upload for invoice data
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
export async function uploadExcelController(request, reply) {
  try {
    // Check if user has sellerId
    if (!request.user.sellerId) {
      return sendError(reply, 'Only sellers can upload invoice data', 403);
    }
    
    // Get uploaded file
    const data = await request.file();
    
    if (!data) {
      return sendError(reply, 'No file uploaded', 400);
    }
    
    // Check file type
    const allowedTypes = [
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', // .xlsx
      'application/vnd.ms-excel', // .xls
      'text/csv' // .csv
    ];
    
    if (!allowedTypes.includes(data.mimetype)) {
      return sendError(reply, 'Invalid file type. Please upload Excel (.xlsx, .xls) or CSV file', 400);
    }
    
    // Check file size (max 10MB)
    const maxSize = 10 * 1024 * 1024; // 10MB
    if (data.file.bytesRead > maxSize) {
      return sendError(reply, 'File size too large. Maximum size is 10MB', 400);
    }
    
    // Read file buffer
    const fileBuffer = await data.toBuffer();
    
    // Process Excel upload
    const result = await processExcelUpload(fileBuffer, request.user.sellerId, request.user);
    
    // Log the upload activity
    console.log('Excel upload completed:', {
      userId: request.user.id,
      userName: request.user.fullName,
      sellerId: request.user.sellerId,
      sellerCode: request.user.sellerData?.sellerCode,
      invoicesCreated: result.data.summary.totalInvoices,
      itemsCreated: result.data.summary.totalItems,
      totalAmount: result.data.summary.totalAmount
    });
    
    return sendCreated(reply, result.data, result.message);
    
  } catch (error) {
    console.error('Excel upload error:', {
      userId: request.user.id,
      userName: request.user.fullName,
      sellerId: request.user.sellerId,
      error: error.message
    });
    
    return sendError(reply, error.message, 500);
  }
}

/**
 * Get upload template/format information
 * @param {Object} request - Fastify request object
 * @param {Object} reply - Fastify reply object
 */
export async function getUploadTemplateController(request, reply) {
  try {
    const template = {
      requiredHeaders: [
        'invoiceType', 'invoiceDate', 'buyerNTNCNIC', 'buyerBusinessName', 'buyerProvince',
        'buyerAddress', 'buyerRegistrationType', 'invoiceRefNo', 'scenarioId',
        'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues',
        'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable',
        'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo',
        'fedPayable', 'discount', 'saleType', 'sroItemSerialNo'
      ],
      fieldDescriptions: {
        // Master data fields
        invoiceType: 'Type of invoice (e.g., SALES, PURCHASE)',
        invoiceDate: 'Date of invoice (YYYY-MM-DD format)',
        buyerNTNCNIC: 'Buyer NTN or CNIC number',
        buyerBusinessName: 'Buyer business name',
        buyerProvince: 'Buyer province/state',
        buyerAddress: 'Buyer complete address',
        buyerRegistrationType: 'REGISTERED or UNREGISTERED',
        invoiceRefNo: 'Unique invoice reference number',
        scenarioId: 'Scenario ID (numeric)',
        
        // Item details fields
        hsCode: 'HS Code for the product',
        productDescription: 'Description of the product',
        rate: 'Unit rate/price (numeric)',
        uoM: 'Unit of measurement (PCS, KG, L, etc.)',
        quantity: 'Quantity (numeric)',
        totalValues: 'Total value (rate × quantity)',
        valueSalesExcludingST: 'Sales value excluding sales tax',
        fixedNotifiedValueOrRetailPrice: 'Fixed notified value or retail price',
        salesTaxApplicable: 'Yes or No',
        salesTaxWithheldAtSource: 'Sales tax withheld at source (numeric)',
        extraTax: 'Extra tax amount (numeric)',
        furtherTax: 'Further tax amount (numeric)',
        sroScheduleNo: 'SRO schedule number (numeric)',
        fedPayable: 'FED payable amount (numeric)',
        discount: 'Discount amount (numeric)',
        saleType: 'Type of sale (Retail, Wholesale, Industrial)',
        sroItemSerialNo: 'SRO item serial number'
      },
      sampleData: {
        invoiceType: 'SALES',
        invoiceDate: '2024-01-15',
        buyerNTNCNIC: '1234567890123',
        buyerBusinessName: 'ABC Trading Company',
        buyerProvince: 'Sindh',
        buyerAddress: '123 Main Street Karachi',
        buyerRegistrationType: 'REGISTERED',
        invoiceRefNo: 'INV-001',
        scenarioId: '1',
        hsCode: '1234.56',
        productDescription: 'Office Supplies',
        rate: '150.00',
        uoM: 'PCS',
        quantity: '10',
        totalValues: '1500.00',
        valueSalesExcludingST: '1500.00',
        fixedNotifiedValueOrRetailPrice: '1500.00',
        salesTaxApplicable: 'Yes',
        salesTaxWithheldAtSource: '0.00',
        extraTax: '0.00',
        furtherTax: '0.00',
        sroScheduleNo: '1',
        fedPayable: '0.00',
        discount: '0.00',
        saleType: 'Retail',
        sroItemSerialNo: '001'
      },
      notes: [
        'Each row represents one item. Multiple items for the same invoice should have the same invoiceRefNo.',
        'Master data fields (invoiceType to scenarioId) should be identical for all items of the same invoice.',
        'Item fields (hsCode to sroItemSerialNo) can vary for each item.',
        'Date format should be YYYY-MM-DD.',
        'Numeric fields should not contain currency symbols or commas.',
        'Boolean fields (salesTaxApplicable) should be "Yes" or "No".'
      ]
    };
    
    return sendSuccess(reply, template, 'Upload template information retrieved successfully');
    
  } catch (error) {
    console.error('Template info error:', error);
    return sendError(reply, 'Failed to get template information', 500);
  }
}
