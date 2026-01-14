import { Request, Response } from 'express';
import { Ticket, TicketStatus } from '../models/Ticket';
import { SupportUser } from '../models/SupportUser';
import { AuthRequest } from '../middleware/auth';
import { Logger } from '../utils/logger';

/**
 * @swagger
 * /api/tickets:
 *   get:
 *     summary: Get all tickets
 *     tags: [Tickets]
 *     parameters:
 *       - in: query
 *         name: status
 *         schema:
 *           type: string
 *       - in: query
 *         name: priority
 *         schema:
 *           type: string
 *       - in: query
 *         name: category
 *         schema:
 *           type: string
 *       - in: query
 *         name: assignedTo
 *         schema:
 *           type: string
 *       - in: query
 *         name: page
 *         schema:
 *           type: number
 *       - in: query
 *         name: limit
 *         schema:
 *           type: number
 *     responses:
 *       200:
 *         description: List of tickets
 */
export const getAllTickets = async (req: Request, res: Response) => {
  try {
    const { status, priority, category, assignedTo, page = 1, limit = 20, search } = req.query;

    const query: any = {};

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (category) query.category = category;
    if (assignedTo) query.assignedTo = assignedTo;
    if (search) {
      query.$or = [
        { subject: { $regex: search, $options: 'i' } },
        { ticketId: { $regex: search, $options: 'i' } },
        { customerName: { $regex: search, $options: 'i' } },
        { customerEmail: { $regex: search, $options: 'i' } },
      ];
    }

    const pageNum = parseInt(page as string, 10);
    const limitNum = parseInt(limit as string, 10);
    const skip = (pageNum - 1) * limitNum;

    const [tickets, total] = await Promise.all([
      Ticket.find(query)
        .populate('assignedTo', 'name email avatar')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limitNum),
      Ticket.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      data: tickets,
      pagination: {
        page: pageNum,
        limit: limitNum,
        total,
        pages: Math.ceil(total / limitNum),
      },
    });
  } catch (error: any) {
    Logger.error('Error fetching tickets', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tickets',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   get:
 *     summary: Get ticket by ID
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket details
 */
export const getTicketById = async (req: Request, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findById(id).populate('assignedTo', 'name email avatar');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    res.status(200).json({
      success: true,
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error fetching ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets:
 *   post:
 *     summary: Create a new ticket
 *     tags: [Tickets]
 *     requestBody:
 *       required: true
 *       content:
 *         application/json:
 *           schema:
 *             type: object
 *             required:
 *               - subject
 *               - description
 *               - category
 *               - customerName
 *               - customerEmail
 *             properties:
 *               subject:
 *                 type: string
 *               description:
 *                 type: string
 *               category:
 *                 type: string
 *               priority:
 *                 type: string
 *               customerName:
 *                 type: string
 *               customerEmail:
 *                 type: string
 *     responses:
 *       201:
 *         description: Ticket created successfully
 */
export const createTicket = async (req: Request, res: Response) => {
  try {
    const {
      subject,
      description,
      category,
      priority = 'medium',
      customerName,
      customerEmail,
      customerId,
      attachments = [],
    } = req.body;

    const ticket = new Ticket({
      subject,
      description,
      category,
      priority,
      customerName,
      customerEmail,
      customerId,
      attachments,
    });

    await ticket.save();

    Logger.info(`Ticket created: ${ticket.ticketId}`, undefined, 'TicketController');

    res.status(201).json({
      success: true,
      message: 'Ticket created successfully',
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error creating ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to create ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   put:
 *     summary: Update a ticket
 *     tags: [Tickets]
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
 *         description: Ticket updated successfully
 */
export const updateTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      { ...updates, updatedAt: new Date() },
      { new: true, runValidators: true }
    ).populate('assignedTo', 'name email avatar');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    Logger.info(`Ticket updated: ${ticket.ticketId}`, undefined, 'TicketController');

    res.status(200).json({
      success: true,
      message: 'Ticket updated successfully',
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error updating ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to update ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}/assign:
 *   patch:
 *     summary: Assign ticket to support user
 *     tags: [Tickets]
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
 *             properties:
 *               assignedTo:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket assigned successfully
 */
export const assignTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { assignedTo } = req.body;

    // Verify support user exists
    const supportUser = await SupportUser.findById(assignedTo);
    if (!supportUser) {
      return res.status(404).json({
        success: false,
        message: 'Support user not found',
      });
    }

    const ticket = await Ticket.findByIdAndUpdate(
      id,
      {
        assignedTo,
        status: TicketStatus.IN_PROGRESS,
        updatedAt: new Date(),
      },
      { new: true }
    ).populate('assignedTo', 'name email avatar');

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    // Update support user's assigned ticket count
    await SupportUser.findByIdAndUpdate(assignedTo, {
      $inc: { assignedTickets: 1 },
    });

    Logger.info(`Ticket ${ticket.ticketId} assigned to ${supportUser.name}`, undefined, 'TicketController');

    res.status(200).json({
      success: true,
      message: `Ticket assigned to ${supportUser.name}`,
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error assigning ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to assign ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}/resolve:
 *   patch:
 *     summary: Resolve a ticket
 *     tags: [Tickets]
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
 *             properties:
 *               resolution:
 *                 type: string
 *     responses:
 *       200:
 *         description: Ticket resolved successfully
 */
export const resolveTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { resolution } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    ticket.status = TicketStatus.RESOLVED;
    ticket.resolution = resolution;
    ticket.resolvedAt = new Date();
    await ticket.save();

    // Update support user's resolved ticket count
    if (ticket.assignedTo) {
      await SupportUser.findByIdAndUpdate(ticket.assignedTo, {
        $inc: { resolvedTickets: 1 },
      });
    }

    Logger.info(`Ticket resolved: ${ticket.ticketId}`, undefined, 'TicketController');

    res.status(200).json({
      success: true,
      message: 'Ticket resolved successfully',
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error resolving ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to resolve ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}/comment:
 *   post:
 *     summary: Add a comment to a ticket
 *     tags: [Tickets]
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
 *             properties:
 *               message:
 *                 type: string
 *               isInternal:
 *                 type: boolean
 *     responses:
 *       200:
 *         description: Comment added successfully
 */
export const addComment = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { message, isInternal = false } = req.body;

    const ticket = await Ticket.findById(id);
    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    const comment = {
      userId: req.user?.id || 'system',
      userName: req.user?.name || 'System',
      userRole: req.user?.role || 'system',
      message,
      isInternal,
      createdAt: new Date(),
    };

    ticket.comments.push(comment);
    await ticket.save();

    res.status(200).json({
      success: true,
      message: 'Comment added successfully',
      data: ticket,
    });
  } catch (error: any) {
    Logger.error('Error adding comment', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to add comment',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/{id}:
 *   delete:
 *     summary: Delete a ticket
 *     tags: [Tickets]
 *     parameters:
 *       - in: path
 *         name: id
 *         required: true
 *         schema:
 *           type: string
 *     responses:
 *       200:
 *         description: Ticket deleted successfully
 */
export const deleteTicket = async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const ticket = await Ticket.findByIdAndDelete(id);

    if (!ticket) {
      return res.status(404).json({
        success: false,
        message: 'Ticket not found',
      });
    }

    Logger.info(`Ticket deleted: ${ticket.ticketId}`, undefined, 'TicketController');

    res.status(200).json({
      success: true,
      message: 'Ticket deleted successfully',
    });
  } catch (error: any) {
    Logger.error('Error deleting ticket', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to delete ticket',
      error: error.message,
    });
  }
};

/**
 * @swagger
 * /api/tickets/stats:
 *   get:
 *     summary: Get ticket statistics
 *     tags: [Tickets]
 *     responses:
 *       200:
 *         description: Ticket statistics
 */
export const getTicketStats = async (req: Request, res: Response) => {
  try {
    const [
      total,
      open,
      inProgress,
      pending,
      resolved,
      closed,
      highPriority,
      mediumPriority,
      lowPriority,
      urgentPriority,
    ] = await Promise.all([
      Ticket.countDocuments(),
      Ticket.countDocuments({ status: 'open' }),
      Ticket.countDocuments({ status: 'in-progress' }),
      Ticket.countDocuments({ status: 'pending' }),
      Ticket.countDocuments({ status: 'resolved' }),
      Ticket.countDocuments({ status: 'closed' }),
      Ticket.countDocuments({ priority: 'high' }),
      Ticket.countDocuments({ priority: 'medium' }),
      Ticket.countDocuments({ priority: 'low' }),
      Ticket.countDocuments({ priority: 'urgent' }),
    ]);

    res.status(200).json({
      success: true,
      data: {
        total,
        byStatus: { open, inProgress, pending, resolved, closed },
        byPriority: { high: highPriority, medium: mediumPriority, low: lowPriority, urgent: urgentPriority },
      },
    });
  } catch (error: any) {
    Logger.error('Error fetching ticket stats', error, 'TicketController');
    res.status(500).json({
      success: false,
      message: 'Failed to fetch ticket statistics',
      error: error.message,
    });
  }
};
