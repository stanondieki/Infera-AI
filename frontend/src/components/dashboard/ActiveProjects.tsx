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
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { TaskWorkspace } from './TaskWorkspace';
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
  status: 'available' | 'in_progress' | 'submitted' | 'completed';
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

export function ActiveProjects() {
  const [selectedTask, setSelectedTask] = useState<Task | null>(null);
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [activeFilter, setActiveFilter] = useState<'all' | 'in_progress' | 'available'>('all');

  // Sample data - in real app, fetch from backend
  const [projects] = useState<Project[]>([
    {
      id: '1',
      name: 'AI Training Dataset Annotation',
      description: 'Label and annotate images for machine learning models',
      category: 'AI Training',
      total_tasks: 50,
      completed_tasks: 23,
      total_earnings: 1840,
      status: 'active',
      priority: 'high',
    },
    {
      id: '2',
      name: 'Content Moderation System',
      description: 'Review and moderate user-generated content',
      category: 'Content Moderation',
      total_tasks: 120,
      completed_tasks: 87,
      total_earnings: 2610,
      status: 'active',
      priority: 'medium',
    },
    {
      id: '3',
      name: 'Data Validation & Quality Check',
      description: 'Verify accuracy of data entries and flag errors',
      category: 'Data Annotation',
      total_tasks: 75,
      completed_tasks: 45,
      total_earnings: 1350,
      status: 'active',
      priority: 'high',
    },
  ]);

  const [tasks] = useState<Task[]>([
    {
      id: 't1',
      project_id: '1',
      project_name: 'AI Training Dataset Annotation',
      title: 'Image Classification - Batch #247',
      description: 'Classify 100 images into predefined categories',
      category: 'Image Classification',
      difficulty: 'medium',
      estimated_time: 45,
      payment: 35,
      status: 'in_progress',
      progress: 65,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Review each image and select the most appropriate category. Ensure accuracy and consistency.',
      requirements: [
        'High attention to detail',
        'Consistent categorization',
        'Complete all 100 images',
        'Submit within deadline',
      ],
      started_at: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
      time_spent: 30,
    },
    {
      id: 't2',
      project_id: '1',
      project_name: 'AI Training Dataset Annotation',
      title: 'Object Detection - Batch #189',
      description: 'Draw bounding boxes around objects in images',
      category: 'Object Detection',
      difficulty: 'hard',
      estimated_time: 60,
      payment: 50,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Accurately draw bounding boxes around all specified objects. Follow the annotation guidelines.',
      requirements: [
        'Precise bounding box placement',
        'Label all visible objects',
        'Follow annotation standards',
        'Quality over speed',
      ],
    },
    {
      id: 't3',
      project_id: '2',
      project_name: 'Content Moderation System',
      title: 'Review User Comments - Set #45',
      description: 'Moderate 200 user comments for policy violations',
      category: 'Content Moderation',
      difficulty: 'easy',
      estimated_time: 30,
      payment: 25,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Review each comment and flag any violations. Use the moderation guidelines provided.',
      requirements: [
        'Understand content policies',
        'Consistent decision making',
        'Flag all violations',
        'Provide clear reasoning',
      ],
    },
    {
      id: 't4',
      project_id: '3',
      project_name: 'Data Validation & Quality Check',
      title: 'Verify Customer Data - Batch #312',
      description: 'Validate accuracy of customer information entries',
      category: 'Data Validation',
      difficulty: 'medium',
      estimated_time: 40,
      payment: 32,
      status: 'in_progress',
      progress: 25,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Check each data field for accuracy and completeness. Flag any errors or inconsistencies.',
      requirements: [
        'Attention to detail',
        'Data accuracy verification',
        'Error documentation',
        'Complete all records',
      ],
      started_at: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
      time_spent: 10,
    },
    {
      id: 't5',
      project_id: '2',
      project_name: 'Content Moderation System',
      title: 'Image Content Review - Batch #78',
      description: 'Review images for inappropriate content',
      category: 'Image Moderation',
      difficulty: 'medium',
      estimated_time: 35,
      payment: 30,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Review each image against community guidelines. Flag inappropriate content.',
      requirements: [
        'Know community guidelines',
        'Accurate flagging',
        'Consistent standards',
        'Fast turnaround',
      ],
    },
    {
      id: 't6',
      project_id: '1',
      project_name: 'AI Training Dataset Annotation',
      title: 'Text Annotation - Batch #156',
      description: 'Annotate text data with sentiment labels',
      category: 'Text Annotation',
      difficulty: 'easy',
      estimated_time: 25,
      payment: 22,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 3 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Read each text and label it with the appropriate sentiment (positive, negative, neutral).',
      requirements: [
        'Good reading comprehension',
        'Understand sentiment analysis',
        'Consistent labeling',
        'Complete all items',
      ],
    },
    {
      id: 't7',
      project_id: '3',
      project_name: 'Data Validation & Quality Check',
      title: 'Email Validation - Batch #89',
      description: 'Verify email addresses are properly formatted',
      category: 'Data Validation',
      difficulty: 'easy',
      estimated_time: 20,
      payment: 18,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Check each email address for correct format and flag any errors.',
      requirements: [
        'Know email format standards',
        'Attention to detail',
        'Accuracy required',
        'Fast processing',
      ],
    },
    {
      id: 't8',
      project_id: '2',
      project_name: 'Content Moderation System',
      title: 'Social Media Post Review - Set #234',
      description: 'Moderate social media posts for violations',
      category: 'Content Moderation',
      difficulty: 'medium',
      estimated_time: 40,
      payment: 35,
      status: 'available',
      progress: 0,
      deadline: new Date(Date.now() + 2 * 24 * 60 * 60 * 1000).toISOString(),
      instructions: 'Review social media posts and apply moderation policies consistently.',
      requirements: [
        'Understand platform policies',
        'Fair judgment',
        'Document decisions',
        'Handle sensitive content',
      ],
    },
  ]);

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

  const handleTaskComplete = (taskId: string) => {
    toast.success('Task submitted successfully! Pending review.');
    setWorkspaceOpen(false);
    setSelectedTask(null);
  };

  const filteredTasks = tasks.filter((task) => {
    if (activeFilter === 'all') return true;
    return task.status === activeFilter;
  });

  const stats = {
    total_active: projects.filter((p) => p.status === 'active').length,
    tasks_in_progress: tasks.filter((t) => t.status === 'in_progress').length,
    tasks_available: tasks.filter((t) => t.status === 'available').length,
    total_earnings: projects.reduce((sum, p) => sum + p.total_earnings, 0),
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
                        {task.status === 'available' && (
                          <Button
                            onClick={(e) => {
                              e.stopPropagation();
                              handleStartTask(task);
                            }}
                            className="bg-gradient-to-r from-blue-500 to-purple-500 hover:from-blue-600 hover:to-purple-600"
                          >
                            <Play className="h-4 w-4 mr-2" />
                            Start Task
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
                            toast.info('Task details feature coming soon!');
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

      {/* Task Workspace Dialog */}
      <TaskWorkspace
        open={workspaceOpen}
        onOpenChange={setWorkspaceOpen}
        task={selectedTask}
        onComplete={handleTaskComplete}
      />
    </div>
  );
}
