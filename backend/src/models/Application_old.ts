import mongoose, { Document, Schema } from 'mongoose';

export interface IApplication extends Document {
  _id: string;
  
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city?: string;
  timezone?: string;
  
  // Professional Background
  expertise: string;
  experience: string;
  education: string;
  currentRole: string;
  company?: string;
  industry?: string;
  salary?: string;
  
  // Skills & Preferences
  skills: string[];
  primarySkill?: string;
  learningGoals?: string[];
  projectTypes?: string[];
  
  // Availability & Commitment
  availability: string;
  hoursPerWeek: string;
  startDate?: string;
  timeCommitment?: string;
  workingHours?: string;
  weekendAvailability?: boolean;
  
  // Profile & Portfolio
  bio: string;
  motivation?: string;
  linkedIn?: string;
  portfolio?: string;
  github?: string;
  resume?: string;
  
  // Preferences & Goals
  earningGoals?: string;
  communicationStyle?: string;
  mentorshipInterest?: boolean;
  collaborationPreference?: string;
  
  // Agreement
  agreeToTerms: boolean;
  agreeToNewsletter?: boolean;
  agreeToDataProcessing?: boolean;
  
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
  country: {
    type: String,
    required: [true, 'Country is required'],
    trim: true
  },
  city: {
    type: String,
    trim: true
  },
  timezone: {
    type: String,
    trim: true
  },
  
  // Professional Background
  expertise: {
    type: String,
    required: [true, 'Expertise is required'],
    trim: true
  },
  experience: {
    type: String,
    required: [true, 'Experience is required'],
    trim: true
  },
  education: {
    type: String,
    required: [true, 'Education is required'],
    trim: true
  },
  currentRole: {
    type: String,
    required: [true, 'Current role is required'],
    trim: true
  },
  company: {
    type: String,
    trim: true
  },
  industry: {
    type: String,
    trim: true
  },
  salary: {
    type: String,
    trim: true
  },
  
  // Skills & Preferences
  skills: {
    type: [String],
    required: [true, 'At least one skill is required'],
    validate: {
      validator: function(v: string[]) {
        return v && v.length > 0;
      },
      message: 'At least one skill is required'
    }
  },
  primarySkill: {
    type: String,
    trim: true
  },
  learningGoals: [String],
  projectTypes: [String],
  
  // Availability & Commitment
  availability: {
    type: String,
    required: [true, 'Availability is required'],
    trim: true
  },
  hoursPerWeek: {
    type: String,
    required: [true, 'Hours per week is required'],
    trim: true
  },
  startDate: {
    type: String,
    trim: true
  },
  timeCommitment: {
    type: String,
    trim: true
  },
  workingHours: {
    type: String,
    trim: true
  },
  weekendAvailability: {
    type: Boolean,
    default: false
  },
  
  // Profile & Portfolio
  bio: {
    type: String,
    required: [true, 'Bio is required'],
    trim: true,
    maxlength: [1000, 'Bio cannot be more than 1000 characters']
  },
  motivation: {
    type: String,
    trim: true,
    maxlength: [1000, 'Motivation cannot be more than 1000 characters']
  },
  linkedIn: {
    type: String,
    trim: true
  },
  portfolio: {
    type: String,
    trim: true
  },
  github: {
    type: String,
    trim: true
  },
  resume: {
    type: String,
    trim: true
  },
  
  // Preferences & Goals
  earningGoals: {
    type: String,
    trim: true
  },
  communicationStyle: {
    type: String,
    trim: true
  },
  mentorshipInterest: {
    type: Boolean,
    default: false
  },
  collaborationPreference: {
    type: String,
    trim: true
  },
  
  // Agreement
  agreeToTerms: {
    type: Boolean,
    required: [true, 'You must agree to the terms and conditions']
  },
  agreeToNewsletter: {
    type: Boolean,
    default: false
  },
  agreeToDataProcessing: {
    type: Boolean,
    default: false
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
  reviewNotes: String,
  
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