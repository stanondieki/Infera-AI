import { useState } from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { ScrollArea } from '../ui/scroll-area';
import { toast } from 'sonner';
import { Monitor, Smartphone, MapPin, Clock, AlertCircle } from 'lucide-react';
import { motion } from 'framer-motion';

interface Session {
  id: string;
  device: string;
  location: string;
  lastActive: string;
  current: boolean;
  browser: string;
  ip: string;
}

interface ManageSessionsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ManageSessionsDialog({ open, onOpenChange }: ManageSessionsDialogProps) {
  const [sessions, setSessions] = useState<Session[]>([
    {
      id: '1',
      device: 'Desktop',
      location: 'San Francisco, CA',
      lastActive: 'Active now',
      current: true,
      browser: 'Chrome on macOS',
      ip: '192.168.1.1',
    },
    {
      id: '2',
      device: 'Mobile',
      location: 'San Francisco, CA',
      lastActive: '2 hours ago',
      current: false,
      browser: 'Safari on iOS',
      ip: '192.168.1.2',
    },
    {
      id: '3',
      device: 'Desktop',
      location: 'New York, NY',
      lastActive: '1 day ago',
      current: false,
      browser: 'Firefox on Windows',
      ip: '192.168.1.3',
    },
  ]);

  const handleRevokeSession = async (sessionId: string) => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 500));
      
      setSessions(sessions.filter(s => s.id !== sessionId));
      toast.success('Session revoked successfully');
    } catch (error) {
      toast.error('Failed to revoke session');
    }
  };

  const handleRevokeAll = async () => {
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      setSessions(sessions.filter(s => s.current));
      toast.success('All other sessions have been revoked');
    } catch (error) {
      toast.error('Failed to revoke sessions');
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[80vh]">
        <DialogHeader>
          <DialogTitle>Active Sessions</DialogTitle>
          <DialogDescription>
            Manage your active sessions across all devices
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4">
          <div className="flex items-center justify-between mb-4">
            <p className="text-sm text-gray-600">
              {sessions.length} active session{sessions.length !== 1 ? 's' : ''}
            </p>
            {sessions.length > 1 && (
              <Button
                variant="outline"
                size="sm"
                onClick={handleRevokeAll}
                className="text-red-600 hover:text-red-700"
              >
                Revoke All Other Sessions
              </Button>
            )}
          </div>

          <ScrollArea className="h-[400px] pr-4">
            <div className="space-y-3">
              {sessions.map((session, index) => (
                <motion.div
                  key={session.id}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={`p-4 rounded-lg border ${
                    session.current
                      ? 'bg-blue-50 border-blue-200'
                      : 'bg-white border-gray-200 hover:border-gray-300'
                  } transition-all`}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex items-start gap-3">
                      <div className={`h-10 w-10 rounded-full flex items-center justify-center ${
                        session.current ? 'bg-blue-100' : 'bg-gray-100'
                      }`}>
                        {session.device === 'Desktop' ? (
                          <Monitor className="h-5 w-5 text-blue-600" />
                        ) : (
                          <Smartphone className="h-5 w-5 text-blue-600" />
                        )}
                      </div>
                      
                      <div className="flex-grow">
                        <div className="flex items-center gap-2 mb-1">
                          <h4 className="text-sm text-gray-900">{session.browser}</h4>
                          {session.current && (
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              Current Session
                            </Badge>
                          )}
                        </div>
                        
                        <div className="space-y-1">
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <MapPin className="h-3 w-3" />
                            {session.location}
                            <span className="text-gray-400">•</span>
                            <span>{session.ip}</span>
                          </div>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Clock className="h-3 w-3" />
                            {session.lastActive}
                          </div>
                        </div>
                      </div>
                    </div>
                    
                    {!session.current && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => handleRevokeSession(session.id)}
                        className="text-red-600 hover:text-red-700"
                      >
                        Revoke
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}
            </div>
          </ScrollArea>

          <div className="mt-4 p-3 bg-yellow-50 border border-yellow-200 rounded-lg flex items-start gap-2">
            <AlertCircle className="h-5 w-5 text-yellow-600 flex-shrink-0 mt-0.5" />
            <div>
              <p className="text-sm text-yellow-900">Security Tip</p>
              <p className="text-xs text-yellow-700 mt-1">
                If you see any suspicious activity, revoke the session immediately and change your password.
              </p>
            </div>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
