import React from 'react';
import { cn } from '@/utils';
import { cva, type VariantProps } from 'class-variance-authority';

const badgeVariants = cva(
  'inline-flex items-center rounded-full font-medium transition-colors',
  {
    variants: {
      status: {
        Active: 'bg-green-100 text-green-800',
        Paid: 'bg-green-100 text-green-800',
        Completed: 'bg-green-100 text-green-800',
        Pending: 'bg-yellow-100 text-yellow-800',
        Draft: 'bg-yellow-100 text-yellow-800',
        Submitted: 'bg-yellow-100 text-yellow-800',
        Overdue: 'bg-red-100 text-red-800',
        Expired: 'bg-red-100 text-red-800',
        Terminated: 'bg-red-100 text-red-800',
        InProgress: 'bg-blue-100 text-blue-800',
        Confirmed: 'bg-blue-100 text-blue-800',
        Open: 'bg-teal-100 text-teal-800',
        Cancelled: 'bg-gray-100 text-gray-600',
        Rejected: 'bg-gray-100 text-gray-600',
        Closed: 'bg-gray-100 text-gray-600',
        Vacant: 'bg-emerald-100 text-emerald-800',
        Occupied: 'bg-blue-100 text-blue-800',
        Maintenance: 'bg-amber-100 text-amber-800',
        Reserved: 'bg-purple-100 text-purple-800',
        Resolved: 'bg-green-100 text-green-800',
        Published: 'bg-teal-100 text-teal-800',
      },
      size: {
        sm: 'px-2 py-0.5 text-xs',
        md: 'px-2.5 py-0.5 text-sm',
        lg: 'px-3 py-1 text-base',
      },
    },
    defaultVariants: {
      size: 'md',
    },
  }
);

export interface StatusBadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {
  children?: React.ReactNode;
  label?: string;
}

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

export const StatusBadge: React.FC<StatusBadgeProps> = ({
  status,
  size,
  className,
  children,
  label,
  ...props
}) => {
  const displayLabel = label || (status ? statusMap[status as string] || status : '');
  
  return (
    <div className={cn(badgeVariants({ status: status as any, size, className }))} {...props}>
      {children || displayLabel}
    </div>
  );
};
