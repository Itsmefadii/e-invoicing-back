import { Sequelize } from 'sequelize';

const DB_NAME = process.env.DB_NAME || 'e-invoicing';
const DB_USER = process.env.DB_USER || 'root';
const DB_PASS = process.env.DB_PASS || 'root';
const DB_HOST = process.env.DB_HOST || '127.0.0.1';
const DB_PORT = 3306;

export const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'mysql',
  logging: false,
});


