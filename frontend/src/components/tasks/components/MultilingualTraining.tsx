import { useState } from 'react';
import { ArrowLeft, Globe, MessageSquare, CheckCircle, AlertTriangle, Volume2, Mic } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';

interface MultilingualTrainingProps {
  task?: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

interface ConversationExample {
  id: string;
  language: string;
  context: string;
  userMessage: string;
  aiResponse: string;
  culturalNotes: string[];
}

export function MultilingualTraining({ task, onComplete, onBack }: MultilingualTrainingProps) {
  const [currentExample, setCurrentExample] = useState(0);
  const [ratings, setRatings] = useState<{[key: string]: number}>({});
  const [feedback, setFeedback] = useState<{[key: string]: string}>({});
  const [completedExamples, setCompletedExamples] = useState<string[]>([]);

  const conversationExamples: ConversationExample[] = [
    {
      id: 'conv-1',
      language: 'Spanish (Mexico)',
      context: 'Customer service inquiry about a delayed package',
      userMessage: '¡Hola! Mi paquete debería haber llegado ayer pero no ha llegado. ¿Pueden ayudarme?',
      aiResponse: 'Hola, lamento mucho la demora en su paquete. Entiendo su preocupación y me haré cargo personalmente de revisar el estado de su envío. ¿Podría proporcionarme su número de seguimiento para investigar inmediatamente?',
      culturalNotes: ['Uses formal "usted" appropriately for customer service', 'Shows empathy with "lamento mucho"', 'Takes personal responsibility with "me haré cargo"']
    },
    {
      id: 'conv-2',
      language: 'Japanese',
      context: 'Business meeting scheduling between colleagues',
      userMessage: '来週の会議の件ですが、火曜日の午後はいかがでしょうか？',
      aiResponse: 'ありがとうございます。火曜日の午後でしたら、私のスケジュールは空いております。何時頃がよろしいでしょうか？他の参加者の皆様のご都合も確認させていただきたく思います。',
      culturalNotes: ['Uses appropriate keigo (honorific language)', 'Shows consideration for others with group consensus', 'Maintains humble tone with "させていただきたく"']
    },
    {
      id: 'conv-3',
      language: 'French (France)',
      context: 'Casual conversation between friends about weekend plans',
      userMessage: 'Salut ! Tu fais quoi ce weekend ? On pourrait peut-être se voir ?',
      aiResponse: 'Salut ! Ce weekend je n\'ai rien de prévu pour l\'instant. Ça me ferait vraiment plaisir qu\'on se voie ! Tu avais une idée en tête ? On pourrait aller prendre un verre ou se balader si il fait beau.',
      culturalNotes: ['Uses casual "tu" form appropriate for friends', 'Shows enthusiasm with "vraiment plaisir"', 'Suggests typical French social activities']
    }
  ];

  const currentConv = conversationExamples[currentExample];

  const handleRating = (aspect: string, rating: number) => {
    setRatings(prev => ({
      ...prev,
      [`${currentConv.id}-${aspect}`]: rating
    }));
  };

  const handleFeedback = (aspect: string, text: string) => {
    setFeedback(prev => ({
      ...prev,
      [`${currentConv.id}-${aspect}`]: text
    }));
  };

  const completeCurrentExample = () => {
    setCompletedExamples(prev => [...prev, currentConv.id]);
    if (currentExample < conversationExamples.length - 1) {
      setCurrentExample(currentExample + 1);
    } else {
      // All examples completed
      const submissionData = {
        completedExamples: completedExamples.length + 1,
        ratings,
        feedback,
        totalExamples: conversationExamples.length,
        averageRating: Object.values(ratings).reduce((a, b) => a + b, 0) / Object.values(ratings).length
      };
      onComplete('genesis-b1-multilingual', submissionData);
    }
  };

  const isCurrentCompleted = () => {
    const requiredRatings = ['cultural_appropriateness', 'linguistic_accuracy', 'contextual_relevance'];
    return requiredRatings.every(aspect => 
      ratings[`${currentConv.id}-${aspect}`] !== undefined
    );
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
              <h1 className="text-2xl font-bold text-gray-900">Genesis B1 Multilingual Training</h1>
              <p className="text-gray-600">Train multilingual AI on conversation patterns with cultural context</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Globe className="w-4 h-4 mr-1" />
              Multilingual
            </Badge>
            <Badge variant="secondary">
              Example {currentExample + 1} of {conversationExamples.length}
            </Badge>
          </div>
        </div>

        {/* Progress */}
        <div className="mb-6">
          <div className="flex items-center justify-between mb-2">
            <span className="text-sm font-medium text-gray-700">Progress</span>
            <span className="text-sm text-gray-500">{completedExamples.length}/{conversationExamples.length} completed</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div 
              className="bg-blue-600 h-2 rounded-full transition-all duration-300"
              style={{ width: `${(completedExamples.length / conversationExamples.length) * 100}%` }}
            />
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Conversation Panel */}
          <div className="lg:col-span-2 space-y-6">
            {/* Language & Context */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Globe className="w-5 h-5" />
                  {currentConv.language}
                </CardTitle>
                <p className="text-sm text-gray-600"><strong>Context:</strong> {currentConv.context}</p>
              </CardHeader>
            </Card>

            {/* Conversation */}
            <div className="space-y-4">
              {/* User Message */}
              <Card>
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                      <MessageSquare className="w-4 h-4 text-blue-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-1">User</div>
                      <div className="text-gray-900">{currentConv.userMessage}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* AI Response */}
              <Card className="border-green-200 bg-green-50">
                <CardContent className="p-4">
                  <div className="flex items-start gap-3">
                    <div className="w-8 h-8 bg-green-100 rounded-full flex items-center justify-center">
                      <Mic className="w-4 h-4 text-green-600" />
                    </div>
                    <div className="flex-1">
                      <div className="text-sm font-medium text-gray-700 mb-1">AI Assistant</div>
                      <div className="text-gray-900">{currentConv.aiResponse}</div>
                    </div>
                    <Button variant="ghost" size="sm">
                      <Volume2 className="w-4 h-4" />
                    </Button>
                  </div>
                </CardContent>
              </Card>

              {/* Cultural Notes */}
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Cultural Context Notes</CardTitle>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-2">
                    {currentConv.culturalNotes.map((note, index) => (
                      <li key={index} className="flex items-start gap-2">
                        <CheckCircle className="w-4 h-4 text-green-600 mt-0.5 flex-shrink-0" />
                        <span className="text-sm text-gray-700">{note}</span>
                      </li>
                    ))}
                  </ul>
                </CardContent>
              </Card>
            </div>
          </div>

          {/* Evaluation Panel */}
          <div className="space-y-6">
            {/* Rating Categories */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Evaluate AI Response</CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {[
                  { key: 'cultural_appropriateness', label: 'Cultural Appropriateness', desc: 'Respects cultural norms and context' },
                  { key: 'linguistic_accuracy', label: 'Linguistic Accuracy', desc: 'Grammar, vocabulary, and formality level' },
                  { key: 'contextual_relevance', label: 'Contextual Relevance', desc: 'Appropriate for the situation' }
                ].map((aspect) => (
                  <div key={aspect.key}>
                    <div className="mb-2">
                      <div className="font-medium text-sm">{aspect.label}</div>
                      <div className="text-xs text-gray-600">{aspect.desc}</div>
                    </div>
                    <div className="flex gap-1">
                      {[1, 2, 3, 4, 5].map((rating) => (
                        <button
                          key={rating}
                          onClick={() => handleRating(aspect.key, rating)}
                          className={`w-8 h-8 rounded-full text-sm font-medium transition-colors ${
                            ratings[`${currentConv.id}-${aspect.key}`] === rating
                              ? 'bg-blue-600 text-white'
                              : 'bg-gray-200 text-gray-600 hover:bg-gray-300'
                          }`}
                        >
                          {rating}
                        </button>
                      ))}
                    </div>
                  </div>
                ))}

                {/* Optional Feedback */}
                <div>
                  <label className="text-sm font-medium block mb-2">Additional Feedback (Optional)</label>
                  <Textarea
                    placeholder="Provide specific feedback about cultural nuances, language use, or improvements..."
                    value={feedback[`${currentConv.id}-general`] || ''}
                    onChange={(e) => handleFeedback('general', e.target.value)}
                  />
                </div>

                <Button 
                  onClick={completeCurrentExample}
                  disabled={!isCurrentCompleted()}
                  className="w-full"
                >
                  {currentExample === conversationExamples.length - 1 ? 'Complete Training' : 'Next Example'}
                </Button>
              </CardContent>
            </Card>

            {/* Completed Examples */}
            {completedExamples.length > 0 && (
              <Card>
                <CardHeader>
                  <CardTitle className="text-lg">Completed Examples</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-2">
                    {completedExamples.map((exampleId) => {
                      const example = conversationExamples.find(e => e.id === exampleId);
                      return (
                        <div key={exampleId} className="flex items-center gap-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-green-600" />
                          <span>{example?.language}</span>
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