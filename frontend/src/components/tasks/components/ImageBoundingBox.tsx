import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Save, RotateCcw, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../ui/card';
import { Button } from '../../ui/button';
import { Badge } from '../../ui/badge';
import { Label } from '../../ui/label';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
}

interface ImageBoundingBoxProps {
  task: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

// Enhanced Tesla Autopilot Label System
const labels = [
  { 
    id: 'vehicle', 
    name: 'Vehicle', 
    color: '#EF4444',
    priority: 'Critical',
    description: 'Cars, trucks, SUVs, vans',
    shortcut: 'V'
  },
  { 
    id: 'pedestrian', 
    name: 'Pedestrian', 
    color: '#10B981',
    priority: 'Critical',
    description: 'People walking, standing',
    shortcut: 'P'
  },
  { 
    id: 'cyclist', 
    name: 'Cyclist', 
    color: '#3B82F6',
    priority: 'High',
    description: 'Bicycles, e-scooters',
    shortcut: 'C'
  },
  { 
    id: 'motorcycle', 
    name: 'Motorcycle', 
    color: '#8B5CF6',
    priority: 'High',
    description: 'Motorcycles, mopeds',
    shortcut: 'M'
  },
  { 
    id: 'bus', 
    name: 'Bus/Truck', 
    color: '#F97316',
    priority: 'High',
    description: 'Large vehicles, buses',
    shortcut: 'B'
  },
  { 
    id: 'traffic_light', 
    name: 'Traffic Light', 
    color: '#EAB308',
    priority: 'Critical',
    description: 'Traffic signals, lights',
    shortcut: 'T'
  },
  { 
    id: 'stop_sign', 
    name: 'Stop Sign', 
    color: '#DC2626',
    priority: 'Critical',
    description: 'Stop signs, yield signs',
    shortcut: 'S'
  },
  { 
    id: 'crosswalk', 
    name: 'Crosswalk', 
    color: '#6B7280',
    priority: 'Medium',
    description: 'Pedestrian crossings',
    shortcut: 'X'
  }
];

export function ImageBoundingBox({ task, onComplete, onBack }: ImageBoundingBoxProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const imageRef = useRef<HTMLImageElement>(null);
  const [boxes, setBoxes] = useState<BoundingBox[]>([]);
  const [isDrawing, setIsDrawing] = useState(false);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  const [selectedLabel, setSelectedLabel] = useState(labels[0]);
  const [currentImage, setCurrentImage] = useState(0);
  const [timeSpent, setTimeSpent] = useState(0);
  const [startTime] = useState(Date.now());
  const [imageLoaded, setImageLoaded] = useState(false);
  const [scale, setScale] = useState(1);

  // Update timer
  useEffect(() => {
    const timer = setInterval(() => {
      setTimeSpent(Math.floor((Date.now() - startTime) / 1000));
    }, 1000);
    return () => clearInterval(timer);
  }, [startTime]);

  // Canvas drawing effect
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing boxes
    boxes.forEach(box => {
      ctx.strokeStyle = getLabelColor(box.label);
      ctx.fillStyle = getLabelColor(box.label) + '20';
      ctx.lineWidth = 2;
      ctx.strokeRect(box.x, box.y, box.width, box.height);
      ctx.fillRect(box.x, box.y, box.width, box.height);

      // Draw label
      ctx.fillStyle = getLabelColor(box.label);
      ctx.font = '12px Arial';
      ctx.fillRect(box.x, box.y - 20, ctx.measureText(box.label).width + 10, 20);
      ctx.fillStyle = 'white';
      ctx.fillText(box.label, box.x + 5, box.y - 5);
    });

    // Draw current box being drawn
    if (currentBox && currentBox.x !== undefined && currentBox.y !== undefined && currentBox.width !== undefined && currentBox.height !== undefined) {
      ctx.strokeStyle = getLabelColor(selectedLabel.id);
      ctx.setLineDash([5, 5]);
      ctx.lineWidth = 2;
      ctx.strokeRect(currentBox.x, currentBox.y, currentBox.width, currentBox.height);
      ctx.setLineDash([]);
    }
  }, [boxes, currentBox, selectedLabel]);

  // Get images from REAL task data ONLY - no mock data
  const getTaskImages = () => {
    console.log('🖼️ Loading task images from live data:', task);
    
    // Only use real task data - no fallbacks
    if (!task?.taskData?.inputs || !Array.isArray(task.taskData.inputs) || task.taskData.inputs.length === 0) {
      console.error('❌ No images found in task data. Task must have images in taskData.inputs');
      return [];
    }
    
    console.log('✅ Using live task images:', task.taskData.inputs);
    return task.taskData.inputs.map((input: any, index: number) => ({
      id: input.id || `task_image_${index}`,
      image: input.url,
      title: input.filename || `${task.title} - Image ${index + 1}`,
      description: input.description || task.description,
      requiredObjects: task.taskData.qualityMetrics || ['Objects as specified in task'],
      safetyNotes: task.instructions || 'Follow task guidelines',
      qualityThreshold: 95
    }));
  };

  const scenarios = getTaskImages();
  const currentScenario = scenarios[currentImage];

  const getLabelColor = (labelId: string) => {
    const label = labels.find(l => l.id === labelId);
    return label?.color || '#6b7280';
  };

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Show error if no images are available
  if (!scenarios || scenarios.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📷</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Images Available</h2>
          <p className="text-gray-600 mb-6">
            This task doesn't have any images to annotate. Please contact the administrator.
          </p>
          <button 
            onClick={onBack}
            className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Tasks
          </button>
        </div>
      </div>
    );
  }

  const handleMouseDown = (e: React.MouseEvent<HTMLCanvasElement>) => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setIsDrawing(true);
    setCurrentBox({
      x,
      y,
      width: 0,
      height: 0,
      label: selectedLabel.id
    });
  };

  const handleMouseMove = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing || !currentBox) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    setCurrentBox({
      ...currentBox,
      width: x - (currentBox.x || 0),
      height: y - (currentBox.y || 0)
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox || !currentBox.x || !currentBox.y) return;

    if (Math.abs(currentBox.width || 0) > 10 && Math.abs(currentBox.height || 0) > 10) {
      const newBox: BoundingBox = {
        id: Date.now().toString(),
        x: currentBox.width! < 0 ? currentBox.x + currentBox.width! : currentBox.x,
        y: currentBox.height! < 0 ? currentBox.y + currentBox.height! : currentBox.y,
        width: Math.abs(currentBox.width!),
        height: Math.abs(currentBox.height!),
        label: selectedLabel.id,
        confidence: 0.95
      };

      setBoxes([...boxes, newBox]);
    }

    setIsDrawing(false);
    setCurrentBox(null);
  };

  const handleSubmit = () => {
    const submissionData = {
      taskType: 'bounding-box',
      scenario: currentScenario,
      annotations: boxes,
      imageIndex: currentImage,
      totalBoxes: boxes.length,
      completedAt: new Date().toISOString(),
      qualityScore: Math.min(95 + boxes.length * 2, 100)
    };

    onComplete('bounding-box', submissionData);
  };

  const nextImage = () => {
    if (currentImage < scenarios.length - 1) {
      setCurrentImage(currentImage + 1);
      setBoxes([]);
    } else {
      handleSubmit();
    }
  };

  return (
    <div className="max-w-7xl mx-auto p-6 space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Button variant="outline" size="sm" onClick={onBack}>
            <ArrowLeft className="w-4 h-4 mr-2" />
            Back
          </Button>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              🚗 Tesla Autopilot Training
            </h1>
            <p className="text-gray-600">Object Detection & Bounding Box Annotation</p>
          </div>
        </div>
        <div className="flex items-center gap-2">
          <Badge className="bg-red-100 text-red-800">Expert Level</Badge>
          <Badge className="bg-green-100 text-green-800">$25/hour</Badge>
        </div>
      </div>

      {/* Progress */}
      <Card>
        <CardContent className="p-4">
          <div className="flex items-center justify-between">
            <div>
              <p className="font-medium">Image {currentImage + 1} of {scenarios.length}</p>
              <p className="text-sm text-gray-600">{boxes.length} objects annotated</p>
            </div>
            <div className="text-right">
              <p className="text-2xl font-bold text-green-600">${((boxes.length * 0.50) + (currentImage * 2.50)).toFixed(2)}</p>
              <p className="text-sm text-gray-600">Current Earnings</p>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Main Work Area */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Image Canvas */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Scenario Analysis</CardTitle>
              <CardDescription>{currentScenario.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="relative bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src={currentScenario.image}
                    alt={currentScenario.title || "Traffic scene"}
                    className="w-full h-96 object-cover"
                    onLoad={(e) => {
                      const canvas = canvasRef.current;
                      const img = e.target as HTMLImageElement;
                      if (canvas) {
                        canvas.width = img.naturalWidth || img.width;
                        canvas.height = img.naturalHeight || img.height;
                      }
                      console.log('✅ Image loaded successfully:', currentScenario.image);
                    }}
                    onError={(e) => {
                      console.error('❌ Failed to load image:', currentScenario.image);
                      console.error('Error details:', e);
                    }}
                    crossOrigin="anonymous"
                  />
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 cursor-crosshair"
                    onMouseDown={handleMouseDown}
                    onMouseMove={handleMouseMove}
                    onMouseUp={handleMouseUp}
                    style={{ width: '100%', height: '100%' }}
                  />
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-sm">
                  <div>
                    <strong>Task:</strong>
                    <p className="text-gray-600">{task?.title || currentScenario.title}</p>
                  </div>
                  <div>
                    <strong>Category:</strong>
                    <p className="text-gray-600">{task?.category || 'Data Annotation'}</p>
                  </div>
                  <div>
                    <strong>Quality Target:</strong>
                    <p className="text-gray-600">{currentScenario.qualityThreshold || 90}%</p>
                  </div>
                  <div>
                    <strong>Priority:</strong>
                    <p className="text-red-600 font-medium">{task?.priority || 'High'}</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Controls */}
        <div className="space-y-6">
          {/* Label Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Object Labels</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-2">
                {labels.map(label => (
                  <button
                    key={label.id}
                    onClick={() => setSelectedLabel(label)}
                    className={`p-2 text-sm rounded border-2 transition-all ${
                      selectedLabel.id === label.id
                        ? 'border-blue-500 bg-blue-50 text-blue-900'
                        : 'border-gray-200 hover:border-gray-300'
                    }`}
                    style={{
                      borderLeftColor: selectedLabel.id === label.id ? label.color : undefined,
                      borderLeftWidth: selectedLabel.id === label.id ? '4px' : undefined
                    }}
                  >
                    {label.name}
                  </button>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Required Objects */}
          <Card>
            <CardHeader>
              <CardTitle>Required Objects</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2">
                {currentScenario.requiredObjects?.map((obj: string) => {
                  const annotated = boxes.some(box => 
                    box.label.toLowerCase().includes(obj.toLowerCase().slice(0, -1))
                  );
                  return (
                    <div key={obj} className="flex items-center justify-between">
                      <span className="text-sm">{obj}</span>
                      {annotated ? (
                        <Check className="w-4 h-4 text-green-600" />
                      ) : (
                        <div className="w-4 h-4 border border-gray-300 rounded" />
                      )}
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Annotations List */}
          <Card>
            <CardHeader>
              <CardTitle>Current Annotations ({boxes.length})</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {boxes.map((box, index) => (
                  <div key={box.id} className="flex items-center justify-between p-2 bg-gray-50 rounded">
                    <span className="text-sm flex items-center gap-2">
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: getLabelColor(box.label) }}
                      />
                      {box.label}
                    </span>
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setBoxes(boxes.filter(b => b.id !== box.id))}
                    >
                      ×
                    </Button>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Actions */}
          <div className="space-y-3">
            <Button
              variant="outline"
              className="w-full"
              onClick={() => setBoxes([])}
              disabled={boxes.length === 0}
            >
              <RotateCcw className="w-4 h-4 mr-2" />
              Clear All
            </Button>
            
            <Button
              className="w-full"
              onClick={nextImage}
              disabled={boxes.length === 0}
            >
              {currentImage < scenarios.length - 1 ? 'Next Image' : 'Submit Task'}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}