/**
 * Route aggregator exporting allRoutes in ESM style
 */
import invoiceRoutes from './modules/invoice/routes.js';
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import menuRoutes from './modules/menu/routes.js';

export function allRoutes(fastify, options, done) {
  fastify.register(invoiceRoutes, { prefix: '/invoice' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/users' });
  fastify.register(menuRoutes, { prefix: '/menu' });
  done();
}


