export const GET_PRODUCT_REVIEWS_QUERY = `
  query GetProductReviews($productId: ID!, $page: Int, $limit: Int) {
    productReviews(productId: $productId, page: $page, limit: $limit) {
      reviews {
        id
        productId
        userId
        userName
        rating
        comment
        helpful
        createdAt
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

export const CREATE_REVIEW_MUTATION = `
  mutation CreateReview($productId: ID!, $input: CreateReviewInput!) {
    createReview(productId: $productId, input: $input) {
      success
      message
      review {
        id
        productId
        userId
        userName
        rating
        comment
        helpful
        createdAt
      }
    }
  }
`;

export const MARK_REVIEW_HELPFUL_MUTATION = `
  mutation MarkReviewHelpful($reviewId: ID!) {
    markReviewHelpful(reviewId: $reviewId) {
      id
      helpful
    }
  }
`;

export const DELETE_REVIEW_MUTATION = `
  mutation DeleteReview($reviewId: ID!) {
    deleteReview(reviewId: $reviewId)
  }
`;
