import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Temporary debug endpoint to see current users (REMOVE IN PRODUCTION)
router.get('/debug/users', async (req: Request, res: Response) => {
  try {
    const users = await User.find({}).select('name email role isActive createdAt updatedAt');
    res.json({
      success: true,
      count: users.length,
      users: users.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt,
        updatedAt: user.updatedAt
      }))
    });
  } catch (error) {
    console.error('Debug users error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching users'
    });
  }
});

// Debug database info endpoint
router.get('/debug/database-info', async (req: Request, res: Response) => {
  try {
    const mongoose = require('mongoose');
    const db = mongoose.connection.db;
    const dbName = db.databaseName;
    
    // Get collection names
    const collections = await db.listCollections().toArray();
    const collectionNames = collections.map((c: any) => c.name);
    
    // Get user count from different possible collections
    const userCount = await User.countDocuments();
    
    res.json({
      success: true,
      database: {
        name: dbName,
        collections: collectionNames,
        userCollection: 'users',
        userCount: userCount,
        connectionUri: process.env.MONGODB_URI?.replace(/:\/\/[^@]+@/, '://***:***@')
      }
    });
  } catch (error) {
    console.error('Database info error:', error);
    res.status(500).json({
      success: false,
      message: 'Error fetching database info',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Debug endpoint to check production database users (temporary)
router.get('/debug/production-users', async (req: Request, res: Response) => {
  try {
    const mongoose = require('mongoose');
    
    // Create a temporary connection to the production default database (without /infera_ai)
    const productionUri = process.env.MONGODB_URI?.replace('/infera_ai', '') || '';
    const tempConnection = await mongoose.createConnection(productionUri);
    
    // Get the User model on this connection
    const TempUser = tempConnection.model('User', User.schema);
    
    // Get users from production default database
    const productionUsers = await TempUser.find({}).select('name email role isActive createdAt');
    
    // Close temporary connection
    await tempConnection.close();
    
    res.json({
      success: true,
      productionDatabase: {
        userCount: productionUsers.length,
        users: productionUsers.map((user: any) => ({
          id: user._id,
          name: user.name,
          email: user.email,
          role: user.role,
          isActive: user.isActive,
          createdAt: user.createdAt
        }))
      }
    });
  } catch (error) {
    console.error('Production users check error:', error);
    res.status(500).json({
      success: false,
      message: 'Error checking production users',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// Cleanup demo accounts (REMOVE IN PRODUCTION)
router.delete('/debug/cleanup-demo', async (req: Request, res: Response) => {
  try {
    // Remove demo accounts created for testing
    const result = await User.deleteMany({
      email: { $in: ['demo@inferaai.com', 'test@inferaai.com'] }
    });
    
    console.log(`🧹 Cleaned up ${result.deletedCount} demo accounts`);
    
    // Show remaining users
    const remainingUsers = await User.find({}).select('name email role isActive createdAt');
    
    res.json({
      success: true,
      message: `Removed ${result.deletedCount} demo accounts`,
      remainingUsers: remainingUsers.map(user => ({
        id: user._id,
        name: user.name,
        email: user.email,
        role: user.role,
        isActive: user.isActive,
        createdAt: user.createdAt
      }))
    });
  } catch (error) {
    console.error('Cleanup error:', error);
    res.status(500).json({
      success: false,
      message: 'Error cleaning up demo accounts'
    });
  }
});

// Generate JWT token
const generateToken = (userId: string, sessionId?: string): string => {
  const payload: any = { userId };
  if (sessionId) {
    payload.sessionId = sessionId;
  }
  
  return jwt.sign(
    payload,
    process.env.JWT_SECRET || 'your-secret-key',
    { expiresIn: '7d' }
  );
};

// Register new user or update existing user for application flow
router.post('/register', authLimiter, validateUserRegistration, async (req: Request, res: Response) => {
  try {
    const { email, password, name, role = 'user', allowUpdate = false } = req.body;
    
    // Check if user already exists
    const existingUser = await User.findOne({ email });
    if (existingUser) {
      // If allowUpdate is true (from application submission), update the password
      if (allowUpdate) {
        existingUser.password = password; // This will trigger the pre-save hash
        existingUser.name = name; // Update name if provided
        await existingUser.save();
        
        // Generate token
        const token = generateToken(existingUser._id.toString());
        
        // Remove password from response
        const userResponse = {
          id: existingUser._id,
          name: existingUser.name,
          email: existingUser.email,
          role: existingUser.role,
          avatar: existingUser.avatar,
          isVerified: existingUser.isVerified,
          joinedDate: existingUser.joinedDate
        };

        return res.json({ 
          success: true, 
          message: 'User account updated successfully',
          user: userResponse,
          accessToken: token
        });
      }
      
      return res.status(400).json({ 
        success: false, 
        message: 'User with this email already exists' 
      });
    }

    // Create new user
    const user = new User({
      name,
      email,
      password,
      role,
      isVerified: false
    });

    await user.save();

    // Generate token
    const token = generateToken(user._id.toString());

    // Remove password from response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      joinedDate: user.joinedDate
    };

    res.status(201).json({ 
      success: true, 
      message: 'User registered successfully',
      user: userResponse,
      accessToken: token
    });
  } catch (error) {
    console.error('Registration error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during registration' 
    });
  }
});

// Login user
router.post('/login', authLimiter, validateUserLogin, async (req: Request, res: Response) => {
  try {
    const { email, password } = req.body;
    
    // Find user and include password for comparison
    const user = await User.findOne({ email }).select('+password');
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Check if account is active
    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account has been deactivated' 
      });
    }

    // Verify password
    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid email or password' 
      });
    }

    // Update last login date
    user.lastLoginDate = new Date();
    await user.save();

    // Generate token and create session
    const { createUserSession } = await import('./sessions');
    const sessionId = await createUserSession(user._id.toString(), req);
    const token = generateToken(user._id.toString(), sessionId);

    // Prepare user response
    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      languages: user.languages,
      location: user.location,
      website: user.website,
      github: user.github,
      linkedin: user.linkedin,
      totalEarnings: user.totalEarnings,
      completedTasks: user.completedTasks,
      rating: user.rating,
      reviewCount: user.reviewCount,
      isVerified: user.isVerified,
      joinedDate: user.joinedDate,
      lastLoginDate: user.lastLoginDate
    };

    res.json({ 
      success: true, 
      message: 'Login successful',
      user: userResponse,
      accessToken: token
    });
  } catch (error) {
    console.error('❌ Login error:', error);
    
    // More detailed error logging
    if (error instanceof Error) {
      console.error('Error message:', error.message);
      console.error('Error stack:', error.stack);
    }
    
    // Check database connection
    const mongoose = require('mongoose');
    console.error('📊 DB connection state during login:', mongoose.connection.readyState);
    console.error('🔐 JWT_SECRET exists:', !!process.env.JWT_SECRET);
    
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login',
      ...(process.env.NODE_ENV === 'development' && { 
        error: error instanceof Error ? error.message : 'Unknown error',
        dbState: mongoose.connection.readyState
      })
    });
  }
});

// Get current user profile
router.get('/me', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const userResponse = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      bio: user.bio,
      skills: user.skills,
      languages: user.languages,
      timezone: user.timezone,
      location: user.location,
      website: user.website,
      github: user.github,
      linkedin: user.linkedin,
      totalEarnings: user.totalEarnings,
      completedTasks: user.completedTasks,
      rating: user.rating,
      reviewCount: user.reviewCount,
      isVerified: user.isVerified,
      joinedDate: user.joinedDate,
      lastLoginDate: user.lastLoginDate
    };

    res.json({ 
      success: true, 
      user: userResponse 
    });
  } catch (error) {
    console.error('Get profile error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error' 
    });
  }
});

// Update user profile
router.put('/profile', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const user = req.user;
    if (!user) {
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    const allowedUpdates = [
      'name', 'bio', 'skills', 'languages', 'timezone', 
      'location', 'website', 'github', 'linkedin', 'avatar'
    ];
    
    const updates: any = {};
    Object.keys(req.body).forEach(key => {
      if (allowedUpdates.includes(key)) {
        updates[key] = req.body[key];
      }
    });

    const updatedUser = await User.findByIdAndUpdate(
      user._id,
      updates,
      { new: true, runValidators: true }
    ).select('-password');

    if (!updatedUser) {
      return res.status(404).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    res.json({ 
      success: true, 
      message: 'Profile updated successfully',
      user: updatedUser 
    });
  } catch (error) {
    console.error('Profile update error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during profile update' 
    });
  }
});

// Google OAuth authentication
router.post('/google', authLimiter, async (req: Request, res: Response) => {
  try {
    const { code } = req.body;
    
    if (!code) {
      return res.status(400).json({
        success: false,
        message: 'Authorization code is required'
      });
    }

    // Exchange code for tokens
    const tokenResponse = await fetch('https://oauth2.googleapis.com/token', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: new URLSearchParams({
        code,
        client_id: process.env.GOOGLE_CLIENT_ID || '',
        client_secret: process.env.GOOGLE_CLIENT_SECRET || '',
        redirect_uri: `${process.env.FRONTEND_URL || 'http://localhost:3000'}/auth/google/callback`,
        grant_type: 'authorization_code',
      }),
    });

    if (!tokenResponse.ok) {
      throw new Error('Failed to exchange code for tokens');
    }

    const tokens = await tokenResponse.json() as {
      access_token: string;
      token_type: string;
      expires_in: number;
    };
    
    // Get user info from Google
    const googleApiResponse = await fetch('https://www.googleapis.com/oauth2/v2/userinfo', {
      headers: {
        Authorization: `Bearer ${tokens.access_token}`,
      },
    });

    if (!googleApiResponse.ok) {
      throw new Error('Failed to fetch user info from Google');
    }

    const googleUser = await googleApiResponse.json() as {
      id: string;
      email: string;
      name: string;
      picture?: string;
    };

    // Check if user exists
    let user = await User.findOne({ email: googleUser.email });

    if (!user) {
      // Create new user
      user = new User({
        name: googleUser.name,
        email: googleUser.email,
        avatar: googleUser.picture,
        isVerified: true,
        googleId: googleUser.id,
        // No password for OAuth users
      });
      await user.save();
      console.log('✅ New Google user created:', user.email);
    } else {
      // Update existing user with Google info if not already set
      if (!user.googleId) {
        user.googleId = googleUser.id;
        user.isVerified = true;
        if (!user.avatar && googleUser.picture) {
          user.avatar = googleUser.picture;
        }
        await user.save();
      }
      console.log('✅ Existing user signed in with Google:', user.email);
    }

    // Generate JWT token
    const token = generateToken(user._id.toString());

    // Remove password from response
    const userResponseData = {
      id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
      avatar: user.avatar,
      isVerified: user.isVerified,
      joinedDate: user.joinedDate
    };

    res.json({
      success: true,
      message: 'Google authentication successful',
      user: userResponseData,
      accessToken: token
    });

  } catch (error) {
    console.error('Google auth error:', error);
    res.status(500).json({
      success: false,
      message: 'Google authentication failed'
    });
  }
});

// Forgot password
router.post('/forgot-password', authLimiter, async (req: Request, res: Response) => {
  try {
    const { email } = req.body;

    if (!email) {
      return res.status(400).json({
        success: false,
        message: 'Email is required'
      });
    }

    const user = await User.findOne({ email });
    
    // Don't reveal if user exists or not for security
    if (!user) {
      return res.json({
        success: true,
        message: 'If an account with this email exists, a password reset link has been sent.'
      });
    }

    // Generate reset token (valid for 1 hour)
    const resetToken = jwt.sign(
      { userId: user._id, type: 'password-reset' },
      process.env.JWT_SECRET || 'your-secret-key',
      { expiresIn: '1h' }
    );

    // In a real implementation, you would send an email here
    // For now, we'll just log it (REMOVE IN PRODUCTION)
    const resetLink = `${process.env.FRONTEND_URL || 'http://localhost:3000'}/reset-password?token=${resetToken}`;
    console.log('Password reset link for', email, ':', resetLink);

    // TODO: Send email with reset link
    // await sendPasswordResetEmail(user.email, resetLink);

    res.json({
      success: true,
      message: 'If an account with this email exists, a password reset link has been sent.',
      // REMOVE IN PRODUCTION - only for testing
      ...(process.env.NODE_ENV !== 'production' && { resetLink })
    });

  } catch (error) {
    console.error('Forgot password error:', error);
    res.status(500).json({
      success: false,
      message: 'Server error during password reset request'
    });
  }
});

// Reset password
router.post('/reset-password', authLimiter, async (req: Request, res: Response) => {
  try {
    const { token, newPassword } = req.body;

    if (!token || !newPassword) {
      return res.status(400).json({
        success: false,
        message: 'Token and new password are required'
      });
    }

    if (newPassword.length < 6) {
      return res.status(400).json({
        success: false,
        message: 'Password must be at least 6 characters long'
      });
    }

    // Verify reset token
    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as any;
    
    if (decoded.type !== 'password-reset') {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Find user and update password
    const user = await User.findById(decoded.userId);
    
    if (!user) {
      return res.status(400).json({
        success: false,
        message: 'Invalid reset token'
      });
    }

    // Update password (will be hashed by pre-save hook)
    user.password = newPassword;
    await user.save();

    console.log('✅ Password reset successful for:', user.email);

    res.json({
      success: true,
      message: 'Password reset successful'
    });

  } catch (error) {
    console.error('Reset password error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(400).json({
        success: false,
        message: 'Invalid or expired reset token'
      });
    }

    res.status(500).json({
      success: false,
      message: 'Server error during password reset'
    });
  }
});

// Logout (client-side token removal, server-side we just confirm)
router.post('/logout', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    res.json({ 
      success: true, 
      message: 'Logout successful' 
    });
  } catch (error) {
    console.error('Logout error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during logout' 
    });
  }
});

export default router;