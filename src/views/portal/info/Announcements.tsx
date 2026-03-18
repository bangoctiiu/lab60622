import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Megaphone, 
  ChevronRight, 
  Calendar, 
  Pin,
  ChevronLeft,
  Search,
  Share2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';
import BottomSheet from '@/components/portal/BottomSheet';

const Announcements: React.FC = () => {
  const navigate = useNavigate();
  const [selectedAnn, setSelectedAnn] = useState<any>(null);

  const announcements = [
    { id: 1, title: 'Thông báo ngắt nước định kỳ', description: 'Để chuẩn bị cho kỳ bảo trì hệ thống cấp nước toàn khu, Ban quản lý thông báo ngắt nước từ 23h đến 3h sáng...', time: '18/03/2024', pinned: true, category: 'Thông báo', content: 'Nội dung chi tiết thông báo ngắt nước phục vụ bảo định kỳ toàn bộ đường ống tại Block A. Rất mong quý cư dân chuẩn bị nguồn nước thay thế...' },
    { id: 2, title: 'Sự kiện Tết cộng đồng 2024', description: 'Mời toàn thể cư dân tham dự buổi tiệc mừng xuân tại khu vực hồ bơi vào cuối tuần này.', time: '15/03/2024', pinned: false, category: 'Sự kiện', content: 'Thông tin chi tiết về sự kiện Tết cộng đồng với nhiều hoạt động hấp dẫn như gói bánh chưng, trò chơi dân gian và bốc thăm trúng thưởng...' },
    { id: 3, title: 'Nhắc nhở về quy định đỗ xe', description: 'Quý cư dân lưu ý không đỗ xe tại các khu vực đường ưu tiên dành cho xe cứu hỏa.', time: '12/03/2024', pinned: false, category: 'Quy định', content: 'Dựa trên quy định an toàn PCCC, yêu cầu cư dân không để xe bừa bãi tại các lối thoát hiểm và đường xe chữa cháy. Các trường hợp vi phạm sẽ bị nhắc nhở hoặc xử lý theo nội quy tòa nhà.' },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
              <ChevronLeft size={20} />
            </button>
            <h1 className="text-2xl font-black text-slate-800 tracking-tight">Thông báo</h1>
          </div>
        </div>

        {/* Search & Filter */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm thông báo..."
            className="w-full h-14 bg-white border border-slate-100 rounded-3xl pl-12 pr-4 text-sm font-medium focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm focus:shadow-md"
          />
        </div>

        <div className="space-y-4">
          {announcements.map((ann) => (
            <motion.div
              key={ann.id}
              whileHover={{ y: -2 }}
              onClick={() => setSelectedAnn(ann)}
              className="bg-white p-5 rounded-[32px] border border-slate-100 shadow-sm relative overflow-hidden group cursor-pointer"
            >
              {ann.pinned && (
                <div className="absolute top-0 right-0 p-3">
                  <Pin size={16} className="text-primary fill-primary" />
                </div>
              )}
              
              <div className="flex gap-4">
                <div className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center shrink-0 group-hover:bg-primary/5 group-hover:text-primary transition-colors">
                  <Megaphone size={24} />
                </div>
                
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2 mb-1">
                    <span className="text-[10px] font-black text-primary uppercase tracking-widest">{ann.category}</span>
                    <div className="w-1 h-1 rounded-full bg-slate-200" />
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest flex items-center gap-1">
                      <Calendar size={12} />
                      {ann.time}
                    </span>
                  </div>
                  <h3 className="text-base font-black text-slate-800 mb-1 leading-tight line-clamp-2">
                    {ann.title}
                  </h3>
                  <p className="text-[13px] text-slate-500 line-clamp-2 leading-relaxed">
                    {ann.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>

      <BottomSheet
        isOpen={!!selectedAnn}
        onClose={() => setSelectedAnn(null)}
        title={selectedAnn?.category || 'Chi tiết thông báo'}
      >
        {selectedAnn && (
          <div className="space-y-6">
            <div className="space-y-2">
              <div className="flex items-center gap-2">
                <Calendar size={14} className="text-slate-400" />
                <span className="text-[11px] font-black text-slate-400 uppercase tracking-widest">{selectedAnn.time}</span>
              </div>
              <h2 className="text-2xl font-black text-slate-800 leading-tight">
                {selectedAnn.title}
              </h2>
            </div>

            <div className="prose prose-slate max-w-none">
              <p className="text-slate-600 font-medium leading-[1.8] text-base whitespace-pre-wrap">
                {selectedAnn.content}
              </p>
            </div>

            <button className="w-full h-14 bg-slate-50 rounded-2xl flex items-center justify-center gap-3 text-sm font-black text-slate-800 uppercase tracking-widest hover:bg-slate-100 transition-colors">
              <Share2 size={18} />
              Chia sẻ thông báo
            </button>
          </div>
        )}
      </BottomSheet>
    </PortalLayout>
  );
};

export default Announcements;
