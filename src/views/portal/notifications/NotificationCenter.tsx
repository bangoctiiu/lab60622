import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Bell, 
  Receipt, 
  CheckCircle, 
  Wrench, 
  Calendar, 
  Megaphone,
  Trash2,
  ChevronRight,
  Info,
  Loader2,
  Inbox,
  Sparkles,
  ShieldCheck,
  CheckCheck,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';
import { toast } from 'sonner';

import api from '@/services/apiClient';
import { cn } from '@/utils';
import PortalLayout from '@/components/layout/PortalLayout';

const NOTIFICATION_ICONS: Record<string, any> = {
  'Invoice': { icon: Receipt, color: 'bg-orange-50 text-orange-600 border-orange-100', route: '/portal/invoices' },
  'Payment': { icon: CheckCircle, color: 'bg-emerald-50 text-emerald-600 border-emerald-100', route: '/portal/invoices' },
  'Ticket': { icon: Wrench, color: 'bg-teal-50 text-teal-600 border-teal-100', route: '/portal/tickets' },
  'Contract': { icon: Calendar, color: 'bg-red-50 text-red-600 border-red-100', route: '/portal' },
  'Announcement': { icon: Megaphone, color: 'bg-blue-50 text-blue-600 border-blue-100', route: '/portal/announcements' },
  'Reminder': { icon: Bell, color: 'bg-amber-50 text-amber-600 border-amber-100', route: '/portal' },
  'Default': { icon: Info, color: 'bg-slate-50 text-slate-600 border-slate-100', route: '#' }
};

const NotificationCenter = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'unread' | 'all'>('unread');

  // 1. Fetch Notifications
  const { data: notifications, isLoading, refetch } = useQuery({
    queryKey: ['portal-notifications', activeTab],
    queryFn: async () => {
      const res = await api.get('/api/portal/notifications', { 
        params: { 
          unreadOnly: activeTab === 'unread',
          limit: 50 
        } 
      });
      return res.data;
    }
  });

  // 2. Mutations
  const markReadAllMutation = useMutation({
    mutationFn: () => api.patch('/api/portal/notifications/read-all'),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['portal-unread-count'] });
      toast.success('Đã đánh dấu tất cả là đã đọc');
    }
  });

  const deleteMutation = useMutation({
    mutationFn: (id: string) => api.delete(`/api/portal/notifications/${id}`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-notifications'] });
      toast.success('Đã xóa thông báo');
    }
  });

  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/portal/notifications/${id}/read`),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-notifications'] });
      queryClient.invalidateQueries({ queryKey: ['portal-unread-count'] });
    }
  });

  // 3. Polling Realtime
  useEffect(() => {
    const pollInterval = setInterval(() => {
      refetch();
    }, 45000);
    
    return () => clearInterval(pollInterval);
  }, [refetch]);

  const handleNotifyClick = (item: any) => {
    if (!item.isRead) markReadMutation.mutate(item.id);
    const config = NOTIFICATION_ICONS[item.entityType] || NOTIFICATION_ICONS.Default;
    
    if (config.route !== '#') {
      let targetRoute = config.route;
      
      if (item.entityId) {
        if (item.entityType === 'Invoice') targetRoute = `/portal/invoices/${item.entityId}`;
        else if (item.entityType === 'Ticket') targetRoute = `/portal/tickets/${item.entityId}`;
        else if (item.entityType === 'Announcement') targetRoute = `/portal/announcements`;
      }
      
      navigate(targetRoute);
    }
  };

  const notificationList = Array.isArray(notifications?.items) ? notifications.items : [];

  return (
    <PortalLayout 
      title="Trung tâm thông báo"
      headerTransparent={true}
      rightAction={
        <button 
          onClick={() => markReadAllMutation.mutate()}
          className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 shadow-lg"
        >
          <CheckCheck size={20} />
        </button>
      }
    >
      <div className="bg-slate-50 min-h-screen">
        
        {/* 1. Lush Notification Banner */}
        <div className="bg-[#0D8A8A] pt-24 pb-24 px-8 rounded-b-[48px] shadow-2xl shadow-teal-500/10 relative overflow-hidden">
           <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
           <div className="absolute bottom-[-15%] left-[-10%] w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />
           
           <div className="relative z-10 flex flex-col gap-6 text-left">
              <div className="flex items-center gap-4">
                 <div className="w-14 h-14 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl relative">
                    <Bell size={28} strokeWidth={1.5} className="animate-bounce-slow" />
                    {notifications?.unreadCount > 0 && <div className="absolute -top-1 -right-1 w-5 h-5 bg-red-500 rounded-full border-4 border-[#0D8A8A] animate-pulse" />}
                 </div>
                 <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-white tracking-tight leading-none uppercase">Thông báo</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mt-1">SmartStay Alert System</p>
                 </div>
              </div>

              <div className="flex items-center gap-3">
                 <div className="bg-white/10 backdrop-blur-md px-5 py-3 rounded-[24px] border border-white/10 flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center">
                       <ShieldCheck size={16} />
                    </div>
                    <span className="text-[11px] font-black text-white uppercase tracking-widest leading-none">Chế độ giám sát</span>
                 </div>
                 <div className="flex-1 bg-white px-5 py-3 rounded-[24px] shadow-xl shadow-black/10 flex items-center justify-between group active:scale-95 transition-all overflow-hidden relative">
                    <span className="text-[11px] font-black text-slate-800 uppercase tracking-tight relative z-10">TỔNG {notifications?.total || 0}</span>
                    <ArrowRight size={16} className="text-[#0D8A8A] relative z-10" />
                    <div className="absolute top-0 right-0 w-16 h-16 bg-teal-50 rounded-full -mr-8 -mt-8 opacity-0 group-hover:opacity-100 transition-all duration-700" />
                 </div>
              </div>
           </div>
           
           <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 opacity-5 -rotate-12">
              <Bell size={200} className="text-white" />
           </div>
        </div>

        {/* 2. Tactical Tab Hub (Overlap) */}
        <div className="px-6 -mt-10 relative z-20">
           <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-slate-200/50 border-2 border-slate-200 flex items-center gap-1">
              <button 
                onClick={() => setActiveTab('unread')}
                className={cn(
                  "flex-1 h-12 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-2",
                  activeTab === 'unread' ? "bg-[#0D8A8A] text-white shadow-lg shadow-teal-500/20" : "text-slate-400 hover:text-slate-600"
                )}
              >
                Chưa đọc
                {notifications?.unreadCount > 0 && (
                  <div className={cn(
                     "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
                     activeTab === 'unread' ? "bg-white text-[#0D8A8A]" : "bg-red-500 text-white shadow-sm"
                  )}>
                    {notifications.unreadCount}
                  </div>
                )}
              </button>
              <button 
                onClick={() => setActiveTab('all')}
                className={cn(
                  "flex-1 h-12 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all flex items-center justify-center",
                  activeTab === 'all' ? "bg-[#0D8A8A] text-white shadow-lg shadow-teal-500/20" : "text-slate-400 hover:text-slate-600"
                )}
              >
                TẤT CẢ
              </button>
           </div>
        </div>

        {/* 3. Personalized Notification Feed */}
        <div className="px-6 pt-10 pb-32 space-y-6 text-left">
           <div className="flex items-center justify-between px-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">{activeTab === 'unread' ? 'Tin mới gửi đến' : 'Lịch sử hoạt động'}</h3>
              <div className="bg-white px-3 py-1 rounded-full border border-slate-200">
                 <span className="text-[9px] font-black text-slate-400 uppercase tracking-widest">Thời gian thực</span>
              </div>
           </div>

          {isLoading ? (
            <div className="space-y-4">
               {Array(5).fill(0).map((_, i) => (
                  <div key={i} className="h-28 bg-white rounded-[32px] animate-pulse border border-slate-100" />
               ))}
            </div>
          ) : notificationList.length > 0 ? (
            <div className="space-y-4">
              {notificationList.map((item: any) => (
                 <NotificationItem 
                   key={item.id} 
                   item={item} 
                   onClick={() => handleNotifyClick(item)} 
                   onDelete={() => deleteMutation.mutate(item.id)}
                 />
              ))}
            </div>
          ) : (
            <div className="text-center py-24 bg-white rounded-[48px] shadow-xl shadow-slate-200/50 border-2 border-slate-100 px-10 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner text-slate-200 italic">
                  <Inbox size={48} strokeWidth={1} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-slate-800 font-black text-xl tracking-tight uppercase uppercase">Nhà cửa yên bình</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-wider px-6 opacity-60 italic">
                    Hiện tại bạn không có thông báo nào chưa đọc. Mọi thứ đang được vận hành tốt.
                  </p>
               </div>
               <button 
                 onClick={() => setActiveTab('all')}
                 className="mt-10 h-16 w-full bg-[#0D8A8A] text-white rounded-[28px] font-black text-sm shadow-2xl shadow-teal-500/30 active:scale-95 transition-all uppercase tracking-widest"
               >
                 Xem lịch sử thông báo
               </button>
            </div>
          )}

           <div className="mt-6 p-8 bg-teal-50/30 rounded-[48px] border-2 border-dashed border-teal-200/40 text-center space-y-4">
              <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center mx-auto text-teal-600 shadow-xl border border-slate-50">
                 <ShieldCheck size={28} strokeWidth={2} />
              </div>
              <div className="space-y-1 px-4">
                 <p className="text-[11px] font-black text-teal-800 uppercase tracking-[0.2em] leading-relaxed">Luôn cập nhật thông tin</p>
                 <p className="text-[10px] font-bold text-teal-600/40 uppercase tracking-widest leading-loose">Bật thông báo đẩy để không bỏ lỡ mọi tin tức quan trọng từ SmartStay.</p>
              </div>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
};

const NotificationItem = ({ item, onClick, onDelete }: any) => {
  const config = NOTIFICATION_ICONS[item.entityType] || NOTIFICATION_ICONS.Default;
  const Icon = config.icon;
  const [touchStart, setTouchStart] = useState<number | null>(null);
  const [touchEnd, setTouchEnd] = useState<number | null>(null);
  const [swiped, setSwiped] = useState(false);

  const minSwipeDistance = 80;

  const onTouchStart = (e: React.TouchEvent) => {
    setTouchEnd(null);
    setTouchStart(e.targetTouches[0].clientX);
  };

  const onTouchMove = (e: React.TouchEvent) => {
    setTouchEnd(e.targetTouches[0].clientX);
    if (touchStart) {
      const distance = touchStart - e.targetTouches[0].clientX;
      if (distance > 20) setSwiped(true);
      if (distance < -20) setSwiped(false);
    }
  };

  const onTouchEnd = () => {
    if (!touchStart || !touchEnd) return;
    const distance = touchStart - touchEnd;
    const isLeftSwipe = distance > minSwipeDistance;
    if (isLeftSwipe) setSwiped(true);
    else setSwiped(false);
  };

  return (
    <div 
      className="relative group overflow-hidden rounded-[32px] active:scale-[0.98] transition-all shadow-xl shadow-slate-200/30 border-2 border-white"
      onTouchStart={onTouchStart}
      onTouchMove={onTouchMove}
      onTouchEnd={onTouchEnd}
    >
      <div 
        className={cn(
          "absolute inset-y-0 right-0 w-24 bg-red-500 flex items-center justify-center transition-transform duration-300 z-0",
          swiped ? "translate-x-0" : "translate-x-full group-hover:translate-x-0"
        )} 
        onClick={(e) => { e.stopPropagation(); onDelete(); }}
      >
         <Trash2 className="text-white" size={24} />
      </div>

      <div 
        onClick={onClick}
        className={cn(
          "relative bg-white p-6 flex gap-5 transition-transform duration-500 z-10 border border-slate-50",
          swiped ? "-translate-x-24" : "group-hover:-translate-x-24",
          !item.isRead && "bg-gradient-to-r from-teal-50/40 to-transparent"
        )}
      >
        <div className={cn("w-14 h-14 rounded-2xl flex items-center justify-center shrink-0 shadow-inner border", config.color)}>
           <Icon size={28} strokeWidth={1.5} className="group-hover:rotate-6 transition-transform" />
        </div>
        
        <div className="flex-1 flex flex-col justify-center min-w-0 pr-2 gap-1.5">
           <div className="flex justify-between items-start">
             <h4 className={cn("text-sm font-black truncate uppercase tracking-tight", !item.isRead ? "text-slate-800" : "text-slate-400")}>
               {item.title}
             </h4>
             {!item.isRead && <div className="w-2.5 h-2.5 bg-red-500 rounded-full shrink-0 mt-1 relative"><div className="absolute inset-0 bg-red-500 rounded-full animate-ping opacity-40" /></div>}
           </div>
           <p className={cn("text-[11px] leading-relaxed line-clamp-2 uppercase tracking-wide font-medium", !item.isRead ? "text-slate-500" : "text-slate-300")}>
             {item.content}
           </p>
           <div className="flex items-center gap-2 pt-1">
              <span className="text-[10px] text-[#0D8A8A] font-black uppercase tracking-widest opacity-60">
                {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true, locale: vi })}
              </span>
           </div>
        </div>
        
        <div className="flex flex-col justify-center text-slate-200 group-hover:opacity-0 transition-opacity">
           <ChevronRight size={18} strokeWidth={3} />
        </div>
      </div>
    </div>
  );
};

export default NotificationCenter;
