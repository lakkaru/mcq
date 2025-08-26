// server/src/models/QuestionAnswer.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const Question = require('./Question'); // Import associated model

// Define the Question_Answers model
const QuestionAnswer = sequelize.define('Question_Answer', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  // Foreign key definition:
  question_id: { // Changed from 'question' to 'question_id' for clarity and convention
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: Question, // Refers to the Question model
      key: 'id', // Key in the Question model
    }
  },
  answer_text: {
    type: DataTypes.TEXT, // PostgreSQL uses TEXT for longtext
    allowNull: false,
  },
  answer_text_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  answer_number: {
    type: DataTypes.INTEGER,
    allowNull: false,
    defaultValue: 1, // Default to 1 if not provided
  },
  fraction: {
    type: DataTypes.FLOAT,
    allowNull: false,
    defaultValue: 0.0, // Default value if not provided
  },
  feedback: {
    type: DataTypes.TEXT, // PostgreSQL uses TEXT for longtext
    allowNull: true, // Assuming feedback can be null
  },
  feedback_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'question_answers', // Explicitly define table name
  timestamps: true, // Use createdAt and updatedAt
});

// Define association
QuestionAnswer.belongsTo(Question, { foreignKey: 'question_id' });

module.exports = QuestionAnswer;
