import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.STRING(32),
      allowNull: false,
    },
    buyerName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    status: {
      type: DataTypes.ENUM('draft', 'issued', 'paid', 'void'),
      defaultValue: 'draft',
    },
  },
  { sequelize, modelName: 'Invoice', tableName: 'invoices' }
);


