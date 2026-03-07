import React, { useState, useEffect } from 'react';
import { 
  X, CreditCard, DollarSign, AlertCircle, 
  CheckCircle2, Info, ArrowRight, Wallet,
  Landmark, Smartphone, Upload, Calculator,
  Zap, Save, CheckCircle
} from 'lucide-react';
import { cn, formatVND } from '@/utils';
import { toast } from 'sonner';
import { paymentService } from '@/services/paymentService';
import { PaymentMethod } from '@/models/Payment';

interface RecordPaymentModalProps {
  isOpen: boolean;
  onClose: () => void;
  invoice: {
    id: string;
    invoiceCode: string;
    totalAmount: number;
    paidAmount: number;
    roomCode?: string;
    tenantName?: string;
  } | null;
}

export const RecordPaymentModal = ({ isOpen, onClose, invoice }: RecordPaymentModalProps) => {
  const [amount, setAmount] = useState<number>(0);
  const [method, setMethod] = useState<PaymentMethod>('BankTransfer');
  const [txCode, setTxCode] = useState('');
  const [paidAt, setPaidAt] = useState(new Date().toISOString().slice(0, 16));
  const [note, setNote] = useState('');
  const [step, setStep] = useState(1); // 1: Input, 2: Overpayment Resolve
  
  // Set default amount and generate code
  useEffect(() => {
    if (invoice && isOpen) {
      setAmount(invoice.totalAmount - invoice.paidAmount);
      if (method === 'Cash') {
        setTxCode(paymentService.generateCashCode());
      } else {
        setTxCode('');
      }
    }
  }, [invoice, isOpen, method]);

  if (!isOpen || !invoice) return null;

  const remaining = invoice.totalAmount - invoice.paidAmount;
  const balanceAfter = remaining - amount;

  const handleSubmit = (isConfirmed: boolean) => {
    // 4.2 Overpayment: if Amount > remaining -> dialog (Checklist #1)
    if (amount > remaining && step === 1) {
      setStep(2);
      return;
    }

    // Actual submission logic
    toast.success(`Đã ${isConfirmed ? 'xác nhận' : 'lưu nháp'} thanh toán ${formatVND(amount)}`);
    onClose();
    setStep(1);
  };

  const methods: { id: PaymentMethod; label: string; icon: any }[] = [
    { id: 'Cash', label: 'Tiền mặt', icon: <Wallet size={20} /> },
    { id: 'BankTransfer', label: 'Chuyển khoản', icon: <Landmark size={20} /> },
    { id: 'VNPay', label: 'VNPay', icon: <Smartphone size={20} /> },
    { id: 'Momo', label: 'Momo', icon: <Zap size={20} /> },
  ];

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-primary/20 backdrop-blur-sm shadow-2xl" onClick={onClose}></div>
      
      <div className="relative w-full max-w-4xl bg-white rounded-[40px] shadow-2xl overflow-hidden flex flex-col md:flex-row animate-in zoom-in-95 duration-300">
        {/* Left: Form */}
        <div className="flex-1 p-8 space-y-6">
          <div className="flex items-center justify-between">
             <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-primary/10 text-primary rounded-2xl flex items-center justify-center">
                   <CreditCard size={24} />
                </div>
                <div>
                   <h2 className="text-h2 text-primary">Ghi nhận thanh toán</h2>
                   <p className="text-small text-muted font-bold uppercase tracking-wider">Hợp đồng: {invoice.invoiceCode}</p>
                </div>
             </div>
             <button onClick={onClose} className="p-2 hover:bg-bg rounded-md transition-all md:hidden">
               <X size={20} />
             </button>
          </div>

          {step === 1 ? (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 animate-in fade-in slide-in-from-left-4 duration-300">
               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-label text-muted">Số tiền thanh toán</label>
                    <div className="relative">
                      <DollarSign className="absolute left-4 top-1/2 -translate-y-1/2 text-primary" size={20} />
                      <input 
                        type="number" 
                        className="input-base w-full pl-12 py-3 text-lg font-display font-black text-secondary" 
                        value={amount}
                        onChange={(e) => setAmount(Number(e.target.value))}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label text-muted">Phương thức</label>
                    <div className="grid grid-cols-2 gap-2">
                       {methods.map((m) => (
                         <button 
                           key={m.id}
                           onClick={() => setMethod(m.id)}
                           className={cn(
                             "flex items-center gap-2 p-3 rounded-xl border transition-all text-small font-bold",
                             method === m.id ? "bg-primary text-white border-primary shadow-lg shadow-primary/20" : "hover:bg-bg border-border/50 text-muted"
                           )}
                         >
                            {m.icon} {m.label}
                         </button>
                       ))}
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label text-muted">Mã giao dịch (TxCode)</label>
                    <input 
                      className="input-base w-full font-mono text-small" 
                      placeholder="Nhập mã tham chiếu từ NH..." 
                      value={txCode}
                      onChange={(e) => setTxCode(e.target.value)}
                    />
                    {method === 'Cash' && <p className="text-[10px] text-success font-bold italic">* Đã tự động tạo mã CASH</p>}
                  </div>
               </div>

               <div className="space-y-4">
                  <div className="space-y-2">
                    <label className="text-label text-muted">Thời điểm thanh toán</label>
                    <input 
                      type="datetime-local" 
                      className="input-base w-full text-small" 
                      value={paidAt}
                      onChange={(e) => setPaidAt(e.target.value)}
                    />
                  </div>

                  <div className="space-y-2">
                    <label className="text-label text-muted">Minh chứng (Ảnh/PDF)</label>
                    <div className="border-2 border-dashed border-border p-4 rounded-2xl flex flex-col items-center justify-center gap-2 hover:border-primary/50 cursor-pointer transition-all bg-bg/20">
                       <Upload size={20} className="text-muted" />
                       <span className="text-[10px] text-muted font-bold">Thả ảnh vào đây hoặc Click để chọn</span>
                    </div>
                  </div>

                  <div className="space-y-2">
                    <label className="text-label text-muted">Ghi chú</label>
                    <textarea 
                      className="input-base w-full min-h-[80px] text-small" 
                      placeholder="VD: Cư dân nộp giúp, thanh toán qua app..."
                      value={note}
                      onChange={(e) => setNote(e.target.value)}
                    />
                  </div>
               </div>
            </div>
          ) : (
            <div className="animate-in zoom-in-95 duration-300 py-10">
               <div className="w-16 h-16 bg-warning/10 text-warning rounded-full flex items-center justify-center mx-auto mb-6">
                  <AlertCircle size={32} />
               </div>
               <div className="text-center space-y-4">
                  <h3 className="text-h3 text-primary">Phát hiện thanh toán dư!</h3>
                  <p className="text-body text-muted px-10">
                    Bạn đang ghi nhận <strong>{formatVND(amount)}</strong> cho số nợ còn lại <strong>{formatVND(remaining)}</strong>.
                    Phần dư <strong>{formatVND(amount - remaining)}</strong> sẽ được xử lý như thế nào?
                  </p>
                  <div className="flex flex-col gap-3 max-w-sm mx-auto pt-4">
                     <button 
                       onClick={() => handleSubmit(true)}
                       className="flex items-center justify-between p-4 bg-primary/5 border border-primary/20 rounded-2xl hover:bg-primary/10 transition-all group"
                     >
                        <span className="text-small font-bold text-primary">Cộng vào ví cư dân (Credit)</span>
                        <ArrowRight size={16} className="text-primary group-hover:translate-x-1 transition-transform" />
                     </button>
                     <button 
                       onClick={() => { setAmount(remaining); setStep(1); }}
                       className="flex items-center justify-between p-4 bg-bg border border-border rounded-2xl hover:bg-border/50 transition-all group"
                     >
                        <span className="text-small font-bold text-muted">Chỉ thu khớp nợ ({formatVND(remaining)})</span>
                        <ArrowRight size={16} className="text-muted group-hover:translate-x-1 transition-transform" />
                     </button>
                  </div>
               </div>
            </div>
          )}
        </div>

        {/* Right: Live Preview (Checklist item) */}
        <div className="w-full md:w-80 bg-slate-900 p-8 text-white space-y-8">
           <div className="flex items-center justify-between">
              <h3 className="text-[12px] font-black uppercase tracking-[3px] text-slate-400">Xem trước</h3>
              <Calculator size={18} className="text-slate-400" />
           </div>

           <div className="space-y-6">
              <div className="space-y-4">
                 <div className="flex justify-between text-small">
                    <span className="text-slate-400">Phòng</span>
                    <span className="font-bold">{invoice.roomCode || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between text-small">
                    <span className="text-slate-400">Cư dân</span>
                    <span className="font-bold">{invoice.tenantName || 'N/A'}</span>
                 </div>
                 <div className="flex justify-between text-small">
                    <span className="text-slate-400">Tổng hóa đơn</span>
                    <span className="font-bold">{formatVND(invoice.totalAmount)}</span>
                 </div>
                 <div className="flex justify-between text-small">
                    <span className="text-slate-400">Đã thanh toán</span>
                    <span className="font-bold text-success">{formatVND(invoice.paidAmount)}</span>
                 </div>
              </div>

              <div className="py-6 border-t border-white/10 space-y-4">
                 <div className="flex justify-between">
                    <span className="text-small text-slate-400">Giao dịch này</span>
                    <span className="text-lg font-black text-secondary">{formatVND(amount)}</span>
                 </div>
                 <div className="flex justify-between">
                    <span className="text-small text-slate-400">Còn lại sau đó</span>
                    <span className={cn(
                      "text-lg font-black",
                      balanceAfter <= 0 ? "text-success" : "text-danger"
                    )}>
                      {formatVND(Math.max(0, balanceAfter))}
                    </span>
                 </div>
              </div>

              {balanceAfter < 0 && (
                <div className="p-4 bg-blue-500/20 border border-blue-500/30 rounded-2xl flex items-start gap-3 animate-in shake duration-500">
                   <Info size={16} className="text-blue-400 mt-1" />
                   <div className="space-y-1">
                      <p className="text-[10px] font-bold text-blue-200 uppercase">Thanh toán dư</p>
                      <p className="text-[11px] text-blue-100/80">Số dư khả dụng của cư dân sẽ tăng thêm <strong>{formatVND(Math.abs(balanceAfter))}</strong>.</p>
                   </div>
                </div>
              )}
           </div>

           <div className="space-y-3 pt-4">
              <button 
                onClick={() => handleSubmit(false)}
                className="w-full py-4 rounded-2xl bg-white/10 hover:bg-white/20 text-white text-small font-bold flex items-center justify-center gap-2 transition-all"
              >
                <Save size={18} /> Lưu nháp (Pending)
              </button>
              <button 
                onClick={() => handleSubmit(true)}
                className="w-full py-4 rounded-2xl bg-secondary hover:bg-secondary/90 text-white text-small font-black flex items-center justify-center gap-2 shadow-xl shadow-secondary/20 transition-all"
              >
                <CheckCircle size={18} /> Xác nhận ngay
              </button>
           </div>
        </div>
      </div>
    </div>
  );
};
