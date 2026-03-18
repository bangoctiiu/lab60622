import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  ChevronLeft, 
  MoreVertical, 
  MessageSquare, 
  Image as ImageIcon,
  Paperclip,
  Send,
  CheckCircle2,
  Clock,
  User,
  ShieldCheck
} from 'lucide-react';
import { useNavigate, useParams } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';

const TicketDetail: React.FC = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const [comment, setComment] = useState('');

  const ticket = {
    id: id || 'T-1024',
    title: 'Máy lạnh không lạnh',
    description: 'Máy lạnh tại phòng khách có hiện tượng không mát dù đã để 16 độ. Ngoài ra còn có tiếng kêu rè rè nhỏ.',
    status: 'In Progress',
    priority: 'High',
    category: 'Sửa chữa',
    location: 'Phòng khách',
    date: '18/03/2024 09:12',
    history: [
      { id: 1, type: 'comment', author: 'Quản lý tòa nhà', content: 'Chào bạn, chúng tôi đã nhận được thông tin. Kỹ thuật viên sẽ đến kiểm tra vào lúc 14h chiều nay.', time: '18/03/23 10:00', fromAdmin: true },
      { id: 2, type: 'status', content: 'Thay đổi trạng thái sang: Đang xử lý', time: '18/03/23 10:01' },
    ]
  };

  return (
    <PortalLayout>
      <div className="space-y-6 flex flex-col h-[calc(100vh-120px)]">
        {/* Header */}
        <div className="flex items-center justify-between gap-4 shrink-0">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <div>
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-[2px]">{ticket.id}</span>
              <h1 className="text-xl font-black text-slate-800 tracking-tight leading-none">Chi tiết yêu cầu</h1>
            </div>
          </div>
          <button className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
            <MoreVertical size={20} />
          </button>
        </div>

        {/* Content Scroll Area */}
        <div className="flex-1 overflow-y-auto space-y-6 pr-2 custom-scrollbar">
          {/* Ticket Info Card */}
          <div className="bg-white rounded-[32px] p-6 shadow-sm border border-slate-100 space-y-6">
            <div className="flex flex-wrap gap-2">
              <span className="px-3 py-1 bg-amber-50 text-amber-600 rounded-full text-[11px] font-black uppercase tracking-wider flex items-center gap-1.5">
                <Clock size={12} />
                Đang xử lý
              </span>
              <span className="px-3 py-1 bg-red-50 text-red-500 rounded-full text-[11px] font-black uppercase tracking-wider">Ưu tiên cao</span>
              <span className="px-3 py-1 bg-slate-50 text-slate-400 rounded-full text-[11px] font-black uppercase tracking-wider">{ticket.category}</span>
            </div>

            <div>
              <h2 className="text-xl font-black text-slate-800 mb-2">{ticket.title}</h2>
              <p className="text-sm font-medium text-slate-600 leading-relaxed">
                {ticket.description}
              </p>
            </div>

            <div className="pt-6 border-t border-dashed border-slate-100 grid grid-cols-2 gap-4">
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Vị trí</span>
                <span className="text-sm font-bold text-slate-700">{ticket.location}</span>
              </div>
              <div>
                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Thời gian gửi</span>
                <span className="text-sm font-bold text-slate-700">{ticket.date}</span>
              </div>
            </div>
          </div>

          {/* Chat/History Area */}
          <div className="space-y-4">
            <div className="flex items-center gap-3">
              <div className="h-px bg-slate-100 flex-1" />
              <span className="text-[10px] font-black text-slate-300 uppercase tracking-[3px]">Lịch sử trao đổi</span>
              <div className="h-px bg-slate-100 flex-1" />
            </div>

            {ticket.history.map((item: any) => (
              <div key={item.id} className={`flex flex-col ${item.fromAdmin ? 'items-start' : 'items-end'}`}>
                {item.type === 'comment' ? (
                  <div className={`max-w-[85%] space-y-1 ${item.fromAdmin ? 'items-start' : 'items-end'}`}>
                    <div className="flex items-center gap-2 mb-1 px-1">
                       <span className={`text-[10px] font-black uppercase tracking-wider ${item.fromAdmin ? 'text-primary' : 'text-slate-400'}`}>
                         {item.fromAdmin ? 'Quản trị viên' : 'Bạn'}
                       </span>
                    </div>
                    <div className={`p-4 rounded-3xl text-sm font-medium leading-relaxed shadow-sm ${item.fromAdmin ? 'bg-white rounded-tl-none border border-slate-100 text-slate-700' : 'bg-primary text-white rounded-tr-none'}`}>
                      {item.content}
                    </div>
                    <span className="text-[9px] font-bold text-slate-400 uppercase tracking-widest px-1 block">{item.time}</span>
                  </div>
                ) : (
                  <div className="w-full flex justify-center my-4">
                    <span className="px-4 py-1.5 bg-slate-100 rounded-full text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      {item.content} • {item.time}
                    </span>
                  </div>
                )}
              </div>
            ))}
          </div>
        </div>

        {/* Input Bar */}
        <div className="shrink-0 bg-white rounded-3xl p-2 shadow-xl border border-slate-100 flex items-center gap-2 mb-4">
          <button className="w-12 h-12 rounded-2xl flex items-center justify-center text-slate-400 hover:bg-slate-50">
            <Paperclip size={20} />
          </button>
          <input 
            value={comment}
            onChange={(e) => setComment(e.target.value)}
            placeholder="Nhập phản hồi của bạn..."
            className="flex-1 bg-transparent border-none outline-none text-sm font-medium px-2"
          />
          <button className={`w-12 h-12 rounded-2xl flex items-center justify-center transition-all ${comment ? 'bg-primary text-white shadow-lg shadow-primary/20' : 'text-slate-300 bg-slate-50'}`}>
            <Send size={20} />
          </button>
        </div>
      </div>
    </PortalLayout>
  );
};

export default TicketDetail;
