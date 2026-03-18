import React, { useState, useEffect } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { 
  User, FileText, PhoneCall, ShieldCheck, 
  ChevronRight, Camera, Upload, CheckCircle2,
  Clock, X, Loader2
} from 'lucide-react';
import Confetti from 'react-confetti';
import { toast } from 'sonner';

import useAuthStore from '@/stores/authStore';
import api from '@/services/apiClient';
import { cn } from '@/utils';
import { Modal, FileUpload } from '@/components/shared';

// Form Schemas
const personalInfoSchema = z.object({
  fullName: z.string().min(1, 'Họ tên là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  email: z.string().email('Email không hợp lệ'),
  birthDate: z.string().min(1, 'Ngày sinh là bắt buộc'),
  idCard: z.string().min(9, 'Số CCCD không hợp lệ'),
  address: z.string().min(1, 'Địa chỉ là bắt buộc'),
});

const emergencyContactSchema = z.object({
  name: z.string().min(1, 'Họ tên là bắt buộc'),
  phone: z.string().min(10, 'Số điện thoại không hợp lệ'),
  relationship: z.string().min(1, 'Mối quan hệ là bắt buộc'),
});

type PersonalInfoValues = z.infer<typeof personalInfoSchema>;
type EmergencyContactValues = z.infer<typeof emergencyContactSchema>;

interface OnboardingStep {
  id: number;
  title: string;
  status: 'pending' | 'completed' | 'processing';
  actionLabel: string;
  type: 'personal' | 'documents' | 'emergency' | 'handover' | 'deposit' | 'contract';
  value?: any;
}

interface OnboardingData {
  completionPercent: number;
  steps: OnboardingStep[];
}

const Onboarding = () => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const { user } = useAuthStore();
  
  const [activeModal, setActiveModal] = useState<'personal' | 'documents' | 'emergency' | null>(null);
  const [celebrating, setCelebrating] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);

  // 1. Fetch data
  const { data, isLoading } = useQuery<OnboardingData>({
    queryKey: ['portal-onboarding'],
    queryFn: async () => {
      const res = await api.get('/api/portal/onboarding');
      return res.data;
    },
    // Mocking initial data to be proactive if API is not yet ready fully
    placeholderData: {
      completionPercent: 0,
      steps: [
        { id: 1, title: 'Xác nhận thông tin cá nhân', status: 'pending', actionLabel: 'Xác nhận ngay', type: 'personal' },
        { id: 2, title: 'Upload giấy tờ (CCCD/Hộ chiếu)', status: 'pending', actionLabel: 'Upload ngay', type: 'documents' },
        { id: 3, title: 'Thêm liên hệ khẩn cấp', status: 'pending', actionLabel: 'Thêm ngay', type: 'emergency' },
        { id: 4, title: 'Ký biên bản bàn giao (Read-only)', status: 'processing', actionLabel: 'Chờ quản lý bàn giao', type: 'handover' },
        { id: 5, title: 'Xác nhận đã nộp cọc (Read-only)', status: 'processing', actionLabel: 'Chờ Admin xác nhận', type: 'deposit' },
        { id: 6, title: 'Ký hợp đồng (Read-only)', status: 'pending', actionLabel: 'Chưa ký', type: 'contract' },
      ]
    }
  });

  const completionPercent = data?.completionPercent || 0;

  // 2. Mutations
  const personalMutation = useMutation({
    mutationFn: (values: PersonalInfoValues) => api.patch('/api/portal/onboarding/personal-info', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-onboarding'] });
      setActiveModal(null);
      toast.success('Đã cập nhật thông tin cá nhân');
    }
  });

  const emergencyMutation = useMutation({
    mutationFn: (values: EmergencyContactValues) => api.post('/api/portal/onboarding/emergency-contact', values),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['portal-onboarding'] });
      setActiveModal(null);
      toast.success('Đã thêm liên hệ khẩn cấp');
    }
  });

  // 3. Effects for completion
  useEffect(() => {
    if (completionPercent === 100 && !celebrating) {
      setCelebrating(true);
      setShowConfetti(true);
      setTimeout(() => {
        setShowConfetti(false);
      }, 5000);
    }
  }, [completionPercent, celebrating]);

  // Forms
  const personalForm = useForm<PersonalInfoValues>({
    resolver: zodResolver(personalInfoSchema)
  });

  const emergencyForm = useForm<EmergencyContactValues>({
    resolver: zodResolver(emergencyContactSchema)
  });

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-white p-6 max-w-[430px] mx-auto">
        <div className="flex flex-col items-center gap-4">
          <Loader2 className="w-12 h-12 text-[#0D8A8A] animate-spin" />
          <p className="text-[#0D8A8A] font-bold">Đang tải hồ sơ...</p>
        </div>
      </div>
    );
  }

  const handleDocumentSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['portal-onboarding'] });
    setActiveModal(null);
    toast.success('Đã tải lên tài liệu');
  };

  return (
    <div className="min-h-screen bg-[#F8FAFC] pb-24 max-w-[430px] mx-auto antialiased">
      {showConfetti && <Confetti recycle={false} numberOfPieces={300} />}
      
      {/* Header Section */}
      <div className="bg-white p-6 sticky top-0 z-10 border-b border-slate-100 shadow-sm">
        <h2 className="text-2xl font-bold text-slate-900 mb-4 line-clamp-1">
          Chào mừng, {user?.fullName || 'Cư dân'}!
        </h2>
        
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm font-bold">
            <span className="text-[#0D8A8A]">{completionPercent}% hoàn thành</span>
            <span className="text-slate-400">100%</span>
          </div>
          <div className="w-full h-3 bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0D8A8A] transition-all duration-700 ease-out shadow-[0_0_12px_rgba(13,138,138,0.3)]"
              style={{ width: `${completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      {/* Steps List */}
      <div className="p-6 space-y-4">
        {data?.steps.map((step) => (
          <OnboardingCard 
            key={step.id} 
            step={step} 
            onAction={() => {
              if (step.type === 'personal') setActiveModal('personal');
              if (step.type === 'documents') setActiveModal('documents');
              if (step.type === 'emergency') setActiveModal('emergency');
            }}
          />
        ))}
      </div>

      {/* Final Success Message */}
      {completionPercent === 100 && (
        <div className="px-6 pb-6 animate-in fade-in zoom-in duration-700">
          <div className="bg-white p-8 rounded-2xl border-2 border-[#0D8A8A]/20 flex flex-col items-center text-center space-y-4 shadow-xl">
            <div className="w-20 h-20 bg-[#0D8A8A]/10 rounded-full flex items-center justify-center text-[#0D8A8A]">
              <CheckCircle2 size={48} />
            </div>
            <div>
              <h3 className="text-xl font-bold text-slate-900">Hoàn thành hồ sơ!</h3>
              <p className="text-slate-500 mt-2">Chúc mừng! Chào mừng đến với SmartStay!</p>
            </div>
            <button 
              onClick={() => navigate('/portal')}
              className="w-full h-14 bg-[#0D8A8A] text-white rounded-xl font-bold text-lg shadow-lg hover:shadow-[#0D8A8A]/40 transition-all active:scale-95"
            >
              Vào trang chủ
            </button>
          </div>
        </div>
      )}

      {/* --- MODALS --- */}

      {/* 1. Personal Info Modal */}
      <Modal 
        isOpen={activeModal === 'personal'} 
        onClose={() => setActiveModal(null)}
        title="Thông tin cá nhân"
      >
        <form onSubmit={personalForm.handleSubmit((v) => personalMutation.mutate(v))} className="space-y-4 p-4">
          <FormInput label="Họ tên" {...personalForm.register('fullName')} error={personalForm.formState.errors.fullName?.message} />
          <FormInput label="Số điện thoại" {...personalForm.register('phone')} error={personalForm.formState.errors.phone?.message} />
          <FormInput label="Email" type="email" {...personalForm.register('email')} error={personalForm.formState.errors.email?.message} />
          <FormInput label="Ngày sinh" type="date" {...personalForm.register('birthDate')} error={personalForm.formState.errors.birthDate?.message} />
          <FormInput label="Số CCCD" {...personalForm.register('idCard')} error={personalForm.formState.errors.idCard?.message} />
          <FormInput label="Địa chỉ" {...personalForm.register('address')} error={personalForm.formState.errors.address?.message} />
          <button 
            type="submit" 
            disabled={personalMutation.isPending}
            className="w-full h-14 bg-[#0D8A8A] text-white rounded-xl font-bold mt-4 flex items-center justify-center"
          >
            {personalMutation.isPending ? <Loader2 className="animate-spin" /> : 'Lưu thông tin'}
          </button>
        </form>
      </Modal>

      {/* 2. Documents Modal */}
      <Modal 
        isOpen={activeModal === 'documents'} 
        onClose={() => setActiveModal(null)}
        title="Tải hồ sơ"
      >
        <div className="p-4 space-y-6">
          <div className="text-center space-y-2">
            <Camera className="w-16 h-16 mx-auto text-slate-300" />
            <p className="text-slate-500 text-sm">Chụp hoặc tải ảnh CCCD (mặt trước/mặt sau)</p>
          </div>
          <FileUpload 
            uploadUrl="/api/portal/onboarding/documents"
            accept="image/*,application/pdf"
            maxSizeMB={5}
            onUpload={handleDocumentSuccess}
          />
        </div>
      </Modal>

      {/* 3. Emergency Contact Modal */}
      <Modal 
        isOpen={activeModal === 'emergency'} 
        onClose={() => setActiveModal(null)}
        title="Liên hệ khẩn cấp"
      >
        <form onSubmit={emergencyForm.handleSubmit((v) => emergencyMutation.mutate(v))} className="space-y-4 p-4">
          <FormInput label="Họ tên người liên hệ" {...emergencyForm.register('name')} error={emergencyForm.formState.errors.name?.message} />
          <FormInput label="Số điện thoại" {...emergencyForm.register('phone')} error={emergencyForm.formState.errors.phone?.message} />
          <FormInput label="Mối quan hệ" placeholder="Bố/Mẹ/Vợ/Chồng..." {...emergencyForm.register('relationship')} error={emergencyForm.formState.errors.relationship?.message} />
          <button 
            type="submit" 
            disabled={emergencyMutation.isPending}
            className="w-full h-14 bg-[#0D8A8A] text-white rounded-xl font-bold mt-4 flex items-center justify-center"
          >
            {emergencyMutation.isPending ? <Loader2 className="animate-spin" /> : 'Thêm liên hệ'}
          </button>
        </form>
      </Modal>
    </div>
  );
};

// Sub-components
const OnboardingCard = ({ step, onAction }: { step: OnboardingStep, onAction: () => void }) => {
  const isReadOnly = ['handover', 'deposit'].includes(step.type);
  const isCompleted = step.status === 'completed';
  const isProcessing = step.status === 'processing';

  const icons: Record<string, any> = {
    personal: User,
    documents: Camera,
    emergency: PhoneCall,
    handover: FileText,
    deposit: ShieldCheck,
    contract: FileText
  };

  const Icon = icons[step.type] || ShieldCheck;

  return (
    <div className={cn(
      "bg-white p-5 rounded-2xl border transition-all flex items-center gap-4 group",
      isCompleted ? "border-green-100 bg-green-50/30" : "border-slate-100 shadow-sm",
      !isCompleted && !isReadOnly && "hover:border-[#0D8A8A]/30 active:scale-[0.98]"
    )}>
      <div className={cn(
        "w-14 h-14 rounded-xl flex items-center justify-center shrink-0 transition-colors duration-300",
        isCompleted ? "bg-green-100 text-green-600 scale-105" : 
        isReadOnly ? "bg-slate-100 text-slate-400" : "bg-[#0D8A8A]/10 text-[#0D8A8A]"
      )}>
        <Icon size={28} />
      </div>

      <div className="flex-1 min-w-0">
        <h4 className={cn("font-bold truncate", isCompleted ? "text-green-800" : "text-slate-800")}>
          {step.title}
        </h4>
        <p className={cn("text-xs font-semibold mt-1", 
          isCompleted ? "text-green-600" : 
          isProcessing ? "text-blue-500" : "text-slate-400"
        )}>
          {isCompleted ? 'Hoàn thành' : isProcessing ? 'Đang xử lý' : 'Chưa cập nhật'}
        </p>
      </div>

      {isCompleted ? (
        <div className="w-8 h-8 rounded-full bg-green-100 text-green-600 flex items-center justify-center animate-in zoom-in">
          <CheckCircle2 size={18} />
        </div>
      ) : isReadOnly || step.type === 'contract' ? (
        <span className={cn(
          "text-[10px] uppercase font-bold tracking-tighter w-20 text-right leading-tight",
          !isCompleted && step.type === 'contract' ? "text-red-400" : "text-slate-300"
        )}>
          {step.type === 'contract' && !isCompleted ? 'Chưa ký' : step.actionLabel}
        </span>
      ) : (
        <button 
          onClick={onAction}
          className="w-11 h-11 rounded-full bg-[#0D8A8A]/5 text-[#0D8A8A] flex items-center justify-center group-hover:bg-[#0D8A8A] group-hover:text-white transition-all shadow-sm"
        >
          <PlusCircle size={24} />
        </button>
      )}
    </div>
  );
};

// Fix for missing PlusCircle
import { PlusCircle } from 'lucide-react';

const FormInput = React.forwardRef<HTMLInputElement, any>(({ label, error, ...props }, ref) => (
  <div className="space-y-1.5">
    <label className="text-sm font-bold text-slate-700">{label}</label>
    <input 
      ref={ref}
      className={cn(
        "w-full h-12 px-4 rounded-xl border-2 outline-none transition-all text-base",
        error ? "border-red-200 bg-red-50 focus:border-red-500" : "border-slate-100 bg-slate-50 focus:border-[#0D8A8A] focus:bg-white"
      )}
      {...props}
    />
    {error && <p className="text-[11px] text-red-500 font-bold ml-1">{error}</p>}
  </div>
));

export default Onboarding;
