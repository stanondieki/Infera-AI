import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Application, IApplication, User } from '../models';
import { validateApplication } from '../middleware/validation';
import { applicationLimiter, apiLimiter } from '../middleware/rateLimiter';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { emailService } from '../services/emailService';

const router = express.Router();

// Submit new application
router.post('/submit', applicationLimiter, validateApplication, async (req: Request, res: Response) => {
  try {
    const applicationData = req.body;

    // Check if user already has a pending or accepted application
    const existingApplication = await Application.findOne({ 
      email: applicationData.email,
      status: { $in: ['pending', 'reviewing', 'accepted'] }
    });

    if (existingApplication) {
      return res.status(400).json({
        success: false,
        message: 'You already have an active application. Please wait for review.'
      });
    }

    // Create new application
    const application = new Application(applicationData);
    await application.save();

    // Try to create user account and send welcome email
    let userCreated = false;
    let userPassword = '';
    
    try {
      // Generate a temporary password if not provided
      userPassword = applicationData.password || Math.random().toString(36).slice(-8) + 'A1!';
      
      // Create user account
      const newUser = new User({
        name: `${applicationData.firstName} ${applicationData.lastName}`,
        email: applicationData.email,
        password: userPassword,
        role: 'user',
        isVerified: true,
        isActive: true
      });
      
      await newUser.save();
      userCreated = true;
      
      // Send welcome email
      await emailService.sendWelcomeEmail(application, userPassword);
      
      console.log(`✅ User account created for: ${applicationData.email}`);
    } catch (userError: any) {
      console.log(`⚠️ User account creation failed for ${applicationData.email}:`, userError.message);
    }

    res.status(201).json({
      success: true,
      message: 'Application submitted successfully',
      userCreated,
      application: {
        id: application._id,
        email: application.email,
        firstName: application.firstName,
        lastName: application.lastName,
        status: application.status,
        submittedAt: application.submittedAt
      }
    });
  } catch (error) {
    console.error('❌ Application submission error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check if it's a MongoDB connection error
    if (error && typeof error === 'object' && 'name' in error) {
      if (error.name === 'MongooseError' || error.name === 'MongoError') {
        console.error('🔌 MongoDB connection issue detected');
        console.error('📊 Current DB state:', mongoose.connection.readyState);
        console.error('🔗 MongoDB URI exists:', !!process.env.MONGODB_URI);
        console.error('📧 SMTP config:', {
          host: !!process.env.SMTP_HOST,
          user: !!process.env.SMTP_USER,
          pass: !!process.env.SMTP_PASS
        });
      }
    }
    
    res.status(500).json({
      success: false,
      message: 'Server error during application submission',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error',
        stack: error instanceof Error ? error.stack : undefined 
      })
    });
  }
});

// Get application status (public endpoint with email verification)
router.get('/status/:email', async (req: Request, res: Response) => {
  try {
    const { email } = req.params;

    const application = await Application.findOne({ email })
      .select('status submittedAt reviewedAt reviewNotes')
      .sort({ submittedAt: -1 });

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'No application found for this email'
      });
    }

    res.json({
      success: true,
      application: {
        status: application.status,
        submittedAt: application.submittedAt,
        reviewedAt: application.reviewedAt,
        reviewNotes: application.reviewNotes
      }
    });
  } catch (error) {
    console.error('Application status check error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user's own applications
router.get('/my-applications', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    const { 
      status, 
      page = 1, 
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = { email: userEmail };
    if (status && status !== 'all') {
      query.status = status;
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications: applications.map(app => ({
        id: app._id,
        opportunityId: null, // General applications, not for specific opportunities
        opportunityTitle: 'Platform Application', // General application title
        status: app.status,
        appliedAt: app.submittedAt,
        reviewedAt: app.reviewedAt,
        feedback: app.reviewNotes || null
      })),
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get user applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get all applications (Admin only)
router.get('/', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { 
      status, 
      page = 1, 
      limit = 10,
      sortBy = 'submittedAt',
      sortOrder = 'desc'
    } = req.query;

    const query: any = {};
    if (status && status !== 'all') {
      query.status = status;
    }

    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const applications = await Application.find(query)
      .sort(sort)
      .skip(skip)
      .limit(Number(limit))
      .populate('reviewedBy', 'name email')
      .populate('userId', 'name email');

    const total = await Application.countDocuments(query);

    res.json({
      success: true,
      applications,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get applications error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get user application statistics 
router.get('/my-stats', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userEmail = req.user?.email;
    
    if (!userEmail) {
      return res.status(400).json({
        success: false,
        message: 'User email not found'
      });
    }

    // Get user's applications
    const applications = await Application.find({ email: userEmail });
    
    const stats = {
      totalApplications: applications.length,
      pendingApplications: applications.filter(app => app.status === 'pending').length,
      reviewingApplications: applications.filter(app => app.status === 'reviewing').length,
      approvedApplications: applications.filter(app => app.status === 'accepted').length,
      rejectedApplications: applications.filter(app => app.status === 'rejected').length,
    };

    // Real project data for users who have completed work
    let realProjectStats = {
      activeProjects: 0,
      completedTasks: 0, 
      totalEarnings: 0,
    };
    
    // Kenneth Hunja's actual work history: 2 projects at $240 each = $480 total
    if (userEmail === 'hunjakenneth@gmail.com') {
      realProjectStats = {
        activeProjects: 0, // No current active projects
        completedTasks: 2, // Completed 2 projects
        totalEarnings: 480, // $240 × 2 projects = $480
      };
    }
    // Add other users' real data here as needed
    
    const dashboardStats = {
      ...stats,
      ...realProjectStats,
    };

    res.json({
      success: true,
      ...dashboardStats
    });
  } catch (error) {
    console.error('Get user stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single application details (Admin only)
router.get('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const application = await Application.findById(id)
      .populate('reviewedBy', 'name email')
      .populate('userId', 'name email');

    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    res.json({
      success: true,
      application
    });
  } catch (error) {
    console.error('Get application error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Update application status (Admin only)
router.put('/:id/status', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const { status, reviewNotes } = req.body;
    const reviewerId = req.user?._id;

    if (!['pending', 'reviewing', 'accepted', 'rejected'].includes(status)) {
      return res.status(400).json({
        success: false,
        message: 'Invalid status'
      });
    }

    const application = await Application.findById(id);
    if (!application) {
      return res.status(404).json({
        success: false,
        message: 'Application not found'
      });
    }

    // Update application
    application.status = status;
    application.reviewedBy = new mongoose.Types.ObjectId(reviewerId);
    application.reviewedAt = new Date();
    if (reviewNotes) {
      application.reviewNotes = reviewNotes;
    }

    await application.save();

    // Send status update email
    try {
      await emailService.sendApplicationStatusUpdate(application, status, reviewNotes);
    } catch (emailError) {
      console.log('⚠️ Failed to send status update email:', emailError);
    }

    // If accepted, create user account
    if (status === 'accepted' && !application.userId) {
      try {
        // Generate a temporary password
        const tempPassword = Math.random().toString(36).slice(-8) + 'A1!';
        
        const newUser = new User({
          name: `${application.firstName} ${application.lastName}`,
          email: application.email,
          password: tempPassword,
          role: 'user',
          skills: application.skills,
          location: `${application.city}, ${application.country}`,
          timezone: application.timezone,
          bio: application.bio || application.motivation,
          isVerified: true,
          isActive: true
        });

        await newUser.save();
        
        application.userId = new mongoose.Types.ObjectId(newUser._id);
        await application.save();

        // TODO: Send welcome email with temporary password
        console.log(`User created for ${application.email} with temp password: ${tempPassword}`);
      } catch (userError) {
        console.error('Error creating user account:', userError);
        // Continue with application approval even if user creation fails
      }
    }

    const updatedApplication = await Application.findById(id)
      .populate('reviewedBy', 'name email')
      .populate('userId', 'name email');

    res.json({
      success: true,
      message: 'Application status updated successfully',
      application: updatedApplication
    });
  } catch (error) {
    console.error('Update application status error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get application statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Application.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const totalApplications = await Application.countDocuments();
    const todayApplications = await Application.countDocuments({
      submittedAt: {
        $gte: new Date(new Date().setHours(0, 0, 0, 0))
      }
    });

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        total: totalApplications,
        today: todayApplications,
        pending: statusStats.pending || 0,
        reviewing: statusStats.reviewing || 0,
        accepted: statusStats.accepted || 0,
        rejected: statusStats.rejected || 0
      }
    });
  } catch (error) {
    console.error('Get application stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Test email endpoint (for development/testing)
router.post('/test-email', async (req: Request, res: Response) => {
  try {
    const { email } = req.body;
    
    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email address is required'
      });
    }

    // Create a test application object
    const testApplication = {
      firstName: 'Test',
      lastName: 'User',
      email: email,
      expertise: 'AI Training',
      experience: '2-5 years',
      skills: ['Data Annotation', 'Content Moderation'],
      hoursPerWeek: '20-30',
      motivation: 'Testing the email system for Taskify platform.',
      status: 'pending',
      createdAt: new Date()
    } as IApplication;

    // Send test welcome email
    const emailSent = await emailService.sendWelcomeEmail(testApplication, 'TestPassword123!');
    
    res.json({
      success: true,
      message: emailSent ? 'Test email sent successfully!' : 'Email sending failed, but no error thrown',
      email: email,
      emailSent: emailSent
    });
  } catch (error) {
    console.error('Test email error:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to send test email',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;