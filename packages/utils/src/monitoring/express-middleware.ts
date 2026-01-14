/**
 * Express Middleware for Splunk On-Call Integration
 * Provides automatic error alerting and request monitoring
 */

import { Request, Response, NextFunction, RequestHandler, ErrorRequestHandler } from 'express';
import { AlertManager, createAlertManager } from './alert-manager';

export interface SplunkOnCallMiddlewareConfig {
  serviceName: string;
  alertOnErrors?: boolean;
  alertOnSlowRequests?: boolean;
  slowRequestThresholdMs?: number;
  errorRateThresholdPercent?: number;
  errorRateWindowMs?: number;
  excludePaths?: string[];
  excludeStatusCodes?: number[];
}

interface RequestMetrics {
  total: number;
  errors: number;
  windowStart: number;
}

/**
 * Create Splunk On-Call middleware for Express
 */
export function createSplunkOnCallMiddleware(config: SplunkOnCallMiddlewareConfig): {
  requestTracker: RequestHandler;
  errorHandler: ErrorRequestHandler;
  getMetrics: () => { requestsPerMinute: number; errorRate: number };
} {
  const alertManager = createAlertManager(config.serviceName);
  const metrics: RequestMetrics = {
    total: 0,
    errors: 0,
    windowStart: Date.now(),
  };

  const excludePaths = new Set(config.excludePaths || ['/health', '/ready', '/metrics']);
  const excludeStatusCodes = new Set(config.excludeStatusCodes || [404]);
  const slowThreshold = config.slowRequestThresholdMs || 5000;
  const errorRateThreshold = (config.errorRateThresholdPercent || 5) / 100;
  const windowMs = config.errorRateWindowMs || 60000;

  let lastErrorRateAlert = 0;

  /**
   * Reset metrics window if needed
   */
  function checkWindow(): void {
    const now = Date.now();
    if (now - metrics.windowStart > windowMs) {
      metrics.total = 0;
      metrics.errors = 0;
      metrics.windowStart = now;
    }
  }

  /**
   * Check and alert on error rate
   */
  async function checkErrorRate(): Promise<void> {
    if (metrics.total < 10) return; // Need minimum sample size

    const errorRate = metrics.errors / metrics.total;
    const now = Date.now();

    // Don't alert more than once per window
    if (errorRate > errorRateThreshold && now - lastErrorRateAlert > windowMs) {
      lastErrorRateAlert = now;
      await alertManager.highErrorRate(errorRate, errorRateThreshold, `${windowMs / 1000}s`);
    }
  }

  /**
   * Request tracking middleware
   */
  const requestTracker: RequestHandler = (req: Request, res: Response, next: NextFunction) => {
    if (excludePaths.has(req.path)) {
      return next();
    }

    const startTime = Date.now();

    // Track response
    res.on('finish', async () => {
      const duration = Date.now() - startTime;

      checkWindow();
      metrics.total++;

      // Track errors
      if (res.statusCode >= 500 && !excludeStatusCodes.has(res.statusCode)) {
        metrics.errors++;
        await checkErrorRate();
      }

      // Alert on slow requests
      if (config.alertOnSlowRequests !== false && duration > slowThreshold) {
        await alertManager.highLatency(`${req.method} ${req.path}`, duration, slowThreshold);
      }
    });

    next();
  };

  /**
   * Error handling middleware
   */
  const errorHandler: ErrorRequestHandler = async (
    err: Error,
    req: Request,
    res: Response,
    next: NextFunction
  ) => {
    if (excludePaths.has(req.path)) {
      return next(err);
    }

    // Track error in metrics
    checkWindow();
    metrics.errors++;

    // Send alert for unhandled errors
    if (config.alertOnErrors !== false) {
      await alertManager.critical(`Unhandled error: ${err.message}`, {
        entityId: `${config.serviceName}-unhandled-error`,
        displayName: `${config.serviceName} Error`,
        details: {
          error: err.message,
          stack: err.stack,
          path: req.path,
          method: req.method,
          query: req.query,
          ip: req.ip,
          userAgent: req.get('user-agent'),
        },
      });
    }

    next(err);
  };

  /**
   * Get current metrics
   */
  const getMetrics = () => {
    checkWindow();
    const windowSeconds = (Date.now() - metrics.windowStart) / 1000;
    return {
      requestsPerMinute: windowSeconds > 0 ? (metrics.total / windowSeconds) * 60 : 0,
      errorRate: metrics.total > 0 ? metrics.errors / metrics.total : 0,
    };
  };

  return {
    requestTracker,
    errorHandler,
    getMetrics,
  };
}

/**
 * Create health check endpoint handler
 */
export function createHealthEndpoint(
  serviceName: string,
  checks: Record<string, () => Promise<boolean>>
): RequestHandler {
  return async (req: Request, res: Response) => {
    const results: Record<string, { healthy: boolean; latencyMs: number }> = {};
    let allHealthy = true;

    for (const [name, check] of Object.entries(checks)) {
      const startTime = Date.now();
      try {
        const healthy = await check();
        results[name] = {
          healthy,
          latencyMs: Date.now() - startTime,
        };
        if (!healthy) allHealthy = false;
      } catch (error) {
        results[name] = {
          healthy: false,
          latencyMs: Date.now() - startTime,
        };
        allHealthy = false;
      }
    }

    res.status(allHealthy ? 200 : 503).json({
      service: serviceName,
      status: allHealthy ? 'healthy' : 'unhealthy',
      timestamp: new Date().toISOString(),
      checks: results,
    });
  };
}

export default createSplunkOnCallMiddleware;
