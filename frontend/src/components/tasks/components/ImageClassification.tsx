import { useState } from 'react';
import { ArrowLeft, Info, Check } from 'lucide-react';
// Using regular img tag instead of ImageWithFallback

interface ImageClassificationProps {
  onComplete: (taskId: string) => void;
  onBack: () => void;
}

const categories = [
  { id: 'outdoor', label: 'Outdoor Scene', description: 'Parks, streets, nature' },
  { id: 'indoor', label: 'Indoor Scene', description: 'Rooms, buildings interior' },
  { id: 'food', label: 'Food & Beverage', description: 'Meals, drinks, ingredients' },
  { id: 'people', label: 'People', description: 'Portraits, groups, activities' },
  { id: 'animal', label: 'Animals', description: 'Pets, wildlife, marine life' },
  { id: 'vehicle', label: 'Vehicles', description: 'Cars, bikes, transportation' },
  { id: 'object', label: 'Objects', description: 'Products, tools, items' },
  { id: 'abstract', label: 'Abstract/Art', description: 'Patterns, artwork, graphics' }
];

const images = [
  { url: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&h=600&fit=crop', correctCategory: 'outdoor' },
  { url: 'https://images.unsplash.com/photo-1504674900247-0877df9cc836?w=800&h=600&fit=crop', correctCategory: 'food' },
  { url: 'https://images.unsplash.com/photo-1415369629372-26f2fe60c467?w=800&h=600&fit=crop', correctCategory: 'vehicle' }
];

export function ImageClassification({ onComplete, onBack }: ImageClassificationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null);
  const [confidence, setConfidence] = useState<'low' | 'medium' | 'high'>('high');

  const progress = ((currentIndex + 1) / images.length) * 100;

  const handleSubmit = () => {
    if (selectedCategory) {
      if (currentIndex < images.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setSelectedCategory(null);
        setConfidence('high');
      } else {
        onComplete('img-class-1');
      }
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-5xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-gray-900">Image Classification</h2>
                <p className="text-sm text-gray-600">Categorize images into the most appropriate category</p>
              </div>
            </div>
            <span className="text-sm text-gray-600">Payment: <span className="text-green-600">$0.08</span></span>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{currentIndex + 1} of {images.length}</span>
            </div>
            <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
              <div 
                className="h-full bg-blue-600 transition-all duration-300"
                style={{ width: `${progress}%` }}
              />
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-5xl mx-auto p-6">
        {/* Instructions */}
        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-6 flex items-start gap-3">
          <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
          <div className="text-sm text-blue-900">
            <p className="mb-2">Classification Guidelines:</p>
            <ul className="list-disc list-inside space-y-1 ml-2">
              <li>Select the PRIMARY category that best describes the image</li>
              <li>If multiple categories apply, choose the most dominant one</li>
              <li>Set confidence level based on how clear the category is</li>
              <li>Skip images that are unclear or corrupted (not available in demo)</li>
            </ul>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Image */}
          <div className="lg:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Image to Classify</h3>
              <div className="relative aspect-video bg-gray-100 rounded-lg overflow-hidden">
                <img
                  src={images[currentIndex].url}
                  alt="Image to classify"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Categories */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <h3 className="text-gray-900 mb-4">Select Category</h3>
              <div className="space-y-2 mb-6 max-h-96 overflow-y-auto">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    onClick={() => setSelectedCategory(category.id)}
                    className={`w-full p-3 rounded-lg text-left transition-all border-2 ${
                      selectedCategory === category.id
                        ? 'bg-blue-50 border-blue-500 ring-2 ring-blue-200'
                        : 'bg-gray-50 border-gray-200 hover:border-gray-300'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-2">
                      <div>
                        <div className="text-sm text-gray-900 mb-1">{category.label}</div>
                        <div className="text-xs text-gray-600">{category.description}</div>
                      </div>
                      {selectedCategory === category.id && (
                        <Check className="w-5 h-5 text-blue-600 flex-shrink-0" />
                      )}
                    </div>
                  </button>
                ))}
              </div>

              {selectedCategory && (
                <>
                  <h3 className="text-gray-900 mb-3">Confidence Level</h3>
                  <div className="space-y-2 mb-6">
                    {[
                      { value: 'high', label: 'High', desc: 'Very clear category' },
                      { value: 'medium', label: 'Medium', desc: 'Somewhat clear' },
                      { value: 'low', label: 'Low', desc: 'Uncertain/ambiguous' }
                    ].map((conf) => (
                      <button
                        key={conf.value}
                        onClick={() => setConfidence(conf.value as any)}
                        className={`w-full p-3 rounded-lg text-left transition-all ${
                          confidence === conf.value
                            ? 'bg-green-50 border-2 border-green-500'
                            : 'bg-gray-50 border-2 border-gray-200 hover:border-gray-300'
                        }`}
                      >
                        <div className="flex items-center justify-between">
                          <div>
                            <div className="text-sm text-gray-900">{conf.label}</div>
                            <div className="text-xs text-gray-600">{conf.desc}</div>
                          </div>
                          {confidence === conf.value && (
                            <Check className="w-5 h-5 text-green-600" />
                          )}
                        </div>
                      </button>
                    ))}
                  </div>
                </>
              )}

              <button
                onClick={handleSubmit}
                disabled={!selectedCategory}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentIndex < images.length - 1 ? 'Next Image' : 'Submit Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
