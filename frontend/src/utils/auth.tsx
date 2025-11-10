import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { API_CONFIG, API_ENDPOINTS, apiClient, buildApiUrl } from './api';

interface User {
  id: string;
  email: string;
  name?: string;
  first_name?: string;
  last_name?: string;
  role?: string;
  joinedDate?: string;
  created_at?: string;
  applications?: any[];
  phone?: string;
  location?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  timezone?: string;
  language?: string;
  hourly_rate?: number;
  total_earned?: number;
  tasks_completed?: number;
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

// Session storage key
const LOCAL_SESSION_KEY = 'inferaai_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check for existing session on app load
    const checkSession = () => {
      try {
        const storedSession = localStorage.getItem(LOCAL_SESSION_KEY);
        if (storedSession) {
          const { accessToken: token, user: userData } = JSON.parse(storedSession);
          if (token && userData) {
            setAccessToken(token);
            setUser(userData);
            console.log('[CLIENT] ✓ Session restored for:', userData.email);
          }
        }
      } catch (error) {
        console.error('[CLIENT] Error restoring session:', error);
        // Clear corrupted session
        localStorage.removeItem(LOCAL_SESSION_KEY);
      }
      setLoading(false);
    };

    checkSession();
  }, []);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      console.log('[CLIENT] Attempting to sign in:', email);
      
      const response = await apiClient.post(buildApiUrl(API_ENDPOINTS.AUTH.LOGIN), {
        email,
        password
      });

      console.log('[CLIENT] Raw response:', response);
      console.log('[CLIENT] Response data:', response);

      if (!response || !response.user || !response.accessToken) {
        console.error('[CLIENT] Missing user or token in response:', response);
        throw new Error('Invalid response from server - missing user or token');
      }

      const userData: User = response.user;
      const token = response.accessToken;

      setAccessToken(token);
      setUser(userData);

      // Persist to localStorage
      localStorage.setItem(LOCAL_SESSION_KEY, JSON.stringify({
        accessToken: token,
        user: userData,
      }));
      
      console.log('[CLIENT] ✓ Sign in successful:', userData.email);
      console.log('[CLIENT] User role:', userData.role);
      
      return userData;
    } catch (error: any) {
      console.error('[CLIENT] Sign in error:', error);
      throw new Error(error.response?.data?.message || 'Failed to sign in. Please check your credentials.');
    }
  };

  const signUp = async (email: string, password: string, name: string) => {
    try {
      console.log('[CLIENT] Attempting to sign up:', email);
      
      const response = await apiClient.post(buildApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
        email,
        password,
        name
      });

      console.log('[CLIENT] ✓ Sign up successful:', email);
      
      // After signup, sign in automatically
      await signIn(email, password);
    } catch (error: any) {
      console.error('[CLIENT] Sign up error:', error);
      throw new Error(error.response?.data?.message || 'Failed to create account. Please try again.');
    }
  };

  const signOut = async () => {
    try {
      if (accessToken) {
        try {
          await apiClient.post(buildApiUrl(API_ENDPOINTS.AUTH.LOGOUT), {}, accessToken);
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
    <AuthContext.Provider value={{
      user,
      accessToken,
      signIn,
      signUp,
      signOut,
      loading,
    }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthProvider;