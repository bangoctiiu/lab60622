import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Bell, 
  CheckCircle2, 
  Clock, 
  Info, 
  AlertTriangle, 
  ChevronLeft,
  Search,
  CheckCheck
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';

const NotificationCenter: React.FC = () => {
  const navigate = useNavigate();
  const [filter, setFilter] = useState<'all' | 'unread'>('all');

  const notifications = [
    { id: 1, title: 'Hóa đơn tiền điện tháng 03/2024', description: 'Hóa đơn mới vừa được tạo. Vui lòng thanh toán trước ngày 20/03.', time: '2 giờ trước', type: 'invoice', unread: true },
    { id: 2, title: 'Bảo trì tòa nhà P.202', description: 'Chúng tôi sẽ tiến hành kiểm tra hệ thống điều hòa tại phòng bạn vào sáng mai.', time: '5 giờ trước', type: 'maintenance', unread: true },
    { id: 3, title: 'Đăng ký thành công', description: 'Yêu cầu đăng ký thẻ cư dân của bạn đã được quản lý tòa nhà phê duyệt.', time: 'Hôm qua', type: 'success', unread: false },
    { id: 4, title: 'Thông báo họp cư dân', description: 'Mời bạn tham dự buổi họp cư dân quý 1/2024 tại sảnh tòa nhà.', time: '2 ngày trước', type: 'info', unread: false },
  ];

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'invoice': return <Clock className="text-amber-500" size={18} />;
      case 'maintenance': return <AlertTriangle className="text-blue-500" size={18} />;
      case 'success': return <CheckCircle2 className="text-green-500" size={18} />;
      default: return <Info className="text-slate-500" size={18} />;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between gap-4">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thông báo</h1>
          </div>
          <button className="text-primary text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5 hover:underline">
            <CheckCheck size={14} />
            Đọc tất cả
          </button>
        </div>

        {/* Tab Filters */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setFilter('all')}
            className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${filter === 'all' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            Tất cả
          </button>
          <button 
            onClick={() => setFilter('unread')}
            className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${filter === 'unread' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            Chưa đọc (2)
          </button>
        </div>

        {/* Search Bar */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm thông báo..."
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm focus:shadow-md"
          />
        </div>

        {/* Notification List */}
        <div className="space-y-3">
          {notifications.map((notif) => (
            <motion.div
              key={notif.id}
              whileHover={{ y: -2 }}
              className={`p-5 rounded-3xl border transition-all flex gap-4 relative group cursor-pointer ${notif.unread ? 'bg-white border-primary/20 shadow-md shadow-primary/5' : 'bg-white/50 border-slate-100 shadow-sm opacity-80 hover:opacity-100'}`}
            >
              {notif.unread && (
                <div className="absolute top-5 right-5 w-2.5 h-2.5 rounded-full bg-primary" />
              )}
              
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${notif.unread ? 'bg-primary/5' : 'bg-slate-50'}`}>
                {getTypeIcon(notif.type)}
              </div>

              <div className="flex-1 min-w-0">
                <div className="flex justify-between items-start mb-1">
                  <h3 className={`text-sm font-black tracking-tight truncate pr-4 ${notif.unread ? 'text-slate-800' : 'text-slate-600'}`}>
                    {notif.title}
                  </h3>
                </div>
                <p className={`text-[13px] leading-relaxed line-clamp-2 ${notif.unread ? 'text-slate-600' : 'text-slate-400'}`}>
                  {notif.description}
                </p>
                <div className="flex items-center gap-2 mt-3">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{notif.time}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">{notif.type}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </PortalLayout>
  );
};

export default NotificationCenter;
