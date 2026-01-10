# 📚 API Documentation Guide

## Overview

The 3A Softwares E-Commerce Platform provides comprehensive API documentation through **Swagger/OpenAPI** for REST APIs and **GraphQL Playground** for the GraphQL API. This guide explains how to access, use, and contribute to the API documentation.

---

## 🔗 Documentation Endpoints

### Local Development

| API | Documentation URL | Type |
|-----|-------------------|------|
| GraphQL Gateway | http://localhost:4000/graphql | GraphQL Playground |
| Auth Service | http://localhost:3011/api-docs | Swagger UI |
| Category Service | http://localhost:3012/api-docs | Swagger UI |
| Coupon Service | http://localhost:3013/api-docs | Swagger UI |
| Product Service | http://localhost:3014/api-docs | Swagger UI |
| Order Service | http://localhost:3015/api-docs | Swagger UI |

### Production

| API | Documentation URL |
|-----|-------------------|
| GraphQL Gateway | https://e-graphql-gateway.vercel.app/graphql |
| Auth Service | https://e-auth-service.vercel.app/api-docs |
| Product Service | https://e-product-service.vercel.app/api-docs |

---

## 🎮 GraphQL Playground

### Accessing the Playground

Navigate to `http://localhost:4000/graphql` in your browser to access the Apollo GraphQL Playground.

### Features

- **Schema Explorer**: Browse available queries, mutations, and types
- **Auto-complete**: IntelliSense for GraphQL queries
- **Documentation**: Inline documentation for all fields
- **History**: Track your query history
- **Variables**: Define query variables in JSON format

### Example Queries

#### Get Products

```graphql
query GetProducts($filter: ProductFilter, $pagination: Pagination) {
  products(filter: $filter, pagination: $pagination) {
    items {
      id
      name
      price
      description
      images
      category {
        id
        name
      }
      seller {
        id
        name
      }
    }
    totalCount
    hasNextPage
  }
}

# Variables
{
  "filter": {
    "categoryId": "cat123",
    "minPrice": 10,
    "maxPrice": 100
  },
  "pagination": {
    "page": 1,
    "limit": 10
  }
}
```

#### User Authentication

```graphql
mutation Login($input: LoginInput!) {
  login(input: $input) {
    accessToken
    refreshToken
    user {
      id
      email
      name
      role
    }
  }
}

# Variables
{
  "input": {
    "email": "user@example.com",
    "password": "password123"
  }
}
```

#### Create Order

```graphql
mutation CreateOrder($input: OrderInput!) {
  createOrder(input: $input) {
    id
    status
    totalAmount
    items {
      product {
        name
      }
      quantity
      price
    }
    createdAt
  }
}

# Variables
{
  "input": {
    "items": [
      {
        "productId": "prod123",
        "quantity": 2
      }
    ],
    "shippingAddressId": "addr123",
    "couponCode": "SAVE10"
  }
}
```

### Authentication in Playground

Set the Authorization header in the HTTP Headers section:

```json
{
  "Authorization": "Bearer eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9..."
}
```

---

## 📖 Swagger Documentation

### Swagger UI Features

- **Interactive Testing**: Try API endpoints directly from the browser
- **Request/Response Examples**: View sample payloads
- **Authentication**: Test with JWT tokens
- **Model Schemas**: View request/response data structures

### Auth Service API (`/api-docs`)

#### Authentication Endpoints

```yaml
POST /api/auth/register
  Summary: Register a new user
  Request Body:
    - email: string (required)
    - password: string (required, min 8 chars)
    - name: string (required)
    - role: enum [customer, seller, admin]
  Response: 201 Created
    - user: User object
    - accessToken: string
    - refreshToken: string

POST /api/auth/login
  Summary: Authenticate user
  Request Body:
    - email: string (required)
    - password: string (required)
  Response: 200 OK
    - user: User object
    - accessToken: string
    - refreshToken: string

POST /api/auth/refresh
  Summary: Refresh access token
  Request Body:
    - refreshToken: string (required)
  Response: 200 OK
    - accessToken: string
    - refreshToken: string

POST /api/auth/logout
  Summary: Logout user
  Headers:
    - Authorization: Bearer <token>
  Response: 200 OK

POST /api/auth/forgot-password
  Summary: Request password reset
  Request Body:
    - email: string (required)
  Response: 200 OK

POST /api/auth/reset-password
  Summary: Reset password with token
  Request Body:
    - token: string (required)
    - password: string (required)
  Response: 200 OK
```

#### User Endpoints

```yaml
GET /api/users/:id
  Summary: Get user by ID
  Headers:
    - Authorization: Bearer <token>
  Response: 200 OK
    - user: User object

PUT /api/users/:id
  Summary: Update user profile
  Headers:
    - Authorization: Bearer <token>
  Request Body:
    - name: string
    - phone: string
    - avatar: string
  Response: 200 OK
    - user: User object

DELETE /api/users/:id
  Summary: Delete user account
  Headers:
    - Authorization: Bearer <token>
  Response: 204 No Content
```

### Product Service API (`/api-docs`)

```yaml
GET /api/products
  Summary: List products with filters
  Query Parameters:
    - page: number (default: 1)
    - limit: number (default: 10)
    - category: string
    - minPrice: number
    - maxPrice: number
    - search: string
    - sortBy: string
    - sortOrder: asc|desc
  Response: 200 OK
    - products: Product[]
    - totalCount: number
    - page: number
    - totalPages: number

GET /api/products/:id
  Summary: Get product by ID
  Response: 200 OK
    - product: Product object

POST /api/products
  Summary: Create new product
  Headers:
    - Authorization: Bearer <token> (seller/admin)
  Request Body:
    - name: string (required)
    - description: string
    - price: number (required)
    - categoryId: string (required)
    - images: string[]
    - stock: number
  Response: 201 Created
    - product: Product object

PUT /api/products/:id
  Summary: Update product
  Headers:
    - Authorization: Bearer <token> (owner/admin)
  Request Body: (partial update allowed)
  Response: 200 OK
    - product: Product object

DELETE /api/products/:id
  Summary: Delete product
  Headers:
    - Authorization: Bearer <token> (owner/admin)
  Response: 204 No Content
```

### Order Service API (`/api-docs`)

```yaml
GET /api/orders
  Summary: List orders (admin sees all, user sees own)
  Headers:
    - Authorization: Bearer <token>
  Query Parameters:
    - status: string
    - customerId: string
    - page: number
    - limit: number
  Response: 200 OK
    - orders: Order[]
    - totalCount: number

GET /api/orders/:id
  Summary: Get order details
  Headers:
    - Authorization: Bearer <token>
  Response: 200 OK
    - order: Order object

POST /api/orders
  Summary: Create new order
  Headers:
    - Authorization: Bearer <token>
  Request Body:
    - items: OrderItem[] (required)
    - shippingAddressId: string (required)
    - couponCode: string
    - paymentMethod: string
  Response: 201 Created
    - order: Order object

PUT /api/orders/:id/status
  Summary: Update order status
  Headers:
    - Authorization: Bearer <token> (admin/seller)
  Request Body:
    - status: enum [pending, confirmed, shipped, delivered, cancelled]
  Response: 200 OK
    - order: Order object

POST /api/orders/:id/cancel
  Summary: Cancel order
  Headers:
    - Authorization: Bearer <token>
  Response: 200 OK
    - order: Order object
```

---

## 📋 Data Models

### User

```typescript
interface User {
  id: string;
  email: string;
  name: string;
  phone?: string;
  avatar?: string;
  role: 'customer' | 'seller' | 'admin';
  isVerified: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Product

```typescript
interface Product {
  id: string;
  name: string;
  description?: string;
  price: number;
  compareAtPrice?: number;
  images: string[];
  categoryId: string;
  category?: Category;
  sellerId: string;
  seller?: User;
  stock: number;
  isActive: boolean;
  rating: number;
  reviewCount: number;
  createdAt: Date;
  updatedAt: Date;
}
```

### Order

```typescript
interface Order {
  id: string;
  customerId: string;
  customer?: User;
  items: OrderItem[];
  status: OrderStatus;
  totalAmount: number;
  discount: number;
  shippingAddress: Address;
  paymentMethod: string;
  paymentStatus: PaymentStatus;
  couponCode?: string;
  createdAt: Date;
  updatedAt: Date;
}

interface OrderItem {
  productId: string;
  product?: Product;
  quantity: number;
  price: number;
  total: number;
}

type OrderStatus = 'pending' | 'confirmed' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
type PaymentStatus = 'pending' | 'paid' | 'failed' | 'refunded';
```

### Category

```typescript
interface Category {
  id: string;
  name: string;
  slug: string;
  description?: string;
  image?: string;
  parentId?: string;
  parent?: Category;
  children?: Category[];
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

### Coupon

```typescript
interface Coupon {
  id: string;
  code: string;
  discountType: 'percentage' | 'fixed';
  discountValue: number;
  minOrderAmount?: number;
  maxDiscount?: number;
  usageLimit?: number;
  usedCount: number;
  startDate: Date;
  endDate: Date;
  isActive: boolean;
  createdAt: Date;
  updatedAt: Date;
}
```

---

## 🔐 Authentication

### JWT Token Structure

```javascript
// Access Token Payload
{
  "userId": "user123",
  "email": "user@example.com",
  "role": "customer",
  "iat": 1704844800,
  "exp": 1704848400  // 1 hour
}

// Refresh Token Payload
{
  "userId": "user123",
  "tokenVersion": 1,
  "iat": 1704844800,
  "exp": 1705449600  // 7 days
}
```

### Using Authentication

```bash
# 1. Login to get tokens
curl -X POST http://localhost:3011/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email": "user@example.com", "password": "password123"}'

# Response:
# {
#   "accessToken": "eyJ...",
#   "refreshToken": "eyJ...",
#   "user": { ... }
# }

# 2. Use access token for authenticated requests
curl -X GET http://localhost:3014/api/products \
  -H "Authorization: Bearer eyJ..."

# 3. Refresh token when expired
curl -X POST http://localhost:3011/api/auth/refresh \
  -H "Content-Type: application/json" \
  -d '{"refreshToken": "eyJ..."}'
```

---

## 📊 Error Responses

### Standard Error Format

```json
{
  "success": false,
  "error": {
    "code": "VALIDATION_ERROR",
    "message": "Invalid input data",
    "details": [
      {
        "field": "email",
        "message": "Invalid email format"
      }
    ]
  }
}
```

### HTTP Status Codes

| Code | Description | Use Case |
|------|-------------|----------|
| 200 | OK | Successful GET, PUT |
| 201 | Created | Successful POST |
| 204 | No Content | Successful DELETE |
| 400 | Bad Request | Validation errors |
| 401 | Unauthorized | Missing/invalid token |
| 403 | Forbidden | Insufficient permissions |
| 404 | Not Found | Resource not found |
| 409 | Conflict | Duplicate resource |
| 422 | Unprocessable Entity | Business logic error |
| 429 | Too Many Requests | Rate limit exceeded |
| 500 | Internal Server Error | Server error |

### Error Codes

| Code | Description |
|------|-------------|
| `VALIDATION_ERROR` | Input validation failed |
| `AUTHENTICATION_ERROR` | Invalid credentials |
| `AUTHORIZATION_ERROR` | Insufficient permissions |
| `NOT_FOUND` | Resource not found |
| `DUPLICATE_ERROR` | Resource already exists |
| `RATE_LIMIT_ERROR` | Too many requests |
| `INTERNAL_ERROR` | Server error |

---

## 🧪 Testing APIs

### Using cURL

```bash
# Register user
curl -X POST http://localhost:3011/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{
    "email": "test@example.com",
    "password": "Password123!",
    "name": "Test User"
  }'

# Get products
curl http://localhost:3014/api/products?page=1&limit=10

# Create product (authenticated)
curl -X POST http://localhost:3014/api/products \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "name": "Test Product",
    "price": 99.99,
    "categoryId": "cat123"
  }'
```

### Using Postman

1. Import the OpenAPI spec from `/api-docs/json`
2. Set up environment variables:
   - `baseUrl`: http://localhost:3011
   - `accessToken`: (auto-set after login)
3. Use the "Authorization" tab with Bearer Token

### Using GraphQL

```bash
# Query products
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -d '{
    "query": "query { products { items { id name price } } }"
  }'

# Mutation with auth
curl -X POST http://localhost:4000/graphql \
  -H "Content-Type: application/json" \
  -H "Authorization: Bearer <token>" \
  -d '{
    "query": "mutation { createProduct(input: { name: \"Test\", price: 99.99, categoryId: \"cat123\" }) { id name } }"
  }'
```

---

## 📝 Adding Documentation

### Swagger Annotations (JSDoc)

```typescript
/**
 * @swagger
 * /api/products:
 *   get:
 *     summary: List all products
 *     tags: [Products]
 *     parameters:
 *       - in: query
 *         name: page
 *         schema:
 *           type: integer
 *         description: Page number
 *     responses:
 *       200:
 *         description: List of products
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 products:
 *                   type: array
 *                   items:
 *                     $ref: '#/components/schemas/Product'
 */
router.get('/products', productController.getProducts);
```

### GraphQL Documentation

```graphql
"""
Represents a product in the catalog
"""
type Product {
  """
  Unique identifier for the product
  """
  id: ID!
  
  """
  Display name of the product
  """
  name: String!
  
  """
  Product price in the default currency
  """
  price: Float!
}
```

---

## 📚 Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [Technology Stack](TECHNOLOGY_STACK.md)
- [Security Best Practices](SECURITY.md)
- [Deployment Guide](DEPLOYMENT.md)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
