import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generalLimiter } from './middleware/rateLimiter';

// Import routes
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import opportunityRoutes from './routes/projects';
import taskRoutes from './routes/tasks';
import userRoutes from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';
    await mongoose.connect(mongoURI);
    console.log('✅ MongoDB connected successfully');
    
    // Create initial admin user if none exists
    await createInitialAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    console.log('\n🔧 MongoDB Setup Instructions:');
    console.log('1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('3. Update MONGODB_URI in .env file if using a different connection string');
    console.log('4. Make sure MongoDB service is running\n');
    process.exit(1);
  }
};

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    const { User } = await import('./models');
    
    const adminExists = await User.findOne({ role: 'admin' });
    if (!adminExists) {
      const adminUser = new User({
        name: 'Admin User',
        email: 'admin@inferaai.com',
        password: 'Admin123!',
        role: 'admin',
        isVerified: true,
        isActive: true
      });
      
      await adminUser.save();
      console.log('✅ Initial admin user created: admin@inferaai.com / Admin123!');
    }

    // Also create demo user
    const demoExists = await User.findOne({ email: 'demo@inferaai.com' });
    if (!demoExists) {
      const demoUser = new User({
        name: 'Demo User',
        email: 'demo@inferaai.com',
        password: 'Demo123!',
        role: 'user',
        isVerified: true,
        isActive: true,
        bio: 'Demo user account for testing the platform',
        skills: ['JavaScript', 'Python', 'AI Training'],
        languages: ['English'],
        location: 'Remote',
        totalEarnings: 1250.75,
        completedTasks: 12,
        rating: 4.8,
        reviewCount: 15
      });
      
      await demoUser.save();
      console.log('✅ Demo user created: demo@inferaai.com / Demo123!');
    }
  } catch (error) {
    console.error('Error creating initial users:', error);
  }
};

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://infera-ai-five.vercel.app',
  'https://infera-ai.vercel.app',
  'http://localhost:3000',
  'http://localhost:3001'
];

app.use(cors({
  origin: function (origin, callback) {
    // Allow requests with no origin (like mobile apps or curl requests)
    if (!origin) return callback(null, true);
    
    if (allowedOrigins.indexOf(origin) !== -1) {
      callback(null, true);
    } else {
      console.log('Blocked by CORS:', origin);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ 
    status: 'OK', 
    message: 'Infera AI Backend API is running!',
    timestamp: new Date().toISOString()
  });
});

// API Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/users', userRoutes);

// Global error handling middleware
app.use((err: any, req: express.Request, res: express.Response, next: express.NextFunction) => {
  console.error('Global error handler:', err);
  
  // Mongoose validation error
  if (err.name === 'ValidationError') {
    const errors = Object.values(err.errors).map((e: any) => e.message);
    return res.status(400).json({
      success: false,
      message: 'Validation Error',
      errors
    });
  }
  
  // Mongoose duplicate key error
  if (err.code === 11000) {
    const field = Object.keys(err.keyValue)[0];
    return res.status(400).json({
      success: false,
      message: `${field} already exists`
    });
  }
  
  // JWT errors
  if (err.name === 'JsonWebTokenError') {
    return res.status(401).json({
      success: false,
      message: 'Invalid token'
    });
  }
  
  if (err.name === 'TokenExpiredError') {
    return res.status(401).json({
      success: false,
      message: 'Token expired'
    });
  }
  
  // Default server error
  res.status(500).json({ 
    success: false,
    message: 'Internal server error' 
  });
});

// 404 handler
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: 'Route not found'
  });
});

// Start server
const startServer = async () => {
  await connectDB();
  app.listen(PORT, () => {
    console.log(`🚀 Server running on port ${PORT}`);
    console.log(`🌐 API available at http://localhost:${PORT}`);
    console.log(`📊 Health check: http://localhost:${PORT}/health`);
  });
};

// Handle unhandled promise rejections
process.on('unhandledRejection', (err: any) => {
  console.error('Unhandled Rejection:', err);
  process.exit(1);
});

// Handle uncaught exceptions
process.on('uncaughtException', (err: any) => {
  console.error('Uncaught Exception:', err);
  process.exit(1);
});

startServer().catch(console.error);

export default app;