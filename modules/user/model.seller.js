import { DataTypes, Model } from 'sequelize';
import { sequelize } from '../../lib/db/sequelize.js';

export class Seller extends Model {}

Seller.init(
  {
    id: {
      type: DataTypes.STRING(32),
      primaryKey: true,
    },
    sellerCode: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    businessName: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    ntnCnic: {
      type: DataTypes.STRING(191),
      allowNull: false,
    },
    businessNatureId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    industryId: {
      type: DataTypes.INTEGER,
      allowNull: false,
    },
    address1: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    address2: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    city: {
      type: DataTypes.STRING,
      allowNull: false,
    },
    state: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    postalCode: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    businessPhone: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    businessEmail: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    fbrSandBoxToken: {
      type: DataTypes.STRING  ,
      allowNull: false,
    },
    fbrProdToken: {
      type: DataTypes.STRING  ,
      allowNull: false,
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


