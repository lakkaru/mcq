// Fetch all exams (uses your existing /api/exams endpoint)
export async function fetchAllExams() {
  try {
    const res = await fetch("http://localhost:5000/api/exams");
    if (!res.ok) throw new Error(`Failed to fetch exams: ${res.statusText}`);
    return await res.json();
  } catch (error) {
    console.error('Error fetching exams:', error);
    throw error;
  }
}

// Fetch a specific exam by ID (uses your existing /api/exams/:id endpoint)
export async function fetchExamById(examId) {
  try {
    const res = await fetch(`http://localhost:5000/api/exams/${examId}`);
    if (!res.ok) {
      if (res.status === 404) throw new Error("Exam not found");
      throw new Error(`Failed to fetch exam: ${res.statusText}`);
    }
    return await res.json();
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
    console.log('[API] Request URL:', `http://localhost:5000/api/exams/${examId}`);
    
    const res = await fetch(`http://localhost:5000/api/exams/${examId}`, {
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData),
    });
    
    console.log('[API] Response status:', res.status);
    console.log('[API] Response OK:', res.ok);
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      console.error('[API] Error response:', errorData);
      throw new Error(errorData.message || `Failed to update exam: ${res.statusText}`);
    }
    
    const result = await res.json();
    console.log('[API] Update successful:', result);
    return result;
  } catch (error) {
    console.error('Error updating exam:', error);
    throw error;
  }
}

// Create a new exam (uses your existing /api/exams POST endpoint)
export async function createExam(examData) {
  try {
    const res = await fetch('http://localhost:5000/api/exams/', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(examData),
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to create exam: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error creating exam:', error);
    throw error;
  }
}

// Delete an exam (requires backend delete endpoint: DELETE /api/exams/:id)
export async function deleteExam(examId) {
  try {
    const res = await fetch(`http://localhost:5000/api/exams/${examId}`, {
      method: 'DELETE',
    });
    
    if (!res.ok) {
      const errorData = await res.json().catch(() => ({}));
      throw new Error(errorData.message || `Failed to delete exam: ${res.statusText}`);
    }
    
    return await res.json();
  } catch (error) {
    console.error('Error deleting exam:', error);
    throw error;
  }
}
