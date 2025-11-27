import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  Brain, 
  Eye, 
  MessageSquare, 
  Layers, 
  Sparkles, 
  CheckCircle, 
  Clock, 
  Star,
  Target,
  Award,
  TrendingUp,
  Zap,
  RefreshCw
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { toast } from 'sonner';
import { TaskApp } from '../tasks/TaskApp';
import { submitTask } from '../../utils/tasks';

interface OutlierTask {
  id: string;
  title: string;
  description: string;
  type: 'ai_training_data' | 'model_evaluation' | 'content_generation' | 'data_labeling' | 'prompt_optimization' | 'quality_assessment' | 'research_annotation';
  category: 'computer_vision' | 'natural_language' | 'multimodal' | 'reinforcement_learning' | 'generative_ai' | 'classification' | 'other';
  
  // Skill-based matching
  requiredSkills: string[];
  difficultyLevel: 'beginner' | 'intermediate' | 'advanced' | 'expert';
  domainExpertise?: string;
  
  // Task content
  taskData: {
    inputs: any[];
    examples: any[];
    guidelines: string;
    qualityMetrics: string[];
  };
  
  annotationGuidelines: string;
  qualityStandards: string[];
  
  // Performance tracking
  timeSpent: number;
  estimatedTime: number;
  payment: number;
  qualityScore?: number;
  accuracyRate?: number;
  
  // Status
  status: 'available' | 'assigned' | 'in_progress' | 'submitted' | 'under_review' | 'completed';
  progress: number;
  deadline: string;
}

interface OutlierTaskWorkspaceProps {
  tasks: OutlierTask[];
  onTaskUpdate: (taskId: string, updates: any) => void;
}

export function OutlierTaskWorkspace({ tasks, onTaskUpdate }: OutlierTaskWorkspaceProps) {
  const [selectedTask, setSelectedTask] = useState<OutlierTask | null>(null);
  const [activeTab, setActiveTab] = useState('available');
  const [workspaceOpen, setWorkspaceOpen] = useState(false);
  const [submitting, setSubmitting] = useState(false);

  // Filter tasks by status
  const availableTasks = tasks.filter(t => t.status === 'available');
  const inProgressTasks = tasks.filter(t => t.status === 'in_progress');
  const completedTasks = tasks.filter(t => t.status === 'completed');

  // Category icons and colors
  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'computer_vision': return <Eye className="w-5 h-5" />;
      case 'natural_language': return <MessageSquare className="w-5 h-5" />;
      case 'multimodal': return <Layers className="w-5 h-5" />;
      case 'generative_ai': return <Sparkles className="w-5 h-5" />;
      default: return <Brain className="w-5 h-5" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'computer_vision': return 'bg-blue-100 text-blue-800';
      case 'natural_language': return 'bg-green-100 text-green-800';
      case 'multimodal': return 'bg-purple-100 text-purple-800';
      case 'generative_ai': return 'bg-pink-100 text-pink-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'beginner': return 'bg-emerald-100 text-emerald-800';
      case 'intermediate': return 'bg-yellow-100 text-yellow-800';
      case 'advanced': return 'bg-orange-100 text-orange-800';
      case 'expert': return 'bg-red-100 text-red-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleTaskStart = (task: OutlierTask) => {
    setSelectedTask(task);
    setWorkspaceOpen(true);
    onTaskUpdate(task.id, { status: 'in_progress', startedAt: new Date().toISOString() });
    toast.success(`Started working on: ${task.title}`);
  };

  const handleTaskSubmission = async (submissionData: any) => {
    if (!selectedTask) return;
    
    setSubmitting(true);
    try {
      // Get auth token from localStorage or your auth context
      const token = localStorage.getItem('token');
      
      const result = await submitTask(selectedTask.id, {
        progress: 100,
        actual_hours: submissionData.timeSpent / 60, // Convert minutes to hours
        submission_notes: JSON.stringify({
          notes: submissionData.submissionNotes,
          answers: submissionData.answers,
          outputText: submissionData.outputText,
          confidence: submissionData.confidence,
          fullSubmissionData: submissionData
        })
      }, token || undefined);

      onTaskUpdate(selectedTask.id, { 
        status: 'completed', 
        progress: 100,
        completedAt: new Date().toISOString(),
        submissionData 
      });
      
      toast.success('Task submitted successfully! Payment processing...');
      setWorkspaceOpen(false);
      setSelectedTask(null);
    } catch (error) {
      console.error('Task submission error:', error);
      toast.error('Failed to submit task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleSaveDraft = async (draftData: any) => {
    if (!selectedTask) return;
    
    // Save draft locally or to backend
    onTaskUpdate(selectedTask.id, { 
      draftData,
      lastSaved: new Date().toISOString()
    });
    
    toast.success('Draft saved locally');
  };

  const TaskCard = ({ task }: { task: OutlierTask }) => (
    <Card className="hover:shadow-lg transition-shadow cursor-pointer">
      <CardHeader className="pb-3">
        <div className="flex items-start justify-between">
          <div className="flex items-center gap-2">
            {getCategoryIcon(task.category)}
            <Badge variant="outline" className={getCategoryColor(task.category)}>
              {task.category.replace('_', ' ')}
            </Badge>
          </div>
          <Badge variant="outline" className={getDifficultyColor(task.difficultyLevel)}>
            {task.difficultyLevel}
          </Badge>
        </div>
        <CardTitle className="text-lg font-semibold">{task.title}</CardTitle>
        <CardDescription className="line-clamp-2">
          {task.taskData.guidelines}
        </CardDescription>
      </CardHeader>
      
      <CardContent className="pt-0">
        <div className="space-y-4">
          {/* Skills Required */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-2">Skills Required:</p>
            <div className="flex flex-wrap gap-1">
              {task.requiredSkills.map((skill, index) => (
                <Badge key={index} variant="secondary" className="text-xs">
                  {skill.replace('_', ' ')}
                </Badge>
              ))}
            </div>
          </div>

          {/* Performance Metrics */}
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <Clock className="w-4 h-4 text-gray-500" />
              <span>{task.estimatedTime} min</span>
            </div>
            <div className="flex items-center gap-2">
              <Target className="w-4 h-4 text-green-500" />
              <span>${task.payment}</span>
            </div>
          </div>

          {/* Quality Standards Preview */}
          <div>
            <p className="text-sm font-medium text-gray-700 mb-1">Quality Standards:</p>
            <ul className="text-xs text-gray-600 list-disc list-inside space-y-1">
              {task.qualityStandards.slice(0, 2).map((standard, index) => (
                <li key={index}>{standard}</li>
              ))}
              {task.qualityStandards.length > 2 && (
                <li>+{task.qualityStandards.length - 2} more standards...</li>
              )}
            </ul>
          </div>

          {/* Progress for in-progress tasks */}
          {task.status === 'in_progress' && (
            <div>
              <div className="flex justify-between text-sm mb-1">
                <span>Progress</span>
                <span>{task.progress}%</span>
              </div>
              <Progress value={task.progress} className="h-2" />
            </div>
          )}

          {/* Quality Score for completed tasks */}
          {task.qualityScore && (
            <div className="flex items-center gap-2">
              <Star className="w-4 h-4 text-yellow-500" />
              <span className="text-sm font-medium">Quality: {task.qualityScore}/100</span>
              {task.accuracyRate && (
                <span className="text-sm text-gray-600">• Accuracy: {task.accuracyRate}%</span>
              )}
            </div>
          )}

          {/* Action Button */}
          <div className="pt-2">
            {task.status === 'available' && (
              <Button 
                onClick={() => handleTaskStart(task)}
                className="w-full"
                size="sm"
              >
                <Zap className="w-4 h-4 mr-2" />
                Start Task
              </Button>
            )}
            {task.status === 'in_progress' && (
              <Button 
                onClick={() => {setSelectedTask(task); setWorkspaceOpen(true);}}
                variant="outline"
                className="w-full"
                size="sm"
              >
                <Brain className="w-4 h-4 mr-2" />
                Continue Working
              </Button>
            )}
            {task.status === 'completed' && (
              <Button variant="secondary" size="sm" className="w-full" disabled>
                <CheckCircle className="w-4 h-4 mr-2" />
                Completed
              </Button>
            )}
          </div>
        </div>
      </CardContent>
    </Card>
  );

  return (
    <>
      <div className="space-y-6">
        {/* Header */}
        <div className="flex items-center justify-between">
          <div>
            <h2 className="text-2xl font-bold text-gray-900">AI Training Tasks</h2>
            <p className="text-gray-600">High-quality tasks for AI model training and evaluation</p>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="outline" className="bg-blue-50 text-blue-700">
              <TrendingUp className="w-4 h-4 mr-1" />
              Outlier-Style Platform
            </Badge>
          </div>
        </div>

        {/* Task Categories Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="available">
              Available Tasks ({availableTasks.length})
            </TabsTrigger>
            <TabsTrigger value="in_progress">
              In Progress ({inProgressTasks.length})
            </TabsTrigger>
            <TabsTrigger value="completed">
              Completed ({completedTasks.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="available" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {availableTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
            {availableTasks.length === 0 && (
              <div className="text-center py-12">
                <Brain className="w-12 h-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-500">No available tasks at the moment</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="in_progress" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {inProgressTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>

          <TabsContent value="completed" className="space-y-4">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {completedTasks.map(task => (
                <TaskCard key={task.id} task={task} />
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </div>

      {/* New Modular Task Interface */}
      {workspaceOpen && selectedTask && (
        <div className="fixed inset-0 z-50 bg-white">
          <TaskApp
            task={selectedTask}
            onSubmit={handleTaskSubmission}
            onClose={() => {setWorkspaceOpen(false); setSelectedTask(null);}}
          />
        </div>
      )}
    </>
  );
}