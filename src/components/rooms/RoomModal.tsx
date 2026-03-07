import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Maximize, DollarSign, 
  MapPin, Package, Users, Compass, 
  Layout, Wind, Droplets, Refrigerator, 
  Disc, Check, X, AlertCircle, Monitor
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { roomService } from '@/services/roomService';
import { RoomType, Furnishing, DirectionFacing } from '@/models/Room';
import { cn } from '@/utils';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Feedback';

interface RoomModalProps {
  isOpen: boolean;
  onClose: () => void;
  room?: any; // If editing
}

export const RoomModal = ({ isOpen, onClose, room }: RoomModalProps) => {
  const isEditing = !!room;
  const queryClient = useQueryClient();
  const [formData, setFormData] = useState<any>({
    roomCode: '',
    buildingId: 1,
    floorNumber: 1,
    roomType: 'Studio',
    areaSqm: 0,
    baseRentPrice: 0,
    maxOccupancy: 2,
    furnishing: 'Unfurnished',
    directionFacing: 'S',
    hasBalcony: false,
    conditionScore: 8,
    amenities: [],
    description: ''
  });

  const [codeError, setCodeError] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  useEffect(() => {
    if (room) setFormData(room);
  }, [room]);

  const handleBlurCode = async () => {
    if (!formData.roomCode || isEditing) return;
    setIsCheckingCode(true);
    const isUnique = await roomService.checkRoomCodeUnique(formData.roomCode, formData.buildingId);
    if (!isUnique) {
      setCodeError('Mã phòng này đã tồn tại trong tòa nhà.');
    } else {
      setCodeError('');
    }
    setIsCheckingCode(false);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => roomService.createRoom(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      toast.success('Đã tạo phòng mới thành công');
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => roomService.updateRoom(room.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rooms'] });
      queryClient.invalidateQueries({ queryKey: ['room', room.id] });
      toast.success('Đã cập nhật thông tin phòng');
      onClose();
    }
  });

  if (!isOpen) return null;

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeError) return;
    if (isEditing) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const ammenityList = [
    { id: 'WiFi', label: 'WiFi', icon: Layout },
    { id: 'AirConditioner', label: 'Điều hòa', icon: Wind },
    { id: 'HotWater', label: 'Bình nóng lạnh', icon: Droplets },
    { id: 'Fridge', label: 'Tủ lạnh', icon: Refrigerator },
    { id: 'Washer', label: 'Máy giặt', icon: Disc },
    { id: 'TV', label: 'Tivi', icon: Monitor },
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b bg-primary flex justify-between items-center text-white">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Home size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-widest">{isEditing ? 'Sửa thông tin phòng' : 'Thêm phòng mới'}</h2>
                 <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">BMS SmartStay Core Inventory</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X size={24} />
           </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10">
           {/* Section 1: Thông tin cơ bản */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <Building2 size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Thông tin cơ bản</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Toà nhà</label>
                    <select 
                      disabled={isEditing}
                      className="input-base w-full bg-bg/50"
                      value={formData.buildingId}
                      onChange={(e) => setFormData({ ...formData, buildingId: Number(e.target.value) })}
                    >
                       <option value={1}>Keangnam Landmark</option>
                       <option value={2}>Lotte Center</option>
                    </select>
                 </div>
                 <div className="space-y-2 relative">
                    <label className="text-[10px] font-black text-muted uppercase">Mã phòng *</label>
                    <input 
                      type="text" 
                      required
                      placeholder="VD: A-101"
                      className={cn("input-base w-full", codeError && "border-danger focus:ring-danger/20")}
                      value={formData.roomCode}
                      onBlur={handleBlurCode}
                      onChange={(e) => setFormData({ ...formData, roomCode: e.target.value.toUpperCase() })}
                    />
                    {isCheckingCode && <Spinner className="absolute right-3 bottom-3 w-4 h-4" />}
                    {codeError && <p className="text-[10px] text-danger font-bold absolute -bottom-5 flex items-center gap-1"><AlertCircle size={10} /> {codeError}</p>}
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Tầng số</label>
                    <input 
                      type="number" 
                      className="input-base w-full"
                      value={formData.floorNumber}
                      onChange={(e) => setFormData({ ...formData, floorNumber: Number(e.target.value) })}
                    />
                 </div>
              </div>
           </div>

           {/* Section 2: Kỹ thuật & Giá */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <Maximize size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Kỹ thuật & Giá thuê</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
                 <div className="space-y-2 col-span-2">
                    <label className="text-[10px] font-black text-muted uppercase">Loại phòng</label>
                    <select 
                      className="input-base w-full"
                      value={formData.roomType}
                      onChange={(e) => setFormData({ ...formData, roomType: e.target.value as RoomType })}
                    >
                       <option value="Studio">Studio</option>
                       <option value="1BR">1 Phòng ngủ</option>
                       <option value="2BR">2 Phòng ngủ</option>
                       <option value="3BR">3 Phòng ngủ</option>
                       <option value="Penthouse">Penthouse</option>
                       <option value="Commercial">Kinh doanh</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Diện tích (m2)</label>
                    <input 
                      type="number" 
                      className="input-base w-full"
                      value={formData.areaSqm}
                      onChange={(e) => setFormData({ ...formData, areaSqm: Number(e.target.value) })}
                    />
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Giá thuê CB (VND)</label>
                    <input 
                      type="number" 
                      className="input-base w-full font-bold text-primary"
                      value={formData.baseRentPrice}
                      onChange={(e) => setFormData({ ...formData, baseRentPrice: Number(e.target.value) })}
                    />
                 </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Tình trạng nội thất</label>
                    <select 
                      className="input-base w-full"
                      value={formData.furnishing}
                      onChange={(e) => setFormData({ ...formData, furnishing: e.target.value as Furnishing })}
                    >
                       <option value="Unfurnished">Nhà trống</option>
                       <option value="SemiFurnished">Bán nội thất</option>
                       <option value="FullyFurnished">Đầy đủ nội thất</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Hướng cửa/ban công</label>
                    <select 
                      className="input-base w-full"
                      value={formData.directionFacing}
                      onChange={(e) => setFormData({ ...formData, directionFacing: e.target.value as DirectionFacing })}
                    >
                       <option value="S">Nam (S)</option>
                       <option value="N">Bắc (N)</option>
                       <option value="E">Đông (E)</option>
                       <option value="W">Tây (W)</option>
                       <option value="SE">Đông Nam (SE)</option>
                    </select>
                 </div>
                 <div className="space-y-2">
                    <label className="text-[10px] font-black text-muted uppercase">Điểm trạng thái (1-10)</label>
                    <div className="flex items-center gap-4 py-2 px-1">
                       <input 
                         type="range" min="1" max="10" 
                         className="flex-1 h-1.5 bg-bg rounded-lg appearance-none cursor-pointer accent-primary"
                         value={formData.conditionScore}
                         onChange={(e) => setFormData({ ...formData, conditionScore: Number(e.target.value) })}
                       />
                       <span className="text-body font-black text-primary">{formData.conditionScore}/10</span>
                    </div>
                 </div>
              </div>
           </div>

           {/* Section 3: Tiện ích & Mô tả */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <Package size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Tiện ích đi kèm</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
                 {ammenityList.map((item) => (
                   <label key={item.id} className={cn(
                     "flex flex-col items-center justify-center p-4 rounded-3xl border-2 transition-all cursor-pointer group",
                     formData.amenities.includes(item.id) ? "border-primary bg-primary/5 text-primary" : "border-bg bg-bg/20 text-muted grayscale hover:grayscale-0"
                   )}>
                      <input 
                        type="checkbox" 
                        className="hidden"
                        checked={formData.amenities.includes(item.id)}
                        onChange={(e) => {
                          const list = [...formData.amenities];
                          if (e.target.checked) list.push(item.id);
                          else list.splice(list.indexOf(item.id), 1);
                          setFormData({ ...formData, amenities: list });
                        }}
                      />
                      <item.icon size={24} className="mb-2 group-hover:scale-110 transition-transform" />
                      <span className="text-[9px] font-black uppercase tracking-widest">{item.label}</span>
                   </label>
                 ))}
              </div>
              <div className="space-y-2">
                 <label className="text-[10px] font-black text-muted uppercase">Mô tả/Ghi chú</label>
                 <textarea 
                   className="input-base w-full min-h-[100px] py-4"
                   placeholder="Nhập mô tả chi tiết về đặc điểm phòng..."
                   value={formData.description}
                   onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                 />
              </div>
           </div>
        </form>

        {/* Footer */}
        <div className="p-8 border-t bg-bg/20 flex justify-end gap-3">
           <button onClick={onClose} className="px-8 py-3 bg-white border border-border/50 text-muted font-black uppercase tracking-widest rounded-2xl hover:bg-white/80 transition-all">Huỷ bỏ</button>
           <button 
             onClick={handleSubmit}
             disabled={createMutation.isPending || updateMutation.isPending || !!codeError}
             className="px-10 py-3 bg-primary text-white font-black uppercase tracking-[3px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
           >
              {isEditing ? 'Lưu thay đổi' : 'Tạo phòng'}
           </button>
        </div>
      </div>
    </div>
  );
};
