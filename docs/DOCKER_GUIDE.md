# 🐳 Docker Guide - E-Commerce Platform

## What is Docker?

Docker is a **containerization platform** that packages your application and all its dependencies into a standardized unit called a **container**. Think of it as a lightweight virtual machine that runs consistently across any environment.

---

## 🤔 Why Docker is Important

### Without Docker (Traditional Approach)

```
Developer 1: "It works on my machine!"
Developer 2: "But it crashes on mine..."
Production: "Everything is broken!"

Problems:
❌ Different Node.js versions
❌ Different MongoDB versions
❌ Missing environment variables
❌ OS-specific issues (Windows vs Mac vs Linux)
```

### With Docker

```
✅ Same environment everywhere
✅ All dependencies bundled together
✅ One command to start everything
✅ Works identically on any machine
```

---

## 📁 Docker Files in This Project

| File                            | Purpose                               |
| ------------------------------- | ------------------------------------- |
| `Dockerfile`                    | Main development image (all services) |
| `Dockerfile.backend`            | Backend services only                 |
| `Dockerfile.frontend`           | Frontend apps only                    |
| `Dockerfile.prod`               | Production-optimized build            |
| `docker-compose.yml`            | Development orchestration             |
| `docker-compose.dev.yml`        | Extended dev config                   |
| `docker-compose.production.yml` | Production config                     |

---

## 🏗️ Architecture with Docker

```
┌─────────────────────────────────────────────────────────────────┐
│                    DOCKER COMPOSE                                │
│                 (Orchestrates all containers)                    │
├─────────────────────────────────────────────────────────────────┤
│                                                                  │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │
│  │   MongoDB    │  │    Redis     │  │    Nginx     │           │
│  │   :27017     │  │    :6379     │  │    :80/443   │           │
│  │  (Database)  │  │   (Cache)    │  │   (Proxy)    │           │
│  └──────────────┘  └──────────────┘  └──────────────┘           │
│         │                 │                 │                    │
│         └─────────────────┼─────────────────┘                    │
│                           │                                      │
│  ┌────────────────────────┴────────────────────────┐            │
│  │              APPLICATION CONTAINER               │            │
│  │                                                  │            │
│  │  Frontend Apps:        Backend Services:         │            │
│  │  • Shell    :3000      • Auth      :3011        │            │
│  │  • Admin    :3001      • Category  :3012        │            │
│  │  • Seller   :3002      • Coupon    :3013        │            │
│  │  • Store    :3003      • Product   :3014        │            │
│  │  • Storybook:6006      • Order     :3015        │            │
│  │                        • Gateway   :4000        │            │
│  └──────────────────────────────────────────────────┘            │
│                                                                  │
└─────────────────────────────────────────────────────────────────┘
```

---

## 🚀 Quick Start Commands

### Start All Services

```powershell
# Start everything (MongoDB, Redis, App)
docker-compose up -d

# View logs
docker-compose logs -f

# Stop everything
docker-compose down
```

### Start Specific Services

```powershell
# Start only databases
docker-compose up -d mongodb redis

# Start with rebuild
docker-compose up -d --build

# Start in foreground (see logs)
docker-compose up
```

---

## 📋 docker-compose.yml Explained

```yaml
version: '3.8'

services:
  # MongoDB - Primary database
  mongodb:
    image: mongo:7.0
    container_name: ecommerce-mongodb
    restart: unless-stopped
    ports:
      - '27017:27017'
    environment:
      MONGO_INITDB_ROOT_USERNAME: admin
      MONGO_INITDB_ROOT_PASSWORD: password
    volumes:
      - mongodb_data:/data/db
    networks:
      - ecommerce-network
    healthcheck:
      test: echo 'db.runCommand("ping").ok' | mongosh localhost:27017/test --quiet
      interval: 10s
      timeout: 5s
      retries: 5

  # Redis - Caching layer
  redis:
    image: redis:7-alpine
    container_name: ecommerce-redis
    restart: unless-stopped
    ports:
      - '6379:6379'
    volumes:
      - redis_data:/data
    networks:
      - ecommerce-network
    healthcheck:
      test: ['CMD', 'redis-cli', 'ping']
      interval: 10s
      timeout: 5s
      retries: 5

  # Application container
  app:
    build:
      context: .
      dockerfile: Dockerfile
    container_name: ecommerce-app
    restart: unless-stopped
    ports:
      - '3000:3000' # Shell App
      - '3001:3001' # Admin App
      - '3002:3002' # Seller App
      - '3003:3003' # Storefront
      - '3011:3011' # Auth Service
      - '3012:3012' # Category Service
      - '3013:3013' # Coupon Service
      - '3014:3014' # Product Service
      - '3015:3015' # Order Service
      - '4000:4000' # GraphQL Gateway
      - '6006:6006' # Storybook
    environment:
      NODE_ENV: development
      MONGODB_URL: mongodb://admin:password@mongodb:27017/ecommerce?authSource=admin
      REDIS_URL: redis://redis:6379
      JWT_SECRET: dev-jwt-secret-change-in-production
    depends_on:
      mongodb:
        condition: service_healthy
      redis:
        condition: service_healthy
    volumes:
      - .:/app
      - /app/node_modules
    networks:
      - ecommerce-network

networks:
  ecommerce-network:
    driver: bridge

volumes:
  mongodb_data:
  redis_data:
```

---

## 🔧 Useful Docker Commands

### Container Management

```powershell
# List running containers
docker ps

# List all containers (including stopped)
docker ps -a

# Stop a container
docker stop ecommerce-app

# Remove a container
docker rm ecommerce-app

# View container logs
docker logs ecommerce-app -f

# Execute command in container
docker exec -it ecommerce-app bash
```

### Image Management

```powershell
# List images
docker images

# Remove an image
docker rmi image-name

# Build an image
docker build -t ecommerce-app .

# Clean up unused images
docker image prune
```

### Volume Management

```powershell
# List volumes
docker volume ls

# Remove a volume
docker volume rm mongodb_data

# Clean up unused volumes
docker volume prune
```

---

## 💡 Benefits Summary

| Benefit            | Description                                   |
| ------------------ | --------------------------------------------- |
| **🔄 Consistency** | Same environment everywhere (dev, test, prod) |
| **📦 Isolation**   | Each service runs independently               |
| **🚀 Speed**       | Start entire stack in seconds                 |
| **🔧 Easy Setup**  | One command to run everything                 |
| **📈 Scalability** | Easy to scale services horizontally           |
| **🛡️ Security**    | Services isolated in containers               |
| **🧹 Clean**       | No pollution of host system                   |

---

## 🔍 Troubleshooting

### Common Issues

| Issue                     | Solution                                                      |
| ------------------------- | ------------------------------------------------------------- |
| Port already in use       | Stop conflicting service or change port in docker-compose.yml |
| Container won't start     | Check logs: `docker-compose logs service-name`                |
| MongoDB connection failed | Ensure mongodb container is healthy: `docker ps`              |
| Out of disk space         | Clean up: `docker system prune -a`                            |
| Permission denied         | Run Docker Desktop as administrator                           |

### Health Check

```powershell
# Check all services status
docker-compose ps

# Check container health
docker inspect --format='{{.State.Health.Status}}' ecommerce-mongodb
```
