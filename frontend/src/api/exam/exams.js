import api from '../../utils/api';

// Fetch all exams (uses your existing /api/exams endpoint)
export async function fetchAllExams() {
  try {
    const response = await api.get('/exams');
    return response.data || response; // Handle both old and new response formats
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
}

// Fetch a specific exam by ID (uses your existing /api/exams/:id endpoint)
export async function fetchExamById(examId) {
  try {
    const response = await api.get(`/exams/${examId}`);
    return response.data || response; // Handle both old and new response formats
  } catch (error) {
    console.error('Error fetching exam by ID:', error);
    throw error;
  }
}

// Update an exam (requires backend update endpoint: PUT /api/exams/:id)
export async function updateExam(examId, examData) {
  try {
    console.log('[API] Updating exam with ID:', examId);
    console.log('[API] Exam data:', examData);
    
    const response = await api.put(`/exams/${examId}`, examData);
    
    console.log('[API] Update successful:', response);
    return response.data || response;
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
}

// Create a new exam (uses your existing /api/exams POST endpoint)
export async function createExam(examData) {
  try {
    const response = await api.post('/exams', examData);
    return response.data || response;
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
}

// Delete an exam (requires backend delete endpoint: DELETE /api/exams/:id)
export async function deleteExam(examId) {
  try {
    const response = await api.delete(`/exams/${examId}`);
    return response.data || response;
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
}
