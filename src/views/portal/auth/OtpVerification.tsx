import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { KeyRound, ArrowRight, RefreshCcw } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const OtpVerification: React.FC = () => {
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [timer, setTimer] = useState(60);
  const navigate = useNavigate();

  useEffect(() => {
    if (timer > 0) {
      const interval = setInterval(() => setTimer(timer - 1), 1000);
      return () => clearInterval(interval);
    }
  }, [timer]);

  const handleChange = (index: number, value: string) => {
    if (value.length > 1) value = value[0];
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Tự động chuyển focus sang ô tiếp theo
    if (value && index < 5) {
      const nextInput = document.getElementById(`otp-${index + 1}`);
      nextInput?.focus();
    }
  };

  const handleVerify = () => {
    console.log('Verifying OTP:', otp.join(''));
    // Sau khi verify thành công, nếu là login lần đầu thì qua onboarding, ngược lại qua dashboard
    navigate('/portal');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 pt-20 pb-10 animate-in fade-in duration-700">
      <div className="flex-1 space-y-12">
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20">
            <KeyRound size={40} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-h1 font-bold">Xác thực mã OTP</h1>
            <p className="text-muted font-medium px-4 text-center">
              Mã xác thực đã được gửi đến số điện thoại của bạn
            </p>
          </div>
        </div>

        <div className="space-y-8">
          <div className="flex justify-between gap-2">
            {otp.map((digit, i) => (
              <input
                key={i}
                id={`otp-${i}`}
                type="number"
                value={digit}
                onChange={(e) => handleChange(i, e.target.value)}
                className="w-12 h-16 text-center text-h2 font-bold bg-white border-2 border-transparent rounded-xl shadow-sm focus:border-primary focus:outline-none transition-all"
                autoFocus={i === 0}
              />
            ))}
          </div>

          <div className="text-center space-y-2">
            <p className="text-small text-muted">Không nhận được mã?</p>
            {timer > 0 ? (
              <p className="text-small font-bold text-primary">Gửi lại sau {timer}s</p>
            ) : (
              <button className="flex items-center gap-1 mx-auto text-small font-bold text-primary hover:opacity-80 transition-opacity">
                <RefreshCcw size={14} /> Gửi lại mã
              </button>
            )}
          </div>

          <Button 
            onClick={handleVerify}
            className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          >
            XÁC NHẬN
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default OtpVerification;
