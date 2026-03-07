import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { Eye, EyeOff, Lock, User, RefreshCcw, ShieldCheck, Smartphone, ShieldAlert, ArrowRight } from 'lucide-react';
import { cn } from '@/utils';
import useAuthStore from '@/stores/authStore';
import { toast } from 'sonner';

const LoginPage = () => {
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({ username: '', password: '', remember: false });
  const login = useAuthStore(state => state.login);
  const navigate = useNavigate();
  
  // Detect context
  const isPortal = window.location.pathname.includes('/portal');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    
    // Simulate API delay
    setTimeout(() => {
      const mockUser = { 
        id: 1, 
        username: form.username || (isPortal ? 'tenant_demo' : 'admin_demo'), 
        fullName: isPortal ? 'Nguyễn Văn Cư Dân' : 'Administrator',
        email: form.username.includes('@') ? form.username : (isPortal ? 'tenant@smartstay.vn' : 'admin@smartstay.vn'),
        role: (isPortal ? 'Tenant' : 'Admin') as any,
        avatar: ''
      };
      login(mockUser, 'mock_token_123');
      toast.success(`Chào mừng trở lại, ${mockUser.username}!`);
      navigate(isPortal ? '/portal' : '/dashboard');
      setLoading(false);
    }, 1500);
  };

  return (
    <div className="min-h-screen flex flex-col lg:flex-row bg-white overflow-hidden">
      {/* LEFT: BRANDING SIDE */}
      <div className={cn(
        "hidden lg:flex lg:w-1/2 p-20 flex-col justify-between text-white relative transition-colors duration-700",
        isPortal ? "bg-gradient-to-br from-secondary to-[#0F766E]" : "bg-gradient-to-br from-primary to-[#2E5D9F]"
      )}>
        <div className="absolute inset-0 opacity-10" style={{ backgroundImage: 'url("https://www.transparenttextures.com/patterns/cubes.png")' }}></div>
        
        <div className="relative z-10">
          <Link to="/" className="text-3xl font-display font-bold tracking-tighter hover:opacity-80 transition-opacity">
            SmartStay <span className="text-accent">BMS</span>
          </Link>
          <div className="mt-20 space-y-6">
            <h1 className="text-[48px] font-display font-bold leading-tight animate-in slide-in-from-left-6 duration-700">
              {isPortal ? (
                <>Kết nối Cư dân & <br /> Ban Quản lý</>
              ) : (
                <>Hệ thống Quản trị <br /> Toà nhà Thế hệ mới</>
              )}
            </h1>
            <p className="text-xl text-white/70 max-w-md leading-relaxed animate-in slide-in-from-left-8 duration-700 delay-100">
              {isPortal ? (
                "Thanh toán hóa đơn, gửi phản ánh và nhận thông báo ngay trên điện thoại của bạn."
              ) : (
                "Vận hành toà nhà chưa bao giờ đơn giản hơn thế. Toàn diện - Bảo mật - Thông minh."
              )}
            </p>
          </div>
        </div>

        <div className="relative z-10 flex items-center gap-4 text-small text-white/50 animate-in fade-in duration-1000 delay-300">
          {isPortal ? <Smartphone className="text-accent" size={24} /> : <ShieldCheck className="text-accent" size={24} />}
          <span>
            {isPortal ? "Ứng dụng đa nền tảng, hỗ trợ iOS và Android." : "Bảo mật chuẩn Enterprise AES-256 mã hóa đầu cuối."}
          </span>
        </div>
      </div>

      {/* RIGHT: LOGIN FORM */}
      <div className="flex-1 flex items-center justify-center p-6 lg:p-20 bg-bg transition-colors duration-500">
        <div className="w-full max-w-md animate-in fade-in slide-in-from-bottom-6 duration-500">
          {/* Logo mobile-only */}
          <div className="lg:hidden text-center mb-10">
            <Link to="/" className="text-3xl font-display font-bold tracking-tighter text-primary">
              SmartStay <span className="text-accent">BMS</span>
            </Link>
          </div>

          <div className="card-container p-10 bg-white shadow-modal border-none">
            <header className="mb-10">
              <h2 className={cn("text-h1", isPortal ? "text-secondary" : "text-primary")}>
                {isPortal ? "Cổng Cư Dân" : "Đăng nhập Quản trị"}
              </h2>
              <p className="text-body text-muted mt-2">
                {isPortal ? "Vui lòng nhập số điện thoại hoặc email." : "Dành cho cấp quản lý và nhân viên vận hành."}
              </p>
            </header>

            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Username */}
              <div className="space-y-2">
                <label className="text-label text-text-secondary block">
                  {isPortal ? "Số điện thoại / Email" : "Tên đăng nhập / Email"}
                </label>
                <div className="relative group">
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors",
                    isPortal ? "group-focus-within:text-secondary" : "group-focus-within:text-primary"
                  )}>
                    <User size={18} />
                  </div>
                  <input 
                    type="text" 
                    required
                    autoFocus
                    placeholder={isPortal ? "090xxxxxxx" : "admin@smartstay.vn"}
                    className={cn(
                      "w-full pl-12 pr-4 py-3.5 border rounded-md outline-none transition-all text-body",
                      isPortal ? "focus:ring-secondary/20 focus:border-secondary" : "focus:ring-primary/20 focus:border-primary"
                    )}
                    value={form.username}
                    onChange={(e) => setForm({...form, username: e.target.value})}
                  />
                </div>
              </div>

              {/* Password */}
              <div className="space-y-2">
                <label className="text-label text-text-secondary block">Mật khẩu</label>
                <div className="relative group">
                  <div className={cn(
                    "absolute left-4 top-1/2 -translate-y-1/2 text-muted transition-colors",
                    isPortal ? "group-focus-within:text-secondary" : "group-focus-within:text-primary"
                  )}>
                    <Lock size={18} />
                  </div>
                  <input 
                    type={showPassword ? "text" : "password"} 
                    required
                    placeholder="••••••••"
                    className={cn(
                      "w-full pl-12 pr-12 py-3.5 border rounded-md outline-none transition-all text-body",
                      isPortal ? "focus:ring-secondary/20 focus:border-secondary" : "focus:ring-primary/20 focus:border-primary"
                    )}
                    value={form.password}
                    onChange={(e) => setForm({...form, password: e.target.value})}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-muted hover:text-text"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </div>

              {/* Remember & Forgot */}
              <div className="flex items-center justify-between text-body">
                <label className="flex items-center gap-2 cursor-pointer select-none">
                  <input 
                    type="checkbox" 
                    className={cn("w-4 h-4 rounded border-gray-300", isPortal ? "text-secondary focus:ring-secondary" : "text-primary focus:ring-primary")}
                    checked={form.remember}
                    onChange={(e) => setForm({...form, remember: e.target.checked})}
                  />
                  <span className="text-muted">Ghi nhớ đăng nhập</span>
                </label>
                <Link to="/public/forgot-password" title="Quên mật khẩu?" className={cn("font-semibold hover:underline", isPortal ? "text-secondary" : "text-primary")}>
                  Quên mật khẩu?
                </Link>
              </div>

              {/* Submit */}
              <button 
                type="submit" 
                disabled={loading}
                className={cn(
                  "w-full py-4 text-white rounded-md font-bold text-lg transition-all shadow-lg flex items-center justify-center gap-3 disabled:opacity-70 disabled:cursor-not-allowed group",
                  isPortal ? "bg-secondary hover:bg-secondary-light" : "bg-primary hover:bg-primary-light"
                )}
              >
                {loading ? (
                  <RefreshCcw className="animate-spin" size={20} />
                ) : (
                  <>Đăng nhập ngay <ArrowRight className="group-hover:translate-x-1 transition-transform" size={20} /></>
                )}
              </button>
            </form>

            {/* Spec 3.2.1 SSO Option */}
            {!isPortal && (
               <div className="mt-8">
                 <div className="relative mb-6">
                   <div className="absolute inset-0 flex items-center"><div className="w-full border-t"></div></div>
                   <div className="relative flex justify-center text-small uppercase"><span className="bg-white px-4 text-muted">Hoặc</span></div>
                 </div>
                 <button className="w-full py-3.5 border border-border rounded-md font-semibold text-text hover:bg-bg transition-colors flex items-center justify-center gap-3">
                   <ShieldCheck size={20} className="text-primary" /> Đăng nhập bằng SSO / LDAP
                 </button>
               </div>
            )}

            <div className="mt-10 pt-10 border-t text-center space-y-4">
              {isPortal ? (
                <p className="text-small text-muted">Bạn là Quản trị viên? <Link to="/public/login" className="text-primary font-bold hover:underline">Vào trang Quản trị</Link></p>
              ) : (
                <p className="text-small text-muted">Bạn là Cư dân/Người thuê? <Link to="/portal/login" className="text-secondary font-bold hover:underline">Vào Cổng Cư dân</Link></p>
              )}
            </div>
          </div>

          <footer className="mt-8 text-center text-small text-muted flex items-center justify-center gap-6">
            <Link to="/" className="hover:text-text">Về trang chủ</Link>
            <span>Quy định bảo mật</span>
            <span>Trợ giúp</span>
          </footer>
        </div>
      </div>
      
      {/* Spec 3.2.1 Brute-force Lock Banner (Simulated) */}
      <div className="fixed bottom-0 left-0 w-full p-4 pointer-events-none">
        <div className="max-w-md mx-auto bg-danger p-4 rounded-lg shadow-2xl text-white flex items-center gap-4 animate-in slide-in-from-bottom duration-500 sr-only group-hover:not-sr-only">
           <ShieldAlert size={24} />
           <div>
             <p className="font-bold">Tài khoản bị khóa tạm thời</p>
             <p className="text-small opacity-80">Do nhập sai quá 5 lần. Vui lòng quay lại sau 29:59</p>
           </div>
        </div>
      </div>
    </div>
  );
};


export default LoginPage;
