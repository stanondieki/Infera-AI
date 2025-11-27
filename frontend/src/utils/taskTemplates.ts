// Task category templates and configurations
export interface TaskTemplate {
  id: string;
  name: string;
  description: string;
  icon: string;
  color: string;
  fields: TaskField[];
  defaultValues: Partial<TaskFormData>;
  validationRules: ValidationRule[];
  examples: TaskExample[];
}

export interface TaskField {
  id: string;
  label: string;
  type: 'text' | 'textarea' | 'number' | 'select' | 'multiselect' | 'url' | 'file' | 'date' | 'tags' | 'json';
  required: boolean;
  placeholder?: string;
  options?: { value: string; label: string }[];
  min?: number;
  max?: number;
  validation?: (value: any) => string | null;
  helpText?: string;
  section: 'basic' | 'content' | 'requirements' | 'payment' | 'advanced';
}

export interface ValidationRule {
  field: string;
  rule: (value: any, formData: any) => string | null;
}

export interface TaskExample {
  title: string;
  description: string;
  sampleData: any;
}

export interface TaskFormData {
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
  // Dynamic fields based on category
  [key: string]: any;
}

// Task Categories Configuration
export const TASK_CATEGORIES: TaskTemplate[] = [
  {
    id: 'DATA_ANNOTATION',
    name: 'Data Annotation',
    description: 'Label, classify, and annotate data for machine learning',
    icon: '🏷️',
    color: 'bg-blue-500',
    fields: [
      // Basic Info
      {
        id: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Image Classification - Vehicle Detection',
        section: 'basic'
      },
      {
        id: 'description',
        label: 'Task Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe what workers need to do...',
        section: 'basic'
      },
      {
        id: 'annotationType',
        label: 'Annotation Type',
        type: 'select',
        required: true,
        options: [
          { value: 'image_classification', label: 'Image Classification' },
          { value: 'object_detection', label: 'Object Detection' },
          { value: 'text_classification', label: 'Text Classification' },
          { value: 'sentiment_analysis', label: 'Sentiment Analysis' },
          { value: 'named_entity_recognition', label: 'Named Entity Recognition' },
          { value: 'bounding_box', label: 'Bounding Box Annotation' },
          { value: 'segmentation', label: 'Image Segmentation' },
          { value: 'transcription', label: 'Audio/Video Transcription' }
        ],
        section: 'content'
      },
      // Content Section
      {
        id: 'datasetUrl',
        label: 'Dataset URL/Source',
        type: 'url',
        required: true,
        placeholder: 'https://example.com/dataset or file upload link',
        section: 'content'
      },
      {
        id: 'sampleData',
        label: 'Sample Data Items',
        type: 'textarea',
        required: true,
        placeholder: 'Provide 3-5 sample data items with examples...',
        helpText: 'Show workers what the data looks like',
        section: 'content'
      },
      {
        id: 'annotationGuidelines',
        label: 'Annotation Guidelines',
        type: 'textarea',
        required: true,
        placeholder: 'Step-by-step instructions for annotation...',
        section: 'content'
      },
      {
        id: 'categories',
        label: 'Categories/Labels',
        type: 'tags',
        required: true,
        placeholder: 'Enter categories (e.g., car, truck, motorcycle)',
        helpText: 'Press Enter to add each category',
        section: 'content'
      },
      {
        id: 'qualityMetrics',
        label: 'Quality Metrics',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'accuracy', label: 'Accuracy (>95%)' },
          { value: 'consistency', label: 'Inter-annotator Agreement' },
          { value: 'completeness', label: 'Completeness Check' },
          { value: 'edge_cases', label: 'Edge Case Handling' }
        ],
        section: 'requirements'
      }
    ],
    defaultValues: {
      type: 'annotation',
      category: 'DATA_ANNOTATION',
      priority: 'medium',
      hourlyRate: 15,
      estimatedHours: 2
    },
    validationRules: [
      {
        field: 'categories',
        rule: (value) => value && value.length >= 2 ? null : 'At least 2 categories required'
      }
    ],
    examples: [
      {
        title: 'Image Classification - Animals',
        description: 'Classify images of animals into species',
        sampleData: {
          annotationType: 'image_classification',
          categories: ['cat', 'dog', 'bird', 'fish'],
          datasetUrl: 'https://unsplash.com/s/photos/animals'
        }
      }
    ]
  },

  {
    id: 'CONTENT_MODERATION',
    name: 'Content Moderation',
    description: 'Review and moderate user-generated content',
    icon: '🛡️',
    color: 'bg-red-500',
    fields: [
      {
        id: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Social Media Content Moderation',
        section: 'basic'
      },
      {
        id: 'description',
        label: 'Task Description',
        type: 'textarea',
        required: true,
        placeholder: 'Describe the moderation requirements...',
        section: 'basic'
      },
      {
        id: 'contentType',
        label: 'Content Type',
        type: 'select',
        required: true,
        options: [
          { value: 'text', label: 'Text Posts' },
          { value: 'images', label: 'Images' },
          { value: 'videos', label: 'Videos' },
          { value: 'comments', label: 'Comments' },
          { value: 'mixed', label: 'Mixed Media' }
        ],
        section: 'content'
      },
      {
        id: 'moderationCriteria',
        label: 'Moderation Criteria',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'spam', label: 'Spam Detection' },
          { value: 'hate_speech', label: 'Hate Speech' },
          { value: 'inappropriate', label: 'Inappropriate Content' },
          { value: 'violence', label: 'Violence/Harmful Content' },
          { value: 'copyright', label: 'Copyright Violation' },
          { value: 'misinformation', label: 'Misinformation' }
        ],
        section: 'content'
      },
      {
        id: 'moderationGuidelines',
        label: 'Detailed Guidelines',
        type: 'textarea',
        required: true,
        placeholder: 'Specific rules and examples for each violation type...',
        section: 'content'
      },
      {
        id: 'sensitivityLevel',
        label: 'Content Sensitivity Level',
        type: 'select',
        required: true,
        options: [
          { value: 'low', label: 'Low - General audience' },
          { value: 'medium', label: 'Medium - Some sensitive content' },
          { value: 'high', label: 'High - Potentially disturbing content' }
        ],
        section: 'requirements'
      }
    ],
    defaultValues: {
      type: 'moderation',
      category: 'CONTENT_MODERATION',
      priority: 'high',
      hourlyRate: 20,
      estimatedHours: 1
    },
    validationRules: [],
    examples: [
      {
        title: 'Social Media Post Review',
        description: 'Review social media posts for policy violations',
        sampleData: {
          contentType: 'mixed',
          moderationCriteria: ['spam', 'hate_speech', 'inappropriate']
        }
      }
    ]
  },

  {
    id: 'TRANSLATION',
    name: 'Translation',
    description: 'Translate content between languages',
    icon: '🌍',
    color: 'bg-green-500',
    fields: [
      {
        id: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., English to Spanish Website Translation',
        section: 'basic'
      },
      {
        id: 'description',
        label: 'Task Description',
        type: 'textarea',
        required: true,
        section: 'basic'
      },
      {
        id: 'sourceLanguage',
        label: 'Source Language',
        type: 'select',
        required: true,
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' },
          { value: 'ar', label: 'Arabic' }
        ],
        section: 'content'
      },
      {
        id: 'targetLanguage',
        label: 'Target Language',
        type: 'select',
        required: true,
        options: [
          { value: 'en', label: 'English' },
          { value: 'es', label: 'Spanish' },
          { value: 'fr', label: 'French' },
          { value: 'de', label: 'German' },
          { value: 'it', label: 'Italian' },
          { value: 'pt', label: 'Portuguese' },
          { value: 'zh', label: 'Chinese' },
          { value: 'ja', label: 'Japanese' },
          { value: 'ar', label: 'Arabic' }
        ],
        section: 'content'
      },
      {
        id: 'contentToTranslate',
        label: 'Content to Translate',
        type: 'textarea',
        required: true,
        placeholder: 'Provide the source text or document link...',
        section: 'content'
      },
      {
        id: 'translationStyle',
        label: 'Translation Style',
        type: 'select',
        required: true,
        options: [
          { value: 'formal', label: 'Formal' },
          { value: 'informal', label: 'Informal/Casual' },
          { value: 'technical', label: 'Technical' },
          { value: 'marketing', label: 'Marketing/Creative' },
          { value: 'legal', label: 'Legal' }
        ],
        section: 'content'
      },
      {
        id: 'specialInstructions',
        label: 'Special Instructions',
        type: 'textarea',
        required: false,
        placeholder: 'Cultural considerations, terminology preferences, etc.',
        section: 'content'
      }
    ],
    defaultValues: {
      type: 'translation',
      category: 'TRANSLATION',
      priority: 'medium',
      hourlyRate: 25,
      estimatedHours: 3
    },
    validationRules: [
      {
        field: 'targetLanguage',
        rule: (value, formData) => 
          value !== formData.sourceLanguage ? null : 'Target language must be different from source'
      }
    ],
    examples: []
  },

  {
    id: 'TRANSCRIPTION',
    name: 'Transcription',
    description: 'Convert audio/video content to text',
    icon: '🎵',
    color: 'bg-purple-500',
    fields: [
      {
        id: 'title',
        label: 'Task Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Podcast Episode Transcription',
        section: 'basic'
      },
      {
        id: 'description',
        label: 'Task Description',
        type: 'textarea',
        required: true,
        section: 'basic'
      },
      {
        id: 'audioUrl',
        label: 'Audio/Video URL',
        type: 'url',
        required: true,
        placeholder: 'https://example.com/audio.mp3',
        section: 'content'
      },
      {
        id: 'audioLength',
        label: 'Audio Length (minutes)',
        type: 'number',
        required: true,
        min: 1,
        max: 180,
        section: 'content'
      },
      {
        id: 'transcriptionType',
        label: 'Transcription Type',
        type: 'select',
        required: true,
        options: [
          { value: 'verbatim', label: 'Verbatim (exact words, including ums, ahs)' },
          { value: 'clean', label: 'Clean (edited for readability)' },
          { value: 'timestamps', label: 'With Timestamps' },
          { value: 'speaker_labels', label: 'With Speaker Labels' }
        ],
        section: 'content'
      },
      {
        id: 'audioQuality',
        label: 'Audio Quality',
        type: 'select',
        required: true,
        options: [
          { value: 'excellent', label: 'Excellent (clear, no background noise)' },
          { value: 'good', label: 'Good (mostly clear)' },
          { value: 'fair', label: 'Fair (some noise/unclear parts)' },
          { value: 'poor', label: 'Poor (heavy accent/noise)' }
        ],
        section: 'content'
      }
    ],
    defaultValues: {
      type: 'transcription',
      category: 'TRANSCRIPTION',
      priority: 'medium',
      hourlyRate: 18,
      estimatedHours: 2
    },
    validationRules: [],
    examples: []
  },

  {
    id: 'RESEARCH',
    name: 'Research',
    description: 'Gather and analyze information on specific topics',
    icon: '🔍',
    color: 'bg-yellow-500',
    fields: [
      {
        id: 'title',
        label: 'Research Title',
        type: 'text',
        required: true,
        placeholder: 'e.g., Market Research - AI Startups in Europe',
        section: 'basic'
      },
      {
        id: 'description',
        label: 'Research Objective',
        type: 'textarea',
        required: true,
        placeholder: 'What specific information do you need?',
        section: 'basic'
      },
      {
        id: 'researchType',
        label: 'Research Type',
        type: 'select',
        required: true,
        options: [
          { value: 'market_research', label: 'Market Research' },
          { value: 'competitor_analysis', label: 'Competitor Analysis' },
          { value: 'academic_research', label: 'Academic Research' },
          { value: 'fact_checking', label: 'Fact Checking' },
          { value: 'data_collection', label: 'Data Collection' },
          { value: 'survey_analysis', label: 'Survey Analysis' }
        ],
        section: 'content'
      },
      {
        id: 'researchQuestions',
        label: 'Research Questions',
        type: 'textarea',
        required: true,
        placeholder: 'List specific questions to be answered...',
        section: 'content'
      },
      {
        id: 'sourcesRequired',
        label: 'Required Sources',
        type: 'multiselect',
        required: true,
        options: [
          { value: 'academic_papers', label: 'Academic Papers' },
          { value: 'news_articles', label: 'News Articles' },
          { value: 'company_reports', label: 'Company Reports' },
          { value: 'government_data', label: 'Government Data' },
          { value: 'industry_reports', label: 'Industry Reports' },
          { value: 'interviews', label: 'Interviews/Surveys' }
        ],
        section: 'requirements'
      },
      {
        id: 'deliverableFormat',
        label: 'Deliverable Format',
        type: 'select',
        required: true,
        options: [
          { value: 'report', label: 'Written Report' },
          { value: 'presentation', label: 'Presentation Slides' },
          { value: 'spreadsheet', label: 'Data Spreadsheet' },
          { value: 'summary', label: 'Executive Summary' }
        ],
        section: 'requirements'
      }
    ],
    defaultValues: {
      type: 'research',
      category: 'RESEARCH',
      priority: 'medium',
      hourlyRate: 30,
      estimatedHours: 8
    },
    validationRules: [],
    examples: []
  }
];

// Utility functions
export const getTaskTemplate = (categoryId: string): TaskTemplate | null => {
  return TASK_CATEGORIES.find(template => template.id === categoryId) || null;
};

export const validateTaskForm = (formData: TaskFormData, template: TaskTemplate): string[] => {
  const errors: string[] = [];
  
  // Check required fields
  template.fields.forEach(field => {
    if (field.required && (!formData[field.id] || formData[field.id] === '')) {
      errors.push(`${field.label} is required`);
    }
  });
  
  // Run custom validation rules
  template.validationRules.forEach(rule => {
    const error = rule.rule(formData[rule.field], formData);
    if (error) {
      errors.push(error);
    }
  });
  
  return errors;
};

export const generateTaskPayload = (formData: TaskFormData, template: TaskTemplate) => {
  // Convert form data to API payload format
  return {
    title: formData.title,
    description: formData.description,
    type: formData.type || template.defaultValues.type,
    category: template.id,
    instructions: formData.instructions || generateInstructions(formData, template),
    requirements: formData.requirements || [],
    deliverables: formData.deliverables || [],
    estimatedHours: formData.estimatedHours || template.defaultValues.estimatedHours,
    deadline: formData.deadline,
    hourlyRate: formData.hourlyRate || template.defaultValues.hourlyRate,
    priority: formData.priority || template.defaultValues.priority,
    assignedTo: formData.assignedTo,
    taskData: {
      category: template.id,
      // Extract non-conflicting properties from formData
      ...(({ category, title, description, type, instructions, requirements, deliverables, estimatedHours, deadline, hourlyRate, priority, assignedTo, ...rest }) => rest)(formData)
    }
  };
};

const generateInstructions = (formData: TaskFormData, template: TaskTemplate): string => {
  // Auto-generate instructions based on the template and form data
  let instructions = `${template.description}\n\n`;
  
  if (template.id === 'DATA_ANNOTATION') {
    instructions += `Annotation Type: ${formData.annotationType}\n`;
    instructions += `Categories: ${formData.categories?.join(', ')}\n`;
    instructions += `Guidelines: ${formData.annotationGuidelines}\n`;
  } else if (template.id === 'TRANSLATION') {
    instructions += `Translate from ${formData.sourceLanguage} to ${formData.targetLanguage}\n`;
    instructions += `Style: ${formData.translationStyle}\n`;
  }
  
  return instructions;
};