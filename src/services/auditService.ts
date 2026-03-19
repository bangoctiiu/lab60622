import { AuditLog } from '@/types';
import { mockAuditLogs } from '@/mocks/userMocks';

export const auditService = {
  getLogs: async (filters?: Record<string, any>): Promise<AuditLog[]> => {
    // Simulated delay
    await new Promise(resolve => setTimeout(resolve, 500));
    
    let logs = [...mockAuditLogs];
    
    if (filters?.search) {
      const s = filters.search.toLowerCase();
      logs = logs.filter(l => 
        l.username.toLowerCase().includes(s) || 
        l.action.toLowerCase().includes(s) || 
        l.details.toLowerCase().includes(s)
      );
    }
    
    return logs;
  }
};
