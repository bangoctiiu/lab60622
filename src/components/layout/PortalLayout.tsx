import React from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import { cn } from '@/utils';
import BottomNavigation from './BottomNavigation';

interface PortalLayoutProps {
  children: React.ReactNode;
  title?: string;
  showBack?: boolean;
  rightAction?: React.ReactNode;
  headerTransparent?: boolean;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ 
  children, 
  title, 
  showBack = true,
  rightAction,
  headerTransparent = false
}) => {
  const navigate = useNavigate();
  const location = useLocation();

  // Determine title based on route if not provided
  const getTitleFromRoute = () => {
    switch (location.pathname) {
      case '/portal/dashboard': return 'Dashboard';
      case '/portal/invoices': return 'Hoá đơn';
      case '/portal/tickets': return 'Ticket';
      case '/portal/amenities': return 'Tiện ích';
      case '/portal/profile': return 'Hồ sơ';
      default: return title || 'SmartStay';
    }
  };

  return (
    <div className="portal-container">
      {/* Sticky Top Bar */}
      <header className={cn(
        "portal-topbar",
        headerTransparent ? "bg-transparent border-none shadow-none" : ""
      )}>
        <div className="w-10 flex items-center">
          {showBack && location.pathname !== '/portal/dashboard' && (
            <button 
              onClick={() => navigate(-1)}
              className="p-2 hover:bg-white/10 rounded-full transition-colors"
            >
              <ChevronLeft size={24} />
            </button>
          )}
        </div>
        
        <h1 className="flex-1 text-center font-bold text-lg truncate">
          {getTitleFromRoute()}
        </h1>
        
        <div className="w-10 flex items-center justify-end">
          {rightAction ? (
            rightAction
          ) : (
            <button className="p-2 hover:bg-white/10 rounded-full transition-colors relative">
              <Bell size={20} />
              <span className="absolute top-2 right-2 h-2 w-2 bg-red-500 rounded-full ring-2 ring-[var(--portal-primary)]"></span>
            </button>
          )}
        </div>
      </header>

      {/* Content Area */}
      <main className="portal-content min-h-[calc(100vh-120px)]">
        {children}
      </main>

      {/* Sticky Bottom Nav */}
      <BottomNavigation />
    </div>
  );
};

export default PortalLayout;
