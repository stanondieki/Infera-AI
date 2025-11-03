import { useState } from 'react';
import { motion } from 'framer-motion';
import { Plus, Search, Edit, Trash2, Clock, CheckCircle, AlertCircle, Calendar } from 'lucide-react';
import { Task, createTask, updateTask, deleteTask } from '../../utils/tasks';
import { User } from '../../utils/users';
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
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [userFilter, setUserFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [isEditing, setIsEditing] = useState(false);

  const [formData, setFormData] = useState({
    user_id: '',
    title: '',
    description: '',
    category: 'data_labeling',
    priority: 'medium',
    deadline: '',
    estimated_hours: '',
    hourly_rate: '',
  });

  const filteredTasks = tasks.filter(task => {
    const matchesSearch = task.title.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || task.status === statusFilter;
    const matchesUser = userFilter === 'all' || task.user_id === userFilter;
    return matchesSearch && matchesStatus && matchesUser;
  });

  const handleCreateTask = async () => {
    try {
      await createTask({
        user_id: formData.user_id,
        title: formData.title,
        description: formData.description,
        category: formData.category,
        priority: formData.priority,
        deadline: formData.deadline || undefined,
        estimated_hours: formData.estimated_hours ? parseFloat(formData.estimated_hours) : undefined,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
      });

      toast.success('Task created successfully');
      onRefresh();
      setShowCreateDialog(false);
      resetForm();
    } catch (error: any) {
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
      });

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
      await deleteTask(taskId);
      toast.success('Task deleted successfully');
      onRefresh();
    } catch (error: any) {
      toast.error(error.message || 'Failed to delete task');
    }
  };

  const handleStatusChange = async (taskId: string, status: string) => {
    try {
      await updateTask(taskId, { status: status as any });
      toast.success('Task status updated');
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to update status');
    }
  };

  const resetForm = () => {
    setFormData({
      user_id: '',
      title: '',
      description: '',
      category: 'data_labeling',
      priority: 'medium',
      deadline: '',
      estimated_hours: '',
      hourly_rate: '',
    });
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
              {users.map(user => (
                <SelectItem key={user.id} value={user.id}>
                  {user.first_name} {user.last_name}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
          <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
            <Plus className="h-4 w-4" />
            Add Task
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
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>{isEditing ? 'Edit Task' : 'Create New Task'}</DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update task details' : 'Assign a new task to a user'}
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            {!isEditing && (
              <div>
                <Label>Assign To</Label>
                <Select value={formData.user_id} onValueChange={(value) => setFormData({ ...formData, user_id: value })}>
                  <SelectTrigger>
                    <SelectValue placeholder="Select a user" />
                  </SelectTrigger>
                  <SelectContent>
                    {users.filter(u => u.status === 'active').map(user => (
                      <SelectItem key={user.id} value={user.id}>
                        {user.first_name} {user.last_name} ({user.email})
                      </SelectItem>
                    ))}
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
                rows={4}
              />
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Category</Label>
                <Select value={formData.category} onValueChange={(value) => setFormData({ ...formData, category: value })}>
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="data_labeling">Data Labeling</SelectItem>
                    <SelectItem value="content_moderation">Content Moderation</SelectItem>
                    <SelectItem value="translation">Translation</SelectItem>
                    <SelectItem value="transcription">Transcription</SelectItem>
                    <SelectItem value="research">Research</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
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

            <div className="grid grid-cols-3 gap-4">
              <div>
                <Label>Deadline (Optional)</Label>
                <Input
                  type="date"
                  value={formData.deadline}
                  onChange={(e) => setFormData({ ...formData, deadline: e.target.value })}
                />
              </div>

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
    </div>
  );
}
