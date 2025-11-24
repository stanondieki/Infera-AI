import express, { Request, Response } from 'express';
import { Opportunity } from '../models';
import Task from '../models/Task';
import { authenticateToken, requireAdmin, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Get all projects for admin management
router.get('/admin', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const projects = await Opportunity.find()
      .populate('createdBy', 'name email')
      .sort({ createdAt: -1 });
    
    // Add task counts for each project
    const projectsWithStats = await Promise.all(projects.map(async (project: any) => {
      const totalTasks = await Task.countDocuments({ opportunityId: project._id });
      const completedTasks = await Task.countDocuments({ 
        opportunityId: project._id, 
        status: { $in: ['completed', 'approved'] } 
      });
      
      return {
        ...project.toObject(),
        total_tasks: totalTasks,
        completed_tasks: completedTasks,
        totalBudget: project.hourlyRate?.max * (project.timeCommitment?.hoursPerWeek?.max || 40) || 1000,
        paymentPerTask: project.hourlyRate?.min || 25,
        estimatedHours: project.timeCommitment?.hoursPerWeek?.max || 40
      };
    }));
    
    res.json({
      success: true,
      projects: projectsWithStats
    });
  } catch (error) {
    console.error('Error fetching projects for admin:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch projects'
    });
  }
});

// Get active projects for dashboard display
router.get('/active', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    console.log('Fetching active projects...');
    console.log('Current date:', new Date());
    
    // First, let's check all projects
    const allProjects = await Opportunity.find({});
    console.log('Total projects in database:', allProjects.length);
    
    // Check projects with ACTIVE status
    const activeStatusProjects = await Opportunity.find({ status: 'active' });
    console.log('Projects with active status:', activeStatusProjects.length);
    
    // Check the actual query
    const projects = await Opportunity.find({ 
      status: 'active',
      $or: [
        { applicationDeadline: { $gte: new Date() } },
        { applicationDeadline: { $exists: false } }
      ]
    })
      .populate('createdBy', 'name email')
      .sort({ priority: -1, createdAt: -1 })
      .limit(10);
    
    console.log('Found projects:', projects.length);
    
    // Transform to match the frontend Project interface  
    const transformedProjects = projects.map((project: any) => ({
      id: project._id.toString(),
      name: project.title,
      description: project.description,
      category: project.category,
      total_tasks: 50, // Mock data for now
      completed_tasks: Math.floor(Math.random() * 30) + 10, // Mock data
      total_earnings: Math.floor(Math.random() * 2000) + 500, // Mock data
      status: project.status,
      priority: project.priority || 'medium'
    }));
    
    res.json({
      success: true,
      projects: transformedProjects
    });
  } catch (error) {
    console.error('Error fetching active projects:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch active projects'
    });
  }
});

// Create new project (admin only)
router.post('/create', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const {
      title,
      description,
      category,
      subcategory,
      totalBudget,
      paymentPerTask,
      estimatedHours,
      deadline,
      requiredSkills,
      experienceLevel,
      maxParticipants,
      instructions,
      deliverables,
      priority
    } = req.body;

    // Generate slug from title
    const slug = title.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');

    const project = new Opportunity({
      title,
      description,
      category: category || 'AI Training',
      
      // Map budget info to hourlyRate structure
      hourlyRate: {
        min: paymentPerTask || 25,
        max: Math.round((paymentPerTask || 25) * 1.5),
        currency: 'USD'
      },
      
      // Map skills array
      requiredSkills: Array.isArray(requiredSkills) ? requiredSkills : 
        (requiredSkills ? requiredSkills.split(',').map((s: string) => s.trim()) : ['attention to detail']),
      
      // Experience level mapping
      experienceLevel: experienceLevel || 'intermediate',
      
      // Time commitment structure
      timeCommitment: {
        hoursPerWeek: {
          min: Math.floor((estimatedHours || 40) * 0.5),
          max: estimatedHours || 40
        },
        duration: 'Project-based'
      },
      
      // Location and settings
      location: 'remote',
      maxApplicants: maxParticipants || 10,
      currentApplicants: 0,
      
      // Dates
      applicationDeadline: new Date(deadline),
      startDate: new Date(),
      
      // Status and metadata
      status: 'active',
      priority: (priority || 'medium').toLowerCase(),
      featured: false,
      
      // SEO and categorization
      slug: slug,
      tags: [category || 'AI Training', subcategory || 'Data Annotation'].filter(Boolean),
      
      // Admin info
      createdBy: req.user?._id,
      publishedAt: new Date()
    });

    await project.save();
    await project.populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Project created successfully',
      project
    });
  } catch (error) {
    console.error('Error creating project:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to create project',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

export default router;