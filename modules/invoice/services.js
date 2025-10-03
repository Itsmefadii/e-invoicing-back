import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { Seller } from '../user/model.seller.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { Industry } from '../systemConfigs/model/model.industry.js';
import { State } from '../systemConfigs/model/model.state.js';
import { Op } from 'sequelize';
import axios from 'axios';

export async function listInvoicesService(req) {

  console.log(req.user);
  const include = [{
    model: InvoiceItem,
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
  }]

  let rows = await Invoice.findAll({
    include: include,
  });

  if (req.user.roleName === 'Seller') {
    rows = await Invoice.findAll({
      where: {
        sellerId: req.user.sellerId
      },
      include: include
    });
  }


  return rows.map((r) => r.toJSON());
}

export async function getInvoiceByIdService(id) {

  const include = [{
    model: InvoiceItem,
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

  const row = await Invoice.findOne({
    where: {
      id: id
    },
    include: include
  });
  return row ? row.toJSON() : null;
}


export async function postInvoiceService(request, invoiceIds) {

  const sellerId = request.user.sellerId;

  const include = [{
    model: InvoiceItem,
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

  const row = await Invoice.findAll({
    where: {
      id: { [Op.in]: invoiceIds }
    },
    include: include
  });

  const findToken = await Seller.findOne({
    where: {
      id: sellerId
    },
    attributes: ['fbrSandBoxToken']
  })

  const token = findToken.fbrSandBoxToken;

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
      const submitInvoice = await fbrSubmitInvoice(prepareData, token)
      
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

        await Invoice.update({
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
              
              await InvoiceItem.update({
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
        
        await Invoice.update({
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
      data.push({
        invoiceId: row[i].id,
        fbrResponse: parsedResponse
      });

    } catch (error) {
      console.error(`Error processing invoice ${row[i].id}:`, error);
      
      // Update invoice with error status
      await Invoice.update({
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

async function fbrSubmitInvoice(invoice, token) {
  console.log("Token", token);

  console.log("Invoice: ", invoice)

  const response = await axios.post(`${process.env.FBR_API_URL}/postinvoicedata`, invoice,
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

