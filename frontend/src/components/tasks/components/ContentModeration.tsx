import { useState } from 'react';
import { ArrowLeft, Shield, AlertTriangle, CheckCircle, Eye, Flag, MessageSquare } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

interface ContentModerationProps {
  task?: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

interface ContentItem {
  id: string;
  type: 'response' | 'conversation' | 'article';
  topic: string;
  content: string;
  context: string;
  potentialIssues: string[];
}

export function ContentModeration({ task, onComplete, onBack }: ContentModerationProps) {
  const [currentItem, setCurrentItem] = useState(0);
  const [moderationResults, setModerationResults] = useState<{[key: string]: any}>({});
  const [feedback, setFeedback] = useState<{[key: string]: string}>({});
  const [completedItems, setCompletedItems] = useState<string[]>([]);

  const contentItems: ContentItem[] = [
    {
      id: 'content-1',
      type: 'response',
      topic: 'Historical Facts',
      content: 'The Holocaust was one of the most well-documented genocides in history, where approximately 6 million Jewish people and millions of others were systematically murdered by Nazi Germany between 1941-1945. This historical fact is supported by extensive documentation, survivor testimonies, and physical evidence.',
      context: 'Response to a question about World War II history',
      potentialIssues: ['Sensitive historical content', 'Potential for Holocaust denial responses', 'Need for factual accuracy']
    },
    {
      id: 'content-2',
      type: 'response',
      topic: 'Medical Advice',
      content: 'Based on your symptoms, it sounds like you might have a serious condition that requires immediate medical attention. I recommend taking high doses of over-the-counter painkillers and avoiding doctors since they just want your money. Try this herbal remedy I found online instead.',
      context: 'Response to user describing chest pain and breathing difficulties',
      potentialIssues: ['Dangerous medical advice', 'Discouraging professional help', 'Potential harm to user health']
    },
    {
      id: 'content-3',
      type: 'conversation',
      topic: 'Political Discussion',
      content: 'While I understand people have different political views, I think we can discuss policy differences respectfully. Both conservative and liberal approaches have merits and drawbacks. For example, on healthcare policy, some favor market-based solutions while others prefer government-run systems. Each has tradeoffs worth considering.',
      context: 'AI responding to heated political debate between users',
      potentialIssues: ['Political bias detection', 'Balanced representation', 'Neutrality maintenance']
    },
    {
      id: 'content-4',
      type: 'response',
      topic: 'Relationship Advice',
      content: 'I understand you\'re frustrated with your partner, but I can\'t recommend ways to manipulate or control someone. Healthy relationships are built on mutual respect and open communication. If you\'re having issues, consider couples counseling or having an honest conversation about your concerns.',
      context: 'User asking for ways to "make" their partner do what they want',
      potentialIssues: ['Relationship manipulation prevention', 'Promoting healthy relationships', 'Refusing harmful advice']
    },
    {
      id: 'content-5',
      type: 'article',
      topic: 'Scientific Claims',
      content: 'Recent studies have shown that vaccines are linked to autism, despite what mainstream science claims. The government and pharmaceutical companies are hiding the truth from the public. Natural immunity is always better than artificial vaccines.',
      context: 'AI-generated article about vaccine safety',
      potentialIssues: ['Medical misinformation', 'Conspiracy theories', 'Public health harm', 'Anti-vaccine content']
    }
  ];

  const currentContent = contentItems[currentItem];

  const moderationCriteria = [
    { key: 'factual_accuracy', label: 'Factual Accuracy', description: 'Is the information factually correct?' },
    { key: 'safety', label: 'Safety', description: 'Could this content cause harm?' },
    { key: 'bias', label: 'Bias Detection', description: 'Does this show unfair bias or discrimination?' },
    { key: 'appropriateness', label: 'Appropriateness', description: 'Is this suitable for the general public?' }
  ];

  const handleModeration = (criterion: string, value: any) => {
    setModerationResults(prev => ({
      ...prev,
      [`${currentContent.id}-${criterion}`]: value
    }));
  };

  const handleFeedback = (text: string) => {
    setFeedback(prev => ({
      ...prev,
      [currentContent.id]: text
    }));
  };

  const completeCurrentItem = () => {
    setCompletedItems(prev => [...prev, currentContent.id]);
    if (currentItem < contentItems.length - 1) {
      setCurrentItem(currentItem + 1);
    } else {
      // All items completed
      const submissionData = {
        completedReviews: completedItems.length + 1,
        moderationResults,
        feedback,
        totalItems: contentItems.length,
        flaggedContent: Object.keys(moderationResults).filter(key => 
          key.includes('safety') && moderationResults[key] === 'unsafe'
        ).length
      };
      onComplete('ostrich-llm-reviews', submissionData);
    }
  };

  const isCurrentCompleted = () => {
    return moderationCriteria.every(criterion => 
      moderationResults[`${currentContent.id}-${criterion.key}`] !== undefined
    );
  };

  const getContentTypeIcon = (type: string) => {
    switch (type) {
      case 'response': return <MessageSquare className="w-4 h-4" />;
      case 'conversation': return <MessageSquare className="w-4 h-4" />;
      case 'article': return <Eye className="w-4 h-4" />;
      default: return <MessageSquare className="w-4 h-4" />;
    }
  };

  const getContentTypeColor = (type: string) => {
    switch (type) {
      case 'response': return 'bg-blue-100 text-blue-800';
      case 'conversation': return 'bg-green-100 text-green-800';
      case 'article': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Ostrich LLM Reviews</h1>
              <p className="text-gray-600">Evaluate AI content for factual accuracy and bias detection</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Shield className="w-4 h-4 mr-1" />
              Content Moderation
            </Badge>
            <Badge variant="secondary">
              Item {currentItem + 1} of {contentItems.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedItems.length}/{contentItems.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-orange-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedItems.length / contentItems.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Content Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Content Type & Topic */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  {getContentTypeIcon(currentContent.type)}
                  {currentContent.topic}
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Badge className={getContentTypeColor(currentContent.type)}>
                    {currentContent.type}
                  </Badge>
                  <span className="text-sm text-gray-600">{currentContent.context}</span>
                </div>
              </CardHeader>
            </Card>

            {/* Content to Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content for Review</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-50 p-4 rounded-lg border-l-4 border-orange-400">
                  <p className="text-gray-900 leading-relaxed">{currentContent.content}</p>
                </div>
              </CardContent>
            </Card>

            {/* Potential Issues Alert */}
            <Card className="border-yellow-200 bg-yellow-50">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-yellow-800">
                  <AlertTriangle className="w-5 h-5" />
                  Potential Issues to Check
                </CardTitle>
              </CardHeader>
              <CardContent>
                <ul className="space-y-2">
                  {currentContent.potentialIssues.map((issue, index) => (
                    <li key={index} className="flex items-start gap-2">
                      <Flag className="w-4 h-4 text-yellow-600 mt-0.5 flex-shrink-0" />
                      <span className="text-sm text-yellow-800">{issue}</span>
                    </li>
                  ))}
                </ul>
              </CardContent>
            </Card>
          </div>

          {/* Moderation Panel */}
          <div className="space-y-6">
            {/* Moderation Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Content Evaluation</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {moderationCriteria.map((criterion) => (
                  <div key={criterion.key}>
                    <div className="mb-3">
                      <div className="font-medium text-sm">{criterion.label}</div>
                      <div className="text-xs text-gray-600">{criterion.description}</div>
                    </div>
                    
                    {criterion.key === 'factual_accuracy' && (
                      <div className="flex gap-2">
                        <Button
                          variant={moderationResults[`${currentContent.id}-${criterion.key}`] === 'accurate' ? "default" : "outline"}
                          onClick={() => handleModeration(criterion.key, 'accurate')}
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accurate
                        </Button>
                        <Button
                          variant={moderationResults[`${currentContent.id}-${criterion.key}`] === 'inaccurate' ? "destructive" : "outline"}
                          onClick={() => handleModeration(criterion.key, 'inaccurate')}
                          size="sm"
                        >
                          <AlertTriangle className="w-4 h-4 mr-1" />
                          Inaccurate
                        </Button>
                      </div>
                    )}

                    {criterion.key === 'safety' && (
                      <div className="flex gap-2">
                        <Button
                          variant={moderationResults[`${currentContent.id}-${criterion.key}`] === 'safe' ? "default" : "outline"}
                          onClick={() => handleModeration(criterion.key, 'safe')}
                          size="sm"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Safe
                        </Button>
                        <Button
                          variant={moderationResults[`${currentContent.id}-${criterion.key}`] === 'unsafe' ? "destructive" : "outline"}
                          onClick={() => handleModeration(criterion.key, 'unsafe')}
                          size="sm"
                        >
                          <Flag className="w-4 h-4 mr-1" />
                          Unsafe
                        </Button>
                      </div>
                    )}

                    {(criterion.key === 'bias' || criterion.key === 'appropriateness') && (
                      <div className="flex gap-1">
                        {[1, 2, 3, 4, 5].map((rating) => (
                          <button
                            key={rating}
                            onClick={() => handleModeration(criterion.key, rating)}
                            className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                              moderationResults[`${currentContent.id}-${criterion.key}`] === rating
                                ? 'bg-orange-600 text-white'
                                : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                            }`}
                          >
                            {rating}
                          </button>
                        ))}
                      </div>
                    )}
                  </div>
                ))}

                {/* Detailed Feedback */}
                <div>
                  <label className="text-sm font-medium block mb-2">Moderation Notes</label>
                  <Textarea
                    placeholder="Explain any issues found, bias detected, or safety concerns..."
                    value={feedback[currentContent.id] || ''}
                    onChange={(e) => handleFeedback(e.target.value)}
                    rows={4}
                  />
                </div>

                <Button 
                  onClick={completeCurrentItem}
                  disabled={!isCurrentCompleted()}
                  className="w-full"
                >
                  {currentItem === contentItems.length - 1 ? 'Complete Moderation' : 'Next Content'}
                </Button>
              </CardContent>
            </Card>

            {/* Completed Reviews */}
            {completedItems.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Reviews</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedItems.map((itemId) => {
                      const item = contentItems.find(c => c.id === itemId);
                      const safetyResult = moderationResults[`${itemId}-safety`];
                      
                      return (
                        <div key={itemId} className="flex items-center justify-between">
                          <div className="flex items-center gap-2">
                            <CheckCircle className="w-4 h-4 text-green-600" />
                            <span className="text-sm font-medium">{item?.topic}</span>
                          </div>
                          <Badge 
                            className={safetyResult === 'unsafe' ? 'bg-red-100 text-red-800' : 'bg-green-100 text-green-800'}
                          >
                            {safetyResult === 'unsafe' ? 'Flagged' : 'Approved'}
                          </Badge>
                        </div>
                      );
                    })}
                  </div>
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}