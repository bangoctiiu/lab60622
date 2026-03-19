import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './components/layout/AppProviders';
import ProtectedRoute from './routes/ProtectedRoute';
import PortalAuthGuard from './components/auth/PortalAuthGuard';
import { AdminLayout, PublicLayout } from './views/layouts/Layouts';
import PortalLayout from './components/layout/PortalLayout';
import { Spinner } from './components/ui/Feedback';

// --- Lazy Load Views ---
const LandingPage = lazy(() => import('@/views/public/LandingPage'));
const LoginPage = lazy(() => import('@/views/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/views/auth/ForgotPasswordPage'));
const RegisterPage = lazy(() => import('@/views/auth/RegisterPage'));
const ResetPasswordPage = lazy(() => import('@/views/auth/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('@/views/auth/ChangePasswordPage'));
const OTPVerifyPage = lazy(() => import('@/views/auth/OTPVerifyPage'));

// Admin & Staff Views
const PaymentDetail = lazy(() => import('@/views/admin/finance/PaymentDetail'));
const OwnerDetail = lazy(() => import('@/views/admin/owners/OwnerDetail'));
const MeterReadingConfirm = lazy(() => import('@/views/admin/meters/MeterReadingConfirm'));
const AddendumList = lazy(() => import('@/views/admin/contracts/AddendumListPage'));
const StaffDashboard = lazy(() => import('@/views/admin/staff/StaffDashboard'));
const AnnouncementPage = lazy(() => import('@/views/admin/communications/AnnouncementPage/index'));
const NotificationPage = lazy(() => import('@/views/admin/communications/NotificationPage'));

// Portal Views
const Documents = lazy(() => import('@/views/portal/profile/Documents'));

import { adminRoutes } from './routes/adminRoutes';

import { portalRoutes, portalGuestRoutes, Onboarding } from './routes/portalRoutes';



import useAuthStore from './stores/authStore';

// Helper component for Landing Page redirection
const AuthRedirect = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, role } = useAuthStore();
  if (isAuthenticated) {
    return <Navigate to={role === 'Tenant' ? '/portal' : '/dashboard'} replace />;
  }
  return <>{children}</>;
};



// Error Pages
import { Error404, Error403, Error500, MaintenancePage } from './views/error/ErrorPages';
import ErrorBoundary from './components/ErrorBoundary';
import { OfflineBanner, PageSkeleton } from './components/ui/StatusStates';
import { RouteObject } from 'react-router-dom';

// Recursive Route Mapper for RouteObject arrays
const MapRoutes = ({ routes }: { routes: RouteObject[] }) => (
  <>
    {routes.map((route, i) => {
      if (route.index) {
        return <Route key={i} index element={route.element} />;
      }
      return (
        <Route key={i} path={route.path} element={route.element}>
          {route.children && <MapRoutes routes={route.children} />}
        </Route>
      );
    })}
  </>
);

const App = () => {
  return (
    <AppProviders>
      <ErrorBoundary>
        <OfflineBanner />
        <BrowserRouter>
          <Suspense fallback={
            <div className="h-screen w-full flex items-center justify-center bg-bg">
              <div className="text-center space-y-4">
                <Spinner className="w-12 h-12 mx-auto" />
                <p className="text-label text-primary font-bold animate-pulse">Loading SmartStay Engine...</p>
              </div>
            </div>
          }>
            <Routes>
              {/* 3.1 Landing Page -- / (Homepage) with Auth Redirect */}
              <Route path="/" element={
                <AuthRedirect>
                  <LandingPage />
                </AuthRedirect>
              } />

              {/* 3.2 Auth Pages (Public Namespace) */}
              <Route path="/public" element={<PublicLayout showHeader={false} />}>
                <Route path="login" element={<LoginPage />} />
                <Route path="forgot-password" element={<ForgotPasswordPage />} />
                <Route path="reset-password" element={<ResetPasswordPage />} />
                <Route path="change-password" element={<ChangePasswordPage />} />
                <Route path="register" element={<RegisterPage />} />
              </Route>

              {/* 3.2.1 Admin Login Shortcut */}
              <Route path="/login" element={<Navigate to="/public/login" replace />} />

              {/* 1. Admin & Staff Namespace (Protected) */}
              <Route element={<ProtectedRoute />}>
                  <Route element={<AdminLayout />}>
                    <MapRoutes routes={adminRoutes} />
                    
                    {/* Architectural Clarity: Crucial Admin Routes */}
                    <Route path="payments/:id" element={<PaymentDetail />} />
                    <Route path="owners/:id" element={<OwnerDetail />} />
                    <Route path="meters/confirm" element={<MeterReadingConfirm />} />
                    <Route path="contracts/addendums" element={<AddendumList />} />
                    <Route path="staff/dashboard" element={<StaffDashboard />} />
                    <Route path="announcements" element={<AnnouncementPage />} />
                    <Route path="notifications" element={<NotificationPage />} />
                  </Route>

                   <Route path="/" element={<Navigate to="/dashboard" replace />} />
                 </Route>

              <Route path="/portal">
                {/* 3.2.2 Guest Routes (Login, etc.) */}
                {portalGuestRoutes.map((route, i) => (
                  <Route 
                    key={i} 
                    path={route.path} 
                    element={route.element} 
                  />
                ))}

                {/* Protected Portal Area */}
                <Route element={<PortalAuthGuard />}>
                  <Route element={<PortalLayout />}>
                    <MapRoutes routes={portalRoutes} />
                    {/* Explicitly adding Documents route for visibility */}
                    <Route path="documents" element={<Documents />} />
                  </Route>
                  <Route path="onboarding" element={<Onboarding />} />
                </Route>
              </Route>

              {/* 3.3 Error Pages & Global Redirects */}
              <Route path="/403" element={<Error403 />} />
              <Route path="/500" element={<Error500 />} />
              <Route path="/maintenance" element={<MaintenancePage />} />
              <Route path="/404" element={<Error404 />} />
              
              <Route path="*" element={<Error404 />} />
            </Routes>
          </Suspense>
        </BrowserRouter>
      </ErrorBoundary>
    </AppProviders>
  );
};

export default App;

