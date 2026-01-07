// Coupon Entity Types
export interface Coupon {
  id: string;
  code: string;
  type?: 'percentage' | 'fixed' | 'free_shipping';
  discountType?: 'percentage' | 'fixed';
  value?: number;
  discount: number;
  description: string;
  minPurchase?: number;
  maxDiscount?: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  excludedProducts?: string[];
  usageLimit?: number;
  usageCount: number;
  userLimit?: number;
  validFrom: Date | string;
  validTo: Date | string;
  startDate?: Date;
  endDate?: Date;
  isActive: boolean;
  createdBy?: string;
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface Offer {
  id: string;
  title: string;
  description: string;
  image?: string;
  type: 'banner' | 'popup' | 'badge';
  discountType: 'percentage' | 'fixed';
  discount: number;
  applicableProducts?: string[];
  applicableCategories?: string[];
  startDate: Date;
  endDate: Date;
  priority: number;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}

// GraphQL Coupon Types
export interface CouponGraphQL {
  id: string;
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discount: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
  usageCount: number;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface CouponConnection {
  coupons: CouponGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CouponQueryVariables {
  page?: number;
  limit?: number;
  isActive?: boolean;
  search?: string;
}

// Request Types
export interface CreateCouponInput {
  code: string;
  description: string;
  discountType: 'percentage' | 'fixed';
  discount: number;
  minPurchase?: number;
  maxDiscount?: number;
  validFrom: string;
  validTo: string;
  usageLimit?: number;
}

export interface UpdateCouponInput extends Partial<CreateCouponInput> {
  isActive?: boolean;
}
