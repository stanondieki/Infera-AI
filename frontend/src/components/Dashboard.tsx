import React from 'react';
import { useAuth } from '../utils/auth';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { PaymentSettings } from './dashboard/PaymentSettings';
import { MyTasks } from './dashboard/MyTasks';
import { MyIssues } from './dashboard/MyIssues';
import { ProfileSettings } from './dashboard/ProfileSettings';
import { ActiveProjects } from './dashboard/ActiveProjects';
import { SecuritySessions } from './dashboard/SecuritySessions';
import { getUnresolvedIssuesCount } from '../utils/issues';
import { ViewProfileDialog } from './dashboard/ViewProfileDialog';
import { InviteFriendsDialog } from './dashboard/InviteFriendsDialog';
import { NotificationsDialog } from './dashboard/NotificationsDialog';
import { ReportDialog } from './dashboard/ReportDialog';
import { MilestoneDialog } from './dashboard/MilestoneDialog';
import { CourseDialog } from './dashboard/CourseDialog';
import { ChallengeDialog } from './dashboard/ChallengeDialog';
import { ProjectDetailsDialog } from './dashboard/ProjectDetailsDialog';
import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useProfileImage } from '../utils/profileImage';
import { ScrollArea } from './ui/scroll-area';
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Calendar } from './ui/calender';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { Slider } from './ui/slider';
import { Switch } from './ui/switch';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from './ui/tooltip';
import {
  User,
  Mail,
  Calendar as CalendarIcon,
  Briefcase,
  LogOut,
  ArrowLeft,
  DollarSign,
  TrendingUp,
  CheckCircle2,
  Clock,
  Target,
  Award,
  FileText,
  Settings,
  Bell,
  Search,
  Filter,
  MoreVertical,
  ChevronRight,
  Shield,
  PlayCircle,
  PauseCircle,
  BarChart3,
  Activity,
  Zap,
  Star,
  TrendingDown,
  AlertCircle,
  Download,
  Share2,
  Flame,
  Trophy,
  Brain,
  Code,
  Image as ImageIcon,
  MessageSquare,
  BookOpen,
  Sparkles,
  Gift,
  ArrowUpRight,
  ArrowDownRight,
  Users,
  Crown,
  Medal,
  Rocket,
  LineChart,
  PieChart as PieChartIcon,
  Calendar as CalendarDays,
  Eye,
  Heart,
  ThumbsUp,
  MessageCircle,
  TrendingUpIcon,
  BadgeCheck,
  Lightbulb,
  RefreshCw,
} from 'lucide-react';
import { useEffect, useState } from 'react';
import { projectId } from '../utils/supabase/info';
import { toast } from 'sonner';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from './ui/dropdown-menu';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { LineChart as RechartsLineChart, Line, AreaChart, Area, BarChart, Bar, PieChart, Pie, Cell, XAxis, YAxis, CartesianGrid, Tooltip as RechartsTooltip, Legend, ResponsiveContainer, RadialBarChart, RadialBar } from 'recharts';
import { motion, AnimatePresence } from 'framer-motion';
import { HoverCard, HoverCardContent, HoverCardTrigger } from './ui/hover-card';

interface Application {
  id: string;
  opportunityId: string;
  opportunityTitle: string;
  appliedDate: string;
  status: string;
}

interface Project {
  id: string;
  title: string;
  description: string;
  category: string;
  progress: number;
  status: 'active' | 'paused' | 'completed';
  hourlyRate: number;
  tasksCompleted: number;
  totalTasks: number;
  deadline: string;
  earnings: number;
  quality: number;
  timeSpent: string;
}

interface Activity {
  id: string;
  type: string;
  title: string;
  description: string;
  timestamp: string;
  status?: string;
  icon: string;
}

interface Skill {
  name: string;
  level: number;
  tasksCompleted: number;
  category: string;
  xp: number;
  nextLevel: number;
}

interface LeaderboardEntry {
  rank: number;
  name: string;
  earnings: number;
  tasks: number;
  change: number;
}

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
}

interface DashboardProps {
  onBack: () => void;
}

export function Dashboard({ onBack }: DashboardProps) {
  const { user, accessToken, signOut } = useAuth();
  const profileImage = useProfileImage();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedProject, setSelectedProject] = useState<Project | null>(null);
  const [notificationsOpen, setNotificationsOpen] = useState(false);
  const [animatedStats, setAnimatedStats] = useState({
    earnings: 0,
    tasks: 0,
    rate: 0,
  });
  const [viewProfileOpen, setViewProfileOpen] = useState(false);
  const [inviteFriendsOpen, setInviteFriendsOpen] = useState(false);
  const [notificationsDialogOpen, setNotificationsDialogOpen] = useState(false);
  const [selectedTimeRange, setSelectedTimeRange] = useState('Last 6 Months');
  const [searchQuery, setSearchQuery] = useState('');
  const [projectFilters, setProjectFilters] = useState({
    active: true,
    paused: false,
    completed: true,
    aiTraining: true,
    dataAnnotation: true,
    contentModeration: true,
  });
  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);
  const [projectDetailsOpen, setProjectDetailsOpen] = useState(false);

  // Earnings data for chart
  const earningsData = [
    { month: 'May', earnings: 2100, tasks: 45, quality: 94 },
    { month: 'Jun', earnings: 2450, tasks: 52, quality: 95 },
    { month: 'Jul', earnings: 2800, tasks: 58, quality: 96 },
    { month: 'Aug', earnings: 2650, tasks: 55, quality: 97 },
    { month: 'Sep', earnings: 3100, tasks: 64, quality: 98 },
    { month: 'Oct', earnings: 3240, tasks: 68, quality: 98 },
  ];

  // Performance data
  const performanceData = [
    { category: 'AI Training', score: 96, tasks: 420, earnings: 5040 },
    { category: 'Data Annotation', score: 92, tasks: 310, earnings: 3720 },
    { category: 'Content Moderation', score: 98, tasks: 580, earnings: 6960 },
    { category: 'Model Evaluation', score: 89, tasks: 145, earnings: 1740 },
  ];

  // Task distribution
  const taskDistribution = [
    { name: 'AI Training', value: 45, color: '#3b82f6' },
    { name: 'Data Annotation', value: 30, color: '#10b981' },
    { name: 'Content Review', value: 15, color: '#f59e0b' },
    { name: 'Other', value: 10, color: '#8b5cf6' },
  ];

  // Quality score data
  const qualityData = [
    { name: 'Quality Score', value: 98, fill: '#10b981' },
  ];

  // Leaderboard
  const [leaderboard] = useState<LeaderboardEntry[]>([
    { rank: 1, name: 'Sarah Chen', earnings: 15240, tasks: 1250, change: 2 },
    { rank: 2, name: 'Alex Kumar', earnings: 14890, tasks: 1180, change: -1 },
    { rank: 3, name: user?.name || 'You', earnings: 12450, tasks: 740, change: 1 },
    { rank: 4, name: 'Maria Garcia', earnings: 11320, tasks: 690, change: 0 },
    { rank: 5, name: 'James Wilson', earnings: 10850, tasks: 650, change: -2 },
  ]);

  // Milestones
  const [milestones] = useState<Milestone[]>([
    {
      id: '1',
      title: '1000 Tasks Milestone',
      description: 'Complete 1000 tasks total',
      progress: 740,
      target: 1000,
      reward: '$100 Bonus',
      completed: false,
    },
    {
      id: '2',
      title: 'Quality Champion',
      description: 'Maintain 95%+ quality for 30 days',
      progress: 23,
      target: 30,
      reward: 'Premium Badge',
      completed: false,
    },
    {
      id: '3',
      title: 'Earnings Master',
      description: 'Earn $15,000 total',
      progress: 12450,
      target: 15000,
      reward: 'VIP Status',
      completed: false,
    },
  ]);

  // Mock data for projects
  const [projects] = useState<Project[]>([
    {
      id: '1',
      title: 'AI Training - Conversational AI',
      description: 'Train and evaluate conversational AI models with multi-turn dialogue',
      category: 'AI Training',
      progress: 65,
      status: 'active',
      hourlyRate: 45,
      tasksCompleted: 156,
      totalTasks: 240,
      deadline: '2025-11-15',
      earnings: 3510,
      quality: 96,
      timeSpent: '78h 20m',
    },
    {
      id: '2',
      title: 'Data Annotation - Image Recognition',
      description: 'Annotate images for advanced computer vision training',
      category: 'Data Annotation',
      progress: 42,
      status: 'active',
      hourlyRate: 38,
      tasksCompleted: 84,
      totalTasks: 200,
      deadline: '2025-11-30',
      earnings: 1596,
      quality: 94,
      timeSpent: '42h 10m',
    },
    {
      id: '3',
      title: 'Content Moderation - Text Review',
      description: 'Review and moderate user-generated content for safety',
      category: 'Content Moderation',
      progress: 100,
      status: 'completed',
      hourlyRate: 35,
      tasksCompleted: 500,
      totalTasks: 500,
      deadline: '2025-10-28',
      earnings: 8750,
      quality: 98,
      timeSpent: '250h 00m',
    },
  ]);

  const [activities] = useState<Activity[]>([
    {
      id: '1',
      type: 'task_completed',
      title: 'Completed 15 AI training tasks',
      description: 'Conversational AI project',
      timestamp: '2025-10-30T10:30:00',
      status: 'success',
      icon: 'check',
    },
    {
      id: '2',
      type: 'payment',
      title: 'Payment received',
      description: '$1,245.00 deposited',
      timestamp: '2025-10-29T14:20:00',
      status: 'success',
      icon: 'dollar',
    },
    {
      id: '3',
      type: 'milestone',
      title: 'Milestone achieved',
      description: '1000 tasks completed total',
      timestamp: '2025-10-28T16:00:00',
      status: 'success',
      icon: 'trophy',
    },
    {
      id: '4',
      type: 'application',
      title: 'Applied to new opportunity',
      description: 'AI Model Evaluator position',
      timestamp: '2025-10-28T09:15:00',
      status: 'pending',
      icon: 'file',
    },
    {
      id: '5',
      type: 'achievement',
      title: 'Earned "Top Performer" badge',
      description: 'Ranked in top 5% this month',
      timestamp: '2025-10-27T16:45:00',
      status: 'success',
      icon: 'award',
    },
    {
      id: '6',
      type: 'skill',
      title: 'Skill level increased',
      description: 'AI Training: Expert Level',
      timestamp: '2025-10-26T11:30:00',
      status: 'success',
      icon: 'star',
    },
  ]);

  // Skills data
  const [skills] = useState<Skill[]>([
    { name: 'AI Training', level: 95, tasksCompleted: 420, category: 'expert', xp: 9500, nextLevel: 10000 },
    { name: 'Data Annotation', level: 88, tasksCompleted: 310, category: 'advanced', xp: 8800, nextLevel: 10000 },
    { name: 'Content Moderation', level: 92, tasksCompleted: 580, category: 'expert', xp: 9200, nextLevel: 10000 },
    { name: 'Model Evaluation', level: 78, tasksCompleted: 145, category: 'intermediate', xp: 7800, nextLevel: 10000 },
    { name: 'Quality Assurance', level: 85, tasksCompleted: 230, category: 'advanced', xp: 8500, nextLevel: 10000 },
  ]);

  // Calculate stats
  const totalEarnings = 12450.50;
  const thisMonthEarnings = 3240.75;
  const lastMonthEarnings = 3100.00;
  const earningsGrowth = ((thisMonthEarnings - lastMonthEarnings) / lastMonthEarnings * 100).toFixed(1);
  const activeProjects = projects.filter(p => p.status === 'active').length;
  const completedTasks = projects.reduce((sum, p) => sum + p.tasksCompleted, 0);
  const successRate = 98.5;
  const currentStreak = 23;
  const longestStreak = 45;

  // Animate stats on mount
  useEffect(() => {
    const duration = 2000;
    const steps = 60;
    const interval = duration / steps;
    
    let step = 0;
    const timer = setInterval(() => {
      step++;
      const progress = step / steps;
      
      setAnimatedStats({
        earnings: Math.floor(totalEarnings * progress),
        tasks: Math.floor(completedTasks * progress),
        rate: Math.floor(successRate * progress * 10) / 10,
      });
      
      if (step >= steps) {
        clearInterval(timer);
        setAnimatedStats({
          earnings: totalEarnings,
          tasks: completedTasks,
          rate: successRate,
        });
      }
    }, interval);
    
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    fetchApplications();
  }, []);

  const fetchApplications = async () => {
    try {
      if (!accessToken) return;

      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35bc625a/applications`,
        {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        }
      );

      if (response.ok) {
        const data = await response.json();
        setApplications(data.applications || []);
      }
    } catch (error) {
      console.error('Error fetching applications:', error);
      toast.error('Failed to load applications');
    } finally {
      setLoading(false);
    }
  };

  const handleSignOut = async () => {
    await signOut();
    toast.success('Signed out successfully');
    onBack();
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
    });
  };

  const formatTime = (dateString: string) => {
    return new Date(dateString).toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    });
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'pending':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'approved':
      case 'active':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'completed':
        return 'bg-blue-100 text-blue-800 border-blue-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  const getProjectStatusIcon = (status: string) => {
    switch (status) {
      case 'active':
        return <PlayCircle className="h-4 w-4 text-green-600" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
        return <CheckCircle2 className="h-4 w-4 text-blue-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      check: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      dollar: <DollarSign className="h-4 w-4 text-green-600" />,
      trophy: <Trophy className="h-4 w-4 text-yellow-600" />,
      file: <FileText className="h-4 w-4 text-blue-600" />,
      award: <Award className="h-4 w-4 text-purple-600" />,
      star: <Star className="h-4 w-4 text-yellow-600" />,
    };
    return iconMap[iconName] || <Activity className="h-4 w-4 text-gray-600" />;
  };

  const getSkillColor = (level: number) => {
    if (level >= 90) return 'from-purple-500 to-pink-500';
    if (level >= 80) return 'from-blue-500 to-cyan-500';
    if (level >= 70) return 'from-green-500 to-emerald-500';
    return 'from-gray-500 to-slate-500';
  };

  const getRankColor = (rank: number) => {
    if (rank === 1) return 'text-yellow-600 bg-yellow-50 border-yellow-200';
    if (rank === 2) return 'text-gray-600 bg-gray-50 border-gray-200';
    if (rank === 3) return 'text-orange-600 bg-orange-50 border-orange-200';
    return 'text-blue-600 bg-blue-50 border-blue-200';
  };

  const getRankIcon = (rank: number) => {
    if (rank === 1) return <Crown className="h-5 w-5 text-yellow-600" />;
    if (rank === 2) return <Medal className="h-5 w-5 text-gray-600" />;
    if (rank === 3) return <Award className="h-5 w-5 text-orange-600" />;
    return <Star className="h-5 w-5 text-blue-600" />;
  };

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-50 to-gray-100">
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.3 }}
        >
          <Card className="w-full max-w-md shadow-xl">
            <CardContent className="p-6 text-center">
              <p className="text-gray-600">Please sign in to view your dashboard</p>
              <Button className="mt-4" onClick={onBack}>
                Go Back
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Top Navigation Bar with Glass Morphism */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14 sm:h-16">
            <div className="flex items-center gap-2 sm:gap-4">
              <Button variant="ghost" onClick={onBack} className="gap-1 sm:gap-2 hover:bg-blue-50 transition-colors h-8 sm:h-10 px-2 sm:px-4">
                <ArrowLeft className="h-4 w-4" />
                <span className="hidden sm:inline">Infera AI</span>
              </Button>
              <Separator orientation="vertical" className="h-6 hidden sm:block" />
              <h1 className="text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Dashboard</h1>
            </div>

            <div className="flex items-center gap-1 sm:gap-3">
              <Popover open={notificationsOpen} onOpenChange={setNotificationsOpen}>
                <PopoverTrigger asChild>
                  <Button variant="ghost" size="icon" className="relative hover:bg-blue-50 transition-all h-8 w-8 sm:h-10 sm:w-10">
                    <motion.div
                      animate={{ scale: notificationsOpen ? 1.1 : 1 }}
                      transition={{ duration: 0.2 }}
                    >
                      <Bell className="h-4 w-4 sm:h-5 sm:w-5" />
                    </motion.div>
                    <motion.span
                      className="absolute top-0.5 right-0.5 sm:top-1 sm:right-1 h-2 w-2 bg-red-500 rounded-full"
                      animate={{ scale: [1, 1.2, 1] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    ></motion.span>
                  </Button>
                </PopoverTrigger>
                <PopoverContent className="w-80 p-0" align="end">
                  <div className="p-4 border-b">
                    <h4 className="text-sm">Notifications</h4>
                    <p className="text-xs text-gray-500 mt-1">You have 3 unread notifications</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="p-2 space-y-2">
                      {activities.slice(0, 5).map((activity) => (
                        <motion.div
                          key={activity.id}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                          className="p-3 rounded-lg cursor-pointer transition-colors"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-grow">
                              <p className="text-xs text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                              <p className="text-xs text-gray-400 mt-1">{formatTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-2 border-t">
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs" 
                      size="sm"
                      onClick={() => {
                        setNotificationsOpen(false);
                        setNotificationsDialogOpen(true);
                      }}
                    >
                      View All Notifications
                    </Button>
                  </div>
                </PopoverContent>
              </Popover>

              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="gap-1 sm:gap-2 hover:bg-blue-50 transition-colors h-8 sm:h-10 px-2 sm:px-4">
                    <Avatar className="h-7 w-7 sm:h-8 sm:w-8 ring-2 ring-blue-500/20">
                      {profileImage && <AvatarImage src={profileImage} alt={user.name || 'User'} />}
                      <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white">
                        {user.name?.charAt(0).toUpperCase()}
                      </AvatarFallback>
                    </Avatar>
                    <span className="hidden sm:inline">{user.name}</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56">
                  <DropdownMenuLabel>
                    <div>
                      <p className="text-sm">{user.name}</p>
                      <p className="text-xs text-gray-500">{user.email}</p>
                      <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        Premium Member
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2" onClick={() => setViewProfileOpen(true)}>
                    <Eye className="h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={() => setActiveTab('settings')}>
                    <User className="h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2" onClick={() => setActiveTab('skills')}>
                    <Trophy className="h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 gap-2">
                    <LogOut className="h-4 w-4" />
                    Sign Out
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-8">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-4 sm:space-y-6">
          <ScrollArea className="w-full whitespace-nowrap">
            <TabsList className="bg-white/80 backdrop-blur-xl border shadow-sm inline-flex w-max">
              <TabsTrigger value="overview" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <BarChart3 className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Overview</span>
              </TabsTrigger>
              <TabsTrigger value="active-projects" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-green-600 data-[state=active]:to-blue-600 data-[state=active]:text-white">
                <PlayCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Active Work</span>
              </TabsTrigger>
              <TabsTrigger value="projects" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Projects</span>
              </TabsTrigger>
              <TabsTrigger value="performance" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <TrendingUp className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Performance</span>
              </TabsTrigger>
              <TabsTrigger value="skills" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Brain className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Skills</span>
              </TabsTrigger>
              <TabsTrigger value="leaderboard" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Trophy className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Leaderboard</span>
              </TabsTrigger>
              <TabsTrigger value="tasks" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Briefcase className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">My Tasks</span>
              </TabsTrigger>
              <TabsTrigger value="issues" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white relative">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Issues</span>
                {user && getUnresolvedIssuesCount(user.id) > 0 && (
                  <Badge className="ml-1 h-4 w-4 sm:h-5 px-0.5 sm:px-1.5 bg-red-500 text-white text-xs flex items-center justify-center">
                    {getUnresolvedIssuesCount(user.id)}
                  </Badge>
                )}
              </TabsTrigger>
              <TabsTrigger value="security" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Shield className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Security</span>
              </TabsTrigger>
              <TabsTrigger value="settings" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white">
                <Settings className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">
              Settings</span>
              </TabsTrigger>
            </TabsList>
          </ScrollArea>

          {/* Overview Tab */}
          <TabsContent value="overview" className="space-y-4 sm:space-y-6">
            {/* Hero Section with Gradient and Glass Morphism */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
              className="relative bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 rounded-xl sm:rounded-2xl p-4 sm:p-8 text-white overflow-hidden shadow-2xl"
            >
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
              <div className="absolute top-0 right-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
              <div className="absolute bottom-0 left-0 w-48 h-48 sm:w-96 sm:h-96 bg-white/10 rounded-full blur-3xl"></div>
              
              <div className="relative z-10 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
                <div className="space-y-2 flex-1">
                  <motion.h2
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    className="text-xl sm:text-3xl"
                  >
                    Welcome back, {user.name}! 👋
                  </motion.h2>
                  <motion.p
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                    className="text-blue-100 text-sm sm:text-base"
                  >
                    You have {activeProjects} active projects and {applications.filter(a => a.status === 'pending').length} pending applications.
                  </motion.p>
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.4 }}
                    className="flex flex-wrap gap-2 mt-4"
                  >
                    <Button onClick={onBack} variant="secondary" className="gap-1 sm:gap-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl">
                      <Rocket className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">New</span> Opportunities
                    </Button>
                    <Button onClick={() => setInviteFriendsOpen(true)} variant="secondary" className="gap-1 sm:gap-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl">
                      <Share2 className="h-3 w-3 sm:h-4 sm:w-4" />
                      Invite <span className="hidden sm:inline">Friends</span>
                    </Button>
                  </motion.div>
                </div>
                
                <motion.div
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.3 }}
                  className="text-center sm:text-right bg-white/10 backdrop-blur-xl rounded-xl sm:rounded-2xl p-4 sm:p-6 border border-white/20 w-full sm:w-auto"
                >
                  <div className="flex items-center gap-2 sm:gap-3 justify-center sm:justify-end mb-2">
                    <motion.div
                      animate={{ rotate: [0, 10, -10, 0] }}
                      transition={{ duration: 2, repeat: Infinity }}
                    >
                      <Flame className="h-6 w-6 sm:h-8 sm:w-8 text-orange-400" />
                    </motion.div>
                    <span className="text-3xl sm:text-5xl">{currentStreak}</span>
                  </div>
                  <p className="text-xs sm:text-sm text-blue-100">Day Streak 🔥</p>
                  <p className="text-xs text-blue-200 mt-1">Best: {longestStreak} days</p>
                </motion.div>
              </div>
            </motion.div>

            {/* Stats Grid with Animated Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.1 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-green-50/50 border-green-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs sm:text-sm text-gray-600">Total Earnings</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center shadow-lg"
                    >
                      <DollarSign className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl text-gray-900">${animatedStats.earnings.toLocaleString()}</div>
                    <div className="flex items-center gap-1 mt-2">
                      <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4 text-green-600" />
                      <span className="text-xs sm:text-sm text-green-600">+{earningsGrowth}%</span>
                      <span className="text-xs text-gray-500">vs last month</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-blue-50/50 border-blue-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs sm:text-sm text-gray-600">Total Tasks</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-blue-500 to-cyan-600 flex items-center justify-center shadow-lg"
                    >
                      <CheckCircle2 className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl text-gray-900">{animatedStats.tasks}</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Across {projects.length} projects
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-purple-50/50 border-purple-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs sm:text-sm text-gray-600">Success Rate</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-purple-500 to-pink-600 flex items-center justify-center shadow-lg"
                    >
                      <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl text-gray-900">{animatedStats.rate}%</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Above platform average
                    </p>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
                whileHover={{ y: -5, transition: { duration: 0.2 } }}
              >
                <Card className="hover:shadow-2xl transition-all cursor-pointer bg-gradient-to-br from-white to-yellow-50/50 border-yellow-100">
                  <CardHeader className="flex flex-row items-center justify-between pb-2 space-y-0">
                    <CardTitle className="text-xs sm:text-sm text-gray-600">Achievements</CardTitle>
                    <motion.div
                      whileHover={{ rotate: 360 }}
                      transition={{ duration: 0.6 }}
                      className="h-10 w-10 sm:h-12 sm:w-12 rounded-lg sm:rounded-xl bg-gradient-to-br from-yellow-500 to-orange-600 flex items-center justify-center shadow-lg"
                    >
                      <Trophy className="h-5 w-5 sm:h-6 sm:w-6 text-white" />
                    </motion.div>
                  </CardHeader>
                  <CardContent>
                    <div className="text-2xl sm:text-3xl text-gray-900">12</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      3 earned this month
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Charts and Activity Row */}
            <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
              {/* Earnings Chart - Takes 2 columns */}
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
                className="lg:col-span-2"
              >
                <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-xl border-gray-200/50">
                  <CardHeader className="p-4 sm:p-6">
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3">
                      <div>
                        <CardTitle className="text-base sm:text-lg">Earnings & Performance Trend</CardTitle>
                        <CardDescription className="text-xs sm:text-sm">Your growth over the last 6 months</CardDescription>
                      </div>
                      <DropdownMenu>
                        <DropdownMenuTrigger asChild>
                          <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                            <CalendarIcon className="h-3 w-3 sm:h-4 sm:w-4" />
                            <span className="hidden sm:inline">Last 6 Months</span>
                            <span className="sm:hidden">6M</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem>Last 30 Days</DropdownMenuItem>
                          <DropdownMenuItem>Last 3 Months</DropdownMenuItem>
                          <DropdownMenuItem>Last 6 Months</DropdownMenuItem>
                          <DropdownMenuItem>Last Year</DropdownMenuItem>
                        </DropdownMenuContent>
                      </DropdownMenu>
                    </div>
                  </CardHeader>
                  <CardContent className="p-2 sm:p-6">
                    <ResponsiveContainer width="100%" height={250} className="sm:h-[300px]">
                      <AreaChart data={earningsData}>
                        <defs>
                          <linearGradient id="colorEarnings" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#3b82f6" stopOpacity={0.1}/>
                          </linearGradient>
                          <linearGradient id="colorQuality" x1="0" y1="0" x2="0" y2="1">
                            <stop offset="5%" stopColor="#10b981" stopOpacity={0.8}/>
                            <stop offset="95%" stopColor="#10b981" stopOpacity={0.1}/>
                          </linearGradient>
                        </defs>
                        <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                        <XAxis dataKey="month" stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                        <RechartsTooltip
                          contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                        />
                        <Legend />
                        <Area type="monotone" dataKey="earnings" stroke="#3b82f6" fillOpacity={1} fill="url(#colorEarnings)" name="Earnings ($)" />
                        <Area type="monotone" dataKey="quality" stroke="#10b981" fillOpacity={1} fill="url(#colorQuality)" name="Quality Score" />
                      </AreaChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              {/* Activity Feed */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.5, delay: 0.5 }}
              >
                <Card className="shadow-xl hover:shadow-2xl transition-shadow bg-white/80 backdrop-blur-xl border-gray-200/50">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Activity className="h-4 w-4 sm:h-5 sm:w-5" />
                      Live Activity
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Real-time updates</CardDescription>
                  </CardHeader>
                  <CardContent className="p-4 sm:p-6">
                    <ScrollArea className="h-[250px] sm:h-[300px] pr-2 sm:pr-4">
                      <div className="space-y-3">
                        <AnimatePresence>
                          {activities.map((activity, index) => (
                            <motion.div
                              key={activity.id}
                              initial={{ opacity: 0, x: 20 }}
                              animate={{ opacity: 1, x: 0 }}
                              exit={{ opacity: 0, x: -20 }}
                              transition={{ duration: 0.3, delay: index * 0.05 }}
                              whileHover={{ scale: 1.02, backgroundColor: 'rgba(59, 130, 246, 0.05)' }}
                              className="flex gap-3 p-3 rounded-lg transition-all cursor-pointer"
                            >
                              <div className="flex-shrink-0 mt-1">
                                <motion.div
                                  whileHover={{ scale: 1.2, rotate: 360 }}
                                  transition={{ duration: 0.3 }}
                                  className="h-9 w-9 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 flex items-center justify-center shadow-lg"
                                >
                                  {getActivityIcon(activity.icon)}
                                </motion.div>
                              </div>
                              <div className="flex-grow">
                                <p className="text-sm text-gray-900">{activity.title}</p>
                                <p className="text-xs text-gray-500 mt-0.5">{activity.description}</p>
                                <p className="text-xs text-gray-400 mt-1 flex items-center gap-1">
                                  <Clock className="h-3 w-3" />
                                  {formatTime(activity.timestamp)}
                                </p>
                              </div>
                            </motion.div>
                          ))}
                        </AnimatePresence>
                      </div>
                    </ScrollArea>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Active Projects and Milestones */}
            <div className="grid lg:grid-cols-3 gap-3 sm:gap-6">
              {/* Active Projects - 2 columns */}
              <div className="lg:col-span-2 space-y-3 sm:space-y-4">
                <div className="flex items-center justify-between">
                  <h3 className="text-lg sm:text-xl text-gray-900">Active Projects</h3>
                  <Button variant="outline" size="sm" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                    <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                    <span className="hidden sm:inline">Filter</span>
                  </Button>
                </div>
                
                {projects
                  .filter(p => p.status === 'active')
                  .map((project, index) => (
                    <motion.div
                      key={project.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.01 }}
                    >
                      <Dialog>
                        <DialogTrigger asChild>
                          <Card className="cursor-pointer hover:shadow-2xl transition-all bg-white/80 backdrop-blur-xl border-gray-200/50 group">
                            <CardContent className="p-4 sm:p-6">
                              <div className="flex items-start justify-between mb-4">
                                <div className="flex-grow">
                                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                                    {getProjectStatusIcon(project.status)}
                                    <h3 className="text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {project.title}
                                    </h3>
                                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xs">
                                      ${project.hourlyRate}/hr
                                    </Badge>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{project.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Badge variant="outline" className="gap-1">
                                      <Code className="h-3 w-3" />
                                      {project.category}
                                    </Badge>
                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      Due {formatDate(project.deadline)}
                                    </span>
                                    <span className="text-xs text-green-600 flex items-center gap-1">
                                      <DollarSign className="h-3 w-3" />
                                      ${project.earnings.toLocaleString()} earned
                                    </span>
                                    <span className="text-xs text-purple-600 flex items-center gap-1">
                                      <Star className="h-3 w-3 fill-purple-600" />
                                      {project.quality}% quality
                                    </span>
                                  </div>
                                </div>
                                <motion.div
                                  whileHover={{ scale: 1.1, rotate: 90 }}
                                  transition={{ duration: 0.2 }}
                                >
                                  <ChevronRight className="h-5 w-5 text-gray-400 group-hover:text-blue-600" />
                                </motion.div>
                              </div>
                              <div className="space-y-2">
                                <div className="flex items-center justify-between text-sm">
                                  <span className="text-gray-600">
                                    {project.tasksCompleted} / {project.totalTasks} tasks
                                  </span>
                                  <span className="text-gray-900">{project.progress}%</span>
                                </div>
                                <div className="relative">
                                  <Progress value={project.progress} className="h-3" />
                                  <motion.div
                                    className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${project.progress}%` }}
                                    transition={{ duration: 1, delay: index * 0.2 }}
                                  />
                                </div>
                              </div>
                            </CardContent>
                          </Card>
                        </DialogTrigger>
                        <DialogContent className="max-w-2xl">
                          <DialogHeader>
                            <DialogTitle className="flex items-center gap-2">
                              {getProjectStatusIcon(project.status)}
                              {project.title}
                            </DialogTitle>
                            <DialogDescription>{project.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">Progress</p>
                                <div className="space-y-1">
                                  <Progress value={project.progress} className="h-2" />
                                  <p className="text-xs text-gray-500">
                                    {project.tasksCompleted} of {project.totalTasks} tasks completed ({project.progress}%)
                                  </p>
                                </div>
                              </div>
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">Quality Score</p>
                                <div className="flex items-center gap-2">
                                  <ResponsiveContainer width={80} height={80}>
                                    <RadialBarChart
                                      cx="50%"
                                      cy="50%"
                                      innerRadius="60%"
                                      outerRadius="100%"
                                      data={[{ name: 'Quality', value: project.quality, fill: '#10b981' }]}
                                      startAngle={90}
                                      endAngle={-270}
                                    >
                                      <RadialBar dataKey="value" cornerRadius={10} />
                                    </RadialBarChart>
                                  </ResponsiveContainer>
                                  <span className="text-2xl text-gray-900">{project.quality}%</span>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Earnings</p>
                                <p className="text-xl text-green-600">${project.earnings.toLocaleString()}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Hourly Rate</p>
                                <p className="text-xl text-blue-600">${project.hourlyRate}/hr</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Time Spent</p>
                                <p className="text-xl text-purple-600">{project.timeSpent}</p>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Deadline</p>
                              <div className="flex items-center gap-2 text-gray-900">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{formatDate(project.deadline)}</span>
                                <Badge variant="outline" className="ml-auto">
                                  {Math.ceil((new Date(project.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                </Badge>
                              </div>
                            </div>
                            
                            <div className="flex gap-2">
                              <Button className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600">
                                Continue Working
                              </Button>
                              <Button variant="outline" className="flex-1">
                                View Details
                              </Button>
                            </div>
                          </div>
                        </DialogContent>
                      </Dialog>
                    </motion.div>
                  ))}
              </div>

              {/* Milestones and Quick Actions - 1 column */}
              <div className="space-y-3 sm:space-y-6">
                {/* Milestones */}
                <Card className="shadow-xl bg-white/80 backdrop-blur-xl border-gray-200/50">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Target className="h-4 w-4 sm:h-5 sm:w-5 text-blue-600" />
                      Milestones
                    </CardTitle>
                    <CardDescription className="text-xs sm:text-sm">Track your progress</CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-3 sm:space-y-4 p-4 sm:p-6">
                    {milestones.map((milestone, index) => (
                      <motion.div
                        key={milestone.id}
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.3, delay: index * 0.1 }}
                        whileHover={{ scale: 1.02 }}
                        onClick={() => {
                          setSelectedMilestone(milestone);
                          setMilestoneDialogOpen(true);
                        }}
                        className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                      >
                        <div className="flex items-start justify-between mb-2">
                          <div>
                            <h4 className="text-sm text-gray-900">{milestone.title}</h4>
                            <p className="text-xs text-gray-500 mt-1">{milestone.description}</p>
                          </div>
                          <Badge className="bg-gradient-to-r from-yellow-500 to-orange-500 text-white border-0 text-xs">
                            {milestone.reward}
                          </Badge>
                        </div>
                        <div className="space-y-1">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">
                              {milestone.progress} / {milestone.target}
                            </span>
                            <span className="text-gray-900">
                              {Math.round((milestone.progress / milestone.target) * 100)}%
                            </span>
                          </div>
                          <Progress
                            value={(milestone.progress / milestone.target) * 100}
                            className="h-2"
                          />
                        </div>
                      </motion.div>
                    ))}
                  </CardContent>
                </Card>

                {/* Quick Actions */}
                <Card className="shadow-xl bg-gradient-to-br from-blue-600 to-purple-600 text-white border-0">
                  <CardHeader className="p-4 sm:p-6">
                    <CardTitle className="flex items-center gap-2 text-base sm:text-lg">
                      <Zap className="h-4 w-4 sm:h-5 sm:w-5" />
                      Quick Actions
                    </CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2 p-4 sm:p-6">
                    <Button
                      onClick={onBack}
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl"
                    >
                      <Target className="h-4 w-4" />
                      Browse Opportunities
                    </Button>
                    <Button
                      onClick={() => setShowReportDialog(true)}
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl"
                    >
                      <Download className="h-4 w-4" />
                      Download Report
                    </Button>
                    <Button
                      onClick={() => setInviteFriendsOpen(true)}
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl"
                    >
                      <Share2 className="h-4 w-4" />
                      Refer & Earn
                    </Button>
                    <Button
                      onClick={() => {
                        toast.success('Rewards claimed!', { description: 'Check your account for new rewards' });
                      }}
                      variant="secondary"
                      className="w-full justify-start gap-2 bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl"
                    >
                      <Gift className="h-4 w-4" />
                      Claim Rewards
                    </Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-4 sm:space-y-6">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div>
                <h2 className="text-xl sm:text-2xl text-gray-900">My Projects</h2>
                <p className="text-sm sm:text-base text-gray-600">Manage and track all your projects</p>
              </div>
              <div className="flex gap-2 w-full sm:w-auto">
                <div className="relative flex-1 sm:flex-initial">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-3 w-3 sm:h-4 sm:w-4 text-gray-400" />
                  <Input placeholder="Search..." className="pl-9 sm:pl-10 w-full sm:w-64 bg-white/80 backdrop-blur-xl text-sm" />
                </div>
                <Popover>
                  <PopoverTrigger asChild>
                    <Button variant="outline" className="gap-1 sm:gap-2 text-xs sm:text-sm">
                      <Filter className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Filter</span>
                    </Button>
                  </PopoverTrigger>
                  <PopoverContent className="w-80">
                    <div className="space-y-4">
                      <h4 className="text-sm">Filter Projects</h4>
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Status</label>
                        <div className="space-y-2">
                          <div className="flex items-center gap-2">
                            <Switch id="active" defaultChecked />
                            <label htmlFor="active" className="text-sm">Active</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="paused" />
                            <label htmlFor="paused" className="text-sm">Paused</label>
                          </div>
                          <div className="flex items-center gap-2">
                            <Switch id="completed" defaultChecked />
                            <label htmlFor="completed" className="text-sm">Completed</label>
                          </div>
                        </div>
                      </div>
                      <Separator />
                      <div className="space-y-2">
                        <label className="text-xs text-gray-600">Category</label>
                        <div className="space-y-2">
                          {['AI Training', 'Data Annotation', 'Content Moderation'].map((cat) => (
                            <div key={cat} className="flex items-center gap-2">
                              <Switch id={cat} defaultChecked />
                              <label htmlFor={cat} className="text-sm">{cat}</label>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </PopoverContent>
                </Popover>
              </div>
            </div>

            <div className="grid gap-3 sm:gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <Card className="hover:shadow-2xl transition-all bg-white/80 backdrop-blur-xl border-gray-200/50">
                    <CardContent className="p-4 sm:p-6">
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 sm:gap-3 mb-2 flex-wrap">
                            {getProjectStatusIcon(project.status)}
                            <h3 className="text-base sm:text-xl text-gray-900">{project.title}</h3>
                            <Badge className={`${getStatusColor(project.status)} border text-xs`}>
                              {project.status.charAt(0).toUpperCase() + project.status.slice(1)}
                            </Badge>
                          </div>
                          <p className="text-sm sm:text-base text-gray-600 mb-4">{project.description}</p>
                          <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
                            <div className="flex items-center gap-2 text-sm">
                              <div className="h-10 w-10 rounded-lg bg-green-100 flex items-center justify-center">
                                <DollarSign className="h-5 w-5 text-green-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Rate</p>
                                <p className="text-gray-900">${project.hourlyRate}/hr</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="h-10 w-10 rounded-lg bg-blue-100 flex items-center justify-center">
                                <CalendarIcon className="h-5 w-5 text-blue-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Deadline</p>
                                <p className="text-gray-900">{formatDate(project.deadline).split(',')[0]}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="h-10 w-10 rounded-lg bg-purple-100 flex items-center justify-center">
                                <CheckCircle2 className="h-5 w-5 text-purple-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Tasks</p>
                                <p className="text-gray-900">{project.tasksCompleted}/{project.totalTasks}</p>
                              </div>
                            </div>
                            <div className="flex items-center gap-2 text-sm">
                              <div className="h-10 w-10 rounded-lg bg-yellow-100 flex items-center justify-center">
                                <Star className="h-5 w-5 text-yellow-600 fill-yellow-600" />
                              </div>
                              <div>
                                <p className="text-xs text-gray-500">Quality</p>
                                <p className="text-gray-900">{project.quality}%</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        <DropdownMenu>
                          <DropdownMenuTrigger asChild>
                            <Button variant="outline" size="icon">
                              <MoreVertical className="h-4 w-4" />
                            </Button>
                          </DropdownMenuTrigger>
                          <DropdownMenuContent align="end">
                            <DropdownMenuItem className="gap-2">
                              <Eye className="h-4 w-4" />
                              View Details
                            </DropdownMenuItem>
                            <DropdownMenuItem className="gap-2">
                              <Download className="h-4 w-4" />
                              Download Report
                            </DropdownMenuItem>
                            {project.status === 'active' && (
                              <DropdownMenuItem className="gap-2">
                                <PauseCircle className="h-4 w-4" />
                                Pause Project
                              </DropdownMenuItem>
                            )}
                            <DropdownMenuSeparator />
                            <DropdownMenuItem className="gap-2 text-red-600">
                              <AlertCircle className="h-4 w-4" />
                              Report Issue
                            </DropdownMenuItem>
                          </DropdownMenuContent>
                        </DropdownMenu>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Overall Progress</span>
                          <span className="text-gray-900 flex items-center gap-2">
                            {project.progress}%
                            <Badge className="bg-green-100 text-green-800 text-xs">
                              ${project.earnings.toLocaleString()}
                            </Badge>
                          </span>
                        </div>
                        <div className="relative h-3 bg-gray-100 rounded-full overflow-hidden">
                          <motion.div
                            className="absolute top-0 left-0 h-full bg-gradient-to-r from-blue-600 to-purple-600 rounded-full"
                            initial={{ width: 0 }}
                            animate={{ width: `${project.progress}%` }}
                            transition={{ duration: 1, delay: index * 0.2 }}
                          />
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
            <div>
              <h2 className="text-xl sm:text-2xl text-gray-900">Performance Analytics</h2>
              <p className="text-sm sm:text-base text-gray-600">Detailed insights into your work quality and productivity</p>
            </div>

            {/* Performance Overview Cards */}
            <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-3 sm:gap-6">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5 }}
              >
                <Card className="text-center shadow-xl bg-gradient-to-br from-green-50 to-emerald-50 border-green-200">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">Overall Quality Score</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="relative inline-flex">
                      <ResponsiveContainer width={150} height={150}>
                        <RadialBarChart
                          cx="50%"
                          cy="50%"
                          innerRadius="70%"
                          outerRadius="100%"
                          data={qualityData}
                          startAngle={90}
                          endAngle={-270}
                        >
                          <RadialBar
                            dataKey="value"
                            cornerRadius={10}
                            fill="#10b981"
                          />
                        </RadialBarChart>
                      </ResponsiveContainer>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="text-center">
                          <p className="text-4xl text-green-600">98</p>
                          <p className="text-xs text-gray-500">/ 100</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="mt-4 bg-green-600 text-white">Excellent</Badge>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.1 }}
              >
                <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">Task Distribution</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <ResponsiveContainer width="100%" height={150}>
                      <PieChart>
                        <Pie
                          data={taskDistribution}
                          cx="50%"
                          cy="50%"
                          outerRadius={60}
                          fill="#8884d8"
                          dataKey="value"
                          label={(entry) => `${entry.value}%`}
                        >
                          {taskDistribution.map((entry, index) => (
                            <Cell key={`cell-${index}`} fill={entry.color} />
                          ))}
                        </Pie>
                        <RechartsTooltip />
                      </PieChart>
                    </ResponsiveContainer>
                  </CardContent>
                </Card>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
                  <CardHeader>
                    <CardTitle className="text-sm text-gray-600">Monthly Stats</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasks Completed</span>
                      <span className="text-lg text-gray-900">68</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Quality</span>
                      <Badge className="bg-green-100 text-green-800">98%</Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Earnings</span>
                      <span className="text-lg text-green-600">$3,240</span>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            </div>

            {/* Performance by Category */}
            <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle>Performance by Category</CardTitle>
                <CardDescription>Quality scores and earnings breakdown</CardDescription>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={350}>
                  <BarChart data={performanceData}>
                    <defs>
                      <linearGradient id="barGradient" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%" stopColor="#3b82f6" stopOpacity={0.8}/>
                        <stop offset="95%" stopColor="#8b5cf6" stopOpacity={0.8}/>
                      </linearGradient>
                    </defs>
                    <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
                    <XAxis dataKey="category" stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <YAxis stroke="#6b7280" style={{ fontSize: '12px' }} />
                    <RechartsTooltip
                      contentStyle={{ backgroundColor: '#fff', border: '1px solid #e5e7eb', borderRadius: '12px', boxShadow: '0 4px 6px -1px rgb(0 0 0 / 0.1)' }}
                    />
                    <Legend />
                    <Bar dataKey="score" fill="url(#barGradient)" radius={[8, 8, 0, 0]} name="Quality Score" />
                    <Bar dataKey="tasks" fill="#10b981" radius={[8, 8, 0, 0]} name="Tasks Completed" />
                  </BarChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            {/* Detailed Performance Metrics */}
            <div className="grid md:grid-cols-2 gap-6">
              {performanceData.map((category, index) => (
                <motion.div
                  key={category.category}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-xl transition-shadow bg-white/80 backdrop-blur-xl">
                    <CardHeader>
                      <CardTitle className="text-lg">{category.category}</CardTitle>
                    </CardHeader>
                    <CardContent className="space-y-4">
                      <div className="grid grid-cols-3 gap-4">
                        <div className="text-center">
                          <p className="text-2xl text-blue-600">{category.score}%</p>
                          <p className="text-xs text-gray-500 mt-1">Quality</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-green-600">{category.tasks}</p>
                          <p className="text-xs text-gray-500 mt-1">Tasks</p>
                        </div>
                        <div className="text-center">
                          <p className="text-2xl text-purple-600">${(category.earnings / 1000).toFixed(1)}k</p>
                          <p className="text-xs text-gray-500 mt-1">Earned</p>
                        </div>
                      </div>
                      <div className="space-y-2">
                        <div className="flex items-center justify-between text-sm">
                          <span className="text-gray-600">Performance</span>
                          <Badge className={category.score >= 95 ? 'bg-green-100 text-green-800' : 'bg-blue-100 text-blue-800'}>
                            {category.score >= 95 ? 'Excellent' : 'Very Good'}
                          </Badge>
                        </div>
                        <Progress value={category.score} className="h-2" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </TabsContent>

          {/* Skills Tab */}
          <TabsContent value="skills" className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900">Skills & Development</h2>
              <p className="text-gray-600">Track your expertise and unlock new opportunities</p>
            </div>

            {/* Skills Overview */}
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {skills.map((skill, index) => (
                <motion.div
                  key={skill.name}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                  whileHover={{ scale: 1.05, rotate: 1 }}
                >
                  <Card className="hover:shadow-2xl transition-all cursor-pointer bg-white/80 backdrop-blur-xl overflow-hidden">
                    <div className={`h-2 bg-gradient-to-r ${getSkillColor(skill.level)}`} />
                    <CardContent className="p-6">
                      <div className="flex items-center justify-between mb-4">
                        <h3 className="text-lg text-gray-900">{skill.name}</h3>
                        <Badge className={`bg-gradient-to-r ${getSkillColor(skill.level)} text-white border-0`}>
                          {skill.category}
                        </Badge>
                      </div>
                      
                      <div className="space-y-4">
                        <div className="flex items-center justify-center">
                          <div className="relative w-32 h-32">
                            <svg className="w-full h-full transform -rotate-90">
                              <circle
                                cx="64"
                                cy="64"
                                r="60"
                                stroke="#e5e7eb"
                                strokeWidth="8"
                                fill="none"
                              />
                              <motion.circle
                                cx="64"
                                cy="64"
                                r="60"
                                stroke="url(#gradient)"
                                strokeWidth="8"
                                fill="none"
                                strokeLinecap="round"
                                strokeDasharray={`${2 * Math.PI * 60}`}
                                initial={{ strokeDashoffset: 2 * Math.PI * 60 }}
                                animate={{ strokeDashoffset: 2 * Math.PI * 60 * (1 - skill.level / 100) }}
                                transition={{ duration: 1, delay: index * 0.2 }}
                              />
                              <defs>
                                <linearGradient id="gradient" x1="0%" y1="0%" x2="100%" y2="100%">
                                  <stop offset="0%" stopColor="#3b82f6" />
                                  <stop offset="100%" stopColor="#8b5cf6" />
                                </linearGradient>
                              </defs>
                            </svg>
                            <div className="absolute inset-0 flex items-center justify-center">
                              <div className="text-center">
                                <p className="text-3xl text-gray-900">{skill.level}</p>
                                <p className="text-xs text-gray-500">Level</p>
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="space-y-2">
                          <div className="flex items-center justify-between text-xs">
                            <span className="text-gray-600">XP Progress</span>
                            <span className="text-gray-900">{skill.xp} / {skill.nextLevel}</span>
                          </div>
                          <Progress value={(skill.xp / skill.nextLevel) * 100} className="h-2" />
                        </div>
                        
                        <div className="pt-4 border-t">
                          <div className="flex items-center justify-between text-sm">
                            <span className="text-gray-600">Tasks Completed</span>
                            <span className="text-gray-900">{skill.tasksCompleted}</span>
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Achievement Showcase */}
            <Card className="shadow-xl bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-5 w-5 text-yellow-600" />
                  Achievement Showcase
                </CardTitle>
                <CardDescription>Your earned badges and recognition</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-6 gap-4">
                  {[
                    { icon: Trophy, name: 'Top Performer', color: 'from-yellow-500 to-orange-500', unlocked: true },
                    { icon: Star, name: 'Rising Star', color: 'from-blue-500 to-cyan-500', unlocked: true },
                    { icon: Award, name: 'Quality Expert', color: 'from-purple-500 to-pink-500', unlocked: true },
                    { icon: Zap, name: 'Speed Demon', color: 'from-orange-500 to-red-500', unlocked: true },
                    { icon: Target, name: 'Goal Crusher', color: 'from-green-500 to-emerald-500', unlocked: true },
                    { icon: Flame, name: 'Hot Streak', color: 'from-red-500 to-pink-500', unlocked: true },
                    { icon: Brain, name: 'Master Mind', color: 'from-indigo-500 to-purple-500', unlocked: false },
                    { icon: Crown, name: 'Champion', color: 'from-yellow-500 to-amber-500', unlocked: false },
                    { icon: Rocket, name: 'Innovator', color: 'from-cyan-500 to-blue-500', unlocked: false },
                    { icon: Heart, name: 'Community Hero', color: 'from-pink-500 to-rose-500', unlocked: false },
                    { icon: Lightbulb, name: 'Ideas Person', color: 'from-yellow-400 to-orange-400', unlocked: false },
                    { icon: BadgeCheck, name: 'Verified Pro', color: 'from-blue-500 to-purple-500', unlocked: false },
                  ].map((badge, index) => (
                    <TooltipProvider key={badge.name}>
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            animate={{ opacity: 1, scale: 1 }}
                            transition={{ duration: 0.3, delay: index * 0.05 }}
                            whileHover={{ scale: badge.unlocked ? 1.1 : 1.05, rotate: badge.unlocked ? 360 : 0 }}
                            className={`flex flex-col items-center p-4 rounded-xl ${
                              badge.unlocked
                                ? 'bg-white border-2 shadow-lg'
                                : 'bg-gray-100 border-2 border-gray-200 opacity-50'
                            } transition-all cursor-pointer`}
                          >
                            <div
                              className={`h-14 w-14 rounded-full flex items-center justify-center ${
                                badge.unlocked
                                  ? `bg-gradient-to-br ${badge.color}`
                                  : 'bg-gray-300'
                              } shadow-lg mb-2`}
                            >
                              <badge.icon className="h-7 w-7 text-white" />
                            </div>
                            <p className="text-xs text-center text-gray-900">{badge.name}</p>
                          </motion.button>
                        </TooltipTrigger>
                        <TooltipContent>
                          <p>{badge.unlocked ? 'Unlocked!' : 'Locked - Keep working to unlock'}</p>
                        </TooltipContent>
                      </Tooltip>
                    </TooltipProvider>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Learning Recommendations */}
            <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <BookOpen className="h-5 w-5 text-blue-600" />
                  Recommended Learning Paths
                </CardTitle>
                <CardDescription>Courses and resources to enhance your skills</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="grid md:grid-cols-3 gap-6">
                  {[
                    {
                      title: 'Advanced AI Training Techniques',
                      icon: Brain,
                      level: 'Intermediate',
                      duration: '4 hours',
                      color: 'from-purple-500 to-pink-500',
                      xp: '+500 XP',
                    },
                    {
                      title: 'Image Annotation Mastery',
                      icon: ImageIcon,
                      level: 'Advanced',
                      duration: '3 hours',
                      color: 'from-blue-500 to-cyan-500',
                      xp: '+750 XP',
                    },
                    {
                      title: 'Quality Assurance Excellence',
                      icon: CheckCircle2,
                      level: 'Beginner',
                      duration: '2 hours',
                      color: 'from-green-500 to-emerald-500',
                      xp: '+300 XP',
                    },
                  ].map((course, index) => (
                    <motion.div
                      key={course.title}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -5 }}
                    >
                      <Card className="hover:shadow-xl transition-all cursor-pointer bg-gradient-to-br from-white to-gray-50">
                        <CardContent className="p-6">
                          <div className={`h-14 w-14 rounded-xl bg-gradient-to-br ${course.color} flex items-center justify-center mb-4 shadow-lg`}>
                            <course.icon className="h-7 w-7 text-white" />
                          </div>
                          <h4 className="text-base text-gray-900 mb-3">{course.title}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600 mb-4">
                            <Badge variant="outline" className="text-xs">{course.level}</Badge>
                            <span>• {course.duration}</span>
                            <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xs ml-auto">
                              {course.xp}
                            </Badge>
                          </div>
                          <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 gap-2">
                            <PlayCircle className="h-4 w-4" />
                            Start Course
                          </Button>
                        </CardContent>
                      </Card>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Leaderboard Tab */}
          <TabsContent value="leaderboard" className="space-y-6">
            <div className="flex items-center justify-between">
              <div>
                <h2 className="text-2xl text-gray-900">Global Leaderboard</h2>
                <p className="text-gray-600">See how you rank against top performers</p>
              </div>
              <Button variant="outline" className="gap-2">
                <RefreshCw className="h-4 w-4" />
                Refresh
              </Button>
            </div>

            {/* Leaderboard Card */}
            <Card className="shadow-2xl bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader className="bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-t-lg">
                <CardTitle className="flex items-center gap-2">
                  <Trophy className="h-6 w-6" />
                  Top Performers This Month
                </CardTitle>
                <CardDescription className="text-blue-100">
                  Updated in real-time • Top 5 of 12,453 contributors
                </CardDescription>
              </CardHeader>
              <CardContent className="p-0">
                <div className="divide-y divide-gray-200">
                  {leaderboard.map((entry, index) => (
                    <motion.div
                      key={entry.rank}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.05)', scale: 1.01 }}
                      className={`p-6 transition-all cursor-pointer ${
                        entry.name === user?.name ? 'bg-blue-50 border-l-4 border-blue-600' : ''
                      }`}
                    >
                      <div className="flex items-center gap-4">
                        <div className={`h-14 w-14 rounded-full border-2 flex items-center justify-center ${getRankColor(entry.rank)}`}>
                          {getRankIcon(entry.rank)}
                        </div>
                        
                        <div className="flex-grow">
                          <div className="flex items-center gap-2 mb-1">
                            <h4 className="text-lg text-gray-900">
                              {entry.name}
                              {entry.name === user?.name && (
                                <Badge className="ml-2 bg-blue-600 text-white">You</Badge>
                              )}
                            </h4>
                            {entry.change !== 0 && (
                              <Badge variant="outline" className={`gap-1 ${
                                entry.change > 0 ? 'text-green-600 border-green-600' : 'text-red-600 border-red-600'
                              }`}>
                                {entry.change > 0 ? <ArrowUpRight className="h-3 w-3" /> : <ArrowDownRight className="h-3 w-3" />}
                                {Math.abs(entry.change)}
                              </Badge>
                            )}
                          </div>
                          <div className="flex items-center gap-6 text-sm">
                            <div className="flex items-center gap-2">
                              <DollarSign className="h-4 w-4 text-green-600" />
                              <span className="text-gray-900">${entry.earnings.toLocaleString()}</span>
                              <span className="text-gray-500">earned</span>
                            </div>
                            <div className="flex items-center gap-2">
                              <CheckCircle2 className="h-4 w-4 text-blue-600" />
                              <span className="text-gray-900">{entry.tasks}</span>
                              <span className="text-gray-500">tasks</span>
                            </div>
                          </div>
                        </div>
                        
                        <div className="text-right">
                          <p className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                            #{entry.rank}
                          </p>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Your Performance Comparison */}
            <div className="grid md:grid-cols-2 gap-6">
              <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Your Position</CardTitle>
                  <CardDescription>How you compare to the top performers</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="text-center p-6 bg-gradient-to-br from-blue-50 to-purple-50 rounded-lg">
                    <p className="text-sm text-gray-600 mb-2">Current Rank</p>
                    <p className="text-5xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      #3
                    </p>
                    <Badge className="mt-3 bg-green-100 text-green-800 gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      Up 1 position
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gap to #1</span>
                      <span className="text-sm text-gray-900">$2,789.50</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasks behind leader</span>
                      <span className="text-sm text-gray-900">510 tasks</span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Percentile</span>
                      <Badge className="bg-blue-100 text-blue-800">Top 0.02%</Badge>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card className="shadow-xl bg-white/80 backdrop-blur-xl">
                <CardHeader>
                  <CardTitle>Compete & Win</CardTitle>
                  <CardDescription>Challenges and competitions</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  {[
                    {
                      name: 'November Sprint Challenge',
                      prize: '$500 Prize Pool',
                      participants: 245,
                      daysLeft: 15,
                      color: 'from-blue-500 to-cyan-500',
                    },
                    {
                      name: 'Quality Champion',
                      prize: 'Premium Badge',
                      participants: 189,
                      daysLeft: 8,
                      color: 'from-purple-500 to-pink-500',
                    },
                    {
                      name: 'Speed Master',
                      prize: '$250 Bonus',
                      participants: 312,
                      daysLeft: 22,
                      color: 'from-orange-500 to-red-500',
                    },
                  ].map((challenge, index) => (
                    <motion.div
                      key={challenge.name}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ scale: 1.02 }}
                      className="p-4 rounded-lg border border-gray-200 hover:border-blue-300 hover:bg-blue-50/50 transition-all cursor-pointer"
                    >
                      <div className="flex items-start justify-between">
                        <div className="flex-grow">
                          <h4 className="text-sm text-gray-900 mb-1">{challenge.name}</h4>
                          <div className="flex items-center gap-2 text-xs text-gray-600">
                            <Badge className={`bg-gradient-to-r ${challenge.color} text-white border-0 text-xs`}>
                              {challenge.prize}
                            </Badge>
                            <span>• {challenge.participants} competing</span>
                          </div>
                        </div>
                        <Badge variant="outline" className="text-xs">
                          {challenge.daysLeft}d left
                        </Badge>
                      </div>
                    </motion.div>
                  ))}
                </CardContent>
              </Card>
            </div>
          </TabsContent>

          {/* Projects Tab */}
          <TabsContent value="projects" className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">My Projects</h2>
              <p className="text-gray-600 mb-6">View and manage your active and completed projects</p>
            </div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
              {projects.map((project, index) => (
                <motion.div
                  key={project.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                  className="cursor-pointer"
                  onClick={() => {
                    setSelectedProject(project);
                    setProjectDetailsOpen(true);
                  }}
                >
                  <Card className="h-full hover:shadow-xl transition-all border-l-4 border-l-blue-500">
                    <CardHeader>
                      <div className="flex items-start justify-between mb-2">
                        <CardTitle className="text-lg">{project.title}</CardTitle>
                        <Badge className={
                          project.status === 'active' ? 'bg-green-100 text-green-800 border-green-300' :
                          project.status === 'completed' ? 'bg-blue-100 text-blue-800 border-blue-300' :
                          'bg-yellow-100 text-yellow-800 border-yellow-300'
                        }>
                          {project.status}
                        </Badge>
                      </div>
                      <CardDescription className="line-clamp-2">
                        {project.description}
                      </CardDescription>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {/* Progress */}
                        <div>
                          <div className="flex justify-between mb-2">
                            <span className="text-sm text-gray-600">Progress</span>
                            <span className="text-sm text-gray-900">{project.progress}%</span>
                          </div>
                          <Progress value={project.progress} />
                        </div>

                        {/* Stats */}
                        <div className="grid grid-cols-2 gap-3 text-sm">
                          <div>
                            <p className="text-gray-600">Tasks</p>
                            <p className="text-gray-900">{project.tasksCompleted}/{project.totalTasks}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Quality</p>
                            <p className="text-green-600">{project.quality}%</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Earnings</p>
                            <p className="text-green-600">${project.earnings.toFixed(0)}</p>
                          </div>
                          <div>
                            <p className="text-gray-600">Time</p>
                            <p className="text-gray-900">{project.timeSpent}</p>
                          </div>
                        </div>

                        {/* Action Buttons */}
                        <div className="flex gap-2 pt-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="flex-1 gap-2"
                            onClick={(e) => {
                              e.stopPropagation();
                              setSelectedProject(project);
                              setProjectDetailsOpen(true);
                            }}
                          >
                            <Eye className="h-4 w-4" />
                            View Details
                          </Button>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>

            {/* Quick Actions Card */}
            <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Sparkles className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent className="grid md:grid-cols-3 gap-4">
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => setActiveTab('tasks')}
                >
                  <Briefcase className="h-4 w-4" />
                  View All Tasks
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => setActiveTab('settings')}
                >
                  <DollarSign className="h-4 w-4" />
                  Payment Settings
                </Button>
                <Button
                  variant="outline"
                  className="justify-start gap-2"
                  onClick={() => setNotificationsDialogOpen(true)}
                >
                  <Bell className="h-4 w-4" />
                  Notifications
                </Button>
              </CardContent>
            </Card>
          </TabsContent>

          {/* Active Projects Tab */}
          <TabsContent value="active-projects" className="space-y-6">
            <ActiveProjects />
          </TabsContent>

          {/* My Tasks Tab */}
          <TabsContent value="tasks" className="space-y-6">
            <MyTasks />
          </TabsContent>

          {/* My Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <MyIssues />
          </TabsContent>

          {/* Security & Sessions Tab */}
          <TabsContent value="security" className="space-y-6">
            <SecuritySessions />
          </TabsContent>

          {/* Settings Tab */}
          <TabsContent value="settings" className="space-y-6">
            <div>
              <h2 className="text-2xl text-gray-900 mb-2">Settings</h2>
              <p className="text-gray-600 mb-6">Manage your profile, preferences, and account settings</p>
            </div>

            <ProfileSettings />
            
            <PaymentSettings />
          </TabsContent>

        </Tabs>
      </div>

      {/* Dialogs */}
      <ViewProfileDialog open={viewProfileOpen} onOpenChange={setViewProfileOpen} />
      <InviteFriendsDialog open={inviteFriendsOpen} onOpenChange={setInviteFriendsOpen} />
      <NotificationsDialog open={notificationsDialogOpen} onOpenChange={setNotificationsDialogOpen} />
      <ProjectDetailsDialog 
        open={projectDetailsOpen} 
        onOpenChange={setProjectDetailsOpen} 
        project={selectedProject}
      />
    </div>
  );
}
