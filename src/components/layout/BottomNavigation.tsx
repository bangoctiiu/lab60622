import React from 'react';
import { NavLink } from 'react-router-dom';
import { Home, Receipt, Wrench, Building2, User } from 'lucide-react';
import { cn } from '@/utils';

const navItems = [
  { icon: Home, label: 'Home', route: '/portal/dashboard' },
  { icon: Receipt, label: 'Hoá đơn', route: '/portal/invoices', badge: 2 }, // Mock badge for demo
  { icon: Wrench, label: 'Ticket', route: '/portal/tickets' },
  { icon: Building2, label: 'Tiện ích', route: '/portal/amenities' },
  { icon: User, label: 'Hồ sơ', route: '/portal/profile' },
];

const BottomNavigation: React.FC = () => {
  return (
    <nav className="portal-bottom-nav">
      {navItems.map((item) => (
        <NavLink
          key={item.route}
          to={item.route}
          className={({ isActive }) =>
            cn(
              "flex flex-col items-center justify-center flex-1 h-full transition-colors",
              isActive ? "text-[var(--portal-primary)]" : "text-slate-400"
            )
          }
        >
          {({ isActive }) => (
            <>
              <div className="relative">
                <item.icon 
                  size={24} 
                  strokeWidth={isActive ? 2.5 : 2}
                  fill={isActive ? "currentColor" : "none"}
                  fillOpacity={isActive ? 0.2 : 0}
                />
                {item.badge && (
                  <span className="absolute -top-1 -right-1 flex h-4 w-4 items-center justify-center rounded-full bg-red-500 text-[10px] font-bold text-white ring-2 ring-white">
                    {item.badge}
                  </span>
                )}
              </div>
              <span className="text-[10px] font-medium mt-1 uppercase tracking-tight">
                {item.label}
              </span>
            </>
          )}
        </NavLink>
      ))}
    </nav>
  );
};

export default BottomNavigation;
