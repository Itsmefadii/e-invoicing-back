import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Permission extends Model {}

Permission.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    key: { // e.g., dashboard, invoices
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    label: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    path: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    icon: {
      type: DataTypes.STRING(64),
      allowNull: true,
    },
    position: {
      type: DataTypes.INTEGER,
      allowNull: false,
      defaultValue: 0,
    },
    isRender: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
    },
  },
  { sequelize, modelName: 'Permission', tableName: 'permissions' }
);


