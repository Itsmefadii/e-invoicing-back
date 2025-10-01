import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/db/sequelize.js';

export class BusinessNature extends Model {}

BusinessNature.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    businessNature: {
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
  { sequelize, modelName: 'BusinessNature', tableName: 'BusinessNature' }
);
