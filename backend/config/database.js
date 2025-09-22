const { Sequelize } = require('sequelize');

const DB_NAME = process.env.DB_NAME || process.env.POSTGRES_DB || 'amgalan';
const DB_USER = process.env.DB_USER || process.env.POSTGRES_USER || 'postgres';
const DB_PASS = process.env.DB_PASSWORD || process.env.POSTGRES_PASSWORD || 'postgres';
const DB_HOST = process.env.DB_HOST || 'localhost';
const DB_PORT = process.env.DB_PORT || 5432;

const sequelize = new Sequelize(DB_NAME, DB_USER, DB_PASS, {
  host: DB_HOST,
  port: DB_PORT,
  dialect: 'postgres',
  logging: false
});

module.exports = sequelize;
