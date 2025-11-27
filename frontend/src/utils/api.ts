// API Configuration for Infera AI Backend
export const API_CONFIG = {
  BASE_URL: process.env.NEXT_PUBLIC_API_URL || 'http://localhost:5000/api',
  TIMEOUT: 10000, // 10 seconds
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
    MY_APPLICATIONS: '/applications/my-applications',
    GET: (id: string) => `/applications/${id}`,
    UPDATE_STATUS: (id: string) => `/applications/${id}/status`,
    STATS: '/applications/stats/overview',
    MY_STATS: '/applications/my-stats',
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
    console.log('📡 Making GET request to:', fullUrl);
    
    const headers: HeadersInit = {
      'Content-Type': 'application/json',
    };
    
    if (token) {
      headers.Authorization = `Bearer ${token}`;
      console.log('📡 Authorization header added');
    } else {
      console.log('⚠️ No authorization token provided');
    }

    try {
      const response = await fetch(fullUrl, {
        method: 'GET',
        headers,
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
        } catch (e) {
          console.log('📡 Could not parse error response');
        }
        throw new Error(errorMessage);
      }
      
      const data = await response.json();
      console.log('📡 Response data:', data);
      return data;
      
    } catch (error: any) {
      console.error('📡 Network error:', error.message);
      console.error('📡 Full error:', error);
      
      // Handle authentication errors
      if (error.message.includes('User not found') || 
          error.message.includes('Invalid token') ||
          error.message.includes('Access token required')) {
        console.warn('📡 Authentication error detected, clearing local storage');
        // Clear all authentication data
        localStorage.removeItem('infera_session');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('infera_auth_state');
        
        throw new Error('Authentication failed - please sign in again');
      }
      
      // Re-throw with more specific error message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connection failed - please check if the backend server is running');
      }
      throw error;
    }
  },
  
  post: async (url: string, data?: any, token?: string) => {
    try {
      const fullUrl = url.startsWith('http') ? url : `${API_CONFIG.BASE_URL}${url}`;
      console.log('📡 Making POST request to:', fullUrl);
      console.log('📡 Request data:', { ...data, password: data?.password ? '***' : undefined });
      
      const headers: HeadersInit = {
        'Content-Type': 'application/json',
      };
      
      if (token) {
        headers.Authorization = `Bearer ${token}`;
      }
      
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
    } catch (error: any) {
      console.error('📡 POST error:', error.message);
      
      // Handle authentication errors
      if (error.message.includes('User not found') || 
          error.message.includes('Invalid token') ||
          error.message.includes('Access token required')) {
        console.warn('📡 Authentication error detected, clearing local storage');
        // Clear all authentication data
        localStorage.removeItem('infera_session');
        localStorage.removeItem('accessToken');
        localStorage.removeItem('infera_auth_state');
        
        throw new Error('Authentication failed - please sign in again');
      }
      
      // Re-throw with more specific error message
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        throw new Error('Network connection failed - please check if the backend server is running');
      }
      throw error;
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

// Task Management Functions
export const submitTask = async (taskId: string, submissionData: any, token?: string) => {
  try {
    console.log('📝 Submitting task:', { taskId, submissionData });
    
    const response = await apiClient.put(
      API_ENDPOINTS.TASKS.SUBMIT(taskId),
      submissionData,
      token
    );
    
    console.log('✅ Task submission response:', response);
    return response;
  } catch (error) {
    console.error('❌ Task submission error:', error);
    throw error;
  }
};

export const updateTaskProgress = async (taskId: string, progressData: any, token?: string) => {
  try {
    console.log('📈 Updating task progress:', { taskId, progressData });
    
    const response = await apiClient.put(
      API_ENDPOINTS.TASKS.UPDATE_PROGRESS(taskId),
      progressData,
      token
    );
    
    console.log('✅ Progress update response:', response);
    return response;
  } catch (error) {
    console.error('❌ Progress update error:', error);
    throw error;
  }
};