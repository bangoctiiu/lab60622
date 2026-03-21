import React from 'react';
import { useNavigate, useLocation, useOutlet } from 'react-router-dom';
import { ChevronLeft, Bell } from 'lucide-react';
import BottomNavigation from './BottomNavigation';

interface PortalLayoutProps {
  /** The title to display in the header. If omitted, it will be inferred from the current route. */
  title?: string;
  /** Whether to show the back button. Default is true. */
  showBack?: boolean;
  /** Custom element to show in the top-right corner of the header. */
  rightAction?: React.ReactNode;
  /** Alternative to route-based rendering. If provided, these children will render if no nested route matches. */
  children?: React.ReactNode;
}

const PortalLayout: React.FC<PortalLayoutProps> = ({ 
  title, 
  showBack = true,
  rightAction,
  children
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  
  let outlet = null;
  try {
    outlet = useOutlet();
  } catch (e) {
    // Ignore if not in a valid router context
  }

  // Determine title based on route if not provided
  const getTitleFromRoute = () => {
    const path = location.pathname;
    if (path === '/portal' || path === '/portal/dashboard') return 'Dashboard';
    if (path === '/portal/invoices') return 'Hoá đơn';
    if (path.startsWith('/portal/invoices/')) return 'Chi tiết hoá đơn';
    if (path === '/portal/tickets') return 'Hỗ trợ & Ticket';
    if (path === '/portal/tickets/create') return 'Gửi yêu cầu mới';
    if (path.startsWith('/portal/tickets/')) return 'Chi tiết Ticket';
    if (path === '/portal/amenities') return 'Tiện ích tòa nhà';
    if (path === '/portal/amenities/my-bookings') return 'Lịch đặt của tôi';
    if (path === '/portal/profile') return 'Thông tin cá nhân';
    if (path === '/portal/notifications') return 'Trung tâm thông báo';
    if (path === '/portal/visitors') return 'Đăng ký khách';
    if (path === '/portal/payments/history') return 'Lịch sử thanh toán';
    if (path === '/portal/balance') return 'Số dư & Ví';
    if (path === '/portal/contract') return 'Hợp đồng thuê';
    if (path === '/portal/faq') return 'Câu hỏi thường gặp';
    if (path === '/portal/service-requests') return 'Yêu cầu dịch vụ';
    if (path === '/portal/documents') return 'Giấy tờ hồ sơ';
    
    return title || 'SmartStay';
  };

  return (
    <div className="h-screen w-full bg-[#F1F5F9] font-sans overflow-hidden flex justify-center selection:bg-[#0D8A8A]/10">
      <div className="portal-container shadow-2xl overflow-hidden w-full h-full max-w-[430px] flex flex-col bg-slate-50 relative border-x border-slate-200/50">
        {/* Premium Glass Sticky Header */}
        <header className="h-[72px] flex items-center px-5 bg-white/70 backdrop-blur-2xl border-b border-slate-100/50 shrink-0 z-50">
          <div className="w-10">
            {showBack && location.pathname !== '/portal' && location.pathname !== '/portal/dashboard' && (
              <button 
                onClick={() => navigate(-1)}
                className="w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-[#0D8A8A] hover:border-[#0D8A8A]/30 active:scale-95 transition-all shadow-sm"
              >
                <ChevronLeft size={20} strokeWidth={2.5} />
              </button>
            )}
          </div>
          
          <div className="flex-1 text-center space-y-0.5">
            <h1 className="font-black text-[15px] uppercase tracking-[3px] text-slate-800 truncate">
              {getTitleFromRoute()}
            </h1>
            <div className="flex justify-center">
              <div className="w-8 h-1 bg-[#0D8A8A] rounded-full opacity-20" />
            </div>
          </div>
          
          <div className="w-10 flex justify-end">
            {rightAction ? (
              rightAction
            ) : (
              <button 
                onClick={() => navigate('/portal/notifications')}
                className="group relative w-10 h-10 flex items-center justify-center rounded-2xl bg-white border border-slate-100 text-slate-400 hover:text-[#0D8A8A] hover:border-[#0D8A8A]/30 active:scale-95 transition-all shadow-sm"
              >
                <Bell size={18} strokeWidth={2.5} className="group-hover:rotate-12 transition-transform" />
                <span className="absolute top-2.5 right-2.5 h-2 w-2 bg-red-500 rounded-full ring-2 ring-white animate-pulse"></span>
              </button>
            )}
          </div>
        </header>

        {/* Dynamic Content Area with Mesh Background */}
        <main className="flex-1 overflow-y-auto portal-content custom-scrollbar">
          {outlet || children}
        </main>

        {/* Sticky Bottom Navigation Framework */}
        <BottomNavigation />
      </div>
    </div>
  );
};

export default PortalLayout;
