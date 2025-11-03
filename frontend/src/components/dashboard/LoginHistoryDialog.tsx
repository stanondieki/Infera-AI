import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { CheckCircle2, XCircle, AlertCircle, MapPin, Monitor, Smartphone, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface LoginHistoryDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface LoginAttempt {
  id: string;
  status: 'success' | 'failed' | 'suspicious';
  device: string;
  browser: string;
  location: string;
  ip: string;
  timestamp: string;
}

export function LoginHistoryDialog({ open, onOpenChange }: LoginHistoryDialogProps) {
  const loginHistory: LoginAttempt[] = [
    {
      id: '1',
      status: 'success',
      device: 'Desktop',
      browser: 'Chrome on macOS',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      timestamp: '2025-11-02 10:30 AM',
    },
    {
      id: '2',
      status: 'success',
      device: 'Mobile',
      browser: 'Safari on iOS',
      location: 'San Francisco, CA',
      ip: '192.168.1.2',
      timestamp: '2025-11-02 08:15 AM',
    },
    {
      id: '3',
      status: 'success',
      device: 'Desktop',
      browser: 'Chrome on macOS',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      timestamp: '2025-11-01 02:45 PM',
    },
    {
      id: '4',
      status: 'failed',
      device: 'Desktop',
      browser: 'Firefox on Windows',
      location: 'New York, NY',
      ip: '192.168.1.3',
      timestamp: '2025-11-01 11:20 AM',
    },
    {
      id: '5',
      status: 'success',
      device: 'Desktop',
      browser: 'Chrome on macOS',
      location: 'San Francisco, CA',
      ip: '192.168.1.1',
      timestamp: '2025-10-31 09:00 AM',
    },
    {
      id: '6',
      status: 'suspicious',
      device: 'Desktop',
      browser: 'Chrome on Linux',
      location: 'Moscow, Russia',
      ip: '185.220.101.1',
      timestamp: '2025-10-30 03:30 AM',
    },
  ];

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success':
        return <CheckCircle2 className="h-5 w-5 text-green-600" />;
      case 'failed':
        return <XCircle className="h-5 w-5 text-red-600" />;
      case 'suspicious':
        return <AlertCircle className="h-5 w-5 text-orange-600" />;
      default:
        return null;
    }
  };

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'success':
        return <Badge className="bg-green-100 text-green-800 text-xs">Success</Badge>;
      case 'failed':
        return <Badge className="bg-red-100 text-red-800 text-xs">Failed</Badge>;
      case 'suspicious':
        return <Badge className="bg-orange-100 text-orange-800 text-xs">Suspicious</Badge>;
      default:
        return null;
    }
  };

  const getCardClass = (status: string) => {
    switch (status) {
      case 'success':
        return 'bg-white border-gray-200';
      case 'failed':
        return 'bg-red-50 border-red-200';
      case 'suspicious':
        return 'bg-orange-50 border-orange-200';
      default:
        return 'bg-white border-gray-200';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Login History</DialogTitle>
          <DialogDescription>
            Review your recent login activity and security events
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="grid grid-cols-3 gap-3 mb-4">
            <div className="p-3 bg-green-50 border border-green-200 rounded-lg text-center">
              <p className="text-2xl text-green-600">
                {loginHistory.filter(l => l.status === 'success').length}
              </p>
              <p className="text-xs text-green-700">Successful Logins</p>
            </div>
            <div className="p-3 bg-red-50 border border-red-200 rounded-lg text-center">
              <p className="text-2xl text-red-600">
                {loginHistory.filter(l => l.status === 'failed').length}
              </p>
              <p className="text-xs text-red-700">Failed Attempts</p>
            </div>
            <div className="p-3 bg-orange-50 border border-orange-200 rounded-lg text-center">
              <p className="text-2xl text-orange-600">
                {loginHistory.filter(l => l.status === 'suspicious').length}
              </p>
              <p className="text-xs text-orange-700">Suspicious Activity</p>
            </div>
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {loginHistory.map((attempt, index) => (
                <motion.div
                  key={attempt.id}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.05 }}
                  className={`p-4 rounded-lg border ${getCardClass(attempt.status)} transition-all`}
                >
                  <div className="flex items-start gap-3">
                    <div className="mt-0.5">
                      {getStatusIcon(attempt.status)}
                    </div>
                    
                    <div className="flex-grow">
                      <div className="flex items-center justify-between mb-2">
                        <div className="flex items-center gap-2">
                          {attempt.device === 'Desktop' ? (
                            <Monitor className="h-4 w-4 text-gray-600" />
                          ) : (
                            <Smartphone className="h-4 w-4 text-gray-600" />
                          )}
                          <h4 className="text-sm text-gray-900">{attempt.browser}</h4>
                        </div>
                        {getStatusBadge(attempt.status)}
                      </div>
                      
                      <div className="space-y-1">
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <MapPin className="h-3 w-3" />
                          {attempt.location}
                          <span className="text-gray-400">•</span>
                          <span>{attempt.ip}</span>
                        </div>
                        <div className="flex items-center gap-2 text-xs text-gray-600">
                          <Clock className="h-3 w-3" />
                          {attempt.timestamp}
                        </div>
                      </div>
                      
                      {attempt.status === 'suspicious' && (
                        <div className="mt-2 text-xs text-orange-700">
                          This login attempt was flagged due to unusual location
                        </div>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>
        </div>
      </DialogContent>
    </Dialog>
  );
}
