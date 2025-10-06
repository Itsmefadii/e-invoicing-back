import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { Seller } from '../user/model.seller.js';
import { User } from '../user/model.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { Industry } from '../systemConfigs/model/model.industry.js';
import { State } from '../systemConfigs/model/model.state.js';
import { Op } from 'sequelize';
import axios from 'axios';
import { getInvoiceModelsFromUser } from '../../lib/utils/invoiceModels.js';

export async function listInvoicesService(req) {
  console.log(req.user)
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);

  console.log(InvoiceModel);
  console.log(InvoiceItemModel);

  const include = [{
    model: InvoiceItemModel,
    as: 'items',
    attributes: ['id', 'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable', 'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo', 'fedPayable', 'discount', 'saleType', 'sroItemSerialNo', 'error']
  },
  {
    model: Seller,
    as: 'seller',
    attributes: ['id', 'businessName', 'ntnCnic', 'businessNatureId', 'industryId', 'stateId', 'address1', 'address2', 'city', 'postalCode', 'businessPhone', 'businessEmail'],
    include: [
      {
        model: BusinessNature,
        as: 'businessNature',
        attributes: ['id', 'businessNature']
      },
      {
        model: Industry,
        as: 'industry',
        attributes: ['id', 'industryName']
      }
    ]
  }]

  let rows = await InvoiceModel.findAll({
    include: include,
  });

  if (req.user.roleName === 'Seller') {
    rows = await InvoiceModel.findAll({
      where: {
        sellerId: req.user.sellerId
      },
      include: include
    });
  }

  return rows.map((r) => r.toJSON());
}

export async function getInvoiceByIdService(id, user) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(user);

  const include = [{
    model: InvoiceItemModel,
    as: 'items',
    attributes: ['id', 'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable', 'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo', 'fedPayable', 'discount', 'saleType', 'sroItemSerialNo']
  },
  {
    model: Seller,
    as: 'seller',
    attributes: ['id', 'businessName', 'ntnCnic', 'businessNatureId', 'industryId', 'stateId', 'address1', 'address2', 'city', 'postalCode', 'businessPhone', 'businessEmail'],
    include: [
      {
        model: BusinessNature,
        as: 'businessNature',
        attributes: ['id', 'businessNature']
      },
      {
        model: Industry,
        as: 'industry',
        attributes: ['id', 'industryName']
      }
    ]
  }
  ]

  const row = await InvoiceModel.findOne({
    where: {
      id: id
    },
    include: include
  });
  return row ? row.toJSON() : null;
}


export async function postInvoiceService(request, invoiceIds) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(request.user);
  const sellerId = request.user.sellerId;

  const include = [{
    model: InvoiceItemModel,
    as: 'items',
    attributes: ['id', 'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable', 'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo', 'fedPayable', 'discount', 'saleType', 'sroItemSerialNo']
  },
  {
    model: Seller,
    as: 'seller',
    attributes: ['id', 'businessName', 'ntnCnic', 'businessNatureId', 'industryId', 'stateId', 'address1', 'address2', 'city', 'postalCode', 'businessPhone', 'businessEmail'],
    include: [
      {
        model: BusinessNature,
        as: 'businessNature',
        attributes: ['id', 'businessNature']
      },
      {
        model: Industry,
        as: 'industry',
        attributes: ['id', 'industryName']
      },
      {
        model: State,
        as: 'state',
        attributes: ['id', 'state']
      }
    ]
  }
  ]

  const row = await InvoiceModel.findAll({
    where: {
      id: { [Op.in]: invoiceIds }
    },
    include: include
  });

  const fbrTokenType = request.user.sellerData?.fbrTokenType;
  const tokenAttribute = fbrTokenType === 'Sandbox' ? 'fbrSandBoxToken' : 'fbrProdToken';
  
  const findToken = await Seller.findOne({
    where: {
      id: sellerId
    },
    attributes: [tokenAttribute]
  })

  const token = findToken[tokenAttribute];

  console.log(token);

  let data = []
  for (let i = 0; i < row.length; i++) {
    const prepareData = {
      invoiceType: row[i].invoiceType,
      invoiceDate: row[i].invoiceDate,
      buyerNTNCNIC: row[i].buyerNTNCNIC,
      buyerBusinessName: row[i].buyerBusinessName,
      buyerProvince: row[i].buyerProvince,
      buyerAddress: row[i].buyerAddress,
      buyerRegistrationType: row[i].buyerRegistrationType,
      invoiceRefNo: row[i].invoiceRefNo,
      scenarioId: row[i].scenarioId,
      sellerNTNCNIC: row[i].seller.ntnCnic,
      sellerBusinessName: row[i].seller.businessName,
      sellerProvince: row[i].seller.state.state,
      sellerAddress: row[i].seller.address1,
      items: row[i].items.map((item) => ({
        hsCode: item.hsCode,
        productDescription: item.productDescription,
        rate: item.rate,
        uoM: item.uoM,
        quantity: item.quantity,
        totalValues: item.totalValues,
        valueSalesExcludingST: item.valueSalesExcludingST,
        fixedNotifiedValueOrRetailPrice: item.fixedNotifiedValueOrRetailPrice,
        salesTaxApplicable: item.salesTaxApplicable,
        salesTaxWithheldAtSource: item.salesTaxWithheldAtSource,
        extraTax: item.extraTax,
        furtherTax: item.furtherTax,
        sroScheduleNo: item.sroScheduleNo,
        fedPayable: item.fedPayable,
        discount: item.discount,
        saleType: item.saleType,
        sroItemSerialNo: item.sroItemSerialNo
      }))
    }

    try {
      const submitInvoice = await fbrSubmitInvoice(prepareData, token, fbrTokenType)
      
      // Parse the response if it's a string, with error handling for malformed JSON
      let parsedResponse;
      if (typeof submitInvoice === 'string') {
        try {
          parsedResponse = JSON.parse(submitInvoice);
        } catch (parseError) {
          console.error(`JSON Parse Error for Invoice ${row[i].id}:`, parseError.message);
          console.error(`Raw response:`, submitInvoice);
          
          // Try to extract basic error information from the malformed JSON
          const errorMatch = submitInvoice.match(/"error":\s*"([^"]+)"/);
          const statusMatch = submitInvoice.match(/"status":\s*"([^"]+)"/);
          const statusCodeMatch = submitInvoice.match(/"statusCode":\s*"([^"]+)"/);
          
          parsedResponse = {
            validationResponse: {
              status: statusMatch ? statusMatch[1] : "Error",
              statusCode: statusCodeMatch ? statusCodeMatch[1] : "99",
              error: errorMatch ? errorMatch[1] : "Malformed JSON response from FBR API",
              errorCode: "JSON_PARSE_ERROR"
            }
          };
        }
      } else {
        parsedResponse = submitInvoice;
      }
      
      // Log the response for debugging
      console.log(`FBR Response for Invoice ${row[i].id}:`, JSON.stringify(parsedResponse, null, 2));

      const validation = parsedResponse.validationResponse || {};
      const { status, statusCode, error, errorCode, invoiceStatuses } = validation;

      // Handle both types of invalid responses
      if (statusCode === "01" || status === "Invalid" || status === "invalid") {
        console.log(`Invoice ${row[i].id} validation failed:`, { status, statusCode, error, errorCode });

        await InvoiceModel.update({
          status: status,
          error: error,
        }, {
          where: {
            id: row[i].id
          }
        })

        // Handle item-level errors when invoiceStatuses array exists
        if (invoiceStatuses && Array.isArray(invoiceStatuses) && invoiceStatuses.length > 0) {
          console.log(`Processing ${invoiceStatuses.length} item statuses for invoice ${row[i].id}`);
          
          for (let j = 0; j < invoiceStatuses.length; j++) {
            const itemStatus = invoiceStatuses[j];
            if (itemStatus.statusCode === "01" || itemStatus.status === "Invalid" || itemStatus.status === "invalid") {
              console.log(`Item ${j + 1} validation failed:`, itemStatus);
              
              await InvoiceItemModel.update({
                error: itemStatus.error,
              }, {
                where: {
                  id: row[i].items[j].id
                }
              })
            }
          }
        }
      } else if (statusCode === "00" && status === "Valid") {
        console.log(`Invoice ${row[i].id} validation successful`);
        
        await InvoiceModel.update({
          status: status,
          error: null,
          fbrInvoiceNumber: invoiceStatuses[0].invoiceNumber,
        }, {
          where: {
            id: row[i].id
          }
        })
      }

      // Add the response to data array for return
      const responseData = {
        invoiceId: row[i].id,
        fbrResponse: parsedResponse
      };
      
      console.log(`Response data for invoice ${row[i].id}:`, JSON.stringify(responseData, null, 2));
      data.push(responseData);

    } catch (error) {
      console.error(`Error processing invoice ${row[i].id}:`, error);
      
      // Update invoice with error status
      await InvoiceModel.update({
        status: "Error",
        error: error.message,
      }, {
        where: {
          id: row[i].id
        }
      })
      
      data.push({
        invoiceId: row[i].id,
        error: error.message
      });
    }
  }

  console.log(row);
  return data;
}

async function fbrSubmitInvoice(invoice, token, fbrTokenType) {
  console.log("Token", token);
  console.log("FBR Token Type", fbrTokenType);

  console.log("Invoice: ", invoice)

  const endpoint = fbrTokenType === 'sandbox' ? '/postinvoicedata_sb' : '/postinvoicedata';
  const response = await axios.post(`${process.env.FBR_API_URL}${endpoint}`, invoice,
    {
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      validateStatus: () => true,
    }
  )  
  console.log("Raw FBR Response:", response.data);
  console.log("Response type:", typeof response.data);
  console.log("Response length:", response.data ? response.data.length : 0);
  
  // Log first 500 characters to see the structure
  if (typeof response.data === 'string') {
    console.log("First 500 chars:", response.data.substring(0, 500));
  }
  
  return response.data
}

export async function createInvoiceService(req) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);
  const invoice  = req.body;
  const sellerId = req.user.sellerId;

  console.log('sellerId', sellerId);
  console.log('invoice', invoice);

  const findInvoice = await InvoiceModel.findOne({
    where: {
      [Op.and] : [{invoiceRefNo: invoice.invoiceRefNo}, {sellerId: sellerId}]
    }
  });

  if(findInvoice){
    throw new Error('Invoice already exists');
  }

  const createInvoice = await InvoiceModel.create({
    sellerId: sellerId,
    ...invoice
  });

  if(!createInvoice){
    throw new Error('Failed to create invoice');
  }

  // Create invoice items using bulkCreate for better performance
  const itemData = invoice.items.map((item) => {
    // Remove id field to let database auto-generate it
    const { id, ...itemWithoutId } = item;
    return {
      invoiceId: createInvoice.id,
      ...itemWithoutId
    };
  });

  const createInvoiceItems = await InvoiceItemModel.bulkCreate(itemData);
  return {invoice: createInvoice, items: createInvoiceItems};
}

export async function updateInvoiceService(req) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);
  const invoice = req.body;
  const invoiceId = req.params.id;
  const sellerId = req.user.sellerId;

  const deleteInvoiceItems = await InvoiceItemModel.destroy({where: {invoiceId}});

  const deleteInvoice = await InvoiceModel.destroy({where: {id: invoiceId}});

  if(!deleteInvoiceItems || !deleteInvoice){
    throw new Error('Failed to delete invoice items or invoice');
  }

  const createInvoice = await InvoiceModel.create({
    sellerId: sellerId,
    ...invoice
  });

  if(!createInvoice){
    throw new Error('Failed to create invoice');
  }

  // Create invoice items using bulkCreate for better performance
  const itemData = invoice.items.map((item) => {
    // Remove id field to let database auto-generate it
    const { id, ...itemWithoutId } = item;
    return {
      invoiceId: createInvoice.id,
      ...itemWithoutId
    };
  });

  const createInvoiceItems = await InvoiceItemModel.bulkCreate(itemData);
  return {invoice: createInvoice, items: createInvoiceItems};
}

export async function deleteInvoiceService(req) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);
  const invoiceId = req.params.id;

  const deleteInvoiceItems = await InvoiceItemModel.destroy({where: {invoiceId}});

  const deleteInvoice = await InvoiceModel.destroy({where: {id: invoiceId}});

  if(!deleteInvoiceItems || !deleteInvoice){
    throw new Error('Failed to delete invoice items or invoice');
  }
  return {message: 'Invoice deleted successfully'};
}

export async function getDashboardStatsService(req) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);
  const sellerId = req.user.sellerId;
  const userRole = req.user.roleName;

  // Base where clause - filter by seller if user is a seller
  const whereClause = userRole === 'Seller' ? { sellerId } : {};

  try {
    // Get total number of invoices
    const totalInvoices = await InvoiceModel.count({
      where: whereClause
    });

    // Get number of users for the seller (only if user is a seller)
    let totalUsers = 0;
    if (userRole === 'Seller') {
      totalUsers = await User.count({
        where: { sellerId }
      });
    } else {
      // If admin, get total users across all sellers
      totalUsers = await User.count();
    }

    // Get total revenue from submitted invoices
    const submittedInvoices = await InvoiceModel.findAll({
      where: {
        ...whereClause,
        status: 'submitted'
      },
      attributes: ['totalAmount']
    });

    const totalRevenue = submittedInvoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.totalAmount || 0);
    }, 0);

    // Get invoice counts by status
    const pendingInvoices = await InvoiceModel.count({
      where: {
        ...whereClause,
        status: 'pending'
      }
    });

    const submittedInvoicesCount = await InvoiceModel.count({
      where: {
        ...whereClause,
        status: 'submitted'
      }
    });

    const invalidInvoices = await InvoiceModel.count({
      where: {
        ...whereClause,
        status: 'invalid'
      }
    });

    // Calculate success rate
    const totalProcessedInvoices = submittedInvoicesCount + invalidInvoices;
    const successRate = totalProcessedInvoices > 0 
      ? ((submittedInvoicesCount / totalProcessedInvoices) * 100).toFixed(2)
      : 0;

    // Get valid invoices count (if status 'valid' exists)
    const validInvoices = await InvoiceModel.count({
      where: {
        ...whereClause,
        status: 'valid'
      }
    });

    return {
      totalInvoices,
      totalUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      successRate: parseFloat(successRate),
      pendingInvoices,
      submittedInvoices: submittedInvoicesCount,
      invalidInvoices,
      validInvoices
    };

  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw new Error('Failed to retrieve dashboard statistics');
  }
}