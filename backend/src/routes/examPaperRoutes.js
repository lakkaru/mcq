// Routes for exam paper functionality
const express = require('express');
const router = express.Router();
const examPaperController = require('../controllers/examPaperController');

// Get exam paper (questions for viewing)
router.get('/view', examPaperController.getExamPaper);

// Get exam paper statistics
router.get('/stats', examPaperController.getExamPaperStats);

module.exports = router;
