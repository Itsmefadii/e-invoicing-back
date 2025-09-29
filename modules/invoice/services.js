import { Invoice } from './model.js';

export async function listInvoicesService() {
  const rows = await Invoice.findAll({ limit: 50, order: [['createdAt', 'DESC']] });
  return rows.map((r) => r.toJSON());
}

export async function getInvoiceByIdService(id) {
  const row = await Invoice.findByPk(id);
  return row ? row.toJSON() : null;
}


