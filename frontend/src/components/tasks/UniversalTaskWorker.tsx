import { useState, useEffect } from 'react';
import { ArrowLeft, Upload, Send, CheckCircle, Clock, AlertCircle, FileText, Image, Code, Globe, Brain } from 'lucide-react';
import { Button } from '../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Progress } from '../ui/progress';
import { toast } from 'sonner';
import { submitTask, updateTaskProgress } from '../../utils/api';
import { useAuth } from '../../utils/auth';

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
}

export function UniversalTaskWorker({ task, onComplete, onBack }: UniversalTaskWorkerProps) {
  const { accessToken } = useAuth();
  const [submission, setSubmission] = useState<TaskSubmission>({
    progress: 0,
    timeSpent: 0,
    deliverables: [],
    notes: '',
  });
  
  const [currentStep, setCurrentStep] = useState(0);
  const [startTime, setStartTime] = useState<Date>(new Date());
  const [files, setFiles] = useState<File[]>([]);
  const [textResponses, setTextResponses] = useState<{[key: string]: string}>({});
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    setStartTime(new Date());
  }, []);

  const getTaskIcon = () => {
    const type = task?.type?.toLowerCase() || task?.category?.toLowerCase() || '';
    
    if (type.includes('image') || type.includes('vision')) return <Image className="w-6 h-6" />;
    if (type.includes('code') || type.includes('programming')) return <Code className="w-6 h-6" />;
    if (type.includes('multilingual') || type.includes('translation')) return <Globe className="w-6 h-6" />;
    if (type.includes('ai') || type.includes('training')) return <Brain className="w-6 h-6" />;
    return <FileText className="w-6 h-6" />;
  };

  const getCategoryColor = () => {
    const category = task?.category?.toLowerCase() || '';
    
    switch (category) {
      case 'ai_training': return 'bg-purple-100 text-purple-800';
      case 'data_annotation': return 'bg-blue-100 text-blue-800';
      case 'model_evaluation': return 'bg-green-100 text-green-800';
      case 'content_moderation': return 'bg-red-100 text-red-800';
      case 'transcription': return 'bg-yellow-100 text-yellow-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleFileUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const uploadedFiles = Array.from(event.target.files || []);
    setFiles(prev => [...prev, ...uploadedFiles]);
    
    // Add files to deliverables
    setSubmission(prev => ({
      ...prev,
      deliverables: [...prev.deliverables, ...uploadedFiles.map(file => ({
        type: 'file',
        name: file.name,
        size: file.size,
        content: file
      }))]
    }));
  };

  const handleTextResponse = (key: string, value: string) => {
    setTextResponses(prev => ({ ...prev, [key]: value }));
    
    // Update deliverables with text responses
    setSubmission(prev => ({
      ...prev,
      deliverables: [
        ...prev.deliverables.filter(d => d.key !== key),
        { type: 'text', key, value, timestamp: new Date().toISOString() }
      ]
    }));
  };

  const updateProgress = (newProgress: number) => {
    setSubmission(prev => ({ ...prev, progress: newProgress }));
  };

  const calculateTimeSpent = () => {
    return Math.round((new Date().getTime() - startTime.getTime()) / 1000 / 60); // minutes
  };

  const handleSubmit = async () => {
    if (!accessToken) {
      toast.error('Authentication required. Please log in again.');
      return;
    }

    setSubmitting(true);
    const timeSpent = calculateTimeSpent();
    
    const finalSubmission = {
      ...submission,
      timeSpent,
      completedAt: new Date().toISOString(),
      taskId: task._id || task.id,
      taskTitle: task.title
    };

    try {
      console.log('📝 Submitting task with data:', finalSubmission);
      
      const response = await submitTask(
        task._id || task.id, 
        finalSubmission, 
        accessToken
      );
      
      if (response.success) {
        toast.success('Task submitted successfully!');
        onComplete(task._id || task.id, finalSubmission);
      } else {
        throw new Error(response.message || 'Submission failed');
      }
    } catch (error: any) {
      console.error('❌ Task submission error:', error);
      toast.error(error.message || 'Failed to submit task. Please try again.');
    } finally {
      setSubmitting(false);
    }
  };

  const handleProgressUpdate = async (newProgress: number) => {
    if (!accessToken || newProgress === submission.progress) return;
    
    try {
      await updateTaskProgress(
        task._id || task.id,
        { 
          progress: newProgress,
          timeSpent: calculateTimeSpent(),
          notes: submission.notes
        },
        accessToken
      );
      
      updateProgress(newProgress);
      toast.success(`Progress updated to ${newProgress}%`);
    } catch (error: any) {
      console.error('❌ Progress update error:', error);
      toast.error('Failed to update progress');
      // Still update locally even if API fails
      updateProgress(newProgress);
    }
  };

  const renderTaskContent = () => {
    const type = task?.type?.toLowerCase() || task?.category?.toLowerCase() || '';

    // AI Training Tasks
    if (type.includes('ai_training') || type.includes('multilingual')) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Brain className="w-5 h-5" />
                AI Training Instructions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{task.instructions}</p>
              
              {task.taskData?.guidelines && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-2">Guidelines</h4>
                  <p className="text-sm text-blue-800">{task.taskData.guidelines}</p>
                </div>
              )}

              {/* Test Content from Admin */}
              {task.taskData?.inputs && task.taskData.inputs.length > 0 && (
                <div className="bg-blue-50 p-4 rounded-lg">
                  <h4 className="font-medium text-blue-900 mb-3">Test Content & Materials</h4>
                  <div className="space-y-4">
                    {task.taskData.inputs.map((content: any, idx: number) => (
                      <div key={idx} className="bg-white p-4 rounded border">
                        <div className="text-sm font-medium text-gray-700 mb-2">Item {idx + 1}</div>
                        <div className="text-sm whitespace-pre-wrap">{content}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Expected Output / Answer Key */}
              {task.taskData?.expectedOutput && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Reference / Answer Key</h4>
                  <div className="text-sm text-green-800 whitespace-pre-wrap">
                    {task.taskData.expectedOutput}
                  </div>
                </div>
              )}

              {task.taskData?.examples && task.taskData.examples.length > 0 && (
                <div className="bg-green-50 p-4 rounded-lg">
                  <h4 className="font-medium text-green-900 mb-2">Additional Examples</h4>
                  <div className="text-sm text-green-800">
                    {task.taskData.examples.map((example: any, idx: number) => (
                      <div key={idx} className="mb-2 p-2 bg-white rounded border">
                        <pre className="whitespace-pre-wrap">{JSON.stringify(example, null, 2)}</pre>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Your Response & Analysis:</label>
                  <Textarea
                    value={textResponses['training_response'] || ''}
                    onChange={(e) => handleTextResponse('training_response', e.target.value)}
                    placeholder="Provide your answers, analysis, or responses to the test content above. Follow the task instructions and guidelines provided."
                    rows={8}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Overall Quality Assessment:</label>
                  <Textarea
                    value={textResponses['quality_assessment'] || ''}
                    onChange={(e) => handleTextResponse('quality_assessment', e.target.value)}
                    placeholder="Provide an overall assessment of the AI's Spanish conversation abilities:
- Grammar and vocabulary accuracy
- Cultural appropriateness 
- Tone matching (formal vs casual)
- Areas for improvement
- Recommendations for better training"
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Data Annotation Tasks
    if (type.includes('data_annotation') || type.includes('annotation')) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Image className="w-5 h-5" />
                Data Annotation Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{task.instructions}</p>
              
              {task.imageUrl && (
                <div className="border rounded-lg p-4">
                  <img 
                    src={task.imageUrl} 
                    alt="Annotation target"
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}

              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Annotation Results:</label>
                  <Textarea
                    value={textResponses['annotations'] || ''}
                    onChange={(e) => handleTextResponse('annotations', e.target.value)}
                    placeholder="Provide your annotations, labels, or classifications..."
                    rows={4}
                    className="w-full"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Upload Annotation Files:</label>
                  <Input
                    type="file"
                    multiple
                    accept=".json,.csv,.txt,.xml"
                    onChange={handleFileUpload}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Code Review Tasks
    if (type.includes('code') || type.includes('programming')) {
      return (
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Code className="w-5 h-5" />
                Code Review Task
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-sm text-gray-600">{task.instructions}</p>
              
              <div className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-2">Code Review Analysis:</label>
                  <Textarea
                    value={textResponses['code_review'] || ''}
                    onChange={(e) => handleTextResponse('code_review', e.target.value)}
                    placeholder="Provide your code review, bug analysis, or quality assessment..."
                    rows={6}
                    className="w-full font-mono"
                  />
                </div>

                <div>
                  <label className="block text-sm font-medium mb-2">Suggested Improvements:</label>
                  <Textarea
                    value={textResponses['improvements'] || ''}
                    onChange={(e) => handleTextResponse('improvements', e.target.value)}
                    placeholder="List specific improvements or fixes..."
                    rows={4}
                    className="w-full"
                  />
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      );
    }

    // Default Generic Task Interface
    return (
      <div className="space-y-6">
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              {getTaskIcon()}
              Task Work Area
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-gray-600">{task.instructions || task.description}</p>
            
            {task.requirements && task.requirements.length > 0 && (
              <div className="bg-yellow-50 p-4 rounded-lg">
                <h4 className="font-medium text-yellow-900 mb-2">Requirements</h4>
                <ul className="text-sm text-yellow-800 space-y-1">
                  {task.requirements.map((req: string, idx: number) => (
                    <li key={idx} className="flex items-start gap-2">
                      <span>•</span>
                      <span>{req}</span>
                    </li>
                  ))}
                </ul>
              </div>
            )}

            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Task Response:</label>
                <Textarea
                  value={textResponses['main_response'] || ''}
                  onChange={(e) => handleTextResponse('main_response', e.target.value)}
                  placeholder="Provide your work, analysis, or response for this task..."
                  rows={6}
                  className="w-full"
                />
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Upload Files (if required):</label>
                <Input
                  type="file"
                  multiple
                  onChange={handleFileUpload}
                  className="w-full"
                />
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="bg-white border-b">
        <div className="max-w-6xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center gap-2">
                <ArrowLeft className="w-4 h-4" />
                Back
              </Button>
              <div>
                <h1 className="text-xl font-semibold">{task?.title || 'Task'}</h1>
                <div className="flex items-center gap-2 mt-1">
                  <Badge className={getCategoryColor()}>
                    {task?.category?.replace('_', ' ') || 'General'}
                  </Badge>
                  <span className="text-sm text-gray-500">
                    ${task?.hourlyRate || 0}/hr • {task?.estimatedHours || 1}h estimated
                  </span>
                </div>
              </div>
            </div>
            
            <div className="flex items-center gap-4">
              <div className="text-right text-sm">
                <div className="text-gray-500">Time Spent</div>
                <div className="font-medium">{calculateTimeSpent()}m</div>
              </div>
              <div className="text-right text-sm">
                <div className="text-gray-500">Progress</div>
                <div className="font-medium">{submission.progress}%</div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-6xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Work Area */}
          <div className="lg:col-span-2">
            {renderTaskContent()}
          </div>

          {/* Progress & Controls */}
          <div className="space-y-6">
            {/* Progress Card */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Clock className="w-5 h-5" />
                  Progress
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between text-sm mb-2">
                    <span>Completion</span>
                    <span>{submission.progress}%</span>
                  </div>
                  <Progress value={submission.progress} className="w-full" />
                </div>

                <div className="space-y-2">
                  <label className="block text-sm font-medium">Update Progress:</label>
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

            {/* Notes Card */}
            <Card>
              <CardHeader>
                <CardTitle>Notes & Comments</CardTitle>
              </CardHeader>
              <CardContent>
                <Textarea
                  value={submission.notes}
                  onChange={(e) => setSubmission(prev => ({ ...prev, notes: e.target.value }))}
                  placeholder="Add any notes, questions, or comments about this task..."
                  rows={4}
                  className="w-full"
                />
              </CardContent>
            </Card>

            {/* Deliverables Summary */}
            {(submission.deliverables.length > 0 || files.length > 0) && (
              <Card>
                <CardHeader>
                  <CardTitle>Deliverables</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {submission.deliverables.map((item, idx) => (
                      <div key={idx} className="flex items-center gap-2 text-sm p-2 bg-gray-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500" />
                        <span className="flex-1">
                          {item.type === 'file' ? item.name : `${item.key}: ${item.value?.substring(0, 30)}...`}
                        </span>
                      </div>
                    ))}
                    {files.map((file, idx) => (
                      <div key={`file-${idx}`} className="flex items-center gap-2 text-sm p-2 bg-blue-50 rounded">
                        <Upload className="w-4 h-4 text-blue-500" />
                        <span className="flex-1">{file.name}</span>
                        <span className="text-gray-500">{(file.size / 1024).toFixed(1)} KB</span>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Submit Button */}
            <Card>
              <CardContent className="pt-6">
                <Button 
                  onClick={handleSubmit}
                  className="w-full flex items-center gap-2"
                  disabled={submission.progress < 100 || submitting}
                >
                  <Send className="w-4 h-4" />
                  {submitting ? 'Submitting...' : 'Submit Task'}
                </Button>
                {submission.progress < 100 && (
                  <p className="text-xs text-gray-500 mt-2 text-center">
                    Complete the task (100%) to submit
                  </p>
                )}
                {submission.progress >= 100 && (
                  <p className="text-xs text-green-600 mt-2 text-center">
                    Ready to submit! Estimated earnings: ${((task.hourlyRate || 0) * (task.estimatedHours || 0)).toFixed(2)}
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