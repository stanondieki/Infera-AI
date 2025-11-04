import express, { Request, Response } from 'express';
import mongoose from 'mongoose';
import { Opportunity, IOpportunity } from '../models';
import { validateOpportunity } from '../middleware/validation';
import { authenticateToken, requireAdmin, AuthRequest, optionalAuth } from '../middleware/auth';
import { apiLimiter } from '../middleware/rateLimiter';

const router = express.Router();

// Get all opportunities (public endpoint with optional auth)
router.get('/', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const {
      category,
      status = 'active',
      featured,
      experienceLevel,
      minRate,
      maxRate,
      location = 'remote',
      page = 1,
      limit = 12,
      sortBy = 'publishedAt',
      sortOrder = 'desc',
      search
    } = req.query;

    // Build query
    const query: any = { status };
    
    if (category && category !== 'All') {
      query.category = category;
    }
    
    if (featured !== undefined) {
      query.featured = featured === 'true';
    }
    
    if (experienceLevel) {
      query.experienceLevel = experienceLevel;
    }
    
    if (location && location !== 'all') {
      query.location = location;
    }
    
    if (minRate || maxRate) {
      query['hourlyRate.min'] = {};
      if (minRate) query['hourlyRate.min'].$gte = Number(minRate);
      if (maxRate) query['hourlyRate.max'] = { $lte: Number(maxRate) };
    }
    
    if (search) {
      query.$text = { $search: search as string };
    }

    // Build sort
    const sort: any = {};
    sort[sortBy as string] = sortOrder === 'asc' ? 1 : -1;

    const skip = (Number(page) - 1) * Number(limit);

    const opportunities = await Opportunity.find(query)
      .populate('createdBy', 'name')
      .sort(sort)
      .skip(skip)
      .limit(Number(limit));

    const total = await Opportunity.countDocuments(query);

    // Increment view counts if user is viewing
    if (opportunities.length > 0) {
      await Opportunity.updateMany(
        { _id: { $in: opportunities.map(o => o._id) } },
        { $inc: { views: 1 } }
      );
    }

    res.json({
      success: true,
      opportunities,
      pagination: {
        page: Number(page),
        limit: Number(limit),
        total,
        pages: Math.ceil(total / Number(limit))
      }
    });
  } catch (error) {
    console.error('Get opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get featured opportunities
router.get('/featured', async (req: Request, res: Response) => {
  try {
    const opportunities = await Opportunity.find({
      status: 'active',
      featured: true
    })
    .populate('createdBy', 'name')
    .sort({ priority: -1, publishedAt: -1 })
    .limit(6);

    res.json({
      success: true,
      opportunities
    });
  } catch (error) {
    console.error('Get featured opportunities error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Get single opportunity by ID or slug
router.get('/:identifier', optionalAuth, async (req: AuthRequest, res: Response) => {
  try {
    const { identifier } = req.params;
    
    // Try to find by ID first, then by slug
    let opportunity = await Opportunity.findById(identifier)
      .populate('createdBy', 'name email');
    
    if (!opportunity) {
      opportunity = await Opportunity.findOne({ slug: identifier })
        .populate('createdBy', 'name email');
    }

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    // Increment view count
    opportunity.views += 1;
    await opportunity.save();

    res.json({
      success: true,
      opportunity
    });
  } catch (error) {
    console.error('Get opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

// Create new opportunity (Admin only)
router.post('/', authenticateToken, requireAdmin, validateOpportunity, async (req: AuthRequest, res: Response) => {
  try {
    const opportunityData = {
      ...req.body,
      createdBy: req.user?._id
    };

    const opportunity = new Opportunity(opportunityData);
    await opportunity.save();

    const populatedOpportunity = await Opportunity.findById(opportunity._id)
      .populate('createdBy', 'name email');

    res.status(201).json({
      success: true,
      message: 'Opportunity created successfully',
      opportunity: populatedOpportunity
    });
  } catch (error) {
    console.error('Create opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during opportunity creation'
    });
  }
});

// Update opportunity (Admin only)
router.put('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;
    const updates = req.body;

    // Remove fields that shouldn't be updated directly
    delete updates.createdBy;
    delete updates._id;
    delete updates.createdAt;
    delete updates.views;
    delete updates.applications;

    const opportunity = await Opportunity.findByIdAndUpdate(
      id,
      updates,
      { new: true, runValidators: true }
    ).populate('createdBy', 'name email');

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity updated successfully',
      opportunity
    });
  } catch (error) {
    console.error('Update opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during opportunity update'
    });
  }
});

// Delete opportunity (Admin only)
router.delete('/:id', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const { id } = req.params;

    const opportunity = await Opportunity.findByIdAndDelete(id);

    if (!opportunity) {
      return res.status(404).json({
        success: false,
        message: 'Opportunity not found'
      });
    }

    res.json({
      success: true,
      message: 'Opportunity deleted successfully'
    });
  } catch (error) {
    console.error('Delete opportunity error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during opportunity deletion'
    });
  }
});

// Get opportunity statistics (Admin only)
router.get('/stats/overview', authenticateToken, requireAdmin, async (req: AuthRequest, res: Response) => {
  try {
    const stats = await Opportunity.aggregate([
      {
        $group: {
          _id: '$status',
          count: { $sum: 1 }
        }
      }
    ]);

    const categoryStats = await Opportunity.aggregate([
      {
        $match: { status: 'active' }
      },
      {
        $group: {
          _id: '$category',
          count: { $sum: 1 },
          avgRate: { $avg: { $avg: ['$hourlyRate.min', '$hourlyRate.max'] } }
        }
      }
    ]);

    const totalOpportunities = await Opportunity.countDocuments();
    const activeOpportunities = await Opportunity.countDocuments({ status: 'active' });
    const featuredOpportunities = await Opportunity.countDocuments({ 
      status: 'active', 
      featured: true 
    });

    const statusStats = stats.reduce((acc, stat) => {
      acc[stat._id] = stat.count;
      return acc;
    }, {} as Record<string, number>);

    res.json({
      success: true,
      stats: {
        total: totalOpportunities,
        active: activeOpportunities,
        featured: featuredOpportunities,
        draft: statusStats.draft || 0,
        paused: statusStats.paused || 0,
        closed: statusStats.closed || 0,
        filled: statusStats.filled || 0,
        categories: categoryStats
      }
    });
  } catch (error) {
    console.error('Get opportunity stats error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error'
    });
  }
});

export default router;