const express = require('express');
const router = express.Router();
const examInfoController = require('../controllers/examInfoController');
const { authenticate, checkTrialStatus, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes available to all authenticated users (with trial check for guest students)
router.get('/', checkTrialStatus, examInfoController.getAllExams);
router.get('/:id', checkTrialStatus, examInfoController.getExamById);

// Admin-only routes for managing exams
router.post('/', requireAdmin, examInfoController.createExamInfo);
router.put('/:id', requireAdmin, examInfoController.updateExamInfo);
router.delete('/:id', requireAdmin, examInfoController.deleteExamInfo);

module.exports = router;