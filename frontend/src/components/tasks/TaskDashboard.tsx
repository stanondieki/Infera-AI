import { useState } from 'react';
import { Play, Award, Clock, CheckCircle } from 'lucide-react';

export type TaskType = 'dashboard' | 'bounding-box' | 'text-entity' | 'image-classification' | 'semantic-segmentation' | 'keypoint-annotation' | 'code-review' | 'transcription' | 'data-annotation' | 'multimodal-training';

interface TaskDashboardProps {
  onSelectTask: (taskType: TaskType) => void;
  completedTasks: string[];
  onClose: () => void;
}

export function TaskDashboard({ onSelectTask, completedTasks, onClose }: TaskDashboardProps) {
  const taskTypes = [
    // AI Training Tasks
    {
      id: 'bounding-box' as TaskType,
      title: 'Impala Vision A3',
      company: 'AI Training',
      description: 'Computer vision model training for autonomous systems. Annotate objects and edge cases in driving environments.',
      payment: '$8.50 per task',
      difficulty: 'Intermediate',
      estimatedTime: '30 min per task',
      icon: '🤖',
      color: 'bg-blue-600',
      category: 'AI_TRAINING'
    },
    {
      id: 'text-entity' as TaskType,
      title: 'Genesis B1 Multilingual',
      company: 'AI Training',
      description: 'Train multilingual language model on conversation patterns. Focus on cultural context and nuanced responses.',
      payment: '$12.00 per task',
      difficulty: 'Advanced',
      estimatedTime: '45 min per task',
      icon: '🌐',
      color: 'bg-indigo-600',
      category: 'AI_TRAINING'
    },
    
    // Model Evaluation Tasks
    {
      id: 'code-review' as TaskType,
      title: 'Geranium YY Code Review',
      company: 'Model Evaluation',
      description: 'AI code generation model evaluation. Review generated code for functionality, efficiency, and best practices.',
      payment: '$20.00 per review',
      difficulty: 'Expert',
      estimatedTime: '40 min per review',
      icon: '📊',
      color: 'bg-emerald-600',
      category: 'MODEL_EVALUATION'
    },
    {
      id: 'image-classification' as TaskType,
      title: 'Phoenix Eval Rating C2',
      company: 'Model Evaluation',
      description: 'Comprehensive AI model evaluation. Rate responses on accuracy, helpfulness, and safety across multiple dimensions.',
      payment: '$7.00 per task',
      difficulty: 'Intermediate',
      estimatedTime: '25 min per task',
      icon: '🔍',
      color: 'bg-green-600',
      category: 'MODEL_EVALUATION'
    },
    {
      id: 'semantic-segmentation' as TaskType,
      title: 'Quantum Math Solver B2',
      company: 'Model Evaluation',
      description: 'Mathematical reasoning AI training. Evaluate step-by-step solutions and mathematical explanations for accuracy.',
      payment: '$14.00 per task',
      difficulty: 'Advanced',
      estimatedTime: '45 min per task',
      icon: '🧮',
      color: 'bg-teal-600',
      category: 'MODEL_EVALUATION'
    },
    
    // Content Moderation Tasks  
    {
      id: 'keypoint-annotation' as TaskType,
      title: 'Ostrich LLM Reviews',
      company: 'Content Moderation',
      description: 'Large language model output evaluation for factual accuracy and bias detection across diverse topics.',
      payment: '$11.00 per task',
      difficulty: 'Advanced',
      estimatedTime: '35 min per task',
      icon: '🛡️',
      color: 'bg-orange-600',
      category: 'CONTENT_MODERATION'
    }
  ];

  // Additional task types for expanded selection
  const additionalTasks = [
    // Transcription Tasks
    {
      id: 'transcription' as TaskType,
      title: 'Titan Audio Transcription V3',
      company: 'Transcription',
      description: 'Advanced audio transcription with speaker identification and emotion detection for training speech AI models.',
      payment: '$9.50 per task',
      difficulty: 'Intermediate',
      estimatedTime: '40 min per task',
      icon: '🎤',
      color: 'bg-purple-600',
      category: 'TRANSCRIPTION'
    },
    // Data Annotation Tasks
    {
      id: 'data-annotation' as TaskType,
      title: 'Nova Legal Document X1',
      company: 'Data Annotation',
      description: 'Legal document analysis for AI legal assistant training. Identify key clauses, legal concepts, and potential issues.',
      payment: '$24.00 per task',
      difficulty: 'Expert',
      estimatedTime: '55 min per task',
      icon: '🏷️',
      color: 'bg-slate-600',
      category: 'DATA_ANNOTATION'
    },
    // Advanced AI Training
    {
      id: 'multimodal-training' as TaskType,
      title: 'Flamingo Multimodal B6',
      company: 'AI Training',
      description: 'Multimodal AI training combining text, image, and audio inputs. Evaluate cross-modal understanding and response generation.',
      payment: '$13.00 per task',
      difficulty: 'Advanced',
      estimatedTime: '50 min per task',
      icon: '🔗',
      color: 'bg-cyan-600',
      category: 'AI_TRAINING'
    }
  ];

  // Combine all tasks
  const allTasks = [...taskTypes, ...additionalTasks
  ];

  return (
    <div className="max-w-6xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div>
          <h1 className="text-3xl font-bold text-gray-900">AI Training Tasks</h1>
          <p className="text-gray-600 mt-2">Choose from diverse AI training tasks. Complete high-quality work to unlock better rates.</p>
        </div>
        <div className="text-right">
          <div className="text-2xl font-bold text-green-600">{completedTasks.length}</div>
          <div className="text-sm text-gray-600">Tasks Completed</div>
        </div>
      </div>

      {/* Category Overview */}
      <div className="grid grid-cols-2 md:grid-cols-6 gap-4 mb-6">
        {[
          { name: 'AI Training', icon: '🤖', count: allTasks.filter(t => t.category === 'AI_TRAINING').length, color: 'bg-blue-100 text-blue-800' },
          { name: 'Model Evaluation', icon: '📊', count: allTasks.filter(t => t.category === 'MODEL_EVALUATION').length, color: 'bg-green-100 text-green-800' },
          { name: 'Content Moderation', icon: '🛡️', count: allTasks.filter(t => t.category === 'CONTENT_MODERATION').length, color: 'bg-orange-100 text-orange-800' },
          { name: 'Data Annotation', icon: '🏷️', count: allTasks.filter(t => t.category === 'DATA_ANNOTATION').length, color: 'bg-purple-100 text-purple-800' },
          { name: 'Transcription', icon: '🎤', count: allTasks.filter(t => t.category === 'TRANSCRIPTION').length, color: 'bg-pink-100 text-pink-800' },
          { name: 'Advanced', icon: '⭐', count: allTasks.filter(t => t.difficulty === 'Expert' || t.difficulty === 'Advanced').length, color: 'bg-yellow-100 text-yellow-800' }
        ].map((category) => (
          <div key={category.name} className="bg-white rounded-lg p-3 text-center border border-gray-200">
            <div className="text-2xl mb-1">{category.icon}</div>
            <div className="text-sm font-medium text-gray-900">{category.count}</div>
            <div className="text-xs text-gray-600">{category.name}</div>
          </div>
        ))}
      </div>

      {/* Task Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {allTasks.map((task) => {
          const isCompleted = completedTasks.includes(task.id);
          
          return (
            <div
              key={task.id}
              className="bg-white rounded-xl shadow-sm border border-gray-200 hover:shadow-md transition-shadow"
            >
              <div className="p-6">
                {/* Task Header */}
                <div className="flex items-start justify-between mb-4">
                  <div className="flex items-center gap-3">
                    <div className={`w-12 h-12 ${task.color} rounded-lg flex items-center justify-center text-white text-xl`}>
                      {task.icon}
                    </div>
                    <div>
                      <h3 className="font-semibold text-gray-900 text-sm">{task.company}</h3>
                      <div className="flex items-center gap-2">
                        <span className={`px-2 py-1 text-xs rounded-full ${
                          task.difficulty === 'Beginner' ? 'bg-green-100 text-green-800' :
                          task.difficulty === 'Intermediate' ? 'bg-yellow-100 text-yellow-800' :
                          task.difficulty === 'Advanced' ? 'bg-orange-100 text-orange-800' :
                          'bg-red-100 text-red-800'
                        }`}>
                          {task.difficulty}
                        </span>
                        {isCompleted && (
                          <CheckCircle className="w-4 h-4 text-green-600" />
                        )}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Category Badge */}
                <div className="mb-2">
                  <span className="px-2 py-1 text-xs rounded-full bg-gray-100 text-gray-700">
                    {task.category?.replace('_', ' ') || 'General'}
                  </span>
                </div>
                
                <h4 className="font-medium text-gray-900 mb-2">{task.title}</h4>
                <p className="text-sm text-gray-600 mb-4 line-clamp-2">{task.description}</p>

                {/* Task Details */}
                <div className="space-y-2 mb-4 text-sm">
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Payment:</span>
                    <span className="font-medium text-green-600">{task.payment}</span>
                  </div>
                  <div className="flex items-center justify-between">
                    <span className="text-gray-600">Time:</span>
                    <span className="font-medium">{task.estimatedTime}</span>
                  </div>
                </div>

                {/* Action Button */}
                <button
                  onClick={() => onSelectTask(task.id)}
                  className={`w-full py-2 px-4 rounded-lg font-medium transition-colors flex items-center justify-center gap-2 ${
                    isCompleted 
                      ? 'bg-green-100 text-green-800 hover:bg-green-200'
                      : 'bg-blue-600 text-white hover:bg-blue-700'
                  }`}
                >
                  {isCompleted ? (
                    <>
                      <Award className="w-4 h-4" />
                      Completed - Try Again
                    </>
                  ) : (
                    <>
                      <Play className="w-4 h-4" />
                      Start Task
                    </>
                  )}
                </button>
              </div>
            </div>
          );
        })}
      </div>

      {/* Footer */}
      <div className="text-center">
        <button
          onClick={onClose}
          className="px-6 py-2 text-gray-600 hover:text-gray-800 transition-colors"
        >
          Return to Dashboard
        </button>
      </div>
    </div>
  );
}