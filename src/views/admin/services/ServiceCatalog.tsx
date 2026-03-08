import React, { useState, useMemo } from "react";
import { useSearchParams } from "react-router-dom";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { toast } from "sonner";
import { 
  Plus, 
  Search, 
  Filter, 
  RotateCcw, 
  LayoutGrid, 
  Eye, 
  Edit3, 
  History, 
  ShieldAlert,
  ArrowRight
} from "lucide-react";

import { 
  getServices, 
  toggleServiceActive 
} from "@/services/serviceService";
import { 
  Service, 
  ServiceFilter, 
  ServiceType 
} from "@/types/service";
import { 
  SERVICE_TYPE_LABELS, 
  SERVICE_TYPE_COLORS, 
  formatVND 
} from "@/utils/serviceHelpers";
import { 
  DataTable, 
  FilterPanel, 
  FilterConfig,
  StatusBadge,
  RowAction
} from "@/components/shared";
import { useConfirm } from "@/hooks/useConfirm";
import { cn, formatDate } from "@/utils";
import ServiceDetailModal from "@/components/service/ServiceDetailModal";
import UpdatePriceModal from "@/components/service/UpdatePriceModal";
import { EmptyState, ErrorBanner } from "@/components/ui/StatusStates";

const ServiceCatalog: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryClient = useQueryClient();
  const { confirm } = useConfirm();

  // Modal states
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [modalMode, setModalMode] = useState<"create" | "view" | "edit" | null>(null);
  const [showUpdatePrice, setShowUpdatePrice] = useState(false);
  const [targetService, setTargetService] = useState<Service | null>(null);

  // Filter state from URL
  const filters: ServiceFilter = useMemo(() => {
    return {
      page: Number(searchParams.get("page")) || 1,
      limit: Number(searchParams.get("limit")) || 10,
      search: searchParams.get("search") || "",
      serviceType: (searchParams.get("serviceType") as ServiceType) || undefined,
      isActive: searchParams.get("isActive") === "false" ? false : true, // default true
      sortBy: searchParams.get("sortBy") || "serviceName",
      sortDir: (searchParams.get("sortDir") as "asc" | "desc") || "asc",
    };
  }, [searchParams]);

  // Main Query
  const { data, isLoading, isError, refetch } = useQuery({
    queryKey: ["services", filters],
    queryFn: () => getServices(filters),
  });

  // Toggle Active Mutation (Optimistic Update)
  const toggleMutation = useMutation({
    mutationFn: ({ id, isActive }: { id: number; isActive: boolean }) => 
      toggleServiceActive(id, isActive),
    onMutate: async ({ id, isActive }) => {
      await queryClient.cancelQueries({ queryKey: ["services", filters] });
      const previousData = queryClient.getQueryData<{ data: Service[]; total: number }>(["services", filters]);
      
      if (previousData) {
        queryClient.setQueryData(["services", filters], {
          ...previousData,
          data: previousData.data.map(s => s.serviceId === id ? { ...s, isActive } : s)
        });
      }
      return { previousData };
    },
    onError: (err, variables, context) => {
      if (context?.previousData) {
        queryClient.setQueryData(["services", filters], context.previousData);
      }
      toast.error("Không thể thay đổi trạng thái dịch vụ");
    },
    onSuccess: (data, variables) => {
      toast.success(`Đã ${variables.isActive ? "kích hoạt" : "vô hiệu hóa"} dịch vụ`);
    },
    onSettled: () => {
      queryClient.invalidateQueries({ queryKey: ["services"] });
    }
  });

  const handleToggleActive = async (service: Service) => {
    const newStatus = !service.isActive;
    
    if (!newStatus) { // Confirming deactivation
      const isConfirmed = await confirm({
        title: "Vô hiệu hóa dịch vụ?",
        description: `Dịch vụ '${service.serviceName}' (${service.serviceCode}) sẽ không thể chọn khi tạo hợp đồng mới. Bạn có chắc chắn?`,
        variant: "danger",
        confirmLabel: "Vô hiệu hóa",
      });
      if (!isConfirmed) return;
    }

    toggleMutation.mutate({ id: service.serviceId, isActive: newStatus });
  };

  const handleFilterChange = (newValues: Record<string, any>) => {
    const params = new URLSearchParams(searchParams);
    params.set("page", "1"); // Reset page on filter change
    
    Object.entries(newValues).forEach(([key, value]) => {
      if (value !== undefined && value !== null && value !== "") {
        params.set(key, String(value));
      } else {
        params.delete(key);
      }
    });
    setSearchParams(params);
  };

  const filterConfigs: FilterConfig[] = [
    {
      key: "search",
      label: "Tìm kiếm",
      type: "text",
      placeholder: "Tìm theo tên dịch vụ...",
      className: "lg:col-span-2"
    },
    {
      key: "serviceType",
      label: "Loại dịch vụ",
      type: "select",
      options: Object.entries(SERVICE_TYPE_LABELS).map(([val, label]) => ({
        label, value: val
      }))
    },
    {
      key: "isActive",
      label: "Chỉ hiện hoạt động",
      type: "toggle",
    }
  ];

  const columns = [
    {
      id: "serviceName",
      header: "Tên dịch vụ",
      accessorKey: "serviceName",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="flex flex-col">
          <span className="font-bold text-slate-900 group-hover:text-primary transition-colors">
            {row.original.serviceName}
          </span>
          <span className="text-[10px] text-slate-400 font-mono uppercase tracking-tighter">
            {row.original.serviceCode}
          </span>
        </div>
      )
    },
    {
      id: "serviceType",
      header: "Loại",
      accessorKey: "serviceType",
      cell: ({ row }: { row: { original: Service } }) => (
        <span className={cn(
          "px-2.5 py-1 rounded-full text-[10px] font-black uppercase tracking-wider",
          SERVICE_TYPE_COLORS[row.original.serviceType] || "bg-slate-100 text-slate-600"
        )}>
          {SERVICE_TYPE_LABELS[row.original.serviceType] || row.original.serviceType}
        </span>
      )
    },
    {
      id: "currentPrice",
      header: "Giá hiện tại",
      accessorKey: "currentPrice",
      cell: ({ row }: { row: { original: Service } }) => (
        <div className="flex flex-col items-start gap-1">
          {/* RULE-08: Giá lấy từ Lịch sử giá mới nhất */}
          <span className="text-sm font-black text-slate-800 tabular-nums">
            {formatVND(row.original.currentPrice)}
          </span>
          <span className="text-[10px] text-slate-400 font-medium italic">
             áp dụng từ {formatDate(row.original.currentPriceEffectiveFrom)}
          </span>
        </div>
      )
    },
    {
      id: "unit",
      header: "Đơn vị",
      accessorKey: "unit",
      enableSorting: false,
      cell: ({ row }: { row: { original: Service } }) => (
        <span className="text-sm font-semibold text-slate-600 bg-slate-50 px-2.5 py-1 rounded-lg border border-slate-100">
           {row.original.unit}
        </span>
      )
    },
    {
      id: "isActive",
      header: "Trạng thái",
      accessorKey: "isActive",
      cell: ({ row }: { row: { original: Service } }) => (
        <button
            onClick={() => handleToggleActive(row.original)}
            className={cn(
                "w-12 h-6 rounded-full relative transition-all p-1",
                row.original.isActive ? "bg-green-500 shadow-[0_0_15px_-3px_rgba(34,197,94,0.4)]" : "bg-slate-300"
            )}
        >
            <div className={cn(
                "w-4 h-4 bg-white rounded-full shadow-sm transition-transform",
                row.original.isActive ? "translate-x-6" : "translate-x-0"
            )} />
        </button>
      )
    }
  ];

  const rowActions: RowAction<Service>[] = [
    {
      label: "Xem chi tiết",
      icon: <Eye size={16} />,
      onClick: (row: Service) => {
        setSelectedServiceId(row.serviceId);
        setModalMode("view");
      }
    },
    {
      label: "Chỉnh sửa cơ bản",
      icon: <Edit3 size={16} />,
      onClick: (row: Service) => {
        setSelectedServiceId(row.serviceId);
        setModalMode("edit");
      }
    },
    {
      label: "Cập nhật giá mới",
      icon: <History size={16} />,
      onClick: (row: Service) => {
        setTargetService(row);
        setShowUpdatePrice(true);
      }
    },
    {
      type: 'divider' as const
    },
    {
      label: "Vô hiệu hóa",
      icon: <ShieldAlert size={16} />,
      variant: 'danger' as const,
      onClick: (row: Service) => handleToggleActive(row)
    }
  ];

  return (
    <div className="p-8 space-y-8 animate-in fade-in duration-700">
      {/* Page Header */}
      <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="space-y-1">
          <div className="flex items-center gap-3">
             <div className="w-12 h-12 bg-primary rounded-2xl flex items-center justify-center text-white shadow-xl shadow-primary/20">
                <LayoutGrid size={24} />
             </div>
             <div>
                <h1 className="text-2xl font-black text-slate-900 flex items-center gap-3">
                    Danh mục Dịch vụ
                    <span className="bg-slate-100 text-slate-500 text-[11px] font-black px-3 py-1 rounded-full uppercase tracking-widest">
                        {data?.total || 0} mục
                    </span>
                </h1>
                <p className="text-slate-500 text-sm font-medium italic">
                    Quản lý các loại dịch vụ tiện ích, phí quản lý và cấu hình giá bất biến (RULE-08).
                </p>
             </div>
          </div>
        </div>

        <button
          onClick={() => {
            setModalMode("create");
            setSelectedServiceId(null);
          }}
          className="px-8 h-14 bg-primary text-white rounded-[20px] font-black text-[11px] uppercase tracking-[3px] shadow-2xl shadow-primary/30 hover:bg-primary/90 hover:translate-y-[-4px] active:translate-y-[0] transition-all flex items-center gap-3"
        >
          <Plus size={20} />
          Thêm dịch vụ mới
        </button>
      </div>

      {/* Filters */}
      <FilterPanel 
        filters={filterConfigs}
        values={filters}
        onChange={handleFilterChange}
        activeCount={Object.entries(filters).filter(([k,v]) => k !== 'page' && k !== 'limit' && k !== 'sortBy' && k !== 'sortDir' && v !== undefined && v !== "" && v !== true).length}
        onReset={() => setSearchParams({ page: "1", limit: "10", isActive: "true" })}
      />

      {/* Main Content Area */}
      {isLoading ? (
        <div className="bg-white rounded-[32px] border border-slate-100 shadow-xl overflow-hidden p-1">
           <table className="w-full text-left">
              <thead><tr className="bg-slate-50/50"><td className="px-8 py-5 h-4 bg-slate-100 animate-pulse m-2 rounded" colSpan={6}/></tr></thead>
              <tbody>
                {[1,2,3,4,5].map(i => (
                  <tr key={i} className="border-b border-slate-50 animate-pulse">
                    <td className="px-8 py-6"><div className="h-4 w-32 bg-slate-100 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-4 w-20 bg-slate-50 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-4 w-24 bg-slate-100 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-4 w-16 bg-slate-50 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-4 w-12 bg-slate-100 rounded" /></td>
                    <td className="px-8 py-6"><div className="h-4 w-6 bg-slate-50 rounded ml-auto" /></td>
                  </tr>
                ))}
              </tbody>
           </table>
        </div>
      ) : isError ? (
        <ErrorBanner message="Không thể tải danh sách dịch vụ" onRetry={refetch} />
      ) : data?.data.length === 0 ? (
        <div className="bg-white rounded-[40px] border border-dashed border-slate-200 py-32 flex flex-col items-center justify-center text-center">
            <EmptyState 
                title="Chưa có dịch vụ nào" 
                message="Hãy tạo dịch vụ đầu tiên để bắt đầu quản lý phí của tòa nhà."
            />
            <button
                onClick={() => setModalMode("create")}
                className="mt-8 flex items-center gap-2 text-primary font-black uppercase text-xs tracking-widest hover:underline"
            >
                <Plus size={16} /> Thêm ngay
            </button>
        </div>
      ) : (
        <div className="shadow-2xl shadow-slate-200/50 rounded-[32px] overflow-hidden">
            <DataTable 
                columns={columns}
                data={data?.data ?? []}
                total={data?.total ?? 0}
                pagination={{
                    page: filters.page,
                    limit: filters.limit,
                    onChange: (p, l) => handleFilterChange({ page: p, limit: l })
                }}
                sorting={{
                    sortBy: filters.sortBy || "serviceName",
                    sortDir: filters.sortDir || "asc",
                    onChange: (b, d) => handleFilterChange({ sortBy: b, sortDir: d })
                }}
                rowActions={rowActions}
                rowClassName={(row) => !row.isActive ? "opacity-60 bg-slate-50/30" : ""}
            />
        </div>
      )}

      {/* Modals */}
      <ServiceDetailModal
        open={modalMode !== null}
        onClose={() => {
            setModalMode(null);
            setSelectedServiceId(null);
        }}
        serviceId={selectedServiceId}
        mode={modalMode || "view"}
        onSuccess={() => {
            queryClient.invalidateQueries({ queryKey: ["services"] });
        }}
      />

      {targetService && (
        <UpdatePriceModal
            open={showUpdatePrice}
            onClose={() => {
                setShowUpdatePrice(false);
                setTargetService(null);
            }}
            service={targetService}
            onSuccess={() => {
                queryClient.invalidateQueries({ queryKey: ["services"] });
            }}
        />
      )}
    </div>
  );
};

export default ServiceCatalog;
