import { useState } from 'react';
import { ArrowLeft, Code, CheckCircle, AlertTriangle, Info, FileText, GitBranch, Users } from 'lucide-react';
import { Button } from '../../ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '../../ui/card';
import { Badge } from '../../ui/badge';
import { Textarea } from '../../ui/textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../../ui/tabs';

interface CodeReviewProps {
  task?: any;
  onComplete: (taskId: string, submissionData: any) => void;
  onBack: () => void;
}

interface ReviewItem {
  id: string;
  type: 'bug' | 'improvement' | 'style' | 'security' | 'performance';
  line: number;
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}

export function CodeReview({ task, onComplete, onBack }: CodeReviewProps) {
  const [reviews, setReviews] = useState<ReviewItem[]>([]);
  const [selectedLine, setSelectedLine] = useState<number | null>(null);
  const [reviewType, setReviewType] = useState<ReviewItem['type']>('improvement');
  const [reviewMessage, setReviewMessage] = useState('');
  const [severity, setSeverity] = useState<ReviewItem['severity']>('medium');
  const [overallComment, setOverallComment] = useState('');
  const [approved, setApproved] = useState<boolean | null>(null);

  // Sample code for review
  const codeToReview = `// User Authentication Service
import bcrypt from 'bcrypt';
import jwt from 'jsonwebtoken';

class AuthService {
  private secretKey = 'hardcoded-secret-123'; // Line 5
  
  async loginUser(email: string, password: string) {
    const user = await this.findUserByEmail(email);
    
    if (!user) {
      throw new Error('Invalid credentials'); // Line 10
    }
    
    const isValid = await bcrypt.compare(password, user.hashedPassword);
    
    if (!isValid) {
      return null; // Line 15
    }
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      this.secretKey,
      { expiresIn: '24h' } // Line 21
    );
    
    return { token, user };
  }
  
  private async findUserByEmail(email) { // Line 26
    // TODO: Add database query
    return null;
  }
}`;

  const codeLines = codeToReview.split('\n');

  const addReview = () => {
    if (!selectedLine || !reviewMessage.trim()) return;

    const newReview: ReviewItem = {
      id: `review-${Date.now()}`,
      type: reviewType,
      line: selectedLine,
      message: reviewMessage,
      severity
    };

    setReviews([...reviews, newReview]);
    setReviewMessage('');
    setSelectedLine(null);
  };

  const removeReview = (reviewId: string) => {
    setReviews(reviews.filter(r => r.id !== reviewId));
  };

  const getReviewTypeIcon = (type: ReviewItem['type']) => {
    switch (type) {
      case 'bug': return '🐛';
      case 'improvement': return '💡';
      case 'style': return '🎨';
      case 'security': return '🔒';
      case 'performance': return '⚡';
      default: return '📝';
    }
  };

  const getSeverityColor = (severity: ReviewItem['severity']) => {
    switch (severity) {
      case 'critical': return 'bg-red-100 text-red-800';
      case 'high': return 'bg-orange-100 text-orange-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-blue-100 text-blue-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const handleSubmit = () => {
    const submissionData = {
      reviews,
      overallComment,
      approved,
      reviewedLines: reviews.length,
      totalLines: codeLines.length,
      completedAt: new Date().toISOString()
    };

    onComplete('code-review-task', submissionData);
  };

  return (
    <div className="min-h-screen bg-gray-50 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-4">
            <Button variant="ghost" size="sm" onClick={onBack}>
              <ArrowLeft className="w-4 h-4 mr-2" />
              Back to Dashboard
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Code Review Task</h1>
              <p className="text-gray-600">Review the authentication service code for bugs, improvements, and security issues</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <Badge variant="secondary">
              <Code className="w-4 h-4 mr-1" />
              JavaScript/TypeScript
            </Badge>
            <Badge variant="secondary">
              <GitBranch className="w-4 h-4 mr-1" />
              PR #1247
            </Badge>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Code Panel */}
          <div className="lg:col-span-2">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="w-5 h-5" />
                  AuthService.ts
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="bg-gray-900 rounded-lg p-4 font-mono text-sm overflow-x-auto">
                  {codeLines.map((line, index) => {
                    const lineNumber = index + 1;
                    const hasReview = reviews.some(r => r.line === lineNumber);
                    const isSelected = selectedLine === lineNumber;
                    
                    return (
                      <div
                        key={lineNumber}
                        className={`flex hover:bg-gray-800 cursor-pointer ${
                          isSelected ? 'bg-blue-800' : hasReview ? 'bg-red-900' : ''
                        }`}
                        onClick={() => setSelectedLine(lineNumber)}
                      >
                        <span className="text-gray-500 w-8 text-right mr-4 select-none">
                          {lineNumber}
                        </span>
                        <span className="text-gray-300">{line}</span>
                        {hasReview && (
                          <span className="ml-2 text-red-400">●</span>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Review Panel */}
          <div className="space-y-6">
            {/* Add Review Form */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Add Review Comment</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {selectedLine && (
                  <div className="text-sm text-blue-600">
                    Selected Line: {selectedLine}
                  </div>
                )}
                
                <div>
                  <label className="text-sm font-medium">Review Type</label>
                  <select 
                    value={reviewType} 
                    onChange={(e) => setReviewType(e.target.value as ReviewItem['type'])}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="bug">🐛 Bug</option>
                    <option value="improvement">💡 Improvement</option>
                    <option value="style">🎨 Style</option>
                    <option value="security">🔒 Security</option>
                    <option value="performance">⚡ Performance</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Severity</label>
                  <select 
                    value={severity} 
                    onChange={(e) => setSeverity(e.target.value as ReviewItem['severity'])}
                    className="w-full mt-1 p-2 border rounded-md"
                  >
                    <option value="low">Low</option>
                    <option value="medium">Medium</option>
                    <option value="high">High</option>
                    <option value="critical">Critical</option>
                  </select>
                </div>

                <div>
                  <label className="text-sm font-medium">Comment</label>
                  <Textarea
                    value={reviewMessage}
                    onChange={(e) => setReviewMessage(e.target.value)}
                    placeholder="Describe the issue or suggestion..."
                    className="mt-1"
                  />
                </div>

                <Button 
                  onClick={addReview} 
                  disabled={!selectedLine || !reviewMessage.trim()}
                  className="w-full"
                >
                  Add Review Comment
                </Button>
              </CardContent>
            </Card>

            {/* Review List */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Review Comments ({reviews.length})</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-3">
                  {reviews.map((review) => (
                    <div key={review.id} className="border rounded-lg p-3">
                      <div className="flex items-start justify-between mb-2">
                        <div className="flex items-center gap-2">
                          <span>{getReviewTypeIcon(review.type)}</span>
                          <span className="font-medium">Line {review.line}</span>
                          <Badge className={getSeverityColor(review.severity)}>
                            {review.severity}
                          </Badge>
                        </div>
                        <Button 
                          variant="ghost" 
                          size="sm" 
                          onClick={() => removeReview(review.id)}
                        >
                          ×
                        </Button>
                      </div>
                      <p className="text-sm text-gray-600">{review.message}</p>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Final Review */}
            <Card>
              <CardHeader>
                <CardTitle className="text-lg">Final Review</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <label className="text-sm font-medium">Overall Comments</label>
                  <Textarea
                    value={overallComment}
                    onChange={(e) => setOverallComment(e.target.value)}
                    placeholder="Summarize your overall review..."
                    className="mt-1"
                  />
                </div>

                <div>
                  <label className="text-sm font-medium mb-3 block">Approval Status</label>
                  <div className="flex gap-2">
                    <Button 
                      variant={approved === true ? "default" : "outline"}
                      onClick={() => setApproved(true)}
                      className="flex-1"
                    >
                      <CheckCircle className="w-4 h-4 mr-2" />
                      Approve
                    </Button>
                    <Button 
                      variant={approved === false ? "destructive" : "outline"}
                      onClick={() => setApproved(false)}
                      className="flex-1"
                    >
                      <AlertTriangle className="w-4 h-4 mr-2" />
                      Request Changes
                    </Button>
                  </div>
                </div>

                <Button 
                  onClick={handleSubmit}
                  disabled={approved === null}
                  className="w-full"
                >
                  Submit Review
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>
  );
}