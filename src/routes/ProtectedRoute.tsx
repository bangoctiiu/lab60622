import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { UserRole } from '@/models/User';

interface ProtectedRouteProps {
  requiredRole?: UserRole;
}

/**
 * Route protection pattern:
 * Checks for authentication and optional role-based access.
 */
const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ requiredRole }) => {
  const { isAuthenticated, role } = useAuthStore();
  const location = useLocation();

  if (!isAuthenticated) {
    // Redirect to login but save the current location to redirect back after login
    return <Navigate to="/public/login" state={{ from: location }} replace />;
  }

  if (requiredRole && role !== requiredRole) {
    // Role mismatch
    return <Navigate to="/403" replace />;
  }

  return <Outlet />;
};

export default ProtectedRoute;
