import React, { useState, useEffect } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Card,
  CardContent,
  CardActions,
  Button,
  Chip,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Slider,
  Switch,
  FormControlLabel,
  Alert
} from '@mui/material';
import {
  PlayArrow as PlayIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Settings as SettingsIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const PracticeStartPage = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [practiceSettings, setPracticeSettings] = useState({
    subject: '',
    difficulty: 'mixed',
    questionCount: 10,
    timeLimit: 30,
    showAnswers: true,
    randomOrder: true
  });
  const [availableSubjects] = useState([
    'Mathematics',
    'Biology',
    'Physics',
    'Chemistry',
    'English',
    'Sinhala',
    'History',
    'Geography'
  ]);

  const difficultyLevels = [
    { value: 'easy', label: 'Easy', color: 'success' },
    { value: 'medium', label: 'Medium', color: 'warning' },
    { value: 'hard', label: 'Hard', color: 'error' },
    { value: 'mixed', label: 'Mixed', color: 'primary' }
  ];

  const handleSettingChange = (setting, value) => {
    setPracticeSettings(prev => ({
      ...prev,
      [setting]: value
    }));
  };

  const handleStartPractice = () => {
    // Navigate to practice session with settings
    navigate('/practice/session', { state: { settings: practiceSettings } });
  };

  const isLimitedUser = user?.userType === 'visitor' || user?.userType === 'guest_student';

  return (
    <Container maxWidth="md" sx={{ py: 4 }}>
      <Typography variant="h4" sx={{ mb: 1, fontWeight: 600 }}>
        <QuizIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
        Start Practice Session
      </Typography>
      <Typography variant="body1" color="text.secondary" sx={{ mb: 4 }}>
        Customize your practice session and start learning
      </Typography>

      <Grid container spacing={3}>
        {/* Practice Settings */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              <SettingsIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Practice Settings
            </Typography>

            <Grid container spacing={3}>
              {/* Subject Selection */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Subject</InputLabel>
                  <Select
                    value={practiceSettings.subject}
                    onChange={(e) => handleSettingChange('subject', e.target.value)}
                    label="Subject"
                  >
                    <MenuItem value="">All Subjects</MenuItem>
                    {availableSubjects.map((subject) => (
                      <MenuItem key={subject} value={subject}>
                        {subject}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Difficulty Level */}
              <Grid item xs={12} sm={6}>
                <FormControl fullWidth>
                  <InputLabel>Difficulty</InputLabel>
                  <Select
                    value={practiceSettings.difficulty}
                    onChange={(e) => handleSettingChange('difficulty', e.target.value)}
                    label="Difficulty"
                  >
                    {difficultyLevels.map((level) => (
                      <MenuItem key={level.value} value={level.value}>
                        <Chip 
                          label={level.label} 
                          size="small" 
                          color={level.color}
                          sx={{ mr: 1 }}
                        />
                        {level.label}
                      </MenuItem>
                    ))}
                  </Select>
                </FormControl>
              </Grid>

              {/* Number of Questions */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Number of Questions: {practiceSettings.questionCount}
                </Typography>
                <Slider
                  value={practiceSettings.questionCount}
                  onChange={(e, value) => handleSettingChange('questionCount', value)}
                  min={isLimitedUser ? 1 : 5}
                  max={isLimitedUser ? 5 : 50}
                  step={1}
                  marks={[
                    { value: isLimitedUser ? 1 : 5, label: isLimitedUser ? '1' : '5' },
                    { value: isLimitedUser ? 3 : 25, label: isLimitedUser ? '3' : '25' },
                    { value: isLimitedUser ? 5 : 50, label: isLimitedUser ? '5' : '50' }
                  ]}
                  disabled={isLimitedUser}
                />
                {isLimitedUser && (
                  <Typography variant="caption" color="text.secondary">
                    Limited to {user?.userType === 'visitor' ? '3' : '5'} questions in trial mode
                  </Typography>
                )}
              </Grid>

              {/* Time Limit */}
              <Grid item xs={12}>
                <Typography variant="body2" sx={{ mb: 2 }}>
                  Time Limit: {practiceSettings.timeLimit} minutes
                </Typography>
                <Slider
                  value={practiceSettings.timeLimit}
                  onChange={(e, value) => handleSettingChange('timeLimit', value)}
                  min={5}
                  max={120}
                  step={5}
                  marks={[
                    { value: 5, label: '5m' },
                    { value: 30, label: '30m' },
                    { value: 60, label: '1h' },
                    { value: 120, label: '2h' }
                  ]}
                />
              </Grid>

              {/* Additional Settings */}
              <Grid item xs={12}>
                <Box sx={{ display: 'flex', flexDirection: 'column', gap: 1 }}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={practiceSettings.showAnswers}
                        onChange={(e) => handleSettingChange('showAnswers', e.target.checked)}
                      />
                    }
                    label="Show correct answers after completion"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={practiceSettings.randomOrder}
                        onChange={(e) => handleSettingChange('randomOrder', e.target.checked)}
                      />
                    }
                    label="Randomize question order"
                  />
                </Box>
              </Grid>
            </Grid>
          </Paper>
        </Grid>

        {/* Session Summary */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, position: 'sticky', top: 20 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Session Summary
            </Typography>

            <Box sx={{ display: 'flex', flexDirection: 'column', gap: 2 }}>
              <Box>
                <Typography variant="body2" color="text.secondary">Subject</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {practiceSettings.subject || 'All Subjects'}
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Difficulty</Typography>
                <Chip 
                  label={difficultyLevels.find(d => d.value === practiceSettings.difficulty)?.label}
                  size="small"
                  color={difficultyLevels.find(d => d.value === practiceSettings.difficulty)?.color}
                />
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Questions</Typography>
                <Typography variant="body1" fontWeight={500}>
                  {practiceSettings.questionCount} questions
                </Typography>
              </Box>

              <Box>
                <Typography variant="body2" color="text.secondary">Time Limit</Typography>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                  <TimerIcon sx={{ mr: 0.5, fontSize: 16 }} />
                  <Typography variant="body1" fontWeight={500}>
                    {practiceSettings.timeLimit} minutes
                  </Typography>
                </Box>
              </Box>

              {/* User Limits Alert */}
              {isLimitedUser && (
                <Alert severity="info" sx={{ mt: 2 }}>
                  <Typography variant="body2">
                    <strong>Trial Limits:</strong><br />
                    • Max {user?.userType === 'visitor' ? '3' : '5'} questions<br />
                    • Basic features only
                  </Typography>
                </Alert>
              )}

              <Button
                variant="contained"
                size="large"
                fullWidth
                startIcon={<PlayIcon />}
                onClick={handleStartPractice}
                sx={{ mt: 2 }}
              >
                Start Practice
              </Button>

              <Typography variant="caption" sx={{ textAlign: 'center', color: 'text.secondary' }}>
                You can pause and resume anytime
              </Typography>
            </Box>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default PracticeStartPage;
