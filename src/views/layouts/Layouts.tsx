import React, { useState, useEffect } from 'react';
import { Outlet, Link, useLocation } from 'react-router-dom';
import { 
  LogOut, User, LayoutDashboard, FileText, Settings, 
  Building2, Bell, Home, MessageSquare, Plus, ChevronRight,
  UserCircle
} from 'lucide-react';
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
  const { user } = useAuthStore();
  const location = useLocation();

  const bottomTabs = [
    { label: "Trang chủ", route: "/portal", icon: Home },
    { label: "Hóa đơn", route: "/portal/invoices", icon: ReceiptIcon }, // Small Receipt icon
    { label: "Yêu cầu", route: "/portal/tickets", icon: MessageSquareIcon }, // MessageSquare icon
    { label: "Thông báo", route: "/portal/notifications", icon: BellBadgeIcon, badge: 2 },
    { label: "Hồ sơ", route: "/portal/profile", icon: UserCircleIcon },
  ];

  return (
    <div className="min-h-screen bg-bg flex flex-col">
      {/* 4.2 AppBar (56px) */}
      <header className="h-[56px] px-4 flex items-center justify-between sticky top-0 bg-white/80 backdrop-blur-md z-40 border-b border-border">
        <div className="flex items-center gap-2">
          <div className="w-8 h-8 bg-secondary/10 rounded-lg flex items-center justify-center text-secondary">
            <Building2 size={20} />
          </div>
          <h1 className="text-sm font-bold text-primary truncate max-w-[180px]">
             The Manor Park
          </h1>
        </div>
        <div className="flex items-center gap-3">
          <button className="relative p-2 text-muted hover:text-primary transition-colors">
            <Bell size={20} />
            <span className="absolute top-1.5 right-1.5 w-2 h-2 bg-danger rounded-full border border-white"></span>
          </button>
        </div>
      </header>

      {/* 4.2 ContentArea: padding bottom: 80px */}
      <main className="flex-1 min-h-[calc(100vh-136px)] p-4 pb-24 overflow-auto animate-in fade-in slide-in-from-bottom-6 duration-500">
        <div className="max-w-[480px] mx-auto">
          <Outlet />
        </div>
      </main>

      {/* 4.2 BottomNavBar (60px) */}
      <nav className="fixed bottom-0 w-full h-[60px] bg-white border-t border-border flex items-center justify-around z-50 px-2 pb-safe shadow-[0_-4px_12px_rgba(0,0,0,0.05)] rounded-t-2xl">
        <PortalTab icon={Home} label="Trang chủ" route="/portal" active={location.pathname === "/portal"} />
        <PortalTab icon={FileText} label="Hóa đơn" route="/portal/invoices" active={location.pathname === "/portal/invoices"} />
        
        {/* Special Center Plus Button */}
        <div className="relative -top-3 scale-110">
          <button className="w-12 h-12 bg-accent rounded-full border-4 border-bg flex items-center justify-center shadow-lg shadow-accent/20">
            <Plus size={24} className="text-white" />
          </button>
        </div>

        <PortalTab icon={MessageSquare} label="Yêu cầu" route="/portal/tickets" active={location.pathname === "/portal/tickets"} />
        <PortalTab icon={UserCircle} label="Hồ sơ" route="/portal/profile" active={location.pathname === "/portal/profile"} />
      </nav>
    </div>
  );
};

const PortalTab = ({ icon: Icon, label, route, active }: { icon: any, label: string, route: string, active: boolean }) => (
  <Link to={route} className={cn(
    "flex flex-col items-center gap-1 transition-all",
    active ? "text-primary transform -translate-y-1" : "text-muted opacity-60 hover:opacity-100"
  )}>
    <div className={cn(
      "p-1.5 rounded-xl transition-all",
      active && "bg-primary/5 text-primary"
    )}>
      <Icon size={20} />
    </div>
    <span className="text-[9px] font-bold uppercase tracking-tighter">{label}</span>
  </Link>
);

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
