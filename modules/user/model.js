import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    ntn: {
      type: DataTypes.STRING(64),
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING(191),
      allowNull: true,
      unique: true,
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    role: {
      type: DataTypes.ENUM('admin', 'seller', 'seller_user'),
      allowNull: false,
    },
    permissions: {
      type: DataTypes.JSON,
      allowNull: false,
      defaultValue: [],
    },
    passwordHash: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'User', tableName: 'users' }
);


