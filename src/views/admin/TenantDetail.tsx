import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  User, Phone, Mail, MapPin, 
  ShieldCheck, CreditCard, FileText, 
  MessageSquare, LayoutList, ChevronRight,
  Plus, ExternalLink, MoreVertical, 
  Smartphone, Briefcase, Globe, 
  Calendar, AlertCircle, CheckCircle2,
  Trash2, Edit, TrendingUp, Star,
  DollarSign, Wallet, History,
  ArrowRight, Heart, Eye, EyeOff
} from 'lucide-react';
import ReactConfetti from 'react-confetti';
import { tenantService } from '@/services/tenantService';
import { 
  TenantProfile, EmergencyContact, 
  OnboardingProgress, TenantFeedback, 
  NPSSurvey 
} from '@/models/Tenant';
import { cn, maskCCCD, maskPhone, calculateAge, formatDate, formatVND } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { usePermission } from '@/hooks/usePermission';
import { toast } from 'sonner';

type TabType = 'Ho so' | 'Lien he' | 'Hop dong' | 'Hoa don' | 'Vi' | 'Phan hoi' | 'Onboarding';

const TenantDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const canViewPII = hasPermission('tenant.view_pii');
  
  const [activeTab, setActiveTab] = useState<TabType>('Ho so');
  const [showSensitive, setShowSensitive] = useState(false);
  const [showConfetti, setShowConfetti] = useState(false);
  const [windowSize, setWindowSize] = useState({ width: window.innerWidth, height: window.innerHeight });

  useEffect(() => {
    const handleResize = () => setWindowSize({ width: window.innerWidth, height: window.innerHeight });
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Queries
  const { data: profile, isLoading: loadingProfile } = useQuery<TenantProfile>({
    queryKey: ['tenant-profile', id],
    queryFn: () => tenantService.getTenantDetail(id!),
    enabled: !!id
  });

  const { data: contacts } = useQuery<EmergencyContact[]>({
    queryKey: ['tenant-contacts', id],
    queryFn: () => tenantService.getEmergencyContacts(id!),
    enabled: activeTab === 'Lien he'
  });

  const { data: onboarding, refetch: refetchOnboarding } = useQuery<OnboardingProgress>({
    queryKey: ['tenant-onboarding', id],
    queryFn: () => tenantService.getOnboardingProgress(id!),
    enabled: activeTab === 'Onboarding'
  });

  const { data: feedback } = useQuery<TenantFeedback[]>({
    queryKey: ['tenant-feedback', id],
    queryFn: () => tenantService.getFeedback(id!),
    enabled: activeTab === 'Phan hoi'
  });

  const { data: nps } = useQuery<NPSSurvey[]>({
    queryKey: ['tenant-nps', id],
    queryFn: () => tenantService.getNPSSurveys(id!),
    enabled: activeTab === 'Phan hoi'
  });


  // Checklist #4: Onboarding Confetti
  const handleOnboardingAction = (key: string) => {
    toast.success(`Đã cập nhật bước: ${key}`);
    // Simulated confetti if reached 100%
    if (onboarding && (onboarding.completionPercent >= 80 || key === 'isRoomHandovered')) {
      setShowConfetti(true);
      toast.success('CHÚC MỪNG! Quy trình Onboarding đã hoàn tất 100%.', {
        description: 'Dữ liệu cư dân đã được đồng bộ vào Ledger bảo mật.',
        icon: <CheckCircle2 className="text-success" />,
        duration: 8000
      });
      setTimeout(() => setShowConfetti(false), 8000);
    }
  };

  const getNPSColor = (score: number) => {
    if (score >= 9) return 'text-success';
    if (score >= 7) return 'text-warning';
    return 'text-danger';
  };

  if (loadingProfile || !profile) {
    return (
      <div className="h-[80vh] flex flex-col items-center justify-center gap-4">
        <Spinner />
        <p className="text-label text-muted font-bold animate-pulse uppercase tracking-[3px]">Carregando Perfil...</p>
      </div>
    );
  }

  return (
    <div className="space-y-8 animate-in fade-in duration-700 relative">
      {showConfetti && (
        <ReactConfetti
          width={windowSize.width}
          height={windowSize.height}
          recycle={false}
          numberOfPieces={500}
        />
      )}

      {/* 3.2 Page Header (Mobile-first feel) */}
      <div className="flex flex-col lg:flex-row gap-8 items-start lg:items-end">
        <div className="relative group">
           <img 
            src={profile.avatarUrl} 
            className="w-32 h-32 rounded-[40px] object-cover shadow-2xl border-4 border-white group-hover:scale-105 transition-transform duration-500" 
            alt={profile.fullName} 
           />
           <div className="absolute inset-0 bg-black/40 rounded-[40px] opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity cursor-pointer">
              <span className="text-white text-[10px] font-black uppercase tracking-widest">Đổi ảnh</span>
           </div>
        </div>

        <div className="flex-1 space-y-3">
          <div className="flex flex-wrap items-center gap-3">
            <h1 className="text-display text-primary tracking-tighter">{profile.fullName}</h1>
            <StatusBadge status={profile.status} size="sm" className="shadow-lg" />
            <span className="text-body font-bold text-muted bg-bg px-3 py-1 rounded-full">{calculateAge(profile.dateOfBirth)}</span>
          </div>
          
          <div className="flex flex-wrap gap-6 text-small font-medium text-muted">
            <span className="flex items-center gap-2"><Phone size={14} className="text-primary" /> {profile.phone}</span>
            <span className="flex items-center gap-2"><Mail size={14} className="text-primary" /> {profile.email || 'N/A'}</span>
            <span className="flex items-center gap-2"><MapPin size={14} className="text-primary" /> {profile.currentRoomCode || 'Chưa nhận phòng'}</span>
          </div>
        </div>

        <div className="flex gap-3">
          <button className="btn-outline-sm flex items-center gap-2" onClick={() => navigate(-1)}>
             Quay lại
          </button>
          <button className="btn-primary flex items-center gap-2 px-6 shadow-xl shadow-primary/20">
             <Edit size={16} /> Chỉnh sửa
          </button>
        </div>
      </div>

      {/* 3.2.1 Tab Navigation */}
      <div className="border-b border-border/20 flex flex-nowrap overflow-x-auto no-scrollbar gap-8">
        {(['Ho so', 'Lien he', 'Hop dong', 'Hoa don', 'Vi', 'Phan hoi', 'Onboarding'] as TabType[]).map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={cn(
              "pb-4 text-[11px] font-black uppercase tracking-[2px] transition-all whitespace-nowrap relative",
              activeTab === tab ? "text-primary opacity-100" : "text-muted opacity-50 hover:opacity-80"
            )}
          >
            {tab}
            {activeTab === tab && (
              <div className="absolute bottom-0 left-0 right-0 h-1 bg-primary rounded-full animate-in slide-in-from-bottom-1" />
            )}
          </button>
        ))}
      </div>

      {/* Tab Contents */}
      <div className="min-h-[500px]">
        {activeTab === 'Ho so' && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
             <div className="lg:col-span-8 space-y-8">
                <div className="card-container p-8 bg-white/60">
                   <h3 className="text-label text-muted font-black uppercase tracking-widest mb-6">Thông tin cá nhân</h3>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Họ và tên</p>
                         <p className="text-body font-bold text-primary">{profile.fullName}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Giới tính</p>
                         <StatusBadge className="!capitalize !bg-primary/5 !text-primary !py-1" status={profile.gender} />
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Ngày sinh</p>
                         <p className="text-body font-bold text-primary">{formatDate(profile.dateOfBirth)}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Quốc tịch</p>
                         <p className="text-body font-bold text-primary flex items-center gap-2">🇻🇳 {profile.nationality}</p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Nghề nghiệp</p>
                         <p className="text-body font-bold text-primary">{profile.occupation}</p>
                      </div>
                   </div>
                </div>

                <div className="card-container p-8 bg-white/60">
                   <div className="flex justify-between items-center mb-6">
                      <h3 className="text-label text-muted font-black uppercase tracking-widest">Định danh (CCCD/Passport)</h3>
                      {canViewPII && (
                        <button 
                          onClick={() => setShowSensitive(!showSensitive)}
                          className="text-primary hover:underline text-[11px] font-black uppercase flex items-center gap-2"
                        >
                          {showSensitive ? <EyeOff size={14} /> : <Eye size={14} />} {showSensitive ? 'Ẩn' : 'Xem chi tiết'}
                        </button>
                      )}
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 gap-x-12 gap-y-8">
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Số định danh</p>
                         <p className="text-h2 font-black text-primary font-mono tracking-tighter">
                            {showSensitive ? profile.cccd : maskCCCD(profile.cccd)}
                         </p>
                      </div>
                      <div className="space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Ngày cấp</p>
                         <p className="text-body font-bold text-primary">{formatDate(profile.cccdIssuedDate)}</p>
                      </div>
                      <div className="col-span-full space-y-1">
                         <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Nơi cấp</p>
                         <p className="text-body font-bold text-primary">{profile.cccdIssuedPlace}</p>
                      </div>
                   </div>
                </div>
             </div>

             <div className="lg:col-span-4 space-y-8">
                <div className="card-container p-8 bg-slate-900 text-white overflow-hidden relative">
                   <div className="relative z-10 space-y-6">
                      <h3 className="text-label text-slate-500 font-black uppercase tracking-widest">Phương tiện vận chuyển</h3>
                      <div className="flex flex-wrap gap-2">
                         {profile.vehiclePlates.map((plate, idx) => (
                           <span key={idx} className="px-3 py-1.5 bg-white/10 text-white text-[12px] font-mono font-bold rounded-lg border border-white/20">
                              {plate}
                           </span>
                         ))}
                         {profile.vehiclePlates.length === 0 && <span className="text-slate-500 italic">Không có phương tiện</span>}
                      </div>
                      <button className="w-full py-3 bg-white/10 hover:bg-white/20 text-[10px] font-black uppercase tracking-widest rounded-xl transition-all border border-white/10">
                         + Thêm biển số
                      </button>
                   </div>
                   <CreditCard size={120} className="absolute -bottom-10 -right-10 text-white/5 rotate-12" />
                </div>

                <div className="card-container p-8 border-dashed border-2 border-border/50 bg-transparent">
                   <h3 className="text-label text-muted font-black uppercase tracking-widest mb-4">Ghi chú nội bộ</h3>
                   <p className="text-small text-muted italic leading-relaxed">
                      {profile.notes || 'Chưa có ghi chú nào cho cư dân này.'}
                   </p>
                </div>
             </div>
          </div>
        )}
         {activeTab === 'Hop dong' && (
           <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="card-container p-8 border-l-4 border-primary">
                 <div className="flex justify-between items-start mb-8">
                    <div>
                       <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Hợp đồng thuê hiện tại</h3>
                       <p className="text-[10px] text-muted font-bold uppercase mt-1 tracking-tighter">Mã HD: CON-MAN-123456</p>
                    </div>
                    <StatusBadge status="Active" size="sm" />
                 </div>
                 <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Thời hạn</p>
                       <p className="text-body font-bold text-primary">12 Tháng (01/01/2024 - 01/01/2025)</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Giá thuê snapshot</p>
                       <p className="text-body font-bold text-success font-mono">15.000.000 VND / Tháng</p>
                    </div>
                    <div className="space-y-1">
                       <p className="text-[10px] text-muted font-black uppercase tracking-tighter">Phòng</p>
                       <button className="px-3 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg border border-primary/10">34.05 - The Manor</button>
                    </div>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'Hoa don' && (
           <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="card-container p-0 overflow-hidden">
                 <div className="p-6 border-b bg-bg/30 text-label text-muted font-black uppercase">Recent Invoices</div>
                 <div className="overflow-x-auto">
                    <table className="w-full text-left">
                       <thead className="bg-bg/50 border-b text-[9px] font-black uppercase text-muted tracking-widest">
                          <tr>
                             <th className="px-6 py-4">Mã HD</th>
                             <th className="px-6 py-4">Số tiền</th>
                             <th className="px-6 py-4">Trạng thái</th>
                          </tr>
                       </thead>
                       <tbody className="divide-y divide-border/10">
                          <tr className="hover:bg-bg/20 cursor-pointer" onClick={() => navigate(`/invoices/INV1`)}>
                             <td className="px-6 py-4 font-bold text-primary">INV/2024/001</td>
                             <td className="px-6 py-4 font-mono font-black text-primary">{formatVND(3500000)}</td>
                             <td className="px-6 py-4"><StatusBadge status="Pending" size="sm" /></td>
                          </tr>
                       </tbody>
                    </table>
                 </div>
              </div>
           </div>
         )}

         {activeTab === 'Vi' && (
           <div className="space-y-8 animate-in slide-in-from-right-4 duration-500">
              <div className="card-container p-10 bg-slate-900 border-none relative overflow-hidden group">
                 <div className="relative z-10">
                    <p className="text-[11px] text-white/50 font-black uppercase tracking-widest mb-2">Số dư Ledger hiện hữu</p>
                    <h2 className="text-[48px] font-display font-black text-white tracking-tighter leading-none">
                       {formatVND(24500000)}
                    </h2>
                 </div>
              </div>
           </div>
         )}

        {activeTab === 'Lien he' && (
          <div className="space-y-8">
             <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="card-container p-8 bg-primary/5 border-primary/10">
                   <h3 className="text-label text-primary font-black mb-6">Liên hệ chính</h3>
                   <div className="space-y-6">
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-primary">
                            <Phone size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] text-muted font-black uppercase">Điện thoại</p>
                            <a href={`tel:${profile.phone}`} className="text-h3 font-black text-primary hover:underline">{profile.phone}</a>
                         </div>
                      </div>
                      <div className="flex items-center gap-4">
                         <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-primary">
                            <Mail size={24} />
                         </div>
                         <div>
                            <p className="text-[10px] text-muted font-black uppercase">Email</p>
                            <a href={`mailto:${profile.email}`} className="text-h3 font-black text-primary hover:underline">{profile.email || 'N/A'}</a>
                         </div>
                      </div>
                   </div>
                </div>

                <div className="card-container p-8 bg-secondary/5 border-secondary/10">
                   <h3 className="text-label text-secondary font-black mb-6">Địa chỉ thường trú</h3>
                   <div className="flex gap-4">
                      <div className="w-12 h-12 bg-white rounded-2xl flex items-center justify-center shadow-md text-secondary">
                         <MapPin size={24} />
                      </div>
                      <p className="text-body font-bold text-primary leading-relaxed">
                         {profile.permanentAddress}
                      </p>
                   </div>
                </div>
             </div>

             <div className="card-container overflow-hidden p-0">
                <div className="p-6 border-b flex justify-between items-center bg-bg/30">
                   <h3 className="text-label text-muted font-black">Danh bạ khẩn cấp (Emergency)</h3>
                   <button className="text-primary text-[11px] font-black uppercase hover:underline">+ Thêm liên hệ</button>
                </div>
                <div className="overflow-x-auto">
                   <table className="w-full text-left">
                      <thead className="bg-bg/50 text-[10px] font-black uppercase text-muted tracking-widest border-b">
                         <tr>
                            <th className="px-8 py-4">Người liên hệ</th>
                            <th className="px-8 py-4">Mối quan hệ</th>
                            <th className="px-8 py-4">Số điện thoại</th>
                            <th className="px-8 py-4">Loại</th>
                            <th className="px-8 py-4 text-right">Thao tác</th>
                         </tr>
                      </thead>
                      <tbody className="divide-y divide-border/20">
                         {contacts?.map(contact => (
                           <tr key={contact.id} className="hover:bg-bg/20">
                              <td className="px-8 py-5 font-bold text-primary">{contact.contactName}</td>
                              <td className="px-8 py-5">
                                  <StatusBadge className="!bg-bg !text-muted !capitalize" status={contact.relationship} />
                              </td>
                              <td className="px-8 py-5 font-mono font-bold text-muted">{contact.phone}</td>
                              <td className="px-8 py-5">
                                 {contact.isPrimary && <span className="px-2 py-1 bg-success/10 text-success text-[10px] font-black rounded uppercase">Chính</span>}
                              </td>
                              <td className="px-8 py-5 text-right space-x-2">
                                <button className="p-2 hover:bg-bg rounded-lg text-muted transition-all"><Edit size={14} /></button>
                                <button className="p-2 hover:bg-bg rounded-lg text-danger transition-all"><Trash2 size={14} /></button>
                              </td>
                           </tr>
                         ))}
                      </tbody>
                   </table>
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Phan hoi' && (
          <div className="space-y-12">
             {/* NPS Overview */}
             <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
                <div className="lg:col-span-4 card-container p-10 bg-gradient-to-br from-primary to-primary/80 text-white flex flex-col items-center justify-center text-center">
                   <div className="w-24 h-24 rounded-full border-4 border-white/20 flex items-center justify-center mb-6">
                      <span className="text-display font-black">9.2</span>
                   </div>
                   <h3 className="text-h3 font-black tracking-widest mb-2">Chỉ số NPS</h3>
                   <p className="text-small text-white/60 mb-8 italic">Average score from 5 surveys</p>
                   <div className="w-full h-2 bg-white/10 rounded-full overflow-hidden">
                      <div className="h-full bg-success w-[92%] shadow-[0_0_15px_rgba(34,197,94,0.5)]" />
                   </div>
                   <div className="flex justify-between w-full mt-3 text-[10px] font-black uppercase text-white/40">
                      <span>Promoter</span>
                      <span>High Performance</span>
                   </div>
                </div>

                <div className="lg:col-span-8 card-container p-8 bg-white/60">
                   <h3 className="text-label text-muted font-black uppercase tracking-widest mb-8 border-b pb-4 flex items-center justify-between">
                      Lịch sử khảo sát NPS
                      <TrendingUp size={16} className="text-success" />
                   </h3>
                   <div className="space-y-6">
                      {nps?.map(item => (
                        <div key={item.id} className="flex gap-6 pb-6 border-b border-border/10 last:border-0 border-dashed">
                           <div className={cn("text-h2 font-black shrink-0", getNPSColor(item.score))}>{item.score}</div>
                           <div className="flex-1 space-y-2">
                              <div className="flex justify-between">
                                 <p className="text-small font-black text-primary uppercase">{item.triggerType}</p>
                                 <span className="text-[10px] text-muted italic">{formatDate(item.scoreDate)}</span>
                              </div>
                              <p className="text-small text-muted italic leading-relaxed">"{item.comment}"</p>
                           </div>
                        </div>
                      ))}
                   </div>
                </div>
             </div>

             {/* Feedback List */}
             <div className="space-y-6">
                <div className="flex justify-between items-center">
                   <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Phản hồi & Khiếu nại</h3>
                   <button className="btn-outline-sm">+ Gửi phản hồi thay</button>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                   {feedback?.map(f => (
                     <div key={f.id} className="card-container p-6 bg-white/60 hover:shadow-xl transition-all border-l-4 border-l-primary group">
                        <div className="flex justify-between items-start mb-4">
                           <div className="px-2 py-1 bg-primary/5 text-primary text-[9px] font-black rounded uppercase">{f.feedbackType}</div>
                           <div className="flex items-center gap-2">
                              {f.isResolved ? (
                                <span className="flex items-center gap-1 text-success text-[10px] font-bold uppercase"><CheckCircle2 size={12} /> Đã xử lý</span>
                              ) : (
                                <span className="flex items-center gap-1 text-warning text-[10px] font-bold uppercase"><AlertCircle size={12} /> Chờ xử lý</span>
                              )}
                           </div>
                        </div>
                        <p className="text-body font-medium text-slate-700 leading-relaxed mb-6 group-hover:text-primary transition-colors italic">"{f.content}"</p>
                        <div className="flex justify-between items-center text-[10px] text-muted border-t border-dashed pt-4">
                           <span className="font-bold uppercase tracking-widest">ID: {f.id}</span>
                           <span className="font-mono italic">{formatDate(f.createdAt)}</span>
                        </div>
                     </div>
                   ))}
                </div>
             </div>
          </div>
        )}

        {activeTab === 'Onboarding' && (
          <div className="max-w-4xl mx-auto space-y-12 py-10">
             {/* Progress Summary */}
             <div className="card-container p-10 bg-slate-900 border-none relative overflow-hidden">
                <div className="relative z-10 flex flex-col md:flex-row items-center gap-10">
                   <div className="relative w-32 h-32 flex items-center justify-center">
                      <div className="absolute inset-0 border-8 border-white/5 rounded-full" />
                      <div className="absolute inset-0 border-8 border-success rounded-full border-b-transparent transition-all duration-1000" style={{ transform: `rotate(${onboarding?.completionPercent || 0 * 3.6}deg)` }} />
                      <span className="text-h1 font-black text-white">{onboarding?.completionPercent}%</span>
                   </div>
                   <div className="flex-1 space-y-3">
                      <h2 className="text-h2 font-black text-white tracking-widest uppercase">Quá trình Onboarding</h2>
                      <p className="text-small text-slate-400 font-medium">Hoàn thành toàn bộ các bước để kích hoạt tư cách cư dân chính thức tại toà nhà. Dữ liệu sẽ được lưu vào blockchain Ledger.</p>
                      {onboarding?.completionPercent === 100 && (
                        <div className="flex items-center gap-2 text-success font-black text-[11px] uppercase animate-pulse">
                           <CheckCircle2 size={16} /> Hoàn thành xuất sắc!
                        </div>
                      )}
                   </div>
                </div>
                <LayoutList size={200} className="absolute -bottom-20 -right-20 text-white/5" />
             </div>

             {/* Steps List */}
             <div className="space-y-4">
                {[
                  { key: 'isPersonalInfoConfirmed', label: 'Xác nhận thông tin cá nhân', target: 'Ho so' },
                  { key: 'isCCCDUploaded', label: 'Upload CCCD/Hộ chiếu', target: 'Ho so' },
                  { key: 'isEmergencyContactAdded', label: 'Thêm liên hệ khẩn cấp', target: 'Lien he' },
                  { key: 'isContractSigned', label: 'Ký hợp đồng thuê', target: 'Hop dong' },
                  { key: 'isDepositPaid', label: 'Thanh toán tiền cọc', target: 'Vi' },
                  { key: 'isRoomHandovered', label: 'Nhận bàn giao phòng', target: null },
                ].map((step, idx) => (
                  <div 
                    key={step.key} 
                    className={cn(
                      "group p-6 rounded-[24px] border flex items-center justify-between transition-all",
                      onboarding?.[step.key as keyof OnboardingProgress] 
                        ? "bg-success/5 border-success/20" 
                        : "bg-white border-border/50 hover:shadow-xl hover:-translate-x-1"
                    )}
                  >
                    <div className="flex items-center gap-6">
                       <div className={cn(
                         "w-12 h-12 rounded-2xl flex items-center justify-center transition-all",
                         onboarding?.[step.key as keyof OnboardingProgress] ? "bg-success text-white" : "bg-bg text-muted group-hover:bg-primary/10 group-hover:text-primary"
                       )}>
                          {onboarding?.[step.key as keyof OnboardingProgress] ? <CheckCircle2 size={24} /> : <span className="font-black">0{idx + 1}</span>}
                       </div>
                       <p className={cn("text-body font-black uppercase tracking-widest", onboarding?.[step.key as keyof OnboardingProgress] ? "text-success" : "text-primary")}>
                         {step.label}
                       </p>
                    </div>

                    <div className="flex items-center gap-4">
                       {step.target && !onboarding?.[step.key as keyof OnboardingProgress] && (
                         <button 
                          onClick={() => setActiveTab(step.target as any)}
                          className="text-[10px] font-black uppercase text-primary hover:underline"
                         >
                            Thực hiện ngay
                         </button>
                       )}
                       <button 
                        onClick={() => handleOnboardingAction(step.key)}
                        className={cn(
                          "w-10 h-10 rounded-xl flex items-center justify-center border transition-all",
                          onboarding?.[step.key as keyof OnboardingProgress] ? "border-success bg-success/10 text-success" : "border-border text-muted hover:border-primary hover:text-primary"
                        )}
                       >
                          {onboarding?.[step.key as keyof OnboardingProgress] ? <CheckCircle2 size={18} /> : <ArrowRight size={18} />}
                       </button>
                    </div>
                  </div>
                ))}
             </div>
          </div>
        )}

        {/* Tab Placeholders for the rest */}
        {(['Hop dong', 'Hoa don', 'Vi'] as TabType[]).includes(activeTab) && (
          <div className="py-20 flex flex-col items-center justify-center gap-6 text-center animate-in zoom-in-95 duration-500">
             <div className="w-24 h-24 bg-primary/5 rounded-full flex items-center justify-center text-primary border border-primary/10">
                <History size={40} className="animate-spin-slow" />
             </div>
             <div className="max-w-md space-y-2">
                <h3 className="text-h3 font-black text-primary uppercase tracking-[4px]">Dữ liêu {activeTab}</h3>
                <p className="text-small text-muted italic font-medium">Toàn bộ lịch sử giao dịch và hồ sơ đang được đồng bộ từ Ledger Engine...</p>
             </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default TenantDetail;
