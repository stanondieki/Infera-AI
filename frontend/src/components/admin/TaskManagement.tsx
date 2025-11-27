import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Task, createTask, updateTask, deleteTask } from '../../utils/tasks';
import { User } from '../../utils/users';
import { useAuth } from '../../utils/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';

interface TaskManagementProps {
  tasks: Task[];
  users: User[];
  onRefresh: () => void;
}

export function TaskManagement({ tasks, users, onRefresh }: TaskManagementProps) {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [showCreateFromProjectDialog, setShowCreateFromProjectDialog] = useState(false);
  const [projects, setProjects] = useState([]);
  const [selectedProject, setSelectedProject] = useState('');
  const [taskCount, setTaskCount] = useState(5);
  
  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    description: '',
    category: 'data_annotation',
    priority: 'medium',
    deadline: '',
    estimated_hours: '',
    hourly_rate: '',
  });

  const resetForm = () => {
    setFormData({
      user_id: '',
      title: '',
      description: '',
      category: 'data_annotation',
      priority: 'medium',
      deadline: '',
      estimated_hours: '',
      hourly_rate: '',
    });
  };

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesUser = userFilter === 'all' || task.user_id === userFilter;
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleCreateTask = async () => {
    try {
      // Client-side validation
      if (!formData.user_id) {
        toast.error('Please select a user to assign the task to');
        return;
      }
      if (!formData.title.trim() || formData.title.trim().length < 5) {
        toast.error('Please provide a task title with at least 5 characters');
        return;
      }
      if (!formData.description.trim() || formData.description.trim().length < 20) {
        toast.error('Please provide a description with at least 20 characters');
        return;
      }
      if (!formData.estimated_hours || parseFloat(formData.estimated_hours) < 0.5) {
        toast.error('Please provide estimated hours (minimum 0.5 hours)');
        return;
      }
      if (!formData.hourly_rate || parseFloat(formData.hourly_rate) < 5) {
        toast.error('Please provide hourly rate (minimum $5)');
        return;
      }

      console.log('🚀 Creating task with data:', formData);
      await createTask({
        user_id: formData.user_id,
        title: formData.title.trim(),
        description: formData.description.trim(),
        category: formData.category,
        priority: formData.priority,
        deadline: formData.deadline || undefined,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
      }, accessToken || undefined);

      toast.success('Task created successfully');
      onRefresh();
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
      console.error('❌ Failed to create task:', error);
      toast.error(error.message || 'Failed to create task');
    }
  };

  const handleUpdateTask = async () => {
    if (!selectedTask) return;

    try {
      await updateTask(selectedTask.id, {
        title: formData.title,
        description: formData.description,
        category: formData.category as any,
        priority: formData.priority as any,
        deadline: formData.deadline || undefined,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
      }, accessToken || undefined);

      toast.success('Task updated successfully');
      onRefresh();
      setIsEditing(false);
      setSelectedTask(null);
      resetForm();
    } catch (error: any) {
      toast.error(error.message || 'Failed to update task');
    }
  };

  const handleDeleteTask = async (taskId: string) => {
    if (!confirm('Are you sure you want to delete this task?')) return;

    try {
      await deleteTask(taskId, accessToken || undefined);
      toast.success('Task deleted successfully');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as any }, accessToken || undefined);
      toast.success('Task status updated');
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const fetchProjects = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/projects/admin', {
        headers: {
          'Authorization': `Bearer ${accessToken}`
        }
      });
      const data = await response.json();
      if (data.success) {
        setProjects(data.projects);
      }
    } catch (error) {
      console.error('Failed to fetch projects:', error);
    }
  };

  const handleCreateTasksFromProject = async () => {
    if (!selectedProject || !taskCount) {
      toast.error('Please select a project and specify task count');
      return;
    }

    try {
      const response = await fetch('http://localhost:5000/api/tasks/create-from-project', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          projectId: selectedProject,
          taskCount: parseInt(taskCount.toString())
        })
      });

      const data = await response.json();
      if (data.success) {
        toast.success(`✅ Created ${taskCount} tasks for ${data.projectName}`);
        onRefresh();
        setShowCreateFromProjectDialog(false);
        setSelectedProject('');
        setTaskCount(5);
      } else {
        throw new Error(data.message);
      }
    } catch (error: any) {
      console.error('❌ Failed to create tasks from project:', error);
      toast.error(error.message || 'Failed to create tasks from project');
    }
  };

  const openEditDialog = (task: Task) => {
    setSelectedTask(task);
    setFormData({
      user_id: task.user_id,
      title: task.title,
      description: task.description,
      category: task.category,
      priority: task.priority,
      deadline: task.deadline?.split('T')[0] || '',
      estimated_hours: task.estimated_hours?.toString() || '',
      hourly_rate: task.hourly_rate?.toString() || '',
    });
    setIsEditing(true);
  };

  const getStatusColor = (status: string) => {
    const colors = {
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
      rejected: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[status as keyof typeof colors] || colors.pending;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800 border-gray-300',
      medium: 'bg-blue-100 text-blue-800 border-blue-300',
      high: 'bg-orange-100 text-orange-800 border-orange-300',
      urgent: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      default:
        return <AlertCircle className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col md:flex-row justify-between gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search tasks..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="max-w-md"
          />
        </div>
        <div className="flex gap-2">
          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="pending">Pending</SelectItem>
              <SelectItem value="in_progress">In Progress</SelectItem>
              <SelectItem value="completed">Completed</SelectItem>
              <SelectItem value="rejected">Rejected</SelectItem>
            </SelectContent>
          </Select>
          <Select value={userFilter} onValueChange={setUserFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="All Users" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all">All Users</SelectItem>
              {users.filter(user => user && user.id).map((user, index) => (
                <SelectItem key={user.id || `user-${index}`} value={user.id}>
                  {user.name || 'Unknown User'}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => { resetForm(); setShowCreateDialog(true); }} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
          </Button>
          <Button 
            onClick={() => { 
              fetchProjects(); 
              setShowCreateFromProjectDialog(true); 
            }} 
            className="gap-2 bg-purple-600 hover:bg-purple-700"
          >
            <Plus className="h-4 w-4" />
            Tasks from Project
          </Button>
        </div>
      </div>

      {/* Tasks Grid */}
      <div className="grid gap-4">
        {filteredTasks.map((task, index) => (
          <motion.div
            key={task.id}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.05 }}
            className="bg-white p-6 rounded-lg border hover:shadow-md transition-shadow"
          >
            <div className="space-y-4">
              <div className="flex flex-col md:flex-row md:items-start justify-between gap-4">
                <div className="flex-1">
                  <div className="flex items-center gap-3 mb-2">
                    <h3 className="text-gray-900">{task.title}</h3>
                    <Badge className={getStatusColor(task.status)}>
                      <div className="flex items-center gap-1">
                        {getStatusIcon(task.status)}
                        {task.status.replace('_', ' ')}
                      </div>
                    </Badge>
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  </div>
                  <p className="text-gray-600 mb-3">{task.description}</p>
                  <div className="grid md:grid-cols-2 gap-2 text-gray-600">
                    <p>👤 {task.user_name || 'Unassigned'}</p>
                    <p>📁 {task.category.replace('_', ' ')}</p>
                    {task.deadline && (
                      <p className="flex items-center gap-1">
                        <Calendar className="h-4 w-4" />
                        {new Date(task.deadline).toLocaleDateString()}
                      </p>
                    )}
                    {task.estimated_hours && (
                      <p>⏱️ {task.estimated_hours}h estimated</p>
                    )}
                    {task.total_payment && (
                      <p>💰 ${task.total_payment.toFixed(2)}</p>
                    )}
                  </div>
                </div>
                <div className="flex gap-2">
                  <Select
                    value={task.status}
                    onValueChange={(value) => handleStatusChange(task.id, value)}
                  >
                    <SelectTrigger className="w-40">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="pending">Pending</SelectItem>
                      <SelectItem value="in_progress">In Progress</SelectItem>
                      <SelectItem value="completed">Completed</SelectItem>
                      <SelectItem value="rejected">Rejected</SelectItem>
                    </SelectContent>
                  </Select>
                  <Button size="sm" variant="outline" onClick={() => openEditDialog(task)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="sm" variant="outline" onClick={() => handleDeleteTask(task.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              </div>

              {/* Progress Bar */}
              <div>
                <div className="flex justify-between mb-2">
                  <span className="text-gray-600">Progress</span>
                  <span className="text-gray-900">{task.progress}%</span>
                </div>
                <Progress value={task.progress} />
              </div>

              {task.submission_notes && (
                <div className="bg-blue-50 border border-blue-200 rounded p-3">
                  <p className="text-blue-900">
                    <strong>Submission Notes:</strong> {task.submission_notes}
                  </p>
                </div>
              )}

              {task.feedback && (
                <div className="bg-purple-50 border border-purple-200 rounded p-3">
                  <p className="text-purple-900">
                    <strong>Feedback:</strong> {task.feedback}
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        ))}
      </div>

      {/* Create/Edit Task Dialog */}
      <Dialog 
        open={showCreateDialog || isEditing} 
        onOpenChange={(open) => {
          if (!open) {
            setShowCreateDialog(false);
            setIsEditing(false);
            setSelectedTask(null);
            resetForm();
          }
        }}
      >
        <DialogContent className="max-w-lg max-h-[90vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update task details' : 'Assign a new task to a user'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-3">
            {!isEditing && (
              <div>
                <Label>Assign To</Label>
                <Select value={formData.user_id || ""} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="Select a user">
                      {formData.user_id ? users.find(u => u.id === formData.user_id)?.name || "Select a user" : "Select a user"}
                    </SelectValue>
                  </SelectTrigger>
                  <SelectContent className="max-h-[200px] overflow-y-auto" position="popper" sideOffset={5}>
                    {(() => {
                      console.log('🧑‍💼 All users for task assignment:', users);
                      console.log('🧑‍💼 Active users:', users.filter(u => u && u.isActive && u.id));
                      return users.filter(u => u && u.id && (u.isActive !== false)).map((user, index) => (
                        <SelectItem key={user.id || `form-user-${index}`} value={user.id} className="cursor-pointer">
                          {user.name || 'Unknown User'}
                        </SelectItem>
                      ));
                    })()}
                  </SelectContent>
                </Select>
              </div>
            )}

            <div>
              <Label>Title</Label>
              <Input
                value={formData.title}
                onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                placeholder="Task title"
              />
            </div>

            <div>
              <Label>Description</Label>
              <Textarea
                value={formData.description}
                onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                placeholder="Detailed task description"
                rows={3}
              />
            </div>

            <div className="grid grid-cols-2 gap-3">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data_annotation">🖼️ Data Annotation</SelectItem>
                    <SelectItem value="computer_vision">👁️ Computer Vision</SelectItem>
                    <SelectItem value="nlp_text">📝 Text & NLP</SelectItem>
                    <SelectItem value="code_review">💻 Code Review</SelectItem>
                    <SelectItem value="multilingual">🌍 Multilingual</SelectItem>
                    <SelectItem value="content_moderation">🛡️ Content Moderation</SelectItem>
                    <SelectItem value="math_reasoning">🧮 Math & Reasoning</SelectItem>
                    <SelectItem value="audio_speech">🎵 Audio & Speech</SelectItem>
                    <SelectItem value="model_evaluation">⚡ Model Evaluation</SelectItem>
                    <SelectItem value="research">🔬 Research</SelectItem>
                    <SelectItem value="other">🔧 Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority</Label>
                <Select value={formData.priority} onValueChange={(value) => setFormData({ ...formData, priority: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <div className="mb-3">
                <Label>Deadline (Optional)</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

              <div className="grid grid-cols-2 gap-3">
                <div>
                  <Label>Estimated Hours</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={formData.estimated_hours}
                    onChange={(e) => setFormData({ ...formData, estimated_hours: e.target.value })}
                    placeholder="8"
                  />
                </div>

                <div>
                  <Label>Hourly Rate ($)</Label>
                  <Input
                    type="number"
                    step="0.01"
                    value={formData.hourly_rate}
                    onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                    placeholder="25.00"
                  />
                </div>
              </div>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateDialog(false);
                setIsEditing(false);
                resetForm();
              }}
            >
              Cancel
            </Button>
            <Button onClick={isEditing ? handleUpdateTask : handleCreateTask}>
              {isEditing ? 'Update' : 'Create'} Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Create Tasks from Project Dialog */}
      <Dialog open={showCreateFromProjectDialog} onOpenChange={setShowCreateFromProjectDialog}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle>Create Tasks from Project</DialogTitle>
            <DialogDescription>
              Generate multiple tasks automatically based on a project template
            </DialogDescription>
          </DialogHeader>
          
          <div className="space-y-4">
            <div>
              <Label htmlFor="project-select">Select Project</Label>
              <Select value={selectedProject} onValueChange={setSelectedProject}>
                <SelectTrigger>
                  <SelectValue placeholder="Choose a project..." />
                </SelectTrigger>
                <SelectContent>
                  {projects.map((project: any) => (
                    <SelectItem key={project._id} value={project._id}>
                      {project.title} ({project.category})
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            
            <div>
              <Label htmlFor="task-count">Number of Tasks</Label>
              <Input
                id="task-count"
                type="number"
                min="1"
                max="20"
                value={taskCount}
                onChange={(e) => setTaskCount(parseInt(e.target.value) || 1)}
                placeholder="5"
              />
              <p className="text-sm text-gray-500 mt-1">
                Creates realistic tasks like "Image Classification - Batch #247"
              </p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={() => {
                setShowCreateFromProjectDialog(false);
                setSelectedProject('');
                setTaskCount(5);
              }}
            >
              Cancel
            </Button>
            <Button 
              onClick={handleCreateTasksFromProject}
              className="bg-purple-600 hover:bg-purple-700"
            >
              Create {taskCount} Tasks
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
