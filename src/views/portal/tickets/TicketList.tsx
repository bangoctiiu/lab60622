import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Ticket, 
  ChevronRight, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Plus,
  ArrowRight
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';

const TicketList: React.FC = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState<'active' | 'closed'>('active');

  const tickets = [
    { id: 'T-1024', title: 'Máy lạnh không lạnh', status: 'In Progress', priority: 'High', date: '18/03/2024', category: 'Sửa chữa' },
    { id: 'T-1025', title: 'Thay bóng đèn hành lang', status: 'Open', priority: 'Low', date: '17/03/2024', category: 'Điện/Nước' },
    { id: 'T-1020', title: 'Hỏng khóa cửa phòng', status: 'Resolved', priority: 'High', date: '15/03/2024', category: 'An ninh' },
  ];

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'Open': return <span className="px-2 py-0.5 bg-blue-50 text-blue-600 rounded-md text-[10px] font-black uppercase">Mới</span>;
      case 'In Progress': return <span className="px-2 py-0.5 bg-amber-50 text-amber-600 rounded-md text-[10px] font-black uppercase">Đang sửa</span>;
      case 'Resolved': return <span className="px-2 py-0.5 bg-green-50 text-green-600 rounded-md text-[10px] font-black uppercase">Đã xong</span>;
      default: return null;
    }
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hỗ trợ kỹ thuật</h1>
          <button 
            onClick={() => navigate('/portal/tickets/create')}
            className="w-12 h-12 rounded-2xl bg-primary text-white flex items-center justify-center shadow-lg shadow-primary/20 active:scale-95 transition-all"
          >
            <Plus size={24} />
          </button>
        </div>

        {/* Status Tabs */}
        <div className="flex p-1 bg-slate-100 rounded-2xl w-fit">
          <button 
            onClick={() => setActiveTab('active')}
            className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${activeTab === 'active' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            Đang xử lý
          </button>
          <button 
            onClick={() => setActiveTab('closed')}
            className={`px-6 py-2.5 rounded-xl text-[12px] font-black uppercase tracking-wider transition-all ${activeTab === 'closed' ? 'bg-white text-slate-800 shadow-sm' : 'text-slate-400'}`}
          >
            Đã hoàn thành
          </button>
        </div>

        <div className="grid gap-3">
          {tickets.map((ticket) => (
            <motion.div
              key={ticket.id}
              whileHover={{ x: 4 }}
              onClick={() => navigate(`/portal/tickets/${ticket.id}`)}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 cursor-pointer group hover:border-primary/20 transition-all"
            >
              <div className={`w-12 h-12 rounded-2xl flex items-center justify-center shrink-0 ${ticket.priority === 'High' ? 'bg-red-50 text-red-500' : 'bg-slate-50 text-slate-400'}`}>
                <Ticket size={24} />
              </div>
              
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.id}</span>
                  <div className="w-1 h-1 rounded-full bg-slate-200" />
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{ticket.category}</span>
                </div>
                <h3 className="text-sm font-black text-slate-800 truncate">{ticket.title}</h3>
                <div className="flex items-center gap-3 mt-2">
                  {getStatusBadge(ticket.status)}
                  <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400">
                    <Clock size={12} />
                    {ticket.date}
                  </div>
                </div>
              </div>

              <div className="w-10 h-10 rounded-xl flex items-center justify-center group-hover:bg-primary/10 group-hover:text-primary transition-all text-slate-300">
                <ChevronRight size={20} />
              </div>
            </motion.div>
          ))}
        </div>

        <div className="p-6 bg-gradient-to-br from-primary to-primary-dark rounded-[32px] text-white shadow-xl shadow-primary/20 relative overflow-hidden group">
          <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 rounded-full -mr-16 -mt-16 group-hover:scale-110 transition-transform" />
          <h2 className="text-xl font-black mb-1 relative z-10">Bạn cần giúp đỡ ngay?</h2>
          <p className="text-white/70 text-sm font-medium mb-4 relative z-10">Gửi yêu cầu hỗ trợ và chúng tôi sẽ phản hồi sớm nhất.</p>
          <button 
             onClick={() => navigate('/portal/tickets/create')}
             className="h-12 px-6 bg-white text-primary rounded-2xl font-black uppercase tracking-widest text-[11px] flex items-center gap-2 shadow-lg relative z-10"
          >
            Tạo yêu cầu mới
            <ArrowRight size={14} />
          </button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default TicketList;
