import React from 'react';
import useAuthStore from '@/stores/authStore';
import AdminDashboard from './AdminDashboard';
import StaffDashboard from './StaffDashboard';

const Dashboard = () => {
  const { user } = useAuthStore();
  
  if (user?.role === 'Staff') {
    return <StaffDashboard />;
  }
  
  return <AdminDashboard />;
};

export default Dashboard;
