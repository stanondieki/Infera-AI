import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Progress } from '../ui/progress';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { Target, TrendingUp, Calendar, Gift, CheckCircle2, Clock } from 'lucide-react';
import { motion } from 'framer-motion';

interface Milestone {
  id: string;
  title: string;
  description: string;
  progress: number;
  target: number;
  reward: string;
  completed: boolean;
}

interface MilestoneDialogProps {
  milestone: Milestone | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function MilestoneDialog({ milestone, open, onOpenChange }: MilestoneDialogProps) {
  if (!milestone) return null;

  const progressPercentage = Math.round((milestone.progress / milestone.target) * 100);
  const remaining = milestone.target - milestone.progress;
  const isNearlyComplete = progressPercentage >= 80;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-lg">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2">
            <Target className="h-5 w-5 text-blue-600" />
            {milestone.title}
          </DialogTitle>
          <DialogDescription>{milestone.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Progress Overview */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-6">
              <div className="text-center mb-4">
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: 'spring' }}
                  className="inline-flex items-center justify-center w-24 h-24 rounded-full bg-white shadow-lg mb-3"
                >
                  <div className="text-center">
                    <p className="text-3xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                      {progressPercentage}%
                    </p>
                    <p className="text-xs text-gray-600">Complete</p>
                  </div>
                </motion.div>
              </div>

              <div className="space-y-2">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-gray-700">Progress</span>
                  <span className="text-gray-900">
                    {milestone.progress.toLocaleString()} / {milestone.target.toLocaleString()}
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
              </div>
            </CardContent>
          </Card>

          {/* Statistics */}
          <div className="grid grid-cols-2 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <TrendingUp className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-2xl text-gray-900">{milestone.progress.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Completed</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-orange-600 mx-auto mb-2" />
                <p className="text-2xl text-gray-900">{remaining.toLocaleString()}</p>
                <p className="text-xs text-gray-600">Remaining</p>
              </CardContent>
            </Card>
          </div>

          {/* Reward */}
          <Card className="bg-gradient-to-r from-yellow-50 to-orange-50 border-yellow-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-yellow-500 to-orange-500 flex items-center justify-center">
                  <Gift className="h-6 w-6 text-white" />
                </div>
                <div>
                  <p className="text-sm text-gray-600">Reward</p>
                  <p className="text-lg text-gray-900">{milestone.reward}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Tips */}
          {isNearlyComplete && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className="p-4 bg-green-50 border border-green-200 rounded-lg"
            >
              <div className="flex items-start gap-2">
                <CheckCircle2 className="h-5 w-5 text-green-600 mt-0.5" />
                <div>
                  <p className="text-sm text-green-900">Almost there!</p>
                  <p className="text-xs text-green-700 mt-1">
                    You're {remaining} away from completing this milestone and earning your reward!
                  </p>
                </div>
              </div>
            </motion.div>
          )}

          <Button
            className="w-full bg-gradient-to-r from-blue-600 to-purple-600"
            onClick={() => onOpenChange(false)}
          >
            {isNearlyComplete ? 'Keep Going!' : 'Got It'}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  );
}
