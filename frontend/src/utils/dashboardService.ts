// Dashboard API Service - Real Data Only
import { API_CONFIG, API_ENDPOINTS } from './api';

// Types for real dashboard data
export interface DashboardStats {
  totalApplications: number;
  activeProjects: number;
  completedTasks: number;
  totalEarnings: number;
  pendingApplications: number;
  approvedApplications: number;
  rejectedApplications: number;
}

export interface UserApplication {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  status: 'pending' | 'approved' | 'rejected' | 'withdrawn';
  appliedAt: string;
  reviewedAt?: string;
  feedback?: string;
}

export interface UserTask {
  id: string;
  title: string;
  description: string;
  status: 'assigned' | 'in_progress' | 'submitted' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high';
  dueDate: string;
  progress: number;
  projectId?: string;
  projectName?: string;
}

export interface RecentActivity {
  id: string;
  type: 'application' | 'task' | 'payment' | 'milestone';
  title: string;
  description: string;
  timestamp: string;
  status: 'success' | 'pending' | 'failed';
}

// API Service Class
class DashboardService {
  private async fetchWithAuth(endpoint: string, options: RequestInit = {}) {
    const token = localStorage.getItem('token');
    
    const response = await fetch(`${API_CONFIG.BASE_URL}${endpoint}`, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        ...(token && { Authorization: `Bearer ${token}` }),
        ...options.headers,
      },
    });

    if (!response.ok) {
      if (response.status === 401) {
        // User not authenticated - return empty data instead of throwing error
        console.warn('User not authenticated, returning empty data');
        return { success: false, message: 'Not authenticated' };
      }
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    return response.json();
  }

  // Fetch dashboard statistics
  async getDashboardStats(): Promise<DashboardStats> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        // User not logged in - return empty stats
        return this.getEmptyStats();
      }
      
      const data = await this.fetchWithAuth(API_ENDPOINTS.APPLICATIONS.STATS);
      
      if (!data.success) {
        return this.getEmptyStats();
      }
      
      return {
        totalApplications: data.totalApplications || 0,
        activeProjects: data.activeProjects || 0,
        completedTasks: data.completedTasks || 0,
        totalEarnings: data.totalEarnings || 0,
        pendingApplications: data.pendingApplications || 0,
        approvedApplications: data.approvedApplications || 0,
        rejectedApplications: data.rejectedApplications || 0,
      };
    } catch (error) {
      console.error('Error fetching dashboard stats:', error);
      return this.getEmptyStats();
    }
  }

  private getEmptyStats(): DashboardStats {
    return {
      totalApplications: 0,
      activeProjects: 0,
      completedTasks: 0,
      totalEarnings: 0,
      pendingApplications: 0,
      approvedApplications: 0,
      rejectedApplications: 0,
    };
  }

  // Fetch user applications
  async getUserApplications(): Promise<UserApplication[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return [];
      }
      
      const data = await this.fetchWithAuth(API_ENDPOINTS.APPLICATIONS.LIST);
      if (!data.success) {
        return [];
      }
      return data.applications || [];
    } catch (error) {
      console.error('Error fetching applications:', error);
      return [];
    }
  }

  // Fetch user tasks
  async getUserTasks(): Promise<UserTask[]> {
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        return [];
      }
      
      const data = await this.fetchWithAuth(API_ENDPOINTS.TASKS.MY_TASKS);
      if (!data.success) {
        return [];
      }
      return data.tasks || [];
    } catch (error) {
      console.error('Error fetching tasks:', error);
      return [];
    }
  }

  // Fetch recent activities (if available from backend)
  async getRecentActivities(): Promise<RecentActivity[]> {
    try {
      // This endpoint might not exist yet - return empty array for now
      // TODO: Implement activities endpoint in backend
      return [];
    } catch (error) {
      console.error('Error fetching activities:', error);
      return [];
    }
  }

  // Fetch available opportunities (public endpoint - no auth required)
  async getOpportunities() {
    try {
      // Opportunities are public, so we can fetch without token
      const response = await fetch(`${API_CONFIG.BASE_URL}${API_ENDPOINTS.OPPORTUNITIES.LIST}`, {
        headers: {
          'Content-Type': 'application/json',
        },
      });
      
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      return data.opportunities || [];
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      return [];
    }
  }
}

// Export singleton instance
export const dashboardService = new DashboardService();