import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  FileText, 
  Download, 
  ExternalLink, 
  Search, 
  ChevronLeft,
  Filter,
  Eye,
  Calendar,
  ShieldAlert
} from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import PortalLayout from '@/components/portal/PortalLayout';

const Documents: React.FC = () => {
  const navigate = useNavigate();

  const documents = [
    { id: 1, name: 'Hợp đồng thuê nhà P.1205', size: '2.4 MB', type: 'PDF', date: '01/01/2024', status: 'Active' },
    { id: 2, name: 'Nội quy tòa nhà 2024', size: '1.8 MB', type: 'PDF', date: '01/01/2024', status: 'Public' },
    { id: 3, name: 'Hướng dẫn sử dụng thiết bị', size: '5.2 MB', type: 'PDF', date: '01/01/2024', status: 'Private' },
  ];

  return (
    <PortalLayout>
      <div className="space-y-6">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center text-slate-600">
            <ChevronLeft size={20} />
          </button>
          <h1 className="text-2xl font-black text-slate-800 tracking-tight">Hồ sơ & Giấy tờ</h1>
        </div>

        {/* Search */}
        <div className="relative group">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-primary transition-colors" size={20} />
          <input 
            type="text"
            placeholder="Tìm kiếm tài liệu..."
            className="w-full h-14 bg-white border border-slate-100 rounded-2xl pl-12 pr-4 text-sm font-medium focus:ring-2 ring-primary/20 outline-none transition-all shadow-sm focus:shadow-md"
          />
        </div>

        <div className="grid gap-3">
          {documents.map((doc) => (
            <motion.div
              key={doc.id}
              whileHover={{ y: -2 }}
              className="bg-white p-4 rounded-3xl border border-slate-100 shadow-sm flex items-center gap-4 group"
            >
              <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-500 flex items-center justify-center shrink-0">
                <FileText size={28} />
              </div>

              <div className="flex-1 min-w-0">
                <h3 className="text-sm font-black text-slate-800 truncate mb-1">{doc.name}</h3>
                <div className="flex items-center gap-3">
                   <div className="flex items-center gap-1 text-[10px] font-bold text-slate-400 uppercase tracking-wider">
                     <Calendar size={12} />
                     {doc.date}
                   </div>
                   <div className="w-1 h-1 rounded-full bg-slate-200" />
                   <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{doc.size}</span>
                </div>
              </div>

              <div className="flex gap-2">
                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 flex items-center justify-center transition-all">
                  <Eye size={18} />
                </button>
                <button className="w-10 h-10 rounded-xl bg-slate-50 text-slate-400 hover:text-primary hover:bg-primary/5 flex items-center justify-center transition-all">
                  <Download size={18} />
                </button>
              </div>
            </motion.div>
          ))}
        </div>

        {/* Security Warning */}
        <div className="p-6 bg-slate-900 rounded-[32px] text-white shadow-xl relative overflow-hidden group">
           <div className="absolute bottom-0 right-0 w-32 h-32 bg-white/5 rounded-full -mb-16 -mr-16" />
           <div className="flex gap-4 items-start relative z-10">
              <div className="w-10 h-10 rounded-xl bg-white/10 flex items-center justify-center shrink-0">
                <ShieldAlert className="text-amber-400" size={20} />
              </div>
              <div className="space-y-1">
                <h4 className="text-sm font-black uppercase tracking-widest">Lưu ý quan trọng</h4>
                <p className="text-[12px] text-white/60 font-medium leading-relaxed">
                  Để bảo vệ quyền riêng tư, vui lòng không chia sẻ các tài liệu pháp lý cho bên thứ ba không có thẩm quyền.
                </p>
              </div>
           </div>
        </div>
      </div>
    </PortalLayout>
  );
};

export default Documents;
