'use client';

import { useState, useCallback } from 'react';
import { 
  Search, FileText, Link2, Quote, CheckCircle, XCircle,
  Plus, Trash2, Edit3, BookOpen, Globe, ChevronDown,
  ChevronUp, ExternalLink, Save, AlertCircle, Info,
  Lightbulb, Target, BarChart2, Send, Copy, Hash
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner';

interface ResearchSection {
  id: string;
  title: string;
  content: string;
  wordCount: number;
  completed: boolean;
}

interface Citation {
  id: string;
  title: string;
  url: string;
  author: string;
  date: string;
  type: 'website' | 'journal' | 'book' | 'report' | 'other';
  notes: string;
}

interface ResearchAnalysisInterfaceProps {
  task: any;
  onResearchChange: (data: any) => void;
  onComplete: (data: any) => void;
}

// Default sections for research task
const DEFAULT_SECTIONS = [
  { id: 'summary', title: 'Executive Summary', description: 'Brief overview of key findings', minWords: 100 },
  { id: 'background', title: 'Background & Context', description: 'Historical context and current state', minWords: 150 },
  { id: 'methodology', title: 'Research Methodology', description: 'How information was gathered and analyzed', minWords: 100 },
  { id: 'findings', title: 'Key Findings', description: 'Main discoveries and insights', minWords: 200 },
  { id: 'analysis', title: 'Analysis & Discussion', description: 'Interpretation of findings', minWords: 200 },
  { id: 'recommendations', title: 'Recommendations', description: 'Actionable suggestions based on research', minWords: 100 },
  { id: 'conclusion', title: 'Conclusion', description: 'Final thoughts and summary', minWords: 75 },
];

const CITATION_TYPES = [
  { id: 'website', label: 'Website', icon: Globe },
  { id: 'journal', label: 'Journal', icon: FileText },
  { id: 'book', label: 'Book', icon: BookOpen },
  { id: 'report', label: 'Report', icon: BarChart2 },
  { id: 'other', label: 'Other', icon: Link2 },
];

// Sample research topics
const SAMPLE_TOPICS = [
  {
    topic: 'AI in Healthcare',
    description: 'Analyze the current applications and future potential of artificial intelligence in healthcare diagnostics, treatment planning, and patient care.',
    keywords: ['machine learning', 'diagnostics', 'patient care', 'medical imaging', 'FDA approval']
  },
  {
    topic: 'Renewable Energy Trends',
    description: 'Research and analyze global trends in renewable energy adoption, focusing on solar, wind, and emerging technologies.',
    keywords: ['solar power', 'wind energy', 'grid storage', 'carbon neutrality', 'investment']
  },
  {
    topic: 'Remote Work Impact',
    description: 'Study the long-term effects of remote work on productivity, employee well-being, and organizational culture.',
    keywords: ['productivity', 'work-life balance', 'collaboration', 'hybrid work', 'employee retention']
  }
];

export function ResearchAnalysisInterface({ task, onResearchChange, onComplete }: ResearchAnalysisInterfaceProps) {
  // Get research topic from task
  const getResearchTopic = useCallback(() => {
    if (task?.taskData?.topic) {
      return {
        topic: task.taskData.topic,
        description: task.taskData.description || '',
        keywords: task.taskData.keywords || []
      };
    }
    return SAMPLE_TOPICS[0];
  }, [task]);

  const researchTopic = getResearchTopic();

  // State
  const [sections, setSections] = useState<Record<string, ResearchSection>>(() => {
    const initial: Record<string, ResearchSection> = {};
    DEFAULT_SECTIONS.forEach(s => {
      initial[s.id] = {
        id: s.id,
        title: s.title,
        content: '',
        wordCount: 0,
        completed: false
      };
    });
    return initial;
  });

  const [citations, setCitations] = useState<Citation[]>([]);
  const [activeSection, setActiveSection] = useState<string>('summary');
  const [showAddCitation, setShowAddCitation] = useState(false);
  const [newCitation, setNewCitation] = useState<Partial<Citation>>({
    type: 'website',
    title: '',
    url: '',
    author: '',
    date: '',
    notes: ''
  });
  const [qualityNotes, setQualityNotes] = useState('');

  // Calculate word count
  const countWords = (text: string) => {
    return text.trim().split(/\s+/).filter(word => word.length > 0).length;
  };

  // Update section content
  const updateSection = (sectionId: string, content: string) => {
    const wordCount = countWords(content);
    const sectionConfig = DEFAULT_SECTIONS.find(s => s.id === sectionId);
    const completed = wordCount >= (sectionConfig?.minWords || 0);

    setSections(prev => ({
      ...prev,
      [sectionId]: {
        ...prev[sectionId],
        content,
        wordCount,
        completed
      }
    }));

    onResearchChange({
      sections: { ...sections, [sectionId]: { ...sections[sectionId], content, wordCount, completed } },
      citations
    });
  };

  // Add citation
  const handleAddCitation = () => {
    if (!newCitation.title || !newCitation.url) {
      toast.error('Please provide at least a title and URL');
      return;
    }

    const citation: Citation = {
      id: `citation-${Date.now()}`,
      title: newCitation.title || '',
      url: newCitation.url || '',
      author: newCitation.author || 'Unknown',
      date: newCitation.date || new Date().toISOString().split('T')[0],
      type: newCitation.type as Citation['type'] || 'website',
      notes: newCitation.notes || ''
    };

    setCitations(prev => [...prev, citation]);
    setNewCitation({ type: 'website', title: '', url: '', author: '', date: '', notes: '' });
    setShowAddCitation(false);
    toast.success('Citation added');
  };

  // Delete citation
  const deleteCitation = (id: string) => {
    setCitations(prev => prev.filter(c => c.id !== id));
    toast.success('Citation removed');
  };

  // Copy citation
  const copyCitation = (citation: Citation) => {
    const formatted = `${citation.author} (${citation.date}). ${citation.title}. Retrieved from ${citation.url}`;
    navigator.clipboard.writeText(formatted);
    toast.success('Citation copied to clipboard');
  };

  // Calculate progress
  const completedSections = Object.values(sections).filter(s => s.completed).length;
  const totalSections = DEFAULT_SECTIONS.length;
  const progressPercentage = (completedSections / totalSections) * 100;
  const totalWordCount = Object.values(sections).reduce((sum, s) => sum + s.wordCount, 0);

  // Complete research
  const handleComplete = () => {
    if (completedSections < totalSections) {
      toast.error('Please complete all sections before submitting');
      return;
    }
    if (citations.length < 3) {
      toast.error('Please add at least 3 citations');
      return;
    }

    onComplete({
      topic: researchTopic.topic,
      sections,
      citations,
      qualityNotes,
      totalWordCount,
      completedAt: new Date().toISOString()
    });
  };

  // Get active section config
  const activeSectionConfig = DEFAULT_SECTIONS.find(s => s.id === activeSection);

  return (
    <div className="space-y-4">
      {/* Research Topic Header */}
      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50">
        <CardContent className="py-4">
          <div className="flex items-start gap-4">
            <div className="p-3 bg-blue-100 rounded-xl">
              <Search className="w-6 h-6 text-blue-600" />
            </div>
            <div className="flex-1">
              <h2 className="text-lg font-semibold text-gray-900">{researchTopic.topic}</h2>
              <p className="text-sm text-gray-600 mt-1">{researchTopic.description}</p>
              <div className="flex flex-wrap gap-2 mt-3">
                {researchTopic.keywords.map((keyword: string, idx: number) => (
                  <Badge key={idx} variant="secondary" className="bg-white">
                    <Hash className="w-3 h-3 mr-1" />
                    {keyword}
                  </Badge>
                ))}
              </div>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-4">
        {/* Section Navigation */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <FileText className="w-4 h-4" />
                Sections
              </CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {DEFAULT_SECTIONS.map(section => {
                const sectionData = sections[section.id];
                const isActive = activeSection === section.id;
                
                return (
                  <button
                    key={section.id}
                    onClick={() => setActiveSection(section.id)}
                    className={`w-full flex items-center gap-3 p-3 text-left transition-colors border-b last:border-b-0 ${
                      isActive ? 'bg-blue-50 border-l-4 border-l-blue-500' : 'hover:bg-gray-50'
                    }`}
                  >
                    <div className={`w-5 h-5 rounded-full flex items-center justify-center flex-shrink-0 ${
                      sectionData?.completed 
                        ? 'bg-green-500 text-white' 
                        : 'bg-gray-200 text-gray-500'
                    }`}>
                      {sectionData?.completed ? (
                        <CheckCircle className="w-3 h-3" />
                      ) : (
                        <span className="text-xs">{DEFAULT_SECTIONS.findIndex(s => s.id === section.id) + 1}</span>
                      )}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="text-sm font-medium truncate">{section.title}</div>
                      <div className="text-xs text-gray-500">
                        {sectionData?.wordCount || 0}/{section.minWords} words
                      </div>
                    </div>
                  </button>
                );
              })}
            </CardContent>
          </Card>

          {/* Progress Card */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Target className="w-4 h-4" />
                Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Sections</span>
                  <span>{completedSections}/{totalSections}</span>
                </div>
                <Progress value={progressPercentage} />
              </div>

              <div className="grid grid-cols-2 gap-2 text-center">
                <div className="p-2 bg-blue-50 rounded-lg">
                  <div className="text-lg font-bold text-blue-600">{totalWordCount}</div>
                  <div className="text-xs text-gray-500">Words</div>
                </div>
                <div className="p-2 bg-green-50 rounded-lg">
                  <div className="text-lg font-bold text-green-600">{citations.length}</div>
                  <div className="text-xs text-gray-500">Citations</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Main Editor */}
        <div className="lg:col-span-2">
          <Card className="h-full">
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="text-lg">{activeSectionConfig?.title}</CardTitle>
                  <CardDescription>{activeSectionConfig?.description}</CardDescription>
                </div>
                <Badge variant={sections[activeSection]?.completed ? 'default' : 'secondary'}>
                  {sections[activeSection]?.wordCount || 0} / {activeSectionConfig?.minWords} words
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              <Textarea
                value={sections[activeSection]?.content || ''}
                onChange={(e) => updateSection(activeSection, e.target.value)}
                placeholder={`Write your ${activeSectionConfig?.title.toLowerCase()} here...`}
                className="min-h-[400px] resize-none text-sm leading-relaxed"
              />

              {/* Writing Tips */}
              <div className="p-3 bg-yellow-50 rounded-lg">
                <div className="flex items-start gap-2">
                  <Lightbulb className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                  <div className="text-sm">
                    <p className="font-medium text-yellow-800">Writing Tips for {activeSectionConfig?.title}</p>
                    <p className="text-yellow-700 mt-1">
                      {activeSection === 'summary' && 'Keep it concise. Highlight the most important findings and recommendations in 2-3 paragraphs.'}
                      {activeSection === 'background' && 'Provide historical context and explain why this research is important. Include relevant statistics.'}
                      {activeSection === 'methodology' && 'Explain your research approach, data sources, and analysis methods clearly.'}
                      {activeSection === 'findings' && 'Present your key discoveries with supporting evidence. Use bullet points for clarity.'}
                      {activeSection === 'analysis' && 'Interpret your findings. Discuss patterns, implications, and connections.'}
                      {activeSection === 'recommendations' && 'Provide specific, actionable recommendations based on your findings.'}
                      {activeSection === 'conclusion' && 'Summarize key takeaways and suggest areas for future research.'}
                    </p>
                  </div>
                </div>
              </div>

              {/* Navigation */}
              <div className="flex justify-between">
                <Button
                  variant="outline"
                  onClick={() => {
                    const idx = DEFAULT_SECTIONS.findIndex(s => s.id === activeSection);
                    if (idx > 0) setActiveSection(DEFAULT_SECTIONS[idx - 1].id);
                  }}
                  disabled={activeSection === DEFAULT_SECTIONS[0].id}
                >
                  Previous Section
                </Button>
                <Button
                  onClick={() => {
                    const idx = DEFAULT_SECTIONS.findIndex(s => s.id === activeSection);
                    if (idx < DEFAULT_SECTIONS.length - 1) setActiveSection(DEFAULT_SECTIONS[idx + 1].id);
                  }}
                  disabled={activeSection === DEFAULT_SECTIONS[DEFAULT_SECTIONS.length - 1].id}
                >
                  Next Section
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Citations Panel */}
        <div className="space-y-4">
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  <Quote className="w-4 h-4" />
                  Citations ({citations.length})
                </CardTitle>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setShowAddCitation(!showAddCitation)}
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="space-y-3">
              {/* Add Citation Form */}
              {showAddCitation && (
                <div className="p-3 bg-gray-50 rounded-lg space-y-3">
                  <div>
                    <label className="text-xs font-medium">Type</label>
                    <div className="flex flex-wrap gap-1 mt-1">
                      {CITATION_TYPES.map(type => {
                        const TypeIcon = type.icon;
                        return (
                          <Button
                            key={type.id}
                            variant={newCitation.type === type.id ? 'default' : 'outline'}
                            size="sm"
                            className="text-xs"
                            onClick={() => setNewCitation({ ...newCitation, type: type.id as Citation['type'] })}
                          >
                            <TypeIcon className="w-3 h-3 mr-1" />
                            {type.label}
                          </Button>
                        );
                      })}
                    </div>
                  </div>

                  <div>
                    <label className="text-xs font-medium">Title *</label>
                    <input
                      type="text"
                      value={newCitation.title}
                      onChange={(e) => setNewCitation({ ...newCitation, title: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                      placeholder="Source title"
                    />
                  </div>

                  <div>
                    <label className="text-xs font-medium">URL *</label>
                    <input
                      type="url"
                      value={newCitation.url}
                      onChange={(e) => setNewCitation({ ...newCitation, url: e.target.value })}
                      className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                      placeholder="https://..."
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div>
                      <label className="text-xs font-medium">Author</label>
                      <input
                        type="text"
                        value={newCitation.author}
                        onChange={(e) => setNewCitation({ ...newCitation, author: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                        placeholder="Author name"
                      />
                    </div>
                    <div>
                      <label className="text-xs font-medium">Date</label>
                      <input
                        type="date"
                        value={newCitation.date}
                        onChange={(e) => setNewCitation({ ...newCitation, date: e.target.value })}
                        className="w-full mt-1 px-3 py-2 text-sm border rounded-md"
                      />
                    </div>
                  </div>

                  <Button className="w-full" onClick={handleAddCitation}>
                    <Plus className="w-4 h-4 mr-2" />
                    Add Citation
                  </Button>
                </div>
              )}

              {/* Citations List */}
              {citations.length === 0 ? (
                <div className="text-center py-6 text-gray-500">
                  <Quote className="w-8 h-8 mx-auto mb-2 opacity-50" />
                  <p className="text-sm">No citations yet</p>
                  <p className="text-xs">Add at least 3 citations</p>
                </div>
              ) : (
                <div className="space-y-2 max-h-[400px] overflow-y-auto">
                  {citations.map((citation, idx) => {
                    const TypeInfo = CITATION_TYPES.find(t => t.id === citation.type);
                    const TypeIcon = TypeInfo?.icon || Link2;
                    
                    return (
                      <div
                        key={citation.id}
                        className="p-3 border rounded-lg hover:bg-gray-50"
                      >
                        <div className="flex items-start gap-2">
                          <div className="p-1 bg-gray-100 rounded">
                            <TypeIcon className="w-4 h-4 text-gray-600" />
                          </div>
                          <div className="flex-1 min-w-0">
                            <h4 className="text-sm font-medium truncate">{citation.title}</h4>
                            <p className="text-xs text-gray-500">{citation.author} • {citation.date}</p>
                          </div>
                          <Badge variant="secondary" className="text-xs">
                            [{idx + 1}]
                          </Badge>
                        </div>
                        <div className="flex items-center gap-2 mt-2">
                          <a
                            href={citation.url}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-xs text-blue-600 hover:underline flex items-center gap-1"
                          >
                            <ExternalLink className="w-3 h-3" />
                            Open
                          </a>
                          <button
                            onClick={() => copyCitation(citation)}
                            className="text-xs text-gray-600 hover:text-gray-800 flex items-center gap-1"
                          >
                            <Copy className="w-3 h-3" />
                            Copy
                          </button>
                          <button
                            onClick={() => deleteCitation(citation.id)}
                            className="text-xs text-red-600 hover:text-red-800 flex items-center gap-1 ml-auto"
                          >
                            <Trash2 className="w-3 h-3" />
                          </button>
                        </div>
                      </div>
                    );
                  })}
                </div>
              )}

              {citations.length > 0 && citations.length < 3 && (
                <div className="p-2 bg-yellow-50 rounded-lg">
                  <div className="flex items-center gap-2 text-xs text-yellow-700">
                    <AlertCircle className="w-4 h-4" />
                    Add {3 - citations.length} more citation{3 - citations.length > 1 ? 's' : ''}
                  </div>
                </div>
              )}
            </CardContent>
          </Card>

          {/* Submit */}
          <Card>
            <CardContent className="py-4">
              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={completedSections < totalSections || citations.length < 3}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Research
              </Button>
              
              {(completedSections < totalSections || citations.length < 3) && (
                <p className="text-xs text-center text-gray-500 mt-2">
                  Complete all sections and add 3+ citations
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
