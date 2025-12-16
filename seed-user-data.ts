/**
 * TypeScript User Data Seeding Script - 3 Month Work History
 * 
 * Run with: npx ts-node seed-user-data.ts
 * Or compile first: tsc seed-user-data.ts && node seed-user-data.js
 */

import mongoose from 'mongoose';
import bcrypt from 'bcryptjs';
import dotenv from 'dotenv';

// Load environment variables
dotenv.config();

// Import models
import User from './backend/src/models/User';
import { Project } from './backend/src/models/Project';  
import { Task } from './backend/src/models/Task';

// MongoDB connection
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

// Hash password
const hashPassword = async (password: string): Promise<string> => {
  return await bcrypt.hash(password, 10);
};

// User data
const createSeedUserData = async () => ({
  name: 'William Macy',
  email: 'william.macy.ai@gmail.com',
  password: await hashPassword('kem91fibA1!'),
  role: 'user' as const,
  bio: 'Experienced AI trainer with expertise in multilingual models and computer vision. Passionate about ethical AI development.',
  skills: ['Natural Language Processing', 'Computer Vision', 'Data Annotation', 'Model Evaluation', 'Machine Learning', 'Python', 'TensorFlow'],
  languages: ['English', 'Mandarin', 'Spanish', 'Japanese'],
  timezone: 'America/Los_Angeles',
  location: 'San Francisco, CA',
  totalEarnings: 4940, // Sum of 3 months
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
  approvalStatus: 'approved' as const,
  joinedDate: new Date('2024-08-15'),
  lastLoginDate: new Date('2024-11-30'),
  createdAt: new Date('2024-08-15'),
  updatedAt: new Date('2024-11-30')
});

interface TaskData {
  title: string;
  hours: number;
  payment: number;
  completedAt: Date;
}

interface ProjectData {
  title: string;
  description: string;
  category: string;
  subcategory: string;
  totalBudget: number;
  paymentPerTask: number;
  estimatedHours: number;
  startDate: Date;
  deadline: Date;
  requiredSkills: string[];
  status: string;
  priority: string;
  createdAt: Date;
  tasks: TaskData[];
}

// September 2024 Projects ($1,506 total)
const septemberProjects: ProjectData[] = [
  {
    title: 'Genesis B1 Multilingual Training',
    description: 'Train multilingual language model on diverse conversation patterns across 15+ languages. Focus on cultural context and nuanced responses.',
    category: 'AI_TRAINING',
    subcategory: 'Conversational AI',
    totalBudget: 800,
    paymentPerTask: 25,
    estimatedHours: 32,
    startDate: new Date('2024-09-02'),
    deadline: new Date('2024-09-15'),
    requiredSkills: ['Natural Language Processing', 'Cross-cultural Communication', 'Multiple Languages'],
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: new Date('2024-09-01'),
    tasks: [
      { title: 'Cultural Context Evaluation - Spanish', hours: 8, payment: 200, completedAt: new Date('2024-09-05') },
      { title: 'Multilingual Response Rating - Mandarin', hours: 6, payment: 150, completedAt: new Date('2024-09-08') },
      { title: 'Conversation Flow Analysis - Japanese', hours: 7, payment: 175, completedAt: new Date('2024-09-12') },
      { title: 'Final Quality Review - All Languages', hours: 5, payment: 125, completedAt: new Date('2024-09-15') }
    ]
  },
  {
    title: 'Impala Vision A3 - Automotive Safety',
    description: 'Computer vision model training for autonomous systems. Annotate objects, scenarios, and edge cases in driving environments.',
    category: 'DATA_ANNOTATION',
    subcategory: 'Computer Vision',
    totalBudget: 600,
    paymentPerTask: 20,
    estimatedHours: 30,
    startDate: new Date('2024-09-10'),
    deadline: new Date('2024-09-25'),
    requiredSkills: ['Computer Vision', 'Attention to Detail', 'Safety Awareness'],
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: new Date('2024-09-09'),
    tasks: [
      { title: 'Object Detection - Vehicles', hours: 8, payment: 160, completedAt: new Date('2024-09-14') },
      { title: 'Weather Condition Annotation', hours: 6, payment: 120, completedAt: new Date('2024-09-18') },
      { title: 'Edge Case Identification', hours: 7, payment: 140, completedAt: new Date('2024-09-22') },
      { title: 'Quality Control Review', hours: 4, payment: 80, completedAt: new Date('2024-09-25') }
    ]
  },
  {
    title: 'Phoenix Eval Rating C2',
    description: 'Comprehensive AI model evaluation across multiple performance dimensions. Rate responses on accuracy, helpfulness, and safety.',
    category: 'MODEL_EVALUATION',
    subcategory: 'Performance Assessment',
    totalBudget: 356,
    paymentPerTask: 18,
    estimatedHours: 20,
    startDate: new Date('2024-09-20'),
    deadline: new Date('2024-09-30'),
    requiredSkills: ['Model Evaluation', 'Critical Analysis', 'AI Safety'],
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: new Date('2024-09-19'),
    tasks: [
      { title: 'Response Accuracy Evaluation', hours: 6, payment: 108, completedAt: new Date('2024-09-24') },
      { title: 'Safety Assessment Review', hours: 5, payment: 90, completedAt: new Date('2024-09-27') },
      { title: 'Helpfulness Rating Analysis', hours: 6, payment: 108, completedAt: new Date('2024-09-30') },
      { title: 'Final Report Compilation', hours: 3, payment: 50, completedAt: new Date('2024-09-30') }
    ]
  }
];

// October 2024 Projects ($2,234 total)
const octoberProjects: ProjectData[] = [
  {
    title: 'Bulba Gen Complex - Advanced Reasoning',
    description: 'Advanced generative AI model training for complex reasoning tasks. Evaluate logical consistency and creative problem-solving capabilities.',
    category: 'MODEL_EVALUATION',
    subcategory: 'Advanced Reasoning',
    totalBudget: 1000,
    paymentPerTask: 30,
    estimatedHours: 33,
    startDate: new Date('2024-10-01'),
    deadline: new Date('2024-10-18'),
    requiredSkills: ['Critical Thinking', 'Logic', 'AI/ML Knowledge'],
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: new Date('2024-09-30'),
    tasks: [
      { title: 'Logical Reasoning Assessment', hours: 10, payment: 300, completedAt: new Date('2024-10-06') },
      { title: 'Creative Problem Solving Evaluation', hours: 8, payment: 240, completedAt: new Date('2024-10-10') },
      { title: 'Complex Scenario Testing', hours: 9, payment: 270, completedAt: new Date('2024-10-15') },
      { title: 'Final Performance Analysis', hours: 6, payment: 180, completedAt: new Date('2024-10-18') }
    ]
  },
  {
    title: 'Flamingo Multimodal B6',
    description: 'Multimodal AI training combining text, image, and audio inputs. Evaluate cross-modal understanding and response generation.',
    category: 'AI_TRAINING',
    subcategory: 'Multimodal AI',
    totalBudget: 800,
    paymentPerTask: 28,
    estimatedHours: 29,
    startDate: new Date('2024-10-08'),
    deadline: new Date('2024-10-25'),
    requiredSkills: ['Multimodal AI', 'Content Analysis', 'Technical Writing'],
    status: 'COMPLETED',
    priority: 'HIGH',
    createdAt: new Date('2024-10-07'),
    tasks: [
      { title: 'Text-Image Integration Testing', hours: 8, payment: 224, completedAt: new Date('2024-10-13') },
      { title: 'Audio-Visual Correlation Analysis', hours: 7, payment: 196, completedAt: new Date('2024-10-17') },
      { title: 'Cross-Modal Response Evaluation', hours: 8, payment: 224, completedAt: new Date('2024-10-22') },
      { title: 'Integration Quality Review', hours: 6, payment: 156, completedAt: new Date('2024-10-25') }
    ]
  },
  {
    title: 'Geranium YY Code Review - Security Focus',
    description: 'AI code generation model evaluation. Review generated code for functionality, efficiency, and best practices compliance.',
    category: 'MODEL_EVALUATION',
    subcategory: 'Code Quality',
    totalBudget: 434,
    paymentPerTask: 35,
    estimatedHours: 12,
    startDate: new Date('2024-10-20'),
    deadline: new Date('2024-10-31'),
    requiredSkills: ['Software Development', 'Code Review', 'Security Analysis'],
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: new Date('2024-10-19'),
    tasks: [
      { title: 'Security Vulnerability Assessment', hours: 4, payment: 140, completedAt: new Date('2024-10-24') },
      { title: 'Code Efficiency Review', hours: 4, payment: 140, completedAt: new Date('2024-10-28') },
      { title: 'Best Practices Compliance Check', hours: 4, payment: 140, completedAt: new Date('2024-10-31') },
      { title: 'Final Report & Recommendations', hours: 1, payment: 14, completedAt: new Date('2024-10-31') }
    ]
  }
];

// November 2024 Projects ($1,200 total)
const novemberProjects: ProjectData[] = [
  {
    title: 'Ostrich LLM Reviews - Bias Detection',
    description: 'Large language model output evaluation for factual accuracy and bias detection across diverse topics.',
    category: 'CONTENT_MODERATION',
    subcategory: 'Bias Detection',
    totalBudget: 600,
    paymentPerTask: 22,
    estimatedHours: 27,
    startDate: new Date('2024-11-01'),
    deadline: new Date('2024-11-15'),
    requiredSkills: ['Fact-checking', 'Bias Recognition', 'Research Skills'],
    status: 'COMPLETED',
    priority: 'MEDIUM',
    createdAt: new Date('2024-10-31'),
    tasks: [
      { title: 'Political Content Bias Analysis', hours: 7, payment: 154, completedAt: new Date('2024-11-05') },
      { title: 'Cultural Sensitivity Review', hours: 6, payment: 132, completedAt: new Date('2024-11-09') },
      { title: 'Fact-checking Verification', hours: 8, payment: 176, completedAt: new Date('2024-11-13') },
      { title: 'Final Bias Report', hours: 6, payment: 138, completedAt: new Date('2024-11-15') }
    ]
  },
  {
    title: 'Titan Audio Transcription Plus',
    description: 'Advanced audio transcription and analysis for multilingual content. Focus on technical accuracy and speaker identification.',
    category: 'TRANSCRIPTION',
    subcategory: 'Multilingual Audio',
    totalBudget: 400,
    paymentPerTask: 16,
    estimatedHours: 25,
    startDate: new Date('2024-11-10'),
    deadline: new Date('2024-11-25'),
    requiredSkills: ['Audio Processing', 'Transcription', 'Language Skills'],
    status: 'COMPLETED',
    priority: 'LOW',
    createdAt: new Date('2024-11-09'),
    tasks: [
      { title: 'Technical Meeting Transcription', hours: 8, payment: 128, completedAt: new Date('2024-11-16') },
      { title: 'Multilingual Speaker ID', hours: 6, payment: 96, completedAt: new Date('2024-11-20') },
      { title: 'Quality Control & Editing', hours: 7, payment: 112, completedAt: new Date('2024-11-23') },
      { title: 'Final Delivery Package', hours: 4, payment: 64, completedAt: new Date('2024-11-25') }
    ]
  },
  {
    title: 'Nova Text Classification V2',
    description: 'Text classification model training for sentiment analysis and topic categorization across social media content.',
    category: 'AI_TRAINING', 
    subcategory: 'Text Classification',
    totalBudget: 200,
    paymentPerTask: 12,
    estimatedHours: 17,
    startDate: new Date('2024-11-18'),
    deadline: new Date('2024-11-30'),
    requiredSkills: ['Text Analysis', 'Sentiment Analysis', 'Social Media'],
    status: 'COMPLETED',
    priority: 'LOW',
    createdAt: new Date('2024-11-17'),
    tasks: [
      { title: 'Sentiment Labeling - Positive', hours: 4, payment: 48, completedAt: new Date('2024-11-22') },
      { title: 'Sentiment Labeling - Negative', hours: 4, payment: 48, completedAt: new Date('2024-11-26') },
      { title: 'Topic Category Assignment', hours: 5, payment: 60, completedAt: new Date('2024-11-29') },
      { title: 'Quality Validation Check', hours: 4, payment: 44, completedAt: new Date('2024-11-30') }
    ]
  }
];

// Helper function to create projects and tasks
const createProjectsAndTasks = async (userId: string, projectsData: ProjectData[], monthName: string) => {
  console.log(`📋 Creating ${monthName} projects and tasks...`);
  
  for (const projectData of projectsData) {
    try {
      // Create project
      const { tasks, ...projectInfo } = projectData;
      const projectDoc = new Project({
        ...projectInfo,
        createdBy: userId,
        assignedUsers: [userId]
      });
      
      const savedProject = await projectDoc.save();
      console.log(`  ✅ Created project: ${savedProject.title}`);
      
      // Create tasks for this project
      for (const taskData of tasks) {
        const taskDoc = new Task({
          title: taskData.title,
          description: `${taskData.title} for ${savedProject.title}`,
          type: 'AI_TRAINING',
          assignedTo: userId,
          createdBy: userId,
          opportunityId: savedProject._id,
          instructions: `Complete ${taskData.title} according to project requirements.`,
          requirements: savedProject.requiredSkills,
          deliverables: ['Completed work submission', 'Quality report'],
          estimatedHours: taskData.hours,
          deadline: taskData.completedAt,
          status: 'COMPLETED',
          priority: savedProject.priority,
          hourlyRate: taskData.payment / taskData.hours,
          actualHours: taskData.hours,
          totalEarnings: taskData.payment,
          paymentStatus: 'PAID',
          progress: 100,
          startedAt: new Date(taskData.completedAt.getTime() - (taskData.hours * 60 * 60 * 1000)),
          completedAt: taskData.completedAt,
          submittedAt: taskData.completedAt,
          rating: Math.floor(Math.random() * 2) + 4, // 4-5 stars
          feedback: 'Excellent work quality and timely delivery.',
          qualityRating: Math.floor(Math.random() * 2) + 4,
          reviewFeedback: 'High-quality output meeting all requirements.',
          createdAt: new Date(taskData.completedAt.getTime() - (2 * 24 * 60 * 60 * 1000)),
          updatedAt: taskData.completedAt
        });
        
        const savedTask = await taskDoc.save();
        console.log(`    ✅ Created task: ${savedTask.title} - $${taskData.payment}`);
      }
      
    } catch (error) {
      console.error(`    ❌ Error creating project ${projectData.title}:`, error);
    }
  }
};

// Main seeding function
export const seedUserWorkHistory = async () => {
  try {
    console.log('🌱 Starting user work history seeding...\n');
    
    const seedUserData = await createSeedUserData();
    
    // Check if user already exists
    const existingUser = await User.findOne({ email: seedUserData.email });
    if (existingUser) {
      console.log('⚠️  User already exists. Deleting existing data...');
      
      // Delete existing tasks and projects for this user
      await Task.deleteMany({ assignedTo: existingUser._id });
      await Project.deleteMany({ assignedUsers: existingUser._id });
      await User.deleteOne({ _id: existingUser._id });
      
      console.log('🗑️  Cleaned up existing user data\n');
    }
    
    // Create user
    const user = new User(seedUserData);
    const savedUser = await user.save();
    console.log(`👤 Created user: ${savedUser.name} (${savedUser.email})\n`);
    
    // Create projects and tasks for each month
    await createProjectsAndTasks(savedUser._id.toString(), septemberProjects, 'September 2024');
    await createProjectsAndTasks(savedUser._id.toString(), octoberProjects, 'October 2024');
    await createProjectsAndTasks(savedUser._id.toString(), novemberProjects, 'November 2024');
    
    // Calculate and verify totals
    const septemberTotal = septemberProjects.reduce((sum, p) => 
      sum + p.tasks.reduce((taskSum, t) => taskSum + t.payment, 0), 0);
    const octoberTotal = octoberProjects.reduce((sum, p) => 
      sum + p.tasks.reduce((taskSum, t) => taskSum + t.payment, 0), 0);
    const novemberTotal = novemberProjects.reduce((sum, p) => 
      sum + p.tasks.reduce((taskSum, t) => taskSum + t.payment, 0), 0);
    
    console.log('\n💰 Earnings Summary:');
    console.log(`  September 2024: $${septemberTotal}`);
    console.log(`  October 2024: $${octoberTotal}`);
    console.log(`  November 2024: $${novemberTotal}`);
    console.log(`  Total 3 Months: $${septemberTotal + octoberTotal + novemberTotal}`);
    
    console.log('\n✅ User work history seeding completed successfully!');
    console.log(`📊 User Stats: ${savedUser.completedTasks} tasks, ${savedUser.rating}⭐ rating, $${savedUser.totalEarnings} total earnings`);
    
    return savedUser;
    
  } catch (error) {
    console.error('❌ Seeding failed:', error);
    throw error;
  }
};

// Run the seeding script
const runSeeding = async () => {
  try {
    await connectDB();
    await seedUserWorkHistory();
  } catch (error) {
    console.error('Script failed:', error);
  } finally {
    await mongoose.connection.close();
    console.log('🔌 Database connection closed');
    process.exit(0);
  }
};

// Execute if called directly
if (require.main === module) {
  runSeeding();
}