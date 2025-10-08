import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { Seller } from '../user/model.seller.js';
import { User } from '../user/model.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { Industry } from '../systemConfigs/model/model.industry.js';
import { State } from '../systemConfigs/model/model.state.js';
import { Op, fn, col } from 'sequelize';
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
    attributes: ['id', 'hsCode', 'productDescription', 'rate', 'uoM', 'quantity', 'totalValues', 'valueSalesExcludingST', 'fixedNotifiedValueOrRetailPrice', 'salesTaxApplicable', 'salesTaxWithheldAtSource', 'extraTax', 'furtherTax', 'sroScheduleNo', 'fedPayable', 'discount', 'saleType', 'sroItemSerialNo', "error"]
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

  console.log("FBR Token Type", fbrTokenType);
  console.log("Token Attribute", tokenAttribute);
  
  const findToken = await Seller.findOne({
    where: {
      id: sellerId
    },
    attributes: [tokenAttribute]
  })

  const token = findToken[tokenAttribute];

  console.log("Token", token);

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
         quantity: parseFloat(item.quantity) || 0,
         totalValues: parseFloat(item.totalValues) || 0,
         valueSalesExcludingST: parseFloat(item.valueSalesExcludingST) || 0,
         fixedNotifiedValueOrRetailPrice: parseFloat(item.fixedNotifiedValueOrRetailPrice) || 0,
         salesTaxApplicable: parseFloat(item.salesTaxApplicable) || 0,
         salesTaxWithheldAtSource: parseFloat(item.salesTaxWithheldAtSource) || 0,
         extraTax: item.extraTax,
         furtherTax: parseFloat(item.furtherTax) || 0,
         sroScheduleNo: item.sroScheduleNo,
         fedPayable: parseFloat(item.fedPayable) || 0,
         discount: parseFloat(item.discount) || 0,
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
          status: "Submitted",
          error: null,
          fbrInvoiceNumber: invoiceStatuses[0].invoiceNo,
        }, {
          where: {
            id: row[i].id
          }
        })
      }

      // Create a standardized response structure for frontend
      const responseData = {
        invoiceId: row[i].id,
        status: validation.status || "Unknown",
        statusCode: validation.statusCode || "99",
        error: validation.error || "",
        errorCode: validation.errorCode || "",
        fbrInvoiceNumber: validation.invoiceStatuses && validation.invoiceStatuses[0] ? validation.invoiceStatuses[0].invoiceNo : null,
        itemErrors: []
      };

      // If there are item-level errors, add them to the response
      if (validation.invoiceStatuses && Array.isArray(validation.invoiceStatuses)) {
        validation.invoiceStatuses.forEach((itemStatus, index) => {
          if (itemStatus.statusCode === "01" || itemStatus.status === "Invalid" || itemStatus.status === "invalid") {
            responseData.itemErrors.push({
              itemIndex: index,
              itemSNo: itemStatus.itemSNo,
              statusCode: itemStatus.statusCode,
              status: itemStatus.status,
              error: itemStatus.error,
              errorCode: itemStatus.errorCode,
              invoiceNo: itemStatus.invoiceNo
            });
          }
        });
      }
      
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
        status: "Error",
        statusCode: "99",
        error: error.message,
        errorCode: "SYSTEM_ERROR",
        fbrInvoiceNumber: null,
        itemErrors: []
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

  const endpoint = fbrTokenType === 'Sandbox' ? '/postinvoicedata_sb' : '/postinvoicedata';
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

    // Get total revenue from submitted invoices only
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

    // Calculate month-over-month percentage increase
    const currentDate = new Date();
    const currentMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
    const lastMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() - 1, 1);
    const nextMonth = new Date(currentDate.getFullYear(), currentDate.getMonth() + 1, 1);

    // Get current month data
    const currentMonthInvoices = await InvoiceModel.findAll({
      where: {
        ...whereClause,
        invoiceDate: {
          [Op.gte]: currentMonth,
          [Op.lt]: nextMonth
        }
      },
      attributes: ['totalAmount']
    });

    const currentMonthRevenue = currentMonthInvoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.totalAmount || 0);
    }, 0);

    // Get last month data
    const lastMonthInvoices = await InvoiceModel.findAll({
      where: {
        ...whereClause,
        invoiceDate: {
          [Op.gte]: lastMonth,
          [Op.lt]: currentMonth
        }
      },
      attributes: ['totalAmount']
    });

    const lastMonthRevenue = lastMonthInvoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.totalAmount || 0);
    }, 0);

    // Calculate percentage increase
    const revenueIncreasePercentage = lastMonthRevenue > 0 
      ? ((currentMonthRevenue - lastMonthRevenue) / lastMonthRevenue * 100).toFixed(1)
      : currentMonthRevenue > 0 ? 100 : 0;

    return {
      totalInvoices,
      totalUsers,
      totalRevenue: parseFloat(totalRevenue.toFixed(2)),
      successRate: parseFloat(successRate),
      pendingInvoices,
      submittedInvoices: submittedInvoicesCount,
      invalidInvoices,
      validInvoices,
      revenueIncreasePercentage: parseFloat(revenueIncreasePercentage),
      currentMonthRevenue: parseFloat(currentMonthRevenue.toFixed(2)),
      lastMonthRevenue: parseFloat(lastMonthRevenue.toFixed(2))
    };

  } catch (error) {
    console.error('Dashboard stats error:', error);
    throw new Error('Failed to retrieve dashboard statistics');
  }
}

export async function getReportsAnalyticsService(req) {
  const { Invoice: InvoiceModel, InvoiceItem: InvoiceItemModel } = getInvoiceModelsFromUser(req.user);
  const sellerId = req.user.sellerId;
  const userRole = req.user.roleName;

  // Base where clause - filter by seller if user is a seller and only submitted invoices
  const whereClause = userRole === 'Seller' ? { sellerId, status: 'submitted' } : { status: 'submitted' };

  try {
    // Get total number of invoices
    const totalInvoices = await InvoiceModel.count({
      where: whereClause
    });

    // Get total revenue from submitted invoices
    const submittedInvoices = await InvoiceModel.findAll({
      where: whereClause,
      attributes: ['totalAmount']
    });

    const totalRevenue = submittedInvoices.reduce((sum, invoice) => {
      return sum + parseFloat(invoice.totalAmount || 0);
    }, 0);

    // Get FBR success rate (only for submitted invoices)
    const submittedInvoicesCount = await InvoiceModel.count({
      where: whereClause
    });

    // For FBR success rate calculation, we need to include invalid invoices too
    const invalidInvoices = await InvoiceModel.count({
      where: userRole === 'Seller' ? 
        { sellerId, status: 'invalid' } : 
        { status: 'invalid' }
    });

    const totalProcessedInvoices = submittedInvoicesCount + invalidInvoices;
    const fbrSuccessRate = totalProcessedInvoices > 0 
      ? ((submittedInvoicesCount / totalProcessedInvoices) * 100).toFixed(1)
      : 0;

    // Get active sellers (only for admin)
    let activeSellers = 0;
    let newSellersThisMonth = 0;
    
    if (userRole === 'Admin') {
      const { Seller } = await import('../user/model.seller.js');
      
      // Get total active sellers
      activeSellers = await Seller.count({
        where: { isActive: true }
      });

      // Get new sellers this month
      const currentDate = new Date();
      const startOfMonth = new Date(currentDate.getFullYear(), currentDate.getMonth(), 1);
      
      newSellersThisMonth = await Seller.count({
        where: {
          isActive: true,
          createdAt: {
            [Op.gte]: startOfMonth
          }
        }
      });
    }

    // Get monthly invoice volume for last 6 months based on invoice date
    const monthlyData = [];
    const currentDate = new Date();
    
    for (let i = 5; i >= 0; i--) {
      const monthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i, 1);
      const nextMonthDate = new Date(currentDate.getFullYear(), currentDate.getMonth() - i + 1, 1);
      
      // Get submitted invoices for this month based on invoice date
      const monthInvoices = await InvoiceModel.findAll({
        where: {
          ...whereClause,
          invoiceDate: {
            [Op.gte]: monthDate,
            [Op.lt]: nextMonthDate
          }
        },
        attributes: ['id', 'totalAmount', 'invoiceDate', 'invoiceRefNo'],
        order: [['invoiceDate', 'ASC']]
      });

      const monthInvoiceCount = monthInvoices.length;
      const monthRevenue = monthInvoices.reduce((sum, invoice) => {
        return sum + parseFloat(invoice.totalAmount || 0);
      }, 0);

      // Get additional month statistics
      const monthYear = monthDate.getFullYear();
      const monthName = monthDate.toLocaleDateString('en-US', { month: 'short' });
      
      monthlyData.push({
        month: monthName,
        year: monthYear,
        monthYear: `${monthName} ${monthYear}`,
        invoices: monthInvoiceCount,
        revenue: parseFloat(monthRevenue.toFixed(0)),
        averageInvoiceValue: monthInvoiceCount > 0 ? parseFloat((monthRevenue / monthInvoiceCount).toFixed(2)) : 0,
        invoiceDetails: monthInvoices.map(invoice => ({
          id: invoice.id,
          invoiceRefNo: invoice.invoiceRefNo,
          totalAmount: parseFloat(invoice.totalAmount || 0),
          invoiceDate: invoice.invoiceDate
        }))
      });
    }

    // Get top performing data based on user role
    let topPerformers = [];
    
    if (userRole === 'Admin') {
      // Get top performing sellers
      const { Seller } = await import('../user/model.seller.js');
      
      const topSellers = await Seller.findAll({
        where: { isActive: true },
        include: [{
          model: InvoiceModel,
          as: 'invoices',
          attributes: ['id', 'totalAmount', 'status'],
          required: false
        }],
        limit: 5
      });

      topPerformers = topSellers.map(seller => {
        const sellerInvoices = seller.invoices || [];
        const totalInvoices = sellerInvoices.length;
        const totalRevenue = sellerInvoices.reduce((sum, inv) => sum + parseFloat(inv.totalAmount || 0), 0);
        const successfulInvoices = sellerInvoices.filter(inv => inv.status === 'submitted').length;
        const successRate = totalInvoices > 0 ? Math.round((successfulInvoices / totalInvoices) * 100) : 0;

        return {
          name: seller.businessName,
          invoices: totalInvoices,
          revenue: parseFloat(totalRevenue.toFixed(0)),
          successRate: successRate
        };
      }).sort((a, b) => b.invoices - a.invoices);

    } else {
      // Get top performing products for seller
      const topProducts = await InvoiceItemModel.findAll({
        where: {
          '$invoice.sellerId$': sellerId
        },
        include: [{
          model: InvoiceModel,
          as: 'invoice',
          attributes: ['id', 'status'],
          where: whereClause
        }],
        attributes: [
          'productDescription',
          [fn('COUNT', fn('DISTINCT', col(`${InvoiceItemModel.name}.id`))), 'totalQuantity'],
          [fn('SUM', col(`${InvoiceItemModel.name}.totalValues`)), 'totalRevenue']
        ],
        group: [`${InvoiceItemModel.name}.productDescription`],
        order: [[fn('COUNT', fn('DISTINCT', col(`${InvoiceItemModel.name}.id`))), 'DESC']],
        limit: 5
      });

      topPerformers = topProducts.map(product => ({
        name: product.productDescription,
        quantity: parseInt(product.dataValues.totalQuantity),
        revenue: parseFloat(parseFloat(product.dataValues.totalRevenue || 0).toFixed(0))
      }));
    }

    // Calculate trends (comparing current month with previous month)
    const currentMonth = monthlyData[monthlyData.length - 1];
    const previousMonth = monthlyData[monthlyData.length - 2];
    
    const invoiceTrend = previousMonth ? 
      ((currentMonth.invoices - previousMonth.invoices) / previousMonth.invoices * 100).toFixed(0) : 0;
    
    const revenueTrend = previousMonth ? 
      ((currentMonth.revenue - previousMonth.revenue) / previousMonth.revenue * 100).toFixed(0) : 0;

    return {
      // Key Performance Indicators
      totalInvoices: {
        value: totalInvoices,
        trend: `${invoiceTrend > 0 ? '+' : ''}${invoiceTrend}% from last month`
      },
      totalRevenue: {
        value: parseFloat(totalRevenue.toFixed(0)),
        trend: `${revenueTrend > 0 ? '+' : ''}${revenueTrend}% from last month`
      },
      fbrSuccessRate: {
        value: parseFloat(fbrSuccessRate),
        detail: `${submittedInvoicesCount} of ${totalProcessedInvoices} successful`
      },
      activeSellers: userRole === 'Admin' ? {
        value: activeSellers,
        detail: `+${newSellersThisMonth} new this month`
      } : null,

      // Detailed Trends
      monthlyInvoiceVolume: {
        subtitle: "Invoice count and revenue trends over the last 6 months (based on invoice date)",
        data: monthlyData
      },
      
      topPerformers: {
        subtitle: userRole === 'Admin' ? 
          "Sellers with highest invoice volume and revenue" : 
          "Products with highest sales volume and revenue",
        data: topPerformers
      }
    };

  } catch (error) {
    console.error('Reports analytics error:', error);
    throw new Error('Failed to retrieve reports and analytics data');
  }
}