import React from 'react';
import { useAuth } from '../contexts/AuthContext';
import AdminDashboard from '../pages/AdminDashboard';
import StudentDashboard from '../pages/StudentDashboard';
import GuestDashboard from '../pages/GuestDashboard';

export default function HomeLayout() {
  const { user } = useAuth();

  // Render dashboard based on user type
  switch (user?.userType) {
    case 'admin':
      return <AdminDashboard />;
    case 'student':
      return <StudentDashboard />;
    case 'guest_student':
      return <GuestDashboard />;
    case 'visitor':
    default:
      return <GuestDashboard />;
  }
}
