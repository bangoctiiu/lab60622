import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { 
  FileText, 
  Download, 
  Search,
  FileCheck,
  Receipt,
  FilePlus,
  ArrowRight,
  FolderOpen
} from 'lucide-react';
import PortalLayout from '@/components/layout/PortalLayout';
import api from '@/services/apiClient';
import { cn, formatDate } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { toast } from 'sonner';

const Documents = () => {
  const { data: documents, isLoading } = useQuery({
    queryKey: ['portal-documents'],
    queryFn: async () => {
      const res = await api.get('/api/portal/documents');
      return res.data;
    }
  });

  const categories = [
    { label: 'Hợp đồng', count: 1, icon: FileCheck, color: 'text-teal-600', bg: 'bg-teal-50' },
    { label: 'Biên lai', count: 8, icon: Receipt, color: 'text-orange-600', bg: 'bg-orange-50' },
    { label: 'Phụ lục', count: 0, icon: FilePlus, color: 'text-blue-600', bg: 'bg-blue-50' },
  ];

  return (
    <PortalLayout title="Kho tài liệu" showBack={true}>
      <div className="space-y-8 pb-32">
        {/* 1. Statistics / Categories */}
        <div className="px-8 pt-8">
            <div className="grid grid-cols-3 gap-3">
                {categories.map((cat, idx) => (
                    <div key={idx} className="bg-white p-4 rounded-[32px] border border-slate-100 flex flex-col items-center gap-2 shadow-sm text-center">
                        <div className={cn("w-10 h-10 rounded-2xl flex items-center justify-center", cat.bg, cat.color)}>
                            <cat.icon size={20} />
                        </div>
                        <div className="space-y-0.5">
                            <span className="text-[8px] font-black text-slate-300 uppercase tracking-widest">{cat.label}</span>
                            <p className="text-sm font-black text-slate-800 leading-none">{cat.count}</p>
                        </div>
                    </div>
                ))}
            </div>
        </div>

        {/* 2. Search */}
        <div className="px-8 flex flex-col gap-6">
            <div className="relative group">
                <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-[#0D8A8A] transition-colors" size={18} />
                <input 
                    type="text" 
                    placeholder="Tìm tên tài liệu..."
                    className="w-full h-14 bg-white rounded-2xl pl-12 pr-4 text-sm font-medium border-2 border-transparent focus:border-[#0D8A8A]/20 focus:bg-white shadow-sm transition-all outline-none"
                />
            </div>

            {/* 3. Document List */}
            <div className="space-y-6 text-left">
                <h3 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.3em] px-2 flex items-center gap-2">
                    <FolderOpen size={16} className="text-[#0D8A8A]" /> Danh sách tệp tin
                </h3>

                <div className="space-y-4">
                    {isLoading ? (
                        <div className="py-20 flex justify-center"><Spinner /></div>
                    ) : documents?.items?.length > 0 ? (
                        documents.items.map((doc: any) => <DocumentCard key={doc.id} doc={doc} />)
                    ) : (
                        // Mock data
                        [
                            { id: 1, name: 'Hợp đồng thuê phòng 902 - Sign.pdf', size: '2.4 MB', type: 'Contract', date: '2023-12-01' },
                            { id: 2, name: 'Biên lai thanh toán INV-102.pdf', size: '840 KB', type: 'Receipt', date: '2024-01-10' },
                            { id: 3, name: 'Biên lai thanh toán INV-103.pdf', size: '840 KB', type: 'Receipt', date: '2024-02-12' },
                        ].map((doc) => <DocumentCard key={doc.id} doc={doc} />)
                    )}
                </div>
            </div>
        </div>
      </div>
    </PortalLayout>
  );
};

const DocumentCard = ({ doc }: { doc: any }) => {
  const isContract = doc.type === 'Contract';

  return (
    <div className="bg-white p-6 rounded-[36px] shadow-sm border border-slate-50 flex items-center justify-between group active:scale-[0.99] transition-all">
        <div className="flex items-center gap-5">
            <div className={cn(
                "w-12 h-12 rounded-[22px] flex items-center justify-center transition-transform group-hover:scale-110 shadow-inner",
                isContract ? "bg-teal-50 text-teal-600" : "bg-orange-50 text-orange-600"
            )}>
                <FileText size={24} strokeWidth={2} />
            </div>
            <div className="space-y-1">
                <h4 className="text-[13px] font-black text-slate-800 tracking-tight leading-none uppercase truncate max-w-[160px]">{doc.name}</h4>
                <p className="text-[9px] font-black text-slate-400 uppercase tracking-widest">{formatDate(doc.date)} • {doc.size}</p>
            </div>
        </div>
        <button onClick={() => toast.info('Chức năng đang phát triển để kết nối Backend')} className="w-10 h-10 bg-slate-50 text-slate-300 rounded-full flex items-center justify-center group-hover:bg-[#0D8A8A] group-hover:text-white transition-all shadow-sm">
            <Download size={18} />
        </button>
    </div>
  );
};

export default Documents;
