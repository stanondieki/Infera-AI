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
import TaskManagement from './dashboard/TaskManagement';
import { OutlierTaskWorkspace } from './dashboard/OutlierTaskWorkspace';
import { getUnresolvedIssuesCount } from '../utils/issues';
import { ViewProfileDialog } from './dashboard/ViewProfileDialog';
import { InviteFriendsDialog } from './dashboard/InviteFriendsDialog';
import { NotificationsDialog } from './dashboard/NotificationsDialog';
import { ReportDialog } from './dashboard/ReportDialog';
import { MilestoneDialog } from './dashboard/MilestoneDialog';
import { CourseDialog } from './dashboard/CourseDialog';
import { ChallengeDialog } from './dashboard/ChallengeDialog';

import { Progress } from './ui/progress';
import { Avatar, AvatarFallback, AvatarImage } from './ui/avatar';
import { Separator } from './ui/separator';
import { useProfileImage } from '../utils/profileImage';
import { dashboardService } from '../utils/dashboardService';
import { PaymentReminder } from './PaymentReminder';
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
  ClipboardList,
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
  Play,
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
  const [applications, setApplications] = useState<any[]>([]);
  const [dashboardStats, setDashboardStats] = useState({
    totalApplications: 0,
    activeProjects: 0,
    completedTasks: 0,
    totalEarnings: 0,
    pendingApplications: 0,
    approvedApplications: 0,
    rejectedApplications: 0,
    successRate: 0,
    achievements: 0,
  });
  const [userTasks, setUserTasks] = useState<any[]>([]);
  const [opportunities, setOpportunities] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [activeTasks, setActiveTasks] = useState<any[]>([]);
  const [activities, setActivities] = useState<any[]>([]);
  const [skills, setSkills] = useState<any[]>([]);
  const [milestones, setMilestones] = useState<any[]>([]);
  const [leaderboard, setLeaderboard] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('overview');
  const [selectedDate, setSelectedDate] = useState<Date | undefined>(new Date());
  const [selectedTimePeriod, setSelectedTimePeriod] = useState('Last 6 Months');

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

  const [showReportDialog, setShowReportDialog] = useState(false);
  const [selectedMilestone, setSelectedMilestone] = useState<Milestone | null>(null);
  const [milestoneDialogOpen, setMilestoneDialogOpen] = useState(false);
  const [selectedCourse, setSelectedCourse] = useState<string | null>(null);
  const [courseDialogOpen, setCourseDialogOpen] = useState(false);
  const [selectedChallenge, setSelectedChallenge] = useState<string | null>(null);
  const [challengeDialogOpen, setChallengeDialogOpen] = useState(false);


  // Real earnings data will be calculated from user's actual data

  // Real performance data will be calculated from user's tasks

  // Generate task distribution based on user's actual project data
  const generateTaskDistribution = (user: any) => {
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William's actual project categories from seeded data
      // AI_TRAINING: Genesis, Flamingo, Nova = 3 projects
      // MODEL_EVALUATION: Phoenix, Bulba, Geranium = 3 projects  
      // DATA_ANNOTATION: Impala = 1 project
      // CONTENT_MODERATION: Ostrich = 1 project
      // TRANSCRIPTION: Titan = 1 project
      return [
        { name: 'AI Training', value: 33, color: '#3b82f6' },
        { name: 'Model Evaluation', value: 33, color: '#10b981' },
        { name: 'Data Annotation', value: 11, color: '#f59e0b' },
        { name: 'Content Moderation', value: 11, color: '#8b5cf6' },
        { name: 'Transcription', value: 12, color: '#ef4444' },
      ];
    }
    
    // Default distribution for other users
    return [
      { name: 'AI Training', value: 45, color: '#3b82f6' },
      { name: 'Data Annotation', value: 30, color: '#10b981' },
      { name: 'Content Review', value: 15, color: '#f59e0b' },
      { name: 'Other', value: 10, color: '#8b5cf6' },
    ];
  };
  
  const taskDistribution = generateTaskDistribution(user);

  // Generate quality score based on user's actual performance
  const generateQualityData = (user: any) => {
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William's quality based on his seeded work: Sep 96%, Oct 95%, Nov 92% = avg 94%
      return [{ name: 'Quality Score', value: 94, fill: '#10b981' }];
    }
    
    // Default quality for other users (based on their success rate if available)
    const qualityScore = user?.successRate || 85;
    return [{ name: 'Quality Score', value: qualityScore, fill: '#10b981' }];
  };
  
  const qualityData = generateQualityData(user);

  // Leaderboard - will show real user rankings when implemented in backend

  // Milestones - will be calculated based on user's real progress



  // Activities will be fetched from API or generated from user actions

  // Generate earnings data based on selected time period and William's work history
  const generateEarningsData = (period: string, user: any) => {
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William's actual work history (Sep-Nov 2025): Sep $1,506, Oct $2,234, Nov $1,200
      const fullData = [
        { month: 'Jun 2025', earnings: 0, tasks: 0, quality: 0 },
        { month: 'Jul 2025', earnings: 0, tasks: 0, quality: 0 },
        { month: 'Aug 2025', earnings: 0, tasks: 0, quality: 0 },
        { month: 'Sep 2025', earnings: 1506, tasks: 15, quality: 96 },
        { month: 'Oct 2025', earnings: 2234, tasks: 18, quality: 95 },
        { month: 'Nov 2025', earnings: 1200, tasks: 14, quality: 92 },
        { month: 'Dec 2025', earnings: 0, tasks: 0, quality: 0 }
      ];
      
      switch (period) {
        case 'Last 30 Days':
          return [{ month: 'Dec 2025', earnings: 0, tasks: 0, quality: 0 }];
        case 'Last 3 Months':
          return fullData.slice(-4); // Sep, Oct, Nov, Dec
        case 'Last 6 Months':
          return fullData;
        case 'Last Year':
          return fullData;
        default:
          return fullData;
      }
    }
    
    // Default data for other users
    return [{ month: 'Recent', earnings: dashboardStats.totalEarnings, tasks: dashboardStats.completedTasks, quality: 95 }];
  };
  
  const earningsData = generateEarningsData(selectedTimePeriod, user);

  // Generate performance data by category based on user's actual work
  const generatePerformanceData = (user: any) => {
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William's performance by category based on seeded projects
      return [
        { category: 'AI Training', score: 94, tasks: 16, earnings: 1050, quality: 94 },
        { category: 'Model Evaluation', score: 96, tasks: 15, earnings: 1820, quality: 96 },
        { category: 'Data Annotation', score: 92, tasks: 4, earnings: 500, quality: 92 },
        { category: 'Content Moderation', score: 90, tasks: 4, earnings: 600, quality: 90 },
        { category: 'Transcription', score: 88, tasks: 4, earnings: 400, quality: 88 },
        { category: 'Code Review', score: 98, tasks: 4, earnings: 444, quality: 98 }
      ];
    }
    
    // Default performance data for other users
    return [
      { category: 'AI Training', score: 92, tasks: Math.floor((dashboardStats.completedTasks || 100) * 0.4), earnings: Math.floor((dashboardStats.totalEarnings || 5000) * 0.4), quality: 92 },
      { category: 'Data Annotation', score: 88, tasks: Math.floor((dashboardStats.completedTasks || 100) * 0.3), earnings: Math.floor((dashboardStats.totalEarnings || 5000) * 0.3), quality: 88 },
      { category: 'Content Review', score: 85, tasks: Math.floor((dashboardStats.completedTasks || 100) * 0.2), earnings: Math.floor((dashboardStats.totalEarnings || 5000) * 0.2), quality: 85 },
      { category: 'Other', score: 80, tasks: Math.floor((dashboardStats.completedTasks || 100) * 0.1), earnings: Math.floor((dashboardStats.totalEarnings || 5000) * 0.1), quality: 80 }
    ];
  };
  
  const performanceData = generatePerformanceData(user);

  const totalEarnings = dashboardStats.totalEarnings;
  const thisMonthEarnings = dashboardStats.totalEarnings; 
  const lastMonthEarnings = dashboardStats.totalEarnings * 0.9; // Estimate
  const earningsGrowth = ((thisMonthEarnings - lastMonthEarnings) / (lastMonthEarnings || 1) * 100).toFixed(1);
  const activeProjectsCount = dashboardStats.activeProjects;
  const completedTasks = dashboardStats.completedTasks;
  const successRate = 98.5;
  // Calculate realistic streak for William Macy based on his 3 months of work (Sep-Nov 2025)
  const calculateStreak = (tasksData: any[], user: any) => {
    // For William Macy, create realistic streak based on his 3-month work history
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William worked consistently for 3 months (Sep, Oct, Nov 2025)
      // Assume he worked 5 days a week (weekdays) with occasional weekend work
      
      const today = new Date();
      const workStartDate = new Date('2025-09-01'); // Started in September 2025
      const workEndDate = new Date('2025-11-30');   // Worked through November 2025
      
      // Calculate days from start of work to now
      const daysSinceStart = Math.floor((today.getTime() - workStartDate.getTime()) / (1000 * 60 * 60 * 24));
      
      // For current streak: assume William is still active (worked recently)
      // If it's December 2025, he might have taken a break, so current streak could be lower
      let currentStreak = 15; // Realistic current streak
      
      // For longest streak: calculate based on his 3-month consistent work
      // September: ~22 working days, October: ~23 working days, November: ~22 working days
      // Plus some weekend work = approximately 75-80 days total
      let longestStreak = 78; // His best streak during the 3-month period
      
      // If he's still in his work period, current streak could be longer
      if (today <= workEndDate) {
        currentStreak = Math.min(daysSinceStart, 45); // Cap at reasonable number
      }
      
      return { current: currentStreak, longest: longestStreak };
    }
    
    // Original calculation for other users
    if (!tasksData || tasksData.length === 0) return { current: 0, longest: 0 };
    
    // Get completed tasks sorted by completion date
    const completedTasks = tasksData
      .filter(task => task.status === 'completed' && task.submittedAt)
      .map(task => ({
        date: new Date(task.submittedAt).toDateString(),
        task: task.title
      }))
      .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());
    
    if (completedTasks.length === 0) return { current: 0, longest: 0 };
    
    // Group tasks by date
    const tasksByDate = completedTasks.reduce((acc, task) => {
      acc[task.date] = (acc[task.date] || 0) + 1;
      return acc;
    }, {} as Record<string, number>);
    
    const uniqueDates = Object.keys(tasksByDate).sort((a, b) => new Date(b).getTime() - new Date(a).getTime());
    
    // Calculate current streak
    let currentStreak = 0;
    const today = new Date().toDateString();
    const yesterday = new Date(Date.now() - 24 * 60 * 60 * 1000).toDateString();
    
    // Check if user completed tasks today or yesterday to maintain streak
    let checkDate = new Date();
    if (uniqueDates.includes(today)) {
      // Completed task today
      for (let i = 0; i < uniqueDates.length; i++) {
        const dateStr = new Date(checkDate).toDateString();
        if (uniqueDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    } else if (uniqueDates.includes(yesterday)) {
      // Completed task yesterday, streak continues
      checkDate.setDate(checkDate.getDate() - 1);
      for (let i = 0; i < uniqueDates.length; i++) {
        const dateStr = new Date(checkDate).toDateString();
        if (uniqueDates.includes(dateStr)) {
          currentStreak++;
          checkDate.setDate(checkDate.getDate() - 1);
        } else {
          break;
        }
      }
    }
    
    // Calculate longest streak
    let longestStreak = 0;
    let tempStreak = 0;
    let previousDate = null;
    
    for (const dateStr of uniqueDates) {
      const currentDate = new Date(dateStr);
      
      if (previousDate) {
        const dayDiff = Math.abs(currentDate.getTime() - previousDate.getTime()) / (1000 * 60 * 60 * 24);
        if (dayDiff === 1) {
          tempStreak++;
        } else {
          longestStreak = Math.max(longestStreak, tempStreak);
          tempStreak = 1;
        }
      } else {
        tempStreak = 1;
      }
      
      previousDate = currentDate;
    }
    longestStreak = Math.max(longestStreak, tempStreak);
    
    return { current: currentStreak, longest: longestStreak };
  };
  
  const streakData = calculateStreak(userTasks, user);
  const currentStreak = streakData.current;
  const longestStreak = streakData.longest;

  // Skills will be calculated from user's task history

  // Animate stats on mount
  useEffect(() => {
    if (!isLoading) {
      const duration = 2000;
      const steps = 60;
      const interval = duration / steps;
      
      let step = 0;
      const timer = setInterval(() => {
        step++;
        const progress = step / steps;
        
        const calculatedRate = Math.floor((dashboardStats.successRate || 0) * progress);
        console.log('🎭 Animation step - dashboardStats.successRate:', dashboardStats.successRate, 'calculated rate:', calculatedRate);
        setAnimatedStats({
          earnings: Math.floor(totalEarnings * progress),
          tasks: Math.floor(completedTasks * progress),
          rate: calculatedRate,
        });
        
        if (step >= steps) {
          clearInterval(timer);
          setAnimatedStats({
            earnings: totalEarnings,
            tasks: completedTasks,
            rate: dashboardStats.successRate || 0,
          });
        }
      }, interval);
      
      return () => clearInterval(timer);
    }
  }, [isLoading, totalEarnings, completedTasks]);

  useEffect(() => {
    // Only load data if user is authenticated or show guest view
    console.log('🔄 Dashboard useEffect triggered - User:', user?.email, 'AccessToken:', accessToken ? 'Present' : 'Missing');
    loadDashboardData();
  }, [user, accessToken]); // Re-run when user OR token changes



  const generateLeaderboard = (user: any) => {
    // Generate a realistic leaderboard with proper ranking pools
    // This creates the impression of a larger, more competitive platform
    const totalUsers = 2000;
    const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
    
    if (isWilliam) {
      // William should be in top 10 with his impressive $4,940 earnings and 94% success rate
      const williamLeaderboard = [
        {
          rank: 3,
          name: 'William Macy',
          earnings: 4940,
          tasks: 47,
          successRate: 94,
          streak: 78,
          avatar: user?.avatar || null,
          isCurrentUser: true
        },
        {
          rank: 1,
          name: 'Alex Rodriguez',
          earnings: 5235,
          tasks: 62,
          successRate: 96,
          streak: 45,
          avatar: null,
          isCurrentUser: false
        },
        {
          rank: 2,
          name: 'Sarah Chen',
          earnings: 5120,
          tasks: 58,
          successRate: 95,
          streak: 32,
          avatar: null,
          isCurrentUser: false
        },
        {
          rank: 4,
          name: 'Marcus Johnson',
          earnings: 4654,
          tasks: 54,
          successRate: 93,
          streak: 28,
          avatar: null,
          isCurrentUser: false
        },
        {
          rank: 5,
          name: 'Emily Davis',
          earnings: 4334,
          tasks: 51,
          successRate: 91,
          streak: 22,
          avatar: null,
          isCurrentUser: false
        }
      ];
      
      setLeaderboard(williamLeaderboard);
      return;
    }
    
    // For other users, generate realistic leaderboard with them positioned appropriately
    const userEarnings = user?.totalEarnings || 1200;
    const userTasks = user?.completedTasks || 25;
    const userSuccessRate = dashboardStats.successRate || 85;
    
    // Determine user's rank based on their performance with proper pools
    let userRank;
    if (userEarnings >= 4000) {
      // $4000+: Rank 200-500
      userRank = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
    } else if (userEarnings >= 3000) {
      // $3000-4000: Rank 500-900
      userRank = Math.floor(Math.random() * (900 - 500 + 1)) + 500;
    } else if (userEarnings >= 2000) {
      // $2000-3000: Rank 900-1200
      userRank = Math.floor(Math.random() * (1200 - 900 + 1)) + 900;
    } else if (userEarnings >= 1000) {
      // $1000-2000: Rank 1200-1500
      userRank = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200;
    } else {
      // $0-1000: Rank 1500+
      userRank = Math.floor(Math.random() * 500) + 1500; // 1500-2000 range
    }
    
    const topPerformers = [
      { name: 'Alex Rodriguez', earnings: 5235, tasks: 62, successRate: 96, streak: 45 },
      { name: 'Sarah Chen', earnings: 5120, tasks: 58, successRate: 95, streak: 32 },
      { name: 'William Macy', earnings: 4940, tasks: 47, successRate: 94, streak: 78 },
      { name: 'Marcus Johnson', earnings: 4654, tasks: 54, successRate: 93, streak: 28 },
      { name: 'Emily Davis', earnings: 4334, tasks: 51, successRate: 91, streak: 22 }
    ];
    
    const leaderboardData = topPerformers.map((performer, index) => {
      const rank = index + 1;
      return {
        rank,
        name: performer.name,
        earnings: performer.earnings,
        tasks: performer.tasks,
        successRate: performer.successRate,
        streak: performer.streak,
        avatar: null,
        isCurrentUser: false
      };
    });
    
    // If user should be in top 5, replace appropriate entry
    if (userRank <= 5) {
      leaderboardData[userRank - 1] = {
        rank: userRank,
        name: user?.name || 'You',
        earnings: userEarnings,
        tasks: userTasks,
        successRate: userSuccessRate,
        streak: 5,
        avatar: user?.avatar || null,
        isCurrentUser: true
      };
      
      // Re-sort if needed
      leaderboardData.sort((a, b) => b.earnings - a.earnings);
      leaderboardData.forEach((entry, index) => {
        entry.rank = index + 1;
      });
    }
    
    setLeaderboard(leaderboardData);
  };

  const generateSkills = (user: any) => {
    if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
      // William's skills based on his actual seeded projects
      const williamSkills = [
        { 
          name: 'Natural Language Processing', 
          level: 96, 
          category: 'Expert',
          projects: ['Genesis B1 Multilingual Training', 'Nova Text Classification V2'],
          experience: '3 months',
          description: 'Advanced NLP and multilingual AI training'
        },
        { 
          name: 'Model Evaluation', 
          level: 94, 
          category: 'Expert',
          projects: ['Phoenix Eval Rating C2', 'Bulba Gen Complex Reasoning', 'Geranium YY Code Review'],
          experience: '3 months', 
          description: 'AI model performance assessment and quality evaluation'
        },
        { 
          name: 'Data Annotation', 
          level: 92, 
          category: 'Advanced',
          projects: ['Impala Vision A3 Automotive'],
          experience: '2 months',
          description: 'Computer vision data labeling and safety analysis'
        },
        { 
          name: 'Content Moderation', 
          level: 90, 
          category: 'Advanced',
          projects: ['Ostrich LLM Bias Detection'],
          experience: '2 months',
          description: 'Bias detection and fact-checking expertise'
        },
        { 
          name: 'Audio Processing', 
          level: 88, 
          category: 'Intermediate',
          projects: ['Titan Audio Transcription'],
          experience: '1 month',
          description: 'Multilingual audio transcription and analysis'
        },
        { 
          name: 'Multimodal AI', 
          level: 95, 
          category: 'Expert',
          projects: ['Flamingo Multimodal B6'],
          experience: '2 months',
          description: 'Cross-modal AI training with text, image, and audio'
        },
        { 
          name: 'Code Review', 
          level: 98, 
          category: 'Expert',
          projects: ['Geranium YY Code Review'],
          experience: '2 months',
          description: 'Security assessment and code quality evaluation'
        },
        { 
          name: 'Critical Analysis', 
          level: 93, 
          category: 'Advanced', 
          projects: ['Bulba Gen Complex Reasoning', 'Phoenix Eval Rating C2'],
          experience: '3 months',
          description: 'Complex reasoning and logical assessment'
        }
      ];
      
      setSkills(williamSkills);
      return;
    }
    
    // Generate default skills for other users based on their stats
    const defaultSkills = [
      { name: 'AI Training', level: Math.min(85 + (user?.completedTasks || 0) * 0.1, 100), category: 'Advanced', projects: [], experience: '6+ months', description: 'AI model training and optimization' },
      { name: 'Data Annotation', level: Math.min(80 + (user?.completedTasks || 0) * 0.08, 95), category: 'Intermediate', projects: [], experience: '4+ months', description: 'Data labeling and quality assurance' },
      { name: 'Content Review', level: Math.min(75 + (user?.completedTasks || 0) * 0.06, 90), category: 'Intermediate', projects: [], experience: '3+ months', description: 'Content moderation and review' },
      { name: 'Model Evaluation', level: Math.min(70 + (user?.completedTasks || 0) * 0.05, 85), category: 'Beginner', projects: [], experience: '2+ months', description: 'AI model performance assessment' }
    ];
    
    setSkills(defaultSkills);
  };

  const generateActivities = (tasksData: any[], user?: any) => {
    try {
      // Special handling for William Macy - use his actual seeded task data
      if (user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') {
        const williamActivities = [
          // December 2025 - Payment received
          {
            id: 'payment-nov-received',
            type: 'payment',
            icon: 'DollarSign',
            title: 'Payment Received: $1,200',
            description: 'November 2025 earnings deposited',
            timestamp: new Date('2025-12-01T10:30:00').toISOString(),
            status: 'success'
          },
          
          // Recent November 2025 Task Completions
          {
            id: 'task-nova-quality',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Quality Validation',
            description: 'Nova Text Classification V2 - $44 earned',
            timestamp: new Date('2025-11-30T16:45:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-nova-topic',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Topic Assignment',
            description: 'Nova Text Classification V2 - $60 earned',
            timestamp: new Date('2025-11-29T14:20:00').toISOString(),
            status: 'success'
          },
          {
            id: 'achievement-elite',
            type: 'milestone',
            icon: 'Trophy',
            title: 'Achievement: Elite Earner',
            description: 'Reached $4,000+ total earnings milestone',
            timestamp: new Date('2025-11-28T18:00:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-nova-negative',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Negative Sentiment',
            description: 'Nova Text Classification V2 - $48 earned',
            timestamp: new Date('2025-11-26T11:30:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-titan-final',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Final Package',
            description: 'Titan Audio Transcription - $64 earned',
            timestamp: new Date('2025-11-25T15:15:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-titan-qc',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Quality Control',
            description: 'Titan Audio Transcription - $112 earned',
            timestamp: new Date('2025-11-23T13:45:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-nova-positive',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Positive Sentiment',
            description: 'Nova Text Classification V2 - $48 earned',
            timestamp: new Date('2025-11-22T09:20:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-titan-speaker',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Speaker ID',
            description: 'Titan Audio Transcription - $96 earned',
            timestamp: new Date('2025-11-20T16:00:00').toISOString(),
            status: 'success'
          },
          {
            id: 'project-nova-assigned',
            type: 'task',
            icon: 'Play',
            title: 'New Project: Nova Text Classification V2',
            description: 'Text classification project assigned',
            timestamp: new Date('2025-11-18T10:15:00').toISOString(),
            status: 'pending'
          },
          {
            id: 'task-titan-meeting',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Meeting Transcription',
            description: 'Titan Audio Transcription - $128 earned',
            timestamp: new Date('2025-11-16T14:30:00').toISOString(),
            status: 'success'
          },
          {
            id: 'task-ostrich-bias',
            type: 'task',
            icon: 'CheckCircle2',
            title: 'Completed: Bias Report',
            description: 'Ostrich LLM Bias Detection - $138 earned',
            timestamp: new Date('2025-11-15T17:20:00').toISOString(),
            status: 'success'
          },
          {
            id: 'payment-oct-received',
            type: 'payment',
            icon: 'DollarSign',
            title: 'Payment Received: $2,234',
            description: 'October 2025 earnings deposited',
            timestamp: new Date('2025-11-01T10:30:00').toISOString(),
            status: 'success'
          },
          {
            id: 'milestone-streak',
            type: 'milestone',
            icon: 'Flame',
            title: 'New Record: 78-Day Streak!',
            description: 'Achieved longest consecutive work streak',
            timestamp: new Date('2025-10-25T18:30:00').toISOString(),
            status: 'success'
          }
        ];
        
        setActivities(williamActivities);
        console.log('✅ Generated William Macy activities based on seeded data:', williamActivities);
        return;
      }
      
      // Default activity generation for other users
      const recentActivities = [];
      let activityCounter = 0;
      
      // Add task completions
      const recentCompleted = tasksData
        .filter(task => task.status === 'completed' || task.status === 'under_review')
        .slice(0, 3)
        .map((task, index) => ({
          id: `task-completed-${task._id || activityCounter++}-${index}`,
          type: 'task_completed',
          title: 'Task Completed',
          description: `Completed "${task.title || 'Unknown Task'}"`,
          timestamp: task.submittedAt || task.updatedAt || new Date().toISOString(),
          status: 'completed',
          icon: 'CheckCircle2'
        }));

      // Add task assignments
      const recentAssigned = tasksData
        .filter(task => task.status === 'assigned')
        .slice(0, 2)
        .map((task, index) => ({
          id: `task-assigned-${task._id || activityCounter++}-${index}`,
          type: 'task_assigned',
          title: 'New Task Assigned',
          description: `Started "${task.title || 'Unknown Task'}"`,
          timestamp: task.startedAt || task.createdAt || new Date().toISOString(),
          status: 'assigned',
          icon: 'Briefcase'
        }));

      // Add progress updates
      const inProgress = tasksData
        .filter(task => task.status === 'in_progress' && (task.progress || 0) > 0)
        .slice(0, 2)
        .map((task, index) => ({
          id: `task-progress-${task._id || activityCounter++}-${index}`,
          type: 'task_progress',
          title: 'Task Progress',
          description: `${task.progress || 0}% completed on "${task.title || 'Unknown Task'}"`,
          timestamp: new Date(Date.now() - Math.random() * 2 * 60 * 60 * 1000).toISOString(),
          status: 'in_progress',
          icon: 'TrendingUp'
        }));

      // Combine and sort by timestamp
      recentActivities.push(...recentCompleted, ...recentAssigned, ...inProgress);
      recentActivities.sort((a, b) => new Date(b.timestamp).getTime() - new Date(a.timestamp).getTime());
      
      // Ensure all activities have unique IDs
      const uniqueActivities = recentActivities.map((activity, index) => ({
        ...activity,
        id: `activity-${index}-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`
      }));
      
      setActivities(uniqueActivities.slice(0, 6));
      console.log('✅ Generated activities with unique IDs:', uniqueActivities);
    } catch (error) {
      console.error('Error generating activities:', error);
      setActivities([]);
    }
  };

  const generateMilestones = (allTasks: any[], completedTasks: any[]) => {
    try {
      const totalTasks = allTasks.length;
      const totalCompleted = completedTasks.length;
      const totalEarnings = completedTasks.reduce((sum, task) => {
        return sum + (task.totalEarnings || task.payment || 0);
      }, 0);

      const milestones = [
        {
          id: 'tasks-milestone',
          title: 'Task Master',
          description: 'Complete 10 tasks',
          progress: Math.min(totalCompleted, 10),
          target: 10,
          reward: '$50 Bonus',
          completed: totalCompleted >= 10
        },
        {
          id: 'earnings-milestone',
          title: 'High Earner',
          description: 'Earn $1,000 total',
          progress: Math.min(totalEarnings, 1000),
          target: 1000,
          reward: 'Premium Badge',
          completed: totalEarnings >= 1000
        },
        {
          id: 'variety-milestone',
          title: 'Task Variety Expert',
          description: 'Complete tasks in 3 different categories',
          progress: 2, // Approximate based on task variety
          target: 3,
          reward: 'Expert Status',
          completed: false
        },
        {
          id: 'quality-milestone',
          title: 'Quality Champion',
          description: 'Maintain 95% quality score',
          progress: 95, // Default quality score
          target: 100,
          reward: 'Quality Badge',
          completed: false
        }
      ];

      setMilestones(milestones);
      console.log('✅ Generated milestones:', milestones);
    } catch (error) {
      console.error('Error generating milestones:', error);
    }
  };

  const loadDashboardData = async () => {
    setIsLoading(true);
    try {
      // Define William check for conditional logic
      const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
      
      // Temporarily store token for API calls (use the same key as auth system)
      if (accessToken) {
        localStorage.setItem('token', accessToken);
      }
      
      const storedToken = localStorage.getItem('token');
      console.log('🔄 Loading dashboard data:');
      console.log('  - User:', user?.email);
      console.log('  - AccessToken from auth:', accessToken ? `${accessToken.substring(0, 20)}...` : 'Missing');
      console.log('  - Stored token:', storedToken ? `${storedToken.substring(0, 20)}...` : 'Missing');
      console.log('  - Tokens match:', accessToken === storedToken);
      
      // Load all dashboard data
      const [statsData, applicationsData, tasksData, opportunitiesData] = await Promise.all([
        // Fetch real user stats from database
        dashboardService.getDashboardStats(),
        dashboardService.getUserApplications(),
        dashboardService.getUserTasks(),
        dashboardService.getOpportunities(),
      ]);

      console.log('📊 Dashboard stats:', statsData);
      console.log('📋 User tasks:', tasksData);
      console.log('👤 User email:', user?.email);
      console.log('🔍 Is William?', isWilliam);

      // Update stats based on actual tasks data
      console.log('📋 Raw tasks data:', tasksData);
      console.log('📋 Task statuses:', tasksData.map((task: any) => ({ title: task.title, status: task.status })));
      
      const activeTasks = tasksData.filter((task: any) => task.status === 'assigned' || task.status === 'in_progress');
      const completedTasks = tasksData.filter((task: any) => task.status === 'completed' || task.status === 'under_review');
      
      console.log('📊 Active tasks:', activeTasks);
      console.log('📊 Completed tasks:', completedTasks);
      
      // Calculate total earnings from completed tasks
      const totalEarnings = tasksData.reduce((sum: number, task: any) => {
        if (['completed', 'submitted', 'under_review'].includes(task.status)) {
          let taskPayment = 0;
          if (task.payment) {
            taskPayment = task.payment;
          } else if (task.hourlyRate && task.estimatedHours) {
            taskPayment = Math.floor(task.hourlyRate * task.estimatedHours);
          } else if (task.hourlyRate) {
            taskPayment = task.hourlyRate;
          }
          return sum + taskPayment;
        }
        return sum;
      }, 0);

      // Use showcase data for William, actual database data for other users
      const userCompletedTasks = isWilliam ? 47 : (statsData.completedTasks || 0);
      const userTotalEarnings = isWilliam ? 4940 : (statsData.totalEarnings || 0);
      
      // Calculate success rate based on actual task performance
      // For William, maintain his showcase status, for others use realistic calculation
      let successRate;
      if (isWilliam) {
        successRate = 94; // William's showcase success rate
      } else {
        // Calculate based on actual tasks vs completed tasks
        const totalAssignedTasks = Math.max(completedTasks.length + activeTasks.length, 1);
        successRate = totalAssignedTasks > 0 ? Math.round((completedTasks.length / totalAssignedTasks) * 100) : 0;
        
        console.log('🔍 Success Rate Debug for', user?.name || user?.email);
        console.log('  - Completed tasks length:', completedTasks.length);
        console.log('  - Active tasks length:', activeTasks.length);
        console.log('  - Total assigned tasks:', totalAssignedTasks);
        console.log('  - Calculated success rate:', successRate);
      }
      const successfulTasks = userCompletedTasks;
      const totalAssignedTasks = Math.max(userCompletedTasks + activeTasks.length, 1);

      // Calculate achievements based on actual user performance
      const achievements = [];
      if (successfulTasks >= 1) achievements.push('First Task Completed');
      if (successfulTasks >= 5) achievements.push('Task Master');
      if (successfulTasks >= 10) achievements.push('Elite Contributor');
      if (successfulTasks >= 25) achievements.push('Professional Worker');
      if (successfulTasks >= 40) achievements.push('Expert Performer');
      if (userTotalEarnings >= 50) achievements.push('First Earnings');
      if (userTotalEarnings >= 200) achievements.push('High Earner');
      if (userTotalEarnings >= 1000) achievements.push('Top Performer');
      if (userTotalEarnings >= 4000) achievements.push('Elite Earner');
      if (successRate >= 90 && totalAssignedTasks >= 3) achievements.push('Quality Expert');
      if (userTotalEarnings >= 1500) achievements.push('Monthly Champion');
      if (successRate >= 94) achievements.push('Consistency Master');

      console.log('🏆 Achievement Calculation for William Macy:');
      console.log('  - Successful tasks:', successfulTasks);
      console.log('  - Total earnings:', userTotalEarnings);
      console.log('  - Success rate:', successRate);
      console.log('  - Total assigned tasks:', totalAssignedTasks);
      console.log('  - Achievements earned:', achievements);
      console.log('  - Achievement count:', achievements.length);

      const updatedStats = {
        ...statsData,
        activeProjects: activeTasks.length,
        completedTasks: userCompletedTasks,
        totalEarnings: userTotalEarnings,
        successRate: successRate,
        achievements: achievements.length,
      };
      
      console.log('📊 Updated stats with task counts:', updatedStats);
      

      
      // Generate activities from user tasks
      generateActivities(tasksData, user);
      
      // Generate skills from user project experience
      generateSkills(user);
      
      // Generate realistic leaderboard
      generateLeaderboard(user);
      
      // Generate milestones from user progress
      generateMilestones(tasksData, completedTasks);
      
      // Transform tasks from dashboard format to ActiveProjects format
      const transformedTasks = tasksData.map((task: any) => {
        // Calculate payment based on task data
        let taskPayment = 0;
        if (task.payment) {
          taskPayment = task.payment;
        } else if (task.hourlyRate && task.estimatedHours) {
          taskPayment = Math.floor(task.hourlyRate * task.estimatedHours);
        } else if (task.hourlyRate) {
          taskPayment = task.hourlyRate;
        }

        return {
          id: task.id || task._id,
          project_id: task.projectId || task.id,
          project_name: task.projectName || task.title,
          title: task.title,
          description: task.description,
          category: task.category || 'General',
          difficulty: task.difficulty || 'medium',
          estimated_time: task.estimatedTime || (task.estimatedHours ? task.estimatedHours * 60 : 60),
          payment: taskPayment,
          status: task.status,
          progress: task.progress || 0,
          deadline: task.dueDate || task.deadline,
          instructions: task.instructions || 'Complete the assigned task according to guidelines.',
          requirements: task.requirements || ['Follow task guidelines', 'Submit quality work'],
          started_at: task.startedAt,
          time_spent: task.timeSpent || 0,
        };
      });
      
      console.log('🔄 Transformed tasks for ActiveProjects:', transformedTasks);

      // Set active tasks for Active Projects section
      const activeTasksOnly = transformedTasks.filter((task: any) => 
        task.status === 'assigned' || task.status === 'in_progress'
      );
      setActiveTasks(activeTasksOnly);
      console.log('📋 Set active tasks for overview:', activeTasksOnly);

      console.log('📊 Setting dashboardStats to:', updatedStats);
      setDashboardStats(updatedStats);
      setApplications(applicationsData);
      setUserTasks(transformedTasks);
      setOpportunities(opportunitiesData);
    } catch (error) {
      console.error('Error loading dashboard data:', error);
      if (accessToken) {
        toast.error('Failed to load dashboard data');
      }
    } finally {
      setIsLoading(false);
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
      case 'assigned':
        return <PlayCircle className="h-4 w-4 text-yellow-600" />;
      case 'in_progress':
        return <Play className="h-4 w-4 text-blue-600" />;
      case 'paused':
        return <PauseCircle className="h-4 w-4 text-yellow-600" />;
      case 'completed':
      case 'submitted':
        return <CheckCircle2 className="h-4 w-4 text-green-600" />;
      default:
        return <Clock className="h-4 w-4 text-gray-600" />;
    }
  };

  const getActivityIcon = (iconName: string) => {
    const iconMap: { [key: string]: React.ReactElement } = {
      CheckCircle2: <CheckCircle2 className="h-4 w-4 text-white" />,
      Briefcase: <Briefcase className="h-4 w-4 text-white" />,
      TrendingUp: <TrendingUp className="h-4 w-4 text-white" />,
      check: <CheckCircle2 className="h-4 w-4 text-green-600" />,
      dollar: <DollarSign className="h-4 w-4 text-green-600" />,
      trophy: <Trophy className="h-4 w-4 text-yellow-600" />,
      file: <FileText className="h-4 w-4 text-blue-600" />,
      award: <Award className="h-4 w-4 text-purple-600" />,
      star: <Star className="h-4 w-4 text-yellow-600" />,
    };
    return iconMap[iconName] || <Activity className="h-4 w-4 text-white" />;
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
            <div className="flex items-center">
              <Button variant="ghost" onClick={onBack} className="hover:bg-blue-50 transition-colors h-8 sm:h-10 px-2 sm:px-4">
                <span className="text-gray-900 bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent font-semibold text-lg sm:text-xl">Dashboard</span>
              </Button>
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
                <PopoverContent className="w-80 p-0 bg-white/95 backdrop-blur-xl border border-gray-200 shadow-xl" align="end">
                  <div className="p-4 border-b border-gray-100 bg-white/90">
                    <h4 className="text-sm font-semibold text-gray-900">Notifications</h4>
                    <p className="text-xs text-gray-600 mt-1">You have 3 unread notifications</p>
                  </div>
                  <ScrollArea className="h-80">
                    <div className="p-2 space-y-2">
                      {activities.slice(0, 5).map((activity) => (
                        <motion.div
                          key={activity.id}
                          whileHover={{ backgroundColor: 'rgba(59, 130, 246, 0.1)' }}
                          className="p-3 rounded-lg cursor-pointer transition-colors bg-white/80 backdrop-blur-sm border border-gray-100 hover:border-blue-200 shadow-sm"
                        >
                          <div className="flex gap-3">
                            <div className="flex-shrink-0 mt-1">
                              {getActivityIcon(activity.icon)}
                            </div>
                            <div className="flex-grow">
                              <p className="text-xs font-medium text-gray-900">{activity.title}</p>
                              <p className="text-xs text-gray-600 mt-0.5">{activity.description}</p>
                              <p className="text-xs text-gray-500 mt-1">{formatTime(activity.timestamp)}</p>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </ScrollArea>
                  <div className="p-2 border-t border-gray-100 bg-white/90">
                    <Button 
                      variant="ghost" 
                      className="w-full text-xs hover:bg-blue-50" 
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
                <DropdownMenuContent align="end" className="w-56 bg-white/95 backdrop-blur-md border shadow-lg">
                  <DropdownMenuLabel className="bg-gradient-to-r from-blue-50 to-purple-50">
                    <div>
                      <p className="text-sm font-medium text-gray-900">{user.name}</p>
                      <p className="text-xs text-gray-600">{user.email}</p>
                      <Badge className="mt-1 bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        Premium Member
                      </Badge>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setViewProfileOpen(true)}>
                    <Eye className="h-4 w-4" />
                    View Profile
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setActiveTab('settings')}>
                    <User className="h-4 w-4" />
                    Profile Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setActiveTab('settings')}>
                    <Settings className="h-4 w-4" />
                    Account Settings
                  </DropdownMenuItem>
                  <DropdownMenuItem className="gap-2 text-gray-700 hover:bg-blue-50 hover:text-blue-700" onClick={() => setActiveTab('skills')}>
                    <Trophy className="h-4 w-4" />
                    Achievements
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem onClick={handleSignOut} className="text-red-600 hover:bg-red-50 hover:text-red-700 gap-2">
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


              <TabsTrigger value="issues" className="gap-1 sm:gap-2 text-xs sm:text-sm data-[state=active]:bg-gradient-to-r data-[state=active]:from-blue-600 data-[state=active]:to-purple-600 data-[state=active]:text-white relative">
                <AlertCircle className="h-3 w-3 sm:h-4 sm:w-4" />
                <span className="hidden sm:inline">Issues</span>
                {user && getUnresolvedIssuesCount(user.id) > 0 && (
                  <Badge className="ml-1 h-4 w-4 sm:h-5 px-0.5 sm:px-1.5 bg-red-500 text-white text-xs flex items-center justify-center">
                    {getUnresolvedIssuesCount(user.id)}
                  </Badge>
                )}
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
                    You have {activeProjectsCount} active projects and {applications.filter(a => a.status === 'pending').length} pending applications.
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
                    <Button 
                      onClick={() => { 
                        console.log('🔄 Manual refresh triggered'); 
                        loadDashboardData(); 
                        toast.success('Dashboard refreshed!'); 
                      }} 
                      variant="secondary" 
                      className="gap-1 sm:gap-2 text-xs sm:text-sm bg-white/20 hover:bg-white/30 text-white border-white/30 backdrop-blur-xl"
                    >
                      <RefreshCw className="h-3 w-3 sm:h-4 sm:w-4" />
                      <span className="hidden sm:inline">Refresh</span>
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
                      Across {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' ? 9 : (dashboardStats.activeProjects > 0 ? dashboardStats.activeProjects : 1)} project{(user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com') ? 's' : (dashboardStats.activeProjects !== 1 ? 's' : '')}
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
                    <div className="text-2xl sm:text-3xl text-gray-900">{dashboardStats.achievements}</div>
                    <p className="text-xs sm:text-sm text-gray-600 mt-2">
                      Based on your task performance
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
                            <span className="hidden sm:inline">{selectedTimePeriod}</span>
                            <span className="sm:hidden">{selectedTimePeriod.includes('30') ? '30D' : selectedTimePeriod.includes('3') ? '3M' : selectedTimePeriod.includes('6') ? '6M' : '1Y'}</span>
                          </Button>
                        </DropdownMenuTrigger>
                        <DropdownMenuContent>
                          <DropdownMenuItem onClick={() => setSelectedTimePeriod('Last 30 Days')}>Last 30 Days</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedTimePeriod('Last 3 Months')}>Last 3 Months</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedTimePeriod('Last 6 Months')}>Last 6 Months</DropdownMenuItem>
                          <DropdownMenuItem onClick={() => setSelectedTimePeriod('Last Year')}>Last Year</DropdownMenuItem>
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

            {/* Payment Schedule Reminder */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
            >
              <PaymentReminder variant="banner" />
            </motion.div>

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
                
                {activeTasks
                  .slice(0, 3)
                  .map((task, index) => (
                    <motion.div
                      key={task.id}
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
                                    {getProjectStatusIcon(task.status)}
                                    <h3 className="text-base sm:text-lg text-gray-900 group-hover:text-blue-600 transition-colors">
                                      {task.title}
                                    </h3>
                                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0 text-xs">
                                      ${task.payment}
                                    </Badge>
                                  </div>
                                  <p className="text-xs sm:text-sm text-gray-600 mb-3">{task.description}</p>
                                  <div className="flex flex-wrap items-center gap-2 sm:gap-3 text-xs sm:text-sm">
                                    <Badge variant="outline" className="gap-1">
                                      <Code className="h-3 w-3" />
                                      {task.category}
                                    </Badge>
                                    <span className="text-xs text-gray-600 flex items-center gap-1">
                                      <CalendarIcon className="h-3 w-3" />
                                      Due {task.deadline ? formatDate(task.deadline) : 'No deadline'}
                                    </span>
                                    <span className="text-xs text-blue-600 flex items-center gap-1">
                                      <Clock className="h-3 w-3" />
                                      {task.estimated_time} mins
                                    </span>
                                    <Badge className={`text-xs ${
                                      task.status === 'assigned' ? 'bg-yellow-100 text-yellow-800' :
                                      task.status === 'in_progress' ? 'bg-blue-100 text-blue-800' :
                                      'bg-gray-100 text-gray-800'
                                    }`}>
                                      {task.status.replace('_', ' ').toUpperCase()}
                                    </Badge>
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
                                    Task Progress
                                  </span>
                                  <span className="text-gray-900">{task.progress || 0}%</span>
                                </div>
                                <div className="relative">
                                  <Progress value={task.progress || 0} className="h-3" />
                                  <motion.div
                                    className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                                    initial={{ width: 0 }}
                                    animate={{ width: `${task.progress || 0}%` }}
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
                              {getProjectStatusIcon(task.status)}
                              {task.title}
                            </DialogTitle>
                            <DialogDescription>{task.description}</DialogDescription>
                          </DialogHeader>
                          <div className="space-y-6">
                            <div className="grid grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <p className="text-sm text-gray-600">Progress</p>
                                <div className="space-y-1">
                                  <Progress value={task.progress || 0} className="h-2" />
                                  <p className="text-xs text-gray-500">
                                    Task progress: {task.progress || 0}%
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
                                      data={[{ name: 'Quality', value: 95, fill: '#10b981' }]}
                                      startAngle={90}
                                      endAngle={-270}
                                    >
                                      <RadialBar dataKey="value" cornerRadius={10} />
                                    </RadialBarChart>
                                  </ResponsiveContainer>
                                  <span className="text-2xl text-gray-900">95%</span>
                                </div>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div className="grid grid-cols-3 gap-4">
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Payment</p>
                                <p className="text-xl text-green-600">${task.payment}</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Estimated Time</p>
                                <p className="text-xl text-blue-600">{task.estimated_time} mins</p>
                              </div>
                              <div>
                                <p className="text-sm text-gray-600 mb-1">Status</p>
                                <Badge className="text-base px-3 py-1">{task.status.replace('_', ' ').toUpperCase()}</Badge>
                              </div>
                            </div>
                            
                            <Separator />
                            
                            <div>
                              <p className="text-sm text-gray-600 mb-2">Deadline</p>
                              <div className="flex items-center gap-2 text-gray-900">
                                <CalendarIcon className="h-4 w-4" />
                                <span>{task.deadline ? formatDate(task.deadline) : 'No deadline set'}</span>
                                {task.deadline && (
                                  <Badge variant="outline" className="ml-auto">
                                    {Math.ceil((new Date(task.deadline).getTime() - new Date().getTime()) / (1000 * 60 * 60 * 24))} days left
                                  </Badge>
                                )}
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

          {/* Performance Tab */}
          <TabsContent value="performance" className="space-y-4 sm:space-y-6">
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
                          <p className="text-4xl text-green-600">{qualityData[0].value}</p>
                          <p className="text-xs text-gray-500">/ 100</p>
                        </div>
                      </div>
                    </div>
                    <Badge className="mt-4 bg-green-600 text-white">
                      {qualityData[0].value >= 90 ? 'Excellent' : qualityData[0].value >= 80 ? 'Good' : qualityData[0].value >= 70 ? 'Average' : 'Needs Improvement'}
                    </Badge>
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
                      <span className="text-lg text-gray-900">
                        {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                          ? user?.completedTasks || 47
                          : user?.completedTasks || 0}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Avg Quality</span>
                      <Badge className="bg-green-100 text-green-800">
                        {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                          ? '94%'
                          : `${dashboardStats.successRate || 98}%`}
                      </Badge>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Earnings</span>
                      <span className="text-lg text-green-600">
                        {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                          ? `$${(user?.totalEarnings || 4940).toLocaleString()}`
                          : `$${(user?.totalEarnings || 0).toLocaleString()}`}
                      </span>
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
                  {(() => {
                    // Generate achievements based on actual user performance
                    const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                    const userEarnings = user?.totalEarnings || 0;
                    const userTasks = user?.completedTasks || 0;
                    const userSuccessRate = isWilliam ? 94 : (dashboardStats.successRate || 85);
                    
                    return [
                      { icon: Trophy, name: 'Top Performer', color: 'from-yellow-500 to-orange-500', unlocked: userEarnings >= 1000 },
                      { icon: Star, name: 'Rising Star', color: 'from-blue-500 to-cyan-500', unlocked: userTasks >= 10 },
                      { icon: Award, name: 'Quality Expert', color: 'from-purple-500 to-pink-500', unlocked: userSuccessRate >= 90 },
                      { icon: Zap, name: 'Speed Demon', color: 'from-orange-500 to-red-500', unlocked: userTasks >= 25 },
                      { icon: Target, name: 'Goal Crusher', color: 'from-green-500 to-emerald-500', unlocked: userEarnings >= 2000 },
                      { icon: Flame, name: 'Hot Streak', color: 'from-red-500 to-pink-500', unlocked: isWilliam || userTasks >= 30 },
                      { icon: Brain, name: 'Master Mind', color: 'from-indigo-500 to-purple-500', unlocked: isWilliam && userEarnings >= 4000 },
                      { icon: Crown, name: 'Champion', color: 'from-yellow-500 to-amber-500', unlocked: isWilliam && userTasks >= 40 },
                      { icon: Rocket, name: 'Innovator', color: 'from-cyan-500 to-blue-500', unlocked: isWilliam && userSuccessRate >= 94 },
                      { icon: Heart, name: 'Community Hero', color: 'from-pink-500 to-rose-500', unlocked: false },
                      { icon: Lightbulb, name: 'Ideas Person', color: 'from-yellow-400 to-orange-400', unlocked: false },
                      { icon: BadgeCheck, name: 'Verified Pro', color: 'from-blue-500 to-purple-500', unlocked: isWilliam },
                    ];
                  })().map((badge, index) => (
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
                          <p>{badge.unlocked ? 'Unlocked!' : 
                            badge.name === 'Top Performer' ? 'Earn $1,000+ to unlock' :
                            badge.name === 'Rising Star' ? 'Complete 10+ tasks to unlock' :
                            badge.name === 'Quality Expert' ? 'Achieve 90%+ success rate to unlock' :
                            badge.name === 'Speed Demon' ? 'Complete 25+ tasks to unlock' :
                            badge.name === 'Goal Crusher' ? 'Earn $2,000+ to unlock' :
                            badge.name === 'Hot Streak' ? 'Complete 30+ tasks to unlock' :
                            badge.name === 'Master Mind' ? 'Earn $4,000+ to unlock' :
                            badge.name === 'Champion' ? 'Complete 40+ tasks to unlock' :
                            badge.name === 'Innovator' ? 'Achieve 94%+ success rate to unlock' :
                            badge.name === 'Verified Pro' ? 'Elite performer status required' :
                            'Keep working to unlock'
                          }</p>
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
                  Updated in real-time • Top 5 of 2,000 active contributors
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
                      #{(() => {
                        const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                        if (isWilliam) return 3;
                        
                        const userEarnings = user?.totalEarnings || 1200;
                        let rank;
                        if (userEarnings >= 4000) {
                          rank = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
                        } else if (userEarnings >= 3000) {
                          rank = Math.floor(Math.random() * (900 - 500 + 1)) + 500;
                        } else if (userEarnings >= 2000) {
                          rank = Math.floor(Math.random() * (1200 - 900 + 1)) + 900;
                        } else if (userEarnings >= 1000) {
                          rank = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200;
                        } else {
                          rank = Math.floor(Math.random() * 500) + 1500;
                        }
                        return rank;
                      })()}
                    </p>
                    <Badge className="mt-3 bg-green-100 text-green-800 gap-1">
                      <ArrowUpRight className="h-3 w-3" />
                      {(() => {
                        const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                        if (isWilliam) return 'Top Performer';
                        return 'Up 2 positions';
                      })()}
                    </Badge>
                  </div>
                  <div className="space-y-3">
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Gap to #1</span>
                      <span className="text-sm text-gray-900">
                        {(() => {
                          const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                          if (isWilliam) {
                            // William is #3, so gap to Alex Rodriguez (#1) with $5,235 is $295
                            return '$295';
                          }
                          
                          const userEarnings = user?.totalEarnings || 1200;
                          const gap = 5235 - userEarnings; // Gap to Alex Rodriguez (#1)
                          return `$${gap.toLocaleString()}`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Tasks behind leader</span>
                      <span className="text-sm text-gray-900">
                        {(() => {
                          const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                          if (isWilliam) {
                            // William has 47 tasks, Alex Rodriguez (#1) has 62 tasks
                            return '15 tasks';
                          }
                          
                          const userTasks = user?.completedTasks || 25;
                          const gap = 62 - userTasks; // Gap to Alex Rodriguez (#1)
                          return `${Math.max(0, gap)} tasks`;
                        })()}
                      </span>
                    </div>
                    <div className="flex items-center justify-between">
                      <span className="text-sm text-gray-600">Percentile</span>
                      <Badge className="bg-blue-100 text-blue-800">
                        {(() => {
                          const isWilliam = user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com';
                          if (isWilliam) {
                            // William is rank #3 out of 2000 users = Top 0.15%
                            return 'Top 0.2%';
                          }
                          
                          const userEarnings = user?.totalEarnings || 1200;
                          const totalUsers = 2000;
                          let rank;
                          if (userEarnings >= 4000) {
                            rank = Math.floor(Math.random() * (500 - 200 + 1)) + 200;
                          } else if (userEarnings >= 3000) {
                            rank = Math.floor(Math.random() * (900 - 500 + 1)) + 500;
                          } else if (userEarnings >= 2000) {
                            rank = Math.floor(Math.random() * (1200 - 900 + 1)) + 900;
                          } else if (userEarnings >= 1000) {
                            rank = Math.floor(Math.random() * (1500 - 1200 + 1)) + 1200;
                          } else {
                            rank = Math.floor(Math.random() * 500) + 1500;
                          }
                          
                          const percentile = ((totalUsers - rank + 1) / totalUsers * 100).toFixed(1);
                          return `Top ${percentile}%`;
                        })()}
                      </Badge>
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



          {/* Active Projects Tab */}
          <TabsContent value="active-projects" className="space-y-6">
            <ActiveProjects tasks={userTasks} onRefresh={loadDashboardData} />
          </TabsContent>





          {/* My Issues Tab */}
          <TabsContent value="issues" className="space-y-6">
            <MyIssues />
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

    </div>
  );
}
