import { apiClient, API_ENDPOINTS } from './api';

export interface User {
  id: string;
  email: string;
  first_name: string;
  last_name: string;
  role: 'user' | 'admin';
  status: 'active' | 'inactive' | 'suspended';
  hourly_rate?: number;
  total_earned?: number;
  tasks_completed?: number;
  password?: string; // Only returned on creation
  payment_method?: PaymentMethod;
  created_at: string;
  last_active?: string;
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
      email: 'demo@inferaai.com',
      first_name: 'Demo',
      last_name: 'User',
      role: 'user',
      status: 'active',
      hourly_rate: 45,
      total_earned: 2847.50,
      tasks_completed: 23,
      created_at: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date().toISOString(),
      password: 'Demo123!',
    },
    {
      id: '2',
      email: 'sarah.johnson@example.com',
      first_name: 'Sarah',
      last_name: 'Johnson',
      role: 'user',
      status: 'active',
      hourly_rate: 50,
      total_earned: 4250.00,
      tasks_completed: 31,
      created_at: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      email: 'michael.chen@example.com',
      first_name: 'Michael',
      last_name: 'Chen',
      role: 'user',
      status: 'active',
      hourly_rate: 55,
      total_earned: 5890.00,
      tasks_completed: 42,
      created_at: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      email: 'emily.rodriguez@example.com',
      first_name: 'Emily',
      last_name: 'Rodriguez',
      role: 'admin',
      status: 'active',
      hourly_rate: 60,
      total_earned: 3420.00,
      tasks_completed: 18,
      created_at: new Date(Date.now() - 90 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      email: 'david.patel@example.com',
      first_name: 'David',
      last_name: 'Patel',
      role: 'user',
      status: 'inactive',
      hourly_rate: 40,
      total_earned: 1280.00,
      tasks_completed: 8,
      created_at: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '6',
      email: 'admin@inferaai.com',
      first_name: 'Admin',
      last_name: 'User',
      role: 'admin',
      status: 'active',
      hourly_rate: 0,
      total_earned: 0,
      tasks_completed: 0,
      created_at: new Date(Date.now() - 180 * 24 * 60 * 60 * 1000).toISOString(),
      last_active: new Date().toISOString(),
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
    const response = await apiClient.get(API_ENDPOINTS.USERS.LIST, accessToken);
    return response.users || [];
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  return loadUsers();
}

export async function createUser(userData: {
  email: string;
  first_name: string;
  last_name: string;
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
    first_name: userData.first_name,
    last_name: userData.last_name,
    role: userData.role,
    status: 'active',
    hourly_rate: userData.hourly_rate,
    total_earned: 0,
    tasks_completed: 0,
    created_at: new Date().toISOString(),
    last_active: new Date().toISOString(),
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
      name: `${newUser.first_name} ${newUser.last_name}`,
      role: newUser.role,
      joinedDate: newUser.created_at,
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
        name: `${users[userIndex].first_name} ${users[userIndex].last_name}`,
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
