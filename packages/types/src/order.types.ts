import { OrderStatus } from './enums/orderStatus';
import { PaymentStatus } from './enums/paymentStatus';
import { PaymentMethod } from './enums/paymentMethod';
import { ShippingMethod } from './enums/shippingMethod';
import { Address } from './common.types';

// Order Item Types
export interface OrderItem {
  id?: string;
  orderId?: string;
  productId: string;
  productName: string;
  productImage?: string;
  sku?: string;
  variantId?: string;
  variantOptions?: { [key: string]: string };
  sellerId?: string;
  sellerName?: string;
  quantity: number;
  price: number;
  subtotal: number;
  total?: number;
  status?: OrderStatus;
}

export type OrderItemGraphQL = OrderItem;

export interface OrderItemInput {
  productId: string;
  productName: string;
  quantity: number;
  price: number;
  subtotal: number;
}

// Address Types
export type AddressGraphQL = Address;

export interface AddressInput {
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
}

// Order History/Tracking
export interface OrderHistory {
  id: string;
  orderId: string;
  status: OrderStatus;
  comment?: string;
  createdBy?: string;
  createdAt: Date;
}

export interface OrderTracking {
  orderId: string;
  trackingNumber: string;
  carrier: string;
  status: string;
  location?: string;
  estimatedDelivery?: Date;
  events: TrackingEvent[];
}

export interface TrackingEvent {
  status: string;
  location: string;
  description: string;
  timestamp: Date;
}

// Order Entity Type
export interface Order {
  id: string;
  orderNumber: string;
  customerId: string;
  customerName?: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount?: number;
  total: number;
  status: OrderStatus;
  orderStatus?: OrderStatus;
  shippingAddress: Address;
  billingAddress?: Address;
  shippingMethod?: ShippingMethod;
  paymentMethod: PaymentMethod | string;
  paymentStatus: PaymentStatus;
  trackingNumber?: string;
  trackingUrl?: string;
  notes?: string;
  customerNotes?: string;
  history?: OrderHistory[];
  createdAt: Date | string;
  updatedAt: Date | string;
  estimatedDelivery?: Date;
  deliveredAt?: Date;
}

// GraphQL Order Type
export interface OrderGraphQL {
  id: string;
  orderNumber: string;
  customerId: string;
  customerEmail: string;
  items: OrderItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  total: number;
  status?: string;
  orderStatus: OrderStatus;
  paymentStatus: PaymentStatus;
  paymentMethod: string;
  shippingAddress: Address;
  notes?: string;
  createdAt: string;
  updatedAt: string;
  estimatedDelivery?: string | number | Date;
}

export interface OrderConnection {
  orders: OrderGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrderQueryVariables {
  page?: number;
  limit?: number;
  status?: OrderStatus;
  customerId?: string;
}

// Request Types
export interface CreateOrderRequest {
  items: {
    productId: string;
    variantId?: string;
    quantity: number;
  }[];
  shippingAddressId: string;
  billingAddressId: string;
  shippingMethod: ShippingMethod;
  paymentMethod: PaymentMethod;
  couponCode?: string;
  customerNotes?: string;
}

export interface CreateOrderInput {
  customerId: string;
  customerEmail: string;
  items: OrderItemInput[];
  subtotal: number;
  tax?: number;
  shipping?: number;
  total: number;
  paymentMethod: string;
  shippingAddress: AddressInput;
  notes?: string;
}

export interface UpdateOrderStatusRequest {
  orderId: string;
  status: OrderStatus;
  comment?: string;
}

export interface GetOrdersRequest {
  userId?: string;
  customerId?: string;
  status?: OrderStatus;
  page?: number;
  limit?: number;
  startDate?: Date;
  endDate?: Date;
}
