import React from 'react';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { ScrollArea } from '../ui/scroll-area';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/tabs';
import { CheckCircle2, DollarSign, Trophy, FileText, Award, Star, Bell, Clock, Trash2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';

interface NotificationsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface Notification {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  icon: string;
  read: boolean;
}

export function NotificationsDialog({ open, onOpenChange }: NotificationsDialogProps) {
  const notifications: Notification[] = [
    {
      id: '1',
      type: 'task_completed',
      title: 'Completed 15 AI training tasks',
      description: 'Conversational AI project',
      timestamp: '2025-10-30T10:30:00',
      status: 'success',
      icon: 'check',
      read: false,
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment received',
      description: '$1,245.00 deposited',
      timestamp: '2025-10-29T14:20:00',
      status: 'success',
      icon: 'dollar',
      read: false,
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Milestone achieved',
      description: '1000 tasks completed total',
      timestamp: '2025-10-28T16:00:00',
      status: 'success',
      icon: 'trophy',
      read: false,
    },
    {
      id: '4',
      type: 'application',
      title: 'Applied to new opportunity',
      description: 'AI Model Evaluator position',
      timestamp: '2025-10-28T09:15:00',
      status: 'pending',
      icon: 'file',
      read: true,
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Earned "Top Performer" badge',
      description: 'Ranked in top 5% this month',
      timestamp: '2025-10-27T16:45:00',
      status: 'success',
      icon: 'award',
      read: true,
    },
    {
      id: '6',
      type: 'skill',
      title: 'Skill level increased',
      description: 'AI Training: Expert Level',
      timestamp: '2025-10-26T11:30:00',
      status: 'success',
      icon: 'star',
      read: true,
    },
    {
      id: '7',
      type: 'task_completed',
      title: 'Project completed',
      description: 'Content Moderation - Text Review',
      timestamp: '2025-10-25T14:00:00',
      status: 'success',
      icon: 'check',
      read: true,
    },
    {
      id: '8',
      type: 'payment',
      title: 'Payment received',
      description: '$890.00 deposited',
      timestamp: '2025-10-22T10:00:00',
      status: 'success',
      icon: 'dollar',
      read: true,
    },
  ];

  const getActivityIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      check: <CheckCircle2 className="h-5 w-5 text-green-600" />,
      dollar: <DollarSign className="h-5 w-5 text-green-600" />,
      trophy: <Trophy className="h-5 w-5 text-yellow-600" />,
      file: <FileText className="h-5 w-5 text-blue-600" />,
      award: <Award className="h-5 w-5 text-purple-600" />,
      star: <Star className="h-5 w-5 text-yellow-600" />,
    };
    return iconMap[iconName] || <Bell className="h-5 w-5 text-gray-600" />;
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const handleMarkAllAsRead = () => {
    toast.success('All notifications marked as read');
  };

  const handleDeleteNotification = (id: string) => {
    toast.success('Notification deleted');
  };

  const unreadNotifications = notifications.filter(n => !n.read);
  const readNotifications = notifications.filter(n => n.read);

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh]">
        <DialogHeader>
          <div className="flex items-center justify-between">
            <div>
              <DialogTitle className="flex items-center gap-2">
                <Bell className="h-5 w-5 text-blue-600" />
                Notifications
              </DialogTitle>
              <DialogDescription className="mt-1">
                {unreadNotifications.length} unread notification{unreadNotifications.length !== 1 ? 's' : ''}
              </DialogDescription>
            </div>
            {unreadNotifications.length > 0 && (
              <Button variant="outline" size="sm" onClick={handleMarkAllAsRead}>
                Mark all as read
              </Button>
            )}
          </div>
        </DialogHeader>

        <Tabs defaultValue="all" className="mt-4">
          <TabsList className="grid w-full grid-cols-3">
            <TabsTrigger value="all">
              All ({notifications.length})
            </TabsTrigger>
            <TabsTrigger value="unread">
              Unread ({unreadNotifications.length})
            </TabsTrigger>
            <TabsTrigger value="read">
              Read ({readNotifications.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3 pr-4 pb-4">
                {notifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className={`p-4 rounded-lg border transition-colors hover:bg-gray-50 ${
                      notification.read ? 'bg-white border-gray-200' : 'bg-blue-50 border-blue-200'
                    }`}
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(notification.icon)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-grow">
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-400">{formatTime(notification.timestamp)}</p>
                              {!notification.read && (
                                <Badge className="bg-blue-600 text-white text-xs ml-2">New</Badge>
                              )}
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="unread" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3 pr-4 pb-4">
                {unreadNotifications.length > 0 ? (
                  unreadNotifications.map((notification, index) => (
                    <motion.div
                      key={notification.id}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: index * 0.05 }}
                      className="p-4 rounded-lg border bg-blue-50 border-blue-200 transition-colors hover:bg-blue-100"
                    >
                      <div className="flex gap-3">
                        <div className="flex-shrink-0 mt-1">
                          {getActivityIcon(notification.icon)}
                        </div>
                        <div className="flex-grow min-w-0">
                          <div className="flex items-start justify-between gap-2">
                            <div className="flex-grow">
                              <p className="text-sm text-gray-900">{notification.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                              <div className="flex items-center gap-2 mt-2">
                                <Clock className="h-3 w-3 text-gray-400" />
                                <p className="text-xs text-gray-400">{formatTime(notification.timestamp)}</p>
                                <Badge className="bg-blue-600 text-white text-xs ml-2">New</Badge>
                              </div>
                            </div>
                            <Button
                              variant="ghost"
                              size="icon"
                              className="h-8 w-8 text-gray-400 hover:text-red-600"
                              onClick={() => handleDeleteNotification(notification.id)}
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </div>
                        </div>
                      </div>
                    </motion.div>
                  ))
                ) : (
                  <div className="text-center py-12">
                    <Bell className="h-12 w-12 text-gray-400 mx-auto mb-3" />
                    <p className="text-sm text-gray-600">No unread notifications</p>
                  </div>
                )}
              </div>
            </ScrollArea>
          </TabsContent>

          <TabsContent value="read" className="mt-4">
            <ScrollArea className="h-[400px] w-full">
              <div className="space-y-3 pr-4 pb-4">
                {readNotifications.map((notification, index) => (
                  <motion.div
                    key={notification.id}
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.05 }}
                    className="p-4 rounded-lg border bg-white border-gray-200 transition-colors hover:bg-gray-50"
                  >
                    <div className="flex gap-3">
                      <div className="flex-shrink-0 mt-1">
                        {getActivityIcon(notification.icon)}
                      </div>
                      <div className="flex-grow min-w-0">
                        <div className="flex items-start justify-between gap-2">
                          <div className="flex-grow">
                            <p className="text-sm text-gray-900">{notification.title}</p>
                            <p className="text-xs text-gray-500 mt-0.5">{notification.description}</p>
                            <div className="flex items-center gap-2 mt-2">
                              <Clock className="h-3 w-3 text-gray-400" />
                              <p className="text-xs text-gray-400">{formatTime(notification.timestamp)}</p>
                            </div>
                          </div>
                          <Button
                            variant="ghost"
                            size="icon"
                            className="h-8 w-8 text-gray-400 hover:text-red-600"
                            onClick={() => handleDeleteNotification(notification.id)}
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            </ScrollArea>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
}
