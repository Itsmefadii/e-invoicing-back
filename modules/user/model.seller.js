import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Seller extends Model {}

Seller.init(
  {
    id: {
      type: DataTypes.INTEGER,
      primaryKey: true,
      autoIncrement: true,
    },
    sellerCode: {
      type: DataTypes.STRING(191),
    },
    businessName: {
      type: DataTypes.STRING(191),
    },
    ntnCnic: {
      type: DataTypes.STRING(191),
    },
    businessNatureId: {
      type: DataTypes.INTEGER,
    },
    industryId: {
      type: DataTypes.INTEGER,
    },
    address1: {
      type: DataTypes.STRING,
    },
    address2: {
      type: DataTypes.STRING  ,
    },
    city: {
      type: DataTypes.STRING,
    },
    stateId: {
      type: DataTypes.STRING  ,
    },
    postalCode: {
      type: DataTypes.STRING  ,
    },
    businessPhone: {
      type: DataTypes.STRING  ,
    },
    businessEmail: {
      type: DataTypes.STRING  ,
    },
    fbrSandBoxToken: {
      type: DataTypes.STRING  ,
    },
    fbrProdToken: {
      type: DataTypes.STRING  ,
    },
    logoUrl: {
      type: DataTypes.STRING  ,
    },
    isActive: {
      type: DataTypes.BOOLEAN,
      allowNull: false,
      defaultValue: true,
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

  { sequelize, modelName: 'Seller', tableName: 'sellers' }
);


