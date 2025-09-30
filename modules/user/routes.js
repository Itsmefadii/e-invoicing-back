import { authenticate, requireRole, ROLE } from '../../lib/auth/guards.js';
import { adminCreateSellerHandler, sellerCreateUserHandler } from './controller.js';

export default function userRoutes(fastify, options, done) {
  // Admin sellers endpoint
  fastify.route({
    method: ["POST"],
    url: "/admin/sellers",
    preHandler: [authenticate, requireRole(ROLE.ADMIN)],
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "POST") {
        adminCreateSellerHandler(req, reply);
      }
    },
  });

  // Seller users endpoint
  fastify.route({
    method: ["POST"],
    url: "/seller/users",
    preHandler: [authenticate, requireRole(ROLE.SELLER)],
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "POST") {
        sellerCreateUserHandler(req, reply);
      }
    },
  });

  done();
}


