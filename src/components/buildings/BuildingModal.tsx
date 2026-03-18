import React, { useState, useEffect } from 'react';
import { 
  Building2, MapPin, Phone, Mail, 
  Calendar, Layers, ShieldCheck, X, 
  Check, AlertCircle, Trash2, Edit
} from 'lucide-react';
import { useMutation, useQueryClient } from '@tanstack/react-query';
import { buildingService } from '@/services/buildingService';
import { BuildingType } from '@/models/Building';
import { cn } from '@/utils';
import { toast } from 'sonner';
import { Spinner } from '@/components/ui/Feedback';

interface BuildingModalProps {
  isOpen: boolean;
  onClose: () => void;
  building?: any; // If editing
}

export const BuildingModal = ({ isOpen, onClose, building }: BuildingModalProps) => {
  const isEditing = !!building;
  const queryClient = useQueryClient();
  
  const [formData, setFormData] = useState<any>({
    buildingCode: '',
    buildingName: '',
    type: 'Apartment',
    address: '',
    provinceId: '',
    districtId: '',
    wardId: '',
    yearBuilt: new Date().getFullYear(),
    totalFloors: 1,
    managementPhone: '',
    managementEmail: '',
    latitude: 21.0173,
    longitude: 105.784,
    amenities: []
  });

  const [provinces, setProvinces] = useState<any[]>([]);
  const [districts, setDistricts] = useState<any[]>([]);
  const [wards, setWards] = useState<any[]>([]);
  
  const [codeError, setCodeError] = useState('');
  const [isCheckingCode, setIsCheckingCode] = useState(false);

  useEffect(() => {
    const fetchLocs = async () => {
      const p = await buildingService.getProvinces();
      setProvinces(p);
    };
    fetchLocs();
    
    if (building) {
      setFormData(building);
      // Logic for pre-filling districts/wards if editing would go here
    }
  }, [building]);

  useEffect(() => {
    if (formData.provinceId) {
       buildingService.getDistricts(formData.provinceId).then(setDistricts);
       setWards([]);
    }
  }, [formData.provinceId]);

  useEffect(() => {
    if (formData.districtId) {
       buildingService.getWards(formData.districtId).then(setWards);
    }
  }, [formData.districtId]);

  const handleBlurCode = async () => {
    if (!formData.buildingCode || isEditing) return;
    setIsCheckingCode(true);
    const isUnique = await buildingService.checkBuildingCodeUnique(formData.buildingCode);
    if (!isUnique) {
      setCodeError('Mã toà nhà này đã tồn tại.');
    } else {
      setCodeError('');
    }
    setIsCheckingCode(false);
  };

  const createMutation = useMutation({
    mutationFn: (data: any) => buildingService.createBuilding(data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      toast.success('Đã tạo toà nhà mới thành công');
      onClose();
    }
  });

  const updateMutation = useMutation({
    mutationFn: (data: any) => buildingService.updateBuilding(building.id, data),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['buildings'] });
      queryClient.invalidateQueries({ queryKey: ['building', building.id] });
      toast.success('Đã cập nhật thông tin toà nhà');
      onClose();
    }
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (codeError) return;
    if (isEditing) updateMutation.mutate(formData);
    else createMutation.mutate(formData);
  };

  const amenityList = [
    'Gym', 'Pool', 'Parking', 'Security24h', 'Elevator', 'Lobby', 'Garden', 'Supermarket'
  ];

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300">
      <div className="w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col max-h-[90vh] animate-in zoom-in-95 duration-300">
        {/* Header */}
        <div className="p-8 border-b bg-primary flex justify-between items-center text-white">
           <div className="flex items-center gap-4">
              <div className="w-12 h-12 bg-white/20 rounded-2xl flex items-center justify-center">
                 <Building2 size={24} />
              </div>
              <div>
                 <h2 className="text-xl font-black uppercase tracking-widest">{isEditing ? 'Sửa thông tin toà nhà' : 'Thêm toà nhà mới'}</h2>
                 <p className="text-[10px] text-white/60 font-medium uppercase tracking-tighter">BMS SmartStay Building Management</p>
              </div>
           </div>
           <button onClick={onClose} className="p-2 hover:bg-white/10 rounded-full transition-all">
              <X size={24} />
           </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="flex-1 overflow-y-auto p-10 space-y-10">
           {/* Section 1: Thông tin định danh */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <Building2 size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Thông tin định danh</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1.5 relative">
                    <label className="text-[10px] font-black text-muted uppercase">Mã toà nhà *</label>
                    <input 
                      type="text" required disabled={isEditing}
                      className={cn("input-base w-full", codeError && "border-danger")}
                      value={formData.buildingCode}
                      onBlur={handleBlurCode}
                      onChange={(e) => setFormData({ ...formData, buildingCode: e.target.value.toUpperCase() })}
                    />
                    {isCheckingCode && <Spinner className="absolute right-3 bottom-3 w-4 h-4" />}
                    {codeError && <p className="text-[10px] text-danger font-bold absolute -bottom-5">{codeError}</p>}
                 </div>
                 <div className="space-y-1.5 md:col-span-2">
                    <label className="text-[10px] font-black text-muted uppercase">Tên toà nhà *</label>
                    <input 
                      type="text" required
                      className="input-base w-full"
                      value={formData.buildingName}
                      onChange={(e) => setFormData({ ...formData, buildingName: e.target.value })}
                    />
                 </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase">Loại hình</label>
                    <select 
                      className="input-base w-full"
                      value={formData.type}
                      onChange={(e) => setFormData({ ...formData, type: e.target.value as BuildingType })}
                    >
                       <option value="Apartment">Căn hộ (Apartment)</option>
                       <option value="Office">Văn phòng (Office)</option>
                       <option value="Mixed">Hỗn hợp (Mixed)</option>
                       <option value="Shophouse">Shophouse</option>
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase">Số tầng</label>
                    <input 
                      type="number" min="1"
                      className="input-base w-full"
                      value={formData.totalFloors}
                      onChange={(e) => setFormData({ ...formData, totalFloors: Number(e.target.value) })}
                    />
                 </div>
              </div>
           </div>

           {/* Section 2: Địa điểm & Toạ độ */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <MapPin size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Địa điểm & Toạ độ</h3>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase">Tỉnh/Thành phố</label>
                    <select 
                      className="input-base w-full"
                      value={formData.provinceId}
                      onChange={(e) => setFormData({ ...formData, provinceId: e.target.value, districtId: '', wardId: '' })}
                    >
                       <option value="">Chọn Tỉnh/Thành</option>
                       {provinces.map(p => <option key={p.id} value={p.id}>{p.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase">Quận/Huyện</label>
                    <select 
                      disabled={!formData.provinceId}
                      className="input-base w-full"
                      value={formData.districtId}
                      onChange={(e) => setFormData({ ...formData, districtId: e.target.value, wardId: '' })}
                    >
                       <option value="">Chọn Quận/Huyện</option>
                       {districts.map(d => <option key={d.id} value={d.id}>{d.name}</option>)}
                    </select>
                 </div>
                 <div className="space-y-1.5">
                    <label className="text-[10px] font-black text-muted uppercase">Phường/Xã</label>
                    <select 
                      disabled={!formData.districtId}
                      className="input-base w-full"
                      value={formData.wardId}
                      onChange={(e) => setFormData({ ...formData, wardId: e.target.value })}
                    >
                       <option value="">Chọn Phường/Xã</option>
                       {wards.map(w => <option key={w.id} value={w.id}>{w.name}</option>)}
                    </select>
                 </div>
              </div>
              <div className="space-y-1.5">
                 <label className="text-[10px] font-black text-muted uppercase">Địa chỉ chi tiết</label>
                 <input 
                   type="text" 
                   className="input-base w-full"
                   placeholder="VD: Số 1 Phạm Hùng..."
                   value={formData.address}
                   onChange={(e) => setFormData({ ...formData, address: e.target.value })}
                 />
              </div>
           </div>

           {/* Section 3: Quản lý & Tiện ích */}
           <div className="space-y-6">
              <div className="flex items-center gap-3 text-primary">
                 <ShieldCheck size={18} />
                 <h3 className="text-body font-black uppercase tracking-widest">Tiện ích & Quản lý</h3>
              </div>
              <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                 {amenityList.map((a) => (
                    <label key={a} className={cn(
                       "flex items-center gap-3 p-4 rounded-2xl border-2 cursor-pointer transition-all",
                       formData.amenities.includes(a) ? "border-primary bg-primary/5 text-primary" : "border-bg bg-bg/20 text-muted grayscale"
                    )}>
                       <input 
                         type="checkbox" className="hidden"
                         checked={formData.amenities.includes(a)}
                         onChange={(e) => {
                           const list = [...formData.amenities];
                           if (e.target.checked) list.push(a);
                           else list.splice(list.indexOf(a), 1);
                           setFormData({ ...formData, amenities: list });
                         }}
                       />
                       <span className="text-[11px] font-black uppercase tracking-tighter">{a}</span>
                    </label>
                 ))}
              </div>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6 pt-4">
                 <div className="space-y-1.5 font-mono">
                    <label className="text-[10px] font-black text-muted uppercase">Số điện thoại BQL</label>
                    <input 
                      type="tel" 
                      className="input-base w-full"
                      value={formData.managementPhone}
                      onChange={(e) => setFormData({ ...formData, managementPhone: e.target.value })}
                    />
                 </div>
                 <div className="space-y-1.5 font-mono">
                    <label className="text-[10px] font-black text-muted uppercase">Email BQL</label>
                    <input 
                      type="email" 
                      className="input-base w-full"
                      value={formData.managementEmail}
                      onChange={(e) => setFormData({ ...formData, managementEmail: e.target.value })}
                    />
                 </div>
              </div>
           </div>
        </form>

        <div className="p-8 border-t bg-bg/20 flex justify-end gap-3">
           <button onClick={onClose} className="px-8 py-3 bg-white border border-border/50 text-muted font-black uppercase tracking-widest rounded-2xl">Huỷ</button>
           <button 
             onClick={handleSubmit}
             disabled={createMutation.isPending || updateMutation.isPending || !!codeError}
             className="px-10 py-3 bg-primary text-white font-black uppercase tracking-[3px] rounded-2xl shadow-xl shadow-primary/20 hover:scale-105 active:scale-95 transition-all disabled:opacity-50"
           >
              {isEditing ? 'Lưu thay đổi' : 'Tạo toà nhà'}
           </button>
        </div>
      </div>
    </div>
  );
};
