// Admin App Redux/Store Types

// Auth Slice Types
export interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'seller' | 'customer';
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

export interface AuthState {
  user: AdminUser | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Notification Slice Types
export interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
  timestamp: number;
}

export interface NotificationState {
  notifications: Notification[];
}

// UI Store Types (Zustand)
export interface UIState {
  theme: 'light' | 'dark';
  sidebarOpen: boolean;
  language: string;
  toggleTheme: () => void;
  toggleSidebar: () => void;
  setLanguage: (lang: string) => void;
}

// Redux Store Types
export interface AdminRootState {
  auth: AuthState;
  notifications: NotificationState;
}

export type AdminAppDispatch = any; // Will be properly typed in store setup
