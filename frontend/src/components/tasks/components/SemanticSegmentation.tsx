import { useState, useRef, useEffect } from 'react';
import { ArrowLeft, Info, Paintbrush, Eraser, RotateCcw } from 'lucide-react';
// Using regular img tag instead of ImageWithFallback

interface SemanticSegmentationProps {
  onComplete: (taskId: string) => void;
  onBack: () => void;
}

const labels = [
  { name: 'Road', color: '#6B7280' },
  { name: 'Sidewalk', color: '#F59E0B' },
  { name: 'Building', color: '#EF4444' },
  { name: 'Sky', color: '#3B82F6' },
  { name: 'Vegetation', color: '#10B981' },
  { name: 'Vehicle', color: '#8B5CF6' }
];

export function SemanticSegmentation({ onComplete, onBack }: SemanticSegmentationProps) {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [isDrawing, setIsDrawing] = useState(false);
  const [selectedLabel, setSelectedLabel] = useState(labels[0]);
  const [brushSize, setBrushSize] = useState(20);
  const [tool, setTool] = useState<'brush' | 'eraser'>('brush');
  const [hasAnnotations, setHasAnnotations] = useState(false);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    // Set canvas size
    canvas.width = canvas.offsetWidth;
    canvas.height = canvas.offsetHeight;
  }, []);

  const startDrawing = (e: React.MouseEvent<HTMLCanvasElement>) => {
    setIsDrawing(true);
    draw(e);
  };

  const stopDrawing = () => {
    setIsDrawing(false);
  };

  const draw = (e: React.MouseEvent<HTMLCanvasElement>) => {
    if (!isDrawing && e.type !== 'mousedown') return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    ctx.beginPath();
    ctx.arc(x, y, brushSize, 0, Math.PI * 2);
    
    if (tool === 'eraser') {
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0,0,0,1)';
    } else {
      ctx.globalCompositeOperation = 'source-over';
      ctx.fillStyle = selectedLabel.color + '80'; // 50% opacity
    }
    
    ctx.fill();
    setHasAnnotations(true);
  };

  const clearCanvas = () => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    setHasAnnotations(false);
  };

  const handleSubmit = () => {
    if (hasAnnotations) {
      onComplete('seg-1');
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-gray-900">Semantic Segmentation</h2>
                <p className="text-sm text-gray-600">Paint pixel-perfect masks for each object class</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Payment: <span className="text-green-600">$0.25</span></span>
              <button
                onClick={handleSubmit}
                disabled={!hasAnnotations}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Segmentation
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-2">Paint over objects with their corresponding class color.</p>
                  <p>Use eraser to fix mistakes. Be precise around edges.</p>
                </div>
              </div>

              {/* Tools */}
              <h3 className="text-gray-900 mb-3">Tool</h3>
              <div className="grid grid-cols-2 gap-2 mb-6">
                <button
                  onClick={() => setTool('brush')}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    tool === 'brush'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Paintbrush className="w-5 h-5" />
                  <span className="text-xs">Brush</span>
                </button>
                <button
                  onClick={() => setTool('eraser')}
                  className={`p-3 rounded-lg flex flex-col items-center gap-2 transition-all ${
                    tool === 'eraser'
                      ? 'bg-blue-600 text-white'
                      : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                  }`}
                >
                  <Eraser className="w-5 h-5" />
                  <span className="text-xs">Eraser</span>
                </button>
              </div>

              {/* Brush Size */}
              <h3 className="text-gray-900 mb-3">Brush Size: {brushSize}px</h3>
              <input
                type="range"
                min="5"
                max="50"
                value={brushSize}
                onChange={(e) => setBrushSize(Number(e.target.value))}
                className="w-full mb-6"
              />

              {/* Classes */}
              <h3 className="text-gray-900 mb-3">Select Class</h3>
              <div className="space-y-2 mb-6">
                {labels.map((label) => (
                  <button
                    key={label.name}
                    onClick={() => {
                      setSelectedLabel(label);
                      setTool('brush');
                    }}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-all flex items-center gap-3 ${
                      selectedLabel.name === label.name && tool === 'brush'
                        ? 'ring-2 ring-offset-2'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedLabel.name === label.name && tool === 'brush' ? `${label.color}30` : undefined,
                      borderLeft: `4px solid ${label.color}`
                    }}
                  >
                    <div 
                      className="w-6 h-6 rounded"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm text-gray-900">{label.name}</span>
                  </button>
                ))}
              </div>

              <button
                onClick={clearCanvas}
                className="w-full px-4 py-2 bg-red-50 text-red-700 rounded-lg hover:bg-red-100 transition-colors flex items-center justify-center gap-2"
              >
                <RotateCcw className="w-4 h-4" />
                Clear All
              </button>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Segmentation Canvas</h3>
                <div className="text-sm text-gray-600">
                  Active: <span style={{ color: tool === 'brush' ? selectedLabel.color : '#000' }}>
                    {tool === 'brush' ? selectedLabel.name : 'Eraser'}
                  </span>
                </div>
              </div>
              
              <div className="relative">
                {/* Background Image */}
                <div className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden">
                  <img
                    src="https://images.unsplash.com/photo-1449824913935-59a10b8d2000?w=1200&h=800&fit=crop"
                    alt="Image to segment"
                    className="w-full h-full object-cover"
                  />
                  
                  {/* Overlay Canvas */}
                  <canvas
                    ref={canvasRef}
                    className="absolute inset-0 w-full h-full cursor-crosshair"
                    onMouseDown={startDrawing}
                    onMouseMove={draw}
                    onMouseUp={stopDrawing}
                    onMouseLeave={stopDrawing}
                  />
                </div>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  <span>Quality Tips:</span> Paint carefully along object boundaries, avoid gaps in segmentation, use appropriate brush sizes for different areas, switch between classes as needed.
                </p>
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
              <h3 className="text-gray-900 mb-4">Class Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
                {labels.map((label) => (
                  <div key={label.name} className="flex items-center gap-3">
                    <div 
                      className="w-8 h-8 rounded"
                      style={{ backgroundColor: label.color }}
                    />
                    <span className="text-sm text-gray-700">{label.name}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
