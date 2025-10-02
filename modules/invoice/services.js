import { Invoice } from './model.js';
import { InvoiceItem } from './model.invoiceItem.js';
import { Seller } from '../user/model.seller.js';
import { BusinessNature } from '../systemConfigs/model/model.businessNature.js';
import { Industry } from '../systemConfigs/model/model.industry.js';

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

  if(req.user.roleName === 'Seller'){
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


