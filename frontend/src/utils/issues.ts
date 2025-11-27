// Issue reporting and tracking system

export interface Issue {
  id: string;
  user_id: string;
  user_name: string;
  task_id?: string;
  task_title?: string;
  project_id?: string;
  project_title?: string;
  type: 'bug' | 'question' | 'feature_request' | 'technical' | 'payment' | 'other';
  priority: 'low' | 'medium' | 'high' | 'urgent';
  status: 'open' | 'in_progress' | 'resolved' | 'closed';
  title: string;
  description: string;
  created_at: string;
  updated_at: string;
  resolved_at?: string;
  admin_response?: string;
  attachments?: IssueAttachment[];
}

export interface IssueAttachment {
  name: string;
  url: string;
  type: string;
  size: number;
}

const ISSUES_STORAGE_KEY = 'inferaai_issues';

function getInitialIssues(): Issue[] {
  return [
    {
      id: '1',
      user_id: 'system-user-1',
      user_name: 'John Justice',
      task_id: '4',
      task_title: 'Content Moderation Review',
      type: 'technical',
      priority: 'medium',
      status: 'resolved',
      title: 'Unable to submit review for flagged content',
      description: 'When I try to submit my review for content item #245, I get an error message. The submit button doesn\'t respond.',
      created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
      admin_response: 'Issue has been fixed. Please clear your browser cache and try again.',
    },
    {
      id: '2',
      user_id: 'system-user-1',
      user_name: 'John Justice',
      project_id: '1',
      project_title: 'AI Training Dataset',
      type: 'question',
      priority: 'low',
      status: 'resolved',
      title: 'Clarification on annotation guidelines',
      description: 'I need clarification on how to handle ambiguous cases in the dataset. Should I flag them or make a best judgment?',
      created_at: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      updated_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      resolved_at: new Date(Date.now() - 4 * 24 * 60 * 60 * 1000).toISOString(),
      admin_response: 'Great question! For ambiguous cases, please flag them with a comment explaining why it\'s unclear. We\'ll review those separately.',
    },
  ];
}

function loadIssues(): Issue[] {
  try {
    const stored = localStorage.getItem(ISSUES_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading issues from storage:', error);
  }
  return getInitialIssues();
}

function saveIssues(issues: Issue[]): void {
  try {
    localStorage.setItem(ISSUES_STORAGE_KEY, JSON.stringify(issues));
  } catch (error) {
    console.error('Error saving issues to storage:', error);
  }
}

export function getIssues(userId?: string): Issue[] {
  const issues = loadIssues();
  if (userId) {
    return issues.filter(i => i.user_id === userId);
  }
  return issues;
}

export function getAllIssues(): Issue[] {
  return loadIssues();
}

export function createIssue(issueData: {
  user_id: string;
  user_name: string;
  task_id?: string;
  task_title?: string;
  project_id?: string;
  project_title?: string;
  type: Issue['type'];
  priority: Issue['priority'];
  title: string;
  description: string;
}): Issue {
  const issues = loadIssues();
  
  const newIssue: Issue = {
    id: `issue_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    user_id: issueData.user_id,
    user_name: issueData.user_name,
    task_id: issueData.task_id,
    task_title: issueData.task_title,
    project_id: issueData.project_id,
    project_title: issueData.project_title,
    type: issueData.type,
    priority: issueData.priority,
    status: 'open',
    title: issueData.title,
    description: issueData.description,
    created_at: new Date().toISOString(),
    updated_at: new Date().toISOString(),
  };

  issues.push(newIssue);
  saveIssues(issues);

  return newIssue;
}

export function updateIssue(issueId: string, updates: Partial<Issue>): Issue {
  const issues = loadIssues();
  const issueIndex = issues.findIndex(i => i.id === issueId);

  if (issueIndex === -1) {
    throw new Error('Issue not found');
  }

  issues[issueIndex] = {
    ...issues[issueIndex],
    ...updates,
    updated_at: new Date().toISOString(),
  };

  if (updates.status === 'resolved' && !issues[issueIndex].resolved_at) {
    issues[issueIndex].resolved_at = new Date().toISOString();
  }

  saveIssues(issues);
  return issues[issueIndex];
}

export function deleteIssue(issueId: string): void {
  const issues = loadIssues();
  const filteredIssues = issues.filter(i => i.id !== issueId);

  if (filteredIssues.length === issues.length) {
    throw new Error('Issue not found');
  }

  saveIssues(filteredIssues);
}

export function getIssueStats(issues: Issue[]) {
  return {
    total: issues.length,
    open: issues.filter(i => i.status === 'open').length,
    in_progress: issues.filter(i => i.status === 'in_progress').length,
    resolved: issues.filter(i => i.status === 'resolved').length,
    closed: issues.filter(i => i.status === 'closed').length,
    high_priority: issues.filter(i => i.priority === 'high' || i.priority === 'urgent').length,
  };
}

export function getUnresolvedIssuesCount(userId: string): number {
  const issues = getIssues(userId);
  return issues.filter(i => i.status === 'open' || i.status === 'in_progress').length;
}

export function hasNewAdminResponse(userId: string): boolean {
  const issues = getIssues(userId);
  // Check if there are any issues with admin responses that were updated in the last 24 hours
  const oneDayAgo = Date.now() - 24 * 60 * 60 * 1000;
  return issues.some(i => 
    i.admin_response && 
    new Date(i.updated_at).getTime() > oneDayAgo &&
    i.status !== 'closed'
  );
}
