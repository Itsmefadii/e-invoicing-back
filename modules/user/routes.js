import { authenticate, requireRole, ROLE } from '../../lib/auth/guards.js';
import { adminCreateSellerHandler, sellerCreateUserHandler } from './controller.js';

export default function userRoutes(fastify, options, done) {
  fastify.post('/admin/sellers', { preHandler: [authenticate, requireRole(ROLE.ADMIN)] }, adminCreateSellerHandler);
  fastify.post('/seller/users', { preHandler: [authenticate, requireRole(ROLE.SELLER)] }, sellerCreateUserHandler);
  done();
}


