'use client';

import { useState, useMemo } from 'react';
import { 
  Shield, AlertTriangle, CheckCircle, XCircle, AlertCircle,
  Eye, MessageSquare, ThumbsUp, ThumbsDown, Flag, 
  FileText, Image, Video, Volume2, Link2, Clock,
  BarChart2, Send, ChevronDown, ChevronUp, Info,
  BookOpen, Scale, Target, Zap
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner';

interface ModerationDecision {
  category: string;
  decision: 'safe' | 'needs_review' | 'violation' | 'skip';
  confidence: number;
  notes: string;
}

interface ContentModerationInterfaceProps {
  task: any;
  onModerationChange: (data: any) => void;
  onComplete: (data: any) => void;
}

// Moderation categories with detailed criteria
const MODERATION_CATEGORIES = [
  {
    id: 'safety',
    name: 'Safety',
    icon: Shield,
    description: 'Violence, self-harm, dangerous activities',
    criteria: [
      'No depictions of violence or gore',
      'No promotion of self-harm or suicide',
      'No dangerous or illegal activities',
      'No weapons in threatening context'
    ],
    weight: 1.5
  },
  {
    id: 'factual_accuracy',
    name: 'Factual Accuracy',
    icon: Target,
    description: 'Truthfulness and verifiable claims',
    criteria: [
      'Claims are factually correct',
      'Sources are cited where appropriate',
      'No misleading information',
      'Statistical data is accurate'
    ],
    weight: 1.2
  },
  {
    id: 'bias',
    name: 'Bias & Fairness',
    icon: Scale,
    description: 'Balanced perspective and inclusivity',
    criteria: [
      'Content is balanced and unbiased',
      'Multiple perspectives considered',
      'No discriminatory language',
      'Inclusive representation'
    ],
    weight: 1.0
  },
  {
    id: 'hate_speech',
    name: 'Hate Speech',
    icon: AlertTriangle,
    description: 'Discrimination and harassment',
    criteria: [
      'No slurs or derogatory terms',
      'No targeting of protected groups',
      'No incitement to hatred',
      'No bullying or harassment'
    ],
    weight: 1.5
  },
  {
    id: 'adult_content',
    name: 'Adult Content',
    icon: Eye,
    description: 'Sexually explicit or mature material',
    criteria: [
      'No explicit sexual content',
      'Age-appropriate imagery',
      'No suggestive content without context',
      'Proper content warnings if needed'
    ],
    weight: 1.3
  },
  {
    id: 'quality',
    name: 'Quality & Relevance',
    icon: Zap,
    description: 'Content quality and usefulness',
    criteria: [
      'Content is well-structured',
      'Information is relevant',
      'Clear and understandable',
      'Provides value to audience'
    ],
    weight: 0.8
  }
];

const DECISION_OPTIONS = [
  { id: 'safe', label: 'Safe', icon: CheckCircle, color: 'bg-green-500 text-white', description: 'Content meets all guidelines' },
  { id: 'needs_review', label: 'Needs Review', icon: Eye, color: 'bg-yellow-500 text-white', description: 'Requires human review' },
  { id: 'violation', label: 'Violation', icon: XCircle, color: 'bg-red-500 text-white', description: 'Violates content policy' },
  { id: 'skip', label: 'Skip', icon: AlertCircle, color: 'bg-gray-500 text-white', description: 'Unable to determine' },
] as const;

// Sample content for demo
const SAMPLE_CONTENT = [
  {
    type: 'text',
    title: 'AI Technology Article',
    content: `Artificial intelligence is transforming healthcare by enabling faster and more accurate diagnoses. 
Recent studies show that AI-powered diagnostic tools can detect certain cancers with 95% accuracy, 
outperforming human radiologists in some cases. While this technology shows great promise, 
experts caution that it should be used as a tool to assist medical professionals, not replace them.

The integration of AI in healthcare raises important ethical questions about patient privacy, 
algorithmic bias, and the role of human judgment in medical decisions. Healthcare organizations 
are working to develop guidelines that ensure AI is used responsibly and equitably.`
  },
  {
    type: 'text',
    title: 'Product Review',
    content: `This smartphone is absolutely terrible! I can't believe anyone would buy this garbage. 
The company should be ashamed of themselves for releasing such a poorly made product. 
The battery dies in two hours and the camera makes everyone look like they have three heads. 
Save your money and buy literally anything else. Total waste of $800.`
  },
  {
    type: 'text',
    title: 'Educational Content',
    content: `The water cycle, also known as the hydrologic cycle, describes the continuous movement 
of water within the Earth and atmosphere. It includes several key processes:

1. Evaporation: Water from oceans, lakes, and rivers transforms into water vapor
2. Condensation: Water vapor cools and forms clouds
3. Precipitation: Water falls back to Earth as rain, snow, or hail
4. Collection: Water gathers in bodies of water and groundwater

This cycle is essential for life on Earth and plays a crucial role in our climate system.`
  }
];

export function ContentModerationInterface({ task, onModerationChange, onComplete }: ContentModerationInterfaceProps) {
  // Get content from task or use sample
  const getContent = () => {
    if (task?.taskData?.content) {
      return {
        type: task.taskData.type || 'text',
        title: task.taskData.title || 'Content Review',
        content: task.taskData.content
      };
    }
    const index = Math.floor(Math.random() * SAMPLE_CONTENT.length);
    return SAMPLE_CONTENT[0]; // Use first sample for consistency
  };

  const content = getContent();

  // State
  const [decisions, setDecisions] = useState<Record<string, ModerationDecision>>({});
  const [expandedCategories, setExpandedCategories] = useState<Set<string>>(new Set());
  const [overallDecision, setOverallDecision] = useState<'approve' | 'reject' | 'escalate' | null>(null);
  const [notes, setNotes] = useState('');
  const [reviewTime, setReviewTime] = useState(0);
  const [showGuidelines, setShowGuidelines] = useState(false);

  // Timer effect would go here in production

  // Calculate completion
  const completedCategories = Object.keys(decisions).length;
  const totalCategories = MODERATION_CATEGORIES.length;
  const completionPercentage = (completedCategories / totalCategories) * 100;

  // Calculate overall score
  const calculateScore = useMemo(() => {
    if (completedCategories === 0) return null;

    let totalWeight = 0;
    let weightedScore = 0;

    MODERATION_CATEGORIES.forEach(cat => {
      const decision = decisions[cat.id];
      if (decision) {
        totalWeight += cat.weight;
        let score = 0;
        switch (decision.decision) {
          case 'safe': score = 100; break;
          case 'needs_review': score = 60; break;
          case 'violation': score = 0; break;
          case 'skip': score = 50; break;
        }
        weightedScore += score * cat.weight;
      }
    });

    return totalWeight > 0 ? Math.round(weightedScore / totalWeight) : null;
  }, [decisions, completedCategories]);

  // Update decision
  const updateDecision = (categoryId: string, decision: ModerationDecision['decision'], confidence: number = 90) => {
    const newDecisions = {
      ...decisions,
      [categoryId]: {
        category: categoryId,
        decision,
        confidence,
        notes: decisions[categoryId]?.notes || ''
      }
    };
    setDecisions(newDecisions);
    onModerationChange({ decisions: newDecisions, overallDecision, notes });
  };

  // Update notes for category
  const updateCategoryNotes = (categoryId: string, categoryNotes: string) => {
    if (decisions[categoryId]) {
      const newDecisions = {
        ...decisions,
        [categoryId]: { ...decisions[categoryId], notes: categoryNotes }
      };
      setDecisions(newDecisions);
    }
  };

  // Toggle category expansion
  const toggleCategory = (categoryId: string) => {
    const newExpanded = new Set(expandedCategories);
    if (newExpanded.has(categoryId)) {
      newExpanded.delete(categoryId);
    } else {
      newExpanded.add(categoryId);
    }
    setExpandedCategories(newExpanded);
  };

  // Complete moderation
  const handleComplete = () => {
    if (completedCategories < totalCategories) {
      toast.error('Please complete all categories');
      return;
    }
    if (!overallDecision) {
      toast.error('Please select an overall decision');
      return;
    }

    onComplete({
      decisions,
      overallDecision,
      notes,
      score: calculateScore,
      completedAt: new Date().toISOString(),
      reviewTimeSeconds: reviewTime
    });
  };

  // Get decision badge color
  const getDecisionColor = (decision: string | undefined) => {
    switch (decision) {
      case 'safe': return 'bg-green-100 text-green-800';
      case 'needs_review': return 'bg-yellow-100 text-yellow-800';
      case 'violation': return 'bg-red-100 text-red-800';
      case 'skip': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-500';
    }
  };

  // Get score color
  const getScoreColor = (score: number | null) => {
    if (score === null) return 'text-gray-400';
    if (score >= 80) return 'text-green-600';
    if (score >= 50) return 'text-yellow-600';
    return 'text-red-600';
  };

  return (
    <div className="space-y-4">
      {/* Content Preview */}
      <Card>
        <CardHeader className="pb-3">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-blue-100 rounded-lg">
                <FileText className="w-5 h-5 text-blue-600" />
              </div>
              <div>
                <CardTitle className="text-lg">{content.title}</CardTitle>
                <CardDescription className="flex items-center gap-2">
                  <Badge variant="secondary">{content.type}</Badge>
                  <span>{content.content.split(' ').length} words</span>
                </CardDescription>
              </div>
            </div>
            <Button
              variant="outline"
              size="sm"
              onClick={() => setShowGuidelines(!showGuidelines)}
            >
              <BookOpen className="w-4 h-4 mr-2" />
              Guidelines
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <div className="bg-gray-50 rounded-lg p-4 max-h-[300px] overflow-y-auto">
            <p className="whitespace-pre-wrap text-sm leading-relaxed">{content.content}</p>
          </div>
        </CardContent>
      </Card>

      {/* Guidelines Panel */}
      {showGuidelines && (
        <Card className="border-blue-200 bg-blue-50">
          <CardHeader className="pb-3">
            <CardTitle className="text-sm flex items-center gap-2">
              <Info className="w-4 h-4" />
              Moderation Guidelines
            </CardTitle>
          </CardHeader>
          <CardContent>
            <ul className="text-sm space-y-2">
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Review each category carefully before making a decision</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Mark as &quot;Needs Review&quot; if you&apos;re uncertain about content</span>
              </li>
              <li className="flex items-start gap-2">
                <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                <span>Provide notes explaining your reasoning for borderline cases</span>
              </li>
              <li className="flex items-start gap-2">
                <AlertTriangle className="w-4 h-4 text-orange-600 mt-0.5 flex-shrink-0" />
                <span>Escalate content that may require policy team review</span>
              </li>
            </ul>
          </CardContent>
        </Card>
      )}

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Categories */}
        <div className="lg:col-span-2 space-y-3">
          {MODERATION_CATEGORIES.map(category => {
            const CategoryIcon = category.icon;
            const decision = decisions[category.id];
            const isExpanded = expandedCategories.has(category.id);

            return (
              <Card key={category.id} className={decision ? 'border-l-4 ' + (
                decision.decision === 'safe' ? 'border-l-green-500' :
                decision.decision === 'violation' ? 'border-l-red-500' :
                decision.decision === 'needs_review' ? 'border-l-yellow-500' :
                'border-l-gray-500'
              ) : ''}>
                <CardContent className="py-4">
                  {/* Category Header */}
                  <div 
                    className="flex items-center justify-between cursor-pointer"
                    onClick={() => toggleCategory(category.id)}
                  >
                    <div className="flex items-center gap-3">
                      <div className="p-2 bg-gray-100 rounded-lg">
                        <CategoryIcon className="w-5 h-5 text-gray-600" />
                      </div>
                      <div>
                        <h3 className="font-medium">{category.name}</h3>
                        <p className="text-sm text-gray-500">{category.description}</p>
                      </div>
                    </div>
                    <div className="flex items-center gap-3">
                      {decision && (
                        <Badge className={getDecisionColor(decision.decision)}>
                          {decision.decision.replace('_', ' ')}
                        </Badge>
                      )}
                      {isExpanded ? <ChevronUp className="w-5 h-5" /> : <ChevronDown className="w-5 h-5" />}
                    </div>
                  </div>

                  {/* Expanded Content */}
                  {isExpanded && (
                    <div className="mt-4 space-y-4">
                      {/* Criteria Checklist */}
                      <div className="bg-gray-50 rounded-lg p-3">
                        <h4 className="text-sm font-medium mb-2">Review Criteria</h4>
                        <ul className="space-y-1">
                          {category.criteria.map((criterion, idx) => (
                            <li key={idx} className="flex items-center gap-2 text-sm">
                              <div className="w-4 h-4 rounded border border-gray-300 flex-shrink-0" />
                              <span>{criterion}</span>
                            </li>
                          ))}
                        </ul>
                      </div>

                      {/* Decision Buttons */}
                      <div className="grid grid-cols-4 gap-2">
                        {DECISION_OPTIONS.map(option => {
                          const OptionIcon = option.icon;
                          const isSelected = decision?.decision === option.id;
                          
                          return (
                            <Button
                              key={option.id}
                              variant={isSelected ? 'default' : 'outline'}
                              className={`flex flex-col items-center gap-1 h-auto py-3 ${isSelected ? option.color : ''}`}
                              onClick={() => updateDecision(category.id, option.id as ModerationDecision['decision'])}
                            >
                              <OptionIcon className="w-5 h-5" />
                              <span className="text-xs">{option.label}</span>
                            </Button>
                          );
                        })}
                      </div>

                      {/* Confidence Slider */}
                      {decision && (
                        <div>
                          <div className="flex justify-between text-sm mb-1">
                            <span className="text-gray-500">Confidence</span>
                            <span className="font-medium">{decision.confidence}%</span>
                          </div>
                          <input
                            type="range"
                            min="50"
                            max="100"
                            value={decision.confidence}
                            onChange={(e) => updateDecision(category.id, decision.decision, parseInt(e.target.value))}
                            className="w-full h-2 bg-gray-200 rounded-lg appearance-none cursor-pointer"
                          />
                        </div>
                      )}

                      {/* Notes */}
                      <div>
                        <label className="text-sm font-medium text-gray-700">Notes (optional)</label>
                        <Textarea
                          value={decision?.notes || ''}
                          onChange={(e) => updateCategoryNotes(category.id, e.target.value)}
                          placeholder="Add any relevant notes about this category..."
                          className="mt-1"
                          rows={2}
                        />
                      </div>
                    </div>
                  )}
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {/* Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Review Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Categories Reviewed</span>
                  <span>{completedCategories}/{totalCategories}</span>
                </div>
                <Progress value={completionPercentage} />
              </div>

              <div className="flex items-center justify-between py-3 border-t">
                <span className="text-sm font-medium">Overall Score</span>
                <span className={`text-2xl font-bold ${getScoreColor(calculateScore)}`}>
                  {calculateScore !== null ? `${calculateScore}%` : '--'}
                </span>
              </div>

              {/* Decision Summary */}
              <div className="space-y-2">
                {DECISION_OPTIONS.slice(0, 3).map(option => {
                  const count = Object.values(decisions).filter(d => d.decision === option.id).length;
                  return (
                    <div key={option.id} className="flex items-center justify-between text-sm">
                      <div className="flex items-center gap-2">
                        <span className={`w-3 h-3 rounded-full ${option.color}`} />
                        <span>{option.label}</span>
                      </div>
                      <span className="font-medium">{count}</span>
                    </div>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Final Decision */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Final Decision</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="space-y-2">
                <Button
                  variant={overallDecision === 'approve' ? 'default' : 'outline'}
                  className={`w-full justify-start ${overallDecision === 'approve' ? 'bg-green-600 hover:bg-green-700' : ''}`}
                  onClick={() => setOverallDecision('approve')}
                >
                  <ThumbsUp className="w-4 h-4 mr-2" />
                  Approve Content
                </Button>
                <Button
                  variant={overallDecision === 'reject' ? 'default' : 'outline'}
                  className={`w-full justify-start ${overallDecision === 'reject' ? 'bg-red-600 hover:bg-red-700' : ''}`}
                  onClick={() => setOverallDecision('reject')}
                >
                  <ThumbsDown className="w-4 h-4 mr-2" />
                  Reject Content
                </Button>
                <Button
                  variant={overallDecision === 'escalate' ? 'default' : 'outline'}
                  className={`w-full justify-start ${overallDecision === 'escalate' ? 'bg-orange-600 hover:bg-orange-700' : ''}`}
                  onClick={() => setOverallDecision('escalate')}
                >
                  <Flag className="w-4 h-4 mr-2" />
                  Escalate to Policy Team
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Overall Notes */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Reviewer Notes</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={notes}
                onChange={(e) => {
                  setNotes(e.target.value);
                  onModerationChange({ decisions, overallDecision, notes: e.target.value });
                }}
                placeholder="Add overall notes about this content review..."
                rows={4}
              />

              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={completedCategories < totalCategories || !overallDecision}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Review
              </Button>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
