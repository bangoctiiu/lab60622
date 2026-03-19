import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Megaphone, 
  Search, 
  ChevronRight,
  AlertTriangle,
  Pin,
  Share2,
  History,
  Info,
  Sparkles,
  ArrowRight,
  BellRing
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { formatDistanceToNow } from 'date-fns';
import { vi } from 'date-fns/locale';

import api from '@/services/apiClient';
import { cn } from '@/utils';
import { BottomSheet } from '@/components/portal/BottomSheet';
import { RichTextViewer } from '@/components/shared/RichTextEditor';
import PortalLayout from '@/components/layout/PortalLayout';

const ANNOUNCEMENT_TYPES = [
  { id: 'all', label: 'Tất cả' },
  { id: 'Maintenance', label: 'Bảo trì', color: 'bg-blue-50 text-blue-600 border-blue-100' },
  { id: 'Policy', label: 'Chính sách', color: 'bg-purple-50 text-purple-600 border-purple-100' },
  { id: 'Event', label: 'Sự kiện', color: 'bg-emerald-50 text-emerald-600 border-emerald-100' },
  { id: 'Emergency', label: 'Khẩn cấp', color: 'bg-red-50 text-red-600 border-red-100' },
];

const Announcements = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeFilter, setActiveFilter] = useState('all');
  const [selectedAnn, setSelectedAnn] = useState<any>(null);

  // 1. Fetch Announcements
  const { data: annData, isLoading } = useQuery({
    queryKey: ['portal-announcements', activeFilter],
    queryFn: async () => {
      const params = activeFilter === 'all' ? {} : { type: activeFilter };
      const res = await api.get('/api/portal/announcements', { params });
      return res.data;
    }
  });

  // 2. Mark as read mutation
  const markReadMutation = useMutation({
    mutationFn: (id: string) => api.patch(`/api/portal/notifications/mark-read`, { entityId: id, type: 'Announcement' }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-unread-count'] });
    }
  });

  const handleOpenDetail = (ann: any) => {
    setSelectedAnn(ann);
    markReadMutation.mutate(ann.id);
  };

  const handleShare = async (ann: any) => {
    const shareData = {
      title: ann.title,
      text: ann.summary || ann.title,
      url: window.location.href
    };
    if (navigator.share) {
      try {
        await navigator.share(shareData);
      } catch (err) {
        toast.info('Link bài viết đã sẵn sàng chia sẻ');
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      toast.success('Đã sao chép link liên kết');
    }
  };

  const items = annData?.items || [];
  const pinnedItems = items.filter((i: any) => i.isPinned);
  const otherItems = items.filter((i: any) => !i.isPinned);

  return (
    <PortalLayout 
      title="Bảng tin cư dân"
      headerTransparent={true}
      rightAction={
        <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all shadow-lg">
          <Search size={20} />
        </button>
      }
    >
      <div className="bg-slate-50 min-h-screen">
        
        {/* 1. Lush News Banner */}
        <div className="bg-[#0D8A8A] pt-24 pb-24 px-8 rounded-b-[48px] shadow-2xl shadow-teal-500/10 relative overflow-hidden">
           <div className="absolute top-[-5%] right-[-5%] w-64 h-64 bg-white/5 rounded-full blur-3xl" />
           <div className="absolute bottom-[-15%] left-[-10%] w-48 h-48 bg-teal-400/10 rounded-full blur-2xl" />
           
           <div className="relative z-10 flex flex-col gap-5 text-left">
              <div className="flex items-center gap-3">
                 <div className="w-12 h-12 bg-white/10 rounded-2xl backdrop-blur-md border border-white/20 flex items-center justify-center text-white">
                    <Megaphone size={24} strokeWidth={1.5} />
                 </div>
                 <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-white tracking-tight">Cập nhật mới nhất</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none">SmartStay Community Board</p>
                 </div>
              </div>
              <p className="text-sm text-teal-50/80 leading-relaxed font-medium max-w-[280px]">
                Nơi cập nhật những thông báo quan trọng nhất từ Ban quản lý tòa nhà.
              </p>
           </div>
           
           <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 opacity-5 -rotate-12">
              <Megaphone size={180} className="text-white" />
           </div>
        </div>

        {/* 2. Floating modern Filter Chips Hub */}
        <div className="px-6 -mt-8 relative z-20">
           <div className="bg-white rounded-[32px] p-2 shadow-xl shadow-slate-200/50 border border-slate-200 flex items-center gap-1 overflow-x-auto no-scrollbar">
              {ANNOUNCEMENT_TYPES.map((type) => {
                 const isActive = activeFilter === type.id;
                 return (
                    <button
                      key={type.id}
                      onClick={() => setActiveFilter(type.id)}
                      className={cn(
                        "whitespace-nowrap h-12 px-6 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-2",
                        isActive 
                          ? "bg-[#0D8A8A] text-white shadow-lg shadow-teal-500/30" 
                          : "text-slate-400 hover:text-slate-600"
                      )}
                    >
                      {type.label}
                    </button>
                 );
              })}
           </div>
        </div>

        {/* 3. News Feed Area */}
        <div className="px-6 pt-10 pb-32 space-y-5 text-left">
           {isLoading ? (
             Array(4).fill(0).map((_, i) => (
                <div key={i} className="bg-white rounded-[40px] h-32 animate-pulse shadow-sm border border-slate-200" />
             ))
           ) : items.length > 0 ? (
             <>
                {/* Pinned Priority News */}
                {pinnedItems.map((ann: any) => (
                   <AnnouncementCard key={ann.id} ann={ann} onClick={() => handleOpenDetail(ann)} pinned />
                ))}
                
                {/* Regular News */}
                {otherItems.map((ann: any) => (
                   <AnnouncementCard key={ann.id} ann={ann} onClick={() => handleOpenDetail(ann)} />
                ))}
             </>
           ) : (
             <div className="text-center py-24 bg-white rounded-[48px] border-2 border-dashed border-slate-200 space-y-4">
                <div className="w-20 h-20 bg-slate-50 rounded-[32px] flex items-center justify-center mx-auto text-slate-200">
                   <Megaphone size={48} strokeWidth={1} />
                </div>
                <div className="space-y-1">
                   <h3 className="text-slate-500 font-black uppercase tracking-widest text-sm">Chưa có bản tin nào</h3>
                   <p className="text-slate-300 text-[10px] font-bold uppercase tracking-widest">Tất cả thông báo sẽ hiển thị tại đây.</p>
                </div>
             </div>
           )}
        </div>
      </div>

      {/* Detail Bottom Sheet - Redesigned */}
      <BottomSheet 
        isOpen={!!selectedAnn} 
        onClose={() => setSelectedAnn(null)} 
        title="Nội dung thông báo"
        height="max-h-[92vh]"
      >
        {selectedAnn && (
          <div className="space-y-8 pb-10 animate-in fade-in slide-in-from-bottom-5 duration-500 text-left">
            <div className="flex flex-col gap-5">
               <div className="flex items-center justify-between">
                  <div className={cn(
                    "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-[0.1em] border-2",
                    ANNOUNCEMENT_TYPES.find(t => t.id === selectedAnn.type)?.color || 'bg-slate-100 border-slate-200 text-slate-600'
                  )}>
                    {selectedAnn.type}
                  </div>
                  <div className="flex items-center gap-2 text-slate-300 text-[10px] font-black uppercase tracking-widest">
                    <History size={14} className="text-[#0D8A8A]" />
                    <span>{formatDistanceToNow(new Date(selectedAnn.createdAt), { addSuffix: true, locale: vi })}</span>
                  </div>
               </div>
               
               <h3 className="text-2xl font-black text-slate-800 leading-tight tracking-tight uppercase">
                 {selectedAnn.title}
               </h3>
               
               <div className="flex items-center gap-2 p-4 bg-teal-50/50 rounded-2xl border border-teal-100">
                  <Sparkles size={16} className="text-[#0D8A8A]" />
                  <span className="text-[10px] font-bold text-teal-800 uppercase tracking-widest">Thông tin chính thức từ BQL SmartStay</span>
               </div>
            </div>

            <div className="prose prose-slate max-w-none text-slate-600 leading-relaxed font-medium">
               <RichTextViewer html={selectedAnn.content} />
            </div>

            <div className="pt-8 border-t border-slate-100 flex gap-4">
               <button 
                 onClick={() => handleShare(selectedAnn)}
                 className="flex-1 h-16 bg-white border-2 border-slate-200 text-slate-600 rounded-[24px] font-black uppercase tracking-widest text-[10px] flex items-center justify-center gap-2 active:scale-95 transition-all shadow-sm"
               >
                  <Share2 size={18} strokeWidth={2.5} />
                  Chia sẻ
               </button>
               <button 
                 onClick={() => setSelectedAnn(null)}
                 className="flex-1 h-16 bg-[#0D8A8A] text-white rounded-[24px] font-black uppercase tracking-widest text-[10px] active:scale-95 transition-all shadow-xl shadow-teal-500/20"
               >
                  Tiếp tục
               </button>
            </div>
          </div>
        )}
      </BottomSheet>
    </PortalLayout>
  );
};

const AnnouncementCard = ({ ann, onClick, pinned }: any) => {
  const isEmergency = ann.type === 'Emergency';
  const typeStyle = ANNOUNCEMENT_TYPES.find(t => t.id === ann.type);
  
  return (
    <div 
      onClick={onClick}
      className={cn(
        "bg-white p-6 rounded-[40px] shadow-xl shadow-slate-200/40 border-2 transition-all active:scale-[0.98] relative overflow-hidden group hover:border-[#0D8A8A]/30",
        isEmergency ? "border-red-100 bg-red-50/10" : "border-slate-50",
        pinned && "shadow-teal-500/10 border-teal-50"
      )}
    >
      {pinned && (
         <div className="absolute top-0 right-0 p-3">
            <div className="w-8 h-8 rounded-full bg-[#0D8A8A] flex items-center justify-center text-white shadow-lg animate-bounce-slow">
               <Pin size={14} strokeWidth={3} className="rotate-45" />
            </div>
         </div>
      )}

      <div className="flex flex-col gap-4 text-left">
        <div className="flex items-center gap-3">
           <div className={cn(
              "px-3 py-1 rounded-full text-[9px] font-black uppercase tracking-widest border",
              typeStyle?.color || "bg-slate-50 text-slate-500 border-slate-100"
           )}>
              {ann.type}
           </div>
           <p className="text-[10px] font-bold text-slate-300 uppercase tracking-widest">
              {formatDistanceToNow(new Date(ann.createdAt), { addSuffix: true, locale: vi })}
           </p>
        </div>

        <div className="flex gap-4">
           {isEmergency && (
              <div className="w-12 h-12 bg-red-100 rounded-2xl flex items-center justify-center text-red-600 shadow-inner shrink-0 scale-up-down">
                 <AlertTriangle size={24} strokeWidth={2.5} />
              </div>
           )}
           <div className="flex-1 min-w-0 flex flex-col gap-1.5">
              <h4 className={cn("text-base font-black tracking-tight leading-tight line-clamp-1 uppercase", isEmergency ? "text-red-700" : "text-slate-800")}>
                {ann.title}
              </h4>
              <p className="text-xs text-slate-400 font-bold line-clamp-2 leading-relaxed tracking-tighter uppercase opacity-80">
                {ann.summary || 'Tráp xem chi tiết các cập nhật mới nhất từ SmartStay...'}
              </p>
           </div>
           {!isEmergency && (
              <div className="w-10 h-10 bg-slate-50 rounded-full flex items-center justify-center text-slate-200 group-hover:text-[#0D8A8A] group-hover:bg-teal-50 transition-all flex-shrink-0">
                 <ArrowRight size={20} strokeWidth={3} />
              </div>
           )}
        </div>
      </div>
    </div>
  );
};

export default Announcements;
