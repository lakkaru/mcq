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
  Divider,
  Fab
} from '@mui/material';
import {
  Add as AddIcon,
  Quiz as QuizIcon,
  School as SchoolIcon,
  People as PeopleIcon,
  Assessment as AssessmentIcon,
  Settings as SettingsIcon,
  TrendingUp as TrendingUpIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  Dashboard as DashboardIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const AdminDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [stats, setStats] = useState({
    totalQuestions: 0,
    totalExams: 0,
    totalUsers: 0,
    recentActivity: []
  });
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    loadDashboardData();
  }, []);

  const loadDashboardData = async () => {
    try {
      // TODO: Implement API calls to fetch dashboard statistics
      // For now, using mock data
      setStats({
        totalQuestions: 1250,
        totalExams: 45,
        totalUsers: 324,
        recentActivity: [
          { id: 1, action: 'New exam created', time: '2 hours ago', type: 'exam' },
          { id: 2, action: '15 questions added', time: '4 hours ago', type: 'question' },
          { id: 3, action: 'User registered', time: '6 hours ago', type: 'user' },
          { id: 4, action: 'Exam paper updated', time: '1 day ago', type: 'exam' }
        ]
      });
    } catch (error) {
      console.error('Error loading dashboard data:', error);
    } finally {
      setLoading(false);
    }
  };

  const quickActions = [
    {
      title: 'Create Question',
      description: 'Add new questions to the question bank',
      icon: <AddIcon />,
      color: 'primary',
      action: () => navigate('/questions/create')
    },
    {
      title: 'Create Exam',
      description: 'Create a new exam paper',
      icon: <SchoolIcon />,
      color: 'secondary',
      action: () => navigate('/exams/create')
    },
    {
      title: 'View Exam Papers',
      description: 'Browse and review exam papers',
      icon: <VisibilityIcon />,
      color: 'info',
      action: () => navigate('/exams/view-paper')
    },
    {
      title: 'Update Questions',
      description: 'Edit existing questions',
      icon: <EditIcon />,
      color: 'warning',
      action: () => navigate('/questions/update')
    }
  ];

  const statisticsCards = [
    {
      title: 'Total Questions',
      value: stats.totalQuestions,
      icon: <QuizIcon sx={{ fontSize: 40 }} />,
      color: 'primary.main',
      bgColor: 'primary.light',
      change: '+12%'
    },
    {
      title: 'Total Exams',
      value: stats.totalExams,
      icon: <AssessmentIcon sx={{ fontSize: 40 }} />,
      color: 'secondary.main',
      bgColor: 'secondary.light',
      change: '+8%'
    },
    {
      title: 'Total Users',
      value: stats.totalUsers,
      icon: <PeopleIcon sx={{ fontSize: 40 }} />,
      color: 'success.main',
      bgColor: 'success.light',
      change: '+23%'
    },
    {
      title: 'System Health',
      value: '99.9%',
      icon: <TrendingUpIcon sx={{ fontSize: 40 }} />,
      color: 'info.main',
      bgColor: 'info.light',
      change: 'Excellent'
    }
  ];

  if (loading) {
    return (
      <Container maxWidth="lg" sx={{ py: 4 }}>
        <LinearProgress />
        <Typography sx={{ mt: 2 }}>Loading dashboard...</Typography>
      </Container>
    );
  }

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Typography variant="h4" sx={{ fontWeight: 600, mb: 1 }}>
          <DashboardIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
          Admin Dashboard
        </Typography>
        <Typography variant="h6" color="text.secondary">
          Welcome back, {user?.firstName || 'Administrator'}! Here's your system overview.
        </Typography>
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
                    <Typography variant="h4" sx={{ fontWeight: 700, color: card.color }}>
                      {typeof card.value === 'number' ? card.value.toLocaleString() : card.value}
                    </Typography>
                    <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                      {card.title}
                    </Typography>
                    <Chip 
                      label={card.change} 
                      size="small" 
                      color={card.change.includes('+') ? 'success' : 'info'}
                      variant="outlined"
                    />
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

      <Grid container spacing={3}>
        {/* Quick Actions */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Quick Actions
            </Typography>
            <Grid container spacing={2}>
              {quickActions.map((action, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card sx={{ height: '100%', cursor: 'pointer' }} onClick={action.action}>
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          icon={action.icon} 
                          label="" 
                          color={action.color}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {action.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary">
                        {action.description}
                      </Typography>
                    </CardContent>
                    <CardActions>
                      <Button size="small" color={action.color}>
                        Go to {action.title}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Recent Activity */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              Recent Activity
            </Typography>
            <List disablePadding>
              {stats.recentActivity.map((activity, index) => (
                <React.Fragment key={activity.id}>
                  <ListItem sx={{ px: 0 }}>
                    <ListItemIcon>
                      {activity.type === 'exam' && <AssessmentIcon color="primary" />}
                      {activity.type === 'question' && <QuizIcon color="secondary" />}
                      {activity.type === 'user' && <PeopleIcon color="success" />}
                    </ListItemIcon>
                    <ListItemText
                      primary={activity.action}
                      secondary={activity.time}
                      primaryTypographyProps={{ variant: 'body2', fontWeight: 500 }}
                      secondaryTypographyProps={{ variant: 'caption' }}
                    />
                  </ListItem>
                  {index < stats.recentActivity.length - 1 && <Divider />}
                </React.Fragment>
              ))}
            </List>
          </Paper>
        </Grid>
      </Grid>

      {/* System Status Alert */}
      <Alert 
        severity="success" 
        sx={{ mt: 3 }}
        icon={<SettingsIcon />}
      >
        <Typography variant="body2">
          <strong>System Status:</strong> All services are running normally. 
          Last backup completed successfully 2 hours ago.
        </Typography>
      </Alert>

      {/* Floating Action Button */}
      <Fab
        color="primary"
        sx={{
          position: 'fixed',
          bottom: 24,
          right: 24,
        }}
        onClick={() => navigate('/questions/create')}
      >
        <AddIcon />
      </Fab>
    </Container>
  );
};

export default AdminDashboard;
