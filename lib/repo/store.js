import { hashPassword } from '../security/hash.js';
import { ROLE } from '../auth/guards.js';

export const db = {
  users: [],
  sellers: [],
};

let seeded = false;

export async function seed() {
  if (seeded) return;
  // Create initial admin user
  const admin = {
    id: 'u_admin_1',
    ntn: 'admin-ntn',
    name: 'System Admin',
    role: ROLE.ADMIN,
    permissions: ['*'],
    passwordHash: await hashPassword('Admin@12345'),
    sellerId: null,
  };
  db.users.push(admin);
  seeded = true;
}

export function generateId(prefix) {
  return `${prefix}_${Math.random().toString(36).slice(2, 10)}`;
}


