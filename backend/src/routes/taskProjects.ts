// Task Management API Routes
import express, { Request, Response } from 'express';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';
import { Project, ProjectTask, TaskAssignment } from '../models/Project';
import { TaskAssignmentService } from '../services/taskAssignmentService';
import { body, validationResult, param, query } from 'express-validator';

const router = express.Router();
const taskAssignmentService = new TaskAssignmentService();

/**
 * TEST AUTHENTICATION
 * GET /api/task-projects/auth-test
 */
router.get('/auth-test', authenticateToken, async (req: AuthRequest, res: Response) => {
  res.json({
    success: true,
    message: 'Authentication successful',
    user: {
      id: req.user?._id,
      name: req.user?.name,
      email: req.user?.email,
      role: req.user?.role,
    },
  });
});

/**
 * GET PROJECT TEMPLATES (Public endpoint)
 * GET /api/task-projects/templates
 */
router.get('/templates', async (req: Request, res: Response) => {
  try {
    const { REALISTIC_PROJECT_TEMPLATES, PROJECT_CATEGORIES } = await import('../data/projectTemplates');
    
    res.json({
      success: true,
      templates: REALISTIC_PROJECT_TEMPLATES,
      categories: PROJECT_CATEGORIES,
    });
  } catch (error) {
    console.error('Error fetching templates:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch project templates',
    });
  }
});

/**
 * CREATE REALISTIC PROJECT FROM TEMPLATE
 * POST /api/task-projects/from-template
 */
router.post('/from-template',
  requireAdmin,
  [
    body('templateIndex').optional().isInt({ min: 0 }).withMessage('Invalid template index'),
    body('customData').optional().isObject().withMessage('Custom data must be an object'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { templateIndex, customData } = req.body;
      const enhancedCustomData = {
        ...customData,
        createdBy: req.user._id
      };
      const project = await taskAssignmentService.createRealisticProject(templateIndex, enhancedCustomData);

      res.status(201).json({
        success: true,
        message: 'Realistic project created successfully',
        project,
      });
    } catch (error) {
      console.error('Error creating realistic project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create realistic project',
      });
    }
  }
);

/**
 * SEED REALISTIC PROJECTS (Admin only)
 * POST /api/task-projects/seed
 */
router.post('/seed',
  requireAdmin,
  [body('count').optional().isInt({ min: 1, max: 20 }).withMessage('Count must be between 1 and 20')],
  async (req: AuthRequest, res: Response) => {
    try {
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

  const count = req.body.count || 5;
  // Pass the requesting admin's id so created projects have a valid owner
  const projects = await taskAssignmentService.seedRealisticProjects(count, req.user._id);

      res.json({
        success: true,
        message: `${projects.length} realistic projects created successfully`,
        projects,
      });
    } catch (error) {
      console.error('Error seeding projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to seed realistic projects',
      });
    }
  }
);

/**
 * CREATE PROJECT (Admin only)
 * POST /api/task-projects
 */
router.post('/',
  requireAdmin,
  [
    body('title').isLength({ min: 1 }).withMessage('Title is required'),
    body('description').isLength({ min: 1 }).withMessage('Description is required'),
    body('category').isIn(['AI_TRAINING', 'DATA_ANNOTATION', 'CONTENT_MODERATION', 'MODEL_EVALUATION', 'TRANSCRIPTION', 'TRANSLATION']).withMessage('Invalid category'),
    body('totalBudget').isNumeric().withMessage('Total budget must be a number'),
    body('paymentPerTask').isNumeric().withMessage('Payment per task must be a number'),
    body('deadline').isISO8601().withMessage('Invalid deadline date'),
    body('instructions').isLength({ min: 1 }).withMessage('Instructions are required'),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const project = await taskAssignmentService.createProject(req.body, req.user.id);

      res.status(201).json({
        success: true,
        message: 'Project created successfully',
        project,
      });
    } catch (error) {
      console.error('Error creating project:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to create project',
      });
    }
  }
);

/**
 * GET ALL PROJECTS (Admin only)
 * GET /api/task-projects
 */
router.get('/',
  requireAdmin,
  [
    query('status').optional().isIn(['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED']),
    query('category').optional().isIn(['AI_TRAINING', 'DATA_ANNOTATION', 'CONTENT_MODERATION', 'MODEL_EVALUATION', 'TRANSCRIPTION', 'TRANSLATION']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 100 }).toInt(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, category, page = 1, limit = 20 } = req.query;
      
      const filter: any = {};
      if (status) filter.status = status;
      if (category) filter.category = category;
      
      const projects = await Project.find(filter)
        .populate('createdBy', 'name email')
        .sort({ createdAt: -1 })
        .limit(limit as number)
        .skip(((page as number) - 1) * (limit as number));
      
      const total = await Project.countDocuments(filter);
      
      res.json({
        success: true,
        projects,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / (limit as number)),
        },
      });
    } catch (error) {
      console.error('Error fetching projects:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch projects',
      });
    }
  }
);

/**
 * GET USER'S ASSIGNED TASKS
 * GET /api/task-projects/my-tasks
 */
router.get('/my-tasks',
  authenticateToken,
  [
    query('status').optional().isIn(['ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED']),
    query('page').optional().isInt({ min: 1 }).toInt(),
    query('limit').optional().isInt({ min: 1, max: 50 }).toInt(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const { status, page = 1, limit = 10 } = req.query;
      
      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const filter: any = { assignedTo: req.user.id };
      if (status) filter.status = status;
      
      const tasks = await ProjectTask.find(filter)
        .populate('projectId', 'title category paymentPerTask instructions')
        .sort({ assignedAt: -1 })
        .limit(limit as number)
        .skip(((page as number) - 1) * (limit as number));
      
      const total = await ProjectTask.countDocuments(filter);
      
      res.json({
        success: true,
        tasks,
        pagination: {
          page,
          limit,
          total,
          pages: Math.ceil(total / (limit as number)),
        },
      });
    } catch (error) {
      console.error('Error fetching user tasks:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to fetch tasks',
      });
    }
  }
);

/**
 * START WORKING ON TASK
 * POST /api/task-projects/tasks/:id/start
 */
router.post('/tasks/:id/start',
  authenticateToken,
  [param('id').isMongoId().withMessage('Invalid task ID')],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Invalid task ID',
          errors: errors.array(),
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const task = await ProjectTask.findOne({
        _id: req.params.id,
        assignedTo: req.user.id,
        status: 'ASSIGNED',
      }).populate('projectId');

      if (!task) {
        return res.status(404).json({
          success: false,
          message: 'Task not found or not available',
        });
      }

      task.status = 'IN_PROGRESS';
      task.startedAt = new Date();
      await task.save();

      res.json({
        success: true,
        message: 'Task started successfully',
        task,
      });
    } catch (error) {
      console.error('Error starting task:', error);
      res.status(500).json({
        success: false,
        message: 'Failed to start task',
      });
    }
  }
);

/**
 * SUBMIT TASK
 * POST /api/task-projects/tasks/:id/submit
 */
router.post('/tasks/:id/submit',
  authenticateToken,
  [
    param('id').isMongoId().withMessage('Invalid task ID'),
    body('answer').exists().withMessage('Answer is required'),
    body('confidence').optional().isInt({ min: 1, max: 5 }),
    body('notes').optional().isString(),
  ],
  async (req: AuthRequest, res: Response) => {
    try {
      const errors = validationResult(req);
      if (!errors.isEmpty()) {
        return res.status(400).json({
          success: false,
          message: 'Validation errors',
          errors: errors.array(),
        });
      }

      if (!req.user) {
        return res.status(401).json({
          success: false,
          message: 'Authentication required',
        });
      }

      const { answer, confidence, notes } = req.body;
      
      const task = await taskAssignmentService.submitTask(
        req.params.id,
        req.user.id,
        { answer, confidence, notes }
      );

      res.json({
        success: true,
        message: 'Task submitted successfully',
        task,
      });
    } catch (error) {
      console.error('Error submitting task:', error);
      res.status(400).json({
        success: false,
        message: error instanceof Error ? error.message : 'Failed to submit task',
      });
    }
  }
);

export default router;