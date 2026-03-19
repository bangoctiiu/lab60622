import React from 'react';
import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors uppercase tracking-wider',
  {
    variants: {
      status: {
        Active: 'bg-green-100 text-green-800 border-green-200',
        Paid: 'bg-green-100 text-green-800 border-green-200',
        Completed: 'bg-green-100 text-green-800 border-green-200',
        Confirmed: 'bg-green-100 text-green-800 border-green-200',
        Resolved: 'bg-green-100 text-green-800 border-green-200',
        
        Pending: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Draft: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Submitted: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        Warning: 'bg-yellow-100 text-yellow-800 border-yellow-200',
        
        Overdue: 'bg-red-100 text-red-800 border-red-200',
        Expired: 'bg-red-100 text-red-800 border-red-200',
        Terminated: 'bg-red-100 text-red-800 border-red-200',
        Rejected: 'bg-red-100 text-red-800 border-red-200',
        Critical: 'bg-red-100 text-red-800 border-red-200',
        Blacklisted: 'bg-red-100 text-red-800 border-red-200',
        
        InProgress: 'bg-blue-100 text-blue-800 border-blue-200',
        Occupied: 'bg-blue-100 text-blue-800 border-blue-200',
        Open: 'bg-blue-100 text-blue-800 border-blue-200',
        Info: 'bg-blue-100 text-blue-800 border-blue-200',
        Apartment: 'bg-blue-100 text-blue-800 border-blue-200',
        
        Vacant: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        Published: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        Investor: 'bg-emerald-100 text-emerald-800 border-emerald-200',
        
        Maintenance: 'bg-amber-100 text-amber-800 border-amber-200',
        Shophouse: 'bg-amber-100 text-amber-800 border-amber-200',
        
        Reserved: 'bg-purple-100 text-purple-800 border-purple-200',
        CoOwner: 'bg-purple-100 text-purple-800 border-purple-200',
        Mixed: 'bg-purple-100 text-purple-800 border-purple-200',
        
        Cancelled: 'bg-gray-100 text-gray-600 border-gray-200',
        Closed: 'bg-gray-100 text-gray-600 border-gray-200',
        CheckedOut: 'bg-gray-100 text-gray-600 border-gray-200',
        
        Office: 'bg-sky-100 text-sky-800 border-sky-200',
        FullOwner: 'bg-indigo-100 text-indigo-800 border-indigo-200',
      },
      size: {
        sm: 'px-1.5 py-0 text-[10px] font-bold',
        md: 'px-2.5 py-0.5 text-[11px] font-medium',
        lg: 'px-4 py-1.5 text-sm font-bold',
      },
    },
    defaultVariants: {
      status: 'Draft',
      size: 'md',
    },
  }
);

const statusMap: Record<string, string> = {
  Active: 'Hoàn thành',
  Paid: 'Đã thanh toán',
  Completed: 'Đã hoàn thành',
  Pending: 'Chờ xử lý',
  Draft: 'Bản nháp',
  Submitted: 'Đã gửi',
  Overdue: 'Quá hạn',
  Expired: 'Hết hạn',
  Terminated: 'Chấm dứt',
  InProgress: 'Đang xử lý',
  Confirmed: 'Đã xác nhận',
  Open: 'Mở',
  Cancelled: 'Đã hủy',
  Rejected: 'Bị từ chối',
  Closed: 'Đã đóng',
  Vacant: 'Phòng trống',
  Occupied: 'Đang ở',
  Maintenance: 'Bảo trì',
  Reserved: 'Đã đặt chỗ',
  Resolved: 'Đã hoàn thành',
  Published: 'Đã xuất bản',
};

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  label?: string;
}

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size,
  className,
  children,
  label,
  ...props
}) => {
  const displayLabel = label || children || (status ? statusMap[status as string] || status : '');
  
  return (
    <span className={cn(badgeVariants({ status: status as any, size, className }), "border")} {...props}>
      {displayLabel}
    </span>
  );
};
