// API utilities for question CRUD operations
import api from '../../utils/api';

// Fetch all question numbers for a given exam
export async function fetchQuestionNumbersByExam(examId) {
  try {
    const response = await api.get(`/questions/numbers?examId=${examId}`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching question numbers:', error);
    return [];
  }
}

// Fetch questions by exam, subject, and language for exam paper viewing
export async function fetchQuestionsByExam(examId, subject, language) {
  try {
    const params = new URLSearchParams({
      examId
    });
    
    // Only add subject and language if provided (for validation)
    if (subject) params.append('subject', subject);
    if (language) params.append('language', language);
    
    const endpoint = `/questions/by-exam?${params}`;
    console.log('Fetching questions from endpoint:', endpoint);
    
    const response = await api.get(endpoint);
    console.log('Questions data received:', response);
    
    return response.data || response;
  } catch (error) {
    console.error('Error fetching questions by exam:', error);
    if (error.message.includes('401') || error.message.includes('Session expired')) {
      // Handle authentication error specifically
      throw new Error('Please login to access questions');
    }
    throw error;
  }
}

// Fetch a question by examId and questionNumber
export async function fetchQuestionByExamAndNumber(examId, questionNumber) {
  try {
    const response = await api.get(`/questions/by-exam-and-number?examId=${examId}&questionNumber=${questionNumber}`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching question by exam and number:', error);
    return null;
  }
}

// Fetch a question by its unique ID
export async function fetchQuestionById(id) {
  try {
    const response = await api.get(`/questions/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

// Update a question by its unique ID
export async function updateQuestion(id, data) {
  try {
    const response = await api.put(`/questions/${id}`, data);
    return response.data || response;
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
}

// Create a new question (admin only)
export async function createQuestion(data) {
  try {
    const response = await api.post('/questions', data);
    return response.data || response;
  } catch (error) {
    console.error('Error creating question:', error);
    throw error;
  }
}

// Delete a question (admin only)
export async function deleteQuestion(id) {
  try {
    const response = await api.delete(`/questions/${id}`);
    return response.data || response;
  } catch (error) {
    console.error('Error deleting question:', error);
    throw error;
  }
}
