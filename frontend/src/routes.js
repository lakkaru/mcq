import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';
import { useAuth } from './contexts/AuthContext';

// Lazy load all route components
const HomeLayout = lazy(() => import('./layouts/HomeLayout'));
const CreateQuestionLayout = lazy(() => import('./layouts/question/CreateQuestionLayout'));
const UpdateQuestionLayout = lazy(() => import('./layouts/question/UpdateQuestionLayout'));
const CreateExamLayout = lazy(() => import('./layouts/exam/CreateExamLayout'));
const UpdateExamLayout = lazy(() => import('./layouts/exam/UpdateExamLayout'));
const ViewExamPaperLayout = lazy(() => import('./layouts/exam/ViewExamPaperLayout'));
const LoginPage = lazy(() => import('./pages/LoginPage'));
const UserProfilePage = lazy(() => import('./pages/UserProfilePage'));
const PracticeStartPage = lazy(() => import('./pages/PracticeStartPage'));

// Loading component
const LoadingSpinner = () => (
  <div style={{ 
    display: 'flex', 
    justifyContent: 'center', 
    alignItems: 'center', 
    minHeight: '200px',
    fontSize: '16px',
    color: '#666'
  }}>
    Loading...
  </div>
);

// Protected Route Component
const ProtectedRoute = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    );
  }
  
  return children;
};

// Admin Route Component
const AdminRoute = ({ children }) => {
  const { user, isAuthenticated, loading } = useAuth();
  
  if (loading) {
    return <LoadingSpinner />;
  }
  
  if (!isAuthenticated) {
    return (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    );
  }
  
  if (user?.userType !== 'admin') {
    return (
      <div style={{ padding: '20px', textAlign: 'center' }}>
        <h2>Access Denied</h2>
        <p>You need admin privileges to access this page.</p>
      </div>
    );
  }
  
  return children;
};

export default function AppRoutes() {
  return (
    <Routes>
      {/* Public Routes */}
      <Route path="/login" element={
        <Suspense fallback={<LoadingSpinner />}>
          <LoginPage />
        </Suspense>
      } />
      
      {/* Protected Routes */}
      <Route path="/" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <HomeLayout />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* User Profile - Available to all authenticated users */}
      <Route path="/profile" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <UserProfilePage />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Practice Routes - Available to all authenticated users */}
      <Route path="/practice/start" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <PracticeStartPage />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Admin-only Question Routes */}
      <Route path="/questions/create" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <CreateQuestionLayout />
          </Suspense>
        </AdminRoute>
      } />
      <Route path="/questions/update" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <UpdateQuestionLayout />
          </Suspense>
        </AdminRoute>
      } />
      
      {/* Admin-only Exam Management Routes */}
      <Route path="/exams/create" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <CreateExamLayout />
          </Suspense>
        </AdminRoute>
      } />
      <Route path="/exams/update" element={
        <AdminRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <UpdateExamLayout />
          </Suspense>
        </AdminRoute>
      } />
      
      {/* Protected Exam Viewing (all authenticated users) */}
      <Route path="/exams/view-paper" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <ViewExamPaperLayout />
          </Suspense>
        </ProtectedRoute>
      } />
      
      {/* Catch all - redirect to home */}
      <Route path="*" element={
        <ProtectedRoute>
          <Suspense fallback={<LoadingSpinner />}>
            <HomeLayout />
          </Suspense>
        </ProtectedRoute>
      } />
    </Routes>
  );
}
