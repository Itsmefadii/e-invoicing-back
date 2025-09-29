 import { login } from './services.js';
 
 export async function loginHandler(request, reply) {
   const { ntn, password } = request.body || {};
   const result = await login({ ntn, password });
   if (!result) {
     reply.code(401).send({ message: 'Invalid credentials' });
     return;
   }
   reply.send(result);
 }
 
