'use client';

import { useState, useCallback } from 'react';
import { 
  Globe, Languages, Volume2, Play, Pause, RotateCcw,
  CheckCircle, XCircle, AlertCircle, MessageSquare,
  ThumbsUp, ThumbsDown, Star, ChevronLeft, ChevronRight,
  Send, Flag, Info, BookOpen, Users, BarChart2,
  Mic, Headphones, Copy, Clock, FileText
} from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Progress } from '../../ui/progress';
import { toast } from 'sonner';

interface ConversationTurn {
  id: string;
  speaker: 'user' | 'assistant';
  originalText: string;
  translatedText?: string;
  language: string;
  audioUrl?: string;
}

interface Evaluation {
  accuracy: number;
  fluency: number;
  cultural: number;
  overall: number;
  notes: string;
}

interface MultilingualInterfaceProps {
  task: any;
  onEvaluationChange: (data: any) => void;
  onComplete: (data: any) => void;
}

// Sample conversations in different languages
const SAMPLE_CONVERSATIONS: Record<string, ConversationTurn[]> = {
  spanish: [
    {
      id: '1',
      speaker: 'user',
      originalText: 'Hola, me gustaría saber el horario de atención de la tienda.',
      translatedText: 'Hello, I would like to know the store opening hours.',
      language: 'Spanish'
    },
    {
      id: '2',
      speaker: 'assistant',
      originalText: 'Buenos días. Nuestra tienda está abierta de lunes a viernes de 9:00 a 20:00, y los sábados de 10:00 a 14:00.',
      translatedText: 'Good morning. Our store is open Monday to Friday from 9:00 AM to 8:00 PM, and Saturdays from 10:00 AM to 2:00 PM.',
      language: 'Spanish'
    },
    {
      id: '3',
      speaker: 'user',
      originalText: '¿Aceptan tarjetas de crédito o solo efectivo?',
      translatedText: 'Do you accept credit cards or only cash?',
      language: 'Spanish'
    },
    {
      id: '4',
      speaker: 'assistant',
      originalText: 'Aceptamos todas las tarjetas de crédito principales, débito, y también pagos móviles como Apple Pay y Google Pay.',
      translatedText: 'We accept all major credit cards, debit cards, and also mobile payments like Apple Pay and Google Pay.',
      language: 'Spanish'
    }
  ],
  japanese: [
    {
      id: '1',
      speaker: 'user',
      originalText: 'すみません、この商品の在庫はありますか？',
      translatedText: 'Excuse me, do you have this product in stock?',
      language: 'Japanese'
    },
    {
      id: '2',
      speaker: 'assistant',
      originalText: 'はい、ございます。こちらの商品は現在3色展開しております。ブラック、ホワイト、ネイビーからお選びいただけます。',
      translatedText: 'Yes, we do. This product is currently available in 3 colors. You can choose from black, white, or navy.',
      language: 'Japanese'
    },
    {
      id: '3',
      speaker: 'user',
      originalText: 'ネイビーをお願いします。ラッピングはできますか？',
      translatedText: 'I\'ll take the navy one. Can you gift wrap it?',
      language: 'Japanese'
    },
    {
      id: '4',
      speaker: 'assistant',
      originalText: 'かしこまりました。ラッピングは無料でサービスさせていただいております。リボンのお色はいかがいたしましょうか？',
      translatedText: 'Certainly. Gift wrapping is complimentary. What color ribbon would you like?',
      language: 'Japanese'
    }
  ],
  french: [
    {
      id: '1',
      speaker: 'user',
      originalText: 'Bonjour, je cherche un cadeau pour ma mère. Avez-vous des suggestions?',
      translatedText: 'Hello, I\'m looking for a gift for my mother. Do you have any suggestions?',
      language: 'French'
    },
    {
      id: '2',
      speaker: 'assistant',
      originalText: 'Bien sûr! Nous avons une belle collection de foulards en soie et de parfums artisanaux. Quel est votre budget?',
      translatedText: 'Of course! We have a beautiful collection of silk scarves and artisanal perfumes. What\'s your budget?',
      language: 'French'
    },
    {
      id: '3',
      speaker: 'user',
      originalText: 'Entre 50 et 100 euros. Elle aime les choses élégantes mais simples.',
      translatedText: 'Between 50 and 100 euros. She likes elegant but simple things.',
      language: 'French'
    },
    {
      id: '4',
      speaker: 'assistant',
      originalText: 'Je vous recommande ce coffret parfum qui inclut une eau de toilette et une crème pour les mains. C\'est élégant et très apprécié.',
      translatedText: 'I recommend this perfume gift set that includes an eau de toilette and hand cream. It\'s elegant and very well received.',
      language: 'French'
    }
  ]
};

// Language options
const LANGUAGES = [
  { code: 'spanish', name: 'Spanish', flag: '🇪🇸', nativeName: 'Español' },
  { code: 'japanese', name: 'Japanese', flag: '🇯🇵', nativeName: '日本語' },
  { code: 'french', name: 'French', flag: '🇫🇷', nativeName: 'Français' },
  { code: 'german', name: 'German', flag: '🇩🇪', nativeName: 'Deutsch' },
  { code: 'portuguese', name: 'Portuguese', flag: '🇧🇷', nativeName: 'Português' },
  { code: 'chinese', name: 'Chinese', flag: '🇨🇳', nativeName: '中文' },
  { code: 'korean', name: 'Korean', flag: '🇰🇷', nativeName: '한국어' },
  { code: 'arabic', name: 'Arabic', flag: '🇸🇦', nativeName: 'العربية' }
];

// Rating criteria
const RATING_CRITERIA = [
  { 
    id: 'accuracy', 
    name: 'Translation Accuracy',
    description: 'How accurately the response conveys the intended meaning',
    icon: CheckCircle
  },
  { 
    id: 'fluency', 
    name: 'Natural Fluency',
    description: 'How natural and native-like the language sounds',
    icon: MessageSquare
  },
  { 
    id: 'cultural', 
    name: 'Cultural Appropriateness',
    description: 'Proper use of cultural context, formality, and expressions',
    icon: Users
  },
  { 
    id: 'overall', 
    name: 'Overall Quality',
    description: 'Overall impression of the conversation quality',
    icon: Star
  }
];

export function MultilingualInterface({ task, onEvaluationChange, onComplete }: MultilingualInterfaceProps) {
  // Get conversation from task or use sample
  const getConversation = useCallback((): ConversationTurn[] => {
    if (task?.taskData?.conversation) {
      return task.taskData.conversation as ConversationTurn[];
    }
    const lang = task?.taskData?.language || 'spanish';
    return SAMPLE_CONVERSATIONS[lang] || SAMPLE_CONVERSATIONS.spanish;
  }, [task]);

  const getLanguage = useCallback(() => {
    const lang = task?.taskData?.language || 'spanish';
    return LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];
  }, [task]);

  const conversation: ConversationTurn[] = getConversation();
  const language = getLanguage();

  // State
  const [currentTurnIndex, setCurrentTurnIndex] = useState(0);
  const [evaluations, setEvaluations] = useState<Record<string, Evaluation>>({});
  const [showTranslation, setShowTranslation] = useState(true);
  const [isPlaying, setIsPlaying] = useState(false);
  const [feedback, setFeedback] = useState('');
  const [suggestedTranslation, setSuggestedTranslation] = useState('');
  const [issues, setIssues] = useState<string[]>([]);

  // Current turn
  const currentTurn = conversation[currentTurnIndex];

  // Update evaluation for current turn
  const updateEvaluation = (turnId: string, criterion: string, value: number) => {
    setEvaluations(prev => ({
      ...prev,
      [turnId]: {
        ...prev[turnId],
        [criterion]: value,
        notes: prev[turnId]?.notes || ''
      }
    }));

    onEvaluationChange({
      evaluations: {
        ...evaluations,
        [turnId]: { ...evaluations[turnId], [criterion]: value }
      },
      feedback,
      issues
    });
  };

  // Update notes for current turn
  const updateNotes = (turnId: string, notes: string) => {
    setEvaluations(prev => ({
      ...prev,
      [turnId]: {
        ...prev[turnId],
        notes
      }
    }));
  };

  // Toggle issue flag
  const toggleIssue = (issue: string) => {
    setIssues(prev => 
      prev.includes(issue) 
        ? prev.filter(i => i !== issue)
        : [...prev, issue]
    );
  };

  // Navigate turns
  const goToTurn = (index: number) => {
    if (index >= 0 && index < conversation.length) {
      setCurrentTurnIndex(index);
    }
  };

  // Calculate progress
  const evaluatedTurns = Object.keys(evaluations).filter(id => 
    evaluations[id]?.accuracy && evaluations[id]?.fluency && 
    evaluations[id]?.cultural && evaluations[id]?.overall
  ).length;
  const progressPercentage = (evaluatedTurns / conversation.length) * 100;

  // Calculate average scores
  const calculateAverages = () => {
    const allEvaluations = Object.values(evaluations);
    if (allEvaluations.length === 0) return { accuracy: 0, fluency: 0, cultural: 0, overall: 0 };

    return {
      accuracy: Math.round(allEvaluations.reduce((sum, e) => sum + (e.accuracy || 0), 0) / allEvaluations.length),
      fluency: Math.round(allEvaluations.reduce((sum, e) => sum + (e.fluency || 0), 0) / allEvaluations.length),
      cultural: Math.round(allEvaluations.reduce((sum, e) => sum + (e.cultural || 0), 0) / allEvaluations.length),
      overall: Math.round(allEvaluations.reduce((sum, e) => sum + (e.overall || 0), 0) / allEvaluations.length)
    };
  };

  const averages = calculateAverages();

  // Complete evaluation
  const handleComplete = () => {
    if (evaluatedTurns < conversation.length) {
      toast.error('Please evaluate all conversation turns');
      return;
    }

    onComplete({
      language: language.code,
      evaluations,
      averages,
      feedback,
      issues,
      completedAt: new Date().toISOString()
    });
  };

  // Copy text
  const copyText = (text: string) => {
    navigator.clipboard.writeText(text);
    toast.success('Text copied to clipboard');
  };

  // Render star rating
  const StarRating = ({ value, onChange }: { value: number; onChange: (v: number) => void }) => (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map(star => (
        <button
          key={star}
          onClick={() => onChange(star)}
          className={`p-1 transition-colors ${
            star <= value ? 'text-yellow-500' : 'text-gray-300'
          } hover:text-yellow-400`}
        >
          <Star className={`w-6 h-6 ${star <= value ? 'fill-current' : ''}`} />
        </button>
      ))}
    </div>
  );

  return (
    <div className="space-y-4">
      {/* Language Header */}
      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50">
        <CardContent className="py-4">
          <div className="flex items-center justify-between flex-wrap gap-4">
            <div className="flex items-center gap-4">
              <div className="text-4xl">{language.flag}</div>
              <div>
                <h2 className="text-lg font-semibold">{language.name} Conversation Evaluation</h2>
                <p className="text-sm text-gray-600">{language.nativeName}</p>
              </div>
            </div>
            <div className="flex items-center gap-3">
              <Badge variant="secondary" className="text-sm">
                <MessageSquare className="w-4 h-4 mr-1" />
                {conversation.length} turns
              </Badge>
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowTranslation(!showTranslation)}
              >
                <Languages className="w-4 h-4 mr-2" />
                {showTranslation ? 'Hide' : 'Show'} Translation
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        {/* Conversation View */}
        <div className="lg:col-span-2 space-y-4">
          {/* Turn Navigator */}
          <Card>
            <CardContent className="py-3">
              <div className="flex items-center justify-between">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToTurn(currentTurnIndex - 1)}
                  disabled={currentTurnIndex === 0}
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>
                
                <div className="flex items-center gap-2">
                  {conversation.map((turn: ConversationTurn, idx: number) => (
                    <button
                      key={turn.id}
                      onClick={() => goToTurn(idx)}
                      className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium transition-all ${
                        idx === currentTurnIndex
                          ? 'bg-blue-600 text-white'
                          : evaluations[turn.id]?.overall
                          ? 'bg-green-100 text-green-600 border border-green-300'
                          : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
                      }`}
                    >
                      {idx + 1}
                    </button>
                  ))}
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => goToTurn(currentTurnIndex + 1)}
                  disabled={currentTurnIndex === conversation.length - 1}
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>
            </CardContent>
          </Card>

          {/* Current Turn */}
          <Card>
            <CardHeader className="pb-3">
              <div className="flex items-center justify-between">
                <CardTitle className="text-sm flex items-center gap-2">
                  {currentTurn.speaker === 'user' ? (
                    <Badge variant="secondary">User</Badge>
                  ) : (
                    <Badge className="bg-blue-600">Assistant</Badge>
                  )}
                  <span className="text-gray-500">Turn {currentTurnIndex + 1}</span>
                </CardTitle>
                <div className="flex items-center gap-2">
                  <Button variant="ghost" size="sm" onClick={() => copyText(currentTurn.originalText)}>
                    <Copy className="w-4 h-4" />
                  </Button>
                  {currentTurn.audioUrl && (
                    <Button 
                      variant="ghost" 
                      size="sm"
                      onClick={() => setIsPlaying(!isPlaying)}
                    >
                      {isPlaying ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
                    </Button>
                  )}
                </div>
              </div>
            </CardHeader>
            <CardContent className="space-y-4">
              {/* Original Text */}
              <div className="p-4 bg-gray-50 rounded-lg">
                <div className="flex items-center gap-2 mb-2">
                  <Globe className="w-4 h-4 text-gray-500" />
                  <span className="text-xs font-medium text-gray-500">Original ({currentTurn.language})</span>
                </div>
                <p className="text-lg leading-relaxed">{currentTurn.originalText}</p>
              </div>

              {/* Translation */}
              {showTranslation && currentTurn.translatedText && (
                <div className="p-4 bg-blue-50 rounded-lg">
                  <div className="flex items-center gap-2 mb-2">
                    <Languages className="w-4 h-4 text-blue-500" />
                    <span className="text-xs font-medium text-blue-500">English Translation</span>
                  </div>
                  <p className="text-lg leading-relaxed text-gray-700">{currentTurn.translatedText}</p>
                </div>
              )}

              {/* Rating Section */}
              <div className="border-t pt-4">
                <h4 className="font-medium mb-3">Evaluate This Response</h4>
                <div className="space-y-4">
                  {RATING_CRITERIA.map(criterion => {
                    const CriterionIcon = criterion.icon;
                    return (
                      <div key={criterion.id} className="flex items-center justify-between">
                        <div className="flex items-center gap-2">
                          <CriterionIcon className="w-4 h-4 text-gray-400" />
                          <div>
                            <div className="text-sm font-medium">{criterion.name}</div>
                            <div className="text-xs text-gray-500">{criterion.description}</div>
                          </div>
                        </div>
                        <StarRating
                          value={evaluations[currentTurn.id]?.[criterion.id as keyof Evaluation] as number || 0}
                          onChange={(value) => updateEvaluation(currentTurn.id, criterion.id, value)}
                        />
                      </div>
                    );
                  })}
                </div>
              </div>

              {/* Notes */}
              <div>
                <label className="text-sm font-medium">Notes for this turn</label>
                <Textarea
                  value={evaluations[currentTurn.id]?.notes || ''}
                  onChange={(e) => updateNotes(currentTurn.id, e.target.value)}
                  placeholder="Add any specific observations or concerns..."
                  className="mt-1"
                  rows={2}
                />
              </div>

              {/* Suggested Translation */}
              <div>
                <label className="text-sm font-medium">Suggest Better Translation (optional)</label>
                <Textarea
                  value={suggestedTranslation}
                  onChange={(e) => setSuggestedTranslation(e.target.value)}
                  placeholder="If the translation could be improved, suggest a better version..."
                  className="mt-1"
                  rows={2}
                />
              </div>
            </CardContent>
          </Card>

          {/* Issue Flags */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <Flag className="w-4 h-4" />
                Flag Issues
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-2">
                {[
                  'Grammar Error',
                  'Cultural Insensitivity',
                  'Wrong Formality Level',
                  'Unnatural Phrasing',
                  'Missing Context',
                  'Incorrect Idiom',
                  'Misleading Translation',
                  'Technical Term Error'
                ].map(issue => (
                  <Button
                    key={issue}
                    variant={issues.includes(issue) ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => toggleIssue(issue)}
                    className={issues.includes(issue) ? 'bg-red-500 hover:bg-red-600' : ''}
                  >
                    {issue}
                  </Button>
                ))}
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Summary Panel */}
        <div className="space-y-4">
          {/* Progress */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <BarChart2 className="w-4 h-4" />
                Evaluation Progress
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex justify-between text-sm mb-1">
                  <span>Turns Evaluated</span>
                  <span>{evaluatedTurns}/{conversation.length}</span>
                </div>
                <Progress value={progressPercentage} />
              </div>

              <div className="pt-2 border-t">
                <h4 className="text-sm font-medium mb-3">Average Scores</h4>
                <div className="space-y-2">
                  {RATING_CRITERIA.map(criterion => (
                    <div key={criterion.id} className="flex items-center justify-between text-sm">
                      <span className="text-gray-600">{criterion.name}</span>
                      <div className="flex items-center gap-2">
                        <div className="flex">
                          {[1, 2, 3, 4, 5].map(star => (
                            <Star
                              key={star}
                              className={`w-3 h-3 ${
                                star <= averages[criterion.id as keyof typeof averages]
                                  ? 'text-yellow-500 fill-current'
                                  : 'text-gray-300'
                              }`}
                            />
                          ))}
                        </div>
                        <span className="font-medium w-4">{averages[criterion.id as keyof typeof averages] || '-'}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Conversation Overview */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm flex items-center gap-2">
                <MessageSquare className="w-4 h-4" />
                Conversation Flow
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-2 max-h-[200px] overflow-y-auto">
                {conversation.map((turn: ConversationTurn, idx: number) => {
                  const eval_ = evaluations[turn.id];
                  const hasEval = eval_?.overall;
                  
                  return (
                    <button
                      key={turn.id}
                      onClick={() => goToTurn(idx)}
                      className={`w-full flex items-center gap-2 p-2 rounded-lg text-left transition-all ${
                        idx === currentTurnIndex
                          ? 'bg-blue-100 border border-blue-300'
                          : 'hover:bg-gray-50'
                      }`}
                    >
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                        turn.speaker === 'user' ? 'bg-gray-200' : 'bg-blue-100'
                      }`}>
                        {turn.speaker === 'user' ? '👤' : '🤖'}
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="text-xs truncate">{turn.originalText}</p>
                      </div>
                      {hasEval && (
                        <Badge variant="secondary" className="text-xs">
                          {eval_.overall}★
                        </Badge>
                      )}
                    </button>
                  );
                })}
              </div>
            </CardContent>
          </Card>

          {/* Overall Feedback */}
          <Card>
            <CardHeader className="pb-3">
              <CardTitle className="text-sm">Overall Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <Textarea
                value={feedback}
                onChange={(e) => setFeedback(e.target.value)}
                placeholder="Provide overall feedback about this conversation's quality..."
                rows={4}
              />

              <Button
                className="w-full"
                onClick={handleComplete}
                disabled={evaluatedTurns < conversation.length}
              >
                <Send className="w-4 h-4 mr-2" />
                Submit Evaluation
              </Button>
              
              {evaluatedTurns < conversation.length && (
                <p className="text-xs text-center text-gray-500">
                  Evaluate all {conversation.length - evaluatedTurns} remaining turn(s)
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
