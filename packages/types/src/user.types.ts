import { UserRole } from './enums/userRole';

// User Entity Types
export interface User {
  id: string;
  email: string;
  name: string;
  role: UserRole;
  avatar?: string;
  phone?: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

export interface UserProfile extends User {
  addresses?: Address[];
  preferences?: UserPreferences;
  wishlist?: string[];
  orders?: string[];
}

export interface UserPreferences {
  userId: string;
  notifications: {
    email: boolean;
    sms: boolean;
    push: boolean;
    orderUpdates: boolean;
    promotions: boolean;
    newsletter: boolean;
  };
  language: string;
  currency: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  productId: string;
  addedAt: Date;
}

export interface Review {
  id: string;
  productId: string;
  userId: string;
  userName: string;
  rating: number;
  title: string;
  comment: string;
  images?: string[];
  helpful: number;
  verified: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GraphQL User Types
export interface UserGraphQL {
  id: string;
  email: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt: string;
  lastLogin?: string;
}

export interface UserConnection {
  users: UserGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
    sellerCount?: number;
    adminCount?: number;
    customerCount?: number;
  };
}

export interface UserQueryVariables {
  page?: number;
  limit?: number;
  role?: string;
  search?: string;
}

// Auth/Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
  phone?: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
  role?: string;
}

export interface UpdateProfileRequest {
  name?: string;
  phone?: string;
  avatar?: string;
}

export interface AuthPayload {
  user: UserGraphQL;
  accessToken: string;
  refreshToken: string;
}

export interface AuthResponse {
  user: UserGraphQL;
  token?: string;
  refreshToken?: string;
  accessToken?: string;
}

// Import Address from common
import { Address } from './common.types';
