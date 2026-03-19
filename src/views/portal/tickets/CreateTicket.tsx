import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Send, Camera, Paperclip, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [category, setCategory] = useState('');
  const [title, setTitle] = useState('');
  const [desc, setDesc] = useState('');

  const categories = ['Sửa chữa', 'Vệ sinh', 'Thủ tục', 'Khiếu nại', 'Phản ánh'];

  return (
    <div className="min-h-screen bg-bg pb-10 animate-in fade-in slide-in-from-right-4 duration-500">
      <div className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-muted/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <span className="text-body font-bold">Tạo yêu cầu mới</span>
        <div className="w-10"></div>
      </div>

      <div className="p-4 space-y-6">
        {/* Category Selection */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted ml-1 uppercase">Loại yêu cầu</label>
          <div className="grid grid-cols-2 gap-2">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setCategory(cat)}
                className={`py-3 px-4 text-small font-bold rounded-xl border-2 transition-all ${
                  category === cat ? 'bg-primary/5 border-primary text-primary' : 'bg-white border-transparent text-muted'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Form Fields */}
        <div className="space-y-4">
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted ml-1 uppercase">Tiêu đề</label>
            <input
              type="text"
              placeholder="Nhập tiêu đề ngắn gọn"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              className="w-full h-14 px-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium"
            />
          </div>
          <div className="space-y-2">
            <label className="text-[11px] font-bold text-muted ml-1 uppercase">Nội dung chi tiết</label>
            <textarea
              placeholder="Mô tả chi tiết vấn đề bạn đang gặp phải..."
              rows={5}
              value={desc}
              onChange={(e) => setDesc(e.target.value)}
              className="w-full p-4 bg-white border-none rounded-2xl shadow-sm focus:ring-2 focus:ring-primary/20 transition-all font-medium resize-none"
            />
          </div>
        </div>

        {/* Media Upload */}
        <div className="space-y-3">
          <label className="text-[11px] font-bold text-muted ml-1 uppercase">Hình ảnh / Đính kèm (Tùy chọn)</label>
          <div className="flex gap-3">
            <button className="w-20 h-20 bg-white rounded-2xl border-2 border-dashed border-muted/10 flex flex-col items-center justify-center gap-1 text-muted hover:border-primary/30 hover:text-primary transition-all">
              <Camera size={24} />
              <span className="text-[10px] font-bold">Chụp ảnh</span>
            </button>
            <button className="w-20 h-20 bg-white rounded-2xl border-2 border-dashed border-muted/10 flex flex-col items-center justify-center gap-1 text-muted hover:border-primary/30 hover:text-primary transition-all">
              <Paperclip size={24} />
              <span className="text-[10px] font-bold">Đính kèm</span>
            </button>
          </div>
        </div>

        <Button 
          className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          disabled={!category || !title || !desc}
        >
          GỬI YÊU CẦU
          <Send size={20} className="group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
        </Button>
      </div>
    </div>
  );
};

export default CreateTicket;
