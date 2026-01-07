import { ProductStatus } from './enums/productStatus';

// Seller info for product
export interface ProductSeller {
  id: string;
  name: string;
  email: string;
}

// Product Entity Types
export interface Product {
  id: string;
  name: string;
  slug: string;
  description: string;
  shortDescription?: string;
  price: number;
  compareAtPrice?: number;
  sku: string;
  barcode?: string;
  sellerId: string;
  sellerName: string;
  seller?: ProductSeller;
  categoryId: string;
  category?: ProductCategory;
  subcategoryId?: string;
  images: ProductImage[];
  imageUrl?: string;
  variants?: ProductVariant[];
  tags: string[];
  status: ProductStatus;
  stock?: number;
  inventory: number;
  lowStockThreshold: number;
  weight?: number;
  dimensions?: {
    length: number;
    width: number;
    height: number;
    unit: 'cm' | 'in';
  };
  rating: number;
  reviewCount: number;
  totalSold: number;
  isActive: boolean;
  isFeatured: boolean;
  seoTitle?: string;
  seoDescription?: string;
  seoKeywords?: string[];
  createdAt: Date | string;
  updatedAt: Date | string;
}

export interface ProductVariant {
  id: string;
  productId: string;
  name: string;
  sku: string;
  price?: number;
  compareAtPrice?: number;
  inventory: number;
  options: {
    [key: string]: string;
  };
  images?: string[];
  isActive: boolean;
}

export interface ProductImage {
  id: string;
  url: string;
  alt: string;
  isPrimary: boolean;
  order: number;
}

export interface ProductCategory {
  id: string;
  name: string;
  slug: string;
  description?: string;
  parentId?: string;
  image?: string;
  icon?: string;
  order: number;
  isActive: boolean;
  seoTitle?: string;
  seoDescription?: string;
  productCount?: number;
  createdAt?: Date | string;
  updatedAt?: Date | string;
}

export interface ProductFilter {
  categories?: string[];
  category?: string;
  priceMin?: number;
  minPrice?: number;
  priceMax?: number;
  maxPrice?: number;
  rating?: number;
  brands?: string[];
  tags?: string[];
  inStock?: boolean;
  onSale?: boolean;
  featured?: boolean;
  search?: string;
  sortBy?: 'price_asc' | 'price_desc' | 'rating' | 'newest' | 'popular';
  page?: number;
  limit?: number;
  includeInactive?: boolean;
}

// GraphQL Product Types
export interface ProductGraphQL {
  id: string;
  name: string;
  description: string;
  price: number;
  stock?: number;
  category: string;
  sellerId: string;
  seller?: ProductSeller;
  isActive: boolean;
  imageUrl?: string;
  tags: string[];
  rating: number;
  reviewCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface ProductConnection {
  products: ProductGraphQL[];
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface ProductQueryVariables {
  page?: number;
  limit?: number;
  search?: string;
  category?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: string;
  sortOrder?: string;
  featured?: boolean;
  includeInactive?: boolean;
}

export interface ProductAnalytics {
  productId: string;
  views: number;
  sales: number;
  revenue: number;
  averageRating: number;
  conversionRate: number;
}

// Request Types
export interface CreateProductRequest {
  name: string;
  description: string;
  price: number;
  category: string;
  stock: number;
  imageUrl?: string;
  sellerId: string;
  tags?: string[];
}

export interface CreateProductInput extends CreateProductRequest {
  // GraphQL version
}

export interface UpdateProductRequest extends Partial<CreateProductRequest> {
  isActive?: boolean;
}

export interface UpdateProductInput extends Partial<CreateProductInput> {
  isActive?: boolean;
}

export interface GetProductsRequest extends ProductFilter {}

export interface GetProductsResponse {
  products: ProductGraphQL[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface GetProductRequest {
  id?: string;
  slug?: string;
}
