import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class RolePermission extends Model {}

RolePermission.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER
    },
    permissionId: {
      type: DataTypes.STRING(64),
    },
  },
  { sequelize, modelName: 'RolePermission', tableName: 'role_permissions' }
);


