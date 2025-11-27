import { useState } from 'react';
import { User, Award, Clock, CheckCircle } from 'lucide-react';
import { Button } from '../ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '../ui/dialog';
import { Badge } from '../ui/badge';

interface TaskAssignmentDialogProps {
  open: boolean;
  onClose: () => void;
  task: any;
  users: Array<{
    _id: string;
    name: string;
    email: string;
    skills: string[];
    completedTasks: number;
    rating: number;
    isActive: boolean;
  }>;
  onTaskAssigned: (taskId: string, userId: string) => void;
}

export function TaskAssignmentDialog({ open, onClose, task, users, onTaskAssigned }: TaskAssignmentDialogProps) {
  const [selectedUserId, setSelectedUserId] = useState<string>('');
  const [loading, setLoading] = useState(false);

  if (!task) return null;

  const handleAssign = async () => {
    if (!selectedUserId) return;

    try {
      setLoading(true);
      const token = localStorage.getItem('token');
      
      const response = await fetch(`/api/tasks/${task._id}/assign`, {
        method: 'PUT',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`
        },
        body: JSON.stringify({ assignedTo: selectedUserId })
      });

      if (response.ok) {
        onTaskAssigned(task._id, selectedUserId);
      } else {
        console.error('Assignment failed');
      }
    } catch (error) {
      console.error('Error assigning task:', error);
    } finally {
      setLoading(false);
    }
  };

  // Filter and rank users based on task requirements
  const getRankedUsers = () => {
    const taskSkills = task.taskData?.requiredSkills || [];
    
    return users
      .filter(user => user.isActive)
      .map(user => {
        // Calculate skill match score
        const skillMatches = user.skills.filter(skill => 
          taskSkills.some((taskSkill: string) => 
            skill.toLowerCase().includes(taskSkill.toLowerCase()) ||
            taskSkill.toLowerCase().includes(skill.toLowerCase())
          )
        ).length;
        
        const skillScore = taskSkills.length > 0 ? (skillMatches / taskSkills.length) * 100 : 50;
        
        // Calculate experience score based on completed tasks and rating
        const experienceScore = Math.min(user.completedTasks * 2, 50) + (user.rating * 10);
        
        // Overall compatibility score
        const compatibilityScore = (skillScore * 0.6) + (experienceScore * 0.4);
        
        return {
          ...user,
          skillMatches,
          skillScore,
          experienceScore,
          compatibilityScore
        };
      })
      .sort((a, b) => b.compatibilityScore - a.compatibilityScore);
  };

  const rankedUsers = getRankedUsers();

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>Assign Task to User</DialogTitle>
        </DialogHeader>

        <div className="space-y-4">
          {/* Task Summary */}
          <div className="bg-blue-50 p-4 rounded-lg">
            <h4 className="font-semibold text-blue-900 mb-2">{task.title}</h4>
            <div className="flex items-center gap-4 text-sm text-blue-800">
              <span>Category: {task.category?.replace('_', ' ')}</span>
              <span>Rate: ${task.hourlyRate}/hr</span>
              <span>Est: {task.estimatedHours}h</span>
            </div>
            {task.taskData?.requiredSkills && task.taskData.requiredSkills.length > 0 && (
              <div className="mt-2">
                <span className="text-sm font-medium text-blue-900">Required Skills: </span>
                <div className="flex flex-wrap gap-1 mt-1">
                  {task.taskData.requiredSkills.map((skill: string, index: number) => (
                    <Badge key={index} variant="secondary" className="text-xs">
                      {skill}
                    </Badge>
                  ))}
                </div>
              </div>
            )}
          </div>

          {/* User Selection */}
          <div>
            <h4 className="font-medium text-gray-900 mb-3">Select User (Ranked by Compatibility)</h4>
            <div className="space-y-3 max-h-96 overflow-y-auto">
              {rankedUsers.map((user) => (
                <div
                  key={user._id}
                  className={`p-4 border rounded-lg cursor-pointer transition-colors ${
                    selectedUserId === user._id
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-gray-300'
                  }`}
                  onClick={() => setSelectedUserId(user._id)}
                >
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <div className="flex items-center gap-3 mb-2">
                        <div className="w-8 h-8 bg-gray-200 rounded-full flex items-center justify-center">
                          <User className="w-4 h-4 text-gray-600" />
                        </div>
                        <div>
                          <h5 className="font-medium text-gray-900">{user.name}</h5>
                          <p className="text-sm text-gray-600">{user.email}</p>
                        </div>
                      </div>

                      <div className="flex items-center gap-4 text-sm text-gray-600 mb-2">
                        <div className="flex items-center gap-1">
                          <CheckCircle className="w-4 h-4" />
                          <span>{user.completedTasks} tasks</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Award className="w-4 h-4" />
                          <span>{user.rating}/5 rating</span>
                        </div>
                        <div className="flex items-center gap-1">
                          <Clock className="w-4 h-4" />
                          <span className="text-green-600">Active</span>
                        </div>
                      </div>

                      {/* Skill matches */}
                      {user.skillMatches > 0 && (
                        <div className="mb-2">
                          <span className="text-xs font-medium text-gray-700">
                            Matching Skills ({user.skillMatches}):
                          </span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.skills
                              .filter(skill => 
                                task.taskData?.requiredSkills?.some((taskSkill: string) => 
                                  skill.toLowerCase().includes(taskSkill.toLowerCase()) ||
                                  taskSkill.toLowerCase().includes(skill.toLowerCase())
                                )
                              )
                              .map((skill, index) => (
                                <Badge key={index} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                  {skill}
                                </Badge>
                              ))
                            }
                          </div>
                        </div>
                      )}

                      {/* User's other skills */}
                      {user.skills.length > user.skillMatches && (
                        <div>
                          <span className="text-xs font-medium text-gray-700">Other Skills:</span>
                          <div className="flex flex-wrap gap-1 mt-1">
                            {user.skills
                              .filter(skill => 
                                !task.taskData?.requiredSkills?.some((taskSkill: string) => 
                                  skill.toLowerCase().includes(taskSkill.toLowerCase()) ||
                                  taskSkill.toLowerCase().includes(skill.toLowerCase())
                                )
                              )
                              .slice(0, 5)
                              .map((skill, index) => (
                                <Badge key={index} variant="outline" className="text-xs">
                                  {skill}
                                </Badge>
                              ))
                            }
                            {user.skills.length > user.skillMatches + 5 && (
                              <span className="text-xs text-gray-500">
                                +{user.skills.length - user.skillMatches - 5} more
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>

                    <div className="flex flex-col items-end gap-1 ml-4">
                      {/* Compatibility Score */}
                      <div className="text-right">
                        <div className="text-lg font-bold text-green-600">
                          {Math.round(user.compatibilityScore)}%
                        </div>
                        <div className="text-xs text-gray-500">Match</div>
                      </div>
                      
                      {/* Compatibility breakdown */}
                      <div className="text-xs text-gray-500 text-right">
                        <div>Skills: {Math.round(user.skillScore)}%</div>
                        <div>Experience: {Math.round(user.experienceScore)}%</div>
                      </div>
                    </div>
                  </div>

                  {/* Selection indicator */}
                  {selectedUserId === user._id && (
                    <div className="mt-3 pt-3 border-t border-blue-200">
                      <div className="flex items-center gap-2 text-sm text-blue-700">
                        <CheckCircle className="w-4 h-4" />
                        <span>Selected for assignment</span>
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>

            {rankedUsers.length === 0 && (
              <div className="text-center py-8 text-gray-500">
                <User className="w-12 h-12 mx-auto mb-4 text-gray-300" />
                <p>No active users available for assignment</p>
              </div>
            )}
          </div>

          {/* Action Buttons */}
          <div className="flex items-center justify-end gap-3 pt-4 border-t">
            <Button variant="outline" onClick={onClose}>
              Cancel
            </Button>
            <Button
              onClick={handleAssign}
              disabled={!selectedUserId || loading}
            >
              {loading ? 'Assigning...' : 'Assign Task'}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}