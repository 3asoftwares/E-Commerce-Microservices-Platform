// Zustand Store Types (Cart, Wishlist, User Profile)

export interface CartItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  image?: string;
  productId: string;
  sellerId?: string;
}

export interface UserProfile {
  id: string;
  email: string;
  name: string;
  phone?: string;
  addresses: Address[];
  defaultAddressId?: string;
}

export interface Address {
  id: string;
  street: string;
  city: string;
  state: string;
  zip: string;
  country: string;
  isDefault?: boolean;
}

export interface WishlistItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  addedAt: number;
}

export interface RecentlyViewedItem {
  productId: string;
  name: string;
  price: number;
  image?: string;
  category: string;
  viewedAt: number;
}

export interface CartStore {
  items: CartItem[];
  wishlist: WishlistItem[];
  recentlyViewed: RecentlyViewedItem[];
  userProfile: UserProfile | null;

  addItem: (item: CartItem) => void;
  removeItem: (id: string) => void;
  updateQuantity: (id: string, quantity: number) => void;
  clearCart: () => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;

  addToWishlist: (item: WishlistItem) => void;
  removeFromWishlist: (productId: string) => void;
  isInWishlist: (productId: string) => boolean;

  addRecentlyViewed: (item: RecentlyViewedItem) => void;
  clearRecentlyViewed: () => void;

  setUserProfile: (profile: UserProfile | null) => void;
  loadUserFromStorage: () => void;
  addAddress: (address: Address) => void;
  removeAddress: (addressId: string) => void;
  setDefaultAddress: (addressId: string) => void;
}
