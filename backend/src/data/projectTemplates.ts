// Realistic Project Templates for AI Training Platform
// Based on actual industry project naming conventions

export interface ProjectTemplate {
  name: string;
  description: string;
  category: string;
  difficulty: 'BEGINNER' | 'INTERMEDIATE' | 'ADVANCED' | 'EXPERT';
  estimatedTime: number;
  rewardRange: { min: number; max: number };
  instructions: string;
  tags: string[];
  requiredSkills: string[];
}

// Realistic project name generators
export const PROJECT_NAME_COMPONENTS = {
  codeNames: [
    'Genesis', 'Bulba', 'Impala', 'Flamingo', 'Geranium', 'Ostrich', 'Phoenix', 'Titan', 'Atlas', 
    'Nova', 'Cosmos', 'Stellar', 'Quantum', 'Nexus', 'Prism', 'Vortex', 'Cipher', 'Echo',
    'Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta', 'Theta', 'Lambda', 'Sigma', 'Omega'
  ],
  versions: ['A1', 'A2', 'A3', 'B1', 'B2', 'B3', 'B6', 'C1', 'C2', 'V1', 'V2', 'V3', 'X1', 'X2', 'Y1', 'YY', 'Z1'],
  suffixes: ['LLM', 'AI', 'ML', 'Gen', 'Pro', 'Plus', 'Advanced', 'Complex', 'Extended', 'Premium'],
  domains: ['Multilingual', 'Vision', 'Audio', 'Text', 'Code', 'Math', 'Science', 'Legal', 'Medical', 'Finance']
};

export const REALISTIC_PROJECT_TEMPLATES: ProjectTemplate[] = [
  // AI Training & Fine-tuning Projects
  {
    name: 'Genesis B1 Multilingual',
    description: 'Train multilingual language model on diverse conversation patterns across 15+ languages. Focus on cultural context and nuanced responses.',
    category: 'AI_TRAINING',
    difficulty: 'ADVANCED',
    estimatedTime: 45,
    rewardRange: { min: 8, max: 15 },
    instructions: 'Review and rate AI responses for cultural appropriateness, linguistic accuracy, and contextual relevance. Ensure responses maintain cultural sensitivity.',
    tags: ['multilingual', 'conversation', 'cultural-context'],
    requiredSkills: ['Natural Language Processing', 'Cross-cultural Communication', 'Multiple Languages']
  },
  {
    name: 'Bulba Gen Complex',
    description: 'Advanced generative AI model training for complex reasoning tasks. Evaluate logical consistency and creative problem-solving capabilities.',
    category: 'MODEL_EVALUATION',
    difficulty: 'EXPERT',
    estimatedTime: 60,
    rewardRange: { min: 12, max: 20 },
    instructions: 'Assess AI-generated solutions for complex problems. Rate logical flow, creativity, and practical applicability. Flag inconsistencies or errors.',
    tags: ['reasoning', 'problem-solving', 'logic'],
    requiredSkills: ['Critical Thinking', 'Logic', 'AI/ML Knowledge']
  },
  {
    name: 'Impala Vision A3',
    description: 'Computer vision model training for autonomous systems. Annotate objects, scenarios, and edge cases in driving environments.',
    category: 'DATA_ANNOTATION',
    difficulty: 'INTERMEDIATE',
    estimatedTime: 30,
    rewardRange: { min: 6, max: 10 },
    instructions: 'Accurately label objects, road conditions, and potential hazards in automotive imagery. Pay special attention to edge cases.',
    tags: ['computer-vision', 'automotive', 'safety'],
    requiredSkills: ['Computer Vision', 'Attention to Detail', 'Safety Awareness']
  },
  {
    name: 'Flamingo Multimodal B6',
    description: 'Multimodal AI training combining text, image, and audio inputs. Evaluate cross-modal understanding and response generation.',
    category: 'AI_TRAINING',
    difficulty: 'ADVANCED',
    estimatedTime: 50,
    rewardRange: { min: 10, max: 16 },
    instructions: 'Test AI responses that combine multiple input types. Verify accuracy of cross-modal connections and contextual understanding.',
    tags: ['multimodal', 'cross-modal', 'integration'],
    requiredSkills: ['Multimodal AI', 'Content Analysis', 'Technical Writing']
  },
  {
    name: 'Geranium YY Code Review',
    description: 'AI code generation model evaluation. Review generated code for functionality, efficiency, and best practices compliance.',
    category: 'MODEL_EVALUATION',
    difficulty: 'EXPERT',
    estimatedTime: 40,
    rewardRange: { min: 15, max: 25 },
    instructions: 'Analyze AI-generated code for correctness, efficiency, security, and adherence to coding standards. Provide detailed feedback.',
    tags: ['code-review', 'programming', 'security'],
    requiredSkills: ['Software Development', 'Code Review', 'Security Analysis']
  },
  {
    name: 'Ostrich LLM Reviews',
    description: 'Large language model output evaluation for factual accuracy and bias detection across diverse topics.',
    category: 'CONTENT_MODERATION',
    difficulty: 'ADVANCED',
    estimatedTime: 35,
    rewardRange: { min: 8, max: 14 },
    instructions: 'Review LLM outputs for factual accuracy, potential bias, and appropriateness. Flag misinformation and discriminatory content.',
    tags: ['fact-checking', 'bias-detection', 'moderation'],
    requiredSkills: ['Fact-checking', 'Bias Recognition', 'Research Skills']
  },
  {
    name: 'Phoenix Eval Rating C2',
    description: 'Comprehensive AI model evaluation across multiple performance dimensions. Rate responses on accuracy, helpfulness, and safety.',
    category: 'MODEL_EVALUATION',
    difficulty: 'INTERMEDIATE',
    estimatedTime: 25,
    rewardRange: { min: 5, max: 9 },
    instructions: 'Rate AI responses on 5-point scales for accuracy, helpfulness, relevance, and safety. Provide brief justification for ratings.',
    tags: ['evaluation', 'rating', 'performance'],
    requiredSkills: ['Critical Analysis', 'Attention to Detail', 'Communication']
  },
  {
    name: 'Titan Audio Transcription V3',
    description: 'Advanced audio transcription with speaker identification and emotion detection for training speech AI models.',
    category: 'TRANSCRIPTION',
    difficulty: 'INTERMEDIATE',
    estimatedTime: 40,
    rewardRange: { min: 7, max: 12 },
    instructions: 'Transcribe audio with high accuracy, identify speakers, and note emotional tones. Handle multiple languages and accents.',
    tags: ['transcription', 'audio', 'emotion-detection'],
    requiredSkills: ['Transcription', 'Language Skills', 'Audio Processing']
  },
  {
    name: 'Nova Legal Document X1',
    description: 'Legal document analysis for AI legal assistant training. Identify key clauses, legal concepts, and potential issues.',
    category: 'DATA_ANNOTATION',
    difficulty: 'EXPERT',
    estimatedTime: 55,
    rewardRange: { min: 18, max: 30 },
    instructions: 'Analyze legal documents, highlight important clauses, identify legal concepts, and flag potential compliance issues.',
    tags: ['legal', 'document-analysis', 'compliance'],
    requiredSkills: ['Legal Knowledge', 'Document Analysis', 'Attention to Detail']
  },
  {
    name: 'Quantum Math Solver B2',
    description: 'Mathematical reasoning AI training. Evaluate step-by-step solutions and mathematical explanations for accuracy.',
    category: 'MODEL_EVALUATION',
    difficulty: 'ADVANCED',
    estimatedTime: 45,
    rewardRange: { min: 10, max: 18 },
    instructions: 'Review mathematical solutions for accuracy, clarity of explanation, and pedagogical value. Check all calculation steps.',
    tags: ['mathematics', 'reasoning', 'education'],
    requiredSkills: ['Mathematics', 'Problem Solving', 'Teaching']
  }
];

// Function to generate realistic project names
export function generateProjectName(): string {
  const { codeNames, versions, suffixes, domains } = PROJECT_NAME_COMPONENTS;
  
  const templates = [
    () => `${getRandomItem(codeNames)} ${getRandomItem(versions)}`,
    () => `${getRandomItem(codeNames)} ${getRandomItem(suffixes)}`,
    () => `${getRandomItem(domains)} ${getRandomItem(codeNames)}`,
    () => `${getRandomItem(codeNames)} ${getRandomItem(versions)} ${getRandomItem(suffixes)}`,
    () => `${getRandomItem(codeNames)} ${getRandomItem(domains)} ${getRandomItem(versions)}`,
    () => `${getRandomItem(suffixes)} ${getRandomItem(codeNames)}`,
  ];
  
  return getRandomItem(templates)();
}

function getRandomItem<T>(array: T[]): T {
  return array[Math.floor(Math.random() * array.length)];
}

// Enhanced project categories with realistic descriptions
export const PROJECT_CATEGORIES = {
  AI_TRAINING: {
    name: 'AI Training',
    description: 'Fine-tune and train AI models through reinforcement learning from human feedback',
    icon: '🤖',
    averageReward: 12
  },
  DATA_ANNOTATION: {
    name: 'Data Annotation', 
    description: 'Label and annotate data for machine learning model training',
    icon: '🏷️',
    averageReward: 8
  },
  CONTENT_MODERATION: {
    name: 'Content Moderation',
    description: 'Review and moderate AI-generated content for safety and appropriateness',
    icon: '🛡️',
    averageReward: 10
  },
  MODEL_EVALUATION: {
    name: 'Model Evaluation',
    description: 'Evaluate AI model outputs for quality, accuracy, and performance',
    icon: '📊',
    averageReward: 14
  },
  TRANSCRIPTION: {
    name: 'Transcription',
    description: 'Transcribe and process audio/video content with high accuracy',
    icon: '🎤',
    averageReward: 9
  },
  TRANSLATION: {
    name: 'Translation',
    description: 'Translate content across languages while maintaining context and nuance',
    icon: '🌐',
    averageReward: 11
  }
};

// Skill requirements for different project types
export const SKILL_REQUIREMENTS = {
  'Natural Language Processing': ['AI_TRAINING', 'MODEL_EVALUATION', 'TRANSLATION'],
  'Computer Vision': ['DATA_ANNOTATION', 'MODEL_EVALUATION'],
  'Machine Learning': ['AI_TRAINING', 'MODEL_EVALUATION', 'DATA_ANNOTATION'],
  'Critical Thinking': ['MODEL_EVALUATION', 'CONTENT_MODERATION'],
  'Language Skills': ['TRANSLATION', 'TRANSCRIPTION', 'CONTENT_MODERATION'],
  'Technical Writing': ['AI_TRAINING', 'MODEL_EVALUATION'],
  'Research Skills': ['CONTENT_MODERATION', 'MODEL_EVALUATION'],
  'Mathematics': ['MODEL_EVALUATION', 'AI_TRAINING'],
  'Legal Knowledge': ['DATA_ANNOTATION', 'CONTENT_MODERATION'],
  'Software Development': ['MODEL_EVALUATION', 'AI_TRAINING']
};
