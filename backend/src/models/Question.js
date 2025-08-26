// server/src/models/Question.js
const { DataTypes } = require('sequelize');
const { sequelize } = require('../config/database');
const ExamInfo = require('./ExamInfo'); // Import associated models
const Topic = require('./Topic');

// Define the Questions model
const Question = sequelize.define('Question', {
  id: {
    type: DataTypes.INTEGER,
    primaryKey: true,
    autoIncrement: true,
    allowNull: false,
  },
  question_number: {
    type: DataTypes.INTEGER,
    allowNull: false, 
  },
  // Foreign key definition:
  exam_info_id: {
    type: DataTypes.INTEGER,
    allowNull: false,
    references: {
      model: ExamInfo, // Refers to the ExamInfo model
      key: 'id', // Key in the ExamInfo model
    }
  },
  topicId: { // Name as per your schema, Sequelize will use topic_id as column name if underscored is true
    type: DataTypes.INTEGER,
    allowNull: true,
    references: {
      model: Topic, // Refers to the Topic model
      key: 'id', // Key in the Topic model
    }
  },
  question_text: {
    type: DataTypes.TEXT, // PostgreSQL uses TEXT for longtext
    allowNull: false,
  },
  question_text_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
  question_type: {
    type: DataTypes.STRING,
    allowNull: false, 
  },
  defaultmark: {
    type: DataTypes.INTEGER,
    allowNull: true, // Assuming mark can be null
  },
  generalfeedback: {
    type: DataTypes.TEXT, // PostgreSQL uses TEXT for longtext
    allowNull: true, // Assuming feedback can be null
  },
  generalfeedback_json: {
    type: DataTypes.JSONB,
    allowNull: true,
  },
}, {
  tableName: 'questions', // Explicitly define table name
  timestamps: true, // Use createdAt and updatedAt
});

// Define associations
Question.belongsTo(ExamInfo, { foreignKey: 'exam_info_id' });
Question.belongsTo(Topic, { foreignKey: 'topicId' }); // Sequelize will use `topic_id` column

module.exports = Question;
