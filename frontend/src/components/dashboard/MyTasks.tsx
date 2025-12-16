import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Briefcase, Clock, CheckCircle, Calendar, DollarSign, AlertCircle, Upload } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
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
import { toast } from 'sonner';
import { getTasks, submitTask, Task } from '../../utils/tasks';
import { useAuth } from '../../utils/auth';
import { apiClient, API_ENDPOINTS } from '../../utils/api';
import { TaskApp } from '../tasks/TaskApp';

export function MyTasks() {
  const { user, accessToken } = useAuth();
  const [tasks, setTasks] = useState<Task[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [showSubmitDialog, setShowSubmitDialog] = useState(false);
  const [showWorkInterface, setShowWorkInterface] = useState(false);
  const [workTask, setWorkTask] = useState<any>(null);
  const [statusFilter, setStatusFilter] = useState<string>('all');

  const [submitForm, setSubmitForm] = useState({
    progress: 0,
    actual_hours: '',
    submission_notes: '',
  });

  useEffect(() => {
    if (user?.id) {
      loadTasks();
    }
  }, [user]);

  const loadTasks = async () => {
    if (!user?.id || !accessToken) return;
    
    setLoading(true);
    try {
      console.log('👤 Loading my tasks for user:', user.id);
      // Use dedicated my-tasks endpoint instead of general getTasks
      const response = await apiClient.get(API_ENDPOINTS.TASKS.MY_TASKS, accessToken);
      console.log('👤 My tasks response:', response);
      
      if (response.success && response.tasks) {
        // Map backend tasks to frontend format
        const mappedTasks = response.tasks.map((task: any) => {
          // Handle assignedTo as array or single value
          let userId = '';
          let userName = 'Unknown User';
          
          if (Array.isArray(task.assignedTo)) {
            // Get first assignee for user_id, join all names
            const assignees = task.assignedTo;
            userId = assignees[0]?._id || assignees[0] || '';
            userName = assignees.map((a: any) => a?.name || a).join(', ') || 'Unknown User';
          } else if (typeof task.assignedTo === 'object') {
            userId = task.assignedTo?._id || '';
            userName = task.assignedTo?.name || 'Unknown User';
          } else {
            userId = task.assignedTo || '';
          }
          
          return {
            id: task._id,
            user_id: userId,
            user_name: userName,
            title: task.title,
            description: task.description,
            category: task.type, // Keep backend type for now
            status: task.status,
            priority: task.priority,
            deadline: task.deadline,
            estimated_hours: task.estimatedHours,
            hourly_rate: task.hourlyRate,
            progress: task.progress || 0,
            created_at: task.createdAt,
            updated_at: task.updatedAt,
          };
        });
        setTasks(mappedTasks);
      } else {
        setTasks([]);
      }
    } catch (error) {
      console.error('Error loading tasks:', error);
      toast.error('Failed to load tasks');
      setTasks([]);
    } finally {
      setLoading(false);
    }
  };

  const handleSubmitTask = async () => {
    if (!selectedTask) return;

    try {
      await submitTask(selectedTask.id, {
        progress: submitForm.progress,
        actual_hours: submitForm.actual_hours ? parseFloat(submitForm.actual_hours) : undefined,
        submission_notes: submitForm.submission_notes,
      });

      toast.success('Task updated successfully');
      setShowSubmitDialog(false);
      setSelectedTask(null);
      resetSubmitForm();
      loadTasks();
    } catch (error: any) {
      toast.error(error.message || 'Failed to submit task');
    }
  };

  const resetSubmitForm = () => {
    setSubmitForm({
      progress: 0,
      actual_hours: '',
      submission_notes: '',
    });
  };

  const openSubmitDialog = (task: Task) => {
    setSelectedTask(task);
    setSubmitForm({
      progress: task.progress || 0,
      actual_hours: task.actual_hours?.toString() || '',
      submission_notes: task.submission_notes || '',
    });
    setShowSubmitDialog(true);
  };

  const startWork = async (task: Task) => {
    if (!accessToken) {
      toast.error('Authentication required');
      return;
    }
    
    try {
      // Fetch full task details from backend
      const response = await apiClient.get(`${API_ENDPOINTS.TASKS.GET}/${task.id}`, accessToken);
      if (response.success && response.task) {
        setWorkTask({
          _id: response.task._id,
          title: response.task.title,
          description: response.task.description,
          instructions: response.task.instructions,
          type: response.task.type,
          category: response.task.category,
          categories: response.task.categories,
          hourlyRate: response.task.hourlyRate,
          estimatedHours: response.task.estimatedHours,
          sampleData: response.task.sampleData,
          datasetUrl: response.task.datasetUrl
        });
        setShowWorkInterface(true);
      }
    } catch (error) {
      console.error('Error fetching task details:', error);
      toast.error('Failed to load task details');
    }
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
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Briefcase className="h-4 w-4" />;
    }
  };

  const filteredTasks = tasks.filter(task => 
    statusFilter === 'all' || task.status === statusFilter
  );

  const stats = {
    total: tasks.length,
    pending: tasks.filter(t => t.status === 'pending').length,
    in_progress: tasks.filter(t => t.status === 'in_progress').length,
    completed: tasks.filter(t => t.status === 'completed').length,
    total_earned: tasks
      .filter(t => t.status === 'completed')
      .reduce((sum, t) => sum + (t.total_payment || 0), 0),
  };

  return (
    <div className="space-y-6">
      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Briefcase className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">Total</span>
            </div>
            <p className="text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-yellow-600" />
              <span className="text-gray-600">Active</span>
            </div>
            <p className="text-gray-900">{stats.pending + stats.in_progress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Completed</span>
            </div>
            <p className="text-gray-900">{stats.completed}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <DollarSign className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Earned</span>
            </div>
            <p className="text-gray-900">${stats.total_earned.toFixed(2)}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filter */}
      <div className="flex justify-between items-center">
        <h3 className="text-gray-900">My Tasks</h3>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-40">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Tasks</SelectItem>
            <SelectItem value="pending">Pending</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="completed">Completed</SelectItem>
            <SelectItem value="rejected">Rejected</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Tasks List */}
      {loading ? (
        <div className="text-center py-12">
          <div className="inline-block animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600"></div>
        </div>
      ) : filteredTasks.length === 0 ? (
        <Card>
          <CardContent className="py-12 text-center">
            <Briefcase className="h-12 w-12 text-gray-400 mx-auto mb-4" />
            <p className="text-gray-600">No tasks found</p>
          </CardContent>
        </Card>
      ) : (
        <div className="space-y-4">
          {filteredTasks.map((task, index) => (
            <motion.div
              key={task.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
            >
              <Card>
                <CardContent className="p-6">
                  <div className="space-y-4">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <h4 className="text-gray-900">{task.title}</h4>
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
                          <p>📁 {task.category.replace('_', ' ')}</p>
                          {task.deadline && (
                            <p className="flex items-center gap-1">
                              <Calendar className="h-4 w-4" />
                              Due: {new Date(task.deadline).toLocaleDateString()}
                            </p>
                          )}
                          {task.estimated_hours && (
                            <p>⏱️ {task.estimated_hours}h estimated</p>
                          )}
                          {task.total_payment && (
                            <p className="flex items-center gap-1">
                              <DollarSign className="h-4 w-4" />
                              ${task.total_payment.toFixed(2)}
                            </p>
                          )}
                        </div>
                      </div>
                      {task.status !== 'completed' && task.status !== 'rejected' && (
                        <div className="flex space-x-2">
                          {(task.category === 'data_labeling' || task.title.toLowerCase().includes('annotation') || task.title.toLowerCase().includes('classification')) && (
                            <Button
                              size="sm"
                              onClick={() => startWork(task)}
                              className="gap-2 bg-blue-500 hover:bg-blue-600"
                            >
                              <Briefcase className="h-4 w-4" />
                              Start Work
                            </Button>
                          )}
                          <Button
                            size="sm"
                            variant="outline"
                            onClick={() => openSubmitDialog(task)}
                            className="gap-2"
                          >
                            <Upload className="h-4 w-4" />
                            Update Progress
                          </Button>
                        </div>
                      )}
                    </div>

                    {/* Progress Bar */}
                    <div>
                      <div className="flex justify-between mb-2">
                        <span className="text-gray-600">Progress</span>
                        <span className="text-gray-900">{task.progress}%</span>
                      </div>
                      <Progress value={task.progress} />
                    </div>

                    {task.feedback && (
                      <div className="bg-purple-50 border border-purple-200 rounded p-3">
                        <p className="text-purple-900">
                          <strong>Feedback:</strong> {task.feedback}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      )}

      {/* Submit Progress Dialog */}
      <Dialog open={showSubmitDialog} onOpenChange={setShowSubmitDialog}>
        <DialogContent>
          {selectedTask && (
            <>
              <DialogHeader>
                <DialogTitle>Update Task Progress</DialogTitle>
                <DialogDescription>
                  {selectedTask.title}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div>
                  <Label>Progress ({submitForm.progress}%)</Label>
                  <Input
                    type="range"
                    min="0"
                    max="100"
                    step="5"
                    value={submitForm.progress}
                    onChange={(e) => setSubmitForm({ ...submitForm, progress: parseInt(e.target.value) })}
                    className="w-full"
                  />
                  <Progress value={submitForm.progress} className="mt-2" />
                </div>

                <div>
                  <Label>Actual Hours Worked</Label>
                  <Input
                    type="number"
                    step="0.5"
                    value={submitForm.actual_hours}
                    onChange={(e) => setSubmitForm({ ...submitForm, actual_hours: e.target.value })}
                    placeholder="0"
                  />
                </div>

                <div>
                  <Label>Submission Notes</Label>
                  <Textarea
                    value={submitForm.submission_notes}
                    onChange={(e) => setSubmitForm({ ...submitForm, submission_notes: e.target.value })}
                    placeholder="Add any notes about your progress..."
                    rows={4}
                  />
                </div>
              </div>

              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setShowSubmitDialog(false);
                    resetSubmitForm();
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={handleSubmitTask}>
                  Submit Update
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Task Work Interface */}
      {showWorkInterface && workTask && (
        <div className="fixed inset-0 z-50 bg-white">
          <TaskApp 
            task={workTask}
            onSubmit={(submissionData) => {
              setShowWorkInterface(false);
              setWorkTask(null);
              loadTasks();
              toast.success('Task submitted successfully!');
            }}
            onClose={() => {
              setShowWorkInterface(false);
              setWorkTask(null);
              loadTasks(); // Refresh tasks after work session
            }}
          />
        </div>
      )}
    </div>
  );
}
