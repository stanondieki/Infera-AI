import mongoose, { Document, Schema } from 'mongoose';

export interface IOpportunity extends Document {
  _id: string;
  
  // Basic Information
  title: string;
  description: string;
  category: string;
  
  // Compensation
  hourlyRate: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Requirements
  requiredSkills: string[];
  preferredSkills?: string[];
  experienceLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  languages?: string[];
  
  // Work Details
  timeCommitment: {
    hoursPerWeek: {
      min: number;
      max: number;
    };
    duration?: string; // e.g., "3 months", "ongoing"
    timezone?: string;
  };
  
  // Location
  location: 'remote' | 'onsite' | 'hybrid';
  allowedCountries?: string[]; // If location restrictions apply
  
  // Application Details
  applicationDeadline?: Date;
  startDate?: Date;
  maxApplicants?: number;
  currentApplicants: number;
  
  // Status
  status: 'draft' | 'active' | 'paused' | 'closed' | 'filled';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // SEO and Display
  slug: string;
  tags: string[];
  featured: boolean;
  
  // Statistics
  views: number;
  applications: number;
  
  // Creator and Management
  createdBy: mongoose.Types.ObjectId;
  assignedTo?: mongoose.Types.ObjectId; // Admin managing this opportunity
  
  // Timestamps
  publishedAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const OpportunitySchema = new Schema<IOpportunity>({
  // Basic Information
  title: {
    type: String,
    required: [true, 'Title is required'],
    trim: true,
    maxlength: [200, 'Title cannot be more than 200 characters']
  },
  description: {
    type: String,
    required: [true, 'Description is required'],
    trim: true,
    maxlength: [2000, 'Description cannot be more than 2000 characters']
  },
  category: {
    type: String,
    required: [true, 'Category is required'],
    enum: [
      'AI/ML',
      'Software Engineering',
      'Data Science',
      'Writing & Education',
      'Creative',
      'Languages',
      'Quality Assurance',
      'Research',
      'Content Creation',
      'Data Annotation'
    ]
  },
  
  // Compensation
  hourlyRate: {
    min: {
      type: Number,
      required: [true, 'Minimum hourly rate is required'],
      min: [5, 'Minimum hourly rate must be at least $5']
    },
    max: {
      type: Number,
      required: [true, 'Maximum hourly rate is required'],
      min: [5, 'Maximum hourly rate must be at least $5']
    },
    currency: {
      type: String,
      default: 'USD',
      enum: ['USD', 'EUR', 'GBP', 'CAD', 'AUD']
    }
  },
  
  // Requirements
  requiredSkills: [{
    type: String,
    trim: true,
    required: true
  }],
  preferredSkills: [{
    type: String,
    trim: true
  }],
  experienceLevel: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Experience level is required']
  },
  languages: [{
    type: String,
    trim: true
  }],
  
  // Work Details
  timeCommitment: {
    hoursPerWeek: {
      min: {
        type: Number,
        required: [true, 'Minimum hours per week is required'],
        min: [1, 'Minimum hours per week must be at least 1']
      },
      max: {
        type: Number,
        required: [true, 'Maximum hours per week is required'],
        min: [1, 'Maximum hours per week must be at least 1']
      }
    },
    duration: {
      type: String,
      trim: true
    },
    timezone: {
      type: String,
      trim: true
    }
  },
  
  // Location
  location: {
    type: String,
    enum: ['remote', 'onsite', 'hybrid'],
    default: 'remote'
  },
  allowedCountries: [{
    type: String,
    trim: true
  }],
  
  // Application Details
  applicationDeadline: Date,
  startDate: Date,
  maxApplicants: {
    type: Number,
    min: [1, 'Maximum applicants must be at least 1']
  },
  currentApplicants: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Status
  status: {
    type: String,
    enum: ['draft', 'active', 'paused', 'closed', 'filled'],
    default: 'draft'
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // SEO and Display
  slug: {
    type: String,
    trim: true,
    lowercase: true
  },
  tags: [{
    type: String,
    trim: true,
    lowercase: true
  }],
  featured: {
    type: Boolean,
    default: false
  },
  
  // Statistics
  views: {
    type: Number,
    default: 0,
    min: 0
  },
  applications: {
    type: Number,
    default: 0,
    min: 0
  },
  
  // Creator and Management
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  publishedAt: Date
}, {
  timestamps: true
});

// Indexes for faster queries
OpportunitySchema.index({ status: 1 });
OpportunitySchema.index({ category: 1 });
OpportunitySchema.index({ featured: 1 });
OpportunitySchema.index({ priority: 1 });
OpportunitySchema.index({ publishedAt: -1 });
OpportunitySchema.index({ slug: 1 });
OpportunitySchema.index({ tags: 1 });

// Generate slug before saving
OpportunitySchema.pre('save', function(next) {
  if (this.isModified('title') || this.isNew) {
    this.slug = this.title
      .toLowerCase()
      .replace(/[^a-z0-9 -]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  }
  
  // Validate hourly rate range
  if (this.hourlyRate.min > this.hourlyRate.max) {
    next(new Error('Minimum hourly rate cannot be greater than maximum hourly rate'));
  } else {
    next();
  }
});

// Validate time commitment range
OpportunitySchema.pre('save', function(next) {
  if (this.timeCommitment.hoursPerWeek.min > this.timeCommitment.hoursPerWeek.max) {
    next(new Error('Minimum hours per week cannot be greater than maximum hours per week'));
  } else {
    next();
  }
});

export default mongoose.model<IOpportunity>('Opportunity', OpportunitySchema);