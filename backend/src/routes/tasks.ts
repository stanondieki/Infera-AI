import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task, ITask, User } from '../models';
import { validateTask } from '../middleware/validation';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Get user's tasks
router.get('/my-tasks', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const { 
      status,
      page = 1,
      limit = 10,
      sortBy = 'deadline',
      sortOrder = 'asc'
    } = req.query;

    const query: any = { assignedTo: userId };
    if (status && status !== 'all') {
      query.status = status;
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .populate('createdBy', 'name email')
      .populate('opportunityId', 'title category')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single task details
router.get('/:id', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const userId = req.user?._id;
    const isAdmin = req.user?.role === 'admin';

    const task = await Task.findById(id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('opportunityId', 'title category');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user has permission to view this task
    if (!isAdmin && task.assignedTo._id.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    res.json({
      success: true,
      task
    });
  } catch (error) {
    console.error('Get task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Submit task work
router.post('/:id/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { submissionNotes, submissionFiles, actualHours } = req.body;
    const userId = req.user?._id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Check if task can be submitted
    if (!['in_progress', 'assigned'].includes(task.status)) {
      return res.status(400).json({
        success: false,
        message: 'Task cannot be submitted in current status'
      });
    }

    // Update task with submission
    task.status = 'completed';
    task.submissionNotes = submissionNotes;
    task.submissionFiles = submissionFiles || [];
    task.submittedAt = new Date();
    task.completedAt = new Date();
    task.progress = 100;
    
    if (actualHours) {
      task.actualHours = actualHours;
      task.totalEarnings = actualHours * task.hourlyRate;
    }

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .populate('opportunityId', 'title category');

    res.json({
      success: true,
      message: 'Task submitted successfully',
      task: updatedTask
    });
  } catch (error) {
    console.error('Submit task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update task progress
router.put('/:id/progress', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { progress, status } = req.body;
    const userId = req.user?._id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to this task
    if (task.assignedTo.toString() !== userId?.toString()) {
      return res.status(403).json({
        success: false,
        message: 'Access denied'
      });
    }

    // Update progress
    if (progress !== undefined) {
      task.progress = Math.max(0, Math.min(100, progress));
    }

    // Update status if provided
    if (status && ['assigned', 'in_progress'].includes(status)) {
      task.status = status;
      
      if (status === 'in_progress' && !task.startedAt) {
        task.startedAt = new Date();
      }
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task progress updated',
      task: {
        id: task._id,
        progress: task.progress,
        status: task.status,
        startedAt: task.startedAt
      }
    });
  } catch (error) {
    console.error('Update task progress error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get task statistics for user dashboard
router.get('/stats/dashboard', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    const stats = await Task.aggregate([
      { $match: { assignedTo: userId } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarnings: { $sum: '$totalEarnings' }
        }
      }
    ]);

    const recentTasks = await Task.find({ assignedTo: userId })
      .populate('opportunityId', 'title category')
      .sort({ updatedAt: -1 })
      .limit(5);

    const totalTasks = await Task.countDocuments({ assignedTo: userId });
    const completedTasks = await Task.countDocuments({ 
      assignedTo: userId, 
      status: 'approved' 
    });
    
    const totalEarnings = await Task.aggregate([
      { 
        $match: { 
          assignedTo: userId, 
          paymentStatus: 'paid' 
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalEarnings' } 
        } 
      }
    ]);

    const pendingEarnings = await Task.aggregate([
      { 
        $match: { 
          assignedTo: userId, 
          status: 'approved',
          paymentStatus: { $in: ['pending', 'processing'] }
        } 
      },
      { 
        $group: { 
          _id: null, 
          total: { $sum: '$totalEarnings' } 
        } 
      }
    ]);

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        totalTasks,
        completedTasks,
        totalEarnings: totalEarnings[0]?.total || 0,
        pendingEarnings: pendingEarnings[0]?.total || 0,
        assigned: statusStats.assigned || 0,
        inProgress: statusStats.in_progress || 0,
        completed: statusStats.completed || 0,
        underReview: statusStats.under_review || 0,
        approved: statusStats.approved || 0,
        rejected: statusStats.rejected || 0,
        recentTasks
      }
    });
  } catch (error) {
    console.error('Get task stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Admin routes

// Get all tasks (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      status,
      assignedTo,
      paymentStatus,
      page = 1,
      limit = 20,
      sortBy = 'createdAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};
    if (status && status !== 'all') query.status = status;
    if (assignedTo) query.assignedTo = assignedTo;
    if (paymentStatus && paymentStatus !== 'all') query.paymentStatus = paymentStatus;

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const tasks = await Task.find(query)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('opportunityId', 'title category')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Task.countDocuments(query);

    res.json({
      success: true,
      tasks,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get all tasks error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new task (Admin only)
router.post('/', authenticateToken, requireAdmin, validateTask, async (req: AuthRequest, res: Response) => {
  try {
    const taskData = {
      ...req.body,
      createdBy: req.user?._id
    };

    const task = new Task(taskData);
    await task.save();

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('opportunityId', 'title category');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error) {
    console.error('Create task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during task creation'
    });
  }
});

// Review task submission (Admin only)
router.put('/:id/review', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes, rating, feedback, revisionRequested, revisionNotes } = req.body;
    const reviewerId = req.user?._id;

    if (!['approved', 'rejected', 'under_review'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid review status'
      });
    }

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Update task with review
    task.status = status;
    task.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
    task.reviewedAt = new Date();
    
    if (reviewNotes) task.reviewNotes = reviewNotes;
    if (rating) task.rating = rating;
    if (feedback) task.feedback = feedback;
    if (revisionRequested !== undefined) task.revisionRequested = revisionRequested;
    if (revisionNotes) task.revisionNotes = revisionNotes;

    // If approved, set payment status
    if (status === 'approved') {
      task.paymentStatus = 'pending';
      
      // Update user stats
      const user = await User.findById(task.assignedTo);
      if (user) {
        user.completedTasks += 1;
        if (task.totalEarnings) {
          user.totalEarnings += task.totalEarnings;
        }
        
        // Update rating
        if (rating && user.reviewCount >= 0) {
          const totalRating = (user.rating * user.reviewCount) + rating;
          user.reviewCount += 1;
          user.rating = totalRating / user.reviewCount;
        } else if (rating) {
          user.rating = rating;
          user.reviewCount = 1;
        }
        
        await user.save();
      }
    }

    await task.save();

    const updatedTask = await Task.findById(id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('reviewedBy', 'name email')
      .populate('opportunityId', 'title category');

    res.json({
      success: true,
      message: 'Task review completed',
      task: updatedTask
    });
  } catch (error) {
    console.error('Review task error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during task review'
    });
  }
});

export default router;