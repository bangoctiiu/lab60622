import { QueryClientProvider } from '@tanstack/react-query';
import React from 'react';
import { queryClient } from '@/lib/queryClient';
import { Toaster } from 'sonner';
import { OfflineBanner, SessionExpiredOverlay } from '../ui/StatusStates';
import useAuthStore from '@/stores/authStore';

export const AppProviders = ({ children }: { children: React.ReactNode }) => {
  const { isAuthenticated, logout, sessionExpired, setSessionExpired } = useAuthStore();
  
  const handleLoginRedirect = () => {
    setSessionExpired(false);
    logout();
    window.location.href = '/login';
  };
  
  return (
    <QueryClientProvider client={queryClient}>
      <OfflineBanner />
      
      {sessionExpired && <SessionExpiredOverlay onLogin={handleLoginRedirect} />}
      
      {children}
      
      <Toaster 
        position="bottom-right" 
        expand={true} 
        richColors 
        closeButton
        visibleToasts={4}
        duration={4000}
      />
    </QueryClientProvider>
  );
};
