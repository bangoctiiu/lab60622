import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { CheckCircle2, Home, User, ShieldCheck, ArrowRight, ArrowLeft } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const Onboarding: React.FC = () => {
  const [step, setStep] = useState(1);
  const navigate = useNavigate();

  const handleNext = () => {
    if (step < 3) setStep(step + 1);
    else navigate('/portal');
  };

  const steps = [
    {
      title: 'Chào mừng gia nhập!',
      desc: 'SmartStay giúp bạn quản lý căn hộ, thanh toán và yêu cầu hỗ trợ một cách dễ dàng nhất.',
      icon: Home,
      color: 'bg-primary'
    },
    {
      title: 'Thông tin cư dân',
      desc: 'Hãy đảm bảo thông tin cá nhân của bạn chính xác để nhận được hỗ trợ tốt nhất.',
      icon: User,
      color: 'bg-accent'
    },
    {
      title: 'Nội quy & Bảo mật',
      desc: 'Chúng tôi cam kết bảo mật thông tin và cung cấp môi trường sống an toàn, minh bạch.',
      icon: ShieldCheck,
      color: 'bg-success'
    }
  ];

  const current = steps[step - 1];

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 pt-20 pb-10 overflow-hidden">
      {/* Step Indicators */}
      <div className="flex justify-center gap-2 mb-12">
        {[1, 2, 3].map((s) => (
          <div 
            key={s} 
            className={`h-2 rounded-full transition-all duration-500 ${
              s === step ? 'w-8 bg-primary' : 'w-2 bg-muted/20'
            }`}
          />
        ))}
      </div>

      <div className="flex-1 flex flex-col items-center text-center space-y-10 animate-in slide-in-from-right-20 duration-500">
        <div className={`w-32 h-32 ${current.color} rounded-[40px] flex items-center justify-center text-white shadow-2xl shadow-primary/10 rotate-6`}>
          <current.icon size={56} className="-rotate-6" />
        </div>

        <div className="space-y-4">
          <h1 className="text-display font-bold px-4">{current.title}</h1>
          <p className="text-body text-muted font-medium px-6 leading-relaxed">
            {current.desc}
          </p>
        </div>
      </div>

      <div className="space-y-4">
        <Button 
          onClick={handleNext}
          className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
        >
          {step === 3 ? 'BẮT ĐẦU NGAY' : 'TIẾP TỤC'}
          <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
        </Button>
        
        {step > 1 && (
          <button 
            onClick={() => setStep(step - 1)}
            className="w-full py-2 flex items-center justify-center gap-2 text-muted font-bold hover:text-primary transition-colors"
          >
            <ArrowLeft size={16} /> Quay lại
          </button>
        )}
      </div>
    </div>
  );
};

export default Onboarding;
