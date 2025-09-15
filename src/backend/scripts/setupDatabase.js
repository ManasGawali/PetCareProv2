const mysql = require('mysql2/promise');
require('dotenv').config();

const setupDatabase = async () => {
  try {
    console.log('🔄 Setting up PetCare Pro database...');

    // Create database connection without specifying database
    const connection = await mysql.createConnection({
      host: process.env.DB_HOST,
      port: process.env.DB_PORT,
      user: process.env.DB_USER,
      password: process.env.DB_PASSWORD,
    });

    // Create database if it doesn't exist
    await connection.execute(`CREATE DATABASE IF NOT EXISTS \`${process.env.DB_NAME}\``);
    console.log(`✅ Database '${process.env.DB_NAME}' created or already exists`);

    await connection.end();

    // Now test connection with the database
    const { sequelize } = require('../models');
    await sequelize.authenticate();
    console.log('✅ Database connection established successfully');

    // Sync all models
    await sequelize.sync({ alter: true });
    console.log('✅ Database models synchronized');

    console.log('🎉 Database setup completed successfully!');
    process.exit(0);
  } catch (error) {
    console.error('❌ Database setup failed:', error);
    process.exit(1);
  }
};

setupDatabase();