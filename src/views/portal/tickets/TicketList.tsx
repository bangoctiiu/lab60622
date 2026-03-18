import React, { useState } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  Plus, 
  Search, 
  MessageSquare, 
  Clock, 
  Star, 
  ChevronRight,
  User,
  Loader2,
  Filter,
  AlertCircle,
  CheckCircle2,
  Calendar,
  MessageCircle,
  ArrowRight,
  Sparkles,
  LifeBuoy,
  History,
  Inbox,
  Zap
} from 'lucide-react';
import { useNavigate, Link } from 'react-router-dom';
import { toast } from 'sonner';
import api from '@/services/apiClient';
import { cn, formatDate } from '@/utils';
import { StatusBadge, Modal } from '@/components/shared';
import PortalLayout from '@/components/portal/PortalLayout';
import { Ticket } from '@/models/Ticket';
import { PaginatedResponse } from '@/types';

const TicketList = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState<'pending' | 'resolved' | 'all'>('pending');
  const [ratingTarget, setRatingTarget] = useState<Ticket | any>(null);

  // 1. Fetch Tickets
  const { data: ticketsData, isLoading, refetch } = useQuery<PaginatedResponse<any>>({
    queryKey: ['portal-tickets', activeTab],
    queryFn: async () => {
      let status = '';
      if (activeTab === 'pending') status = 'open,inprogress';
      else if (activeTab === 'resolved') status = 'resolved,closed';
      
      const res = await api.get('/api/portal/tickets', { 
        params: { status, page: 1, limit: 50 } 
      });
      return res.data;
    }
  });

  // 2. Rating Mutation
  const rateMutation = useMutation({
    mutationFn: (data: { ticketId: string, rating: number, comment: string }) => 
      api.post('/api/portal/ticket-ratings', data),
    onSuccess: () => {
      toast.success('Cảm ơn bạn đã đánh giá!');
      setRatingTarget(null);
      queryClient.invalidateQueries({ queryKey: ['portal-tickets'] });
    }
  });

  const tickets = ticketsData?.data || [];
  const totalCount = ticketsData?.total || 0;

  return (
    <PortalLayout 
      title="Hỗ trợ & Kỹ thuật"
      headerTransparent={true}
      rightAction={
        <button className="w-10 h-10 rounded-xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white active:scale-90 transition-all border border-white/10 shadow-lg">
          <Search size={20} />
        </button>
      }
    >
      <div className="bg-slate-50 min-h-screen relative overflow-x-hidden">
        
        {/* 1. Lush High-End Support Banner */}
        <div className="bg-[#0D8A8A] pt-24 pb-28 px-8 rounded-b-[48px] shadow-2xl shadow-teal-500/10 relative overflow-hidden">
           <div className="absolute top-[-5%] right-[-5%] w-72 h-72 bg-white/5 rounded-full blur-3xl animate-pulse" />
           <div className="absolute bottom-[-15%] left-[-10%] w-56 h-56 bg-teal-400/10 rounded-full blur-2xl" />
           
           <div className="relative z-10 flex flex-col gap-8 text-left">
              <div className="flex items-center gap-5">
                 <div className="w-16 h-16 bg-white/10 rounded-[28px] backdrop-blur-md border border-white/20 flex items-center justify-center text-white shadow-2xl relative">
                    <LifeBuoy size={32} strokeWidth={1.5} className="animate-spin-slow" />
                    <div className="absolute -top-1 -right-1 w-4 h-4 bg-emerald-500 rounded-full border-2 border-[#0D8A8A] animate-ping" />
                 </div>
                 <div className="space-y-0.5">
                    <h2 className="text-2xl font-black text-white tracking-tight uppercase leading-none">Trung tâm hỗ trợ</h2>
                    <p className="text-[10px] font-black text-white/50 uppercase tracking-[0.2em] leading-none mt-1.5">SmartLife Service Hub</p>
                 </div>
              </div>
              
              <div className="flex items-center gap-4">
                 <div className="flex-1 bg-white/10 backdrop-blur-md px-5 py-4 rounded-[28px] border border-white/10 shadow-lg">
                    <p className="text-[9px] font-black text-white/40 uppercase tracking-widest leading-none mb-1.5">Đang xử lý</p>
                    <div className="flex items-baseline gap-2">
                       <span className="text-3xl font-black text-white leading-none">{totalCount}</span>
                       <span className="text-[10px] font-black text-teal-200 uppercase">Yêu cầu</span>
                    </div>
                 </div>
                  <button 
                    onClick={() => navigate('/portal/tickets/create')}
                    className="flex-[1.4] bg-[#0D8A8A] h-18 px-6 rounded-[28px] shadow-2xl shadow-teal-500/40 flex items-center justify-between group active:scale-95 transition-all text-white hover:bg-teal-700 border-2 border-white/20 animate-pulse-slow"
                  >
                     <div className="flex flex-col text-left">
                        <p className="text-[9px] font-black uppercase tracking-widest leading-none mb-1 text-teal-100/60">Gửi mới</p>
                        <p className="text-[12px] font-black uppercase tracking-tighter">Tạo Ticket</p>
                     </div>
                     <div className="w-10 h-10 rounded-2xl bg-white text-[#0D8A8A] flex items-center justify-center shadow-lg group-hover:rotate-90 transition-transform">
                        <Plus size={20} strokeWidth={3} />
                     </div>
                  </button>
              </div>
           </div>
           
           <div className="absolute top-1/2 right-0 translate-x-1/2 -translate-y-1/2 opacity-5 rotate-12 pointer-events-none">
              <MessageSquare size={240} className="text-white" />
           </div>
        </div>

        {/* 2. Tactical Filter Segment Hub (Overlap) */}
        <div className="px-6 -mt-10 relative z-20">
           <div className="bg-white rounded-[32px] p-2 shadow-2xl shadow-slate-200/50 border-2 border-slate-100 flex items-center gap-1">
              <TabSegment label="Đang mở" active={activeTab === 'pending'} count={activeTab === 'pending' ? totalCount : 0} onClick={() => setActiveTab('pending')} />
              <TabSegment label="Lịch sử" active={activeTab === 'resolved'} onClick={() => setActiveTab('resolved')} />
              <TabSegment label="Tất cả" active={activeTab === 'all'} onClick={() => setActiveTab('all')} />
           </div>
        </div>

        {/* 3. Personalized Ticket Feed */}
        <div className="px-6 pt-10 pb-32 space-y-6 text-left">
           <div className="flex items-center justify-between px-3">
              <h3 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.2em]">
                 {activeTab === 'pending' ? 'Hồ sơ đang giám sát' : 'Lịch sử tiếp nhận hỗ trợ'}
              </h3>
              <button 
                onClick={() => refetch()}
                className="flex items-center gap-2 text-[10px] font-black text-[#0D8A8A] uppercase tracking-widest bg-white px-4 py-2 rounded-full border border-slate-200 shadow-sm active:scale-90 transition-all hover:bg-teal-50"
              >
                 <Zap size={14} className="text-orange-500" /> Refresh
              </button>
           </div>

           {isLoading ? (
             <div className="space-y-5">
               {Array(3).fill(0).map((_, i) => (
                  <div key={i} className="bg-white rounded-[44px] h-48 animate-pulse shadow-sm border border-slate-100" />
               ))}
             </div>
           ) : tickets.length > 0 ? (
             <div className="space-y-5">
                {tickets.map((ticket: any) => (
                  <div 
                    key={ticket.id} 
                    className="bg-white rounded-[44px] p-8 shadow-2xl shadow-slate-200/30 border-2 border-white flex flex-col space-y-6 active:scale-[0.98] transition-all relative overflow-hidden group hover:border-teal-100"
                    onClick={() => navigate(`/portal/tickets/${ticket.id}`)}
                  >
                    {/* Visual Priority Accent */}
                    <div className={cn(
                      "absolute top-0 right-0 w-24 h-24 -mr-12 -mt-12 rounded-full opacity-5 pointer-events-none group-hover:scale-150 transition-transform duration-700",
                      ticket.priority === 'Critical' ? 'bg-red-500' :
                      ticket.priority === 'High' ? 'bg-orange-500' : 'bg-teal-500'
                    )} />

                    <div className="flex justify-between items-center relative z-10">
                      <div className="flex items-center gap-3">
                         <div className="px-3 py-1 bg-slate-50 rounded-xl border border-slate-100 shadow-inner">
                            <span className="text-[10px] font-black text-slate-400 tracking-widest uppercase">#{ticket.code}</span>
                         </div>
                         <StatusBadge status={ticket.status} size="sm" />
                      </div>
                      <div className="w-12 h-12 rounded-[20px] bg-teal-50 flex items-center justify-center text-[#0D8A8A] transition-all group-hover:rotate-6 shadow-inner border border-teal-100/50">
                         <MessageSquare size={24} strokeWidth={1.5} />
                      </div>
                    </div>

                    <div className="space-y-2.5 relative z-10">
                      <h4 className="text-xl font-black text-slate-800 tracking-tight leading-tight uppercase group-hover:text-[#0D8A8A] transition-colors">
                        {ticket.title}
                      </h4>
                      <div className="flex items-center gap-4 text-[10px] font-black text-slate-400 uppercase tracking-[0.15em] leading-none opacity-60 italic">
                         <span className="flex items-center gap-1.5"><Calendar size={12} className="text-teal-500" /> {formatDate(ticket.createdAt)}</span>
                         <span className="flex items-center gap-1.5"><MessageCircle size={12} className="text-teal-500" /> {ticket.commentCount || 0} Phản hồi</span>
                      </div>
                    </div>

                    <div className="pt-6 border-t border-slate-50 flex items-center justify-between relative z-10">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 rounded-2xl bg-white border-2 border-slate-50 shadow-md overflow-hidden flex-shrink-0 group-hover:scale-110 transition-transform">
                          {ticket.assigneeAvatar || ticket.assignedToAvatar ? (
                            <img src={ticket.assigneeAvatar || ticket.assignedToAvatar} className="w-full h-full object-cover" alt="" />
                          ) : (
                            <div className="bg-slate-50 text-slate-300 w-full h-full flex items-center justify-center italic font-black text-lg">
                               {(ticket.assigneeName || ticket.assignedToName || 'S')?.charAt(0)}
                            </div>
                          )}
                        </div>
                        <div className="flex flex-col gap-0.5">
                          <span className="text-[9px] font-black text-slate-300 uppercase tracking-widest">Đang được xử lý bởi</span>
                          <span className="text-[12px] font-black text-slate-800 uppercase tracking-tight truncate max-w-[130px]">
                            {ticket.assigneeName || ticket.assignedToName || 'Đang điều phối...'}
                          </span>
                        </div>
                      </div>

                      <div className="flex items-center gap-3">
                        {/* SLA / Priority Visual */}
                        {(ticket.status === 'open' || ticket.status === 'inprogress') && (
                         <div className={cn(
                           "flex items-center gap-2 text-[10px] font-black px-4 py-2.5 rounded-full border shadow-xl shadow-black/5",
                           ticket.priority === 'Critical' ? "bg-red-50 border-red-100 text-red-600 animate-pulse" : "bg-teal-50 border-teal-100 text-[#0D8A8A]"
                         )}>
                           <Clock size={12} strokeWidth={3} />
                           <span>{ticket.slaRemaining || '2h 15m'}</span>
                         </div>
                       )}

                       {/* Rating UI */}
                       {ticket.status === 'resolved' && !ticket.hasRated && (
                         <button 
                           onClick={(e) => { e.stopPropagation(); setRatingTarget(ticket); }}
                           className="flex items-center gap-2 text-[10px] font-black text-amber-600 bg-amber-50 px-5 py-2.5 rounded-full border-2 border-amber-100 shadow-2xl shadow-amber-500/10 active:scale-90 transition-all uppercase tracking-widest"
                         >
                           <Star size={16} fill="currentColor" />
                           RATE
                         </button>
                       )}

                        <div className="w-10 h-10 rounded-full bg-slate-100 flex items-center justify-center text-slate-400 group-hover:bg-[#0D8A8A] group-hover:text-white group-hover:translate-x-1 transition-all shadow-sm border border-slate-200">
                          <ArrowRight size={20} strokeWidth={3} />
                        </div>
                      </div>
                    </div>
                  </div>
                ))}
             </div>
           ) : (
             <div className="text-center py-28 bg-white rounded-[56px] shadow-2xl shadow-slate-200/50 border-2 border-slate-50 px-10 animate-in zoom-in-95 duration-500">
               <div className="w-24 h-24 bg-slate-50 rounded-[40px] flex items-center justify-center mx-auto mb-8 shadow-inner text-slate-100 italic">
                  <Inbox size={64} strokeWidth={0.5} />
               </div>
               <div className="space-y-3 px-4">
                  <h3 className="text-slate-800 font-black text-xl tracking-tighter uppercase italic leading-none">Mọi thứ vẫn vận hành tốt</h3>
                  <p className="text-slate-400 text-xs leading-relaxed font-bold uppercase tracking-wider opacity-60">
                    Hiện tại hòm thư của bạn đang trống. Hãy yên tâm, SmartStay luôn trực tuyến để sẵn sàng hỗ trợ bạn.
                  </p>
               </div>
               <button 
                 onClick={() => navigate('/portal/tickets/create')}
                 className="mt-12 h-18 w-full bg-[#0D8A8A] text-white rounded-[28px] font-black text-sm shadow-2xl shadow-teal-500/30 active:scale-95 transition-all flex items-center justify-center gap-4 uppercase tracking-[0.3em]"
               >
                 <Plus size={24} strokeWidth={3} />
                 GỬI YÊU CẦU MỚI
               </button>
             </div>
           )}

           {/* Security / Assurance Banner */}
           <div className="mt-8 p-10 bg-white/50 rounded-[56px] border-2 border-dashed border-slate-100 text-center space-y-6">
              <div className="mx-auto w-15 h-15 bg-white rounded-2xl flex items-center justify-center text-teal-600 shadow-xl border border-slate-50">
                 <LifeBuoy size={32} strokeWidth={1.5} className="animate-spin-slow" />
              </div>
              <div className="space-y-2">
                 <p className="text-[11px] font-black text-slate-800 uppercase tracking-[0.2em] leading-relaxed px-4">Đội ngũ kỹ thuật 24/7</p>
                 <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest leading-loose px-6 opacity-60">
                   Chúng tôi cam kết phản hồi và xử lý mọi sự cố kỹ thuật trong vòng 2 giờ làm việc để đảm bảo cuộc sống cư dân.
                 </p>
              </div>
           </div>
        </div>
      </div>

      {/* Floating Tactical Access Button (Optional but User asked for visibility) */}
      <Link 
        to="/portal/tickets/create" 
        className="fixed bottom-24 right-6 w-18 h-18 bg-[#0D8A8A] text-white rounded-[28px] flex items-center justify-center shadow-2xl shadow-teal-500/40 active:scale-90 transition-all z-[60] group border-4 border-white animate-bounce-slow"
      >
        <Plus size={36} strokeWidth={3} className="group-hover:rotate-90 transition-transform" />
      </Link>

      {/* Premium Rating Modal */}
      {ratingTarget && (
        <RatingModal 
          ticket={ratingTarget} 
          onClose={() => setRatingTarget(null)} 
          onSubmit={(data: { rating: number; comment: string }) => rateMutation.mutate({ ticketId: ratingTarget.id, ...data })}
          isSubmitting={rateMutation.isPending}
        />
      )}
    </PortalLayout>
  );
};

interface TabSegmentProps {
  label: string;
  active: boolean;
  count?: number;
  onClick: () => void;
}

const TabSegment = ({ label, active, count, onClick }: TabSegmentProps) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex-1 h-13 rounded-[24px] text-[10px] font-black uppercase tracking-widest transition-all relative flex items-center justify-center gap-2",
      active ? "bg-[#0D8A8A] text-white shadow-2xl shadow-teal-500/20" : "text-slate-300 hover:text-slate-500"
    )}
  >
    {label}
    {count !== undefined && count > 0 && (
      <div className={cn(
         "w-5 h-5 rounded-full flex items-center justify-center text-[9px] font-black",
         active ? "bg-white text-[#0D8A8A]" : "bg-red-500 text-white shadow-lg"
      )}>
        {count}
      </div>
    )}
  </button>
);

interface RatingModalProps {
  ticket: Ticket | any;
  onClose: () => void;
  onSubmit: (data: { rating: number; comment: string }) => void;
  isSubmitting: boolean;
}

const RatingModal = ({ ticket, onClose, onSubmit, isSubmitting }: RatingModalProps) => {
  const [rating, setRating] = useState(5);
  const [comment, setComment] = useState('');

  return (
    <Modal isOpen={true} onClose={onClose} title="Đánh giá hỗ trợ">
      <div className="p-4 space-y-10 text-center animate-in fade-in slide-in-from-bottom-8 duration-500">
        <div className="space-y-6">
          <div className="w-20 h-20 bg-amber-50 rounded-[32px] flex items-center justify-center mx-auto text-amber-500 border-2 border-amber-100 shadow-2xl shadow-amber-500/10 rotate-3">
             <Star size={44} fill="currentColor" strokeWidth={1} />
          </div>
          <div className="space-y-2.5 px-6">
             <h4 className="font-black text-slate-800 tracking-tighter text-xl uppercase leading-tight italic">#{ticket.code} • {ticket.title}</h4>
             <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest leading-relaxed opacity-60">"Trải nghiệm của bạn dệt nên tương lai của SmartStay."</p>
          </div>
          
          <div className="flex justify-center gap-3 pt-2">
            {[1, 2, 3, 4, 5].map((s) => (
              <button key={s} onClick={() => setRating(s)} className="group active:scale-90 transition-transform">
                <Star 
                  size={48} 
                  className={cn("transition-all duration-500", s <= rating ? "text-amber-400 fill-amber-400 scale-110 drop-shadow-2xl" : "text-slate-100")} 
                  strokeWidth={2}
                />
              </button>
            ))}
          </div>
          <div className="inline-block px-6 py-2 bg-slate-50 rounded-full border border-slate-100">
            <span className="text-[10px] font-black text-slate-800 uppercase tracking-widest">
              {rating === 5 ? 'Vượt quá mong đợi' : rating === 4 ? 'Rất hài lòng' : rating === 3 ? 'Bình thường' : rating === 2 ? 'Cần cải thiện' : 'Kém'}
            </span>
          </div>
        </div>

        <div className="space-y-3 text-left">
           <label className="text-[11px] font-black text-slate-400 uppercase tracking-[0.2em] ml-6 leading-none">Cảm nhận chi tiết</label>
           <textarea
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Chia sẻ thêm về chất lượng dịch vụ..."
            className="w-full h-40 p-8 bg-slate-50 rounded-[44px] text-sm border-2 border-slate-100 focus:bg-white focus:ring-8 focus:ring-teal-500/5 focus:border-[#0D8A8A] transition-all resize-none font-black text-slate-800 italic shadow-inner placeholder:font-normal placeholder:opacity-30"
          />
        </div>

        <div className="flex flex-col gap-5 pb-4">
          <button 
            disabled={isSubmitting}
            onClick={() => onSubmit({ rating, comment })} 
            className="w-full h-18 bg-[#0D8A8A] text-white rounded-[32px] font-black shadow-2xl shadow-teal-500/30 flex items-center justify-center gap-4 active:scale-95 transition-all text-sm uppercase tracking-[0.3em]"
          >
            {isSubmitting ? <Loader2 size={24} className="animate-spin text-white" /> : <Sparkles size={24} className="text-white" />}
            HOÀN TẤT ĐÁNH GIÁ
          </button>
          <button onClick={onClose} className="h-10 text-slate-800 font-black text-[10px] uppercase tracking-[0.4em] active:text-[#0D8A8A] transition-colors bg-slate-100 rounded-full mx-10">
            ĐỂ LÚC KHÁC
          </button>
        </div>
      </div>
    </Modal>
  );
};

export default TicketList;
