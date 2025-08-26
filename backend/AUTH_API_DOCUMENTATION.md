# MCQ Authentication API Documentation

## Overview
This document describes the authentication and user management system for the MCQ Practice Application.

## Base URL
```
http://localhost:5000/api
```

## Authentication System Flow

### 1. User Registration (Visitor → Guest Student)
- **Visitor** registers with username and email
- Email verification required to become **Guest Student**
- **Guest Student** can verify phone number to start 3-day trial
- During trial, **Guest Student** has full access to practice features
- **Guest Student** can complete profile and set password

### 2. User Types
- **visitor**: Initial registration state
- **guest_student**: Email verified, can access limited features
- **student**: Full features (after trial or subscription)
- **admin**: Full system management access

## API Endpoints

### Authentication Routes (`/api/auth`)

#### POST /api/auth/register
Register a new user (visitor status)
```json
{
  "userName": "john_doe",
  "email": "john@example.com"
}
```

#### GET /api/auth/verify-email/:token
Verify email address with token sent to email

#### POST /api/auth/login
Login with username/email and password
```json
{
  "userName": "john_doe", // or email
  "password": "password123"
}
```

#### POST /api/auth/verify-phone
Verify phone number (Guest Student only)
```json
{
  "phoneNumber": "+1234567890"
}
```

#### POST /api/auth/confirm-phone
Confirm phone verification code
```json
{
  "verificationCode": "123456"
}
```

#### PUT /api/auth/complete-profile
Complete user profile
```json
{
  "firstName": "John",
  "lastName": "Doe",
  "password": "newpassword123",
  "profilePicture": "base64_image_data",
  "subjects": ["Math", "Physics"],
  "examFacingYear": 2024
}
```

#### GET /api/auth/profile
Get current user profile (requires authentication)

### User Routes (`/api/users`)

#### GET /api/users/dashboard
Get user dashboard data

#### PUT /api/users/profile
Update user profile

#### PUT /api/users/change-password
Change user password
```json
{
  "currentPassword": "oldpassword",
  "newPassword": "newpassword123"
}
```

#### DELETE /api/users/account
Deactivate user account

### Admin Routes (`/api/admin`)
All admin routes require admin authentication.

#### GET /api/admin/users
Get all users with pagination and filtering

#### GET /api/admin/users/:id
Get specific user by ID

#### PUT /api/admin/users/:id/status
Update user status
```json
{
  "isActive": true,
  "userType": "student"
}
```

#### GET /api/admin/stats
Get system statistics

#### DELETE /api/admin/users/:id
Delete user

### Protected Content Routes
All content routes now require authentication:

- `/api/questions` - Question management
- `/api/exams` - Exam management  
- `/api/topics` - Topic management
- `/api/exam-papers` - Exam paper management

**Guest Students**: Access with trial period check
**Students**: Full access
**Admins**: Full access + management capabilities

## Authentication Headers
Include JWT token in all protected requests:
```
Authorization: Bearer <your-jwt-token>
```

## User Journey Example

1. **Registration**: `POST /api/auth/register`
2. **Email Verification**: `GET /api/auth/verify-email/:token`
3. **Phone Verification**: `POST /api/auth/verify-phone` → `POST /api/auth/confirm-phone`
4. **Trial Access**: 3-day full access to practice questions
5. **Profile Completion**: `PUT /api/auth/complete-profile`
6. **Login**: `POST /api/auth/login` for future sessions

## Trial System
- **Guest Students** get 3-day trial after phone verification
- Trial gives full access to all practice features
- After trial expires, user needs to upgrade to **Student** status
- Admins can manually upgrade users

## Default Admin Account
```
Username: admin
Email: admin@mcq.com  
Password: admin123 (Please change this!)
```

## Response Format
All API responses follow this format:
```json
{
  "success": true/false,
  "message": "Description of result",
  "data": { ... }
}
```

## Error Codes
- 400: Bad Request (validation errors)
- 401: Unauthorized (authentication required)
- 403: Forbidden (insufficient permissions)
- 404: Not Found
- 500: Internal Server Error
