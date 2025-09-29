import fastifyFactory from 'fastify';
import { allRoutes } from './route.js';
import { sequelize } from './lib/db/sequelize.js';
import './modules/models.js';
import { hashPassword } from './lib/security/hash.js';
import { ROLE } from './lib/auth/guards.js';
import { User } from './modules/user/model.js';
import { verifyJwt } from './lib/security/jwt.js';
import { pathToFileURL } from 'url';

export const buildServer = () => {
  const fastify = fastifyFactory({ logger: true });
  // Global middleware: attach user info if Authorization Bearer token is present
  fastify.addHook('preHandler', (request, reply, done) => {
    const header = request.headers['authorization'] || '';
    const token = header.startsWith('Bearer ') ? header.slice(7) : null;
    if (token) {
      const decoded = verifyJwt(token);
      if (decoded) request.user = decoded;
    }
    done();
  });
  fastify.register(allRoutes, { prefix: '/api' });
  return fastify;
};

const start = async () => {
  const server = buildServer();
  const port = parseInt(process.env.PORT, 10) || 3001;
  const host = process.env.HOST || '0.0.0.0';

  const closeWithGrace = async (signal) => {
    server.log.info({ signal }, 'shutting down');
    try {
      await server.close();
      process.exit(0);
    } catch (err) {
      server.log.error(err, 'error during shutdown');
      process.exit(1);
    }
  };

  process.on('SIGINT', closeWithGrace);
  process.on('SIGTERM', closeWithGrace);

  try {
    // DB connection disabled:
    await sequelize.authenticate();
    await sequelize.sync();
    const adminExists = await User.findOne({ where: { ntn: 'admin-ntn' } });
    if (!adminExists) {
      await User.create({
        id: 'u_admin_1',
        ntn: 'admin-ntn',
        email: null,
        name: 'System Admin',
        role: ROLE.ADMIN,
        permissions: ['*'],
        passwordHash: await hashPassword('Admin@12345'),
        sellerId: null,
      });
    }
    await server.listen({ port, host });
    server.log.info(`server listening on http://${host}:${port}`);
  } catch (err) {
    server.log.error(err);
    process.exit(1);
  }
};

if (import.meta.url === pathToFileURL(process.argv[1]).href) {
  start();
}


