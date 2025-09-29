import './user/model.js';
import './user/model.seller.js';
import './invoice/model.js';
import { User } from './user/model.js';
import { Seller } from './user/model.seller.js';
import { Invoice } from './invoice/model.js';
import { Permission } from './permission/model.permission.js';
import { RolePermission } from './permission/model.rolePermission.js';

// Associations
Seller.hasMany(User, { foreignKey: 'sellerId', as: 'users' });
User.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

Seller.hasMany(Invoice, { foreignKey: 'sellerId', as: 'invoices' });
Invoice.belongsTo(Seller, { foreignKey: 'sellerId', as: 'seller' });

export { User, Seller, Invoice };

// No hard foreign keys between RolePermission and Permission to keep it simple
export { Permission, RolePermission };


