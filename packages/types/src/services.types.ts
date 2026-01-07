// Services - Database Models and Domain Types

// MongoDB Interface Pattern (extends Document)
// Note: These are MongoDB model interfaces
// The actual entity types are defined in entity types (product.types.ts, order.types.ts, user.types.ts)

// Product Service Types
export interface IProduct {
  id?: string;
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  isActive: boolean;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Category Service Types
export interface ICategory {
  id?: string;
  name: string;
  description?: string;
  slug: string;
  isActive: boolean;
  productCount?: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// Coupon Service Types
export interface ICoupon {
  id?: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discount: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: Date;
  validTo: Date;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}

// Order Service Types
export interface OrderItemService {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

export interface IOrder {
  id?: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  items: OrderItemService[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  orderStatus: string;
  paymentStatus: string;
  paymentMethod: string;
  shippingAddress: {
    street: string;
    city: string;
    state: string;
    zip: string;
    country: string;
  };
  notes?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

// User Service Types
export interface IUser {
  id?: string;
  email: string;
  password?: string;
  name: string;
  role: string;
  isActive: boolean;
  emailVerified: boolean;
  createdAt?: Date;
  updatedAt?: Date;
}
