import mongoose, { Document, Schema } from 'mongoose';

export interface ITask extends Document {
  _id: string;
  title: string;
  description: string;
  type: string;
  assignedTo: mongoose.Types.ObjectId[];  // Array for multiple assignees
  createdBy: mongoose.Types.ObjectId;
  opportunityId?: mongoose.Types.ObjectId;
  instructions: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  deadline: Date;
  status: string;
  priority: string;
  hourlyRate: number;
  actualHours?: number;
  totalEarnings?: number;
  paymentStatus: string;
  progress?: number;
  startedAt?: Date;
  completedAt?: Date;
  submissionNotes?: string;
  submissionFiles?: string[];
  submittedAt?: Date;
  reviewNotes?: string;
  reviewedBy?: mongoose.Types.ObjectId;
  reviewedAt?: Date;
  rating?: number;
  feedback?: string;
  revisionRequested?: boolean;
  revisionNotes?: string;
  // Review system fields
  qualityRating?: number;
  reviewFeedback?: string;
  // AI Training Task specific fields
  taskData?: {
    category: string;
    difficultyLevel: string;
    requiredSkills: string[];
    domainExpertise?: string;
    guidelines: string;
    qualityMetrics: string[];
    examples: any[];
    inputs: any[];
    expectedOutput?: any;
    isQualityControl?: boolean;
  };
  qualityStandards?: string[];
  estimatedTime?: number; // in minutes
  submissionData?: {
    answers: any;
    outputText: string;
    confidence: number;
    submissionTime: Date;
    timeSpent: number; // in minutes
    additionalData: any;
  };
  createdAt: Date;
  updatedAt: Date;
}

const TaskSchema = new Schema<ITask>({
  title: {
    type: String,
    required: true
  },
  description: {
    type: String,
    required: true
  },
  type: {
    type: String,
    required: true
  },
  assignedTo: [{
    type: Schema.Types.ObjectId,
    ref: 'User'
  }],
  createdBy: {
    type: Schema.Types.ObjectId,
    ref: 'User',
    required: true
  },
  opportunityId: {
    type: Schema.Types.ObjectId,
    ref: 'Opportunity'
  },
  instructions: {
    type: String,
    required: true
  },
  requirements: [{
    type: String,
    required: true
  }],
  deliverables: [{
    type: String,
    required: true
  }],
  estimatedHours: {
    type: Number,
    required: true
  },
  deadline: {
    type: Date,
    required: true
  },
  status: {
    type: String,
    default: 'assigned'
  },
  priority: {
    type: String,
    default: 'medium'
  },
  hourlyRate: {
    type: Number,
    required: true
  },
  actualHours: {
    type: Number
  },
  totalEarnings: {
    type: Number
  },
  paymentStatus: {
    type: String,
    default: 'pending'
  },
  progress: {
    type: Number,
    default: 0
  },
  startedAt: Date,
  completedAt: Date,
  submissionNotes: String,
  submissionFiles: [String],
  submittedAt: Date,
  reviewNotes: String,
  reviewedBy: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  reviewedAt: Date,
  rating: Number,
  feedback: String,
  revisionRequested: {
    type: Boolean,
    default: false
  },
  revisionNotes: String,
  // Review system fields
  qualityRating: Number,
  reviewFeedback: String,
  // AI Training Task specific fields
  taskData: {
    category: String,
    difficultyLevel: String,
    requiredSkills: [String],
    domainExpertise: String,
    guidelines: String,
    qualityMetrics: [String],
    examples: [Schema.Types.Mixed],
    inputs: [Schema.Types.Mixed],
    expectedOutput: Schema.Types.Mixed,
    isQualityControl: { type: Boolean, default: false }
  },
  qualityStandards: [String],
  estimatedTime: Number, // in minutes
  submissionData: {
    answers: Schema.Types.Mixed,
    outputText: String,
    confidence: Number,
    submissionTime: Date,
    timeSpent: Number, // in minutes
    additionalData: Schema.Types.Mixed
  }
}, {
  timestamps: true
});

// Simple schema without complex middleware

const Task = mongoose.model<ITask>('Task', TaskSchema);

export default Task;
export { Task };