import React from 'react';
import { NavLink } from 'react-router-dom';
import { 
  LayoutDashboard, FileText, Receipt, CreditCard, Users, 
  DoorOpen, Building, Gauge, Package, AlertCircle, 
  BarChart2, Megaphone, Briefcase, Wrench, Zap, 
  Droplets, UserCog, Settings, ScrollText, ChevronLeft,
  ChevronRight, LogOut, Building2
} from 'lucide-react';
import { cn } from '@/utils';
import useUIStore from '@/stores/uiStore';
import useAuthStore from '@/stores/authStore';

interface NavItem {
  label: string;
  route: string;
  icon: any;
  permission?: string;
  adminOnly?: boolean;
  badge?: number;
}

const navItems: { group: string; items: NavItem[] }[] = [
  {
    group: "CORE SYSTEM",
    items: [
      { label: "Tổng quan", route: "/dashboard", icon: LayoutDashboard },
      { label: "Vé của tôi", route: "/tickets?assignedTo=me", icon: AlertCircle, permission: "ticket.view" },
      { label: "Hợp đồng", route: "/contracts", icon: FileText, permission: "contract.view" },
      { label: "Hóa đơn", route: "/invoices", icon: Receipt, permission: "invoice.view" },
      { label: "Thanh toán", route: "/payments", icon: CreditCard, permission: "payment.view" },
      { label: "Cư dân", route: "/tenants", icon: Users, permission: "tenant.view" },
      { label: "Phòng", route: "/rooms", icon: DoorOpen, permission: "room.view" },
      { label: "Tòa nhà", route: "/buildings", icon: Building, permission: "building.view" },
    ]
  },
  {
    group: "OPERATIONS",
    items: [
      { label: "Nhập số điện/nước", route: "/meters/bulk-entry", icon: Gauge, permission: "meter.entry" },
      { label: "Kiểm tra Khách", route: "/staff/visitor-checkin", icon: Users, permission: "visitor.checkin" },
      { label: "Kiểm tra Tiện ích", route: "/staff/amenity-checkin", icon: Zap, permission: "amenity.checkin" },
      { label: "Tài sản", route: "/assets", icon: Package, permission: "asset.view" },
      { label: "Tất cả Vé yêu cầu", route: "/tickets", icon: AlertCircle, permission: "ticket.view.all", badge: 3 },
      { label: "Báo cáo", route: "/reports", icon: BarChart2, permission: "report.view" },
      { label: "Thông báo", route: "/announcements", icon: Megaphone, permission: "announcement.manage" },
      { label: "Chủ sở hữu", route: "/owners", icon: Briefcase, adminOnly: true },
    ]
  },
  {
    group: "SETTINGS",
    items: [
      { label: "Dịch vụ & Giá", route: "/services", icon: Wrench, permission: "service.manage" },
      { label: "Chính sách Điện", route: "/settings/electricity-policy", icon: Zap, adminOnly: true },
      { label: "Chính sách Nước", route: "/settings/water-policy", icon: Droplets, adminOnly: true },
      { label: "Người dùng", route: "/settings/users", icon: UserCog, adminOnly: true },
      { label: "Cấu hình hệ thống", route: "/settings/system", icon: Settings, adminOnly: true },
      { label: "Nhật ký hoạt động", route: "/settings/audit-logs", icon: ScrollText, adminOnly: true },
    ]
  }
];

export const Sidebar = () => {
  const { sidebarOpen, toggleSidebar, activeBuildingId, setBuilding } = useUIStore();
  const { user, logout } = useAuthStore();
  
  const isAdmin = user?.role === 'Admin';
  
  return (
    <aside className={cn(
      "fixed left-0 top-0 h-screen bg-primary text-white flex flex-col z-50 transition-all duration-300 ease-in-out shadow-2xl",
      sidebarOpen ? "w-[260px]" : "w-[72px]"
    )}>
      {/* 4.1 Logo Section */}
      <div className="h-20 flex items-center px-6 border-b border-white/10 shrink-0">
        <div className="flex items-center gap-3 overflow-hidden">
          <div className="w-10 h-10 bg-accent rounded-xl flex items-center justify-center shrink-0 shadow-lg shadow-accent/20">
            <Building2 size={22} className="text-white" />
          </div>
          {sidebarOpen && (
            <div className="animate-in fade-in slide-in-from-left-4 duration-500">
              <h1 className="text-xl font-display font-bold whitespace-nowrap tracking-tight">
                SmartStay <span className="text-accent">BMS</span>
              </h1>
              <p className="text-[9px] text-white/40 font-mono tracking-[0.2em]">COMMAND CENTER</p>
            </div>
          )}
        </div>
      </div>

      {/* 4.1 Building Selector */}
      <div className={cn("px-4 py-4 transition-all overflow-hidden", sidebarOpen ? "block" : "hidden lg:block lg:invisible lg:h-0")}>
        <div className="bg-white/5 border border-white/10 rounded-xl p-3 flex items-center gap-3 group hover:bg-white/10 transition-colors cursor-pointer">
          <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center shrink-0">
            <Building size={16} />
          </div>
          <div className="flex-1 min-w-0">
            <p className="text-[10px] text-white/40 font-bold uppercase tracking-wider">Active Building</p>
            <p className="text-sm font-bold truncate">The Manor Central Park</p>
          </div>
        </div>
      </div>

      {/* 4.1.1 Navigation Items */}
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-6 custom-scrollbar">
        {navItems.map((group) => {
          const visibleItems = group.items.filter(item => !item.adminOnly || isAdmin);
          if (visibleItems.length === 0) return null;

          return (
            <div key={group.group} className="space-y-1">
              {sidebarOpen && (
                <p className="text-[10px] text-white/30 font-bold uppercase tracking-[0.2em] px-4 mb-2">
                  {group.group}
                </p>
              )}
              {visibleItems.map((item) => (
                <NavLink
                  key={item.route}
                  to={item.route}
                  className={({ isActive }) => cn(
                    "flex items-center gap-3 px-4 py-3 rounded-xl transition-all group relative",
                    isActive 
                      ? "bg-white/10 text-white font-bold ring-1 ring-white/20" 
                      : "text-white/60 hover:text-white hover:bg-white/5"
                  )}
                  title={!sidebarOpen ? item.label : undefined}
                >
                  {({ isActive }) => (
                    <>
                      <item.icon size={20} className={cn("shrink-0 transition-transform group-hover:scale-110")} />
                      {sidebarOpen && (
                        <span className="flex-1 truncate text-sm">
                          {item.label}
                        </span>
                      )}
                      {item.badge && sidebarOpen && (
                        <span className="bg-danger text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full ring-2 ring-primary">
                          {item.badge}
                        </span>
                      )}
                      {!sidebarOpen && isActive && (
                        <div className="absolute left-0 w-1 h-8 bg-accent rounded-r-full"></div>
                      )}
                    </>
                  )}
                </NavLink>
              ))}
            </div>
          );
        })}
      </nav>

      {/* 4.1 Bottom: User Info & Collapse */}
      <div className="p-3 bg-white/5 border-t border-white/10 space-y-2">
        <div className={cn(
          "flex items-center gap-3 p-3 rounded-xl transition-all",
          sidebarOpen ? "bg-white/5" : "bg-transparent"
        )}>
          <div className="w-8 h-8 rounded-full bg-accent flex items-center justify-center text-xs font-bold shrink-0 shadow-lg shadow-accent/20">
            {user?.username?.substring(0, 2).toUpperCase() || 'AD'}
          </div>
          {sidebarOpen && (
            <div className="flex-1 min-w-0">
              <p className="text-sm font-bold truncate leading-none">{user?.username || 'Administrator'}</p>
              <p className="text-[10px] text-white/40 mt-1 uppercase tracking-tighter">{user?.role || 'Admin'}</p>
            </div>
          )}
          <button 
            onClick={logout} 
            className={cn("p-1.5 hover:bg-danger/20 hover:text-danger rounded-lg transition-colors shrink-0", !sidebarOpen && "mx-auto")}
          >
            <LogOut size={16} />
          </button>
        </div>
        
        <button 
          onClick={toggleSidebar} 
          className="w-full flex items-center justify-center py-2 text-white/30 hover:text-white transition-colors"
        >
          {sidebarOpen ? <ChevronLeft size={20} /> : <ChevronRight size={20} />}
        </button>
      </div>
    </aside>
  );
};
