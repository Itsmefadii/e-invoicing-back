import { MENU_ITEMS } from './config.js';

export default function menuRoutes(fastify, options, done) {
  fastify.get('/', async (request, reply) => {
    const perms = Array.isArray(request.user?.permissions) ? request.user.permissions : [];
    const isAdmin = request.user?.role === 'admin' || perms.includes('*');
    const items = isAdmin
      ? MENU_ITEMS
      : MENU_ITEMS.filter((item) => perms.includes(item.permission));
    reply.send({ items });
  });
  done();
}


