import { CheckCircle2, Circle, Clock, DollarSign, TrendingUp } from 'lucide-react';
import { TaskType } from '../TaskApp';

interface Task {
  id: string;
  type: TaskType;
  title: string;
  description: string;
  payment: number;
  estimatedTime: number;
  difficulty: 'Easy' | 'Medium' | 'Hard';
  available: number;
}

const tasks: Task[] = [
  {
    id: 'bbox-1',
    type: 'bounding-box',
    title: 'Object Detection - Bounding Boxes',
    description: 'Draw precise bounding boxes around objects in images',
    payment: 0.15,
    estimatedTime: 2,
    difficulty: 'Medium',
    available: 342
  },
  {
    id: 'text-ent-1',
    type: 'text-entity',
    title: 'Named Entity Recognition',
    description: 'Identify and label entities (names, locations, dates) in text',
    payment: 0.12,
    estimatedTime: 1.5,
    difficulty: 'Medium',
    available: 467
  },
  {
    id: 'img-class-1',
    type: 'image-classification',
    title: 'Image Classification',
    description: 'Categorize images into predefined categories',
    payment: 0.08,
    estimatedTime: 1,
    difficulty: 'Easy',
    available: 589
  },
  {
    id: 'seg-1',
    type: 'semantic-segmentation',
    title: 'Semantic Segmentation',
    description: 'Paint pixel-perfect masks around objects',
    payment: 0.25,
    estimatedTime: 4,
    difficulty: 'Hard',
    available: 156
  },
  {
    id: 'keypoint-1',
    type: 'keypoint-annotation',
    title: 'Keypoint Annotation',
    description: 'Mark specific points on objects (e.g., body joints, facial features)',
    payment: 0.20,
    estimatedTime: 3,
    difficulty: 'Hard',
    available: 234
  }
];

interface TaskDashboardProps {
  onSelectTask: (taskType: TaskType) => void;
  completedTasks: string[];
}

export function TaskDashboard({ onSelectTask, completedTasks }: TaskDashboardProps) {
  const totalEarned = completedTasks.length * 0.13; // Average payment
  const tasksCompleted = completedTasks.length;

  return (
    <div className="max-w-7xl mx-auto p-6">
      {/* Header */}
      <div className="mb-8">
        <h1 className="text-gray-900 mb-2">Data Annotation Dashboard</h1>
        <p className="text-gray-600">High-quality data annotation tasks for AI training. Label images, text, and more with precision.</p>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Tasks Completed</p>
              <p className="text-gray-900">{tasksCompleted}</p>
            </div>
            <CheckCircle2 className="w-10 h-10 text-green-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Total Earned</p>
              <p className="text-gray-900">${totalEarned.toFixed(2)}</p>
            </div>
            <DollarSign className="w-10 h-10 text-blue-500" />
          </div>
        </div>

        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-gray-600 mb-1">Accuracy Rate</p>
              <p className="text-gray-900">95.8%</p>
            </div>
            <TrendingUp className="w-10 h-10 text-purple-500" />
          </div>
        </div>
      </div>

      {/* Task List */}
      <div className="bg-white rounded-lg shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h2 className="text-gray-900">Available Annotation Tasks</h2>
        </div>
        <div className="divide-y divide-gray-200">
          {tasks.map((task) => {
            const isCompleted = completedTasks.includes(task.id);
            
            return (
              <div key={task.id} className="p-6 hover:bg-gray-50 transition-colors">
                <div className="flex items-start justify-between gap-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      {isCompleted ? (
                        <CheckCircle2 className="w-5 h-5 text-green-500 flex-shrink-0" />
                      ) : (
                        <Circle className="w-5 h-5 text-gray-300 flex-shrink-0" />
                      )}
                      <h3 className="text-gray-900">{task.title}</h3>
                      <span className={`px-2 py-1 rounded text-sm ${
                        task.difficulty === 'Easy' ? 'bg-green-100 text-green-700' :
                        task.difficulty === 'Medium' ? 'bg-yellow-100 text-yellow-700' :
                        'bg-red-100 text-red-700'
                      }`}>
                        {task.difficulty}
                      </span>
                    </div>
                    <p className="text-gray-600 mb-3 ml-8">{task.description}</p>
                    <div className="flex items-center gap-6 ml-8 text-sm text-gray-500">
                      <div className="flex items-center gap-1">
                        <DollarSign className="w-4 h-4" />
                        <span>${task.payment.toFixed(2)} per task</span>
                      </div>
                      <div className="flex items-center gap-1">
                        <Clock className="w-4 h-4" />
                        <span>~{task.estimatedTime} min</span>
                      </div>
                      <div>
                        <span>{task.available} available</span>
                      </div>
                    </div>
                  </div>
                  <button
                    onClick={() => onSelectTask(task.type)}
                    className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
                  >
                    Start Task
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}