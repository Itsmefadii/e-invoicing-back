import { verifyPassword } from '../../lib/security/hash.js';
import { signJwt } from '../../lib/security/jwt.js';
import { User } from '../user/model.js';
import { getPermissionsForRole } from '../permission/services.js';

export async function login({ ntn, password }) {
  const user = await User.findOne({ where: { ntn } });
  if (!user) return null;
  const valid = await verifyPassword(password, user.passwordHash);
  if (!valid) return null;
  const token = signJwt({
    sub: user.id,
    ntn: user.ntn,
    role: user.role,
    sellerId: user.sellerId || null,
    permissions: user.permissions || [],
  });
  // Fetch server-driven permissions for menu from DB
  const menuPermissions = await getPermissionsForRole(user.role);
  return {
    token,
    user: {
      id: user.id,
      ntn: user.ntn,
      role: user.role,
      sellerId: user.sellerId || null,
      permissions: user.permissions || [],
      menu: menuPermissions,
    },
  };
}


