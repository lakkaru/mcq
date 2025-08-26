const express = require('express');
const router = express.Router();
const questionController = require('../controllers/questionController');
const { authenticate, authorize, checkTrialStatus, requireAdmin } = require('../middleware/auth');

// Public routes for authenticated users (students can view questions)
router.use(authenticate); // All routes require authentication

// Routes available to all authenticated users (with trial check for guest students)
router.get('/numbers', checkTrialStatus, questionController.getQuestionNumbersByExam);
router.get('/by-exam-and-number', checkTrialStatus, questionController.getQuestionByExamAndNumber);
router.get('/by-exam', checkTrialStatus, questionController.getQuestionsByExam);
router.get('/', checkTrialStatus, questionController.getQuestions);
router.get('/:id', checkTrialStatus, questionController.getQuestionById);

// Admin-only routes for managing questions
router.post('/', requireAdmin, questionController.createQuestion);
router.put('/:id', requireAdmin, questionController.updateQuestion);
router.delete('/:id', requireAdmin, questionController.deleteQuestion);

module.exports = router;
