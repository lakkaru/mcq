const jwt = require('jsonwebtoken');
const crypto = require('crypto');
const { Op } = require('sequelize');
const User = require('../models/User');

// Generate JWT token
const generateToken = (userId) => {
  return jwt.sign({ userId }, process.env.JWT_SECRET || 'your-secret-key', {
    expiresIn: '30d',
  });
};

// Generate email verification token
const generateEmailVerificationToken = () => {
  return crypto.randomBytes(32).toString('hex');
};

// Generate phone verification code
const generatePhoneVerificationCode = () => {
  return Math.floor(100000 + Math.random() * 900000).toString();
};

// @desc    Register new user (Visitor registration)
// @route   POST /api/auth/register
// @access  Public
const register = async (req, res) => {
  try {
    const { userName, email } = req.body;

    // Validation
    if (!userName || !email) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and email'
      });
    }

    // Check if user already exists
    const existingUser = await User.findOne({
      where: {
        [Op.or]: [
          { userName: userName },
          { email: email }
        ]
      }
    });

    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this username or email already exists'
      });
    }

    // Create user with visitor status
    const emailVerificationToken = generateEmailVerificationToken();
    
    const user = await User.create({
      userName,
      email,
      userType: 'visitor',
      emailVerificationToken,
      isEmailVerified: false
    });

    // TODO: Send verification email
    console.log(`Email verification token for ${email}: ${emailVerificationToken}`);

    res.status(201).json({
      success: true,
      message: 'Registration successful. Please check your email for verification link.',
      data: {
        userId: user.id,
        userName: user.userName,
        email: user.email,
        userType: user.userType
      }
    });

  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during registration'
    });
  }
};

// @desc    Verify email
// @route   GET /api/auth/verify-email/:token
// @access  Public
const verifyEmail = async (req, res) => {
  try {
    const { token } = req.params;

    const user = await User.findOne({
      where: { emailVerificationToken: token }
    });

    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification token'
      });
    }

    // Update user verification status
    await user.update({
      isEmailVerified: true,
      emailVerificationToken: null,
      userType: 'guest_student'
    });

    res.status(200).json({
      success: true,
      message: 'Email verified successfully. You can now access guest student features.'
    });

  } catch (error) {
    console.error('Email verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during email verification'
    });
  }
};

// @desc    Verify phone number
// @route   POST /api/auth/verify-phone
// @access  Private (Guest Student)
const verifyPhone = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    const userId = req.user.id;

    if (!phoneNumber) {
      return res.status(400).json({
        success: false,
        message: 'Phone number is required'
      });
    }

    const verificationCode = generatePhoneVerificationCode();

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    await user.update({
      phoneNumber,
      phoneVerificationCode: verificationCode
    });

    // TODO: Send SMS verification code
    console.log(`Phone verification code for ${phoneNumber}: ${verificationCode}`);

    res.status(200).json({
      success: true,
      message: 'Verification code sent to your phone number.'
    });

  } catch (error) {
    console.error('Phone verification error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during phone verification'
    });
  }
};

// @desc    Confirm phone verification code
// @route   POST /api/auth/confirm-phone
// @access  Private (Guest Student)
const confirmPhoneVerification = async (req, res) => {
  try {
    const { verificationCode } = req.body;
    const userId = req.user.id;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    if (user.phoneVerificationCode !== verificationCode) {
      return res.status(400).json({
        success: false,
        message: 'Invalid verification code'
      });
    }

    // Start trial and update user
    user.startTrial();
    await user.update({
      isPhoneVerified: true,
      phoneVerificationCode: null,
      trialStartDate: user.trialStartDate,
      trialEndDate: user.trialEndDate,
      userType: 'guest_student'
    });

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Phone verified successfully. Trial period started!',
      data: {
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          userType: user.userType,
          trialEndDate: user.trialEndDate
        },
        token
      }
    });

  } catch (error) {
    console.error('Phone confirmation error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during phone confirmation'
    });
  }
};

// @desc    Login user
// @route   POST /api/auth/login
// @access  Public
const login = async (req, res) => {
  try {
    const { userName, password } = req.body;

    if (!userName || !password) {
      return res.status(400).json({
        success: false,
        message: 'Please provide username and password'
      });
    }

    // Find user by username or email
    const user = await User.findOne({
      where: {
        [Op.or]: [
          { userName: userName },
          { email: userName }
        ]
      }
    });

    if (!user || !(await user.matchPassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid credentials'
      });
    }

    if (!user.isActive) {
      return res.status(401).json({
        success: false,
        message: 'Account is deactivated'
      });
    }

    const token = generateToken(user.id);

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          isEmailVerified: user.isEmailVerified,
          isPhoneVerified: user.isPhoneVerified,
          trialEndDate: user.trialEndDate
        },
        token
      }
    });

  } catch (error) {
    console.error('Login error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during login'
    });
  }
};

// @desc    Complete user profile
// @route   PUT /api/auth/complete-profile
// @access  Private
const completeProfile = async (req, res) => {
  try {
    const userId = req.user.id;
    const {
      firstName,
      lastName,
      password,
      profilePicture,
      subjects,
      examFacingYear
    } = req.body;

    const user = await User.findByPk(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    const updateData = {
      firstName,
      lastName,
      profilePicture,
      subjects,
      examFacingYear
    };

    // Only update password if provided
    if (password) {
      updateData.password = password;
    }

    await user.update(updateData);

    res.status(200).json({
      success: true,
      message: 'Profile completed successfully',
      data: {
        user: {
          id: user.id,
          userName: user.userName,
          email: user.email,
          firstName: user.firstName,
          lastName: user.lastName,
          userType: user.userType,
          profilePicture: user.profilePicture,
          subjects: user.subjects,
          examFacingYear: user.examFacingYear
        }
      }
    });

  } catch (error) {
    console.error('Profile completion error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during profile completion'
    });
  }
};

// @desc    Get current user profile
// @route   GET /api/auth/profile
// @access  Private
const getProfile = async (req, res) => {
  try {
    const user = await User.findByPk(req.user.id, {
      attributes: { exclude: ['password', 'emailVerificationToken', 'phoneVerificationCode'] }
    });

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.status(200).json({
      success: true,
      data: { user }
    });

  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error while fetching profile'
    });
  }
};

module.exports = {
  register,
  verifyEmail,
  verifyPhone,
  confirmPhoneVerification,
  login,
  completeProfile,
  getProfile
};
