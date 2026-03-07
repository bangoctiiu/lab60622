import React, { useState } from 'react';
import { 
  Plus, Search, Filter, MoreVertical, 
  Package, Star, History as HistoryIcon, Wrench, 
  ExternalLink, ShieldAlert, Cpu, 
  Tv, Monitor, Sofa, Lamp, Box, Home
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { roomService } from '@/services/roomService';
import { Asset, AssetType } from '@/models/Asset';
import { cn, formatVND, formatDate } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import { isBefore, parseISO } from 'date-fns';
import { useNavigate } from 'react-router-dom';

const AssetCatalog = () => {
  const navigate = useNavigate();
  const [activeTab, setActiveTab] = useState('All');

  const { data: assets, isLoading } = useQuery<Asset[]>({
    queryKey: ['assets', activeTab],
    queryFn: () => roomService.getAssets({ type: activeTab })
  });

  const renderStars = (condition: string) => {
    const starCount = condition === 'New' ? 5 : condition === 'Good' ? 4 : condition === 'Fair' ? 3 : 2;
    return Array.from({ length: 5 }).map((_, i) => (
      <Star 
        key={i} 
        size={12} 
        className={cn(
          "fill-current",
          i < starCount ? "text-warning" : "text-bg"
        )} 
      />
    ));
  };

  const getAssetIcon = (type: AssetType) => {
     switch (type) {
        case 'Appliance': return <Cpu size={18} />;
        case 'Electronics': return <Monitor size={18} />;
        case 'Furniture': return <Sofa size={18} />;
        case 'Fixture': return <Lamp size={18} />;
        default: return <Box size={18} />;
     }
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display text-primary">Danh mục Tài sản</h1>
          <p className="text-body text-muted">Quản lý vòng đời tài sản, bảo hành và cấp phát trang thiết bị.</p>
        </div>
        <div className="flex items-center gap-3">
          <button className="btn-outline flex items-center gap-2"><HistoryIcon size={18} /> Lịch sử bảo trì</button>
          <button className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20">
            <Plus size={18} /> Nhập tài sản
          </button>
        </div>
      </div>

      {/* 1.5 Filters & Summary */}
      <div className="grid grid-cols-1 md:grid-cols-4 lg:grid-cols-6 gap-4">
         <div className="col-span-1 md:col-span-2 relative">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
            <input type="text" placeholder="Tìm theo tên, mã máy, seri..." className="input-base w-full pl-10" />
         </div>
         <select className="input-base">
            <option>Tất cả loại</option>
            <option>Furniture</option>
            <option>Appliance</option>
            <option>Electronics</option>
         </select>
         <select className="input-base">
            <option>Tất cả tình trạng</option>
            <option>New</option>
            <option>Good</option>
            <option>Fair</option>
            <option>Poor</option>
         </select>
         <button className="btn-outline flex items-center justify-center gap-2"><Filter size={16} /> Filter</button>
      </div>

      {/* Asset Grid / Table */}
      <div className="card-container overflow-hidden p-0 border-none shadow-xl shadow-primary/5">
        <div className="overflow-x-auto">
          <table className="w-full text-left">
            <thead className="bg-bg/50 border-b">
              <tr>
                <th className="px-6 py-4 text-label text-muted">Tên tài sản (Asset)</th>
                <th className="px-6 py-4 text-label text-muted">Loại</th>
                <th className="px-6 py-4 text-label text-muted">Tình trạng</th>
                <th className="px-6 py-4 text-label text-muted">Vị trí (Phòng)</th>
                <th className="px-6 py-4 text-label text-muted">Ngày mua (VND)</th>
                <th className="px-6 py-4 text-label text-muted">Hết bảo hành</th>
                <th className="px-6 py-4 text-label text-muted text-right">Hành động</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border/20">
              {isLoading ? (
                <tr>
                  <td colSpan={7} className="py-20 text-center"><Spinner /></td>
                </tr>
              ) : assets?.map((asset) => {
                const isWarrantyExpired = asset.warrantyExpiry ? isBefore(parseISO(asset.warrantyExpiry), new Date()) : false;
                
                return (
                  <tr key={asset.id} className="group hover:bg-primary/[0.02] cursor-pointer transition-all">
                    <td className="px-6 py-4">
                       <div className="flex items-center gap-4">
                          <div className="w-10 h-10 bg-primary/5 text-primary rounded-xl flex items-center justify-center shadow-inner group-hover:scale-110 transition-transform">
                             {getAssetIcon(asset.type)}
                          </div>
                          <div>
                            <p className="text-body font-black text-primary">{asset.assetName}</p>
                            <p className="text-[10px] font-mono font-bold text-muted uppercase">{asset.assetCode}</p>
                          </div>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-black rounded uppercase tracking-tighter">{asset.type}</span>
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex gap-1">
                          {renderStars(asset.condition)}
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       {asset.roomCode ? (
                         <div 
                          className="flex items-center gap-1.5 text-small font-black text-accent hover:underline"
                          onClick={(e) => {
                            e.stopPropagation();
                            navigate(`/admin/rooms/${asset.roomId}`);
                          }}
                         >
                           <Home size={14} /> {asset.roomCode}
                         </div>
                       ) : <span className="text-small text-muted italic">Trong kho</span>}
                    </td>
                    <td className="px-6 py-4">
                       <div className="flex flex-col">
                          <span className="text-small font-bold text-text">{formatDate(asset.purchaseDate || '--')}</span>
                          <span className="text-[10px] text-muted font-black">{formatVND(asset.purchasePrice || 0)}</span>
                       </div>
                    </td>
                    <td className="px-6 py-4">
                       <div className={cn(
                         "flex items-center gap-1.5 text-[11px] font-black uppercase tracking-tighter",
                         isWarrantyExpired ? "text-danger animate-pulse" : "text-primary"
                       )}>
                          {isWarrantyExpired && <ShieldAlert size={14} />}
                          {formatDate(asset.warrantyExpiry || '--')}
                       </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                       <div className="flex items-center justify-end gap-1">
                          <button className="p-2 hover:bg-white rounded-xl text-muted hover:text-primary transition-all shadow-sm">
                             <Wrench size={18} />
                          </button>
                          <button className="p-2 hover:bg-white rounded-xl text-muted transition-all shadow-sm">
                             <MoreVertical size={18} />
                          </button>
                       </div>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
};

export default AssetCatalog;
