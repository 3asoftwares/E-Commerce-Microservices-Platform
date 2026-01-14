/**
 * Health Monitor
 * Automated health monitoring with Splunk On-Call integration
 */

import { AlertManager, createAlertManager } from './alert-manager';

export interface HealthCheck {
  name: string;
  check: () => Promise<boolean>;
  interval?: number; // milliseconds
  timeout?: number; // milliseconds
  critical?: boolean; // if true, failure triggers critical alert
}

export interface HealthCheckResult {
  name: string;
  healthy: boolean;
  latencyMs: number;
  error?: string;
  lastChecked: Date;
}

export interface HealthMonitorConfig {
  serviceName: string;
  checks: HealthCheck[];
  defaultInterval?: number;
  defaultTimeout?: number;
  onHealthChange?: (results: HealthCheckResult[]) => void;
}

/**
 * Health Monitor
 * Continuously monitors service health and sends alerts via Splunk On-Call
 */
export class HealthMonitor {
  private config: HealthMonitorConfig;
  private alertManager: AlertManager;
  private results: Map<string, HealthCheckResult> = new Map();
  private intervals: Map<string, NodeJS.Timeout> = new Map();
  private previousHealth: Map<string, boolean> = new Map();
  private running: boolean = false;

  constructor(config: HealthMonitorConfig) {
    this.config = config;
    this.alertManager = createAlertManager(config.serviceName);
  }

  /**
   * Execute a single health check
   */
  private async executeCheck(check: HealthCheck): Promise<HealthCheckResult> {
    const timeout = check.timeout || this.config.defaultTimeout || 5000;
    const startTime = Date.now();

    try {
      const timeoutPromise = new Promise<boolean>((_, reject) => {
        setTimeout(() => reject(new Error('Health check timeout')), timeout);
      });

      const healthy = await Promise.race([check.check(), timeoutPromise]);
      const latencyMs = Date.now() - startTime;

      return {
        name: check.name,
        healthy,
        latencyMs,
        lastChecked: new Date(),
      };
    } catch (error) {
      const latencyMs = Date.now() - startTime;
      return {
        name: check.name,
        healthy: false,
        latencyMs,
        error: error instanceof Error ? error.message : String(error),
        lastChecked: new Date(),
      };
    }
  }

  /**
   * Process health check result and send alerts if needed
   */
  private async processResult(check: HealthCheck, result: HealthCheckResult): Promise<void> {
    const previouslyHealthy = this.previousHealth.get(check.name);
    this.results.set(check.name, result);
    this.previousHealth.set(check.name, result.healthy);

    // Detect state changes
    if (previouslyHealthy !== undefined && previouslyHealthy !== result.healthy) {
      if (result.healthy) {
        // Recovered
        await this.alertManager.healthCheckRecovered(check.name);
      } else {
        // Failed
        const error = new Error(result.error || 'Health check failed');
        await this.alertManager.healthCheckFailed(check.name, error);
      }
    } else if (previouslyHealthy === undefined && !result.healthy) {
      // Initial failure
      const error = new Error(result.error || 'Health check failed');
      await this.alertManager.healthCheckFailed(check.name, error);
    }

    // Notify callback
    if (this.config.onHealthChange) {
      this.config.onHealthChange(this.getResults());
    }
  }

  /**
   * Start monitoring all health checks
   */
  start(): void {
    if (this.running) {
      console.warn('Health monitor is already running');
      return;
    }

    this.running = true;
    console.log(`[HealthMonitor] Starting health monitoring for ${this.config.serviceName}`);

    for (const check of this.config.checks) {
      const interval = check.interval || this.config.defaultInterval || 30000;

      // Run immediately
      this.runCheck(check);

      // Schedule recurring checks
      const intervalId = setInterval(() => this.runCheck(check), interval);
      this.intervals.set(check.name, intervalId);
    }
  }

  /**
   * Run a single health check
   */
  private async runCheck(check: HealthCheck): Promise<void> {
    try {
      const result = await this.executeCheck(check);
      await this.processResult(check, result);
    } catch (error) {
      console.error(`[HealthMonitor] Error running check ${check.name}:`, error);
    }
  }

  /**
   * Stop monitoring
   */
  stop(): void {
    this.running = false;
    console.log(`[HealthMonitor] Stopping health monitoring for ${this.config.serviceName}`);

    for (const [name, intervalId] of this.intervals) {
      clearInterval(intervalId);
      this.intervals.delete(name);
    }
  }

  /**
   * Get current health check results
   */
  getResults(): HealthCheckResult[] {
    return Array.from(this.results.values());
  }

  /**
   * Get overall health status
   */
  isHealthy(): boolean {
    if (this.results.size === 0) {
      return true; // No checks run yet
    }
    return Array.from(this.results.values()).every((r) => r.healthy);
  }

  /**
   * Get health summary
   */
  getSummary(): {
    healthy: boolean;
    totalChecks: number;
    passingChecks: number;
    failingChecks: number;
    checks: HealthCheckResult[];
  } {
    const results = this.getResults();
    const passingChecks = results.filter((r) => r.healthy).length;
    const failingChecks = results.filter((r) => !r.healthy).length;

    return {
      healthy: this.isHealthy(),
      totalChecks: results.length,
      passingChecks,
      failingChecks,
      checks: results,
    };
  }

  /**
   * Run a single check manually
   */
  async runCheckManually(checkName: string): Promise<HealthCheckResult | null> {
    const check = this.config.checks.find((c) => c.name === checkName);
    if (!check) {
      console.warn(`Health check not found: ${checkName}`);
      return null;
    }

    const result = await this.executeCheck(check);
    await this.processResult(check, result);
    return result;
  }

  /**
   * Add a new health check
   */
  addCheck(check: HealthCheck): void {
    this.config.checks.push(check);

    if (this.running) {
      const interval = check.interval || this.config.defaultInterval || 30000;
      this.runCheck(check);
      const intervalId = setInterval(() => this.runCheck(check), interval);
      this.intervals.set(check.name, intervalId);
    }
  }

  /**
   * Remove a health check
   */
  removeCheck(checkName: string): void {
    const intervalId = this.intervals.get(checkName);
    if (intervalId) {
      clearInterval(intervalId);
      this.intervals.delete(checkName);
    }

    this.config.checks = this.config.checks.filter((c) => c.name !== checkName);
    this.results.delete(checkName);
    this.previousHealth.delete(checkName);
  }
}

/**
 * Common health check builders
 */
export const HealthChecks = {
  /**
   * Check if a URL is reachable
   */
  http: (name: string, url: string, expectedStatus = 200): HealthCheck => ({
    name,
    check: async () => {
      const response = await fetch(url, { method: 'HEAD' });
      return response.status === expectedStatus;
    },
  }),

  /**
   * Check MongoDB connection
   */
  mongodb: (name: string, mongoose: any): HealthCheck => ({
    name,
    check: async () => {
      return mongoose.connection.readyState === 1;
    },
  }),

  /**
   * Check Redis connection
   */
  redis: (name: string, redisClient: any): HealthCheck => ({
    name,
    check: async () => {
      const result = await redisClient.ping();
      return result === 'PONG';
    },
  }),

  /**
   * Memory usage check
   */
  memory: (name: string, thresholdPercent = 90): HealthCheck => ({
    name,
    check: async () => {
      const used = process.memoryUsage();
      const heapUsedPercent = (used.heapUsed / used.heapTotal) * 100;
      return heapUsedPercent < thresholdPercent;
    },
  }),

  /**
   * Custom check
   */
  custom: (name: string, checkFn: () => Promise<boolean>): HealthCheck => ({
    name,
    check: checkFn,
  }),
};

/**
 * Create a health monitor for a service
 */
export function createHealthMonitor(
  serviceName: string,
  checks: HealthCheck[],
  options?: Partial<HealthMonitorConfig>
): HealthMonitor {
  return new HealthMonitor({
    serviceName,
    checks,
    defaultInterval: options?.defaultInterval || 30000,
    defaultTimeout: options?.defaultTimeout || 5000,
    onHealthChange: options?.onHealthChange,
  });
}

export default HealthMonitor;
