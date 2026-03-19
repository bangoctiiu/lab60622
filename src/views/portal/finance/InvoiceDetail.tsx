import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { ArrowLeft, Download, CreditCard, Phone, Share2, AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { invoiceService } from '@/services/invoiceService';
import { InvoiceDetail as IInvoiceDetail } from '@/models/Invoice';

const InvoiceDetail: React.FC = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [invoice, setInvoice] = useState<IInvoiceDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchDetail = async () => {
      if (!id) return;
      setLoading(true);
      try {
        const data = await invoiceService.getInvoiceDetail(id);
        setInvoice(data);
      } catch (error) {
        console.error('Error fetching invoice detail:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen bg-bg flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải chi tiết...</p>
      </div>
    );
  }

  if (!invoice) return null;

  const isUnpaid = invoice.status === 'Unpaid' || invoice.status === 'Overdue';

  return (
    <div className="min-h-screen bg-bg pb-24 animate-in fade-in slide-in-from-right-4 duration-500">
      {/* Fixed Top Bar */}
      <div className="sticky top-0 z-50 bg-bg/80 backdrop-blur-md px-4 py-4 flex items-center justify-between border-b border-muted/5">
        <button onClick={() => navigate(-1)} className="p-2 bg-white rounded-full shadow-sm">
          <ArrowLeft size={20} className="text-primary" />
        </button>
        <span className="text-body font-bold">Chi tiết hóa đơn</span>
        <div className="flex gap-2">
          <button className="p-2 bg-white rounded-full shadow-sm"><Download size={18} className="text-muted" /></button>
          <button className="p-2 bg-white rounded-full shadow-sm"><Share2 size={18} className="text-muted" /></button>
        </div>
      </div>

      <div className="p-4 space-y-6">
        {/* Status Header */}
        <div className="text-center space-y-3 py-6">
          <div className={`w-16 h-16 rounded-full flex items-center justify-center mx-auto shadow-sm border ${
            invoice.status === 'Paid' ? 'bg-success/10 text-success border-success/20' : 'bg-warning/10 text-warning border-warning/20'
          }`}>
            <CreditCard size={32} />
          </div>
          <div className="space-y-1">
            <h1 className="text-display font-bold">{invoice.totalAmount.toLocaleString()}đ</h1>
            <p className={`text-small font-bold uppercase tracking-widest ${
              invoice.status === 'Paid' ? 'text-success' : 'text-warning'
            }`}>
              {invoice.status === 'Paid' ? 'Đã thanh toán' : invoice.status === 'Unpaid' ? 'Chưa thanh toán' : 'Quá hạn'}
            </p>
          </div>
        </div>

        {/* Invoice Info */}
        <div className="card-container p-6 bg-white border-none shadow-sm space-y-4">
          <div className="flex justify-between items-center text-small">
            <span className="text-muted font-medium">Mã hóa đơn</span>
            <span className="font-bold">{invoice.invoiceCode}</span>
          </div>
          <div className="flex justify-between items-center text-small">
            <span className="text-muted font-medium">Kỳ hóa đơn</span>
            <span className="font-bold">Tháng {invoice.period}</span>
          </div>
          <div className="flex justify-between items-center text-small">
            <span className="text-muted font-medium">Ngày phát hành</span>
            <span className="font-bold">{invoice.createdAt}</span>
          </div>
          <div className="flex justify-between items-center text-small">
            <span className="text-muted font-medium">Hạn thanh toán</span>
            <span className={`font-bold uppercase ${invoice.status === 'Overdue' ? 'text-error' : ''}`}>{invoice.dueDate}</span>
          </div>
        </div>

        {/* Line Items */}
        <div className="space-y-3">
          <h3 className="text-small font-bold text-muted ml-1 uppercase">CHI TIẾT DỊCH VỤ</h3>
          <div className="card-container p-0 bg-white border-none shadow-sm overflow-hidden">
            {invoice.items.map((item, idx) => (
              <div key={item.id} className={`p-5 flex justify-between items-start ${idx < invoice.items.length - 1 ? 'border-b border-muted/5' : ''}`}>
                <div className="space-y-1">
                  <p className="text-body font-bold">{item.description}</p>
                  <p className="text-small text-muted">
                    {item.quantity}{item.type === 'Electricity' ? 'kWh' : item.type === 'Water' ? 'm3' : ''} x {item.unitPriceSnapshot.toLocaleString()}đ
                  </p>
                </div>
                <p className="text-body font-bold">{item.amount.toLocaleString()}đ</p>
              </div>
            ))}
            
            <div className="p-5 bg-bg flex justify-between items-center text-h3 font-bold border-t border-muted/10">
              <span>Tổng cộng</span>
              <span className="text-primary font-display">{invoice.totalAmount.toLocaleString()}đ</span>
            </div>
          </div>
        </div>

        {/* Note / Support */}
        <div className="p-4 bg-primary/5 rounded-2xl flex items-center gap-4 border border-primary/10">
          <div className="p-3 bg-white rounded-xl shadow-sm text-primary">
            <Phone size={20} />
          </div>
          <div className="flex-1">
            <p className="text-small font-bold">Cần hỗ trợ thanh toán?</p>
            <p className="text-[11px] text-muted">Liên hệ ngay hotline 1900 xxxx</p>
          </div>
        </div>
      </div>

      {/* Pay Button Sticky */}
      {isUnpaid && (
        <div className="fixed bottom-0 left-0 right-0 p-4 bg-white/80 backdrop-blur-md border-t border-muted/10">
          <Button className="w-full h-16 rounded-2xl bg-primary text-white text-h3 font-bold shadow-lg shadow-primary/25">
            THANH TOÁN NGAY
          </Button>
        </div>
      )}
    </div>
  );
};

export default InvoiceDetail;
