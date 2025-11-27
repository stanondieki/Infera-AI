import { useState } from 'react';
import { CheckCircle, XCircle, Eye, Clock, User, Star } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Textarea } from '../ui/textarea';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { toast } from 'sonner';

interface TaskReviewDialogProps {
  open: boolean;
  onClose: () => void;
  task: any;
  onReviewComplete: (taskId: string, action: string) => void;
  accessToken: string;
}

export function TaskReviewDialog({ open, onClose, task, onReviewComplete, accessToken }: TaskReviewDialogProps) {
  const [feedback, setFeedback] = useState('');
  const [rating, setRating] = useState(0);
  const [reviewing, setReviewing] = useState(false);

  const handleReview = async (action: 'approve' | 'reject') => {
    setReviewing(true);
    try {
      const response = await fetch(`http://localhost:5000/api/tasks/${task._id}/review`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${accessToken}`
        },
        body: JSON.stringify({
          action,
          feedback,
          rating: action === 'approve' ? rating : 0
        })
      });

      const data = await response.json();

      if (response.ok && data.success) {
        toast.success(`Task ${action}d successfully!`);
        onReviewComplete(task._id, action);
        onClose();
      } else {
        throw new Error(data.message || `Failed to ${action} task`);
      }
    } catch (error: any) {
      console.error(`Error ${action}ing task:`, error);
      toast.error(error.message || `Failed to ${action} task`);
    } finally {
      setReviewing(false);
    }
  };

  const getSubmissionContent = (deliverables: any[]) => {
    if (!deliverables || deliverables.length === 0) return 'No deliverables submitted';
    
    return deliverables.map((item, idx) => {
      try {
        const parsed = typeof item === 'string' ? JSON.parse(item) : item;
        if (parsed.type === 'text') {
          return (
            <div key={idx} className="mb-3 p-3 bg-gray-50 rounded">
              <div className="font-medium text-sm text-gray-700 mb-1">{parsed.key}:</div>
              <div className="text-sm">{parsed.value}</div>
            </div>
          );
        } else if (parsed.type === 'file') {
          return (
            <div key={idx} className="mb-2 p-2 bg-blue-50 rounded flex items-center gap-2">
              <span className="text-blue-600">📎</span>
              <span className="text-sm">{parsed.name}</span>
              {parsed.size && <span className="text-xs text-gray-500">({(parsed.size / 1024).toFixed(1)} KB)</span>}
            </div>
          );
        }
        return (
          <div key={idx} className="mb-2 p-2 bg-gray-50 rounded">
            <pre className="text-xs overflow-auto">{JSON.stringify(parsed, null, 2)}</pre>
          </div>
        );
      } catch (e) {
        return (
          <div key={idx} className="mb-2 p-2 bg-gray-50 rounded">
            <span className="text-sm">{item.toString()}</span>
          </div>
        );
      }
    });
  };

  if (!task) return null;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-3">
            <Eye className="w-5 h-5" />
            Review Task Submission
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Task Information */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Task Details</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <span className="text-sm font-medium text-gray-600">Title:</span>
                  <p className="font-medium">{task.title}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Category:</span>
                  <Badge className="ml-2">{task.category?.replace('_', ' ')}</Badge>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Assigned To:</span>
                  <p className="flex items-center gap-2">
                    <User className="w-4 h-4" />
                    {task.assignedTo?.name} ({task.assignedTo?.email})
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Submitted:</span>
                  <p className="flex items-center gap-2">
                    <Clock className="w-4 h-4" />
                    {task.submittedAt ? new Date(task.submittedAt).toLocaleString() : 'N/A'}
                  </p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Time Spent:</span>
                  <p>{task.actualHours ? `${task.actualHours} hours` : 'Not recorded'}</p>
                </div>
                <div>
                  <span className="text-sm font-medium text-gray-600">Rate:</span>
                  <p>${task.hourlyRate}/hour</p>
                </div>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Description:</span>
                <p className="text-sm text-gray-700 mt-1">{task.description}</p>
              </div>

              <div>
                <span className="text-sm font-medium text-gray-600">Instructions:</span>
                <p className="text-sm text-gray-700 mt-1">{task.instructions}</p>
              </div>
            </CardContent>
          </Card>

          {/* Submission Content */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Submission Content</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {task.submissionNotes && (
                <div>
                  <span className="text-sm font-medium text-gray-600">Notes:</span>
                  <div className="mt-1 p-3 bg-yellow-50 border border-yellow-200 rounded">
                    <p className="text-sm">{task.submissionNotes}</p>
                  </div>
                </div>
              )}

              <div>
                <span className="text-sm font-medium text-gray-600">Deliverables:</span>
                <div className="mt-2">
                  {getSubmissionContent(task.submissionFiles || [])}
                </div>
              </div>

              <div className="bg-blue-50 p-4 rounded">
                <div className="text-sm font-medium text-blue-900 mb-2">Estimated Earnings</div>
                <div className="text-xl font-bold text-blue-900">
                  ${task.actualHours && task.hourlyRate ? (task.actualHours * task.hourlyRate).toFixed(2) : '0.00'}
                </div>
                <div className="text-xs text-blue-700">
                  {task.actualHours || 0} hours × ${task.hourlyRate || 0}/hour
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Review Form */}
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Review & Feedback</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <label className="block text-sm font-medium mb-2">Quality Rating (for approval)</label>
                <div className="flex items-center gap-1">
                  {[1, 2, 3, 4, 5].map((star) => (
                    <button
                      key={star}
                      type="button"
                      onClick={() => setRating(star)}
                      className={`w-8 h-8 ${rating >= star ? 'text-yellow-400' : 'text-gray-300'} hover:text-yellow-400`}
                    >
                      <Star className="w-full h-full fill-current" />
                    </button>
                  ))}
                  <span className="ml-2 text-sm text-gray-600">
                    {rating > 0 ? `${rating}/5` : 'No rating'}
                  </span>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium mb-2">Feedback & Comments</label>
                <Textarea
                  value={feedback}
                  onChange={(e) => setFeedback(e.target.value)}
                  placeholder="Provide feedback about the task submission..."
                  rows={4}
                  className="w-full"
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-4 border-t">
                <Button variant="outline" onClick={onClose} disabled={reviewing}>
                  Cancel
                </Button>
                <Button 
                  variant="destructive" 
                  onClick={() => handleReview('reject')}
                  disabled={reviewing}
                  className="flex items-center gap-2"
                >
                  <XCircle className="w-4 h-4" />
                  {reviewing ? 'Rejecting...' : 'Reject'}
                </Button>
                <Button 
                  onClick={() => handleReview('approve')}
                  disabled={reviewing || rating === 0}
                  className="flex items-center gap-2"
                >
                  <CheckCircle className="w-4 h-4" />
                  {reviewing ? 'Approving...' : 'Approve'}
                </Button>
              </div>

              {rating === 0 && (
                <p className="text-xs text-red-600 text-center">
                  Please provide a quality rating to approve the task
                </p>
              )}
            </CardContent>
          </Card>
        </div>
      </DialogContent>
    </Dialog>
  );
}