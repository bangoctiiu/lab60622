import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { LogIn, Shield, ArrowRight } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const PortalLogin: React.FC = () => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    // Logic login giả lập
    console.log('Login with:', phoneNumber, password);
    navigate('/portal'); // Chuyển đến dashboard sau khi login
  };

  return (
    <div className="min-h-screen flex flex-col bg-bg px-6 pt-20 pb-10 animate-in fade-in duration-700">
      <div className="flex-1 space-y-12">
        <div className="space-y-4 text-center">
          <div className="w-20 h-20 bg-gradient-to-tr from-primary to-accent rounded-3xl mx-auto flex items-center justify-center shadow-xl shadow-primary/20 rotate-3">
            <Shield size={40} className="text-white -rotate-3" />
          </div>
          <div className="space-y-2">
            <h1 className="text-display font-bold bg-gradient-to-r from-primary to-accent bg-clip-text text-transparent">
              SmartStay Portal
            </h1>
            <p className="text-muted font-medium">Quản lý không gian sống của bạn</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-6">
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-small font-bold text-muted ml-1">SỐ ĐIỆN THOẠI</label>
              <input
                type="tel"
                placeholder="09xx xxx xxx"
                value={phoneNumber}
                onChange={(e) => setPhoneNumber(e.target.value)}
                className="w-full h-14 px-4 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-primary focus:outline-none transition-all font-medium text-body"
                required
              />
            </div>
            <div className="space-y-2">
              <label className="text-small font-bold text-muted ml-1">MẬT KHẨU</label>
              <input
                type="password"
                placeholder="••••••••"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full h-14 px-4 bg-white border-2 border-transparent rounded-2xl shadow-sm focus:border-primary focus:outline-none transition-all font-medium text-body"
                required
              />
            </div>
          </div>

          <div className="flex justify-end">
            <button 
              type="button" 
              onClick={() => navigate('/portal/forgot-password')}
              className="text-small font-bold text-primary hover:opacity-80 transition-opacity"
            >
              Quên mật khẩu?
            </button>
          </div>

          <Button 
            type="submit" 
            className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25 flex items-center justify-center gap-2 group"
          >
            ĐĂNG NHẬP
            <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
          </Button>
        </form>
      </div>

      <div className="text-center">
        <p className="text-small text-muted">
          Chưa có tài khoản?{' '}
          <button className="font-bold text-primary">Liên hệ quản lý</button>
        </p>
      </div>
    </div>
  );
};

export default PortalLogin;
