// server/src/controllers/topicController.js
const Topic = require('../models/Topic');

// Get all topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching all topics:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get topics by subject
const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({ message: 'Subject query parameter is required.' });
    }
    const topics = await Topic.findAll({ where: { subject } });
    res.status(200).json(topics);
  } catch (error) {
    console.error('Error fetching topics by subject:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a new topic (requires authentication/admin middleware)
const createTopic = async (req, res) => {
  try {
    const newTopic = await Topic.create(req.body);
    res.status(201).json(newTopic);
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

module.exports = {
  getAllTopics,
  getTopicsBySubject,
  createTopic,
};
