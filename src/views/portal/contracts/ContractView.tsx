import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Calendar, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  Download,
  CheckCircle2,
  Info,
  DollarSign,
  Wrench,
  ChevronRight
} from 'lucide-react';
import PortalLayout from '@/components/portal/PortalLayout';
import api from '@/services/apiClient';
import { cn, formatVND, formatDate } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { toast } from 'sonner';

const ContractView = () => {
  const { data: contract, isLoading } = useQuery({
    queryKey: ['portal-active-contract'],
    queryFn: async () => {
      const res = await api.get('/api/portal/contract/active');
      return res.data;
    }
  });

  return (
    <PortalLayout 
      title="Hợp đồng điện tử" 
      showBack={true}
      rightAction={
        <button onClick={() => toast.info('Chức năng đang phát triển để kết nối Backend')} className="p-2 bg-white/10 rounded-xl text-white active:scale-95 transition-all">
          <Download size={20} />
        </button>
      }
    >
      <div className="space-y-8 pb-32">
        {isLoading ? (
          <div className="py-20 flex justify-center"><Spinner /></div>
        ) : (
          <>
            {/* 1. Header Card */}
            <div className="px-8 pt-6">
              <div className="bg-white p-8 rounded-[48px] shadow-2xl shadow-slate-200/50 border-2 border-slate-50 relative overflow-hidden">
                <div className="relative z-10 space-y-4">
                  <div className="flex items-center justify-between">
                    <span className="text-[10px] font-black text-slate-300 uppercase tracking-[0.3em]">Mã hợp đồng: {contract?.code || 'CON-100293'}</span>
                    <div className="px-3 py-1 bg-emerald-50 text-emerald-600 rounded-full text-[10px] font-black uppercase tracking-widest flex items-center gap-1.5 border border-emerald-100">
                      <ShieldCheck size={12} /> {contract?.status || 'Đang hiệu lực'}
                    </div>
                  </div>
                  <h2 className="text-2xl font-black text-slate-800 tracking-tight leading-none uppercase">Hợp đồng thuê phòng {contract?.roomCode || '202'}</h2>
                  <p className="text-[11px] font-bold text-slate-400 italic">Ký kết ngày: {formatDate(contract?.startDate || new Date())}</p>
                </div>
                <div className="absolute top-0 right-0 w-32 h-32 bg-teal-50 rounded-full -mr-16 -mt-16 opacity-50" />
              </div>
            </div>

            {/* 2. Key Details Grid */}
            <div className="px-8 grid grid-cols-2 gap-4">
              <DetailBox label="Giá thuê" value={formatVND(contract?.rentPrice || 5500000)} icon={DollarSign} color="text-teal-600" bg="bg-teal-50" />
              <DetailBox label="Chu kỳ thanh toán" value={`Tháng ${contract?.paymentCycle || 1}`} icon={Clock} color="text-orange-600" bg="bg-orange-50" />
            </div>

            {/* 3. Duration Card */}
            <div className="px-8">
              <div className="bg-slate-900 rounded-[36px] p-8 text-white shadow-xl shadow-slate-900/10 flex items-center justify-between">
                <div className="space-y-1">
                  <p className="text-[9px] font-black text-white/40 uppercase tracking-[0.2em]">Thời hạn hợp đồng</p>
                  <div className="flex items-center gap-3">
                    <span className="text-lg font-black">{formatDate(contract?.startDate || new Date())}</span>
                    <ChevronRight size={16} className="text-white/20" />
                    <span className="text-lg font-black">{formatDate(contract?.endDate || new Date())}</span>
                  </div>
                </div>
                <div className="w-12 h-12 bg-white/10 rounded-2xl flex items-center justify-center border border-white/10">
                  <Calendar size={24} strokeWidth={1.5} />
                </div>
              </div>
            </div>

            {/* 4. Included Services */}
            <div className="px-8 space-y-6">
              <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2">Dịch vụ đi kèm</h3>
              <div className="space-y-3">
                {(contract?.services || [
                   { name: 'Điện', price: 3500, unit: 'kWh' },
                   { name: 'Nước', price: 25000, unit: 'm3' },
                   { name: 'Quản lý & Vệ sinh', price: 150000, unit: 'Tháng' }
                ]).map((svc: any, idx: number) => (
                  <div key={idx} className="bg-white p-5 rounded-[28px] border border-slate-100 flex items-center justify-between">
                    <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-slate-50 text-slate-400 rounded-xl flex items-center justify-center">
                        <Wrench size={18} />
                      </div>
                      <span className="text-sm font-black text-slate-700 uppercase tracking-tight">{svc.name}</span>
                    </div>
                    <span className="text-sm font-black text-teal-600">{formatVND(svc.price)}<span className="text-[10px] text-slate-400 font-medium lowercase ml-1">/{svc.unit}</span></span>
                  </div>
                ))}
              </div>
            </div>

            {/* 5. Policy Hint */}
            <div className="px-8">
               <div className="bg-amber-50 border border-amber-100/50 p-6 rounded-[32px] flex gap-4">
                  <Info className="text-amber-500 shrink-0" size={20} />
                  <p className="text-[10px] text-amber-700/70 font-medium leading-relaxed italic">
                    Lưu ý: Bạn có 30 ngày để thông báo nếu muốn gia hạn hoặc kết thúc hợp đồng trước thời hạn. Vui lòng đọc kỹ các điều khoản về bồi hoàn trong file PDF đính kèm.
                  </p>
               </div>
            </div>
          </>
        )}
      </div>
    </PortalLayout>
  );
};

const DetailBox = ({ label, value, icon: Icon, color, bg }: any) => (
  <div className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 space-y-3">
    <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center shadow-inner", bg, color)}>
      <Icon size={20} />
    </div>
    <div className="space-y-0.5 text-left">
      <p className="text-[9px] font-black text-slate-300 uppercase tracking-widest">{label}</p>
      <h4 className="text-sm font-black text-slate-800 tracking-tight leading-none uppercase">{value}</h4>
    </div>
  </div>
);

export default ContractView;
