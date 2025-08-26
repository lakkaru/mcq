// Update your server/src/routes/questionRoutes.js to include the new route
// Add this line after your existing routes:

const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');

// More specific routes first
router.get('/numbers', questionController.getQuestionNumbersByExam);
router.get('/by-exam-and-number', questionController.getQuestionByExamAndNumber);
router.get('/by-exam', questionController.getQuestionsByExam); // Add this line for exam paper viewing

// List all questions (with filters)
router.get('/', questionController.getQuestions);

// Get a single question by ID
router.get('/:id', questionController.getQuestionById);

// Update a question by ID (PUT /api/questions/:id)
router.put('/:id', questionController.updateQuestion);

// Add a new question
router.post('/', questionController.createQuestion);

module.exports = router;
