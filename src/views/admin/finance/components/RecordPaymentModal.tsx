import React, { useState, useEffect } from 'react';
import { 
  X, DollarSign, Calendar, FileText, 
  User, CreditCard, Wallet, Landmark,
  Camera, AlertCircle, Check, Info,
  ChevronRight, Calculator
} from 'lucide-react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { invoiceService } from '@/services/invoiceService';
import { paymentService } from '@/services/paymentService';
import { PaymentMethod, PaymentStatus } from '@/models/Payment';
import { Invoice } from '@/models/Invoice';
import { formatVND, cn } from '@/utils';
import { toast } from 'sonner';

interface RecordPaymentModalProps {
  onClose: () => void;
  initialInvoiceId?: string;
}

export const RecordPaymentModal = ({ onClose, initialInvoiceId }: RecordPaymentModalProps) => {
  const queryClient = useQueryClient();
  const [selectedInvoiceId, setSelectedInvoiceId] = useState(initialInvoiceId || '');
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('BankTransfer');
  const [txCode, setTxCode] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [showOverpaymentDialog, setShowOverpaymentDialog] = useState(false);

  // Queries
  const { data: invoices, isLoading: invoicesLoading } = useQuery({
    queryKey: ['unpaidInvoices'],
    queryFn: () => invoiceService.getInvoices()
  });

  const unpaidInvoices = invoices?.filter(i => i.status === 'Unpaid' || i.status === 'Overdue') || [];
  const selectedInvoice = unpaidInvoices.find(i => i.id === selectedInvoiceId);

  // Auto-generate TxCode for Cash
  useEffect(() => {
    if (method === 'Cash') {
      setTxCode(paymentService.generateCashCode());
    } else {
      setTxCode('');
    }
  }, [method]);

  // Set default amount when invoice is selected
  useEffect(() => {
    if (selectedInvoice) {
      setAmount(selectedInvoice.totalAmount - selectedInvoice.paidAmount);
    }
  }, [selectedInvoiceId, invoices]);

  const remaining = selectedInvoice ? (selectedInvoice.totalAmount - selectedInvoice.paidAmount) : 0;
  const balanceAfter = remaining - amount;

  const handleSubmit = (status: PaymentStatus) => {
    if (!selectedInvoiceId) {
      toast.error('Vui lòng chọn hóa đơn');
      return;
    }
    if (amount <= 0) {
      toast.error('Số tiền phải lớn hơn 0');
      return;
    }

    if (amount > remaining && !showOverpaymentDialog) {
      setShowOverpaymentDialog(true);
      return;
    }

    createMutation.mutate(status);
  };

  const createMutation = useMutation({
    mutationFn: (status: PaymentStatus) => paymentService.recordPayment({
      transactionCode: txCode || `TRX-${Date.now()}`,
      invoiceId: selectedInvoiceId,
      invoiceCode: selectedInvoice?.invoiceCode,
      tenantId: selectedInvoice?.tenantId || '',
      tenantName: selectedInvoice?.tenantName || '',
      amount: amount,
      method: method,
      status: status,
      paidAt: new Date(paidAt).toISOString(),
      note: note
    }),
    onSuccess: () => {
      toast.success('Đã ghi nhận thanh toán');
      queryClient.invalidateQueries({ queryKey: ['payments'] });
      queryClient.invalidateQueries({ queryKey: ['pendingPayments'] });
      onClose();
    }
  });

  return (
    <div className="fixed inset-0 z-[110] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/30 backdrop-blur-md" onClick={onClose}></div>
      <div className="relative w-full max-w-4xl bg-white rounded-[48px] shadow-2xl overflow-hidden animate-in zoom-in-95 duration-500 border border-white/50 flex flex-col md:flex-row">
        
        {/* Left Side: Form */}
        <div className="flex-1 p-10 space-y-8 overflow-y-auto max-h-[90vh]">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
               <div className="w-12 h-12 bg-primary text-white rounded-2xl flex items-center justify-center shadow-lg shadow-primary/20">
                  <DollarSign size={24} />
               </div>
               <div>
                  <h2 className="text-h2 text-primary">Ghi nhận Thanh toán</h2>
                  <p className="text-[11px] text-muted font-black uppercase tracking-widest">Thủ công / Admin Recorded</p>
               </div>
            </div>
            <button onClick={onClose} className="p-2 hover:bg-bg rounded-full transition-all md:hidden">
              <X size={24} />
            </button>
          </div>

          <div className="grid grid-cols-1 gap-6">
            <div className="space-y-1.5">
               <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Chọn hóa đơn</label>
               <select 
                className="input-base w-full h-14 bg-bg/30 font-bold"
                value={selectedInvoiceId}
                onChange={(e) => setSelectedInvoiceId(e.target.value)}
               >
                 <option value="">-- Chọn hóa đơn chưa thanh toán --</option>
                 {unpaidInvoices.map(inv => (
                   <option key={inv.id} value={inv.id}>
                     {inv.invoiceCode} - {inv.tenantName} ({formatVND(inv.totalAmount - inv.paidAmount)})
                   </option>
                 ))}
               </select>
            </div>

            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Số tiền thanh toán</label>
                <div className="relative">
                  <input 
                    type="number" 
                    className="input-base w-full h-14 pl-12 text-h4 font-black text-secondary"
                    value={amount}
                    onChange={(e) => setAmount(Number(e.target.value))}
                  />
                  <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Ngày giờ thanh toán</label>
                <div className="relative">
                  <input 
                    type="datetime-local" 
                    className="input-base w-full h-14 pl-12 font-bold"
                    value={paidAt}
                    onChange={(e) => setPaidAt(e.target.value)}
                  />
                  <Calendar className="absolute left-4 top-1/2 -translate-y-1/2 text-muted" size={20} />
                </div>
              </div>
            </div>

            <div className="space-y-3">
               <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Phương thức thanh toán</label>
               <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
                 {(['Cash', 'BankTransfer', 'VNPay', 'Momo', 'ZaloPay'] as PaymentMethod[]).map(m => (
                   <button 
                    key={m}
                    onClick={() => setMethod(m)}
                    className={cn(
                      "flex flex-col items-center justify-center p-3 rounded-2xl border-2 transition-all gap-1",
                      method === m ? "border-primary bg-primary/5 shadow-md shadow-primary/5" : "border-border/50 hover:border-primary/30"
                    )}
                   >
                     {m === 'Cash' && <Wallet size={20} className="text-orange-500" />}
                     {m === 'BankTransfer' && <Landmark size={20} className="text-blue-500" />}
                     {m === 'VNPay' && <div className="w-5 h-5 bg-blue-600 rounded flex items-center justify-center text-[8px] text-white font-bold">VN</div>}
                     {m === 'Momo' && <div className="w-5 h-5 bg-pink-500 rounded flex items-center justify-center text-[8px] text-white font-bold">M</div>}
                     {m === 'ZaloPay' && <div className="w-5 h-5 bg-blue-400 rounded flex items-center justify-center text-[8px] text-white font-bold">Z</div>}
                     <span className="text-[9px] font-black uppercase tracking-tighter">{m}</span>
                   </button>
                 ))}
               </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-[10px] font-black text-muted uppercase tracking-widest ml-1">Mã giao dịch / Ghi chú</label>
              <input 
                type="text" 
                placeholder="Nhập mã giao dịch đối soát..." 
                className="input-base w-full h-12 bg-bg/30 font-mono"
                value={txCode}
                onChange={(e) => setTxCode(e.target.value)}
              />
              <textarea 
                className="input-base w-full mt-2 bg-bg/30 p-4 min-h-[80px]" 
                placeholder="Ghi chú thêm về giao dịch này..."
                value={note}
                onChange={(e) => setNote(e.target.value)}
              />
            </div>
          </div>
        </div>

        {/* Right Side: Live Preview */}
        <div className="w-full md:w-[360px] bg-bg/50 border-l border-border/50 p-10 flex flex-col justify-between">
          <div className="space-y-8">
            <div className="flex items-center gap-2 text-primary font-black uppercase tracking-widest text-[11px]">
               <Calculator size={16} /> Live Financial Preview
            </div>

            <div className="space-y-6">
               <div className="space-y-1">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Tổng hóa đơn</p>
                  <p className="text-h4 font-black">{formatVND(selectedInvoice?.totalAmount || 0)}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Đã thu trước đó</p>
                  <p className="text-h4 font-black text-success">{formatVND(selectedInvoice?.paidAmount || 0)}</p>
               </div>
               <div className="h-px bg-border/50"></div>
               <div className="space-y-1 scale-110 origin-left">
                  <p className="text-[10px] text-muted font-black uppercase tracking-widest text-primary">Thanh toán này</p>
                  <p className="text-h3 font-black text-primary">{formatVND(amount)}</p>
               </div>
               <div className="space-y-1">
                  <p className="text-[10px] text-muted font-bold uppercase tracking-widest">Còn lại sau GD</p>
                  <p className={cn(
                    "text-h4 font-black",
                    balanceAfter < 0 ? "text-secondary" : balanceAfter === 0 ? "text-success" : "text-muted"
                  )}>
                    {formatVND(balanceAfter)}
                  </p>
               </div>
            </div>

            {balanceAfter < 0 && (
              <div className="p-4 bg-secondary/10 border border-secondary/20 rounded-2xl flex items-start gap-3 animate-in fade-in slide-in-from-bottom-2">
                 <AlertCircle size={18} className="text-secondary shrink-0" />
                 <div>
                    <p className="text-[11px] font-black text-secondary uppercase tracking-tight">Cảnh báo dư thừa</p>
                    <p className="text-[10px] text-secondary/80 font-medium">Số tiền nạp vượt quá số dư hóa đơn. Phần dư sẽ được cộng vào ví cư dân.</p>
                 </div>
              </div>
            )}
          </div>

          <div className="space-y-3 pt-8">
             <button 
              onClick={() => handleSubmit('Pending')}
              className="btn-outline w-full py-4 rounded-2xl border-2 font-bold flex items-center justify-center gap-2 border-primary/30 text-primary hover:bg-primary/5"
             >
                Lưu nháp (Pending)
             </button>
             <button 
              onClick={() => handleSubmit('Confirmed')}
              className="btn-primary w-full py-5 rounded-2xl bg-secondary hover:bg-secondary-dark border-none shadow-xl shadow-secondary/20 font-black uppercase tracking-widest text-small"
             >
                Xác nhận ngay
             </button>
          </div>
        </div>

        {/* Overpayment Dialog */}
        {showOverpaymentDialog && (
          <div className="fixed inset-0 z-[120] flex items-center justify-center p-4">
            <div className="absolute inset-0 bg-secondary/20 backdrop-blur-md"></div>
            <div className="relative w-full max-w-sm bg-white rounded-[40px] shadow-2xl p-10 text-center space-y-6">
               <div className="w-20 h-20 bg-secondary/10 text-secondary rounded-full flex items-center justify-center mx-auto shadow-inner">
                  <DollarSign size={40} />
               </div>
               <div className="space-y-2">
                  <h3 className="text-h3 font-black text-primary tracking-tight">Thanh toán dư!</h3>
                  <p className="text-[13px] text-muted font-medium">Bạn đang thu nhiều hơn số tiền hóa đơn. Bạn muốn xử lý phần dư {formatVND(Math.abs(balanceAfter))} như thế nào?</p>
               </div>
               <div className="flex flex-col gap-3">
                  <button 
                    onClick={() => {
                      setShowOverpaymentDialog(false);
                      createMutation.mutate('Confirmed');
                    }}
                    className="btn-primary w-full py-4 bg-secondary hover:bg-secondary-dark border-none font-black text-small"
                  >
                    Bù vào ví cư dân
                  </button>
                  <button 
                    onClick={() => {
                      setAmount(remaining);
                      setShowOverpaymentDialog(false);
                    }}
                    className="btn-outline w-full py-4 border-2 font-bold"
                  >
                    Giảm về đúng số còn lại
                  </button>
               </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};
