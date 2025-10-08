import * as XLSX from 'xlsx';
import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { sequelize } from '../../lib/db/sequelize.js';
import { getInvoiceModelsFromUser } from '../../lib/utils/invoiceModels.js';

/**
 * Validate mandatory field values for a row
 * @param {Object} rowData - Row data to validate
 * @param {number} rowNumber - Row number for error reporting
 * @param {Object} user - User object to check tokenType
 * @throws {Error} If mandatory field values are missing
 */
function validateMandatoryValues(rowData, rowNumber, user) {
  // Define mandatory fields (all fields except the optional ones)
  const mandatoryFields = [
    'invoiceType', 'invoiceDate', 'buyerNTNCNIC', 'buyerBusinessName', 'buyerProvince',
    'buyerAddress', 'buyerRegistrationType', 'invoiceRefNo',
    'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues',
    'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable',
    'salesTaxWithheldAtSource', 'discount', 'saleType', 'sroItemSerialNo'
  ];
  
  // Add scenarioId to mandatory fields only for non-production users
  if (user.fbrTokenType !== 'production') {
    mandatoryFields.splice(8, 0, 'scenarioId'); // Insert after invoiceRefNo
  }
  
  const missingFields = [];
  
  for (const field of mandatoryFields) {
    const value = rowData[field];
    if (!value || (typeof value === 'string' && value.trim() === '')) {
      missingFields.push(field);
    }
  }
  
  if (missingFields.length > 0) {
    throw new Error(`Row ${rowNumber}: Missing mandatory values for fields: ${missingFields.join(', ')}`);
  }
}

/**
 * Validate buyer data consistency for the same invoice
 * @param {Object} invoiceGroups - Grouped invoice data
 * @param {Object} rowData - Current row data
 * @param {string} invoiceRefNo - Invoice reference number
 * @throws {Error} If inconsistent buyer data is found
 */
function validateBuyerDataConsistency(invoiceGroups, rowData, invoiceRefNo) {
  const group = invoiceGroups[invoiceRefNo];
  
  if (group.master) {
    // Check if buyer data is consistent with existing master data
    if (group.master.buyerBusinessName !== rowData.buyerBusinessName) {
      throw new Error(`Invoice ${invoiceRefNo}: Inconsistent buyer business name. Found "${rowData.buyerBusinessName}" but expected "${group.master.buyerBusinessName}"`);
    }
    
    if (group.master.buyerNTNCNIC !== rowData.buyerNTNCNIC) {
      throw new Error(`Invoice ${invoiceRefNo}: Inconsistent buyer NTN/CNIC. Found "${rowData.buyerNTNCNIC}" but expected "${group.master.buyerNTNCNIC}"`);
    }
  }
}

/**
 * Handle percentage conversion for rate field
 * @param {any} rateValue - The rate value from Excel
 * @returns {string} - Formatted rate as percentage string or original value
 */
function handlePercentageRate(rateValue) {
  if (!rateValue && rateValue !== 0) {
    return rateValue;
  }
  
  // Convert to string for processing
  const rateStr = String(rateValue).trim();
  
  // Case 1: Already contains % symbol - return as is
  if (rateStr.includes('%')) {
    return rateStr;
  }
  
  // Case 2: Check if it's a decimal that should be converted to percentage
  const numericValue = parseFloat(rateStr);
  
  if (!isNaN(numericValue)) {
    // If the value is between 0 and 1 (exclusive), it's likely a decimal percentage
    // Convert to percentage format
    if (numericValue > 0 && numericValue < 1) {
      const percentage = Math.round(numericValue * 100);
      return `${percentage}%`;
    }
    
    // If the value is between 1 and 100, it might be a percentage without % symbol
    // But we'll be conservative and only convert obvious decimals
    if (numericValue >= 1 && numericValue <= 100 && rateStr.includes('.')) {
      // Check if it looks like a decimal percentage (e.g., 0.18, 0.15)
      const decimalPart = rateStr.split('.')[1];
      if (decimalPart && decimalPart.length <= 2) {
        const percentage = Math.round(numericValue * 100);
        return `${percentage}%`;
      }
    }
    
    // For other numeric values, return as string
    return rateStr;
  }
  
  // For non-numeric values, return as is
  return rateStr;
}

/**
 * Parse Excel file and extract invoice data
 * @param {Buffer} fileBuffer - Excel file buffer
 * @param {Object} user - User object containing fbrTokenType
 * @returns {Array} Parsed invoice data
 */
export function parseExcelFile(fileBuffer, user) {
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
    
    // Define all headers that must be present in the Excel file
    const allHeaders = [
      'invoiceType', 'invoiceDate', 'buyerNTNCNIC', 'buyerBusinessName', 'buyerProvince',
      'buyerAddress', 'buyerRegistrationType', 'invoiceRefNo',
      'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues',
      'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable',
      'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo',
      'fedPayable', 'discount', 'saleType', 'sroItemSerialNo'
    ];
    
    // Add scenarioId to headers only for non-production users
    const headersToCheck = [...allHeaders];
    if (user.fbrTokenType !== 'production') {
      headersToCheck.splice(8, 0, 'scenarioId'); // Insert after invoiceRefNo
    }
    
    // Check if all headers are present (including optional ones)
    const missingHeaders = headersToCheck.filter(header => !headers.includes(header));
    if (missingHeaders.length > 0) {
      throw new Error(`Missing headers: ${missingHeaders.join(', ')}`);
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
      
      // Validate mandatory field values
      validateMandatoryValues(rowData, i + 1, user);
      
      // Validate buyer data consistency for the same invoice
      validateBuyerDataConsistency(invoiceGroups, rowData, invoiceRefNo);
      
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
         
         // Create master data object
         const masterData = {
           invoiceType: rowData.invoiceType,
           invoiceDate: invoiceDate,
           buyerNTNCNIC: rowData.buyerNTNCNIC,
           buyerBusinessName: rowData.buyerBusinessName,
           buyerProvince: rowData.buyerProvince,
           buyerAddress: rowData.buyerAddress,
           buyerRegistrationType: rowData.buyerRegistrationType,
           invoiceRefNo: rowData.invoiceRefNo
         };
         
         // Only include scenarioId for non-production users
         if (user.fbrTokenType !== 'production') {
           masterData.scenarioId = parseInt(rowData.scenarioId);
         }
         
         invoiceGroups[invoiceRefNo].master = masterData;
       }
      
      // Extract item data
      const item = {
        hsCode: rowData.hsCode,
        productDescription: rowData.productDescription,
        rate: handlePercentageRate(rowData.rate), // Handle percentage conversion
        uoM: rowData.uoM,
        quantity: parseFloat(rowData.quantity),
        totalValues: parseFloat(rowData.totalValues),
        valueSalesExcludingST: parseFloat(rowData.valueSalesExcludingST),
        fixedNotifiedValueOrRetailPrice: parseFloat(rowData.fixedNotifiedValueOrRetailPrice),
         salesTaxApplicable: rowData.salesTaxApplicable === 'Yes' || rowData.salesTaxApplicable === true || rowData.salesTaxApplicable === 1,
        salesTaxWithheldAtSource: parseFloat(rowData.salesTaxWithheldAtSource || 0),
        // Optional fields - handle empty values properly
        extraTax: rowData.extraTax && rowData.extraTax.toString().trim() !== '' ? parseFloat(rowData.extraTax) : 0,
        furtherTax: rowData.furtherTax && rowData.furtherTax.toString().trim() !== '' ? parseFloat(rowData.furtherTax) : 0,
        sroScheduleNo: rowData.sroScheduleNo && rowData.sroScheduleNo.toString().trim() !== '' ? parseInt(rowData.sroScheduleNo) : 0,
        fedPayable: rowData.fedPayable && rowData.fedPayable.toString().trim() !== '' ? parseFloat(rowData.fedPayable) : 0,
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
    
    // Filter scenarioId from response for production users
    const filteredInvoices = createdInvoices.map(invoice => {
      const invoiceData = invoice.toJSON();
      if (user.fbrTokenType === 'production') {
        delete invoiceData.scenarioId;
      }
      return invoiceData;
    });
    
    return {
      invoices: filteredInvoices,
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
    const invoiceGroups = parseExcelFile(fileBuffer, user);
    
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
