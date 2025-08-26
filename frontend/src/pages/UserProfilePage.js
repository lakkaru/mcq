import React, { useState } from 'react';
import {
  Container,
  Typography,
  Grid,
  Paper,
  Box,
  Button,
  TextField,
  Avatar,
  Chip,
  Divider,
  Alert,
  List,
  ListItem,
  ListItemText,
  ListItemIcon,
  Switch,
  FormControlLabel,
  Tab,
  Tabs
} from '@mui/material';
import {
  Person as PersonIcon,
  Email as EmailIcon,
  Phone as PhoneIcon,
  School as SchoolIcon,
  Security as SecurityIcon,
  Notifications as NotificationsIcon,
  Edit as EditIcon,
  Save as SaveIcon,
  Cancel as CancelIcon,
  CheckCircle as VerifiedIcon,
  Warning as WarningIcon
} from '@mui/icons-material';
import { useAuth } from '../contexts/AuthContext';

const UserProfilePage = () => {
  const { user, updateProfile } = useAuth();
  const [tabValue, setTabValue] = useState(0);
  const [isEditing, setIsEditing] = useState(false);
  const [formData, setFormData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '',
    school: user?.school || ''
  });
  const [preferences, setPreferences] = useState({
    emailNotifications: true,
    smsNotifications: false,
    darkMode: false
  });

  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  const handleEdit = () => {
    setIsEditing(true);
  };

  const handleSave = async () => {
    try {
      await updateProfile(formData);
      setIsEditing(false);
    } catch (error) {
      console.error('Error updating profile:', error);
    }
  };

  const handleCancel = () => {
    setFormData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '',
      school: user?.school || ''
    });
    setIsEditing(false);
  };

  const handleInputChange = (field) => (event) => {
    setFormData({
      ...formData,
      [field]: event.target.value
    });
  };

  const handlePreferenceChange = (preference) => (event) => {
    setPreferences({
      ...preferences,
      [preference]: event.target.checked
    });
  };

  const getStatusInfo = (userType, isVerified) => {
    switch (userType) {
      case 'admin':
        return { label: 'Administrator', color: 'primary', icon: '👑' };
      case 'student':
        return { label: 'Student', color: 'success', icon: '🎓' };
      case 'guest_student':
        return { label: 'Guest Student', color: 'warning', icon: '⏰' };
      case 'visitor':
        return { label: 'Visitor', color: 'default', icon: '👤' };
      default:
        return { label: 'Unknown', color: 'default', icon: '❓' };
    }
  };

  const statusInfo = getStatusInfo(user?.userType, user?.isVerified);

  const TabPanel = ({ children, value, index, ...other }) => (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && (
        <Box sx={{ p: 3 }}>
          {children}
        </Box>
      )}
    </div>
  );

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h4" component="h1" gutterBottom>
        User Profile
      </Typography>

      <Grid container spacing={3}>
        <Grid item xs={12} md={4}>
          <Paper sx={{ p: 3, textAlign: 'center' }}>
            <Avatar
              sx={{
                width: 100,
                height: 100,
                mx: 'auto',
                mb: 2,
                bgcolor: 'primary.main',
                fontSize: '2rem'
              }}
            >
              {user?.name?.charAt(0) || 'U'}
            </Avatar>
            <Typography variant="h5" gutterBottom>
              {user?.name || 'User'}
            </Typography>
            <Chip
              label={statusInfo.label}
              color={statusInfo.color}
              icon={<span style={{ fontSize: '1rem' }}>{statusInfo.icon}</span>}
              sx={{ mb: 2 }}
            />
            <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center', mb: 2 }}>
              {user?.isVerified ? (
                <>
                  <VerifiedIcon color="success" sx={{ mr: 1 }} />
                  <Typography color="success.main">Verified Account</Typography>
                </>
              ) : (
                <>
                  <WarningIcon color="warning" sx={{ mr: 1 }} />
                  <Typography color="warning.main">Unverified Account</Typography>
                </>
              )}
            </Box>
            {user?.userType === 'guest_student' && (
              <Alert severity="warning" sx={{ mt: 2, textAlign: 'left' }}>
                Trial account expires in 2 days. Upgrade to continue using all features.
              </Alert>
            )}
          </Paper>
        </Grid>

        <Grid item xs={12} md={8}>
          <Paper sx={{ minHeight: 500 }}>
            <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
              <Tabs value={tabValue} onChange={handleTabChange}>
                <Tab label="Personal Information" />
                <Tab label="Account Settings" />
                <Tab label="Preferences" />
              </Tabs>
            </Box>

            <TabPanel value={tabValue} index={0}>
              <Typography variant="h6" gutterBottom>
                Personal Information
              </Typography>
              <Grid container spacing={3}>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PersonIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <TextField
                      fullWidth
                      label="Full Name"
                      value={formData.name}
                      onChange={handleInputChange('name')}
                      disabled={!isEditing}
                      variant={isEditing ? 'outlined' : 'standard'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <EmailIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <TextField
                      fullWidth
                      label="Email"
                      value={formData.email}
                      onChange={handleInputChange('email')}
                      disabled={!isEditing}
                      variant={isEditing ? 'outlined' : 'standard'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <PhoneIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <TextField
                      fullWidth
                      label="Phone"
                      value={formData.phone}
                      onChange={handleInputChange('phone')}
                      disabled={!isEditing}
                      variant={isEditing ? 'outlined' : 'standard'}
                    />
                  </Box>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
                    <SchoolIcon sx={{ mr: 2, color: 'text.secondary' }} />
                    <TextField
                      fullWidth
                      label="School/Institution"
                      value={formData.school}
                      onChange={handleInputChange('school')}
                      disabled={!isEditing}
                      variant={isEditing ? 'outlined' : 'standard'}
                    />
                  </Box>
                </Grid>
              </Grid>
              
              <Box sx={{ display: 'flex', gap: 2, mt: 3 }}>
                {!isEditing ? (
                  <Button variant="contained" startIcon={<EditIcon />} onClick={handleEdit}>
                    Edit Profile
                  </Button>
                ) : (
                  <>
                    <Button variant="contained" startIcon={<SaveIcon />} onClick={handleSave}>
                      Save Changes
                    </Button>
                    <Button variant="outlined" startIcon={<CancelIcon />} onClick={handleCancel}>
                      Cancel
                    </Button>
                  </>
                )}
              </Box>
            </TabPanel>

            <TabPanel value={tabValue} index={1}>
              <Typography variant="h6" gutterBottom>
                Account Settings
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <SecurityIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Change Password"
                    secondary="Update your account password"
                  />
                  <Button variant="outlined">Change</Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <VerifiedIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Two-Factor Authentication"
                    secondary="Add extra security to your account"
                  />
                  <Button variant="outlined">
                    {user?.twoFactorEnabled ? 'Disable' : 'Enable'}
                  </Button>
                </ListItem>
                <Divider />
                <ListItem>
                  <ListItemIcon>
                    <EmailIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Verify Email"
                    secondary={user?.isVerified ? 'Your email is verified' : 'Please verify your email address'}
                  />
                  {!user?.isVerified && (
                    <Button variant="outlined">Send Verification</Button>
                  )}
                </ListItem>
              </List>
            </TabPanel>

            <TabPanel value={tabValue} index={2}>
              <Typography variant="h6" gutterBottom>
                Preferences
              </Typography>
              <List>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="Email Notifications"
                    secondary="Receive notifications via email"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.emailNotifications}
                        onChange={handlePreferenceChange('emailNotifications')}
                      />
                    }
                    label=""
                  />
                </ListItem>
                <ListItem>
                  <ListItemIcon>
                    <NotificationsIcon />
                  </ListItemIcon>
                  <ListItemText
                    primary="SMS Notifications"
                    secondary="Receive notifications via SMS"
                  />
                  <FormControlLabel
                    control={
                      <Switch
                        checked={preferences.smsNotifications}
                        onChange={handlePreferenceChange('smsNotifications')}
                      />
                    }
                    label=""
                  />
                </ListItem>
              </List>
            </TabPanel>
          </Paper>
        </Grid>
      </Grid>
    </Container>
  );
};

export default UserProfilePage;
