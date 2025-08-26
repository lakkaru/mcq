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
  LinearProgress,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  Tabs,
  Tab,
  Divider
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  TrendingUp as TrendingUpIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Assignment as AssignmentIcon,
  EmojiEvents as TrophyIcon,
  CalendarToday as CalendarIcon,
  TimerOutlined as TimerIcon,
  CheckCircle as CheckCircleIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const StudentDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [activeTab, setActiveTab] = useState(0);
  const [studentData, setStudentData] = useState({
    examsTaken: 0,
    averageScore: 0,
    totalStudyTime: 0,
    streak: 0,
    recentExams: [],
    upcomingExams: [],
    achievements: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadStudentData();
  }, []);

  const loadStudentData = async () => {
    try {
      // TODO: Implement API calls to fetch student data
      // For now, using mock data
      setStudentData({
        examsTaken: 24,
        averageScore: 78,
        totalStudyTime: 120, // in hours
        streak: 5,
        recentExams: [
          { id: 1, name: 'A/L Biology 2023', score: 85, date: '2 days ago', status: 'completed' },
          { id: 2, name: 'O/L Mathematics', score: 72, date: '1 week ago', status: 'completed' },
          { id: 3, name: 'A/L Physics 2023', score: 90, date: '2 weeks ago', status: 'completed' }
        ],
        upcomingExams: [
          { id: 4, name: 'A/L Chemistry Mock', date: 'Tomorrow 2:00 PM', type: 'Mock Exam' },
          { id: 5, name: 'O/L English Practice', date: 'Next Week', type: 'Practice' }
        ],
        achievements: [
          { id: 1, title: 'First Exam Completed', icon: '🎯', date: '1 month ago' },
          { id: 2, title: '5 Day Streak', icon: '🔥', date: '1 week ago' },
          { id: 3, title: 'High Scorer', icon: '⭐', date: '3 days ago' }
        ]
      });
    } catch (error) {
      console.error('Error loading student data:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleTabChange = (event, newValue) => {
    setActiveTab(newValue);
  };

  const practiceOptions = [
    {
      title: 'A/L Exam Papers',
      description: 'Advanced Level past papers and practice questions',
      icon: <SchoolIcon />,
      color: 'primary',
      subjects: ['Biology', 'Physics', 'Chemistry', 'Mathematics'],
      action: () => navigate('/exams/view-paper')
    },
    {
      title: 'O/L Exam Papers',
      description: 'Ordinary Level exam preparation',
      icon: <AssignmentIcon />,
      color: 'secondary',
      subjects: ['Mathematics', 'Science', 'English', 'Sinhala'],
      action: () => navigate('/exams/view-paper')
    },
    {
      title: 'Quick Practice',
      description: 'Short quiz sessions for quick revision',
      icon: <TimerIcon />,
      color: 'info',
      subjects: ['Random Questions', 'Topic-wise'],
      action: () => navigate('/practice/start')
    }
  ];

  const statisticsCards = [
    {
      title: 'Exams Taken',
      value: studentData.examsTaken,
      icon: <QuizIcon sx={{ fontSize: 35 }} />,
      color: 'primary.main',
      bgColor: 'primary.light'
    },
    {
      title: 'Average Score',
      value: `${studentData.averageScore}%`,
      icon: <TrendingUpIcon sx={{ fontSize: 35 }} />,
      color: 'success.main',
      bgColor: 'success.light'
    },
    {
      title: 'Study Time',
      value: `${studentData.totalStudyTime}h`,
      icon: <ScheduleIcon sx={{ fontSize: 35 }} />,
      color: 'info.main',
      bgColor: 'info.light'
    },
    {
      title: 'Current Streak',
      value: `${studentData.streak} days`,
      icon: <StarIcon sx={{ fontSize: 35 }} />,
      color: 'warning.main',
      bgColor: 'warning.light'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading your dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
            {user?.firstName?.charAt(0) || 'S'}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              Welcome back, {user?.firstName || 'Student'}!
            </Typography>
            <Typography variant="body1" color="text.secondary">
              Ready to continue your learning journey?
            </Typography>
          </Box>
        </Box>
        
        {/* Account Status */}
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="body2">
            <strong>Account Status:</strong> Full Access • 
            Member since {new Date(user?.createdAt || Date.now()).toLocaleDateString()}
          </Typography>
        </Alert>
      </Box>

      {/* Statistics Cards */}
      <Grid container spacing={3} sx={{ mb: 4 }}>
        {statisticsCards.map((card, index) => (
          <Grid item xs={12} sm={6} md={3} key={index}>
            <Card sx={{ 
              height: '100%',
              background: `linear-gradient(135deg, ${card.bgColor}20 0%, ${card.bgColor}10 100%)`,
              border: `1px solid ${card.bgColor}40`
            }}>
              <CardContent>
                <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <Box>
                    <Typography variant="h5" sx={{ fontWeight: 700, color: card.color }}>
                      {card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {card.title}
                    </Typography>
                  </Box>
                  <Box sx={{ color: card.color, opacity: 0.8 }}>
                    {card.icon}
                  </Box>
                </Box>
              </CardContent>
            </Card>
          </Grid>
        ))}
      </Grid>

      {/* Main Content Tabs */}
      <Paper sx={{ mb: 4 }}>
        <Tabs value={activeTab} onChange={handleTabChange} sx={{ px: 3, pt: 2 }}>
          <Tab label="Practice Exams" />
          <Tab label="Recent Activity" />
          <Tab label="Achievements" />
        </Tabs>
        
        <Box sx={{ p: 3 }}>
          {/* Practice Exams Tab */}
          {activeTab === 0 && (
            <Grid container spacing={3}>
              {practiceOptions.map((option, index) => (
                <Grid item xs={12} md={4} key={index}>
                  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={option.action}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          icon={option.icon} 
                          label="" 
                          color={option.color}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {option.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.description}
                      </Typography>
                      <Box sx={{ display: 'flex', flexWrap: 'wrap', gap: 0.5 }}>
                        {option.subjects.map((subject, idx) => (
                          <Chip 
                            key={idx} 
                            label={subject} 
                            size="small" 
                            variant="outlined"
                            color={option.color}
                          />
                        ))}
                      </Box>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color={option.color} endIcon={<SchoolIcon />}>
                        Start Practice
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          )}

          {/* Recent Activity Tab */}
          {activeTab === 1 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                Recent Exam Results
              </Typography>
              <List>
                {studentData.recentExams.map((exam, index) => (
                  <React.Fragment key={exam.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CheckCircleIcon 
                          color={exam.score >= 80 ? 'success' : exam.score >= 60 ? 'warning' : 'error'} 
                        />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight={500}>
                              {exam.name}
                            </Typography>
                            <Chip 
                              label={`${exam.score}%`}
                              size="small"
                              color={exam.score >= 80 ? 'success' : exam.score >= 60 ? 'warning' : 'error'}
                            />
                          </Box>
                        }
                        secondary={`Completed ${exam.date}`}
                      />
                    </ListItem>
                    {index < studentData.recentExams.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
              
              <Typography variant="h6" sx={{ mb: 3, mt: 4, fontWeight: 600 }}>
                Upcoming Sessions
              </Typography>
              <List>
                {studentData.upcomingExams.map((exam, index) => (
                  <React.Fragment key={exam.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <CalendarIcon color="primary" />
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                            <Typography variant="body1" fontWeight={500}>
                              {exam.name}
                            </Typography>
                            <Chip 
                              label={exam.type}
                              size="small"
                              variant="outlined"
                              color="primary"
                            />
                          </Box>
                        }
                        secondary={exam.date}
                      />
                    </ListItem>
                    {index < studentData.upcomingExams.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}

          {/* Achievements Tab */}
          {activeTab === 2 && (
            <Box>
              <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
                <TrophyIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
                Your Achievements
              </Typography>
              <List>
                {studentData.achievements.map((achievement, index) => (
                  <React.Fragment key={achievement.id}>
                    <ListItem sx={{ px: 0 }}>
                      <ListItemIcon>
                        <Avatar sx={{ bgcolor: 'primary.light' }}>
                          {achievement.icon}
                        </Avatar>
                      </ListItemIcon>
                      <ListItemText
                        primary={
                          <Typography variant="body1" fontWeight={500}>
                            {achievement.title}
                          </Typography>
                        }
                        secondary={`Earned ${achievement.date}`}
                      />
                    </ListItem>
                    {index < studentData.achievements.length - 1 && <Divider />}
                  </React.Fragment>
                ))}
              </List>
            </Box>
          )}
        </Box>
      </Paper>
    </Container>
  );
};

export default StudentDashboard;


