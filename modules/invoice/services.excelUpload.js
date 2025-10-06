import * as XLSX from 'xlsx';
import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { sequelize } from '../../lib/db/sequelize.js';
import { getInvoiceModelsFromUser } from '../../lib/utils/invoiceModels.js';

/**
 * Parse Excel file and extract invoice data
 * @param {Buffer} fileBuffer - Excel file buffer
 * @returns {Array} Parsed invoice data
 */
export function parseExcelFile(fileBuffer) {
  try {
    // Read Excel file
    const workbook = XLSX.read(fileBuffer, { type: 'buffer' });
    const sheetName = workbook.SheetNames[0];
    const worksheet = workbook.Sheets[sheetName];
    
     // Convert to JSON with date handling
     const jsonData = XLSX.utils.sheet_to_json(worksheet, { 
       header: 1,
       raw: false, // This will convert Excel dates to strings
       dateNF: 'yyyy-mm-dd' // Format dates as YYYY-MM-DD
     });
     
     if (jsonData.length < 2) {
       throw new Error('Excel file must contain at least a header row and one data row');
     }
     
    
    // Get headers (first row)
    const headers = jsonData[0];
    
    // Validate required headers
    const requiredHeaders = [
      'invoiceType', 'invoiceDate', 'buyerNTNCNIC', 'buyerBusinessName', 'buyerProvince',
      'buyerAddress', 'buyerRegistrationType', 'invoiceRefNo', 'scenarioId',
      'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues',
      'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable',
      'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo',
      'fedPayable', 'discount', 'saleType', 'sroItemSerialNo'
    ];
    
    const missingHeaders = requiredHeaders.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing required headers: ${missingHeaders.join(', ')}`);
    }
    
    // Group data by invoice (invoiceRefNo)
    const invoiceGroups = {};
    
    for (let i = 1; i < jsonData.length; i++) {
      const row = jsonData[i];
      if (row.length === 0) continue; // Skip empty rows
      
      const rowData = {};
      headers.forEach((header, index) => {
        rowData[header] = row[index];
      });
      
      const invoiceRefNo = rowData.invoiceRefNo;
      if (!invoiceRefNo) continue; // Skip rows without invoice reference
      
      if (!invoiceGroups[invoiceRefNo]) {
        invoiceGroups[invoiceRefNo] = {
          master: null,
          items: []
        };
      }
      
       // Extract master data (same for all items in an invoice)
       if (!invoiceGroups[invoiceRefNo].master) {
         // Parse date properly
         let invoiceDate;
         
         if (rowData.invoiceDate) {
           // Handle different date formats
           if (typeof rowData.invoiceDate === 'string') {
             // Clean the date string (remove extra spaces, etc.)
             const cleanDate = rowData.invoiceDate.trim();
             
             // Try different parsing methods
             invoiceDate = new Date(cleanDate);
             
             if (isNaN(invoiceDate.getTime())) {
               // Try parsing YYYY-MM-DD format manually
               const dateMatch = cleanDate.match(/^(\d{4})-(\d{1,2})-(\d{1,2})$/);
               if (dateMatch) {
                 const [, year, month, day] = dateMatch;
                 invoiceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
               } else {
                 // Try parsing DD/MM/YYYY format first (most common in international formats)
                 const dateMatchDDMM = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                 if (dateMatchDDMM) {
                   const [, day, month, year] = dateMatchDDMM;
                   invoiceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                 } else {
                   // Try parsing DD-MM-YYYY format
                   const dateMatch2 = cleanDate.match(/^(\d{1,2})-(\d{1,2})-(\d{4})$/);
                   if (dateMatch2) {
                     const [, day, month, year] = dateMatch2;
                     invoiceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                   } else {
                     // Try parsing MM/DD/YYYY format (US format)
                     const dateMatch3 = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{4})$/);
                     if (dateMatch3) {
                       const [, month, day, year] = dateMatch3;
                       invoiceDate = new Date(parseInt(year), parseInt(month) - 1, parseInt(day));
                     } else {
                       // Try parsing DD/MM/YY or MM/DD/YY format (2-digit year)
                       const dateMatchYY = cleanDate.match(/^(\d{1,2})\/(\d{1,2})\/(\d{2})$/);
                       if (dateMatchYY) {
                         const [, first, second, year] = dateMatchYY;
                         const firstNum = parseInt(first);
                         const secondNum = parseInt(second);
                         
                         // Convert 2-digit year to 4-digit year
                         const fullYear = parseInt(year) < 50 ? 2000 + parseInt(year) : 1900 + parseInt(year);
                         
                         // If first number > 12, it must be DD/MM/YY format
                         if (firstNum > 12) {
                           // DD/MM/YY format
                           invoiceDate = new Date(fullYear, secondNum - 1, firstNum);
                         } else if (secondNum > 12) {
                           // MM/DD/YY format
                           invoiceDate = new Date(fullYear, firstNum - 1, secondNum);
                         } else {
                           // Ambiguous case - assume DD/MM/YY (international format)
                           invoiceDate = new Date(fullYear, secondNum - 1, firstNum);
                         }
                       }
                     }
                   }
                 }
               }
             }
           } else if (rowData.invoiceDate instanceof Date) {
             invoiceDate = rowData.invoiceDate;
           } else if (typeof rowData.invoiceDate === 'number') {
             // Handle Excel date numbers (Excel stores dates as numbers)
             // Excel date epoch starts from 1900-01-01, but there's a bug where 1900 is considered a leap year
             // So we need to adjust for that
             const excelEpoch = new Date(1900, 0, 1);
             const daysSinceEpoch = rowData.invoiceDate - 2; // Subtract 2 to account for Excel's leap year bug
             invoiceDate = new Date(excelEpoch.getTime() + daysSinceEpoch * 24 * 60 * 60 * 1000);
           } else {
             // Handle other numeric date formats
             invoiceDate = new Date(rowData.invoiceDate);
           }
         } else {
           invoiceDate = new Date(); // Default to current date
         }
         
         // Validate the final date
         if (isNaN(invoiceDate.getTime())) {
           console.error('Invalid date after parsing:', rowData.invoiceDate, '->', invoiceDate);
           invoiceDate = new Date(); // Fallback to current date
         }
         
         invoiceGroups[invoiceRefNo].master = {
           invoiceType: rowData.invoiceType,
           invoiceDate: invoiceDate,
           buyerNTNCNIC: rowData.buyerNTNCNIC,
           buyerBusinessName: rowData.buyerBusinessName,
           buyerProvince: rowData.buyerProvince,
           buyerAddress: rowData.buyerAddress,
           buyerRegistrationType: rowData.buyerRegistrationType,
           invoiceRefNo: rowData.invoiceRefNo,
           scenarioId: parseInt(rowData.scenarioId)
         };
       }
      
      // Extract item data
      const item = {
        hsCode: rowData.hsCode,
        productDescription: rowData.productDescription,
        rate: parseFloat(rowData.rate),
        uoM: rowData.uoM,
        quantity: parseFloat(rowData.quantity),
        totalValues: parseFloat(rowData.totalValues),
        valueSalesExcludingST: parseFloat(rowData.valueSalesExcludingST),
        fixedNotifiedValueOrRetailPrice: parseFloat(rowData.fixedNotifiedValueOrRetailPrice),
         salesTaxApplicable: rowData.salesTaxApplicable === 'Yes' || rowData.salesTaxApplicable === true || rowData.salesTaxApplicable === 1,
        salesTaxWithheldAtSource: parseFloat(rowData.salesTaxWithheldAtSource || 0),
         extraTax: parseFloat(rowData.extraTax || 0),
        furtherTax: parseFloat(rowData.furtherTax || 0),
        sroScheduleNo: parseInt(rowData.sroScheduleNo),
        fedPayable: parseFloat(rowData.fedPayable || 0),
        discount: parseFloat(rowData.discount || 0),
        saleType: rowData.saleType,
        sroItemSerialNo: rowData.sroItemSerialNo
      };
      
      invoiceGroups[invoiceRefNo].items.push(item);
    }
    
    return Object.values(invoiceGroups);
  } catch (error) {
    throw new Error(`Failed to parse Excel file: ${error.message}`);
  }
}

/**
 * Validate that invoiceRefNo values don't already exist for the seller
 * @param {Array} invoiceGroups - Parsed invoice data
 * @param {number} sellerId - Seller ID
 * @param {Object} user - User object containing fbrTokenType
 * @returns {void}
 * @throws {Error} If any invoiceRefNo already exists
 */
export async function validateInvoiceRefNumbers(invoiceGroups, sellerId, user) {
  try {
    const { Invoice: InvoiceModel } = getInvoiceModelsFromUser(user);
    
    // Extract all invoiceRefNo values from the Excel data
    const invoiceRefNumbers = invoiceGroups.map(group => group.master.invoiceRefNo);
    
    if (invoiceRefNumbers.length === 0) {
      return; // No invoices to validate
    }
    
    // Check if any of these invoiceRefNo values already exist for this seller
    const existingInvoices = await InvoiceModel.findAll({
      where: {
        sellerId: sellerId,
        invoiceRefNo: invoiceRefNumbers
      },
      attributes: ['invoiceRefNo']
    });
    
    if (existingInvoices.length > 0) {
      const existingRefNumbers = existingInvoices.map(inv => inv.invoiceRefNo);
      throw new Error(`The following invoice reference numbers already exist for this seller: ${existingRefNumbers.join(', ')}. Please use unique reference numbers.`);
    }
  } catch (error) {
    throw new Error(`Invoice validation failed: ${error.message}`);
  }
}

/**
 * Save invoice data to database
 * @param {Array} invoiceGroups - Parsed invoice data
 * @param {number} sellerId - Seller ID
 * @param {Object} user - User object containing fbrTokenType
 * @returns {Object} Result with created invoices and items
 */
export async function saveInvoiceData(invoiceGroups, sellerId, user) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(user);
  const transaction = await sequelize.transaction();
  
  try {
    const createdInvoices = [];
    const createdItems = [];
    
    for (const group of invoiceGroups) {
      const { master, items } = group;
      
      // Calculate total amount for the invoice
      const totalAmount = items.reduce((sum, item) => sum + item.totalValues, 0);
      
      // Create invoice
      const invoice = await InvoiceModel.create({
        sellerId: sellerId,
        ...master,
        totalAmount: totalAmount,
        status: 'pending'
      }, { transaction });
      
      
      createdInvoices.push(invoice);
      
       // Create invoice items
       for (const itemData of items) {
         const item = await InvoiceItemModel.create({
           invoiceId: invoice.id,
           ...itemData
         }, { transaction });
         
         createdItems.push(item);
       }
    }
    
    await transaction.commit();
    
    return {
      invoices: createdInvoices,
      items: createdItems,
      summary: {
        totalInvoices: createdInvoices.length,
        totalItems: createdItems.length,
        totalAmount: createdInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount), 0)
      }
    };
  } catch (error) {
    await transaction.rollback();
    throw new Error(`Failed to save invoice data: ${error.message}`);
  }
}

/**
 * Process Excel upload for seller
 * @param {Buffer} fileBuffer - Excel file buffer
 * @param {number} sellerId - Seller ID
 * @param {Object} user - User object containing fbrTokenType
 * @returns {Object} Processing result
 */
export async function processExcelUpload(fileBuffer, sellerId, user) {
  try {
    // Parse Excel file
    const invoiceGroups = parseExcelFile(fileBuffer);
    
    if (invoiceGroups.length === 0) {
      throw new Error('No valid invoice data found in Excel file');
    }
    
    // Validate that invoiceRefNo values don't already exist for this seller
    await validateInvoiceRefNumbers(invoiceGroups, sellerId, user);
    
    // Save to database
    const result = await saveInvoiceData(invoiceGroups, sellerId, user);
    
    return {
      success: true,
      message: `Successfully processed ${result.summary.totalInvoices} invoices with ${result.summary.totalItems} items`,
      data: result
    };
  } catch (error) {
    throw new Error(`Excel upload processing failed: ${error.message}`);
  }
}
