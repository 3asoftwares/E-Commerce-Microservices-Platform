# 📊 MongoDB vs Redis Guide

## What is MongoDB?

MongoDB is a **NoSQL document database** that stores data in flexible, JSON-like documents. Think of it as your **permanent storage** - the main database where all your business data lives.

| Feature        | Description                                         |
| -------------- | --------------------------------------------------- |
| **Data Model** | Documents (JSON/BSON format)                        |
| **Storage**    | Persistent disk storage                             |
| **Best For**   | Storing business entities (users, products, orders) |
| **Query**      | Rich queries, aggregations, indexes                 |

---

## What is Redis?

Redis is an **in-memory data store** primarily used for **caching and sessions**. Think of it as **temporary super-fast storage** that sits in front of MongoDB.

| Feature        | Description                               |
| -------------- | ----------------------------------------- |
| **Data Model** | Key-Value pairs                           |
| **Storage**    | In-memory (RAM) with optional persistence |
| **Best For**   | Caching, sessions, real-time counters     |
| **Speed**      | Extremely fast (microseconds)             |

---

## 🔄 Key Differences

| Aspect               | MongoDB                            | Redis                                 |
| -------------------- | ---------------------------------- | ------------------------------------- |
| **Purpose**          | Primary database (source of truth) | Cache & session store                 |
| **Speed**            | Fast (milliseconds)                | Ultra-fast (microseconds)             |
| **Data Persistence** | ✅ Always persisted to disk        | ⚠️ In-memory (can be lost on restart) |
| **Data Structure**   | Complex documents with nesting     | Simple key-value, lists, sets         |
| **Query Capability** | Rich queries, filters, joins       | Simple get/set operations             |
| **Scalability**      | Horizontal (sharding)              | Horizontal (cluster)                  |
| **Use Case**         | Store products, users, orders      | Cache product lists, user sessions    |

---

## 🏗️ How This Project Uses Them

### 1. MongoDB - Primary Data Storage

Located in `services/product-service/src/models/Product.ts`:

```typescript
// MongoDB Schema - Permanent product storage
const productSchema = new Schema<IProduct>(
  {
    name: { type: String, required: true },
    description: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    stock: { type: Number, default: 0 },
    sellerId: { type: String, required: true },
    rating: { type: Number, default: 0 },
    reviewCount: { type: Number, default: 0 },
  },
  { timestamps: true }
);

// Indexes for fast searching
productSchema.index({ name: 'text', description: 'text' });
productSchema.index({ category: 1 });
productSchema.index({ price: 1 });
```

### 2. Redis - Caching Layer

Located in `services/product-service/src/infrastructure/cache.ts`:

```typescript
import Redis from 'ioredis';

// Redis CacheService - Fast temporary storage
export class CacheService {
  static async get<T>(key: string): Promise<T | null> {
    const data = await redisClient.get(key);
    return data ? JSON.parse(data) : null;
  }

  static async set(key: string, value: any, ttl: number = 3600) {
    await redisClient.setex(key, ttl, JSON.stringify(value));
  }
}

// Cache key patterns
export const CacheKeys = {
  product: (id: string) => `product:${id}`,
  products: (page: number, limit: number) => `products:${page}:${limit}`,
  categories: () => `categories:all`,
  cart: (userId: string) => `cart:${userId}`,
  session: (userId: string) => `session:${userId}`,
};

// TTL (Time To Live) settings
export const CacheTTL = {
  PRODUCTS: 3600, // 1 hour
  PRODUCT_DETAIL: 1800, // 30 minutes
  CATEGORIES: 7200, // 2 hours
  SESSION: 86400, // 24 hours
  CART: 604800, // 7 days
};
```

---

## 🔀 How They Work Together

```
┌─────────────────────────────────────────────────────────────┐
│                      USER REQUEST                            │
│                    "Get Product #123"                        │
└─────────────────────────────────────────────────────────────┘
                            │
                            ▼
┌─────────────────────────────────────────────────────────────┐
│                     PRODUCT SERVICE                          │
│                                                              │
│   1️⃣ Check Redis Cache First (microseconds)                 │
│      CacheService.get('product:123')                         │
│                                                              │
│   ┌─────────────────┐                                        │
│   │ Cache HIT? ✅   │ ──────► Return cached data (FAST!)    │
│   └─────────────────┘                                        │
│           │                                                  │
│           │ Cache MISS? ❌                                   │
│           ▼                                                  │
│   2️⃣ Query MongoDB (milliseconds)                           │
│      Product.findById('123')                                 │
│                                                              │
│   3️⃣ Store in Redis for next time                           │
│      CacheService.set('product:123', product, 1800)          │
│                                                              │
│   4️⃣ Return data to user                                    │
└─────────────────────────────────────────────────────────────┘
```

---

## 💡 Benefits of This Architecture

| Benefit              | Description                                                       |
| -------------------- | ----------------------------------------------------------------- |
| **⚡ Speed**         | Most reads served from Redis (~1ms) instead of MongoDB (~10-50ms) |
| **📉 Database Load** | MongoDB handles fewer queries = less CPU/memory usage             |
| **💰 Cost Savings**  | Fewer database operations = lower cloud costs                     |
| **🛡️ Resilience**    | If Redis fails, falls back to MongoDB                             |
| **📊 Scalability**   | Handle millions of requests without overloading MongoDB           |

---

## 🐳 Docker Configuration

In `docker-compose.yml`:

```yaml
# MongoDB - Primary database
mongodb:
  image: mongo:7.0
  ports:
    - '27017:27017'
  environment:
    MONGO_INITDB_ROOT_USERNAME: admin
    MONGO_INITDB_ROOT_PASSWORD: password
  volumes:
    - mongodb_data:/data/db

# Redis - Cache & sessions
redis:
  image: redis:7-alpine
  ports:
    - '6379:6379'
  volumes:
    - redis_data:/data
```

---

## 📝 Summary

| Database    | Role in Project       | Example Data                                 |
| ----------- | --------------------- | -------------------------------------------- |
| **MongoDB** | Permanent storage     | Products, Users, Orders, Reviews             |
| **Redis**   | Fast cache & sessions | Product cache, User sessions, Shopping carts |

**Think of it like this:**

- 📚 **MongoDB** = Library bookshelf (stores all books permanently)
- 🏃 **Redis** = Your desk (keeps frequently-used books nearby for quick access)
