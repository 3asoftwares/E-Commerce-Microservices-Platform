# 🔒 Security Best Practices

## Overview

This document outlines the security measures and best practices implemented across the 3A Softwares E-Commerce Platform. Security is a critical concern for any e-commerce application handling user data and payment information.

---

## 🎯 Security Principles

| Principle | Description |
|-----------|-------------|
| **Defense in Depth** | Multiple layers of security controls |
| **Least Privilege** | Minimal permissions for each component |
| **Fail Secure** | Default to secure state on failures |
| **Security by Design** | Built-in security from the start |
| **Zero Trust** | Verify every request, trust nothing |

---

## 🔐 Authentication

### JWT Implementation

```typescript
// src/utils/jwt.ts
import jwt from 'jsonwebtoken';
import { TokenPayload, TokenPair } from '@/types/auth';

const ACCESS_TOKEN_SECRET = process.env.JWT_ACCESS_SECRET!;
const REFRESH_TOKEN_SECRET = process.env.JWT_REFRESH_SECRET!;

// Token expiration times
const ACCESS_TOKEN_EXPIRY = '15m';  // Short-lived
const REFRESH_TOKEN_EXPIRY = '7d';  // Longer-lived

export function generateTokens(payload: TokenPayload): TokenPair {
  const accessToken = jwt.sign(payload, ACCESS_TOKEN_SECRET, {
    expiresIn: ACCESS_TOKEN_EXPIRY,
    algorithm: 'HS256',
    issuer: '3asoftwares.com',
    audience: 'ecommerce-api',
  });

  const refreshToken = jwt.sign(
    { userId: payload.userId, tokenVersion: payload.tokenVersion },
    REFRESH_TOKEN_SECRET,
    {
      expiresIn: REFRESH_TOKEN_EXPIRY,
      algorithm: 'HS256',
    }
  );

  return { accessToken, refreshToken };
}

export function verifyAccessToken(token: string): TokenPayload {
  try {
    return jwt.verify(token, ACCESS_TOKEN_SECRET, {
      algorithms: ['HS256'],
      issuer: '3asoftwares.com',
      audience: 'ecommerce-api',
    }) as TokenPayload;
  } catch (error) {
    throw new UnauthorizedError('Invalid or expired token');
  }
}

export function verifyRefreshToken(token: string): { userId: string; tokenVersion: number } {
  return jwt.verify(token, REFRESH_TOKEN_SECRET) as any;
}
```

### Authentication Middleware

```typescript
// src/middleware/auth.ts
import { Request, Response, NextFunction } from 'express';
import { verifyAccessToken } from '@/utils/jwt';
import { UnauthorizedError } from '@/errors/UnauthorizedError';

export function authenticate(req: Request, res: Response, next: NextFunction) {
  const authHeader = req.headers.authorization;

  if (!authHeader?.startsWith('Bearer ')) {
    throw new UnauthorizedError('No token provided');
  }

  const token = authHeader.slice(7);

  try {
    const payload = verifyAccessToken(token);
    req.user = payload;
    next();
  } catch (error) {
    throw new UnauthorizedError('Invalid token');
  }
}

export function authorize(...roles: string[]) {
  return (req: Request, res: Response, next: NextFunction) => {
    if (!req.user) {
      throw new UnauthorizedError('Authentication required');
    }

    if (roles.length && !roles.includes(req.user.role)) {
      throw new ForbiddenError('Insufficient permissions');
    }

    next();
  };
}
```

### Token Refresh Strategy

```typescript
// src/controllers/authController.ts
export async function refreshToken(req: Request, res: Response) {
  const { refreshToken } = req.cookies;

  if (!refreshToken) {
    throw new UnauthorizedError('Refresh token required');
  }

  try {
    const payload = verifyRefreshToken(refreshToken);
    const user = await User.findById(payload.userId);

    // Check if token version matches (invalidated on password change/logout)
    if (!user || user.tokenVersion !== payload.tokenVersion) {
      throw new UnauthorizedError('Token has been revoked');
    }

    const tokens = generateTokens({
      userId: user.id,
      email: user.email,
      role: user.role,
      tokenVersion: user.tokenVersion,
    });

    // Set HTTP-only cookie for refresh token
    res.cookie('refreshToken', tokens.refreshToken, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      sameSite: 'strict',
      maxAge: 7 * 24 * 60 * 60 * 1000, // 7 days
    });

    res.json({ accessToken: tokens.accessToken });
  } catch (error) {
    throw new UnauthorizedError('Invalid refresh token');
  }
}
```

---

## 🔑 Password Security

### Password Hashing (bcrypt)

```typescript
// src/utils/password.ts
import bcrypt from 'bcrypt';

const SALT_ROUNDS = 12; // Increase for stronger security (slower)

export async function hashPassword(password: string): Promise<string> {
  return bcrypt.hash(password, SALT_ROUNDS);
}

export async function verifyPassword(
  password: string,
  hashedPassword: string
): Promise<boolean> {
  return bcrypt.compare(password, hashedPassword);
}
```

### Password Validation

```typescript
// src/validators/passwordValidator.ts
import Joi from 'joi';

export const passwordSchema = Joi.string()
  .min(8)
  .max(128)
  .pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]/)
  .messages({
    'string.min': 'Password must be at least 8 characters',
    'string.max': 'Password must not exceed 128 characters',
    'string.pattern.base': 'Password must include uppercase, lowercase, number, and special character',
  });

// Password strength requirements
export const PASSWORD_REQUIREMENTS = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  specialChars: '@$!%*?&',
};
```

---

## 🌐 CORS Configuration

### Express CORS Setup

```typescript
// src/config/cors.ts
import cors from 'cors';
import { ALLOWED_ORIGINS } from '@3asoftwares/utils';

const corsOptions: cors.CorsOptions = {
  origin: (origin, callback) => {
    // Allow requests with no origin (mobile apps, Postman)
    if (!origin) {
      return callback(null, true);
    }

    if (ALLOWED_ORIGINS.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true, // Allow cookies
  methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
  allowedHeaders: [
    'Content-Type',
    'Authorization',
    'X-Request-ID',
    'X-Correlation-ID',
  ],
  exposedHeaders: ['X-Request-ID'],
  maxAge: 86400, // Cache preflight for 24 hours
};

export default cors(corsOptions);
```

### Allowed Origins Configuration

```typescript
// packages/utils/src/constants/index.ts
export const DEFAULT_CORS_ORIGINS = [
  // Production
  'https://your-domain.com',
  'https://admin.your-domain.com',
  'https://seller.your-domain.com',
  
  // Development
  'http://localhost:3000',
  'http://localhost:3001',
  'http://localhost:3002',
  'http://localhost:3003',
  'http://localhost:8080',
  'http://localhost:8081',
];
```

---

## 🛡️ Security Headers

### Helmet Configuration

```typescript
// src/middleware/security.ts
import helmet from 'helmet';

export const securityHeaders = helmet({
  // Content Security Policy
  contentSecurityPolicy: {
    directives: {
      defaultSrc: ["'self'"],
      scriptSrc: ["'self'", "'unsafe-inline'"],
      styleSrc: ["'self'", "'unsafe-inline'", 'fonts.googleapis.com'],
      fontSrc: ["'self'", 'fonts.gstatic.com'],
      imgSrc: ["'self'", 'data:', 'https:', 'blob:'],
      connectSrc: ["'self'", 'wss:', 'https:'],
      frameSrc: ["'none'"],
      objectSrc: ["'none'"],
      upgradeInsecureRequests: [],
    },
  },
  
  // HSTS - Force HTTPS
  strictTransportSecurity: {
    maxAge: 31536000, // 1 year
    includeSubDomains: true,
    preload: true,
  },
  
  // Prevent clickjacking
  frameguard: { action: 'deny' },
  
  // Prevent MIME sniffing
  noSniff: true,
  
  // XSS Protection
  xssFilter: true,
  
  // Referrer Policy
  referrerPolicy: { policy: 'strict-origin-when-cross-origin' },
  
  // Permissions Policy
  permittedCrossDomainPolicies: { permittedPolicies: 'none' },
});
```

### Security Headers Summary

| Header | Value | Purpose |
|--------|-------|---------|
| `Strict-Transport-Security` | `max-age=31536000; includeSubDomains; preload` | Force HTTPS |
| `X-Content-Type-Options` | `nosniff` | Prevent MIME sniffing |
| `X-Frame-Options` | `DENY` | Prevent clickjacking |
| `X-XSS-Protection` | `1; mode=block` | XSS protection |
| `Referrer-Policy` | `strict-origin-when-cross-origin` | Control referrer info |
| `Content-Security-Policy` | (see above) | Prevent XSS, injection |

---

## ⚡ Rate Limiting

### Express Rate Limiter

```typescript
// src/middleware/rateLimiter.ts
import rateLimit from 'express-rate-limit';
import RedisStore from 'rate-limit-redis';
import { redisClient } from '@/config/redis';

// General API rate limit
export const apiLimiter = rateLimit({
  windowMs: 15 * 60 * 1000, // 15 minutes
  max: 100, // 100 requests per window
  standardHeaders: true,
  legacyHeaders: false,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  message: {
    error: 'Too many requests',
    message: 'Please try again later',
    retryAfter: 15 * 60,
  },
});

// Stricter limit for auth endpoints
export const authLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 5, // 5 attempts per hour
  skipSuccessfulRequests: true,
  store: new RedisStore({
    sendCommand: (...args: string[]) => redisClient.sendCommand(args),
  }),
  message: {
    error: 'Too many login attempts',
    message: 'Account temporarily locked. Try again later.',
  },
});

// Rate limit for sensitive operations
export const sensitiveOperationLimiter = rateLimit({
  windowMs: 60 * 60 * 1000, // 1 hour
  max: 3,
  message: {
    error: 'Too many attempts',
    message: 'Please wait before trying again',
  },
});
```

### Rate Limit Tiers

| Endpoint Type | Window | Max Requests |
|---------------|--------|--------------|
| Public API | 15 min | 100 |
| Authenticated API | 15 min | 200 |
| Login/Register | 1 hour | 5 |
| Password Reset | 1 hour | 3 |
| Payment Operations | 1 hour | 10 |

---

## ✅ Input Validation

### Joi Validation Middleware

```typescript
// src/middleware/validate.ts
import { Request, Response, NextFunction } from 'express';
import Joi from 'joi';
import { ValidationError } from '@/errors/ValidationError';

export function validate(schema: {
  body?: Joi.ObjectSchema;
  query?: Joi.ObjectSchema;
  params?: Joi.ObjectSchema;
}) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    if (schema.body) {
      const { error } = schema.body.validate(req.body, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      }
    }

    if (schema.query) {
      const { error } = schema.query.validate(req.query, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      }
    }

    if (schema.params) {
      const { error } = schema.params.validate(req.params, { abortEarly: false });
      if (error) {
        errors.push(...error.details.map(d => d.message));
      }
    }

    if (errors.length > 0) {
      throw new ValidationError('Validation failed', errors);
    }

    next();
  };
}
```

### Validation Schemas

```typescript
// src/validators/userValidator.ts
import Joi from 'joi';

export const registerSchema = {
  body: Joi.object({
    email: Joi.string().email().required().max(255),
    password: Joi.string().min(8).max(128).required(),
    name: Joi.string().min(2).max(100).required().trim(),
    phone: Joi.string().pattern(/^\+?[1-9]\d{1,14}$/).optional(),
  }),
};

export const productSchema = {
  body: Joi.object({
    name: Joi.string().min(3).max(200).required().trim(),
    description: Joi.string().max(5000).optional(),
    price: Joi.number().positive().precision(2).required(),
    categoryId: Joi.string().hex().length(24).required(),
    inventory: Joi.number().integer().min(0).default(0),
    images: Joi.array().items(Joi.string().uri()).max(10),
  }),
};
```

### Sanitization

```typescript
// src/utils/sanitize.ts
import sanitizeHtml from 'sanitize-html';
import xss from 'xss';

// Remove HTML tags completely
export function stripHtml(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: [],
    allowedAttributes: {},
  });
}

// Allow safe HTML (for rich text fields)
export function sanitizeRichText(input: string): string {
  return sanitizeHtml(input, {
    allowedTags: ['b', 'i', 'em', 'strong', 'p', 'br', 'ul', 'ol', 'li'],
    allowedAttributes: {},
  });
}

// XSS prevention
export function preventXss(input: string): string {
  return xss(input);
}
```

---

## 🛡️ SQL/NoSQL Injection Prevention

### MongoDB Query Safety

```typescript
// NEVER DO THIS - Vulnerable to injection
const user = await User.findOne({ email: req.body.email });

// SAFE - Use parameterized queries
const user = await User.findOne({
  email: { $eq: String(req.body.email) },
});

// SAFE - Validate input types
const safeEmail = typeof req.body.email === 'string' ? req.body.email : '';
const user = await User.findOne({ email: safeEmail });
```

### Query Sanitization Middleware

```typescript
// src/middleware/mongoSanitize.ts
import mongoSanitize from 'express-mongo-sanitize';

// Remove $ and . from request body/query
export const sanitizeInput = mongoSanitize({
  replaceWith: '_',
  onSanitize: ({ req, key }) => {
    console.warn(`Sanitized key: ${key}`);
  },
});
```

---

## 🔐 Secrets Management

### Environment Variables

```bash
# .env.local (NEVER commit this file)

# JWT Secrets (use strong random values)
JWT_ACCESS_SECRET=your-super-secret-access-key-min-32-chars
JWT_REFRESH_SECRET=your-super-secret-refresh-key-min-32-chars

# Database
MONGODB_URL=mongodb://localhost:27017/ecommerce
REDIS_URL=redis://localhost:6379

# API Keys (never expose in client-side code)
STRIPE_SECRET_KEY=sk_test_...
SENDGRID_API_KEY=SG...

# Encryption
ENCRYPTION_KEY=32-character-encryption-key-here
```

### Generating Secure Secrets

```bash
# Generate secure random strings
# PowerShell
[Convert]::ToBase64String((1..32 | ForEach-Object { Get-Random -Maximum 256 }))

# Bash
openssl rand -base64 32

# Node.js
node -e "console.log(require('crypto').randomBytes(32).toString('base64'))"
```

### Secrets in Kubernetes

```yaml
# k8s/secrets.yaml
apiVersion: v1
kind: Secret
metadata:
  name: ecommerce-secrets
  namespace: ecommerce
type: Opaque
stringData:
  JWT_ACCESS_SECRET: <base64-encoded-secret>
  JWT_REFRESH_SECRET: <base64-encoded-secret>
  MONGODB_URL: <base64-encoded-url>
  STRIPE_SECRET_KEY: <base64-encoded-key>
```

---

## 🔒 Data Encryption

### Encryption at Rest

```typescript
// src/utils/encryption.ts
import crypto from 'crypto';

const ALGORITHM = 'aes-256-gcm';
const KEY = Buffer.from(process.env.ENCRYPTION_KEY!, 'base64');

export function encrypt(plaintext: string): string {
  const iv = crypto.randomBytes(16);
  const cipher = crypto.createCipheriv(ALGORITHM, KEY, iv);
  
  let encrypted = cipher.update(plaintext, 'utf8', 'base64');
  encrypted += cipher.final('base64');
  
  const authTag = cipher.getAuthTag();
  
  return `${iv.toString('base64')}:${authTag.toString('base64')}:${encrypted}`;
}

export function decrypt(ciphertext: string): string {
  const [ivBase64, authTagBase64, encrypted] = ciphertext.split(':');
  
  const iv = Buffer.from(ivBase64, 'base64');
  const authTag = Buffer.from(authTagBase64, 'base64');
  
  const decipher = crypto.createDecipheriv(ALGORITHM, KEY, iv);
  decipher.setAuthTag(authTag);
  
  let decrypted = decipher.update(encrypted, 'base64', 'utf8');
  decrypted += decipher.final('utf8');
  
  return decrypted;
}
```

### Sensitive Field Encryption

```typescript
// src/models/User.ts
import { encrypt, decrypt } from '@/utils/encryption';

const userSchema = new Schema({
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  // Encrypted sensitive data
  ssn: {
    type: String,
    set: (value: string) => encrypt(value),
    get: (value: string) => decrypt(value),
  },
  creditCardLast4: { type: String },
});

userSchema.set('toJSON', {
  transform: (doc, ret) => {
    delete ret.password;
    delete ret.ssn;
    return ret;
  },
});
```

---

## 📋 Security Checklist

### Authentication & Authorization

- [ ] JWT tokens with short expiration
- [ ] Secure refresh token rotation
- [ ] HTTP-only cookies for tokens
- [ ] Role-based access control
- [ ] Token revocation mechanism

### Input Security

- [ ] Input validation on all endpoints
- [ ] Output encoding/escaping
- [ ] SQL/NoSQL injection prevention
- [ ] XSS prevention
- [ ] File upload validation

### Network Security

- [ ] HTTPS everywhere
- [ ] CORS properly configured
- [ ] Security headers (Helmet)
- [ ] Rate limiting
- [ ] DDoS protection

### Data Security

- [ ] Passwords hashed with bcrypt
- [ ] Sensitive data encrypted
- [ ] PII minimization
- [ ] Secure secret storage
- [ ] Regular backups

### Monitoring & Logging

- [ ] Security event logging
- [ ] Anomaly detection
- [ ] Failed login tracking
- [ ] Audit trails
- [ ] Incident response plan

---

## 🚨 Security Incident Response

### Severity Levels

| Level | Description | Response Time |
|-------|-------------|---------------|
| **Critical** | Active breach, data exposure | Immediate |
| **High** | Vulnerability exploited | < 4 hours |
| **Medium** | Potential vulnerability | < 24 hours |
| **Low** | Minor security concern | < 1 week |

### Response Steps

1. **Identify** - Detect and classify the incident
2. **Contain** - Limit the blast radius
3. **Eradicate** - Remove the threat
4. **Recover** - Restore normal operations
5. **Document** - Record lessons learned

---

## 📚 Related Documentation

- [Architecture Overview](ARCHITECTURE.md)
- [API Documentation](API_DOCUMENTATION.md)
- [CI/CD Pipeline](CI_CD_PIPELINE.md)

---

## 📖 Security Resources

- [OWASP Top 10](https://owasp.org/www-project-top-ten/)
- [Node.js Security Checklist](https://blog.risingstack.com/node-js-security-checklist/)
- [JWT Best Practices](https://auth0.com/blog/a-look-at-the-latest-draft-for-jwt-bcp/)
- [MongoDB Security](https://docs.mongodb.com/manual/security/)

---

**Last Updated**: January 10, 2026
**Version**: 1.0.0
