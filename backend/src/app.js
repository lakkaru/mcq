// server/src/app.js
const express = require('express');
const cors = require('cors');
const { connectDB, sequelize } = require('./config/database');
require('dotenv').config(); // Load environment variables

// Import models to ensure they are defined and can be synchronized
// const User = require('./models/User');
const ExamInfo = require('./models/ExamInfo');
const Topic = require('./models/Topic');
const Question = require('./models/Question');
const QuestionAnswer = require('./models/QuestionAnswer');
// const Note = require('./models/Note');

// Setup associations explicitly (though already done in models, good for clarity)
// ExamInfo has many Questions
ExamInfo.hasMany(Question, { foreignKey: 'exam_info_id' });
Question.belongsTo(ExamInfo, { foreignKey: 'exam_info_id' });

// Topic has many Questions
Topic.hasMany(Question, { foreignKey: 'topicId' });
Question.belongsTo(Topic, { foreignKey: 'topicId' });

// Question has many QuestionAnswers
Question.hasMany(QuestionAnswer, { foreignKey: 'question_id', as: 'Question_Answers' });
QuestionAnswer.belongsTo(Question, { foreignKey: 'question_id' });

// User has many Notes
// User.hasMany(Note, { foreignKey: 'userId' });
// Note.belongsTo(User, { foreignKey: 'userId' });


// Import routes
// const authRoutes = require('./routes/authRoutes');
const examInfoRoutes = require('./routes/examInfoRoutes');
const examPaperRoutes = require('./routes/examPaperRoutes');
const topicRoutes = require('./routes/topicRoutes');
const questionRoutes = require('./routes/questionRoutes');
// const noteRoutes = require('./routes/noteRoutes');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors()); // Enable CORS for all origins (for development)
app.use(express.json({limit:'10mb'})); // Parse JSON request bodies

// Connect to the database and sync models
connectDB();

// API Routes
// app.use('/api/auth', authRoutes);
app.use('/api/exams', examInfoRoutes);
app.use('/api/exam-papers', examPaperRoutes);
app.use('/api/topics', topicRoutes);
app.use('/api/questions', questionRoutes);
// app.use('/api/notes', noteRoutes); // Use this for user notes

// Simple root route for health check
app.get('/', (req, res) => {
  res.send('MCQ Practice Backend API is running!');
});

// Global error handling middleware
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(500).send('Something broke!');
});

// Start the server
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
