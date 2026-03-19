import React, { useState } from 'react';
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom';
import { 
  Bell, ChevronLeft
} from 'lucide-react';
import BottomNavigation from '@/components/layout/BottomNavigation';

import useAuthStore from '@/stores/authStore';
import useUIStore from '@/stores/uiStore';
import { Sidebar } from '@/components/layout/Sidebar';
import { Topbar } from '@/components/layout/Topbar';
import { PublicTopbar, PublicFooter } from './PublicComponents';
import { cn } from '@/utils';

// --- 4.1 Admin & Staff Shared Layout ---
export const AdminLayout = () => {
  const { sidebarOpen, toggleSidebar } = useUIStore();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="flex bg-bg min-h-screen overflow-x-hidden">
      {/* 4.1 Sidebar logic for Desktop & Mobile */}
      <div className={cn(
        "hidden lg:block", 
        sidebarOpen ? "w-[260px]" : "w-[72px]"
      )}>
        <Sidebar />
      </div>

      {/* 4.1 Mobile Sidebar Overlay */}
      {mobileMenuOpen && (
        <div className="lg:hidden fixed inset-0 z-[100] flex">
          <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm" onClick={() => setMobileMenuOpen(false)} />
          <div className="w-[260px] relative z-10 animate-in slide-in-from-left duration-300">
            <Sidebar />
          </div>
        </div>
      )}

      {/* 4.1 Main Dynamic Content Framework */}
      <div className="flex-1 flex flex-col min-w-0">
        <Topbar onMobileMenuToggle={() => setMobileMenuOpen(true)} />
        
        {/* 4.1 ContentArea: max-w-1280px + Responsive Padding */}
        <main className="flex-1 overflow-auto animate-in fade-in slide-in-from-right-4 duration-700">
          <div className="max-w-[1280px] mx-auto p-4 sm:p-5 md:p-8 lg:p-12">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
};

// --- TODO: 4.3 StaffLayout is handled implicitly within AdminLayout via role-based sidebar items.
// In a real app we might add Staff-specific widgets in the Dashboard component based on role.

// --- 4.2 PortalLayout (Tenant) ---
export const PortalLayout = () => {
  const navigate = useNavigate();
  const location = useLocation();

  const getTitleFromRoute = () => {
    switch (location.pathname) {
      case '/portal/dashboard': return 'Dashboard';
      case '/portal/invoices': return 'Hoá đơn';
      case '/portal/tickets': return 'Ticket';
      case '/portal/amenities': return 'Tiện ích';
      case '/portal/profile': return 'Hồ sơ';
      default: return 'SmartStay';
    }
  };

  return (
    <div className="portal-container">
      {/* Sticky Top Bar */}
      <header className="portal-topbar">
        <div className="w-10">
          {location.pathname !== '/portal' && location.pathname !== '/portal/dashboard' && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        
        <h1 className="flex-1 text-center font-bold text-lg truncate uppercase tracking-wide">
          {getTitleFromRoute()}
        </h1>
        
        <div className="w-10 flex justify-end">
          <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
            <Bell size={20} />
            <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-[var(--portal-primary)]"></span>
          </button>
        </div>
      </header>

      {/* Content Area */}
      <main className="portal-content min-h-[calc(100vh-120px)] p-4">
        <Outlet />
      </main>

      {/* Sticky Bottom Nav */}
      <BottomNavigation />
    </div>
  );
};



// --- 4.3 Public Layout (Hero pages / Landing) ---
export const PublicLayout = ({ showHeader = true }: { showHeader?: boolean }) => (
  <div className="min-h-screen bg-bg flex flex-col">
    {showHeader && <PublicTopbar />}
    <main className="flex-1 animate-in fade-in duration-700">
      <Outlet />
    </main>
    {showHeader && <PublicFooter />}
  </div>
);

// Specific Icons fix
import { Receipt as ReceiptIcon, MessageSquare as MessageSquareIcon, Bell as BellBadgeIcon, User as UserCircleIcon } from 'lucide-react';
