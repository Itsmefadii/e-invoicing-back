import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/db/sequelize.js';

export class HsCode extends Model {}

HsCode.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    hsCode: {
      type: DataTypes.STRING,
    },
    description: {
        type: DataTypes.STRING,
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
  { sequelize, modelName: 'HsCode', tableName: 'HsCodes' }
);
