import React, { useEffect, useState } from 'react';
import { 
  Bell, 
  CreditCard, 
  MessageSquare, 
  ArrowUpRight, 
  ArrowDownLeft,
  Calendar,
  Zap,
  Droplets,
  Plus,
  Home,
  Clock,
  ChevronRight,
  Info
} from 'lucide-react';
import { Button } from '@/components/ui/Button';
import { dashboardService } from '@/services/dashboardService';
import { tenantService } from '@/services/tenantService';
import { announcementService } from '@/services/announcementService';
import { contractService } from '@/services/contractService';
import { KPIData, RecentTicket } from '@/models/Dashboard';
import { TenantBalance } from '@/models/TenantBalance';
import { Announcement } from '@/types/announcement';
import { ContractDetail } from '@/models/Contract';

const TenantDashboard: React.FC = () => {
  const [kpis, setKpis] = useState<KPIData | null>(null);
  const [balance, setBalance] = useState<TenantBalance | null>(null);
  const [tickets, setTickets] = useState<RecentTicket[]>([]);
  const [announcements, setAnnouncements] = useState<Announcement[]>([]);
  const [contract, setContract] = useState<ContractDetail | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [kpiData, balanceData, ticketData, announceData, contractData] = await Promise.all([
          dashboardService.getKPIs(),
          tenantService.getTenantBalance('T1'),
          dashboardService.getRecentTickets(),
          announcementService.getAnnouncements(),
          contractService.getContractDetail('C1')
        ]);
        setKpis(kpiData);
        setBalance(balanceData);
        setTickets(ticketData);
        setAnnouncements(announceData);
        setContract(contractData);
      } catch (error) {
        console.error('Error fetching dashboard data:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải dữ liệu...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-4">
      {/* Header / Welcome */}
      <div className="flex items-center justify-between">
        <div className="space-y-1">
          <h2 className="text-h2 font-bold">Chào {contract?.tenantName.split(' ').pop()}! 👋</h2>
          <p className="text-small text-muted font-medium">{contract?.buildingName} - {contract?.roomCode}</p>
        </div>
        <button className="relative w-10 h-10 bg-white rounded-full shadow-sm flex items-center justify-center">
          <Bell size={20} className="text-muted" />
          {announcements.length > 0 && (
            <span className="absolute top-2 right-2 w-2 h-2 bg-error rounded-full ring-2 ring-white"></span>
          )}
        </button>
      </div>

      {/* Main Balance Card */}
      <div className="card-container p-6 bg-gradient-to-br from-primary to-accent text-white border-none shadow-xl relative overflow-hidden">
        <div className="absolute top-0 right-0 p-8 opacity-10">
          <CreditCard size={100} />
        </div>
        <div className="relative z-10 space-y-6">
          <div className="space-y-1">
            <p className="text-small opacity-80 font-medium uppercase tracking-wider">TỔNG TIỀN CẦN THANH TOÁN</p>
            <p className="text-[32px] font-bold">{balance?.currentBalance.toLocaleString()}đ</p>
          </div>
          
          <div className="flex items-center gap-4 py-4 border-y border-white/10">
            <div className="flex-1 space-y-1">
              <p className="text-[10px] opacity-60 uppercase">HạN TRẢ</p>
              <p className="text-body font-bold">05/03/2026</p>
            </div>
            <div className="flex-1 space-y-1">
              <p className="text-[10px] opacity-60 uppercase">TRạNG THÁI</p>
              <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold border ${
                (balance?.currentBalance || 0) > 0 ? 'bg-error/20 border-error/30 text-white' : 'bg-success/20 border-success/30 text-white'
              }`}>
                {(balance?.currentBalance || 0) > 0 ? 'CHƯA THANH TOÁN' : 'ĐÃ HOÀN TẤT'}
              </span>
            </div>
          </div>

          <Button className="w-full py-4 bg-white text-primary rounded-xl font-bold shadow-lg hover:scale-[1.02] transition-all active:scale-95">
            THANH TOÁN NGAY
          </Button>
        </div>
      </div>

      {/* Announcements Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-h3 font-bold">Thông báo mới</h3>
          <button className="text-[11px] font-bold text-primary uppercase">Xem thêm</button>
        </div>
        <div className="flex gap-4 overflow-x-auto pb-2 -mx-4 px-4 no-scrollbar">
          {announcements.map((ann, i) => (
            <div key={i} className="flex-shrink-0 w-72 card-container p-4 bg-white border-none shadow-sm flex gap-3">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center shrink-0 ${
                ann.type === 'Urgent' ? 'bg-error/10 text-error' : 'bg-primary/10 text-primary'
              }`}>
                <Info size={20} />
              </div>
              <div className="flex-1 space-y-1">
                <p className="text-small font-bold line-clamp-1">{ann.title}</p>
                <p className="text-[10px] text-muted line-clamp-2 leading-relaxed">{ann.content}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Contract & Room Summary */}
      <div className="space-y-4">
        <h3 className="text-h3 font-bold px-1">Căn hộ của bạn</h3>
        <div className="card-container p-5 bg-white border-none shadow-sm space-y-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-accent/10 rounded-lg text-accent">
                <Home size={18} />
              </div>
              <div>
                <p className="text-small font-bold">{contract?.roomCode}</p>
                <p className="text-[10px] text-muted font-medium">{contract?.buildingName}</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-small font-bold text-primary">{contract?.rentPriceSnapshot.toLocaleString()}đ</p>
              <p className="text-[10px] text-muted font-medium">giá thuê/tháng</p>
            </div>
          </div>
          
          <div className="grid grid-cols-2 gap-4 pt-4 border-t border-muted/5">
            <div className="space-y-1 text-center bg-bg/50 p-2 rounded-xl">
              <p className="text-[10px] text-muted font-medium">BẮT ĐẦU</p>
              <p className="text-[11px] font-bold">{contract?.startDate}</p>
            </div>
            <div className="space-y-1 text-center bg-bg/50 p-2 rounded-xl">
              <p className="text-[10px] text-muted font-medium">KẾT THÚC</p>
              <p className="text-[11px] font-bold">{contract?.endDate}</p>
            </div>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-4 gap-4">
        {[
          { icon: Zap, label: 'Chỉ số điện', color: 'bg-warning/10 text-warning' },
          { icon: Droplets, label: 'Chỉ số nước', color: 'bg-primary/10 text-primary' },
          { icon: MessageSquare, label: 'Liên hệ BQL', color: 'bg-success/10 text-success' },
          { icon: Clock, label: 'Lịch sử', color: 'bg-accent/10 text-accent' },
        ].map((action, i) => (
          <div key={i} className="space-y-2 text-center">
            <div className={`w-14 h-14 mx-auto rounded-2xl flex items-center justify-center shadow-sm ${action.color}`}>
              <action.icon size={24} />
            </div>
            <p className="text-[10px] font-bold text-muted uppercase leading-tight">{action.label}</p>
          </div>
        ))}
      </div>

      {/* Recent Activity (Tickets) */}
      <div className="space-y-4">
        <div className="flex items-center justify-between px-1">
          <h3 className="text-h3 font-bold">Yêu cầu hỗ trợ</h3>
          <button className="text-[11px] font-bold text-primary uppercase">Xem tất cả</button>
        </div>
        <div className="space-y-3">
          {tickets.slice(0, 2).map((item, i) => (
            <div key={i} className="card-container p-4 bg-white border-none shadow-sm flex items-center gap-4">
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${
                item.status === 'Open' ? 'bg-primary/10 text-primary' : 'bg-success/10 text-success'
              }`}>
                <MessageSquare size={20} />
              </div>
              <div className="flex-1">
                <p className="text-body font-bold line-clamp-1">{item.title}</p>
                <p className="text-small text-muted">Mã: {item.ticketCode} • {item.status}</p>
              </div>
              <ChevronRight size={18} className="text-muted/30" />
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default TenantDashboard;
