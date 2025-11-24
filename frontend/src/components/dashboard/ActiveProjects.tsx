import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Play,
  Pause,
  CheckCircle,
  Clock,
  AlertCircle,
  ArrowRight,
  Trophy,
  Zap,
  Target,
  Calendar,
  DollarSign,
  FileText,
  ChevronRight,
  Briefcase,
  TrendingUp,
  Award,
  Star,
  Timer,
  Send,
  Eye,
  Edit,
  Save,
  Maximize,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Label } from '../ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TaskWorkspace } from './TaskWorkspace';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription, DialogFooter } from '../ui/dialog';
import { toast } from 'sonner';

interface Task {
  id: string;
  project_id: string;
  project_name: string;
  title: string;
  description: string;
  category: string;
  difficulty: 'easy' | 'medium' | 'hard' | 'expert';
  estimated_time: number; // in minutes
  payment: number;
  status: 'assigned' | 'available' | 'in_progress' | 'submitted' | 'completed';
  progress: number;
  deadline?: string;
  instructions: string;
  requirements: string[];
  started_at?: string;
  submitted_at?: string;
  time_spent?: number; // in minutes
}

interface Project {
  id: string;
  name: string;
  description: string;
  category: string;
  total_tasks: number;
  completed_tasks: number;
  total_earnings: number;
  status: 'active' | 'paused' | 'completed';
  priority: 'high' | 'medium' | 'low';
}

interface ActiveProjectsProps {
  tasks?: any[];
  onRefresh?: () => void;
}

export function ActiveProjects({ tasks: assignedTasks = [], onRefresh }: ActiveProjectsProps) {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'available'>('all');
  
  console.log('📋 ActiveProjects received tasks:', assignedTasks);

  // Real projects data from backend
  const [projects, setProjects] = useState<Project[]>([]);
  const [loadingProjects, setLoadingProjects] = useState(true);
  
  // Real tasks data from backend
  const [realTasks, setRealTasks] = useState<Task[]>([]);
  const [loadingTasks, setLoadingTasks] = useState(true);

  useEffect(() => {
    fetchActiveProjects();
    fetchUserTasks();
  }, []);

  const fetchActiveProjects = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      
      // Fallback to session-based token if direct token not found
      if (!token) {
        try {
          const session = localStorage.getItem('infera_session');
          if (session) {
            const sessionData = JSON.parse(session);
            token = sessionData.accessToken;
          }
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      if (!token) {
        console.error('⚠️ No authentication token found - user needs to login');
        setProjects([]);
        setLoadingProjects(false);
        return;
      }
      
      console.log('🔑 Token found, fetching real projects...');
      
      const response = await fetch('http://localhost:5000/api/projects/active', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 API Response status:', response.status);
      const data = await response.json();
      console.log('📋 API Response data:', data);
      
      if (data.success) {
        console.log('✅ Fetched real projects:', data.projects);
        setProjects(data.projects);
      }
      setLoadingProjects(false);
    } catch (error) {
      console.error('❌ Failed to fetch active projects:', error);
      setProjects([]);
      setLoadingProjects(false);
    }
  };

  const fetchUserTasks = async () => {
    try {
      let token = localStorage.getItem('accessToken');
      
      // Fallback to session-based token if direct token not found
      if (!token) {
        try {
          const session = localStorage.getItem('infera_session');
          if (session) {
            const sessionData = JSON.parse(session);
            token = sessionData.accessToken;
          }
        } catch (e) {
          console.error('Error parsing session data:', e);
        }
      }
      
      if (!token) {
        console.error('⚠️ No authentication token found for tasks');
        setLoadingTasks(false);
        return;
      }
      
      console.log('🔑 Fetching user tasks with token...');
      
      const response = await fetch('http://localhost:5000/api/tasks/my-tasks', {
        headers: {
          'Authorization': `Bearer ${token}`
        }
      });
      
      console.log('📡 Tasks API Response status:', response.status);
      const data = await response.json();
      console.log('📋 Tasks API Response data:', data);
      
      if (data.success && data.tasks) {
        // Transform backend tasks to match frontend interface with proper payment calculation
        const transformedTasks = data.tasks.map((task: any) => {
          // Calculate payment from multiple possible sources
          let taskPayment = 0;
          if (task.payment) {
            taskPayment = task.payment;
          } else if (task.totalEarnings) {
            taskPayment = task.totalEarnings;
          } else if (task.hourlyRate && task.estimatedHours) {
            taskPayment = Math.floor(task.hourlyRate * task.estimatedHours);
          } else if (task.hourlyRate) {
            taskPayment = task.hourlyRate; // Default to 1 hour if no estimated hours
          } else {
            console.warn(`No payment info found for task ${task.title}, using hourlyRate: ${task.hourlyRate}`);
            taskPayment = 0; // Don't default to arbitrary values in production
          }

          return {
            id: task._id,
            project_id: task.project_id || task.opportunityId || 'unknown',
            project_name: task.project_name || 'Unknown Project',
            title: task.title,
            description: task.description,
            category: task.category || task.type || 'General',
            difficulty: task.difficulty || 'medium',
            estimated_time: task.estimated_time || Math.floor(task.estimatedHours * 60) || 60,
            payment: taskPayment,
            status: task.status || 'assigned',
            progress: task.progress || 0,
            deadline: task.deadline,
            instructions: task.instructions || 'Complete the assigned task according to guidelines.',
            requirements: task.requirements || ['Follow task guidelines', 'Submit quality work'],
            started_at: task.startedAt,
            time_spent: task.actualHours ? Math.floor(task.actualHours * 60) : 0,
          };
        });
        
        console.log('✅ Transformed tasks:', transformedTasks);
        setRealTasks(transformedTasks);
      }
      setLoadingTasks(false);
    } catch (error) {
      console.error('❌ Failed to fetch user tasks:', error);
      setLoadingTasks(false);
    }
  };

  // No mock data in production

  const getDifficultyColor = (difficulty: string) => {
    const colors = {
      easy: 'bg-green-100 text-green-800 border-green-300',
      medium: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      hard: 'bg-orange-100 text-orange-800 border-orange-300',
      expert: 'bg-red-100 text-red-800 border-red-300',
    };
    return colors[difficulty as keyof typeof colors] || colors.medium;
  };

  const getStatusColor = (status: string) => {
    const colors = {
      available: 'bg-blue-100 text-blue-800 border-blue-300',
      in_progress: 'bg-purple-100 text-purple-800 border-purple-300',
      submitted: 'bg-cyan-100 text-cyan-800 border-cyan-300',
      completed: 'bg-green-100 text-green-800 border-green-300',
    };
    return colors[status as keyof typeof colors] || colors.available;
  };

  const getStatusIcon = (status: string) => {
    const icons = {
      available: Play,
      in_progress: Timer,
      submitted: Send,
      completed: CheckCircle,
    };
    const Icon = icons[status as keyof typeof icons] || Play;
    return <Icon className="h-4 w-4" />;
  };

  const handleStartTask = (task: Task) => {
    setSelectedTask(task);
    setWorkspaceOpen(true);
  };

  const handleContinueTask = (task: Task) => {
    setSelectedTask(task);
    setWorkspaceOpen(true);
  };

  const handleViewDetails = (task: Task) => {
    setSelectedTask(task);
    setDetailsOpen(true);
  };

  const handleTaskComplete = (taskId: string) => {
    toast.success('Task submitted successfully! Pending review.');
    setWorkspaceOpen(false);
    setSelectedTask(null);
  };

  // Use only real data - no mock data in production
  const allTasks = realTasks.length > 0 ? realTasks : (assignedTasks.length > 0 ? assignedTasks : []);
  
  const filteredTasks = allTasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  // Calculate stats from the actual task data
  const realActiveProjects = allTasks.filter((t) => t.status === 'assigned' || t.status === 'in_progress').length;
  const realTasksInProgress = allTasks.filter((t) => t.status === 'in_progress').length;
  const realTasksAvailable = allTasks.filter((t) => t.status === 'assigned' || t.status === 'available').length;

  const stats = {
    total_active: realActiveProjects,
    tasks_in_progress: realTasksInProgress,
    tasks_available: realTasksAvailable,
    total_earnings: allTasks.reduce((sum, task) => {
      const payment = task.payment || 0;
      if (payment === 0) {
        console.warn(`Task ${task.title} has no payment value`);
      }
      return sum + payment;
    }, 0),
  };

  const formatTimeRemaining = (deadline?: string) => {
    if (!deadline) return 'No deadline';
    const now = new Date();
    const end = new Date(deadline);
    const diff = end.getTime() - now.getTime();
    const hours = Math.floor(diff / (1000 * 60 * 60));
    if (hours < 24) return `${hours}h remaining`;
    const days = Math.floor(hours / 24);
    return `${days}d remaining`;
  };

  return (
    <div className="space-y-6">

      
      {/* Header Stats */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-blue-100 mb-1">Active Projects</p>
                  <p className="text-3xl">{stats.total_active}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Briefcase className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-purple-100 mb-1">In Progress</p>
                  <p className="text-3xl">{stats.tasks_in_progress}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Timer className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-green-100 mb-1">Available Tasks</p>
                  <p className="text-3xl">{stats.tasks_available}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Target className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-orange-100 mb-1">Total Earnings</p>
                  <p className="text-3xl">${stats.total_earnings}</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <DollarSign className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Projects Overview */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
          <CardTitle className="flex items-center gap-2">
            <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2">
              <Briefcase className="h-5 w-5 text-white" />
            </div>
            Active Projects
          </CardTitle>
          <CardDescription>Your ongoing projects and their progress</CardDescription>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            {projects.map((project, idx) => (
              <motion.div
                key={project.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.1 }}
              >
                <Card className="border-2 hover:shadow-lg transition-all duration-300">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between mb-4">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <h3 className="text-xl text-gray-900">{project.name}</h3>
                          <Badge
                            className={
                              project.priority === 'high'
                                ? 'bg-red-100 text-red-800'
                                : project.priority === 'medium'
                                ? 'bg-yellow-100 text-yellow-800'
                                : 'bg-green-100 text-green-800'
                            }
                          >
                            {project.priority} priority
                          </Badge>
                        </div>
                        <p className="text-gray-600 mb-3">{project.description}</p>
                        <div className="flex items-center gap-4 text-sm text-gray-600">
                          <div className="flex items-center gap-1">
                            <Target className="h-4 w-4" />
                            <span>
                              {project.completed_tasks}/{project.total_tasks} tasks
                            </span>
                          </div>
                          <div className="flex items-center gap-1">
                            <DollarSign className="h-4 w-4" />
                            <span>${project.total_earnings} earned</span>
                          </div>
                          <Badge className="bg-blue-100 text-blue-800">{project.category}</Badge>
                        </div>
                      </div>
                    </div>

                    <div className="space-y-2">
                      <div className="flex justify-between text-sm text-gray-600">
                        <span>Progress</span>
                        <span>
                          {Math.round((project.completed_tasks / project.total_tasks) * 100)}%
                        </span>
                      </div>
                      <Progress
                        value={(project.completed_tasks / project.total_tasks) * 100}
                        className="h-2"
                      />
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Available Tasks */}
      <Card className="border-0 shadow-xl bg-white/80 backdrop-blur-xl">
        <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
          <div className="flex items-center justify-between">
            <div>
              <CardTitle className="flex items-center gap-2">
                <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                  <Zap className="h-5 w-5 text-white" />
                </div>
                Available Tasks
              </CardTitle>
              <CardDescription>Click on any task to start working and earn money! 👆</CardDescription>
            </div>
            <div className="flex gap-2">
              <Button
                variant={activeFilter === 'all' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('all')}
              >
                All
              </Button>
              <Button
                variant={activeFilter === 'in_progress' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('in_progress')}
              >
                In Progress
              </Button>
              <Button
                variant={activeFilter === 'available' ? 'default' : 'outline'}
                size="sm"
                onClick={() => setActiveFilter('available')}
              >
                Available
              </Button>
            </div>
          </div>
        </CardHeader>
        <CardContent className="pt-6">
          <div className="grid gap-4">
            {filteredTasks.map((task, idx) => (
              <motion.div
                key={task.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: idx * 0.05 }}
                className="group"
              >
                <Card 
                  className="border-2 hover:shadow-xl hover:border-blue-400 hover:scale-[1.01] transition-all duration-300 cursor-pointer relative overflow-hidden group"
                  onClick={() => {
                    if (task.status === 'available') {
                      handleStartTask(task);
                    } else if (task.status === 'in_progress') {
                      handleContinueTask(task);
                    } else if (task.status === 'submitted' || task.status === 'completed') {
                      toast.info('This task has been completed!');
                    } else {
                      handleStartTask(task);
                    }
                  }}
                >
                  {/* Hover gradient overlay */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none" />
                  {/* Click indicator */}
                  {(task.status === 'available' || task.status === 'in_progress') && (
                    <div className="absolute top-3 right-3 bg-blue-500 text-white text-xs px-2 py-1 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
                      Click to work
                    </div>
                  )}
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between gap-4">
                      <div className="flex-1 space-y-3">
                        {/* Header */}
                        <div className="flex items-start justify-between">
                          <div className="flex-1">
                            <div className="flex items-center gap-2 mb-2">
                              <h4 className="text-lg text-gray-900">{task.title}</h4>
                              <Badge className={getStatusColor(task.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(task.status)}
                                  {task.status.replace('_', ' ')}
                                </div>
                              </Badge>
                            </div>
                            <p className="text-gray-600 text-sm mb-2">{task.description}</p>
                            <p className="text-gray-500 text-xs">{task.project_name}</p>
                          </div>
                        </div>

                        {/* Stats */}
                        <div className="flex flex-wrap items-center gap-4 text-sm">
                          <div className="flex items-center gap-1 text-green-600">
                            <DollarSign className="h-4 w-4" />
                            <span className="font-semibold">${task.payment}</span>
                          </div>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Clock className="h-4 w-4" />
                            <span>~{task.estimated_time} min</span>
                          </div>
                          <Badge className={getDifficultyColor(task.difficulty)}>
                            {task.difficulty}
                          </Badge>
                          <div className="flex items-center gap-1 text-gray-600">
                            <Calendar className="h-4 w-4" />
                            <span>{formatTimeRemaining(task.deadline)}</span>
                          </div>
                        </div>

                        {/* Progress for in-progress tasks */}
                        {task.status === 'in_progress' && (
                          <div className="space-y-1">
                            <div className="flex justify-between text-sm">
                              <span className="text-gray-600">Progress</span>
                              <span className="text-gray-900">{task.progress}%</span>
                            </div>
                            <Progress value={task.progress} className="h-2" />
                            <div className="flex items-center gap-2 text-xs text-gray-500">
                              <Timer className="h-3 w-3" />
                              <span>Time spent: {task.time_spent} min</span>
                            </div>
                          </div>
                        )}
                      </div>

                      {/* Action Buttons */}
                      <div className="flex flex-col gap-2" onClick={(e) => e.stopPropagation()}>
                        {task.status === 'assigned' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTask(task);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600 relative"
                          >
                            <Play className="h-4 w-4 mr-1" />
                            <Maximize className="h-3 w-3 mr-2" />
                            Start Task (Fullscreen)
                          </Button>
                        )}
                        {task.status === 'in_progress' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleContinueTask(task);
                            }}
                            className="bg-gradient-to-r from-purple-500 to-pink-500 hover:from-purple-600 hover:to-pink-600"
                          >
                            <ChevronRight className="h-4 w-4 mr-2" />
                            Continue
                          </Button>
                        )}
                        <Button 
                          variant="outline" 
                          size="sm"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleViewDetails(task);
                          }}
                        >
                          <Eye className="h-4 w-4 mr-2" />
                          Details
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredTasks.length === 0 && (
            <div className="text-center py-12">
              <Target className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <h3 className="text-gray-900 mb-2">No tasks found</h3>
              <p className="text-gray-600">
                {activeFilter === 'available' && "No available tasks at the moment"}
                {activeFilter === 'in_progress' && "You don't have any tasks in progress"}
                {activeFilter === 'all' && "No tasks available"}
              </p>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Task Details Dialog */}
      <Dialog open={detailsOpen} onOpenChange={setDetailsOpen}>
        <DialogContent className="sm:max-w-[600px] max-h-[80vh] overflow-y-auto">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              {selectedTask?.title}
            </DialogTitle>
            <DialogDescription>
              {selectedTask?.project_name && `Part of ${selectedTask.project_name}`}
            </DialogDescription>
          </DialogHeader>
          
          {selectedTask && (
            <div className="space-y-6">
              {/* Task Overview */}
              <div className="grid grid-cols-2 gap-4">
                <div>
                  <Label className="text-sm font-medium text-gray-700">Status</Label>
                  <Badge className={`mt-1 ${getStatusColor(selectedTask.status)}`}>
                    {selectedTask.status.replace('_', ' ')}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Difficulty</Label>
                  <Badge className={`mt-1 ${getDifficultyColor(selectedTask.difficulty)}`}>
                    {selectedTask.difficulty}
                  </Badge>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Payment</Label>
                  <div className="text-lg font-semibold text-green-600 mt-1">
                    ${selectedTask.payment || (selectedTask.estimated_time ? Math.floor(selectedTask.estimated_time / 60 * 25) : 25)}
                  </div>
                </div>
                <div>
                  <Label className="text-sm font-medium text-gray-700">Estimated Time</Label>
                  <div className="text-lg font-medium mt-1">
                    ~{selectedTask.estimated_time ? Math.floor(selectedTask.estimated_time / 60) : 45} min
                  </div>
                </div>
              </div>

              {/* Progress */}
              {selectedTask.progress > 0 && (
                <div>
                  <div className="flex justify-between items-center mb-2">
                    <Label className="text-sm font-medium text-gray-700">Progress</Label>
                    <span className="text-sm text-gray-600">{selectedTask.progress}%</span>
                  </div>
                  <Progress value={selectedTask.progress} className="w-full" />
                </div>
              )}

              {/* Description */}
              <div>
                <Label className="text-sm font-medium text-gray-700">Description</Label>
                <p className="mt-1 text-gray-600">{selectedTask.description}</p>
              </div>

              {/* Instructions */}
              {selectedTask.instructions && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Instructions</Label>
                  <p className="mt-1 text-gray-600">{selectedTask.instructions}</p>
                </div>
              )}

              {/* Requirements */}
              {selectedTask.requirements && selectedTask.requirements.length > 0 && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Requirements</Label>
                  <ul className="mt-1 list-disc list-inside text-gray-600 space-y-1">
                    {selectedTask.requirements.map((req, index) => (
                      <li key={index}>{req}</li>
                    ))}
                  </ul>
                </div>
              )}

              {/* Timeline */}
              {selectedTask.deadline && (
                <div>
                  <Label className="text-sm font-medium text-gray-700">Deadline</Label>
                  <div className="mt-1 flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-gray-500" />
                    <span className="text-gray-600">
                      {new Date(selectedTask.deadline).toLocaleDateString()}
                    </span>
                  </div>
                </div>
              )}
            </div>
          )}

          <DialogFooter className="gap-2">
            <Button
              variant="outline"
              onClick={() => setDetailsOpen(false)}
            >
              Close
            </Button>
            <Button
              onClick={() => {
                setDetailsOpen(false);
                if (selectedTask) {
                  handleStartTask(selectedTask);
                }
              }}
              className="gap-2"
            >
              <Play className="h-4 w-4" />
              {selectedTask?.status === 'assigned' ? 'Start Task' : 'Continue Task'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Task Workspace Dialog */}
      <TaskWorkspace
        open={workspaceOpen}
        onOpenChange={setWorkspaceOpen}
        task={selectedTask}
        onComplete={handleTaskComplete}
        forceFullscreen={true}
      />
    </div>
  );
}
