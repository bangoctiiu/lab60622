import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './components/layout/AppProviders';
import ProtectedRoute from './routes/ProtectedRoute';
import { AdminLayout, PortalLayout, PublicLayout } from './views/layouts/Layouts';
import { Spinner } from './components/ui/Feedback';

// --- Lazy Load Views ---
const LandingPage = lazy(() => import('@/views/public/LandingPage'));
const LoginPage = lazy(() => import('@/views/auth/LoginPage'));
const ForgotPasswordPage = lazy(() => import('@/views/auth/ForgotPasswordPage'));
const ResetPasswordPage = lazy(() => import('@/views/auth/ResetPasswordPage'));
const ChangePasswordPage = lazy(() => import('@/views/auth/ChangePasswordPage'));
const OTPVerifyPage = lazy(() => import('@/views/auth/OTPVerifyPage'));

// Admin Views
const Dashboard = lazy(() => import('@/views/admin/Dashboard'));
const InvoiceList = lazy(() => import('@/views/admin/InvoiceList'));
const InvoiceDetail = lazy(() => import('@/views/admin/InvoiceDetail'));
const ContractList = lazy(() => import('@/views/admin/ContractList'));
const ContractDetail = lazy(() => import('@/views/admin/ContractDetail'));
const CreateContractWizard = lazy(() => import('@/views/admin/CreateContractWizard'));

// Payment Views
const PaymentList = lazy(() => import('@/views/admin/PaymentList'));
const WebhookLogs = lazy(() => import('@/views/admin/WebhookLogs'));
const TenantBalance = lazy(() => import('@/views/admin/TenantBalance'));

// Room & Asset Views
const RoomList = lazy(() => import('@/views/admin/RoomList'));
const RoomDetail = lazy(() => import('@/views/admin/RoomDetail'));
const HandoverChecklist = lazy(() => import('@/views/admin/HandoverChecklist'));
const AssetCatalog = lazy(() => import('@/views/admin/AssetCatalog'));

// Building & Owner Views
const BuildingList = lazy(() => import('./views/admin/BuildingList'));
const BuildingDetail = lazy(() => import('./views/admin/BuildingDetail'));
const OwnerList = lazy(() => import('./views/admin/OwnerList'));

// Portal Views
const PortalHome = lazy(() => import('@/views/portal/PortalHome'));


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
import { OfflineBanner } from './components/ui/StatusStates';

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
                <Route path="register" element={<div>Register</div>} />
              </Route>

              {/* 3.2.1 Admin Login Shortcut */}
              <Route path="/login" element={<Navigate to="/public/login" replace />} />

              {/* 1. Admin & Staff Namespace (Protected) */}
              <Route element={<ProtectedRoute />}>
                <Route element={<AdminLayout />}>
                  <Route path="/dashboard" element={<Dashboard />} />
                  <Route path="/invoices" element={<InvoiceList />} />
                  <Route path="/invoices/:id" element={<InvoiceDetail />} />
                  <Route path="/contracts" element={<ContractList />} />
                  <Route path="/contracts/create" element={<CreateContractWizard />} />
                  <Route path="/contracts/:id" element={<ContractDetail />} />
                  
                  {/* Payment Routes */}
                  <Route path="/payments" element={<PaymentList />} />
                  <Route path="/payments/webhooks" element={<WebhookLogs />} />
                  <Route path="/tenants/:id/balance" element={<TenantBalance />} />
                  
                  {/* Room & Asset Routes */}
                  <Route path="/rooms" element={<RoomList />} />
                  <Route path="/rooms/:id" element={<RoomDetail />} />
                  <Route path="/rooms/:id/handover" element={<HandoverChecklist />} />
                  <Route path="/assets" element={<AssetCatalog />} />
                  
                  {/* Building & Owner Routes */}
                  <Route path="/buildings" element={<BuildingList />} />
                  <Route path="/buildings/:id" element={<BuildingDetail />} />
                  <Route path="/owners" element={<OwnerList />} />
                  
                  <Route path="/" element={<Navigate to="/dashboard" replace />} />
                </Route>
              </Route>

              {/* 2. Tenant Portal Namespace (Protected, Mobile-first) */}
              <Route path="/portal" element={<ProtectedRoute requiredRole="Tenant" />}>
                <Route element={<PortalLayout />}>
                  <Route index element={<PortalHome />} />
                  <Route path="invoices" element={<InvoiceList />} />
                </Route>
              </Route>

              {/* 3.2.2 Portal Login & OTP (Separate pages) */}
              <Route path="/portal/login" element={<LoginPage />} />
              <Route path="/portal/verify-otp" element={<OTPVerifyPage />} />

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

