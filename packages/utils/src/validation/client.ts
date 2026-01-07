/**
 * Client-safe validation utilities
 * These can be used in both frontend and backend
 */

import { REGEX_PATTERNS, JWT_CONFIG } from '../constants';

// EMAIL VALIDATION
export const isValidEmail = (email: string): boolean => {
  return REGEX_PATTERNS.EMAIL.test(email);
};

export const validateEmail = (email: string): { valid: boolean; error?: string } => {
  if (!email || email.trim() === '') {
    return { valid: false, error: 'Email is required' };
  }
  if (!isValidEmail(email)) {
    return { valid: false, error: 'Invalid email format' };
  }
  if (email.length > 255) {
    return { valid: false, error: 'Email is too long' };
  }
  return { valid: true };
};

// PASSWORD VALIDATION
export const isValidPassword = (password: string): boolean => {
  return JWT_CONFIG.PASSWORD_PATTERN.test(password);
};

export const validatePassword = (password: string): { valid: boolean; error?: string } => {
  if (!password) {
    return { valid: false, error: 'Password is required' };
  }
  if (password.length < JWT_CONFIG.PASSWORD_MIN_LENGTH) {
    return {
      valid: false,
      error: `Password must be at least ${JWT_CONFIG.PASSWORD_MIN_LENGTH} characters`,
    };
  }
  if (!isValidPassword(password)) {
    return {
      valid: false,
      error: 'Password must contain uppercase, lowercase, number, and special character (@$!%*?&)',
    };
  }
  return { valid: true };
};

// USERNAME/NAME VALIDATION
export const validateName = (name: string): { valid: boolean; error?: string } => {
  if (!name || name.trim() === '') {
    return { valid: false, error: 'Name is required' };
  }
  if (name.length < 2) {
    return { valid: false, error: 'Name must be at least 2 characters' };
  }
  if (name.length > 100) {
    return { valid: false, error: 'Name is too long' };
  }
  // Check for valid characters (letters, spaces, hyphens, apostrophes)
  if (!/^[a-zA-Z\s'-]+$/.test(name)) {
    return {
      valid: false,
      error: 'Name can only contain letters, spaces, hyphens, and apostrophes',
    };
  }
  return { valid: true };
};

// PHONE VALIDATION
export const isValidPhone = (phone: string): boolean => {
  return REGEX_PATTERNS.PHONE.test(phone);
};

export const validatePhone = (phone: string): { valid: boolean; error?: string } => {
  if (!phone) {
    return { valid: false, error: 'Phone number is required' };
  }
  if (!isValidPhone(phone)) {
    return { valid: false, error: 'Invalid phone number format' };
  }
  return { valid: true };
};

// POSTAL CODE VALIDATION
export const isValidPostalCode = (postalCode: string): boolean => {
  return REGEX_PATTERNS.POSTAL_CODE.test(postalCode);
};

export const validatePostalCode = (postalCode: string): { valid: boolean; error?: string } => {
  if (!postalCode) {
    return { valid: false, error: 'Postal code is required' };
  }
  if (!isValidPostalCode(postalCode)) {
    return { valid: false, error: 'Invalid postal code format' };
  }
  return { valid: true };
};

// COUPON CODE VALIDATION
export const isValidCouponCode = (code: string): boolean => {
  return REGEX_PATTERNS.COUPON_CODE.test(code);
};

export const validateCouponCode = (code: string): { valid: boolean; error?: string } => {
  if (!code) {
    return { valid: false, error: 'Coupon code is required' };
  }
  if (!isValidCouponCode(code)) {
    return { valid: false, error: 'Invalid coupon code format (6-20 alphanumeric characters)' };
  }
  return { valid: true };
};

// PRICE VALIDATION
export const validatePrice = (price: any): { valid: boolean; error?: string } => {
  const numPrice = parseFloat(price);
  if (isNaN(numPrice)) {
    return { valid: false, error: 'Price must be a valid number' };
  }
  if (numPrice < 0) {
    return { valid: false, error: 'Price cannot be negative' };
  }
  if (numPrice > 999999.99) {
    return { valid: false, error: 'Price exceeds maximum allowed value' };
  }
  return { valid: true };
};

// QUANTITY/STOCK VALIDATION
export const validateQuantity = (qty: any): { valid: boolean; error?: string } => {
  const numQty = parseInt(qty, 10);
  if (isNaN(numQty)) {
    return { valid: false, error: 'Quantity must be a valid number' };
  }
  if (numQty < 0) {
    return { valid: false, error: 'Quantity cannot be negative' };
  }
  if (!Number.isInteger(numQty)) {
    return { valid: false, error: 'Quantity must be a whole number' };
  }
  return { valid: true };
};

// RATING VALIDATION
export const validateRating = (rating: any): { valid: boolean; error?: string } => {
  const numRating = parseFloat(rating);
  if (isNaN(numRating)) {
    return { valid: false, error: 'Rating must be a valid number' };
  }
  if (numRating < 0 || numRating > 5) {
    return { valid: false, error: 'Rating must be between 0 and 5' };
  }
  return { valid: true };
};

// DISCOUNT VALIDATION
export const validateDiscountPercentage = (discount: any): { valid: boolean; error?: string } => {
  const numDiscount = parseFloat(discount);
  if (isNaN(numDiscount)) {
    return { valid: false, error: 'Discount must be a valid number' };
  }
  if (numDiscount < 0 || numDiscount > 100) {
    return { valid: false, error: 'Discount percentage must be between 0 and 100' };
  }
  return { valid: true };
};

// PAGINATION VALIDATION
export const validatePagination = (
  page: any,
  limit: any
): { valid: boolean; error?: string; page?: number; limit?: number } => {
  const numPage = parseInt(page, 10) || 1;
  const numLimit = parseInt(limit, 10) || 10;

  if (numPage < 1) {
    return { valid: false, error: 'Page must be greater than 0' };
  }
  if (numLimit < 1) {
    return { valid: false, error: 'Limit must be greater than 0' };
  }
  if (numLimit > 100) {
    return { valid: false, error: 'Limit cannot exceed 100' };
  }

  return { valid: true, page: numPage, limit: numLimit };
};

// OBJECT ID VALIDATION (MongoDB ObjectId)
export const isValidObjectId = (id: string): boolean => {
  return /^[0-9a-fA-F]{24}$/.test(id);
};

export const validateObjectId = (
  id: string,
  fieldName: string = 'ID'
): { valid: boolean; error?: string } => {
  if (!id) {
    return { valid: false, error: `${fieldName} is required` };
  }
  if (!isValidObjectId(id)) {
    return { valid: false, error: `Invalid ${fieldName} format` };
  }
  return { valid: true };
};

// URL VALIDATION
export const isValidUrl = (url: string): boolean => {
  return REGEX_PATTERNS.URL.test(url);
};

export const validateUrl = (url: string): { valid: boolean; error?: string } => {
  if (!url) {
    return { valid: false, error: 'URL is required' };
  }
  if (!isValidUrl(url)) {
    return { valid: false, error: 'Invalid URL format' };
  }
  return { valid: true };
};

// PRODUCT SKU VALIDATION
export const isValidSku = (sku: string): boolean => {
  return REGEX_PATTERNS.PRODUCT_SKU.test(sku);
};

export const validateSku = (sku: string): { valid: boolean; error?: string } => {
  if (!sku) {
    return { valid: false, error: 'SKU is required' };
  }
  if (!isValidSku(sku)) {
    return {
      valid: false,
      error: 'Invalid SKU format (3-20 alphanumeric characters with hyphens)',
    };
  }
  return { valid: true };
};

// DATE VALIDATION
export const validateDate = (date: any): { valid: boolean; error?: string } => {
  const dateObj = new Date(date);
  if (isNaN(dateObj.getTime())) {
    return { valid: false, error: 'Invalid date format' };
  }
  return { valid: true };
};

export const validateDateRange = (
  startDate: any,
  endDate: any
): { valid: boolean; error?: string } => {
  const start = new Date(startDate);
  const end = new Date(endDate);

  if (isNaN(start.getTime())) {
    return { valid: false, error: 'Invalid start date' };
  }
  if (isNaN(end.getTime())) {
    return { valid: false, error: 'Invalid end date' };
  }
  if (start > end) {
    return { valid: false, error: 'Start date must be before end date' };
  }

  return { valid: true };
};

// BATCH VALIDATION HELPER
export const batchValidate = (
  validations: Array<{ valid: boolean; error?: string }>
): { valid: boolean; errors: string[] } => {
  const errors: string[] = [];

  for (const validation of validations) {
    if (!validation.valid && validation.error) {
      errors.push(validation.error);
    }
  }

  return {
    valid: errors.length === 0,
    errors,
  };
};
