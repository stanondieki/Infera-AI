import { Router, Request, Response } from 'express';
import { body } from 'express-validator';
import { authenticateToken } from '../middleware/auth';
import { handleValidationErrors } from '../middleware/validation';
import { OpportunityApplication, Opportunity } from '../models';

const router = Router();

// Apply for an opportunity
router.post(
  '/:opportunityId/apply',
  authenticateToken,
  [
    body('coverLetter').optional().isLength({ max: 2000 }).withMessage('Cover letter must be less than 2000 characters'),
    body('portfolioUrl').optional().isURL().withMessage('Portfolio URL must be a valid URL'),
    body('additionalInfo').optional().isLength({ max: 1000 }).withMessage('Additional info must be less than 1000 characters'),
  ],
  handleValidationErrors,
  async (req: Request, res: Response) => {
    try {
      const { opportunityId } = req.params;
      const userId = (req as any).user._id;
      const { coverLetter, portfolioUrl, additionalInfo } = req.body;

      // Check if opportunity exists
      const opportunity = await Opportunity.findById(opportunityId);
      if (!opportunity) {
        return res.status(404).json({ error: 'Opportunity not found' });
      }

      // Check for existing application (duplicate prevention)
      const existingApplication = await OpportunityApplication.findOne({
        userId,
        opportunityId
      });

      if (existingApplication) {
        return res.status(409).json({ 
          error: 'You have already applied to this opportunity',
          applicationId: existingApplication._id,
          appliedAt: existingApplication.createdAt
        });
      }

      // Create new application
      const application = new OpportunityApplication({
        userId,
        opportunityId,
        coverLetter,
        portfolioUrl,
        additionalInfo,
        status: 'pending'
      });

      await application.save();

      res.status(201).json({
        message: 'Application submitted successfully',
        application: {
          id: application._id,
          opportunityId: application.opportunityId,
          status: application.status,
          appliedAt: application.createdAt
        }
      });
    } catch (error) {
      console.error('Error submitting opportunity application:', error);
      
      // Handle unique constraint violation (should not happen due to our check, but just in case)
      if ((error as any).code === 11000) {
        return res.status(409).json({ 
          error: 'You have already applied to this opportunity' 
        });
      }
      
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Get user's applications
router.get(
  '/my-applications',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const userId = (req as any).user._id;
      const page = Math.max(1, parseInt(req.query.page as string) || 1);
      const limit = Math.min(50, Math.max(1, parseInt(req.query.limit as string) || 10));
      const skip = (page - 1) * limit;

      const applications = await OpportunityApplication.find({ userId })
        .populate('opportunityId', 'title company location type salaryRange')
        .sort({ createdAt: -1 })
        .skip(skip)
        .limit(limit);

      const total = await OpportunityApplication.countDocuments({ userId });

      res.json({
        applications,
        pagination: {
          current: page,
          total: Math.ceil(total / limit),
          hasNext: page * limit < total,
          hasPrev: page > 1
        }
      });
    } catch (error) {
      console.error('Error fetching user applications:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Check if user has applied to specific opportunity
router.get(
  '/:opportunityId/check-application',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { opportunityId } = req.params;
      const userId = (req as any).user._id;

      const application = await OpportunityApplication.findOne({
        userId,
        opportunityId
      }).select('_id status createdAt');

      if (application) {
        res.json({
          hasApplied: true,
          application: {
            id: application._id,
            status: application.status,
            appliedAt: application.createdAt
          }
        });
      } else {
        res.json({ hasApplied: false });
      }
    } catch (error) {
      console.error('Error checking application status:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

// Withdraw application
router.delete(
  '/:opportunityId/withdraw',
  authenticateToken,
  async (req: Request, res: Response) => {
    try {
      const { opportunityId } = req.params;
      const userId = (req as any).user._id;

      const application = await OpportunityApplication.findOneAndDelete({
        userId,
        opportunityId,
        status: { $in: ['pending', 'under_review'] } // Only allow withdrawal of non-final applications
      });

      if (!application) {
        return res.status(404).json({ 
          error: 'Application not found or cannot be withdrawn' 
        });
      }

      res.json({ message: 'Application withdrawn successfully' });
    } catch (error) {
      console.error('Error withdrawing application:', error);
      res.status(500).json({ error: 'Internal server error' });
    }
  }
);

export default router;