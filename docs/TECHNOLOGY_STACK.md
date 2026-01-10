# 🛠️ Technology Stack - E-Commerce Platform

## 📊 Overview

| Layer               | Technology                                 |
| ------------------- | ------------------------------------------ |
| **Architecture**    | Microservices + Micro-frontends (Monorepo) |
| **Package Manager** | Yarn Workspaces                            |
| **Language**        | TypeScript 5.x                             |
| **Container**       | Docker + Docker Compose                    |
| **CI/CD**           | GitHub Actions                             |
| **Deployment**      | Vercel                                     |

---

## 🖥️ Frontend Applications

### 1. Storefront App (Customer-facing)

| Category             | Technology                        |
| -------------------- | --------------------------------- |
| **Framework**        | Next.js 16 (App Router)           |
| **UI Library**       | React 18                          |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.x    |
| **State Management** | Zustand, Recoil                   |
| **Data Fetching**    | Apollo Client, TanStack Query 5.x |
| **Icons**            | Font Awesome 7                    |
| **HTTP Client**      | Axios                             |
| **Testing**          | Jest 29 + React Testing Library   |

### 2. Admin App (Platform management)

| Category             | Technology                              |
| -------------------- | --------------------------------------- |
| **Build Tool**       | Vite 4.5                                |
| **UI Library**       | React 18                                |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.x          |
| **State Management** | Redux Toolkit 2, React Redux 9, Zustand |
| **Data Fetching**    | TanStack Query 5.x                      |
| **Routing**          | React Router DOM 6                      |
| **Media**            | Cloudinary SDK                          |
| **Micro-frontend**   | Vite Plugin Federation                  |
| **Testing**          | Jest 29 + React Testing Library         |

### 3. Seller App (Seller portal)

| Category             | Technology                      |
| -------------------- | ------------------------------- |
| **Build Tool**       | Vite 4.5                        |
| **UI Library**       | React 18                        |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.x  |
| **State Management** | Redux Toolkit 2, React Redux 9  |
| **Data Fetching**    | TanStack Query 5.x              |
| **Routing**          | React Router DOM 6              |
| **Media**            | Cloudinary SDK                  |
| **Micro-frontend**   | Vite Plugin Federation          |
| **Testing**          | Jest 29 + React Testing Library |

### 4. Shell App (Central launcher)

| Category             | Technology                           |
| -------------------- | ------------------------------------ |
| **Build Tool**       | Webpack 5                            |
| **Transpiler**       | Babel 7 (React + TypeScript presets) |
| **UI Library**       | React 18                             |
| **Styling**          | Tailwind CSS 3.4 + DaisyUI 4.x       |
| **State Management** | Zustand                              |
| **Routing**          | React Router DOM 6                   |
| **Testing**          | Jest 29 + React Testing Library      |

---

## ⚙️ Backend Services

### Common Stack (All Services)

| Category        | Technology             |
| --------------- | ---------------------- |
| **Runtime**     | Node.js                |
| **Framework**   | Express.js 4.18        |
| **Language**    | TypeScript 5.3         |
| **Database**    | MongoDB 7 (Mongoose 8) |
| **Security**    | Helmet, CORS           |
| **Logging**     | Morgan                 |
| **Validation**  | Express Validator 7    |
| **Environment** | dotenv                 |
| **Dev Server**  | Nodemon + ts-node      |
| **Testing**     | Jest 29 + ts-jest      |

### Auth Service (Authentication)

| Extra Feature        | Technology                                  |
| -------------------- | ------------------------------------------- |
| **Authentication**   | JWT (jsonwebtoken 9)                        |
| **Password Hashing** | bcryptjs                                    |
| **Email**            | Nodemailer                                  |
| **API Docs**         | Swagger (swagger-jsdoc, swagger-ui-express) |
| **Deployment**       | Vercel Serverless (@vercel/node)            |

### Product Service (Products & Reviews)

| Extra Feature | Technology        |
| ------------- | ----------------- |
| **Caching**   | Redis 7 (ioredis) |

### GraphQL Gateway (API Aggregation)

| Extra Feature           | Technology            |
| ----------------------- | --------------------- |
| **API Layer**           | Apollo Server 4       |
| **Query Language**      | GraphQL 16            |
| **HTTP Client**         | Axios                 |
| **Next.js Integration** | @as-integrations/next |

---

## 📦 Shared Packages

### @3asoftwares/types

| Category       | Technology                  |
| -------------- | --------------------------- |
| **Purpose**    | TypeScript type definitions |
| **Build Tool** | tsup 8                      |
| **Testing**    | Vitest 4                    |

### @3asoftwares/utils

| Category       | Technology                           |
| -------------- | ------------------------------------ |
| **Purpose**    | Shared utilities, configs, constants |
| **Build Tool** | tsup 8                               |
| **Testing**    | Vitest 4                             |
| **Exports**    | Client/Server split bundles          |

### @3asoftwares/ui

| Category          | Technology              |
| ----------------- | ----------------------- |
| **Purpose**       | React component library |
| **Build Tool**    | Vite + tsup             |
| **Documentation** | Storybook               |
| **Testing**       | Vitest 4                |
| **Icons**         | Font Awesome            |

---

## 🧪 Testing Stack

| Layer              | Technology                         |
| ------------------ | ---------------------------------- |
| **Frontend Tests** | Jest 29 + React Testing Library 14 |
| **Backend Tests**  | Jest 29 + ts-jest                  |
| **Package Tests**  | Vitest 4                           |
| **Coverage**       | @vitest/coverage-v8                |

---

## 📐 Code Quality

| Tool                          | Purpose           |
| ----------------------------- | ----------------- |
| **ESLint 8**                  | Linting           |
| **TypeScript ESLint**         | TS-specific rules |
| **eslint-plugin-react**       | React rules       |
| **eslint-plugin-react-hooks** | Hooks rules       |
| **eslint-plugin-jsx-a11y**    | Accessibility     |
| **Prettier**                  | Code formatting   |

---

## 📈 Technology Summary

```
┌─────────────────────────────────────────────────────────────────┐
│                    E-COMMERCE PLATFORM                          │
├─────────────────────────────────────────────────────────────────┤
│  FRONTEND (4 Apps)           │  BACKEND (6 Services)           │
│  ─────────────────           │  ──────────────────             │
│  • Next.js 16 (Storefront)   │  • Express.js 4.18              │
│  • Vite 4.5 (Admin, Seller)  │  • Apollo Server 4 (Gateway)    │
│  • Webpack 5 (Shell)         │  • MongoDB 8 + Mongoose         │
│  • React 18 + TypeScript     │  • Redis 7 (ioredis)            │
│  • Tailwind + DaisyUI        │  • JWT Authentication           │
│  • Redux Toolkit / Zustand   │  • Swagger API Docs             │
│  • TanStack Query / Apollo   │                                 │
├─────────────────────────────────────────────────────────────────┤
│  SHARED PACKAGES             │  INFRASTRUCTURE                 │
│  ────────────────            │  ──────────────                 │
│  • @3asoftwares/types        │  • Docker + Compose             │
│  • @3asoftwares/utils        │  • Kubernetes (k8s)             │
│  • @3asoftwares/ui           │  • GitHub Actions CI/CD         │
│  • Storybook                 │  • Vercel Deployment            │
│  • tsup Build Tool           │  • Nginx Reverse Proxy          │
└─────────────────────────────────────────────────────────────────┘
```

---

## 📊 Technology Count

| Category                   | Count                                      |
| -------------------------- | ------------------------------------------ |
| **Languages**              | 2 (TypeScript, JavaScript)                 |
| **Frontend Frameworks**    | 2 (React, Next.js)                         |
| **Build Tools**            | 4 (Vite, Webpack, tsup, Next.js)           |
| **State Management**       | 4 (Redux, Zustand, Recoil, TanStack Query) |
| **Databases**              | 2 (MongoDB, Redis)                         |
| **Testing Frameworks**     | 2 (Jest, Vitest)                           |
| **CI/CD Workflows**        | 5                                          |
| **Total npm Dependencies** | ~100+ packages                             |
