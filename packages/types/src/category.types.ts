import { ProductCategory } from './product.types';

// Category Entity Types (extending from Product)
export type Category = ProductCategory;

export interface CategoryFilter {
  parentId?: string;
  isActive?: boolean;
  search?: string;
}

// GraphQL Category Types
export interface CategoryGraphQL {
  id: string;
  name: string;
  description?: string;
  icon?: string;
  slug: string;
  isActive: boolean;
  productCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface CategoryConnection {
  categories: CategoryGraphQL[];
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface CategoryFilterInput {
  parentId?: string;
  isActive?: boolean;
  search?: string;
}

// Request Types
export interface CategoryInput {
  name: string;
  description?: string;
  icon?: string;
  slug?: string;
  isActive?: boolean;
}

export interface CreateCategoryInput extends CategoryInput {}

export interface UpdateCategoryInput extends Partial<CategoryInput> {}
