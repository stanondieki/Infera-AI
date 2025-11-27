import { useState } from 'react';
import { X, Calendar, DollarSign, Clock, User, FileText } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

// Get API base URL from environment or fallback to production
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

interface TaskFormData {
  title: string;
  description: string;
  type: string;
  category: string;
  instructions: string;
  requirements: string[];
  deliverables: string[];
  estimatedHours: number;
  deadline: string;
  hourlyRate: number;
  priority: string;
  assignedTo?: string;
  // AI Training specific fields
  taskData: {
    category: string;
    difficultyLevel: string;
    requiredSkills: string[];
    domainExpertise: string;
    guidelines: string;
    qualityMetrics: string[];
    examples: any[];
    inputs: any[];
    expectedOutput: string;
    isQualityControl: boolean;
  };
  qualityStandards: string[];
  estimatedTime: number; // in minutes
}

export function CreateTaskDialog({ open, onClose, onTaskCreated, users }: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [formData, setFormData] = useState<TaskFormData>({
    title: '',
    description: '',
    type: '',
    category: 'AI_TRAINING',
    instructions: '',
    requirements: [],
    deliverables: [],
    estimatedHours: 1,
    deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
    hourlyRate: 15,
    priority: 'medium',
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
      isQualityControl: false
    },
    qualityStandards: [],
    estimatedTime: 60
  });

  const taskTypes = [
    { value: 'multilingual-training', label: 'Multilingual AI Training', category: 'AI_TRAINING' },
    { value: 'code-review', label: 'Code Review Evaluation', category: 'MODEL_EVALUATION' },
    { value: 'model-evaluation', label: 'Model Performance Evaluation', category: 'MODEL_EVALUATION' },
    { value: 'content-moderation', label: 'Content Moderation', category: 'CONTENT_MODERATION' },
    { value: 'data-annotation', label: 'Data Annotation', category: 'DATA_ANNOTATION' },
    { value: 'image-classification', label: 'Image Classification', category: 'DATA_ANNOTATION' },
    { value: 'bounding-box', label: 'Object Detection (Bounding Box)', category: 'DATA_ANNOTATION' },
    { value: 'math-solver', label: 'Mathematical Reasoning', category: 'MODEL_EVALUATION' }
  ];

  const categories = [
    { value: 'AI_TRAINING', label: 'AI Training', icon: '🤖' },
    { value: 'MODEL_EVALUATION', label: 'Model Evaluation', icon: '📊' },
    { value: 'CONTENT_MODERATION', label: 'Content Moderation', icon: '🛡️' },
    { value: 'DATA_ANNOTATION', label: 'Data Annotation', icon: '🏷️' },
    { value: 'TRANSCRIPTION', label: 'Transcription', icon: '🎤' }
  ];

  const difficulties = ['beginner', 'intermediate', 'advanced', 'expert'];
  const priorities = ['low', 'medium', 'high', 'critical'];

  const handleInputChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [field]: value
    }));
  };

  const handleTaskDataChange = (field: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      taskData: {
        ...prev.taskData,
        [field]: value
      }
    }));
  };

  const handleArrayChange = (field: string, value: string) => {
    const items = value.split('\\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      [field]: items
    }));
  };

  const handleTaskDataArrayChange = (field: string, value: string) => {
    const items = value.split('\\n').filter(item => item.trim());
    setFormData(prev => ({
      ...prev,
      taskData: {
        ...prev.taskData,
        [field]: items
      }
    }));
  };

  const handleSubmit = async () => {
    try {
      setLoading(true);
      // Get token from infera_session like the browser console test
      const inferaSession = localStorage.getItem('infera_session');
      let token = null;
      if (inferaSession) {
        try {
          const session = JSON.parse(inferaSession);
          token = session.accessToken;
        } catch (e) {
          console.error('Error parsing infera_session:', e);
        }
      }
      
      if (!token) {
        alert('❌ Authentication token not found. Please log in again.');
        return;
      }
      
      const response = await fetch(`${getApiUrl()}/tasks/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify(formData)
      });

      if (response.ok) {
        const data = await response.json();
        onTaskCreated(data.task);
        resetForm();
        alert('✅ Task created successfully!');
      } else {
        const errorText = await response.text();
        console.error('Task creation failed:', response.status, errorText);
        alert(`❌ Failed to create task: ${response.status} - ${response.statusText}\n\nPlease check:\n1. Backend server is running on port 5000\n2. You're logged in as admin\n3. All required fields are filled`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}\n\nPlease check:\n1. Backend server is running (http://localhost:5000)\n2. Your internet connection\n3. CORS configuration`);
    } finally {
      setLoading(false);
    }
  };

  const resetForm = () => {
    setStep(1);
    setFormData({
      title: '',
      description: '',
      type: '',
      category: 'AI_TRAINING',
      instructions: '',
      requirements: [],
      deliverables: [],
      estimatedHours: 1,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      hourlyRate: 15,
      priority: 'medium',
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
        isQualityControl: false
      },
      qualityStandards: [],
      estimatedTime: 60
    });
  };

  const getFilteredTaskTypes = () => {
    return taskTypes.filter(type => type.category === formData.category);
  };

  if (!open) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New AI Training Task</span>
            <div className="flex items-center gap-2">
              <span className="text-sm text-gray-500">Step {step} of 4</span>
              <Button variant="ghost" size="sm" onClick={onClose}>
                <X className="w-4 h-4" />
              </Button>
            </div>
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-between">
            {[1, 2, 3, 4].map((stepNumber) => (
              <div
                key={stepNumber}
                className={`flex items-center ${stepNumber < 4 ? 'flex-1' : ''}`}
              >
                <div
                  className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                    step >= stepNumber
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-200 text-gray-600'
                  }`}
                >
                  {stepNumber}
                </div>
                {stepNumber < 4 && (
                  <div
                    className={`flex-1 h-1 mx-2 ${
                      step > stepNumber ? 'bg-blue-600' : 'bg-gray-200'
                    }`}
                  />
                )}
              </div>
            ))}
          </div>

          {/* Step 1: Basic Information */}
          {step === 1 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Basic Task Information</h3>
              
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Task Category</label>
                  <select
                    value={formData.category}
                    onChange={(e) => {
                      handleInputChange('category', e.target.value);
                      handleTaskDataChange('category', e.target.value);
                      handleInputChange('type', ''); // Reset type when category changes
                    }}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {categories.map(cat => (
                      <option key={cat.value} value={cat.value}>
                        {cat.icon} {cat.label}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Task Type</label>
                  <select
                    value={formData.type}
                    onChange={(e) => handleInputChange('type', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    <option value="">Select task type</option>
                    {getFilteredTaskTypes().map(type => (
                      <option key={type.value} value={type.value}>
                        {type.label}
                      </option>
                    ))}
                  </select>
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Task Title</label>
                <input
                  type="text"
                  value={formData.title}
                  onChange={(e) => handleInputChange('title', e.target.value)}
                  placeholder="e.g., Genesis B1 Multilingual Training - Spanish Conversations"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Task Description</label>
                <Textarea
                  value={formData.description}
                  onChange={(e) => handleInputChange('description', e.target.value)}
                  placeholder="Provide a detailed description of what this task involves..."
                  className="w-full h-24"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className="text-sm font-medium block mb-2">Priority</label>
                  <select
                    value={formData.priority}
                    onChange={(e) => handleInputChange('priority', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {priorities.map(priority => (
                      <option key={priority} value={priority}>
                        {priority.charAt(0).toUpperCase() + priority.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Difficulty Level</label>
                  <select
                    value={formData.taskData.difficultyLevel}
                    onChange={(e) => handleTaskDataChange('difficultyLevel', e.target.value)}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  >
                    {difficulties.map(diff => (
                      <option key={diff} value={diff}>
                        {diff.charAt(0).toUpperCase() + diff.slice(1)}
                      </option>
                    ))}
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Estimated Time (minutes)</label>
                  <input
                    type="number"
                    value={formData.estimatedTime}
                    onChange={(e) => handleInputChange('estimatedTime', parseInt(e.target.value) || 60)}
                    min="15"
                    max="480"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 2: Task Configuration */}
          {step === 2 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Task Configuration</h3>

              <div>
                <label className="text-sm font-medium block mb-2">Task Instructions</label>
                <Textarea
                  value={formData.instructions}
                  onChange={(e) => handleInputChange('instructions', e.target.value)}
                  placeholder="Detailed instructions for completing this task..."
                  className="w-full h-32"
                />
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Guidelines</label>
                <Textarea
                  value={formData.taskData.guidelines}
                  onChange={(e) => handleTaskDataChange('guidelines', e.target.value)}
                  placeholder="Specific guidelines and best practices..."
                  className="w-full h-24"
                />
              </div>

              {/* Test Content Section */}
              <div className="bg-blue-50 p-6 rounded-lg border border-blue-200">
                <h4 className="text-lg font-semibold text-blue-900 mb-4">Test Content & Materials</h4>
                <p className="text-sm text-blue-700 mb-4">Add the actual content, questions, or materials that users will work with</p>
                
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium block mb-2">Test Content / Questions</label>
                    <Textarea
                      value={formData.taskData.inputs.join('\n---\n')}
                      onChange={(e) => {
                        const items = e.target.value.split('\n---\n').filter(item => item.trim());
                        handleTaskDataChange('inputs', items);
                      }}
                      placeholder="Add test content here. Separate multiple items with '---'

Example for Spanish conversation task:
Conversation 1:
User: ¡Hola! Mi paquete debería haber llegado ayer pero no ha llegado. ¿Pueden ayudarme?
AI Response: Hola, lamento la demora. Voy a revisar tu pedido. ¿Me das el número de seguimiento?
Task: Review this AI response for cultural appropriateness and suggest improvements.

---

Conversation 2:
User: ¿Podríamos programar una reunión para la próxima semana?
AI Response: Sí, claro. ¿Qué tal el martes? Tengo tiempo libre.
Task: Evaluate formality level and suggest more professional phrasing."
                      rows={10}
                      className="w-full"
                    />
                  </div>

                  <div>
                    <label className="text-sm font-medium block mb-2">Expected Output / Answer Key (Optional)</label>
                    <Textarea
                      value={formData.taskData.expectedOutput || ''}
                      onChange={(e) => handleTaskDataChange('expectedOutput', e.target.value)}
                      placeholder="Provide sample answers or expected outputs to help with grading...

Example:
Conversation 1 Improved Response: 
'Estimado cliente, lamento mucho las molestias ocasionadas por el retraso en su envío. Me haré cargo personalmente de investigar el estado de su paquete. ¿Podría proporcionarme su número de seguimiento para revisar inmediatamente?'

Reasoning: Uses formal 'usted', shows empathy, takes personal responsibility."
                      rows={6}
                      className="w-full"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Required Skills (one per line)</label>
                  <Textarea
                    value={formData.taskData.requiredSkills.join('\\n')}
                    onChange={(e) => handleTaskDataArrayChange('requiredSkills', e.target.value)}
                    placeholder="Natural Language Processing\\nMultilingual Communication\\nCultural Awareness"
                    className="w-full h-24"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Quality Metrics (one per line)</label>
                  <Textarea
                    value={formData.taskData.qualityMetrics.join('\\n')}
                    onChange={(e) => handleTaskDataArrayChange('qualityMetrics', e.target.value)}
                    placeholder="Accuracy > 95%\\nCultural appropriateness\\nResponse relevance"
                    className="w-full h-24"
                  />
                </div>
              </div>

              <div>
                <label className="text-sm font-medium block mb-2">Domain Expertise</label>
                <input
                  type="text"
                  value={formData.taskData.domainExpertise}
                  onChange={(e) => handleTaskDataChange('domainExpertise', e.target.value)}
                  placeholder="e.g., Linguistics, Computer Science, Cultural Studies"
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                />
              </div>

              <div className="flex items-center gap-3">
                <input
                  type="checkbox"
                  id="qualityControl"
                  checked={formData.taskData.isQualityControl}
                  onChange={(e) => handleTaskDataChange('isQualityControl', e.target.checked)}
                  className="w-4 h-4 text-blue-600 border-gray-300 rounded focus:ring-blue-500"
                />
                <label htmlFor="qualityControl" className="text-sm font-medium">
                  This is a quality control task (used for validation)
                </label>
              </div>
            </div>
          )}

          {/* Step 3: Timeline & Compensation */}
          {step === 3 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Timeline & Compensation</h3>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">
                    <Clock className="w-4 h-4 inline mr-1" />
                    Estimated Hours
                  </label>
                  <input
                    type="number"
                    value={formData.estimatedHours}
                    onChange={(e) => handleInputChange('estimatedHours', parseFloat(e.target.value) || 1)}
                    min="0.25"
                    max="20"
                    step="0.25"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    <DollarSign className="w-4 h-4 inline mr-1" />
                    Hourly Rate ($)
                  </label>
                  <input
                    type="number"
                    value={formData.hourlyRate}
                    onChange={(e) => handleInputChange('hourlyRate', parseFloat(e.target.value) || 15)}
                    min="5"
                    max="100"
                    step="0.50"
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">
                    <Calendar className="w-4 h-4 inline mr-1" />
                    Deadline
                  </label>
                  <input
                    type="date"
                    value={formData.deadline}
                    onChange={(e) => handleInputChange('deadline', e.target.value)}
                    min={new Date().toISOString().split('T')[0]}
                    className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                  />
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded-lg">
                <h4 className="font-medium text-blue-900 mb-2">Payment Summary</h4>
                <div className="text-sm text-blue-800">
                  <p>Estimated earnings: <span className="font-semibold">${((formData.estimatedHours || 1) * (formData.hourlyRate || 15)).toFixed(2)}</span></p>
                  <p>Time commitment: <span className="font-semibold">{formData.estimatedTime || 60} minutes</span></p>
                  <p>Effective rate: <span className="font-semibold">${(((formData.estimatedHours || 1) * (formData.hourlyRate || 15)) / ((formData.estimatedTime || 60) / 60)).toFixed(2)}/hour</span></p>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div>
                  <label className="text-sm font-medium block mb-2">Requirements (one per line)</label>
                  <Textarea
                    value={formData.requirements.join('\\n')}
                    onChange={(e) => handleArrayChange('requirements', e.target.value)}
                    placeholder="Minimum 2 years experience\\nFluency in target language\\nHigh attention to detail"
                    className="w-full h-24"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium block mb-2">Deliverables (one per line)</label>
                  <Textarea
                    value={formData.deliverables.join('\\n')}
                    onChange={(e) => handleArrayChange('deliverables', e.target.value)}
                    placeholder="Completed evaluation forms\\nQuality assessment report\\nRecommendations document"
                    className="w-full h-24"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Step 4: Assignment & Review */}
          {step === 4 && (
            <div className="space-y-6">
              <h3 className="text-lg font-semibold">Assignment & Review</h3>

              <div>
                <label className="text-sm font-medium block mb-2">
                  <User className="w-4 h-4 inline mr-1" />
                  Assign to User (Optional)
                </label>
                <select
                  value={formData.assignedTo || ''}
                  onChange={(e) => handleInputChange('assignedTo', e.target.value || undefined)}
                  className="w-full px-3 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500"
                >
                  <option value="">Leave unassigned (will appear in task pool)</option>
                  {users.map((user, index) => {
                    const userId = user._id || user.id || `user-${index}`;
                    return (
                      <option key={userId} value={userId}>
                        {user.name} ({user.email}) - {user.completedTasks || 0} tasks, ⭐{user.rating || 0}
                      </option>
                    );
                  })}
                </select>
              </div>

              {/* Task Summary */}
              <div className="bg-gray-50 p-6 rounded-lg">
                <h4 className="font-semibold text-gray-900 mb-4">Task Summary</h4>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                  <div>
                    <span className="text-gray-600">Title:</span> <span className="font-medium">{formData.title}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Category:</span> 
                    <Badge className="ml-2">{formData.category.replace('_', ' ')}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Type:</span> <span className="font-medium">{formData.type}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Difficulty:</span> 
                    <Badge className="ml-2">{formData.taskData.difficultyLevel}</Badge>
                  </div>
                  <div>
                    <span className="text-gray-600">Duration:</span> <span className="font-medium">{formData.estimatedTime} min</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Payment:</span> <span className="font-medium">${(formData.estimatedHours * formData.hourlyRate).toFixed(2)}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Deadline:</span> <span className="font-medium">{new Date(formData.deadline).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-gray-600">Priority:</span> 
                    <Badge className="ml-2">{formData.priority}</Badge>
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Navigation Buttons */}
          <div className="flex items-center justify-between pt-6 border-t">
            <Button
              variant="outline"
              onClick={() => setStep(Math.max(1, step - 1))}
              disabled={step === 1}
            >
              Previous
            </Button>

            <div className="flex gap-2">
              <Button variant="outline" onClick={onClose}>
                Cancel
              </Button>
              
              {step < 4 ? (
                <Button
                  onClick={() => setStep(step + 1)}
                  disabled={
                    (step === 1 && (!formData.title || !formData.type || !formData.category)) ||
                    (step === 2 && (!formData.instructions || !formData.taskData.guidelines))
                  }
                >
                  Next
                </Button>
              ) : (
                <Button
                  onClick={handleSubmit}
                  disabled={loading || !formData.title || !formData.instructions}
                >
                  {loading ? 'Creating...' : 'Create Task'}
                </Button>
              )}
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}