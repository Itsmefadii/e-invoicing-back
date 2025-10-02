import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Invoice extends Model {}

Invoice.init(
  {
    id: {
      type: DataTypes.INTEGER,
      autoIncrement: true,
      primaryKey: true,
    },
    sellerId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Master data fields
    invoiceType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    invoiceDate: {
      type: DataTypes.DATE,
      allowNull: false,
    },
    buyerNTNCNIC: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    buyerBusinessName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    buyerProvince: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    buyerAddress: {
      type: DataTypes.TEXT,
      allowNull: false,
    },
    buyerRegistrationType: {
      type: DataTypes.ENUM('REGISTERED', 'UNREGISTERED'),
      allowNull: false,
    },
    invoiceRefNo: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    scenarioId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Calculated fields
    totalAmount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    status: {
      type: DataTypes.ENUM('pending', 'valid', 'submitted', 'invalid'),
      defaultValue: 'pending',
    },
    fbrInvoiceNumber:{
      type: DataTypes.STRING(200),
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
  { sequelize, modelName: 'Invoice', tableName: 'invoices' }
);


