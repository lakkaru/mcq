// server/src/models/ExamInfo.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');

// Define the Exam_Info model
const ExamInfo = sequelize.define('Exam_Info', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  exam: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  year: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  subject: {
    type: DataTypes.STRING,
    allowNull: false,
  },
  lang: {
    type: DataTypes.STRING,
    allowNull: false,
  },
}, {
  tableName: 'exam_info', // Explicitly define table name as per schema
  timestamps: false, // Assuming no timestamps for this lookup table
});

module.exports = ExamInfo;
