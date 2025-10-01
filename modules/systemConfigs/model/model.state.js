import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../../lib/db/sequelize.js';

export class State extends Model {}

State.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    state: {
      type: DataTypes.STRING,
    },
    stateCode: {
        type: DataTypes.STRING,
    }
  },
  { sequelize, modelName: 'State', tableName: 'State' }
);
