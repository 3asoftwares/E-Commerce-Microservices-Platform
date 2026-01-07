export const GET_CATEGORIES_QUERY = `
  query GetCategories($filter: CategoryFilterInput) {
    categories(filter: $filter) {
      success
      message
      data {
        id
        name
        description
        icon
        slug
        isActive
        productCount
        createdAt
        updatedAt
      }
      count
    }
  }
`;

export const GET_CATEGORY_QUERY = `
  query GetCategory($id: String!) {
    category(id: $id) {
      id
      name
      description
      icon
      slug
      isActive
      productCount
      createdAt
      updatedAt
    }
  }
`;

export const CREATE_CATEGORY_MUTATION = `
  mutation CreateCategory($input: CategoryInput!) {
    createCategory(input: $input) {
      success
      message
      data {
        id
        name
        description
        icon
        slug
        isActive
        productCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const UPDATE_CATEGORY_MUTATION = `
  mutation UpdateCategory($id: ID!, $input: CategoryInput!) {
    updateCategory(id: $id, input: $input) {
      success
      message
      data {
        id
        name
        description
        icon
        slug
        isActive
        productCount
        createdAt
        updatedAt
      }
    }
  }
`;

export const DELETE_CATEGORY_MUTATION = `
  mutation DeleteCategory($id: ID!) {
    deleteCategory(id: $id) {
      success
      message
    }
  }
`;
