// Utility script to clean up existing answer texts in the database
// This script trims whitespace from answer_text and feedback fields in question_answers table

const { sequelize } = require('../src/config/database');

async function cleanupAnswerText() {
  try {
    console.log('Starting cleanup of answer texts...');
    
    // Update answer_text to clean up whitespace (replace multiple spaces/newlines with single space and trim)
    const answerTextResult = await sequelize.query(`
      UPDATE question_answers 
      SET answer_text = TRIM(REGEXP_REPLACE(answer_text, '\\s+', ' ', 'g'))
      WHERE answer_text ~ '\\s{2,}|\\n|\\t'
    `);
    
    console.log(`Updated ${answerTextResult[1]} answer texts.`);
    
    // Update feedback to clean up whitespace
    const feedbackResult = await sequelize.query(`
      UPDATE question_answers 
      SET feedback = TRIM(REGEXP_REPLACE(feedback, '\\s+', ' ', 'g'))
      WHERE feedback IS NOT NULL AND feedback ~ '\\s{2,}|\\n|\\t'
    `);
    
    console.log(`Updated ${feedbackResult[1]} feedback texts.`);
    
    // Also clean up question_text in questions table
    const questionTextResult = await sequelize.query(`
      UPDATE questions 
      SET question_text = TRIM(REGEXP_REPLACE(question_text, '\\s+', ' ', 'g'))
      WHERE question_text ~ '\\s{2,}|\\n|\\t'
    `);
    
    console.log(`Updated ${questionTextResult[1]} question texts.`);
    
    // Clean up generalfeedback in questions table
    const generalFeedbackResult = await sequelize.query(`
      UPDATE questions 
      SET generalfeedback = TRIM(REGEXP_REPLACE(generalfeedback, '\\s+', ' ', 'g'))
      WHERE generalfeedback IS NOT NULL AND generalfeedback ~ '\\s{2,}|\\n|\\t'
    `);
    
    console.log(`Updated ${generalFeedbackResult[1]} general feedback texts.`);
    
    console.log('Cleanup completed successfully!');
    
  } catch (error) {
    console.error('Error during cleanup:', error);
  } finally {
    await sequelize.close();
  }
}

// Run the cleanup if this script is executed directly
if (require.main === module) {
  cleanupAnswerText();
}

module.exports = { cleanupAnswerText };
