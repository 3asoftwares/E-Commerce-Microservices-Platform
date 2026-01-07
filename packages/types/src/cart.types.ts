// Cart Types
export interface CartItem {
  id: string;
  cartId: string;
  productId: string;
  productName: string;
  productImage: string;
  sku: string;
  variantId?: string;
  variantOptions?: { [key: string]: string };
  sellerId: string;
  sellerName: string;
  quantity: number;
  price: number;
  total: number;
  isAvailable: boolean;
  maxQuantity: number;
}

export interface Cart {
  id: string;
  userId?: string;
  sessionId?: string;
  items: CartItem[];
  subtotal: number;
  tax: number;
  shipping: number;
  discount: number;
  total: number;
  appliedCoupons?: string[];
  createdAt: Date;
  updatedAt: Date;
}
