import { loginHandler } from './controller.js';

export default function authRoutes(fastify, options, done) {
  fastify.post('/login', loginHandler);
  done();
}


