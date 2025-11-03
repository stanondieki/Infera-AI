import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Trophy, Users, Calendar, Target, TrendingUp, Zap, Award } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';

interface Challenge {
  name: string;
  description: string;
  prize: string;
  participants: number;
  daysLeft: number;
  requirements: string[];
  currentProgress: number;
  targetProgress: number;
  difficulty: string;
}

interface ChallengeDialogProps {
  challengeName: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const challengeData: { [key: string]: Challenge } = {
  'November Sprint Challenge': {
    name: 'November Sprint Challenge',
    description: 'Complete as many high-quality tasks as possible this month. Top performers win from a $500 prize pool!',
    prize: '$500 Prize Pool',
    participants: 245,
    daysLeft: 15,
    requirements: [
      'Complete at least 50 tasks',
      'Maintain 95%+ quality score',
      'Submit all tasks on time',
      'Participate in at least 3 different project types',
    ],
    currentProgress: 32,
    targetProgress: 50,
    difficulty: 'Medium',
  },
  'Quality Champion': {
    name: 'Quality Champion',
    description: 'Achieve perfect quality scores across all your submissions. Earn the prestigious Premium Badge!',
    prize: 'Premium Badge',
    participants: 189,
    daysLeft: 8,
    requirements: [
      'Maintain 98%+ quality score',
      'Complete at least 30 tasks',
      'Zero revision requests',
      'Receive positive feedback from reviewers',
    ],
    currentProgress: 21,
    targetProgress: 30,
    difficulty: 'Hard',
  },
  'Speed Master': {
    name: 'Speed Master',
    description: 'Complete tasks quickly while maintaining quality. The fastest contributors win a $250 bonus!',
    prize: '$250 Bonus',
    participants: 312,
    daysLeft: 22,
    requirements: [
      'Complete tasks 20% faster than average',
      'Maintain quality score above 90%',
      'Complete at least 40 tasks',
      'Work on diverse project types',
    ],
    currentProgress: 15,
    targetProgress: 40,
    difficulty: 'Medium',
  },
};

export function ChallengeDialog({ challengeName, open, onOpenChange }: ChallengeDialogProps) {
  const challenge = challengeName ? challengeData[challengeName] : null;

  if (!challenge) return null;

  const progressPercentage = Math.round((challenge.currentProgress / challenge.targetProgress) * 100);

  const handleJoin = () => {
    toast.success('Joined challenge!', {
      description: `You're now competing in "${challenge.name}"`,
    });
    onOpenChange(false);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'Easy':
        return 'from-green-500 to-emerald-500';
      case 'Medium':
        return 'from-yellow-500 to-orange-500';
      case 'Hard':
        return 'from-red-500 to-pink-500';
      default:
        return 'from-gray-500 to-slate-500';
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-2xl">
            <Trophy className="h-6 w-6 text-yellow-600" />
            {challenge.name}
          </DialogTitle>
          <DialogDescription>{challenge.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Challenge Stats */}
          <div className="grid grid-cols-3 gap-4">
            <Card className="bg-gradient-to-br from-yellow-50 to-orange-50 border-yellow-200">
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-yellow-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Prize</p>
                <p className="text-gray-900">{challenge.prize}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Users className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Participants</p>
                <p className="text-gray-900">{challenge.participants}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Calendar className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Days Left</p>
                <p className="text-gray-900">{challenge.daysLeft}</p>
              </CardContent>
            </Card>
          </div>

          {/* Difficulty Badge */}
          <div className="flex justify-center">
            <Badge className={`bg-gradient-to-r ${getDifficultyColor(challenge.difficulty)} text-white text-lg px-6 py-2`}>
              {challenge.difficulty} Difficulty
            </Badge>
          </div>

          {/* Your Progress */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <h4 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
                <TrendingUp className="h-5 w-5 text-blue-600" />
                Your Progress
              </h4>
              <div className="space-y-3">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Tasks Completed</span>
                  <span className="text-gray-900">
                    {challenge.currentProgress} / {challenge.targetProgress}
                  </span>
                </div>
                <div className="relative">
                  <Progress value={progressPercentage} className="h-3" />
                  <motion.div
                    className="absolute top-0 left-0 h-3 rounded-full bg-gradient-to-r from-blue-600 to-purple-600"
                    initial={{ width: 0 }}
                    animate={{ width: `${progressPercentage}%` }}
                    transition={{ duration: 1, delay: 0.2 }}
                  />
                </div>
                <p className="text-xs text-gray-600 text-center">
                  {progressPercentage}% complete • {challenge.targetProgress - challenge.currentProgress} more to go!
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Requirements */}
          <div>
            <h4 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <Target className="h-5 w-5 text-blue-600" />
              Challenge Requirements
            </h4>
            <div className="space-y-2">
              {challenge.requirements.map((req, index) => (
                <motion.div
                  key={req}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-start gap-3">
                        <div className="h-6 w-6 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 text-xs mt-0.5">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-900 flex-grow">{req}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Motivation */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            className="p-4 bg-gradient-to-r from-yellow-50 to-orange-50 border border-yellow-200 rounded-lg"
          >
            <div className="flex items-start gap-2">
              <Zap className="h-5 w-5 text-yellow-600 mt-0.5" />
              <div>
                <p className="text-sm text-yellow-900">You're doing great!</p>
                <p className="text-xs text-yellow-700 mt-1">
                  You're {progressPercentage}% of the way there. Keep up the excellent work to win {challenge.prize}!
                </p>
              </div>
            </div>
          </motion.div>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Close
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-yellow-500 to-orange-500 gap-2"
              onClick={handleJoin}
            >
              <Trophy className="h-4 w-4" />
              Join Challenge
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
