import { projectId, publicAnonKey } from './supabase/info';

const API_URL = `https://${projectId}.supabase.co/functions/v1/server`;

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
      user_name: 'Demo User',
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
      user_name: 'Demo User',
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

export async function getTasks(userId?: string): Promise<Task[]> {
  try {
    const url = userId 
      ? `${API_URL}/tasks?user_id=${userId}`
      : `${API_URL}/tasks`;
    
    const response = await fetch(url, {
      method: 'GET',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
    });

    if (response.ok) {
      const data = await response.json();
      return data.tasks || [];
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  const tasks = loadTasks();
  if (userId) {
    return tasks.filter(t => t.user_id === userId);
  }
  return tasks;
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
}): Promise<{ task: Task }> {
  try {
    const response = await fetch(`${API_URL}/tasks`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(taskData),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
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

export async function updateTask(taskId: string, updates: Partial<Task>): Promise<{ task: Task }> {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'PATCH',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(updates),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
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

export async function deleteTask(taskId: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}`, {
      method: 'DELETE',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
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
}): Promise<{ task: Task }> {
  try {
    const response = await fetch(`${API_URL}/tasks/${taskId}/submit`, {
      method: 'POST',
      headers: { 
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${publicAnonKey}`
      },
      body: JSON.stringify(data),
    });

    if (response.ok) {
      return await response.json();
    }
  } catch (error) {
    console.log('API unavailable, using local storage');
  }

  // Fallback to local storage
  return updateTask(taskId, {
    progress: data.progress,
    actual_hours: data.actual_hours,
    submission_notes: data.submission_notes,
    status: data.progress === 100 ? 'completed' : 'in_progress',
  });
}
