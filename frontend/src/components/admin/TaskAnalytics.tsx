import { useMemo } from 'react';
import { BarChart3, TrendingUp, Users, Clock, DollarSign, CheckCircle, AlertTriangle } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '../ui/card';
import { Badge } from '../ui/badge';

interface TaskAnalyticsProps {
  tasks: Array<{
    _id: string;
    status: string;
    category: string;
    priority: string;
    hourlyRate: number;
    estimatedHours: number;
    completedAt?: string;
    createdAt: string;
    assignedTo?: { _id: string; name: string } | null;
  }>;
  users: Array<{
    _id: string;
    name: string;
    completedTasks: number;
    rating: number;
    isActive: boolean;
  }>;
}

export function TaskAnalytics({ tasks, users }: TaskAnalyticsProps) {
  const analytics = useMemo(() => {
    const now = new Date();
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);

    // Task status distribution
    const statusCounts = tasks.reduce((acc, task) => {
      acc[task.status] = (acc[task.status] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Category distribution
    const categoryCounts = tasks.reduce((acc, task) => {
      const category = task.category || 'Unknown';
      acc[category] = (acc[category] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Priority distribution
    const priorityCounts = tasks.reduce((acc, task) => {
      acc[task.priority] = (acc[task.priority] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);

    // Recent activity
    const recentTasks = tasks.filter(task => 
      new Date(task.createdAt) >= sevenDaysAgo
    );

    const recentCompletions = tasks.filter(task => 
      task.completedAt && new Date(task.completedAt) >= sevenDaysAgo
    );

    // Total value calculations
    const totalTaskValue = tasks.reduce((sum, task) => 
      sum + (task.hourlyRate * task.estimatedHours), 0
    );

    const completedTaskValue = tasks
      .filter(task => task.status === 'completed')
      .reduce((sum, task) => sum + (task.hourlyRate * task.estimatedHours), 0);

    // Completion rate
    const completionRate = tasks.length > 0 
      ? (tasks.filter(t => t.status === 'completed').length / tasks.length) * 100 
      : 0;

    // Average task value
    const avgTaskValue = tasks.length > 0 ? totalTaskValue / tasks.length : 0;

    // User performance
    const userPerformance = users.map(user => {
      const userTasks = tasks.filter(task => task.assignedTo?._id === user._id);
      const completedUserTasks = userTasks.filter(task => task.status === 'completed');
      const userCompletionRate = userTasks.length > 0 
        ? (completedUserTasks.length / userTasks.length) * 100 
        : 0;
      
      return {
        ...user,
        assignedTasks: userTasks.length,
        completedTasks: completedUserTasks.length,
        completionRate: userCompletionRate,
        totalEarnings: completedUserTasks.reduce((sum, task) => 
          sum + (task.hourlyRate * task.estimatedHours), 0
        )
      };
    }).sort((a, b) => b.completedTasks - a.completedTasks);

    return {
      statusCounts,
      categoryCounts,
      priorityCounts,
      recentTasks: recentTasks.length,
      recentCompletions: recentCompletions.length,
      totalTaskValue,
      completedTaskValue,
      completionRate,
      avgTaskValue,
      userPerformance,
      activeUsers: users.filter(u => u.isActive).length,
      totalUsers: users.length
    };
  }, [tasks, users]);

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in_progress': return 'bg-yellow-100 text-yellow-800';
      case 'assigned': return 'bg-blue-100 text-blue-800';
      case 'draft': return 'bg-gray-100 text-gray-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'AI_TRAINING': return 'bg-blue-100 text-blue-800';
      case 'MODEL_EVALUATION': return 'bg-green-100 text-green-800';
      case 'CONTENT_MODERATION': return 'bg-orange-100 text-orange-800';
      case 'DATA_ANNOTATION': return 'bg-purple-100 text-purple-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  return (
    <div className="space-y-6">
      {/* Overview Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Completion Rate</p>
                <p className="text-2xl font-bold text-green-600">
                  {analytics.completionRate.toFixed(1)}%
                </p>
              </div>
              <TrendingUp className="w-8 h-8 text-green-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {tasks.filter(t => t.status === 'completed').length} of {tasks.length} tasks
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Total Value</p>
                <p className="text-2xl font-bold text-blue-600">
                  ${analytics.totalTaskValue.toFixed(0)}
                </p>
              </div>
              <DollarSign className="w-8 h-8 text-blue-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              ${analytics.completedTaskValue.toFixed(0)} completed
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Active Users</p>
                <p className="text-2xl font-bold text-purple-600">
                  {analytics.activeUsers}
                </p>
              </div>
              <Users className="w-8 h-8 text-purple-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              of {analytics.totalUsers} total users
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardContent className="p-4">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-gray-600">Avg Task Value</p>
                <p className="text-2xl font-bold text-orange-600">
                  ${analytics.avgTaskValue.toFixed(0)}
                </p>
              </div>
              <BarChart3 className="w-8 h-8 text-orange-600" />
            </div>
            <p className="text-xs text-gray-500 mt-1">
              {analytics.recentTasks} created this week
            </p>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Task Status Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <BarChart3 className="w-5 h-5" />
              Task Status Distribution
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.statusCounts).map(([status, count]) => (
                <div key={status} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getStatusColor(status)}>
                      {status.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-blue-600 h-2 rounded-full"
                        style={{ width: `${(count / tasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Category Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <CheckCircle className="w-5 h-5" />
              Task Categories
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.categoryCounts).map(([category, count]) => (
                <div key={category} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={getCategoryColor(category)}>
                      {category.replace('_', ' ')}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-green-600 h-2 rounded-full"
                        style={{ width: `${(count / tasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Priority Distribution */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <AlertTriangle className="w-5 h-5" />
              Priority Levels
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {Object.entries(analytics.priorityCounts)
                .sort(([a], [b]) => {
                  const order = { critical: 0, high: 1, medium: 2, low: 3 };
                  return (order[a as keyof typeof order] || 4) - (order[b as keyof typeof order] || 4);
                })
                .map(([priority, count]) => (
                <div key={priority} className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Badge className={
                      priority === 'critical' ? 'bg-red-100 text-red-800' :
                      priority === 'high' ? 'bg-orange-100 text-orange-800' :
                      priority === 'medium' ? 'bg-yellow-100 text-yellow-800' :
                      'bg-green-100 text-green-800'
                    }>
                      {priority}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-3">
                    <div className="w-24 bg-gray-200 rounded-full h-2">
                      <div
                        className="bg-orange-600 h-2 rounded-full"
                        style={{ width: `${(count / tasks.length) * 100}%` }}
                      />
                    </div>
                    <span className="text-sm font-medium w-8">{count}</span>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Top Performers */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Users className="w-5 h-5" />
              Top Performers
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {analytics.userPerformance.slice(0, 5).map((user, index) => (
                <div key={user._id} className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <div className={`w-6 h-6 rounded-full flex items-center justify-center text-xs font-bold ${
                      index === 0 ? 'bg-yellow-100 text-yellow-800' :
                      index === 1 ? 'bg-gray-100 text-gray-800' :
                      index === 2 ? 'bg-orange-100 text-orange-800' :
                      'bg-blue-100 text-blue-800'
                    }`}>
                      {index + 1}
                    </div>
                    <div>
                      <p className="font-medium text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">
                        {user.completedTasks} completed | {user.completionRate.toFixed(0)}% rate
                      </p>
                    </div>
                  </div>
                  <div className="text-right">
                    <p className="text-sm font-medium text-green-600">
                      ${user.totalEarnings.toFixed(0)}
                    </p>
                    <p className="text-xs text-gray-500">earned</p>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Recent Activity Summary */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Clock className="w-5 h-5" />
            Recent Activity (Last 7 Days)
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-blue-50 rounded-lg">
              <p className="text-2xl font-bold text-blue-600">{analytics.recentTasks}</p>
              <p className="text-sm text-blue-800">New Tasks Created</p>
            </div>
            <div className="text-center p-4 bg-green-50 rounded-lg">
              <p className="text-2xl font-bold text-green-600">{analytics.recentCompletions}</p>
              <p className="text-sm text-green-800">Tasks Completed</p>
            </div>
            <div className="text-center p-4 bg-purple-50 rounded-lg">
              <p className="text-2xl font-bold text-purple-600">
                {analytics.activeUsers}
              </p>
              <p className="text-sm text-purple-800">Active Users</p>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}