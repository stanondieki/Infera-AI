import express, { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { User, IUser } from '../models';
import { validateUserRegistration, validateUserLogin } from '../middleware/validation';
import { authLimiter } from '../middleware/rateLimiter';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Generate JWT token
const generateToken = (userId: string): string => {
  return jwt.sign(
    { userId },
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
        const token = generateToken(existingUser._id);
        
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
    const token = generateToken(user._id);

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

    // Generate token
    const token = generateToken(user._id);

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
    console.error('Login error:', error);
    res.status(500).json({ 
      success: false, 
      message: 'Server error during login' 
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