/**
 * Route aggregator exporting allRoutes in ESM style
 */
import invoiceRoutes from './modules/invoice/routes.js';
import { excelUploadRoutes } from './modules/invoice/routes.excelUpload.js';
import authRoutes from './modules/auth/routes.js';
import userRoutes from './modules/user/routes.js';
import menuRoutes from './modules/menu/routes.js';
import { systemConfigsRoutes } from './modules/systemConfigs/routes.js';
import { sellersRoutes } from './modules/sellers/routes.js';
import emailRoutes from './modules/email/routes.js';

export function allRoutes(fastify, options, done) {
  fastify.register(invoiceRoutes, { prefix: '/invoice' });
  fastify.register(excelUploadRoutes, { prefix: '/invoice' });
  fastify.register(authRoutes, { prefix: '/auth' });
  fastify.register(userRoutes, { prefix: '/users' });
  fastify.register(menuRoutes, { prefix: '/menu' });
  fastify.register(systemConfigsRoutes, { prefix: '/system-configs' });
  fastify.register(sellersRoutes, { prefix: '/sellers' });
  fastify.register(emailRoutes, { prefix: '/email' });
  done();
}


