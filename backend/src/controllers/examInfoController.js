// server/src/controllers/examInfoController.js
const ExamInfo = require('../models/ExamInfo');
const Question = require('../models/Question'); // For checking associations before delete

// Get all exam information entries
const getAllExams = async (req, res) => {
  try {
    const exams = await ExamInfo.findAll({
      order: [['id', 'DESC']] // Order by ID since no timestamps
    });
    res.status(200).json(exams);
  } catch (error) {
    console.error('Error fetching all exam info:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get exam information by ID
const getExamById = async (req, res) => {
  try {
    const { id } = req.params;
    const exam = await ExamInfo.findByPk(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam info not found.' });
    }
    res.status(200).json(exam);
  } catch (error) {
    console.error('Error fetching exam info by ID:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add new exam information (requires authentication/admin middleware)
const createExamInfo = async (req, res) => {
  try {
    const { exam, year, subject, lang } = req.body;
    
    // Validation
    if (!exam || !year || !subject || !lang) {
      return res.status(400).json({ 
        message: 'All fields are required: exam, year, subject, lang' 
      });
    }

    // Check for duplicates
    const existingExam = await ExamInfo.findOne({
      where: { exam, year, subject, lang }
    });
    
    if (existingExam) {
      return res.status(409).json({ 
        message: 'An exam with these details already exists' 
      });
    }

    const newExam = await ExamInfo.create({
      exam,
      year: year, // Keep as string - your model supports this
      subject,
      lang
    });
    
    res.status(201).json({
      message: 'Exam created successfully',
      exam: newExam
    });
  } catch (error) {
    console.error('Error creating exam info:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Update exam information
const updateExamInfo = async (req, res) => {
  try {
    const { id } = req.params;
    const { exam, year, subject, lang } = req.body;
    
    // console.log('Updating exam with ID:', id);
    // console.log('Update data:', { exam, year, subject, lang });
    
    // Validation
    if (!exam || !year || !subject || !lang) {
      return res.status(400).json({ 
        message: 'All fields are required: exam, year, subject, lang' 
      });
    }

    // Find the exam
    const existingExam = await ExamInfo.findByPk(id);
    if (!existingExam) {
      return res.status(404).json({ message: 'Exam info not found.' });
    }

    // Check for duplicates (excluding current exam)
    const duplicateExam = await ExamInfo.findOne({
      where: { 
        exam, 
        year, 
        subject, 
        lang,
        id: { [require('sequelize').Op.ne]: id }
      }
    });
    
    if (duplicateExam) {
      return res.status(409).json({ 
        message: 'An exam with these details already exists' 
      });
    }

    // Update the exam
    await existingExam.update({
      exam,
      year: year, // Keep as string - your model supports this
      subject,
      lang
    });
    
    // console.log('Exam updated successfully:', existingExam.toJSON());
    
    res.status(200).json({
      message: 'Exam updated successfully',
      exam: existingExam
    });
  } catch (error) {
    console.error('Error updating exam info:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

// Delete exam information
const deleteExamInfo = async (req, res) => {
  try {
    const { id } = req.params;
    
    // Find the exam
    const exam = await ExamInfo.findByPk(id);
    if (!exam) {
      return res.status(404).json({ message: 'Exam info not found.' });
    }

    // Check if exam has associated questions
    const questionCount = await Question.count({ where: { exam_info_id: id } });
    if (questionCount > 0) {
      return res.status(409).json({ 
        message: `Cannot delete exam. It has ${questionCount} associated questions. Please delete the questions first.` 
      });
    }

    // Delete the exam
    await exam.destroy();
    
    res.status(200).json({
      message: 'Exam deleted successfully'
    });
  } catch (error) {
    console.error('Error deleting exam info:', error);
    res.status(500).json({ message: 'Server error.', error: error.message });
  }
};

module.exports = {
  getAllExams,
  getExamById,
  createExamInfo,
  updateExamInfo,
  deleteExamInfo,
};