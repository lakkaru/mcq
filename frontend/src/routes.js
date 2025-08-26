import React, { lazy, Suspense } from 'react';
import { Routes, Route } from 'react-router-dom';

// Lazy load all route components
const HomeLayout = lazy(() => import('./layouts/HomeLayout'));
const CreateQuestionLayout = lazy(() => import('./layouts/question/CreateQuestionLayout'));
const UpdateQuestionLayout = lazy(() => import('./layouts/question/UpdateQuestionLayout'));
const CreateExamLayout = lazy(() => import('./layouts/exam/CreateExamLayout'));
const UpdateExamLayout = lazy(() => import('./layouts/exam/UpdateExamLayout'));
const ViewExamPaperLayout = lazy(() => import('./layouts/exam/ViewExamPaperLayout'));

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

export default function AppRoutes() {
  return (
    <Routes>
      <Route path="/" element={
        <Suspense fallback={<LoadingSpinner />}>
          <HomeLayout />
        </Suspense>
      } />
      
      {/* Question Routes */}
      <Route path="/questions/create" element={
        <Suspense fallback={<LoadingSpinner />}>
          <CreateQuestionLayout />
        </Suspense>
      } />
      <Route path="/questions/update" element={
        <Suspense fallback={<LoadingSpinner />}>
          <UpdateQuestionLayout />
        </Suspense>
      } />
      
      {/* Exam Routes */}
      <Route path="/exams/create" element={
        <Suspense fallback={<LoadingSpinner />}>
          <CreateExamLayout />
        </Suspense>
      } />
      <Route path="/exams/update" element={
        <Suspense fallback={<LoadingSpinner />}>
          <UpdateExamLayout />
        </Suspense>
      } />
      <Route path="/exams/view-paper" element={
        <Suspense fallback={<LoadingSpinner />}>
          <ViewExamPaperLayout />
        </Suspense>
      } />
      
      {/* Add more routes as needed */}
    </Routes>
  );
}
