import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class RolePermission extends Model {}

RolePermission.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    role: {
      type: DataTypes.ENUM('admin', 'seller', 'seller_user'),
      allowNull: false,
    },
    permissionKey: {
      type: DataTypes.STRING(64),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'RolePermission', tableName: 'role_permissions' }
);


