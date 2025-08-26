// API utilities for question CRUD operations

// Fetch all question numbers for a given exam
export async function fetchQuestionNumbersByExam(examId) {
  try {
    const res = await fetch(`http://localhost:5000/api/questions/numbers?examId=${examId}`);
    if (!res.ok) return [];
    return await res.json();
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
    
    const url = `http://localhost:5000/api/questions/by-exam?${params}`;
    console.log('Fetching questions from URL:', url);
    
    const res = await fetch(url);
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch questions: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Questions data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching questions by exam:', error);
    throw error;
  }
}

// Fetch a question by examId and questionNumber
export async function fetchQuestionByExamAndNumber(examId, questionNumber) {
  try {
    const res = await fetch(`http://localhost:5000/api/questions/by-exam-and-number?examId=${examId}&questionNumber=${questionNumber}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching question by exam and number:', error);
    return null;
  }
}

// Fetch a question by its unique ID
export async function fetchQuestionById(id) {
  try {
    const res = await fetch(`http://localhost:5000/api/questions/${id}`);
    if (!res.ok) return null;
    return await res.json();
  } catch (error) {
    console.error('Error fetching question by ID:', error);
    return null;
  }
}

// Update a question by its unique ID
export async function updateQuestion(id, data) {
  try {
    const res = await fetch(`http://localhost:5000/api/questions/${id}`, {
      method: 'PUT',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    if (!res.ok) throw new Error('Failed to update question');
    return await res.json();
  } catch (error) {
    console.error('Error updating question:', error);
    throw error;
  }
}
