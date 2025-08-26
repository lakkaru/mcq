// server/src/controllers/questionController.js
const Question = require('../models/Question');
const QuestionAnswer = require('../models/QuestionAnswer');
const Topic = require('../models/Topic');
const ExamInfo = require('../models/ExamInfo');

// Get questions by topic or exam_info
const getQuestions = async (req, res) => {
  try {
    const { topicId, examInfoId, subject } = req.query;
    let whereClause = {};

    if (topicId) {
      whereClause.topicId = topicId;
    }
    if (examInfoId) {
      whereClause.exam_info_id = examInfoId;
    }
    if (subject) {
        // Find topic IDs for the subject and then filter questions
        const topics = await Topic.findAll({ where: { subject } });
        const topicIds = topics.map(t => t.id);
        if (topicIds.length > 0) {
            whereClause.topicId = topicIds;
        } else {
            return res.status(404).json({ message: 'No topics found for this subject, thus no questions.' });
        }
    }

    if (Object.keys(whereClause).length === 0) {
      return res.status(400).json({ message: 'Please provide topicId, examInfoId, or subject to filter questions.' });
    }

    const questions = await Question.findAll({
      where: whereClause,
      include: [
        { model: QuestionAnswer, as: 'Question_Answers' }, // Include answers
        { model: Topic },
        { model: ExamInfo }
      ],
      order: sequelize.random() // Randomize order
    });

    if (questions.length === 0) {
      return res.status(404).json({ message: 'No questions found for the given criteria.' });
    }

    res.status(200).json(questions);
  } catch (error) {
    console.error('Error fetching questions:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Get a single question by ID
const getQuestionById = async (req, res) => {
  try {
    const { id } = req.params;
    const question = await Question.findByPk(id, {
      include: [{ model: QuestionAnswer, as: 'Question_Answers' }, { model: Topic }, { model: ExamInfo }],
    });
    if (!question) {
      return res.status(404).json({ message: 'Question not found.' });
    }
    res.status(200).json(question);
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Add a new question (requires authentication/admin middleware)
const createQuestion = async (req, res) => {
  const { question_number, exam_info_id, topicId, question_text, question_text_json, question_type, defaultmark, generalfeedback, generalfeedback_json, answers } = req.body;

  try {
    const newQuestion = await Question.create({
      question_number,
      exam_info_id,
      topicId,
      question_text,
      question_text_json,
      question_type,
      defaultmark,
      generalfeedback,
      generalfeedback_json,
    });

    if (answers && answers.length > 0) {
      // Associate answers with the newly created question and assign answer numbers
      const questionAnswers = answers.map((ans, index) => ({
        ...ans,
        answer_text: (ans.answer_text || '').replace(/\s+/g, ' ').trim(),
        answer_text_json: ans.answer_text_json || null,
        feedback: (ans.feedback || '').replace(/\s+/g, ' ').trim(),
        feedback_json: ans.feedback_json || null,
        question_id: newQuestion.id,
        answer_number: index + 1,
      }));
      await QuestionAnswer.bulkCreate(questionAnswers);
    }

    res.status(201).json(newQuestion);
  } catch (error) {
    console.error('Error creating question:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};
 
//Get question numbers by exam
const getQuestionNumbersByExam = async (req, res) => {
  const { examId } = req.query;
  if (!examId) return res.status(400).json({ error: 'Missing examId' });

  try {
    const questions = await Question.findAll({
      where: { exam_info_id: examId },
      attributes: ['question_number'],
      order: [['question_number', 'ASC']]
    });
    const numbers = questions.map(q => q.question_number);
    res.json(numbers);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch question numbers' });
  }
};



const getQuestionByExamAndNumber = async (req, res) => {
  const { examId, questionNumber } = req.query;
  if (!examId || !questionNumber) {
    return res.status(400).json({ error: 'Missing examId or questionNumber' });
  }
  try {
    const question = await Question.findOne({
      where: {
        exam_info_id: examId,
        question_number: questionNumber
      },
      include: [
        { model: QuestionAnswer, as: 'Question_Answers' }
      ]
    });
    if (!question) return res.status(404).json({ error: 'Question not found' });

    // Format answers for frontend compatibility, sorted by answer_number
    const answers = (question.Question_Answers || [])
      .sort((a, b) => a.answer_number - b.answer_number) // Sort by answer_number
      .map(ans => ({
        answer_text: ans.answer_text,
        fraction: ans.fraction,
        feedback: ans.feedback,
        answer_number: ans.answer_number
      }));

    res.json({
      ...question.toJSON(),
      answers
    });
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch question' });
  }
};


// Update a question and its answers
const updateQuestion = async (req, res) => {
  const { id } = req.params;
  const { question_number, question_text, question_text_json, defaultmark, generalfeedback, generalfeedback_json, answers } = req.body;

  try {
    // Update the main question
    const [updatedRows] = await Question.update(
      { question_number, question_text, question_text_json, defaultmark, generalfeedback, generalfeedback_json },
      { where: { id } }
    );
    if (updatedRows === 0) {
      return res.status(404).json({ message: 'Question not found.' });
    }

    // Remove old answers and add new ones (or update if you have answer IDs)
    await QuestionAnswer.destroy({ where: { question_id: id } });
    if (answers && answers.length > 0) {
      const newAnswers = answers.map((ans, index) => ({
        ...ans,
        answer_text: (ans.answer_text || '').replace(/\s+/g, ' ').trim(),
        answer_text_json: ans.answer_text_json || null,
        feedback: (ans.feedback || '').replace(/\s+/g, ' ').trim(),
        feedback_json: ans.feedback_json || null,
        question_id: id,
        answer_number: index + 1,
      }));
      await QuestionAnswer.bulkCreate(newAnswers);
    }

    res.json({ success: true });
  } catch (error) {
    console.error('Error updating question:', error);
    res.status(500).json({ message: 'Server error.' });
  }
};

// Fetch questions by exam, subject, and language for exam paper viewing
const getQuestionsByExam = async (req, res) => {
  try {
    const { examId, subject, language } = req.query;

    if (!examId) {
      return res.status(400).json({ message: 'Exam ID is required' });
    }

    console.log('Fetching questions for examId:', examId, 'subject:', subject, 'language:', language);

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
        feedback: questionData.generalfeedback,
        options: answers.map(ans => ans.answer_text), // Convert answers to options array (sorted by answer_number)
        optionsWithNumbers: answers.map(ans => ({
          number: ans.answer_number,
          text: ans.answer_text
        })), // Include answer numbers with options
        correctAnswer: correctAnswerNumber, // Return number (1, 2, 3, 4, 5)
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
    console.error('Error fetching questions by exam:', error);
    res.status(500).json({ 
      message: 'Internal server error',
      error: error.message 
    });
  }
};

module.exports = {
  getQuestions,
  getQuestionById,
  createQuestion,
  getQuestionNumbersByExam,
  getQuestionByExamAndNumber,
  updateQuestion,
  getQuestionsByExam,
};
