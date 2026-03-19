import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mail, ArrowLeft, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const ForgotPassword: React.FC = () => {
  const [emailOrPhone, setEmailOrPhone] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    console.log('Reset password for:', emailOrPhone);
    navigate('/portal/verify-otp');
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 pt-20 pb-10 animate-in fade-in duration-700">
      <div className="flex-1 space-y-12">
        <button 
          onClick={() => navigate(-1)}
          className="flex items-center gap-2 text-primary font-bold hover:opacity-80 transition-opacity"
        >
          <ArrowLeft size={18} /> Quay lại
        </button>

        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20">
            <Mail size={40} className="text-white" />
          </div>
          <div className="space-y-2">
            <h1 className="text-h1 font-bold">Quên mật khẩu?</h1>
            <p className="text-muted font-medium px-4 text-center">
              Nhập số điện thoại đã đăng ký để lấy lại mật khẩu
            </p>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-2">
            <label className="text-small font-bold text-muted ml-1 uppercase">SỐ ĐIỆN THOẠI</label>
            <input
              type="tel"
              placeholder="09xx xxx xxx"
              value={emailOrPhone}
              onChange={(e) => setEmailOrPhone(e.target.value)}
              className="w-full h-14 px-4 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-primary focus:outline-none transition-all font-medium text-body"
              required
            />
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          >
            TIẾP TỤC
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>
    </div>
  );
};

export default ForgotPassword;
