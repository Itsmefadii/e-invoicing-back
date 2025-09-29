import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Seller extends Model {}

Seller.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    name: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
  },
  { sequelize, modelName: 'Seller', tableName: 'sellers' }
);


