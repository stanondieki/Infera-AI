import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  
  // Basic Information
  title: string;
  description: string;
  type: 'code_review' | 'data_annotation' | 'content_creation' | 'prompt_engineering' | 'quality_assurance' | 'research' | 'other';
  
  // Assignment
  assignedTo: mongoose.Types.ObjectId;
  createdBy: mongoose.Types.ObjectId;
  opportunityId?: mongoose.Types.ObjectId;
  
  // Task Details
  instructions: string;
  requirements: string[];
  deliverables: string[];
  attachments?: string[]; // File URLs or paths
  
  // Timing
  estimatedHours: number;
  deadline: Date;
  startedAt?: Date;
  completedAt?: Date;
  
  // Status and Progress
  status: 'assigned' | 'in_progress' | 'completed' | 'under_review' | 'approved' | 'rejected' | 'cancelled';
  progress: number; // 0-100
  priority: 'low' | 'medium' | 'high' | 'urgent';
  
  // Submission
  submissionNotes?: string;
  submissionFiles?: string[];
  submittedAt?: Date;
  
  // Review
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  revisionRequested?: boolean;
  revisionNotes?: string;
  
  // Payment
  hourlyRate: number;
  actualHours?: number;
  totalEarnings?: number;
  paymentStatus: 'pending' | 'processing' | 'paid' | 'disputed';
  paidAt?: Date;
  
  // Quality Metrics
  rating?: number; // 1-5 stars
  feedback?: string;
  
  // Timestamps
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
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
  type: {
    type: String,
    enum: ['code_review', 'data_annotation', 'content_creation', 'prompt_engineering', 'quality_assurance', 'research', 'other'],
    required: [true, 'Task type is required']
  },
  
  // Assignment
  assignedTo: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Task must be assigned to a user']
  },
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: [true, 'Creator is required']
  },
  opportunityId: {
    type: Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  
  // Task Details
  instructions: {
    type: String,
    required: [true, 'Instructions are required'],
    trim: true,
    maxlength: [5000, 'Instructions cannot be more than 5000 characters']
  },
  requirements: [{
    type: String,
    trim: true,
    required: true
  }],
  deliverables: [{
    type: String,
    trim: true,
    required: true
  }],
  attachments: [{
    type: String,
    trim: true
  }],
  
  // Timing
  estimatedHours: {
    type: Number,
    required: [true, 'Estimated hours is required'],
    min: [0.5, 'Estimated hours must be at least 0.5'],
    max: [200, 'Estimated hours cannot exceed 200']
  },
  deadline: {
    type: Date,
    required: [true, 'Deadline is required']
  },
  startedAt: Date,
  completedAt: Date,
  
  // Status and Progress
  status: {
    type: String,
    enum: ['assigned', 'in_progress', 'completed', 'under_review', 'approved', 'rejected', 'cancelled'],
    default: 'assigned'
  },
  progress: {
    type: Number,
    default: 0,
    min: [0, 'Progress cannot be less than 0'],
    max: [100, 'Progress cannot be more than 100']
  },
  priority: {
    type: String,
    enum: ['low', 'medium', 'high', 'urgent'],
    default: 'medium'
  },
  
  // Submission
  submissionNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Submission notes cannot be more than 1000 characters']
  },
  submissionFiles: [{
    type: String,
    trim: true
  }],
  submittedAt: Date,
  
  // Review
  reviewNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Review notes cannot be more than 1000 characters']
  },
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  revisionRequested: {
    type: Boolean,
    default: false
  },
  revisionNotes: {
    type: String,
    trim: true,
    maxlength: [1000, 'Revision notes cannot be more than 1000 characters']
  },
  
  // Payment
  hourlyRate: {
    type: Number,
    required: [true, 'Hourly rate is required'],
    min: [5, 'Hourly rate must be at least $5']
  },
  actualHours: {
    type: Number,
    min: [0, 'Actual hours cannot be negative']
  },
  totalEarnings: {
    type: Number,
    min: [0, 'Total earnings cannot be negative']
  },
  paymentStatus: {
    type: String,
    enum: ['pending', 'processing', 'paid', 'disputed'],
    default: 'pending'
  },
  paidAt: Date,
  
  // Quality Metrics
  rating: {
    type: Number,
    min: [1, 'Rating must be at least 1'],
    max: [5, 'Rating cannot be more than 5']
  },
  feedback: {
    type: String,
    trim: true,
    maxlength: [500, 'Feedback cannot be more than 500 characters']
  }
}, {
  timestamps: true
});

// Indexes for faster queries
TaskSchema.index({ assignedTo: 1 });
TaskSchema.index({ createdBy: 1 });
TaskSchema.index({ status: 1 });
TaskSchema.index({ priority: 1 });
TaskSchema.index({ deadline: 1 });
TaskSchema.index({ paymentStatus: 1 });
TaskSchema.index({ opportunityId: 1 });

// Calculate total earnings when actual hours is set
TaskSchema.pre('save', function(next) {
  if (this.actualHours && this.hourlyRate) {
    this.totalEarnings = this.actualHours * this.hourlyRate;
  }
  
  // Auto-set completion date when status changes to completed
  if (this.isModified('status') && this.status === 'completed' && !this.completedAt) {
    this.completedAt = new Date();
  }
  
  // Auto-set started date when status changes to in_progress
  if (this.isModified('status') && this.status === 'in_progress' && !this.startedAt) {
    this.startedAt = new Date();
  }
  
  next();
});

export default mongoose.model<ITask>('Task', TaskSchema);