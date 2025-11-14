// API Configuration for Infera AI Backend
const getApiBaseUrl = () => {
  // If running in production (Vercel), use a production API URL or mock
  if (typeof window !== 'undefined' && window.location.hostname !== 'localhost') {
    // For now, we'll use a mock API since backend is not deployed
    return process.env.NEXT_PUBLIC_API_URL || 'mock';
  }
  // For local development
  return process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api';
};

export const API_CONFIG = {
  BASE_URL: getApiBaseUrl(),
  TIMEOUT: 10000, // 10 seconds
  IS_MOCK: getApiBaseUrl() === 'mock',
};

// API endpoints
export const API_ENDPOINTS = {
  // Authentication
  AUTH: {
    LOGIN: '/auth/login',
    REGISTER: '/auth/register',
    LOGOUT: '/auth/logout',
    ME: '/auth/me',
    PROFILE: '/auth/profile',
  },
  
  // Applications
  APPLICATIONS: {
    SUBMIT: '/applications/submit',
    STATUS: '/applications/status',
    LIST: '/applications',
    GET: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    STATS: '/applications/stats/overview',
  },
  
  // Opportunities
  OPPORTUNITIES: {
    LIST: '/opportunities',
    FEATURED: '/opportunities/featured',
    GET: (id: string) => `/opportunities/${id}`,
    CREATE: '/opportunities',
    UPDATE: (id: string) => `/opportunities/${id}`,
    DELETE: (id: string) => `/opportunities/${id}`,
    STATS: '/opportunities/stats/overview',
  },
  
  // Tasks
  TASKS: {
    MY_TASKS: '/tasks/my-tasks',
    LIST: '/tasks',
    GET: (id: string) => `/tasks/${id}`,
    CREATE: '/tasks',
    UPDATE: (id: string) => `/tasks/${id}`,
    DELETE: (id: string) => `/tasks/${id}`,
    SUBMIT: (id: string) => `/tasks/${id}/submit`,
    UPDATE_PROGRESS: (id: string) => `/tasks/${id}/progress`,
    REVIEW: (id: string) => `/tasks/${id}/review`,
    STATS: '/tasks/stats/dashboard',
  },
  
  // Users
  USERS: {
    LIST: '/users',
    GET: (id: string) => `/users/${id}`,
    CREATE: '/users',
    UPDATE: (id: string) => `/users/${id}`,
    UPDATE_STATUS: (id: string) => `/users/${id}/status`,
    DELETE: (id: string) => `/users/${id}`,
    STATS: '/users/stats/overview',
    ACTIVITY: (id: string) => `/users/${id}/activity`,
  },
};

// Helper function to build full URL
export const buildApiUrl = (endpoint: string, params?: Record<string, string | number>) => {
  let url = `${API_CONFIG.BASE_URL}${endpoint}`;
  
  if (params) {
    const queryString = new URLSearchParams(
      Object.entries(params).map(([key, value]) => [key, value.toString()])
    ).toString();
    url += `?${queryString}`;
  }
  
  return url;
};

// HTTP client configuration
export const apiClient = {
  get: async (url: string, token?: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(fullUrl, {
      method: 'GET',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  post: async (url: string, data?: any, token?: string) => {
    // Handle mock API for production when backend is not available
    if (API_CONFIG.IS_MOCK) {
      console.log('📡 Using mock API response (backend not available)');
      
      // Simulate network delay
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Return mock responses based on the endpoint
      if (url.includes('/applications/submit')) {
        return {
          success: true,
          message: 'Application submitted successfully (Demo Mode)',
          userCreated: false,
          application: {
            id: 'demo_' + Date.now(),
            email: data?.email || 'demo@example.com',
            firstName: data?.firstName || 'Demo',
            lastName: data?.lastName || 'User',
            status: 'pending',
            submittedAt: new Date().toISOString()
          }
        };
      }
      
      if (url.includes('/auth/register')) {
        return {
          success: true,
          message: 'User registered successfully (Demo Mode)',
          user: {
            id: 'demo_user_' + Date.now(),
            email: data?.email || 'demo@example.com',
            name: data?.name || 'Demo User'
          }
        };
      }
      
      // Default mock response
      return { success: true, message: 'Demo mode response', data: data };
    }
    
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    console.log('📡 Making POST request to:', fullUrl);
    console.log('📡 Request data:', { ...data, password: data?.password ? '***' : undefined });
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    try {
      const response = await fetch(fullUrl, {
        method: 'POST',
        headers,
        body: data ? JSON.stringify(data) : undefined,
      });
      
      console.log('📡 Response status:', response.status);
      
      if (!response.ok) {
        let errorMessage = `HTTP error! status: ${response.status}`;
        try {
          const errorData = await response.json();
          console.log('📡 Error response data:', errorData);
          if (errorData.message) {
            errorMessage = errorData.message;
          }
          if (errorData.errors && Array.isArray(errorData.errors)) {
            errorMessage += '\nValidation errors: ' + errorData.errors.map((e: any) => e.msg).join(', ');
          }
        } catch (e) {
          console.log('📡 Could not parse error response');
        }
        throw new Error(errorMessage);
      }
      
      const responseData = await response.json();
      console.log('📡 Response data:', responseData);
      return responseData;
    } catch (fetchError: any) {
      // If fetch fails (e.g., CORS, network error), fall back to mock response
      if (fetchError.name === 'TypeError' || fetchError.message.includes('Failed to fetch')) {
        console.log('📡 Fetch failed, using mock response as fallback');
        
        if (url.includes('/applications/submit')) {
          return {
            success: true,
            message: 'Application submitted successfully (Demo Mode - Backend Unavailable)',
            userCreated: false,
            application: {
              id: 'demo_' + Date.now(),
              email: data?.email || 'demo@example.com',
              firstName: data?.firstName || 'Demo',
              lastName: data?.lastName || 'User',
              status: 'pending',
              submittedAt: new Date().toISOString()
            }
          };
        }
        
        return { success: true, message: 'Demo mode fallback response', data: data };
      }
      
      throw fetchError;
    }
  },
  
  put: async (url: string, data?: any, token?: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(fullUrl, {
      method: 'PUT',
      headers,
      body: data ? JSON.stringify(data) : undefined,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
  
  delete: async (url: string, token?: string) => {
    const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }
    
    const response = await fetch(fullUrl, {
      method: 'DELETE',
      headers,
    });
    
    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }
    
    return response.json();
  },
};