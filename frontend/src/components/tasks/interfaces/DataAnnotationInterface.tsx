'use client';

import { useState, useRef, useEffect, useCallback } from 'react';
import { 
  Image, ZoomIn, ZoomOut, RotateCw, Move, Square, 
  Tag, Trash2, Check, ChevronLeft, ChevronRight,
  Eye, EyeOff, Layers, Download, Upload, Undo, Redo,
  MousePointer, Crosshair, Grid3X3, Info, AlertCircle
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner';

interface BoundingBox {
  id: string;
  x: number;
  y: number;
  width: number;
  height: number;
  label: string;
  confidence: number;
  color: string;
  attributes?: Record<string, any>;
}

interface DataAnnotationInterfaceProps {
  task: any;
  onAnnotationsChange: (annotations: any[]) => void;
  onComplete: (data: any) => void;
}

interface Label {
  id: string;
  name: string;
  color: string;
  shortcut: string;
  description: string;
  count?: number;
}

// Default labels for different annotation types
const DEFAULT_LABELS: Record<string, Label[]> = {
  object_detection: [
    { id: 'vehicle', name: 'Vehicle', color: '#EF4444', shortcut: 'V', description: 'Cars, trucks, SUVs' },
    { id: 'pedestrian', name: 'Pedestrian', color: '#10B981', shortcut: 'P', description: 'People walking' },
    { id: 'cyclist', name: 'Cyclist', color: '#3B82F6', shortcut: 'C', description: 'Bicycles, e-scooters' },
    { id: 'traffic_light', name: 'Traffic Light', color: '#EAB308', shortcut: 'T', description: 'Traffic signals' },
    { id: 'stop_sign', name: 'Stop Sign', color: '#DC2626', shortcut: 'S', description: 'Stop/yield signs' },
  ],
  food_classification: [
    { id: 'pizza', name: 'Pizza', color: '#EF4444', shortcut: '1', description: 'Pizza dishes' },
    { id: 'burger', name: 'Burger', color: '#F97316', shortcut: '2', description: 'Burgers and sandwiches' },
    { id: 'salad', name: 'Salad', color: '#10B981', shortcut: '3', description: 'Salads and greens' },
    { id: 'pasta', name: 'Pasta', color: '#EAB308', shortcut: '4', description: 'Pasta dishes' },
    { id: 'seafood', name: 'Seafood', color: '#3B82F6', shortcut: '5', description: 'Fish and seafood' },
    { id: 'dessert', name: 'Dessert', color: '#EC4899', shortcut: '6', description: 'Sweets and desserts' },
    { id: 'soup', name: 'Soup', color: '#8B5CF6', shortcut: '7', description: 'Soups and stews' },
    { id: 'meat', name: 'Meat', color: '#B45309', shortcut: '8', description: 'Meat dishes' },
    { id: 'vegetarian', name: 'Vegetarian', color: '#059669', shortcut: '9', description: 'Vegetarian options' },
    { id: 'other', name: 'Other', color: '#6B7280', shortcut: '0', description: 'Other food types' },
  ],
  medical_imaging: [
    { id: 'normal', name: 'Normal', color: '#10B981', shortcut: 'N', description: 'No abnormalities' },
    { id: 'abnormal', name: 'Abnormal', color: '#EF4444', shortcut: 'A', description: 'Abnormalities present' },
    { id: 'uncertain', name: 'Uncertain', color: '#EAB308', shortcut: 'U', description: 'Needs review' },
  ]
};

// Sample images for demo - in real app, these come from task data
const SAMPLE_IMAGES = [
  'https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1512621776951-a57141f2eefd?w=800&h=600&fit=crop',
  'https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=800&h=600&fit=crop',
];

export function DataAnnotationInterface({ task, onAnnotationsChange, onComplete }: DataAnnotationInterfaceProps) {
  // Canvas and image refs
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const containerRef = useRef<HTMLDivElement>(null);
  const [imageLoaded, setImageLoaded] = useState(false);
  const [imageDimensions, setImageDimensions] = useState({ width: 0, height: 0 });
  
  // Annotation state
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [annotations, setAnnotations] = useState<BoundingBox[]>([]);
  const [allAnnotations, setAllAnnotations] = useState<Record<number, BoundingBox[]>>({});
  const [selectedAnnotation, setSelectedAnnotation] = useState<string | null>(null);
  const [history, setHistory] = useState<BoundingBox[][]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  
  // Drawing state
  const [isDrawing, setIsDrawing] = useState(false);
  const [drawStart, setDrawStart] = useState<{ x: number; y: number } | null>(null);
  const [currentBox, setCurrentBox] = useState<Partial<BoundingBox> | null>(null);
  
  // UI state
  const [selectedLabel, setSelectedLabel] = useState<Label | null>(null);
  const [tool, setTool] = useState<'select' | 'draw' | 'pan'>('draw');
  const [zoom, setZoom] = useState(1);
  const [showLabels, setShowLabels] = useState(true);
  const [confidence, setConfidence] = useState(95);
  
  // Get labels based on task type
  const getLabels = useCallback((): Label[] => {
    const taskType = task?.type?.toLowerCase() || '';
    const category = task?.category?.toLowerCase() || '';
    
    if (taskType.includes('food') || category.includes('food')) {
      return DEFAULT_LABELS.food_classification;
    }
    if (taskType.includes('medical') || category.includes('medical')) {
      return DEFAULT_LABELS.medical_imaging;
    }
    if (task?.taskData?.categories) {
      return task.taskData.categories.map((cat: string, idx: number) => ({
        id: cat.toLowerCase().replace(/\s+/g, '_'),
        name: cat,
        color: `hsl(${(idx * 137.5) % 360}, 70%, 50%)`,
        shortcut: String(idx + 1),
        description: cat
      }));
    }
    return DEFAULT_LABELS.object_detection;
  }, [task]);

  const labels = getLabels();
  
  // Get images from task or use samples
  const getImages = useCallback((): string[] => {
    if (task?.taskData?.images && task.taskData.images.length > 0) {
      return task.taskData.images;
    }
    if (task?.imageUrl) {
      return [task.imageUrl];
    }
    return SAMPLE_IMAGES;
  }, [task]);

  const images = getImages();
  const currentImage = images[currentImageIndex];

  // Initialize selected label
  useEffect(() => {
    if (labels.length > 0 && !selectedLabel) {
      setSelectedLabel(labels[0]);
    }
  }, [labels, selectedLabel]);

  // Load image and set up canvas
  useEffect(() => {
    const img = new window.Image();
    img.crossOrigin = 'anonymous';
    img.onload = () => {
      setImageLoaded(true);
      setImageDimensions({ width: img.width, height: img.height });
    };
    img.onerror = () => {
      console.error('Failed to load image:', currentImage);
      setImageLoaded(false);
    };
    img.src = currentImage;
  }, [currentImage]);

  // Draw canvas
  useEffect(() => {
    if (!canvasRef.current || !imageLoaded) return;
    
    const canvas = canvasRef.current;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Clear canvas
    ctx.clearRect(0, 0, canvas.width, canvas.height);

    // Draw existing annotations
    annotations.forEach(box => {
      const isSelected = box.id === selectedAnnotation;
      
      // Draw box
      ctx.strokeStyle = box.color;
      ctx.lineWidth = isSelected ? 3 : 2;
      ctx.fillStyle = box.color + '30';
      
      ctx.beginPath();
      ctx.rect(box.x * zoom, box.y * zoom, box.width * zoom, box.height * zoom);
      ctx.fill();
      ctx.stroke();

      // Draw label
      if (showLabels) {
        const labelText = `${box.label} (${box.confidence}%)`;
        ctx.font = '12px Inter, system-ui, sans-serif';
        const textWidth = ctx.measureText(labelText).width;
        
        // Label background
        ctx.fillStyle = box.color;
        ctx.fillRect(box.x * zoom, (box.y * zoom) - 22, textWidth + 12, 22);
        
        // Label text
        ctx.fillStyle = 'white';
        ctx.fillText(labelText, (box.x * zoom) + 6, (box.y * zoom) - 6);
      }

      // Draw resize handles if selected
      if (isSelected) {
        const handles = [
          { x: box.x, y: box.y },
          { x: box.x + box.width, y: box.y },
          { x: box.x, y: box.y + box.height },
          { x: box.x + box.width, y: box.y + box.height },
        ];
        
        handles.forEach(handle => {
          ctx.fillStyle = 'white';
          ctx.strokeStyle = box.color;
          ctx.lineWidth = 2;
          ctx.beginPath();
          ctx.arc(handle.x * zoom, handle.y * zoom, 6, 0, Math.PI * 2);
          ctx.fill();
          ctx.stroke();
        });
      }
    });

    // Draw current box being drawn
    if (currentBox && currentBox.x !== undefined && currentBox.width !== undefined) {
      ctx.strokeStyle = selectedLabel?.color || '#3B82F6';
      ctx.lineWidth = 2;
      ctx.setLineDash([5, 5]);
      ctx.strokeRect(
        currentBox.x * zoom, 
        currentBox.y! * zoom, 
        currentBox.width * zoom, 
        currentBox.height! * zoom
      );
      ctx.setLineDash([]);
    }
  }, [annotations, currentBox, selectedAnnotation, zoom, showLabels, selectedLabel, imageLoaded]);

  // Mouse event handlers
  const handleMouseDown = (e: React.MouseEvent) => {
    if (tool !== 'draw' || !selectedLabel) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setIsDrawing(true);
    setDrawStart({ x, y });
    setCurrentBox({ x, y, width: 0, height: 0 });
  };

  const handleMouseMove = (e: React.MouseEvent) => {
    if (!isDrawing || !drawStart) return;
    
    const rect = canvasRef.current?.getBoundingClientRect();
    if (!rect) return;
    
    const x = (e.clientX - rect.left) / zoom;
    const y = (e.clientY - rect.top) / zoom;
    
    setCurrentBox({
      x: Math.min(drawStart.x, x),
      y: Math.min(drawStart.y, y),
      width: Math.abs(x - drawStart.x),
      height: Math.abs(y - drawStart.y),
    });
  };

  const handleMouseUp = () => {
    if (!isDrawing || !currentBox || !selectedLabel) return;
    
    // Only add if box is large enough
    if (currentBox.width! > 10 && currentBox.height! > 10) {
      const newBox: BoundingBox = {
        id: `box-${Date.now()}`,
        x: currentBox.x!,
        y: currentBox.y!,
        width: currentBox.width!,
        height: currentBox.height!,
        label: selectedLabel.name,
        confidence,
        color: selectedLabel.color,
      };
      
      const newAnnotations = [...annotations, newBox];
      setAnnotations(newAnnotations);
      
      // Add to history
      const newHistory = history.slice(0, historyIndex + 1);
      newHistory.push(newAnnotations);
      setHistory(newHistory);
      setHistoryIndex(newHistory.length - 1);
      
      onAnnotationsChange(newAnnotations);
      toast.success(`Added ${selectedLabel.name} annotation`);
    }
    
    setIsDrawing(false);
    setDrawStart(null);
    setCurrentBox(null);
  };

  // Delete annotation
  const deleteAnnotation = (id: string) => {
    const newAnnotations = annotations.filter(a => a.id !== id);
    setAnnotations(newAnnotations);
    setSelectedAnnotation(null);
    onAnnotationsChange(newAnnotations);
    toast.success('Annotation deleted');
  };

  // Undo/Redo
  const undo = () => {
    if (historyIndex > 0) {
      setHistoryIndex(historyIndex - 1);
      setAnnotations(history[historyIndex - 1]);
    }
  };

  const redo = () => {
    if (historyIndex < history.length - 1) {
      setHistoryIndex(historyIndex + 1);
      setAnnotations(history[historyIndex + 1]);
    }
  };

  // Navigate images
  const goToImage = (index: number) => {
    // Save current annotations
    setAllAnnotations(prev => ({
      ...prev,
      [currentImageIndex]: annotations
    }));
    
    // Load annotations for new image
    setCurrentImageIndex(index);
    setAnnotations(allAnnotations[index] || []);
    setSelectedAnnotation(null);
    setImageLoaded(false);
  };

  // Complete annotation task
  const handleComplete = () => {
    const finalAnnotations = {
      ...allAnnotations,
      [currentImageIndex]: annotations
    };
    
    const totalAnnotations = Object.values(finalAnnotations).flat().length;
    
    onComplete({
      annotations: finalAnnotations,
      totalImages: images.length,
      totalAnnotations,
      completedAt: new Date().toISOString()
    });
  };

  // Count annotations per label
  const getAnnotationCounts = () => {
    const counts: Record<string, number> = {};
    labels.forEach(label => {
      counts[label.id] = annotations.filter(a => a.label === label.name).length;
    });
    return counts;
  };

  const annotationCounts = getAnnotationCounts();
  const completedImages = Object.keys(allAnnotations).length + (annotations.length > 0 ? 1 : 0);

  return (
    <div className="space-y-4">
      {/* Toolbar */}
      <Card>
        <CardContent className="py-3">
          <div className="flex items-center justify-between flex-wrap gap-3">
            {/* Tools */}
            <div className="flex items-center gap-2">
              <div className="flex items-center bg-gray-100 rounded-lg p-1">
                <Button
                  variant={tool === 'select' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTool('select')}
                  title="Select (V)"
                >
                  <MousePointer className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool === 'draw' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTool('draw')}
                  title="Draw Box (B)"
                >
                  <Square className="w-4 h-4" />
                </Button>
                <Button
                  variant={tool === 'pan' ? 'default' : 'ghost'}
                  size="sm"
                  onClick={() => setTool('pan')}
                  title="Pan (H)"
                >
                  <Move className="w-4 h-4" />
                </Button>
              </div>

              <div className="border-l pl-2 flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={undo} disabled={historyIndex <= 0} title="Undo">
                  <Undo className="w-4 h-4" />
                </Button>
                <Button variant="ghost" size="sm" onClick={redo} disabled={historyIndex >= history.length - 1} title="Redo">
                  <Redo className="w-4 h-4" />
                </Button>
              </div>

              <div className="border-l pl-2 flex items-center gap-1">
                <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.max(0.5, z - 0.25))} title="Zoom Out">
                  <ZoomOut className="w-4 h-4" />
                </Button>
                <span className="text-sm font-medium min-w-[50px] text-center">{Math.round(zoom * 100)}%</span>
                <Button variant="ghost" size="sm" onClick={() => setZoom(z => Math.min(2, z + 0.25))} title="Zoom In">
                  <ZoomIn className="w-4 h-4" />
                </Button>
              </div>
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowLabels(!showLabels)}
                title={showLabels ? 'Hide Labels' : 'Show Labels'}
              >
                {showLabels ? <Eye className="w-4 h-4" /> : <EyeOff className="w-4 h-4" />}
              </Button>
              <Badge variant="secondary">
                {annotations.length} annotations
              </Badge>
            </div>

            {/* Image Navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToImage(Math.max(0, currentImageIndex - 1))}
                disabled={currentImageIndex === 0}
              >
                <ChevronLeft className="w-4 h-4" />
              </Button>
              <span className="text-sm font-medium">
                {currentImageIndex + 1} / {images.length}
              </span>
              <Button
                variant="outline"
                size="sm"
                onClick={() => goToImage(Math.min(images.length - 1, currentImageIndex + 1))}
                disabled={currentImageIndex === images.length - 1}
              >
                <ChevronRight className="w-4 h-4" />
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Canvas Area */}
        <div className="lg:col-span-3">
          <Card>
            <CardContent className="p-2">
              <div 
                ref={containerRef}
                className="relative bg-gray-900 rounded-lg overflow-hidden"
                style={{ minHeight: '500px' }}
              >
                {/* Image */}
                {imageLoaded ? (
                  <div className="relative">
                    <img
                      src={currentImage}
                      alt={`Image ${currentImageIndex + 1}`}
                      className="max-w-full"
                      style={{ 
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left'
                      }}
                      draggable={false}
                    />
                    <canvas
                      ref={canvasRef}
                      width={imageDimensions.width}
                      height={imageDimensions.height}
                      className="absolute top-0 left-0 cursor-crosshair"
                      style={{ 
                        transform: `scale(${zoom})`,
                        transformOrigin: 'top left'
                      }}
                      onMouseDown={handleMouseDown}
                      onMouseMove={handleMouseMove}
                      onMouseUp={handleMouseUp}
                      onMouseLeave={handleMouseUp}
                    />
                  </div>
                ) : (
                  <div className="flex items-center justify-center h-[500px]">
                    <div className="text-center text-white">
                      <Image className="w-12 h-12 mx-auto mb-3 opacity-50" />
                      <p>Loading image...</p>
                    </div>
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Labels Panel */}
        <div className="space-y-4">
          {/* Label Selection */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Tag className="w-4 h-4" />
                Labels
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              {labels.map(label => (
                <button
                  key={label.id}
                  onClick={() => setSelectedLabel(label)}
                  className={`w-full flex items-center gap-3 p-2 rounded-lg transition-all text-left ${
                    selectedLabel?.id === label.id
                      ? 'ring-2 ring-blue-500 bg-blue-50'
                      : 'hover:bg-gray-50'
                  }`}
                >
                  <div
                    className="w-4 h-4 rounded"
                    style={{ backgroundColor: label.color }}
                  />
                  <div className="flex-1">
                    <div className="text-sm font-medium">{label.name}</div>
                    <div className="text-xs text-gray-500">{label.description}</div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Badge variant="secondary" className="text-xs">
                      {label.shortcut}
                    </Badge>
                    {annotationCounts[label.id] > 0 && (
                      <Badge className="text-xs">{annotationCounts[label.id]}</Badge>
                    )}
                  </div>
                </button>
              ))}
            </CardContent>
          </Card>

          {/* Confidence Slider */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center justify-between">
                <span>Confidence</span>
                <span className="text-blue-600">{confidence}%</span>
              </CardTitle>
            </CardHeader>
            <CardContent>
              <input
                type="range"
                min="50"
                max="100"
                value={confidence}
                onChange={(e) => setConfidence(parseInt(e.target.value))}
                className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
              />
              <div className="flex justify-between text-xs text-gray-500 mt-1">
                <span>Low</span>
                <span>High</span>
              </div>
            </CardContent>
          </Card>

          {/* Annotations List */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Layers className="w-4 h-4" />
                Annotations ({annotations.length})
              </CardTitle>
            </CardHeader>
            <CardContent>
              {annotations.length === 0 ? (
                <div className="text-center py-4 text-gray-500 text-sm">
                  <Info className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p>No annotations yet</p>
                  <p className="text-xs">Draw boxes on the image</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[200px] overflow-y-auto">
                  {annotations.map((ann) => (
                    <div
                      key={ann.id}
                      className={`flex items-center gap-2 p-2 rounded-lg cursor-pointer ${
                        selectedAnnotation === ann.id ? 'bg-blue-50' : 'hover:bg-gray-50'
                      }`}
                      onClick={() => setSelectedAnnotation(ann.id)}
                    >
                      <div
                        className="w-3 h-3 rounded"
                        style={{ backgroundColor: ann.color }}
                      />
                      <span className="flex-1 text-sm">{ann.label}</span>
                      <span className="text-xs text-gray-500">{ann.confidence}%</span>
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteAnnotation(ann.id);
                        }}
                      >
                        <Trash2 className="w-3 h-3 text-red-500" />
                      </Button>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Progress</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Images</span>
                  <span>{completedImages}/{images.length}</span>
                </div>
                <Progress value={(completedImages / images.length) * 100} />
              </div>
              
              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={completedImages < images.length}
              >
                <Check className="w-4 h-4 mr-2" />
                Complete Annotations
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
