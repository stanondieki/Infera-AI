import { useState } from 'react';
import { TaskDashboard } from './TaskDashboard';
import { ImageBoundingBox } from './components/ImageBoundingBox';
import { TextEntityAnnotation } from './components/TextEntityAnnotation';
import { ImageClassification } from './components/ImageClassification';
import { SemanticSegmentation } from './components/SemanticSegmentation';
import { KeypointAnnotation } from './components/KeypointAnnotation';
import { CodeReview } from './components/CodeReview';
import { MultilingualTraining } from './components/MultilingualTraining';
import { MathSolver } from './components/MathSolver';
import { ModelEvaluation } from './components/ModelEvaluation';
import { ContentModeration } from './components/ContentModeration';

export type TaskType = 'dashboard' | 'bounding-box' | 'text-entity' | 'image-classification' | 'semantic-segmentation' | 'keypoint-annotation' | 'code-review' | 'transcription' | 'data-annotation' | 'multimodal-training';

interface TaskAppProps {
  task: any;
  onSubmit: (submissionData: any) => void;
  onClose: () => void;
}

export function TaskApp({ task, onSubmit, onClose }: TaskAppProps) {
  // Automatically determine task type based on the task data
  const getTaskTypeFromTask = (task: any): TaskType => {
    if (!task || !task.category && !task.type) return 'dashboard';
    
    const taskType = task.type || task.category;
    console.log('🎯 Determining task type from task:', { taskType, task });
    
    // Map backend task types to frontend task types
    switch (taskType.toLowerCase()) {
      // Computer Vision & Data Annotation
      case 'image_annotation':
      case 'data_annotation':
      case 'computer_vision':
      case 'bounding_box':
      case 'object_detection':
        return 'bounding-box';
      
      // Image Classification
      case 'image_classification':
      case 'classification':
      case 'visual_recognition':
        return 'image-classification';
      
      // Semantic Segmentation
      case 'semantic_segmentation':
      case 'segmentation':
      case 'pixel_labeling':
        return 'semantic-segmentation';
      
      // Keypoint & Pose Detection
      case 'keypoint_annotation':
      case 'keypoint':
      case 'pose_detection':
        return 'keypoint-annotation';
      
      // Text & NLP Tasks
      case 'text_entity':
      case 'nlp_text':
      case 'text_classification':
      case 'sentiment_analysis':
      case 'named_entity_recognition':
        return 'text-entity';
      
      // Multilingual & Translation
      case 'multilingual':
      case 'translation':
      case 'cross_lingual':
        return 'multimodal-training';
      
      // Code Review & Programming
      case 'code_review':
      case 'code':
      case 'programming':
      case 'bug_detection':
        return 'code-review';
      
      // Model Evaluation
      case 'model_evaluation':
      case 'evaluation':
      case 'quality_assurance':
        return 'image-classification'; // Reuse for model eval interface
      
      // Math & Reasoning
      case 'math_reasoning':
      case 'mathematical':
      case 'logic_puzzles':
        return 'semantic-segmentation'; // Reuse for math interface
      
      // Audio & Speech
      case 'transcription':
      case 'audio_speech':
      case 'speech_recognition':
        return 'transcription';
      
      // Content Moderation
      case 'content_moderation':
      case 'moderation':
      case 'bias_detection':
        return 'keypoint-annotation'; // Reuse for content moderation
      
      // Research & Other
      case 'research':
      case 'multimodal_training':
      case 'other':
        return 'multimodal-training';
      
      default:
        console.log('⚠️ Unknown task type, showing dashboard:', taskType);
        return 'dashboard';
    }
  };

  const [currentTask, setCurrentTask] = useState<TaskType>(
    task ? getTaskTypeFromTask(task) : 'dashboard'
  );
  const [completedTasks, setCompletedTasks] = useState<string[]>([]);

  const handleTaskComplete = (taskId: string, submissionData: any) => {
    setCompletedTasks(prev => [...prev, taskId]);
    onSubmit(submissionData);
    setCurrentTask('dashboard');
  };

  const renderTask = () => {
    switch (currentTask) {
      case 'bounding-box':
        // Computer Vision: Object detection, bounding boxes, image annotation
        return (
          <ImageBoundingBox 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'text-entity':
        // NLP & Text: Named entity recognition, text classification, sentiment analysis
        return (
          <MultilingualTraining 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'image-classification':
        // Model Evaluation: Quality assessment, classification tasks, evaluation metrics
        return (
          <ModelEvaluation 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'semantic-segmentation':
        // Math & Reasoning: Problem solving, logical reasoning, mathematical tasks
        return (
          <MathSolver 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'keypoint-annotation':
        // Content Moderation: Bias detection, harmful content review, policy compliance
        return (
          <ContentModeration 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'code-review':
        // Code Review: AI code evaluation, bug detection, code quality assessment
        return (
          <CodeReview 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'transcription':
        // Audio & Speech: Transcription, speech recognition, audio processing
      case 'multimodal-training':
        // Multilingual & Research: Translation, cross-lingual tasks, research projects
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
              <div className="text-6xl mb-4">🚧</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">Coming Soon!</h2>
              <p className="text-gray-600 mb-6">
                This task type is currently being developed. Please check back soon for an amazing experience!
              </p>
              <button 
                onClick={() => setCurrentTask('dashboard')}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
      default:
        // For live task data, show error if we can't determine task type
        if (task) {
          return (
            <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
              <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
                <div className="text-6xl mb-4">⚠️</div>
                <h2 className="text-2xl font-bold text-gray-900 mb-2">Unsupported Task Type</h2>
                <p className="text-gray-600 mb-4">
                  Task type "{task.type || task.category}" is not yet supported.
                </p>
                <p className="text-sm text-gray-500 mb-6">
                  Task ID: {task.id || task._id}
                </p>
                <button 
                  onClick={onClose}
                  className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                >
                  Back to Dashboard
                </button>
              </div>
            </div>
          );
        }
        
        // If no task provided, show error
        return (
          <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
            <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
              <div className="text-6xl mb-4">🚫</div>
              <h2 className="text-2xl font-bold text-gray-900 mb-2">No Task Data</h2>
              <p className="text-gray-600 mb-6">
                No task data provided. Only real assigned tasks can be worked on.
              </p>
              <button 
                onClick={onClose}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
              >
                Back to Dashboard
              </button>
            </div>
          </div>
        );
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {renderTask()}
    </div>
  );
}

export default TaskApp;