import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  icon?: string;
  isActive: boolean;
  productCount: number;
  createdAt?: string;
  updatedAt?: string;
}

interface CategoryStore {
  categories: Category[];
  isLoaded: boolean;
  lastFetchedAt: number | null;

  setCategories: (categories: Category[]) => void;
  getCategories: () => Category[];
  getCategoryBySlug: (slug: string) => Category | undefined;
  getCategoryById: (id: string) => Category | undefined;
  clearCategories: () => void;
  shouldRefetch: () => boolean;
}

// Cache duration: 5 minutes
const CACHE_DURATION = 5 * 60 * 1000;

export const useCategoryStore = create<CategoryStore>()(
  persist(
    (set, get) => ({
      categories: [],
      isLoaded: false,
      lastFetchedAt: null,

      setCategories: (categories) =>
        set({
          categories,
          isLoaded: true,
          lastFetchedAt: Date.now(),
        }),

      getCategories: () => get().categories,

      getCategoryBySlug: (slug) => get().categories.find((cat) => cat.slug === slug),

      getCategoryById: (id) => get().categories.find((cat) => cat.id === id),

      clearCategories: () =>
        set({
          categories: [],
          isLoaded: false,
          lastFetchedAt: null,
        }),

      shouldRefetch: () => {
        const { lastFetchedAt, categories } = get();
        if (categories.length === 0) return true;
        if (!lastFetchedAt) return true;
        return Date.now() - lastFetchedAt > CACHE_DURATION;
      },
    }),
    {
      name: 'category-storage',
      partialize: (state) => ({
        categories: state.categories,
        lastFetchedAt: state.lastFetchedAt,
      }),
    }
  )
);

export default useCategoryStore;
