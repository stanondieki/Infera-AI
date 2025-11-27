import { useState, useEffect } from 'react';
import { Plus, Users, Settings, BarChart3, Calendar, Search, X, DollarSign, Clock, Eye, CheckCircle, XCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';
import { useAuth } from '../../utils/auth';
import { TaskReviewDialog } from './TaskReviewDialog';
import { CreateTaskDialog } from './CreateTaskDialog';

// Get API base URL from environment or fallback to production
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api';
};

interface AdminTasksProps {
  onBack: () => void;
  accessToken: string;
}

interface Task {
  _id: string;
  title: string;
  description: string;
  type: string;
  category: string;
  status: string;
  assignedTo: {
    _id: string;
    name: string;
    email: string;
  } | null;
  createdBy: string;
  deadline: string;
  hourlyRate: number;
  estimatedHours: number;
  actualHours?: number;
  progress?: number;
  priority: string;
  createdAt: string;
  submittedAt?: string;
  completedAt?: string;
  submissionNotes?: string;
  submissionFiles?: string[];
  reviewNotes?: string;
  reviewedBy?: string;
  reviewedAt?: string;
  rating?: number;
  feedback?: string;
}

interface User {
  id: string;
  name: string;
  email: string;
  role: string;
  isActive: boolean;
}

export function AdminTasks({ onBack, accessToken }: AdminTasksProps) {
  const { accessToken: authToken } = useAuth();
  const finalToken = authToken || accessToken; // Use auth hook token first, fallback to prop
  console.log('🔐 AdminTasks v3.0 - Prop Token:', accessToken ? 'Present' : 'Missing', 'Auth Token:', authToken ? 'Present' : 'Missing', 'Final:', finalToken ? 'Present' : 'Missing');
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [showReviewDialog, setShowReviewDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [pendingTasks, setPendingTasks] = useState<Task[]>([]);
  const [createTaskForm, setCreateTaskForm] = useState({
    title: '',
    description: '',
    type: '',
    category: 'DATA_ANNOTATION',
    instructions: '',
    estimatedHours: 1,
    hourlyRate: 15,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    priority: 'medium',
    assignedTo: '',
    imageUrl: '',
    datasetUrl: ''
  });
  const [filterStatus, setFilterStatus] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    loadTasks();
    loadUsers();
    loadPendingReviewTasks();
  }, []);

  const loadTasks = async () => {
    try {
      console.log('🔄 Loading tasks with token:', finalToken ? 'Present' : 'Missing');
      
      const response = await fetch(`${getApiUrl()}/tasks/admin/all`, {
        headers: {
          'Authorization': `Bearer ${finalToken}`,
        }
      });
      
      console.log('📡 Tasks load response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Loaded tasks:', data);
        setTasks(data.tasks || []);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to load tasks:', errorData);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
    } finally {
      setLoading(false);
    }
  };

  const loadUsers = async () => {
    try {
      console.log('👥 Loading users with token:', finalToken ? 'Present' : 'Missing');
      
      const response = await fetch(`${getApiUrl()}/users/assignable`, {
        headers: {
          'Authorization': `Bearer ${finalToken}`,
          'Content-Type': 'application/json'
        }
      });
      
      console.log('📡 Users load response status:', response.status);
      
      if (response.ok) {
        const data = await response.json();
        console.log('👥 Loaded users:', data);
        setUsers(data.users || []);
      } else {
        const errorData = await response.json();
        console.error('❌ Failed to load users:', errorData);
      }
    } catch (error) {
      console.error('Error loading users:', error);
    }
  };

  const createTask = async () => {
    // Validate required fields
    if (!createTaskForm.title.trim()) {
      alert('Task title is required');
      return;
    }
    if (!createTaskForm.description.trim()) {
      alert('Task description is required');
      return;
    }
    // User assignment is now optional - tasks can be created as drafts
    if (createTaskForm.category === 'DATA_ANNOTATION' && !createTaskForm.imageUrl.trim() && !createTaskForm.datasetUrl.trim()) {
      alert('Image URL or Dataset URL is required for data annotation tasks');
      return;
    }
    try {
      const finalAssignedTo = createTaskForm.assignedTo && createTaskForm.assignedTo.trim() !== '' ? createTaskForm.assignedTo : null;
      console.log('🔑 Creating task with assignedTo:', finalAssignedTo);
      
      const requestBody = {
        ...createTaskForm,
        estimatedHours: Number(createTaskForm.estimatedHours),
        hourlyRate: Number(createTaskForm.hourlyRate),
        deadline: new Date(createTaskForm.deadline),
        assignedTo: finalAssignedTo
      };
      

      
      const response = await fetch(`${getApiUrl()}/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify(requestBody)
      });

      console.log('📡 Task creation response status:', response.status);
      
      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Task created:', responseData);
        
        if (responseData.success) {
          const newTask = responseData.task;
          setTasks([...tasks, newTask]);
          setShowCreateDialog(false);
          
          // Reset form
          setCreateTaskForm({
            title: '',
            description: '',
            type: '',
            category: 'DATA_ANNOTATION',
            instructions: '',
            estimatedHours: 1,
            hourlyRate: 15,
            deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
            priority: 'medium',
            assignedTo: '',
            imageUrl: '',
            datasetUrl: ''
          });
          
          loadTasks(); // Reload to ensure we have the latest data
          
          // Show success message
          if (newTask.assignedTo) {
            const assignedUser = users.find(u => u.id === newTask.assignedTo);
            alert(`✅ Task created and assigned to ${assignedUser?.name || 'user'}!`);
          } else {
            alert('✅ Task created successfully! You can assign it to a user from the task list.');
          }
        } else {
          alert(`Failed to create task: ${responseData.message}`);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Task creation failed:', errorData);
        alert(`Failed to create task: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert('Error creating task');
    }
  };

  const assignTask = async (taskId: string, userId: string) => {
    try {
      console.log('🎯 Assigning task [v3.0]:', finalToken ? 'Present' : 'Missing', 'Token length:', finalToken?.length || 0);
      
      const response = await fetch(`${getApiUrl()}/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify({ assignedTo: userId })
      });

      console.log('📡 Assignment response status:', response.status);

      if (response.ok) {
        const responseData = await response.json();
        console.log('✅ Task assigned:', responseData);
        
        if (responseData.success) {
          const updatedTask = responseData.task;
          setTasks(tasks.map(task => 
            task._id === taskId ? updatedTask : task
          ));
          setShowAssignDialog(false);
          setSelectedTask(null);
          
          const assignedUser = users.find(u => u.id === userId);
          alert(`✅ Task assigned to ${assignedUser?.name || 'user'} successfully!`);
        } else {
          alert(`Failed to assign task: ${responseData.message}`);
        }
      } else {
        const errorData = await response.json();
        console.error('❌ Assignment failed:', errorData);
        alert(`Failed to assign task: ${errorData.message || 'Server error'}`);
      }
    } catch (error) {
      console.error('Error assigning task:', error);
      alert('Error assigning task');
    }
  };

  const loadPendingReviewTasks = async () => {
    try {
      console.log('📋 Loading pending review tasks...');
      
      const response = await fetch(`${getApiUrl()}/tasks/admin/pending-review`, {
        headers: {
          'Authorization': `Bearer ${finalToken}`,
        }
      });
      
      if (response.ok) {
        const data = await response.json();
        console.log('📋 Loaded pending review tasks:', data);
        setPendingTasks(data.tasks || []);
      } else {
        console.error('❌ Failed to load pending tasks');
      }
    } catch (error) {
      console.error('Error loading pending review tasks:', error);
    }
  };

  const handleReviewComplete = async (taskId: string, action: string) => {
    // Refresh tasks after review
    await loadTasks();
    await loadPendingReviewTasks();
    
    // Remove from pending tasks
    setPendingTasks(prev => prev.filter(task => task._id !== taskId));
  };

  const openTaskReview = (task: Task) => {
    setSelectedTask(task);
    setShowReviewDialog(true);
  };

  const handleBulkTaskCreation = async (category: string, count: number, difficulty: string) => {
    try {
      const response = await fetch('/api/tasks/create-ai-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${finalToken}`
        },
        body: JSON.stringify({ category, taskCount: count, difficulty })
      });

      if (response.ok) {
        const { tasks: newTasks } = await response.json();
        setTasks([...tasks, ...newTasks]);
        alert(`${count} ${category} tasks created successfully!`);
      } else {
        alert('Failed to create bulk tasks');
      }
    } catch (error) {
      console.error('Error creating bulk tasks:', error);
      alert('Error creating bulk tasks');
    }
  };

  // Filter tasks
  const filteredTasks = tasks.filter(task => {
    const matchesStatus = filterStatus === 'all' || task.status === filterStatus;
    const matchesCategory = filterCategory === 'all' || task.category === filterCategory;
    const matchesSearch = !searchTerm || 
      task.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      task.description.toLowerCase().includes(searchTerm.toLowerCase());
    
    return matchesStatus && matchesCategory && matchesSearch;
  });

  // Calculate stats
  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'PENDING').length,
    inProgress: tasks.filter(t => t.status === 'IN_PROGRESS').length,
    completed: tasks.filter(t => t.status === 'COMPLETED').length,
    revenue: tasks.reduce((sum, task) => sum + (task.hourlyRate * task.estimatedHours), 0)
  };

  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-center">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-indigo-600 mx-auto"></div>
          <p className="mt-2 text-gray-600">Loading tasks...</p>
        </div>
      </div>
    );
  }

  return (
    <>
      <div className="p-6">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-3xl font-bold text-gray-900">Admin Task Management</h1>
            <p className="text-gray-600 mt-2">Create, assign, and manage AI training tasks for your platform</p>
          </div>
          <div className="flex items-center gap-3">
            <Button 
              onClick={() => setShowCreateDialog(true)}
              className="flex items-center gap-2"
            >
              <Plus className="w-4 h-4" />
              Create New Task
            </Button>
          </div>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-5 gap-4 mb-6">
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Tasks</p>
                  <p className="text-2xl font-bold">{stats.total}</p>
                </div>
                <BarChart3 className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Pending Review</p>
                  <p className="text-2xl font-bold text-orange-600">{pendingTasks.length}</p>
                </div>
                <Eye className="w-8 h-8 text-orange-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">In Progress</p>
                  <p className="text-2xl font-bold text-blue-600">{stats.inProgress}</p>
                </div>
                <Calendar className="w-8 h-8 text-blue-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Completed</p>
                  <p className="text-2xl font-bold text-green-600">{stats.completed}</p>
                </div>
                <Users className="w-8 h-8 text-green-600" />
              </div>
            </CardContent>
          </Card>
          
          <Card>
            <CardContent className="p-4">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-sm font-medium text-gray-600">Total Value</p>
                  <p className="text-2xl font-bold text-indigo-600">${stats.revenue.toLocaleString()}</p>
                </div>
                <DollarSign className="w-8 h-8 text-indigo-600" />
              </div>
            </CardContent>
          </Card>
        </div>

        <Tabs defaultValue="tasks" className="space-y-6">
          <TabsList>
            <TabsTrigger value="tasks">Task Management</TabsTrigger>
            <TabsTrigger value="review" className="relative">
              Review Submissions
              {pendingTasks.length > 0 && (
                <Badge className="ml-2 bg-red-500 text-white text-xs">
                  {pendingTasks.length}
                </Badge>
              )}
            </TabsTrigger>
            <TabsTrigger value="bulk">Bulk Creation</TabsTrigger>
            <TabsTrigger value="users">User Management</TabsTrigger>
          </TabsList>

          <TabsContent value="tasks" className="space-y-6">
            {/* Filters */}
            <Card>
              <CardContent className="p-4">
                <div className="flex flex-wrap gap-4 items-center">
                  <div className="flex-1 min-w-64">
                    <div className="relative">
                      <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
                      <input
                        type="text"
                        placeholder="Search tasks..."
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                      />
                    </div>
                  </div>
                  
                  <select
                    value={filterStatus}
                    onChange={(e) => setFilterStatus(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Status</option>
                    <option value="PENDING">Pending</option>
                    <option value="IN_PROGRESS">In Progress</option>
                    <option value="COMPLETED">Completed</option>
                    <option value="CANCELLED">Cancelled</option>
                  </select>
                  
                  <select
                    value={filterCategory}
                    onChange={(e) => setFilterCategory(e.target.value)}
                    className="px-3 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-indigo-500"
                  >
                    <option value="all">All Categories</option>
                    <option value="AI_TRAINING">AI Training</option>
                    <option value="DATA_ANNOTATION">Data Annotation</option>
                    <option value="MODEL_EVALUATION">Model Evaluation</option>
                    <option value="CONTENT_MODERATION">Content Moderation</option>
                  </select>
                </div>
              </CardContent>
            </Card>

            {/* Tasks List */}
            <div className="space-y-4">
              {filteredTasks.map(task => (
                <Card key={task._id} className="hover:shadow-md transition-shadow">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h3 className="font-semibold text-lg">{task.title}</h3>
                          <Badge variant={task.status === 'COMPLETED' ? 'default' : 'secondary'}>
                            {task.status.replace('_', ' ')}
                          </Badge>
                          <Badge variant="outline">{task.category}</Badge>
                          <Badge 
                            variant="outline" 
                            className={
                              task.priority === 'urgent' ? 'border-red-500 text-red-700' :
                              task.priority === 'high' ? 'border-orange-500 text-orange-700' :
                              task.priority === 'medium' ? 'border-blue-500 text-blue-700' :
                              'border-gray-500 text-gray-700'
                            }
                          >
                            {task.priority}
                          </Badge>
                        </div>
                        
                        <p className="text-gray-600 mb-3">{task.description}</p>
                        
                        <div className="flex items-center gap-6 text-sm text-gray-500">
                          <span>Rate: ${task.hourlyRate}/hr</span>
                          <span>Est. Hours: {task.estimatedHours}</span>
                          <span>Total: ${task.hourlyRate * task.estimatedHours}</span>
                          <span>Deadline: {new Date(task.deadline).toLocaleDateString()}</span>
                          {task.assignedTo && (
                            <span>Assigned to: {task.assignedTo.name}</span>
                          )}
                        </div>
                      </div>
                      
                      <div className="flex items-center gap-2 ml-4">
                        {task.status === 'under_review' && (
                          <Button 
                            size="sm" 
                            variant="default"
                            onClick={() => openTaskReview(task)}
                            className="bg-orange-600 hover:bg-orange-700"
                          >
                            <Eye className="w-4 h-4 mr-1" />
                            Review
                          </Button>
                        )}
                        {!task.assignedTo && task.status !== 'under_review' && (
                          <Button 
                            size="sm" 
                            variant="outline"
                            onClick={() => {
                              setSelectedTask(task);
                              setShowAssignDialog(true);
                            }}
                          >
                            Assign
                          </Button>
                        )}
                        <Button size="sm" variant="outline">
                          Edit
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

            {filteredTasks.length === 0 && (
              <Card>
                <CardContent className="p-8 text-center">
                  <p className="text-gray-500">No tasks found matching your criteria.</p>
                  <Button 
                    className="mt-4" 
                    onClick={() => setShowCreateDialog(true)}
                  >
                    Create Your First Task
                  </Button>
                </CardContent>
              </Card>
            )}
          </TabsContent>

          <TabsContent value="review" className="space-y-6">
            {/* Review Queue */}
            <Card>
              <CardHeader>
                <CardTitle>Tasks Pending Review</CardTitle>
              </CardHeader>
              <CardContent>
                {pendingTasks.length === 0 ? (
                  <div className="text-center py-8">
                    <p className="text-gray-500">No tasks pending review</p>
                  </div>
                ) : (
                  <div className="space-y-4">
                    {pendingTasks.map(task => (
                      <div key={task._id} className="border rounded-lg p-4">
                        <div className="flex items-center justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-3 mb-2">
                              <h3 className="font-medium">{task.title}</h3>
                              <Badge className="bg-orange-100 text-orange-800">
                                {task.category?.replace('_', ' ')}
                              </Badge>
                              <Badge variant="outline">
                                Under Review
                              </Badge>
                            </div>
                            
                            <div className="flex items-center gap-6 text-sm text-gray-500">
                              <span>Assigned to: {task.assignedTo?.name}</span>
                              <span>Submitted: {new Date(task.submittedAt || '').toLocaleDateString()}</span>
                              <span>Rate: ${task.hourlyRate}/hr</span>
                              {task.actualHours && (
                                <span>Hours: {task.actualHours}h</span>
                              )}
                              <span className="font-medium text-green-600">
                                Earnings: ${task.actualHours && task.hourlyRate ? (task.actualHours * task.hourlyRate).toFixed(2) : '0.00'}
                              </span>
                            </div>
                          </div>
                          
                          <Button 
                            onClick={() => openTaskReview(task)}
                            className="flex items-center gap-2"
                          >
                            <Eye className="w-4 h-4" />
                            Review Submission
                          </Button>
                        </div>
                      </div>
                    ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </TabsContent>

          <TabsContent value="bulk">
            <BulkTaskCreation onBulkCreate={handleBulkTaskCreation} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onUsersUpdated={loadUsers} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <CreateTaskDialog
        open={showCreateDialog}
        onClose={() => setShowCreateDialog(false)}
        onTaskCreated={(task) => {
          setTasks([...tasks, task]);
          setShowCreateDialog(false);
        }}
        users={users}
      />

      {/* Assignment Dialog */}
      <Dialog open={showAssignDialog} onOpenChange={setShowAssignDialog}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Assign Task</DialogTitle>
          </DialogHeader>
          {selectedTask && (
            <div className="space-y-4">
              <div className="p-4 bg-gray-50 rounded-lg">
                <h3 className="font-medium">{selectedTask.title}</h3>
                <p className="text-sm text-gray-600">{selectedTask.category} • ${selectedTask.hourlyRate}/hr</p>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Select User</label>
                <select
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  onChange={(e) => {
                    if (e.target.value) {
                      assignTask(selectedTask._id, e.target.value);
                    }
                  }}
                  defaultValue=""
                >
                  <option value="">Choose a user...</option>
                  {users.map(user => (
                    <option key={user.id} value={user.id}>
                      {user.name} - {user.email}
                    </option>
                  ))}
                </select>
              </div>

              <div className="flex justify-end gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={() => setShowAssignDialog(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Review Dialog */}
      {selectedTask && (
        <TaskReviewDialog
          open={showReviewDialog}
          onClose={() => {
            setShowReviewDialog(false);
            setSelectedTask(null);
          }}
          task={selectedTask}
          onReviewComplete={handleReviewComplete}
          accessToken={finalToken}
        />
      )}
    </>
  );
}

// Bulk Task Creation Component
const BulkTaskCreation = ({ onBulkCreate }: { onBulkCreate: (category: string, count: number, difficulty: string) => void }) => {
  const [bulkForm, setBulkForm] = useState({
    category: 'AI_TRAINING',
    count: 10,
    difficulty: 'medium'
  });

  const handleBulkSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onBulkCreate(bulkForm.category, bulkForm.count, bulkForm.difficulty);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Bulk Task Creation</CardTitle>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleBulkSubmit} className="space-y-4">
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium mb-2">Category</label>
              <select
                value={bulkForm.category}
                onChange={(e) => setBulkForm({...bulkForm, category: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="AI_TRAINING">AI Training</option>
                <option value="DATA_ANNOTATION">Data Annotation</option>
                <option value="MODEL_EVALUATION">Model Evaluation</option>
                <option value="CONTENT_MODERATION">Content Moderation</option>
              </select>
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Number of Tasks</label>
              <input
                type="number"
                value={bulkForm.count}
                onChange={(e) => setBulkForm({...bulkForm, count: Number(e.target.value)})}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min="1"
                max="50"
              />
            </div>
            
            <div>
              <label className="block text-sm font-medium mb-2">Difficulty</label>
              <select
                value={bulkForm.difficulty}
                onChange={(e) => setBulkForm({...bulkForm, difficulty: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="beginner">Beginner</option>
                <option value="medium">Medium</option>
                <option value="advanced">Advanced</option>
              </select>
            </div>
          </div>
          
          <Button type="submit" className="w-full">
            Create {bulkForm.count} Tasks
          </Button>
        </form>
      </CardContent>
    </Card>
  );
};

// User Management Component
const UserManagement = ({ users, onUsersUpdated }: { users: User[], onUsersUpdated: () => void }) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>User Management</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {users.map(user => (
            <div key={user.id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{user.role}</Badge>
                  <span className="text-sm">Status: {user.isActive ? 'Active' : 'Inactive'}</span>
                  <span className="text-sm">Role: {user.role}</span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge className={user.isActive ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                  {user.isActive ? 'Active' : 'Inactive'}
                </Badge>
                <Button size="sm" variant="outline">Manage</Button>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};