import { format } from 'date-fns';
import { vi } from 'date-fns/locale';
import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

/**
 * Format number to VND currency
 */
export const formatVND = (amount: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'currency',
    currency: 'VND',
  }).format(amount);
};

/**
 * Format date to standard SmartStay format
 */
export const formatDate = (date: Date | string | number, formatStr: string = 'dd/MM/yyyy'): string => {
  return format(new Date(date), formatStr, { locale: vi });
};

/**
 * Mask CCCD/ID Card number for security (Requirement: Mask first 8 chars)
 */
export const maskCCCD = (id: string): string => {
  if (!id || id.length < 12) return id;
  return '********' + id.substring(8);
};

/**
 * Mask Phone number (Hide middle numbers)
 */
export const maskPhone = (phone: string): string => {
  if (!phone || phone.length < 9) return phone;
  return phone.substring(0, 3) + '****' + phone.substring(phone.length - 3);
};

import { differenceInYears, formatDistanceToNow } from 'date-fns';
export const calculateAge = (dob: string | Date): string => {
  if (!dob) return '--';
  const age = differenceInYears(new Date(), new Date(dob));
  return `${age} tuổi`;
};

/**
 * Format relative time (e.g. "2 mins ago")
 */
export const formatRelativeTime = (date: string | Date): string => {
  return formatDistanceToNow(new Date(date), { addSuffix: true, locale: vi });
};

/**
 * Format number to percentage
 */
export const formatPercentage = (val: number): string => {
  return new Intl.NumberFormat('vi-VN', {
    style: 'percent',
    minimumFractionDigits: 1,
    maximumFractionDigits: 1,
  }).format(val / 100);
};
