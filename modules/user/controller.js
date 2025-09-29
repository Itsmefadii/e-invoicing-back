import { createSeller, createSellerUser } from './services.js';
import { ROLE } from '../../lib/auth/guards.js';

export async function adminCreateSellerHandler(request, reply) {
  const { email, name, password } = request.body || {};
  try {
    const result = await createSeller({ email, name, password });
    reply.code(201).send(result);
  } catch (e) {
    reply.code(400).send({ message: e.message });
  }
}

export async function sellerCreateUserHandler(request, reply) {
  const sellerId = request.user.sellerId;
  const { email, name, password, permissions } = request.body || {};
  try {
    const result = await createSellerUser({ sellerId, email, name, password, permissions });
    reply.code(201).send(result);
  } catch (e) {
    reply.code(400).send({ message: e.message });
  }
}



