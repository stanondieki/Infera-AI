import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import {
  Monitor,
  Smartphone,
  Tablet,
  MapPin,
  Clock,
  Shield,
  AlertTriangle,
  CheckCircle2,
  XCircle,
  AlertCircle,
  Globe,
  Activity,
  LogOut,
  RefreshCw,
  Download,
  Eye,
  EyeOff,
  Lock,
  Unlock,
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { ScrollArea } from '../ui/scroll-area';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '../ui/alert-dialog';
import { toast } from 'sonner';
import {
  Session,
  LoginAttempt,
  SecurityEvent,
  getSessions,
  getLoginHistory,
  getSecurityEvents,
  revokeSession,
  revokeAllSessions,
  getSessionStats,
  getLoginStats,
  formatLastActive,
} from '../../utils/sessions';

export function SecuritySessions() {
  const [sessions, setSessions] = useState<Session[]>([]);
  const [loginHistory, setLoginHistory] = useState<LoginAttempt[]>([]);
  const [securityEvents, setSecurityEvents] = useState<SecurityEvent[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedSession, setSelectedSession] = useState<Session | null>(null);
  const [showRevokeAllDialog, setShowRevokeAllDialog] = useState(false);
  const [ipFilter, setIpFilter] = useState('all');
  const [deviceFilter, setDeviceFilter] = useState('all');
  const [statusFilter, setStatusFilter] = useState('all');

  // Get user ID from auth context or localStorage
  const getUserId = () => {
    try {
      const session = localStorage.getItem('infera_session');
      if (session) {
        const sessionData = JSON.parse(session);
        return sessionData.user?.id || 'unknown';
      }
    } catch (e) {
      console.error('Error getting user ID:', e);
    }
    return 'unknown';
  };
  const userId = getUserId();

  useEffect(() => {
    loadData();
  }, []);

  const loadData = async () => {
    setLoading(true);
    try {
      const [sessionsData, historyData, eventsData] = await Promise.all([
        getSessions(userId),
        getLoginHistory(userId),
        getSecurityEvents(userId),
      ]);
      setSessions(sessionsData);
      setLoginHistory(historyData);
      setSecurityEvents(eventsData);
    } catch (error) {
      toast.error('Failed to load security data');
    } finally {
      setLoading(false);
    }
  };

  const handleRevokeSession = async (sessionId: string) => {
    try {
      await revokeSession(userId, sessionId);
      toast.success('Session revoked successfully');
      loadData();
      setSelectedSession(null);
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAll = async () => {
    try {
      await revokeAllSessions(userId, true);
      toast.success('All other sessions have been revoked');
      loadData();
      setShowRevokeAllDialog(false);
    } catch (error) {
      toast.error('Failed to revoke sessions');
    }
  };

  const handleExportHistory = () => {
    const csv = [
      ['Timestamp', 'Status', 'Device', 'Browser', 'Location', 'IP Address'].join(','),
      ...loginHistory.map(h =>
        [
          new Date(h.timestamp).toLocaleString(),
          h.status,
          h.device_name,
          h.browser,
          h.location,
          h.ip_address,
        ].join(',')
      ),
    ].join('\n');

    const blob = new Blob([csv], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `login-history-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
    toast.success('Login history exported successfully');
  };

  const sessionStats = getSessionStats(sessions);
  const loginStats = getLoginStats(loginHistory);

  const filteredHistory = loginHistory.filter(h => {
    const matchesStatus = statusFilter === 'all' || h.status === statusFilter;
    const matchesDevice = deviceFilter === 'all' || h.device_type.toLowerCase() === deviceFilter;
    return matchesStatus && matchesDevice;
  });

  const getDeviceIcon = (deviceType: string) => {
    switch (deviceType) {
      case 'Desktop':
        return Monitor;
      case 'Mobile':
        return Smartphone;
      case 'Tablet':
        return Tablet;
      default:
        return Monitor;
    }
  };

  const getStatusColor = (status: string) => {
    const colors = {
      success: 'bg-green-100 text-green-800 border-green-300',
      failed: 'bg-red-100 text-red-800 border-red-300',
      suspicious: 'bg-orange-100 text-orange-800 border-orange-300',
      blocked: 'bg-gray-100 text-gray-800 border-gray-300',
    };
    return colors[status as keyof typeof colors] || colors.success;
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-4 w-4" />;
      case 'failed':
        return <XCircle className="h-4 w-4" />;
      case 'suspicious':
      case 'blocked':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <CheckCircle2 className="h-4 w-4" />;
    }
  };

  const getEventIcon = (eventType: string) => {
    switch (eventType) {
      case 'password_change':
        return <Lock className="h-5 w-5 text-blue-600" />;
      case 'session_revoked':
        return <LogOut className="h-5 w-5 text-orange-600" />;
      case 'suspicious_login':
        return <AlertTriangle className="h-5 w-5 text-red-600" />;
      case 'account_locked':
        return <Shield className="h-5 w-5 text-red-600" />;
      case 'security_alert':
        return <AlertCircle className="h-5 w-5 text-yellow-600" />;
      default:
        return <Activity className="h-5 w-5 text-gray-600" />;
    }
  };

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-3xl text-gray-900 mb-2">Security & Sessions</h2>
          <p className="text-gray-600">Manage your account security and active sessions</p>
        </div>
        <div className="flex gap-2">
          <Button variant="outline" onClick={loadData} className="gap-2">
            <RefreshCw className="h-4 w-4" />
            Refresh
          </Button>
        </div>
      </div>

      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-blue-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-blue-100 mb-1 text-sm">Active Sessions</p>
                  <p className="text-3xl">{sessionStats.active}</p>
                  <p className="text-blue-200 text-xs mt-1">of {sessionStats.total} total</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Activity className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-green-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-green-100 mb-1 text-sm">Successful Logins</p>
                  <p className="text-3xl">{loginStats.successful}</p>
                  <p className="text-green-200 text-xs mt-1">Last 30 days</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <CheckCircle2 className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-orange-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-orange-100 mb-1 text-sm">Suspicious Activity</p>
                  <p className="text-3xl">{loginStats.suspicious}</p>
                  <p className="text-orange-200 text-xs mt-1">Flagged attempts</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <AlertTriangle className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
          whileHover={{ y: -5 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-purple-600">
            <CardContent className="p-6">
              <div className="flex items-center justify-between text-white">
                <div>
                  <p className="text-purple-100 mb-1 text-sm">Security Events</p>
                  <p className="text-3xl">{securityEvents.length}</p>
                  <p className="text-purple-200 text-xs mt-1">Recent activity</p>
                </div>
                <div className="rounded-full bg-white/20 p-3">
                  <Shield className="h-6 w-6" />
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Tabs */}
      <Tabs defaultValue="sessions" className="space-y-6">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="sessions" className="gap-2">
            <Activity className="h-4 w-4" />
            Active Sessions
          </TabsTrigger>
          <TabsTrigger value="history" className="gap-2">
            <Clock className="h-4 w-4" />
            Login History
          </TabsTrigger>
          <TabsTrigger value="events" className="gap-2">
            <Shield className="h-4 w-4" />
            Security Events
          </TabsTrigger>
        </TabsList>

        {/* Active Sessions Tab */}
        <TabsContent value="sessions">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-blue-50 to-purple-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-r from-blue-500 to-purple-500 p-2">
                      <Monitor className="h-5 w-5 text-white" />
                    </div>
                    Active Sessions
                  </CardTitle>
                  <CardDescription>{sessions.length} active device(s)</CardDescription>
                </div>
                {sessions.length > 1 && (
                  <Button
                    variant="outline"
                    onClick={() => setShowRevokeAllDialog(true)}
                    className="text-red-600 hover:text-red-700"
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Revoke All Others
                  </Button>
                )}
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {sessions.map((session, index) => {
                    const DeviceIcon = getDeviceIcon(session.device_type);
                    return (
                      <motion.div
                        key={session.id}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: index * 0.05 }}
                        className={`p-5 rounded-lg border-2 transition-all cursor-pointer ${
                          session.is_current
                            ? 'bg-gradient-to-r from-blue-50 to-purple-50 border-blue-300 shadow-md'
                            : 'bg-white border-gray-200 hover:border-blue-300 hover:shadow-md'
                        }`}
                        onClick={() => setSelectedSession(session)}
                      >
                        <div className="flex items-start justify-between">
                          <div className="flex items-start gap-4 flex-1">
                            <div
                              className={`rounded-full p-3 ${
                                session.is_current ? 'bg-blue-100' : 'bg-gray-100'
                              }`}
                            >
                              <DeviceIcon
                                className={`h-6 w-6 ${
                                  session.is_current ? 'text-blue-600' : 'text-gray-600'
                                }`}
                              />
                            </div>

                            <div className="flex-1">
                              <div className="flex items-center gap-2 mb-2">
                                <h4 className="text-gray-900">{session.browser}</h4>
                                {session.is_current && (
                                  <Badge className="bg-green-100 text-green-800 text-xs">
                                    Current Session
                                  </Badge>
                                )}
                              </div>

                              <div className="grid md:grid-cols-2 gap-2 text-sm text-gray-600">
                                <div className="flex items-center gap-2">
                                  <Monitor className="h-4 w-4 text-gray-400" />
                                  {session.device_name}
                                </div>
                                <div className="flex items-center gap-2">
                                  <MapPin className="h-4 w-4 text-gray-400" />
                                  {session.location}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Globe className="h-4 w-4 text-gray-400" />
                                  {session.ip_address}
                                </div>
                                <div className="flex items-center gap-2">
                                  <Clock className="h-4 w-4 text-gray-400" />
                                  {formatLastActive(session.last_active)}
                                </div>
                              </div>

                              <div className="mt-2 text-xs text-gray-500">
                                First login: {new Date(session.created_at).toLocaleString()}
                              </div>
                            </div>
                          </div>

                          {!session.is_current && (
                            <Button
                              variant="outline"
                              size="sm"
                              onClick={(e) => {
                                e.stopPropagation();
                                handleRevokeSession(session.id);
                              }}
                              className="text-red-600 hover:text-red-700"
                            >
                              <LogOut className="h-4 w-4 mr-2" />
                              Revoke
                            </Button>
                          )}
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>

              <div className="mt-4 p-4 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-3">
                <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
                <div>
                  <p className="text-sm text-yellow-900">Security Tip</p>
                  <p className="text-xs text-yellow-700 mt-1">
                    If you see any suspicious sessions or devices you don't recognize, revoke them
                    immediately and change your password.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Login History Tab */}
        <TabsContent value="history">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-green-50 to-blue-50">
              <div className="flex items-center justify-between">
                <div>
                  <CardTitle className="flex items-center gap-2">
                    <div className="rounded-lg bg-gradient-to-r from-green-500 to-blue-500 p-2">
                      <Clock className="h-5 w-5 text-white" />
                    </div>
                    Login History
                  </CardTitle>
                  <CardDescription>{loginHistory.length} login attempts recorded</CardDescription>
                </div>
                <Button variant="outline" onClick={handleExportHistory} className="gap-2">
                  <Download className="h-4 w-4" />
                  Export
                </Button>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              {/* Stats */}
              <div className="grid grid-cols-4 gap-3 mb-6">
                <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
                  <p className="text-2xl text-green-600">{loginStats.successful}</p>
                  <p className="text-xs text-green-700">Successful</p>
                </div>
                <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
                  <p className="text-2xl text-red-600">{loginStats.failed}</p>
                  <p className="text-xs text-red-700">Failed</p>
                </div>
                <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
                  <p className="text-2xl text-orange-600">{loginStats.suspicious}</p>
                  <p className="text-xs text-orange-700">Suspicious</p>
                </div>
                <div className="p-3 bg-gray-50 border border-gray-200 rounded-lg text-center">
                  <p className="text-2xl text-gray-600">{loginStats.blocked}</p>
                  <p className="text-xs text-gray-700">Blocked</p>
                </div>
              </div>

              {/* Filters */}
              <div className="flex gap-2 mb-4">
                <select
                  value={statusFilter}
                  onChange={(e) => setStatusFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Status</option>
                  <option value="success">Success</option>
                  <option value="failed">Failed</option>
                  <option value="suspicious">Suspicious</option>
                  <option value="blocked">Blocked</option>
                </select>
                <select
                  value={deviceFilter}
                  onChange={(e) => setDeviceFilter(e.target.value)}
                  className="px-3 py-2 border rounded-lg text-sm"
                >
                  <option value="all">All Devices</option>
                  <option value="desktop">Desktop</option>
                  <option value="mobile">Mobile</option>
                  <option value="tablet">Tablet</option>
                </select>
              </div>

              <ScrollArea className="h-[400px] pr-4">
                <div className="space-y-3">
                  {filteredHistory.map((attempt, index) => {
                    const DeviceIcon = getDeviceIcon(attempt.device_type);
                    return (
                      <motion.div
                        key={attempt.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.03 }}
                        className={`p-4 rounded-lg border-2 ${
                          attempt.status === 'success'
                            ? 'bg-white border-gray-200'
                            : attempt.status === 'failed'
                            ? 'bg-red-50 border-red-200'
                            : attempt.status === 'suspicious'
                            ? 'bg-orange-50 border-orange-200'
                            : 'bg-gray-50 border-gray-300'
                        }`}
                      >
                        <div className="flex items-start gap-3">
                          <DeviceIcon className="h-5 w-5 text-gray-600 mt-0.5" />

                          <div className="flex-1">
                            <div className="flex items-center justify-between mb-2">
                              <h4 className="text-sm text-gray-900">{attempt.browser}</h4>
                              <Badge className={getStatusColor(attempt.status)}>
                                <div className="flex items-center gap-1">
                                  {getStatusIcon(attempt.status)}
                                  {attempt.status}
                                </div>
                              </Badge>
                            </div>

                            <div className="grid md:grid-cols-2 gap-2 text-xs text-gray-600">
                              <div className="flex items-center gap-2">
                                <MapPin className="h-3 w-3" />
                                {attempt.location}
                              </div>
                              <div className="flex items-center gap-2">
                                <Globe className="h-3 w-3" />
                                {attempt.ip_address}
                              </div>
                              <div className="flex items-center gap-2">
                                <Clock className="h-3 w-3" />
                                {new Date(attempt.timestamp).toLocaleString()}
                              </div>
                              <div className="flex items-center gap-2">
                                <Monitor className="h-3 w-3" />
                                {attempt.device_name}
                              </div>
                            </div>

                            {(attempt.status === 'suspicious' || attempt.failure_reason) && (
                              <div
                                className={`mt-2 text-xs ${
                                  attempt.status === 'suspicious'
                                    ? 'text-orange-700'
                                    : 'text-red-700'
                                }`}
                              >
                                {attempt.failure_reason ||
                                  'Flagged due to unusual location or activity pattern'}
                              </div>
                            )}
                          </div>
                        </div>
                      </motion.div>
                    );
                  })}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>

        {/* Security Events Tab */}
        <TabsContent value="events">
          <Card className="border-0 shadow-lg">
            <CardHeader className="border-b bg-gradient-to-r from-purple-50 to-pink-50">
              <div>
                <CardTitle className="flex items-center gap-2">
                  <div className="rounded-lg bg-gradient-to-r from-purple-500 to-pink-500 p-2">
                    <Shield className="h-5 w-5 text-white" />
                  </div>
                  Security Events
                </CardTitle>
                <CardDescription>Recent security-related activities on your account</CardDescription>
              </div>
            </CardHeader>
            <CardContent className="p-6">
              <ScrollArea className="h-[500px] pr-4">
                <div className="space-y-4">
                  {securityEvents.map((event, index) => (
                    <motion.div
                      key={event.id}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border-2 border-gray-200 bg-white hover:border-blue-300 hover:shadow-md transition-all"
                    >
                      <div className="flex items-start gap-3">
                        <div className="rounded-full bg-gray-100 p-2">
                          {getEventIcon(event.event_type)}
                        </div>

                        <div className="flex-1">
                          <div className="flex items-center justify-between mb-1">
                            <h4 className="text-sm text-gray-900">{event.description}</h4>
                            <Badge variant="outline" className="text-xs">
                              {event.event_type.replace('_', ' ')}
                            </Badge>
                          </div>

                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {new Date(event.timestamp).toLocaleString()}
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))}

                  {securityEvents.length === 0 && (
                    <div className="text-center py-12">
                      <Shield className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                      <p className="text-gray-500">No security events recorded</p>
                    </div>
                  )}
                </div>
              </ScrollArea>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      {/* Revoke All Dialog */}
      <AlertDialog open={showRevokeAllDialog} onOpenChange={setShowRevokeAllDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Revoke All Other Sessions?</AlertDialogTitle>
            <AlertDialogDescription>
              This will sign you out from all other devices and browsers. You will remain logged
              in on this device. This action cannot be undone.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction onClick={handleRevokeAll} className="bg-red-600 hover:bg-red-700">
              Revoke All
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>

      {/* Session Details Dialog */}
      <Dialog open={!!selectedSession} onOpenChange={() => setSelectedSession(null)}>
        <DialogContent>
          {selectedSession && (
            <>
              <DialogHeader>
                <DialogTitle>Session Details</DialogTitle>
                <DialogDescription>{selectedSession.browser}</DialogDescription>
              </DialogHeader>

              <div className="space-y-4">
                <div className="grid grid-cols-2 gap-4 text-sm">
                  <div>
                    <p className="text-gray-500 mb-1">Device</p>
                    <p className="text-gray-900">{selectedSession.device_name}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Operating System</p>
                    <p className="text-gray-900">{selectedSession.os}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Location</p>
                    <p className="text-gray-900">{selectedSession.location}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">IP Address</p>
                    <p className="text-gray-900">{selectedSession.ip_address}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">Last Active</p>
                    <p className="text-gray-900">{formatLastActive(selectedSession.last_active)}</p>
                  </div>
                  <div>
                    <p className="text-gray-500 mb-1">First Login</p>
                    <p className="text-gray-900">
                      {new Date(selectedSession.created_at).toLocaleDateString()}
                    </p>
                  </div>
                </div>

                <div className="p-3 bg-gray-50 rounded border">
                  <p className="text-xs text-gray-500 mb-1">User Agent</p>
                  <p className="text-xs text-gray-700 font-mono break-all">
                    {selectedSession.user_agent}
                  </p>
                </div>
              </div>

              {!selectedSession.is_current && (
                <DialogFooter>
                  <Button
                    variant="outline"
                    onClick={() => setSelectedSession(null)}
                  >
                    Close
                  </Button>
                  <Button
                    variant="destructive"
                    onClick={() => handleRevokeSession(selectedSession.id)}
                  >
                    <LogOut className="h-4 w-4 mr-2" />
                    Revoke Session
                  </Button>
                </DialogFooter>
              )}
            </>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
