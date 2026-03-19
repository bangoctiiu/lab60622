import React from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';

/**
 * PortalAuthGuard: Specific protection for /portal/* routes
 * 1. Requires isAuthenticated === true
 * 2. Requires role === "Tenant"
 * 3. Checks session expiration
 * 4. Checks onboarding completion
 */
const PortalAuthGuard: React.FC = () => {
  const { isAuthenticated, role, user, sessionExpired } = useAuthStore();
  const location = useLocation();

  // 1. Session expiration check
  if (sessionExpired) {
    toast.error('Phiên làm việc hết hạn');
    return <Navigate to="/portal/login" replace />;
  }

  // 2. Authentication check
  if (!isAuthenticated) {
    return <Navigate to="/portal/login" state={{ from: location }} replace />;
  }

  // 3. Role check
  if (role !== 'Tenant') {
    // Non-tenant user (Admin/Staff/Viewer) should not access portal
    return <Navigate to="/403" replace />;
  }

  // 4. Onboarding check (CompletionPercent < 100)
  // Skip redirect if already on onboarding page
  const isOnboarding = location.pathname === '/portal/onboarding';
  const isComplete = user?.completionPercent === 100;

  if (!isComplete && !isOnboarding) {
    return <Navigate to="/portal/onboarding" replace />;
  }

  // If complete but on onboarding page, redirect to dashboard
  if (isComplete && isOnboarding) {
    return <Navigate to="/portal/dashboard" replace />;
  }

  return <Outlet />;
};

export default PortalAuthGuard;
