import { Request, Response, NextFunction } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';

export interface AuthRequest extends Request {
  user?: IUser;
}

export const authenticateToken = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (!token) {
      return res.status(401).json({ 
        success: false, 
        message: 'Access token required' 
      });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string; sessionId?: string };
    
    console.log('🔍 Auth Debug - Decoded JWT:', decoded);
    console.log('🔍 Auth Debug - Looking for userId:', decoded.userId);
    
    const user = await User.findById(decoded.userId).select('-password');
    console.log('🔍 Auth Debug - User found:', user ? `✅ ${user.email}` : '❌ NOT FOUND');
    
    if (!user) {
      // Debug: Show available users
      const sampleUsers = await User.find({}, '_id email').limit(3);
      console.log('🔍 Auth Debug - Sample user IDs:', sampleUsers.map(u => u._id.toString()));
      
      return res.status(401).json({ 
        success: false, 
        message: 'User not found' 
      });
    }

    if (!user.isActive) {
      return res.status(401).json({ 
        success: false, 
        message: 'Account is deactivated' 
      });
    }

    req.user = user;
    
    // Update session activity if sessionId is present
    if (decoded.sessionId) {
      try {
        const { updateSessionActivity } = await import('../routes/sessions');
        await updateSessionActivity(decoded.sessionId);
      } catch (error) {
        // Don't fail the request if session update fails
        console.warn('Failed to update session activity:', error);
      }
    }
    
    next();
  } catch (error) {
    console.error('Auth middleware error:', error);
    
    if (error instanceof jwt.JsonWebTokenError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Invalid token' 
      });
    }
    
    if (error instanceof jwt.TokenExpiredError) {
      return res.status(401).json({ 
        success: false, 
        message: 'Token expired' 
      });
    }

    return res.status(500).json({ 
      success: false, 
      message: 'Server error during authentication' 
    });
  }
};

export const requireAdmin = (req: AuthRequest, res: Response, next: NextFunction) => {
  // This middleware should be used AFTER authenticateToken
  // It assumes the user is already authenticated and available in req.user
  
  if (!req.user) {
    return res.status(401).json({ 
      success: false, 
      message: 'Authentication required. Use authenticateToken middleware first.' 
    });
  }

  // Check if user is admin
  if (req.user.role !== 'admin') {
    console.log('🚫 Non-admin user attempted admin action:', req.user.email, 'Role:', req.user.role);
    return res.status(403).json({ 
      success: false, 
      message: 'Admin access required' 
    });
  }

  console.log('✅ Admin access granted to:', req.user.email);
  next();
};

export const optionalAuth = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const authHeader = req.headers.authorization;
    const token = authHeader && authHeader.split(' ')[1];

    if (token) {
      const decoded = jwt.verify(token, process.env.JWT_SECRET || 'your-secret-key') as { userId: string };
      const user = await User.findById(decoded.userId).select('-password');
      
      if (user && user.isActive) {
        req.user = user;
      }
    }
    
    next();
  } catch (error) {
    // Silently continue without authentication
    next();
  }
};