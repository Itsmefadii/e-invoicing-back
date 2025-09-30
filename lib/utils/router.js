/**
 * Generic router utility for single endpoint with method-based routing
 * @param {Object} handlers - Object containing method handlers
 * @param {Object} options - Router options
 * @returns {Function} Fastify route handler
 */
export function createMethodRouter(handlers, options = {}) {
  return async (request, reply) => {
    const method = request.method;
    const handler = handlers[method];

    if (!handler) {
      return reply.code(405).send({ 
        success: false, 
        message: 'Method not allowed',
        allowedMethods: Object.keys(handlers)
      });
    }

    return handler(request, reply);
  };
}

/**
 * Create a Fastify route with method-based routing
 * @param {Object} config - Route configuration
 * @param {string|Array} config.method - HTTP methods
 * @param {string} config.url - Route URL
 * @param {Object} config.handlers - Method handlers
 * @param {Array} config.preHandler - Pre-handlers (middleware)
 * @param {Object} config.options - Additional options
 * @returns {Object} Fastify route configuration
 */
export function createRoute(config) {
  const { method, url, handlers, preHandler = [], options = {} } = config;
  
  return {
    method,
    url,
    preHandler,
    handler: createMethodRouter(handlers),
    ...options
  };
}

/**
 * Helper to create CRUD routes for a resource
 * @param {string} resourceName - Name of the resource
 * @param {Object} handlers - CRUD handlers
 * @param {Array} preHandler - Pre-handlers (middleware)
 * @returns {Object} Fastify route configuration
 */
export function createCRUDRoute(resourceName, handlers, preHandler = []) {
  return createRoute({
    method: ['GET', 'POST', 'PUT', 'DELETE'],
    url: `/${resourceName}/:id?`,
    handlers: {
      GET: handlers.GET || ((req, reply) => {
        const { id } = req.params;
        if (id) {
          return handlers.GET_BY_ID ? handlers.GET_BY_ID(req, reply) : reply.code(404).send({ success: false, message: 'Handler not implemented' });
        } else {
          return handlers.GET_ALL ? handlers.GET_ALL(req, reply) : reply.code(404).send({ success: false, message: 'Handler not implemented' });
        }
      }),
      POST: handlers.POST,
      PUT: handlers.PUT,
      DELETE: handlers.DELETE
    },
    preHandler
  });
}
