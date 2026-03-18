import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Building2, 
  UserPlus, 
  ShieldCheck, 
  MapPin, 
  CheckCircle2, 
  ChevronRight,
  ArrowRight,
  Plus,
  ArrowLeft
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';

const Onboarding: React.FC = () => {
  const navigate = useNavigate();
  const { user } = useAuthStore();
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState({
    buildingId: '',
    roomNumber: '',
    phone: '',
    idNumber: ''
  });

  const nextStep = () => setStep(s => s + 1);
  const prevStep = () => setStep(s => s - 1);

  const steps = [
    { title: 'Chào mừng', icon: Building2, description: 'Chào mừng bạn đến với SmartStay. Hãy bắt đầu bằng việc liên kết với căn hộ của bạn.' },
    { title: 'Thông tin căn hộ', icon: MapPin, description: 'Nhập mã tòa nhà và số phòng để chúng tôi xác thực cư dân.' },
    { title: 'Xác minh danh tính', icon: UserPlus, description: 'Cung cấp số điện thoại và CCCD để bảo mật tài khoản.' },
    { title: 'Hoàn tất', icon: ShieldCheck, description: 'Mọi thứ đã sẵn sàng! Bạn có thể bắt đầu sử dụng các dịch vụ ngay bây giờ.' }
  ];

  return (
    <div className="min-h-screen bg-white flex flex-col items-center justify-center p-6 bg-gradient-to-br from-white via-slate-50 to-primary/5">
      {/* Progress Bar */}
      <div className="w-full max-w-sm flex gap-1.5 mb-12">
        {[1, 2, 3, 4].map(s => (
          <div key={s} className={`h-1.5 flex-1 rounded-full transition-all duration-500 ${step >= s ? 'bg-primary' : 'bg-slate-100'}`} />
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
           key={step}
           initial={{ opacity: 0, x: 20 }}
           animate={{ opacity: 1, x: 0 }}
           exit={{ opacity: 0, x: -20 }}
           className="w-full max-w-sm space-y-8"
        >
          <div className="text-center space-y-4">
            <div className="w-20 h-20 rounded-[32px] bg-primary/10 text-primary flex items-center justify-center mx-auto shadow-xl shadow-primary/5">
              {React.createElement(steps[step-1].icon, { size: 32 })}
            </div>
            <div className="space-y-2">
              <h1 className="text-3xl font-black text-slate-800 tracking-tight">{steps[step-1].title}</h1>
              <p className="text-sm font-medium text-slate-400 leading-relaxed px-4">{steps[step-1].description}</p>
            </div>
          </div>

          <div className="space-y-4">
            {step === 1 && (
               <div className="bg-primary/5 p-4 rounded-2xl border border-primary/10">
                 <p className="text-[12px] font-bold text-center text-primary-dark uppercase tracking-widest italic">
                    "SmartStay - Trải nghiệm sống hiện đại ngay tại căn hộ của bạn"
                 </p>
               </div>
            )}

            {step === 2 && (
              <div className="space-y-4">
                <input placeholder="Mã tòa nhà (Ví dụ: BLK-A)" className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all" />
                <input placeholder="Số phòng (Ví dụ: 1205)" className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all" />
              </div>
            )}

            {step === 3 && (
              <div className="space-y-4">
                <input placeholder="Số điện thoại" className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all" />
                <input placeholder="Số CCCD" className="w-full h-14 bg-slate-50 border-none rounded-2xl px-5 text-sm font-bold focus:ring-2 ring-primary/20 outline-none transition-all" />
              </div>
            )}

            {step === 4 && (
              <div className="space-y-4">
                <div className="bg-green-50 p-6 rounded-3xl border border-green-100 flex flex-col items-center">
                  <CheckCircle2 size={48} className="text-green-500 mb-4" />
                  <p className="text-sm font-bold text-green-700 text-center">Tài khoản của bạn đã được liên kết thành công!</p>
                </div>
              </div>
            )}
          </div>
        </motion.div>
      </AnimatePresence>

      <div className="fixed bottom-12 left-0 right-0 px-6 flex flex-col items-center gap-4">
        <button 
           onClick={step === 4 ? () => navigate('/portal') : nextStep}
           className="w-full max-w-sm h-14 bg-slate-800 text-white rounded-[28px] font-black uppercase tracking-[3px] text-[13px] shadow-2xl flex items-center justify-center gap-3 active:scale-95 transition-all group"
        >
          {step === 4 ? 'Vào trang chủ' : 'Tiếp tục'}
          {step < 4 && <ArrowRight size={18} className="group-hover:translate-x-1 transition-transform" />}
        </button>
        
        {step > 1 && step < 4 && (
          <button onClick={prevStep} className="text-[11px] font-black text-slate-300 uppercase tracking-widest flex items-center gap-1 hover:text-slate-600">
             <ArrowLeft size={12} />
             Quay lại
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
