// Recoil State Atom Types

export interface PriceRange {
  min: number;
  max: number;
}

export type SortBy = 'price_asc' | 'price_desc' | 'name' | 'newest';

export interface RecoilStateTypes {
  searchQuery: string;
  selectedCategory: string;
  priceRange: PriceRange;
  sortBy: SortBy;
  productsData: any[];
}
