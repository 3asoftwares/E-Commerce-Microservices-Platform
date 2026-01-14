import { Router } from 'express';
import {
  login,
  getAllSupportUsers,
  getSupportUserById,
  createSupportUser,
  updateSupportUser,
  deleteSupportUser,
  getProfile,
} from '../controllers/supportUserController';
import { authenticate, authorizeAdmin } from '../middleware/auth';

const router = Router();

/**
 * @swagger
 * tags:
 *   name: Support Users
 *   description: Support user management endpoints
 */

// Public route for login
router.post('/login', login);

// Get current user profile
router.get('/me', authenticate, getProfile);

// Protected routes (require admin)
router.get('/', authenticate, authorizeAdmin, getAllSupportUsers);
router.get('/:id', authenticate, authorizeAdmin, getSupportUserById);
router.post('/', authenticate, authorizeAdmin, createSupportUser);
router.put('/:id', authenticate, authorizeAdmin, updateSupportUser);
router.delete('/:id', authenticate, authorizeAdmin, deleteSupportUser);

export default router;
