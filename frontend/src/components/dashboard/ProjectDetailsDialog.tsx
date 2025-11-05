import { useState } from 'react';
import { motion } from 'framer-motion';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  Download,
  AlertCircle,
  Calendar,
  DollarSign,
  Clock,
  Target,
  TrendingUp,
  CheckCircle,
  FileText,
  Flag,
  Send,
} from 'lucide-react';
import { toast } from 'sonner';
import { createIssue } from '../../utils/issues';
import { useAuth } from '../../utils/auth';
import { sendNotificationToUser } from '../../utils/notification';

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  status: string;
  hourlyRate: number;
  tasksCompleted: number;
  totalTasks: number;
  deadline: string;
  earnings: number;
  quality: number;
  timeSpent: string;
}

interface ProjectDetailsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  project: Project | null;
}

export function ProjectDetailsDialog({ open, onOpenChange, project }: ProjectDetailsDialogProps) {
  const { user } = useAuth();
  const [showReportIssue, setShowReportIssue] = useState(false);
  const [issueForm, setIssueForm] = useState({
    type: 'technical' as 'bug' | 'question' | 'feature_request' | 'technical' | 'payment' | 'other',
    priority: 'medium' as 'low' | 'medium' | 'high' | 'urgent',
    title: '',
    description: '',
  });

  if (!project) return null;

  const handleDownloadReport = (reportType: string) => {
    // Generate report data
    const reportData = {
      project: project.title,
      category: project.category,
      progress: `${project.progress}%`,
      status: project.status,
      tasksCompleted: `${project.tasksCompleted}/${project.totalTasks}`,
      earnings: `$${project.earnings.toFixed(2)}`,
      quality: `${project.quality}%`,
      timeSpent: project.timeSpent,
      deadline: new Date(project.deadline).toLocaleDateString(),
      generatedAt: new Date().toLocaleString(),
      reportType: reportType,
    };

    // Create downloadable content
    let content = '';
    if (reportType === 'detailed') {
      content = `
PROJECT DETAILED REPORT
======================

Project: ${reportData.project}
Category: ${reportData.category}
Status: ${reportData.status}

PROGRESS
--------
Overall Progress: ${reportData.progress}
Tasks Completed: ${reportData.tasksCompleted}
Quality Score: ${reportData.quality}

FINANCIALS
----------
Total Earnings: ${reportData.earnings}
Hourly Rate: $${project.hourlyRate}
Time Spent: ${reportData.timeSpent}

TIMELINE
--------
Deadline: ${reportData.deadline}

Generated: ${reportData.generatedAt}
`;
    } else {
      content = `Project,Category,Progress,Status,Tasks,Earnings,Quality,Time Spent,Deadline
${reportData.project},${reportData.category},${reportData.progress},${reportData.status},${reportData.tasksCompleted},${reportData.earnings},${reportData.quality},${reportData.timeSpent},${reportData.deadline}`;
    }

    // Download
    const blob = new Blob([content], { type: reportType === 'csv' ? 'text/csv' : 'text/plain' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `${project.title.replace(/\s+/g, '_')}_report_${Date.now()}.${reportType === 'csv' ? 'csv' : 'txt'}`;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    window.URL.revokeObjectURL(url);

    toast.success(`${reportType.toUpperCase()} report downloaded successfully`);
  };

  const handleSubmitIssue = () => {
    if (!user || !issueForm.title || !issueForm.description) {
      toast.error('Please fill in all required fields');
      return;
    }

    try {
      const issue = createIssue({
        user_id: user.id,
        user_name: user.name || `${user.first_name || ''} ${user.last_name || ''}`.trim() || 'Unknown User',
        project_id: project.id,
        project_title: project.title,
        type: issueForm.type,
        priority: issueForm.priority,
        title: issueForm.title,
        description: issueForm.description,
      });

      // Notify admin
      sendNotificationToUser(
        'admin-user-1',
        'message',
        'New Issue Reported',
        `${user.name} reported an issue on project "${project.title}"`,
        'alert',
        'warning',
        { issue_id: issue.id, project_id: project.id }
      );

      toast.success('Issue reported successfully. Admin will review it shortly.');
      setShowReportIssue(false);
      setIssueForm({
        type: 'technical',
        priority: 'medium',
        title: '',
        description: '',
      });
    } catch (error: any) {
      toast.error(error.message || 'Failed to report issue');
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      active: 'bg-green-100 text-green-800 border-green-300',
      completed: 'bg-blue-100 text-blue-800 border-blue-300',
      pending: 'bg-yellow-100 text-yellow-800 border-yellow-300',
      paused: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.active;
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <div className="flex items-start justify-between">
            <div>
              <DialogTitle className="text-2xl">{project.title}</DialogTitle>
              <DialogDescription className="mt-2">
                {project.description}
              </DialogDescription>
            </div>
            <Badge className={getStatusColor(project.status)}>
              {project.status}
            </Badge>
          </div>
        </DialogHeader>

        <Tabs defaultValue="overview" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="overview">Overview</TabsTrigger>
            <TabsTrigger value="reports">Reports</TabsTrigger>
            <TabsTrigger value="issues">Report Issue</TabsTrigger>
          </TabsList>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-6">
            {/* Progress Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Target className="h-5 w-5" />
                  Progress Overview
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div>
                  <div className="flex justify-between mb-2">
                    <span className="text-gray-600">Overall Progress</span>
                    <span className="text-gray-900">{project.progress}%</span>
                  </div>
                  <Progress value={project.progress} className="h-3" />
                </div>

                <Separator />

                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      <span>Tasks Completed</span>
                    </div>
                    <p className="text-2xl text-gray-900">
                      {project.tasksCompleted} / {project.totalTasks}
                    </p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <TrendingUp className="h-4 w-4" />
                      <span>Quality Score</span>
                    </div>
                    <p className="text-2xl text-green-600">{project.quality}%</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Clock className="h-4 w-4" />
                      <span>Time Spent</span>
                    </div>
                    <p className="text-2xl text-gray-900">{project.timeSpent}</p>
                  </div>

                  <div className="space-y-2">
                    <div className="flex items-center gap-2 text-gray-600">
                      <Calendar className="h-4 w-4" />
                      <span>Deadline</span>
                    </div>
                    <p className="text-2xl text-gray-900">
                      {new Date(project.deadline).toLocaleDateString()}
                    </p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Earnings Section */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <DollarSign className="h-5 w-5" />
                  Earnings
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <span className="text-gray-600">Total Earnings</span>
                    <p className="text-3xl text-green-600">${project.earnings.toFixed(2)}</p>
                  </div>
                  <div className="space-y-2">
                    <span className="text-gray-600">Hourly Rate</span>
                    <p className="text-3xl text-gray-900">${project.hourlyRate}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Reports Tab */}
          <TabsContent value="reports" className="space-y-4">
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <FileText className="h-5 w-5" />
                  Download Project Reports
                </CardTitle>
                <CardDescription>
                  Generate and download detailed reports for this project
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                  onClick={() => handleDownloadReport('detailed')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900 mb-1">Detailed Report</h4>
                      <p className="text-sm text-gray-600">
                        Complete project breakdown including all metrics and statistics
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download
                    </Button>
                  </div>
                </motion.div>

                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="p-4 border rounded-lg hover:border-green-300 hover:bg-green-50/50 transition-all cursor-pointer"
                  onClick={() => handleDownloadReport('csv')}
                >
                  <div className="flex items-center justify-between">
                    <div>
                      <h4 className="text-gray-900 mb-1">CSV Export</h4>
                      <p className="text-sm text-gray-600">
                        Export project data in CSV format for analysis
                      </p>
                    </div>
                    <Button variant="outline" className="gap-2">
                      <Download className="h-4 w-4" />
                      Download CSV
                    </Button>
                  </div>
                </motion.div>

                <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                  <div className="flex gap-3">
                    <AlertCircle className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                    <div>
                      <h4 className="text-blue-900 mb-1">Report Information</h4>
                      <p className="text-sm text-blue-800">
                        Reports include all project metrics, task completion data, earnings,
                        quality scores, and timeline information. Keep these for your records.
                      </p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Report Issue Tab */}
          <TabsContent value="issues" className="space-y-4">
            {!showReportIssue ? (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Report an Issue
                  </CardTitle>
                  <CardDescription>
                    Having trouble with this project? Let us know and we'll help resolve it.
                  </CardDescription>
                </CardHeader>
                <CardContent>
                  <Button onClick={() => setShowReportIssue(true)} className="gap-2 w-full">
                    <Flag className="h-4 w-4" />
                    Report Issue
                  </Button>
                </CardContent>
              </Card>
            ) : (
              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Flag className="h-5 w-5" />
                    Report Issue
                  </CardTitle>
                  <CardDescription>
                    Describe the issue you're experiencing with this project
                  </CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="grid md:grid-cols-2 gap-4">
                    <div>
                      <Label>Issue Type *</Label>
                      <Select
                        value={issueForm.type}
                        onValueChange={(value: any) => setIssueForm({ ...issueForm, type: value })}
                      >
                        <SelectTrigger>
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="technical">Technical Issue</SelectItem>
                          <SelectItem value="bug">Bug Report</SelectItem>
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
                        value={issueForm.priority}
                        onValueChange={(value: any) => setIssueForm({ ...issueForm, priority: value })}
                      >
                        <SelectTrigger>
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
                    <Label>Issue Title *</Label>
                    <Input
                      value={issueForm.title}
                      onChange={(e) => setIssueForm({ ...issueForm, title: e.target.value })}
                      placeholder="Brief summary of the issue"
                    />
                  </div>

                  <div>
                    <Label>Description *</Label>
                    <Textarea
                      value={issueForm.description}
                      onChange={(e) => setIssueForm({ ...issueForm, description: e.target.value })}
                      placeholder="Please provide detailed information about the issue..."
                      rows={6}
                    />
                  </div>

                  <div className="flex gap-2">
                    <Button
                      variant="outline"
                      onClick={() => {
                        setShowReportIssue(false);
                        setIssueForm({
                          type: 'technical',
                          priority: 'medium',
                          title: '',
                          description: '',
                        });
                      }}
                    >
                      Cancel
                    </Button>
                    <Button onClick={handleSubmitIssue} className="gap-2">
                      <Send className="h-4 w-4" />
                      Submit Issue
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
          </TabsContent>
        </Tabs>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Close
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
