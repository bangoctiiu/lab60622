import React from 'react';
import { CreditCard, Wallet, MessageSquare, History } from 'lucide-react';

const PortalHome = () => {
  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="card-container p-8 bg-gradient-to-br from-secondary to-primary text-white border-none shadow-2xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard size={120} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-2">
            <h2 className="text-[28px] font-bold leading-tight">Chào bạn trở lại!</h2>
            <p className="text-body opacity-80">Đã đến hạn thanh toán hóa đơn tháng 03. Vui lòng thanh toán trước ngày 10/03.</p>
          </div>
          
          <div className="flex items-center justify-between py-6 border-y border-white/10">
            <div className="space-y-1">
              <p className="text-small opacity-60 uppercase tracking-wider">Tổng tiền cần trả</p>
              <p className="text-[32px] font-display font-bold">1.540.000đ</p>
            </div>
            <div className="w-12 h-12 bg-white/10 rounded-full flex items-center justify-center">
              <History size={24} />
            </div>
          </div>

          <button className="w-full py-4 bg-accent text-white rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-transform active:scale-95">
            THANH TOÁN NGAY
          </button>
        </div>
      </div>

      <div className="grid grid-cols-2 gap-4">
        {[
          { label: 'Số dư ví', val: '2.000.000đ', icon: Wallet, color: 'text-success' },
          { label: 'Yêu cầu hỗ trợ', val: '0', icon: MessageSquare, color: 'text-primary' }
        ].map((item, i) => (
          <div key={i} className="card-container p-6 text-center space-y-3 shadow-md border-none">
            <div className="w-10 h-10 mx-auto bg-bg rounded-full flex items-center justify-center text-muted/40">
              <item.icon size={20} />
            </div>
            <div>
              <p className="text-small text-muted font-medium">{item.label}</p>
              <p className={cn("text-h2 font-bold", item.color)}>{item.val}</p>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

// Simple utility for cn if not using imported one in this placeholder
const cn = (...classes: any[]) => classes.filter(Boolean).join(' ');

export default PortalHome;
