export const GET_COUPONS_QUERY = `
  query GetCoupons($page: Int, $limit: Int, $isActive: Boolean, $search: String) {
    coupons(page: $page, limit: $limit, isActive: $isActive, search: $search) {
      coupons {
        id
        code
        description
        discountType
        discount
        minPurchase
        maxDiscount
        validFrom
        validTo
        usageLimit
        usageCount
        isActive
        createdAt
        updatedAt
      }
      pagination {
        page
        limit
        total
        pages
      }
    }
  }
`;

export const GET_COUPON_QUERY = `
  query GetCoupon($id: ID!) {
    coupon(id: $id) {
      id
      code
      description
      discountType
      discount
      minPurchase
      maxDiscount
      validFrom
      validTo
      usageLimit
      usageCount
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const VALIDATE_COUPON_QUERY = `
  query ValidateCoupon($code: String!, $orderTotal: Float!) {
    validateCoupon(code: $code, orderTotal: $orderTotal) {
      valid
      discount
      discountValue
      finalTotal
      discountType
      message
      code
    }
  }
`;

export const CREATE_COUPON_MUTATION = `
  mutation CreateCoupon($input: CreateCouponInput!) {
    createCoupon(input: $input) {
      id
      code
      description
      discountType
      discount
      minPurchase
      maxDiscount
      validFrom
      validTo
      usageLimit
      usageCount
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_COUPON_MUTATION = `
  mutation UpdateCoupon($id: ID!, $input: UpdateCouponInput!) {
    updateCoupon(id: $id, input: $input) {
      id
      code
      description
      discountType
      discount
      minPurchase
      maxDiscount
      validFrom
      validTo
      usageLimit
      usageCount
      isActive
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_COUPON_MUTATION = `
  mutation DeleteCoupon($id: ID!) {
    deleteCoupon(id: $id)
  }
`;

export const TOGGLE_COUPON_STATUS_MUTATION = `
  mutation ToggleCouponStatus($id: ID!) {
    toggleCouponStatus(id: $id) {
      id
      isActive
    }
  }
`;
