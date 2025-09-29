import { verifyJwt } from '../security/jwt.js';

export const ROLE = {
  ADMIN: 'admin',
  SELLER: 'seller',
  SELLER_USER: 'seller_user',
};

export function authenticate(request, reply, done) {
  const header = request.headers['authorization'] || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : null;
  if (!token) {
    reply.code(401).send({ message: 'Unauthorized' });
    return;
  }
  const decoded = verifyJwt(token);
  if (!decoded) {
    reply.code(401).send({ message: 'Invalid token' });
    return;
  }
  request.user = decoded;
  done();
}

export function requireRole(...allowedRoles) {
  return function (request, reply, done) {
    const user = request.user;
    if (!user || !allowedRoles.includes(user.role)) {
      reply.code(403).send({ message: 'Forbidden' });
      return;
    }
    done();
  };
}

export function requirePermissions(required) {
  return function (request, reply, done) {
    const user = request.user;
    const userPerms = Array.isArray(user?.permissions) ? user.permissions : [];
    const ok = required.every((p) => userPerms.includes(p));
    if (!ok) {
      reply.code(403).send({ message: 'Insufficient permissions' });
      return;
    }
    done();
  };
}


