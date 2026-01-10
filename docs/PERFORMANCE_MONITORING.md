# 📈 Performance Monitoring Setup

## Overview

This document covers the performance monitoring setup for the 3A Softwares E-Commerce Platform, including logging, metrics collection, health checks, and alerting strategies.

---

## 🔧 Monitoring Stack

| Component | Tool | Purpose |
|-----------|------|---------|
| **Logging** | Winston + Morgan | Structured logging |
| **Metrics** | Prometheus | Metrics collection |
| **Visualization** | Grafana | Dashboards |
| **Tracing** | OpenTelemetry | Distributed tracing |
| **APM** | New Relic / Datadog | Application performance |
| **Health Checks** | Custom endpoints | Service availability |

---

## 📝 Logging Configuration

### Winston Setup (Backend Services)

```typescript
// src/config/logger.ts
import winston from 'winston';

const logFormat = winston.format.combine(
  winston.format.timestamp({ format: 'YYYY-MM-DD HH:mm:ss' }),
  winston.format.errors({ stack: true }),
  winston.format.json()
);

export const logger = winston.createLogger({
  level: process.env.LOG_LEVEL || 'info',
  format: logFormat,
  defaultMeta: {
    service: process.env.SERVICE_NAME,
    version: process.env.npm_package_version,
    environment: process.env.NODE_ENV,
  },
  transports: [
    // Console output
    new winston.transports.Console({
      format: winston.format.combine(
        winston.format.colorize(),
        winston.format.simple()
      ),
    }),
    // File output for errors
    new winston.transports.File({
      filename: 'logs/error.log',
      level: 'error',
      maxsize: 5242880, // 5MB
      maxFiles: 5,
    }),
    // Combined log file
    new winston.transports.File({
      filename: 'logs/combined.log',
      maxsize: 5242880,
      maxFiles: 10,
    }),
  ],
});

// Production: Add cloud logging
if (process.env.NODE_ENV === 'production') {
  // Add Loggly, CloudWatch, or other cloud transport
}
```

### Request Logging (Morgan)

```typescript
// src/middleware/requestLogger.ts
import morgan from 'morgan';
import { logger } from '@/config/logger';

// Custom morgan token for request ID
morgan.token('request-id', (req) => req.headers['x-request-id'] as string);

// Stream morgan logs to winston
const stream = {
  write: (message: string) => {
    logger.http(message.trim());
  },
};

export const requestLogger = morgan(
  ':request-id :method :url :status :response-time ms - :res[content-length]',
  { stream }
);
```

### Log Levels

| Level | Code | Use Case |
|-------|------|----------|
| `error` | 0 | Exceptions, failures |
| `warn` | 1 | Deprecations, unusual behavior |
| `info` | 2 | Normal operations, requests |
| `http` | 3 | HTTP request logging |
| `debug` | 4 | Detailed debugging info |
| `verbose` | 5 | Very detailed output |

---

## 📊 Metrics Collection

### Prometheus Setup

```typescript
// src/config/metrics.ts
import promClient from 'prom-client';

// Default metrics (CPU, memory, event loop)
promClient.collectDefaultMetrics({
  prefix: 'ecommerce_',
  labels: { service: process.env.SERVICE_NAME },
});

// Custom metrics
export const httpRequestDuration = new promClient.Histogram({
  name: 'http_request_duration_seconds',
  help: 'Duration of HTTP requests in seconds',
  labelNames: ['method', 'route', 'status_code'],
  buckets: [0.01, 0.05, 0.1, 0.5, 1, 2, 5],
});

export const httpRequestTotal = new promClient.Counter({
  name: 'http_requests_total',
  help: 'Total number of HTTP requests',
  labelNames: ['method', 'route', 'status_code'],
});

export const activeConnections = new promClient.Gauge({
  name: 'active_connections',
  help: 'Number of active connections',
  labelNames: ['service'],
});

export const databaseQueryDuration = new promClient.Histogram({
  name: 'database_query_duration_seconds',
  help: 'Duration of database queries in seconds',
  labelNames: ['operation', 'collection'],
  buckets: [0.001, 0.005, 0.01, 0.05, 0.1, 0.5, 1],
});

// Metrics endpoint
export const metricsEndpoint = async (req: Request, res: Response) => {
  res.set('Content-Type', promClient.register.contentType);
  res.end(await promClient.register.metrics());
};
```

### Metrics Middleware

```typescript
// src/middleware/metricsMiddleware.ts
import { httpRequestDuration, httpRequestTotal } from '@/config/metrics';

export const metricsMiddleware = (req: Request, res: Response, next: NextFunction) => {
  const start = Date.now();
  
  res.on('finish', () => {
    const duration = (Date.now() - start) / 1000;
    const route = req.route?.path || req.path;
    const labels = {
      method: req.method,
      route,
      status_code: res.statusCode.toString(),
    };
    
    httpRequestDuration.observe(labels, duration);
    httpRequestTotal.inc(labels);
  });
  
  next();
};
```

### Key Metrics to Track

| Category | Metric | Description |
|----------|--------|-------------|
| **Latency** | Request duration | P50, P90, P99 response times |
| **Traffic** | Requests per second | RPS by endpoint |
| **Errors** | Error rate | 4xx, 5xx responses |
| **Saturation** | CPU/Memory usage | Resource utilization |
| **Database** | Query duration | Slow query detection |
| **Cache** | Hit/Miss ratio | Redis cache efficiency |

---

## 🏥 Health Checks

### Health Endpoint Implementation

```typescript
// src/routes/health.ts
import { Router } from 'express';
import mongoose from 'mongoose';
import { redisClient } from '@/config/redis';
import { logger } from '@/config/logger';

const router = Router();

interface HealthStatus {
  status: 'healthy' | 'degraded' | 'unhealthy';
  uptime: number;
  timestamp: string;
  checks: {
    [key: string]: {
      status: 'healthy' | 'unhealthy';
      responseTime?: number;
      error?: string;
    };
  };
}

// Liveness probe - is the service running?
router.get('/health/live', (req, res) => {
  res.status(200).json({ status: 'alive' });
});

// Readiness probe - is the service ready to accept traffic?
router.get('/health/ready', async (req, res) => {
  const health: HealthStatus = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // MongoDB check
  try {
    const start = Date.now();
    const mongoState = mongoose.connection.readyState;
    health.checks.mongodb = {
      status: mongoState === 1 ? 'healthy' : 'unhealthy',
      responseTime: Date.now() - start,
    };
    if (mongoState !== 1) health.status = 'unhealthy';
  } catch (error) {
    health.checks.mongodb = { status: 'unhealthy', error: error.message };
    health.status = 'unhealthy';
  }

  // Redis check
  try {
    const start = Date.now();
    await redisClient.ping();
    health.checks.redis = {
      status: 'healthy',
      responseTime: Date.now() - start,
    };
  } catch (error) {
    health.checks.redis = { status: 'unhealthy', error: error.message };
    health.status = 'degraded';
  }

  const statusCode = health.status === 'healthy' ? 200 : 
                     health.status === 'degraded' ? 200 : 503;
  res.status(statusCode).json(health);
});

// Detailed health check
router.get('/health', async (req, res) => {
  const health: HealthStatus = {
    status: 'healthy',
    uptime: process.uptime(),
    timestamp: new Date().toISOString(),
    checks: {},
  };

  // All dependency checks
  await Promise.all([
    checkMongoDB(health),
    checkRedis(health),
    checkExternalAPIs(health),
  ]);

  const hasUnhealthy = Object.values(health.checks).some(c => c.status === 'unhealthy');
  health.status = hasUnhealthy ? 'unhealthy' : 'healthy';

  res.status(health.status === 'healthy' ? 200 : 503).json(health);
});

export default router;
```

### Kubernetes Health Probes

```yaml
# k8s/deployment.yaml
spec:
  containers:
    - name: api
      livenessProbe:
        httpGet:
          path: /health/live
          port: 3000
        initialDelaySeconds: 30
        periodSeconds: 10
        timeoutSeconds: 5
        failureThreshold: 3
      readinessProbe:
        httpGet:
          path: /health/ready
          port: 3000
        initialDelaySeconds: 5
        periodSeconds: 5
        timeoutSeconds: 3
        failureThreshold: 3
      startupProbe:
        httpGet:
          path: /health/live
          port: 3000
        initialDelaySeconds: 10
        periodSeconds: 10
        failureThreshold: 30
```

### Health Check Scripts

```powershell
# scripts/health-check.ps1
$services = @(
    @{Name="Auth Service"; Url="http://localhost:3011/health"},
    @{Name="Category Service"; Url="http://localhost:3012/health"},
    @{Name="Coupon Service"; Url="http://localhost:3013/health"},
    @{Name="Product Service"; Url="http://localhost:3014/health"},
    @{Name="Order Service"; Url="http://localhost:3015/health"},
    @{Name="GraphQL Gateway"; Url="http://localhost:4000/health"}
)

foreach ($service in $services) {
    try {
        $response = Invoke-RestMethod -Uri $service.Url -TimeoutSec 5
        if ($response.status -eq "healthy") {
            Write-Host "[OK] $($service.Name) is healthy" -ForegroundColor Green
        } else {
            Write-Host "[WARN] $($service.Name) is $($response.status)" -ForegroundColor Yellow
        }
    } catch {
        Write-Host "[FAIL] $($service.Name) is unreachable" -ForegroundColor Red
    }
}
```

---

## 📡 Distributed Tracing

### OpenTelemetry Setup

```typescript
// src/config/tracing.ts
import { NodeSDK } from '@opentelemetry/sdk-node';
import { getNodeAutoInstrumentations } from '@opentelemetry/auto-instrumentations-node';
import { OTLPTraceExporter } from '@opentelemetry/exporter-trace-otlp-http';
import { Resource } from '@opentelemetry/resources';
import { SemanticResourceAttributes } from '@opentelemetry/semantic-conventions';

const sdk = new NodeSDK({
  resource: new Resource({
    [SemanticResourceAttributes.SERVICE_NAME]: process.env.SERVICE_NAME,
    [SemanticResourceAttributes.SERVICE_VERSION]: process.env.npm_package_version,
    [SemanticResourceAttributes.DEPLOYMENT_ENVIRONMENT]: process.env.NODE_ENV,
  }),
  traceExporter: new OTLPTraceExporter({
    url: process.env.OTEL_EXPORTER_OTLP_ENDPOINT,
  }),
  instrumentations: [
    getNodeAutoInstrumentations({
      '@opentelemetry/instrumentation-http': {
        ignoreIncomingPaths: ['/health', '/metrics'],
      },
      '@opentelemetry/instrumentation-express': {},
      '@opentelemetry/instrumentation-mongodb': {},
      '@opentelemetry/instrumentation-redis': {},
    }),
  ],
});

sdk.start();

process.on('SIGTERM', () => {
  sdk.shutdown()
    .then(() => console.log('Tracing terminated'))
    .catch((error) => console.log('Error terminating tracing', error))
    .finally(() => process.exit(0));
});
```

### Manual Span Creation

```typescript
import { trace, SpanStatusCode } from '@opentelemetry/api';

const tracer = trace.getTracer('product-service');

export async function processOrder(orderId: string) {
  return tracer.startActiveSpan('processOrder', async (span) => {
    try {
      span.setAttribute('order.id', orderId);
      
      // Nested span for inventory check
      await tracer.startActiveSpan('checkInventory', async (inventorySpan) => {
        const available = await inventoryService.check(orderId);
        inventorySpan.setAttribute('inventory.available', available);
        inventorySpan.end();
      });
      
      // Nested span for payment
      await tracer.startActiveSpan('processPayment', async (paymentSpan) => {
        const paymentResult = await paymentService.charge(orderId);
        paymentSpan.setAttribute('payment.success', paymentResult.success);
        paymentSpan.end();
      });
      
      span.setStatus({ code: SpanStatusCode.OK });
    } catch (error) {
      span.setStatus({ code: SpanStatusCode.ERROR, message: error.message });
      span.recordException(error);
      throw error;
    } finally {
      span.end();
    }
  });
}
```

---

## 📊 Grafana Dashboards

### Service Overview Dashboard

```json
{
  "dashboard": {
    "title": "E-Commerce Platform Overview",
    "panels": [
      {
        "title": "Request Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total[5m])) by (service)",
            "legendFormat": "{{service}}"
          }
        ]
      },
      {
        "title": "Response Time (P99)",
        "type": "graph",
        "targets": [
          {
            "expr": "histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m]))",
            "legendFormat": "P99"
          }
        ]
      },
      {
        "title": "Error Rate",
        "type": "graph",
        "targets": [
          {
            "expr": "sum(rate(http_requests_total{status_code=~\"5..\"}[5m])) / sum(rate(http_requests_total[5m]))",
            "legendFormat": "Error %"
          }
        ]
      },
      {
        "title": "Active Connections",
        "type": "gauge",
        "targets": [
          {
            "expr": "sum(active_connections)",
            "legendFormat": "Connections"
          }
        ]
      }
    ]
  }
}
```

### Key Dashboard Panels

| Panel | Query | Purpose |
|-------|-------|---------|
| RPS | `sum(rate(http_requests_total[5m]))` | Request throughput |
| Latency P50 | `histogram_quantile(0.5, rate(http_request_duration_seconds_bucket[5m]))` | Median response time |
| Error Rate | `sum(rate(http_requests_total{status_code=~"5.."}[5m]))` | 5xx errors |
| Memory | `process_resident_memory_bytes` | Memory usage |
| CPU | `rate(process_cpu_seconds_total[5m])` | CPU utilization |

---

## 🚨 Alerting

### Alert Rules (Prometheus)

```yaml
# prometheus/alerts.yml
groups:
  - name: ecommerce-alerts
    rules:
      - alert: HighErrorRate
        expr: sum(rate(http_requests_total{status_code=~"5.."}[5m])) / sum(rate(http_requests_total[5m])) > 0.05
        for: 5m
        labels:
          severity: critical
        annotations:
          summary: High error rate detected
          description: Error rate is above 5% for the last 5 minutes

      - alert: HighLatency
        expr: histogram_quantile(0.99, rate(http_request_duration_seconds_bucket[5m])) > 2
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: High latency detected
          description: P99 latency is above 2 seconds

      - alert: ServiceDown
        expr: up == 0
        for: 1m
        labels:
          severity: critical
        annotations:
          summary: Service is down
          description: "{{ $labels.instance }} is not responding"

      - alert: HighMemoryUsage
        expr: process_resident_memory_bytes / 1024 / 1024 > 500
        for: 10m
        labels:
          severity: warning
        annotations:
          summary: High memory usage
          description: Memory usage is above 500MB

      - alert: DatabaseSlowQueries
        expr: histogram_quantile(0.95, rate(database_query_duration_seconds_bucket[5m])) > 1
        for: 5m
        labels:
          severity: warning
        annotations:
          summary: Slow database queries detected
          description: P95 query duration is above 1 second
```

### PagerDuty Integration

```typescript
// src/config/alerting.ts
import { PagerDuty } from 'pagerduty';

const pagerduty = new PagerDuty({
  apiKey: process.env.PAGERDUTY_API_KEY,
});

export async function sendAlert(
  severity: 'critical' | 'warning' | 'info',
  title: string,
  details: Record<string, any>
) {
  await pagerduty.events.sendEvent({
    routing_key: process.env.PAGERDUTY_ROUTING_KEY,
    event_action: 'trigger',
    payload: {
      summary: title,
      severity,
      source: process.env.SERVICE_NAME,
      custom_details: details,
    },
  });
}
```

---

## 🔄 APM Integration

### New Relic Setup

```typescript
// newrelic.ts
exports.config = {
  app_name: ['3A E-Commerce Platform'],
  license_key: process.env.NEW_RELIC_LICENSE_KEY,
  distributed_tracing: {
    enabled: true,
  },
  logging: {
    level: 'info',
  },
  allow_all_headers: true,
  attributes: {
    exclude: [
      'request.headers.cookie',
      'request.headers.authorization',
    ],
  },
};
```

### Datadog Setup

```typescript
// src/config/datadog.ts
import tracer from 'dd-trace';

tracer.init({
  service: process.env.SERVICE_NAME,
  env: process.env.NODE_ENV,
  version: process.env.npm_package_version,
  logInjection: true,
  runtimeMetrics: true,
  profiling: true,
});

export default tracer;
```

---

## 📱 Frontend Performance

### Web Vitals Monitoring

```typescript
// src/utils/webVitals.ts
import { getCLS, getFID, getFCP, getLCP, getTTFB } from 'web-vitals';

function sendToAnalytics(metric: Metric) {
  fetch('/api/metrics', {
    method: 'POST',
    body: JSON.stringify({
      name: metric.name,
      value: metric.value,
      id: metric.id,
      delta: metric.delta,
    }),
    headers: { 'Content-Type': 'application/json' },
  });
}

export function initWebVitals() {
  getCLS(sendToAnalytics);
  getFID(sendToAnalytics);
  getFCP(sendToAnalytics);
  getLCP(sendToAnalytics);
  getTTFB(sendToAnalytics);
}
```

### Performance Budgets

| Metric | Budget | Target |
|--------|--------|--------|
| LCP (Largest Contentful Paint) | < 2.5s | < 1.5s |
| FID (First Input Delay) | < 100ms | < 50ms |
| CLS (Cumulative Layout Shift) | < 0.1 | < 0.05 |
| TTI (Time to Interactive) | < 3.8s | < 2.5s |
| Bundle Size | < 200KB | < 150KB |

---

## 📚 Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [CI/CD Pipeline](CI_CD_PIPELINE.md)
- [Docker Guide](DOCKER_GUIDE.md)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
