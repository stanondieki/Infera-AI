import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG, API_ENDPOINTS, apiClient, buildApiUrl } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role?: string;
  joinedDate?: string;
  applications?: any[];
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string) => Promise<void>;
  signOut: () => Promise<void>;
  loading: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

// Local user storage for demo/development
const LOCAL_USERS_KEY = 'inferaai_local_users';
const LOCAL_SESSION_KEY = 'inferaai_session';

interface LocalUser {
  id: string;
  email: string;
  password: string;
  name: string;
  role: string;
  joinedDate: string;
}

function getLocalUsers(): LocalUser[] {
  // Initialize with demo accounts
  const initialUsers: LocalUser[] = [
    {
      id: 'demo-user-1',
      email: 'demo@inferaai.com',
      password: 'Demo123!',
      name: 'Demo User',
      role: 'user',
      joinedDate: new Date().toISOString(),
    },
    {
      id: 'admin-user-1',
      email: 'admin@inferaai.com',
      password: 'Admin123!',
      name: 'Admin User',
      role: 'admin',
      joinedDate: new Date().toISOString(),
    },
  ];

  try {
    const stored = localStorage.getItem(LOCAL_USERS_KEY);
    if (stored) {
      const parsedUsers = JSON.parse(stored);
      // Make sure demo accounts always exist
      const demoExists = parsedUsers.some((u: LocalUser) => u.email === 'demo@inferaai.com');
      const adminExists = parsedUsers.some((u: LocalUser) => u.email === 'admin@inferaai.com');
      
      if (!demoExists || !adminExists) {
        // Re-add missing demo accounts
        const updatedUsers = [...parsedUsers];
        if (!demoExists) updatedUsers.push(initialUsers[0]);
        if (!adminExists) updatedUsers.push(initialUsers[1]);
        localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(updatedUsers));
        return updatedUsers;
      }
      
      return parsedUsers;
    }
  } catch (error) {
    console.error('Error loading local users:', error);
  }
  
  // First time initialization
  localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(initialUsers));
  return initialUsers;
}

function saveLocalUsers(users: LocalUser[]): void {
  try {
    localStorage.setItem(LOCAL_USERS_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving local users:', error);
  }
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session in localStorage
    const storedSession = localStorage.getItem(LOCAL_SESSION_KEY);

    if (storedSession) {
      try {
        const session = JSON.parse(storedSession);
        setAccessToken(session.accessToken);
        setUser(session.user);
      } catch (error) {
        console.error('Error loading session:', error);
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
    }
    setLoading(false);
  }, []);

  const signIn = async (email: string, password: string) => {
    try {
      console.log('[CLIENT] Attempting to sign in:', email);
      
      // Try API first
      try {
        const response = await apiClient.post(
          buildApiUrl(API_ENDPOINTS.AUTH.LOGIN),
          { email, password }
        );

        if (response.success && response.accessToken && response.user) {
          setAccessToken(response.accessToken);
          setUser(response.user);

          // Persist to localStorage
          localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
            accessToken: response.accessToken,
            user: response.user,
          }));
          
          console.log('[CLIENT] ✓ Sign in successful (API):', response.user.email);
          return response.user;
        }
      } catch (apiError) {
        console.log('[CLIENT] API unavailable, using local authentication');
      }

      // Fallback to local authentication
      let localUsers = getLocalUsers();
      
      // Also check admin-created users
      try {
        const adminUsers = JSON.parse(localStorage.getItem('inferaai_admin_users') || '[]');
        console.log('[CLIENT] Admin users from storage:', adminUsers.map((u: any) => ({ email: u.email, hasPassword: !!u.password })));
        
        // Convert admin users to auth user format
        const adminAuthUsers = adminUsers
          .filter((u: any) => u.password) // Only include users with passwords
          .map((u: any) => ({
            id: u.id,
            email: u.email,
            password: u.password,
            name: `${u.first_name} ${u.last_name}`,
            role: u.role,
            joinedDate: u.created_at,
          }));
        
        console.log('[CLIENT] Admin auth users after conversion:', adminAuthUsers.map((u: LocalUser) => u.email));
        
        // Merge with local users (avoiding duplicates by email)
        const allEmails = new Set(localUsers.map(u => u.email));
        adminAuthUsers.forEach((u: LocalUser) => {
          if (!allEmails.has(u.email)) {
            localUsers.push(u);
          }
        });
      } catch (error) {
        console.error('[CLIENT] Error loading admin users:', error);
      }
      
      console.log('[CLIENT] Local users available:', localUsers.map(u => u.email));
      console.log('[CLIENT] Attempting to match:', email);
      
      // Debug: Check specific user
      const userExists = localUsers.find(u => u.email === email);
      if (userExists) {
        console.log('[CLIENT] User found with email:', email);
        console.log('[CLIENT] Stored password:', userExists.password);
        console.log('[CLIENT] Provided password:', password);
        console.log('[CLIENT] Passwords match:', userExists.password === password);
        console.log('[CLIENT] Password comparison:', {
          stored: userExists.password,
          provided: password,
          storedLength: userExists.password?.length,
          providedLength: password.length
        });
      } else {
        console.error('[CLIENT] No user found with email:', email);
      }
      
      const localUser = localUsers.find(u => u.email === email && u.password === password);

      if (!localUser) {
        console.error('[CLIENT] No matching user found');
        console.error('[CLIENT] Available emails:', localUsers.map(u => u.email));
        console.error('[CLIENT] Tried email:', email);
        if (userExists) {
          console.error('[CLIENT] User exists but password does not match');
          console.error('[CLIENT] HINT: Use the admin panel to reset this user\'s password');
        }
        throw new Error('Invalid credentials. Please check your email and password.');
      }

      // Create user object and token
      const userData: User = {
        id: localUser.id,
        email: localUser.email,
        name: localUser.name,
        role: localUser.role,
        joinedDate: localUser.joinedDate,
      };

      const token = `local_token_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`;

      setAccessToken(token);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
        accessToken: token,
        user: userData,
      }));
      
      console.log('[CLIENT] ✓ Sign in successful (Local):', userData.email);
      console.log('[CLIENT] User role:', userData.role);
      
      return userData;
    } catch (error) {
      console.error('[CLIENT] Sign in error:', error);
      throw error;
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[CLIENT] Attempting to sign up:', email);
      
      // Try backend API first
      try {
        const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
          email,
          password,
          name
        });

        console.log('[CLIENT] ✓ Sign up successful (Backend):', email);
        
        // After signup, sign in automatically
        await signIn(email, password);
        return;
      } catch (apiError: any) {
        console.log('[CLIENT] Backend API error:', apiError.message);
        console.log('[CLIENT] Falling back to local authentication');
      }

      // Fallback to local authentication
      const localUsers = getLocalUsers();
      
      // Check if user already exists
      if (localUsers.find(u => u.email === email)) {
        throw new Error('An account with this email already exists');
      }

      // Create new user
      const newUser: LocalUser = {
        id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
        email,
        password,
        name,
        role: 'user',
        joinedDate: new Date().toISOString(),
      };

      localUsers.push(newUser);
      saveLocalUsers(localUsers);

      // Also add to admin users storage for consistency
      try {
        const adminUsers = JSON.parse(localStorage.getItem('inferaai_admin_users') || '[]');
        const nameParts = name.split(' ');
        const firstName = nameParts[0] || 'User';
        const lastName = nameParts.slice(1).join(' ') || '';
        
        adminUsers.push({
          id: newUser.id,
          email: newUser.email,
          first_name: firstName,
          last_name: lastName,
          role: newUser.role,
          status: 'active',
          hourly_rate: 0,
          total_earned: 0,
          tasks_completed: 0,
          created_at: newUser.joinedDate,
          last_active: newUser.joinedDate,
          password: newUser.password,
        });
        localStorage.setItem('inferaai_admin_users', JSON.stringify(adminUsers));
      } catch (error) {
        console.error('[CLIENT] Error syncing with admin storage:', error);
      }

      console.log('[CLIENT] ✓ Sign up successful (Local):', email);

      // After signup, sign in automatically
      await signIn(email, password);
    } catch (error) {
      console.error('[CLIENT] Sign up error:', error);
      throw error;
    }
  };

  const signOut = async () => {
    try {
      if (accessToken && !accessToken.startsWith('local_token_')) {
        try {
          await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, accessToken);
        } catch (error) {
          console.log('Backend sign out failed, continuing with local sign out');
        }
      }
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setUser(null);
      setAccessToken(null);
      localStorage.removeItem(LOCAL_SESSION_KEY);
      console.log('[CLIENT] ✓ Signed out successfully');
    }
  };

  return (
    <AuthContext.Provider value={{ user, accessToken, signIn, signUp, signOut, loading }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
