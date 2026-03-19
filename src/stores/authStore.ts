import { create } from 'zustand'
import { persist, createJSONStorage } from 'zustand/middleware'
import { User, UserRoleType } from '../models/User'
import axios from 'axios'

interface AuthState {
  // State
  user: User | null;
  accessToken: string | null; // Memory only!
  isAuthenticated: boolean;
  role: UserRoleType | null;
  sessionExpired: boolean;

  // Actions
  login: (user: User, token: string) => void;
  logout: () => void;
  refreshToken: () => Promise<void>; // Logic to refresh token
  setAccessToken: (token: string) => void;
  setUser: (user: User) => void;
  clearAuth: () => void;
  setSessionExpired: (expired: boolean) => void;
}

const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null, 
      isAuthenticated: false,
      role: null,
      sessionExpired: false,

      login: (user, token) => set({ 
        user, 
        accessToken: token, 
        isAuthenticated: true, 
        role: user.role,
        sessionExpired: false
      }),
      
      logout: () => {
        set({ user: null, accessToken: null, isAuthenticated: false, role: null, sessionExpired: false });
        localStorage.removeItem('smartstay-auth-storage');
        localStorage.removeItem('refresh_token');
      },

      setAccessToken: (token) => set({ accessToken: token }),

      refreshToken: async () => {
        try {
          const storedRefreshToken = localStorage.getItem('refresh_token');
          if (!storedRefreshToken) throw new Error("No refresh token");
          
          // Call real API (using raw axios to avoid interceptor loop)
          const baseURL = import.meta.env.VITE_API_URL || 'https://api.smartstay.vn/v1';
          const res = await axios.post(`${baseURL}/auth/refresh`, { token: storedRefreshToken });
          
          const newToken = res.data.accessToken;
          set({ accessToken: newToken });
        } catch (error) {
          set({ sessionExpired: true, isAuthenticated: false });
          throw error;
        }
      },
      
      setUser: (user) => set({ user, role: user.role }),
      
      clearAuth: () => set({ user: null, accessToken: null, isAuthenticated: false, role: null, sessionExpired: false }),
      setSessionExpired: (expired) => set({ sessionExpired: expired }),
    }),
    {
      name: 'smartstay-auth-storage',
      storage: createJSONStorage(() => localStorage),
      // Exclude accessToken from being persisted to localStorage
      partialize: (state) => ({ 
        user: state.user, 
        isAuthenticated: state.isAuthenticated, 
        role: state.role 
      }),
    }
  )
)

export default useAuthStore;
