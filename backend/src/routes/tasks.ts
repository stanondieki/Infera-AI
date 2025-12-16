import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Task, ITask, User, Opportunity } from '../models';
import { validateTask } from '../middleware/validation';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';
import { aiTrainingTaskTemplates, getRandomTaskTemplate, getTaskTemplatesByCategory } from '../data/outlierTaskTemplates';

const router = express.Router();

// Create Individual Task (Admin only)
router.post('/create', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const taskData = req.body;
    
    console.log('🎯 Task creation request received');
    console.log('👤 Created by user:', req.user?.email);
    console.log('📝 Task data keys:', Object.keys(taskData));
    console.log('📋 Task data:', JSON.stringify(taskData, null, 2));

    // Validate required fields
    const missingFields = [];
    if (!taskData.title) missingFields.push('title');
    if (!taskData.description) missingFields.push('description');
    if (!taskData.type) missingFields.push('type');
    if (!taskData.category) missingFields.push('category');
    
    if (missingFields.length > 0) {
      console.log('❌ Missing required fields:', missingFields);
      return res.status(400).json({
        success: false,
        message: `Missing required fields: ${missingFields.join(', ')}`,
        receivedFields: Object.keys(taskData)
      });
    }

    // Validate and convert assignedTo to array of ObjectIds if provided
    let assignedToIds: mongoose.Types.ObjectId[] = [];
    const rawAssignedTo = taskData.assignedTo;
    
    // Handle both single ID and array of IDs
    const assignedToArray = Array.isArray(rawAssignedTo) 
      ? rawAssignedTo 
      : (rawAssignedTo && rawAssignedTo !== '' && rawAssignedTo !== 'null' ? [rawAssignedTo] : []);
    
    if (assignedToArray.length > 0) {
      try {
        for (const userId of assignedToArray) {
          if (mongoose.Types.ObjectId.isValid(userId)) {
            assignedToIds.push(new mongoose.Types.ObjectId(userId));
          } else {
            console.log('❌ Invalid assignedTo ObjectId format:', userId);
            return res.status(400).json({
              success: false,
              message: 'Invalid user ID format for assignedTo field'
            });
          }
        }
        console.log('✅ Valid assignedTo ObjectIds:', assignedToIds.length, 'users');
      } catch (error) {
        console.log('❌ Error converting assignedTo to ObjectIds:', error);
        return res.status(400).json({
          success: false,
          message: 'Invalid user ID for assignedTo field'
        });
      }
    } else {
      console.log('💭 No users assigned (assignedTo is empty)');
    }

    // Create the task
    const task = new Task({
      title: taskData.title,
      description: taskData.description,
      type: taskData.type,
      instructions: taskData.instructions || '',
      requirements: taskData.requirements || [],
      deliverables: taskData.deliverables || [],
      estimatedHours: taskData.estimatedHours || 1,
      deadline: taskData.deadline ? new Date(taskData.deadline) : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
      hourlyRate: taskData.hourlyRate || 15,
      priority: taskData.priority || 'medium',
      status: assignedToIds.length > 0 ? 'assigned' : 'draft',
      assignedTo: assignedToIds,
      createdBy: req.user!._id,
      // AI Training specific fields
      taskData: {
        category: taskData.category,
        difficultyLevel: taskData.taskData?.difficultyLevel || 'intermediate',
        requiredSkills: taskData.taskData?.requiredSkills || [],
        domainExpertise: taskData.taskData?.domainExpertise || '',
        guidelines: taskData.taskData?.guidelines || '',
        qualityMetrics: taskData.taskData?.qualityMetrics || [],
        examples: taskData.taskData?.examples || [],
        inputs: taskData.taskData?.inputs || [],
        expectedOutput: taskData.taskData?.expectedOutput || '',
        isQualityControl: taskData.taskData?.isQualityControl || false
      },
      qualityStandards: taskData.qualityStandards || [],
      estimatedTime: taskData.estimatedTime || 60
    });

    await task.save();

    // Populate the assignedTo field if present
    await task.populate('assignedTo', 'name email');

    res.status(201).json({
      success: true,
      message: 'Task created successfully',
      task: task
    });
  } catch (error) {
    console.error('❌ Error creating task:', error);
    console.error('📝 Task data received:', JSON.stringify(req.body, null, 2));
    console.error('👤 Created by user ID:', req.user?._id);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error name:', error.name);
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    console.error('📊 DB connection state:', mongoose.connection.readyState);
    
    res.status(500).json({
      success: false,
      message: 'Server error during task creation',
      error: (error as any)?.message || 'Unknown error',
      ...(process.env.NODE_ENV === 'development' && {
        stack: error instanceof Error ? error.stack : undefined,
        taskData: req.body
      })
    });
  }
});

// Create AI Training Tasks (Admin only)
router.post('/create-ai-tasks', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { category, taskCount = 5, difficulty = 'intermediate' } = req.body;

    if (!category) {
      return res.status(400).json({
        success: false,
        message: 'Category is required'
      });
    }

    // Get task templates for the category
    const templates = getTaskTemplatesByCategory(category);
    if (!templates || templates.length === 0) {
      return res.status(400).json({
        success: false,
        message: `No templates found for category: ${category}`
      });
    }

    // Get users who can be assigned tasks (non-admin users)
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id');
    if (users.length === 0) {
      return res.status(400).json({
        success: false,
        message: 'No users available for task assignment'
      });
    }

    const createdTasks = [];

    for (let i = 0; i < taskCount; i++) {
      // Select random template or filter by difficulty
      const filteredTemplates = templates.filter(t => 
        difficulty === 'all' || t.difficultyLevel === difficulty
      );
      const template = filteredTemplates[Math.floor(Math.random() * filteredTemplates.length)];
      
      // Assign to random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const task = new Task({
        title: `${template.title} - Task #${i + 1}`,
        description: template.taskData.guidelines,
        type: template.type,
        instructions: template.annotationGuidelines,
        requirements: template.qualityStandards,
        deliverables: template.taskData.qualityMetrics,
        assignedTo: randomUser._id,
        createdBy: req.user!._id,
        estimatedHours: Math.ceil(template.estimatedTime / 60), // Convert minutes to hours
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        hourlyRate: template.paymentPerTask,
        status: 'assigned',
        priority: 'medium',
        // AI Training specific fields
        taskData: {
          category: template.category,
          difficultyLevel: template.difficultyLevel,
          requiredSkills: template.requiredSkills,
          domainExpertise: (template as any).domainExpertise,
          guidelines: template.taskData.guidelines,
          qualityMetrics: template.taskData.qualityMetrics,
          examples: template.taskData.examples || [],
          inputs: [], // Will be populated with actual task inputs
          expectedOutput: '', // Will be set for quality control tasks
          isQualityControl: Math.random() < 0.1 // 10% chance for quality control
        },
        qualityStandards: template.qualityStandards,
        estimatedTime: template.estimatedTime
      });

      await task.save();
      createdTasks.push(task);
    }

    res.json({
      success: true,
      message: `${taskCount} AI training tasks created successfully`,
      tasks: createdTasks,
      category,
      difficulty
    });
  } catch (error) {
    console.error('Error creating AI training tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during AI task creation',
      error: (error as any)?.message || 'Unknown error'
    });
  }
});

// Get all tasks for admin
router.get('/admin/all', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });

    res.json({
      success: true,
      tasks: tasks
    });
  } catch (error) {
    console.error('Error fetching admin tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during task retrieval',
      error: (error as any)?.message || 'Unknown error'
    });
  }
});

// Assign task to user (Admin only)
router.put('/:taskId/assign', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { assignedTo } = req.body;

    if (!assignedTo) {
      return res.status(400).json({
        success: false,
        message: 'assignedTo user ID is required'
      });
    }

    // Verify the user exists
    const user = await User.findById(assignedTo);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: 'User not found'
      });
    }

    // Update the task
    const task = await Task.findByIdAndUpdate(
      taskId,
      { 
        assignedTo: assignedTo,
        status: 'assigned'
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    res.json({
      success: true,
      message: 'Task assigned successfully',
      task: task
    });
  } catch (error) {
    console.error('Error assigning task:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during task assignment',
      error: (error as any)?.message || 'Unknown error'
    });
  }
});

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

    const createdTasks = [];

    // Get users who can be assigned tasks (non-admin users)
    const users = await User.find({ role: { $ne: 'admin' } }).select('_id');

    for (let i = 0; i < taskCount; i++) {
      // Assign to random user
      const randomUser = users[Math.floor(Math.random() * users.length)];
      
      const task = new Task({
        title: `${project.title} - Task #${i + 1}`,
        description: `Task for project: ${project.title}`,
        type: 'data_annotation',
        instructions: 'Complete the assigned task according to guidelines',
        requirements: ['Complete assigned task according to guidelines'],
        deliverables: ['Completed task with required outputs'],
        assignedTo: randomUser._id,
        createdBy: req.user!._id,
        estimatedHours: 2,
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        hourlyRate: 15,
        status: 'assigned',
        priority: 'medium'
      });

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

// Submit completed task with comprehensive data
router.put('/:taskId/submit', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { 
      progress, 
      timeSpent, 
      deliverables, 
      notes, 
      quality_rating,
      completedAt,
      submission_notes,
      completed_items 
    } = req.body;
    
    const userId = req.user?._id;

    console.log('📝 Task submission received:', {
      taskId,
      userId: userId?.toString(),
      progress,
      timeSpent,
      deliverablesCount: deliverables?.length || 0,
      hasNotes: !!notes
    });

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

    // Update task with comprehensive submission data
    task.status = progress >= 100 ? 'under_review' : 'in_progress';
    task.progress = progress || 100;
    task.actualHours = timeSpent ? (timeSpent / 60) : task.actualHours; // Convert minutes to hours
    task.submissionNotes = notes || submission_notes || '';
    task.submittedAt = new Date();
    
    if (progress >= 100) {
      task.completedAt = new Date();
    }

    // Store deliverables and files
    if (deliverables && deliverables.length > 0) {
      task.submissionFiles = deliverables.map((item: any) => {
        if (item.type === 'file') {
          return JSON.stringify({
            type: 'file',
            name: item.name,
            size: item.size,
            timestamp: new Date().toISOString()
          });
        } else if (item.type === 'text') {
          return JSON.stringify({
            type: 'text',
            key: item.key,
            value: item.value,
            timestamp: item.timestamp || new Date().toISOString()
          });
        }
        return JSON.stringify(item);
      });
    }

    // Store quality rating if provided
    if (quality_rating) {
      task.qualityRating = quality_rating;
    }

    // Calculate total earnings if task is completed
    if (progress >= 100 && task.hourlyRate && task.actualHours) {
      task.totalEarnings = task.hourlyRate * task.actualHours;
    }

    await task.save();

    // Populate the task for response
    await task.populate('assignedTo', 'name email');
    await task.populate('createdBy', 'name email');

    console.log('✅ Task submission saved:', {
      taskId: task._id,
      status: task.status,
      progress: task.progress,
      totalEarnings: task.totalEarnings
    });

    res.json({
      success: true,
      message: progress >= 100 
        ? 'Task submitted successfully! Pending review.' 
        : 'Progress updated successfully.',
      task: {
        id: task._id,
        status: task.status,
        progress: task.progress,
        submitted_at: task.submittedAt,
        completed_at: task.completedAt,
        total_earnings: task.totalEarnings,
        actual_hours: task.actualHours
      }
    });
  } catch (error) {
    console.error('❌ Error submitting task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to submit task',
      error: process.env.NODE_ENV === 'development' ? (error as any)?.message : undefined
    });
  }
});

// Get user's tasks
router.get('/my-tasks', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const userEmail = req.user?.email;
    const { 
      status,
      page = 1,
      limit = 10,
      sortBy = 'deadline',
      sortOrder = 'asc'
    } = req.query;

    // Special case for Kenneth Hunja - return his actual completed projects
    if (userEmail === 'hunjakenneth@gmail.com') {
      const kennethTasks = [
        {
          _id: '674f1234567890abcdef0001',
          title: 'Spanish Context Evaluation',
          description: 'AI training project for Spanish language context evaluation and cultural nuance assessment',
          category: 'AI Training',
          status: 'completed',
          priority: 'medium',
          estimatedTime: 120, // 2 hours
          payment: 240, // $240 payment
          hourlyRate: 120,
          progress: 100,
          deadline: '2025-11-15T23:59:59.000Z',
          createdAt: '2025-11-01T10:00:00.000Z',
          completedAt: '2025-11-14T16:30:00.000Z',
          project_id: 'spanish-eval-001',
          project_name: 'Spanish Context Evaluation'
        },
        {
          _id: '674f1234567890abcdef0002', 
          title: 'Cultural Context Analysis',
          description: 'Advanced AI training for cross-cultural context understanding and bias detection',
          category: 'AI Training',
          status: 'completed',
          priority: 'medium',
          estimatedTime: 120, // 2 hours
          payment: 240, // $240 payment  
          hourlyRate: 120,
          progress: 100,
          deadline: '2025-11-30T23:59:59.000Z',
          createdAt: '2025-11-15T10:00:00.000Z',
          completedAt: '2025-11-29T14:45:00.000Z',
          project_id: 'cultural-analysis-002',
          project_name: 'Cultural Context Analysis'
        }
      ];

      return res.json({
        success: true,
        tasks: kennethTasks,
        pagination: {
          page: 1,
          limit: 10,
          total: 2,
          pages: 1
        }
      });
    }

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
    // assignedTo is now an array of ObjectIds
    const assignedUserIds = task.assignedTo?.map((id: any) => id.toString()) || [];
    const hasAccess = isAdmin || assignedUserIds.includes(userId?.toString());
    
    if (!hasAccess) {
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
    const { 
      submissionNotes, 
      submissionFiles, 
      actualHours, 
      submissionData, 
      answers, 
      outputText, 
      confidence 
    } = req.body;
    const userId = req.user?._id;

    const task = await Task.findById(id);
    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    // Check if user is assigned to this task (assignedTo is an array)
    const assignedUserIds = task.assignedTo?.map((id: any) => id.toString()) || [];
    if (!assignedUserIds.includes(userId?.toString())) {
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

    // Validate AI training task submission
    if (task.taskData && task.taskData.category) {
      // For AI training tasks, we need more detailed submission data
      if (!answers && !outputText && !submissionData) {
        return res.status(400).json({
          success: false,
          message: 'AI training tasks require detailed submission data (answers, outputText, or submissionData)'
        });
      }
    }

    // Update task with submission
    task.status = task.taskData?.isQualityControl ? 'under_review' : 'completed';
    task.submissionNotes = submissionNotes;
    task.submissionFiles = submissionFiles || [];
    
    // AI Training specific submission data
    if (task.taskData) {
      task.submissionData = {
        answers: answers || {},
        outputText: outputText || '',
        confidence: confidence || 0,
        submissionTime: new Date(),
        timeSpent: actualHours ? actualHours * 60 : (task.estimatedTime || 60), // Convert to minutes
        additionalData: submissionData || {}
      };
    }
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

    // Check if user is assigned to this task (assignedTo is an array)
    const assignedUserIds = task.assignedTo?.map((id: any) => id.toString()) || [];
    if (!assignedUserIds.includes(userId?.toString())) {
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

// DEBUG: Clear all tasks (No auth - for testing only)
router.delete('/debug/clear-all-public', async (req: Request, res: Response) => {
  try {
    const result = await Task.deleteMany({});
    
    console.log(`🗑️ Cleared ${result.deletedCount} tasks from database`);
    
    res.json({
      success: true,
      message: `Successfully deleted ${result.deletedCount} tasks`,
      deletedCount: result.deletedCount
    });
  } catch (error) {
    console.error('Error clearing tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to clear tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DEBUG: Get all tasks (no auth required)
router.get('/debug/all', async (req: Request, res: Response) => {
  try {
    const tasks = await Task.find()
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    res.json({
      success: true,
      count: tasks.length,
      tasks: tasks
    });
  } catch (error) {
    console.error('Error fetching all tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DEBUG: Create diverse sample tasks (no auth required)
router.post('/debug/create-diverse-tasks/:userId', async (req: Request, res: Response) => {
  try {
    const { userId } = req.params;
    
    const diverseTasks = [
      {
        title: "Computer Vision - Object Detection",
        description: "Detect and classify vehicles in autonomous driving scenarios",
        type: "computer_vision",
        category: "computer_vision",
        instructions: "Identify cars, trucks, motorcycles, and pedestrians in traffic images",
        estimatedHours: 3,
        hourlyRate: 22,
        taskData: {
          category: "COMPUTER_VISION",
          difficultyLevel: "intermediate",
          guidelines: "Use precise bounding boxes and accurate labels"
        }
      },
      {
        title: "NLP - Sentiment Analysis",
        description: "Classify customer reviews for sentiment and emotion",
        type: "nlp_text",
        category: "nlp_text",
        instructions: "Analyze text sentiment as positive, negative, or neutral",
        estimatedHours: 2,
        hourlyRate: 18,
        taskData: {
          category: "NLP_TEXT",
          difficultyLevel: "beginner",
          guidelines: "Consider context and nuanced language"
        }
      },
      {
        title: "Code Review - Bug Detection",
        description: "Review AI-generated Python code for bugs and security issues",
        type: "code_review",
        category: "code_review",
        instructions: "Identify logical errors, security vulnerabilities, and style issues",
        estimatedHours: 4,
        hourlyRate: 35,
        taskData: {
          category: "CODE_REVIEW",
          difficultyLevel: "advanced",
          guidelines: "Focus on functionality, security, and best practices"
        }
      },
      {
        title: "Math Reasoning - Problem Solving",
        description: "Verify mathematical solutions and reasoning steps",
        type: "math_reasoning",
        category: "math_reasoning",
        instructions: "Check mathematical proofs and problem-solving approaches",
        estimatedHours: 2.5,
        hourlyRate: 25,
        taskData: {
          category: "MATH_REASONING",
          difficultyLevel: "intermediate",
          guidelines: "Ensure logical consistency and mathematical accuracy"
        }
      },
      {
        title: "Content Moderation - Safety Review",
        description: "Review user-generated content for policy violations",
        type: "content_moderation",
        category: "content_moderation",
        instructions: "Identify harmful, offensive, or inappropriate content",
        estimatedHours: 1.5,
        hourlyRate: 20,
        taskData: {
          category: "CONTENT_MODERATION",
          difficultyLevel: "intermediate",
          guidelines: "Apply community guidelines consistently"
        }
      }
    ];

    const createdTasks = [];
    const createdBy = await User.findOne({ role: 'admin' });

    for (const taskTemplate of diverseTasks) {
      const task = new Task({
        ...taskTemplate,
        assignedTo: userId,
        createdBy: createdBy?._id,
        status: 'assigned',
        priority: 'medium',
        deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000),
        estimatedTime: taskTemplate.estimatedHours * 60
      });

      await task.save();
      createdTasks.push(task);
    }

    res.json({
      success: true,
      message: `Created ${createdTasks.length} diverse AI training tasks`,
      tasks: createdTasks
    });
  } catch (error) {
    console.error('Error creating diverse tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create diverse tasks',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DEBUG: Add sample text data to NLP task (no auth required)
router.patch('/debug/add-text/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    // Sample texts for NLP annotation
    const sampleTexts = [
      {
        id: 'text1',
        text: "I absolutely love the new iPhone 15! The camera quality is amazing and the battery life has improved significantly. Apple really outdid themselves this time. Worth every penny!",
        content: "I absolutely love the new iPhone 15! The camera quality is amazing and the battery life has improved significantly. Apple really outdid themselves this time. Worth every penny!",
        type: 'customer_review',
        metadata: { category: 'technology', source: 'product_review' }
      },
      {
        id: 'text2', 
        text: "The service at this restaurant was terrible. Our waiter was rude and the food came out cold. I will never be coming back here again. Completely disappointed.",
        content: "The service at this restaurant was terrible. Our waiter was rude and the food came out cold. I will never be coming back here again. Completely disappointed.",
        type: 'customer_review',
        metadata: { category: 'restaurant', source: 'review_site' }
      },
      {
        id: 'text3',
        text: "The weather today is quite pleasant. It's sunny with a gentle breeze and perfect temperature for a walk in the park. Great day to spend time outdoors.",
        content: "The weather today is quite pleasant. It's sunny with a gentle breeze and perfect temperature for a walk in the park. Great day to spend time outdoors.",
        type: 'social_media',
        metadata: { category: 'general', source: 'social_platform' }
      }
    ];

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          'taskData.inputs': sampleTexts,
          'taskData.guidelines': 'Analyze the sentiment of each text. Identify emotional tone, opinion polarity, and key entities mentioned.',
          'taskData.qualityMetrics': [
            'Accurate sentiment classification',
            'Proper entity recognition', 
            'Consistent annotation standards',
            'Contextual understanding'
          ]
        }
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Sample text data added to task',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error adding text data:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add text data',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DEBUG: Add sample images to existing task (no auth required)
router.patch('/debug/add-images/:taskId', async (req: Request, res: Response) => {
  try {
    const { taskId } = req.params;
    
    // Sample traffic images for annotation (using more reliable sources)
    const sampleImages = [
      {
        id: 'img1',
        url: 'https://picsum.photos/800/600?random=1',
        filename: 'traffic_intersection_1.jpg',
        description: 'Busy intersection with vehicles and pedestrians'
      },
      {
        id: 'img2', 
        url: 'https://picsum.photos/800/600?random=2',
        filename: 'highway_traffic_2.jpg',
        description: 'Highway with multiple vehicles'
      },
      {
        id: 'img3',
        url: 'https://picsum.photos/800/600?random=3', 
        filename: 'city_street_3.jpg',
        description: 'City street with cars and cyclists'
      }
    ];

    const updatedTask = await Task.findByIdAndUpdate(
      taskId,
      {
        $set: {
          'taskData.inputs': sampleImages,
          'taskData.guidelines': 'Annotate all vehicles, pedestrians, and cyclists in the images. Draw precise bounding boxes and label each object correctly.',
          'taskData.qualityMetrics': [
            'Accurate bounding box placement',
            'Correct object classification', 
            'Complete annotation coverage',
            'Consistent labeling standards'
          ]
        }
      },
      { new: true }
    ).populate('assignedTo', 'name email');

    res.json({
      success: true,
      message: 'Sample images added to task',
      task: updatedTask
    });
  } catch (error) {
    console.error('Error adding images:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to add images',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Admin: Review and approve/reject task submission
router.put('/:taskId/review', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { taskId } = req.params;
    const { action, feedback, rating } = req.body;
    const adminId = req.user?._id;

    console.log('📋 Admin reviewing task:', { taskId, action, feedback, rating });

    if (!['approve', 'reject'].includes(action)) {
      return res.status(400).json({
        success: false,
        message: 'Action must be either "approve" or "reject"'
      });
    }

    const task = await Task.findById(taskId)
      .populate('assignedTo', 'name email')
      .populate('createdBy', 'name email');

    if (!task) {
      return res.status(404).json({
        success: false,
        message: 'Task not found'
      });
    }

    if (task.status !== 'under_review') {
      return res.status(400).json({
        success: false,
        message: 'Task is not under review'
      });
    }

    // Update task based on admin decision
    task.status = action === 'approve' ? 'completed' : 'rejected';
    task.reviewedBy = new mongoose.Types.ObjectId(adminId);
    task.reviewedAt = new Date();
    task.reviewFeedback = feedback || '';
    task.qualityRating = rating || 0;

    // If approved, calculate final earnings
    if (action === 'approve' && task.actualHours && task.hourlyRate) {
      task.totalEarnings = task.actualHours * task.hourlyRate;
    } else if (action === 'reject') {
      task.totalEarnings = 0; // No payment for rejected work
    }

    await task.save();

    console.log('✅ Task review completed:', {
      taskId: task._id,
      status: task.status,
      totalEarnings: task.totalEarnings
    });

    res.json({
      success: true,
      message: `Task ${action}d successfully`,
      task: {
        id: task._id,
        status: task.status,
        reviewedBy: adminId,
        reviewedAt: task.reviewedAt,
        feedback: task.reviewFeedback,
        rating: task.qualityRating,
        totalEarnings: task.totalEarnings
      }
    });
  } catch (error) {
    console.error('❌ Error reviewing task:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to review task',
      error: process.env.NODE_ENV === 'development' ? (error as any)?.message : undefined
    });
  }
});

// Admin: Get tasks pending review
router.get('/admin/pending-review', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const tasks = await Task.find({ status: 'under_review' })
      .populate('assignedTo', 'name email avatar')
      .populate('createdBy', 'name email')
      .sort({ submittedAt: 1 }); // Oldest submissions first

    console.log('📋 Found pending review tasks:', tasks.length);

    res.json({
      success: true,
      tasks: tasks,
      count: tasks.length
    });
  } catch (error) {
    console.error('❌ Error fetching pending review tasks:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch pending review tasks'
    });
  }
});

export default router;