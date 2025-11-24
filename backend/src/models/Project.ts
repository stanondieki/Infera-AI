// Project and Task Management System Models

import mongoose from 'mongoose';

// Project Schema - Main container for work
const projectSchema = new mongoose.Schema({
  title: {
    type: String,
    required: true,
    trim: true,
  },
  description: {
    type: String,
    required: true,
  },
  category: {
    type: String,
    required: true,
    enum: ['AI_TRAINING', 'DATA_ANNOTATION', 'CONTENT_MODERATION', 'MODEL_EVALUATION', 'TRANSCRIPTION', 'TRANSLATION'],
  },
  subcategory: {
    type: String, // e.g., 'Conversational AI', 'Image Classification', etc.
  },
  
  // Project Details
  totalBudget: {
    type: Number,
    required: true,
  },
  paymentPerTask: {
    type: Number,
    required: true,
  },
  estimatedHours: {
    type: Number,
    required: true,
  },
  
  // Timeline
  startDate: {
    type: Date,
    default: Date.now,
  },
  deadline: {
    type: Date,
    required: true,
  },
  
  // Requirements
  requiredSkills: [{
    skill: String,
    level: {
      type: String,
      enum: ['BEGINNER', 'INTERMEDIATE', 'ADVANCED', 'EXPERT'],
    },
  }],
  qualifications: [{
    type: String, // e.g., 'Native English', 'PhD in AI', etc.
  }],
  minimumAccuracy: {
    type: Number,
    default: 90, // Minimum accuracy percentage required
  },
  
  // Task Configuration
  tasksPerBatch: {
    type: Number,
    default: 10, // How many tasks to assign at once
  },
  maxTasksPerUser: {
    type: Number,
    default: 100, // Maximum tasks one user can do
  },
  reviewRequired: {
    type: Boolean,
    default: true, // Whether tasks need admin review
  },
  
  // Status & Tracking
  status: {
    type: String,
    enum: ['DRAFT', 'ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'DRAFT',
  },
  priority: {
    type: String,
    enum: ['LOW', 'MEDIUM', 'HIGH', 'URGENT'],
    default: 'MEDIUM',
  },
  
  // Progress Tracking
  totalTasks: {
    type: Number,
    default: 0,
  },
  completedTasks: {
    type: Number,
    default: 0,
  },
  approvedTasks: {
    type: Number,
    default: 0,
  },
  rejectedTasks: {
    type: Number,
    default: 0,
  },
  
  // Assignment Settings
  assignmentMethod: {
    type: String,
    enum: ['AUTO', 'MANUAL', 'APPLICATION_BASED'],
    default: 'AUTO',
  },
  maxConcurrentWorkers: {
    type: Number,
    default: 10,
  },
  
  // Created by (Admin/Client)
  createdBy: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  
  // Instructions and Guidelines
  instructions: {
    type: String,
    required: true,
  },
  examples: [{
    description: String,
    correctAnswer: String,
    explanation: String,
  }],
  
  // Quality Control
  qualityControlSamples: [{
    taskData: mongoose.Schema.Types.Mixed,
    correctAnswer: mongoose.Schema.Types.Mixed,
    difficulty: {
      type: String,
      enum: ['EASY', 'MEDIUM', 'HARD'],
    },
  }],
  
}, {
  timestamps: true,
});

// Individual Task Schema
const taskSchema = new mongoose.Schema({
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  
  // Task Identity
  taskNumber: {
    type: Number,
    required: true,
  },
  batchId: {
    type: String, // Groups of tasks assigned together
  },
  
  // Task Data
  data: {
    type: mongoose.Schema.Types.Mixed, // Flexible schema for different task types
    required: true,
  },
  instructions: {
    type: String,
    required: true,
  },
  
  // Assignment
  assignedTo: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    default: null,
  },
  assignedAt: {
    type: Date,
  },
  
  // Status Tracking
  status: {
    type: String,
    enum: ['PENDING', 'ASSIGNED', 'IN_PROGRESS', 'SUBMITTED', 'UNDER_REVIEW', 'APPROVED', 'REJECTED', 'EXPIRED'],
    default: 'PENDING',
  },
  
  // Timing
  timeLimit: {
    type: Number, // Minutes allowed for completion
    default: 30,
  },
  startedAt: {
    type: Date,
  },
  submittedAt: {
    type: Date,
  },
  reviewedAt: {
    type: Date,
  },
  
  // Submission
  submission: {
    answer: mongoose.Schema.Types.Mixed,
    timeSpent: Number, // Milliseconds
    confidence: Number, // User's confidence level 1-5
    notes: String,
  },
  
  // Review
  review: {
    reviewedBy: {
      type: mongoose.Schema.Types.ObjectId,
      ref: 'User',
    },
    status: {
      type: String,
      enum: ['APPROVED', 'REJECTED', 'NEEDS_REVISION'],
    },
    score: {
      type: Number, // 0-100
    },
    feedback: String,
    reviewNotes: String,
  },
  
  // Quality Control
  isQualityCheck: {
    type: Boolean,
    default: false,
  },
  expectedAnswer: {
    type: mongoose.Schema.Types.Mixed, // For quality control tasks
  },
  
  // Payment
  payment: {
    amount: Number,
    status: {
      type: String,
      enum: ['PENDING', 'APPROVED', 'PAID', 'DISPUTED'],
      default: 'PENDING',
    },
    paidAt: Date,
  },
  
}, {
  timestamps: true,
});

// Task Assignment Queue Schema
const taskAssignmentSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'User',
    required: true,
  },
  projectId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Project',
    required: true,
  },
  
  // Assignment Details
  taskIds: [{
    type: mongoose.Schema.Types.ObjectId,
    ref: 'Task',
  }],
  batchSize: {
    type: Number,
    default: 10,
  },
  
  // Status
  status: {
    type: String,
    enum: ['ACTIVE', 'PAUSED', 'COMPLETED', 'CANCELLED'],
    default: 'ACTIVE',
  },
  
  // Performance Tracking
  accuracy: {
    type: Number,
    default: 0,
  },
  averageTime: {
    type: Number, // Average time per task in minutes
    default: 0,
  },
  tasksCompleted: {
    type: Number,
    default: 0,
  },
  qualityScore: {
    type: Number,
    default: 0,
  },
  
}, {
  timestamps: true,
});

// Indexes for performance
projectSchema.index({ category: 1, status: 1 });
projectSchema.index({ createdBy: 1 });
projectSchema.index({ deadline: 1 });

taskSchema.index({ projectId: 1, status: 1 });
taskSchema.index({ assignedTo: 1, status: 1 });
taskSchema.index({ status: 1, assignedAt: 1 });

taskAssignmentSchema.index({ userId: 1, projectId: 1 });
taskAssignmentSchema.index({ status: 1 });

export const Project = mongoose.model('Project', projectSchema);
export const ProjectTask = mongoose.model('ProjectTask', taskSchema);
export const TaskAssignment = mongoose.model('TaskAssignment', taskAssignmentSchema);