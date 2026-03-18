import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  User, 
  MapPin, 
  Settings, 
  Shield, 
  Bell, 
  CreditCard, 
  LogOut, 
  ChevronRight, 
  Camera, 
  Languages, 
  MessageSquare,
  ChevronLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';
import BottomSheet from '@/components/portal/BottomSheet';
import { useAuthStore } from '@/stores/authStore';

const Profile: React.FC = () => {
  const navigate = useNavigate();
  const { user, logout } = useAuthStore();
  const [activeSheet, setActiveSheet] = useState<string | null>(null);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  const MenuItem = ({ icon: Icon, label, value, onClick, danger }: any) => (
    <button 
      onClick={onClick}
      className="w-full flex items-center justify-between p-4 bg-white hover:bg-slate-50 transition-all group"
    >
      <div className="flex items-center gap-4">
        <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${danger ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-500 group-hover:text-primary'}`}>
          <Icon size={20} />
        </div>
        <div className="text-left">
          <p className="text-sm font-bold text-slate-700">{label}</p>
          {value && <p className="text-[12px] text-slate-400 font-medium">{value}</p>}
        </div>
      </div>
      <ChevronRight size={18} className="text-slate-300 group-hover:text-primary transition-colors" />
    </button>
  );

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4 mb-2">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Cài đặt tài khoản</h1>
        </div>

        {/* Profile Header */}
        <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-primary/5 rounded-full -mr-16 -mt-16 transition-transform group-hover:scale-110" />
          
          <div className="relative flex items-center gap-6">
            <div className="relative">
              <div className="w-24 h-24 rounded-[32px] bg-slate-100 overflow-hidden border-4 border-white shadow-xl">
                <img 
                  src={user?.avatar || `https://ui-avatars.com/api/?name=${user?.name}&background=random`} 
                  alt="Avatar" 
                  className="w-full h-full object-cover"
                />
              </div>
              <button className="absolute -bottom-1 -right-1 w-8 h-8 rounded-xl bg-primary text-white flex items-center justify-center shadow-lg border-2 border-white">
                <Camera size={14} />
              </button>
            </div>
            
            <div className="flex-1">
              <h2 className="text-xl font-black text-slate-800 tracking-tight">{user?.name || 'Cư dân'}</h2>
              <p className="text-slate-400 font-medium text-sm">{user?.email}</p>
              <div className="inline-flex items-center gap-1.5 px-3 py-1 bg-green-50 text-green-600 rounded-full text-[11px] font-black uppercase tracking-wider mt-2">
                <div className="w-1.5 h-1.5 rounded-full bg-green-500 animate-pulse" />
                Đã xác minh
              </div>
            </div>
          </div>
        </div>

        {/* Menu Sections */}
        <div className="space-y-4">
          <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            <MenuItem icon={User} label="Thông tin cá nhân" value="Họ tên, ngày sinh, CCCD" onClick={() => setActiveSheet('personal')} />
            <MenuItem icon={MapPin} label="Địa chỉ & Liên hệ" value="Số điện thoại, địa chỉ thường trú" onClick={() => setActiveSheet('contact')} />
            <MenuItem icon={Shield} label="Bảo mật" value="Mật khẩu, xác thực 2 lớp" onClick={() => setActiveSheet('security')} />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm divide-y divide-slate-50">
            <MenuItem icon={Bell} label="Thông báo" onClick={() => setActiveSheet('notifications')} />
            <MenuItem icon={Languages} label="Ngôn ngữ" value="Tiếng Việt (Vietnam)" onClick={() => setActiveSheet('language')} />
            <MenuItem icon={MessageSquare} label="Góp ý ứng dụng" onClick={() => setActiveSheet('feedback')} />
          </div>

          <div className="overflow-hidden rounded-3xl border border-slate-100 shadow-sm">
            <MenuItem icon={LogOut} label="Đăng xuất" danger onClick={handleLogout} />
          </div>
        </div>

        <p className="text-center text-slate-300 font-medium text-[11px] tracking-widest uppercase py-4">
          SmartStay Version 1.2.0 • Build 20240318
        </p>
      </div>

      <BottomSheet isOpen={!!activeSheet} onClose={() => setActiveSheet(null)} title={
        activeSheet === 'personal' ? 'Thông tin cá nhân' :
        activeSheet === 'contact' ? 'Địa chỉ & Liên hệ' :
        activeSheet === 'security' ? 'Bảo mật' :
        activeSheet === 'notifications' ? 'Thông báo' :
        activeSheet === 'language' ? 'Cài đặt ngôn ngữ' :
        activeSheet === 'feedback' ? 'Góp ý ứng dụng' : ''
      }>
        <div className="space-y-4">
          <p className="text-slate-500 text-sm">Tính năng này đang được cập nhật. Vui lòng quay lại sau.</p>
        </div>
      </BottomSheet>
    </PortalLayout>
  );
};

export default Profile;
