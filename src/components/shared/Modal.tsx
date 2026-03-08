import React from 'react';
import { X } from 'lucide-react';
import { cn } from '@/utils';

interface ModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: React.ReactNode;
  className?: string;
}

export const Modal = ({ isOpen, onClose, title, children, className }: ModalProps) => {
  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
      {/* Backdrop */}
      <div 
        className="absolute inset-0 bg-slate-900/60 backdrop-blur-md animate-in fade-in duration-300"
        onClick={onClose}
      />
      
      {/* Content */}
      <div className={cn(
        "relative w-full max-w-lg bg-white rounded-[32px] shadow-2xl shadow-slate-900/20 overflow-hidden animate-in zoom-in-95 slide-in-from-bottom-5 duration-300 border border-white/20",
        className
      )}>
        <div className="px-8 py-6 border-b border-border/10 flex justify-between items-center bg-bg/50">
           <h3 className="text-[14px] font-black uppercase tracking-[3px] text-primary">{title}</h3>
           <button 
             onClick={onClose}
             className="w-10 h-10 rounded-xl hover:bg-white flex items-center justify-center text-muted hover:text-danger transition-all"
           >
              <X size={20} />
           </button>
        </div>
        
        <div className="p-8">
           {children}
        </div>
      </div>
    </div>
  );
};
