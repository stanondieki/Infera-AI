import { apiClient, API_ENDPOINTS } from './api';

export interface User {
  id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  isActive: boolean;
  hourly_rate?: number;
  totalEarnings?: number;
  completedTasks?: number;
  password?: string; // Only returned on creation
  payment_method?: PaymentMethod;
  createdAt: string;
  lastLoginDate?: string;
  avatar?: string;
  bio?: string;
  skills?: string[];
  isVerified?: boolean;
  approvalStatus?: 'pending' | 'approved' | 'rejected';
}

export interface PaymentMethod {
  type: 'paypal' | 'bank_transfer' | 'stripe' | 'crypto';
  details: {
    email?: string; // For PayPal
    account_number?: string; // For bank
    routing_number?: string; // For bank
    account_holder?: string; // For bank
    wallet_address?: string; // For crypto
  };
  verified: boolean;
  added_at: string;
}

// Local storage keys
const USERS_STORAGE_KEY = 'inferaai_admin_users';

// Initialize with sample data
function getInitialUsers(): User[] {
  return [
    {
      id: '1',
      email: 'system@inferaai.com',
      name: 'System User',
      role: 'user',
      isActive: true,
      hourly_rate: 45,
      totalEarnings: 2847.50,
      completedTasks: 23,
      createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date().toISOString(),
      password: 'Demo123!',
    },
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      name: 'Sarah Johnson',
      role: 'user',
      isActive: true,
      hourly_rate: 50,
      totalEarnings: 4250.00,
      completedTasks: 31,
      createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      email: 'michael.chen@example.com',
      name: 'Michael Chen',
      role: 'user',
      isActive: true,
      hourly_rate: 55,
      totalEarnings: 5890.00,
      completedTasks: 42,
      createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      email: 'emily.rodriguez@example.com',
      name: 'Emily Rodriguez',
      role: 'admin',
      isActive: true,
      hourly_rate: 60,
      totalEarnings: 3420.00,
      completedTasks: 18,
      createdAt: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      email: 'david.patel@example.com',
      name: 'David Patel',
      role: 'user',
      isActive: false,
      hourly_rate: 40,
      totalEarnings: 1280.00,
      completedTasks: 8,
      createdAt: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      email: 'admin@inferaai.com',
      name: 'Admin User',
      role: 'admin',
      isActive: true,
      hourly_rate: 0,
      totalEarnings: 0,
      completedTasks: 0,
      createdAt: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      lastLoginDate: new Date().toISOString(),
      password: 'Admin123!',
    },
  ];
}

// Load users from localStorage or return initial data
function loadUsers(): User[] {
  try {
    const stored = localStorage.getItem(USERS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading users from storage:', error);
  }
  return getInitialUsers();
}

// Save users to localStorage
function saveUsers(users: User[]): void {
  try {
    localStorage.setItem(USERS_STORAGE_KEY, JSON.stringify(users));
  } catch (error) {
    console.error('Error saving users to storage:', error);
  }
}

export async function getUsers(accessToken?: string): Promise<User[]> {
  try {
    console.log('👥 Fetching users from backend...');
    // Request a higher limit to get all users (or implement pagination later)
    const response = await apiClient.get(`${API_ENDPOINTS.USERS.LIST}?limit=100`, accessToken);
    console.log('👥 Backend users response:', response);
    
    if (response.success && response.users) {
      console.log('👥 Users from backend:', response.users);
      return response.users.map((user: any) => ({
        id: user._id || user.id,
        email: user.email,
        name: user.name,
        role: user.role,
        isActive: user.isActive !== false, // Default to true if undefined
        hourly_rate: user.hourly_rate || user.hourlyRate,
        totalEarnings: user.totalEarnings,
        completedTasks: user.completedTasks,
        createdAt: user.createdAt,
        lastLoginDate: user.lastLoginDate,
        avatar: user.avatar,
        bio: user.bio,
        skills: user.skills,
        isVerified: user.isVerified,
        approvalStatus: user.approvalStatus,
      }));
    }
    
    return response.users || response || [];
  } catch (error: any) {
    console.warn('⚠️ Backend API error:', error.message);
    
    // If authentication failed, return empty array for live system
    if (error.message.includes('Authentication failed') || 
        error.message.includes('Access token required') ||
        error.message.includes('User not found')) {
      console.log('🔐 Authentication required to fetch live users');
      return [];
    }
    
    console.log('📝 Falling back to local storage as last resort');
  }

  // Fallback to local storage only for development/offline mode
  return loadUsers();
}

export async function createUser(userData: {
  email: string;
  name: string;
  role: 'user' | 'admin';
  hourly_rate?: number;
  password?: string;
}, accessToken?: string): Promise<{ user: User; password: string }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.USERS.CREATE, userData, accessToken);
    return response;
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const users = loadUsers();
  
  // Check if email already exists
  if (users.some(u => u.email === userData.email)) {
    throw new Error('User with this email already exists');
  }

  const password = userData.password || generatePassword();
  const newUser: User = {
    id: `user_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    email: userData.email,
    name: userData.name,
    role: userData.role,
    isActive: true,
    hourly_rate: userData.hourly_rate,
    totalEarnings: 0,
    completedTasks: 0,
    createdAt: new Date().toISOString(),
    lastLoginDate: new Date().toISOString(),
    password, // Store password for authentication
  };

  users.push(newUser);
  saveUsers(users);

  // Also add to auth users storage so they can sign in
  try {
    const authUsers = JSON.parse(localStorage.getItem('inferaai_local_users') || '[]');
    authUsers.push({
      id: newUser.id,
      email: newUser.email,
      password: password,
      name: newUser.name,
      role: newUser.role,
      joinedDate: newUser.createdAt,
    });
    localStorage.setItem('inferaai_local_users', JSON.stringify(authUsers));
  } catch (error) {
    console.error('Error syncing with auth storage:', error);
  }

  return { user: newUser, password };
}

export async function updateUser(userId: string, updates: Partial<User>, accessToken?: string): Promise<{ user: User }> {
  try {
    const response = await apiClient.put(API_ENDPOINTS.USERS.UPDATE(userId), updates, accessToken);
    return { user: response.user };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex] = {
    ...users[userIndex],
    ...updates,
  };

  saveUsers(users);
  
  // Sync with auth storage
  try {
    const authUsers = JSON.parse(localStorage.getItem('inferaai_local_users') || '[]');
    const authUserIndex = authUsers.findIndex((u: any) => u.id === userId);
    if (authUserIndex !== -1) {
      authUsers[authUserIndex] = {
        ...authUsers[authUserIndex],
        email: users[userIndex].email,
        name: users[userIndex].name,
        role: users[userIndex].role,
      };
      localStorage.setItem('inferaai_local_users', JSON.stringify(authUsers));
    }
  } catch (error) {
    console.error('Error syncing with auth storage:', error);
  }
  
  return { user: users[userIndex] };
}

export async function deleteUser(userId: string, accessToken?: string): Promise<{ message: string }> {
  try {
    await apiClient.delete(API_ENDPOINTS.USERS.DELETE(userId), accessToken);
    return { message: 'User deleted successfully' };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const users = loadUsers();
  const filteredUsers = users.filter(u => u.id !== userId);

  if (filteredUsers.length === users.length) {
    throw new Error('User not found');
  }

  saveUsers(filteredUsers);
  
  // Also remove from auth storage
  try {
    const authUsers = JSON.parse(localStorage.getItem('inferaai_local_users') || '[]');
    const filteredAuthUsers = authUsers.filter((u: any) => u.id !== userId);
    localStorage.setItem('inferaai_local_users', JSON.stringify(filteredAuthUsers));
  } catch (error) {
    console.error('Error syncing with auth storage:', error);
  }
  
  return { message: 'User deleted successfully' };
}

export async function updatePaymentMethod(userId: string, paymentMethod: PaymentMethod, accessToken?: string): Promise<{ user: User }> {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.USERS.UPDATE(userId), 
      { payment_method: paymentMethod }, 
      accessToken
    );
    return { user: response.user };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex].payment_method = paymentMethod;
  saveUsers(users);

  return { user: users[userIndex] };
}

export async function resetUserPassword(userId: string, newPassword?: string, accessToken?: string): Promise<{ password: string }> {
  const password = newPassword || generatePassword();
  
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.USERS.UPDATE(userId), 
      { password }, 
      accessToken
    );
    return { password: response.password || password };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const users = loadUsers();
  const userIndex = users.findIndex(u => u.id === userId);

  if (userIndex === -1) {
    throw new Error('User not found');
  }

  users[userIndex].password = password;
  saveUsers(users);
  
  // Sync with auth storage
  try {
    const authUsers = JSON.parse(localStorage.getItem('inferaai_local_users') || '[]');
    const authUserIndex = authUsers.findIndex((u: any) => u.id === userId);
    if (authUserIndex !== -1) {
      authUsers[authUserIndex].password = password;
      localStorage.setItem('inferaai_local_users', JSON.stringify(authUsers));
    }
  } catch (error) {
    console.error('Error syncing password with auth storage:', error);
  }
  
  return { password };
}

export function generatePassword(): string {
  const length = 12;
  const charset = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789!@#$%^&*';
  let password = '';
  
  // Ensure at least one of each type
  password += 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'[Math.floor(Math.random() * 26)];
  password += 'abcdefghijklmnopqrstuvwxyz'[Math.floor(Math.random() * 26)];
  password += '0123456789'[Math.floor(Math.random() * 10)];
  password += '!@#$%^&*'[Math.floor(Math.random() * 8)];
  
  // Fill the rest
  for (let i = password.length; i < length; i++) {
    password += charset[Math.floor(Math.random() * charset.length)];
  }
  
  // Shuffle
  return password.split('').sort(() => Math.random() - 0.5).join('');
}
