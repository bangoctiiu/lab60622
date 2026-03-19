import { QueryClient, QueryCache, MutationCache } from '@tanstack/react-query';
import { toast } from 'sonner';

export const queryClient = new QueryClient({
  queryCache: new QueryCache({
    onError: (error: any) => {
      console.error('Query Error:', error);
      // Optional: detail check if (error?.response?.status === 500)
    },
  }),
  mutationCache: new MutationCache({
    onError: (error: any) => {
      console.error('Mutation Error:', error);
      toast.error(`Thao tác thất bại: ${error.message || 'Lỗi hệ thống'}`);
    },
  }),
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000,    // 5 min
      gcTime: 10 * 60 * 1000,       // 10 min
      retry: 1,
      refetchOnWindowFocus: false,
    },
    mutations: {
      retry: 0,
    }
  },
});
