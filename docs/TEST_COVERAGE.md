# 🧪 Test Coverage Reports

## Overview

The 3A Softwares E-Commerce Platform maintains comprehensive test coverage across all applications and services. This document covers testing strategies, coverage requirements, and how to generate and interpret test reports.

---

## 📊 Coverage Targets

| Project Type | Minimum Coverage | Target Coverage |
|--------------|------------------|-----------------|
| Frontend Apps | 60% | 80% |
| Backend Services | 70% | 90% |
| Shared Packages | 80% | 95% |
| Critical Paths | 90% | 100% |

---

## 🛠️ Testing Stack

### Frontend Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Test runner, assertions |
| **React Testing Library** | Component testing |
| **MSW (Mock Service Worker)** | API mocking |
| **Playwright** | End-to-end testing |

### Backend Testing

| Tool | Purpose |
|------|---------|
| **Jest** | Test runner, assertions |
| **Supertest** | HTTP testing |
| **mongodb-memory-server** | In-memory MongoDB |
| **ioredis-mock** | Redis mocking |

---

## 📂 Test Structure

### Directory Layout

```
apps/
├── admin-app/
│   ├── src/
│   ├── tests/
│   │   ├── components/     # Component tests
│   │   ├── hooks/          # Custom hook tests
│   │   ├── pages/          # Page tests
│   │   ├── utils/          # Utility tests
│   │   └── __mocks__/      # Mock files
│   ├── coverage/           # Coverage reports
│   └── jest.config.js
│
services/
├── auth-service/
│   ├── src/
│   ├── tests/
│   │   ├── unit/           # Unit tests
│   │   ├── integration/    # Integration tests
│   │   └── fixtures/       # Test data
│   ├── coverage/           # Coverage reports
│   └── jest.config.js
```

---

## 🚀 Running Tests

### All Tests

```bash
# Run all tests across the monorepo
yarn test

# Run tests with coverage
yarn test:coverage

# Run tests in watch mode
yarn test:watch
```

### Per Application

```bash
# Frontend apps
yarn workspace @3asoftwares/admin-app test
yarn workspace @3asoftwares/seller-app test
yarn workspace @3asoftwares/shell-app test
yarn workspace @3asoftwares/storefront-app test

# Backend services
yarn workspace @3asoftwares/auth-service test
yarn workspace @3asoftwares/product-service test
yarn workspace @3asoftwares/order-service test
yarn workspace @3asoftwares/category-service test
yarn workspace @3asoftwares/coupon-service test
yarn workspace @3asoftwares/graphql-gateway test
```

### With Coverage

```bash
# Generate coverage report
yarn workspace @3asoftwares/admin-app test --coverage

# Generate coverage with specific reporter
yarn test --coverage --coverageReporters=lcov --coverageReporters=text
```

---

## 📋 Jest Configuration

### Frontend (`apps/*/jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'jsdom',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
    '\\.(jpg|jpeg|png|gif|svg)$': '<rootDir>/tests/__mocks__/fileMock.js',
  },
  transform: {
    '^.+\\.(ts|tsx)$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.{ts,tsx}',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
    '!src/main.tsx',
  ],
  coverageThreshold: {
    global: {
      branches: 60,
      functions: 60,
      lines: 60,
      statements: 60,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  testMatch: ['**/*.test.ts', '**/*.test.tsx', '**/*.spec.ts', '**/*.spec.tsx'],
};
```

### Backend (`services/*/jest.config.js`)

```javascript
module.exports = {
  testEnvironment: 'node',
  roots: ['<rootDir>/tests'],
  setupFilesAfterEnv: ['<rootDir>/tests/setup.ts'],
  moduleNameMapper: {
    '^@/(.*)$': '<rootDir>/src/$1',
  },
  transform: {
    '^.+\\.ts$': ['ts-jest', { tsconfig: 'tsconfig.json' }],
  },
  collectCoverageFrom: [
    'src/**/*.ts',
    '!src/**/*.d.ts',
    '!src/**/index.ts',
  ],
  coverageThreshold: {
    global: {
      branches: 70,
      functions: 70,
      lines: 70,
      statements: 70,
    },
  },
  coverageReporters: ['text', 'lcov', 'html', 'json-summary'],
  testTimeout: 30000,
};
```

---

## 📈 Coverage Reports

### Report Types

| Report | Location | Purpose |
|--------|----------|---------|
| **Text** | Terminal | Quick overview |
| **HTML** | `coverage/lcov-report/index.html` | Detailed browsable report |
| **LCOV** | `coverage/lcov.info` | CI/CD integration |
| **JSON** | `coverage/coverage-summary.json` | Programmatic access |

### Viewing HTML Reports

```bash
# Generate and open HTML report
yarn test --coverage

# Open in browser
# Windows
start coverage/lcov-report/index.html

# Mac
open coverage/lcov-report/index.html

# Linux
xdg-open coverage/lcov-report/index.html
```

### Sample Coverage Output

```
-----------------------------|---------|----------|---------|---------|-------------------
File                         | % Stmts | % Branch | % Funcs | % Lines | Uncovered Line #s
-----------------------------|---------|----------|---------|---------|-------------------
All files                    |   82.35 |    71.42 |   78.94 |   82.35 |
 src/components              |   91.66 |    85.71 |   90.00 |   91.66 |
  Button.tsx                 |     100 |      100 |     100 |     100 |
  Card.tsx                   |   88.88 |    75.00 |   85.71 |   88.88 | 45-48
  Modal.tsx                  |   86.36 |    80.00 |   83.33 |   86.36 | 78-82
 src/hooks                   |   76.47 |    66.66 |   72.72 |   76.47 |
  useAuth.ts                 |   80.00 |    70.00 |   75.00 |   80.00 | 34-38,52
  useProducts.ts             |   73.33 |    63.63 |   70.00 |   73.33 | 23-29,45-50
 src/utils                   |   95.00 |    90.00 |   93.33 |   95.00 |
  formatters.ts              |     100 |      100 |     100 |     100 |
  validators.ts              |   90.00 |    80.00 |   86.66 |   90.00 | 67-70
-----------------------------|---------|----------|---------|---------|-------------------
```

---

## 🔄 CI/CD Integration

### GitHub Actions Coverage

```yaml
# .github/workflows/test.yml
name: Test with Coverage

on: [push, pull_request]

jobs:
  test:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: '20.x'
          cache: 'yarn'

      - name: Install dependencies
        run: yarn install --frozen-lockfile

      - name: Run tests with coverage
        run: yarn test --coverage --coverageReporters=lcov

      - name: Upload coverage to Codecov
        uses: codecov/codecov-action@v3
        with:
          token: ${{ secrets.CODECOV_TOKEN }}
          files: ./coverage/lcov.info
          flags: unittests
          fail_ci_if_error: true

      - name: Coverage Summary
        uses: irongut/CodeCoverageSummary@v1.3.0
        with:
          filename: coverage/cobertura-coverage.xml
          badge: true
          format: markdown
          output: both

      - name: Add Coverage PR Comment
        uses: marocchino/sticky-pull-request-comment@v2
        if: github.event_name == 'pull_request'
        with:
          path: code-coverage-results.md
```

### Codecov Configuration

```yaml
# codecov.yml
coverage:
  precision: 2
  round: down
  range: "60...90"
  status:
    project:
      default:
        target: auto
        threshold: 2%
    patch:
      default:
        target: 80%

parsers:
  gcov:
    branch_detection:
      conditional: yes
      loop: yes
      method: no
      macro: no

comment:
  layout: "reach,diff,flags,tree"
  behavior: default
  require_changes: no
```

---

## 📝 Writing Tests

### Unit Test Example (Component)

```typescript
// tests/components/ProductCard.test.tsx
import { render, screen, fireEvent } from '@testing-library/react';
import { ProductCard } from '@/components/ProductCard';

const mockProduct = {
  id: '1',
  name: 'Test Product',
  price: 99.99,
  image: '/test.jpg',
};

describe('ProductCard', () => {
  it('renders product information', () => {
    render(<ProductCard product={mockProduct} />);
    
    expect(screen.getByText('Test Product')).toBeInTheDocument();
    expect(screen.getByText('$99.99')).toBeInTheDocument();
  });

  it('calls onAddToCart when button clicked', () => {
    const onAddToCart = jest.fn();
    render(<ProductCard product={mockProduct} onAddToCart={onAddToCart} />);
    
    fireEvent.click(screen.getByRole('button', { name: /add to cart/i }));
    
    expect(onAddToCart).toHaveBeenCalledWith(mockProduct.id);
  });

  it('displays sale badge when product is on sale', () => {
    const saleProduct = { ...mockProduct, compareAtPrice: 129.99 };
    render(<ProductCard product={saleProduct} />);
    
    expect(screen.getByText(/sale/i)).toBeInTheDocument();
  });
});
```

### Unit Test Example (Service)

```typescript
// tests/unit/productService.test.ts
import { ProductService } from '@/services/productService';
import { ProductRepository } from '@/repositories/productRepository';

jest.mock('@/repositories/productRepository');

describe('ProductService', () => {
  let productService: ProductService;
  let mockRepository: jest.Mocked<ProductRepository>;

  beforeEach(() => {
    mockRepository = new ProductRepository() as jest.Mocked<ProductRepository>;
    productService = new ProductService(mockRepository);
  });

  describe('getProducts', () => {
    it('returns paginated products', async () => {
      const mockProducts = [
        { id: '1', name: 'Product 1', price: 10 },
        { id: '2', name: 'Product 2', price: 20 },
      ];
      mockRepository.findAll.mockResolvedValue(mockProducts);
      mockRepository.count.mockResolvedValue(2);

      const result = await productService.getProducts({ page: 1, limit: 10 });

      expect(result.items).toEqual(mockProducts);
      expect(result.totalCount).toBe(2);
    });

    it('filters by category', async () => {
      await productService.getProducts({ categoryId: 'cat1' });

      expect(mockRepository.findAll).toHaveBeenCalledWith(
        expect.objectContaining({ categoryId: 'cat1' })
      );
    });
  });

  describe('createProduct', () => {
    it('creates product with valid data', async () => {
      const productData = { name: 'New Product', price: 50, categoryId: 'cat1' };
      mockRepository.create.mockResolvedValue({ id: '1', ...productData });

      const result = await productService.createProduct(productData);

      expect(result.id).toBe('1');
      expect(mockRepository.create).toHaveBeenCalledWith(productData);
    });

    it('throws error for invalid price', async () => {
      const invalidData = { name: 'Product', price: -10, categoryId: 'cat1' };

      await expect(productService.createProduct(invalidData))
        .rejects.toThrow('Price must be positive');
    });
  });
});
```

### Integration Test Example

```typescript
// tests/integration/auth.test.ts
import request from 'supertest';
import { app } from '@/app';
import { connectDatabase, disconnectDatabase } from '@/config/database';
import { User } from '@/models/User';

describe('Auth Integration Tests', () => {
  beforeAll(async () => {
    await connectDatabase(process.env.TEST_MONGODB_URL);
  });

  afterAll(async () => {
    await disconnectDatabase();
  });

  beforeEach(async () => {
    await User.deleteMany({});
  });

  describe('POST /api/auth/register', () => {
    it('registers a new user', async () => {
      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'test@example.com',
          password: 'Password123!',
          name: 'Test User',
        });

      expect(response.status).toBe(201);
      expect(response.body.user.email).toBe('test@example.com');
      expect(response.body.accessToken).toBeDefined();
    });

    it('returns 409 for duplicate email', async () => {
      await User.create({
        email: 'existing@example.com',
        password: 'hashed',
        name: 'Existing User',
      });

      const response = await request(app)
        .post('/api/auth/register')
        .send({
          email: 'existing@example.com',
          password: 'Password123!',
          name: 'New User',
        });

      expect(response.status).toBe(409);
    });
  });

  describe('POST /api/auth/login', () => {
    beforeEach(async () => {
      await request(app)
        .post('/api/auth/register')
        .send({
          email: 'user@example.com',
          password: 'Password123!',
          name: 'Test User',
        });
    });

    it('logs in with valid credentials', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'Password123!',
        });

      expect(response.status).toBe(200);
      expect(response.body.accessToken).toBeDefined();
    });

    it('returns 401 for invalid password', async () => {
      const response = await request(app)
        .post('/api/auth/login')
        .send({
          email: 'user@example.com',
          password: 'WrongPassword',
        });

      expect(response.status).toBe(401);
    });
  });
});
```

---

## 📊 Coverage Badges

### Adding to README

```markdown
[![Coverage Status](https://codecov.io/gh/your-org/e-commerce/branch/main/graph/badge.svg)](https://codecov.io/gh/your-org/e-commerce)

[![Coverage](https://img.shields.io/badge/coverage-82%25-green.svg)](./coverage)
```

### Per-Package Badges

```markdown
| Package | Coverage |
|---------|----------|
| Admin App | ![Coverage](https://img.shields.io/badge/coverage-78%25-yellow.svg) |
| Seller App | ![Coverage](https://img.shields.io/badge/coverage-82%25-green.svg) |
| Auth Service | ![Coverage](https://img.shields.io/badge/coverage-91%25-brightgreen.svg) |
```

---

## 🔍 Analyzing Coverage Gaps

### Identify Uncovered Code

1. Generate HTML report: `yarn test --coverage`
2. Open `coverage/lcov-report/index.html`
3. Click on files with low coverage
4. Red highlighted lines = uncovered code

### Common Coverage Gaps

| Gap Type | Solution |
|----------|----------|
| Error handlers | Test with mocked errors |
| Edge cases | Add boundary tests |
| Async code | Use async/await in tests |
| Conditional branches | Test all conditions |
| UI interactions | Use RTL events |

### Improving Coverage

```typescript
// Before: 60% coverage (missing error case)
export async function fetchUser(id: string) {
  const response = await api.get(`/users/${id}`);
  return response.data;
}

// After: 100% coverage (error case added)
export async function fetchUser(id: string) {
  try {
    const response = await api.get(`/users/${id}`);
    return response.data;
  } catch (error) {
    throw new UserNotFoundError(id);
  }
}

// Test file
it('throws UserNotFoundError when user not found', async () => {
  api.get.mockRejectedValue(new Error('404'));
  
  await expect(fetchUser('invalid'))
    .rejects.toThrow(UserNotFoundError);
});
```

---

## 📚 Related Documentation

- [CI/CD Pipeline](CI_CD_PIPELINE.md)
- [Architecture Overview](ARCHITECTURE.md)
- [Quick Commands](QUICK_COMMANDS.md)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
