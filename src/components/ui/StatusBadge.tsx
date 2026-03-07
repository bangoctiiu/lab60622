import React from 'react';
import { cn } from '@/utils';

/**
 * 2.4 Status Badge Variants -- 16 trang thai
 */
export type StatusType = 
  | 'Active' | 'Paid' | 'Completed' 
  | 'Pending' | 'Draft' 
  | 'Overdue' | 'Expired' | 'Terminated' | 'Cancelled'
  | 'Open' | 'InProgress' | 'Resolved' | 'Closed'
  | 'Confirmed' | 'Submitted' | 'Published' 
  | 'Vacant' | 'Occupied' | 'Maintenance' | 'Reserved'
  | 'Apartment' | 'Office' | 'Mixed' | 'Shophouse'
  | 'FullOwner' | 'CoOwner' | 'Investor'
  | 'CheckedOut' | 'Blacklisted';

interface StatusBadgeProps {
  status: StatusType | string;
  className?: string;
  size?: 'sm' | 'md' | 'lg';
}

const statusConfig: Record<string, { bg: string; text: string }> = {
  Active: { bg: '#D1FAE5', text: '#065F46' },
  Paid: { bg: '#D1FAE5', text: '#065F46' },
  Completed: { bg: '#D1FAE5', text: '#065F46' },
  Confirmed: { bg: '#D1FAE5', text: '#065F46' },
  Vacant: { bg: '#D1FAE5', text: '#065F46' },
  Occupied: { bg: '#DBEAFE', text: '#1E40AF' },
  Maintenance: { bg: '#FEF3C7', text: '#92400E' },
  Reserved: { bg: '#EDE9FE', text: '#5B21B6' },
  
  Pending: { bg: '#FEF3C7', text: '#92400E' },
  Expired: { bg: '#FDE68A', text: '#92400E' },
  
  Draft: { bg: '#F3F4F6', text: '#374151' },
  Cancelled: { bg: '#F3F4F6', text: '#6B7280' },
  Terminated: { bg: '#E5E7EB', text: '#6B7280' },
  
  Overdue: { bg: '#FEE2E2', text: '#991B1B' },
  
  Open: { bg: '#DBEAFE', text: '#1E40AF' },
  Submitted: { bg: '#BFDBFE', text: '#1E40AF' },
  
  InProgress: { bg: '#E0F2FE', text: '#0369A1' },
  Resolved: { bg: '#DCFCE7', text: '#166534' },
  Closed: { bg: '#F1F5F9', text: '#475569' },
  Published: { bg: '#CCFBF1', text: '#0F766E' },
  
  Critical: { bg: '#FEE2E2', text: '#991B1B' }, 
  Warning: { bg: '#FEF3C7', text: '#92400E' },
  Info: { bg: '#DBEAFE', text: '#1E40AF' },
  
  // Building Types
  Apartment: { bg: '#DBEAFE', text: '#1E40AF' },
  Office: { bg: '#E0F2FE', text: '#0369A1' },
  Mixed: { bg: '#EDE9FE', text: '#5B21B6' },
  Shophouse: { bg: '#FEF3C7', text: '#92400E' },
  
  // Ownership Types
  FullOwner: { bg: '#DBEAFE', text: '#1E40AF' },
  CoOwner: { bg: '#EDE9FE', text: '#5B21B6' },
  Investor: { bg: '#D1FAE5', text: '#065F46' },
  CheckedOut: { bg: '#F3F4F6', text: '#6B7280' },
  Blacklisted: { bg: '#FEE2E2', text: '#991B1B' },
};

export const StatusBadge: React.FC<StatusBadgeProps> = ({ status, className, size = 'md' }) => {
  const config = statusConfig[status] || statusConfig['Draft'];

  const sizeClasses = {
    sm: 'px-1.5 py-0 text-[10px] font-bold',
    md: 'px-2.5 py-0.5 text-[11px] font-medium',
    lg: 'px-4 py-1.5 text-small font-bold'
  };

  return (
    <span 
      className={cn(
        "inline-flex items-center justify-center rounded-full uppercase tracking-wider",
        sizeClasses[size],
        className
      )}
      style={{
        backgroundColor: config.bg,
        color: config.text
      }}
    >
      {status}
    </span>
  );
};
