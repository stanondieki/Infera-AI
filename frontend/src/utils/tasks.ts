import { apiClient, API_ENDPOINTS } from './api';

// Backend task interface (as returned from API)
interface BackendTask {
  _id: string;
  title: string;
  description: string;
  type: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  } | string;
  createdBy: {
    _id: string;
    name: string;
    email: string;
  };
  status: string;
  priority: string;
  deadline: string;
  estimatedHours: number;
  hourlyRate: number;
  progress: number;
  createdAt: string;
  updatedAt: string;
  [key: string]: any;
}

// Convert backend task to frontend task format
function mapBackendTaskToFrontend(backendTask: BackendTask): Task {
  // Safely handle assignedTo field - it could be null, string, object, or array
  let userId = '';
  let userName = 'Unassigned';
  let userIds: string[] = [];
  let userNames: string[] = [];
  
  if (backendTask.assignedTo) {
    // Handle array of assignees
    if (Array.isArray(backendTask.assignedTo)) {
      for (const assignee of backendTask.assignedTo) {
        if (typeof assignee === 'object' && assignee !== null) {
          userIds.push(assignee._id || '');
          userNames.push(assignee.name || 'Unknown User');
        } else if (typeof assignee === 'string') {
          userIds.push(assignee);
          userNames.push('Unknown User');
        }
      }
      userId = userIds[0] || '';
      userName = userNames.length > 0 ? userNames.join(', ') : 'Unassigned';
    }
    // Handle single object assignee (backwards compatibility)
    else if (typeof backendTask.assignedTo === 'object' && backendTask.assignedTo !== null) {
      userId = backendTask.assignedTo._id || '';
      userName = backendTask.assignedTo.name || 'Unknown User';
    } 
    // Handle string ID (backwards compatibility)
    else if (typeof backendTask.assignedTo === 'string') {
      userId = backendTask.assignedTo;
      userName = 'Unknown User';
    }
  }

  return {
    id: backendTask._id,
    user_id: userId,
    user_name: userName,
    title: backendTask.title,
    description: backendTask.description,
    category: mapBackendTypeToCategory(backendTask.type),
    status: mapBackendStatus(backendTask.status),
    priority: backendTask.priority as any,
    deadline: backendTask.deadline,
    estimated_hours: backendTask.estimatedHours,
    hourly_rate: backendTask.hourlyRate,
    progress: backendTask.progress || 0,
    created_at: backendTask.createdAt,
    updated_at: backendTask.updatedAt,
  };
}

// Map backend task type to frontend category
function mapBackendTypeToCategory(type: string): Task['category'] {
  const mapping: Record<string, Task['category']> = {
    'data_annotation': 'data_labeling',
    'content_creation': 'other',
    'code_review': 'other',
    'prompt_engineering': 'other',
    'quality_assurance': 'content_moderation',
    'research': 'research',
    'other': 'other'
  };
  return mapping[type] || 'other';
}

// Map frontend category to backend type
function mapFrontendCategoryToBackendType(category: string): string {
  const mapping: Record<string, string> = {
    'data_labeling': 'data_annotation',
    'content_moderation': 'quality_assurance', 
    'translation': 'other', // translation maps to other
    'transcription': 'other', // transcription maps to other
    'research': 'research',
    'other': 'other'
  };
  return mapping[category] || 'other';
}

// Map backend status to frontend status
function mapBackendStatus(status: string): Task['status'] {
  const mapping: Record<string, Task['status']> = {
    'assigned': 'pending',
    'in_progress': 'in_progress',
    'completed': 'completed',
    'under_review': 'in_progress',
    'approved': 'completed',
    'rejected': 'rejected',
    'cancelled': 'rejected'
  };
  return mapping[status] || 'pending';
}

export interface Task {
  id: string;
  user_id: string;
  user_name?: string;
  title: string;
  description: string;
  category: 'data_labeling' | 'content_moderation' | 'translation' | 'transcription' | 'research' | 'other';
  status: 'pending' | 'in_progress' | 'completed' | 'rejected';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  deadline?: string;
  estimated_hours?: number;
  actual_hours?: number;
  hourly_rate?: number;
  total_payment?: number;
  progress: number; // 0-100
  submission_notes?: string;
  feedback?: string;
  created_at: string;
  updated_at: string;
  completed_at?: string;
  submittedAt?: string;
  files?: TaskFile[];
}

export interface TaskFile {
  name: string;
  url: string;
  type: string;
  size: number;
}

const TASKS_STORAGE_KEY = 'inferaai_admin_tasks';

function getInitialTasks(): Task[] {
  return [
    {
      id: '1',
      user_id: '1',
      user_name: 'System User',
      title: 'AI Training Data Annotation',
      description: 'Annotate 500 images for object detection model training',
      category: 'data_labeling',
      status: 'completed',
      priority: 'high',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 10,
      actual_hours: 9.5,
      hourly_rate: 45,
      total_payment: 427.50,
      progress: 100,
      created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      user_id: '2',
      user_name: 'Sarah Johnson',
      title: 'Content Moderation Review',
      description: 'Review and moderate user-generated content for policy violations',
      category: 'content_moderation',
      status: 'in_progress',
      priority: 'urgent',
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 8,
      actual_hours: 5,
      hourly_rate: 50,
      progress: 65,
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '3',
      user_id: '3',
      user_name: 'Michael Chen',
      title: 'Language Translation - Spanish to English',
      description: 'Translate technical documentation from Spanish to English',
      category: 'translation',
      status: 'in_progress',
      priority: 'medium',
      deadline: new Date(Date.now() + 10 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 15,
      actual_hours: 8,
      hourly_rate: 55,
      progress: 55,
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '4',
      user_id: '2',
      user_name: 'Sarah Johnson',
      title: 'Audio Transcription',
      description: 'Transcribe 2 hours of podcast audio with timestamps',
      category: 'transcription',
      status: 'pending',
      priority: 'low',
      deadline: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 6,
      hourly_rate: 50,
      progress: 0,
      created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      user_id: '1',
      user_name: 'System User',
      title: 'Market Research Analysis',
      description: 'Analyze competitor AI platforms and create comparison report',
      category: 'research',
      status: 'completed',
      priority: 'medium',
      deadline: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      estimated_hours: 12,
      actual_hours: 11,
      hourly_rate: 45,
      total_payment: 495,
      progress: 100,
      created_at: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
      completed_at: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
  ];
}

function loadTasks(): Task[] {
  try {
    const stored = localStorage.getItem(TASKS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading tasks from storage:', error);
  }
  return getInitialTasks();
}

function saveTasks(tasks: Task[]): void {
  try {
    localStorage.setItem(TASKS_STORAGE_KEY, JSON.stringify(tasks));
  } catch (error) {
    console.error('Error saving tasks to storage:', error);
  }
}

export async function getTasks(userId?: string, accessToken?: string): Promise<Task[]> {
  try {
    let endpoint = API_ENDPOINTS.TASKS.LIST;
    if (userId) {
      endpoint += `?assignedTo=${userId}`; // Backend uses assignedTo, not user_id
    }
    
    console.log('🔍 Fetching tasks from:', endpoint);
    console.log('🔑 Using accessToken:', accessToken ? 'Present (' + accessToken.substring(0, 10) + '...)' : 'Missing');
    const response = await apiClient.get(endpoint, accessToken);
    console.log('📋 Tasks response:', response);
    
    if (response.success && response.tasks) {
      // Map backend tasks to frontend format
      const mappedTasks = response.tasks.map((task: BackendTask) => mapBackendTaskToFrontend(task));
      console.log('✅ Mapped tasks:', mappedTasks);
      return mappedTasks;
    }
    
    // If response format is different, try direct tasks array
    const tasks = response.tasks || response || [];
    return Array.isArray(tasks) ? tasks.map((task: BackendTask) => mapBackendTaskToFrontend(task)) : [];
  } catch (error: any) {
    console.error('❌ Backend API error:', error.message);
    console.log('Falling back to local storage');
    
    // Fallback to local storage
    const tasks = loadTasks();
    if (userId) {
      return tasks.filter(t => t.user_id === userId);
    }
    return tasks;
  }
}

export async function createTask(taskData: {
  user_id: string;
  title: string;
  description: string;
  category: string;
  priority: string;
  deadline?: string;
  estimated_hours?: number;
  hourly_rate?: number;
}, accessToken?: string): Promise<{ task: Task }> {
  try {
    // Map frontend field names to backend field names
    const backendTaskData = {
      title: taskData.title,
      description: taskData.description,
      type: mapFrontendCategoryToBackendType(taskData.category), // Map category to valid backend type
      assignedTo: taskData.user_id, // Map user_id to assignedTo
      priority: taskData.priority,
      deadline: taskData.deadline ? new Date(taskData.deadline).toISOString() : new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(), // Default to 7 days from now
      estimatedHours: taskData.estimated_hours || 1, // Map estimated_hours to estimatedHours
      hourlyRate: taskData.hourly_rate || 25, // Map hourly_rate to hourlyRate
      instructions: taskData.description.length >= 20 ? taskData.description : taskData.description + ' Please complete this task according to the requirements.', // Ensure min 20 chars
      requirements: [
        'Complete the task as described',
        'Follow the provided instructions',
        'Ensure quality and attention to detail',
        'Submit work before the deadline'
      ], // Required array with meaningful requirements
      deliverables: [
        'Completed task deliverable',
        'Quality assurance report',
        'Final submission with notes'
      ], // Required array with meaningful deliverables
    };

    console.log('🚀 Sending task data to backend:', JSON.stringify(backendTaskData, null, 2));
    console.log('🔑 Using access token:', accessToken ? 'Yes' : 'No');
    
    const response = await apiClient.post(API_ENDPOINTS.TASKS.CREATE, backendTaskData, accessToken);
    console.log('✅ Task created successfully:', JSON.stringify(response, null, 2));
    
    // Map the created task from backend format to frontend format
    if (response.success && response.task) {
      const mappedTask = mapBackendTaskToFrontend(response.task);
      return { task: mappedTask };
    }
    
    return { task: response.task };
  } catch (error: any) {
    console.error('❌ Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const tasks = loadTasks();
  
  const newTask: Task = {
    id: `task_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: taskData.user_id,
    title: taskData.title,
    description: taskData.description,
    category: taskData.category as any,
    status: 'pending',
    priority: taskData.priority as any,
    deadline: taskData.deadline,
    estimated_hours: taskData.estimated_hours,
    hourly_rate: taskData.hourly_rate,
    progress: 0,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  tasks.push(newTask);
  saveTasks(tasks);

  return { task: newTask };
}

export async function updateTask(taskId: string, updates: Partial<Task>, accessToken?: string): Promise<{ task: Task }> {
  try {
    const response = await apiClient.put(API_ENDPOINTS.TASKS.UPDATE(taskId), updates, accessToken);
    return { task: response.task };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const tasks = loadTasks();
  const taskIndex = tasks.findIndex(t => t.id === taskId);

  if (taskIndex === -1) {
    throw new Error('Task not found');
  }

  tasks[taskIndex] = {
    ...tasks[taskIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === 'completed' && !tasks[taskIndex].completed_at) {
    tasks[taskIndex].completed_at = new Date().toISOString();
  }

  saveTasks(tasks);
  return { task: tasks[taskIndex] };
}

export async function deleteTask(taskId: string, accessToken?: string): Promise<{ message: string }> {
  try {
    await apiClient.delete(API_ENDPOINTS.TASKS.DELETE(taskId), accessToken);
    return { message: 'Task deleted successfully' };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const tasks = loadTasks();
  const filteredTasks = tasks.filter(t => t.id !== taskId);

  if (filteredTasks.length === tasks.length) {
    throw new Error('Task not found');
  }

  saveTasks(filteredTasks);
  return { message: 'Task deleted successfully' };
}

export async function submitTask(taskId: string, data: {
  progress: number;
  actual_hours?: number;
  submission_notes?: string;
}, accessToken?: string): Promise<{ task: Task }> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.TASKS.SUBMIT(taskId), data, accessToken);
    return { task: response.task };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  return updateTask(taskId, {
    progress: data.progress,
    actual_hours: data.actual_hours,
    submission_notes: data.submission_notes,
    status: data.progress === 100 ? 'completed' : 'in_progress',
  }, accessToken);
}
