/**
 * Server-side only validation utilities
 * These require Express and should only be used in backend services
 */

import { Request, Response, NextFunction } from 'express';
import { validationResult } from 'express-validator';

// EXPRESS VALIDATOR MIDDLEWARE
export const validate = (req: Request, res: Response, next: NextFunction): void => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array().map((err) => ({
        field: err.type === 'field' ? err.path : undefined,
        message: err.msg,
      })),
    });
    return;
  }

  next();
};

// Re-export client validations for convenience
export * from './client';

// Re-export server Logger for backend services
export { Logger } from '../api/logger';
