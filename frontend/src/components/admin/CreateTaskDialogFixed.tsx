import React, { useState, useEffect, useCallback } from 'react';
import { X, ChevronLeft, ChevronRight, CheckCircle, Sparkles } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { TASK_CATEGORIES, TaskTemplate, TaskField, TaskFormData } from '../../utils/taskTemplates';

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

const initialFormData: TaskFormData = {
  title: '',
  description: '',
  type: '',
  category: '',
  instructions: '',
  requirements: [],
  deliverables: [],
  estimatedHours: 1,
  deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
  hourlyRate: 15,
  priority: 'medium'
};

export function CreateTaskDialog({ open, onClose, onTaskCreated, users }: CreateTaskDialogProps) {
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<TaskTemplate | null>(null);
  const [formData, setFormData] = useState<TaskFormData>(initialFormData);
  const [errors, setErrors] = useState<string[]>([]);

  // Reset form when dialog opens/closes - using useCallback to prevent infinite renders
  const resetForm = useCallback(() => {
    setStep(1);
    setSelectedTemplate(null);
    setFormData(initialFormData);
    setErrors([]);
  }, []);

  useEffect(() => {
    if (open) {
      resetForm();
    }
  }, [open, resetForm]);

  const handleTemplateSelect = useCallback((template: TaskTemplate) => {
    setSelectedTemplate(template);
    setFormData(prev => ({
      ...prev,
      ...template.defaultValues,
      category: template.id
    }));
    setStep(2);
  }, []);

  const handleFieldChange = useCallback((fieldId: string, value: any) => {
    setFormData(prev => ({
      ...prev,
      [fieldId]: value
    }));
    setErrors([]);
  }, []);

  const validateCurrentStep = useCallback((): { isValid: boolean; errors: string[] } => {
    if (!selectedTemplate) return { isValid: false, errors: [] };
    
    const stepFields = selectedTemplate.fields.filter(field => {
      if (step === 2) return field.section === 'basic';
      if (step === 3) return field.section === 'content';
      if (step === 4) return field.section === 'requirements';
      if (step === 5) return field.section === 'payment';
      return false;
    });

    const stepErrors: string[] = [];
    stepFields.forEach(field => {
      if (field.required && (!formData[field.id] || formData[field.id] === '')) {
        stepErrors.push(`${field.label} is required`);
      }
    });

    return { isValid: stepErrors.length === 0, errors: stepErrors };
  }, [selectedTemplate, step, formData]);

  const prevStep = useCallback(() => {
    setStep(prev => prev - 1);
    setErrors([]);
  }, []);

  const handleSubmit = useCallback(async () => {
    if (!selectedTemplate) return;

    try {
      setLoading(true);
      
      // Get token from infera_session
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

      const payload = {
        ...formData,
        type: selectedTemplate.id.toLowerCase().replace('_', '-'),
        category: selectedTemplate.id,
        requirements: Array.isArray(formData.requirements) ? formData.requirements : [],
        deliverables: Array.isArray(formData.deliverables) ? formData.deliverables : []
      };

      console.log('🚀 Creating task with payload:', payload);

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
        onTaskCreated(data.task);
        onClose();
        alert('✅ Task created successfully!');
      } else {
        const errorText = await response.text();
        console.error('Task creation failed:', response.status, errorText);
        alert(`❌ Failed to create task: ${response.status} - ${response.statusText}`);
      }
    } catch (error) {
      console.error('Error creating task:', error);
      alert(`❌ Network error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    } finally {
      setLoading(false);
    }
  }, [selectedTemplate, formData, onTaskCreated, onClose]);

  const renderFieldInput = useCallback((field: TaskField) => {
    const value = formData[field.id];

    switch (field.type) {
      case 'text':
        return (
          <input
            type="text"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'textarea':
        return (
          <Textarea
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="min-h-[100px] resize-none"
            required={field.required}
          />
        );

      case 'number':
        return (
          <input
            type="number"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, parseFloat(e.target.value) || 0)}
            placeholder={field.placeholder}
            min={field.min}
            max={field.max}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'select':
        return (
          <select
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          >
            <option value="">Select {field.label}</option>
            {field.options?.map(option => (
              <option key={option.value} value={option.value}>
                {option.label}
              </option>
            ))}
          </select>
        );

      case 'multiselect':
        return (
          <div className="space-y-2">
            {field.options?.map(option => (
              <label key={option.value} className="flex items-center space-x-2">
                <input
                  type="checkbox"
                  checked={value?.includes(option.value) || false}
                  onChange={(e) => {
                    const currentValue = value || [];
                    const newValue = e.target.checked
                      ? [...currentValue, option.value]
                      : currentValue.filter((v: string) => v !== option.value);
                    handleFieldChange(field.id, newValue);
                  }}
                  className="rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-sm text-gray-700">{option.label}</span>
              </label>
            ))}
          </div>
        );

      case 'tags':
        return (
          <div className="space-y-2">
            <input
              type="text"
              placeholder={field.placeholder}
              className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              onKeyPress={(e) => {
                if (e.key === 'Enter') {
                  e.preventDefault();
                  const newTag = e.currentTarget.value.trim();
                  if (newTag && !(value || []).includes(newTag)) {
                    handleFieldChange(field.id, [...(value || []), newTag]);
                    e.currentTarget.value = '';
                  }
                }
              }}
            />
            <div className="flex flex-wrap gap-2">
              {(value || []).map((tag: string, index: number) => (
                <Badge key={index} variant="secondary" className="flex items-center gap-1">
                  {tag}
                  <X 
                    size={14} 
                    className="cursor-pointer hover:text-red-500"
                    onClick={() => {
                      const newValue = (value || []).filter((_: string, i: number) => i !== index);
                      handleFieldChange(field.id, newValue);
                    }}
                  />
                </Badge>
              ))}
            </div>
          </div>
        );

      case 'url':
        return (
          <input
            type="url"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            placeholder={field.placeholder}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      case 'date':
        return (
          <input
            type="date"
            value={value || ''}
            onChange={(e) => handleFieldChange(field.id, e.target.value)}
            className="w-full p-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
            required={field.required}
          />
        );

      default:
        return null;
    }
  }, [formData, handleFieldChange]);

  const renderStepContent = () => {
    if (step === 1) {
      return (
        <div className="space-y-6">
          <div className="text-center">
            <Sparkles className="w-12 h-12 text-blue-500 mx-auto mb-4" />
            <h3 className="text-lg font-semibold text-gray-900 mb-2">Choose Task Category</h3>
            <p className="text-gray-600">Select the type of task you want to create</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {TASK_CATEGORIES.map(template => (
              <div
                key={template.id}
                onClick={() => handleTemplateSelect(template)}
                className="p-6 border-2 border-gray-200 rounded-xl hover:border-blue-500 hover:bg-blue-50 cursor-pointer transition-all group"
              >
                <div className="flex items-start space-x-4">
                  <div className={`w-12 h-12 ${template.color} rounded-lg flex items-center justify-center text-white text-xl group-hover:scale-110 transition-transform`}>
                    <span>{template.icon}</span>
                  </div>
                  <div className="flex-1">
                    <h4 className="font-semibold text-gray-900 mb-2">{template.name}</h4>
                    <p className="text-sm text-gray-600">{template.description}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      );
    }

    if (!selectedTemplate) return null;

    const currentSectionFields = selectedTemplate.fields.filter(field => {
      if (step === 2) return field.section === 'basic';
      if (step === 3) return field.section === 'content';
      if (step === 4) return field.section === 'requirements';
      if (step === 5) return field.section === 'payment';
      return false;
    });

    const sectionTitles = {
      2: 'Basic Information',
      3: 'Content Details',
      4: 'Requirements',
      5: 'Payment & Timeline'
    };

    return (
      <div className="space-y-6">
        <div className="flex items-center space-x-4">
          <div className={`w-10 h-10 ${selectedTemplate.color} rounded-lg flex items-center justify-center text-white`}>
            <span>{selectedTemplate.icon}</span>
          </div>
          <div>
            <h3 className="font-semibold text-gray-900">{selectedTemplate.name}</h3>
            <p className="text-sm text-gray-600">{sectionTitles[step as keyof typeof sectionTitles]}</p>
          </div>
        </div>

        {errors.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-lg p-4">
            <h4 className="font-medium text-red-800 mb-2">Please fix the following issues:</h4>
            <ul className="list-disc list-inside space-y-1 text-sm text-red-700">
              {errors.map((error, index) => (
                <li key={index}>{error}</li>
              ))}
            </ul>
          </div>
        )}

        <div className="space-y-6">
          {currentSectionFields.map(field => (
            <div key={field.id} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {field.label}
                {field.required && <span className="text-red-500 ml-1">*</span>}
              </label>
              {renderFieldInput(field)}
              {field.helpText && (
                <p className="text-xs text-gray-500">
                  {field.helpText}
                </p>
              )}
            </div>
          ))}
        </div>
      </div>
    );
  };

  const isLastStep = step === 5;
  
  // Memoize validation result to prevent infinite re-renders
  const canProceed = React.useMemo(() => {
    if (step === 1) return selectedTemplate !== null;
    
    if (!selectedTemplate) return false;
    
    const stepFields = selectedTemplate.fields.filter(field => {
      if (step === 2) return field.section === 'basic';
      if (step === 3) return field.section === 'content';
      if (step === 4) return field.section === 'requirements';
      if (step === 5) return field.section === 'payment';
      return false;
    });

    return stepFields.every(field => {
      if (!field.required) return true;
      const value = formData[field.id];
      return value && value !== '';
    });
  }, [step, selectedTemplate, formData]);

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center justify-between">
            <span>Create New Task</span>
            <Button variant="ghost" size="sm" onClick={onClose}>
              <X size={20} />
            </Button>
          </DialogTitle>
          <DialogDescription>
            Create a new task using our enhanced category-specific templates.
          </DialogDescription>
        </DialogHeader>

        {/* Progress Steps */}
        {selectedTemplate && (
          <div className="flex items-center justify-center space-x-2 py-4">
            {[1, 2, 3, 4, 5].map(stepNum => (
              <React.Fragment key={stepNum}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${
                  stepNum <= step 
                    ? 'bg-blue-500 text-white' 
                    : 'bg-gray-200 text-gray-600'
                }`}>
                  {stepNum < step ? <CheckCircle size={16} /> : stepNum}
                </div>
                {stepNum < 5 && (
                  <div className={`w-8 h-0.5 ${stepNum < step ? 'bg-blue-500' : 'bg-gray-200'}`} />
                )}
              </React.Fragment>
            ))}
          </div>
        )}

        {/* Step Content */}
        <div className="py-6">
          {renderStepContent()}
        </div>

        {/* Navigation */}
        <div className="flex justify-between items-center pt-4 border-t">
          <div>
            {step > 1 && (
              <Button variant="outline" onClick={prevStep} disabled={loading}>
                <ChevronLeft size={16} className="mr-1" />
                Back
              </Button>
            )}
          </div>

          <div className="flex space-x-2">
            {step < 5 && selectedTemplate && (
              <Button 
                onClick={() => {
                  const validation = validateCurrentStep();
                  if (validation.isValid) {
                    setStep(prev => prev + 1);
                  } else {
                    setErrors(validation.errors);
                  }
                }} 
                disabled={!canProceed || loading}
                className="bg-blue-500 hover:bg-blue-600"
              >
                Next
                <ChevronRight size={16} className="ml-1" />
              </Button>
            )}
            
            {isLastStep && (
              <Button 
                onClick={handleSubmit} 
                disabled={loading || errors.length > 0}
                className="bg-green-500 hover:bg-green-600"
              >
                {loading ? 'Creating...' : 'Create Task'}
              </Button>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}