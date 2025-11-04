import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { User, IUser, Task, Application } from '../models';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Get all users (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      role,
      isActive,
      isVerified,
      search,
      page = 1,
      limit = 20,
      sortBy = 'joinedDate',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};
    if (role && role !== 'all') query.role = role;
    if (isActive !== undefined) query.isActive = isActive === 'true';
    if (isVerified !== undefined) query.isVerified = isVerified === 'true';
    
    if (search) {
      query.$or = [
        { name: { $regex: search, $options: 'i' } },
        { email: { $regex: search, $options: 'i' } }
      ];
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const users = await User.find(query)
      .select('-password')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await User.countDocuments(query);

    res.json({
      success: true,
      users,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user details (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const user = await User.findById(id).select('-password');
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Get user's tasks summary
    const taskStats = await Task.aggregate([
      { $match: { assignedTo: user._id } },
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 },
          totalEarnings: { $sum: '$totalEarnings' }
        }
      }
    ]);

    // Get recent tasks
    const recentTasks = await Task.find({ assignedTo: user._id })
      .populate('opportunityId', 'title category')
      .sort({ updatedAt: -1 })
      .limit(5);

    // Get application if exists
    const application = await Application.findOne({ userId: user._id });

    const userStats = taskStats.reduce((acc, stat) => {
      acc[stat._id] = { count: stat.count, earnings: stat.totalEarnings || 0 };
      return acc;
    }, {} as Record<string, { count: number; earnings: number }>);

    res.json({
      success: true,
      user: {
        ...user.toObject(),
        taskStats: userStats,
        recentTasks,
        application
      }
    });
  } catch (error) {
    console.error('Get user details error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update user (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Don't allow password updates through this endpoint
    delete updates.password;
    delete updates._id;
    delete updates.createdAt;
    delete updates.joinedDate;

    const user = await User.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    res.json({
      success: true,
      message: 'User updated successfully',
      user
    });
  } catch (error) {
    console.error('Update user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during user update'
    });
  }
});

// Get user statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const totalUsers = await User.countDocuments();
    const activeUsers = await User.countDocuments({ isActive: true });
    const verifiedUsers = await User.countDocuments({ isVerified: true });
    const adminUsers = await User.countDocuments({ role: 'admin' });
    
    const todayJoined = await User.countDocuments({
      joinedDate: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const topPerformers = await User.find({
      isActive: true,
      completedTasks: { $gt: 0 }
    })
    .select('name email totalEarnings completedTasks rating')
    .sort({ totalEarnings: -1 })
    .limit(10);

    res.json({
      success: true,
      stats: {
        total: totalUsers,
        active: activeUsers,
        verified: verifiedUsers,
        admins: adminUsers,
        todayJoined,
        topPerformers
      }
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;