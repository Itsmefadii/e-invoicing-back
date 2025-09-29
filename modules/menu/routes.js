import { MENU_ITEMS } from './config.js';
import { sendSuccess, sendError } from '../../lib/utils/response.js';

export default function menuRoutes(fastify, options, done) {
  fastify.get('/', async (request, reply) => {
    try {
      const perms = Array.isArray(request.user?.permissions) ? request.user.permissions : [];
      const isAdmin = request.user?.role === 'admin' || perms.includes('*');
      const items = isAdmin
        ? MENU_ITEMS
        : MENU_ITEMS.filter((item) => perms.includes(item.permission));
      
      return sendSuccess(reply, { items }, 'Menu items retrieved successfully');
    } catch (error) {
      console.error('Menu error:', error);
      return sendError(reply, 'Failed to retrieve menu items. Please try again later.');
    }
  });
  done();
}


