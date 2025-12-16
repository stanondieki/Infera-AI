#!/usr/bin/env node

/**
 * Quick User Data Seeding Runner
 * 
 * This script provides multiple ways to seed user data:
 * 1. Direct execution with compiled backend
 * 2. API-based seeding via HTTP requests
 * 3. Simple MongoDB insertion
 */

const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple user schema for direct insertion
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: { type: String, default: 'user' },
  bio: String,
  skills: [String],
  languages: [String],
  timezone: String,
  location: String,
  totalEarnings: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  rating: { type: Number, default: 0 },
  reviewCount: { type: Number, default: 0 },
  statistics: {
    totalTasksCompleted: Number,
    totalTasksApproved: Number,
    overallAccuracy: Number
  },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: false },
  approvalStatus: { type: String, enum: ['pending', 'approved', 'rejected'], default: 'pending' },
  joinedDate: { type: Date, default: Date.now },
  lastLoginDate: Date,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const projectSchema = new mongoose.Schema({
  title: String,
  description: String,
  category: String,
  subcategory: String,
  totalBudget: Number,
  paymentPerTask: Number,
  estimatedHours: Number,
  startDate: Date,
  deadline: Date,
  requiredSkills: [String],
  status: String,
  priority: String,
  createdBy: mongoose.Schema.Types.ObjectId,
  assignedUsers: [mongoose.Schema.Types.ObjectId],
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const taskSchema = new mongoose.Schema({
  title: String,
  description: String,
  type: String,
  assignedTo: mongoose.Schema.Types.ObjectId,
  createdBy: mongoose.Schema.Types.ObjectId,
  opportunityId: mongoose.Schema.Types.ObjectId,
  instructions: String,
  requirements: [String],
  deliverables: [String],
  estimatedHours: Number,
  deadline: Date,
  status: String,
  priority: String,
  hourlyRate: Number,
  actualHours: Number,
  totalEarnings: Number,
  paymentStatus: String,
  progress: Number,
  startedAt: Date,
  completedAt: Date,
  submittedAt: Date,
  rating: Number,
  feedback: String,
  qualityRating: Number,
  reviewFeedback: String,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);
const Project = mongoose.model('Project', projectSchema);
const Task = mongoose.model('Task', taskSchema);

// Connect to database
const connectDB = async () => {
  try {
    const uri = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
  } catch (error) {
    console.error('❌ MongoDB connection failed:', error);
    process.exit(1);
  }
};

// Seed data
const seedData = async () => {
  try {
    console.log('🌱 Starting quick user seeding...\n');

    // Create user with hashed password
    const hashedPassword = await bcrypt.hash('kem91fibA1!', 10);
    
    const userData = {
      name: 'William Macy',
      email: 'william.macy.ai@gmail.com',
      password: hashedPassword,
      role: 'user',
      bio: 'Experienced AI trainer with expertise in multilingual models and computer vision.',
      skills: ['Natural Language Processing', 'Computer Vision', 'Data Annotation', 'Model Evaluation'],
      languages: ['English', 'Mandarin', 'Spanish', 'Japanese'],
      timezone: 'America/Los_Angeles',
      location: 'San Francisco, CA',
      totalEarnings: 4940,
      completedTasks: 47,
      rating: 4.8,
      reviewCount: 45,
      statistics: {
        totalTasksCompleted: 47,
        totalTasksApproved: 46,
        overallAccuracy: 97.9
      },
      isActive: true,
      isVerified: true,
      approvalStatus: 'approved',
      joinedDate: new Date('2024-08-15'),
      lastLoginDate: new Date('2024-11-30')
    };

    // Check if user exists
    const existingUser = await User.findOne({ email: userData.email });
    if (existingUser) {
      console.log('⚠️  User already exists, cleaning up...');
      await Task.deleteMany({ assignedTo: existingUser._id });
      await Project.deleteMany({ assignedUsers: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
    }

    // Create user
    const user = new User(userData);
    const savedUser = await user.save();
    console.log(`👤 Created user: ${savedUser.name}`);

    // Sample projects data
    const projectsData = [
      // September 2024 - $1,506
      {
        title: 'Genesis B1 Multilingual Training',
        description: 'Train multilingual language model on diverse conversation patterns.',
        category: 'AI_TRAINING',
        subcategory: 'Conversational AI',
        totalBudget: 650,
        paymentPerTask: 25,
        estimatedHours: 26,
        startDate: new Date('2024-09-02'),
        deadline: new Date('2024-09-15'),
        requiredSkills: ['Natural Language Processing', 'Multilingual'],
        status: 'COMPLETED',
        priority: 'HIGH',
        tasks: [
          { title: 'Spanish Context Evaluation', hours: 8, payment: 200, completedAt: new Date('2024-09-05') },
          { title: 'Mandarin Response Rating', hours: 6, payment: 150, completedAt: new Date('2024-09-08') },
          { title: 'Japanese Flow Analysis', hours: 7, payment: 175, completedAt: new Date('2024-09-12') },
          { title: 'Quality Review', hours: 5, payment: 125, completedAt: new Date('2024-09-15') }
        ]
      },
      {
        title: 'Impala Vision A3 Automotive',
        description: 'Computer vision model training for autonomous systems.',
        category: 'DATA_ANNOTATION',
        subcategory: 'Computer Vision',
        totalBudget: 500,
        paymentPerTask: 20,
        estimatedHours: 25,
        startDate: new Date('2024-09-10'),
        deadline: new Date('2024-09-25'),
        requiredSkills: ['Computer Vision', 'Safety Analysis'],
        status: 'COMPLETED',
        priority: 'MEDIUM',
        tasks: [
          { title: 'Vehicle Detection', hours: 8, payment: 160, completedAt: new Date('2024-09-14') },
          { title: 'Weather Annotation', hours: 6, payment: 120, completedAt: new Date('2024-09-18') },
          { title: 'Edge Case ID', hours: 7, payment: 140, completedAt: new Date('2024-09-22') },
          { title: 'QC Review', hours: 4, payment: 80, completedAt: new Date('2024-09-25') }
        ]
      },
      {
        title: 'Phoenix Eval Rating C2',
        description: 'AI model evaluation across performance dimensions.',
        category: 'MODEL_EVALUATION',
        subcategory: 'Performance Assessment',
        totalBudget: 356,
        paymentPerTask: 18,
        estimatedHours: 20,
        startDate: new Date('2024-09-20'),
        deadline: new Date('2024-09-30'),
        requiredSkills: ['Model Evaluation', 'Critical Analysis'],
        status: 'COMPLETED',
        priority: 'MEDIUM',
        tasks: [
          { title: 'Accuracy Evaluation', hours: 6, payment: 108, completedAt: new Date('2024-09-24') },
          { title: 'Safety Assessment', hours: 5, payment: 90, completedAt: new Date('2024-09-27') },
          { title: 'Helpfulness Rating', hours: 6, payment: 108, completedAt: new Date('2024-09-30') },
          { title: 'Final Report', hours: 3, payment: 50, completedAt: new Date('2024-09-30') }
        ]
      },

      // October 2024 - $2,234 
      {
        title: 'Bulba Gen Complex Reasoning',
        description: 'Advanced generative AI for complex reasoning tasks.',
        category: 'MODEL_EVALUATION',
        subcategory: 'Advanced Reasoning',
        totalBudget: 990,
        paymentPerTask: 30,
        estimatedHours: 33,
        startDate: new Date('2024-10-01'),
        deadline: new Date('2024-10-18'),
        requiredSkills: ['Critical Thinking', 'Logic', 'AI/ML'],
        status: 'COMPLETED',
        priority: 'HIGH',
        tasks: [
          { title: 'Logical Assessment', hours: 10, payment: 300, completedAt: new Date('2024-10-06') },
          { title: 'Problem Solving Eval', hours: 8, payment: 240, completedAt: new Date('2024-10-10') },
          { title: 'Scenario Testing', hours: 9, payment: 270, completedAt: new Date('2024-10-15') },
          { title: 'Performance Analysis', hours: 6, payment: 180, completedAt: new Date('2024-10-18') }
        ]
      },
      {
        title: 'Flamingo Multimodal B6',
        description: 'Multimodal AI training with text, image, and audio.',
        category: 'AI_TRAINING',
        subcategory: 'Multimodal AI',
        totalBudget: 800,
        paymentPerTask: 28,
        estimatedHours: 29,
        startDate: new Date('2024-10-08'),
        deadline: new Date('2024-10-25'),
        requiredSkills: ['Multimodal AI', 'Content Analysis'],
        status: 'COMPLETED',
        priority: 'HIGH',
        tasks: [
          { title: 'Text-Image Integration', hours: 8, payment: 224, completedAt: new Date('2024-10-13') },
          { title: 'Audio-Visual Analysis', hours: 7, payment: 196, completedAt: new Date('2024-10-17') },
          { title: 'Cross-Modal Evaluation', hours: 8, payment: 224, completedAt: new Date('2024-10-22') },
          { title: 'Integration Review', hours: 6, payment: 156, completedAt: new Date('2024-10-25') }
        ]
      },
      {
        title: 'Geranium YY Code Review',
        description: 'AI code generation evaluation for security and efficiency.',
        category: 'MODEL_EVALUATION',
        subcategory: 'Code Quality',
        totalBudget: 444,
        paymentPerTask: 35,
        estimatedHours: 13,
        startDate: new Date('2024-10-20'),
        deadline: new Date('2024-10-31'),
        requiredSkills: ['Software Development', 'Security'],
        status: 'COMPLETED',
        priority: 'MEDIUM',
        tasks: [
          { title: 'Security Assessment', hours: 4, payment: 140, completedAt: new Date('2024-10-24') },
          { title: 'Efficiency Review', hours: 4, payment: 140, completedAt: new Date('2024-10-28') },
          { title: 'Best Practices Check', hours: 4, payment: 140, completedAt: new Date('2024-10-31') },
          { title: 'Final Recommendations', hours: 1, payment: 24, completedAt: new Date('2024-10-31') }
        ]
      },

      // November 2024 - $1,200
      {
        title: 'Ostrich LLM Bias Detection',
        description: 'Language model evaluation for factual accuracy and bias.',
        category: 'CONTENT_MODERATION',
        subcategory: 'Bias Detection',
        totalBudget: 600,
        paymentPerTask: 22,
        estimatedHours: 27,
        startDate: new Date('2024-11-01'),
        deadline: new Date('2024-11-15'),
        requiredSkills: ['Fact-checking', 'Bias Recognition'],
        status: 'COMPLETED',
        priority: 'MEDIUM',
        tasks: [
          { title: 'Political Bias Analysis', hours: 7, payment: 154, completedAt: new Date('2024-11-05') },
          { title: 'Cultural Sensitivity', hours: 6, payment: 132, completedAt: new Date('2024-11-09') },
          { title: 'Fact-check Verification', hours: 8, payment: 176, completedAt: new Date('2024-11-13') },
          { title: 'Bias Report', hours: 6, payment: 138, completedAt: new Date('2024-11-15') }
        ]
      },
      {
        title: 'Titan Audio Transcription',
        description: 'Multilingual audio transcription and analysis.',
        category: 'TRANSCRIPTION',
        subcategory: 'Multilingual Audio',
        totalBudget: 400,
        paymentPerTask: 16,
        estimatedHours: 25,
        startDate: new Date('2024-11-10'),
        deadline: new Date('2024-11-25'),
        requiredSkills: ['Audio Processing', 'Transcription'],
        status: 'COMPLETED',
        priority: 'LOW',
        tasks: [
          { title: 'Meeting Transcription', hours: 8, payment: 128, completedAt: new Date('2024-11-16') },
          { title: 'Speaker ID', hours: 6, payment: 96, completedAt: new Date('2024-11-20') },
          { title: 'Quality Control', hours: 7, payment: 112, completedAt: new Date('2024-11-23') },
          { title: 'Final Package', hours: 4, payment: 64, completedAt: new Date('2024-11-25') }
        ]
      },
      {
        title: 'Nova Text Classification V2',
        description: 'Text classification for sentiment and topic analysis.',
        category: 'AI_TRAINING',
        subcategory: 'Text Classification',
        totalBudget: 200,
        paymentPerTask: 12,
        estimatedHours: 17,
        startDate: new Date('2024-11-18'),
        deadline: new Date('2024-11-30'),
        requiredSkills: ['Text Analysis', 'Sentiment Analysis'],
        status: 'COMPLETED',
        priority: 'LOW',
        tasks: [
          { title: 'Positive Sentiment', hours: 4, payment: 48, completedAt: new Date('2024-11-22') },
          { title: 'Negative Sentiment', hours: 4, payment: 48, completedAt: new Date('2024-11-26') },
          { title: 'Topic Assignment', hours: 5, payment: 60, completedAt: new Date('2024-11-29') },
          { title: 'Quality Validation', hours: 4, payment: 44, completedAt: new Date('2024-11-30') }
        ]
      }
    ];

    // Create projects and tasks
    let totalCreated = 0;
    let monthlyTotals = { sep: 0, oct: 0, nov: 0 };

    for (let i = 0; i < projectsData.length; i++) {
      const projectInfo = projectsData[i];
      const { tasks, ...projectData } = projectInfo;

      // Create project
      const project = new Project({
        ...projectData,
        createdBy: savedUser._id,
        assignedUsers: [savedUser._id]
      });
      const savedProject = await project.save();
      
      // Create tasks
      for (const taskInfo of tasks) {
        const task = new Task({
          title: taskInfo.title,
          description: `${taskInfo.title} for ${savedProject.title}`,
          type: 'AI_TRAINING',
          assignedTo: savedUser._id,
          createdBy: savedUser._id,
          opportunityId: savedProject._id,
          instructions: `Complete ${taskInfo.title} according to requirements.`,
          requirements: projectData.requiredSkills,
          deliverables: ['Work submission', 'Quality report'],
          estimatedHours: taskInfo.hours,
          deadline: taskInfo.completedAt,
          status: 'COMPLETED',
          priority: projectData.priority,
          hourlyRate: Math.round(taskInfo.payment / taskInfo.hours),
          actualHours: taskInfo.hours,
          totalEarnings: taskInfo.payment,
          paymentStatus: 'PAID',
          progress: 100,
          startedAt: new Date(taskInfo.completedAt.getTime() - (taskInfo.hours * 3600000)),
          completedAt: taskInfo.completedAt,
          submittedAt: taskInfo.completedAt,
          rating: 4 + Math.floor(Math.random() * 2), // 4-5 stars
          feedback: 'Excellent work quality.',
          qualityRating: 4 + Math.floor(Math.random() * 2),
          reviewFeedback: 'Met all requirements.'
        });
        
        await task.save();
        totalCreated++;
        
        // Track monthly totals
        const month = taskInfo.completedAt.getMonth();
        if (month === 8) monthlyTotals.sep += taskInfo.payment; // September
        else if (month === 9) monthlyTotals.oct += taskInfo.payment; // October
        else if (month === 10) monthlyTotals.nov += taskInfo.payment; // November
      }

      console.log(`✅ Created project: ${savedProject.title} with ${tasks.length} tasks`);
    }

    console.log('\n💰 Earnings Summary:');
    console.log(`  September 2024: $${monthlyTotals.sep}`);
    console.log(`  October 2024: $${monthlyTotals.oct}`);
    console.log(`  November 2024: $${monthlyTotals.nov}`);
    console.log(`  Total: $${monthlyTotals.sep + monthlyTotals.oct + monthlyTotals.nov}`);
    console.log(`\n📊 Created ${projectsData.length} projects and ${totalCreated} tasks`);
    console.log('✅ User work history seeding completed!');
    
    return savedUser;

  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Main execution
const run = async () => {
  try {
    await connectDB();
    await seedData();
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Execute
if (require.main === module) {
  run();
}

module.exports = { seedData, connectDB };