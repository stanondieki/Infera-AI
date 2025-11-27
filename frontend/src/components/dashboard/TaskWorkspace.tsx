import { useState, useEffect, useRef } from 'react';
import { createPortal } from 'react-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  X,
  Clock,
  CheckCircle,
  AlertCircle,
  Send,
  Save,
  Play,
  Pause,
  Info,
  FileText,
  Zap,
  Award,
  Timer,
  ChevronLeft,
  ChevronRight,
  Check,
  Star,
  DollarSign,
  Target,
  Maximize2,
  Minimize2,
} from 'lucide-react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Separator } from '../ui/separator';
import { toast } from 'sonner';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Checkbox } from '../ui/checkbox';
import { RadioGroup, RadioGroupItem } from '../ui/radio-group';
import { Label } from '../ui/label';

interface Task {
  id: string;
  project_name: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimated_time: number;
  payment: number;
  status: string;
  progress: number;
  deadline?: string;
  instructions: string;
  requirements: string[];
  time_spent?: number;
}

interface TaskWorkspaceProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  task: Task | null;
  onComplete: (taskId: string) => void;
  forceFullscreen?: boolean;
}

// Sample task work items - this would be dynamic based on task type
interface WorkItem {
  id: string;
  type: 'image_classification' | 'text_annotation' | 'data_validation' | 'content_moderation';
  data: any;
  completed: boolean;
}

export function TaskWorkspace({ open, onOpenChange, task, onComplete, forceFullscreen = true }: TaskWorkspaceProps) {
  const [isWorking, setIsWorking] = useState(false);
  const [timeElapsed, setTimeElapsed] = useState(task?.time_spent || 0);
  const [currentItemIndex, setCurrentItemIndex] = useState(0);
  const [workItems, setWorkItems] = useState<WorkItem[]>([]);
  const [currentAnswer, setCurrentAnswer] = useState<any>(null);
  const [notes, setNotes] = useState('');
  const [itemsCompleted, setItemsCompleted] = useState(0);
  const [seconds, setSeconds] = useState(0);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  const [showCelebration, setShowCelebration] = useState(false);
  const [streak, setStreak] = useState(0);
  const [taskNotes, setTaskNotes] = useState('');
  // Initialize fullscreen state with localStorage persistence (for dev mode)
  const [isFullscreen, setIsFullscreen] = useState(() => {
    if (typeof window !== 'undefined') {
      const saved = localStorage.getItem('taskWorkspaceFullscreen');
      console.log('[TaskWorkspace] Initializing fullscreen state:', { saved, forceFullscreen });
      return saved ? JSON.parse(saved) : forceFullscreen;
    }
    console.log('[TaskWorkspace] Server-side init, using forceFullscreen:', forceFullscreen);
    return forceFullscreen;
  });
  
  // Force fullscreen when opening if requested
  useEffect(() => {
    console.log('[TaskWorkspace] Fullscreen effect triggered:', { open, forceFullscreen, isFullscreen });
    if (open && forceFullscreen && !isFullscreen) {
      console.log('[TaskWorkspace] Forcing fullscreen mode');
      setIsFullscreen(true);
    }
  }, [open, forceFullscreen, isFullscreen]);
  
  // Persist fullscreen preference
  useEffect(() => {
    if (typeof window !== 'undefined') {
      localStorage.setItem('taskWorkspaceFullscreen', JSON.stringify(isFullscreen));
    }
  }, [isFullscreen]);

  // Load real work items when task changes
  useEffect(() => {
    if (task) {
      setTimeElapsed(task.time_spent || 0);
      loadRealWorkItems();
    }
  }, [task]);

  const loadRealWorkItems = async () => {
    if (!task) return;

    try {
      // For now, we'll create realistic work items based on the task type
      // In a real system, these would come from the database
      const items: WorkItem[] = generateRealWorkItems(task);
      setWorkItems(items);
      setItemsCompleted(items.filter((item) => item.completed).length);
      setCurrentItemIndex(items.findIndex((item) => !item.completed) || 0);
    } catch (error) {
      console.error('Failed to load work items:', error);
      // Fallback to demo items
      const items: WorkItem[] = Array.from({ length: 20 }, (_, i) => ({
        id: `item-${i + 1}`,
        type: getWorkItemType(task.category || 'content_moderation'),
        data: generateSampleData(task.category || 'content_moderation', i),
        completed: i < Math.floor((task.progress / 100) * 20),
      }));
      setWorkItems(items);
      setItemsCompleted(items.filter((item) => item.completed).length);
      setCurrentItemIndex(items.findIndex((item) => !item.completed) || 0);
    }
  };

  // Timer effect with seconds
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isWorking) {
      interval = setInterval(() => {
        setSeconds((prev) => {
          if (prev >= 59) {
            setTimeElapsed((t) => t + 1);
            return 0;
          }
          return prev + 1;
        });
      }, 1000); // Update every second
    }
    return () => clearInterval(interval);
  }, [isWorking]);

  // Auto-save effect
  useEffect(() => {
    if (isWorking) {
      const autoSaveInterval = setInterval(() => {
        setLastSaved(new Date());
        // In real app, save to backend here
      }, 30000); // Auto-save every 30 seconds
      return () => clearInterval(autoSaveInterval);
    }
  }, [isWorking, itemsCompleted, notes]);

  // Get current item
  const currentItem = workItems[currentItemIndex];

  // Fullscreen mode feedback
  useEffect(() => {
    if (open && isFullscreen) {
      toast.success('📱 Fullscreen mode for better focus! Double-click header or use the Windowed button to resize.', {
        duration: 4000,
      });
    }
  }, [open]); // Only show once when opening

  // Keyboard shortcuts
  useEffect(() => {
    const handleKeyPress = (e: KeyboardEvent) => {
      if (!open) return;
      
      // Prevent shortcuts when typing in textarea
      if (e.target instanceof HTMLTextAreaElement) return;

      if (e.key === 'ArrowRight' && !e.ctrlKey) {
        e.preventDefault();
        handleNextItem();
      } else if (e.key === 'ArrowLeft' && !e.ctrlKey) {
        e.preventDefault();
        handlePreviousItem();
      } else if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        handleSubmitItem();
      } else if (e.key === 's' && e.ctrlKey) {
        e.preventDefault();
        handleSaveProgress();
      } else if (e.key === ' ' && e.ctrlKey) {
        e.preventDefault();
        handleStartPause();
      } else if (e.key === 'f' && e.ctrlKey) {
        e.preventDefault();
        setIsFullscreen(!isFullscreen);
      } else if (currentItem && ['1', '2', '3', '4', '5', '6'].includes(e.key)) {
        // Number key shortcuts for selecting options
        const index = parseInt(e.key) - 1;
        if (currentItem.type === 'image_classification' && currentItem.data?.categories?.[index]) {
          setCurrentAnswer(currentItem.data.categories[index]);
        } else if (currentItem.type === 'content_moderation' && currentItem.data?.options?.[index]) {
          setCurrentAnswer(currentItem.data.options[index]);
        }
      }
    };

    window.addEventListener('keydown', handleKeyPress);
    return () => window.removeEventListener('keydown', handleKeyPress);
  }, [open, currentItemIndex, workItems.length, currentAnswer, currentItem, isFullscreen]);

  const getWorkItemType = (category: string): WorkItem['type'] => {
    if (!category) return 'content_moderation';
    if (category.includes('Classification')) return 'image_classification';
    if (category.includes('Annotation')) return 'text_annotation';
    if (category.includes('Validation')) return 'data_validation';
    return 'content_moderation';
  };

  const generateRealWorkItems = (task: any): WorkItem[] => {
    const taskTitle = task.title || '';
    const taskType = task.type || '';
    const totalItems = 10; // Realistic number of work items
    
    if (taskTitle.includes('Image Classification')) {
      // Real image classification work
      return Array.from({ length: totalItems }, (_, i) => ({
        id: `real-item-${i + 1}`,
        type: 'image_classification' as WorkItem['type'],
        data: {
          image_url: `https://images.unsplash.com/photo-${1500000000000 + i * 123456}?w=800&h=600&fit=crop&q=80`,
          categories: ['Animal', 'Vehicle', 'Building', 'Nature', 'Person', 'Food', 'Technology', 'Sports'],
          description: `Image ${i + 1}: Classify this image into the most appropriate category`,
          instructions: task.instructions || 'Select the category that best describes the main subject of this image.'
        },
        completed: i < Math.floor((task.progress / 100) * totalItems),
      }));
    } else if (taskTitle.includes('Object Detection')) {
      // Real object detection work  
      return Array.from({ length: totalItems }, (_, i) => ({
        id: `real-item-${i + 1}`,
        type: 'image_classification' as WorkItem['type'],
        data: {
          image_url: `https://images.unsplash.com/photo-${1400000000000 + i * 87654}?w=800&h=600&fit=crop&q=80`,
          categories: ['Car', 'Person', 'Bicycle', 'Dog', 'Cat', 'Tree', 'Building', 'Sign'],
          description: `Detection Task ${i + 1}: Identify and classify the main objects in this image`,
          instructions: task.instructions || 'Identify the primary object in the image and select its category.'
        },
        completed: i < Math.floor((task.progress / 100) * totalItems),
      }));
    } else if (taskTitle.includes('Model Output Evaluation')) {
      // Real AI model evaluation work
      const aiResponses = [
        "The Renaissance was a period of cultural rebirth in Europe, spanning roughly from the 14th to 17th centuries.",
        "Machine learning algorithms can identify patterns in large datasets to make predictions about new data.",
        "Climate change refers to long-term shifts in global temperatures and weather patterns.",
        "The human brain contains approximately 86 billion neurons that communicate through synapses.",
        "Photosynthesis is the process by which plants convert sunlight, carbon dioxide, and water into glucose.",
        "Quantum computing uses quantum-mechanical phenomena to perform operations on data.",
        "The Great Wall of China stretches over 13,000 miles and was built over many centuries.",
        "DNA contains the genetic instructions needed for the development and function of living organisms.",
        "Artificial intelligence aims to create systems that can perform tasks typically requiring human intelligence.",
        "The theory of relativity revolutionized our understanding of space, time, and gravity."
      ];
      
      return Array.from({ length: totalItems }, (_, i) => ({
        id: `real-item-${i + 1}`,
        type: 'content_moderation' as WorkItem['type'],
        data: {
          content: aiResponses[i % aiResponses.length],
          question: `Evaluation ${i + 1}: Rate this AI response for accuracy and helpfulness`,
          options: ['Excellent (5/5)', 'Good (4/5)', 'Average (3/5)', 'Poor (2/5)', 'Very Poor (1/5)'],
          instructions: task.instructions || 'Rate the AI response based on accuracy, relevance, and helpfulness.'
        },
        completed: i < Math.floor((task.progress / 100) * totalItems),
      }));
    } else {
      // Professional AI training content moderation work
      return Array.from({ length: totalItems }, (_, i) => {
        const scenarios = [
          {
            content: `Social Media Post Analysis #${i + 1}: "Just got the new Tesla Model Y! The autopilot is incredible - it handled highway merging perfectly. #ElectricVehicle #Technology"`,
            context: 'Tesla social media monitoring for brand sentiment and safety feedback',
            options: ['Positive Brand Sentiment', 'Safety Feedback', 'Product Experience', 'Requires Follow-up']
          },
          {
            content: `Medical Content Review #${i + 1}: "Natural remedies for managing diabetes: Cinnamon extract has shown promising results in clinical studies for blood sugar regulation. Always consult healthcare providers."`,
            context: 'Google Health content accuracy verification for YMYL (Your Money Your Life) pages',
            options: ['Medically Accurate', 'Needs Expert Review', 'Add Disclaimer', 'Flag for Medical Team']
          },
          {
            content: `Voice Command Training #${i + 1}: User said: "Alexa, remind me to take my medication at 8 AM daily" - System Response: "I've set a recurring reminder for medication at 8:00 AM every day."`,
            context: 'Amazon Alexa voice response quality evaluation for healthcare commands',
            options: ['Excellent Response', 'Good - Minor Issues', 'Needs Improvement', 'Safety Concern']
          },
          {
            content: `Code Review Assessment #${i + 1}: Python function for data validation with proper error handling, type hints, and documentation. Follows PEP-8 standards and includes comprehensive unit tests.`,
            context: 'OpenAI GPT model training for code quality evaluation and programming education',
            options: ['Professional Quality', 'Good with Minor Issues', 'Needs Refactoring', 'Educational Value High']
          },
          {
            content: `Content Moderation #${i + 1}: Instagram post featuring family vacation photos with appropriate privacy settings, positive engagement, and no policy violations detected.`,
            context: 'Meta content safety review for community guidelines compliance',
            options: ['Safe Content', 'Educational Content', 'Promote Positive Engagement', 'No Action Needed']
          }
        ];
        
        const scenario = scenarios[i % scenarios.length];
        
        return {
          id: `professional-task-${i + 1}`,
          type: 'content_moderation' as WorkItem['type'],
          data: {
            content: scenario.content,
            context: scenario.context,
            options: scenario.options,
            instructions: `Professional AI Training Task: Evaluate this ${scenario.context.split(' ')[0]} content according to quality standards. Your assessment helps train AI systems for major tech companies.`
          },
          completed: i < Math.floor((task.progress / 100) * totalItems),
        };
      });
    }
  };

  const generateSampleData = (category: string, index: number) => {
    if (!category) {
      return {
        text: 'Sample content for review',
        options: ['Approve', 'Reject', 'Flag for Review']
      };
    }
    if (category.includes('Classification')) {
      return {
        image_url: `https://images.unsplash.com/photo-${1500000000000 + index * 100000}?w=600&h=400&fit=crop`,
        categories: ['Animal', 'Vehicle', 'Building', 'Nature', 'Person', 'Object'],
      };
    }
    if (category.includes('Moderation')) {
      const sampleComments = [
        'This is a great product! Highly recommend it to everyone.',
        'Amazing service, will definitely use again.',
        'The quality exceeded my expectations.',
        'Fast delivery and excellent customer support.',
        'Best purchase I\'ve made this year!',
      ];
      return {
        content: sampleComments[index % sampleComments.length],
        options: ['Approve', 'Reject - Spam', 'Reject - Inappropriate', 'Flag for Review'],
      };
    }
    if (category.includes('Validation')) {
      return {
        record: {
          name: `Customer ${index + 1}`,
          email: `customer${index + 1}@example.com`,
          phone: `+1-555-${(1000 + index).toString().slice(-4)}`,
          address: `${100 + index} Main Street, City, State`,
        },
        fields: ['name', 'email', 'phone', 'address'],
      };
    }
    return {
      text: `Sample text content for annotation task item ${index + 1}`,
      labels: ['Positive', 'Negative', 'Neutral', 'Question'],
    };
  };

  const handleStartPause = () => {
    setIsWorking(!isWorking);
    if (!isWorking) {
      toast.success('Timer started. Good luck!');
    } else {
      toast.info('Timer paused. Take a break!');
    }
  };

  const handleSaveProgress = () => {
    setLastSaved(new Date());
    toast.success('Progress saved successfully');
  };

  const handleSubmitItem = () => {
    if (!currentAnswer) {
      toast.error('Please complete the current item before proceeding');
      return;
    }

    const newWorkItems = [...workItems];
    newWorkItems[currentItemIndex].completed = true;
    setWorkItems(newWorkItems);
    setItemsCompleted((prev) => prev + 1);
    setStreak((prev) => prev + 1);
    setCurrentAnswer(null);

    // Show streak notification
    if (streak > 0 && streak % 5 === 4) {
      toast.success(`🔥 ${streak + 1} item streak! Keep it up!`);
    }

    // Move to next item
    if (currentItemIndex < workItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      toast.success('Item submitted!');
    } else {
      setShowCelebration(true);
      toast.success('🎉 All items completed! Ready to submit!');
      setTimeout(() => setShowCelebration(false), 3000);
    }
  };

  const handlePreviousItem = () => {
    if (currentItemIndex > 0) {
      setCurrentItemIndex(currentItemIndex - 1);
      setCurrentAnswer(null);
    }
  };

  const saveTaskProgress = async (completedItems: number, totalItems: number) => {
    if (!task) return;
    
    try {
      const progressPercentage = Math.round((completedItems / totalItems) * 100);
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
        console.error('No authentication token available for progress save');
        return;
      }
      
      const progressResponse = await fetch(`http://localhost:5000/api/tasks/${task.id}/progress`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({
          progress: progressPercentage,
          status: completedItems === totalItems ? 'completed' : 'in_progress',
          time_spent: timeElapsed
        })
      });
      
      if (progressResponse.status === 401) {
        // Handle authentication errors silently for progress saves
        localStorage.removeItem('accessToken');
        localStorage.removeItem('infera_session');
        console.warn('Authentication expired during progress save');
        return;
      }
      
      if (progressResponse.ok) {
        console.log(`💾 Progress saved: ${progressPercentage}%`);
      }
    } catch (error) {
      console.error('Failed to save progress:', error);
    }
  };

  const handleNextItem = () => {
    if (currentAnswer && currentItem) {
      // Mark current item as completed
      const updatedItems = workItems.map((item, index) => 
        index === currentItemIndex 
          ? { ...item, completed: true, answer: currentAnswer }
          : item
      );
      setWorkItems(updatedItems);
      
      const newCompletedCount = updatedItems.filter(item => item.completed).length;
      setItemsCompleted(newCompletedCount);
      
      // Save progress to backend
      saveTaskProgress(newCompletedCount, workItems.length);
      
      toast.success(`✅ Item ${currentItemIndex + 1} completed!`);
    }

    if (currentItemIndex < workItems.length - 1) {
      setCurrentItemIndex(currentItemIndex + 1);
      setCurrentAnswer(null);
    } else {
      // All items completed
      toast.success('🎉 All items completed! Ready to submit task.');
    }
  };

  const handleSubmitTask = async () => {
    if (itemsCompleted < workItems.length) {
      toast.error('Please complete all items before submitting the task');
      return;
    }

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
        toast.error('Authentication required. Please log in again.');
        return;
      }
      
      // Prepare submission data
      const submissionData = {
        status: 'submitted',
        progress: 100,
        time_spent: timeElapsed,
        submission_notes: `Completed ${workItems.length} items in ${Math.floor(timeElapsed / 60)} minutes`,
        completed_items: workItems.filter(item => item.completed).map(item => ({
          id: item.id,
          type: item.type,
          answer: (item as any).answer
        }))
      };

      // Submit to backend
      const response = await fetch(`http://localhost:5000/api/tasks/${task?.id}/submit`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(submissionData)
      });

      if (response.ok) {
        const completionBonus = itemsCompleted === workItems.length ? 5 : 0;
        const totalEarned = (task?.payment || 0) + completionBonus;
        const timeBonus = timeElapsed < (task?.estimated_time || 0) ? 3 : 0;
        const finalEarnings = totalEarned + timeBonus;

        // Celebration toast
        toast.success(
          `🎉 Task submitted successfully! You earned $${finalEarnings}${completionBonus > 0 ? ` (+$${completionBonus} bonus)` : ''}${timeBonus > 0 ? ` (+$${timeBonus} speed bonus)` : ''}`,
          { duration: 5000 }
        );
        
        if (task) {
          onComplete(task.id);
        }
        onOpenChange(false);
      } else if (response.status === 401) {
        // Handle authentication errors - likely stale token
        localStorage.removeItem('accessToken');
        localStorage.removeItem('infera_session');
        toast.error('Session expired. Please log in again.');
        // Redirect to login or refresh page
        window.location.href = '/';
      } else {
        throw new Error('Failed to submit task');
      }
    } catch (error) {
      console.error('Submission error:', error);
      toast.error('Failed to submit task. Please try again.');
    }
  };

  const progressPercentage = (itemsCompleted / workItems.length) * 100;

  const formatTime = (minutes: number, includeSeconds = false) => {
    const hours = Math.floor(minutes / 60);
    const mins = minutes % 60;
    if (includeSeconds) {
      if (hours > 0) {
        return `${hours}h ${mins}m ${seconds}s`;
      }
      return `${mins}m ${seconds}s`;
    }
    if (hours > 0) {
      return `${hours}h ${mins}m`;
    }
    return `${mins}m`;
  };

  const formatLastSaved = () => {
    if (!lastSaved) return 'Not saved yet';
    const diff = Math.floor((new Date().getTime() - lastSaved.getTime()) / 1000);
    if (diff < 60) return 'Saved just now';
    if (diff < 3600) return `Saved ${Math.floor(diff / 60)}m ago`;
    return `Saved ${Math.floor(diff / 3600)}h ago`;
  };

  const renderWorkInterface = () => {
    if (!currentItem) return null;

    switch (currentItem.type) {
      case 'image_classification':
        return (
          <div className="space-y-6">
            <div 
              className="w-full bg-gray-100 rounded-xl overflow-hidden border-2 border-gray-200 shadow-lg transition-all" 
              style={{ height: isFullscreen ? 'calc(100vh - 200px)' : 'calc(98vh - 250px)', minHeight: '600px' }}
            >
              <img
                src={`https://images.unsplash.com/photo-${1500000000000 + currentItemIndex * 100000}?w=1600&h=1200&fit=crop&q=80`}
                alt="Task item"
                className="w-full h-full object-contain bg-gray-900"
                onError={(e) => {
                  (e.target as HTMLImageElement).src = `https://images.unsplash.com/photo-1516542076529-1ea3854896f2?w=1600&h=1200&fit=crop&q=80`;
                }}
              />
            </div>
            <div>
              <Label className="mb-4 block text-gray-900 text-lg">
                Select the best category for this image:
              </Label>
              <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                <div className="grid grid-cols-3 gap-4">
                  {(currentItem.data?.categories || []).map((category: string, idx: number) => (
                    <div
                      key={category}
                      className={`flex items-center space-x-3 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-105 ${
                        currentAnswer === category
                          ? 'border-blue-500 bg-blue-50 shadow-xl'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                      }`}
                      onClick={() => setCurrentAnswer(category)}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentAnswer === category
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <RadioGroupItem value={category} id={category} className="hidden" />
                      <Label htmlFor={category} className="cursor-pointer flex-1 text-base">
                        {category}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      case 'content_moderation':
        return (
          <div className="space-y-6">
            {/* Professional Context Header */}
            <div className="bg-gradient-to-r from-blue-50 to-indigo-50 p-4 rounded-lg border-l-4 border-blue-500">
              <h4 className="font-semibold text-blue-900 mb-2 flex items-center gap-2">
                🎯 Professional AI Training Task
              </h4>
              <p className="text-blue-800 text-sm mb-2">{currentItem.data?.context || 'Content evaluation for AI training purposes'}</p>
              <p className="text-blue-700 text-xs">Your professional assessment helps improve AI systems for major tech companies</p>
            </div>

            {/* Content to Review */}
            <Card className="bg-gradient-to-br from-gray-50 to-gray-100 border-2">
              <CardHeader className="pb-3">
                <CardTitle className="text-lg text-gray-800">Content for Professional Review</CardTitle>
              </CardHeader>
              <CardContent className={isFullscreen ? 'p-8 pt-0' : 'p-6 pt-0'}>
                <div className="bg-white p-4 rounded border-l-4 border-gray-300 shadow-sm">
                  <p className={`text-gray-900 leading-relaxed ${isFullscreen ? 'text-xl' : 'text-lg'} max-w-none`}>
                    {currentItem.data?.content || 'Content to review'}
                  </p>
                </div>
              </CardContent>
            </Card>

            {/* Professional Assessment Options */}
            <div>
              <Label className="mb-4 block text-gray-900 text-lg font-medium">Professional Assessment:</Label>
              <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                <div className="space-y-3">
                  {(currentItem.data?.options || []).map((option: string, idx: number) => (
                    <div
                      key={option}
                      className={`flex items-center space-x-3 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                        currentAnswer === option
                          ? 'border-blue-500 bg-blue-50 shadow-xl'
                          : 'border-gray-200 hover:border-blue-300 hover:shadow-lg'
                      }`}
                      onClick={() => setCurrentAnswer(option)}
                    >
                      <div className={`flex-shrink-0 w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                        currentAnswer === option
                          ? 'bg-blue-500 text-white'
                          : 'bg-gray-200 text-gray-600'
                      }`}>
                        {idx + 1}
                      </div>
                      <RadioGroupItem value={option} id={option} className="hidden" />
                      <Label htmlFor={option} className="cursor-pointer flex-1 text-base font-medium">
                        {option}
                      </Label>
                    </div>
                  ))}
                </div>
              </RadioGroup>
              
              {/* Professional Guidelines */}
              <div className="mt-4 p-3 bg-amber-50 rounded border-l-4 border-amber-400">
                <p className="text-amber-800 text-sm">
                  <strong>Professional Guidelines:</strong> Evaluate content according to industry standards. 
                  Your expert assessment contributes to training advanced AI systems used by millions of users.
                </p>
              </div>
            </div>
          </div>
        );

      case 'data_validation':
        return (
          <div className="space-y-6">
            <Card className="border-2">
              <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50">
                <CardTitle className="text-xl">Customer Record #{currentItemIndex + 1}</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 p-6">
                {Object.entries(currentItem.data?.record || {}).map(([key, value]) => (
                  <div key={key} className="flex items-center justify-between p-4 bg-gray-50 rounded-xl border border-gray-200">
                    <div>
                      <p className="text-sm text-gray-600 capitalize mb-1">{key}</p>
                      <p className="text-gray-900 text-lg">{value as string}</p>
                    </div>
                  </div>
                ))}
              </CardContent>
            </Card>
            <div>
              <Label className="mb-4 block text-gray-900 text-lg">Is this data accurate and complete?</Label>
              <RadioGroup value={currentAnswer} onValueChange={setCurrentAnswer}>
                <div className="space-y-3">
                  <div
                    className={`flex items-center space-x-3 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      currentAnswer === 'valid'
                        ? 'border-green-500 bg-green-50 shadow-xl'
                        : 'border-gray-200 hover:border-green-300 hover:shadow-lg'
                    }`}
                    onClick={() => setCurrentAnswer('valid')}
                  >
                    <RadioGroupItem value="valid" id="valid" className="hidden" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      currentAnswer === 'valid'
                        ? 'bg-green-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      ✓
                    </div>
                    <Label htmlFor="valid" className="cursor-pointer flex-1 text-base">
                      Valid - All data is accurate
                    </Label>
                  </div>
                  <div
                    className={`flex items-center space-x-3 p-5 rounded-xl border-2 cursor-pointer transition-all hover:scale-[1.02] ${
                      currentAnswer === 'invalid'
                        ? 'border-red-500 bg-red-50 shadow-xl'
                        : 'border-gray-200 hover:border-red-300 hover:shadow-lg'
                    }`}
                    onClick={() => setCurrentAnswer('invalid')}
                  >
                    <RadioGroupItem value="invalid" id="invalid" className="hidden" />
                    <div className={`w-8 h-8 rounded-full flex items-center justify-center font-semibold ${
                      currentAnswer === 'invalid'
                        ? 'bg-red-500 text-white'
                        : 'bg-gray-200 text-gray-600'
                    }`}>
                      ✗
                    </div>
                    <Label htmlFor="invalid" className="cursor-pointer flex-1 text-base">
                      Invalid - Data has errors or is incomplete
                    </Label>
                  </div>
                </div>
              </RadioGroup>
            </div>
          </div>
        );

      default:
        return (
          <div className="text-center py-12">
            <Info className="h-12 w-12 text-gray-300 mx-auto mb-4" />
            <p className="text-gray-600">Work interface loading...</p>
          </div>
        );
    }
  };

  if (!task) return null;

  console.log('[TaskWorkspace] Render with isFullscreen:', isFullscreen);
  
  // Conditional components based on fullscreen mode
  const HeaderComponent = isFullscreen ? 'div' : DialogHeader;
  const TitleComponent = isFullscreen ? 'h1' : DialogTitle;
  const DescriptionComponent = isFullscreen ? 'p' : DialogDescription;
  
  const taskContent = (
    <div className={`${isFullscreen ? 'h-screen flex flex-col' : ''}`}>
      {/* Celebration Overlay */}
      <AnimatePresence>
        {showCelebration && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 z-50 flex items-center justify-center bg-black/20 backdrop-blur-sm pointer-events-none"
          >
              <motion.div
                initial={{ scale: 0, rotate: -180 }}
                animate={{ scale: 1, rotate: 0 }}
                exit={{ scale: 0, rotate: 180 }}
                transition={{ type: 'spring', duration: 0.6 }}
                className="bg-gradient-to-r from-green-500 to-emerald-500 text-white px-12 py-8 rounded-2xl shadow-2xl"
              >
                <div className="text-center">
                  <div className="text-6xl mb-4">🎉</div>
                  <h3 className="text-3xl mb-2">All Items Complete!</h3>
                  <p className="text-green-100">Ready to submit your work</p>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>
        {/* Header */}
        <div 
          className="sticky top-0 z-10 bg-white border-b p-6 transition-all"
          onDoubleClick={() => setIsFullscreen(!isFullscreen)}
          title="Double-click to toggle fullscreen"
        >
          <div className="flex items-start justify-between gap-4 mb-4">
            <div className="flex-1">
              <div className="flex items-center gap-3 mb-2">
                <TitleComponent className={`text-2xl ${isFullscreen ? 'font-semibold leading-none' : ''}`}>{task.title}</TitleComponent>
                {isFullscreen && (
                  <Badge className="bg-blue-100 text-blue-800 border-blue-300 animate-pulse">
                    <Maximize2 className="h-3 w-3 mr-1" />
                    Fullscreen
                  </Badge>
                )}
              </div>
              <DescriptionComponent className={isFullscreen ? 'text-muted-foreground' : ''}>{task.project_name}</DescriptionComponent>
            </div>
            <div className="flex items-center gap-2">
              <Button
                variant={isFullscreen ? 'secondary' : 'default'}
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
                title={`${isFullscreen ? 'Exit' : 'Enter'} fullscreen mode (or double-click header)`}
                className={isFullscreen ? 'bg-gray-600 hover:bg-gray-700 text-white' : 'bg-blue-600 hover:bg-blue-700 text-white'}
              >
                {isFullscreen ? (
                  <>
                    <Minimize2 className="h-4 w-4 mr-2" />
                    Windowed
                  </>
                ) : (
                  <>
                    <Maximize2 className="h-4 w-4 mr-2" />
                    Fullscreen
                  </>
                )}
              </Button>
              <Button
                variant={isWorking ? 'destructive' : 'default'}
                size="sm"
                onClick={handleStartPause}
              >
                {isWorking ? (
                  <>
                    <Pause className="h-4 w-4 mr-2" />
                    Pause
                  </>
                ) : (
                  <>
                    <Play className="h-4 w-4 mr-2" />
                    {timeElapsed > 0 ? 'Resume' : 'Start'}
                  </>
                )}
              </Button>
              <Button variant="outline" size="sm" onClick={handleSaveProgress}>
                <Save className="h-4 w-4 mr-2" />
                Save
              </Button>
              <div className="flex items-center gap-3 text-xs">
                <div className="text-gray-500">
                  {formatLastSaved()}
                </div>
                {streak > 2 && (
                  <div className="flex items-center gap-1 bg-orange-100 text-orange-700 px-2 py-1 rounded">
                    <span>🔥</span>
                    <span>{streak} streak</span>
                  </div>
                )}
              </div>
            </div>
          </div>

          {/* Stats Bar */}
          <div className="grid grid-cols-4 gap-4 mb-4">
            <div className="bg-gradient-to-r from-blue-50 to-blue-100 p-3 rounded-lg relative overflow-hidden">
              {isWorking && (
                <div className="absolute top-0 left-0 w-1 h-full bg-blue-500 animate-pulse" />
              )}
              <div className="flex items-center gap-2 text-blue-900">
                <Timer className={`h-4 w-4 ${isWorking ? 'animate-pulse' : ''}`} />
                <div>
                  <p className="text-xs text-blue-700">Time Elapsed</p>
                  <p className="font-semibold font-mono">{formatTime(timeElapsed, true)}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-green-50 to-green-100 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-green-900">
                <DollarSign className="h-4 w-4" />
                <div>
                  <p className="text-xs text-green-700">Earnings</p>
                  <p className="font-semibold">${task.payment || 25}</p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-purple-50 to-purple-100 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-purple-900">
                <Target className="h-4 w-4" />
                <div>
                  <p className="text-xs text-purple-700">Progress</p>
                  <p className="font-semibold">
                    {itemsCompleted}/{workItems.length}
                  </p>
                </div>
              </div>
            </div>
            <div className="bg-gradient-to-r from-orange-50 to-orange-100 p-3 rounded-lg">
              <div className="flex items-center gap-2 text-orange-900">
                <Star className="h-4 w-4" />
                <div>
                  <p className="text-xs text-orange-700">Completion</p>
                  <p className="font-semibold">{Math.round(progressPercentage)}%</p>
                </div>
              </div>
            </div>
          </div>

          {/* Progress Bar */}
          <div className="space-y-2">
            <Progress value={progressPercentage} className="h-3" />
            <div className="flex justify-between items-center text-xs text-gray-600">
              <span>
                Item {currentItemIndex + 1} of {workItems.length}
              </span>
              <span>{Math.round(progressPercentage)}% Complete</span>
            </div>
            {/* Mini progress dots */}
            <div className="flex gap-1 justify-center">
              {workItems.slice(0, 20).map((item, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 w-1.5 rounded-full transition-all ${
                    item.completed
                      ? 'bg-green-500'
                      : idx === currentItemIndex
                      ? 'bg-blue-500 scale-125'
                      : 'bg-gray-300'
                  }`}
                  title={`Item ${idx + 1}${item.completed ? ' - Completed' : idx === currentItemIndex ? ' - Current' : ''}`}
                />
              ))}
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className={`${isFullscreen ? 'flex-1 overflow-y-auto' : 'overflow-y-auto'} ${isFullscreen ? '' : 'max-h-[calc(98vh-220px)]'}`}>
          <div className={isFullscreen ? 'p-4' : 'p-6'}>
            <Tabs defaultValue="work" className={`w-full ${isFullscreen ? 'h-full flex flex-col' : ''}`}>
              <TabsList className="grid w-full grid-cols-3 mb-6 shrink-0">
                <TabsTrigger value="work">Work Area</TabsTrigger>
                <TabsTrigger value="instructions">Instructions</TabsTrigger>
                <TabsTrigger value="notes">Notes</TabsTrigger>
              </TabsList>

              <TabsContent value="work" className={`space-y-6 ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
                {/* Work Interface */}
                <Card className="border-2 shadow-lg">
                  <CardHeader className="bg-gradient-to-r from-blue-50 to-purple-50 border-b">
                    <div className="flex items-center justify-between">
                      <CardTitle className="text-xl">
                        Item {currentItemIndex + 1} of {workItems.length}
                      </CardTitle>
                      {currentItem?.completed && (
                        <Badge className="bg-green-100 text-green-800 px-3 py-1">
                          <Check className="h-4 w-4 mr-1" />
                          Completed
                        </Badge>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent className="p-8">{renderWorkInterface()}</CardContent>
                </Card>

                {/* Navigation */}
                <div className="space-y-3">
                  <div className="flex items-center justify-between gap-4">
                    <Button
                      variant="outline"
                      onClick={handlePreviousItem}
                      disabled={currentItemIndex === 0}
                    >
                      <ChevronLeft className="h-4 w-4 mr-2" />
                      Previous
                      <kbd className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">←</kbd>
                    </Button>

                    <div className="flex gap-2">
                      {!currentItem?.completed && (
                        <Button onClick={handleSubmitItem} disabled={!currentAnswer}>
                          <Check className="h-4 w-4 mr-2" />
                          Submit Item
                          <kbd className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">Ctrl+Enter</kbd>
                        </Button>
                      )}
                      <Button
                        variant="outline"
                        onClick={handleNextItem}
                        disabled={currentItemIndex === workItems.length - 1}
                      >
                        Next
                        <kbd className="ml-2 px-2 py-0.5 text-xs bg-gray-100 rounded border border-gray-300">→</kbd>
                        <ChevronRight className="h-4 w-4 ml-2" />
                      </Button>
                    </div>
                  </div>
                  
                  {/* Keyboard shortcuts hint */}
                  <div className="flex items-center justify-center gap-4 text-xs text-gray-500 bg-gray-50 p-2 rounded flex-wrap">
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">1-6</kbd>
                      <span>Quick select</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">←/→</kbd>
                      <span>Navigate</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">Ctrl+Enter</kbd>
                      <span>Submit</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">Ctrl+S</kbd>
                      <span>Save</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">Ctrl+Space</kbd>
                      <span>Timer</span>
                    </div>
                    <div className="flex items-center gap-1">
                      <kbd className="px-2 py-0.5 bg-white rounded border border-gray-300">Ctrl+F</kbd>
                      <span>Fullscreen</span>
                    </div>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="instructions" className={`${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
                <Card className={isFullscreen ? 'h-full flex flex-col' : ''}>
                  <CardHeader className="shrink-0">
                    <CardTitle className="flex items-center gap-2">
                      <FileText className="h-5 w-5" />
                      Task Instructions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className={`space-y-4 ${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
                    <div>
                      <h4 className="text-gray-900 mb-2">Overview</h4>
                      <p className="text-gray-600">{task.instructions || task.description || 'Complete this task according to the requirements.'}</p>
                    </div>
                    <Separator />
                    <div>
                      <h4 className="text-gray-900 mb-2">Requirements</h4>
                      <ul className="space-y-2">
                        {(task.requirements || []).map((req, idx) => (
                          <li key={idx} className="flex items-start gap-2 text-gray-600">
                            <CheckCircle className="h-5 w-5 text-green-500 flex-shrink-0 mt-0.5" />
                            <span>{req}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <Separator />
                    <div className="bg-blue-50 p-4 rounded-lg">
                      <div className="flex items-start gap-2">
                        <Info className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                        <div>
                          <p className="text-blue-900 mb-1">Pro Tip</p>
                          <p className="text-blue-700 text-sm">
                            Take your time to ensure accuracy. Quality submissions earn bonus rewards
                            and unlock higher-paying tasks!
                          </p>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </TabsContent>

              <TabsContent value="notes" className={`${isFullscreen ? 'flex-1 overflow-y-auto' : ''}`}>
                <Card className={isFullscreen ? 'h-full flex flex-col' : ''}>
                  <CardHeader className="shrink-0">
                    <CardTitle>Personal Notes</CardTitle>
                    <CardDescription>Add notes or observations about this task</CardDescription>
                  </CardHeader>
                  <CardContent className={isFullscreen ? 'flex-1 flex flex-col' : ''}>
                    <Textarea
                      placeholder="Type your notes here..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      rows={isFullscreen ? 20 : 10}
                      className={`resize-none ${isFullscreen ? 'flex-1 min-h-0' : ''}`}
                    />
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </div>
        </div>

        {/* Footer */}
        <div className="sticky bottom-0 bg-gradient-to-r from-blue-50 to-purple-50 border-t p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <div className="flex items-center gap-2 text-gray-700">
                <Clock className="h-4 w-4" />
                <span className="text-sm">Est. {task.estimated_time || 45} min</span>
              </div>
              {itemsCompleted === workItems.length && (
                <Badge className="bg-green-100 text-green-800 border-green-300">
                  <Award className="h-3 w-3 mr-1" />
                  Ready to Submit!
                </Badge>
              )}
            </div>
            <div className="flex items-center gap-3">
              <Button variant="outline" onClick={() => onOpenChange(false)}>
                Close
              </Button>
              <Button
                onClick={handleSubmitTask}
                disabled={itemsCompleted < workItems.length}
                className="bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700"
              >
                <Send className="h-4 w-4 mr-2" />
                Submit Task ({itemsCompleted}/{workItems.length})
              </Button>
            </div>
        </div>
      </div>
    </div>
  );

  if (!open) return null;

  // Render in fullscreen portal when isFullscreen is true
  if (isFullscreen && typeof document !== 'undefined') {
    return createPortal(
      <div className="fixed inset-0 z-[9999] bg-white">
        <div className="h-full w-full">
          {taskContent}
        </div>
      </div>,
      document.body
    );
  }

  // Render in Dialog when not fullscreen
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-[98vw] max-h-[98vh] w-[98vw] h-[98vh] p-0 overflow-hidden">
        {taskContent}
      </DialogContent>
    </Dialog>
  );
}
