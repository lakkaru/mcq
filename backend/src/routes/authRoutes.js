const express = require('express');
const router = express.Router();
const {
  register,
  verifyEmail,
  verifyPhone,
  confirmPhoneVerification,
  login,
  completeProfile,
  getProfile
} = require('../controllers/authController');
const { authenticate, authorize, requireEmailVerification } = require('../middleware/auth');

// Public routes
router.post('/register', register);
router.get('/verify-email/:token', verifyEmail);
router.post('/login', login);

// Protected routes
router.use(authenticate); // All routes below require authentication

router.get('/profile', getProfile);
router.put('/complete-profile', completeProfile);

// Guest student specific routes
router.post('/verify-phone', authorize('guest_student'), verifyPhone);
router.post('/confirm-phone', authorize('guest_student'), confirmPhoneVerification);

module.exports = router;