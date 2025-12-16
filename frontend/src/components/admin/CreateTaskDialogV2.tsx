'use client';

import { useState, useCallback, useMemo } from 'react';
import { 
  X, Calendar, DollarSign, Clock, User, Plus, Trash2, 
  FileText, Brain, Code, Image, Globe, Shield, Mic,
  ChevronRight, ChevronLeft, CheckCircle, AlertCircle,
  Copy, Eye, Settings, Target, Star, Zap, Info,
  BookOpen, Lightbulb, ListChecks, Upload
} from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Input } from '../ui/input';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { getAccessToken } from '@/utils/api';

// Get API base URL from environment or fallback
const getApiUrl = () => {
  return process.env.NEXT_PUBLIC_API_URL || 'https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api';
};

interface CreateTaskDialogProps {
  open: boolean;
  onClose: () => void;
  onTaskCreated: (task: any) => void;
  users: Array<{
    _id?: string;
    id?: string;
    name: string;
    email: string;
    skills?: string[];
    completedTasks?: number;
    rating?: number;
  }>;
}

interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: React.ReactNode;
  category: string;
  defaultValues: Partial<TaskFormData>;
  color: string;
}

interface TaskFormData {
  title: string;
  description: string;
  type: string;
  category: string;
  instructions: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  estimatedTime: number;
  deadline: string;
  hourlyRate: number;
  priority: 'low' | 'medium' | 'high' | 'critical';
  assignedTo: string[];  // Array for multiple assignees
  taskData: {
    category: string;
    difficultyLevel: string;
    requiredSkills: string[];
    domainExpertise: string;
    guidelines: string;
    qualityMetrics: string[];
    examples: string[];
    inputs: string[];
    expectedOutput: string;
    isQualityControl: boolean;
    rubric?: {
      criteria: string;
      weight: number;
    }[];
  };
  qualityStandards: string[];
  attachments: string[];
}

const TASK_TEMPLATES: TaskTemplate[] = [
  {
    id: 'research',
    name: 'Research & Analysis',
    description: 'Competitive analysis, market research, data compilation',
    icon: <FileText className="w-8 h-8" />,
    category: 'AI_TRAINING',
    color: 'from-blue-500 to-blue-600',
    defaultValues: {
      type: 'research-analysis',
      category: 'AI_TRAINING',
      instructions: `RESEARCH METHODOLOGY:
1. Conduct comprehensive desk research using approved source types
2. Create a detailed competitor matrix comparing all identified platforms
3. Document findings with proper citations and source references
4. Focus on both quantitative data (pricing, user numbers) and qualitative insights

DELIVERABLE REQUIREMENTS:
- Written report (15-20 pages) with executive summary
- Competitive analysis matrix (Excel/Google Sheets format)
- Key findings and strategic recommendations
- Implementation roadmap for competitive advantages

QUALITY STANDARDS:
- All sources must be credible and recent (within 2 years)
- Include direct quotes and data points with proper attribution
- Provide actionable insights, not just data compilation
- Use professional formatting with clear sections and headings

SUBMISSION FORMAT:
- Main report as PDF document
- Supporting data in spreadsheet format
- Source list with all references used
- Executive summary (2-3 pages maximum)`,
      taskData: {
        category: 'AI_TRAINING',
        difficultyLevel: 'intermediate',
        requiredSkills: ['Research', 'Analysis', 'Report Writing'],
        guidelines: 'Research phase: First 60% of allocated time. Analysis and writing: Remaining 40%.',
        qualityMetrics: ['Accuracy > 95%', 'Source verification', 'Actionable insights'],
        domainExpertise: 'Market Research',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 4,
      estimatedTime: 240,
      hourlyRate: 20,
    }
  },
  {
    id: 'ai-training',
    name: 'AI/ML Training',
    description: 'Multilingual training, model evaluation, prompt engineering',
    icon: <Brain className="w-8 h-8" />,
    category: 'AI_TRAINING',
    color: 'from-purple-500 to-purple-600',
    defaultValues: {
      type: 'multilingual-training',
      category: 'AI_TRAINING',
      instructions: `AI TRAINING TASK INSTRUCTIONS:

OBJECTIVE:
Evaluate and improve AI model responses for quality, accuracy, and cultural appropriateness.

METHODOLOGY:
1. Review each AI-generated response carefully
2. Assess for factual accuracy, tone, and cultural sensitivity
3. Provide improved responses where needed
4. Document reasoning for all changes

QUALITY CRITERIA:
- Response accuracy and relevance
- Cultural and linguistic appropriateness
- Tone matching (formal/informal as required)
- Grammar and spelling accuracy`,
      taskData: {
        category: 'AI_TRAINING',
        difficultyLevel: 'intermediate',
        requiredSkills: ['Natural Language Processing', 'Multilingual Communication'],
        guidelines: 'Focus on quality over speed. Each response should be thoroughly evaluated.',
        qualityMetrics: ['Response accuracy > 95%', 'Cultural appropriateness', 'Tone consistency'],
        domainExpertise: 'Linguistics, AI/ML',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 2,
      estimatedTime: 120,
      hourlyRate: 18,
    }
  },
  {
    id: 'data-annotation',
    name: 'Data Annotation',
    description: 'Image classification, text labeling, bounding boxes',
    icon: <Image className="w-8 h-8" />,
    category: 'DATA_ANNOTATION',
    color: 'from-green-500 to-green-600',
    defaultValues: {
      type: 'data-annotation',
      category: 'DATA_ANNOTATION',
      instructions: `DATA ANNOTATION GUIDELINES:

TASK OVERVIEW:
Classify and annotate the provided dataset according to the specified categories.

INSTRUCTIONS:
1. Review each item in the dataset
2. Apply appropriate labels/classifications
3. Ensure consistency across all annotations
4. Flag any ambiguous or unclear items

QUALITY REQUIREMENTS:
- Minimum 95% accuracy required
- Follow the provided labeling schema exactly
- Document any edge cases encountered`,
      taskData: {
        category: 'DATA_ANNOTATION',
        difficultyLevel: 'beginner',
        requiredSkills: ['Attention to Detail', 'Pattern Recognition'],
        guidelines: 'Maintain consistency. When in doubt, flag for review.',
        qualityMetrics: ['Accuracy > 95%', 'Consistency', 'Completeness'],
        domainExpertise: 'Data Labeling',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 1,
      estimatedTime: 60,
      hourlyRate: 15,
    }
  },
  {
    id: 'code-review',
    name: 'Code Review',
    description: 'Bug detection, code quality assessment, security review',
    icon: <Code className="w-8 h-8" />,
    category: 'MODEL_EVALUATION',
    color: 'from-orange-500 to-orange-600',
    defaultValues: {
      type: 'code-review',
      category: 'MODEL_EVALUATION',
      instructions: `CODE REVIEW TASK:

OBJECTIVE:
Review the provided code for quality, security, and best practices.

REVIEW CRITERIA:
1. Code correctness and logic
2. Security vulnerabilities
3. Performance considerations
4. Code style and readability
5. Documentation and comments

DELIVERABLES:
- Detailed review with line-by-line feedback
- List of issues categorized by severity
- Suggested improvements with code examples`,
      taskData: {
        category: 'MODEL_EVALUATION',
        difficultyLevel: 'advanced',
        requiredSkills: ['Programming', 'Code Analysis', 'Security'],
        guidelines: 'Focus on critical issues first. Provide constructive feedback.',
        qualityMetrics: ['Issue identification rate', 'False positive rate < 5%'],
        domainExpertise: 'Software Development',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 2,
      estimatedTime: 120,
      hourlyRate: 25,
    }
  },
  {
    id: 'content-moderation',
    name: 'Content Moderation',
    description: 'Content review, policy compliance, safety assessment',
    icon: <Shield className="w-8 h-8" />,
    category: 'CONTENT_MODERATION',
    color: 'from-red-500 to-red-600',
    defaultValues: {
      type: 'content-moderation',
      category: 'CONTENT_MODERATION',
      instructions: `CONTENT MODERATION GUIDELINES:

Review all content for policy compliance and safety.

CATEGORIES TO REVIEW:
- Harmful or dangerous content
- Hate speech or discrimination
- Misinformation
- Spam or promotional content
- Privacy violations

ACTION REQUIRED:
1. Review each piece of content
2. Classify according to policy guidelines
3. Recommend appropriate action (approve, flag, remove)
4. Document reasoning for borderline cases`,
      taskData: {
        category: 'CONTENT_MODERATION',
        difficultyLevel: 'intermediate',
        requiredSkills: ['Content Review', 'Policy Analysis'],
        guidelines: 'When in doubt, escalate for review. Document all edge cases.',
        qualityMetrics: ['Accuracy > 98%', 'Consistency', 'Response time < 30s per item'],
        domainExpertise: 'Content Policy',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 2,
      estimatedTime: 120,
      hourlyRate: 16,
    }
  },
  {
    id: 'transcription',
    name: 'Transcription',
    description: 'Audio/video transcription, translation, captioning',
    icon: <Mic className="w-8 h-8" />,
    category: 'TRANSCRIPTION',
    color: 'from-teal-500 to-teal-600',
    defaultValues: {
      type: 'transcription',
      category: 'TRANSCRIPTION',
      instructions: `TRANSCRIPTION TASK:

REQUIREMENTS:
1. Transcribe audio/video content accurately
2. Include speaker labels where applicable
3. Note any unclear sections with timestamps
4. Follow proper punctuation and formatting

QUALITY STANDARDS:
- Accuracy rate > 98%
- Proper grammar and punctuation
- Consistent formatting throughout
- Timestamps at natural breaks`,
      taskData: {
        category: 'TRANSCRIPTION',
        difficultyLevel: 'beginner',
        requiredSkills: ['Listening', 'Typing', 'Attention to Detail'],
        guidelines: 'Listen to unclear sections multiple times. Use [inaudible] for truly unclear parts.',
        qualityMetrics: ['Accuracy > 98%', 'Proper formatting', 'Timely completion'],
        domainExpertise: 'Transcription',
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false
      },
      estimatedHours: 2,
      estimatedTime: 120,
      hourlyRate: 14,
    }
  },
];

const DIFFICULTY_LEVELS = [
  { value: 'beginner', label: 'Beginner', color: 'bg-green-100 text-green-800' },
  { value: 'intermediate', label: 'Intermediate', color: 'bg-yellow-100 text-yellow-800' },
  { value: 'advanced', label: 'Advanced', color: 'bg-orange-100 text-orange-800' },
  { value: 'expert', label: 'Expert', color: 'bg-red-100 text-red-800' },
];

const PRIORITY_LEVELS = [
  { value: 'low', label: 'Low', color: 'bg-gray-100 text-gray-800' },
  { value: 'medium', label: 'Medium', color: 'bg-blue-100 text-blue-800' },
  { value: 'high', label: 'High', color: 'bg-orange-100 text-orange-800' },
  { value: 'critical', label: 'Critical', color: 'bg-red-100 text-red-800' },
];

export function CreateTaskDialogV2({ open, onClose, onTaskCreated, users }: CreateTaskDialogProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [loading, setLoading] = useState(false);
  const [previewMode, setPreviewMode] = useState(false);
  
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    type: '',
    category: 'AI_TRAINING',
    instructions: '',
    requirements: [],
    deliverables: [],
    estimatedHours: 1,
    estimatedTime: 60,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hourlyRate: 15,
    priority: 'medium',
    assignedTo: [],
    taskData: {
      category: 'AI_TRAINING',
      difficultyLevel: 'intermediate',
      requiredSkills: [],
      domainExpertise: '',
      guidelines: '',
      qualityMetrics: [],
      examples: [],
      inputs: [],
      expectedOutput: '',
      isQualityControl: false,
      rubric: []
    },
    qualityStandards: [],
    attachments: []
  });

  const [newRequirement, setNewRequirement] = useState('');
  const [newDeliverable, setNewDeliverable] = useState('');
  const [newSkill, setNewSkill] = useState('');
  const [newMetric, setNewMetric] = useState('');

  // Reset form
  const resetForm = useCallback(() => {
    setStep(1);
    setSelectedTemplate(null);
    setFormData({
      title: '',
      description: '',
      type: '',
      category: 'AI_TRAINING',
      instructions: '',
      requirements: [],
      deliverables: [],
      estimatedHours: 1,
      estimatedTime: 60,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hourlyRate: 15,
      priority: 'medium',
      assignedTo: [],
      taskData: {
        category: 'AI_TRAINING',
        difficultyLevel: 'intermediate',
        requiredSkills: [],
        domainExpertise: '',
        guidelines: '',
        qualityMetrics: [],
        examples: [],
        inputs: [],
        expectedOutput: '',
        isQualityControl: false,
        rubric: []
      },
      qualityStandards: [],
      attachments: []
    });
  }, []);

  // Handle template selection
  const handleTemplateSelect = (template: TaskTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      ...template.defaultValues,
      title: '',
      description: '',
      category: template.category,
      taskData: {
        ...prev.taskData,
        ...template.defaultValues.taskData
      }
    }));
    setStep(2);
  };

  // Update form field
  const updateField = (field: string, value: any) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  // Update taskData field
  const updateTaskData = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      taskData: { ...prev.taskData, [field]: value }
    }));
  };

  // Add to array fields
  const addToArray = (field: keyof TaskFormData, value: string, clearFn: () => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      [field]: [...(prev[field] as string[]), value.trim()]
    }));
    clearFn();
  };

  const addToTaskDataArray = (field: string, value: string, clearFn: () => void) => {
    if (!value.trim()) return;
    setFormData(prev => ({
      ...prev,
      taskData: {
        ...prev.taskData,
        [field]: [...(prev.taskData as any)[field], value.trim()]
      }
    }));
    clearFn();
  };

  // Remove from array fields
  const removeFromArray = (field: keyof TaskFormData, index: number) => {
    setFormData(prev => ({
      ...prev,
      [field]: (prev[field] as string[]).filter((_, i) => i !== index)
    }));
  };

  const removeFromTaskDataArray = (field: string, index: number) => {
    setFormData(prev => ({
      ...prev,
      taskData: {
        ...prev.taskData,
        [field]: (prev.taskData as any)[field].filter((_: any, i: number) => i !== index)
      }
    }));
  };

  // Calculate total payment
  const totalPayment = useMemo(() => {
    return (formData.estimatedHours * formData.hourlyRate).toFixed(2);
  }, [formData.estimatedHours, formData.hourlyRate]);

  // Validate step
  const validateStep = (stepNumber: number): boolean => {
    switch (stepNumber) {
      case 2:
        return formData.title.length >= 5 && formData.description.length >= 20;
      case 3:
        return formData.instructions.length >= 50;
      case 4:
        return formData.estimatedHours > 0 && formData.hourlyRate > 0;
      default:
        return true;
    }
  };

  // Handle submit
  const handleSubmit = async () => {
    setLoading(true);
    
    try {
      const token = getAccessToken();
      
      if (!token) {
        toast.error('Authentication required. Please log in again.');
        return;
      }

      const payload = {
        ...formData,
        status: formData.assignedTo.length > 0 ? 'assigned' : 'available',
        deadline: new Date(formData.deadline)
      };

      const response = await fetch(`${getApiUrl()}/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(payload)
      });

      if (response.ok) {
        const data = await response.json();
        toast.success('Task created successfully!');
        onTaskCreated(data.task);
        resetForm();
        onClose();
      } else {
        const errorText = await response.text();
        console.error('Task creation failed:', errorText);
        toast.error('Failed to create task. Please try again.');
      }
    } catch (error) {
      console.error('Error creating task:', error);
      toast.error('Network error. Please check your connection.');
    } finally {
      setLoading(false);
    }
  };

  // Duplicate last task
  const handleDuplicateTemplate = () => {
    toast.info('Create another task with similar settings');
    setStep(2);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-5xl max-h-[90vh] overflow-y-auto p-0">
        {/* Header */}
        <div className="sticky top-0 z-10 bg-white border-b px-6 py-4">
          <DialogHeader>
            <div className="flex items-center justify-between">
              <div>
                <DialogTitle className="text-xl font-semibold">
                  {step === 1 ? 'Create New Task' : selectedTemplate?.name || 'Configure Task'}
                </DialogTitle>
                <DialogDescription>
                  {step === 1 
                    ? 'Choose a template to get started'
                    : `Step ${step} of 5 - ${['', 'Template', 'Basic Info', 'Instructions', 'Compensation', 'Review'][step]}`
                  }
                </DialogDescription>
              </div>
              <div className="flex items-center gap-4">
                {step > 1 && (
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => setPreviewMode(!previewMode)}
                  >
                    <Eye className="w-4 h-4 mr-2" />
                    {previewMode ? 'Edit' : 'Preview'}
                  </Button>
                )}
                <Button variant="ghost" size="sm" onClick={onClose}>
                  <X className="w-5 h-5" />
                </Button>
              </div>
            </div>
          </DialogHeader>

          {/* Progress Bar */}
          {step > 1 && (
            <div className="flex items-center mt-4">
              {[2, 3, 4, 5].map((s) => (
                <div key={s} className="flex items-center flex-1">
                  <div
                    className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                      step >= s
                        ? 'bg-blue-600 text-white'
                        : 'bg-gray-200 text-gray-500'
                    }`}
                  >
                    {step > s ? <CheckCircle className="w-5 h-5" /> : s - 1}
                  </div>
                  {s < 5 && (
                    <div
                      className={`flex-1 h-1 mx-2 ${
                        step > s ? 'bg-blue-600' : 'bg-gray-200'
                      }`}
                    />
                  )}
                </div>
              ))}
            </div>
          )}
        </div>

        <div className="p-6">
          {/* Step 1: Template Selection */}
          {step === 1 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {TASK_TEMPLATES.map((template) => (
                  <Card
                    key={template.id}
                    className={`cursor-pointer transition-all hover:shadow-lg hover:border-blue-300 ${
                      selectedTemplate?.id === template.id ? 'border-blue-500 ring-2 ring-blue-200' : ''
                    }`}
                    onClick={() => handleTemplateSelect(template)}
                  >
                    <CardContent className="p-6">
                      <div className={`w-14 h-14 rounded-xl bg-gradient-to-br ${template.color} text-white flex items-center justify-center mb-4`}>
                        {template.icon}
                      </div>
                      <h3 className="font-semibold text-lg mb-2">{template.name}</h3>
                      <p className="text-sm text-gray-600">{template.description}</p>
                      <Badge className="mt-3" variant="secondary">
                        {template.category.replace('_', ' ')}
                      </Badge>
                    </CardContent>
                  </Card>
                ))}
              </div>

              {/* Quick Create Options */}
              <div className="border-t pt-6">
                <h3 className="text-sm font-medium text-gray-700 mb-3">Or start from scratch:</h3>
                <Button variant="outline" onClick={() => {
                  setSelectedTemplate(null);
                  setStep(2);
                }}>
                  <Plus className="w-4 h-4 mr-2" />
                  Blank Task
                </Button>
              </div>
            </div>
          )}

          {/* Step 2: Basic Information */}
          {step === 2 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-4">
                  <div>
                    <Label className="text-sm font-medium">Task Title *</Label>
                    <Input
                      value={formData.title}
                      onChange={(e) => updateField('title', e.target.value)}
                      placeholder="e.g., Competitive Analysis of AI Training Platforms"
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-1">
                      {formData.title.length}/100 characters
                    </p>
                  </div>

                  <div>
                    <Label className="text-sm font-medium">Category</Label>
                    <select
                      value={formData.category}
                      onChange={(e) => {
                        updateField('category', e.target.value);
                        updateTaskData('category', e.target.value);
                      }}
                      className="w-full mt-1 p-2 border rounded-md"
                    >
                      <option value="AI_TRAINING">🤖 AI Training</option>
                      <option value="DATA_ANNOTATION">🏷️ Data Annotation</option>
                      <option value="MODEL_EVALUATION">📊 Model Evaluation</option>
                      <option value="CONTENT_MODERATION">🛡️ Content Moderation</option>
                      <option value="TRANSCRIPTION">🎤 Transcription</option>
                    </select>
                  </div>

                  <div className="grid grid-cols-2 gap-4">
                    <div>
                      <Label className="text-sm font-medium">Priority</Label>
                      <select
                        value={formData.priority}
                        onChange={(e) => updateField('priority', e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        {PRIORITY_LEVELS.map(p => (
                          <option key={p.value} value={p.value}>{p.label}</option>
                        ))}
                      </select>
                    </div>
                    <div>
                      <Label className="text-sm font-medium">Difficulty</Label>
                      <select
                        value={formData.taskData.difficultyLevel}
                        onChange={(e) => updateTaskData('difficultyLevel', e.target.value)}
                        className="w-full mt-1 p-2 border rounded-md"
                      >
                        {DIFFICULTY_LEVELS.map(d => (
                          <option key={d.value} value={d.value}>{d.label}</option>
                        ))}
                      </select>
                    </div>
                  </div>
                </div>

                <div>
                  <Label className="text-sm font-medium">Description *</Label>
                  <Textarea
                    value={formData.description}
                    onChange={(e) => updateField('description', e.target.value)}
                    placeholder="Provide a brief overview of what this task involves and what the worker will accomplish..."
                    rows={8}
                    className="mt-1"
                  />
                  <p className="text-xs text-gray-500 mt-1">
                    {formData.description.length}/500 characters (minimum 20)
                  </p>
                </div>
              </div>

              {/* Required Skills */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Target className="w-4 h-4" />
                    Required Skills
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newSkill}
                      onChange={(e) => setNewSkill(e.target.value)}
                      placeholder="Add a skill..."
                      onKeyPress={(e) => e.key === 'Enter' && addToTaskDataArray('requiredSkills', newSkill, () => setNewSkill(''))}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addToTaskDataArray('requiredSkills', newSkill, () => setNewSkill(''))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.taskData.requiredSkills.map((skill, idx) => (
                      <Badge key={idx} variant="secondary" className="gap-2">
                        {skill}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeFromTaskDataArray('requiredSkills', idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 3: Instructions & Content */}
          {step === 3 && (
            <div className="space-y-6">
              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <BookOpen className="w-4 h-4" />
                  Task Instructions *
                </Label>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => updateField('instructions', e.target.value)}
                  placeholder="Provide detailed step-by-step instructions for completing this task..."
                  rows={10}
                  className="mt-1 font-mono text-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  {formData.instructions.length} characters (minimum 50)
                </p>
              </div>

              <div>
                <Label className="text-sm font-medium flex items-center gap-2">
                  <Lightbulb className="w-4 h-4" />
                  Guidelines & Best Practices
                </Label>
                <Textarea
                  value={formData.taskData.guidelines}
                  onChange={(e) => updateTaskData('guidelines', e.target.value)}
                  placeholder="Additional guidelines, tips, and best practices for workers..."
                  rows={4}
                  className="mt-1"
                />
              </div>

              {/* Test Content / Materials */}
              <Card className="border-blue-200 bg-blue-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <FileText className="w-4 h-4 text-blue-600" />
                    Test Content & Materials
                  </CardTitle>
                  <CardDescription>
                    Add the actual content workers will work with (separate items with ---)
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.taskData.inputs.join('\n---\n')}
                    onChange={(e) => {
                      const items = e.target.value.split('\n---\n').filter(item => item.trim());
                      updateTaskData('inputs', items);
                    }}
                    placeholder="Add test content, questions, or materials here...

Example:
Item 1: Review this customer service response...

---

Item 2: Analyze this code snippet..."
                    rows={8}
                    className="font-mono text-sm"
                  />
                </CardContent>
              </Card>

              {/* Expected Output */}
              <Card className="border-green-200 bg-green-50/50">
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <CheckCircle className="w-4 h-4 text-green-600" />
                    Expected Output / Answer Key (Optional)
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <Textarea
                    value={formData.taskData.expectedOutput}
                    onChange={(e) => updateTaskData('expectedOutput', e.target.value)}
                    placeholder="Provide sample answers or expected outputs to help with grading..."
                    rows={6}
                  />
                </CardContent>
              </Card>

              {/* Quality Metrics */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Star className="w-4 h-4" />
                    Quality Metrics
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newMetric}
                      onChange={(e) => setNewMetric(e.target.value)}
                      placeholder="e.g., Accuracy > 95%"
                      onKeyPress={(e) => e.key === 'Enter' && addToTaskDataArray('qualityMetrics', newMetric, () => setNewMetric(''))}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addToTaskDataArray('qualityMetrics', newMetric, () => setNewMetric(''))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="flex flex-wrap gap-2">
                    {formData.taskData.qualityMetrics.map((metric, idx) => (
                      <Badge key={idx} variant="outline" className="gap-2">
                        {metric}
                        <X
                          className="w-3 h-3 cursor-pointer"
                          onClick={() => removeFromTaskDataArray('qualityMetrics', idx)}
                        />
                      </Badge>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 4: Compensation & Timeline */}
          {step === 4 && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Clock className="w-4 h-4" />
                      Time Estimate
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Estimated Hours</Label>
                      <Input
                        type="number"
                        value={formData.estimatedHours}
                        onChange={(e) => updateField('estimatedHours', parseFloat(e.target.value) || 1)}
                        min="0.25"
                        max="40"
                        step="0.25"
                        className="mt-1"
                      />
                    </div>
                    <div>
                      <Label className="text-xs">Time in Minutes</Label>
                      <Input
                        type="number"
                        value={formData.estimatedTime}
                        onChange={(e) => updateField('estimatedTime', parseInt(e.target.value) || 60)}
                        min="15"
                        max="2400"
                        className="mt-1"
                      />
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <DollarSign className="w-4 h-4" />
                      Compensation
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <div>
                      <Label className="text-xs">Hourly Rate ($)</Label>
                      <Input
                        type="number"
                        value={formData.hourlyRate}
                        onChange={(e) => updateField('hourlyRate', parseFloat(e.target.value) || 15)}
                        min="5"
                        max="100"
                        step="0.5"
                        className="mt-1"
                      />
                    </div>
                    <div className="p-3 bg-green-50 rounded-lg">
                      <div className="text-2xl font-bold text-green-700">
                        ${totalPayment}
                      </div>
                      <div className="text-xs text-green-600">Total Payment</div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-medium flex items-center gap-2">
                      <Calendar className="w-4 h-4" />
                      Deadline
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <Input
                      type="date"
                      value={formData.deadline}
                      onChange={(e) => updateField('deadline', e.target.value)}
                      min={new Date().toISOString().split('T')[0]}
                      className="mt-1"
                    />
                    <p className="text-xs text-gray-500 mt-2">
                      {Math.ceil((new Date(formData.deadline).getTime() - Date.now()) / (1000 * 60 * 60 * 24))} days from now
                    </p>
                  </CardContent>
                </Card>
              </div>

              {/* Requirements */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <ListChecks className="w-4 h-4" />
                    Requirements
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newRequirement}
                      onChange={(e) => setNewRequirement(e.target.value)}
                      placeholder="Add a requirement..."
                      onKeyPress={(e) => e.key === 'Enter' && addToArray('requirements', newRequirement, () => setNewRequirement(''))}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addToArray('requirements', newRequirement, () => setNewRequirement(''))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.requirements.map((req, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <CheckCircle className="w-4 h-4 text-green-500 flex-shrink-0" />
                        <span className="flex-1 text-sm">{req}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('requirements', idx)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>

              {/* Deliverables */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <Upload className="w-4 h-4" />
                    Expected Deliverables
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex gap-2 mb-3">
                    <Input
                      value={newDeliverable}
                      onChange={(e) => setNewDeliverable(e.target.value)}
                      placeholder="Add a deliverable..."
                      onKeyPress={(e) => e.key === 'Enter' && addToArray('deliverables', newDeliverable, () => setNewDeliverable(''))}
                    />
                    <Button
                      variant="outline"
                      onClick={() => addToArray('deliverables', newDeliverable, () => setNewDeliverable(''))}
                    >
                      <Plus className="w-4 h-4" />
                    </Button>
                  </div>
                  <div className="space-y-2">
                    {formData.deliverables.map((del, idx) => (
                      <div key={idx} className="flex items-center gap-2 p-2 bg-gray-50 rounded">
                        <FileText className="w-4 h-4 text-blue-500 flex-shrink-0" />
                        <span className="flex-1 text-sm">{del}</span>
                        <Button
                          variant="ghost"
                          size="sm"
                          onClick={() => removeFromArray('deliverables', idx)}
                        >
                          <Trash2 className="w-4 h-4 text-red-500" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </CardContent>
              </Card>
            </div>
          )}

          {/* Step 5: Review & Assign */}
          {step === 5 && (
            <div className="space-y-6">
              {/* Assignment */}
              <Card>
                <CardHeader className="pb-3">
                  <CardTitle className="text-sm font-medium flex items-center gap-2">
                    <User className="w-4 h-4" />
                    Assign to Users (Optional - Select Multiple)
                  </CardTitle>
                  <CardDescription>
                    {formData.assignedTo.length === 0 
                      ? 'Leave unassigned to add to task pool' 
                      : `${formData.assignedTo.length} user(s) selected`}
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2 max-h-60 overflow-y-auto border rounded-md p-2">
                    {users.length === 0 ? (
                      <p className="text-sm text-gray-500 text-center py-4">No users available</p>
                    ) : (
                      users.map((user, idx) => {
                        const userId = user._id || user.id || `user-${idx}`;
                        const isSelected = formData.assignedTo.includes(userId);
                        return (
                          <label
                            key={userId}
                            className={`flex items-center gap-3 p-2 rounded-md cursor-pointer transition-colors ${
                              isSelected ? 'bg-blue-50 border border-blue-200' : 'hover:bg-gray-50 border border-transparent'
                            }`}
                          >
                            <input
                              type="checkbox"
                              checked={isSelected}
                              onChange={(e) => {
                                if (e.target.checked) {
                                  updateField('assignedTo', [...formData.assignedTo, userId]);
                                } else {
                                  updateField('assignedTo', formData.assignedTo.filter((id: string) => id !== userId));
                                }
                              }}
                              className="w-4 h-4 text-blue-600 rounded border-gray-300 focus:ring-blue-500"
                            />
                            <div className="flex-1">
                              <div className="font-medium text-sm">{user.name}</div>
                              <div className="text-xs text-gray-500">{user.email}</div>
                            </div>
                            <Badge variant="outline" className="text-xs">
                              {user.completedTasks || 0} tasks
                            </Badge>
                          </label>
                        );
                      })
                    )}
                  </div>
                  {formData.assignedTo.length > 0 && (
                    <div className="mt-3 flex flex-wrap gap-2">
                      {formData.assignedTo.map((userId: string) => {
                        const user = users.find(u => (u._id || u.id) === userId);
                        return user ? (
                          <Badge key={userId} variant="secondary" className="flex items-center gap-1">
                            {user.name}
                            <button
                              type="button"
                              onClick={() => updateField('assignedTo', formData.assignedTo.filter((id: string) => id !== userId))}
                              className="ml-1 hover:text-red-500"
                            >
                              <X className="w-3 h-3" />
                            </button>
                          </Badge>
                        ) : null;
                      })}
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => updateField('assignedTo', [])}
                        className="text-xs text-red-500 hover:text-red-700"
                      >
                        Clear All
                      </Button>
                    </div>
                  )}
                </CardContent>
              </Card>

              {/* Task Summary */}
              <Card className="bg-gray-50">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Eye className="w-5 h-5" />
                    Task Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-blue-600">${totalPayment}</div>
                      <div className="text-xs text-gray-500">Total Payment</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <div className="text-2xl font-bold text-purple-600">{formData.estimatedHours}h</div>
                      <div className="text-xs text-gray-500">Estimated Time</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Badge className={PRIORITY_LEVELS.find(p => p.value === formData.priority)?.color}>
                        {formData.priority}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">Priority</div>
                    </div>
                    <div className="text-center p-3 bg-white rounded-lg">
                      <Badge className={DIFFICULTY_LEVELS.find(d => d.value === formData.taskData.difficultyLevel)?.color}>
                        {formData.taskData.difficultyLevel}
                      </Badge>
                      <div className="text-xs text-gray-500 mt-1">Difficulty</div>
                    </div>
                  </div>

                  <div className="space-y-4">
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Title</h4>
                      <p className="text-sm">{formData.title || 'Not set'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Category</h4>
                      <Badge>{formData.category.replace('_', ' ')}</Badge>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Description</h4>
                      <p className="text-sm text-gray-600 line-clamp-3">{formData.description || 'Not set'}</p>
                    </div>
                    <div>
                      <h4 className="text-sm font-medium text-gray-700">Deadline</h4>
                      <p className="text-sm">{new Date(formData.deadline).toLocaleDateString()}</p>
                    </div>
                    {formData.taskData.requiredSkills.length > 0 && (
                      <div>
                        <h4 className="text-sm font-medium text-gray-700">Required Skills</h4>
                        <div className="flex flex-wrap gap-1 mt-1">
                          {formData.taskData.requiredSkills.map((skill, idx) => (
                            <Badge key={idx} variant="secondary">{skill}</Badge>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>

              {/* Quality Control Toggle */}
              <Card>
                <CardContent className="pt-6">
                  <div className="flex items-center gap-3">
                    <input
                      type="checkbox"
                      id="qualityControl"
                      checked={formData.taskData.isQualityControl}
                      onChange={(e) => updateTaskData('isQualityControl', e.target.checked)}
                      className="w-5 h-5 rounded"
                    />
                    <label htmlFor="qualityControl" className="text-sm font-medium cursor-pointer">
                      Mark as Quality Control Task
                    </label>
                  </div>
                  <p className="text-xs text-gray-500 mt-2 ml-8">
                    Quality control tasks are used for validation and worker performance assessment
                  </p>
                </CardContent>
              </Card>
            </div>
          )}
        </div>

        {/* Footer Navigation */}
        <div className="sticky bottom-0 bg-white border-t px-6 py-4 flex items-center justify-between">
          <div>
            {step > 1 && (
              <Button
                variant="outline"
                onClick={() => setStep(step - 1)}
              >
                <ChevronLeft className="w-4 h-4 mr-2" />
                Back
              </Button>
            )}
          </div>

          <div className="flex gap-3">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            
            {step < 5 ? (
              <Button
                onClick={() => setStep(step + 1)}
                disabled={step === 1 ? false : !validateStep(step)}
              >
                Next
                <ChevronRight className="w-4 h-4 ml-2" />
              </Button>
            ) : (
              <Button
                onClick={handleSubmit}
                disabled={loading || !formData.title || !formData.instructions}
                className="bg-green-600 hover:bg-green-700"
              >
                {loading ? (
                  <>Creating...</>
                ) : (
                  <>
                    <Zap className="w-4 h-4 mr-2" />
                    Create Task
                  </>
                )}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
