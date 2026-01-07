import React from 'react';
import '@testing-library/jest-dom';

// Create jest mocks for next/navigation that can be configured in individual tests
export const mockRouterPush = jest.fn();
export const mockRouterReplace = jest.fn();
export const mockRouterBack = jest.fn();

const defaultRouter = {
  push: mockRouterPush,
  replace: mockRouterReplace,
  back: mockRouterBack,
  forward: jest.fn(),
  refresh: jest.fn(),
  prefetch: jest.fn(),
};

const defaultSearchParams = {
  get: jest.fn(),
  getAll: jest.fn(),
  has: jest.fn(),
  keys: jest.fn(),
  values: jest.fn(),
  entries: jest.fn(),
  forEach: jest.fn(),
  toString: jest.fn(),
};

// Mock next/navigation with jest.fn() so tests can call mockReturnValue
jest.mock('next/navigation', () => ({
  useRouter: jest.fn(() => defaultRouter),
  useSearchParams: jest.fn(() => defaultSearchParams),
  usePathname: jest.fn(() => '/'),
  useParams: jest.fn(() => ({})),
}));

// Mock next/link
jest.mock('next/link', () => {
  const MockLink = ({ children, href }: { children: React.ReactNode; href: string }) => {
    return <a href={href}>{children}</a>;
  };
  MockLink.displayName = 'MockLink';
  return MockLink;
});

// Mock next/image
jest.mock('next/image', () => {
  const MockImage = (props: any) => {
    // eslint-disable-next-line @next/next/no-img-element
    return <img {...props} alt={props.alt || ''} />;
  };
  MockImage.displayName = 'MockImage';
  return MockImage;
});

// Mock window.matchMedia
Object.defineProperty(window, 'matchMedia', {
  writable: true,
  value: jest.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: jest.fn(),
    removeListener: jest.fn(),
    addEventListener: jest.fn(),
    removeEventListener: jest.fn(),
    dispatchEvent: jest.fn(),
  })),
});

// Mock localStorage
const localStorageMock = {
  getItem: jest.fn(),
  setItem: jest.fn(),
  removeItem: jest.fn(),
  clear: jest.fn(),
};
Object.defineProperty(window, 'localStorage', {
  value: localStorageMock,
});

// Mock IntersectionObserver
class MockIntersectionObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(window, 'IntersectionObserver', {
  writable: true,
  value: MockIntersectionObserver,
});

// Mock ResizeObserver
class MockResizeObserver {
  observe = jest.fn();
  unobserve = jest.fn();
  disconnect = jest.fn();
}
Object.defineProperty(window, 'ResizeObserver', {
  writable: true,
  value: MockResizeObserver,
});

// Reset all mocks between tests
beforeEach(() => {
  jest.clearAllMocks();
});
