import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task, ITask, User, Opportunity } from '../models';
import { validateTask } from '../middleware/validation';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Create tasks from projects (Admin only)
router.post('/create-from-project', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { projectId, taskCount = 5 } = req.body;

    // Get the project details (using Opportunity model)
    const project = await Opportunity.findById(projectId);
    
    if (!project) {
      return res.status(404).json({
        success: false,
        message: 'Project not found'
      });
    }

    // Task templates based on project category (updated for Opportunity categories)
    const taskTemplates: { [key: string]: any[] } = {
      'Data Annotation': [
        {
          title: 'Image Classification - Batch #{batch}',
          description: 'Classify {count} images into predefined categories',
          type: 'data_annotation',
          difficulty: ['medium', 'hard'],
          estimatedHours: [1.5, 2.5],
          instructions: 'Review each image carefully and assign the most appropriate category. Follow the provided guidelines for consistent classification.'
        },
        {
          title: 'Object Detection - Batch #{batch}',
          description: 'Draw bounding boxes around objects in images',  
          type: 'data_annotation',
          difficulty: ['hard', 'expert'],
          estimatedHours: [2, 3],
          instructions: 'Accurately identify and draw bounding boxes around all specified objects. Ensure precise boundaries and correct labeling.'
        },
        {
          title: 'Text Sentiment Analysis - Set #{batch}',
          description: 'Analyze sentiment of customer reviews and feedback',
          type: 'data_annotation', 
          difficulty: ['easy', 'medium'],
          estimatedHours: [1, 1.5],
          instructions: 'Read each text sample and classify the sentiment as positive, negative, or neutral. Consider context and tone.'
        }
      ],
      'Content Creation': [
        {
          title: 'Content Review - Batch #{batch}',
          description: 'Review and moderate user-generated content',
          type: 'content_creation',
          difficulty: ['easy', 'medium'],
          estimatedHours: [1, 2],
          instructions: 'Review content for policy violations, inappropriate material, and community guidelines compliance.'
        }
      ],
      'AI/ML': [
        {
          title: 'Model Output Evaluation - Round #{batch}',
          description: 'Evaluate AI model responses for quality and accuracy',
          type: 'quality_assurance',
          difficulty: ['medium', 'hard'],
          estimatedHours: [2, 3],
          instructions: 'Rate AI responses on accuracy, relevance, and helpfulness. Provide detailed feedback for improvement.'
        }
      ],
      'Quality Assurance': [
        {
          title: 'QA Testing - Batch #{batch}',
          description: 'Test software functionality and report issues',
          type: 'quality_assurance',
          difficulty: ['medium', 'hard'],
          estimatedHours: [2, 4],
          instructions: 'Thoroughly test the assigned features and document any bugs or issues found.'
        }
      ]
    };

    const templates = taskTemplates[project.category as string] || taskTemplates['Data Annotation'];
    const createdTasks = [];

    // Get users who can be assigned tasks (non-admin users)
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id');

    for (let i = 0; i < taskCount; i++) {
      const template = templates[Math.floor(Math.random() * templates.length)];
      const difficulty = Array.isArray(template.difficulty) 
        ? template.difficulty[Math.floor(Math.random() * template.difficulty.length)]
        : template.difficulty;
      const estimatedHours = Array.isArray(template.estimatedHours)
        ? template.estimatedHours[Math.floor(Math.random() * template.estimatedHours.length)]
        : template.estimatedHours;
      
      // Random batch numbers for realistic task names
      const batchNum = Math.floor(Math.random() * 500) + 100;
      const itemCount = Math.floor(Math.random() * 200) + 50;
      
      // Assign to random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const task = new Task({
        title: template.title.replace('{batch}', batchNum).replace('{count}', itemCount),
        description: template.description.replace('{count}', itemCount),
        type: template.type,
        assignedTo: randomUser._id,
        createdBy: req.user!._id,
        instructions: template.instructions,
        requirements: [
          'Attention to detail',
          'Follow provided guidelines',
          'Maintain consistency',
          'Complete all items'
        ],
        deliverables: ['Completed annotations', 'Quality report'],
        estimatedHours,
        deadline: project.applicationDeadline || new Date(Date.now() + Math.floor(Math.random() * 7 + 1) * 24 * 60 * 60 * 1000),
        priority: project.priority || ['low', 'medium', 'high'][Math.floor(Math.random() * 3)],
        hourlyRate: project.hourlyRate?.min || Math.floor(Math.random() * 20) + 15,
        status: Math.random() > 0.3 ? 'assigned' : 'available', // 70% assigned, 30% available
        progress: Math.random() > 0.5 ? Math.floor(Math.random() * 80) : 0, // Some tasks have progress
        // Additional fields for frontend compatibility
        opportunityId: projectId, // Link to the opportunity (project)
        project_id: projectId,
        project_name: project.title,
        category: project.category,
        difficulty: difficulty,
        estimated_time: Math.floor(estimatedHours * 60), // Convert to minutes
        payment: Math.floor(estimatedHours * (project.hourlyRate?.min || 25))
      });

      // If task is in progress, set start time
      if (task.progress > 0) {
        task.startedAt = new Date(Date.now() - Math.floor(Math.random() * 2 * 60 * 60 * 1000)); // Started within last 2 hours
        task.status = 'in_progress';
      }

      await task.save();
      createdTasks.push(task);
    }

    res.json({
      success: true,
      message: `Created ${taskCount} tasks for project: ${project.title}`,
      tasks: createdTasks,
      projectName: project.title
    });

  } catch (error) {
    console.error('Error creating tasks from project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create tasks from project'
    });
  }
});

// Update task progress
router.put('/:taskId/progress', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { progress, status, time_spent } = req.body;
    const userId = req.user?._id;

    const task = await Task.findOne({ 
      _id: taskId, 
      assignedTo: userId 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you'
      });
    }

    // Update progress
    task.progress = progress;
    if (status) task.status = status;
    if (time_spent !== undefined) task.actualHours = time_spent / 60; // Convert minutes to hours

    // Update timestamps
    if (status === 'in_progress' && !task.startedAt) {
      task.startedAt = new Date();
    }
    if (status === 'completed' && !task.completedAt) {
      task.completedAt = new Date();
    }

    await task.save();

    res.json({
      success: true,
      message: 'Progress updated successfully',
      task: {
        id: task._id,
        progress: task.progress,
        status: task.status,
        time_spent: time_spent
      }
    });
  } catch (error) {
    console.error('Error updating task progress:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to update task progress'
    });
  }
});

// Submit completed task
router.put('/:taskId/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { submission_notes, completed_items } = req.body;
    const userId = req.user?._id;

    const task = await Task.findOne({ 
      _id: taskId, 
      assignedTo: userId 
    });

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found or not assigned to you'
      });
    }

    // Update task with submission
    task.status = 'under_review';
    task.progress = 100;
    task.submissionNotes = submission_notes;
    task.submittedAt = new Date();
    task.completedAt = new Date();

    // Store completed items (in a real system, this would be more structured)
    if (completed_items) {
      task.submissionFiles = completed_items.map((item: any) => JSON.stringify(item));
    }

    await task.save();

    res.json({
      success: true,
      message: 'Task submitted successfully! Pending review.',
      task: {
        id: task._id,
        status: task.status,
        submitted_at: task.submittedAt
      }
    });
  } catch (error) {
    console.error('Error submitting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit task'
    });
  }
});

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
    console.log('📝 Creating task with data:', JSON.stringify(req.body, null, 2));
    
    const taskData = {
      ...req.body,
      createdBy: req.user?._id
    };

    console.log('📝 Final task data before saving:', JSON.stringify(taskData, null, 2));
    
    const task = new Task(taskData);
    await task.save();
    
    console.log('✅ Task saved with ID:', task._id);
    console.log('📋 Assigned to:', task.assignedTo);

    const populatedTask = await Task.findById(task._id)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .populate('opportunityId', 'title category');

    console.log('📋 Populated task:', JSON.stringify(populatedTask, null, 2));

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: populatedTask
    });
  } catch (error: any) {
    console.error('Create task error:', error);
    console.error('Error details:', error?.message);
    if (error?.name === 'ValidationError') {
      console.error('Validation errors:', error?.errors);
    }
    res.status(500).json({
      success: false,
      message: 'Server error during task creation',
      error: error?.message || 'Unknown error'
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