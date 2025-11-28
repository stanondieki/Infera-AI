import express from 'express';
import { Request, Response } from 'express';
import jwt from 'jsonwebtoken';
import { UserSession, IUserSession } from '../models/UserSession';
import { SecurityEvent } from '../models/SecurityEvent';
import { authenticateToken, AuthRequest } from '../middleware/auth';

const router = express.Router();

// Helper function to extract device info from user agent
function parseUserAgent(userAgent: string) {
  const deviceType = /Mobile|Android|iPhone/i.test(userAgent) ? 'Mobile' : 
                    /iPad|Tablet/i.test(userAgent) ? 'Tablet' : 'Desktop';
  
  let browser = 'Unknown Browser';
  if (userAgent.includes('Chrome')) browser = 'Chrome';
  else if (userAgent.includes('Safari')) browser = 'Safari';
  else if (userAgent.includes('Firefox')) browser = 'Firefox';
  else if (userAgent.includes('Edge')) browser = 'Edge';
  else if (userAgent.includes('Opera')) browser = 'Opera';

  let os = 'Unknown OS';
  if (userAgent.includes('Windows')) os = 'Windows';
  else if (userAgent.includes('Mac')) os = 'macOS';
  else if (userAgent.includes('Linux')) os = 'Linux';
  else if (userAgent.includes('Android')) os = 'Android';
  else if (userAgent.includes('iOS')) os = 'iOS';

  return { deviceType, browser, os, deviceName: `${deviceType} - ${os}` };
}

// Helper function to get location from IP (mock implementation)
async function getLocationFromIP(ip: string) {
  // In production, you would use a real IP geolocation service
  // For now, return mock data
  return {
    location: 'San Francisco, CA, United States',
    city: 'San Francisco',
    country: 'United States'
  };
}

// GET /api/sessions - Get user sessions
router.get('/', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    
    const sessions = await UserSession.find({ 
      userId,
      isActive: true 
    }).sort({ lastActive: -1 });

    const formattedSessions = sessions.map(session => ({
      id: session._id,
      user_id: session.userId,
      device_type: session.deviceType,
      device_name: session.deviceName,
      browser: session.browser,
      os: session.os,
      location: session.location,
      city: session.city,
      country: session.country,
      ip_address: session.ipAddress,
      last_active: session.lastActive,
      created_at: session.createdAt,
      is_current: session.sessionId === req.headers.authorization?.split(' ')[1], // Check if current session
      user_agent: session.userAgent
    }));

    res.json({
      success: true,
      sessions: formattedSessions,
      total: formattedSessions.length
    });

  } catch (error) {
    console.error('Error fetching sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/sessions/login-history - Get login history
router.get('/login-history', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const sessions = await UserSession.find({ userId })
      .sort({ createdAt: -1 })
      .limit(limit);

    const loginHistory = sessions.flatMap(session => 
      session.loginAttempts.map(attempt => ({
        id: `${session._id}_${attempt.timestamp}`,
        user_id: session.userId,
        status: attempt.status,
        device_type: session.deviceType,
        device_name: session.deviceName,
        browser: session.browser,
        os: session.os,
        location: session.location,
        city: session.city,
        country: session.country,
        ip_address: attempt.ipAddress || session.ipAddress,
        timestamp: attempt.timestamp,
        failure_reason: attempt.failureReason,
        user_agent: attempt.userAgent || session.userAgent
      }))
    );

    // Sort by timestamp descending
    loginHistory.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());

    res.json({
      success: true,
      loginHistory: loginHistory.slice(0, limit),
      total: loginHistory.length
    });

  } catch (error) {
    console.error('Error fetching login history:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch login history',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// GET /api/sessions/security-events - Get security events
router.get('/security-events', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const limit = parseInt(req.query.limit as string) || 50;
    
    const events = await SecurityEvent.find({ userId })
      .sort({ timestamp: -1 })
      .limit(limit);

    const formattedEvents = events.map(event => ({
      id: event._id,
      user_id: event.userId,
      event_type: event.eventType,
      description: event.description,
      timestamp: event.timestamp,
      metadata: event.metadata
    }));

    res.json({
      success: true,
      securityEvents: formattedEvents,
      total: formattedEvents.length
    });

  } catch (error) {
    console.error('Error fetching security events:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to fetch security events',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/sessions/:sessionId - Revoke a specific session
router.delete('/:sessionId', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const { sessionId } = req.params;
    const userId = req.user?._id;

    const session = await UserSession.findOne({
      _id: sessionId,
      userId,
      isActive: true
    });

    if (!session) {
      return res.status(404).json({
        success: false,
        message: 'Session not found or already revoked'
      });
    }

    // Mark session as inactive
    session.isActive = false;
    await session.save();

    // Log security event
    await SecurityEvent.create({
      userId,
      eventType: 'session_revoked',
      description: `Session revoked: ${session.deviceName} from ${session.location}`,
      metadata: {
        sessionId: session.sessionId,
        ipAddress: session.ipAddress,
        userAgent: session.userAgent,
        severity: 'low'
      }
    });

    res.json({
      success: true,
      message: 'Session revoked successfully'
    });

  } catch (error) {
    console.error('Error revoking session:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke session',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// DELETE /api/sessions/revoke-all - Revoke all sessions except current
router.delete('/revoke-all', authenticateToken, async (req: AuthRequest, res: Response) => {
  try {
    const userId = req.user?._id;
    const currentToken = req.headers.authorization?.split(' ')[1];

    // Find current session to exclude it
    let currentSessionId = null;
    if (currentToken) {
      try {
        const decoded = jwt.decode(currentToken) as any;
        currentSessionId = decoded?.sessionId;
      } catch (e) {
        // If we can't decode the token, we'll revoke all sessions
      }
    }

    const filter: any = { userId, isActive: true };
    if (currentSessionId) {
      filter.sessionId = { $ne: currentSessionId };
    }

    const sessionsToRevoke = await UserSession.find(filter);
    
    await UserSession.updateMany(filter, { isActive: false });

    // Log security event
    await SecurityEvent.create({
      userId,
      eventType: 'session_revoked',
      description: `All sessions revoked (${sessionsToRevoke.length} sessions)`,
      metadata: {
        revokedSessions: sessionsToRevoke.length,
        severity: 'medium'
      }
    });

    res.json({
      success: true,
      message: `${sessionsToRevoke.length} sessions revoked successfully`,
      revokedCount: sessionsToRevoke.length
    });

  } catch (error) {
    console.error('Error revoking all sessions:', error);
    res.status(500).json({
      success: false,
      message: 'Failed to revoke sessions',
      error: error instanceof Error ? error.message : 'Unknown error'
    });
  }
});

// POST /api/sessions/create - Create new session (called during login)
export async function createUserSession(userId: string, req: Request): Promise<string> {
  try {
    const userAgent = req.headers['user-agent'] || 'Unknown';
    const ipAddress = req.ip || req.headers['x-forwarded-for'] || req.connection.remoteAddress || 'Unknown';
    const deviceInfo = parseUserAgent(userAgent);
    const locationInfo = await getLocationFromIP(ipAddress.toString());

    // Generate unique session ID
    const sessionId = jwt.sign(
      { userId, timestamp: Date.now() },
      process.env.JWT_SECRET || 'fallback-secret',
      { expiresIn: '30d' }
    );

    // Create session record
    const session = await UserSession.create({
      userId,
      sessionId,
      ...deviceInfo,
      ...locationInfo,
      ipAddress: ipAddress.toString(),
      userAgent,
      loginAttempts: [{
        timestamp: new Date(),
        status: 'success',
        ipAddress: ipAddress.toString(),
        userAgent
      }]
    });

    // Log security event
    await SecurityEvent.create({
      userId,
      eventType: 'login_success',
      description: `Successful login from ${deviceInfo.deviceName} in ${locationInfo.location}`,
      metadata: {
        ipAddress: ipAddress.toString(),
        userAgent,
        location: locationInfo.location,
        sessionId,
        severity: 'low'
      }
    });

    return sessionId;

  } catch (error) {
    console.error('Error creating session:', error);
    throw error;
  }
}

// Update session activity
export async function updateSessionActivity(sessionId: string): Promise<void> {
  try {
    await UserSession.updateOne(
      { sessionId, isActive: true },
      { lastActive: new Date() }
    );
  } catch (error) {
    console.error('Error updating session activity:', error);
  }
}

export default router;