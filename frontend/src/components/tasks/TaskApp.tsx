import { useState } from 'react';
import { TaskDashboard } from './TaskDashboard';
import { UniversalTaskWorker } from './UniversalTaskWorker';
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
    // If we have a real task from the database, use the universal worker
    if (task && (task._id || task.id)) {
      return (
        <UniversalTaskWorker 
          task={task}
          onComplete={handleTaskComplete} 
          onBack={onClose} 
        />
      );
    }

    // Fallback to demo tasks for specific types
    switch (currentTask) {
      case 'bounding-box':
        return (
          <ImageBoundingBox 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'text-entity':
        return (
          <MultilingualTraining 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'image-classification':
        return (
          <ModelEvaluation 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'semantic-segmentation':
        return (
          <MathSolver 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'keypoint-annotation':
        return (
          <ContentModeration 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      case 'code-review':
        return (
          <CodeReview 
            task={task}
            onComplete={handleTaskComplete} 
            onBack={() => setCurrentTask('dashboard')} 
          />
        );
      default:
        // Show dashboard for demo mode
        return (
          <TaskDashboard 
            onSelectTask={setCurrentTask} 
            completedTasks={completedTasks} 
            onClose={onClose}
          />
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