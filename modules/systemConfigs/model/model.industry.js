import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/db/sequelize.js';

export class Industry extends Model {}

Industry.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    industryName: {
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
  { sequelize, modelName: 'Industry', tableName: 'Industry' }
);
