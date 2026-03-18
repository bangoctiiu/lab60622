import React from 'react';
import { Settings, Save, Bell, Shield, Globe, Database } from 'lucide-react';
import { Button } from '@/components/ui/Button';

const SystemSettings: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-indigo-600 text-white rounded-[20px] shadow-xl shadow-indigo-600/20">
              <Settings size={28} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Cài đặt Hệ thống</h1>
              <p className="text-slate-500 text-sm font-medium italic">Cấu hình tham số vận hành, thông báo và bảo mật.</p>
           </div>
        </div>
        <Button className="rounded-2xl bg-indigo-600 hover:bg-indigo-700 font-bold shadow-lg shadow-indigo-600/20 px-8">
          <Save className="mr-2 h-4 w-4" /> Lưu cấu hình
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { icon: <Globe size={20} />, title: 'Cấu hình chung', desc: 'Tên hệ thống, Logo, Ngôn ngữ' },
          { icon: <Bell size={20} />, title: 'Thông báo', desc: 'Email SMTP, Firebase Cloud Messaging' },
          { icon: <Shield size={20} />, title: 'Bảo mật', desc: 'Password policy, 2FA, Session timeout' },
          { icon: <Database size={20} />, title: 'Sao lưu & Phục hồi', desc: 'Auto-backup, Cloud Storage mapping' },
        ].map((item, i) => (
          <div key={i} className="bg-white p-6 rounded-[32px] border border-slate-200/60 shadow-sm hover:shadow-md transition-shadow cursor-pointer group">
             <div className="inline-flex p-3 rounded-2xl bg-indigo-50 text-indigo-600 mb-4 group-hover:scale-110 transition-transform">
                {item.icon}
             </div>
             <h3 className="font-bold text-slate-900 mb-1">{item.title}</h3>
             <p className="text-xs text-slate-500">{item.desc}</p>
          </div>
        ))}
      </div>
      
      <div className="bg-slate-900 rounded-[40px] p-10 text-white flex flex-col md:flex-row items-center justify-between gap-8 relative overflow-hidden">
         <div className="relative z-10">
            <h2 className="text-3xl font-black mb-2 tracking-tight">Thiết lập tham số Vận hành</h2>
            <p className="text-slate-400 text-sm max-w-md">Thay đổi các tham số này có thể ảnh hưởng đến toàn bộ luồng quy trình của hệ thống.</p>
         </div>
         <Button variant="outline" className="border-white/20 text-white hover:bg-white/10 rounded-2xl px-10 relative z-10">
            Mở cấu hình nâng cao
         </Button>
         <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 rounded-full -mr-32 -mt-32 blur-3xl"></div>
      </div>
    </div>
  );
};

export default SystemSettings;
