import { useState, useRef } from 'react';
import { ArrowLeft, Info, Target, Trash2 } from 'lucide-react';
// Using regular img tag instead of ImageWithFallback

interface Keypoint {
  id: string;
  x: number;
  y: number;
  label: string;
  color: string;
}

interface KeypointAnnotationProps {
  onComplete: (taskId: string) => void;
  onBack: () => void;
}

const keypointTypes = [
  { name: 'Head', color: '#EF4444' },
  { name: 'Neck', color: '#F59E0B' },
  { name: 'Left Shoulder', color: '#10B981' },
  { name: 'Right Shoulder', color: '#3B82F6' },
  { name: 'Left Elbow', color: '#8B5CF6' },
  { name: 'Right Elbow', color: '#EC4899' },
  { name: 'Left Wrist', color: '#14B8A6' },
  { name: 'Right Wrist', color: '#F97316' },
  { name: 'Left Hip', color: '#6366F1' },
  { name: 'Right Hip', color: '#84CC16' },
  { name: 'Left Knee', color: '#06B6D4' },
  { name: 'Right Knee', color: '#A855F7' },
  { name: 'Left Ankle', color: '#EAB308' },
  { name: 'Right Ankle', color: '#22C55E' }
];

export function KeypointAnnotation({ onComplete, onBack }: KeypointAnnotationProps) {
  const [keypoints, setKeypoints] = useState<Keypoint[]>([]);
  const [selectedType, setSelectedType] = useState(keypointTypes[0]);
  const containerRef = useRef<HTMLDivElement>(null);

  const handleClick = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    // Check if this keypoint type already exists
    const existingKeypoint = keypoints.find(kp => kp.label === selectedType.name);
    
    if (existingKeypoint) {
      // Update existing keypoint
      setKeypoints(keypoints.map(kp => 
        kp.label === selectedType.name 
          ? { ...kp, x, y }
          : kp
      ));
    } else {
      // Add new keypoint
      const newKeypoint: Keypoint = {
        id: Date.now().toString(),
        x,
        y,
        label: selectedType.name,
        color: selectedType.color
      };
      setKeypoints([...keypoints, newKeypoint]);
      
      // Auto-advance to next keypoint type
      const currentIndex = keypointTypes.findIndex(kt => kt.name === selectedType.name);
      if (currentIndex < keypointTypes.length - 1) {
        setSelectedType(keypointTypes[currentIndex + 1]);
      }
    }
  };

  const deleteKeypoint = (id: string) => {
    setKeypoints(keypoints.filter(kp => kp.id !== id));
  };

  const handleSubmit = () => {
    if (keypoints.length >= 5) {
      onComplete('keypoint-1');
    }
  };

  const getKeypointStatus = (typeName: string) => {
    return keypoints.find(kp => kp.label === typeName);
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
                <h2 className="text-gray-900">Keypoint Annotation</h2>
                <p className="text-sm text-gray-600">Mark specific body joints and key points</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <span className="text-sm text-gray-600">Payment: <span className="text-green-600">$0.20</span></span>
              <button
                onClick={handleSubmit}
                disabled={keypoints.length < 5}
                className="px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                Submit Keypoints
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
                  <p className="mb-2">Click on the image to place keypoints.</p>
                  <p>Select keypoint type first, then click its location. Click again to update position.</p>
                </div>
              </div>

              <div className="flex items-center justify-between mb-3">
                <h3 className="text-gray-900">Keypoints</h3>
                <span className="text-sm text-gray-600">{keypoints.length}/{keypointTypes.length}</span>
              </div>
              
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {keypointTypes.map((type) => {
                  const placed = getKeypointStatus(type.name);
                  return (
                    <button
                      key={type.name}
                      onClick={() => setSelectedType(type)}
                      className={`w-full px-3 py-2 rounded-lg text-left transition-all flex items-center gap-2 ${
                        selectedType.name === type.name
                          ? 'bg-blue-600 text-white'
                          : placed
                          ? 'bg-green-50 text-green-900 hover:bg-green-100'
                          : 'bg-gray-50 text-gray-700 hover:bg-gray-100'
                      }`}
                    >
                      <div 
                        className="w-3 h-3 rounded-full flex-shrink-0"
                        style={{ 
                          backgroundColor: selectedType.name === type.name ? 'white' : type.color 
                        }}
                      />
                      <span className="text-sm flex-1">{type.name}</span>
                      {placed && (
                        <Target className="w-4 h-4 flex-shrink-0" />
                      )}
                    </button>
                  );
                })}
              </div>

              <div className="p-3 bg-purple-50 border border-purple-200 rounded-lg">
                <p className="text-xs text-purple-900">
                  <span>Tip:</span> Mark at least 5 keypoints to submit. Place points as accurately as possible on the joints.
                </p>
              </div>
            </div>
          </div>

          {/* Main Canvas */}
          <div className="lg:col-span-3">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <div className="flex items-center justify-between mb-4">
                <h3 className="text-gray-900">Annotation Area</h3>
                <div className="flex items-center gap-2 text-sm text-gray-600">
                  <div 
                    className="w-3 h-3 rounded-full"
                    style={{ backgroundColor: selectedType.color }}
                  />
                  <span>Active: {selectedType.name}</span>
                </div>
              </div>
              
              <div
                ref={containerRef}
                className="relative w-full aspect-video bg-gray-100 rounded-lg overflow-hidden cursor-crosshair"
                onClick={handleClick}
              >
                <img
                  src="https://images.unsplash.com/photo-1571019614242-c5c5dee9f50b?w=1200&h=800&fit=crop"
                  alt="Image to annotate keypoints"
                  className="w-full h-full object-cover pointer-events-none select-none"
                />
                
                {/* Render keypoints */}
                {keypoints.map((keypoint) => (
                  <div key={keypoint.id}>
                    {/* Keypoint marker */}
                    <div
                      className="absolute w-4 h-4 rounded-full border-2 border-white shadow-lg cursor-pointer transform -translate-x-1/2 -translate-y-1/2 hover:scale-125 transition-transform"
                      style={{
                        left: `${keypoint.x}px`,
                        top: `${keypoint.y}px`,
                        backgroundColor: keypoint.color
                      }}
                      onClick={(e) => {
                        e.stopPropagation();
                        setSelectedType(keypointTypes.find(kt => kt.name === keypoint.label)!);
                      }}
                    />
                    
                    {/* Label */}
                    <div
                      className="absolute px-2 py-1 rounded text-white text-xs whitespace-nowrap pointer-events-none"
                      style={{
                        left: `${keypoint.x + 10}px`,
                        top: `${keypoint.y - 10}px`,
                        backgroundColor: keypoint.color
                      }}
                    >
                      {keypoint.label}
                    </div>
                  </div>
                ))}

                {/* Connecting lines (skeleton) */}
                <svg className="absolute inset-0 w-full h-full pointer-events-none">
                  {/* Example connections - you can customize these */}
                  {[
                    ['Head', 'Neck'],
                    ['Neck', 'Left Shoulder'],
                    ['Neck', 'Right Shoulder'],
                    ['Left Shoulder', 'Left Elbow'],
                    ['Right Shoulder', 'Right Elbow'],
                    ['Left Elbow', 'Left Wrist'],
                    ['Right Elbow', 'Right Wrist'],
                    ['Neck', 'Left Hip'],
                    ['Neck', 'Right Hip'],
                    ['Left Hip', 'Left Knee'],
                    ['Right Hip', 'Right Knee'],
                    ['Left Knee', 'Left Ankle'],
                    ['Right Knee', 'Right Ankle']
                  ].map(([start, end]) => {
                    const startPoint = keypoints.find(kp => kp.label === start);
                    const endPoint = keypoints.find(kp => kp.label === end);
                    
                    if (startPoint && endPoint) {
                      return (
                        <line
                          key={`${start}-${end}`}
                          x1={startPoint.x}
                          y1={startPoint.y}
                          x2={endPoint.x}
                          y2={endPoint.y}
                          stroke="#3B82F6"
                          strokeWidth="2"
                          opacity="0.6"
                        />
                      );
                    }
                    return null;
                  })}
                </svg>
              </div>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg">
                <p className="text-sm text-yellow-900">
                  <span>Quality Tips:</span> Place keypoints precisely on joint centers, verify all visible points are marked, use anatomical knowledge for occluded points, click existing points to reposition them.
                </p>
              </div>
            </div>

            {/* Placed Keypoints List */}
            {keypoints.length > 0 && (
              <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 mt-6">
                <h3 className="text-gray-900 mb-4">Placed Keypoints ({keypoints.length})</h3>
                <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                  {keypoints.map((keypoint) => (
                    <div 
                      key={keypoint.id}
                      className="flex items-center justify-between p-2 bg-gray-50 rounded border border-gray-200"
                    >
                      <div className="flex items-center gap-2">
                        <div 
                          className="w-3 h-3 rounded-full"
                          style={{ backgroundColor: keypoint.color }}
                        />
                        <span className="text-sm text-gray-700">{keypoint.label}</span>
                      </div>
                      <button
                        onClick={() => deleteKeypoint(keypoint.id)}
                        className="text-red-600 hover:text-red-700 p-1"
                      >
                        <Trash2 className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
