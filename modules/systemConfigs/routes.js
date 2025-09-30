import {
  fetchAllBusinessNatures,
  fetchBusinessNatureById,
  createBusinessNatureHandler,
  updateBusinessNatureHandler,
  deleteBusinessNatureHandler
} from './controller/controller.js';

export async function businessNatureRoutes(fastify, options) {
  fastify.route({
    method: ["POST", "GET", "PUT", "DELETE"],
    url: "/business-natures/:id?",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        if (req.params.id) {
          fetchBusinessNatureById(req, reply);
        } else {
          fetchAllBusinessNatures(req, reply);
        }
      }
      if (req.method == "POST") {
        createBusinessNatureHandler(req, reply);
      }
      if (req.method == "PUT") {
        updateBusinessNatureHandler(req, reply);
      }
      if (req.method == "DELETE") {
        deleteBusinessNatureHandler(req, reply);
      }
    },
  });
}
