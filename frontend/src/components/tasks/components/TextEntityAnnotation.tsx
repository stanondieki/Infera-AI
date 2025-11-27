import { useState } from 'react';
import { ArrowLeft, Info, Tag } from 'lucide-react';

interface Entity {
  id: string;
  text: string;
  type: string;
  start: number;
  end: number;
  color: string;
}

interface TextEntityAnnotationProps {
  task: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

const entityTypes = [
  { name: 'Person', color: '#3B82F6', description: 'Names of people' },
  { name: 'Organization', color: '#10B981', description: 'Companies, institutions' },
  { name: 'Location', color: '#F59E0B', description: 'Cities, countries, places' },
  { name: 'Date', color: '#8B5CF6', description: 'Dates and times' },
  { name: 'Product', color: '#EC4899', description: 'Product names' },
  { name: 'Money', color: '#14B8A6', description: 'Monetary amounts' }
];

export function TextEntityAnnotation({ task, onComplete, onBack }: TextEntityAnnotationProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [entities, setEntities] = useState<Entity[]>([]);
  const [selectedType, setSelectedType] = useState(entityTypes[0]);
  const [selectedText, setSelectedText] = useState<{ text: string; start: number; end: number } | null>(null);

  // Get text data from REAL task - no mock data
  const getTaskTexts = () => {
    if (!task?.taskData?.inputs || !Array.isArray(task.taskData.inputs) || task.taskData.inputs.length === 0) {
      console.error('❌ No text data found in task. Task must have text in taskData.inputs');
      return [];
    }
    return task.taskData.inputs.map((input: any) => input.text || input.content || input.value);
  };

  const taskTexts = getTaskTexts();
  const currentText = taskTexts[currentIndex];

  // Show error if no texts are available
  if (!taskTexts || taskTexts.length === 0) {
    return (
      <div className="min-h-screen bg-gray-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-xl shadow-lg p-8 max-w-md text-center">
          <div className="text-6xl mb-4">📝</div>
          <h2 className="text-2xl font-bold text-gray-900 mb-2">No Text Data Available</h2>
          <p className="text-gray-600 mb-6">
            This task doesn't have any text to annotate. Please contact the administrator.
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

  const handleTextSelection = () => {
    const selection = window.getSelection();
    if (selection && selection.toString().trim()) {
      const range = selection.getRangeAt(0);
      const selectedText = selection.toString().trim();
      
      // Calculate position in the text
      const preSelectionRange = range.cloneRange();
      preSelectionRange.selectNodeContents(document.getElementById('annotation-text')!);
      preSelectionRange.setEnd(range.startContainer, range.startOffset);
      const start = preSelectionRange.toString().length;
      
      setSelectedText({
        text: selectedText,
        start: start,
        end: start + selectedText.length
      });
    }
  };

  const addEntity = () => {
    if (selectedText) {
      const newEntity: Entity = {
        id: Date.now().toString(),
        text: selectedText.text,
        type: selectedType.name,
        start: selectedText.start,
        end: selectedText.end,
        color: selectedType.color
      };
      setEntities([...entities, newEntity]);
      setSelectedText(null);
      window.getSelection()?.removeAllRanges();
    }
  };

  const removeEntity = (id: string) => {
    setEntities(entities.filter(e => e.id !== id));
  };

  const handleSubmit = () => {
    if (entities.length > 0) {
      if (currentIndex < taskTexts.length - 1) {
        setCurrentIndex(currentIndex + 1);
        setEntities([]);
        setSelectedText(null);
      } else {
        // Submit with annotation data
        const submissionData = {
          annotations: entities,
          taskType: 'text_entity_annotation',
          completedTexts: taskTexts.length
        };
        onComplete(task.id || task._id, submissionData);
      }
    }
  };

  const renderAnnotatedText = () => {
    let result: React.ReactElement[] = [];
    let lastIndex = 0;
    const sortedEntities = [...entities].sort((a, b) => a.start - b.start);

    sortedEntities.forEach((entity, idx) => {
      // Add text before entity
      if (entity.start > lastIndex) {
        result.push(
          <span key={`text-${idx}`}>
            {currentText.substring(lastIndex, entity.start)}
          </span>
        );
      }

      // Add entity
      result.push(
        <span
          key={entity.id}
          className="inline-block px-1 py-0.5 rounded text-white mx-0.5 cursor-pointer"
          style={{ backgroundColor: entity.color }}
          onClick={() => removeEntity(entity.id)}
          title={`${entity.type} - Click to remove`}
        >
          {entity.text}
        </span>
      );

      lastIndex = entity.end;
    });

    // Add remaining text
    if (lastIndex < currentText.length) {
      result.push(
        <span key="text-end">{currentText.substring(lastIndex)}</span>
      );
    }

    return result;
  };

  const progress = ((currentIndex + 1) / taskTexts.length) * 100;

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="max-w-6xl mx-auto px-6 py-4">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-4">
              <button onClick={onBack} className="text-gray-600 hover:text-gray-900">
                <ArrowLeft className="w-6 h-6" />
              </button>
              <div>
                <h2 className="text-gray-900">Named Entity Recognition</h2>
                <p className="text-sm text-gray-600">Identify and label entities in text</p>
              </div>
            </div>
            <span className="text-sm text-gray-600">Payment: <span className="text-green-600">$0.12</span></span>
          </div>
          
          {/* Progress Bar */}
          <div className="space-y-2">
            <div className="flex items-center justify-between text-sm text-gray-600">
              <span>Progress</span>
              <span>{currentIndex + 1} of {taskTexts.length}</span>
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

      <div className="max-w-6xl mx-auto p-6">
        <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
          {/* Sidebar */}
          <div className="lg:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6 sticky top-6">
              <div className="flex items-start gap-2 p-3 bg-blue-50 border border-blue-200 rounded-lg mb-6">
                <Info className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" />
                <div className="text-sm text-blue-900">
                  <p className="mb-2">Select text, choose entity type, then click "Add Entity".</p>
                  <p>Click highlighted entities to remove them.</p>
                </div>
              </div>

              <h3 className="text-gray-900 mb-3">Entity Type</h3>
              <div className="space-y-2 mb-6">
                {entityTypes.map((type) => (
                  <button
                    key={type.name}
                    onClick={() => setSelectedType(type)}
                    className={`w-full px-4 py-3 rounded-lg text-left transition-colors ${
                      selectedType.name === type.name
                        ? 'ring-2 ring-offset-2'
                        : 'bg-gray-50 hover:bg-gray-100'
                    }`}
                    style={{
                      backgroundColor: selectedType.name === type.name ? `${type.color}20` : undefined,
                      borderLeft: `4px solid ${type.color}`
                    }}
                  >
                    <div className="text-sm text-gray-900">{type.name}</div>
                    <div className="text-xs text-gray-600 mt-1">{type.description}</div>
                  </button>
                ))}
              </div>

              {selectedText && (
                <div className="p-4 bg-green-50 border border-green-200 rounded-lg mb-4">
                  <p className="text-sm text-green-900 mb-2">Selected: "{selectedText.text}"</p>
                  <button
                    onClick={addEntity}
                    className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700"
                  >
                    Add as {selectedType.name}
                  </button>
                </div>
              )}

              <h3 className="text-gray-900 mb-3">Entities ({entities.length})</h3>
              <div className="space-y-2 max-h-48 overflow-y-auto">
                {entities.map((entity) => (
                  <div 
                    key={entity.id} 
                    className="flex items-start gap-2 p-2 bg-gray-50 rounded cursor-pointer hover:bg-gray-100"
                    onClick={() => removeEntity(entity.id)}
                  >
                    <Tag className="w-4 h-4 mt-0.5 flex-shrink-0" style={{ color: entity.color }} />
                    <div className="flex-1 min-w-0">
                      <div className="text-sm text-gray-900 truncate">{entity.text}</div>
                      <div className="text-xs text-gray-600">{entity.type}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Main Content */}
          <div className="lg:col-span-3 space-y-6">
            {/* Original Text */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Text to Annotate</h3>
              <div 
                id="annotation-text"
                className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 leading-relaxed select-text"
                onMouseUp={handleTextSelection}
              >
                {currentText}
              </div>
            </div>

            {/* Annotated Preview */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Annotated Preview</h3>
              <div className="p-4 bg-gray-50 rounded-lg border border-gray-200 text-gray-900 leading-relaxed">
                {entities.length > 0 ? renderAnnotatedText() : (
                  <span className="text-gray-400">No entities annotated yet...</span>
                )}
              </div>
            </div>

            {/* Legend */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              <h3 className="text-gray-900 mb-4">Entity Types Legend</h3>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3">
                {entityTypes.map((type) => (
                  <div key={type.name} className="flex items-center gap-2">
                    <div 
                      className="w-4 h-4 rounded"
                      style={{ backgroundColor: type.color }}
                    />
                    <span className="text-sm text-gray-700">{type.name}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Submit */}
            <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
              {entities.length === 0 && (
                <p className="text-sm text-yellow-900 bg-yellow-50 border border-yellow-200 rounded-lg p-3 mb-4">
                  Please annotate at least one entity before submitting
                </p>
              )}
              <button
                onClick={handleSubmit}
                disabled={entities.length === 0}
                className="w-full px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:bg-gray-300 disabled:cursor-not-allowed"
              >
                {currentIndex < taskTexts.length - 1 ? 'Next Text' : 'Submit Task'}
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
