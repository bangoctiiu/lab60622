import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Filter, ArrowRight, Clock, CheckCircle2, AlertCircle } from 'lucide-react';
import { invoiceService } from '@/services/invoiceService';
import { Invoice, InvoiceStatus } from '@/models/Invoice';

const InvoiceList: React.FC = () => {
  const [activeTab, setActiveTab] = useState<InvoiceStatus | 'All'>('All');
  const [invoices, setInvoices] = useState<Invoice[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchInvoices = async () => {
      setLoading(true);
      try {
        const data = await invoiceService.getInvoices();
        setInvoices(data);
      } catch (error) {
        console.error('Error fetching invoices:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchInvoices();
  }, []);

  const getStatusStyle = (status: string) => {
    switch (status) {
      case 'Paid': return 'bg-success/10 text-success border-success/20';
      case 'Unpaid': return 'bg-warning/10 text-warning border-warning/20';
      case 'Overdue': return 'bg-error/10 text-error border-error/20';
      default: return 'bg-muted/10 text-muted border-muted/20';
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Paid': return <CheckCircle2 size={14} />;
      case 'Unpaid': return <Clock size={14} />;
      case 'Overdue': return <AlertCircle size={14} />;
      default: return null;
    }
  };

  const getStatusLabel = (status: string) => {
    switch (status) {
      case 'Paid': return 'Đã thanh toán';
      case 'Unpaid': return 'Chưa thanh toán';
      case 'Overdue': return 'Quá hạn';
      default: return status;
    }
  };

  const filteredInvoices = invoices.filter(inv => activeTab === 'All' || inv.status === activeTab);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải hóa đơn...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 font-bold">Hóa đơn</h2>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-xl shadow-sm"><Search size={20} className="text-muted" /></button>
          <button className="p-2 bg-white rounded-xl shadow-sm"><Filter size={20} className="text-muted" /></button>
        </div>
      </div>

      {/* Tabs */}
      <div className="flex p-1 bg-white rounded-2xl shadow-sm">
        {(['All', 'Unpaid', 'Paid', 'Overdue'] as const).map((tab) => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`flex-1 py-3 text-[11px] font-bold rounded-xl transition-all ${
              activeTab === tab ? 'bg-primary text-white shadow-md shadow-primary/20' : 'text-muted'
            }`}
          >
            {tab === 'All' ? 'Tất cả' : tab === 'Unpaid' ? 'Chưa trả' : tab === 'Paid' ? 'Đã trả' : 'Quá hạn'}
          </button>
        ))}
      </div>

      {/* Invoice List */}
      <div className="space-y-4">
        {filteredInvoices.length > 0 ? (
          filteredInvoices.map((inv) => (
            <div 
              key={inv.id}
              onClick={() => navigate(`/portal/invoices/${inv.id}`)}
              className="card-container p-5 bg-white border-none shadow-sm space-y-4 active:scale-95 transition-transform"
            >
              <div className="flex justify-between items-start">
                <div className="space-y-1">
                  <p className="text-[11px] font-bold text-muted uppercase tracking-wider">{inv.invoiceCode}</p>
                  <p className="text-body font-bold">Tháng {inv.period}</p>
                </div>
                <div className={`px-2 py-1 rounded-full text-[10px] font-bold flex items-center gap-1 border ${getStatusStyle(inv.status)}`}>
                  {getStatusIcon(inv.status)} {getStatusLabel(inv.status)}
                </div>
              </div>

              <div className="flex items-end justify-between pt-2 border-t border-muted/5">
                <div className="space-y-1">
                  <p className="text-[10px] text-muted font-medium">Hạn thanh toán: {inv.dueDate}</p>
                  <p className="text-h2 font-bold text-primary">{inv.totalAmount.toLocaleString()}đ</p>
                </div>
                <div className="flex items-center gap-1 text-[13px] font-bold text-primary">
                  Chi tiết <ArrowRight size={16} />
                </div>
              </div>
            </div>
          ))
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl opacity-50 space-y-2 border-2 border-dashed border-muted/10">
            <AlertCircle size={40} className="mx-auto text-muted" />
            <p className="text-body font-bold text-muted">Không có hóa đơn nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default InvoiceList;
