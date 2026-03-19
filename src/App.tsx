import React, { Suspense, lazy } from 'react';
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AppProviders } from './components/layout/AppProviders';
import ProtectedRoute from './routes/ProtectedRoute';
import PortalAuthGuard from './components/auth/PortalAuthGuard';
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
const Dashboard = lazy(() => import('./views/admin/Dashboard'));
const InvoiceList = lazy(() => import('./views/admin/finance/InvoiceList'));
const InvoiceDetail = lazy(() => import('./views/admin/finance/InvoiceDetail'));
const ContractList = lazy(() => import('./views/admin/contracts/ContractList'));
const ContractDetail = lazy(() => import('./views/admin/contracts/ContractDetail'));
const CreateContractWizard = lazy(() => import('./views/admin/contracts/CreateContractWizard'));
const ServiceCatalog = lazy(() => import('./views/admin/services/ServiceCatalog'));

// Payment Views
const PaymentList = lazy(() => import('./views/admin/finance/PaymentList'));
const WebhookLogs = lazy(() => import('./views/admin/finance/WebhookLogs'));
const TenantList = lazy(() => import('./views/admin/tenants/TenantList'));
const TenantDetail = lazy(() => import('./views/admin/tenants/TenantDetail'));
const TenantBalance = lazy(() => import('./views/admin/tenants/TenantBalance'));

// Room & Asset Views
const RoomList = lazy(() => import('./views/admin/rooms/RoomList'));
const RoomDetail = lazy(() => import('./views/admin/rooms/RoomDetail'));
const HandoverChecklist = lazy(() => import('./views/admin/rooms/HandoverChecklist'));
const AssetCatalog = lazy(() => import('./views/admin/assets/AssetCatalog'));

// Building & Owner Views
const BuildingList = lazy(() => import('./views/admin/buildings/BuildingList'));
const BuildingDetail = lazy(() => import('./views/admin/buildings/BuildingDetail'));
const OwnerList = lazy(() => import('./views/admin/owners/OwnerList'));

// Ticket & Support Views
const TicketList = lazy(() => import('./views/admin/tickets/TicketList'));
const TicketDetail = lazy(() => import('./views/admin/tickets/TicketDetail'));
const StaffRatings = lazy(() => import('./views/admin/tickets/StaffRatings'));

// Meter & Utilities Views
const MeterList = lazy(() => import('./views/admin/meters/MeterList'));
const BulkMeterEntry = lazy(() => import('./views/admin/meters/BulkMeterEntry'));
const MeterReadingHistory = lazy(() => import('./views/admin/meters/MeterReadingHistory'));

// Settings Views
const ElectricityPolicyPage = lazy(() => import('@/views/admin/settings/ElectricityPolicyPage'));
const WaterPolicyPage = lazy(() => import('@/views/admin/settings/WaterPolicyPage'));

// Portal Views
const PortalHome = lazy(() => import('@/views/portal/PortalHome'));

// Staff Specific Views
const VisitorCheckin = lazy(() => import('./views/admin/staff/VisitorCheckin'));
const AmenityCheckin = lazy(() => import('./views/admin/staff/AmenityCheckin'));

// Reports Views
const ReportsHub = lazy(() => import('@/views/admin/reports/ReportsHub'))
const OccupancyReport = lazy(() => import('@/views/admin/reports/OccupancyReport'))
const FinancialReport = lazy(() => import('@/views/admin/reports/FinancialReport'))
const DebtReport = lazy(() => import('@/views/admin/reports/DebtReport'))
const ConsumptionReport = lazy(() => import('@/views/admin/reports/ConsumptionReport'))
const RoomLifecycleReport = lazy(() => import('@/views/admin/reports/RoomLifecycleReport'))
const NPSReport = lazy(() => import('@/views/admin/reports/NPSReport'))
const StaffReport = lazy(() => import('@/views/admin/reports/StaffReport'))
const AlertsReport = lazy(() => import('./views/admin/reports/AlertsReport'));


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
                  {/* Tenant Routes */}
                  <Route path="/tenants" element={<TenantList />} />
                  <Route path="/tenants/:id" element={<TenantDetail />} />
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
 
                   {/* Ticket & Support Routes */}
                   <Route path="/tickets" element={<TicketList />} />
                   <Route path="/tickets/:id" element={<TicketDetail />} />
                   <Route path="/staff/:id/ratings" element={<StaffRatings />} />
                   
                   {/* Staff Specific Workflows */}
                   <Route path="/staff/visitor-checkin" element={<VisitorCheckin />} />
                   <Route path="/staff/amenity-checkin" element={<AmenityCheckin />} />
                   
                   {/* Meter & Utility Routes */}
                   <Route path="/meters" element={<MeterList />} />
                   <Route path="/meters/bulk-entry" element={<BulkMeterEntry />} />
                   <Route path="/meters/:id/readings" element={<MeterReadingHistory />} />
                   
                   {/* Service Catalog Route */}
                   <Route path="/services" element={<ServiceCatalog />} />
                   
                   {/* Reports Routes (Admin Only) */}
                   <Route element={<ProtectedRoute requiredRole="Admin" />}>
                     <Route path="/reports">
                       <Route index element={<Suspense fallback={<PageSkeleton />}><ReportsHub /></Suspense>} />
                       <Route path="occupancy" element={<Suspense fallback={<PageSkeleton />}><OccupancyReport /></Suspense>} />
                       <Route path="financial" element={<Suspense fallback={<PageSkeleton />}><FinancialReport /></Suspense>} />
                       <Route path="debt" element={<Suspense fallback={<PageSkeleton />}><DebtReport /></Suspense>} />
                       <Route path="consumption" element={<Suspense fallback={<PageSkeleton />}><ConsumptionReport /></Suspense>} />
                       <Route path="room-lifecycle" element={<Suspense fallback={<PageSkeleton />}><RoomLifecycleReport /></Suspense>} />
                       <Route path="nps" element={<Suspense fallback={<PageSkeleton />}><NPSReport /></Suspense>} />
                       <Route path="staff" element={<Suspense fallback={<PageSkeleton />}><StaffReport /></Suspense>} />
                       <Route path="alerts" element={<Suspense fallback={<PageSkeleton />}><AlertsReport /></Suspense>} />
                     </Route>
                     
                     {/* Settings Routes (Admin Only) */}
                     <Route path="/settings">
                       <Route path="electricity-policy" element={<Suspense fallback={<PageSkeleton />}><ElectricityPolicyPage /></Suspense>} />
                       <Route path="water-policy" element={<Suspense fallback={<PageSkeleton />}><WaterPolicyPage /></Suspense>} />
                     </Route>
                   </Route>

                   <Route path="/" element={<Navigate to="/dashboard" replace />} />
                 </Route>
               </Route>

              {/* 2. Tenant Portal Namespace (Protected, Mobile-first) */}
              <Route path="/portal" element={<PortalAuthGuard />}>
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

