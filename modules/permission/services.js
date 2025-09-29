import { Permission } from './model.permission.js';
import { RolePermission } from './model.rolePermission.js';

export async function getPermissionsForRole(roleId) {
  try {
    // Validate roleId
    if (!roleId || (typeof roleId !== 'number' && typeof roleId !== 'string')) {
      throw new Error('Valid roleId is required');
    }

    // Find role permissions
    const rolePerms = await RolePermission.findAll({ where: { roleId } });
    
    if (!rolePerms || rolePerms.length === 0) {
      return [];
    }

    const permissionIds = rolePerms.map((r) => r.permissionId);
    
    // Find permissions
    const perms = await Permission.findAll({ 
      where: { id: permissionIds }, 
      order: [['position', 'ASC']] 
    });
    
    return perms.map((p) => p.toJSON());
    
  } catch (error) {
    console.error('Error fetching permissions for role:', error);
    // Return empty array for permissions to avoid breaking login
    return [];
  }
}


