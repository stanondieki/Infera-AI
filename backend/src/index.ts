import express from 'express';
import cors from 'cors';
import dotenv from 'dotenv';
import mongoose from 'mongoose';
import { generalLimiter } from './middleware/rateLimiter';

// Azure deployment - ready for production

// Import routes
import authRoutes from './routes/auth';
import applicationRoutes from './routes/applications';
import opportunityRoutes from './routes/projects';
import projectsManagementRoutes from './routes/projectsManagement';
import taskRoutes from './routes/tasks';
import taskProjectRoutes from './routes/taskProjects';
import userRoutes from './routes/users';

// Load environment variables
dotenv.config();

const app = express();
const PORT = process.env.PORT || 5000;

// MongoDB connection
const connectDB = async () => {
  try {
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';
    
    console.log('🔗 Attempting to connect to MongoDB...');
    console.log('📍 Connection URI format:', mongoURI.replace(/:\/\/[^@]+@/, '://***:***@'));
    
    // Connection options for better reliability
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully');
    
    // Create initial admin user if none exists
    await createInitialAdmin();
  } catch (error) {
    console.error('❌ MongoDB connection error:', error);
    
    if (error instanceof Error) {
      if (error.message.includes('ETIMEDOUT')) {
        console.log('\n🔧 Connection Timeout Solutions:');
        console.log('1. Check your internet connection');
        console.log('2. Verify MongoDB Atlas cluster is running (not paused)');
        console.log('3. Check if your IP address is whitelisted in Atlas');
        console.log('4. Try connecting from MongoDB Compass with the same URI');
      } else if (error.message.includes('authentication failed')) {
        console.log('\n🔐 Authentication Error Solutions:');
        console.log('1. Verify username and password in MONGODB_URI');
        console.log('2. Check database user permissions in MongoDB Atlas');
      }
    }
    
    console.log('\n🔧 General MongoDB Setup Instructions:');
    console.log('1. Install MongoDB Community Server from: https://www.mongodb.com/try/download/community');
    console.log('2. Or use MongoDB Atlas (cloud): https://www.mongodb.com/atlas');
    console.log('3. Update MONGODB_URI in .env file if using a different connection string');
    console.log('4. Make sure MongoDB service is running\n');
    
    // Don't exit immediately, allow for retries
    console.log('🔄 Retrying connection in 5 seconds...');
    setTimeout(connectDB, 5000);
  }
};

// Create initial admin user
const createInitialAdmin = async () => {
  try {
    const { User } = await import('./models');
    
    // First, let's see what users exist
    const allUsers = await User.find({}).select('name email role isActive createdAt');
    console.log('📋 Current users in database:', allUsers.length);
    allUsers.forEach(user => {
      console.log(`  - ${user.email} (${user.role}) - Active: ${user.isActive} - Created: ${user.createdAt?.toISOString()?.split('T')[0] || 'Unknown'}`);
    });
    
    // Only create admin if no admin exists AND no users exist at all
    const adminExists = await User.findOne({ role: 'admin' });
    const totalUsers = await User.countDocuments();
    
    if (!adminExists && totalUsers === 0) {
      console.log('🔧 No users found, creating initial admin user...');
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
    } else {
      console.log(`ℹ️ Found ${totalUsers} existing users - using live accounts`);
    }

    // REMOVED: Demo user creation - using live accounts instead
    
  } catch (error) {
    console.error('Error checking/creating users:', error);
  }
};

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL || 'http://localhost:3000',
  'https://task-ify.com',
  'https://www.task-ify.com',
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
      console.log('🚫 Blocked by CORS:', origin);
      console.log('📋 Allowed origins:', allowedOrigins);
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS', 'PATCH'],
  allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  exposedHeaders: ['Content-Length', 'X-Requested-With'],
  optionsSuccessStatus: 200
}));
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

// Rate limiting
app.use(generalLimiter);

// Health check with database and email connectivity
app.get('/health', async (req, res) => {
  const healthStatus = {
    status: 'OK',
    message: 'Taskify Backend API is running!',
    timestamp: new Date().toISOString(),
    database: 'unknown',
    email: 'unknown',
    environment: {
      nodeEnv: process.env.NODE_ENV || 'development',
      port: PORT,
      mongoUri: process.env.MONGODB_URI ? 'configured' : 'missing',
      jwtSecret: process.env.JWT_SECRET ? 'configured' : 'missing',
      smtpConfigured: !!(process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS),
      frontendUrl: process.env.FRONTEND_URL || 'not set'
    },
    cors: {
      allowedOrigins: allowedOrigins
    }
  };

  try {
    // Test database connection
    const dbState = mongoose.connection.readyState;
    healthStatus.database = dbState === 1 ? 'connected' : dbState === 2 ? 'connecting' : 'disconnected';
    
    // Test basic database query
    if (dbState === 1 && mongoose.connection.db) {
      await mongoose.connection.db.admin().ping();
      healthStatus.database = 'healthy';
    }
  } catch (error) {
    console.error('Health check - Database error:', error);
    healthStatus.database = 'error';
    healthStatus.status = 'WARNING';
  }

  try {
    // Test email configuration (don't actually send email)
    if (process.env.SMTP_HOST && process.env.SMTP_USER && process.env.SMTP_PASS) {
      healthStatus.email = 'configured';
    } else {
      healthStatus.email = 'not configured';
      if (healthStatus.status !== 'ERROR') healthStatus.status = 'WARNING';
    }
  } catch (error) {
    console.error('Health check - Email error:', error);
    healthStatus.email = 'error';
    healthStatus.status = 'WARNING';
  }

  const statusCode = healthStatus.status === 'OK' ? 200 : 
                     healthStatus.status === 'WARNING' ? 200 : 500;
  
  res.status(statusCode).json(healthStatus);
});

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/applications', applicationRoutes);
app.use('/api/opportunities', opportunityRoutes);
app.use('/api/projects', opportunityRoutes); // Also mount under /projects for frontend compatibility
app.use('/api/projects', projectsManagementRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/task-projects', taskProjectRoutes);
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