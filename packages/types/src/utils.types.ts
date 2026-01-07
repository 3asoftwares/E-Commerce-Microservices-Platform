// Utils - API Client Types

// GraphQL Client Types
export interface GraphQLResponse<T = any> {
  data?: T;
  errors?: Array<{
    message: string;
    locations?: Array<{ line: number; column: number }>;
    path?: string[];
    extensions?: any;
  }>;
}

export interface GraphQLClientConfig {
  url: string;
  headers?: Record<string, string>;
  tokenStorageKey?: string;
  onError?: (error: Error) => void;
}

// Logger Types (Enum moved to enums/logLevel.ts)
import { LogLevel } from './enums/logLevel';

export interface LogEntry {
  level: LogLevel;
  message: string;
  timestamp: Date;
  data?: any;
  context?: string;
}

// Error Handler Types (Enum moved to enums/errorType.ts)
import { ErrorType } from './enums/errorType';

export interface AppError {
  type: ErrorType;
  message: string;
  originalError?: any;
  statusCode?: number;
}

export interface NotificationOptions {
  duration?: number;
  position?: 'top' | 'bottom' | 'center';
  type?: 'success' | 'error' | 'warning' | 'info';
}

// Auth Token Types
export interface AuthTokens {
  accessToken: string;
  refreshToken?: string;
  expiresIn?: number;
}

export interface StoredAuth {
  user: any;
  token: string;
  expiresIn: number;
}

export interface TokenPayload {
  userId: string;
  email: string;
  role: string;
  iat?: number;
  exp?: number;
}
