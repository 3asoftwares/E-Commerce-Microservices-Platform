// Common Types
export type {
  Pagination,
  ApiResponse,
  ApiError,
  PaginatedResponse,
  MutationResponse,
  Address,
} from './common.types';

// User Types
export type {
  User,
  UserProfile,
  UserPreferences,
  Wishlist,
  Review,
  UserGraphQL,
  UserConnection,
  UserQueryVariables,
  LoginRequest,
  LoginInput,
  RegisterRequest,
  RegisterInput,
  UpdateProfileRequest,
  AuthPayload,
  AuthResponse,
} from './user.types';

// Product Types
export type {
  Product,
  ProductVariant,
  ProductImage,
  ProductCategory,
  ProductFilter,
  ProductGraphQL,
  ProductConnection,
  ProductQueryVariables,
  ProductAnalytics,
  CreateProductRequest,
  CreateProductInput,
  UpdateProductRequest,
  UpdateProductInput,
  GetProductsRequest,
  GetProductsResponse,
  GetProductRequest,
} from './product.types';

// Order Types
export type {
  Order,
  OrderItem,
  OrderItemGraphQL,
  OrderItemInput,
  OrderHistory,
  OrderTracking,
  TrackingEvent,
  AddressGraphQL,
  AddressInput,
  OrderGraphQL,
  OrderConnection,
  OrderQueryVariables,
  CreateOrderRequest,
  CreateOrderInput,
  UpdateOrderStatusRequest,
  GetOrdersRequest,
} from './order.types';

// Coupon Types
export type {
  Coupon,
  Offer,
  CouponGraphQL,
  CouponConnection,
  CouponQueryVariables,
  CreateCouponInput,
  UpdateCouponInput,
} from './coupon.types';

// Category Types
export type {
  Category,
  CategoryFilter,
  CategoryGraphQL,
  CategoryConnection,
  CategoryFilterInput,
  CategoryInput,
  CreateCategoryInput,
  UpdateCategoryInput,
} from './category.types';

// Cart Types
export type { Cart, CartItem } from './cart.types';

// Seller Types
export type {
  Seller,
  SellerAddress,
  BankAccount,
  SellerDocument,
  SellerPayout,
  SellerStats,
} from './seller.types';

// Analytics Types
export type {
  DashboardStats,
  SalesAnalytics,
  SalesData,
  Notification,
  NotificationSettings,
} from './analytics.types';

// Store/State Management Types
export type {
  CartItem as StoreCartItem,
  UserProfile as StoreUserProfile,
  Address as StoreAddress,
  WishlistItem,
  RecentlyViewedItem,
  CartStore,
} from './store.types';

// Recoil State Types
export type { PriceRange, SortBy, RecoilStateTypes } from './recoil.types';

// Hook Response/Input Types
export type {
  LoginInput as HookLoginInput,
  RegisterInput as HookRegisterInput,
  LoginResponse,
  RegisterResponse,
  MeResponse,
  ProductsResponse,
  ProductResponse,
  CategoriesResponse,
  ProductFilters as HookProductFilters,
  OrdersResponse,
  OrderResponse,
  CreateOrderResponse,
  CreateOrderInput as HookCreateOrderInput,
  Category as HookCategory,
  CategoriesData,
} from './hooks.types';

// Environment Types
export type { ImportMetaEnv, ImportMeta, NextEnv, EnvironmentConfig } from './env.types';

// Admin App Types
export type {
  AdminUser,
  AuthState as AdminAuthState,
  Notification as AdminNotification,
  NotificationState,
  UIState,
  AdminRootState,
  AdminAppDispatch,
} from './admin.types';

// Seller App Types
export type {
  SellerUser,
  SellerAuthStoreState,
  Seller as SellerEntity,
  SellerAuthSliceState,
  ProductDraft,
  ProductDraftState,
  SellerRootState,
  SellerAppDispatch,
} from './seller.app.types';

// Enums
export { UserRole } from './enums/userRole';
export { OrderStatus } from './enums/orderStatus';
export { ProductStatus } from './enums/productStatus';
export { PaymentStatus } from './enums/paymentStatus';
export { PaymentMethod } from './enums/paymentMethod';
export { PaymentMethodReverse } from './enums/paymentMethod';
export { ShippingMethod } from './enums/shippingMethod';

// Enums (Centralized)
export { LogLevel } from './enums/logLevel';
export { ErrorType } from './enums/errorType';

// Utility Types (APIs, Logger, Error Handlers)
export type {
  GraphQLResponse,
  GraphQLClientConfig,
  LogEntry,
  AppError,
  NotificationOptions,
  AuthTokens,
  StoredAuth,
  TokenPayload,
} from './utils.types';

// Service Types (Database Models)
export type {
  IProduct,
  ICategory,
  ICoupon,
  OrderItemService,
  IOrder,
  IUser,
} from './services.types';

// Storefront Types
export type {
  AddressData,
  AddAddressInput,
  UpdateAddressInput,
  SendVerificationEmailResponse,
  VerifyEmailResponse,
  ForgotPasswordResponse,
  ResetPasswordResponse,
  ValidateTokenResponse,
  ReviewData,
  ReviewConnection,
  CreateReviewInput,
} from './storefront.types';
