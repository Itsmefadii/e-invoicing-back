import './user/model.js';
import './user/model.seller.js';
import './invoice/model.js';
import './invoice/model.invoiceItem.js';
import './permission/model.role.js';
import './systemConfigs/model/model.businessNature.js';
import './systemConfigs/model/model.industry.js';
import './systemConfigs/model/model.state.js';
import { User } from './user/model.js';
import { Seller } from './user/model.seller.js';
import { Invoice } from './invoice/model.js';
import { InvoiceItem } from './invoice/model.invoiceItem.js';
import { Role } from './permission/model.role.js';
import { Permission } from './permission/model.permission.js';
import { RolePermission } from './permission/model.rolePermission.js';
import { BusinessNature } from './systemConfigs/model/model.businessNature.js';
import { Industry } from './systemConfigs/model/model.industry.js';
import { State } from './systemConfigs/model/model.state.js';

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

// System Config associations with Seller
BusinessNature.hasMany(Seller, { foreignKey: 'businessNatureId', as: 'sellers' });
Seller.belongsTo(BusinessNature, { foreignKey: 'businessNatureId', as: 'businessNature' });

Industry.hasMany(Seller, { foreignKey: 'industryId', as: 'sellers' });
Seller.belongsTo(Industry, { foreignKey: 'industryId', as: 'industry' });

State.hasMany(Seller, { foreignKey: 'stateId', as: 'sellers' });
Seller.belongsTo(State, { foreignKey: 'stateId', as: 'state' });

// Invoice associations
Invoice.hasMany(InvoiceItem, { foreignKey: 'invoiceId', as: 'items' });
InvoiceItem.belongsTo(Invoice, { foreignKey: 'invoiceId', as: 'invoice' });

export { User, Seller, Invoice, InvoiceItem, Role, BusinessNature, Industry, State };

// No hard foreign keys between RolePermission and Permission to keep it simple
export { Permission, RolePermission };


