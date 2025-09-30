import { MENU_ITEMS } from './config.js';
import { sendSuccess, sendError } from '../../lib/utils/response.js';

export default function menuRoutes(fastify, options, done) {
  fastify.route({
    method: ["GET"],
    url: "/",
    handler: (req, reply) => {
      console.log(req.method);
      
      if (req.method == "GET") {
        try {
          const perms = Array.isArray(req.user?.permissions) ? req.user.permissions : [];
          const isAdmin = req.user?.role === 'admin' || perms.includes('*');
          const items = isAdmin
            ? MENU_ITEMS
            : MENU_ITEMS.filter((item) => perms.includes(item.permission));
          
          return sendSuccess(reply, { items }, 'Menu items retrieved successfully');
        } catch (error) {
          console.error('Menu error:', error);
          return sendError(reply, 'Failed to retrieve menu items. Please try again later.');
        }
      }
    },
  });
  done();
}


