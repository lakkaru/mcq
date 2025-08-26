import React, { useState, useEffect } from 'react';
import {
  Container,
  Paper,
  Typography,
  TextField,
  Select,
  MenuItem,
  Button,
  FormControl,
  InputLabel,
  Box,
  Grid,
  Alert,
  Card,
  CardContent,
  CardActions,
  Chip,
  Stack
} from '@mui/material';
import { fetchAllExams, fetchExamById, updateExam } from '../../api/exam';

const EXAM_NAMES = ['G.C.E. A/L', 'G.C.E. O/L'];
const EXAM_YEARS = Array.from({length: new Date().getFullYear() - 2014 + 1}, (_, i) => (2014 + i).toString());
const SYLLABUS_TYPES = ['', 'Old', 'New']; // Blank, Old, New
const SUBJECTS = ['Physics', 'Chemistry', 'Biology'];
const LANGUAGES = ['Sinhala', 'English', 'Tamil'];

export default function UpdateExamLayout() {
  const [exams, setExams] = useState([]);
  const [selectedExam, setSelectedExam] = useState(null);
  const [form, setForm] = useState({
    exam: '',
    year: '',
    syllabus: '', // New field for syllabus type
    subject: '',
    lang: ''
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [fetchingExams, setFetchingExams] = useState(true);
  const [updatingExam, setUpdatingExam] = useState(false);

  // Fetch all exams on component mount
  useEffect(() => {
    const loadExams = async () => {
      try {
        setFetchingExams(true);
        setError(null);
        const examsData = await fetchAllExams();
        setExams(examsData);
      } catch (err) {
        setError(err.message);
      } finally {
        setFetchingExams(false);
      }
    };
    loadExams();
  }, []);

  // Handle exam selection
  const handleExamSelect = async (exam) => {
    setError(null);
    setSuccess(null);
    setLoading(true);
    try {
      // Fetch full exam details
      const examDetails = await fetchExamById(exam.id);
      setSelectedExam(examDetails);
      
      // Parse the year field to extract year and syllabus
      const yearField = examDetails.year || '';
      let parsedYear = '';
      let parsedSyllabus = '';
      
      // Check if year contains syllabus info like "2023 (Old Syllabus)"
      const syllabusMatch = yearField.match(/^(\d{4})\s*\((Old|New)\s*Syllabus\)$/);
      if (syllabusMatch) {
        parsedYear = syllabusMatch[1];
        parsedSyllabus = syllabusMatch[2];
      } else {
        // If no syllabus info, use the year as-is
        parsedYear = yearField;
        parsedSyllabus = '';
      }
      
      setForm({
        exam: examDetails.exam,
        year: parsedYear,
        syllabus: parsedSyllabus,
        subject: examDetails.subject,
        lang: examDetails.lang
      });
    } catch (err) {
      setError(err.message);
      setSelectedExam(null);
    } finally {
      setLoading(false);
    }
  };

  // Handle form changes
  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    if (!selectedExam) return;

    // console.log('[UpdateExam] Submitting update for exam:', selectedExam);
    // console.log('[UpdateExam] Form data:', form);
    // console.log('[UpdateExam] Exam ID:', selectedExam.id);

    setError(null);
    setSuccess(null);
    setUpdatingExam(true);
    
    try {
      // Combine year and syllabus for the database
      const combinedYear = form.syllabus 
        ? `${form.year} (${form.syllabus} Syllabus)`
        : form.year;
      
      const payload = {
        exam: form.exam,
        year: combinedYear,
        subject: form.subject,
        lang: form.lang
      };

      const result = await updateExam(selectedExam.id, payload);
      // console.log('[UpdateExam] Update successful:', result);
      setSuccess('Exam updated successfully!');
      
      // Update the exam in the local list
      setExams(prev => prev.map(exam => 
        exam.id === selectedExam.id 
          ? { ...exam, ...payload }
          : exam
      ));
      
      // Update selected exam
      setSelectedExam(prev => ({ ...prev, ...payload }));
      
    } catch (err) {
      // console.error('[UpdateExam] Update failed:', err);
      setError(err.message);
    } finally {
      setUpdatingExam(false);
    }
  };

  // Reset selection
  const handleClearSelection = () => {
    setSelectedExam(null);
    setForm({ exam: '', year: '', syllabus: '', subject: '', lang: '' });
    setError(null);
    setSuccess(null);
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h4" fontWeight="bold" align="center" gutterBottom>
          Update Exam
        </Typography>
        
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}

        <Grid container spacing={4}>
          {/* Left Side - Exam Selection */}
          <Grid item xs={12} md={6}>
            <Typography variant="h6" fontWeight="bold" sx={{ mb: 2 }}>
              Select Exam to Update
            </Typography>
            
            {fetchingExams ? (
              <Alert severity="info">Loading exams...</Alert>
            ) : exams.length === 0 ? (
              <Alert severity="warning">No exams found.</Alert>
            ) : (
              <Stack spacing={2} sx={{ maxHeight: '60vh', overflowY: 'auto', pb: 3 }}>
                {exams.map((exam) => (
                  <Card 
                    key={exam.id} 
                    variant="outlined"
                    sx={{ 
                      cursor: 'pointer',
                      border: selectedExam?.id === exam.id ? '2px solid primary.main' : '1px solid',
                      borderColor: selectedExam?.id === exam.id ? 'primary.main' : 'divider',
                      '&:hover': {
                        borderColor: 'primary.main',
                        transform: 'translateY(-2px)',
                        boxShadow: 2,
                      },
                      transition: 'all 0.2s ease-in-out',
                      minHeight: '120px'
                    }}
                    onClick={() => handleExamSelect(exam)}
                  >
                    <CardContent>
                      <Typography variant="h6" fontWeight="bold" gutterBottom>
                        {exam.exam} - {exam.year}
                      </Typography>
                      <Stack direction="row" spacing={1} flexWrap="wrap" useFlexGap>
                        <Chip 
                          label={exam.subject} 
                          color="primary" 
                          size="small" 
                          variant="outlined"
                        />
                        <Chip 
                          label={exam.lang} 
                          color="secondary" 
                          size="small" 
                          variant="outlined"
                        />
                      </Stack>
                    </CardContent>
                    <CardActions sx={{ justifyContent: 'flex-end', visibility: 'hidden' }}>
                      <Button size="small" color="primary">
                        Select
                      </Button>
                    </CardActions>
                  </Card>
                ))}
              </Stack>
            )}
          </Grid>

          {/* Right Side - Update Form */}
          <Grid item xs={12} md={6}>
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
              <Typography variant="h6" fontWeight="bold">
                Update Exam Details
              </Typography>
              {selectedExam && (
                <Button 
                  variant="outlined" 
                  size="small" 
                  onClick={handleClearSelection}
                  sx={{ ml: 3 }}
                >
                  Clear Selection
                </Button>
              )}
            </Box>

            {!selectedExam ? (
              <Alert severity="info">
                Please select an exam from the left to update its details.
              </Alert>
            ) : (
              <Box component="form" onSubmit={handleSubmit}>
                <Grid container spacing={2} direction="column">
                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="exam-label">Exam Name</InputLabel>
                      <Select
                        labelId="exam-label"
                        name="exam"
                        value={form.exam}
                        label="Exam Name"
                        onChange={handleChange}
                        disabled={loading || updatingExam}
                      >
                        {EXAM_NAMES.map(name => (
                          <MenuItem key={name} value={name}>{name}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="year-label">Exam Year</InputLabel>
                      <Select
                        labelId="year-label"
                        name="year"
                        value={form.year}
                        label="Exam Year"
                        onChange={handleChange}
                        disabled={loading || updatingExam}
                      >
                        {EXAM_YEARS.map(year => (
                          <MenuItem key={year} value={year}>{year}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth>
                      <InputLabel id="syllabus-label">Syllabus Type</InputLabel>
                      <Select
                        labelId="syllabus-label"
                        name="syllabus"
                        value={form.syllabus}
                        label="Syllabus Type"
                        onChange={handleChange}
                        disabled={loading || updatingExam}
                      >
                        {SYLLABUS_TYPES.map(syllabus => (
                          <MenuItem key={syllabus} value={syllabus}>
                            {syllabus === '' ? 'Not Specified' : `${syllabus} Syllabus`}
                          </MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="subject-label">Subject</InputLabel>
                      <Select
                        labelId="subject-label"
                        name="subject"
                        value={form.subject}
                        label="Subject"
                        onChange={handleChange}
                        disabled={loading || updatingExam}
                      >
                        {SUBJECTS.map(subject => (
                          <MenuItem key={subject} value={subject}>{subject}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>

                  <Grid item xs={12}>
                    <FormControl fullWidth required>
                      <InputLabel id="lang-label">Language</InputLabel>
                      <Select
                        labelId="lang-label"
                        name="lang"
                        value={form.lang}
                        label="Language"
                        onChange={handleChange}
                        disabled={loading || updatingExam}
                      >
                        {LANGUAGES.map(lang => (
                          <MenuItem key={lang} value={lang}>{lang}</MenuItem>
                        ))}
                      </Select>
                    </FormControl>
                  </Grid>
                </Grid>

                <Box sx={{ textAlign: 'center', mt: 4 }}>
                  <Button
                    type="submit"
                    variant="contained"
                    color="primary"
                    size="large"
                    disabled={loading || updatingExam}
                    sx={{ px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
                  >
                    {updatingExam ? 'Updating...' : 'Update Exam'}
                  </Button>
                </Box>
              </Box>
            )}
          </Grid>
        </Grid>
      </Paper>
    </Container>
  );
}
