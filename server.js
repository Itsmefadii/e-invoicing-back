import fastifyFactory from 'fastify';
import cors from '@fastify/cors';
import { allRoutes } from './route.js';
import { sequelize } from './lib/db/sequelize.js';
import './modules/models.js';
import { hashPassword } from './lib/security/hash.js';
import { ROLE } from './lib/auth/guards.js';
import { User } from './modules/user/model.js';
import { verifyJwt } from './lib/security/jwt.js';
import { requireAuth } from './lib/auth/middleware.js';
import { pathToFileURL } from 'url';

export const buildServer = async () => {
  const fastify = fastifyFactory({ logger: true });
  
  // Register CORS plugin
  await fastify.register(cors, {
    origin: true, // Allow all origins in development
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With'],
    credentials: true, // Allow cookies and authorization headers
  });
  
  // Global authentication middleware: require token for all routes except login
  fastify.addHook('preHandler', requireAuth);
  
  fastify.register(allRoutes, { prefix: '/api/v1' });
  return fastify;
};

const start = async () => {
  const server = await buildServer();
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
    await sequelize.authenticate();
    // await sequelize.sync();
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


