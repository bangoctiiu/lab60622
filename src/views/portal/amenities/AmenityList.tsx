import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Coffee, MapPin, Clock, ArrowRight, ShieldCheck, Waves, Dumbbell, Utensils, AlertCircle } from 'lucide-react';
import { getServices } from '@/services/serviceService';
import { Service } from '@/types/service';

const AmenityList: React.FC = () => {
  const [amenities, setAmenities] = useState<Service[]>([]);
  const [loading, setLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchAmenities = async () => {
      setLoading(true);
      try {
        const { data } = await getServices({ search: '', page: 1, limit: 100 });
        setAmenities(data);
      } catch (error) {
        console.error('Error fetching amenities:', error);
      } finally {
        setLoading(false);
      }
    };
    fetchAmenities();
  }, []);

  const getIcon = (name: string) => {
    const n = name.toLowerCase();
    if (n.includes('bơi')) return Waves;
    if (n.includes('gym') || n.includes('thể')) return Dumbbell;
    if (n.includes('ăn') || n.includes('bbq') || n.includes('thực')) return Utensils;
    if (n.includes('cà phê') || n.includes('coffee')) return Coffee;
    return MapPin;
  };

  if (loading) {
    return (
      <div className="min-h-[60vh] flex flex-col items-center justify-center space-y-4 px-6">
        <div className="w-12 h-12 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
        <p className="text-small text-muted font-bold animate-pulse uppercase tracking-widest">Đang tải tiện ích...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6 pb-24 animate-in fade-in slide-in-from-bottom-4 duration-700 px-4 pt-4">
      <div className="flex items-center justify-between">
        <h2 className="text-h2 font-bold">Tiện ích</h2>
        <div className="w-10"></div>
      </div>

      <div className="bg-gradient-to-br from-primary/10 to-accent/10 p-6 rounded-3xl border border-white/50 space-y-4">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 bg-white rounded-xl shadow-sm flex items-center justify-center text-primary">
            <ShieldCheck size={24} />
          </div>
          <div className="flex-1">
            <p className="text-small font-bold">Thẻ cư dân VIP</p>
            <p className="text-[11px] text-muted">Hết hạn: 31/12/2026</p>
          </div>
        </div>
        <p className="text-[11px] text-muted font-medium italic">Sử dụng QR Code của bạn để truy cập các khu vực tiện ích đã đăng ký.</p>
      </div>

      <div className="grid grid-cols-1 gap-4">
        {amenities.length > 0 ? (
          amenities.map((item) => {
            const Icon = getIcon(item.serviceName);
            return (
              <div 
                key={item.serviceId}
                className="card-container p-5 bg-white border-none shadow-sm flex items-center gap-5 active:scale-[0.98] transition-all"
              >
                <div className={`w-14 h-14 bg-bg rounded-2xl flex items-center justify-center text-primary shadow-inner`}>
                  <Icon size={28} />
                </div>
                <div className="flex-1 space-y-1">
                  <p className="text-body font-bold">{item.serviceName}</p>
                  <div className="flex items-center gap-2 text-muted text-[11px] font-medium uppercase tracking-wider">
                    Mã: {item.serviceCode}
                  </div>
                  <div className="flex items-center gap-2 text-[11px] font-bold">
                    <Clock size={12} className="text-muted" /> 
                    <span className={item.isActive ? 'text-success' : 'text-error'}>
                      {item.isActive ? 'Mở cửa' : 'Đóng cửa'}
                    </span>
                  </div>
                </div>
                <ArrowRight size={18} className="text-muted/30" />
              </div>
            );
          })
        ) : (
          <div className="text-center py-20 bg-white rounded-3xl opacity-50 space-y-2 border-2 border-dashed border-muted/10">
            <AlertCircle size={40} className="mx-auto text-muted" />
            <p className="text-body font-bold text-muted">Không có tiện ích nào</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default AmenityList;
