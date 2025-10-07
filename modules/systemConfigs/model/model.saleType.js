import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/db/sequelize.js';

export class SaleType extends Model {}

SaleType.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    transactionTypeId: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    transactionDesc: {
        type: DataTypes.STRING,
        allowNull: false,
      },
    createdAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
    updatedAt: {
      type: DataTypes.DATE,
      allowNull: false,
      defaultValue: DataTypes.NOW,
    },
  },
  { sequelize, modelName: 'SaleType', tableName: 'SaleType' }
);
