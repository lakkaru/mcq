const express = require('express');
const router = express.Router();
const topicController = require('../controllers/topicController');
const { authenticate, checkTrialStatus, requireAdmin } = require('../middleware/auth');

// All routes require authentication
router.use(authenticate);

// Routes available to all authenticated users (with trial check for guest students)
router.get('/', checkTrialStatus, topicController.getAllTopics);
router.get('/by-subject', checkTrialStatus, topicController.getTopicsBySubject);

// Admin-only routes for managing topics
router.post('/', requireAdmin, topicController.createTopic);
router.put('/:id', requireAdmin, topicController.updateTopic);
router.delete('/:id', requireAdmin, topicController.deleteTopic);

module.exports = router;
