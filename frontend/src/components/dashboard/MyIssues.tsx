import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  AlertCircle,
  CheckCircle,
  Clock,
  Plus,
  Search,
  Filter,
  MessageSquare,
  X,
} from 'lucide-react';
import { Issue, getIssues, createIssue, getIssueStats } from '../../utils/issues';
import { useAuth } from '../../utils/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Textarea } from '../ui/textarea';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import { Label } from '../ui/label';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '../ui/card';
import { toast } from 'sonner';
import { ScrollArea } from '../ui/scroll-area';

interface MyIssuesProps {
  onClose?: () => void;
}

export function MyIssues({ onClose }: MyIssuesProps) {
  const { user } = useAuth();
  const [issues, setIssues] = useState<Issue[]>(getIssues(user?.id));
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [selectedIssue, setSelectedIssue] = useState<Issue | null>(null);
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [newIssue, setNewIssue] = useState({
    type: 'technical' as Issue['type'],
    priority: 'medium' as Issue['priority'],
    title: '',
    description: '',
  });

  const refreshIssues = () => {
    setIssues(getIssues(user?.id));
  };

  const filteredIssues = issues.filter(issue => {
    const matchesSearch =
      issue.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
      issue.description.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || issue.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const stats = getIssueStats(issues);

  const handleCreateIssue = () => {
    if (!user) {
      toast.error('You must be logged in to create an issue');
      return;
    }

    if (!newIssue.title || !newIssue.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      createIssue({
        user_id: user.id,
        user_name: user.email.split('@')[0] || 'User',
        type: newIssue.type,
        priority: newIssue.priority,
        title: newIssue.title,
        description: newIssue.description,
      });

      toast.success('Issue reported successfully! Admin will respond shortly.');
      
      setNewIssue({
        type: 'technical',
        priority: 'medium',
        title: '',
        description: '',
      });
      setShowCreateDialog(false);
      refreshIssues();
    } catch (error: any) {
      toast.error(error.message || 'Failed to create issue');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      open: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      in_progress: 'bg-blue-100 text-blue-800 border-blue-300',
      resolved: 'bg-green-100 text-green-800 border-green-300',
      closed: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.open;
  };

  const getTypeColor = (type: string) => {
    const colors = {
      bug: 'bg-red-100 text-red-800',
      technical: 'bg-blue-100 text-blue-800',
      question: 'bg-purple-100 text-purple-800',
      payment: 'bg-green-100 text-green-800',
      feature_request: 'bg-indigo-100 text-indigo-800',
      other: 'bg-gray-100 text-gray-800',
    };
    return colors[type as keyof typeof colors] || colors.other;
  };

  const getPriorityColor = (priority: string) => {
    const colors = {
      low: 'bg-gray-100 text-gray-800',
      medium: 'bg-blue-100 text-blue-800',
      high: 'bg-orange-100 text-orange-800',
      urgent: 'bg-red-100 text-red-800',
    };
    return colors[priority as keyof typeof colors] || colors.medium;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'resolved':
        return <CheckCircle className="h-4 w-4" />;
      case 'in_progress':
        return <Clock className="h-4 w-4" />;
      case 'open':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <X className="h-4 w-4" />;
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-gray-900">My Issues</h2>
          <p className="text-gray-600">Report and track your issues</p>
        </div>
        <Button onClick={() => setShowCreateDialog(true)} className="gap-2">
          <Plus className="h-4 w-4" />
          Report Issue
        </Button>
      </div>

      {/* Stats */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-gray-600" />
              <span className="text-gray-600">Total</span>
            </div>
            <p className="text-2xl text-gray-900">{stats.total}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <AlertCircle className="h-4 w-4 text-yellow-600" />
              <span className="text-gray-600">Open</span>
            </div>
            <p className="text-2xl text-yellow-600">{stats.open}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <Clock className="h-4 w-4 text-blue-600" />
              <span className="text-gray-600">In Progress</span>
            </div>
            <p className="text-2xl text-blue-600">{stats.in_progress}</p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center gap-2 mb-2">
              <CheckCircle className="h-4 w-4 text-green-600" />
              <span className="text-gray-600">Resolved</span>
            </div>
            <p className="text-2xl text-green-600">{stats.resolved}</p>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
            <Input
              placeholder="Search issues..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>
        </div>
        <Select value={statusFilter} onValueChange={setStatusFilter}>
          <SelectTrigger className="w-full md:w-40">
            <SelectValue placeholder="Status" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="all">All Status</SelectItem>
            <SelectItem value="open">Open</SelectItem>
            <SelectItem value="in_progress">In Progress</SelectItem>
            <SelectItem value="resolved">Resolved</SelectItem>
            <SelectItem value="closed">Closed</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {/* Issues List */}
      <ScrollArea className="h-[500px]">
        <div className="space-y-4">
          {filteredIssues.length === 0 ? (
            <Card>
              <CardContent className="py-12 text-center">
                <AlertCircle className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <p className="text-gray-600">No issues found</p>
                <Button
                  variant="outline"
                  onClick={() => setShowCreateDialog(true)}
                  className="mt-4 gap-2"
                >
                  <Plus className="h-4 w-4" />
                  Report Your First Issue
                </Button>
              </CardContent>
            </Card>
          ) : (
            filteredIssues.map((issue, index) => (
              <motion.div
                key={issue.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
              >
                <Card
                  className="hover:shadow-lg transition-shadow cursor-pointer"
                  onClick={() => setSelectedIssue(issue)}
                >
                  <CardContent className="p-6">
                    <div className="space-y-4">
                      <div className="flex items-start justify-between">
                        <div className="flex-1">
                          <div className="flex items-center gap-3 mb-2 flex-wrap">
                            <h4 className="text-gray-900">{issue.title}</h4>
                            <Badge className={getStatusColor(issue.status)}>
                              <div className="flex items-center gap-1">
                                {getStatusIcon(issue.status)}
                                {issue.status.replace('_', ' ')}
                              </div>
                            </Badge>
                            <Badge className={getTypeColor(issue.type)}>
                              {issue.type.replace('_', ' ')}
                            </Badge>
                            <Badge className={getPriorityColor(issue.priority)}>
                              {issue.priority}
                            </Badge>
                          </div>
                          <p className="text-gray-600 mb-3 line-clamp-2">{issue.description}</p>
                          <div className="text-gray-600">
                            📅 {new Date(issue.created_at).toLocaleDateString()}
                          </div>
                        </div>
                      </div>

                      {issue.admin_response && (
                        <div className="bg-blue-50 border border-blue-200 rounded p-3">
                          <div className="flex items-start gap-2">
                            <MessageSquare className="h-5 w-5 text-blue-600 mt-0.5" />
                            <div>
                              <p className="text-blue-900">
                                <strong>Admin Response:</strong>
                              </p>
                              <p className="text-blue-800 mt-1">{issue.admin_response}</p>
                            </div>
                          </div>
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))
          )}
        </div>
      </ScrollArea>

      {/* Issue Details Dialog */}
      <Dialog open={!!selectedIssue} onOpenChange={() => setSelectedIssue(null)}>
        <DialogContent className="max-w-2xl">
          {selectedIssue && (
            <>
              <DialogHeader>
                <DialogTitle>{selectedIssue.title}</DialogTitle>
                <DialogDescription>
                  Submitted on {new Date(selectedIssue.created_at).toLocaleString()}
                </DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="flex gap-2 flex-wrap">
                  <Badge className={getStatusColor(selectedIssue.status)}>
                    <div className="flex items-center gap-1">
                      {getStatusIcon(selectedIssue.status)}
                      {selectedIssue.status.replace('_', ' ')}
                    </div>
                  </Badge>
                  <Badge className={getTypeColor(selectedIssue.type)}>
                    {selectedIssue.type.replace('_', ' ')}
                  </Badge>
                  <Badge className={getPriorityColor(selectedIssue.priority)}>
                    {selectedIssue.priority} priority
                  </Badge>
                </div>

                <div>
                  <Label>Description</Label>
                  <p className="text-gray-600 mt-2 whitespace-pre-wrap">{selectedIssue.description}</p>
                </div>

                {selectedIssue.task_title && (
                  <div>
                    <Label>Related Task</Label>
                    <p className="text-gray-600 mt-1">{selectedIssue.task_title}</p>
                  </div>
                )}

                {selectedIssue.project_title && (
                  <div>
                    <Label>Related Project</Label>
                    <p className="text-gray-600 mt-1">{selectedIssue.project_title}</p>
                  </div>
                )}

                {selectedIssue.admin_response && (
                  <div>
                    <Label>Admin Response</Label>
                    <div className="bg-blue-50 border border-blue-200 p-4 rounded mt-2">
                      <p className="text-blue-900 whitespace-pre-wrap">{selectedIssue.admin_response}</p>
                    </div>
                    {selectedIssue.resolved_at && (
                      <p className="text-gray-600 mt-2">
                        Resolved on {new Date(selectedIssue.resolved_at).toLocaleString()}
                      </p>
                    )}
                  </div>
                )}

                {!selectedIssue.admin_response && selectedIssue.status === 'open' && (
                  <div className="bg-yellow-50 border border-yellow-200 p-4 rounded">
                    <p className="text-yellow-900">
                      Your issue has been submitted. Admin will respond shortly.
                    </p>
                  </div>
                )}
              </div>

              <DialogFooter>
                <Button variant="outline" onClick={() => setSelectedIssue(null)}>
                  Close
                </Button>
              </DialogFooter>
            </>
          )}
        </DialogContent>
      </Dialog>

      {/* Create Issue Dialog */}
      <Dialog open={showCreateDialog} onOpenChange={setShowCreateDialog}>
        <DialogContent className="max-w-2xl">
          <DialogHeader>
            <DialogTitle>Report an Issue</DialogTitle>
            <DialogDescription>
              Submit a bug report, technical question, or feature request
            </DialogDescription>
          </DialogHeader>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label>Issue Type *</Label>
                <Select
                  value={newIssue.type}
                  onValueChange={(value) => setNewIssue({ ...newIssue, type: value as Issue['type'] })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="bug">Bug</SelectItem>
                    <SelectItem value="technical">Technical Issue</SelectItem>
                    <SelectItem value="question">Question</SelectItem>
                    <SelectItem value="payment">Payment Issue</SelectItem>
                    <SelectItem value="feature_request">Feature Request</SelectItem>
                    <SelectItem value="other">Other</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div>
                <Label>Priority *</Label>
                <Select
                  value={newIssue.priority}
                  onValueChange={(value) => setNewIssue({ ...newIssue, priority: value as Issue['priority'] })}
                >
                  <SelectTrigger className="mt-2">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="low">Low</SelectItem>
                    <SelectItem value="medium">Medium</SelectItem>
                    <SelectItem value="high">High</SelectItem>
                    <SelectItem value="urgent">Urgent</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div>
              <Label>Title *</Label>
              <Input
                value={newIssue.title}
                onChange={(e) => setNewIssue({ ...newIssue, title: e.target.value })}
                placeholder="Brief description of the issue"
                className="mt-2"
              />
            </div>

            <div>
              <Label>Description *</Label>
              <Textarea
                value={newIssue.description}
                onChange={(e) => setNewIssue({ ...newIssue, description: e.target.value })}
                placeholder="Provide detailed information about the issue..."
                rows={6}
                className="mt-2"
              />
            </div>

            <div className="bg-blue-50 border border-blue-200 rounded p-4">
              <p className="text-blue-900">
                💡 <strong>Tips:</strong>
              </p>
              <ul className="list-disc list-inside text-blue-800 mt-2 space-y-1">
                <li>Be specific and include relevant details</li>
                <li>Mention any error messages you received</li>
                <li>Include steps to reproduce the issue if applicable</li>
              </ul>
            </div>
          </div>

          <DialogFooter>
            <Button variant="outline" onClick={() => setShowCreateDialog(false)}>
              Cancel
            </Button>
            <Button
              onClick={handleCreateIssue}
              disabled={!newIssue.title || !newIssue.description}
              className="gap-2"
            >
              <Plus className="h-4 w-4" />
              Submit Issue
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
