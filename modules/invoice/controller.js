import { listInvoicesService, getInvoiceByIdService } from './services.js';

export async function listInvoicesHandler(request, reply) {
  const items = await listInvoicesService();
  reply.send({ resource: 'invoice', items });
}

export async function getInvoiceByIdHandler(request, reply) {
  const { id } = request.params;
  const item = await getInvoiceByIdService(id);
  reply.send({ resource: 'invoice', id, item });
}



