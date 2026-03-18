import React, { useState, useEffect } from 'react';
import { User, UserRole } from '@/models/User';
import { Modal } from '@/components/shared/Modal';
import { Button } from '@/components/ui/Button';
import { userService } from '@/services/userService';
import { toast } from 'sonner';
import { Shield, User as UserIcon, Mail, Phone, Lock, Building2 } from 'lucide-react';

interface UserModalProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  user: User | null;
  onSuccess: () => void;
}

const UserModal: React.FC<UserModalProps> = ({ open, onOpenChange, user, onSuccess }) => {
  const isEdit = !!user;
  const [loading, setLoading] = useState(false);
  const [formData, setFormData] = useState<Partial<User>>({
    fullName: '',
    username: '',
    email: '',
    phone: '',
    role: 'Staff' as UserRole,
    isActive: true,
    isTwoFactorEnabled: false,
    buildingsAccess: [],
  });

  useEffect(() => {
    if (user) {
      setFormData(user);
    } else {
      setFormData({
        fullName: '',
        username: '',
        email: '',
        phone: '',
        role: 'Staff',
        isActive: true,
        isTwoFactorEnabled: false,
        buildingsAccess: [],
      });
    }
  }, [user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      setLoading(true);
      if (isEdit) {
        await userService.updateUser(user!.id, formData);
        toast.success('Đã cập nhật thông tin người dùng');
      } else {
        await userService.createUser(formData as Omit<User, 'id'>);
        toast.success('Đã tạo người dùng mới. Mật khẩu mặc định đã được gửi tới email.');
      }
      onSuccess();
      onOpenChange(false);
    } catch (error) {
      toast.error('Có lỗi xảy ra khi lưu thông tin');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Modal 
      isOpen={open} 
      onClose={() => onOpenChange(false)} 
      title={isEdit ? 'Sửa người dùng' : 'Thêm người dùng mới'}
      className="max-w-2xl"
    >
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <UserIcon className="h-4 w-4 text-indigo-500" /> Họ và tên
            </label>
            <input
              type="text"
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              value={formData.fullName}
              onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
              maxLength={200}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" /> Username
            </label>
            <input
              type="text"
              required
              disabled={isEdit}
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50 disabled:bg-slate-100 disabled:text-slate-500"
              value={formData.username}
              onChange={(e) => setFormData({ ...formData, username: e.target.value.toLowerCase().replace(/[^a-z0-9_.]/g, '') })}
              minLength={3}
              maxLength={50}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Mail className="h-4 w-4 text-indigo-500" /> Email
            </label>
            <input
              type="email"
              required
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            />
          </div>
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Phone className="h-4 w-4 text-indigo-500" /> Số điện thoại
            </label>
            <input
              type="tel"
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              value={formData.phone}
              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
              <Shield className="h-4 w-4 text-indigo-500" /> Vai trò
            </label>
            <select
              className="w-full h-11 px-4 rounded-xl border border-slate-200 focus:outline-none focus:ring-2 focus:ring-indigo-500 transition-all bg-slate-50"
              value={formData.role}
              onChange={(e) => setFormData({ ...formData, role: e.target.value as UserRole })}
            >
              <option value="Admin">Admin</option>
              <option value="Staff">Staff</option>
              <option value="Tenant">Tenant</option>
              <option value="Viewer">Viewer</option>
            </select>
          </div>
          <div className="space-y-2">
               <label className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                 <Building2 className="h-4 w-4 text-indigo-500" /> Quản lý tòa nhà
               </label>
               {/* Simplified MultiSelect for now */}
               <div className="text-xs text-slate-500 italic pb-1">Phân quyền cho nhân viên theo tòa nhà.</div>
               <div className="flex gap-2 flex-wrap min-h-[44px] p-2 bg-slate-100 rounded-xl border border-dashed border-slate-300">
                  {formData.buildingsAccess?.length === 0 && <span className="text-slate-400">Tất cả (nếu là Admin)</span>}
                  {formData.buildingsAccess?.map(bid => (
                    <span key={bid} className="bg-white px-2 py-0.5 rounded-lg border text-indigo-600 text-xs font-bold">Building #{bid}</span>
                  ))}
               </div>
          </div>
        </div>

        {!isEdit && (
          <div className="p-4 bg-amber-50 rounded-2xl border border-amber-200 flex items-start gap-3">
             <Lock className="h-5 w-5 text-amber-500 shrink-0 mt-0.5" />
             <div className="space-y-1">
                <span className="text-sm font-bold text-amber-700 block">Thiết lập mật khẩu</span>
                <span className="text-xs text-amber-600">Hệ thống sẽ tự động tạo mật khẩu mạnh và gửi email hướng dẫn kích hoạt cho người dùng. <strong>ForceChangePassword</strong> sẽ được bật mặc định.</span>
             </div>
          </div>
        )}

        <div className="flex justify-end gap-3 pt-4 border-t border-slate-100">
          <Button type="button" variant="outline" onClick={() => onOpenChange(false)} className="h-11 px-6 rounded-xl font-bold">Hủy</Button>
          <Button type="submit" isLoading={loading} className="h-11 px-8 rounded-xl bg-indigo-600 hover:bg-indigo-700 text-white font-bold shadow-lg shadow-indigo-900/10">
            {isEdit ? 'Cập nhật' : 'Tạo tài khoản'}
          </Button>
        </div>
      </form>
    </Modal>
  );
};

export default UserModal;
