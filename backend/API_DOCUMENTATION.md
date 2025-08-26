# MCQ Master Backend API Documentation

## Base URL
```
http://localhost:5000
```

## Headers
```
Content-Type: application/json
```

---

## 📚 Exam Info Routes
**Base Path:** `/api/exam-info`

### Get All Exams
```http
GET /api/exam-info
```
**Description:** Retrieve all exam information  
**Response:** Array of exam objects

**Response Example:**
```json
[
  {
    "id": 1,
    "exam": "Advanced Level",
    "year": 2023,
    "subject": "Chemistry",
    "lang": "English"
  }
]
```

### Get Exam by ID
```http
GET /api/exam-info/:id
```
**Parameters:**
- `id` (number) - Exam info ID

**Response:** Single exam object

### Create New Exam
```http
POST /api/exam-info
```
**Body:**
```json
{
  "exam": "Advanced Level",
  "year": 2024,
  "subject": "Physics",
  "lang": "English"
}
```

### Update Exam
```http
PUT /api/exam-info/:id
```
**Parameters:**
- `id` (number) - Exam info ID

**Body:** Same as create exam

### Delete Exam
```http
DELETE /api/exam-info/:id
```
**Parameters:**
- `id` (number) - Exam info ID

---

## 📋 Exam Paper Routes
**Base Path:** `/api/exam-paper`

### Get Exam Paper Questions
```http
GET /api/exam-paper?examId={examId}&subject={subject}&language={language}
```
**Query Parameters:**
- `examId` (required) - Exam info ID
- `subject` (optional) - Subject filter
- `language` (optional) - Language filter

**Description:** Get all questions for a specific exam paper with answers and feedback

**Response Example:**
```json
[
  {
    "id": 1,
    "questionNumber": 1,
    "questionText": "<p>What is the chemical formula for water?</p>",
    "questionType": "MCQ",
    "marks": 1,
    "generalfeedback": "<p>Water is a simple molecule...</p>",
    "options": ["H2O", "CO2", "O2", "H2SO4"],
    "optionsWithNumbers": [
      {
        "number": 1,
        "text": "H2O",
        "feedback": "<p>Correct! H2O is water.</p>"
      }
    ],
    "optionsFeedback": ["Correct!", "Incorrect...", "Wrong...", "No..."],
    "correctAnswer": 1,
    "correctAnswers": [1],
    "correctAnswerText": "H2O",
    "subject": "Chemistry",
    "language": "English",
    "examInfo": {
      "name": "Advanced Level",
      "year": 2023
    }
  }
]
```

### Get Exam Paper Stats
```http
GET /api/exam-paper/stats?examId={examId}
```
**Query Parameters:**
- `examId` (required) - Exam info ID

**Response:**
```json
{
  "examInfo": {
    "id": 1,
    "exam": "Advanced Level",
    "year": 2023,
    "subject": "Chemistry",
    "lang": "English"
  },
  "totalQuestions": 50,
  "totalMarks": 50
}
```

---

## ❓ Question Routes
**Base Path:** `/api/questions`

### Get All Questions
```http
GET /api/questions
```
**Query Parameters (optional):**
- `exam_info_id` - Filter by exam
- `topic_id` - Filter by topic

**Response:** Array of question objects with answers

### Get Question by ID
```http
GET /api/questions/:id
```
**Parameters:**
- `id` (number) - Question ID

**Response:** Single question object with answers

### Create New Question
```http
POST /api/questions
```
**Body:**
```json
{
  "question_number": 1,
  "exam_info_id": 1,
  "topic_id": 1,
  "question_text": "<p>What is the atomic number of carbon?</p>",
  "question_type": "MCQ",
  "defaultmark": 1,
  "generalfeedback": "<p>Carbon is element 6...</p>",
  "answers": [
    {
      "answer_text": "6",
      "fraction": 1.0,
      "feedback": "<p>Correct! Carbon has 6 protons.</p>"
    },
    {
      "answer_text": "12",
      "fraction": 0.0,
      "feedback": "<p>That's the atomic mass, not number.</p>"
    }
  ]
}
```

### Update Question
```http
PUT /api/questions/:id
```
**Parameters:**
- `id` (number) - Question ID

**Body:** Same as create question

### Delete Question
```http
DELETE /api/questions/:id
```
**Parameters:**
- `id` (number) - Question ID

---

## 🏷️ Topic Routes
**Base Path:** `/api/topics`

### Get All Topics
```http
GET /api/topics
```
**Response:** Array of topic objects

**Response Example:**
```json
[
  {
    "id": 1,
    "topic": "Organic Chemistry",
    "subject": "Chemistry"
  }
]
```

### Get Topic by ID
```http
GET /api/topics/:id
```
**Parameters:**
- `id` (number) - Topic ID

### Create New Topic
```http
POST /api/topics
```
**Body:**
```json
{
  "topic": "Quantum Physics",
  "subject": "Physics"
}
```

### Update Topic
```http
PUT /api/topics/:id
```
**Parameters:**
- `id` (number) - Topic ID

**Body:** Same as create topic

### Delete Topic
```http
DELETE /api/topics/:id
```
**Parameters:**
- `id` (number) - Topic ID

---

## 🔄 Data Models

### ExamInfo
```typescript
{
  id: number;
  exam: string;         // e.g., "Advanced Level"
  year: number;         // e.g., 2023
  subject: string;      // e.g., "Chemistry"
  lang: string;         // e.g., "English"
  createdAt: Date;
  updatedAt: Date;
}
```

### Question
```typescript
{
  id: number;
  question_number: number;
  exam_info_id: number;
  topic_id: number | null;
  question_text: string;    // HTML content
  question_type: string;    // "MCQ"
  defaultmark: number;
  generalfeedback: string | null;  // HTML content
  createdAt: Date;
  updatedAt: Date;
}
```

### QuestionAnswer
```typescript
{
  id: number;
  question_id: number;
  answer_text: string;      // HTML content
  answer_number: number;    // 1, 2, 3, 4, 5
  fraction: number;         // 1.0 for correct, 0.0 for incorrect
  feedback: string | null;  // HTML content
  createdAt: Date;
  updatedAt: Date;
}
```

### Topic
```typescript
{
  id: number;
  topic: string;
  subject: string;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🎨 Image Placeholders

The system uses Moodle-style image placeholders:
- **In Database:** `@@SERVERFILE@@/path/to/image.jpg`
- **Served to Frontend:** `http://localhost:5000/path/to/image.jpg`

Use the `replaceImagePlaceholders()` utility on the frontend to convert placeholders to actual URLs.

---

## 📝 Notes

1. **Answer Numbers:** Questions now support numbered answers (1-5) for better display
2. **Feedback System:** Both general feedback and per-answer feedback are supported
3. **HTML Content:** Question text, answers, and feedback support rich HTML content
4. **Image Support:** Images are handled via placeholder system
5. **Validation:** Answer numbers are constrained between 1-5
6. **Relationships:** Questions are linked to exams and optionally to topics

---

## 🧪 Example Frontend API Calls

### Fetch All Exams (React)
```javascript
import { fetchAllExams } from './api/exam';

const loadExams = async () => {
  try {
    const exams = await fetchAllExams();
    console.log('Exams:', exams);
  } catch (error) {
    console.error('Error loading exams:', error);
  }
};
```

### Fetch Exam Paper
```javascript
import { fetchExamPaper } from './api/exam';

const loadExamPaper = async (examId, subject, language) => {
  try {
    const questions = await fetchExamPaper(examId, subject, language);
    console.log('Questions:', questions);
  } catch (error) {
    console.error('Error loading exam paper:', error);
  }
};
```

### Create Question
```javascript
const createQuestion = async (questionData) => {
  try {
    const response = await fetch('http://localhost:5000/api/questions', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(questionData),
    });
    
    if (!response.ok) {
      throw new Error('Failed to create question');
    }
    
    const result = await response.json();
    console.log('Question created:', result);
  } catch (error) {
    console.error('Error creating question:', error);
  }
};
```

---

*Last Updated: July 1, 2025*
