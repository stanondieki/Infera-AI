import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from '../ui/dialog';
import { Button } from '../ui/button';
import { Badge } from '../ui/badge';
import { Card, CardContent } from '../ui/card';
import { PlayCircle, Clock, Star, Award, BookOpen, CheckCircle2 } from 'lucide-react';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Progress } from '../ui/progress';

interface Course {
  title: string;
  description: string;
  level: string;
  duration: string;
  xp: string;
  modules: string[];
  instructor: string;
  rating: number;
}

interface CourseDialogProps {
  courseTitle: string | null;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const courseData: { [key: string]: Course } = {
  'Advanced AI Training Techniques': {
    title: 'Advanced AI Training Techniques',
    description: 'Master advanced techniques for training and fine-tuning AI models. Learn best practices for data preparation, model evaluation, and optimization.',
    level: 'Intermediate',
    duration: '4 hours',
    xp: '+500 XP',
    modules: [
      'Introduction to AI Training Workflows',
      'Data Preparation and Cleaning',
      'Model Training Best Practices',
      'Evaluation and Quality Metrics',
      'Advanced Optimization Techniques',
    ],
    instructor: 'Dr. Sarah Chen',
    rating: 4.8,
  },
  'Image Annotation Mastery': {
    title: 'Image Annotation Mastery',
    description: 'Become an expert in image annotation for computer vision projects. Learn advanced techniques for object detection, segmentation, and classification.',
    level: 'Advanced',
    duration: '3 hours',
    xp: '+750 XP',
    modules: [
      'Fundamentals of Computer Vision',
      'Object Detection Techniques',
      'Semantic Segmentation',
      'Advanced Annotation Tools',
      'Quality Assurance in Annotation',
    ],
    instructor: 'Prof. Alex Kumar',
    rating: 4.9,
  },
  'Quality Assurance Excellence': {
    title: 'Quality Assurance Excellence',
    description: 'Learn how to maintain the highest quality standards in AI training tasks. Develop systematic approaches to QA and continuous improvement.',
    level: 'Beginner',
    duration: '2 hours',
    xp: '+300 XP',
    modules: [
      'Introduction to QA Principles',
      'Common Quality Issues',
      'Systematic Review Processes',
      'Tools for Quality Improvement',
      'Building a Quality Mindset',
    ],
    instructor: 'Maria Garcia',
    rating: 4.7,
  },
};

export function CourseDialog({ courseTitle, open, onOpenChange }: CourseDialogProps) {
  const course = courseTitle ? courseData[courseTitle] : null;

  if (!course) return null;

  const handleEnroll = () => {
    toast.success('Enrolled successfully!', {
      description: `You've been enrolled in "${course.title}"`,
    });
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl">{course.title}</DialogTitle>
          <DialogDescription>{course.description}</DialogDescription>
        </DialogHeader>

        <div className="space-y-6">
          {/* Course Info */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-purple-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Level</p>
                <p className="text-gray-900">{course.level}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Clock className="h-6 w-6 text-blue-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Duration</p>
                <p className="text-gray-900">{course.duration}</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Star className="h-6 w-6 text-yellow-600 mx-auto mb-2 fill-yellow-600" />
                <p className="text-sm text-gray-600">Rating</p>
                <p className="text-gray-900">{course.rating}/5.0</p>
              </CardContent>
            </Card>
            <Card>
              <CardContent className="p-4 text-center">
                <Award className="h-6 w-6 text-green-600 mx-auto mb-2" />
                <p className="text-sm text-gray-600">Earn</p>
                <p className="text-gray-900">{course.xp}</p>
              </CardContent>
            </Card>
          </div>

          {/* Instructor */}
          <Card className="bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3">
                <div className="h-12 w-12 rounded-full bg-gradient-to-br from-blue-600 to-purple-600 flex items-center justify-center text-white">
                  {course.instructor.charAt(0)}
                </div>
                <div>
                  <p className="text-sm text-gray-600">Instructor</p>
                  <p className="text-gray-900">{course.instructor}</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Course Modules */}
          <div>
            <h4 className="text-lg text-gray-900 mb-4 flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-blue-600" />
              Course Modules
            </h4>
            <div className="space-y-2">
              {course.modules.map((module, index) => (
                <motion.div
                  key={module}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.1 }}
                >
                  <Card className="hover:shadow-md transition-shadow">
                    <CardContent className="p-4">
                      <div className="flex items-center gap-3">
                        <div className="h-8 w-8 rounded-full bg-blue-100 flex items-center justify-center text-blue-600">
                          {index + 1}
                        </div>
                        <p className="text-sm text-gray-900 flex-grow">{module}</p>
                        <CheckCircle2 className="h-5 w-5 text-gray-300" />
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>

          {/* Enrollment Progress */}
          <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
            <CardContent className="p-4">
              <div className="flex items-center gap-3 mb-3">
                <CheckCircle2 className="h-5 w-5 text-green-600" />
                <div>
                  <p className="text-sm text-green-900">Ready to start learning?</p>
                  <p className="text-xs text-green-700">Enroll now and earn {course.xp} upon completion</p>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Action Buttons */}
          <div className="flex gap-2">
            <Button variant="outline" className="flex-1" onClick={() => onOpenChange(false)}>
              Maybe Later
            </Button>
            <Button
              className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600 gap-2"
              onClick={handleEnroll}
            >
              <PlayCircle className="h-4 w-4" />
              Enroll Now
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
