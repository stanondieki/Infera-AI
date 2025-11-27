"use client";

import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { apiClient, API_ENDPOINTS } from './api';

interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive?: boolean;
  avatar?: string;
  createdAt?: string;
  
  // Additional profile fields
  phone?: string;
  location?: string;
  bio?: string;
  jobTitle?: string;
  company?: string;
  website?: string;
  timezone?: string;
  language?: string;
  skills?: string[];
  languages?: string[];
  github?: string;
  linkedin?: string;
}

interface AuthContextType {
  user: User | null;
  accessToken: string | null;
  signIn: (email: string, password: string) => Promise<User>;
  signUp: (email: string, password: string, name: string) => Promise<User>;
  signOut: () => void;
  isLoading: boolean;
  isAuthenticated: boolean;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

const SESSION_KEY = 'infera_session';

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [accessToken, setAccessToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Initialize auth state from storage
  useEffect(() => {
    const initAuth = async () => {
      try {
        const savedSession = localStorage.getItem(SESSION_KEY);
        if (savedSession) {
          const session = JSON.parse(savedSession);
          if (session?.user && session?.accessToken) {
            console.log('[AUTH] Session found for:', session.user.email);
            console.log('[AUTH] Validating token...');
            
            // Validate token by calling /me endpoint
            try {
              const response = await apiClient.get(API_ENDPOINTS.AUTH.ME, session.accessToken);
              if (response.success && response.user) {
                console.log('[AUTH] Token valid, session restored');
                setUser({
                  id: response.user.id,
                  email: response.user.email,
                  name: response.user.name,
                  role: response.user.role || 'user',
                  isActive: response.user.isActive,
                  avatar: response.user.avatar,
                  createdAt: response.user.createdAt,
                  phone: response.user.phone,
                  location: response.user.location,
                  bio: response.user.bio,
                  jobTitle: response.user.jobTitle,
                  company: response.user.company,
                  website: response.user.website,
                  timezone: response.user.timezone,
                  language: response.user.language,
                  skills: response.user.skills,
                  languages: response.user.languages,
                  github: response.user.github,
                  linkedin: response.user.linkedin
                });
                setAccessToken(session.accessToken);
              } else {
                console.log('[AUTH] Token validation failed, clearing session');
                localStorage.removeItem(SESSION_KEY);
                localStorage.removeItem('accessToken');
                localStorage.removeItem('infera_auth_state');
              }
            } catch (error: any) {
              console.error('[AUTH] Token validation error:', error.message);
              console.log('[AUTH] Clearing invalid session');
              localStorage.removeItem(SESSION_KEY);
              localStorage.removeItem('accessToken');
              localStorage.removeItem('infera_auth_state');
            }
          }
        }
      } catch (error) {
        console.error('[AUTH] Session restore failed:', error);
        localStorage.removeItem(SESSION_KEY);
        localStorage.removeItem('accessToken');
        localStorage.removeItem('infera_auth_state');
      } finally {
        setIsLoading(false);
      }
    };

    initAuth();
  }, []);

  // Save session when user/token changes
  useEffect(() => {
    if (user && accessToken) {
      const session = { user, accessToken, timestamp: Date.now() };
      localStorage.setItem(SESSION_KEY, JSON.stringify(session));
    }
  }, [user, accessToken]);

  const signIn = async (email: string, password: string): Promise<User> => {
    try {
      console.log('[AUTH] Signing in:', email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
        email,
        password
      });

      console.log('[AUTH] Login response:', response);

      if (!response.success || !response.user || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      const userData: User = {
        id: response.user.id || response.user._id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role || 'user',
        isActive: response.user.isActive,
        avatar: response.user.avatar,
        createdAt: response.user.createdAt,
      };

      setUser(userData);
      setAccessToken(response.accessToken);
      
      console.log('[AUTH] Sign in successful:', userData.email);
      return userData;

    } catch (error: any) {
      console.error('[AUTH] Sign in failed:', error);
      throw new Error(error.message || 'Sign in failed. Please check your credentials.');
    }
  };

  const signUp = async (email: string, password: string, name: string): Promise<User> => {
    try {
      console.log('[AUTH] Creating account:', email);
      
      const response = await apiClient.post(API_ENDPOINTS.AUTH.REGISTER, {
        email,
        password,
        name
      });

      console.log('[AUTH] Registration response:', response);

      if (!response.success || !response.user || !response.accessToken) {
        throw new Error('Invalid response from server');
      }

      const userData: User = {
        id: response.user.id || response.user._id,
        email: response.user.email,
        name: response.user.name,
        role: response.user.role || 'user',
        isActive: response.user.isActive,
        avatar: response.user.avatar,
        createdAt: response.user.createdAt,
      };

      setUser(userData);
      setAccessToken(response.accessToken);
      
      console.log('[AUTH] Registration successful:', userData.email);
      return userData;

    } catch (error: any) {
      console.error('[AUTH] Registration failed:', error);
      throw new Error(error.message || 'Registration failed. Please try again.');
    }
  };

  const signOut = () => {
    console.log('[AUTH] Signing out');
    
    // Clear all stored authentication data
    localStorage.removeItem(SESSION_KEY);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('infera_auth_state');
    localStorage.removeItem('infera_session');
    
    setUser(null);
    setAccessToken(null);
    
    // Optionally notify backend (don't wait for response)
    if (accessToken) {
      apiClient.post(API_ENDPOINTS.AUTH.LOGOUT, {}, accessToken).catch(() => {});
    }
  };

  const isAuthenticated = !!(user && accessToken);

  return (
    <AuthContext.Provider
      value={{
        user,
        accessToken,
        signIn,
        signUp,
        signOut,
        isLoading,
        isAuthenticated,
      }}
    >
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