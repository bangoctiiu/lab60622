import React from 'react';
import { motion } from 'framer-motion';
import { 
  Plus, 
  ChevronLeft, 
  MapPin, 
  AlertCircle, 
  Image as ImageIcon,
  X,
  Send,
  Loader2
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useForm, Controller } from 'react-hook-form';
import PortalLayout from '@/components/portal/PortalLayout';

interface TicketForm {
  title: string;
  category: string;
  description: string;
  priority: 'Low' | 'Medium' | 'High' | 'Emergency';
  location: string;
}

const CreateTicket: React.FC = () => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [attachments, setAttachments] = useState<File[]>([]);
  const { register, handleSubmit, control, formState: { errors } } = useForm<TicketForm>({
    defaultValues: {
      priority: 'Medium'
    }
  });

  const onSubmit = async (data: TicketForm) => {
    setIsSubmitting(true);
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsSubmitting(false);
    navigate('/portal/tickets');
  };

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Gửi yêu cầu hỗ trợ</h1>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 space-y-4">
            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Tiêu đề yêu cầu</label>
              <input 
                {...register('title', { required: 'Vui lòng nhập tiêu đề' })}
                placeholder="Ví dụ: Vòi nước bị rò rỉ"
                className="w-full h-12 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all"
              />
              {errors.title && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.title.message}</p>}
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Danh mục</label>
                <select 
                  {...register('category')}
                  className="w-full h-12 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all appearance-none"
                >
                  <option value="Sửa chữa">Sửa chữa</option>
                  <option value="Điện/Nước">Điện/Nước</option>
                  <option value="An ninh">An ninh</option>
                  <option value="Khác">Khác</option>
                </select>
              </div>
              <div>
                <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Mức độ ưu tiên</label>
                <select 
                  {...register('priority')}
                  className="w-full h-12 bg-slate-50 border-none rounded-2xl px-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all appearance-none"
                >
                  <option value="Low">Thấp</option>
                  <option value="Medium">Trung bình</option>
                  <option value="High">Cao</option>
                  <option value="Emergency">Khẩn cấp</option>
                </select>
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Vị trí</label>
              <div className="relative">
                <MapPin className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
                <input 
                  {...register('location')}
                  placeholder="Ví dụ: Nhà bếp"
                  className="w-full h-12 bg-slate-50 border-none rounded-2xl pl-12 pr-4 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all"
                />
              </div>
            </div>

            <div>
              <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-2 block">Mô tả chi tiết</label>
              <textarea 
                {...register('description', { required: 'Vui lòng mô tả vấn đề' })}
                rows={4}
                placeholder="Hãy mô tả chi tiết tình trạng bạn đang gặp phải..."
                className="w-full bg-slate-50 border-none rounded-2xl p-4 text-sm font-medium focus:ring-2 ring-primary/20 outline-none transition-all resize-none"
              />
               {errors.description && <p className="text-red-500 text-[10px] mt-1 font-bold">{errors.description.message}</p>}
            </div>
          </div>

          <div className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100">
            <label className="text-xs font-black text-slate-400 uppercase tracking-widest mb-4 block text-center">Hình ảnh đính kèm</label>
            <div className="flex flex-wrap gap-3">
              <button 
                type="button"
                className="w-20 h-20 rounded-2xl border-2 border-dashed border-slate-100 flex flex-col items-center justify-center text-slate-300 hover:text-primary hover:border-primary/30 transition-all group"
              >
                <Plus size={24} className="group-hover:scale-110 transition-transform" />
                <span className="text-[10px] font-black uppercase mt-1">Thêm</span>
              </button>
            </div>
          </div>

          <button 
            type="submit"
            disabled={isSubmitting}
            className="w-full h-14 bg-primary text-white rounded-[28px] font-black uppercase tracking-[3px] text-sm shadow-xl shadow-primary/20 flex items-center justify-center gap-3 active:scale-95 transition-all disabled:opacity-50"
          >
            {isSubmitting ? <Loader2 className="animate-spin" size={20} /> : <Send size={20} />}
            Gửi yêu cầu ngay
          </button>
        </form>

        <div className="bg-amber-50 rounded-2xl p-4 flex gap-4 border border-amber-100">
          <AlertCircle className="text-amber-500 shrink-0" size={20} />
          <p className="text-[12px] font-medium text-amber-700 leading-relaxed">
            Trong trường hợp khẩn cấp liên quan đến an toàn hoặc cháy nổ, vui lòng liên hệ hotline Ban quản lý ngay lập tức: <span className="font-bold">1900 xxxx</span>
          </p>
        </div>
      </div>
    </PortalLayout>
  );
};

export default CreateTicket;
