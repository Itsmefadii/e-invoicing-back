import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class User extends Model {}

User.init(
  {
    id: {
      type: DataTypes.STRING,
      primaryKey: true,
    },
    roleId: {
      type: DataTypes.INTEGER,
      unique: true,
      allowNull: false,
    },
    email: {
      type: DataTypes.STRING,
      allowNull: true,
      unique: true,
    },
    firstName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    lastName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    sellerId: {
      type: DataTypes.INTEGER,
    },
    userTypeId: {
      type: DataTypes.INTEGER,
    },
    passwordHash: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'User', tableName: 'users' }
);


