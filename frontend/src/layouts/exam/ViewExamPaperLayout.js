import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Box,
  Card,
  CardContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Alert,
  CircularProgress,
  Paper,
  Grid,
  Chip,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions
} from '@mui/material';
import { fetchAllExams, fetchExamPaper } from '../../api/exam';
import { replaceImagePlaceholders } from '../../utils/replaceImagePlaceholders';

const ViewExamPaperLayout = () => {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState('');
  const [selectedYear, setSelectedYear] = useState('');
  const [selectedSubject, setSelectedSubject] = useState('');
  const [selectedLanguage, setSelectedLanguage] = useState('');
  const [questions, setQuestions] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [examData, setExamData] = useState(null);
  const [modalOpen, setModalOpen] = useState(false);
  
  // Dynamic data based on selections
  const [availableExams, setAvailableExams] = useState([]);
  const [availableYears, setAvailableYears] = useState([]);
  const [availableSubjects, setAvailableSubjects] = useState([]);
  const [availableLanguages, setAvailableLanguages] = useState([]);

  useEffect(() => {
    loadExams();
  }, []);

  const loadExams = async () => {
    try {
      const examList = await fetchAllExams();
      setExams(examList || []);
      
      // Extract unique exam names
      const uniqueExams = [...new Set(examList.map(exam => exam.exam))];
      setAvailableExams(uniqueExams);
    } catch (err) {
      setError('Failed to load exams');
    }
  };

  // Reset all selections
  const resetSelections = () => {
    setSelectedExam('');
    setSelectedYear('');
    setSelectedSubject('');
    setSelectedLanguage('');
    setExamData(null);
    setAvailableYears([]);
    setAvailableSubjects([]);
    setAvailableLanguages([]);
  };

  // Handle exam selection and update available years
  const handleExamSelect = (examName) => {
    setSelectedExam(examName);
    setSelectedYear('');
    setSelectedSubject('');
    setSelectedLanguage('');
    setExamData(null);
    
    // Filter years for selected exam
    const examYears = exams
      .filter(exam => exam.exam === examName)
      .map(exam => exam.year);
    setAvailableYears([...new Set(examYears)].sort((a, b) => b - a)); // Sort years descending
    setAvailableSubjects([]);
    setAvailableLanguages([]);
  };

  // Handle year selection and update available subjects
  const handleYearSelect = (year) => {
    setSelectedYear(year);
    setSelectedSubject('');
    setSelectedLanguage('');
    setExamData(null);
    
    // Filter subjects for selected exam and year
    const examSubjects = exams
      .filter(exam => exam.exam === selectedExam && exam.year === year)
      .map(exam => exam.subject);
    setAvailableSubjects([...new Set(examSubjects)]);
    setAvailableLanguages([]);
  };

  // Handle subject selection and update available languages
  const handleSubjectSelect = (subject) => {
    setSelectedSubject(subject);
    setSelectedLanguage('');
    setExamData(null);
    
    // Filter languages for selected exam, year, and subject
    const examLanguages = exams
      .filter(exam => 
        exam.exam === selectedExam && 
        exam.year === selectedYear && 
        exam.subject === subject
      )
      .map(exam => exam.lang);
    setAvailableLanguages([...new Set(examLanguages)]);
  };

  // Handle language selection and set exam data
  const handleLanguageSelect = (language) => {
    setSelectedLanguage(language);
    
    // Find the complete exam data
    const exam = exams.find(e => 
      e.exam === selectedExam && 
      e.year === selectedYear && 
      e.subject === selectedSubject && 
      e.lang === language
    );
    setExamData(exam);
  };

  const handleCompleteSelection = () => {
    if (examData) {
      setModalOpen(false);
    }
  };

  const handleViewPaper = async () => {
    if (!examData) {
      setError('Please complete the exam selection');
      return;
    }

    setLoading(true);
    setError('');
    
    try {
      const examQuestions = await fetchExamPaper(examData.id, selectedSubject, selectedLanguage);
      setQuestions(examQuestions || []);
      
      if (!examQuestions || examQuestions.length === 0) {
        setError(`No questions found for the selected exam: ${selectedExam} (${selectedYear}) - ${selectedSubject} - ${selectedLanguage}`);
      }
    } catch (err) {
      setError(`Failed to load exam paper: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const renderQuestion = (question, index) => {
    // Debug: Log feedback data to console (keep for troubleshooting)
    console.log(`Question ${index + 1} feedback data:`, {
      generalfeedback: question.generalfeedback ? question.generalfeedback.substring(0, 50) + '...' : 'None',
      optionsWithNumbers: question.optionsWithNumbers?.map(opt => ({
        number: opt.number,
        text: opt.text?.substring(0, 30) + '...',
        feedback: opt.feedback ? opt.feedback.substring(0, 30) + '...' : 'None'
      })),
      optionsFeedback: question.optionsFeedback?.map(fb => fb ? fb.substring(0, 30) + '...' : 'None')
    });

    return (
    <Card 
      key={question._id || index} 
      sx={{ 
        border: '1px solid #e0e0e0',
        minHeight: '500px',
        maxWidth: '100%',
        width: '100%',
        display: 'flex',
        flexDirection: 'column'
      }}
    >
      <CardContent sx={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', mb: 2 }}>
          <Typography variant="h6" sx={{ fontWeight: 600 }}>
            Question {question.questionNumber || index + 1}
          </Typography>
          <Chip 
            label={`${question.marks || 1} mark${(question.marks || 1) > 1 ? 's' : ''}`}
            size="small"
            color="primary"
            variant="outlined"
          />
        </Box>
        
        <Box sx={{ mb: 2, minHeight: '60px', display: 'flex', alignItems: 'flex-start' }}>
          <div 
            dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(question.questionText) || 'Question text not available' }}
            style={{ fontSize: '16px', lineHeight: '1.6', width: '100%' }}
          />
        </Box>

        {question.generalfeedback && (
          <Box sx={{ mb: 3, p: 2, backgroundColor: '#e3f2fd', borderRadius: 1, border: '1px solid #2196f3' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600, color: '#1976d2' }}>
              📝 General Feedback:
            </Typography>
            <div 
              dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(question.generalfeedback) }}
              style={{ fontSize: '14px', lineHeight: '1.5', color: '#1565c0' }}
            />
          </Box>
        )}

        {question.options && question.options.length > 0 && (
          <Box sx={{ mb: 2, flex: 1, display: 'flex', flexDirection: 'column' }}>
            <Typography variant="subtitle2" sx={{ mb: 1, fontWeight: 600 }}>
              Choices:
            </Typography>
            {question.optionsWithNumbers ? (
              question.optionsWithNumbers.map((option) => {
                const isCorrect = question.correctAnswer === option.number || 
                                (question.correctAnswers && question.correctAnswers.includes(option.number));
                return (
                  <Box key={option.number} sx={{ mb: 1.5 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        minHeight: '50px',
                        borderRadius: 1,
                        bgcolor: isCorrect ? '#e8f5e8' : 'transparent',
                        border: isCorrect ? '2px solid #4caf50' : '1px solid #e0e0e0',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <Typography sx={{ 
                        minWidth: '30px', 
                        fontWeight: isCorrect ? 700 : 500, 
                        flexShrink: 0,
                        color: isCorrect ? '#2e7d32' : 'inherit',
                        marginRight: '6px'
                      }}>
                        ({option.number})
                      </Typography>
                      <div 
                        dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(option.text) }}
                        style={{ 
                          fontSize: '16px', 
                          lineHeight: '1.5',
                          flex: 1,
                          fontWeight: isCorrect ? '600' : 'normal',
                          color: isCorrect ? '#2e7d32' : 'inherit',
                          textAlign: 'left'
                        }}
                      />
                      {isCorrect && (
                        <Typography sx={{ 
                          marginLeft: '8px',
                          color: '#2e7d32',
                          fontWeight: 700,
                          fontSize: '16px',
                          flexShrink: 0
                        }}>
                          ✓
                        </Typography>
                      )}
                    </Box>
                    {option.feedback && option.feedback.trim() && (
                      <Box sx={{ 
                        mt: 1, 
                        ml: 4,
                        p: 1.5, 
                        bgcolor: '#fff8e1', 
                        borderRadius: 1, 
                        border: '1px solid #ffcc02',
                        borderLeft: '4px solid #ff9800'
                      }}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600, 
                          color: '#e65100', 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: '11px'
                        }}>
                          💡 FEEDBACK:
                        </Typography>
                        <div 
                          dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(option.feedback) }}
                          style={{ fontSize: '13px', lineHeight: '1.4', color: '#bf360c' }}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })
            ) : (
              question.options.map((option, idx) => {
                const isCorrect = question.correctAnswer === (idx + 1) || 
                                (question.correctAnswers && question.correctAnswers.includes(idx + 1));
                return (
                  <Box key={idx} sx={{ mb: 1.5 }}>
                    <Box 
                      sx={{ 
                        display: 'flex', 
                        alignItems: 'center',
                        p: 1.5,
                        minHeight: '50px',
                        borderRadius: 1,
                        bgcolor: isCorrect ? '#e8f5e8' : 'transparent',
                        border: isCorrect ? '2px solid #4caf50' : '1px solid #e0e0e0',
                        transition: 'all 0.2s ease-in-out'
                      }}
                    >
                      <Typography sx={{ 
                        minWidth: '30px', 
                        fontWeight: isCorrect ? 700 : 500, 
                        flexShrink: 0,
                        color: isCorrect ? '#2e7d32' : 'inherit',
                        marginRight: '6px'
                      }}>
                        ({idx + 1})
                      </Typography>
                      <div 
                        dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(option) }}
                        style={{ 
                          fontSize: '16px', 
                          lineHeight: '1.5',
                          flex: 1,
                          fontWeight: isCorrect ? '600' : 'normal',
                          color: isCorrect ? '#2e7d32' : 'inherit',
                          textAlign: 'left'
                        }}
                      />
                      {isCorrect && (
                        <Typography sx={{ 
                          marginLeft: '8px',
                          color: '#2e7d32',
                          fontWeight: 700,
                          fontSize: '16px',
                          flexShrink: 0
                        }}>
                          ✓
                        </Typography>
                      )}
                    </Box>
                    {question.optionsFeedback && question.optionsFeedback[idx] && question.optionsFeedback[idx].trim() && (
                      <Box sx={{ 
                        mt: 1, 
                        ml: 4,
                        p: 1.5, 
                        bgcolor: '#fff8e1', 
                        borderRadius: 1, 
                        border: '1px solid #ffcc02',
                        borderLeft: '4px solid #ff9800'
                      }}>
                        <Typography variant="caption" sx={{ 
                          fontWeight: 600, 
                          color: '#e65100', 
                          display: 'block', 
                          mb: 0.5,
                          fontSize: '11px'
                        }}>
                          💡 FEEDBACK:
                        </Typography>
                        <div 
                          dangerouslySetInnerHTML={{ __html: replaceImagePlaceholders(question.optionsFeedback[idx]) }}
                          style={{ fontSize: '13px', lineHeight: '1.4', color: '#bf360c' }}
                        />
                      </Box>
                    )}
                  </Box>
                );
              })
            )}
          </Box>
        )}
      </CardContent>
    </Card>
    );
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, fontWeight: 600 }}>
        View Exam Paper
      </Typography>

      {/* Exam Selection Card - Full Width */}
      <Paper sx={{ p: 3, mb: 3 }}>
        <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
          Exam Selection
        </Typography>

        <Grid container spacing={2} alignItems="center">
          <Grid item xs={12} md={8}>
            <Button
              variant="outlined"
              fullWidth
              sx={{ py: 1.5, textAlign: 'left', justifyContent: 'flex-start' }}
              onClick={() => setModalOpen(true)}
            >
              {examData 
                ? `${selectedExam} (${selectedYear}) - ${selectedSubject} - ${selectedLanguage}`
                : 'Select Exam Details'
              }
            </Button>
          </Grid>
          <Grid item xs={12} md={4}>
            <Button
              variant="contained"
              fullWidth
              onClick={handleViewPaper}
              disabled={!examData || loading}
              sx={{ py: 1.5 }}
            >
              {loading ? <CircularProgress size={24} /> : 'View Exam Paper'}
            </Button>
          </Grid>
        </Grid>

        {examData && (
          <Box sx={{ mt: 3, p: 2, bgcolor: 'grey.50', borderRadius: 1 }}>
            <Grid container spacing={2}>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Exam:</strong> {selectedExam}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Year:</strong> {selectedYear}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Subject:</strong> {selectedSubject}
                </Typography>
              </Grid>
              <Grid item xs={6} sm={3}>
                <Typography variant="body2" color="text.secondary">
                  <strong>Language:</strong> {selectedLanguage}
                </Typography>
              </Grid>
            </Grid>
          </Box>
        )}
      </Paper>

      {/* Error Messages */}
      {error && (
        <Alert severity="error" sx={{ mb: 3 }}>
          {error}
        </Alert>
      )}

      {/* Questions Section - Full Width */}
      {questions.length > 0 && (
        <Box>
          <Typography variant="h5" sx={{ mb: 3, fontWeight: 600 }}>
            {selectedExam} ({selectedYear}) - {selectedSubject} - {selectedLanguage}
          </Typography>
          <Box sx={{ display: 'flex', flexDirection: 'column', gap: 3 }}>
            {questions.map((question, index) => renderQuestion(question, index))}
          </Box>
        </Box>
      )}

      {/* Selection Modal */}
      <Dialog open={modalOpen} onClose={() => setModalOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Select Exam Details</DialogTitle>
        <DialogContent>
          <Box sx={{ pt: 1 }}>
            {/* Step 1: Exam Selection */}
            <FormControl fullWidth sx={{ mb: 3 }}>
              <InputLabel>1. Select Exam</InputLabel>
              <Select
                value={selectedExam}
                onChange={(e) => handleExamSelect(e.target.value)}
                label="1. Select Exam"
              >
                {availableExams.map((exam) => (
                  <MenuItem key={exam} value={exam}>
                    {exam}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Step 2: Year Selection */}
            <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedExam}>
              <InputLabel>2. Select Year</InputLabel>
              <Select
                value={selectedYear}
                onChange={(e) => handleYearSelect(e.target.value)}
                label="2. Select Year"
              >
                {availableYears.map((year) => (
                  <MenuItem key={year} value={year}>
                    {year}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Step 3: Subject Selection */}
            <FormControl fullWidth sx={{ mb: 3 }} disabled={!selectedYear}>
              <InputLabel>3. Select Subject</InputLabel>
              <Select
                value={selectedSubject}
                onChange={(e) => handleSubjectSelect(e.target.value)}
                label="3. Select Subject"
              >
                {availableSubjects.map((subject) => (
                  <MenuItem key={subject} value={subject}>
                    {subject}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>

            {/* Step 4: Language Selection */}
            <FormControl fullWidth sx={{ mb: 2 }} disabled={!selectedSubject}>
              <InputLabel>4. Select Language</InputLabel>
              <Select
                value={selectedLanguage}
                onChange={(e) => handleLanguageSelect(e.target.value)}
                label="4. Select Language"
              >
                {availableLanguages.map((language) => (
                  <MenuItem key={language} value={language}>
                    {language}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions>
          <Button onClick={resetSelections}>Reset</Button>
          <Button onClick={() => setModalOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleCompleteSelection} 
            variant="contained"
            disabled={!examData}
          >
            Complete Selection
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default ViewExamPaperLayout;
