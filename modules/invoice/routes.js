import { listInvoicesHandler, getInvoiceByIdHandler } from './controller.js';

export default function invoiceRoutes(fastify, options, done) {
  fastify.get('/', listInvoicesHandler);
  fastify.get('/:id', getInvoiceByIdHandler);
  done();
}


