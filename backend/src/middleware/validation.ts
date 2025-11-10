import { body, validationResult } from 'express-validator';
import { Request, Response, NextFunction } from 'express';

// Handle validation errors
export const handleValidationErrors = (req: Request, res: Response, next: NextFunction) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message: 'Validation failed',
      errors: errors.array()
    });
  }
  next();
};

// User registration validation
export const validateUserRegistration = [
  body('name')
    .trim()
    .notEmpty()
    .withMessage('Name is required')
    .isLength({ min: 2, max: 100 })
    .withMessage('Name must be between 2 and 100 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .isLength({ min: 6 })
    .withMessage('Password must be at least 6 characters long')
    .matches(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/)
    .withMessage('Password must contain at least one lowercase letter, one uppercase letter, and one number'),
  
  handleValidationErrors
];

// User login validation
export const validateUserLogin = [
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('password')
    .notEmpty()
    .withMessage('Password is required'),
  
  handleValidationErrors
];

// Application submission validation
export const validateApplication = [
  body('firstName')
    .trim()
    .notEmpty()
    .withMessage('First name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('First name must be between 2 and 50 characters'),
  
  body('lastName')
    .trim()
    .notEmpty()
    .withMessage('Last name is required')
    .isLength({ min: 2, max: 50 })
    .withMessage('Last name must be between 2 and 50 characters'),
  
  body('email')
    .trim()
    .notEmpty()
    .withMessage('Email is required')
    .isEmail()
    .withMessage('Please provide a valid email')
    .normalizeEmail(),
  
  body('phone')
    .trim()
    .notEmpty()
    .withMessage('Phone number is required'),
  
  body('country')
    .trim()
    .notEmpty()
    .withMessage('Country is required'),
  
  body('expertise')
    .trim()
    .notEmpty()
    .withMessage('Expertise is required'),
  
  body('experience')
    .trim()
    .notEmpty()
    .withMessage('Experience is required'),
  
  body('education')
    .trim()
    .notEmpty()
    .withMessage('Education is required'),
  
  body('currentRole')
    .trim()
    .notEmpty()
    .withMessage('Current role is required'),
  
  body('skills')
    .isArray({ min: 1 })
    .withMessage('At least one skill is required'),
  
  body('availability')
    .trim()
    .notEmpty()
    .withMessage('Availability is required'),
  
  body('hoursPerWeek')
    .trim()
    .notEmpty()
    .withMessage('Hours per week is required'),
  
  body('bio')
    .trim()
    .notEmpty()
    .withMessage('Bio is required')
    .isLength({ min: 10, max: 1000 })
    .withMessage('Bio must be between 10 and 1000 characters'),
  
  body('agreeToTerms')
    .isBoolean()
    .custom((value) => {
      if (!value) {
        throw new Error('You must agree to the terms and conditions');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Opportunity creation validation
export const validateOpportunity = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 10, max: 200 })
    .withMessage('Title must be between 10 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 50, max: 2000 })
    .withMessage('Description must be between 50 and 2000 characters'),
  
  body('category')
    .isIn(['AI/ML', 'Software Engineering', 'Data Science', 'Writing & Education', 'Creative', 'Languages', 'Quality Assurance', 'Research', 'Content Creation', 'Data Annotation'])
    .withMessage('Please select a valid category'),
  
  body('hourlyRate.min')
    .isFloat({ min: 5 })
    .withMessage('Minimum hourly rate must be at least $5'),
  
  body('hourlyRate.max')
    .isFloat({ min: 5 })
    .withMessage('Maximum hourly rate must be at least $5')
    .custom((value, { req }) => {
      if (value < req.body.hourlyRate.min) {
        throw new Error('Maximum hourly rate cannot be less than minimum hourly rate');
      }
      return true;
    }),
  
  body('requiredSkills')
    .isArray({ min: 1 })
    .withMessage('At least one required skill must be specified'),
  
  body('experienceLevel')
    .isIn(['beginner', 'intermediate', 'advanced', 'expert'])
    .withMessage('Please select a valid experience level'),
  
  body('timeCommitment.hoursPerWeek.min')
    .isInt({ min: 1 })
    .withMessage('Minimum hours per week must be at least 1'),
  
  body('timeCommitment.hoursPerWeek.max')
    .isInt({ min: 1 })
    .withMessage('Maximum hours per week must be at least 1')
    .custom((value, { req }) => {
      if (value < req.body.timeCommitment.hoursPerWeek.min) {
        throw new Error('Maximum hours per week cannot be less than minimum hours per week');
      }
      return true;
    }),
  
  handleValidationErrors
];

// Task creation validation
export const validateTask = [
  body('title')
    .trim()
    .notEmpty()
    .withMessage('Title is required')
    .isLength({ min: 5, max: 200 })
    .withMessage('Title must be between 5 and 200 characters'),
  
  body('description')
    .trim()
    .notEmpty()
    .withMessage('Description is required')
    .isLength({ min: 20, max: 2000 })
    .withMessage('Description must be between 20 and 2000 characters'),
  
  body('type')
    .isIn(['code_review', 'data_annotation', 'content_creation', 'prompt_engineering', 'quality_assurance', 'research', 'other'])
    .withMessage('Please select a valid task type'),
  
  body('assignedTo')
    .isMongoId()
    .withMessage('Please provide a valid user ID'),
  
  body('instructions')
    .trim()
    .notEmpty()
    .withMessage('Instructions are required')
    .isLength({ min: 20, max: 5000 })
    .withMessage('Instructions must be between 20 and 5000 characters'),
  
  body('requirements')
    .isArray({ min: 1 })
    .withMessage('At least one requirement must be specified'),
  
  body('deliverables')
    .isArray({ min: 1 })
    .withMessage('At least one deliverable must be specified'),
  
  body('estimatedHours')
    .isFloat({ min: 0.5, max: 200 })
    .withMessage('Estimated hours must be between 0.5 and 200'),
  
  body('deadline')
    .isISO8601()
    .withMessage('Please provide a valid deadline')
    .custom((value) => {
      if (new Date(value) <= new Date()) {
        throw new Error('Deadline must be in the future');
      }
      return true;
    }),
  
  body('hourlyRate')
    .isFloat({ min: 5 })
    .withMessage('Hourly rate must be at least $5'),
  
  handleValidationErrors
];