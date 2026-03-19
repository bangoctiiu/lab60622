import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Building2 } from 'lucide-react';
import { toast } from 'sonner';
import useAuthStore from '@/stores/authStore';

const PortalLogin: React.FC = () => {
  const navigate = useNavigate();
  const [identifier, setIdentifier] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [loading, setLoading] = useState(false);
  const [failCount, setFailCount] = useState(0);
  const [lockoutTimer, setLockoutTimer] = useState(0);

  const loginAuth = useAuthStore(state => state.login);

  useEffect(() => {
    if (lockoutTimer > 0) {
      const timer = setInterval(() => setLockoutTimer(prev => prev - 1), 1000);
      return () => clearInterval(timer);
    }
  }, [lockoutTimer]);

  const isEmail = (val: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(val);
  const isPhone = (val: string) => /^[0-9+]{10,12}$/.test(val);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    if (lockoutTimer > 0) {
      toast.error(`Tài khoản bị khoá ${Math.ceil(lockoutTimer / 60)} phút`);
      return;
    }
    
    setLoading(true);
    try {
      await new Promise(resolve => setTimeout(resolve, 800));
      
      if (password === '123456') {
        const mockTenant: any = {
          id: 'tenant_1',
          name: 'Nguyễn Văn An',
          email: isEmail(identifier) ? identifier : 'an.nguyen@example.com',
          phone: isPhone(identifier) ? identifier : '0912345678',
          role: 'Tenant',
          status: 'ACTIVE',
        };
        loginAuth(mockTenant, 'mock_token_tenant_123');
        setFailCount(0);
        
        // Check if onboarding is complete (Mock behavior)
        navigate('/portal/dashboard');
      } else {
        const newFailCount = failCount + 1;
        setFailCount(newFailCount);
        if (newFailCount >= 5) {
          setLockoutTimer(15 * 60); // 15 minutes
          toast.error('Tài khoản bị khoá 15 phút');
        } else {
          toast.error('Sai thông tin đăng nhập');
        }
      }
    } catch (error) {
      toast.error('Lỗi hệ thống');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-b from-[#0D8A8A] to-[#1B3A6B] p-4 text-[#1E293B]">
      
      <div className="max-w-[390px] w-full bg-white rounded-2xl shadow-2xl p-8">
        
        {/* Brand */}
        <div className="flex flex-col items-center text-center space-y-4 mb-8">
          <div className="w-[80px] h-[80px] bg-[#0D8A8A]/10 rounded-2xl flex items-center justify-center">
            <Building2 size={40} className="text-[#0D8A8A]" />
          </div>
          <div>
            <h2 className="text-2xl font-bold text-slate-800">Chào mừng cư dân</h2>
            <p className="text-sm text-slate-500 mt-1">Đăng nhập để quản lý phòng và tiện ích của bạn</p>
          </div>
        </div>

        <form onSubmit={handleLogin} className="space-y-4">
          
          <div className="space-y-1">
            <input 
              type="text" 
              value={identifier}
              onChange={(e) => setIdentifier(e.target.value)}
              placeholder="Số điện thoại hoặc Email"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0D8A8A] focus:ring-2 focus:ring-[#0D8A8A]/20 outline-none transition-all text-[16px] placeholder:text-slate-400"
              required
            />
          </div>

          <div className="space-y-1 relative">
            <input 
              type={showPassword ? "text" : "password"}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Mật khẩu"
              className="w-full h-12 px-4 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:border-[#0D8A8A] focus:ring-2 focus:ring-[#0D8A8A]/20 outline-none transition-all text-[16px] placeholder:text-slate-400 pr-12"
              required
            />
            <button 
              type="button" 
              onClick={() => setShowPassword(!showPassword)}
              className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-[#0D8A8A] p-1"
            >
              {showPassword ? <EyeOff size={20} /> : <Eye size={20} />}
            </button>
          </div>

          <div className="flex items-center justify-between pt-2">
            <label className="flex items-center gap-2 cursor-pointer group">
              <input 
                type="checkbox" 
                checked={rememberMe}
                onChange={(e) => setRememberMe(e.target.checked)}
                className="w-4 h-4 rounded border-slate-300 text-[#0D8A8A] focus:ring-[#0D8A8A]/20 cursor-pointer"
              />
              <span className="text-sm text-slate-600 group-hover:text-slate-800">Ghi nhớ đăng nhập 30 ngày</span>
            </label>
            <button 
              type="button" 
              onClick={() => navigate('/portal/forgot-password')} 
              className="text-sm font-semibold text-[#0D8A8A] hover:underline"
            >
              Quên mật khẩu?
            </button>
          </div>

          <button 
            type="submit"
            disabled={loading || lockoutTimer > 0}
            className="w-full h-[48px] bg-[#0D8A8A] text-white rounded-xl font-bold text-[16px] flex items-center justify-center hover:bg-[#0A6B6B] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed mt-4"
          >
            {lockoutTimer > 0 ? (
               `Mở khoá sau ${Math.ceil(lockoutTimer / 60)} phút`
            ) : loading ? (
              <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
            ) : (
              'Đăng nhập'
            )}
          </button>
          
        </form>

        <div className="mt-6 text-center">
            <p className="text-sm text-slate-500">
               Chưa có tài khoản?{' '}
               <button className="font-semibold text-[#0D8A8A]" onClick={() => alert("Vui lòng liên hệ ban quản lý để được cấp tài khoản.")}>
                 Liên hệ quản lý
               </button>
            </p>
        </div>

      </div>
      
    </div>
  );
};

export default PortalLogin;

