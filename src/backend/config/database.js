const { Sequelize } = require('sequelize');
const path = require('path');
require('dotenv').config();

// Use SQLite for development, PostgreSQL for production
const isProduction = process.env.NODE_ENV === 'production';

let sequelize;

if (isProduction) {
  // Production: Use PostgreSQL
  sequelize = new Sequelize(process.env.DATABASE_URL, {
    dialect: 'postgres',
    logging: false,
    dialectOptions: {
      ssl: {
        require: true,
        rejectUnauthorized: false
      }
    },
    pool: {
      max: 10,
      min: 0,
      acquire: 30000,
      idle: 10000
    }
  });
} else {
  // Development: Use SQLite
  const dbPath = path.join(__dirname, '..', 'dev.db');
  
  sequelize = new Sequelize({
    dialect: 'sqlite',
    storage: dbPath,
    logging: process.env.ENABLE_LOGGING === 'true' ? console.log : false,
    define: {
      timestamps: true,
      underscored: true
    }
  });
}

module.exports = { sequelize };