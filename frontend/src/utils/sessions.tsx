import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/server`;

export interface Session {
  id: string;
  user_id: string;
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  device_name: string;
  browser: string;
  os: string;
  location: string;
  city: string;
  country: string;
  ip_address: string;
  last_active: string;
  created_at: string;
  is_current: boolean;
  user_agent: string;
}

export interface LoginAttempt {
  id: string;
  user_id: string;
  status: 'success' | 'failed' | 'suspicious' | 'blocked';
  device_type: 'Desktop' | 'Mobile' | 'Tablet';
  device_name: string;
  browser: string;
  os: string;
  location: string;
  city: string;
  country: string;
  ip_address: string;
  timestamp: string;
  failure_reason?: string;
  user_agent: string;
}

export interface SecurityEvent {
  id: string;
  user_id: string;
  event_type: 'password_change' | 'session_revoked' | 'suspicious_login' | 'account_locked' | 'security_alert';
  description: string;
  timestamp: string;
  metadata?: any;
}

const SESSIONS_STORAGE_KEY = 'inferaai_user_sessions';
const LOGIN_HISTORY_STORAGE_KEY = 'inferaai_login_history';
const SECURITY_EVENTS_STORAGE_KEY = 'inferaai_security_events';

// Helper function to detect device type from user agent
function detectDeviceType(userAgent: string): 'Desktop' | 'Mobile' | 'Tablet' {
  if (/Mobile|Android|iPhone/i.test(userAgent)) return 'Mobile';
  if (/iPad|Tablet/i.test(userAgent)) return 'Tablet';
  return 'Desktop';
}

// Helper function to detect browser from user agent
function detectBrowser(userAgent: string): string {
  if (userAgent.includes('Chrome')) return 'Chrome';
  if (userAgent.includes('Safari')) return 'Safari';
  if (userAgent.includes('Firefox')) return 'Firefox';
  if (userAgent.includes('Edge')) return 'Edge';
  if (userAgent.includes('Opera')) return 'Opera';
  return 'Unknown Browser';
}

// Helper function to detect OS from user agent
function detectOS(userAgent: string): string {
  if (userAgent.includes('Windows')) return 'Windows';
  if (userAgent.includes('Mac')) return 'macOS';
  if (userAgent.includes('Linux')) return 'Linux';
  if (userAgent.includes('Android')) return 'Android';
  if (userAgent.includes('iOS')) return 'iOS';
  return 'Unknown OS';
}

function getInitialSessions(userId: string): Session[] {
  const userAgent = navigator.userAgent;
  const deviceType = detectDeviceType(userAgent);
  const browser = detectBrowser(userAgent);
  const os = detectOS(userAgent);

  return [
    {
      id: '1',
      user_id: userId,
      device_type: deviceType,
      device_name: `${deviceType} - ${os}`,
      browser: `${browser} on ${os}`,
      os,
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.1',
      last_active: new Date().toISOString(),
      created_at: new Date().toISOString(),
      is_current: true,
      user_agent: userAgent,
    },
    {
      id: '2',
      user_id: userId,
      device_type: 'Mobile',
      device_name: 'Mobile - iOS',
      browser: 'Safari on iOS',
      os: 'iOS',
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.2',
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      is_current: false,
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    },
    {
      id: '3',
      user_id: userId,
      device_type: 'Desktop',
      device_name: 'Desktop - Windows',
      browser: 'Firefox on Windows',
      os: 'Windows',
      location: 'New York, NY, United States',
      city: 'New York',
      country: 'United States',
      ip_address: '192.168.1.3',
      last_active: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      is_current: false,
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0)',
    },
  ];
}

function getInitialLoginHistory(userId: string): LoginAttempt[] {
  return [
    {
      id: '1',
      user_id: userId,
      status: 'success',
      device_type: 'Desktop',
      device_name: 'Desktop - macOS',
      browser: 'Chrome on macOS',
      os: 'macOS',
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.1',
      timestamp: new Date().toISOString(),
      user_agent: navigator.userAgent,
    },
    {
      id: '2',
      user_id: userId,
      status: 'success',
      device_type: 'Mobile',
      device_name: 'Mobile - iOS',
      browser: 'Safari on iOS',
      os: 'iOS',
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.2',
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
      user_agent: 'Mozilla/5.0 (iPhone; CPU iPhone OS 15_0 like Mac OS X)',
    },
    {
      id: '3',
      user_id: userId,
      status: 'success',
      device_type: 'Desktop',
      device_name: 'Desktop - macOS',
      browser: 'Chrome on macOS',
      os: 'macOS',
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.1',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      user_agent: navigator.userAgent,
    },
    {
      id: '4',
      user_id: userId,
      status: 'failed',
      device_type: 'Desktop',
      device_name: 'Desktop - Windows',
      browser: 'Firefox on Windows',
      os: 'Windows',
      location: 'New York, NY, United States',
      city: 'New York',
      country: 'United States',
      ip_address: '192.168.1.3',
      timestamp: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      failure_reason: 'Incorrect password',
      user_agent: 'Mozilla/5.0 (Windows NT 10.0; Win64; x64; rv:91.0)',
    },
    {
      id: '5',
      user_id: userId,
      status: 'success',
      device_type: 'Desktop',
      device_name: 'Desktop - macOS',
      browser: 'Chrome on macOS',
      os: 'macOS',
      location: 'San Francisco, CA, United States',
      city: 'San Francisco',
      country: 'United States',
      ip_address: '192.168.1.1',
      timestamp: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      user_agent: navigator.userAgent,
    },
    {
      id: '6',
      user_id: userId,
      status: 'suspicious',
      device_type: 'Desktop',
      device_name: 'Desktop - Linux',
      browser: 'Chrome on Linux',
      os: 'Linux',
      location: 'Moscow, Russia',
      city: 'Moscow',
      country: 'Russia',
      ip_address: '185.220.101.1',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
    },
    {
      id: '7',
      user_id: userId,
      status: 'blocked',
      device_type: 'Desktop',
      device_name: 'Desktop - Linux',
      browser: 'Chrome on Linux',
      os: 'Linux',
      location: 'Beijing, China',
      city: 'Beijing',
      country: 'China',
      ip_address: '123.45.67.89',
      timestamp: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      failure_reason: 'Too many failed attempts',
      user_agent: 'Mozilla/5.0 (X11; Linux x86_64)',
    },
  ];
}

function getInitialSecurityEvents(userId: string): SecurityEvent[] {
  return [
    {
      id: '1',
      user_id: userId,
      event_type: 'password_change',
      description: 'Password was changed successfully',
      timestamp: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      user_id: userId,
      event_type: 'session_revoked',
      description: 'Session from Windows device was revoked',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      user_id: userId,
      event_type: 'suspicious_login',
      description: 'Suspicious login attempt detected from Russia',
      timestamp: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function loadSessions(userId: string): Session[] {
  try {
    const stored = localStorage.getItem(`${SESSIONS_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading sessions:', error);
  }
  return getInitialSessions(userId);
}

function saveSessions(userId: string, sessions: Session[]): void {
  try {
    localStorage.setItem(`${SESSIONS_STORAGE_KEY}_${userId}`, JSON.stringify(sessions));
  } catch (error) {
    console.error('Error saving sessions:', error);
  }
}

function loadLoginHistory(userId: string): LoginAttempt[] {
  try {
    const stored = localStorage.getItem(`${LOGIN_HISTORY_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading login history:', error);
  }
  return getInitialLoginHistory(userId);
}

function saveLoginHistory(userId: string, history: LoginAttempt[]): void {
  try {
    localStorage.setItem(`${LOGIN_HISTORY_STORAGE_KEY}_${userId}`, JSON.stringify(history));
  } catch (error) {
    console.error('Error saving login history:', error);
  }
}

export async function getSessions(userId: string): Promise<Session[]> {
  try {
    const response = await fetch(`${API_URL}/sessions?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.sessions || [];
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  return loadSessions(userId);
}

export async function revokeSession(userId: string, sessionId: string): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sessions/${sessionId}`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      return;
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const sessions = loadSessions(userId);
  const filteredSessions = sessions.filter(s => s.id !== sessionId);
  saveSessions(userId, filteredSessions);
}

export async function revokeAllSessions(userId: string, exceptCurrent: boolean = true): Promise<void> {
  try {
    const response = await fetch(`${API_URL}/sessions/revoke-all`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
      body: JSON.stringify({ user_id: userId, except_current: exceptCurrent }),
    });

    if (response.ok) {
      return;
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const sessions = loadSessions(userId);
  const filteredSessions = exceptCurrent ? sessions.filter(s => s.is_current) : [];
  saveSessions(userId, filteredSessions);
}

export async function getLoginHistory(userId: string, limit: number = 50): Promise<LoginAttempt[]> {
  try {
    const response = await fetch(`${API_URL}/login-history?user_id=${userId}&limit=${limit}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.history || [];
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  return loadLoginHistory(userId);
}

export async function getSecurityEvents(userId: string): Promise<SecurityEvent[]> {
  try {
    const response = await fetch(`${API_URL}/security-events?user_id=${userId}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`,
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.events || [];
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback
  try {
    const stored = localStorage.getItem(`${SECURITY_EVENTS_STORAGE_KEY}_${userId}`);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading security events:', error);
  }
  
  return getInitialSecurityEvents(userId);
}

export function getSessionStats(sessions: Session[]) {
  return {
    total: sessions.length,
    active: sessions.filter(s => {
      const lastActive = new Date(s.last_active);
      const hoursSinceActive = (Date.now() - lastActive.getTime()) / (1000 * 60 * 60);
      return hoursSinceActive < 1;
    }).length,
    devices: {
      desktop: sessions.filter(s => s.device_type === 'Desktop').length,
      mobile: sessions.filter(s => s.device_type === 'Mobile').length,
      tablet: sessions.filter(s => s.device_type === 'Tablet').length,
    },
  };
}

export function getLoginStats(history: LoginAttempt[]) {
  return {
    total: history.length,
    successful: history.filter(h => h.status === 'success').length,
    failed: history.filter(h => h.status === 'failed').length,
    suspicious: history.filter(h => h.status === 'suspicious').length,
    blocked: history.filter(h => h.status === 'blocked').length,
  };
}

export function formatLastActive(timestamp: string): string {
  const now = Date.now();
  const then = new Date(timestamp).getTime();
  const diffMs = now - then;
  
  const diffMins = Math.floor(diffMs / (1000 * 60));
  const diffHours = Math.floor(diffMs / (1000 * 60 * 60));
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffMins < 1) return 'Active now';
  if (diffMins < 60) return `${diffMins} minute${diffMins !== 1 ? 's' : ''} ago`;
  if (diffHours < 24) return `${diffHours} hour${diffHours !== 1 ? 's' : ''} ago`;
  if (diffDays < 7) return `${diffDays} day${diffDays !== 1 ? 's' : ''} ago`;
  
  return new Date(timestamp).toLocaleDateString();
}
