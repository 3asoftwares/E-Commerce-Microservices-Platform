import { atom, selector } from 'recoil';

export const searchQueryState = atom<string>({
  key: 'searchQueryState',
  default: '',
});

export const selectedCategoryState = atom<string>({
  key: 'selectedCategoryState',
  default: 'all',
});

export const priceRangeState = atom<{ min: number; max: number }>({
  key: 'priceRangeState',
  default: { min: 0, max: 10000 },
});

export const sortByState = atom<'price_asc' | 'price_desc' | 'name' | 'newest'>({
  key: 'sortByState',
  default: 'newest',
});

export const productsDataState = atom<any[]>({
  key: 'productsDataState',
  default: [],
});

export const filteredProductsState = selector({
  key: 'filteredProductsState',
  get: ({ get }) => {
    const products = get(productsDataState);
    const searchQuery = get(searchQueryState);
    const selectedCategory = get(selectedCategoryState);
    const priceRange = get(priceRangeState);
    const sortBy = get(sortByState);

    let filtered = products;

    if (searchQuery) {
      filtered = filtered.filter(
        (p) =>
          p.name?.toLowerCase().includes(searchQuery.toLowerCase()) ||
          p.description?.toLowerCase().includes(searchQuery.toLowerCase())
      );
    }

    if (selectedCategory !== 'all') {
      filtered = filtered.filter((p) => p.category === selectedCategory);
    }

    filtered = filtered.filter((p) => p.price >= priceRange.min && p.price <= priceRange.max);

    switch (sortBy) {
      case 'price_asc':
        filtered.sort((a, b) => a.price - b.price);
        break;
      case 'price_desc':
        filtered.sort((a, b) => b.price - a.price);
        break;
      case 'name':
        filtered.sort((a, b) => a.name.localeCompare(b.name));
        break;
      case 'newest':
        filtered.sort((a, b) => new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime());
        break;
    }

    return filtered;
  },
});

export const categoriesState = selector<string[]>({
  key: 'categoriesState',
  get: ({ get }) => {
    const products = get(productsDataState);
    const categories = new Set(products.map((p) => p.category).filter(Boolean));
    return ['all', ...Array.from(categories)];
  },
});
