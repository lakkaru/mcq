// API functions for exam paper functionality
const API_BASE_URL = 'http://localhost:5000/api';

// Fetch exam paper (questions for viewing)
export async function fetchExamPaper(examId, subject, language) {
  try {
    const params = new URLSearchParams({
      examId
    });
    
    // Only add subject and language if provided (for validation)
    if (subject) params.append('subject', subject);
    if (language) params.append('language', language);
    
    const url = `${API_BASE_URL}/exam-papers/view?${params}`;
    console.log('Fetching exam paper from URL:', url);
    
    const res = await fetch(url);
    console.log('Response status:', res.status);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      if (res.status === 404) return [];
      throw new Error(`Failed to fetch exam paper: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Exam paper data received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching exam paper:', error);
    throw error;
  }
}

// Fetch exam paper statistics
export async function fetchExamPaperStats(examId) {
  try {
    const url = `${API_BASE_URL}/exam-papers/stats?examId=${examId}`;
    console.log('Fetching exam paper stats from URL:', url);
    
    const res = await fetch(url);
    
    if (!res.ok) {
      const errorText = await res.text();
      console.error('Error response:', errorText);
      throw new Error(`Failed to fetch exam paper stats: ${res.statusText}`);
    }
    
    const data = await res.json();
    console.log('Exam paper stats received:', data);
    return data;
  } catch (error) {
    console.error('Error fetching exam paper stats:', error);
    throw error;
  }
}
