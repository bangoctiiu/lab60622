import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Menu, X, Globe } from 'lucide-react';
import { cn } from '@/utils';

export const PublicTopbar = () => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Tính năng', href: '#features' },
    { name: 'Bảng giá', href: '#pricing' },
    { name: 'Về chúng tôi', href: '#about' },
    { name: 'FAQ', href: '#faq' },
  ];

  return (
    <nav className={cn(
      "fixed top-0 w-full z-50 transition-all duration-300",
      isScrolled ? "bg-white/80 backdrop-blur-md shadow-md py-3" : "bg-transparent py-5"
    )}>
      <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <span className={cn(
            "text-2xl font-display font-bold tracking-tighter transition-colors",
            isScrolled ? "text-primary" : "text-white"
          )}>
            SmartStay <span className="text-accent">BMS</span>
          </span>
        </Link>

        {/* Desktop Nav */}
        <div className="hidden lg:flex items-center gap-10">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href}
              className={cn(
                "text-body font-medium transition-colors hover:text-accent",
                isScrolled ? "text-text" : "text-white/90"
              )}
            >
              {link.name}
            </a>
          ))}
        </div>

        {/* Desktop Actions */}
        <div className="hidden lg:flex items-center gap-4">
          <Link 
            to="/public/login" 
            className={cn(
              "px-5 py-2 rounded-md border text-sm font-bold transition-all",
              isScrolled 
                ? "border-primary text-primary hover:bg-primary/5" 
                : "border-white/30 text-white hover:bg-white/10"
            )}
          >
            Đăng nhập
          </Link>
          <Link 
            to="/public/register" 
            className="px-6 py-2 bg-accent text-white rounded-md text-sm font-bold hover:scale-105 transition-transform"
          >
            Bắt đầu miễn phí
          </Link>
        </div>

        {/* Mobile Toggle */}
        <button 
          className={cn("lg:hidden p-2", isScrolled ? "text-primary" : "text-white")}
          onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
        >
          {mobileMenuOpen ? <X /> : <Menu />}
        </button>
      </div>

      {/* Mobile Menu Slide-down */}
      <div className={cn(
        "lg:hidden absolute top-full left-0 w-full bg-white shadow-xl overflow-hidden transition-all duration-300",
        mobileMenuOpen ? "max-h-[500px] border-t" : "max-h-0"
      )}>
        <div className="flex flex-col p-6 gap-6">
          {navLinks.map((link) => (
            <a 
              key={link.name} 
              href={link.href} 
              className="text-h3 text-text"
              onClick={() => setMobileMenuOpen(false)}
            >
              {link.name}
            </a>
          ))}
          <div className="grid grid-cols-2 gap-4 pt-4 border-t">
            <Link to="/public/login" className="btn-primary bg-bg text-primary border text-center">Đăng nhập</Link>
            <Link to="/public/register" className="btn-primary text-center">Đăng ký</Link>
          </div>
        </div>
      </div>
    </nav>
  );
};

export const PublicFooter = () => (
  <footer className="bg-[#1A1A2E] text-white pt-20 pb-10">
    <div className="max-w-[1280px] mx-auto px-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 border-b border-white/10 pb-16">
      <div className="space-y-6">
        <h2 className="text-2xl font-display font-bold tracking-tighter">
          SmartStay <span className="text-accent">BMS</span>
        </h2>
        <p className="text-body text-white/60 leading-relaxed">
          Nền tảng quản lý tòa nhà thông minh, hiện đại và bảo mật hàng đầu Việt Nam. Tối ưu vận hành, nâng tầm trải nghiệm cư dân.
        </p>
        <div className="flex items-center gap-4">
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all cursor-pointer">F</div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all cursor-pointer">L</div>
          <div className="w-10 h-10 rounded-full bg-white/5 flex items-center justify-center hover:bg-accent hover:text-white transition-all cursor-pointer">Y</div>
        </div>
      </div>

      <div>
        <h4 className="text-h3 mb-8">Sản phẩm</h4>
        <ul className="space-y-4 text-body text-white/50">
          <li className="hover:text-accent cursor-pointer">Quản lý Căn hộ</li>
          <li className="hover:text-accent cursor-pointer">Cổng cư dân (Portal)</li>
          <li className="hover:text-accent cursor-pointer">Thu phí tự động</li>
          <li className="hover:text-accent cursor-pointer">Hệ thống kỹ thuật</li>
        </ul>
      </div>

      <div>
        <h4 className="text-h3 mb-8">Công ty</h4>
        <ul className="space-y-4 text-body text-white/50">
          <li className="hover:text-accent cursor-pointer">Về chúng tôi</li>
          <li className="hover:text-accent cursor-pointer">Tuyển dụng</li>
          <li className="hover:text-accent cursor-pointer">Báo chí</li>
          <li className="hover:text-accent cursor-pointer">Đối tác</li>
        </ul>
      </div>

      <div>
        <h4 className="text-h3 mb-8">Liên hệ</h4>
        <ul className="space-y-4 text-body text-white/50">
          <li>Hotline: 1900 88xx</li>
          <li>Email: hello@smartstay.vn</li>
          <li>Đ/c: Tầng 25, Keangnam Landmark 72, Hà Nội</li>
          <li className="pt-4 flex items-center gap-2">
            <Globe size={16} /> 
            <select className="bg-transparent border-none outline-none focus:ring-0 text-white/80 cursor-pointer">
              <option value="vi" className="bg-[#1A1A2E]">Tiếng Việt</option>
              <option value="en" className="bg-[#1A1A2E]">English</option>
            </select>
          </li>
        </ul>
      </div>
    </div>
    <div className="max-w-[1280px] mx-auto px-6 pt-10 flex flex-col md:flex-row justify-between items-center gap-4 text-small text-white/30">
      <p>© 2024 SmartStay BMS. All rights reserved.</p>
      <div className="flex gap-8">
        <span>Chính sách bảo mật</span>
        <span>Điều khoản dịch vụ</span>
      </div>
    </div>
  </footer>
);
