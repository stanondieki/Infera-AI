import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Button } from '../ui/button';
import { Separator } from '../ui/separator';
import { Progress } from '../ui/progress';
import { ScrollArea } from '../ui/scroll-area';
import {
  User,
  Mail,
  MapPin,
  Briefcase,
  Globe,
  Phone,
  Calendar,
  DollarSign,
  CheckCircle2,
  Star,
  Trophy,
  Award,
  Zap,
  Target,
  Flame,
  Share2,
  Download,
  Shield,
} from 'lucide-react';
import { useAuth } from '../../utils/auth';
import { motion } from 'framer-motion';
import { toast } from 'sonner';

interface ViewProfileDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ViewProfileDialog({ open, onOpenChange }: ViewProfileDialogProps) {
  const { user } = useAuth();

  const handleShareProfile = () => {
    const profileUrl = `https://inferaai.com/profile/${user?.id || 'user123'}`;
    if (navigator.share) {
      navigator.share({
        title: `${user?.name}'s Profile - Infera AI`,
        text: 'Check out my profile on Infera AI!',
        url: profileUrl,
      }).catch(() => {
        // Fallback to copy
        navigator.clipboard.writeText(profileUrl);
        toast.success('Profile link copied to clipboard!');
      });
    } else {
      navigator.clipboard.writeText(profileUrl);
      toast.success('Profile link copied to clipboard!');
    }
  };

  const handleDownloadResume = () => {
    toast.success('Generating resume... Download will start shortly!');
    // Simulate resume generation
    setTimeout(() => {
      toast.success('Resume downloaded successfully!');
    }, 2000);
  };

  const skills = [
    { name: 'AI Training', level: 95, category: 'Expert' },
    { name: 'Data Annotation', level: 88, category: 'Advanced' },
    { name: 'Content Moderation', level: 92, category: 'Expert' },
    { name: 'Model Evaluation', level: 78, category: 'Intermediate' },
  ];

  const achievements = [
    { icon: Trophy, name: 'Top Performer', color: 'from-yellow-500 to-orange-500', unlocked: true },
    { icon: Star, name: 'Rising Star', color: 'from-blue-500 to-cyan-500', unlocked: true },
    { icon: Award, name: 'Quality Expert', color: 'from-purple-500 to-pink-500', unlocked: true },
    { icon: Zap, name: 'Speed Demon', color: 'from-orange-500 to-red-500', unlocked: true },
    { icon: Target, name: 'Goal Crusher', color: 'from-green-500 to-emerald-500', unlocked: true },
    { icon: Flame, name: 'Hot Streak', color: 'from-red-500 to-pink-500', unlocked: true },
  ];

  const recentProjects = [
    { title: 'AI Training - Conversational AI', status: 'Active', progress: 65 },
    { title: 'Data Annotation - Image Recognition', status: 'Active', progress: 42 },
    { title: 'Content Moderation - Text Review', status: 'Completed', progress: 100 },
  ];

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl max-h-[90vh] p-0">
        <ScrollArea className="max-h-[90vh]">
          <div className="p-6">
            <DialogHeader>
              <DialogTitle>Profile Overview</DialogTitle>
              <DialogDescription>View your complete profile information and statistics</DialogDescription>
            </DialogHeader>

            {/* Profile Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4 }}
              className="mt-6 p-6 rounded-xl bg-gradient-to-br from-blue-50 to-purple-50 border border-blue-200"
            >
              <div className="flex items-start gap-6">
                <Avatar className="h-24 w-24 ring-4 ring-blue-500/20 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                    {user?.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>

                <div className="flex-grow">
                  <h2 className="text-2xl text-gray-900">{user?.name}</h2>
                  <p className="text-gray-600">AI Training Specialist</p>
                  <div className="flex items-center gap-2 mt-2">
                    <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                      Premium Member
                    </Badge>
                    <Badge variant="outline" className="gap-1">
                      <Shield className="h-3 w-3" />
                      Verified
                    </Badge>
                  </div>
                  
                  <div className="flex gap-2 mt-4">
                    <Button size="sm" variant="outline" className="gap-2" onClick={handleShareProfile}>
                      <Share2 className="h-4 w-4" />
                      Share Profile
                    </Button>
                    <Button size="sm" variant="outline" className="gap-2" onClick={handleDownloadResume}>
                      <Download className="h-4 w-4" />
                      Download Resume
                    </Button>
                  </div>
                </div>
              </div>

              {/* Stats Grid */}
              <div className="grid grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 text-green-600 mb-1">
                    <DollarSign className="h-5 w-5" />
                    <span className="text-2xl text-gray-900">12.4K</span>
                  </div>
                  <p className="text-xs text-gray-600">Total Earnings</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <CheckCircle2 className="h-5 w-5 text-blue-600" />
                    <span className="text-2xl text-gray-900">740</span>
                  </div>
                  <p className="text-xs text-gray-600">Tasks Done</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Star className="h-5 w-5 text-yellow-600" />
                    <span className="text-2xl text-gray-900">98.5%</span>
                  </div>
                  <p className="text-xs text-gray-600">Success Rate</p>
                </div>
                <div className="text-center">
                  <div className="flex items-center justify-center gap-1 mb-1">
                    <Trophy className="h-5 w-5 text-purple-600" />
                    <span className="text-2xl text-gray-900">#3</span>
                  </div>
                  <p className="text-xs text-gray-600">Leaderboard</p>
                </div>
              </div>
            </motion.div>

            {/* Contact Information */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
              className="mt-6 space-y-4"
            >
              <h3 className="text-lg text-gray-900">Contact Information</h3>
              <div className="grid md:grid-cols-2 gap-4">
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Mail className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Email</p>
                    <p className="text-sm text-gray-900">{user?.email}</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Phone className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Phone</p>
                    <p className="text-sm text-gray-900">+1 (555) 123-4567</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <MapPin className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Location</p>
                    <p className="text-sm text-gray-900">San Francisco, CA</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Calendar className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Member Since</p>
                    <p className="text-sm text-gray-900">January 2024</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Briefcase className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Company</p>
                    <p className="text-sm text-gray-900">Infera AI</p>
                  </div>
                </div>
                <div className="flex items-center gap-3 p-3 rounded-lg bg-gray-50 border border-gray-200">
                  <Globe className="h-5 w-5 text-blue-600" />
                  <div>
                    <p className="text-xs text-gray-600">Website</p>
                    <p className="text-sm text-blue-600 hover:underline cursor-pointer">inferaai.com</p>
                  </div>
                </div>
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Bio */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.2 }}
            >
              <h3 className="text-lg text-gray-900 mb-3">About</h3>
              <p className="text-sm text-gray-600 leading-relaxed">
                Passionate AI contributor working on cutting-edge projects. Specialized in AI training,
                data annotation, and quality assurance with over 2 years of experience. Dedicated to
                delivering high-quality work and maintaining exceptional standards.
              </p>
            </motion.div>

            <Separator className="my-6" />

            {/* Skills */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 }}
            >
              <h3 className="text-lg text-gray-900 mb-4">Skills & Expertise</h3>
              <div className="grid md:grid-cols-2 gap-4">
                {skills.map((skill) => (
                  <div key={skill.name} className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-gray-900">{skill.name}</h4>
                      <Badge variant="outline" className="text-xs">{skill.category}</Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={skill.level} className="h-2" />
                      <p className="text-xs text-gray-600">Level {skill.level}</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Achievements */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.4 }}
            >
              <h3 className="text-lg text-gray-900 mb-4">Achievements</h3>
              <div className="grid grid-cols-3 md:grid-cols-6 gap-4">
                {achievements.map((badge) => (
                  <div
                    key={badge.name}
                    className="flex flex-col items-center p-3 rounded-xl bg-white border-2 shadow-sm hover:shadow-lg transition-all cursor-pointer"
                  >
                    <div
                      className={`h-12 w-12 rounded-full flex items-center justify-center bg-gradient-to-br ${badge.color} shadow-md mb-2`}
                    >
                      <badge.icon className="h-6 w-6 text-white" />
                    </div>
                    <p className="text-xs text-center text-gray-900">{badge.name}</p>
                  </div>
                ))}
              </div>
            </motion.div>

            <Separator className="my-6" />

            {/* Recent Projects */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.5 }}
            >
              <h3 className="text-lg text-gray-900 mb-4">Recent Projects</h3>
              <div className="space-y-3">
                {recentProjects.map((project) => (
                  <div
                    key={project.title}
                    className="p-4 rounded-lg border border-gray-200 bg-gray-50 hover:bg-white hover:shadow-md transition-all"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <h4 className="text-sm text-gray-900">{project.title}</h4>
                      <Badge
                        variant="outline"
                        className={
                          project.status === 'Completed'
                            ? 'border-green-600 text-green-600'
                            : 'border-blue-600 text-blue-600'
                        }
                      >
                        {project.status}
                      </Badge>
                    </div>
                    <div className="space-y-2">
                      <Progress value={project.progress} className="h-2" />
                      <p className="text-xs text-gray-600">{project.progress}% Complete</p>
                    </div>
                  </div>
                ))}
              </div>
            </motion.div>
          </div>
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
