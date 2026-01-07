// Hook Response/Input Types for Storefront

// Auth Hook Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface RegisterInput {
  email: string;
  password: string;
  name: string;
}

export interface LoginResponse {
  login: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      emailVerified: boolean;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface RegisterResponse {
  register: {
    user: {
      id: string;
      email: string;
      name: string;
      role: string;
      isActive: boolean;
      emailVerified: boolean;
      createdAt: string;
    };
    accessToken: string;
    refreshToken: string;
  };
}

export interface MeResponse {
  me: {
    id: string;
    email: string;
    name: string;
    role: string;
    isActive: boolean;
    emailVerified: boolean;
    createdAt: string;
    lastLogin?: string;
  };
}

// Products Hook Types
export interface ProductsResponse {
  products: {
    products: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface ProductResponse {
  product: any;
}

export interface CategoriesResponse {
  categories:
    | string[]
    | {
        success: boolean;
        data: Array<{
          id: string;
          name: string;
          description?: string;
          icon?: string;
          slug: string;
          isActive: boolean;
          productCount: number;
        }>;
        count: number;
      };
}

export interface ProductFilters {
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  featured?: boolean;
}

// Orders Hook Types
export interface OrdersResponse {
  orders: {
    orders: any[];
    pagination: {
      page: number;
      limit: number;
      total: number;
      pages: number;
    };
  };
}

export interface OrderResponse {
  order: any;
}

export interface CreateOrderResponse {
  createOrder: any;
}

export interface CreateOrderInput {
  customerId: string;
  customerEmail: string;
  items: Array<{
    productId: string;
    quantity: number;
    price: number;
    sellerId: string;
  }>;
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  paymentMethod: string;
  notes?: string;
}

// Categories Hook Types
export interface Category {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  isActive: boolean;
  productCount: number;
}

export interface CategoriesData {
  categories: {
    success: boolean;
    data: Category[];
    count: number;
  };
}
