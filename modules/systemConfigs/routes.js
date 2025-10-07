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
  deleteStateHandler,
  fetchAllHsCodes,
  fetchHsCodeById,
  createHsCodeHandler,
  updateHsCodeHandler,
  deleteHsCodeHandler,
  populateHsCodesFromFBRHandler,
  fetchSaleTypeHandler,
  populateHsUomsFromFBRHandler,
  getAllHsUomsHandler,
  getHsUomsByHsCodeHandler
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

  // HS Codes routes
  fastify.route({
    method: ["POST", "GET", "PUT", "DELETE"],
    url: "/hs-codes/:id?",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        if (req.params.id) {
          fetchHsCodeById(req, reply);
        } else {
          fetchAllHsCodes(req, reply);
        }
      }
      if (req.method == "POST") {
        createHsCodeHandler(req, reply);
      }
      if (req.method == "PUT") {
        updateHsCodeHandler(req, reply);
      }
      if (req.method == "DELETE") {
        deleteHsCodeHandler(req, reply);
      }
    },
  });

  // FBR API population route
  fastify.route({
    method: "POST",
    url: "/hs-codes/populate-from-fbr",
    handler: (req, reply) => {
      console.log('Populating HS codes from FBR API');
      populateHsCodesFromFBRHandler(req, reply);
    },
  });

  fastify.route({
    method: ["POST", "GET"],
    url: "/sale-type",
    handler: (req, reply) => {
      if (req.method == "GET") {
      fetchSaleTypeHandler(req, reply);
      }
    },
  });

  // HsUom routes
  fastify.route({
    method: "POST",
    url: "/hs-uoms/populate-from-fbr",
    handler: (req, reply) => {
      console.log('Populating HsUoms from FBR API');
      populateHsUomsFromFBRHandler(req, reply);
    },
  });

  fastify.route({
    method: "GET",
    url: "/hs-uoms",
    handler: (req, reply) => {
      console.log('Fetching all HsUoms');
      getAllHsUomsHandler(req, reply);
    },
  });

  fastify.route({
    method: "GET",
    url: "/hs-uoms/:hsCode",
    handler: (req, reply) => {
      console.log('Fetching HsUoms by HS Code:', req.params.hsCode);
      getHsUomsByHsCodeHandler(req, reply);
    },
  });
}

