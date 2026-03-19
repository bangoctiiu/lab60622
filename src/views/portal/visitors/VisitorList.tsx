import React, { useEffect, useState } from 'react';
import { UserPlus, Clock, ShieldCheck, MoreVertical, CheckCircle2, XCircle, ArrowRight, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { visitorService } from '@/services/visitorService';
import { Visitor } from '@/mocks/visitorMocks';

const VisitorList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'history'>('upcoming');
  const [visitors, setVisitors] = useState<Visitor[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchVisitors = async () => {
      setLoading(true);
      try {
        const data = await visitorService.getVisitors({ tenantId: 'T1' });
        setVisitors(data);
      } catch (error) {
        console.error('Error fetching visitors:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchVisitors();
  }, []);

  const filteredVisitors = visitors.filter(v => 
    activeTab === 'upcoming' ? v.status !== 'Departed' : v.status === 'Departed'
  );

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải danh sách khách...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 font-bold">Khách ghé thăm</h2>
        <button className="p-2 bg-white rounded-xl shadow-sm text-primary">
          <UserPlus size={20} />
        </button>
      </div>

      <div className="flex p-1 bg-white rounded-2xl shadow-sm">
        {(['upcoming', 'history'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[13px] font-bold rounded-xl transition-all ${
              activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted'
            }`}
          >
            {tab === 'upcoming' ? 'Sắp tới' : 'Lịch sử'}
          </button>
        ))}
      </div>

      <div className="space-y-4">
        {filteredVisitors.length > 0 ? (
          filteredVisitors.map((visitor) => (
            <div key={visitor.id} className="card-container p-5 bg-white border-none shadow-sm space-y-4">
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-bg rounded-full flex items-center justify-center text-primary/40 font-bold text-h3 uppercase">
                    {visitor.name[0]}
                  </div>
                  <div>
                    <p className="text-body font-bold">{visitor.name}</p>
                    <p className="text-[11px] text-muted font-medium">{visitor.phone}</p>
                  </div>
                </div>
                <button className="p-1 text-muted"><MoreVertical size={20} /></button>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-muted/5">
                <div className="space-y-1">
                  <div className="flex items-center gap-1.5 text-muted text-[11px] font-medium">
                    <Clock size={12} /> {visitor.visitDate}, {visitor.visitTime}
                  </div>
                  <div className={`text-[10px] font-bold uppercase tracking-wider flex items-center gap-1 ${
                    visitor.status === 'Expected' ? 'text-warning' : visitor.status === 'Arrived' ? 'text-success' : 'text-muted'
                  }`}>
                    {visitor.status === 'Expected' ? <Clock size={12} /> : visitor.status === 'Arrived' ? <CheckCircle2 size={12} /> : <XCircle size={12} />}
                    {visitor.status === 'Expected' ? 'Sắp đến' : visitor.status === 'Arrived' ? 'Đã đến' : 'Đã rời đi'}
                  </div>
                </div>
                {visitor.status !== 'Departed' && (
                  <button className="px-3 py-1.5 bg-primary/10 text-primary text-[11px] font-bold rounded-lg flex items-center gap-1">
                    Mã QR: {visitor.qrCode} <ArrowRight size={12} />
                  </button>
                )}
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl opacity-50 space-y-2 border-2 border-dashed border-muted/10">
            <AlertCircle size={40} className="mx-auto text-muted" />
            <p className="text-body font-bold text-muted">Không có dữ liệu khách</p>
          </div>
        )}
      </div>

      <div className="p-6 bg-primary rounded-3xl text-white shadow-xl shadow-primary/25 relative overflow-hidden">
        <div className="relative z-10 space-y-4">
          <div className="space-y-1">
            <h4 className="text-body font-bold">Thêm khách mới?</h4>
            <p className="text-[11px] opacity-80 leading-relaxed">
              Tạo mã QR hoặc thông báo cho bảo vệ khi có khách ghé thăm để quá trình vào tòa nhà thuận tiện hơn.
            </p>
          </div>
          <Button className="w-full bg-white text-primary font-bold rounded-xl py-3 shadow-md">
            ĐĂNG KÝ NGAY
          </Button>
        </div>
        <div className="absolute -bottom-6 -right-6 opacity-10">
          <ShieldCheck size={120} />
        </div>
      </div>
    </div>
  );
};

export default VisitorList;
