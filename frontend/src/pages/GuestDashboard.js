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
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Avatar,
  LinearProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField
} from '@mui/material';
import {
  School as SchoolIcon,
  Quiz as QuizIcon,
  Timer as TimerIcon,
  Assignment as AssignmentIcon,
  Lock as LockIcon,
  Upgrade as UpgradeIcon,
  Schedule as ScheduleIcon,
  Star as StarIcon,
  Warning as WarningIcon,
  Email as EmailIcon,
  Phone as PhoneIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../contexts/AuthContext';

const GuestDashboard = () => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const [upgradeDialogOpen, setUpgradeDialogOpen] = useState(false);
  const [trialStatus, setTrialStatus] = useState({
    daysRemaining: 0,
    examsUsed: 0,
    examsLimit: 5
  });
  const [upgradeForm, setUpgradeForm] = useState({
    email: user?.email || '',
    phone: user?.phone || ''
  });

  useEffect(() => {
    calculateTrialStatus();
  }, [user]);

  const calculateTrialStatus = () => {
    if (user?.userType === 'guest_student' && user?.trialStartDate) {
      const trialStart = new Date(user.trialStartDate);
      const now = new Date();
      const diffTime = now - trialStart;
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));
      const remainingDays = Math.max(0, 3 - diffDays); // 3-day trial
      
      setTrialStatus({
        daysRemaining: remainingDays,
        examsUsed: user.examsAttempted || 0,
        examsLimit: 5
      });
    }
  };

  const limitedPracticeOptions = [
    {
      title: 'Sample A/L Questions',
      description: 'Try a few Advanced Level questions',
      icon: <SchoolIcon />,
      color: 'primary',
      available: true,
      questionsLimit: '5 questions',
      action: () => navigate('/exams/view-paper')
    },
    {
      title: 'Sample O/L Questions',
      description: 'Practice with Ordinary Level samples',
      icon: <AssignmentIcon />,
      color: 'secondary',
      available: true,
      questionsLimit: '5 questions',
      action: () => navigate('/exams/view-paper')
    },
    {
      title: 'Quick Demo',
      description: 'Experience our platform features',
      icon: <TimerIcon />,
      color: 'info',
      available: true,
      questionsLimit: '3 questions',
      action: () => navigate('/practice/demo')
    }
  ];

  const premiumFeatures = [
    { feature: 'Unlimited exam papers', available: false },
    { feature: 'Detailed performance analytics', available: false },
    { feature: 'Subject-wise practice', available: false },
    { feature: 'Progress tracking', available: false },
    { feature: 'Mock exam simulations', available: false },
    { feature: 'Answer explanations', available: true },
    { feature: 'Basic practice questions', available: true }
  ];

  const handleUpgrade = async () => {
    try {
      // TODO: Implement upgrade API call
      console.log('Upgrading user with:', upgradeForm);
      // This would typically involve email/phone verification process
      setUpgradeDialogOpen(false);
    } catch (error) {
      console.error('Error upgrading account:', error);
    }
  };

  const isTrialExpired = user?.userType === 'guest_student' && trialStatus.daysRemaining === 0;

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      {/* Welcome Section */}
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          <Avatar sx={{ bgcolor: 'primary.main', mr: 2, width: 48, height: 48 }}>
            {user?.userType === 'visitor' ? '👋' : (user?.firstName?.charAt(0) || 'G')}
          </Avatar>
          <Box>
            <Typography variant="h4" sx={{ fontWeight: 600 }}>
              {user?.userType === 'visitor' ? 'Welcome to MCQ Master!' : `Welcome, ${user?.firstName || 'Guest'}!`}
            </Typography>
            <Typography variant="body1" color="text.secondary">
              {user?.userType === 'visitor' 
                ? 'Start your learning journey with us' 
                : 'You\'re using our trial version'
              }
            </Typography>
          </Box>
        </Box>
        
        {/* Trial Status for Guest Students */}
        {user?.userType === 'guest_student' && (
          <Alert 
            severity={isTrialExpired ? 'error' : trialStatus.daysRemaining <= 1 ? 'warning' : 'info'} 
            sx={{ mb: 2 }}
            icon={isTrialExpired ? <WarningIcon /> : <TimerIcon />}
          >
            <Typography variant="body2">
              {isTrialExpired ? (
                <><strong>Trial Expired:</strong> Your 3-day trial has ended. Upgrade to continue learning!</>
              ) : (
                <><strong>Trial Status:</strong> {trialStatus.daysRemaining} day{trialStatus.daysRemaining !== 1 ? 's' : ''} remaining • 
                {trialStatus.examsUsed}/{trialStatus.examsLimit} practice sessions used</>
              )}
            </Typography>
          </Alert>
        )}

        {/* Visitor Registration Prompt */}
        {user?.userType === 'visitor' && (
          <Alert severity="info" sx={{ mb: 2 }}>
            <Typography variant="body2">
              <strong>Get Started:</strong> Create a free trial account to access practice questions and track your progress.
            </Typography>
          </Alert>
        )}
      </Box>

      {/* Trial Progress for Guest Students */}
      {user?.userType === 'guest_student' && (
        <Paper sx={{ p: 3, mb: 4 }}>
          <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
            <StarIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
            Trial Progress
          </Typography>
          <Grid container spacing={3}>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Days Remaining</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trialStatus.daysRemaining}/3
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(trialStatus.daysRemaining / 3) * 100} 
                  color={trialStatus.daysRemaining <= 1 ? 'warning' : 'primary'}
                />
              </Box>
            </Grid>
            <Grid item xs={12} md={6}>
              <Box sx={{ mb: 2 }}>
                <Box sx={{ display: 'flex', justifyContent: 'space-between', mb: 1 }}>
                  <Typography variant="body2">Practice Sessions</Typography>
                  <Typography variant="body2" fontWeight={600}>
                    {trialStatus.examsUsed}/{trialStatus.examsLimit}
                  </Typography>
                </Box>
                <LinearProgress 
                  variant="determinate" 
                  value={(trialStatus.examsUsed / trialStatus.examsLimit) * 100} 
                  color={trialStatus.examsUsed >= trialStatus.examsLimit * 0.8 ? 'warning' : 'success'}
                />
              </Box>
            </Grid>
          </Grid>
        </Paper>
      )}

      <Grid container spacing={3}>
        {/* Available Practice Options */}
        <Grid item xs={12} md={8}>
          <Paper sx={{ p: 3 }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              {user?.userType === 'visitor' ? 'Preview Our Content' : 'Available Practice'}
            </Typography>
            <Grid container spacing={2}>
              {limitedPracticeOptions.map((option, index) => (
                <Grid item xs={12} sm={6} key={index}>
                  <Card 
                    sx={{ 
                      height: '100%', 
                      cursor: option.available && !isTrialExpired ? 'pointer' : 'default',
                      opacity: option.available && !isTrialExpired ? 1 : 0.6
                    }} 
                    onClick={option.available && !isTrialExpired ? option.action : undefined}
                  >
                    <CardContent>
                      <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                        <Chip 
                          icon={option.available && !isTrialExpired ? option.icon : <LockIcon />} 
                          label="" 
                          color={option.available && !isTrialExpired ? option.color : 'default'}
                          sx={{ mr: 2 }}
                        />
                        <Typography variant="h6" sx={{ fontWeight: 600 }}>
                          {option.title}
                        </Typography>
                      </Box>
                      <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
                        {option.description}
                      </Typography>
                      <Chip 
                        label={option.questionsLimit} 
                        size="small" 
                        variant="outlined"
                        color={option.color}
                      />
                    </CardContent>
                    <CardActions>
                      <Button 
                        size="small" 
                        color={option.color}
                        disabled={!option.available || isTrialExpired}
                      >
                        {isTrialExpired ? 'Trial Expired' : (option.available ? 'Try Now' : 'Locked')}
                      </Button>
                    </CardActions>
                  </Card>
                </Grid>
              ))}
            </Grid>
          </Paper>
        </Grid>

        {/* Upgrade Section */}
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, height: 'fit-content' }}>
            <Typography variant="h6" sx={{ mb: 3, fontWeight: 600 }}>
              <UpgradeIcon sx={{ mr: 1, verticalAlign: 'middle' }} />
              Upgrade to Full Access
            </Typography>
            
            <List dense>
              {premiumFeatures.map((item, index) => (
                <ListItem key={index} sx={{ px: 0 }}>
                  <ListItemIcon>
                    {item.available ? (
                      <StarIcon sx={{ color: 'success.main', fontSize: 20 }} />
                    ) : (
                      <LockIcon sx={{ color: 'text.disabled', fontSize: 20 }} />
                    )}
                  </ListItemIcon>
                  <ListItemText
                    primary={
                      <Typography 
                        variant="body2" 
                        sx={{ 
                          color: item.available ? 'text.primary' : 'text.disabled',
                          textDecoration: item.available ? 'none' : 'none'
                        }}
                      >
                        {item.feature}
                      </Typography>
                    }
                  />
                </ListItem>
              ))}
            </List>

            <Button
              variant="contained"
              fullWidth
              startIcon={<UpgradeIcon />}
              onClick={() => setUpgradeDialogOpen(true)}
              sx={{ mt: 2 }}
              color="primary"
            >
              {user?.userType === 'visitor' ? 'Start Free Trial' : 'Upgrade Now'}
            </Button>
            
            <Typography variant="caption" sx={{ display: 'block', textAlign: 'center', mt: 1, color: 'text.secondary' }}>
              {user?.userType === 'visitor' ? '3-day free trial • No credit card required' : 'Unlock unlimited access'}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

      {/* Upgrade Dialog */}
      <Dialog open={upgradeDialogOpen} onClose={() => setUpgradeDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>
          {user?.userType === 'visitor' ? 'Start Your Free Trial' : 'Upgrade Your Account'}
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" sx={{ mb: 3 }}>
            {user?.userType === 'visitor' 
              ? 'Create your account to start a 3-day free trial with full access to our question bank.'
              : 'Complete your registration to upgrade from trial to full access.'
            }
          </Typography>
          
          <TextField
            fullWidth
            label="Email Address"
            type="email"
            value={upgradeForm.email}
            onChange={(e) => setUpgradeForm({ ...upgradeForm, email: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <EmailIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <TextField
            fullWidth
            label="Phone Number"
            type="tel"
            value={upgradeForm.phone}
            onChange={(e) => setUpgradeForm({ ...upgradeForm, phone: e.target.value })}
            sx={{ mb: 2 }}
            InputProps={{
              startAdornment: <PhoneIcon sx={{ mr: 1, color: 'text.secondary' }} />
            }}
          />
          
          <Alert severity="info" sx={{ mt: 2 }}>
            <Typography variant="body2">
              We'll send verification links to confirm your email and phone number.
            </Typography>
          </Alert>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setUpgradeDialogOpen(false)}>Cancel</Button>
          <Button 
            onClick={handleUpgrade} 
            variant="contained"
            disabled={!upgradeForm.email || !upgradeForm.phone}
          >
            {user?.userType === 'visitor' ? 'Start Free Trial' : 'Upgrade Account'}
          </Button>
        </DialogActions>
      </Dialog>
    </Container>
  );
};

export default GuestDashboard;
