import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  _id: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  dateOfBirth: Date;
  
  // Location
  country: string;
  city: string;
  timezone: string;
  
  // Professional Information
  experience: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  skills: string[];
  languages: string[];
  availability: number; // hours per week
  motivation: string; // bio/why join
  
  // Work Preferences
  preferredCategories: string[];
  expectedHourlyRate: {
    min: number;
    max: number;
  };
  
  // Portfolio/Links
  portfolio?: string;
  github?: string;
  linkedin?: string;
  resume?: string;
  
  // Application Status
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  reviewNotes?: string;
  
  // Associated user (if accepted)
  userId?: mongoose.Types.ObjectId;
  
  // Timestamps
  submittedAt: Date;
  createdAt: Date;
  updatedAt: Date;
}

const ApplicationSchema = new Schema<IApplication>({
  // Personal Information
  firstName: {
    type: String,
    required: [true, 'First name is required'],
    trim: true,
    maxlength: [50, 'First name cannot be more than 50 characters']
  },
  lastName: {
    type: String,
    required: [true, 'Last name is required'],
    trim: true,
    maxlength: [50, 'Last name cannot be more than 50 characters']
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    trim: true,
    lowercase: true,
    match: [/^\w+([.-]?\w+)*@\w+([.-]?\w+)*(\.\w{2,3})+$/, 'Please enter a valid email']
  },
  phone: {
    type: String,
    required: [true, 'Phone number is required'],
    trim: true
  },
  dateOfBirth: {
    type: Date,
    required: [true, 'Date of birth is required']
  },
  
  // Location
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    required: [true, 'City is required'],
    trim: true
  },
  timezone: {
    type: String,
    required: [true, 'Timezone is required'],
    trim: true
  },
  
  // Professional Information
  experience: {
    type: String,
    enum: ['beginner', 'intermediate', 'advanced', 'expert'],
    required: [true, 'Experience level is required']
  },
  skills: [{
    type: String,
    trim: true,
    required: true
  }],
  languages: [{
    type: String,
    trim: true,
    required: true
  }],
  availability: {
    type: Number,
    required: [true, 'Availability is required'],
    min: [1, 'Availability must be at least 1 hour per week'],
    max: [168, 'Availability cannot exceed 168 hours per week']
  },
  motivation: {
    type: String,
    required: [true, 'Motivation is required'],
    minlength: [50, 'Motivation must be at least 50 characters'],
    maxlength: [1000, 'Motivation cannot be more than 1000 characters']
  },
  
  // Work Preferences
  preferredCategories: [{
    type: String,
    enum: [
      'AI/ML',
      'Software Engineering',
      'Data Science',
      'Writing & Education',
      'Creative',
      'Languages',
      'Quality Assurance',
      'Research'
    ]
  }],
  expectedHourlyRate: {
    min: {
      type: Number,
      required: [true, 'Minimum expected hourly rate is required'],
      min: [5, 'Minimum hourly rate must be at least $5']
    },
    max: {
      type: Number,
      required: [true, 'Maximum expected hourly rate is required'],
      min: [5, 'Maximum hourly rate must be at least $5']
    }
  },
  
  // Portfolio/Links
  portfolio: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  linkedin: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  
  // Application Status
  status: {
    type: String,
    enum: ['pending', 'reviewing', 'accepted', 'rejected'],
    default: 'pending'
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  reviewNotes: {
    type: String,
    maxlength: [500, 'Review notes cannot be more than 500 characters']
  },
  
  // Associated user (if accepted)
  userId: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  
  // Timestamps
  submittedAt: {
    type: Date,
    default: Date.now
  }
}, {
  timestamps: true
});

// Indexes for faster queries
ApplicationSchema.index({ email: 1 });
ApplicationSchema.index({ status: 1 });
ApplicationSchema.index({ submittedAt: -1 });
ApplicationSchema.index({ reviewedAt: -1 });

// Validate hourly rate range
ApplicationSchema.pre('save', function(next) {
  if (this.expectedHourlyRate.min > this.expectedHourlyRate.max) {
    next(new Error('Minimum hourly rate cannot be greater than maximum hourly rate'));
  } else {
    next();
  }
});

export default mongoose.model<IApplication>('Application', ApplicationSchema);