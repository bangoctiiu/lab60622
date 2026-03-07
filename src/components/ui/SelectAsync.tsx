import React, { useState, useEffect } from 'react';
import { Search, ChevronDown, Check, Loader2 } from 'lucide-react';
import { cn } from '@/utils';

interface SelectAsyncProps {
  placeholder?: string;
  loadOptions: (search: string) => Promise<{ label: string; value: any }[]>;
  value: any;
  onChange: (value: any) => void;
  className?: string;
  icon?: any;
}

export const SelectAsync = ({ 
  placeholder = 'Chọn...', 
  loadOptions, 
  value, 
  onChange, 
  className,
  icon: Icon
}: SelectAsyncProps) => {
  const [open, setOpen] = useState(false);
  const [options, setOptions] = useState<{ label: string; value: any }[]>([]);
  const [loading, setLoading] = useState(false);
  const [search, setSearch] = useState('');

  useEffect(() => {
    const fetchOptions = async () => {
      setLoading(true);
      try {
        const res = await loadOptions(search);
        setOptions(res);
      } finally {
        setLoading(false);
      }
    };

    const timer = setTimeout(fetchOptions, search ? 300 : 0);
    return () => clearTimeout(timer);
  }, [search, loadOptions]);

  const selectedOption = options.find(o => o.value === value);

  return (
    <div className={cn("relative", className)}>
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="w-full h-12 px-4 bg-white border border-border/50 rounded-2xl flex items-center justify-between hover:border-primary/50 transition-all text-left shadow-sm focus:ring-4 focus:ring-primary/5 outline-none"
      >
        <div className="flex items-center gap-3 overflow-hidden">
          {Icon && <Icon size={16} className="text-muted shrink-0" />}
          <span className={cn("text-small font-bold truncate", !selectedOption && "text-muted")}>
            {selectedOption ? selectedOption.label : placeholder}
          </span>
        </div>
        <ChevronDown size={16} className={cn("text-muted transition-transform duration-300", open && "rotate-180")} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute top-[calc(100%+8px)] left-0 right-0 z-50 bg-white border border-border/50 shadow-2xl rounded-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
             <div className="p-3 border-b bg-bg/20">
                <div className="relative">
                   <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-muted" />
                   <input 
                     autoFocus
                     className="w-full pl-9 pr-3 py-2 bg-white border border-border/10 rounded-xl text-small font-medium placeholder:text-muted/60 outline-none focus:border-primary/30 transition-all"
                     placeholder="Tìm kiếm..."
                     value={search}
                     onChange={(e) => setSearch(e.target.value)}
                   />
                </div>
             </div>
             
             <div className="max-h-60 overflow-y-auto p-2 space-y-1 custom-scrollbar">
                {loading ? (
                   <div className="py-8 flex flex-col items-center justify-center gap-2 text-muted">
                      <Loader2 className="animate-spin" size={20} />
                      <p className="text-[10px] font-bold uppercase tracking-widest">Loading options...</p>
                   </div>
                ) : options.length > 0 ? (
                   options.map((opt) => (
                      <button
                        key={opt.value}
                        onClick={() => {
                           onChange(opt.value);
                           setOpen(false);
                        }}
                        className={cn(
                          "w-full flex items-center justify-between px-3 py-2.5 rounded-xl text-small font-bold transition-all",
                          value === opt.value ? "bg-primary text-white shadow-lg shadow-primary/20" : "text-muted hover:bg-bg hover:text-primary"
                        )}
                      >
                         {opt.label}
                         {value === opt.value && <Check size={14} />}
                      </button>
                   ))
                ) : (
                   <div className="py-8 text-center text-muted text-[10px] font-bold uppercase italic">Không tìm thấy kết quả</div>
                )}
             </div>
          </div>
        </>
      )}
    </div>
  );
};
