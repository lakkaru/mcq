// server/src/models/Topic.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define the Topics model
const Topic = sequelize.define('Topic', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  topic: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'topics', // Explicitly define table name as per schema
  timestamps: false, // Assuming no timestamps for this lookup table
});

module.exports = Topic;
