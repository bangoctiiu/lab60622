import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { 
  ArrowLeft, Home, Building2, MapPin, Maximize,
  Info, Image as ImageIcon, Zap, Droplets,
  Package, History, ClipboardList, Plus, 
  Edit, Key, Wrench, CheckCircle2, MoreVertical,
  Star, Share2, Printer, Download, Trash2,
  Calendar, User, Clock, Check, Copy,
  ArrowRight, ShieldCheck, Smartphone,
  Layout, Wind, Refrigerator, Disc
} from 'lucide-react';
import { roomService } from '@/services/roomService';
import { RoomDetail as RoomDetailType, RoomStatus } from '@/models/Room';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn, formatVND, formatDate } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { toast } from 'sonner';
import { RoomModal } from '@/components/rooms/RoomModal';

// Reusable Tab Component
const TabItem = ({ active, children, onClick, icon: Icon }: any) => (
  <button 
    onClick={onClick}
    className={cn(
      "flex items-center gap-2 px-6 py-4 text-small font-black uppercase tracking-widest border-b-2 transition-all",
      active ? "border-primary text-primary bg-primary/[0.02]" : "border-transparent text-muted hover:text-text hover:bg-bg/50"
    )}
  >
    <Icon size={16} /> {children}
  </button>
);

const RoomDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: room, isLoading } = useQuery<RoomDetailType>({
    queryKey: ['room', id],
    queryFn: () => roomService.getRoomDetail(id!)
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (!room) return <div>Room not found.</div>;

  const renderStars = (score: number) => {
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={14} 
        className={cn(
          "fill-current",
          i < Math.floor(score / 2) ? "text-warning" : "text-bg"
        )} 
      />
    ));
  };

  const getAmenityIcon = (amenity: string) => {
    switch (amenity) {
      case 'WiFi': return <Layout size={20} className="text-primary" />;
      case 'AirConditioner': return <Wind size={20} className="text-primary" />;
      case 'HotWater': return <Droplets size={20} className="text-primary" />;
      case 'Fridge': return <Refrigerator size={20} className="text-primary" />;
      case 'Washer': return <Disc size={20} className="text-primary" />;
      default: return <Plus size={20} className="text-primary" />;
    }
  };

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* 1.2.1 Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-bg rounded-2xl transition-all shadow-sm border border-border/20">
            <ArrowLeft size={20} />
          </button>
          <div>
            <div className="flex items-center gap-3 mb-1">
               <h1 className="text-[32px] font-black text-primary tracking-tighter leading-none">{room.roomCode}</h1>
               <StatusBadge status={room.status} size="lg" />
            </div>
            <div className="flex items-center gap-4 text-[11px] text-muted font-black uppercase tracking-widest">
               <span className="flex items-center gap-1.5"><Building2 size={14} className="text-accent" /> {room.buildingName}</span>
               <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> Tang {room.floorNumber}</span>
               <span className="flex items-center gap-1.5"><Maximize size={14} className="text-accent" /> {room.areaSqm} m2</span>
            </div>
          </div>
        </div>

        <div className="flex items-center gap-3 flex-wrap">
          {/* Action buttons based on status (Spec 1.2.1) */}
          {room.status === 'Vacant' && (
            <button className="btn-primary flex items-center gap-2 px-6" onClick={() => navigate('/admin/contracts/create', { state: { roomId: room.id } })}>
              <Key size={18} /> Tạo hợp đồng
            </button>
          )}
          {room.status === 'Occupied' && (
            <button className="px-6 py-2.5 bg-primary/10 text-primary rounded-xl font-bold flex items-center gap-2 hover:bg-primary/20 transition-all">
              <ClipboardList size={18} /> Xem hợp đồng
            </button>
          )}
          {room.status === 'Maintenance' ? (
             <button className="btn-primary flex items-center gap-2 px-6">
                <CheckCircle2 size={18} /> Hoàn tất bảo trì
             </button>
          ) : (
             <button className="px-6 py-2.5 bg-bg/50 border border-border/50 text-muted rounded-xl font-bold flex items-center gap-2 hover:bg-bg transition-all">
                <Wrench size={18} /> Đặt bảo trì
             </button>
          )}
          <button 
            onClick={() => setIsModalOpen(true)}
            className="p-2.5 bg-white border border-border/50 rounded-xl text-muted hover:text-primary hover:shadow-lg transition-all"
          >
             <Edit size={20} />
          </button>
          <button className="p-2.5 bg-white border border-border/50 rounded-xl text-muted hover:text-danger hover:shadow-lg transition-all">
             <Trash2 size={20} />
          </button>
        </div>
      </div>
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl shadow-primary/5">
        <div className="flex flex-wrap border-b bg-bg/20">
          <TabItem active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} icon={Info}>Tổng quan</TabItem>
          <TabItem active={activeTab === 'Images'} onClick={() => setActiveTab('Images')} icon={ImageIcon}>Hình ảnh</TabItem>
          <TabItem active={activeTab === 'Meters'} onClick={() => setActiveTab('Meters')} icon={Zap}>Đồng hồ</TabItem>
          <TabItem active={activeTab === 'Assets'} onClick={() => setActiveTab('Assets')} icon={Package}>Tài sản</TabItem>
          <TabItem active={activeTab === 'Contracts'} onClick={() => setActiveTab('Contracts')} icon={History}>Hợp đồng</TabItem>
          <TabItem active={activeTab === 'History'} onClick={() => setActiveTab('History')} icon={ClipboardList}>Lịch sử TT</TabItem>
        </div>

        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-500">
          {/* Tab Content Rendering */}
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Left Section - Detail Info */}
              <div className="lg:col-span-8 space-y-10">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {[
                    { label: 'Diện tích', value: `${room.areaSqm} m2`, icon: Maximize },
                    { label: 'Giá thuê CV', value: formatVND(room.baseRentPrice), icon: Key },
                    { label: 'Loại phòng', value: room.roomType, icon: Layout },
                    { label: 'Số người tối đa', value: room.maxOccupancy, icon: User },
                    { label: 'Hướng nhà', value: room.directionFacing, icon: MapPin },
                    { label: 'Nội thất', value: room.furnishing, icon: Package },
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-4 p-5 bg-white/60 rounded-3xl border border-primary/5">
                       <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center">
                          <item.icon size={22} />
                       </div>
                       <div>
                          <p className="text-[10px] text-muted font-black uppercase tracking-tighter">{item.label}</p>
                          <p className="text-body font-black text-primary">{item.value}</p>
                       </div>
                    </div>
                  ))}
                </div>

                {/* Amenities Grid */}
                <div className="space-y-6">
                   <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Tiện ích căn hộ</h3>
                   <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                      {room.amenities.map((amenity, i) => (
                        <div key={i} className="flex flex-col items-center justify-center p-6 bg-white/40 rounded-[32px] border border-transparent hover:border-primary/20 hover:bg-white transition-all group">
                           <div className="w-14 h-14 bg-bg rounded-[20px] flex items-center justify-center mb-3 group-hover:scale-110 transition-transform">
                              {getAmenityIcon(amenity)}
                           </div>
                           <span className="text-[11px] font-black text-primary uppercase tracking-tighter">{amenity}</span>
                        </div>
                      ))}
                   </div>
                </div>

                <div className="space-y-6">
                   <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Mô tả</h3>
                   <p className="text-body text-text leading-relaxed p-6 bg-white/60 rounded-3xl italic">"{room.description}"</p>
                </div>
              </div>

              {/* Right Section - Score & Maintenance */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="p-8 bg-gradient-to-br from-slate-900 to-slate-800 rounded-[40px] text-white shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                       <Home size={140} />
                    </div>
                    <p className="text-label text-slate-400 mb-2 uppercase tracking-widest">Tình trạng vật lý</p>
                    <div className="flex items-end gap-2 mb-4">
                       <span className="text-[48px] font-black leading-none">{room.conditionScore}</span>
                       <span className="text-xl text-slate-500 font-bold mb-1">/ 10</span>
                    </div>
                    <div className="flex gap-1 mb-8">
                       {renderStars(room.conditionScore)}
                    </div>
                    <div className="space-y-4 pt-6 border-t border-white/10">
                       <div className="flex justify-between items-center text-small">
                          <span className="text-slate-400 font-bold">Ban công</span>
                          {room.hasBalcony ? <CheckCircle2 className="text-success" size={18} /> : <span>---</span>}
                       </div>
                       <div className="flex justify-between items-center text-small">
                          <span className="text-slate-400 font-bold">Bảo trì cuối</span>
                          <span className="font-mono">{formatDate(room.lastMaintenanceDate || '--')}</span>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-white/60 rounded-[40px] border border-primary/10">
                    <h4 className="text-label text-muted uppercase tracking-widest mb-6 border-b pb-4">Cư dân hiện tại</h4>
                    {room.tenantNames && room.tenantNames.length > 0 ? (
                      <div className="space-y-4">
                        {room.tenantNames.map((name, i) => (
                          <div key={i} className="flex items-center gap-3 p-3 bg-white rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                             <div className="w-10 h-10 bg-primary text-white rounded-xl flex items-center justify-center font-black">{name.charAt(0)}</div>
                             <div>
                                <p className="text-small font-black text-primary">{name}</p>
                                <p className="text-[10px] text-muted italic">Thành viên phòng</p>
                             </div>
                          </div>
                        ))}
                      </div>
                    ) : (
                      <div className="text-center py-10">
                        <Home size={48} className="text-bg mx-auto mb-4" />
                        <p className="text-small text-muted italic font-medium">Phòng trống</p>
                      </div>
                    )}
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Images' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Thư viện hình ảnh</h3>
                  <div className="flex gap-2">
                     <button className="btn-outline-sm px-4 py-2 flex items-center gap-2"><ImageIcon size={16} /> Quản lý</button>
                     <button className="btn-primary-sm px-4 py-2 flex items-center gap-2"><Plus size={16} /> Thêm ảnh</button>
                  </div>
               </div>
               
               {/* 1.2.4 Masonry Grid */}
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
                 {room.images.map((img) => (
                   <div key={img.id} className="group relative aspect-square rounded-[32px] overflow-hidden bg-bg shadow-sm hover:shadow-xl transition-all border-4 border-transparent hover:border-primary/10">
                      <img src={img.url} alt="" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                      {img.isMain && (
                        <div className="absolute top-4 left-4 px-3 py-1 bg-primary text-white text-[9px] font-black uppercase tracking-widest rounded-full shadow-lg">Main Image</div>
                      )}
                      <div className="absolute inset-0 bg-black/40 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                         <button className="p-2 bg-white rounded-xl text-primary hover:scale-110 transition-transform"><Check size={20} /></button>
                         <button className="p-2 bg-white rounded-xl text-danger hover:scale-110 transition-transform"><Trash2 size={20} /></button>
                      </div>
                   </div>
                 ))}
               </div>
            </div>
          )}

          {activeTab === 'Meters' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Đồng hồ dịch vụ</h3>
                  <button className="btn-outline-sm flex items-center gap-2"><Smartphone size={16} /> Lịch sử chỉ số</button>
               </div>
               <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                  {room.meters.map((meter) => (
                    <div key={meter.id} className="card-container p-8 bg-white rounded-[40px] border border-primary/5 hover:shadow-2xl transition-all group">
                       <div className="flex justify-between items-start mb-8">
                          <div className="flex items-center gap-4">
                             <div className={cn(
                               "w-16 h-16 rounded-[24px] flex items-center justify-center shadow-inner",
                               meter.meterType === 'Electricity' ? "bg-warning/5 text-warning" : "bg-primary/5 text-primary"
                             )}>
                                {meter.meterType === 'Electricity' ? <Zap size={32} /> : <Droplets size={32} />}
                             </div>
                             <div>
                                <p className="text-label text-muted font-black tracking-widest">{meter.meterType === 'Electricity' ? 'Dien nang' : 'Nuoc sinh hoat'}</p>
                                <p className="text-h3 font-mono font-black text-primary">{meter.meterCode}</p>
                             </div>
                          </div>
                          <button className="p-3 bg-bg/50 rounded-2xl text-muted group-hover:text-primary transition-colors">
                             <ArrowRight size={20} />
                          </button>
                       </div>
                       
                       <div className="flex items-end justify-between border-t border-dashed pt-8">
                          <div>
                             <p className="text-[11px] text-muted font-black uppercase mb-1">Chi so moi nhat</p>
                             <div className="flex items-baseline gap-2">
                                <span className="text-[40px] font-black text-primary font-mono tracking-tighter">{meter.lastReading}</span>
                                <span className="text-h3 font-black text-muted">{meter.meterType === 'Electricity' ? 'kWh' : 'm3'}</span>
                             </div>
                             <p className="text-[10px] text-success font-bold mt-2 flex items-center gap-1">
                                <Clock size={12} /> Cập nhật lúc {formatDate(meter.lastReadingDate)}
                             </p>
                          </div>
                          <div className="flex gap-1.5 h-16 items-end">
                             {/* Mini sparkline visualization */}
                             {meter.history?.map((h, idx) => (
                               <div key={idx} className="w-1.5 bg-primary/10 rounded-full flex items-end overflow-hidden h-full group/h">
                                  <div 
                                    className="w-full bg-primary group-hover/h:bg-secondary transition-colors" 
                                    style={{ height: `${(h.value / 1500) * 100}%` }}
                                  ></div>
                               </div>
                             ))}
                          </div>
                       </div>
                    </div>
                  ))}
               </div>
               {/* 3.2.1 Handle Checklist Item #1 (RULE-01 Reminder) */}
               <div className="p-6 bg-warning/5 border border-warning/10 rounded-3xl flex gap-4">
                  <ShieldCheck className="text-warning shrink-0" size={24} />
                  <p className="text-small text-warning font-bold italic">
                     Chú ý: Dữ liệu chỉ số được truy xuất từ vw_LatestMeterReading (RULE-01). 
                     Tuyệt đối không sử dụng Meters.LastReadingValue để đảm bảo tính thời gian thực.
                  </p>
               </div>
            </div>
          )}

          {activeTab === 'Assets' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Tài sản hiện hữu</h3>
                  <button className="btn-primary-sm flex items-center gap-2"><Plus size={16} /> Gán tài sản</button>
               </div>
               <div className="card-container overflow-hidden p-0 border-none">
                 <table className="w-full text-left">
                   <thead className="bg-bg/50">
                     <tr>
                       <th className="px-6 py-4 text-label text-muted">Tên tài sản / Mã</th>
                       <th className="px-6 py-4 text-label text-muted">Loại</th>
                       <th className="px-6 py-4 text-label text-muted">Tình trạng</th>
                       <th className="px-6 py-4 text-label text-muted">Ngày bàn giao</th>
                       <th className="px-6 py-4 text-label text-muted text-right">Thao tác</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/20">
                     {room.assets.map((asset) => (
                       <tr key={asset.id} className="hover:bg-bg/20 transition-all">
                          <td className="px-6 py-4">
                             <div>
                                <p className="text-body font-black text-primary">{asset.assetName}</p>
                                <p className="text-[10px] font-mono text-muted font-bold">{asset.assetCode}</p>
                             </div>
                          </td>
                          <td className="px-6 py-4">
                             <span className="px-2 py-1 bg-bg text-muted text-[10px] font-black rounded uppercase">{asset.type}</span>
                          </td>
                          <td className="px-6 py-4">
                             <div className="flex gap-1">
                                {renderStars(asset.condition === 'New' ? 10 : asset.condition === 'Good' ? 8 : asset.condition === 'Fair' ? 6 : 4)}
                             </div>
                          </td>
                          <td className="px-6 py-4 text-small font-bold text-muted">{formatDate(asset.assignedAt)}</td>
                          <td className="px-6 py-4 text-right">
                             <button className="p-2 hover:bg-white rounded-xl text-muted"><MoreVertical size={18} /></button>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
            </div>
          )}

          {activeTab === 'History' && (
            <div className="space-y-8">
               <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Lịch sử Chuyển trạng thái</h3>
               <div className="card-container overflow-hidden p-0 border-none">
                 <table className="w-full text-left">
                   <thead className="bg-bg/50">
                     <tr>
                       <th className="px-6 py-4 text-label text-muted">Trạng thái cũ</th>
                       <th className="px-6 py-4 text-label text-muted text-center"><ArrowRight size={14} className="mx-auto" /></th>
                       <th className="px-6 py-4 text-label text-muted">Trạng thái mới</th>
                       <th className="px-6 py-4 text-label text-muted">Thời điểm</th>
                       <th className="px-6 py-4 text-label text-muted">Người đổi</th>
                       <th className="px-6 py-4 text-label text-muted">Lý do / Hợp đồng</th>
                     </tr>
                   </thead>
                   <tbody className="divide-y divide-border/20">
                     {room.statusHistory.map((h) => (
                       <tr key={h.id} className="hover:bg-bg/20 transition-all">
                          <td className="px-6 py-4"><StatusBadge status={h.fromStatus} size="sm" /></td>
                          <td className="px-6 py-4 text-center"><ArrowRight size={14} className="text-muted/30 mx-auto" /></td>
                          <td className="px-6 py-4"><StatusBadge status={h.toStatus} size="sm" /></td>
                          <td className="px-6 py-4 text-small text-muted font-bold">{h.changedAt}</td>
                          <td className="px-6 py-4 text-small font-black text-primary uppercase">{h.changedBy}</td>
                          <td className="px-6 py-4">
                             <div className="flex flex-col">
                                <span className="text-small text-text italic">"{h.reason}"</span>
                                {h.contractId && (
                                  <button onClick={() => navigate(`/admin/contracts/${h.contractId}`)} className="text-[10px] text-primary font-bold hover:underline flex items-center gap-1 mt-1">
                                     <ClipboardList size={12} /> {h.contractId}
                                  </button>
                                )}
                             </div>
                          </td>
                       </tr>
                     ))}
                   </tbody>
                 </table>
               </div>
               <div className="p-4 bg-info/5 rounded-2xl flex gap-3 italic text-small text-info/70 font-medium">
                  <Info size={16} className="shrink-0" />
                  Ghi chú: RoomStatusHistory được hệ thống ghi nhận tự động (RULE-10) khi có thay đổi trạng thái tại DB.
               </div>
            </div>
          )}

          {activeTab === 'Contracts' && (
             <div className="flex flex-col items-center justify-center py-20 text-center space-y-4">
                <div className="w-20 h-20 bg-bg rounded-[32px] flex items-center justify-center text-muted">
                   <History size={40} />
                </div>
                <div>
                  <h3 className="text-body font-black text-primary uppercase tracking-[2px]">Lịch sử Thuê phòng</h3>
                  <p className="text-small text-muted italic">Tính năng đang đồng bộ dữ liệu với phân hệ Hợp đồng.</p>
                </div>
             </div>
          )}
        </div>
      </div>

      <RoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        room={room}
      />
    </div>
  );
};

export default RoomDetail;
