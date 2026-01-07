# Use Node 20 LTS for better compatibility
FROM node:20-alpine

# Set working directory
WORKDIR /app

# Install build dependencies for native modules
RUN apk add --no-cache python3 make g++ git

# Copy package files first for better caching
COPY package.json yarn.lock ./

# Copy workspace package.json files
COPY apps/admin-app/package.json ./apps/admin-app/
COPY apps/seller-app/package.json ./apps/seller-app/
COPY apps/shell-app/package.json ./apps/shell-app/
COPY apps/storefront-app/package.json ./apps/storefront-app/
COPY packages/types/package.json ./packages/types/
COPY packages/ui-library/package.json ./packages/ui-library/
COPY packages/utils/package.json ./packages/utils/
COPY services/auth-service/package.json ./services/auth-service/
COPY services/category-service/package.json ./services/category-service/
COPY services/coupon-service/package.json ./services/coupon-service/
COPY services/graphql-gateway/package.json ./services/graphql-gateway/
COPY services/order-service/package.json ./services/order-service/
COPY services/product-service/package.json ./services/product-service/

# Install dependencies
RUN yarn install --frozen-lockfile

# Copy entire project
COPY . .

# Expose ports for services and frontend apps
EXPOSE 3000 3001 3002 3003 3010 3011 3012 3013 3014 4000 6006

# Default command
CMD ["yarn", "dev:all"]
