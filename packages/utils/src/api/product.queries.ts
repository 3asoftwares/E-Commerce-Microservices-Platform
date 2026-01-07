export const GET_PRODUCTS_QUERY = `
  query GetProducts($page: Int, $limit: Int, $search: String, $category: String, $minPrice: Float, $maxPrice: Float, $sortBy: String, $sortOrder: String, $featured: Boolean, $includeInactive: Boolean) {
    products(page: $page, limit: $limit, search: $search, category: $category, minPrice: $minPrice, maxPrice: $maxPrice, sortBy: $sortBy, sortOrder: $sortOrder, featured: $featured, includeInactive: $includeInactive) {
      products {
        id
        name
        description
        price
        stock
        category
        sellerId
        isActive
        imageUrl
        tags
        rating
        reviewCount
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

export const GET_PRODUCT_QUERY = `
  query GetProduct($id: ID!) {
    product(id: $id) {
      id
      name
      description
      price
      stock
      category
      sellerId
      seller {
        id
        name
        email
      }
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const GET_PRODUCTS_BY_SELLER_QUERY = `
  query GetProductsBySeller($sellerId: String!) {
    productsBySeller(sellerId: $sellerId) {
      id
      name
      description
      price
      stock
      category
      sellerId
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_PRODUCT_MUTATION = `
  mutation CreateProduct($input: CreateProductInput!) {
    createProduct(input: $input) {
      id
      name
      description
      price
      stock
      category
      sellerId
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const UPDATE_PRODUCT_MUTATION = `
  mutation UpdateProduct($id: ID!, $input: UpdateProductInput!) {
    updateProduct(id: $id, input: $input) {
      id
      name
      description
      price
      stock
      category
      sellerId
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;

export const DELETE_PRODUCT_MUTATION = `
  mutation DeleteProduct($id: ID!) {
    deleteProduct(id: $id)
  }
`;

export const SEARCH_PRODUCTS_QUERY = `
  query SearchProducts($search: String!, $limit: Int) {
    searchProducts(search: $search, limit: $limit) {
      id
      name
      description
      price
      stock
      category
      sellerId
      isActive
      imageUrl
      tags
      rating
      reviewCount
      createdAt
      updatedAt
    }
  }
`;
