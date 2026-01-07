# GraphQL Gateway

## Overview

GraphQL API Gateway that aggregates all backend microservices into a unified GraphQL API, providing a single entry point for frontend applications.

## Tech Stack

### Runtime & Framework

- **Node.js** - JavaScript runtime
- **Express 4** - Web framework
- **TypeScript 5** - Type-safe development

### GraphQL

- **Apollo Server 4** - GraphQL server
- **GraphQL 16** - Query language

### API Communication

- **Axios** - HTTP client for microservice calls

### Security

- **CORS** - Cross-origin resource sharing

### Environment

- **dotenv** - Environment variable management

## Features

- ✅ Unified GraphQL API
- ✅ Schema stitching from microservices
- ✅ Authentication forwarding
- ✅ Query aggregation
- ✅ Error handling
- ✅ GraphQL Playground/Sandbox

## GraphQL Schema

### Queries

- `users` - Get all users
- `user(id)` - Get user by ID
- `products` - Get all products
- `product(id)` - Get product by ID
- `categories` - Get all categories
- `orders` - Get user orders
- `coupons` - Get available coupons

### Mutations

- `login` - User authentication
- `register` - User registration
- `createProduct` - Create new product
- `updateProduct` - Update product
- `createOrder` - Place new order
- `updateOrderStatus` - Update order status

## Project Structure

```
src/
├── resolvers/    # GraphQL resolvers
├── schema/       # GraphQL type definitions
├── services/     # Microservice clients
├── middleware/   # Auth middleware
└── index.ts      # Entry point
```

## Scripts

```bash
yarn dev         # Start development server with nodemon
yarn start       # Start production server
yarn build       # Compile TypeScript
```

## Environment Variables

```env
PORT=4000
AUTH_SERVICE_URL=http://localhost:4001
PRODUCT_SERVICE_URL=http://localhost:4002
ORDER_SERVICE_URL=http://localhost:4003
CATEGORY_SERVICE_URL=http://localhost:4004
COUPON_SERVICE_URL=http://localhost:4005
JWT_SECRET=your-jwt-secret
```

## Port

- Development: `4000`

## GraphQL Endpoint

- GraphQL API: `http://localhost:4000/graphql`
- Apollo Sandbox: `http://localhost:4000/graphql` (browser)

## Service Dependencies

Aggregates the following microservices:

- Auth Service (4001)
- Product Service (4002)
- Order Service (4003)
- Category Service (4004)
- Coupon Service (4005)
