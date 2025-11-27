import { useState, useEffect } from 'react';
import { Plus, Users, Settings, BarChart3, Calendar, Search, X, DollarSign, Clock } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Textarea } from '../ui/textarea';

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
  progress?: number;
  priority: string;
  createdAt: string;
}

interface User {
  _id: string;
  name: string;
  email: string;
  role: string;
  skills: string[];
  completedTasks: number;
  rating: number;
  isActive: boolean;
}

export function AdminTasks({ onBack, accessToken }: AdminTasksProps) {
  console.log('🔐 AdminTasks v2.0 - AccessToken:', accessToken ? 'Present' : 'Missing', 'Length:', accessToken?.length || 0);
  
  const [tasks, setTasks] = useState<Task[]>([]);
  const [users, setUsers] = useState<User[]>([]);
  const [loading, setLoading] = useState(true);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [showAssignDialog, setShowAssignDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
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
  }, []);

  const loadTasks = async () => {
    try {
      console.log('🔄 Loading tasks with token:', accessToken ? 'Present' : 'Missing');
      
      const response = await fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/tasks/admin/all', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      console.log('👥 Loading users with token:', accessToken ? 'Present' : 'Missing');
      
      const response = await fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/users/assignable', {
        headers: {
          'Authorization': `Bearer ${accessToken}`,
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
      console.log('🔑 Creating task with token:', accessToken ? 'Present' : 'Missing');
      
      const response = await fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/tasks/create', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          ...createTaskForm,
          estimatedHours: Number(createTaskForm.estimatedHours),
          hourlyRate: Number(createTaskForm.hourlyRate),
          deadline: new Date(createTaskForm.deadline),
          assignedTo: createTaskForm.assignedTo && createTaskForm.assignedTo.trim() !== '' ? createTaskForm.assignedTo : null
        })
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
            const assignedUser = users.find(u => u._id === newTask.assignedTo);
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
      console.log('🎯 Assigning task [v2.0]:', accessToken ? 'Present' : 'Missing', 'Token length:', accessToken?.length || 0);
      
      const response = await fetch(`https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/tasks/${taskId}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({ userId })
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
          
          const assignedUser = users.find(u => u._id === userId);
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

  const handleBulkTaskCreation = async (category: string, count: number, difficulty: string) => {
    try {
      const response = await fetch('/api/tasks/create-ai-tasks', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
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
                  <p className="text-sm font-medium text-gray-600">Pending</p>
                  <p className="text-2xl font-bold text-orange-600">{stats.pending}</p>
                </div>
                <Clock className="w-8 h-8 text-orange-600" />
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
                        {!task.assignedTo && (
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

          <TabsContent value="bulk">
            <BulkTaskCreation onBulkCreate={handleBulkTaskCreation} />
          </TabsContent>

          <TabsContent value="users">
            <UserManagement users={users} onUsersUpdated={loadUsers} />
          </TabsContent>
        </Tabs>
      </div>

      {/* Create Task Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>Create New Task</DialogTitle>
          </DialogHeader>
          <div className="space-y-4 pr-2">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Title</label>
                <input
                  type="text"
                  value={createTaskForm.title}
                  onChange={(e) => setCreateTaskForm({...createTaskForm, title: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  placeholder="Enter task title"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Category</label>
                <select
                  value={createTaskForm.category}
                  onChange={(e) => setCreateTaskForm({...createTaskForm, category: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="AI_TRAINING">AI Training</option>
                  <option value="DATA_ANNOTATION">Data Annotation</option>
                  <option value="MODEL_EVALUATION">Model Evaluation</option>
                  <option value="CONTENT_MODERATION">Content Moderation</option>
                  <option value="TRANSCRIPTION">Transcription</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Description</label>
              <Textarea
                value={createTaskForm.description}
                onChange={(e) => setCreateTaskForm({...createTaskForm, description: e.target.value})}
                className="w-full"
                rows={2}
                placeholder="Describe the task requirements"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Task Type</label>
              <input
                type="text"
                value={createTaskForm.type}
                onChange={(e) => setCreateTaskForm({...createTaskForm, type: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
                placeholder="e.g., image_classification, text_annotation"
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Instructions</label>
              <Textarea
                value={createTaskForm.instructions}
                onChange={(e) => setCreateTaskForm({...createTaskForm, instructions: e.target.value})}
                className="w-full"
                rows={3}
                placeholder="Detailed instructions for task completion"
              />
            </div>

            {/* Image/Dataset URLs for annotation tasks */}
            {createTaskForm.category === 'DATA_ANNOTATION' && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Image URL</label>
                  <input
                    type="url"
                    value={createTaskForm.imageUrl}
                    onChange={(e) => setCreateTaskForm({...createTaskForm, imageUrl: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/image.jpg"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL of the image to be annotated</p>
                </div>
                <div>
                  <label className="block text-sm font-medium mb-2">Dataset URL (Alternative)</label>
                  <input
                    type="url"
                    value={createTaskForm.datasetUrl}
                    onChange={(e) => setCreateTaskForm({...createTaskForm, datasetUrl: e.target.value})}
                    className="w-full p-2 border border-gray-300 rounded-lg"
                    placeholder="https://example.com/dataset.zip"
                  />
                  <p className="text-xs text-gray-500 mt-1">URL of dataset if multiple images</p>
                </div>
              </div>
            )}

            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
              <div>
                <label className="block text-sm font-medium mb-2">Estimated Hours</label>
                <input
                  type="number"
                  value={createTaskForm.estimatedHours}
                  onChange={(e) => setCreateTaskForm({...createTaskForm, estimatedHours: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="0.5"
                  step="0.5"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Hourly Rate ($)</label>
                <input
                  type="number"
                  value={createTaskForm.hourlyRate}
                  onChange={(e) => setCreateTaskForm({...createTaskForm, hourlyRate: Number(e.target.value)})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                  min="10"
                  step="1"
                />
              </div>
              <div>
                <label className="block text-sm font-medium mb-2">Priority</label>
                <select
                  value={createTaskForm.priority}
                  onChange={(e) => setCreateTaskForm({...createTaskForm, priority: e.target.value})}
                  className="w-full p-2 border border-gray-300 rounded-lg"
                >
                  <option value="low">Low</option>
                  <option value="medium">Medium</option>
                  <option value="high">High</option>
                  <option value="urgent">Urgent</option>
                </select>
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Deadline</label>
              <input
                type="date"
                value={createTaskForm.deadline}
                onChange={(e) => setCreateTaskForm({...createTaskForm, deadline: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
                min={new Date().toISOString().split('T')[0]}
              />
            </div>

            <div>
              <label className="block text-sm font-medium mb-2">Assign to User</label>
              <select
                value={createTaskForm.assignedTo}
                onChange={(e) => setCreateTaskForm({...createTaskForm, assignedTo: e.target.value})}
                className="w-full p-2 border border-gray-300 rounded-lg"
              >
                <option value="">Leave unassigned (draft)</option>
                {users.map(user => (
                  <option key={user._id} value={user._id}>
                    {user.name} - {user.email} (Rating: {user.rating}/5)
                  </option>
                ))}
              </select>
              <p className="text-xs text-gray-500 mt-1">
                Required: Task must be assigned to a specific user
              </p>
            </div>

            <div className="sticky bottom-0 bg-white pt-4 border-t flex flex-col sm:flex-row justify-end gap-3 mt-6">
              <Button
                type="button"
                variant="outline"
                onClick={() => setShowCreateDialog(false)}
                className="w-full sm:w-auto"
              >
                Cancel
              </Button>
              <Button
                type="button"
                onClick={createTask}
                disabled={!createTaskForm.title || !createTaskForm.description || !createTaskForm.type}
                className="w-full sm:w-auto"
              >
                <Plus className="w-4 h-4 mr-2" />
                Create Task
              </Button>
            </div>
          </div>
        </DialogContent>
      </Dialog>

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
                    <option key={user._id} value={user._id}>
                      {user.name} - {user.email} (Rating: {user.rating}/5)
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
            <div key={user._id} className="flex items-center justify-between p-4 border rounded-lg">
              <div>
                <h4 className="font-medium">{user.name}</h4>
                <p className="text-sm text-gray-600">{user.email}</p>
                <div className="flex items-center gap-2 mt-1">
                  <Badge variant="secondary">{user.role}</Badge>
                  <span className="text-sm">Completed: {user.completedTasks}</span>
                  <span className="text-sm">Rating: {user.rating}/5</span>
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