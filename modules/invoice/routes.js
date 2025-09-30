import { listInvoicesHandler, getInvoiceByIdHandler } from './controller.js';

export default function invoiceRoutes(fastify, options, done) {
  fastify.route({
    method: ["GET"],
    url: "/:id?",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        if (req.params.id) {
          getInvoiceByIdHandler(req, reply);
        } else {
          listInvoicesHandler(req, reply);
        }
      }
    },
  });
  done();
}


