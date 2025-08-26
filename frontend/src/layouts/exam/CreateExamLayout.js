import React, { useState } from 'react'
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
  Alert
} from '@mui/material'

const EXAM_NAMES = ['G.C.E. A/L', 'G.C.E. O/L'];
const EXAM_YEARS = Array.from({length: new Date().getFullYear() - 2014 + 1}, (_, i) => (2014 + i).toString());
const SYLLABUS_TYPES = ['', 'Old', 'New']; // Blank, Old, New
const SUBJECTS = ['Physics', 'Chemistry', 'Biology'];
const LANGUAGES = ['Sinhala', 'English', 'Tamil'];

export default function CreateExamLayout() {
  const [form, setForm] = useState({
    exam: 'G.C.E. A/L',
    year: '',
    syllabus: '', // New field for syllabus type
    subject: '',
    lang: 'Sinhala'
  });
  const [success, setSuccess] = useState(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm(prev => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setLoading(true);
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
      
      const response = await fetch('http://localhost:5000/api/exams/', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(payload),
      });
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create exam.');
      }
      setSuccess('Exam created successfully!');
      setForm({ exam: 'G.C.E. A/L', year: '', syllabus: '', subject: '', lang: 'Sinhala' });
    } catch (err) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="sm" sx={{ py: 4 }}>
      <Paper elevation={3} sx={{ p: 4, borderRadius: 3, mt: 4 }}>
        <Typography variant="h5" fontWeight="bold" align="center" gutterBottom>
          Create New Exam
        </Typography>
        {error && <Alert severity="error" sx={{ mb: 2 }}>{error}</Alert>}
        {success && <Alert severity="success" sx={{ mb: 2 }}>{success}</Alert>}
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
              disabled={loading}
              sx={{ px: 6, py: 2, fontWeight: 'bold', fontSize: '1.1rem' }}
            >
              {loading ? 'Creating...' : 'Create Exam'}
            </Button>
          </Box>
        </Box>
      </Paper>
    </Container>
  );
}
