import { Request, Response } from 'express';
import jwt, { SignOptions } from 'jsonwebtoken';
import { SupportUser, SupportUserRole } from '../models/SupportUser';
import { Ticket } from '../models/Ticket';
import { AuthRequest } from '../middleware/auth';
import { Logger } from '../utils/logger';

const JWT_SECRET = process.env.JWT_SECRET || '3a-softwares-jwt-secret-key-2024';
const JWT_EXPIRES_IN = process.env.JWT_EXPIRES_IN || '7d';

/**
 * @swagger
 * /api/support-users/login:
 *   post:
 *     summary: Login support user
 *     tags: [Support Users]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *     responses:
 *       200:
 *         description: Login successful
 */
export const login = async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;

    // Find user with password
    const user = await SupportUser.findOne({ email }).select('+password');

    if (!user || !(await user.comparePassword(password))) {
      return res.status(401).json({
        success: false,
        message: 'Invalid email or password',
      });
    }

    if (user.status !== 'active') {
      return res.status(403).json({
        success: false,
        message: 'Account is inactive. Please contact administrator.',
      });
    }

    // Update last login
    user.lastLogin = new Date();
    await user.save();

    // Generate token
    const signOptions: SignOptions = { expiresIn: JWT_EXPIRES_IN as string };
    const token = jwt.sign(
      {
        id: user._id,
        email: user.email,
        name: user.name,
        role: user.role,
      },
      JWT_SECRET,
      signOptions
    );

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    Logger.info(`Support user logged in: ${user.email}`, undefined, 'SupportUserController');

    res.status(200).json({
      success: true,
      message: 'Login successful',
      data: {
        user: userWithoutPassword,
        token,
      },
    });
  } catch (error: any) {
    Logger.error('Login error', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Login failed',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users:
 *   get:
 *     summary: Get all support users
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: List of support users
 */
export const getAllSupportUsers = async (req: AuthRequest, res: Response) => {
  try {
    const users = await SupportUser.find().sort({ createdAt: -1 });

    // Get ticket counts for each user
    const usersWithTickets = await Promise.all(
      users.map(async (user) => {
        const assignedCount = await Ticket.countDocuments({ assignedTo: user._id });
        const resolvedCount = await Ticket.countDocuments({
          assignedTo: user._id,
          status: 'resolved',
        });
        return {
          ...user.toObject(),
          assignedTickets: assignedCount,
          resolvedTickets: resolvedCount,
        };
      })
    );

    res.status(200).json({
      success: true,
      data: usersWithTickets,
    });
  } catch (error: any) {
    Logger.error('Error fetching support users', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support users',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users/{id}:
 *   get:
 *     summary: Get support user by ID
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support user details
 */
export const getSupportUserById = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await SupportUser.findById(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Support user not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    Logger.error('Error fetching support user', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch support user',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users:
 *   post:
 *     summary: Create a new support user (Admin only)
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - email
 *               - password
 *               - name
 *             properties:
 *               email:
 *                 type: string
 *               password:
 *                 type: string
 *               name:
 *                 type: string
 *               role:
 *                 type: string
 *               phone:
 *                 type: string
 *               department:
 *                 type: string
 *     responses:
 *       201:
 *         description: Support user created successfully
 */
export const createSupportUser = async (req: AuthRequest, res: Response) => {
  try {
    const { email, password, name, role = SupportUserRole.AGENT, phone, department } = req.body;

    // Check if user already exists
    const existingUser = await SupportUser.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'Email already registered',
      });
    }

    const user = new SupportUser({
      email,
      password,
      name,
      role,
      phone,
      department,
    });

    await user.save();

    // Remove password from response
    const { password: _, ...userWithoutPassword } = user.toObject();

    Logger.info(`Support user created: ${user.email}`, undefined, 'SupportUserController');

    res.status(201).json({
      success: true,
      message: 'Support user created successfully',
      data: userWithoutPassword,
    });
  } catch (error: any) {
    Logger.error('Error creating support user', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to create support user',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users/{id}:
 *   put:
 *     summary: Update a support user (Admin only)
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *     responses:
 *       200:
 *         description: Support user updated successfully
 */
export const updateSupportUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password update through this endpoint
    delete updates.password;

    const user = await SupportUser.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    );

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Support user not found',
      });
    }

    Logger.info(`Support user updated: ${user.email}`, undefined, 'SupportUserController');

    res.status(200).json({
      success: true,
      message: 'Support user updated successfully',
      data: user,
    });
  } catch (error: any) {
    Logger.error('Error updating support user', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to update support user',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users/{id}:
 *   delete:
 *     summary: Delete a support user (Admin only)
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Support user deleted successfully
 */
export const deleteSupportUser = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await SupportUser.findByIdAndDelete(id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'Support user not found',
      });
    }

    Logger.info(`Support user deleted: ${user.email}`, undefined, 'SupportUserController');

    res.status(200).json({
      success: true,
      message: 'Support user deleted successfully',
    });
  } catch (error: any) {
    Logger.error('Error deleting support user', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to delete support user',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/support-users/me:
 *   get:
 *     summary: Get current logged in user profile
 *     tags: [Support Users]
 *     security:
 *       - bearerAuth: []
 *     responses:
 *       200:
 *         description: Current user profile
 */
export const getProfile = async (req: AuthRequest, res: Response) => {
  try {
    const user = await SupportUser.findById(req.user?.id);

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found',
      });
    }

    res.status(200).json({
      success: true,
      data: user,
    });
  } catch (error: any) {
    Logger.error('Error fetching profile', error, 'SupportUserController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch profile',
      error: error.message,
    });
  }
};
