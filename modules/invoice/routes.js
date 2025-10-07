import { listInvoicesHandler, getInvoiceByIdHandler, postInvoiceHandler, createInvoiceHandler, updateInvoiceHandler, deleteInvoiceHandler, getDashboardStatsHandler, getReportsAnalyticsHandler } from './controller.js';

export default function invoiceRoutes(fastify, options, done) {
  fastify.route({
    method: ["GET", "POST", "DELETE"],
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
      if (req.method == "POST") {
        console.log('create invoice');
        createInvoiceHandler(req, reply);
      }
      if (req.method == "DELETE") {
        deleteInvoiceHandler(req, reply);
      }
      // if (req.method == "PUT") {
      //   updateInvoiceHandler(req, reply);
      // }
    },
  });

  fastify.route({
    method: ["POST"],
    url: "/post-invoice",
    handler: (req, reply) => {
      console.log(req.method);
      if (req.method == "POST") {
          postInvoiceHandler(req, reply);
      }
    },
  });

  fastify.route({
    method: ["PUT"],
    url: "/:id",
    handler: (req, reply) => {
      console.log(req.method);
      if (req.method == "PUT") {
          updateInvoiceHandler(req, reply);
      }
    },
  });

  fastify.route({
    method: ["GET"],
    url: "/dashboard/stats",
    handler: (req, reply) => {
      console.log(req.method);
      if (req.method == "GET") {
          getDashboardStatsHandler(req, reply);
      }
    },
  });

  fastify.route({
    method: ["GET"],
    url: "/reports",
    handler: (req, reply) => {
      console.log(req.method);
      if (req.method == "GET") {
          getReportsAnalyticsHandler(req, reply);
      }
    },
  });

  done();
}


