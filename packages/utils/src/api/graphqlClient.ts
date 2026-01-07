import axios, { AxiosInstance, AxiosRequestConfig } from 'axios';

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

export class GraphQLClient {
  private client: AxiosInstance;
  private tokenStorageKey: string;
  private onError?: (error: Error) => void;

  constructor(config: GraphQLClientConfig) {
    this.tokenStorageKey = config.tokenStorageKey || 'auth_token';
    this.onError = config.onError;

    this.client = axios.create({
      baseURL: config.url,
      headers: {
        'Content-Type': 'application/json',
        ...config.headers,
      },
    });

    this.setupInterceptors();
  }

  private setupInterceptors(): void {
    
    this.client.interceptors.request.use(
      (config) => {
        if (typeof window !== 'undefined') {
          const token = localStorage.getItem(this.tokenStorageKey);
          if (token) {
            config.headers.Authorization = `Bearer ${token}`;
          }
        }
        return config;
      },
      (error) => {
        return Promise.reject(error);
      }
    );

    this.client.interceptors.response.use(
      (response) => {
        
        if (response.data.errors && response.data.errors.length > 0) {
          const error = new Error(response.data.errors[0].message);
          if (this.onError) {
            this.onError(error);
          }
          throw error;
        }
        return response;
      },
      (error) => {
        if (this.onError) {
          this.onError(error);
        }
        return Promise.reject(error);
      }
    );
  }

  async request<T = any>(
    query: string,
    variables?: Record<string, any>,
    config?: AxiosRequestConfig
  ): Promise<T> {
    try {
      const response = await this.client.post<GraphQLResponse<T>>('', { query, variables }, config);
      return response.data.data as T;
    } catch (error: any) {
      throw new Error(error?.response?.data?.errors?.[0]?.message || error.message);
    }
  }

  setToken(token: string): void {
    if (typeof window !== 'undefined') {
      localStorage.setItem(this.tokenStorageKey, token);
    }
  }

  clearToken(): void {
    if (typeof window !== 'undefined') {
      localStorage.removeItem(this.tokenStorageKey);
    }
  }

  getToken(): string | null {
    if (typeof window !== 'undefined') {
      return localStorage.getItem(this.tokenStorageKey);
    }
    return null;
  }
}

export function createGraphQLClient(config: GraphQLClientConfig): GraphQLClient {
  return new GraphQLClient(config);
}
