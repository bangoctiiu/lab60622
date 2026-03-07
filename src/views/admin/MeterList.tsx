import React, { useState } from 'react';
import { 
  Zap, Droplets, Search, Building, Home, 
  History, TrendingUp, AlertCircle, Activity,
  CheckCircle, ChevronRight, ClipboardCheck
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate, Link } from 'react-router-dom';
import { meterService } from '@/services/meterService';
import { Meter, MeterType, MeterStatus } from '@/models/Meter';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn } from '@/utils';
import useUIStore from '@/stores/uiStore';
import { SelectAsync } from '@/components/ui/SelectAsync';
import { Select } from '@/components/ui/Select';
import { Spinner } from '@/components/ui/Feedback';
import { MeterReadingModal } from '@/components/forms/MeterReadingModal';

const MeterList = () => {
  const navigate = useNavigate();
  const { activeBuildingId, setBuilding } = useUIStore();
  
  // States for filters
  const [meterType, setMeterType] = useState<MeterType | ''>('');
  const [meterStatus, setMeterStatus] = useState<MeterStatus | 'Active'>('Active');
  const [search, setSearch] = useState('');
  const [isMissingOnly, setIsMissingOnly] = useState(false);
  const [roomId, setRoomId] = useState<string | null>(null);

  // Modal State
  const [selectedMeter, setSelectedMeter] = useState<Meter | null>(null);
  const [isModalOpen, setIsModalOpen] = useState(false);

  // 1.1.2 Queries
  const { data: meters, isLoading, refetch } = useQuery({
    queryKey: ['meters', activeBuildingId, roomId, meterType, meterStatus, search, isMissingOnly],
    queryFn: () => meterService.getMeters({ 
      buildingId: activeBuildingId ? String(activeBuildingId) : undefined, 
      roomId: roomId || undefined,
      type: meterType || undefined, 
      status: meterStatus || undefined 
    })
  });

  const handleOpenReadingModal = (meter: Meter) => {
    setSelectedMeter(meter);
    setIsModalOpen(true);
  };

  const currentMonthYear = new Date().toLocaleDateString('vi-VN', { month: '2-digit', year: 'numeric' });

  return (
    <div className="space-y-8 animate-in fade-in duration-500">
      {/* 5.1.1 Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-[44px] font-black leading-tight tracking-tighter text-primary">Đồng hồ & Chỉ số</h1>
          <p className="text-body text-muted max-w-2xl font-medium">Quản lý điện nước, ghi nhận chỉ số tiêu thụ và tự động tính toán hóa đơn hàng tháng.</p>
        </div>
        <div className="flex items-center gap-4">
           <button 
             onClick={() => navigate('/meters/bulk-entry')}
             className="btn-primary pl-8 pr-8 h-14 rounded-[32px] flex items-center gap-3 shadow-2xl shadow-primary/20 active:scale-95 transition-all"
           >
              <ClipboardCheck size={20} />
              <span className="text-[13px] font-black uppercase tracking-[3px]">Ghi chỉ số hàng loạt</span>
           </button>
        </div>
      </div>

      {/* 5.1.1 Filter Panel */}
      <div className="card-container p-8 animate-in slide-in-from-top-4 duration-500 relative z-20 overflow-visible">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-6 gap-6 items-start">
          <div className="relative z-[50]">
            <SelectAsync 
              label="Tòa nhà"
              placeholder="Tất cả tòa nhà"
              icon={Building}
              value={activeBuildingId}
              loadOptions={async () => [
                { label: 'The Manor Central Park', value: 'B1' },
                { label: 'Vinhomes Central Park', value: 'B2' }
              ]}
              onChange={(val) => setBuilding(val)} 
            />
          </div>

          <div className="relative z-[49]">
            <SelectAsync 
              label="Phòng"
              placeholder="Tất cả phòng"
              icon={Home}
              value={roomId}
              loadOptions={async (search) => {
                 const rooms = [
                   { label: 'Phòng A-101', value: 'R1' },
                   { label: 'Phòng B-205', value: 'R2' },
                   { label: 'Phòng V-401', value: 'R3' }
                 ];
                 return rooms.filter(r => r.label.toLowerCase().includes(search.toLowerCase()));
              }}
              onChange={(val) => setRoomId(val)} 
            />
          </div>

          <div className="relative z-[48]">
            <Select 
              label="Loại đồng hồ"
              placeholder="Tất cả"
              icon={Zap}
              options={[
                { label: 'Tất cả loại', value: '' },
                { label: 'Điện (Electricity)', value: 'Electricity' },
                { label: 'Nước (Water)', value: 'Water' }
              ]}
              value={meterType}
              onChange={(val) => setMeterType(val as any)}
            />
          </div>

          <div className="relative z-[47]">
            <Select 
              label="Trạng thái"
              placeholder="Đang hoạt động"
              icon={Activity}
              options={[
                { label: 'Đang hoạt động', value: 'Active' },
                { label: 'Tạm dừng', value: 'Inactive' },
                { label: 'Đã thay mới', value: 'Replaced' }
              ]}
              value={meterStatus}
              onChange={(val) => setMeterStatus(val as any)}
            />
          </div>

          <div className="relative z-[46]">
            <div className="space-y-2">
               <label className="text-[11px] text-muted font-black uppercase tracking-[2px] ml-1">Tìm kiếm</label>
               <div className="relative group">
                  <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-muted group-focus-within:text-primary transition-colors" />
                  <input 
                    type="text" 
                    placeholder="Mã/Số phòng..."
                    className="input-base pl-12 h-14"
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                  />
               </div>
            </div>
          </div>

          <div className="relative z-[45]">
            <div className="pt-6">
               <div 
                 onClick={() => setIsMissingOnly(!isMissingOnly)}
                 className={cn(
                   "flex h-14 items-center justify-center gap-3 rounded-[20px] cursor-pointer transition-all border-2 font-black uppercase tracking-widest text-[11px]",
                   isMissingOnly ? "bg-danger/10 border-danger/20 text-danger shadow-lg shadow-danger/10" : "bg-bg border-transparent text-muted hover:bg-slate-100"
                 )}
               >
                  <AlertCircle size={18} className={isMissingOnly ? "animate-pulse" : ""} />
                  Chưa nhập
               </div>
            </div>
          </div>
        </div>
      </div>
      {/* 5.1.2 DataTable */}
      <div className="card-container overflow-hidden bg-white/40 border-border/5">
        <div className="overflow-x-auto">
           <table className="w-full text-left border-collapse">
              <thead className="bg-slate-900/5 backdrop-blur-sm border-b border-border/5">
                 <tr>
                    <th className="px-8 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Mã đồng hồ</th>
                    <th className="px-6 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Phòng</th>
                    <th className="px-6 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Loại</th>
                    <th className="px-6 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Chỉ số mới nhất (RULE-01)</th>
                    <th className="px-6 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Tháng kỳ</th>
                    <th className="px-6 py-6 text-[10px] font-black text-muted uppercase tracking-[3px]">Trạng thái</th>
                    <th className="px-8 py-6 text-right text-[10px] font-black text-muted uppercase tracking-[3px]">Thao tác</th>
                 </tr>
              </thead>
              <tbody>
                 {isLoading ? (
                    <tr>
                       <td colSpan={7} className="py-20 text-center">
                          <Spinner className="w-10 h-10" />
                       </td>
                    </tr>
                 ) : meters?.data?.length === 0 ? (
                    <tr>
                       <td colSpan={7} className="py-20 text-center opacity-40">
                          <AlertCircle size={48} className="mx-auto mb-4" />
                          <p className="text-[13px] font-black uppercase tracking-widest">Không tìm thấy đồng hồ nào</p>
                       </td>
                    </tr>
                 ) : (
                    meters?.data?.map((meter: Meter) => (
                       <tr key={meter.id} className="group border-b border-border/5 hover:bg-white/50 transition-all">
                          <td className="px-8 py-6">
                             <Link to={`/meters/${meter.id}/readings`} className="font-mono text-[13px] font-black text-primary hover:underline flex items-center gap-2">
                               {meter.meterCode}
                               <ChevronRight size={14} className="opacity-0 group-hover:opacity-100 -translate-x-2 group-hover:translate-x-0 transition-all" />
                             </Link>
                          </td>
                          <td className="px-6 py-6">
                             <Link to={`/rooms/${meter.roomId}`} className="text-small font-black text-slate-700 hover:text-primary transition-colors">
                                Phòng {meter.roomCode}
                             </Link>
                          </td>
                          <td className="px-6 py-6">
                             <div className={cn(
                               "flex items-center gap-2 px-3 py-1 rounded-full w-fit",
                               meter.meterType === 'Electricity' ? "bg-amber-100 text-amber-700" : "bg-blue-100 text-blue-700"
                             )}>
                                {meter.meterType === 'Electricity' ? <Zap size={12} fill="currentColor" /> : <Droplets size={12} fill="currentColor" />}
                                <span className="text-[10px] font-black uppercase tracking-tighter">
                                   {meter.meterType === 'Electricity' ? 'Điện' : 'Nước'}
                                </span>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <span className="text-[16px] font-black font-mono text-slate-800">
                                {Number(meter.lastReadingValue || 0).toLocaleString()}
                             </span>
                          </td>
                          <td className="px-6 py-6">
                             <div className="flex flex-col">
                                <span className="text-[11px] font-bold text-slate-600">{currentMonthYear}</span>
                                <span className="text-[9px] text-muted font-medium uppercase tracking-tighter">Cập nhật 2 ngày trước</span>
                             </div>
                          </td>
                          <td className="px-6 py-6">
                             <StatusBadge status={meter.meterStatus} />
                          </td>
                          <td className="px-8 py-6 text-right">
                             <div className="flex justify-end gap-2">
                                <button 
                                  onClick={() => handleOpenReadingModal(meter)}
                                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-primary/10 text-primary hover:bg-primary hover:text-white transition-all shadow-lg shadow-primary/5 active:scale-90"
                                  title="Nhập chỉ số"
                                >
                                   <History size={18} />
                                </button>
                                <button 
                                  onClick={() => navigate(`/meters/${meter.id}/readings`)}
                                  className="h-10 w-10 flex items-center justify-center rounded-xl bg-bg border border-border/50 text-muted hover:text-primary transition-all active:scale-90"
                                  title="Lịch sử tiêu thụ"
                                >
                                   <TrendingUp size={18} />
                                </button>
                             </div>
                          </td>
                       </tr>
                    ))
                 )}
              </tbody>
           </table>
        </div>
      </div>

      {/* Metric Grid Mini */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
         <div className="card-container p-6 bg-gradient-to-br from-white to-blue-50/30 border-blue-100/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-blue-100 flex items-center justify-center text-blue-600">
                  <Droplets size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Tổng tiêu thụ nước</span>
            </div>
            <p className="text-[28px] font-black text-slate-900 tracking-tighter">1,245 <span className="text-[14px] text-muted">m3</span></p>
            <div className="mt-4 h-1 bg-blue-100 rounded-full overflow-hidden">
               <div className="h-full bg-blue-500 w-[65%]" />
            </div>
         </div>

         <div className="card-container p-6 bg-gradient-to-br from-white to-amber-50/30 border-amber-100/20">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-amber-100 flex items-center justify-center text-amber-600">
                  <Zap size={20} fill="currentColor" />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Tổng tiêu thụ điện</span>
            </div>
            <p className="text-[28px] font-black text-slate-900 tracking-tighter">45,890 <span className="text-[14px] text-muted">kWh</span></p>
            <div className="mt-4 h-1 bg-amber-100 rounded-full overflow-hidden">
               <div className="h-full bg-amber-500 w-[82%]" />
            </div>
         </div>

         <div className="card-container p-6 bg-gradient-to-br from-white to-danger-bg/20 border-danger/5">
            <div className="flex items-center gap-4 mb-4">
               <div className="w-10 h-10 rounded-xl bg-danger/10 flex items-center justify-center text-danger">
                  <AlertCircle size={20} />
               </div>
               <span className="text-[11px] font-black uppercase tracking-[2px] text-muted">Đồng hồ chưa nhập</span>
            </div>
            <p className="text-[28px] font-black text-danger tracking-tighter">12 <span className="text-[14px] opacity-60">phòng</span></p>
            <p className="text-[10px] text-danger/60 font-medium mt-1 uppercase tracking-widest">Hạn chót: 3 ngày tới</p>
         </div>
      </div>
      
      {/* 5.2 Meter Reading Modal */}
      <MeterReadingModal 
        isOpen={isModalOpen}
        meter={selectedMeter}
        onClose={() => setIsModalOpen(false)}
        onSuccess={() => refetch()}
      />
    </div>
  );
};

export default MeterList;
