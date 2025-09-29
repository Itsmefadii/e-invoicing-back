import './user/model.js';
import './user/model.seller.js';
import './invoice/model.js';
import './permission/model.role.js';
import { User } from './user/model.js';
import { Seller } from './user/model.seller.js';
import { Invoice } from './invoice/model.js';
import { Role } from './permission/model.role.js';
import { Permission } from './permission/model.permission.js';
import { RolePermission } from './permission/model.rolePermission.js';

// Associations
Seller.hasMany(User, { foreignKey: 'sellerId', as: 'users' });
User.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

Seller.hasMany(Invoice, { foreignKey: 'sellerId', as: 'invoices' });
Invoice.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

// Role associations
Role.hasMany(User, { foreignKey: 'roleId', as: 'users' });
User.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Role.hasMany(RolePermission, { foreignKey: 'roleId', as: 'rolePermissions' });
RolePermission.belongsTo(Role, { foreignKey: 'roleId', as: 'role' });

Permission.hasMany(RolePermission, { foreignKey: 'permissionId', as: 'rolePermissions' });
RolePermission.belongsTo(Permission, { foreignKey: 'permissionId', as: 'permission' });

export { User, Seller, Invoice, Role };

// No hard foreign keys between RolePermission and Permission to keep it simple
export { Permission, RolePermission };


