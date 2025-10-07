import { hashPassword } from '../../lib/security/hash.js';
import { ROLE } from '../../lib/auth/guards.js';
import { User } from './model.js';
import { Seller } from './model.seller.js';
import { v4 as uuidv4 } from 'uuid';
import { Op } from 'sequelize';
import bcrypt from 'bcryptjs/dist/bcrypt.js';

async function createSeller({ email, firstName, lastName, password }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('Email already used');
  const sellerId = uuidv4().replace(/-/g, '').slice(0, 32);
  await Seller.create({ id: sellerId, name: `${firstName} ${lastName}` });
  const userId = uuidv4().replace(/-/g, '').slice(0, 32);
  await User.create({ id: userId, email, firstName, lastName, roleId: ROLE.SELLER, passwordHash: await hashPassword(password), sellerId });
  return { id: userId, sellerId };
}

async function createSellerUser({ sellerId, email, firstName, lastName, password }) {
  const exists = await User.findOne({ where: { email } });
  if (exists) throw new Error('Email already used');
  const userId = uuidv4().replace(/-/g, '').slice(0, 32);
  await User.create({ id: userId, email, firstName, lastName, roleId: ROLE.SELLER_USER, passwordHash: await hashPassword(password), sellerId });
  return { id: userId };
}

async function changePassword(request, sellerId, oldPassword, newPassword) {

  const userId = request.user.id;
  const user = await User.findOne({ where: { [Op.and]: [{ sellerId }, { id: userId }] } });
  if (!user) throw new Error('User not found');
  const valid = await verifyPassword(oldPassword, user.passwordHash);
  if (!valid) throw new Error('Old Password is incorrect');
  await user.update({ passwordHash: await hashPassword(newPassword) });
  return { id: user.id };
}

async function verifyPassword(oldPassword, passwordHash) {
  return await bcrypt.compare(oldPassword, passwordHash);
}

export { createSeller, createSellerUser, changePassword };


