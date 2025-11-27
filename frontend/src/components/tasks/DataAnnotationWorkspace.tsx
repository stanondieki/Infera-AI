import React, { useState, useEffect } from 'react';
import { ArrowLeft, Upload, CheckCircle, AlertCircle, Camera, Tag, Save, Download } from 'lucide-react';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';

interface DataAnnotationWorkspaceProps {
  taskId: string;
  task: {
    title: string;
    instructions: string;
    categories: string[];
    sampleData?: string;
    datasetUrl?: string;
  };
  onBack: () => void;
}

interface ImageAnnotation {
  id: string;
  imageUrl: string;
  category: string;
  confidence: number;
  notes: string;
  timestamp: Date;
}

// Sample food images from Unsplash (these would normally come from your dataset)
const SAMPLE_FOOD_IMAGES = [
  {
    id: '1',
    url: 'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=400&h=300&fit=crop',
    description: 'Margherita Pizza'
  },
  {
    id: '2', 
    url: 'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=400&h=300&fit=crop',
    description: 'Grilled Salmon'
  },
  {
    id: '3',
    url: 'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=400&h=300&fit=crop',
    description: 'Chocolate Cake'
  },
  {
    id: '4',
    url: 'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=400&h=300&fit=crop',
    description: 'Caesar Salad'
  },
  {
    id: '5',
    url: 'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop',
    description: 'Beef Burger'
  },
  {
    id: '6',
    url: 'https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop',
    description: 'Pasta Dish'
  },
  {
    id: '7',
    url: 'https://images.unsplash.com/photo-1547592180-85f173990554?w=400&h=300&fit=crop',
    description: 'Soup Bowl'
  },
  {
    id: '8',
    url: 'https://images.unsplash.com/photo-1540189549336-e6e99c3679fe?w=400&h=300&fit=crop',
    description: 'Sandwich'
  }
];

export function DataAnnotationWorkspace({ taskId, task, onBack }: DataAnnotationWorkspaceProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotations, setAnnotations] = useState<ImageAnnotation[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('');
  const [confidence, setConfidence] = useState(100);
  const [notes, setNotes] = useState('');
  const [progress, setProgress] = useState(0);

  const currentImage = SAMPLE_FOOD_IMAGES[currentImageIndex];
  const totalImages = SAMPLE_FOOD_IMAGES.length;

  useEffect(() => {
    const completed = annotations.length;
    setProgress(Math.round((completed / totalImages) * 100));
  }, [annotations.length, totalImages]);

  const handleAnnotation = () => {
    if (!selectedCategory) {
      alert('Please select a category before saving annotation');
      return;
    }

    const annotation: ImageAnnotation = {
      id: currentImage.id,
      imageUrl: currentImage.url,
      category: selectedCategory,
      confidence,
      notes,
      timestamp: new Date()
    };

    setAnnotations(prev => {
      const existing = prev.find(a => a.id === currentImage.id);
      if (existing) {
        return prev.map(a => a.id === currentImage.id ? annotation : a);
      } else {
        return [...prev, annotation];
      }
    });

    // Move to next image
    if (currentImageIndex < totalImages - 1) {
      setCurrentImageIndex(prev => prev + 1);
      setSelectedCategory('');
      setNotes('');
      setConfidence(100);
    }
  };

  const goToImage = (index: number) => {
    setCurrentImageIndex(index);
    const existingAnnotation = annotations.find(a => a.id === SAMPLE_FOOD_IMAGES[index].id);
    if (existingAnnotation) {
      setSelectedCategory(existingAnnotation.category);
      setConfidence(existingAnnotation.confidence);
      setNotes(existingAnnotation.notes);
    } else {
      setSelectedCategory('');
      setNotes('');
      setConfidence(100);
    }
  };

  const exportAnnotations = () => {
    const exportData = {
      taskId,
      taskTitle: task.title,
      totalImages: totalImages,
      completedAnnotations: annotations.length,
      progress: progress,
      annotations: annotations.map(a => ({
        imageId: a.id,
        category: a.category,
        confidence: a.confidence,
        notes: a.notes,
        timestamp: a.timestamp.toISOString()
      })),
      exportedAt: new Date().toISOString()
    };

    const blob = new Blob([JSON.stringify(exportData, null, 2)], { type: 'application/json' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `food-classification-annotations-${Date.now()}.json`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  };

  const isAnnotated = (imageId: string) => {
    return annotations.some(a => a.id === imageId);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="bg-white rounded-lg shadow-sm p-4 mb-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Button variant="ghost" onClick={onBack} className="flex items-center space-x-2">
                <ArrowLeft size={20} />
                <span>Back</span>
              </Button>
              <div>
                <h1 className="text-xl font-semibold text-gray-900">{task.title}</h1>
                <p className="text-sm text-gray-600">Data Annotation Workspace</p>
              </div>
            </div>
            <div className="flex items-center space-x-4">
              <Badge variant="outline">
                Progress: {progress}% ({annotations.length}/{totalImages})
              </Badge>
              <Button onClick={exportAnnotations} className="flex items-center space-x-2">
                <Download size={16} />
                <span>Export Results</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
          {/* Image Gallery Sidebar */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <Camera size={20} />
              <span>Images ({currentImageIndex + 1}/{totalImages})</span>
            </h3>
            <div className="grid grid-cols-2 gap-2 max-h-96 overflow-y-auto">
              {SAMPLE_FOOD_IMAGES.map((image, index) => (
                <div
                  key={image.id}
                  onClick={() => goToImage(index)}
                  className={`relative cursor-pointer rounded-lg overflow-hidden border-2 transition-all ${
                    index === currentImageIndex 
                      ? 'border-blue-500 ring-2 ring-blue-200' 
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                >
                  <img
                    src={image.url}
                    alt={image.description}
                    className="w-full h-20 object-cover"
                    loading="lazy"
                  />
                  {isAnnotated(image.id) && (
                    <div className="absolute top-1 right-1">
                      <CheckCircle size={16} className="text-green-500 bg-white rounded-full" />
                    </div>
                  )}
                  <div className="absolute bottom-0 left-0 right-0 bg-black bg-opacity-60 text-white text-xs p-1">
                    #{index + 1}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Main Annotation Area */}
          <div className="lg:col-span-2 bg-white rounded-lg shadow-sm p-4">
            <div className="flex items-center justify-between mb-4">
              <h3 className="font-semibold text-gray-900 flex items-center space-x-2">
                <Tag size={20} />
                <span>Annotate Image #{currentImageIndex + 1}</span>
              </h3>
              <div className="flex space-x-2">
                <Button
                  variant="outline"
                  onClick={() => goToImage(Math.max(0, currentImageIndex - 1))}
                  disabled={currentImageIndex === 0}
                >
                  Previous
                </Button>
                <Button
                  variant="outline"
                  onClick={() => goToImage(Math.min(totalImages - 1, currentImageIndex + 1))}
                  disabled={currentImageIndex === totalImages - 1}
                >
                  Next
                </Button>
              </div>
            </div>

            {/* Main Image */}
            <div className="mb-6">
              <img
                src={currentImage.url}
                alt={currentImage.description}
                className="w-full h-80 object-cover rounded-lg border border-gray-200"
              />
              <p className="text-sm text-gray-600 mt-2 text-center">{currentImage.description}</p>
            </div>

            {/* Category Selection */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Select Food Category <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-3 gap-2">
                {task.categories.map(category => (
                  <button
                    key={category}
                    onClick={() => setSelectedCategory(category)}
                    className={`p-3 rounded-lg border text-sm font-medium transition-all ${
                      selectedCategory === category
                        ? 'bg-blue-500 text-white border-blue-500'
                        : 'bg-white text-gray-700 border-gray-300 hover:border-blue-300'
                    }`}
                  >
                    {category.charAt(0).toUpperCase() + category.slice(1)}
                  </button>
                ))}
              </div>
            </div>

            {/* Confidence Level */}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Confidence Level: {confidence}%
              </label>
              <input
                type="range"
                min="50"
                max="100"
                step="5"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>50%</span>
                <span>75%</span>
                <span>100%</span>
              </div>
            </div>

            {/* Notes */}
            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Notes (Optional)
              </label>
              <Textarea
                value={notes}
                onChange={(e) => setNotes(e.target.value)}
                placeholder="Add any observations, edge cases, or special notes about this image..."
                className="min-h-[80px]"
              />
            </div>

            {/* Action Buttons */}
            <div className="flex space-x-2">
              <Button
                onClick={handleAnnotation}
                className="flex-1 flex items-center justify-center space-x-2"
                disabled={!selectedCategory}
              >
                <Save size={16} />
                <span>Save Annotation</span>
              </Button>
              {isAnnotated(currentImage.id) && (
                <Button variant="outline" className="flex items-center space-x-1">
                  <CheckCircle size={16} />
                  <span>Saved</span>
                </Button>
              )}
            </div>
          </div>

          {/* Instructions Panel */}
          <div className="bg-white rounded-lg shadow-sm p-4">
            <h3 className="font-semibold text-gray-900 mb-4 flex items-center space-x-2">
              <AlertCircle size={20} />
              <span>Instructions</span>
            </h3>
            
            <div className="space-y-4 text-sm text-gray-600">
              <div>
                <h4 className="font-medium text-gray-900 mb-2">How to Annotate:</h4>
                <div className="space-y-2">
                  {task.instructions.split('\n').map((instruction, index) => (
                    <p key={index} className="text-xs">{instruction}</p>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Available Categories:</h4>
                <div className="flex flex-wrap gap-1">
                  {task.categories.map(category => (
                    <Badge key={category} variant="secondary" className="text-xs">
                      {category}
                    </Badge>
                  ))}
                </div>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Progress Tracking:</h4>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <div 
                    className="bg-blue-500 h-2 rounded-full transition-all"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-xs mt-1">{annotations.length} of {totalImages} images completed</p>
              </div>

              <div>
                <h4 className="font-medium text-gray-900 mb-2">Quality Tips:</h4>
                <ul className="text-xs space-y-1 list-disc list-inside">
                  <li>Focus on the main/dominant food item</li>
                  <li>Use 'Other' if no category fits well</li>
                  <li>Add notes for unusual cases</li>
                  <li>Maintain consistency across similar images</li>
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}