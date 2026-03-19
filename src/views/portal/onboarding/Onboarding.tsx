import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  UserCheck, 
  FileText, 
  PhoneCall, 
  Key, 
  Briefcase, 
  FileCheck, 
  ArrowRight,
  CheckCircle2,
  Clock,
  Sparkles,
  ChevronRight,
  ShieldCheck
} from 'lucide-react';
import { cn } from '@/utils';
import { tenantDashboardService, OnboardingStatus } from '@/services/tenantDashboardService';
import { toast } from 'sonner';
import Confetti from 'react-confetti';
import useAuthStore from '@/stores/authStore';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const [data, setData] = useState<OnboardingStatus | null>(null);
  const [loading, setLoading] = useState(true);
  const [isFinished, setIsFinished] = useState(false);
  const { user } = useAuthStore();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await tenantDashboardService.getSummary();
        setData(res.onboarding);
      } catch (error) {
        toast.error('Không thể tải thông tin onboarding');
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading || !data) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-slate-50">
        <div className="w-8 h-8 border-4 border-slate-200 border-t-[#0D8A8A] rounded-full animate-spin" />
      </div>
    );
  }

  const steps = [
    {
      id: 'personal',
      title: 'Xác nhận thông tin cá nhân',
      description: 'Đảm bảo thông tin cá nhân đảm bảo chính xác',
      icon: UserCheck,
      isDone: data.steps.isPersonalInfoConfirmed,
      type: 'manual',
      button: 'Xác nhận ngay'
    },
    {
      id: 'cccd',
      title: 'Upload giấy tờ (CCCD/Hộ chiếu)',
      description: 'Lưu trữ tài liệu pháp lý định danh',
      icon: FileText,
      isDone: data.steps.isCCCDUploaded,
      type: 'manual',
      button: 'Upload ngay'
    },
    {
      id: 'emergency',
      title: 'Thêm liên hệ khẩn cấp',
      description: 'Phòng ngừa trường hợp cần thiết',
      icon: PhoneCall,
      isDone: data.steps.isEmergencyContactAdded,
      type: 'manual',
      button: 'Thêm ngay'
    },
    {
      id: 'handover',
      title: 'Ký biên bản bàn giao phòng',
      description: 'Xác nhận hiện trạng thiết bị phòng',
      icon: Key,
      isDone: data.steps.isRoomHandovered,
      type: 'auto',
      waitText: 'Chờ quản lý bàn giao'
    },
    {
      id: 'deposit',
      title: 'Xác nhận đã nộp tiền cọc',
      description: 'Đã thanh toán đủ khoản cọc HD',
      icon: Briefcase,
      isDone: data.steps.isDepositPaid,
      type: 'auto',
      waitText: 'Chờ Admin xác nhận'
    },
    {
      id: 'contract',
      title: 'Ký hợp đồng thuê phòng',
      description: 'Bản ký tay/online hợp đồng điện tử',
      icon: FileCheck,
      isDone: data.steps.isContractSigned,
      type: 'auto',
      waitText: 'Chưa đủ điều kiện ký'
    }
  ];

  const handleComplete = () => {
     setIsFinished(true);
     // The user can manually click or auto-navigate after confetti
  };

  if (isFinished) {
    return (
      <div className="min-h-screen bg-slate-50 flex flex-col items-center justify-center p-8 text-center relative overflow-hidden">
        <Confetti
          width={window.innerWidth}
          height={window.innerHeight}
          recycle={false}
          numberOfPieces={300}
        />
        <div className="w-24 h-24 bg-teal-100 rounded-full flex items-center justify-center text-[#0D8A8A] mb-8 animate-bounce relative z-10 shadow-lg shadow-teal-500/20">
          <Sparkles size={48} />
        </div>
        <h1 className="text-3xl font-bold text-slate-800 mb-4">Chúc mừng!</h1>
        <p className="text-slate-600 px-4 leading-relaxed text-[16px] mb-12 max-w-[300px]">
          Bạn đã hoàn thành tất cả các bước thiết lập tài khoản. Chào mừng đến với SmartStay!
        </p>
        <button 
          onClick={() => navigate('/portal/dashboard')}
          className="w-full max-w-[300px] h-[48px] bg-[#0D8A8A] text-white rounded-xl font-bold text-[16px] flex items-center justify-center hover:bg-[#0A6B6B] active:scale-[0.98] transition-all"
        >
          Vào trang chủ <ArrowRight size={20} className="ml-2" />
        </button>
      </div>
    );
  }

  // Auto show complete screen if 100% and just entered
  if (data.completionPercent === 100 && !isFinished) {
      setTimeout(() => setIsFinished(true), 500);
  }

  return (
    <div className="min-h-screen bg-slate-50 pb-24">
      {/* Header Sticky */}
      <div className="sticky top-0 bg-white/80 backdrop-blur-xl z-20 border-b border-slate-200 px-4 pt-10 pb-6 shadow-[0_4px_20px_-10px_rgba(0,0,0,0.05)]">
        <div className="flex flex-col gap-4">
          <div className="flex items-center justify-between">
            <div className="space-y-1">
              <h1 className="text-xl font-bold text-slate-800">Chào mừng, {(user as any)?.name || (user as any)?.fullName || 'Cư dân'}!</h1>
              <p className="text-sm text-slate-500 flex items-center gap-1.5">
                <ShieldCheck size={16} className="text-[#0D8A8A]" /> 
                Hoàn thiện tài khoản
              </p>
            </div>
            <div className="w-12 h-12 rounded-xl bg-teal-50 border border-teal-100 flex items-center justify-center text-[#0D8A8A] font-bold text-sm shadow-inner shadow-teal-500/10">
              {data.completionPercent}%
            </div>
          </div>
          
          {/* Progress Bar */}
          <div className="h-2 w-full bg-slate-100 rounded-full overflow-hidden">
            <div 
              className="h-full bg-[#0D8A8A] transition-all duration-1000"
              style={{ width: `${data.completionPercent}%` }}
            />
          </div>
        </div>
      </div>

      <div className="px-4 pt-6 space-y-4">
        {steps.map((step, i) => (
          <div 
            key={i}
            className={cn(
              "p-4 bg-white rounded-2xl border transition-all duration-300 flex items-center gap-4 relative overflow-hidden group",
              step.isDone ? "border-teal-200 shadow-md shadow-teal-500/5 ring-1 ring-teal-50" : "border-slate-200 shadow-sm"
            )}
          >
            {/* Background Decor */}
            <div className={cn(
              "absolute -top-6 -right-6 w-20 h-20 rounded-full blur-2xl transition-opacity",
              step.isDone ? "bg-teal-50 opacity-100" : "bg-slate-50 opacity-0 group-hover:opacity-100"
            )} />

            {/* Icon */}
            <div className={cn(
              "w-12 h-12 rounded-xl flex items-center justify-center shrink-0 transition-transform duration-300 group-hover:scale-110",
              step.isDone ? "bg-teal-100 text-[#0D8A8A]" : "bg-slate-50 text-slate-400"
            )}>
              <step.icon size={24} />
            </div>

            {/* Content */}
            <div className="flex-1 min-w-0 relative z-10">
              <h3 className={cn("text-[15px] font-bold truncate", step.isDone ? "text-slate-800" : "text-slate-700")}>
                {step.title}
              </h3>
              <p className="text-[13px] text-slate-500 truncate mt-0.5">
                {step.description}
              </p>
            </div>

            {/* Status / Action */}
            <div className="relative z-10 flex-shrink-0">
               {step.isDone ? (
                 <div className="w-8 h-8 bg-emerald-500 rounded-full flex items-center justify-center text-white shadow-lg shadow-emerald-500/20">
                   <CheckCircle2 size={18} strokeWidth={3} />
                 </div>
               ) : step.type === 'manual' ? (
                 <button className="px-3 py-2 bg-[#0D8A8A] text-white text-[12px] font-semibold rounded-lg hover:bg-[#0A6B6B] active:scale-[0.98] transition-all whitespace-nowrap">
                   {step.button}
                 </button>
               ) : (
                 <div className="flex items-center gap-1.5 px-2.5 py-1.5 bg-slate-50 rounded-lg border border-slate-200">
                   <Clock size={14} className="text-slate-400" />
                   <span className="text-[11px] font-semibold text-slate-500">{step.waitText}</span>
                 </div>
               )}
            </div>
          </div>
        ))}
      </div>

    </div>
  );
};

export default Onboarding;
