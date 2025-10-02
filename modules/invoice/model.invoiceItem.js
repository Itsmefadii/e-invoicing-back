import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class InvoiceItem extends Model {}

InvoiceItem.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    invoiceId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    // Item details fields
    hsCode: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    productDescription: {
      type: DataTypes.STRING(500),
      allowNull: false,
    },
    rate: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    uoM: {
      type: DataTypes.STRING(20),
      allowNull: false,
    },
    quantity: {
      type: DataTypes.DECIMAL(10, 2),
      allowNull: false,
    },
    totalValues: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    valueSalesExcludingST: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    fixedNotifiedValueOrRetailPrice: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
    },
    salesTaxApplicable: {
      type: DataTypes.DECIMAL(12, 2),
      defaultValue: 0.00
    },
    salesTaxWithheldAtSource: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
     extraTax: {
       type: DataTypes.DECIMAL(12, 2),
       allowNull: true,
       defaultValue: 0.00,
     },
    furtherTax: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    sroScheduleNo: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    fedPayable: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    discount: {
      type: DataTypes.DECIMAL(12, 2),
      allowNull: false,
      defaultValue: 0.00,
    },
    saleType: {
      type: DataTypes.STRING(50),
      allowNull: false,
    },
    sroItemSerialNo: {
      type: DataTypes.STRING(20),
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
  { sequelize, modelName: 'InvoiceItem', tableName: 'InvoiceItems' }
);
