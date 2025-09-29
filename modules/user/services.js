import { hashPassword } from '../../lib/security/hash.js';
import { ROLE } from '../../lib/auth/guards.js';
import { User } from './model.js';
import { Seller } from './model.seller.js';
import { v4 as uuidv4 } from 'uuid';

async function createSeller({ email, name, password }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('Email already used');
  const sellerId = uuidv4().replace(/-/g, '').slice(0, 32);
  await Seller.create({ id: sellerId, name });
  const userId = uuidv4().replace(/-/g, '').slice(0, 32);
  await User.create({ id: userId, email, name, role: ROLE.SELLER, permissions: ['dashboard:view','invoices:view','reports:view','settings:view'], passwordHash: await hashPassword(password), sellerId });
  return { id: userId, sellerId };
}

async function createSellerUser({ sellerId, email, name, password, permissions = [] }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('Email already used');
  const userId = uuidv4().replace(/-/g, '').slice(0, 32);
  await User.create({ id: userId, email, name, role: ROLE.SELLER_USER, permissions, passwordHash: await hashPassword(password), sellerId });
  return { id: userId };
}

export { createSeller, createSellerUser };


