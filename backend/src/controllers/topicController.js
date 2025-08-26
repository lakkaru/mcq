// server/src/controllers/topicController.js
const Topic = require('../models/Topic');

// Get all topics
const getAllTopics = async (req, res) => {
  try {
    const topics = await Topic.findAll();
    res.status(200).json({
      success: true,
      data: { topics }
    });
  } catch (error) {
    console.error('Error fetching all topics:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching topics'
    });
  }
};

// Get topics by subject
const getTopicsBySubject = async (req, res) => {
  try {
    const { subject } = req.query;
    if (!subject) {
      return res.status(400).json({
        success: false,
        message: 'Subject query parameter is required.'
      });
    }
    const topics = await Topic.findAll({ where: { subject } });
    res.status(200).json({
      success: true,
      data: { topics }
    });
  } catch (error) {
    console.error('Error fetching topics by subject:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching topics by subject'
    });
  }
};

// Add a new topic (requires authentication/admin middleware)
const createTopic = async (req, res) => {
  try {
    const newTopic = await Topic.create(req.body);
    res.status(201).json({
      success: true,
      message: 'Topic created successfully',
      data: { topic: newTopic }
    });
  } catch (error) {
    console.error('Error creating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while creating topic'
    });
  }
};

// Update a topic by ID (admin only)
const updateTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await topic.update(req.body);
    
    res.status(200).json({
      success: true,
      message: 'Topic updated successfully',
      data: { topic }
    });
  } catch (error) {
    console.error('Error updating topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while updating topic'
    });
  }
};

// Delete a topic by ID (admin only)
const deleteTopic = async (req, res) => {
  try {
    const { id } = req.params;
    const topic = await Topic.findByPk(id);
    
    if (!topic) {
      return res.status(404).json({
        success: false,
        message: 'Topic not found'
      });
    }

    await topic.destroy();
    
    res.status(200).json({
      success: true,
      message: 'Topic deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting topic:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while deleting topic'
    });
  }
};

module.exports = {
  getAllTopics,
  getTopicsBySubject,
  createTopic,
  updateTopic,
  deleteTopic
};
