// server/src/routes/examInfoRoutes.js
const express = require('express');
const router = express.Router();
const examInfoController = require('../controllers/examInfoController');
// const authenticateToken = require('../middleware/auth'); // For protected routes

// Get all exam information
router.get('/', examInfoController.getAllExams);

// Get a single exam information by ID
router.get('/:id', examInfoController.getExamById);

// Add new exam information (protected, e.g., for admin users)
router.post('/', examInfoController.createExamInfo);

// Update exam information by ID (protected, e.g., for admin users)
router.put('/:id', examInfoController.updateExamInfo);

// Delete exam information by ID (protected, e.g., for admin users)
router.delete('/:id', examInfoController.deleteExamInfo);

module.exports = router;