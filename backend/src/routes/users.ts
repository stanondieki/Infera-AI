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

// Get all users - alias for / route to handle frontend requests
router.get('/all', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const users = await User.find({})
      .select('-password')
      .sort({ createdAt: -1 })
      .lean();

    console.log('👥 Found users:', users.length);
    
    res.json({
      success: true,
      users: users || []
    });
  } catch (error) {
    console.error('Error fetching users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Get assignable users for task creation (Admin only)
router.get('/assignable', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    console.log('🔍 Fetching assignable users for task creation...');
    
    const users = await User.find({ 
      isActive: true,
      role: { $in: ['user', 'admin'] }
    })
      .select('_id name email role isActive')
      .sort({ name: 1 })
      .lean();

    console.log('👥 Found assignable users:', users.length);
    console.log('📋 Users list:', users.map(u => `${u.name} (${u.email})`));
    
    res.json({
      success: true,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive
      }))
    });
  } catch (error) {
    console.error('❌ Error fetching assignable users:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch assignable users',
      error: error instanceof Error ? error.message : 'Unknown error'
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

// Debug endpoint to list users (development only)
router.get('/debug', async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: 'Not found' });
    }
    
    const users = await User.find({})
      .select('name email role isActive isVerified joinedDate')
      .sort({ joinedDate: -1 });

    res.json({
      success: true,
      count: users.length,
      users
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create a test user with known password (development only)
router.post('/debug/test-user', async (req: Request, res: Response) => {
  try {
    if (process.env.NODE_ENV === 'production') {
      return res.status(404).json({ message: 'Not found' });
    }
    
    // Check if test user already exists
    const existingUser = await User.findOne({ email: 'test@inferaai.com' });
    if (existingUser) {
      return res.json({
        success: true,
        message: 'Test user already exists',
        credentials: {
          email: 'test@inferaai.com',
          password: 'Test123!'
        }
      });
    }

    // Create test user
    const testUser = new User({
      name: 'Test User',
      email: 'test@inferaai.com',
      password: 'Test123!',
      role: 'user',
      isActive: true,
      isVerified: true
    });

    await testUser.save();

    res.json({
      success: true,
      message: 'Test user created successfully',
      credentials: {
        email: 'test@inferaai.com',
        password: 'Test123!'
      }
    });
  } catch (error) {
    console.error('Create test user error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Send friend invitation
router.post('/invite', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { email, referralCode, invitedBy } = req.body;
    const userId = req.user?._id;

    if (!email || !referralCode) {
      return res.status(400).json({
        success: false,
        message: 'Email and referral code are required'
      });
    }

    // Check if email already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      return res.status(400).json({
        success: false,
        message: 'User with this email already exists'
      });
    }

    // TODO: In production, implement actual email sending
    // For now, we'll just log the invitation
    console.log(`📧 Invitation sent to ${email} with referral code ${referralCode} by user ${userId}`);
    
    // Store invitation in user's referral data (extend User model if needed)
    const inviter = await User.findById(userId);
    if (inviter) {
      // Add to a referrals array or separate Invitation model
      // For now, we'll track it in memory or implement later
    }

    res.json({
      success: true,
      message: 'Invitation sent successfully',
      data: {
        email,
        referralCode,
        sentAt: new Date()
      }
    });

  } catch (error) {
    console.error('Send invitation error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send invitation'
    });
  }
});

// Get referral statistics
router.get('/referral-stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;

    if (!userId) {
      return res.status(401).json({
        success: false,
        message: 'User authentication required'
      });
    }

    // Calculate referral stats based on user's invitations
    // TODO: Implement proper referral tracking with separate model
    // For now, return calculated stats based on existing data
    
    const user = await User.findById(userId);
    const userEmail = user?.email || '';
    const referralCode = userEmail.split('@')[0].toUpperCase() + userId.toString().slice(-4);
    
    // Count users who joined with this referral code (implement when referral system is fully built)
    // For demo purposes, calculate based on user activity
    const userTasks = await Task.find({ assignedTo: userId, status: 'completed' });
    const completedTasks = userTasks.length;
    
    // Simulate referral stats based on user activity (replace with real data)
    const totalInvited = Math.floor(completedTasks / 5); // 1 invite per 5 completed tasks
    const totalEarnings = totalInvited * 25; // $25 per successful referral

    res.json({
      success: true,
      data: {
        totalInvited,
        totalEarnings,
        referralCode,
        activeReferrals: Math.floor(totalInvited * 0.8), // 80% conversion rate
      }
    });

  } catch (error) {
    console.error('Get referral stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to get referral statistics'
    });
  }
});

export default router;