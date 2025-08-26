// Controller for exam paper related functionality
const Question = require('../models/Question');
const QuestionAnswer = require('../models/QuestionAnswer');
const Topic = require('../models/Topic');
const ExamInfo = require('../models/ExamInfo');

// Get questions for exam paper viewing
const getExamPaper = async (req, res) => {
  try {
    const { examId, subject, language } = req.query;

    if (!examId) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    console.log('Fetching exam paper for examId:', examId, 'subject:', subject, 'language:', language);

    // First, verify the exam exists and get its details
    const examInfo = await ExamInfo.findByPk(examId);
    if (!examInfo) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    console.log('Found exam:', examInfo.toJSON());

    // Check if the provided subject and language match the exam
    if (subject && examInfo.subject !== subject) {
      return res.status(400).json({ 
        message: `Subject mismatch. Exam has subject '${examInfo.subject}' but '${subject}' was requested.` 
      });
    }

    if (language && examInfo.lang !== language) {
      return res.status(400).json({ 
        message: `Language mismatch. Exam has language '${examInfo.lang}' but '${language}' was requested.` 
      });
    }

    // Build the where clause for the main query - just filter by exam_info_id
    let whereClause = { exam_info_id: examId };
    
    // Build include clauses for associations
    let includeClause = [
      { 
        model: QuestionAnswer, 
        as: 'Question_Answers',
        required: false // LEFT JOIN to include questions even without answers
      },
      { 
        model: ExamInfo,
        required: true
      },
      {
        model: Topic,
        required: false // LEFT JOIN to include questions even without topic
      }
    ];

    // Fetch questions from database
    const questions = await Question.findAll({
      where: whereClause,
      include: includeClause,
      order: [['question_number', 'ASC']] // Sort by question number
    });

    console.log('Found questions count:', questions.length);

    if (!questions || questions.length === 0) {
      return res.status(404).json({ 
        message: 'No questions found for the specified exam',
        data: []
      });
    }

    // Format the response to match frontend expectations
    const formattedQuestions = questions.map(question => {
      const questionData = question.toJSON();
      
      // Sort answers by answer_number and format for frontend compatibility
      const answers = (questionData.Question_Answers || [])
        .sort((a, b) => a.answer_number - b.answer_number) // Sort by answer_number
        .map(ans => ({
          answer_number: ans.answer_number,
          answer_text: (ans.answer_text || '').replace(/\s+/g, ' ').trim(), // Clean up whitespace
          fraction: ans.fraction,
          feedback: (ans.feedback || '').replace(/\s+/g, ' ').trim() // Clean up feedback too
        }));

      // Find correct answer with its number (1, 2, 3, 4, 5)
      const correctAnswerIndex = answers.findIndex(ans => ans.fraction > 0);
      const correctAnswerNumber = correctAnswerIndex >= 0 ? answers[correctAnswerIndex].answer_number : null;

      return {
        _id: questionData.id,
        questionNumber: questionData.question_number,
        questionText: questionData.question_text,
        questionType: questionData.question_type,
        marks: questionData.defaultmark || 1,
        generalfeedback: questionData.generalfeedback, // Changed from 'feedback' to 'generalfeedback'
        options: answers.map(ans => ans.answer_text), // Convert answers to options array (sorted by answer_number)
        optionsFeedback: answers.map(ans => ans.feedback), // Feedback for each option
        optionsWithNumbers: answers.map(ans => ({
          number: ans.answer_number,
          text: ans.answer_text,
          feedback: ans.feedback
        })), // Include answer numbers with options and feedback
        correctAnswer: correctAnswerNumber, // Return number (1, 2, 3, 4, 5)
        correctAnswers: correctAnswerNumber ? [correctAnswerNumber] : [], // Also send as array for compatibility
        correctAnswerText: answers[correctAnswerIndex]?.answer_text || '', // Also include the text
        subject: questionData.Topic?.subject || '',
        language: questionData.ExamInfo?.lang || '',
        examInfo: {
          name: questionData.ExamInfo?.exam || '',
          year: questionData.ExamInfo?.year || ''
        }
      };
    });

    res.status(200).json(formattedQuestions);
  } catch (error) {
    console.error('Error fetching exam paper:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

// Get exam paper statistics
const getExamPaperStats = async (req, res) => {
  try {
    const { examId } = req.query;

    if (!examId) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    // Get exam info
    const examInfo = await ExamInfo.findByPk(examId);
    if (!examInfo) {
      return res.status(404).json({ message: 'Exam not found' });
    }

    // Get question count and total marks
    const questions = await Question.findAll({
      where: { exam_info_id: examId },
      attributes: ['id', 'defaultmark']
    });

    const totalQuestions = questions.length;
    const totalMarks = questions.reduce((sum, q) => sum + (q.defaultmark || 1), 0);

    res.status(200).json({
      examInfo: {
        id: examInfo.id,
        name: examInfo.exam,
        year: examInfo.year,
        subject: examInfo.subject,
        language: examInfo.lang
      },
      stats: {
        totalQuestions,
        totalMarks
      }
    });
  } catch (error) {
    console.error('Error fetching exam paper stats:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  getExamPaper,
  getExamPaperStats
};
