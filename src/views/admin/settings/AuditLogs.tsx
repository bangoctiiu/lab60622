import React from 'react';
import { History, Search, Filter, Download } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { DataTable } from '@/components/shared/DataTable';
import { FilterPanel } from '@/components/shared/FilterPanel';

const AuditLogs: React.FC = () => {
  return (
    <div className="p-6 space-y-6 animate-in fade-in duration-500">
      <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
        <div className="flex items-center gap-4">
           <div className="p-3 bg-slate-100 text-slate-600 rounded-[20px] shadow-sm">
              <History size={28} />
           </div>
           <div>
              <h1 className="text-2xl font-black text-slate-900 tracking-tight leading-none mb-1">Audit Logs</h1>
              <p className="text-slate-500 text-sm font-medium italic">Lịch sử thao tác hệ thống và truy vết dữ liệu.</p>
           </div>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="rounded-xl font-bold">
            <Download className="mr-2 h-4 w-4" /> Xuất báo cáo (CSV)
          </Button>
        </div>
      </div>

      <FilterPanel
        filters={[
          { key: 'search', label: 'Tìm kiếm', type: 'text', placeholder: 'Người dùng, nội dung...' },
          { key: 'module', label: 'Module', type: 'select', options: [{ label: 'Tất cả', value: '' }] },
          { key: 'date', label: 'Ngày', type: 'date' },
        ]}
        values={{}}
        onChange={() => {}}
      />

      <div className="rounded-[32px] overflow-hidden border border-slate-200/60 shadow-xl bg-white/80 backdrop-blur-md">
        <DataTable
          columns={[
            { header: 'Thời gian', accessorKey: 'timestamp' },
            { header: 'Người dùng', accessorKey: 'user' },
            { header: 'Hành động', accessorKey: 'action' },
            { header: 'Chi tiết', accessorKey: 'details' },
            { header: 'IP Address', accessorKey: 'ip' },
          ]}
          data={[]}
          total={0}
          loading={false}
          emptyState={
             <div className="py-20 flex flex-col items-center justify-center opacity-40">
                <History size={48} className="mb-4" />
                <p className="font-bold uppercase tracking-widest text-xs">Chưa có bản ghi nào</p>
             </div>
          }
        />
      </div>
    </div>
  );
};

export default AuditLogs;
