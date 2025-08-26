// server/src/config/database.js
const { Sequelize } = require('sequelize');
require('dotenv').config(); // Load environment variables

// Initialize Sequelize with PostgreSQL connection details
const sequelize = new Sequelize(
  process.env.DB_NAME,
  process.env.DB_USER,
  process.env.DB_PASSWORD,
  {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    dialect: 'postgres', // Specify PostgreSQL dialect
    logging: false, // Set to true to see SQL queries in console
    dialectOptions: {
      // Optional: SSL configuration for production databases (e.g., AWS RDS)
      // ssl: {
      //   require: true,
      //   rejectUnauthorized: false // Adjust based on your SSL certificate setup
      // }
    },
    define: {
      timestamps: true, // Automatically add createdAt and updatedAt columns
      underscored: true, // Use snake_case for automatically added attributes
    },
  }
);

// Function to connect to the database and sync models
const connectDB = async () => {
  try {
    await sequelize.authenticate();
    // console.log('Database connection has been established successfully.');

    // Sync all models with the database.
    // In production, consider using migrations instead of `sync()`.
    // `force: true` drops existing tables before recreating them (USE WITH CAUTION IN DEV, NEVER IN PROD!)
    // `alter: true` attempts to change tables to match models (safer than force: true for dev)
    await sequelize.sync({ force: false, alter: true });
    // console.log('All models were synchronized successfully.');
  } catch (error) {
    console.error('Unable to connect to the database or sync models:', error);
    process.exit(1); // Exit the process if database connection fails
  }
};

module.exports = { sequelize, connectDB };
