// Environment and Build Tool Types

// Vite Environment Types
export interface ImportMetaEnv {
  readonly VITE_API_URL: string;
  readonly VITE_GRAPHQL_ENDPOINT: string;
  readonly VITE_AUTH_TOKEN_KEY: string;
  readonly VITE_REFRESH_TOKEN_KEY: string;
  readonly VITE_API_TIMEOUT: string;
  readonly VITE_CLOUDINARY_CLOUD_NAME?: string;
  readonly VITE_CLOUDINARY_UPLOAD_PRESET?: string;
}

export interface ImportMeta {
  readonly env: ImportMetaEnv;
}

// Next.js Environment Types
export interface NextEnv {
  readonly NEXT_PUBLIC_API_URL: string;
  readonly NEXT_PUBLIC_GRAPHQL_ENDPOINT: string;
  readonly NEXT_PUBLIC_AUTH_TOKEN_KEY: string;
}

// Runtime Environment Config
export interface EnvironmentConfig {
  apiUrl: string;
  graphqlEndpoint: string;
  authTokenKey: string;
  refreshTokenKey?: string;
  timeout?: number;
  environment: 'development' | 'staging' | 'production';
  isDevelopment: boolean;
  isProduction: boolean;
}
