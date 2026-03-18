import React, { useState, useEffect } from 'react';
import { 
  Building2, Home, Search, Filter, 
  LayoutGrid, List, Plus, MoreVertical,
  Eye, Edit, Key, ClipboardList, Trash2,
  ChevronRight, ArrowUpDown, Smartphone,
  Zap, Droplets, MapPin, Maximize
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { roomService } from '@/services/roomService';
import { Room, RoomStatus } from '@/models/Room';
import { StatusBadge } from '@/components/ui/StatusBadge';
import { cn, formatVND } from '@/utils';
import { Spinner } from '@/components/ui/Feedback';
import useUIStore from '@/stores/uiStore';
import { usePermission } from '@/hooks/usePermission';
import { RoomModal } from '@/components/rooms/RoomModal';

const RoomList = () => {
  const navigate = useNavigate();
  const { hasPermission } = usePermission();
  const { activeBuildingId } = useUIStore();
  
  const canManage = hasPermission('room.manage');
  const [viewMode, setViewMode] = useState<'List' | 'Grid'>(
    (localStorage.getItem('roomViewMode') as 'List' | 'Grid') || 'Grid'
  );
  const [search, setSearch] = useState('');
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedRoom, setSelectedRoom] = useState<Room | null>(null);

  // Filter states
  const [statusFilter, setStatusFilter] = useState<string[]>([]);
  const [typeFilter, setTypeFilter] = useState('');
  const [minPrice, setMinPrice] = useState<number | undefined>();
  const [maxPrice, setMaxPrice] = useState<number | undefined>();
  const [minFloor, setMinFloor] = useState<number | undefined>();
  const [maxFloor, setMaxFloor] = useState<number | undefined>();
  const [minArea, setMinArea] = useState<number | undefined>();
  const [maxArea, setMaxArea] = useState<number | undefined>();
  const [hasMeter, setHasMeter] = useState<boolean | undefined>();

  // 1.1.1 Handle view toggle persistence
  const toggleView = (mode: 'List' | 'Grid') => {
    setViewMode(mode);
    localStorage.setItem('roomViewMode', mode);
  };

  // Queries
  const { data: rooms, isLoading } = useQuery<Room[]>({
    queryKey: ['rooms', activeBuildingId, search, statusFilter, typeFilter, minPrice, maxPrice, minFloor, maxFloor, minArea, maxArea, hasMeter],
    queryFn: () => roomService.getRooms({
      buildingId: activeBuildingId,
      search,
      status: statusFilter.length > 0 ? statusFilter as RoomStatus[] : undefined,
      roomType: typeFilter || undefined,
      minPrice,
      maxPrice,
      minFloor,
      maxFloor,
      minArea,
      maxArea,
      hasMeter
    })
  });

  const handleCreateRoom = () => {
    setSelectedRoom(null);
    setIsModalOpen(true);
  };

  const handleEditRoom = (room: Room, e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedRoom(room);
    setIsModalOpen(true);
  };

  return (
    <div className="space-y-6 animate-in fade-in duration-500">
      {/* 1.1.1 Page Header & Toggle */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-display text-primary">Danh sách Phòng</h1>
          <p className="text-body text-muted">Quản lý kho phòng, hiện trạng và cư dân đang lưu trú.</p>
        </div>
        <div className="flex items-center gap-3">
          <div className="flex items-center bg-bg/50 p-1 rounded-xl border border-border/50">
            <button
              onClick={() => toggleView('Grid')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'Grid' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-text"
              )}
              title="Grid view"
            >
              <LayoutGrid size={18} />
            </button>
            <button
              onClick={() => toggleView('List')}
              className={cn(
                "p-2 rounded-lg transition-all",
                viewMode === 'List' ? "bg-white text-primary shadow-sm" : "text-muted hover:text-text"
              )}
              title="List view"
            >
              <List size={18} />
            </button>
          </div>
          {canManage && (
            <button
              onClick={handleCreateRoom}
              className="btn-primary flex items-center gap-2 shadow-lg shadow-primary/20"
            >
              <Plus size={18} /> Tạo phòng mới
            </button>
          )}
        </div>
      </div>

      {/* 1.1.2 Filter Panel */}
      <div className="card-container p-6 bg-white/60 backdrop-blur-md space-y-6 shadow-xl shadow-primary/5 border-none">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
           {/* Search */}
           <div className="relative">
             <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" size={18} />
             <input
               type="text"
               placeholder="Tìm mã phòng, tầng..."
               className="input-base w-full pl-10 h-11"
               value={search}
               onChange={(e) => setSearch(e.target.value)}
             />
           </div>

           {/* RoomType */}
           <select
             className="input-base h-11"
             value={typeFilter}
             onChange={(e) => setTypeFilter(e.target.value)}
           >
             <option value="">Tất cả loại phòng</option>
             <option value="Studio">Studio</option>
             <option value="1BR">1 Phòng ngủ</option>
             <option value="2BR">2 Phòng ngủ</option>
             <option value="3BR">3 Phòng ngủ</option>
             <option value="Penthouse">Penthouse</option>
             <option value="Commercial">Kinh doanh</option>
           </select>

           {/* Price Range */}
           <div className="flex items-center gap-2">
             <input
               type="number" placeholder="Giá Min" className="input-base w-full h-11"
               onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : undefined)}
             />
             <span className="text-muted">-</span>
             <input
               type="number" placeholder="Giá Max" className="input-base w-full h-11"
               onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : undefined)}
             />
           </div>

           {/* Floor Range */}
           <div className="flex items-center gap-2">
             <input
               type="number" placeholder="Tầng Min" className="input-base w-full h-11"
               onChange={(e) => setMinFloor(e.target.value ? Number(e.target.value) : undefined)}
             />
             <span className="text-muted">-</span>
             <input
               type="number" placeholder="Tầng Max" className="input-base w-full h-11"
               onChange={(e) => setMaxFloor(e.target.value ? Number(e.target.value) : undefined)}
             />
           </div>

            {/* Area Range */}
            <div className="flex items-center gap-2">
              <input
                type="number" placeholder="DT Min (m2)" className="input-base w-full h-11"
                onChange={(e) => setMinArea(e.target.value ? Number(e.target.value) : undefined)}
              />
              <span className="text-muted">-</span>
              <input
                type="number" placeholder="DT Max (m2)" className="input-base w-full h-11"
                onChange={(e) => setMaxArea(e.target.value ? Number(e.target.value) : undefined)}
              />
            </div>
        </div>

        {/* Status MultiSelect Simulation */}
        <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-dashed">
           <span className="text-[10px] font-black text-muted uppercase tracking-widest mr-2">Trạng thái:</span>
           {['Vacant', 'Occupied', 'Maintenance', 'Reserved'].map((status) => (
             <button
               key={status}
               onClick={() => {
                 setStatusFilter(prev =>
                   prev.includes(status) ? prev.filter(s => s !== status) : [...prev, status]
                 );
               }}
               className={cn(
                 "px-4 py-1.5 rounded-full text-[10px] font-black uppercase tracking-widest transition-all border",
                 statusFilter.includes(status)
                   ? "bg-primary text-white border-primary shadow-lg"
                   : "bg-white text-muted border-border hover:border-primary/30"
               )}
             >
               {status === 'Vacant' ? 'Trống' : status === 'Occupied' ? 'Đang ở' : status === 'Maintenance' ? 'Bảo trì' : 'Đã đặt'}
             </button>
           ))}

           <div className="ml-auto flex items-center gap-4">
              <label className="flex items-center gap-2 cursor-pointer group">
                 <input
                  type="checkbox"
                  className="w-4 h-4 rounded border-border text-primary focus:ring-primary"
                  checked={hasMeter === true}
                  onChange={(e) => setHasMeter(e.target.checked ? true : undefined)}
                 />
                 <span className="text-[10px] font-black uppercase text-muted group-hover:text-primary transition-colors">Có đồng hồ</span>
              </label>
              <button
                onClick={() => {
                  setSearch('');
                  setStatusFilter([]);
                  setTypeFilter('');
                  setMinPrice(undefined);
                  setMaxPrice(undefined);
                  setMinFloor(undefined);
                  setMaxFloor(undefined);
                  setMinArea(undefined);
                  setMaxArea(undefined);
                  setHasMeter(undefined);
                }}
                className="text-[10px] font-black text-danger uppercase tracking-widest hover:underline"
              >
                Xoá bộ lọc
              </button>
           </div>
        </div>
      </div>

      {isLoading ? (
        <div className="py-20 flex flex-col items-center justify-center gap-4">
          <Spinner />
          <p className="text-small text-muted font-bold animate-pulse uppercase tracking-[3px]">Carregando Salas...</p>
        </div>
      ) : viewMode === 'Grid' ? (
        /* 1.1.1 Grid View */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
          {rooms?.map((room) => (
            <div 
              key={room.id}
              onClick={() => navigate(`/rooms/${room.id}`)}
              className="group card-container p-0 overflow-hidden hover:shadow-2xl hover:-translate-y-1 transition-all duration-300 cursor-pointer border-none shadow-xl shadow-primary/5"
            >
              {/* Thumbnail */}
              <div className="relative h-48 overflow-hidden bg-bg">
                <img 
                  src={room.thumbnailUrl || 'https://images.unsplash.com/photo-1513584684374-8bdb7489fe92?w=500'} 
                  alt={room.roomCode}
                  className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700"
                />
                <div className="absolute top-3 right-3">
                  <StatusBadge status={room.status} size="sm" className="shadow-lg" />
                </div>
                <div className="absolute bottom-0 left-0 right-0 p-4 bg-gradient-to-t from-black/80 to-transparent">
                  <p className="text-white font-black text-h3 tracking-tight">{room.roomCode}</p>
                </div>
              </div>

              {/* Content */}
              <div className="p-5 space-y-4 bg-white/40 backdrop-blur-md">
                <div className="flex items-center justify-between text-[11px] font-bold text-muted uppercase tracking-widest">
                   <span className="flex items-center gap-1"><MapPin size={12} className="text-primary" /> Tang {room.floorNumber}</span>
                   <span className="flex items-center gap-1"><Maximize size={12} className="text-primary" /> {room.areaSqm} m2</span>
                </div>
                
                <div className="flex items-center justify-between border-t border-dashed pt-4">
                  <div className="space-y-0.5">
                    <p className="text-[10px] text-muted font-black uppercase">Gia thue CB</p>
                    <p className="text-body font-black text-primary">{formatVND(room.baseRentPrice)}</p>
                  </div>
                  <div className="flex -space-x-2">
                    {room.tenantNames?.map((name, i) => (
                      <div key={i} className="w-8 h-8 rounded-full border-2 border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary shadow-sm" title={name}>
                        {name.charAt(0)}
                      </div>
                    ))}
                    {!room.tenantNames && (
                       <div className="w-8 h-8 rounded-full border-2 border-white bg-bg flex items-center justify-center text-muted">
                         <Home size={14} />
                       </div>
                    )}
                  </div>
                </div>

                <div className="flex items-center justify-between gap-2 pt-2">
                    <button 
                      onClick={(e) => { e.stopPropagation(); navigate(`/rooms/${room.id}`); }}
                      className="flex-1 btn-outline-sm group-hover:bg-primary group-hover:text-white transition-all py-2 rounded-xl text-[10px] font-black uppercase tracking-widest"
                    >
                       Chi tiết
                    </button>
                    {canManage && (
                      <button 
                        onClick={(e) => handleEditRoom(room, e)}
                        className="p-2 hover:bg-bg rounded-xl text-muted hover:text-primary transition-all"
                      >
                         <Edit size={16} />
                      </button>
                    )}
                </div>
              </div>
            </div>
          ))}
        </div>
      ) : (
        /* 1.1.3 List View (DataTable) */
        <div className="card-container overflow-hidden p-0 border-none shadow-xl shadow-primary/5">
          <div className="overflow-x-auto">
            <table className="w-full text-left">
              <thead className="bg-bg/50 border-b">
                <tr>
                  <th className="px-6 py-4 text-label text-muted">Thumbnail</th>
                  <th className="px-6 py-4 text-label text-muted">Mã Phòng</th>
                  <th className="px-6 py-4 text-label text-muted">Tầng</th>
                  <th className="px-6 py-4 text-label text-muted">Dien tich</th>
                  <th className="px-6 py-4 text-label text-muted">Loại phong</th>
                  <th className="px-6 py-4 text-label text-muted text-center">Trạng thái</th>
                  <th className="px-6 py-4 text-label text-muted">Giá thuê CB</th>
                  <th className="px-6 py-4 text-label text-muted">Cu dan</th>
                  <th className="px-6 py-4 text-label text-muted text-right">Hành động</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-border/20">
                {rooms?.map((room) => (
                  <tr 
                    key={room.id} 
                    className="group hover:bg-primary/[0.02] cursor-pointer transition-all"
                    onClick={() => navigate(`/rooms/${room.id}`)}
                  >
                    <td className="px-6 py-3">
                      <img 
                        src={room.thumbnailUrl || 'https://via.placeholder.com/48'} 
                        className="w-12 h-12 rounded-xl object-cover shadow-sm border border-border/50" 
                        alt=""
                      />
                    </td>
                    <td className="px-6 py-3">
                      <span className="text-body font-black text-primary font-mono tracking-tighter">{room.roomCode}</span>
                    </td>
                    <td className="px-6 py-3 text-body font-medium text-muted">Tầng {room.floorNumber}</td>
                    <td className="px-6 py-3 text-body font-black text-text">{room.areaSqm} m2</td>
                    <td className="px-6 py-3">
                      <span className="px-2 py-1 bg-primary/5 text-primary text-[10px] font-black rounded-lg uppercase">{room.roomType}</span>
                    </td>
                    <td className="px-6 py-3 text-center">
                      <StatusBadge status={room.status} size="sm" />
                    </td>
                    <td className="px-6 py-3 font-display font-black text-secondary">{formatVND(room.baseRentPrice)}</td>
                    <td className="px-6 py-3">
                       <div className="flex -space-x-1.5">
                          {room.tenantNames?.map((n, i) => (
                            <div key={i} className="w-7 h-7 rounded-full border border-white bg-primary/10 flex items-center justify-center text-[10px] font-bold text-primary">
                              {n.charAt(0)}
                            </div>
                          ))}
                       </div>
                    </td>
                    <td className="px-6 py-3 text-right">
                      <div className="flex items-center justify-end gap-2">
                        {canManage && (
                          <button 
                            onClick={(e) => handleEditRoom(room, e)}
                            className="p-2 hover:bg-white hover:shadow-lg rounded-xl text-muted hover:text-primary transition-all"
                          >
                            <Edit size={18} />
                          </button>
                        )}
                        <button className="p-2 hover:bg-white hover:shadow-lg rounded-xl text-muted transition-all">
                          <MoreVertical size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      <RoomModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        room={selectedRoom}
      />
    </div>
  );
};

export default RoomList;
