'use client';

import { useState, useEffect, useRef, useCallback } from 'react';
import { 
  ArrowLeft, Upload, Send, CheckCircle, Clock, AlertCircle, FileText, 
  Image, Code, Globe, Brain, Save, Play, Pause, MessageSquare, BookOpen,
  Target, Award, ChevronDown, ChevronUp, Paperclip, X, Eye, EyeOff,
  CheckSquare, Square, Star, Timer, TrendingUp, AlertTriangle, Info,
  Download, RefreshCw, Maximize2, Minimize2, HelpCircle, Lightbulb
} from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { submitTask, updateTaskProgress } from '../../utils/api';
import { useAuth } from '../../utils/auth';

// Import enhanced task interfaces
import { 
  DataAnnotationInterface, 
  CodeReviewInterface, 
  ContentModerationInterface,
  ResearchAnalysisInterface,
  MultilingualInterface 
} from './interfaces';

interface UniversalTaskWorkerProps {
  task: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

interface TaskSubmission {
  progress: number;
  timeSpent: number;
  deliverables: any[];
  notes: string;
  quality_rating?: number;
  checklistItems?: { id: string; completed: boolean; text: string }[];
}

interface ChecklistItem {
  id: string;
  text: string;
  completed: boolean;
  required: boolean;
}

export function UniversalTaskWorkerV2({ task, onComplete, onBack }: UniversalTaskWorkerProps) {
  const { accessToken } = useAuth();
  
  // Core state
  const [submission, setSubmission] = useState<TaskSubmission>({
    progress: task?.progress || 0,
    timeSpent: task?.timeSpent || 0,
    deliverables: [],
    notes: '',
  });
  
  // Timer state
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const [elapsedSeconds, setElapsedSeconds] = useState(0);
  const [startTime] = useState<Date>(new Date());
  const timerRef = useRef<NodeJS.Timeout | null>(null);
  
  // Work state
  const [textResponses, setTextResponses] = useState<{[key: string]: string}>({});
  const [files, setFiles] = useState<File[]>([]);
  const [submitting, setSubmitting] = useState(false);
  const [saving, setSaving] = useState(false);
  const [lastSaved, setLastSaved] = useState<Date | null>(null);
  
  // UI state
  const [showInstructions, setShowInstructions] = useState(true);
  const [showGuidelines, setShowGuidelines] = useState(true);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [activeSection, setActiveSection] = useState<string>('work');
  
  // Quality checklist
  const [checklist, setChecklist] = useState<ChecklistItem[]>([
    { id: '1', text: 'Read all instructions carefully', completed: false, required: true },
    { id: '2', text: 'Completed all required sections', completed: false, required: true },
    { id: '3', text: 'Reviewed work for accuracy', completed: false, required: true },
    { id: '4', text: 'Added relevant notes/comments', completed: false, required: false },
    { id: '5', text: 'Uploaded all required files', completed: false, required: false },
  ]);

  // Data annotation states
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [confidence, setConfidence] = useState(95);
  const [annotations, setAnnotations] = useState<any[]>([]);
  
  // Enhanced interface states
  const [useEnhancedInterface, setUseEnhancedInterface] = useState(true);
  const [interfaceData, setInterfaceData] = useState<Record<string, any>>({});
  
  // Handler for enhanced interface data changes
  const handleInterfaceDataChange = useCallback((data: Record<string, any>) => {
    setInterfaceData((prev: Record<string, any>) => ({ ...prev, ...data }));
  }, []);
  
  // Handler for enhanced interface completion
  const handleInterfaceComplete = useCallback((data: Record<string, any>) => {
    setInterfaceData((prev: Record<string, any>) => ({ ...prev, ...data }));
    // Auto-update progress to 100% when interface completes
    setSubmission(prev => ({ ...prev, progress: 100 }));
    toast.success('Task work completed! Review and submit when ready.');
  }, []);

  // Timer effect
  useEffect(() => {
    if (isTimerRunning) {
      timerRef.current = setInterval(() => {
        setElapsedSeconds(prev => prev + 1);
      }, 1000);
    } else if (timerRef.current) {
      clearInterval(timerRef.current);
    }
    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isTimerRunning]);

  // Autosave effect
  useEffect(() => {
    const autoSaveInterval = setInterval(() => {
      if (isTimerRunning && (textResponses['main_response'] || textResponses['training_response'])) {
        handleAutoSave();
      }
    }, 60000); // Autosave every minute
    
    return () => clearInterval(autoSaveInterval);
  }, [isTimerRunning, textResponses]);

  // Format time
  const formatTime = (seconds: number) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    const secs = seconds % 60;
    if (hrs > 0) {
      return `${hrs}h ${mins}m ${secs}s`;
    }
    return `${mins}m ${secs}s`;
  };

  // Calculate progress based on completion
  const calculateProgress = useCallback(() => {
    let progress = 0;
    const hasResponse = textResponses['main_response']?.length > 50 || 
                       textResponses['training_response']?.length > 50 ||
                       annotations.length > 0;
    const hasNotes = submission.notes.length > 10;
    const requiredChecklistComplete = checklist.filter(c => c.required).every(c => c.completed);
    
    if (hasResponse) progress += 50;
    if (hasNotes) progress += 15;
    if (requiredChecklistComplete) progress += 25;
    if (files.length > 0) progress += 10;
    
    return Math.min(100, progress);
  }, [textResponses, annotations, submission.notes, checklist, files]);

  // Auto-update progress
  useEffect(() => {
    const newProgress = calculateProgress();
    if (newProgress !== submission.progress) {
      setSubmission(prev => ({ ...prev, progress: newProgress }));
    }
  }, [calculateProgress, submission.progress]);

  const handleAutoSave = async () => {
    if (!accessToken) return;
    
    setSaving(true);
    try {
      await updateTaskProgress(
        task._id || task.id,
        { 
          progress: submission.progress,
          timeSpent: elapsedSeconds / 60,
          notes: submission.notes,
          deliverables: Object.entries(textResponses).map(([key, value]) => ({
            type: 'text',
            key,
            value,
            timestamp: new Date().toISOString()
          }))
        },
        accessToken
      );
      setLastSaved(new Date());
    } catch (error) {
      console.error('Autosave failed:', error);
    } finally {
      setSaving(false);
    }
  };

  const handleManualSave = async () => {
    if (!accessToken) {
      toast.error('Please log in to save progress');
      return;
    }
    
    setSaving(true);
    try {
      await updateTaskProgress(
        task._id || task.id,
        { 
          progress: submission.progress,
          timeSpent: elapsedSeconds / 60,
          notes: submission.notes
        },
        accessToken
      );
      setLastSaved(new Date());
      toast.success('Progress saved successfully!');
    } catch (error) {
      toast.error('Failed to save progress');
    } finally {
      setSaving(false);
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    if (!accessToken || newProgress === submission.progress) return;
    
    try {
      await updateTaskProgress(
        task._id || task.id,
        { 
          progress: newProgress,
          timeSpent: elapsedSeconds / 60,
          notes: submission.notes
        },
        accessToken
      );
      
      setSubmission(prev => ({ ...prev, progress: newProgress }));
      toast.success(`Progress updated to ${newProgress}%`);
    } catch (error: any) {
      console.error('Progress update error:', error);
      toast.error('Failed to update progress');
      setSubmission(prev => ({ ...prev, progress: newProgress }));
    }
  };

  const handleTextResponse = (key: string, value: string) => {
    setTextResponses(prev => ({ ...prev, [key]: value }));
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
    toast.success(`${uploadedFiles.length} file(s) added`);
  };

  const removeFile = (index: number) => {
    setFiles(prev => prev.filter((_, i) => i !== index));
  };

  const toggleChecklist = (id: string) => {
    setChecklist(prev => prev.map(item => 
      item.id === id ? { ...item, completed: !item.completed } : item
    ));
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error('Authentication required. Please log in again.');
      return;
    }

    const requiredIncomplete = checklist.filter(c => c.required && !c.completed);
    if (requiredIncomplete.length > 0) {
      toast.error('Please complete all required checklist items before submitting');
      return;
    }

    setSubmitting(true);
    
    const finalSubmission = {
      ...submission,
      progress: 100,
      timeSpent: elapsedSeconds / 60,
      completedAt: new Date().toISOString(),
      taskId: task._id || task.id,
      taskTitle: task.title,
      deliverables: [
        ...Object.entries(textResponses).map(([key, value]) => ({
          type: 'text',
          key,
          value,
          timestamp: new Date().toISOString()
        })),
        ...files.map(file => ({
          type: 'file',
          name: file.name,
          size: file.size
        })),
        ...annotations.map(a => ({
          type: 'annotation',
          ...a
        }))
      ],
      checklistItems: checklist,
      // Include enhanced interface data if available
      interfaceData: Object.keys(interfaceData).length > 0 ? interfaceData : undefined,
      enhancedInterfaceUsed: useEnhancedInterface && Object.keys(interfaceData).length > 0
    };

    try {
      const response = await submitTask(
        task._id || task.id, 
        finalSubmission, 
        accessToken
      );
      
      if (response.success) {
        toast.success('🎉 Task submitted successfully!');
        onComplete(task._id || task.id, finalSubmission);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('Task submission error:', error);
      toast.error(error.message || 'Failed to submit task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const getTaskIcon = () => {
    const type = task?.type?.toLowerCase() || task?.category?.toLowerCase() || '';
    if (type.includes('image') || type.includes('vision') || type.includes('annotation')) return <Image className="w-5 h-5" />;
    if (type.includes('code') || type.includes('programming')) return <Code className="w-5 h-5" />;
    if (type.includes('multilingual') || type.includes('translation')) return <Globe className="w-5 h-5" />;
    if (type.includes('ai') || type.includes('training')) return <Brain className="w-5 h-5" />;
    return <FileText className="w-5 h-5" />;
  };

  const getCategoryColor = (category?: string) => {
    const cat = (category || task?.category || '').toLowerCase();
    switch (cat) {
      case 'ai_training': return 'bg-purple-100 text-purple-800 border-purple-200';
      case 'data_annotation': return 'bg-blue-100 text-blue-800 border-blue-200';
      case 'model_evaluation': return 'bg-green-100 text-green-800 border-green-200';
      case 'content_moderation': return 'bg-red-100 text-red-800 border-red-200';
      case 'transcription': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getPriorityColor = (priority?: string) => {
    switch (priority?.toLowerCase()) {
      case 'critical': return 'bg-red-500 text-white';
      case 'high': return 'bg-orange-500 text-white';
      case 'medium': return 'bg-yellow-500 text-white';
      case 'low': return 'bg-green-500 text-white';
      default: return 'bg-gray-500 text-white';
    }
  };

  // Render the main work area content
  const renderWorkArea = () => {
    const type = task?.type?.toLowerCase() || task?.category?.toLowerCase() || '';

    // =========================================
    // ENHANCED INTERFACES (when enabled)
    // =========================================
    
    if (useEnhancedInterface) {
      // Research/Analysis - Enhanced Interface
      if (type.includes('research') || (type.includes('analysis') && !type.includes('data'))) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-purple-50 text-purple-700">
                Enhanced Research Interface
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseEnhancedInterface(false)}
              >
                Switch to Basic Mode
              </Button>
            </div>
            <ResearchAnalysisInterface
              task={task}
              onResearchChange={handleInterfaceDataChange}
              onComplete={handleInterfaceComplete}
            />
          </div>
        );
      }

      // Code Review - Enhanced Interface
      if (type.includes('code') || type.includes('review')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-blue-50 text-blue-700">
                Enhanced Code Review Interface
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseEnhancedInterface(false)}
              >
                Switch to Basic Mode
              </Button>
            </div>
            <CodeReviewInterface
              task={task}
              onReviewChange={handleInterfaceDataChange}
              onComplete={handleInterfaceComplete}
            />
          </div>
        );
      }

      // Content Moderation - Enhanced Interface
      if (type.includes('moderation') || type.includes('safety') || type.includes('content')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-orange-50 text-orange-700">
                Enhanced Content Moderation Interface
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseEnhancedInterface(false)}
              >
                Switch to Basic Mode
              </Button>
            </div>
            <ContentModerationInterface
              task={task}
              onModerationChange={handleInterfaceDataChange}
              onComplete={handleInterfaceComplete}
            />
          </div>
        );
      }

      // Multilingual/Translation - Enhanced Interface
      if (type.includes('multilingual') || type.includes('translation') || type.includes('language')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-indigo-50 text-indigo-700">
                Enhanced Multilingual Interface
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseEnhancedInterface(false)}
              >
                Switch to Basic Mode
              </Button>
            </div>
            <MultilingualInterface
              task={task}
              onEvaluationChange={handleInterfaceDataChange}
              onComplete={handleInterfaceComplete}
            />
          </div>
        );
      }

      // Data Annotation - Enhanced Interface
      if (type.includes('annotation') || type.includes('classification') || type.includes('data_annotation')) {
        return (
          <div className="space-y-4">
            <div className="flex items-center justify-between">
              <Badge variant="outline" className="bg-green-50 text-green-700">
                Enhanced Data Annotation Interface
              </Badge>
              <Button 
                variant="ghost" 
                size="sm" 
                onClick={() => setUseEnhancedInterface(false)}
              >
                Switch to Basic Mode
              </Button>
            </div>
            <DataAnnotationInterface
              task={task}
              onAnnotationsChange={(annos: any[]) => handleInterfaceDataChange({ annotations: annos })}
              onComplete={handleInterfaceComplete}
            />
          </div>
        );
      }
    }

    // =========================================
    // BASIC INTERFACES (fallback or when enhanced is disabled)
    // =========================================

    // Research/Analysis Tasks
    if (type.includes('research') || type.includes('analysis') || type.includes('evaluation')) {
      return (
        <div className="space-y-6">
          {!useEnhancedInterface && (
            <Button 
              variant="outline" 
              size="sm" 
              onClick={() => setUseEnhancedInterface(true)}
              className="mb-4"
            >
              <Lightbulb className="w-4 h-4 mr-2" />
              Try Enhanced Interface
            </Button>
          )}
          {/* Methodology Section */}
          <Card className="border-l-4 border-l-blue-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <BookOpen className="w-5 h-5 text-blue-600" />
                Research Methodology
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="prose prose-sm max-w-none">
                <div className="bg-blue-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
                  {task.instructions || task.description}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Work Response Section */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-purple-600" />
                Task Response
              </CardTitle>
              <CardDescription>
                Provide your detailed work, analysis, or response for this task
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={textResponses['main_response'] || ''}
                onChange={(e) => handleTextResponse('main_response', e.target.value)}
                placeholder="Provide your work, analysis, or response for this task...

Include:
• Your research findings
• Data analysis results
• Key insights and observations
• Recommendations or conclusions"
                rows={12}
                className="w-full font-normal text-base leading-relaxed resize-y min-h-[200px]"
              />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{(textResponses['main_response'] || '').length} characters</span>
                <span>{(textResponses['main_response'] || '').split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </CardContent>
          </Card>

          {/* File Upload Section */}
          <Card className="border-l-4 border-l-green-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Upload className="w-5 h-5 text-green-600" />
                Upload Files (if required)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-green-500 transition-colors">
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="hidden"
                  id="file-upload"
                />
                <label htmlFor="file-upload" className="cursor-pointer">
                  <Paperclip className="w-8 h-8 mx-auto text-gray-400 mb-2" />
                  <p className="text-sm text-gray-600">
                    Click to upload or drag and drop
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    PDF, DOC, XLS, Images (Max 10MB each)
                  </p>
                </label>
              </div>
              
              {files.length > 0 && (
                <div className="mt-4 space-y-2">
                  {files.map((file, idx) => (
                    <div key={idx} className="flex items-center justify-between p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-center gap-3">
                        <Paperclip className="w-4 h-4 text-gray-500" />
                        <div>
                          <p className="text-sm font-medium">{file.name}</p>
                          <p className="text-xs text-gray-500">{(file.size / 1024).toFixed(1)} KB</p>
                        </div>
                      </div>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeFile(idx)}
                      >
                        <X className="w-4 h-4" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // AI Training Tasks
    if (type.includes('ai_training') || type.includes('multilingual') || type.includes('training')) {
      return (
        <div className="space-y-6">
          {/* Instructions Card */}
          <Card className="border-l-4 border-l-purple-500">
            <CardHeader 
              className="pb-3 cursor-pointer"
              onClick={() => setShowInstructions(!showInstructions)}
            >
              <CardTitle className="flex items-center justify-between text-lg">
                <div className="flex items-center gap-2">
                  <Brain className="w-5 h-5 text-purple-600" />
                  AI Training Instructions
                </div>
                {showInstructions ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
              </CardTitle>
            </CardHeader>
            {showInstructions && (
              <CardContent>
                <div className="prose prose-sm max-w-none bg-purple-50 p-4 rounded-lg">
                  {task.instructions || task.description}
                </div>
              </CardContent>
            )}
          </Card>

          {/* Guidelines Card */}
          {task.taskData?.guidelines && (
            <Card className="border-l-4 border-l-blue-500">
              <CardHeader 
                className="pb-3 cursor-pointer"
                onClick={() => setShowGuidelines(!showGuidelines)}
              >
                <CardTitle className="flex items-center justify-between text-lg">
                  <div className="flex items-center gap-2">
                    <Lightbulb className="w-5 h-5 text-blue-600" />
                    Guidelines
                  </div>
                  {showGuidelines ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                </CardTitle>
              </CardHeader>
              {showGuidelines && (
                <CardContent>
                  <div className="prose prose-sm max-w-none bg-blue-50 p-4 rounded-lg whitespace-pre-wrap">
                    {task.taskData.guidelines}
                  </div>
                </CardContent>
              )}
            </Card>
          )}

          {/* Test Content */}
          {task.taskData?.inputs && task.taskData.inputs.length > 0 && (
            <Card className="border-l-4 border-l-amber-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <FileText className="w-5 h-5 text-amber-600" />
                  Test Content & Materials
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {task.taskData.inputs.map((content: any, idx: number) => (
                    <div key={idx} className="bg-amber-50 p-4 rounded-lg border border-amber-200">
                      <div className="text-sm font-semibold text-amber-800 mb-2">
                        Item {idx + 1}
                      </div>
                      <div className="text-sm whitespace-pre-wrap">{content}</div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Expected Output Reference */}
          {task.taskData?.expectedOutput && (
            <Card className="border-l-4 border-l-green-500">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  Reference / Answer Key
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-green-50 p-4 rounded-lg text-sm whitespace-pre-wrap">
                  {task.taskData.expectedOutput}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Response Area */}
          <Card className="border-l-4 border-l-indigo-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <MessageSquare className="w-5 h-5 text-indigo-600" />
                Your Response & Analysis
              </CardTitle>
              <CardDescription>
                Provide your detailed answers, analysis, or responses to the test content above
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={textResponses['training_response'] || ''}
                onChange={(e) => handleTextResponse('training_response', e.target.value)}
                placeholder="Provide your answers, analysis, or responses to the test content above. Follow the task instructions and guidelines provided.

Structure your response:
1. Address each test item systematically
2. Provide reasoning for your answers
3. Note any observations or concerns
4. Suggest improvements where applicable"
                rows={10}
                className="w-full text-base leading-relaxed resize-y min-h-[200px]"
              />
              <div className="flex items-center justify-between text-sm text-gray-500">
                <span>{(textResponses['training_response'] || '').length} characters</span>
                <span>{(textResponses['training_response'] || '').split(/\s+/).filter(Boolean).length} words</span>
              </div>
            </CardContent>
          </Card>

          {/* Quality Assessment */}
          <Card className="border-l-4 border-l-orange-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <Star className="w-5 h-5 text-orange-600" />
                Quality Assessment (Optional)
              </CardTitle>
            </CardHeader>
            <CardContent>
              <Textarea
                value={textResponses['quality_assessment'] || ''}
                onChange={(e) => handleTextResponse('quality_assessment', e.target.value)}
                placeholder="Provide overall quality notes:
• Grammar and accuracy
• Areas for improvement
• Recommendations"
                rows={4}
                className="w-full"
              />
            </CardContent>
          </Card>
        </div>
      );
    }

    // Data Annotation Tasks - Image Classification
    if (type.includes('data_annotation') || type.includes('annotation') || type.includes('classification')) {
      const FOOD_IMAGES = [
        { url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500&h=400&fit=crop', description: 'Margherita Pizza' },
        { url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500&h=400&fit=crop', description: 'Grilled Salmon' },
        { url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500&h=400&fit=crop', description: 'Chocolate Cake' },
        { url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=500&h=400&fit=crop', description: 'Caesar Salad' },
        { url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=500&h=400&fit=crop', description: 'Beef Burger' },
      ];
      const FOOD_CATEGORIES = ['pizza', 'burger', 'salad', 'pasta', 'seafood', 'dessert', 'soup', 'sandwich', 'meat', 'vegetarian', 'other'];
      const currentImage = FOOD_IMAGES[currentImageIndex];

      const saveAnnotation = () => {
        if (!selectedCategory) {
          toast.error('Please select a category');
          return;
        }

        const annotation = {
          imageIndex: currentImageIndex,
          imageUrl: currentImage.url,
          category: selectedCategory,
          confidence,
          timestamp: new Date().toISOString()
        };

        setAnnotations(prev => {
          const filtered = prev.filter(a => a.imageIndex !== currentImageIndex);
          return [...filtered, annotation];
        });

        toast.success(`Saved annotation for Image ${currentImageIndex + 1}`);

        if (currentImageIndex < FOOD_IMAGES.length - 1) {
          setCurrentImageIndex(prev => prev + 1);
          setSelectedCategory('');
          setConfidence(95);
        }
      };

      return (
        <div className="space-y-6">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="flex items-center gap-2">
                  <Image className="w-5 h-5 text-blue-600" />
                  Food Classification
                </CardTitle>
                <Badge variant="secondary">
                  {currentImageIndex + 1} / {FOOD_IMAGES.length}
                </Badge>
              </div>
              <Progress 
                value={(annotations.length / FOOD_IMAGES.length) * 100} 
                className="h-2"
              />
            </CardHeader>
            <CardContent className="space-y-6">
              {/* Image Display */}
              <div className="text-center">
                <img
                  src={currentImage.url}
                  alt={currentImage.description}
                  className="max-w-full h-72 object-cover rounded-lg mx-auto shadow-lg"
                  onError={(e) => {
                    const target = e.target as HTMLImageElement;
                    target.src = 'https://via.placeholder.com/500x400/f0f0f0/666666?text=Image+' + (currentImageIndex + 1);
                  }}
                />
                <p className="mt-2 text-sm text-gray-600">{currentImage.description}</p>
              </div>

              {/* Category Selection */}
              <div>
                <label className="block text-sm font-medium mb-3">Select Category:</label>
                <div className="grid grid-cols-4 gap-2">
                  {FOOD_CATEGORIES.map(cat => (
                    <button
                      key={cat}
                      onClick={() => setSelectedCategory(cat)}
                      className={`p-3 rounded-lg border-2 text-sm font-medium transition-all ${
                        selectedCategory === cat
                          ? 'bg-blue-500 text-white border-blue-500'
                          : 'bg-white text-gray-700 border-gray-200 hover:border-blue-300'
                      }`}
                    >
                      {cat.charAt(0).toUpperCase() + cat.slice(1)}
                    </button>
                  ))}
                </div>
              </div>

              {/* Confidence Slider */}
              <div>
                <label className="block text-sm font-medium mb-2">
                  Confidence: <span className="text-blue-600">{confidence}%</span>
                </label>
                <input
                  type="range"
                  min="50"
                  max="100"
                  value={confidence}
                  onChange={(e) => setConfidence(parseInt(e.target.value))}
                  className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                />
              </div>

              {/* Navigation */}
              <div className="flex items-center justify-between">
                <div className="flex gap-2">
                  <Button
                    variant="outline"
                    onClick={() => setCurrentImageIndex(Math.max(0, currentImageIndex - 1))}
                    disabled={currentImageIndex === 0}
                  >
                    Previous
                  </Button>
                  <Button
                    variant="outline"
                    onClick={() => setCurrentImageIndex(Math.min(FOOD_IMAGES.length - 1, currentImageIndex + 1))}
                    disabled={currentImageIndex === FOOD_IMAGES.length - 1}
                  >
                    Next
                  </Button>
                </div>
                <Button onClick={saveAnnotation} disabled={!selectedCategory}>
                  <CheckCircle className="w-4 h-4 mr-2" />
                  Save & Continue
                </Button>
              </div>

              {/* Annotations Summary */}
              {annotations.length > 0 && (
                <div className="bg-gray-50 p-4 rounded-lg">
                  <h4 className="text-sm font-medium mb-2">Completed Annotations ({annotations.length}/{FOOD_IMAGES.length})</h4>
                  <div className="grid grid-cols-5 gap-2">
                    {FOOD_IMAGES.map((_, idx) => {
                      const annotation = annotations.find(a => a.imageIndex === idx);
                      return (
                        <div
                          key={idx}
                          className={`p-2 text-xs text-center rounded ${
                            annotation ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-500'
                          }`}
                        >
                          {annotation ? annotation.category : `Image ${idx + 1}`}
                        </div>
                      );
                    })}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Generic Task Interface
    return (
      <div className="space-y-6">
        {/* Instructions */}
        <Card className="border-l-4 border-l-blue-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              {getTaskIcon()}
              Task Work Area
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="bg-gray-50 p-4 rounded-lg whitespace-pre-wrap text-sm">
              {task.instructions || task.description || 'Complete this task according to the provided guidelines.'}
            </div>
          </CardContent>
        </Card>

        {/* Requirements */}
        {task.requirements && task.requirements.length > 0 && (
          <Card className="border-l-4 border-l-amber-500">
            <CardHeader className="pb-3">
              <CardTitle className="flex items-center gap-2 text-lg">
                <AlertTriangle className="w-5 h-5 text-amber-600" />
                Requirements
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="space-y-2">
                {task.requirements.map((req: string, idx: number) => (
                  <li key={idx} className="flex items-start gap-2 text-sm">
                    <CheckCircle className="w-4 h-4 text-amber-500 mt-0.5 flex-shrink-0" />
                    <span>{req}</span>
                  </li>
                ))}
              </ul>
            </CardContent>
          </Card>
        )}

        {/* Response Area */}
        <Card className="border-l-4 border-l-green-500">
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <MessageSquare className="w-5 h-5 text-green-600" />
              Task Response
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <Textarea
              value={textResponses['main_response'] || ''}
              onChange={(e) => handleTextResponse('main_response', e.target.value)}
              placeholder="Provide your work, analysis, or response for this task..."
              rows={10}
              className="w-full text-base"
            />
            <div className="text-sm text-gray-500">
              {(textResponses['main_response'] || '').length} characters
            </div>
          </CardContent>
        </Card>

        {/* File Upload */}
        <Card>
          <CardHeader className="pb-3">
            <CardTitle className="flex items-center gap-2 text-lg">
              <Upload className="w-5 h-5" />
              Upload Files (if required)
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Input
              type="file"
              multiple
              onChange={handleFileUpload}
              className="w-full"
            />
            {files.length > 0 && (
              <div className="mt-3 space-y-2">
                {files.map((file, idx) => (
                  <div key={idx} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm">{file.name}</span>
                    <Button variant="ghost" size="sm" onClick={() => removeFile(idx)}>
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className={`min-h-screen bg-gray-50 ${isFullscreen ? 'fixed inset-0 z-50 overflow-y-auto' : ''}`}>
      {/* Header */}
      <div className="bg-white border-b shadow-sm sticky top-0 z-40">
        <div className="max-w-7xl mx-auto px-4 py-3">
          <div className="flex items-center justify-between">
            {/* Left Section */}
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} size="sm">
                <ArrowLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
              <div className="border-l pl-4">
                <h1 className="text-lg font-semibold text-gray-900 line-clamp-1">
                  {task?.title || 'Task'}
                </h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getCategoryColor()}>
                    {task?.category?.replace('_', ' ') || 'General'}
                  </Badge>
                  {task?.priority && (
                    <Badge className={getPriorityColor(task.priority)}>
                      {task.priority}
                    </Badge>
                  )}
                  <span className="text-xs text-gray-500">
                    ${task?.hourlyRate || 0}/hr • {task?.estimatedHours || 1}h estimated
                  </span>
                </div>
              </div>
            </div>

            {/* Right Section - Timer & Actions */}
            <div className="flex items-center gap-4">
              {/* Timer */}
              <div className="flex items-center gap-3 bg-gray-100 rounded-lg px-4 py-2">
                <Button
                  variant={isTimerRunning ? "destructive" : "default"}
                  size="sm"
                  onClick={() => setIsTimerRunning(!isTimerRunning)}
                >
                  {isTimerRunning ? (
                    <><Pause className="w-4 h-4 mr-1" /> Pause</>
                  ) : (
                    <><Play className="w-4 h-4 mr-1" /> Start</>
                  )}
                </Button>
                <div className="text-center">
                  <div className="text-lg font-mono font-semibold">
                    {formatTime(elapsedSeconds)}
                  </div>
                  <div className="text-xs text-gray-500">Time Spent</div>
                </div>
              </div>

              {/* Progress */}
              <div className="text-center px-4 border-l">
                <div className="text-lg font-semibold text-blue-600">
                  {submission.progress}%
                </div>
                <div className="text-xs text-gray-500">Progress</div>
              </div>

              {/* Save Button */}
              <Button
                variant="outline"
                onClick={handleManualSave}
                disabled={saving}
                className="gap-2"
              >
                {saving ? (
                  <RefreshCw className="w-4 h-4 animate-spin" />
                ) : (
                  <Save className="w-4 h-4" />
                )}
                Save
              </Button>

              {/* Fullscreen Toggle */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsFullscreen(!isFullscreen)}
              >
                {isFullscreen ? <Minimize2 className="w-4 h-4" /> : <Maximize2 className="w-4 h-4" />}
              </Button>
            </div>
          </div>

          {/* Autosave indicator */}
          {lastSaved && (
            <div className="text-xs text-gray-400 text-right mt-1">
              Last saved: {lastSaved.toLocaleTimeString()}
            </div>
          )}
        </div>
      </div>

      {/* Main Content */}
      <div className={`max-w-7xl mx-auto px-4 py-6 ${isFullscreen ? 'pb-20' : ''}`}>
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Work Area */}
          <div className="lg:col-span-2">
            {renderWorkArea()}
          </div>

          {/* Sidebar */}
          <div className={`space-y-6 ${isFullscreen ? 'lg:sticky lg:top-24 lg:self-start lg:max-h-[calc(100vh-120px)] lg:overflow-y-auto' : ''}`}>
            {/* Progress Card */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Target className="w-5 h-5" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span className="font-medium">{submission.progress}%</span>
                  </div>
                  <Progress value={submission.progress} className="h-3" />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Update Progress:</label>
                  <div className="grid grid-cols-4 gap-2">
                    {[25, 50, 75, 100].map(value => (
                      <Button
                        key={value}
                        variant={submission.progress >= value ? "default" : "outline"}
                        size="sm"
                        onClick={() => handleProgressUpdate(value)}
                      >
                        {value}%
                      </Button>
                    ))}
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Quality Checklist */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <CheckSquare className="w-5 h-5" />
                  Quality Checklist
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  {checklist.map(item => (
                    <div
                      key={item.id}
                      className={`flex items-center gap-3 p-2 rounded cursor-pointer transition-colors ${
                        item.completed ? 'bg-green-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => toggleChecklist(item.id)}
                    >
                      {item.completed ? (
                        <CheckSquare className="w-5 h-5 text-green-600" />
                      ) : (
                        <Square className="w-5 h-5 text-gray-400" />
                      )}
                      <span className={`text-sm flex-1 ${item.completed ? 'text-green-700' : ''}`}>
                        {item.text}
                        {item.required && <span className="text-red-500 ml-1">*</span>}
                      </span>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Notes */}
            <Card>
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg">
                  <MessageSquare className="w-5 h-5" />
                  Notes & Comments
                </CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={submission.notes}
                  onChange={(e) => setSubmission(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes, questions, or comments..."
                  rows={4}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Earnings Preview */}
            <Card className="bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
              <CardHeader className="pb-3">
                <CardTitle className="flex items-center gap-2 text-lg text-green-800">
                  <Award className="w-5 h-5" />
                  Estimated Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="text-3xl font-bold text-green-700">
                  ${((task?.hourlyRate || 0) * (task?.estimatedHours || 1)).toFixed(2)}
                </div>
                <p className="text-sm text-green-600 mt-1">
                  Upon successful completion
                </p>
              </CardContent>
            </Card>

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button
                  onClick={handleSubmit}
                  className="w-full h-12 text-lg"
                  disabled={submission.progress < 100 || submitting}
                >
                  {submitting ? (
                    <>
                      <RefreshCw className="w-5 h-5 mr-2 animate-spin" />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <Send className="w-5 h-5 mr-2" />
                      Submit Task
                    </>
                  )}
                </Button>
                {submission.progress < 100 && (
                  <p className="text-xs text-center text-gray-500 mt-2">
                    Complete the task (100%) to submit
                  </p>
                )}
                {submission.progress >= 100 && (
                  <p className="text-xs text-center text-green-600 mt-2 flex items-center justify-center gap-1">
                    <CheckCircle className="w-4 h-4" />
                    Ready to submit!
                  </p>
                )}
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}
