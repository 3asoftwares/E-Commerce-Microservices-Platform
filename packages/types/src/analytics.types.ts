// Analytics Types
export interface DashboardStats {
  totalUsers: number;
  totalOrders: number;
  totalRevenue: number;
  totalProducts?: number;
  pendingOrders: number;
  recentOrders?: any[];
  topProducts?: any[];
  lowStockProducts?: any[];
}

export interface SalesData {
  date: string;
  sales: number;
  orders: number;
  revenue: number;
}

export interface SalesAnalytics {
  daily: SalesData[];
  weekly: SalesData[];
  monthly: SalesData[];
  yearly?: SalesData[];
}

// Notification Types
export interface Notification {
  id: string;
  userId: string;
  type: string;
  title: string;
  message: string;
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface NotificationSettings {
  userId: string;
  email: boolean;
  sms: boolean;
  push: boolean;
  orderUpdates: boolean;
  promotions: boolean;
  newsletter: boolean;
}

// Admin Notification
export interface AdminNotification {
  id: string;
  type: string;
  title: string;
  message: string;
  priority: 'low' | 'medium' | 'high';
  read: boolean;
  createdAt: Date;
  updatedAt: Date;
}
