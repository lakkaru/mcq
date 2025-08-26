// server/src/app.js
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config(); // Load environment variables

// Import models to ensure they are defined and can be synchronized
const User = require('./models/User');
const ExamInfo = require('./models/ExamInfo');
const Topic = require('./models/Topic');
const Question = require('./models/Question');
const QuestionAnswer = require('./models/QuestionAnswer');

// Setup associations explicitly
// User associations (for future features like user progress tracking)
// User.hasMany(UserProgress, { foreignKey: 'userId' });

// ExamInfo has many Questions
ExamInfo.hasMany(Question, { foreignKey: 'exam_info_id' });
Question.belongsTo(ExamInfo, { foreignKey: 'exam_info_id' });

// Topic has many Questions
Topic.hasMany(Question, { foreignKey: 'topicId' });
Question.belongsTo(Topic, { foreignKey: 'topicId' });

// Question has many QuestionAnswers
Question.hasMany(QuestionAnswer, { foreignKey: 'question_id', as: 'Question_Answers' });
QuestionAnswer.belongsTo(Question, { foreignKey: 'question_id' });

// Import routes
const authRoutes = require('./routes/authRoutes');
const userRoutes = require('./routes/userRoutes');
const adminRoutes = require('./routes/adminRoutes');
const examInfoRoutes = require('./routes/examInfoRoutes');
const examPaperRoutes = require('./routes/examPaperRoutes');
const topicRoutes = require('./routes/topicRoutes');
const questionRoutes = require('./routes/questionRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json({limit:'10mb'})); // Parse JSON request bodies

// Connect to the database and sync models
connectDB();

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/users', userRoutes);
app.use('/api/admin', adminRoutes);
app.use('/api/exams', examInfoRoutes);
app.use('/api/exam-papers', examPaperRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);

// Simple root route for health check
app.get('/', (req, res) => {
  res.json({
    message: 'MCQ Practice Backend API is running!',
    version: '1.0.0',
    endpoints: {
      auth: '/api/auth',
      users: '/api/users',
      admin: '/api/admin',
      exams: '/api/exams',
      examPapers: '/api/exam-papers',
      topics: '/api/topics',
      questions: '/api/questions'
    }
  });
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).json({
    success: false,
    message: 'Something went wrong!',
    error: process.env.NODE_ENV === 'development' ? err.message : 'Internal server error'
  });
});

// Handle 404 routes
app.use('*', (req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
  console.log(`Environment: ${process.env.NODE_ENV || 'development'}`);
});
