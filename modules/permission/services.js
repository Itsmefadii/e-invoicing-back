import { Permission } from './model.permission.js';
import { RolePermission } from './model.rolePermission.js';

export async function getPermissionsForRole(role) {
  const rolePerms = await RolePermission.findAll({ where: { role } });
  const keys = rolePerms.map((r) => r.permissionKey);
  if (!keys.length) return [];
  const perms = await Permission.findAll({ where: { key: keys }, order: [['position', 'ASC']] });
  return perms.map((p) => p.toJSON());
}


