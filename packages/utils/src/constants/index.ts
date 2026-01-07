
export const SHELL_APP_URL='http://localhost:3000'
export const ADMIN_APP_URL = 'http://localhost:3001';
export const SELLER_APP_URL = 'http://localhost:3002';
export const STOREFRONT_APP_URL = 'http://localhost:3003';

// PORT CONFIGURATIONS
export const PORT_CONFIG = {
  AUTH_SERVICE: 3010,
  PRODUCT_SERVICE: 3011,
  ORDER_SERVICE: 3012,
  CATEGORY_SERVICE: 3013,
  COUPON_SERVICE: 3014,
  GRAPHQL_GATEWAY: 4000,
  STOREFRONT_APP: 3000,
  ADMIN_APP: 3001,
  SELLER_APP: 3002,
  SHELL_APP: 3003,
};

// SERVICE URLS
export const SERVICE_URLS = {
  AUTH_SERVICE: 'http://localhost:3010',
  PRODUCT_SERVICE: 'http://localhost:3011',
  ORDER_SERVICE: 'http://localhost:3012',
  CATEGORY_SERVICE: 'http://localhost:3013',
  COUPON_SERVICE: 'http://localhost:3014',
  GRAPHQL_GATEWAY: 'http://localhost:4000/graphql',
  PRODUCT_API: 'http://localhost:3011/api',
  ORDER_API: 'http://localhost:3012/api',
  CATEGORY_API: 'http://localhost:3013/api',
  COUPON_API: 'http://localhost:3014/api',
};

// CORS ALLOWED ORIGINS
export const DEFAULT_CORS_ORIGINS = [
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
];

// JWT & AUTH CONFIGURATION
export const JWT_CONFIG = {
  ACCESS_TOKEN_EXPIRY: '1h',
  REFRESH_TOKEN_EXPIRY: '7d',
  PASSWORD_MIN_LENGTH: 8,
  PASSWORD_PATTERN: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/,
};

// PAGINATION CONFIGURATION
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 10,
  DEFAULT_PAGE_SIZE: 20,
  MAX_PAGE_SIZE: 100,
  MIN_PAGE_SIZE: 1,
  DEFAULT_SORT_BY: 'createdAt',
  DEFAULT_SORT_ORDER: 'DESC' as const,
};

// PRODUCT CONFIGURATION
export const PRODUCT_CONFIG = {
  MIN_PRICE: 0,
  MAX_PRICE: 999999.99,
  MIN_STOCK: 0,
  MAX_RATING: 5,
  MIN_RATING: 0,
  DEFAULT_RATING: 0,
  MAX_IMAGE_SIZE: 5 * 1024 * 1024, // 5MB
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
};

// ORDER CONFIGURATION
export const ORDER_CONFIG = {
  TAX_RATE: 0.1, // 10% tax
  SHIPPING_COST_STANDARD: 50,
  SHIPPING_COST_EXPRESS: 150,
  SHIPPING_COST_OVERNIGHT: 300,
  MIN_ORDER_AMOUNT: 0,
  MAX_ORDER_ITEMS: 1000,
};

// COUPON CONFIGURATION
export const COUPON_CONFIG = {
  CODE_LENGTH: 6,
  CODE_UPPERCASE: true,
  MAX_DISCOUNT_PERCENTAGE: 100,
  MAX_DISCOUNT_FIXED: 999999.99,
  MIN_PURCHASE_REQUIRED: 0,
};

// API ENDPOINTS (PATHS)
export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/api/auth/login',
    REGISTER: '/api/auth/register',
    LOGOUT: '/api/auth/logout',
    PROFILE: '/api/auth/profile',
    REFRESH: '/api/auth/refresh',
    VERIFY: '/api/auth/verify',
  },
  PRODUCTS: {
    LIST: '/api/products',
    CREATE: '/api/products',
    GET: '/api/products/:id',
    UPDATE: '/api/products/:id',
    DELETE: '/api/products/:id',
    SEARCH: '/api/products/search',
  },
  ORDERS: {
    LIST: '/api/orders',
    CREATE: '/api/orders',
    GET: '/api/orders/:id',
    UPDATE: '/api/orders/:id',
    CANCEL: '/api/orders/:id/cancel',
    TRACK: '/api/orders/:id/track',
  },
  CATEGORIES: {
    LIST: '/api/categories',
    CREATE: '/api/categories',
    GET: '/api/categories/:id',
    UPDATE: '/api/categories/:id',
    DELETE: '/api/categories/:id',
  },
  COUPONS: {
    LIST: '/api/coupons',
    CREATE: '/api/coupons',
    GET: '/api/coupons/:id',
    UPDATE: '/api/coupons/:id',
    DELETE: '/api/coupons/:id',
    VALIDATE: '/api/coupons/validate/:code',
  },
};

// HTTP STATUS CODES
export const HTTP_STATUS = {
  OK: 200,
  CREATED: 201,
  NO_CONTENT: 204,
  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  FORBIDDEN: 403,
  NOT_FOUND: 404,
  CONFLICT: 409,
  UNPROCESSABLE_ENTITY: 422,
  INTERNAL_SERVER_ERROR: 500,
  SERVICE_UNAVAILABLE: 503,
};

// ERROR MESSAGES
export const ERROR_MESSAGES = {
  UNAUTHORIZED: 'Unauthorized access',
  FORBIDDEN: 'Forbidden access',
  NOT_FOUND: 'Resource not found',
  VALIDATION_FAILED: 'Validation failed',
  INVALID_CREDENTIALS: 'Invalid email or password',
  USER_EXISTS: 'User already exists',
  USER_NOT_FOUND: 'User not found',
  INVALID_TOKEN: 'Invalid or expired token',
  INTERNAL_ERROR: 'Internal server error',
  SERVICE_UNAVAILABLE: 'Service temporarily unavailable',
  INVALID_COUPON: 'Invalid or expired coupon',
  COUPON_EXPIRED: 'Coupon has expired',
  COUPON_LIMIT_REACHED: 'Coupon usage limit reached',
  PRODUCT_NOT_FOUND: 'Product not found',
  INSUFFICIENT_STOCK: 'Insufficient stock available',
  ORDER_NOT_FOUND: 'Order not found',
  INVALID_ORDER_STATUS: 'Invalid order status',
};

// SUCCESS MESSAGES
export const SUCCESS_MESSAGES = {
  CREATED: 'Resource created successfully',
  UPDATED: 'Resource updated successfully',
  DELETED: 'Resource deleted successfully',
  LOGIN_SUCCESS: 'Login successful',
  LOGOUT_SUCCESS: 'Logout successful',
  PROFILE_UPDATED: 'Profile updated successfully',
  ORDER_PLACED: 'Order placed successfully',
  ORDER_CANCELLED: 'Order cancelled successfully',
  PAYMENT_SUCCESSFUL: 'Payment processed successfully',
};

// CACHE CONFIGURATION
export const CACHE_CONFIG = {
  DASHBOARD_STATS_TTL: 30000, // 30 seconds
  DASHBOARD_STATS_REFETCH: 60000, // 1 minute
  PRODUCTS_TTL: 60000, // 1 minute
  CATEGORIES_TTL: 120000, // 2 minutes
  USER_PROFILE_TTL: 300000, // 5 minutes
  ORDERS_TTL: 30000, // 30 seconds
};

// TIMEOUT CONFIGURATION (milliseconds)
export const TIMEOUT_CONFIG = {
  API_REQUEST: 30000, // 30 seconds
  DATABASE: 10000, // 10 seconds
  GRAPHQL: 15000, // 15 seconds
};

// REGEX PATTERNS (for validation)
export const REGEX_PATTERNS = {
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
  PHONE: /^[\d\-\s()]{10,}$/,
  POSTAL_CODE: /^\d{5,6}$/,
  COUPON_CODE: /^[A-Z0-9]{6,20}$/,
  PRODUCT_SKU: /^[A-Z0-9\-]{3,20}$/,
  URL: /^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([/\w.-]*)*\/?$/,
};

// ENVIRONMENT PRESETS
export const ENV_PRESETS = {
  DEVELOPMENT: {
    corsOrigins: DEFAULT_CORS_ORIGINS,
    logLevel: 'debug',
    apiTimeout: TIMEOUT_CONFIG.API_REQUEST,
  },
  PRODUCTION: {
    corsOrigins: ['https://ecommerce.example.com', 'https://admin.ecommerce.example.com'],
    logLevel: 'info',
    apiTimeout: TIMEOUT_CONFIG.API_REQUEST,
  },
  TESTING: {
    corsOrigins: ['http://localhost:*'],
    logLevel: 'error',
    apiTimeout: TIMEOUT_CONFIG.API_REQUEST,
  },
};
