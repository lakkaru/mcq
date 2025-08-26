// server/src/routes/topicRoutes.js
const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
// const authenticateToken = require('../middleware/auth'); // For protected routes

// Get all topics
router.get('/', topicController.getAllTopics);

// Get topics by subject (e.g., /api/topics/by-subject?subject=History)
router.get('/by-subject', topicController.getTopicsBySubject);

// Add a new topic (protected, e.g., for admin users)
// router.post('/', authenticateToken, topicController.createTopic); // Example: requires authentication

module.exports = router;
