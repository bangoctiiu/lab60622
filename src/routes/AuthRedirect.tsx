import React from 'react';
import { Navigate } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';

export const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={role === 'Tenant' ? '/portal' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};
