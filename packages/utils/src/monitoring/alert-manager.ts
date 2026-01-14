/**
 * Alert Manager
 * Centralized alert management for e-commerce microservices
 */

import { SplunkOnCallClient, getSplunkOnCallClient } from './splunk-oncall';

export type AlertSeverity = 'critical' | 'warning' | 'info';

export interface AlertContext {
  service: string;
  environment: string;
  hostname?: string;
  version?: string;
  correlationId?: string;
}

export interface AlertOptions {
  entityId?: string;
  displayName?: string;
  details?: Record<string, any>;
  alertUrl?: string;
}

/**
 * Alert Manager for microservices
 * Provides a unified interface for sending alerts across different channels
 */
export class AlertManager {
  private splunkOnCall: SplunkOnCallClient;
  private context: AlertContext;

  constructor(context: AlertContext, splunkOnCall?: SplunkOnCallClient) {
    this.context = context;
    this.splunkOnCall = splunkOnCall || getSplunkOnCallClient();
  }

  private buildEntityId(entityId?: string): string {
    return entityId || `${this.context.service}-${this.context.environment}`;
  }

  private buildDisplayName(displayName?: string): string {
    return displayName || `${this.context.service} (${this.context.environment})`;
  }

  private enrichDetails(details?: Record<string, any>): Record<string, any> {
    return {
      service: this.context.service,
      environment: this.context.environment,
      hostname: this.context.hostname || process.env.HOSTNAME,
      version: this.context.version || process.env.APP_VERSION,
      timestamp: new Date().toISOString(),
      ...details,
    };
  }

  /**
   * Send a critical alert - for outages and severe issues
   */
  async critical(message: string, options: AlertOptions = {}): Promise<void> {
    try {
      await this.splunkOnCall.critical(
        this.buildEntityId(options.entityId),
        this.buildDisplayName(options.displayName),
        message,
        this.enrichDetails(options.details)
      );
      console.log(`[CRITICAL ALERT] ${this.context.service}: ${message}`);
    } catch (error) {
      console.error('Failed to send critical alert:', error);
    }
  }

  /**
   * Send a warning alert - for degraded performance or potential issues
   */
  async warning(message: string, options: AlertOptions = {}): Promise<void> {
    try {
      await this.splunkOnCall.warning(
        this.buildEntityId(options.entityId),
        this.buildDisplayName(options.displayName),
        message,
        this.enrichDetails(options.details)
      );
      console.log(`[WARNING ALERT] ${this.context.service}: ${message}`);
    } catch (error) {
      console.error('Failed to send warning alert:', error);
    }
  }

  /**
   * Send an info alert - for notifications and status updates
   */
  async info(message: string, options: AlertOptions = {}): Promise<void> {
    try {
      await this.splunkOnCall.info(
        this.buildEntityId(options.entityId),
        this.buildDisplayName(options.displayName),
        message,
        this.enrichDetails(options.details)
      );
      console.log(`[INFO ALERT] ${this.context.service}: ${message}`);
    } catch (error) {
      console.error('Failed to send info alert:', error);
    }
  }

  /**
   * Send a recovery alert - resolves an existing incident
   */
  async recovery(message: string, options: AlertOptions = {}): Promise<void> {
    try {
      await this.splunkOnCall.recovery(
        this.buildEntityId(options.entityId),
        this.buildDisplayName(options.displayName),
        message,
        this.enrichDetails(options.details)
      );
      console.log(`[RECOVERY] ${this.context.service}: ${message}`);
    } catch (error) {
      console.error('Failed to send recovery alert:', error);
    }
  }

  /**
   * Alert based on severity level
   */
  async alert(severity: AlertSeverity, message: string, options: AlertOptions = {}): Promise<void> {
    switch (severity) {
      case 'critical':
        return this.critical(message, options);
      case 'warning':
        return this.warning(message, options);
      case 'info':
        return this.info(message, options);
    }
  }

  /**
   * Database connection alert
   */
  async databaseDown(dbName: string, error: Error): Promise<void> {
    await this.critical(`Database connection failed: ${dbName}`, {
      entityId: `${this.context.service}-db-${dbName}`,
      displayName: `${this.context.service} Database`,
      details: {
        database: dbName,
        error: error.message,
        stack: error.stack,
      },
    });
  }

  /**
   * Database recovery alert
   */
  async databaseRecovered(dbName: string): Promise<void> {
    await this.recovery(`Database connection restored: ${dbName}`, {
      entityId: `${this.context.service}-db-${dbName}`,
      displayName: `${this.context.service} Database`,
      details: { database: dbName },
    });
  }

  /**
   * High latency alert
   */
  async highLatency(endpoint: string, latencyMs: number, thresholdMs: number): Promise<void> {
    await this.warning(`High latency detected on ${endpoint}`, {
      entityId: `${this.context.service}-latency-${endpoint.replace(/\//g, '-')}`,
      displayName: `${this.context.service} Latency`,
      details: {
        endpoint,
        latencyMs,
        thresholdMs,
        percentOver: (((latencyMs - thresholdMs) / thresholdMs) * 100).toFixed(2) + '%',
      },
    });
  }

  /**
   * Error rate alert
   */
  async highErrorRate(errorRate: number, thresholdRate: number, timeWindow: string): Promise<void> {
    const severity: AlertSeverity = errorRate > thresholdRate * 2 ? 'critical' : 'warning';
    await this.alert(severity, `High error rate: ${(errorRate * 100).toFixed(2)}%`, {
      entityId: `${this.context.service}-error-rate`,
      displayName: `${this.context.service} Error Rate`,
      details: {
        errorRate: `${(errorRate * 100).toFixed(2)}%`,
        thresholdRate: `${(thresholdRate * 100).toFixed(2)}%`,
        timeWindow,
      },
    });
  }

  /**
   * Memory usage alert
   */
  async highMemoryUsage(usagePercent: number, thresholdPercent: number): Promise<void> {
    const severity: AlertSeverity = usagePercent > 95 ? 'critical' : 'warning';
    await this.alert(severity, `High memory usage: ${usagePercent.toFixed(1)}%`, {
      entityId: `${this.context.service}-memory`,
      displayName: `${this.context.service} Memory`,
      details: {
        usagePercent: `${usagePercent.toFixed(1)}%`,
        thresholdPercent: `${thresholdPercent.toFixed(1)}%`,
      },
    });
  }

  /**
   * Service health check failed
   */
  async healthCheckFailed(checkName: string, error: Error): Promise<void> {
    await this.critical(`Health check failed: ${checkName}`, {
      entityId: `${this.context.service}-health-${checkName}`,
      displayName: `${this.context.service} Health`,
      details: {
        checkName,
        error: error.message,
      },
    });
  }

  /**
   * Service health check recovered
   */
  async healthCheckRecovered(checkName: string): Promise<void> {
    await this.recovery(`Health check passed: ${checkName}`, {
      entityId: `${this.context.service}-health-${checkName}`,
      displayName: `${this.context.service} Health`,
      details: { checkName },
    });
  }
}

/**
 * Create an AlertManager for a specific service
 */
export function createAlertManager(serviceName: string): AlertManager {
  return new AlertManager({
    service: serviceName,
    environment: process.env.NODE_ENV || 'development',
    hostname: process.env.HOSTNAME,
    version: process.env.APP_VERSION,
  });
}

export default AlertManager;
