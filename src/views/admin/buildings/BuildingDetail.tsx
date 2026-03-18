import React, { useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import { 
  ArrowLeft, Home, Building2, MapPin, 
  Info, Image as ImageIcon, Users, 
  TrendingUp, TrendingDown, Phone, Mail,
  Calendar, Layers, Maximize, Key, Plus,
  Edit, Trash2, ExternalLink, ShieldCheck,
  CheckCircle2, XCircle, MoreVertical,
  Star, Share2, Printer, Download, Clock,
  ArrowRight
} from 'lucide-react';
import { buildingService } from '@/services/buildingService';
import { BuildingDetail as BuildingDetailType } from '@/models/Building';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn, formatVND, formatDate } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { toast } from 'sonner';
import { BuildingModal } from '@/components/buildings/BuildingModal';

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

const BuildingDetail = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('Overview');
  const [isModalOpen, setIsModalOpen] = useState(false);

  const { data: building, isLoading } = useQuery<BuildingDetailType>({
    queryKey: ['building', id],
    queryFn: () => buildingService.getBuildingDetail(id!)
  });

  if (isLoading) return <div className="h-screen flex items-center justify-center"><Spinner /></div>;
  if (!building) return <div>Toà nhà không tồn tại.</div>;

  // Checklist #2: Ownership sum check
  const totalOwnership = building.ownership.reduce((sum, o) => sum + o.ownershipPercent, 0);

  return (
    <div className="space-y-6 animate-in fade-in slide-in-from-bottom-4 duration-500 pb-20">
      {/* 2.2.1 Page Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b">
        <div className="flex items-center gap-4">
          <button onClick={() => navigate(-1)} className="p-3 hover:bg-bg rounded-2xl transition-all shadow-sm border border-border/20">
            <ArrowLeft size={20} />
          </button>
          <div className="flex items-center gap-4">
             <img src={building.heroImageUrl} className="w-16 h-16 rounded-2xl object-cover shadow-lg" alt="" />
             <div>
                <div className="flex items-center gap-2 mb-1">
                   <h1 className="text-[28px] font-black text-primary tracking-tighter leading-none">{building.buildingName}</h1>
                   <StatusBadge status={building.type} size="sm" />
                </div>
                <div className="flex items-center gap-4 text-[11px] text-muted font-black uppercase tracking-widest">
                   <span className="flex items-center gap-1.5 font-mono"><Key size={14} className="text-secondary" /> {building.buildingCode}</span>
                   <span className="flex items-center gap-1.5"><MapPin size={14} className="text-accent" /> {building.address}</span>
                </div>
             </div>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <button 
            onClick={() => setIsModalOpen(true)}
            className="btn-outline flex items-center gap-2 px-6 h-11"
          >
            <Edit size={18} /> Cập nhật
          </button>
          <button className="btn-primary flex items-center gap-2 px-8 h-11 shadow-xl shadow-primary/20"><Printer size={18} /> Báo cáo vận hành</button>
        </div>
      </div>

      {/* 2.2.1 Tab Structure */}
      <div className="bg-white/40 backdrop-blur-md rounded-[32px] overflow-hidden shadow-2xl shadow-primary/5">
        <div className="flex flex-wrap border-b bg-bg/20">
          <TabItem active={activeTab === 'Overview'} onClick={() => setActiveTab('Overview')} icon={Info}>Tổng quan</TabItem>
          <TabItem active={activeTab === 'Rooms'} onClick={() => setActiveTab('Rooms')} icon={Home}>Danh sách Phòng</TabItem>
          <TabItem active={activeTab === 'Images'} onClick={() => setActiveTab('Images')} icon={ImageIcon}>Hình ảnh</TabItem>
          <TabItem active={activeTab === 'Ownership'} onClick={() => setActiveTab('Ownership')} icon={ShieldCheck}>Chủ sở hữu</TabItem>
          <TabItem active={activeTab === 'Reports'} onClick={() => setActiveTab('Reports')} icon={TrendingUp}>Báo cáo</TabItem>
        </div>

        <div className="p-8 animate-in fade-in slide-in-from-top-2 duration-500">
          {activeTab === 'Overview' && (
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-10">
              {/* Info Column */}
              <div className="lg:col-span-8 space-y-10">
                 <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                    {[
                      { label: 'Năm bàn giao', value: building.yearBuilt, icon: Calendar },
                      { label: 'Số tầng', value: building.totalFloors, icon: Layers },
                      { label: 'Hotline BQL', value: building.managementPhone, icon: Phone, type: 'tel' },
                      { label: 'Email liên hệ', value: building.managementEmail, icon: Mail, type: 'email' },
                    ].map((item, i) => (
                      <div key={i} className="flex items-center gap-4 p-5 bg-white/60 rounded-3xl border border-primary/5 group hover:border-primary/20 transition-all">
                         <div className="w-12 h-12 bg-primary/5 text-primary rounded-2xl flex items-center justify-center group-hover:bg-primary group-hover:text-white transition-all">
                            <item.icon size={22} />
                         </div>
                         <div>
                            <p className="text-[10px] text-muted font-black uppercase tracking-tighter">{item.label}</p>
                            {item.type === 'tel' ? (
                               <a href={`tel:${item.value}`} className="text-body font-black text-primary hover:underline">{item.value}</a>
                            ) : item.type === 'email' ? (
                               <a href={`mailto:${item.value}`} className="text-body font-black text-primary hover:underline">{item.value}</a>
                            ) : (
                               <p className="text-body font-black text-primary">{item.value}</p>
                            )}
                         </div>
                      </div>
                    ))}
                 </div>

                 <div className="space-y-6">
                    <h3 className="text-h3 text-primary font-black uppercase tracking-widest flex items-center gap-2">
                       <ShieldCheck size={20} className="text-success" /> Tiện ích toà nhà
                    </h3>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                       {building.amenities.map((a, i) => (
                         <div key={i} className="flex items-center gap-3 p-4 bg-white/40 rounded-2xl border border-transparent hover:border-primary/10 transition-all">
                            <CheckCircle2 size={16} className="text-primary" />
                            <span className="text-[11px] font-black text-primary uppercase tracking-tighter">{a}</span>
                         </div>
                       ))}
                    </div>
                 </div>

                 {/* 2.2.2 Checklist #3: Map Embed */}
                 <div className="space-y-6">
                    <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Vị trí Toà nhà</h3>
                    <div className="h-96 rounded-[40px] overflow-hidden border-8 border-white/60 shadow-xl relative group">
                       <iframe 
                         src={`https://maps.google.com/maps?q=${building.latitude},${building.longitude}&z=15&output=embed`}
                         className="w-full h-full grayscale hover:grayscale-0 transition-all duration-700"
                         loading="lazy"
                         referrerPolicy="no-referrer-when-downgrade"
                       />
                       <div className="absolute top-4 right-4 bg-white/90 backdrop-blur-md p-4 rounded-2xl shadow-lg border border-primary/10 group-hover:translate-y-1 transition-transform">
                          <p className="text-[9px] font-black uppercase text-muted tracking-widest mb-1">Toạ độ GPS</p>
                          <p className="text-[11px] font-mono font-black text-primary">{building.latitude}, {building.longitude}</p>
                       </div>
                    </div>
                 </div>
              </div>

              {/* Stats Column */}
              <div className="lg:col-span-4 space-y-8">
                 <div className="p-8 bg-slate-900 rounded-[40px] text-white shadow-2xl relative overflow-hidden group">
                    <div className="absolute top-0 right-0 p-10 opacity-5 group-hover:opacity-10 transition-all pointer-events-none">
                       <Building2 size={180} />
                    </div>
                    <p className="text-label text-slate-400 mb-6 uppercase tracking-widest">Hiệu suất vận hành</p>
                    <div className="space-y-8">
                       <div>
                          <p className="text-[32px] font-black leading-none mb-2">{building.occupancyRate}%</p>
                          <p className="text-[10px] text-slate-500 font-bold uppercase tracking-widest">Tỉ lệ lấp đầy</p>
                          <div className="w-full h-1.5 bg-slate-800 rounded-full mt-4 overflow-hidden">
                             <div className="h-full bg-success transition-all duration-1000" style={{ width: `${building.occupancyRate}%` }} />
                          </div>
                       </div>
                       <div className="grid grid-cols-2 gap-6 pt-8 border-t border-white/10">
                          <div>
                             <p className="text-label text-slate-500 font-bold uppercase mb-1">Tổng phòng</p>
                             <p className="text-h2 font-black text-white">{building.totalRooms}</p>
                          </div>
                          <div>
                             <p className="text-label text-slate-500 font-bold uppercase mb-1">Đang thuê</p>
                             <p className="text-h2 font-black text-secondary">{building.occupiedRooms}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="p-8 bg-white/60 rounded-[40px] border border-primary/5">
                    <h3 className="text-label text-muted uppercase tracking-widest mb-6 border-b pb-4">Quản lý & Hỗ trợ</h3>
                    <div className="space-y-6">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/10 text-primary rounded-xl flex items-center justify-center font-black">KN</div>
                          <div>
                             <p className="text-small font-black text-primary uppercase">Elite Property Group</p>
                             <p className="text-[10px] text-muted italic">Đơn vị quản lý vận hành</p>
                          </div>
                       </div>
                       <div className="p-4 bg-bg/50 rounded-2xl border border-dashed border-border/50">
                          <p className="text-[10px] font-bold text-muted uppercase tracking-widest mb-2">Thông tin bảo hiểm</p>
                          <p className="text-small font-black text-primary">Prudential PVI-852369</p>
                          <p className="text-[10px] text-success font-bold mt-1 uppercase tracking-tighter flex items-center gap-1">
                             <ShieldCheck size={12} /> Còn hiệu lực đến 2026
                          </p>
                       </div>
                    </div>
                 </div>
              </div>
            </div>
          )}

          {activeTab === 'Ownership' && (
            <div className="space-y-8">
              {/* 2.2.3 Ownership Section */}
              <div className="flex justify-between items-center">
                 <div>
                    <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Chủ sở hữu & Cổ phần</h3>
                    <p className="text-small text-muted italic mt-1 font-medium">Danh sách các cá nhân/tổ chức tham gia góp vốn đầu tư tòa nhà.</p>
                 </div>
                 <button className="btn-primary-sm flex items-center gap-2"><Plus size={16} /> Gán chủ mới</button>
              </div>

              {/* Progress bar check (2.2.3 and Checklist #2) */}
              <div className="space-y-3">
                 <div className="flex justify-between items-center text-label font-bold uppercase tracking-widest">
                    <span>Tổng tỉ lệ sở hữu</span>
                    <span className={cn(totalOwnership > 100 ? "text-danger" : "text-primary")}>{totalOwnership}% / 100%</span>
                 </div>
                 <div className="h-4 bg-bg rounded-full overflow-hidden border border-border/20 p-0.5">
                    <div 
                      className={cn("h-full rounded-full transition-all duration-1000", totalOwnership > 100 ? "bg-danger shadow-lg animate-pulse" : "bg-primary shadow-[0_0_20px_rgba(27,58,107,0.3)]")} 
                      style={{ width: `${Math.min(totalOwnership, 100)}%` }} 
                    />
                 </div>
                 {totalOwnership > 100 && (
                   <p className="text-[10px] text-danger font-black uppercase flex items-center gap-2 animate-bounce">
                      <XCircle size={14} /> Cảnh báo: Tổng cổ phần vượt mức 100% (RULE-CHECK). Vui lòng điều chỉnh lại.
                   </p>
                 )}
                 {totalOwnership < 100 && (
                   <p className="text-[10px] text-muted font-black uppercase flex items-center gap-2 italic">
                      Còn trống {100 - totalOwnership}% cổ phần chưa được định danh chủ sở hữu.
                   </p>
                 )}
              </div>

              <div className="card-container overflow-hidden p-0 border-none shadow-xl shadow-primary/5">
                 <table className="w-full text-left">
                    <thead className="bg-bg/50 border-b">
                       <tr>
                          <th className="px-6 py-4 text-label text-muted">Chủ sở hữu (Owner)</th>
                          <th className="px-6 py-4 text-label text-muted">Tỉ lệ (%)</th>
                          <th className="px-6 py-4 text-label text-muted text-center">Vai trò</th>
                          <th className="px-6 py-4 text-label text-muted">Ngày bắt đầu</th>
                          <th className="px-6 py-4 text-label text-muted">Ghi chú</th>
                          <th className="px-6 py-4 text-label text-muted text-right">Hành động</th>
                       </tr>
                    </thead>
                    <tbody className="divide-y divide-border/20">
                       {building.ownership.map((o) => (
                         <tr key={o.id} className="hover:bg-primary/[0.02] transition-colors">
                            <td className="px-6 py-4">
                               <div className="flex items-center gap-4">
                                  <img src={o.ownerAvatar} className="w-10 h-10 rounded-full border-2 border-white shadow-sm" alt="" />
                                  <p 
                                    className="text-body font-black text-primary hover:underline cursor-pointer"
                                    onClick={() => navigate('/owners')} // Simplified for MVP
                                  >
                                    {o.ownerName}
                                  </p>
                               </div>
                            </td>
                            <td className="px-6 py-4">
                               <span className="text-h3 font-black text-primary">{o.ownershipPercent}%</span>
                            </td>
                            <td className="px-6 py-4 text-center">
                               <StatusBadge status={o.ownershipType} size="sm" />
                            </td>
                            <td className="px-6 py-4">
                               <p className="text-small font-bold text-text">{formatDate(o.startDate)}</p>
                               <p className="text-[10px] text-muted italic">{o.endDate ? `Đến ${formatDate(o.endDate)}` : 'Vòng đời hiện tại'}</p>
                            </td>
                            <td className="px-6 py-4 text-small text-muted italic max-w-xs truncate">{o.note || '---'}</td>
                            <td className="px-6 py-4 text-right">
                               <button className="p-2 hover:bg-white rounded-xl text-muted shadow-sm border border-transparent hover:border-border/50"><MoreVertical size={18} /></button>
                            </td>
                         </tr>
                       ))}
                    </tbody>
                 </table>
              </div>
            </div>
          )}

          {activeTab === 'Rooms' && (
            <div className="space-y-6">
               <div className="flex justify-between items-center">
                  <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Danh sách Phòng</h3>
                  <button onClick={() => navigate('/rooms')} className="btn-primary-sm flex items-center gap-2">Xem tất cả <ArrowRight size={14} /></button>
               </div>
               <div className="card-container overflow-hidden p-0 border-none shadow-xl shadow-primary/5">
                  <table className="w-full text-left">
                     <thead className="bg-bg/50 border-b">
                        <tr>
                           <th className="px-6 py-4 text-label text-muted">Mã phòng</th>
                           <th className="px-6 py-4 text-label text-muted">Tầng</th>
                           <th className="px-6 py-4 text-label text-muted">Loại</th>
                           <th className="px-6 py-4 text-label text-muted">Giá thuê CV</th>
                           <th className="px-6 py-4 text-label text-muted">Trạng thái</th>
                        </tr>
                     </thead>
                     <tbody className="divide-y divide-border/20">
                        {/* Mocking rooms for this building */}
                        {[
                          { id: 'R1', code: 'A-101', floor: 1, type: '2BR', price: 15000000, status: 'Occupied' },
                          { id: 'R2', code: 'B-205', floor: 2, type: 'Studio', price: 8500000, status: 'Vacant' },
                          { id: 'R3', code: 'C-309', floor: 3, type: '3BR', price: 22000000, status: 'Maintenance' },
                          { id: 'R4', code: 'D-501', floor: 5, type: 'Penthouse', price: 55000000, status: 'Reserved' },
                        ].map((room) => (
                          <tr key={room.id} className="hover:bg-primary/[0.02] transition-colors">
                             <td className="px-6 py-4">
                                <button 
                                  onClick={() => navigate(`/rooms/${room.id}`)}
                                  className="text-body font-black text-primary hover:underline flex items-center gap-2"
                                >
                                   <Home size={14} className="text-secondary" /> {room.code}
                                </button>
                             </td>
                             <td className="px-6 py-4 text-small font-bold text-muted">Tầng {room.floor}</td>
                             <td className="px-6 py-4 text-small font-bold text-text">{room.type}</td>
                             <td className="px-6 py-4 text-small font-black text-primary">{formatVND(room.price)}</td>
                             <td className="px-6 py-4">
                                <StatusBadge status={room.status} size="sm" />
                             </td>
                          </tr>
                        ))}
                     </tbody>
                  </table>
               </div>
            </div>
          )}

          {activeTab === 'Images' && (
            <div className="space-y-8">
               <div className="flex justify-between items-center">
                  <h3 className="text-h3 text-primary font-black uppercase tracking-widest">Bộ sưu tập hình ảnh</h3>
                  <div className="flex gap-2">
                     <button className="btn-outline-sm flex items-center gap-2"><Download size={14} /> Tải toàn bộ</button>
                     <button className="btn-primary-sm flex items-center gap-2"><Plus size={14} /> Thêm ảnh</button>
                  </div>
               </div>
               <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
                  {building.images.map((img) => (
                    <div key={img.id} className="group relative aspect-[4/3] rounded-[32px] overflow-hidden border-4 border-white shadow-lg hover:shadow-2xl transition-all hover:-translate-y-1 cursor-zoom-in">
                       <img src={img.url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" alt="" />
                       <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                          <p className="text-[10px] text-white font-black uppercase tracking-widest">{img.isMain ? 'Ảnh đại diện' : 'Ảnh phối cảnh'}</p>
                       </div>
                       <div className="absolute top-4 right-4 flex gap-2 translate-y-2 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all">
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-primary shadow-lg hover:bg-white"><Edit size={14} /></button>
                          <button className="w-8 h-8 bg-white/90 backdrop-blur-md rounded-xl flex items-center justify-center text-danger shadow-lg hover:bg-white"><Trash2 size={14} /></button>
                       </div>
                    </div>
                  ))}
               </div>
            </div>
          )}

          {activeTab === 'Reports' && (
            <div className="space-y-10">
               <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                  <div className="card-container p-8 bg-white/60">
                     <h3 className="text-label text-muted font-black uppercase tracking-widest mb-6">Biến động doanh thu (6 tháng)</h3>
                     <div className="h-64 flex items-center justify-center text-muted font-mono italic bg-bg/20 rounded-3xl border border-dashed">
                        [ MiniRevenueChart Placeholder ]
                     </div>
                  </div>
                  <div className="card-container p-8 bg-white/60">
                     <h3 className="text-label text-muted font-black uppercase tracking-widest mb-6">Tỷ lệ lấp đầy theo phân khúc</h3>
                     <div className="h-64 flex items-center justify-center text-muted font-mono italic bg-bg/20 rounded-3xl border border-dashed">
                        [ MiniOccupancyChart Placeholder ]
                     </div>
                  </div>
               </div>
               
               <div className="bg-slate-900 rounded-[40px] p-10 text-white relative overflow-hidden">
                  <div className="relative z-10 flex flex-col md:flex-row gap-10 items-center">
                     <div className="flex-1 space-y-4">
                        <h3 className="text-h2 font-black tracking-tighter">Báo cáo Vận hành 2024</h3>
                        <p className="text-small text-slate-400 font-medium leading-relaxed">Tổng hợp toàn bộ chỉ số tài chính, bảo trì và sự cố của toà nhà trong năm tài khóa hiện tại. Dữ liệu được trích xuất trực tiếp từ hệ thống sổ cái (Ledger).</p>
                        <div className="flex gap-4 pt-4">
                           <button className="px-6 py-3 bg-white text-slate-900 font-black rounded-2xl flex items-center gap-2 hover:bg-slate-100 transition-all"><Printer size={18} /> In báo cáo</button>
                           <button className="px-6 py-3 bg-slate-800 text-white font-black rounded-2xl flex items-center gap-2 hover:bg-slate-700 transition-all"><ExternalLink size={18} /> Xem chi tiết</button>
                        </div>
                     </div>
                     <div className="w-48 h-48 bg-white/5 rounded-full flex items-center justify-center border border-white/10 group cursor-pointer hover:bg-white/10 transition-all relative">
                        <TrendingUp size={64} className="text-success animate-bounce" />
                        <div className="absolute bottom-4 text-[10px] font-black uppercase tracking-tighter text-slate-500 italic">Growth: +12.4%</div>
                     </div>
                  </div>
               </div>
            </div>
          )}
        </div>
      </div>

      <BuildingModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        building={building}
      />
    </div>
  );
};

export default BuildingDetail;
