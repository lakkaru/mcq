const express = require('express');
const router = express.Router();
const {
  updateProfile,
  changePassword,
  getDashboard,
  deleteAccount
} = require('../controllers/userController');
const { authenticate } = require('../middleware/auth');

// All user routes require authentication
router.use(authenticate);

// User profile and account management
router.get('/dashboard', getDashboard);
router.put('/profile', updateProfile);
router.put('/change-password', changePassword);
router.delete('/account', deleteAccount);

module.exports = router;