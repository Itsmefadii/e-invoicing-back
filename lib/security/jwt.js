import jwt from 'jsonwebtoken';

const DEFAULT_EXPIRES_IN = '1d';
const JWT_SECRET = process.env.JWT_SECRET || 'dev-secret-change-me';

export function signJwt(payload, options = {}) {
  const { expiresIn = DEFAULT_EXPIRES_IN } = options;
  return jwt.sign(payload, JWT_SECRET, { expiresIn });
}

export function verifyJwt(token) {
  try {
    return jwt.verify(token, JWT_SECRET);
  } catch (e) {
    return null;
  }
}



