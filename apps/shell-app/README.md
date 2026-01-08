# Shell App

## Overview

Central launcher and dashboard for navigating to all other applications - serves as the main entry point and authentication gateway for the 3asoftwares platform.

## Tech Stack

### Frontend Framework

- **React 18** - UI library
- **TypeScript 5** - Type-safe development
- **Webpack 5** - Build tool and bundler

### State Management

- **Zustand** - Lightweight state management

### Styling

- **Tailwind CSS 3.4** - Utility-first CSS
- **DaisyUI 4** - Component library

### Routing

- **React Router DOM 6** - Client-side routing

### Testing

- **Jest 29** - Test runner
- **React Testing Library 14** - Component testing

### Icons

- **FontAwesome** - Icon library

### Architecture

- **Module Federation** - Micro-frontend host application

## Features

- ✅ Landing page with platform overview
- ✅ Authentication (Login/Register)
- ✅ Role-based navigation (Admin/Seller)
- ✅ Dark/Light theme toggle
- ✅ Responsive design
- ✅ Forgot password flow
- ✅ Session management
- ✅ Navigation to Admin and Seller portals

## Project Structure

```
src/
├── components/   # Reusable UI components
│   ├── Header.tsx
│   ├── Footer.tsx
│   ├── AuthForm.tsx
│   └── WelcomePage.tsx
├── store/        # Zustand stores
│   └── uiStore.ts
├── App.tsx       # Main application component
└── index.tsx     # Entry point
```

## Scripts

```bash
yarn dev         # Start development server (port 3000)
yarn build       # Build for production
yarn start       # Start dev server
yarn test        # Run tests
yarn test:watch  # Run tests in watch mode
yarn test:coverage # Run tests with coverage
```

## Environment Variables

```env
REACT_APP_SERVICE_URL=http://localhost:4000
REACT_APP_ADMIN_URL=http://localhost:3001
REACT_APP_SELLER_URL=http://localhost:3002
```

## Port

- Development: `3000` (Main entry point)

## Module Federation

This is the **host** application that loads remote modules from:

- Admin App (port 3001)
- Seller App (port 3002)
