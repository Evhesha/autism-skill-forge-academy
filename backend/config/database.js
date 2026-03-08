require('dotenv').config();
const { Sequelize } = require('sequelize');
const pg = require('pg');

const databaseUrl = process.env.DATABASE_URL;
const isProduction = process.env.NODE_ENV === 'production';

const commonOptions = {
  dialect: 'postgres',
  // Force including pg in serverless bundles (Vercel) instead of relying on dynamic require.
  dialectModule: pg,
  logging: process.env.NODE_ENV === 'development' ? console.log : false,
  define: {
    underscored: true,
  },
};

const sslOptions = isProduction
  ? {
      ssl: {
        require: true,
        rejectUnauthorized: false,
      },
    }
  : undefined;

const sequelize = databaseUrl
  ? new Sequelize(databaseUrl, {
      ...commonOptions,
      dialectOptions: sslOptions,
    })
  : new Sequelize(
      process.env.DB_NAME || process.env.DB_DATABASE || 'autism_academy',
      process.env.DB_USER || 'postgres',
      process.env.DB_PASSWORD || 'postgres',
      {
        ...commonOptions,
        host: process.env.DB_HOST || 'localhost',
        port: Number(process.env.DB_PORT || 5432),
        dialectOptions: sslOptions,
      }
    );

module.exports = sequelize;
