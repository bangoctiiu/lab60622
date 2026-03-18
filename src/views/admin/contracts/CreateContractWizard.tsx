import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Building2, Home, Users, FileText, 
  ChevronRight, ChevronLeft, Check, AlertCircle,
  Zap, ShieldCheck, Wallet, Calendar, Plus
} from 'lucide-react';
import { cn, formatVND } from '@/utils';
import { toast } from 'sonner';

const steps = [
  { id: 1, title: 'Phòng & Cư dân', icon: Home },
  { id: 2, title: 'Thông tin chính', icon: FileText },
  { id: 3, title: 'Dịch vụ & Ký kết', icon: Zap },
  { id: 4, title: 'Xác nhận', icon: ShieldCheck },
];

const CreateContractWizard = () => {
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState({
    // Step 1
    buildingId: '',
    roomId: '',
    tenants: [],
    representativeId: '',
    // Step 2
    type: 'Residential',
    startDate: '',
    endDate: '',
    rentPrice: 0,
    baseRentPrice: 12000000, // Mock base price for warning
    depositAmount: 0,
    paymentCycle: 1,
    paymentDueDay: 5,
    autoRenew: false,
    // Step 3
    selectedServices: [],
    ownerRep: { fullName: '', cccd: '', role: 'Manager' }
  });

  const nextStep = () => setCurrentStep(prev => Math.min(prev + 1, 4));
  const prevStep = () => setCurrentStep(prev => Math.max(prev - 1, 1));

  const handleFinish = (status: 'Active' | 'Draft') => {
    toast.success(`Hợp đồng đã được lưu ở trạng thái ${status}`);
    navigate('/admin/contracts');
  };

  return (
    <div className="max-w-[1000px] mx-auto space-y-8 animate-in fade-in duration-500">
      {/* 2.3 Wizard Head */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
        <div>
          <h1 className="text-display text-primary">Tạo hợp đồng mới</h1>
          <p className="text-body text-muted">Hoàn thành 4 bước để khởi tạo hợp đồng thuê.</p>
        </div>
        
        {/* Step Indicator */}
        <div className="flex items-center gap-2">
          {steps.map((s, i) => (
            <React.Fragment key={s.id}>
              <div className={cn(
                "flex items-center gap-2 px-4 py-2 rounded-full transition-all",
                currentStep === s.id ? "bg-primary text-white shadow-lg" : 
                currentStep > s.id ? "bg-success/10 text-success" : "bg-bg text-muted"
              )}>
                <div className={cn(
                  "w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-bold border",
                  currentStep === s.id ? "bg-white text-primary border-white" : 
                  currentStep > s.id ? "bg-success text-white border-success" : "bg-muted/10 border-muted/20"
                )}>
                  {currentStep > s.id ? <Check size={14} /> : s.id}
                </div>
                <span className="text-small font-bold hidden sm:inline">{s.title}</span>
              </div>
              {i < steps.length - 1 && <div className="w-8 h-px bg-border hidden md:block" />}
            </React.Fragment>
          ))}
        </div>
      </div>

      <div className="card-container min-h-[500px] flex flex-col p-8 bg-white shadow-xl shadow-primary/5">
        <div className="flex-1">
          {currentStep === 1 && <Step1 formData={formData} setFormData={setFormData} />}
          {currentStep === 2 && <Step2 formData={formData} setFormData={setFormData} />}
          {currentStep === 3 && <Step3 formData={formData} setFormData={setFormData} />}
          {currentStep === 4 && <Step4 formData={formData} />}
        </div>

        <div className="mt-12 pt-8 border-t flex justify-between items-center">
          <button 
            onClick={prevStep} 
            disabled={currentStep === 1}
            className="btn-outline flex items-center gap-2 disabled:opacity-30"
          >
            <ChevronLeft size={18} /> Quay lại
          </button>
          
          <div className="flex gap-3">
             {currentStep < 4 ? (
               <button onClick={nextStep} className="btn-primary flex items-center gap-2">
                 Tiếp theo <ChevronRight size={18} />
               </button>
             ) : (
               <>
                 <button onClick={() => handleFinish('Draft')} className="btn-outline">Lưu nháp</button>
                 <button onClick={() => handleFinish('Active')} className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
                    <Check size={18} /> Kích hoạt ngay
                 </button>
               </>
             )}
          </div>
        </div>
      </div>
    </div>
  );
};

const Step1 = ({ formData, setFormData }: any) => (
  <div className="space-y-8 animate-in slide-in-from-right-4">
    <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
      <div className="space-y-4">
        <h3 className="text-h3 text-primary flex items-center gap-2"><Building2 size={20} /> Chọn địa điểm</h3>
        <div className="space-y-1.5">
          <label className="text-small font-bold text-muted">Tòa nhà</label>
          <select className="input-base w-full" value={formData.buildingId} onChange={(e) => setFormData({...formData, buildingId: e.target.value})}>
            <option value="">Chọn tòa nhà...</option>
            <option value="1">Keangnam Landmark</option>
          </select>
        </div>
        <div className="space-y-1.5">
          <label className="text-small font-bold text-muted">Phòng</label>
          <select className="input-base w-full" value={formData.roomId} onChange={(e) => setFormData({...formData, roomId: e.target.value})}>
            <option value="">Chọn phòng trống...</option>
            <option value="R101">Phòng A-101 (Trống)</option>
            <option value="R102">Phòng B-205 (Trống)</option>
          </select>
        </div>
      </div>

      <div className="bg-bg/40 p-6 rounded-2xl border border-dashed border-border flex flex-col items-center justify-center text-center">
        <Home size={40} className="text-muted/30 mb-2" />
        <p className="text-small text-muted italic">Chọn phòng để xem trước thông tin cơ bản.</p>
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-h3 text-primary flex items-center gap-2"><Users size={20} /> Danh sách cư dân</h3>
      <div className="border rounded-xl p-4 bg-bg/20 space-y-4">
        <div className="flex flex-col gap-2">
           {[
             { id: 'T1', name: 'Nguyễn Văn A', phone: '0901234567' },
             { id: 'T2', name: 'Trần Thị B', phone: '0907654321' }
           ].map(tenant => (
             <label key={tenant.id} className="flex items-center justify-between p-4 bg-white rounded-xl border border-border/50 hover:border-primary transition-all cursor-pointer">
               <div className="flex items-center gap-3">
                 <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center text-primary font-bold">{tenant.name.charAt(0)}</div>
                 <div>
                   <p className="font-bold text-primary">{tenant.name}</p>
                   <p className="text-[10px] text-muted">{tenant.phone}</p>
                 </div>
               </div>
               <div className="flex items-center gap-2">
                 <span className="text-[10px] font-bold text-muted uppercase">Người đại diện</span>
                 <input 
                   type="radio" 
                   name="representative" 
                   className="w-5 h-5 text-primary focus:ring-primary" 
                   checked={formData.representativeId === tenant.id}
                   onChange={() => setFormData({...formData, representativeId: tenant.id})}
                 />
               </div>
             </label>
           ))}
        </div>
        <button className="btn-outline border-dashed w-full py-4 text-primary flex items-center justify-center gap-2">
          <Plus size={18} /> Thêm cư dân mới
        </button>
      </div>
    </div>
  </div>
);

const Step2 = ({ formData, setFormData }: any) => {
  const deviation = Math.abs(formData.rentPrice - formData.baseRentPrice) / formData.baseRentPrice * 100;
  const isHighDeviation = deviation > 20 && formData.rentPrice > 0;

  return (
    <div className="space-y-8 animate-in slide-in-from-right-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="space-y-4">
          <div className="space-y-1.5">
            <label className="text-small font-bold text-muted">Tiền thuê hàng tháng</label>
            <div className="relative">
              <input 
                type="number" 
                className={cn("input-base w-full pl-5 pr-12 text-lg font-bold font-display", isHighDeviation && "border-warning bg-warning/5")}
                value={formData.rentPrice}
                onChange={(e) => setFormData({...formData, rentPrice: Number(e.target.value)})}
              />
              <span className="absolute right-4 top-1/2 -translate-y-1/2 text-small font-bold text-muted">VND</span>
            </div>
            {isHighDeviation && (
              <div className="flex items-center gap-2 text-warning text-[11px] font-bold">
                <AlertCircle size={14} /> Giá thuê lệch {Math.round(deviation)}% so với giá sàn. Cần xác nhận lại.
              </div>
            )}
          </div>

          <div className="grid grid-cols-2 gap-4">
             <div className="space-y-1.5">
               <label className="text-small font-bold text-muted">Ngày bắt đầu</label>
               <input type="date" className="input-base w-full" value={formData.startDate} onChange={(e) => setFormData({...formData, startDate: e.target.value})} />
             </div>
             <div className="space-y-1.5">
               <label className="text-small font-bold text-muted">Ngày kết thúc</label>
               <input type="date" className="input-base w-full" value={formData.endDate} onChange={(e) => setFormData({...formData, endDate: e.target.value})} />
             </div>
          </div>
        </div>

        <div className="space-y-4 p-6 bg-primary/5 rounded-2xl border border-primary/10 self-start">
          <h4 className="text-small font-bold text-primary uppercase">Mã hợp đồng dự kiến</h4>
          <p className="text-h2 font-mono text-primary">HD-VH01-2025-XXXX</p>
          <p className="text-small text-muted italic">Mã sẽ được tạo tự động sau khi lưu.</p>
        </div>
      </div>
    </div>
  );
};

const Step3 = ({ formData, setFormData }: any) => (
  <div className="space-y-8 animate-in slide-in-from-right-4">
    <div className="space-y-4">
      <h3 className="text-h3 text-primary flex items-center gap-2"><Zap size={20} /> Dịch vụ đăng ký</h3>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
         {['Điện', 'Nước', 'Internet', 'Vệ sinh', 'An ninh'].map(s => (
           <label key={s} className="flex items-center gap-3 p-4 border rounded-xl hover:bg-bg cursor-pointer transition-all">
             <input type="checkbox" className="w-5 h-5 rounded text-primary" />
             <span className="font-bold text-primary">{s}</span>
           </label>
         ))}
      </div>
    </div>

    <div className="space-y-4">
      <h3 className="text-h3 text-primary flex items-center gap-2"><ShieldCheck size={20} /> Đại diện bên cho thuê</h3>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-1.5">
            <label className="text-small font-bold text-muted">Người ký</label>
            <input type="text" className="input-base w-full" value={formData.ownerRep.fullName} onChange={(e) => setFormData({...formData, ownerRep: {...formData.ownerRep, fullName: e.target.value}})} />
          </div>
          <div className="space-y-1.5">
            <label className="text-small font-bold text-muted">Chức vụ</label>
            <input type="text" className="input-base w-full" value={formData.ownerRep.role} readOnly />
          </div>
      </div>
    </div>
  </div>
);

const Step4 = ({ formData }: any) => (
  <div className="space-y-8 animate-in zoom-in-95 duration-500">
    <div className="text-center space-y-2">
      <div className="w-16 h-16 bg-success/10 text-success rounded-full flex items-center justify-center mx-auto mb-4">
        <Check size={32} />
      </div>
      <h3 className="text-display text-primary">Kiểm tra thông tin</h3>
      <p className="text-body text-muted">Vui lòng rà soát kỹ các thông tin trước khi xác nhận kích hoạt.</p>
    </div>

    <div className="grid grid-cols-1 md:grid-cols-2 gap-12 bg-bg/20 p-8 rounded-3xl border border-dashed border-border/50">
       <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary"><Home size={24} /></div>
             <div>
               <p className="text-[10px] font-bold text-muted uppercase">Phòng thuê</p>
               <p className="text-body font-bold text-primary">{formData.roomId || 'Chưa chọn'}</p>
             </div>
          </div>
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-success"><Wallet size={24} /></div>
             <div>
               <p className="text-[10px] font-bold text-muted uppercase">Tiền thuê</p>
               <p className="text-body font-bold text-primary">{formatVND(formData.rentPrice)}</p>
             </div>
          </div>
       </div>

       <div className="space-y-6">
          <div className="flex items-center gap-4">
             <div className="w-12 h-12 bg-white rounded-xl shadow-sm flex items-center justify-center text-accent"><Calendar size={24} /></div>
             <div>
               <p className="text-[10px] font-bold text-muted uppercase">Thời hạn</p>
               <p className="text-body font-bold text-primary">{formData.startDate || '??'} đến {formData.endDate || '??'}</p>
             </div>
          </div>
          <div className="p-4 bg-white rounded-2xl shadow-sm border border-border/10">
             <p className="text-small font-bold text-primary">TỔNG DỰ KIẾN (TẠM TÍNH)</p>
             <p className="text-h2 text-success font-display font-bold">{formatVND(formData.rentPrice)}</p>
             <p className="text-[10px] text-muted">Chưa bao gồm các dịch vụ đo chỉ số.</p>
          </div>
       </div>
    </div>
  </div>
);

export default CreateContractWizard;
