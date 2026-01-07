// Seller App Store Types

// Seller User Types
export interface SellerUser {
  id: string;
  email: string;
  name: string;
  role: string;
  businessName?: string;
  isApproved?: boolean;
  shopName?: string;
  emailVerified?: boolean;
  isActive?: boolean;
  createdAt?: string;
  lastLogin?: string;
}

// Seller Auth Store (Zustand) Types
export interface SellerAuthStoreState {
  user: SellerUser | null;
  token: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;

  clearAuth: () => void;
  setLoading: (loading: boolean) => void;
  setError: (error: string | null) => void;
  hydrate: () => void;
}

// Seller Auth Slice (Redux) Types
export interface Seller {
  id: string;
  email: string;
  name: string;
  shopName: string;
}

export interface SellerAuthSliceState {
  seller: Seller | null;
  token: string | null;
  isAuthenticated: boolean;
}

// Product Draft Slice Types
export interface ProductDraft {
  name: string;
  description: string;
  price: number;
  stock: number;
  category: string;
  images: string[];
}

export interface ProductDraftState {
  draft: ProductDraft | null;
}

// Seller Store Redux Types
export interface SellerRootState {
  sellerAuth: SellerAuthSliceState;
  productDraft: ProductDraftState;
}

export type SellerAppDispatch = any; // Will be properly typed in store setup
