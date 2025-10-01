import {
  fetchAllBusinessNatures,
  fetchBusinessNatureById,
  createBusinessNatureHandler,
  updateBusinessNatureHandler,
  deleteBusinessNatureHandler,
  fetchAllIndustries,
  fetchIndustryById,
  createIndustryHandler,
  updateIndustryHandler,
  deleteIndustryHandler,
  fetchAllStates,
  fetchStateById,
  createStateHandler,
  updateStateHandler,
  deleteStateHandler
} from './controller.js';

export async function systemConfigsRoutes(fastify, options) {
  // Business Natures routes
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

  // Industries routes
  fastify.route({
    method: ["POST", "GET", "PUT", "DELETE"],
    url: "/industries/:id?",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        if (req.params.id) {
          fetchIndustryById(req, reply);
        } else {
          fetchAllIndustries(req, reply);
        }
      }
      if (req.method == "POST") {
        createIndustryHandler(req, reply);
      }
      if (req.method == "PUT") {
        updateIndustryHandler(req, reply);
      }
      if (req.method == "DELETE") {
        deleteIndustryHandler(req, reply);
      }
    },
  });

  // State routes
  fastify.route({
    method: ["POST", "GET", "PUT", "DELETE"],
    url: "/states/:id?",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        if (req.params.id) {
          fetchStateById(req, reply);
        } else {
          fetchAllStates(req, reply);
        }
      }
      if (req.method == "POST") {
        createStateHandler(req, reply);
      }
      if (req.method == "PUT") {
        updateStateHandler(req, reply);
      }
      if (req.method == "DELETE") {
        deleteStateHandler(req, reply);
      }
    },
  });
}

