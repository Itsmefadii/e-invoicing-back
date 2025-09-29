import bcrypt from 'bcryptjs';

const DEFAULT_ROUNDS = 10;

export async function hashPassword(plain, rounds = DEFAULT_ROUNDS) {
  return await bcrypt.hash(plain, rounds);
}

export async function verifyPassword(plain, hashed) {
  return await bcrypt.compare(plain, hashed);
}



