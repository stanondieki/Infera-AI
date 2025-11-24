'use client';

import React, { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from '@/components/ui/dialog';
import { API_CONFIG } from '@/utils/api';

interface Task {
  _id: string;
  title: string;
  description: string;
  category: string;
  difficulty: string;
  estimatedTime: number;
  reward: number;
  status: 'AVAILABLE' | 'ASSIGNED' | 'IN_PROGRESS' | 'SUBMITTED' | 'APPROVED' | 'REJECTED';
  deadline?: string;
  assignedTo?: string;
  projectId: {
    title: string;
    description: string;
  };
}

interface Project {
  _id: string;
  title: string;
  description: string;
  category: string;
  status: 'PLANNING' | 'ACTIVE' | 'COMPLETED' | 'PAUSED';
  totalBudget: number;
  totalTasks: number;
  completedTasks: number;
  createdBy: string;
  deadline?: string;
}

export default function TaskManagement() {
  const [tasks, setTasks] = useState<Task[]>([]);
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('my-tasks');
  const [isCreateProjectOpen, setIsCreateProjectOpen] = useState(false);
  const [isTemplateDialogOpen, setIsTemplateDialogOpen] = useState(false);
  const [templates, setTemplates] = useState<any[]>([]);
  const [categories, setCategories] = useState<any>({});
  
  // Simple toast replacement
  const toast = ({ title, description, variant }: { title: string; description: string; variant?: string }) => {
    console.log(`${variant === 'destructive' ? 'Error' : 'Info'}: ${title} - ${description}`);
    alert(`${title}: ${description}`);
  };

  // New project form
  const [newProject, setNewProject] = useState({
    title: '',
    description: '',
    category: 'AI_TRAINING',
    totalBudget: 0,
    taskCount: 1,
    difficulty: 'BEGINNER',
    estimatedTime: 30,
    reward: 5,
    deadline: '',
    instructions: ''
  });

  const fetchMyTasks = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access tasks.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects/my-tasks`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTasks(data.tasks || []);
      } else if (response.status === 401) {
        // Token might be expired or invalid
        localStorage.removeItem('token');
        toast({
          title: "Session Expired", 
          description: "Please sign in again to access tasks.",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast({
          title: "Error",
          description: errorData.message || "Failed to fetch tasks.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching tasks:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchProjects = async () => {
    setLoading(true);
    try {
      const token = localStorage.getItem('token');
      
      if (!token) {
        toast({
          title: "Authentication Required",
          description: "Please sign in to access projects.",
          variant: "destructive",
        });
        setLoading(false);
        return;
      }

      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects`, {
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
      });

      if (response.ok) {
        const data = await response.json();
        setProjects(data.projects || []);
      } else if (response.status === 401) {
        localStorage.removeItem('token');
        toast({
          title: "Session Expired",
          description: "Please sign in again to access projects.",
          variant: "destructive",
        });
      } else {
        const errorData = await response.json().catch(() => ({ message: 'Unknown error' }));
        toast({
          title: "Error",
          description: errorData.message || "Failed to fetch projects.",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error fetching projects:', error);
      toast({
        title: "Error",
        description: "Failed to connect to server. Please try again.",
        variant: "destructive",
      });
    }
    setLoading(false);
  };

  const fetchTemplates = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects/templates`, {
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setTemplates(data.templates || []);
        setCategories(data.categories || {});
      }
    } catch (error) {
      console.error('Error fetching templates:', error);
    }
  };

  const seedRealisticProjects = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects/seed`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ count: 5 }),
      });

      if (response.ok) {
        const data = await response.json();
        toast({
          title: "Success",
          description: `${data.projects.length} realistic projects created!`,
        });
        fetchProjects();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to seed projects",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error seeding projects:', error);
      toast({
        title: "Error",
        description: "Failed to seed realistic projects. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createProjectFromTemplate = async (templateIndex: number) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects/from-template`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ templateIndex }),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Realistic project created from template!",
        });
        setIsTemplateDialogOpen(false);
        fetchProjects();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create project from template",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating project from template:', error);
      toast({
        title: "Error",
        description: "Failed to create project from template. Please try again.",
        variant: "destructive",
      });
    }
  };

  const createProject = async () => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(newProject),
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Project created successfully!",
        });
        setIsCreateProjectOpen(false);
        setNewProject({
          title: '',
          description: '',
          category: 'AI_TRAINING',
          totalBudget: 0,
          taskCount: 1,
          difficulty: 'BEGINNER',
          estimatedTime: 30,
          reward: 5,
          deadline: '',
          instructions: ''
        });
        fetchProjects();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to create project",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error creating project:', error);
      toast({
        title: "Error",
        description: "Failed to create project. Please try again.",
        variant: "destructive",
      });
    }
  };

  const startTask = async (taskId: string) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`${API_CONFIG.BASE_URL.replace('/api', '')}/api/task-projects/tasks/${taskId}/start`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${token}`,
        },
      });

      if (response.ok) {
        toast({
          title: "Success",
          description: "Task started successfully!",
        });
        fetchMyTasks();
      } else {
        const errorData = await response.json();
        toast({
          title: "Error",
          description: errorData.message || "Failed to start task",
          variant: "destructive",
        });
      }
    } catch (error) {
      console.error('Error starting task:', error);
      toast({
        title: "Error",
        description: "Failed to start task. Please try again.",
        variant: "destructive",
      });
    }
  };

  useEffect(() => {
    if (activeTab === 'my-tasks') {
      fetchMyTasks();
    } else if (activeTab === 'projects') {
      fetchProjects();
    }
  }, [activeTab]);

  const getStatusColor = (status: string) => {
    const colors = {
      'AVAILABLE': 'bg-green-100 text-green-800',
      'ASSIGNED': 'bg-blue-100 text-blue-800',
      'IN_PROGRESS': 'bg-yellow-100 text-yellow-800',
      'SUBMITTED': 'bg-purple-100 text-purple-800',
      'APPROVED': 'bg-green-100 text-green-800',
      'REJECTED': 'bg-red-100 text-red-800',
      'PLANNING': 'bg-gray-100 text-gray-800',
      'ACTIVE': 'bg-blue-100 text-blue-800',
      'COMPLETED': 'bg-green-100 text-green-800',
      'PAUSED': 'bg-orange-100 text-orange-800',
    };
    return colors[status as keyof typeof colors] || 'bg-gray-100 text-gray-800';
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <h1 className="text-3xl font-bold">Task Management</h1>
        <div className="flex gap-2">
          <Button variant="outline" onClick={seedRealisticProjects}>
            Seed Realistic Projects
          </Button>
          <Dialog open={isTemplateDialogOpen} onOpenChange={setIsTemplateDialogOpen}>
            <DialogTrigger asChild>
              <Button variant="outline" onClick={fetchTemplates}>Use Template</Button>
            </DialogTrigger>
            <DialogContent className="max-w-4xl">
              <DialogHeader>
                <DialogTitle>Choose Project Template</DialogTitle>
                <DialogDescription>
                  Select from realistic AI training project templates based on industry standards.
                </DialogDescription>
              </DialogHeader>
              
              <div className="grid gap-4 py-4 max-h-96 overflow-y-auto">
                {templates.map((template, index) => (
                  <Card key={index} className="cursor-pointer hover:bg-gray-50" onClick={() => createProjectFromTemplate(index)}>
                    <CardHeader>
                      <div className="flex justify-between items-start">
                        <div>
                          <CardTitle className="text-lg">{template.name}</CardTitle>
                          <CardDescription>{template.description}</CardDescription>
                        </div>
                        <Badge className={getStatusColor(template.category)}>
                          {template.category.replace('_', ' ')}
                        </Badge>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                        <div>
                          <span className="text-gray-500">Difficulty:</span>
                          <div className="font-medium">{template.difficulty}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Est. Time:</span>
                          <div className="font-medium">{template.estimatedTime} min</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Reward:</span>
                          <div className="font-medium">${template.rewardRange.min}-${template.rewardRange.max}</div>
                        </div>
                        <div>
                          <span className="text-gray-500">Skills:</span>
                          <div className="font-medium text-xs">{template.requiredSkills.slice(0, 2).join(', ')}</div>
                        </div>
                      </div>
                      <div className="flex flex-wrap gap-1 mt-2">
                        {template.tags.map((tag: string, tagIndex: number) => (
                          <Badge key={tagIndex} variant="outline" className="text-xs">
                            {tag}
                          </Badge>
                        ))}
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </DialogContent>
          </Dialog>
          <Dialog open={isCreateProjectOpen} onOpenChange={setIsCreateProjectOpen}>
            <DialogTrigger asChild>
              <Button>Create Custom Project</Button>
            </DialogTrigger>
          <DialogContent className="max-w-2xl">
            <DialogHeader>
              <DialogTitle>Create New Project</DialogTitle>
              <DialogDescription>
                Create a new project with tasks that will be automatically assigned to qualified users.
              </DialogDescription>
            </DialogHeader>
            
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="title" className="text-right">Title</Label>
                <Input
                  id="title"
                  value={newProject.title}
                  onChange={(e) => setNewProject({...newProject, title: e.target.value})}
                  className="col-span-3"
                  placeholder="Project title"
                />
              </div>
              
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="description" className="text-right">Description</Label>
                <Textarea
                  id="description"
                  value={newProject.description}
                  onChange={(e) => setNewProject({...newProject, description: e.target.value})}
                  className="col-span-3"
                  placeholder="Project description"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="category" className="text-right">Category</Label>
                <Select value={newProject.category} onValueChange={(value) => setNewProject({...newProject, category: value})}>
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="AI_TRAINING">AI Training</SelectItem>
                    <SelectItem value="DATA_ANNOTATION">Data Annotation</SelectItem>
                    <SelectItem value="CONTENT_MODERATION">Content Moderation</SelectItem>
                    <SelectItem value="MODEL_EVALUATION">Model Evaluation</SelectItem>
                    <SelectItem value="TRANSCRIPTION">Transcription</SelectItem>
                    <SelectItem value="TRANSLATION">Translation</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="taskCount" className="text-right">Tasks Count</Label>
                <Input
                  id="taskCount"
                  type="number"
                  value={newProject.taskCount}
                  onChange={(e) => setNewProject({...newProject, taskCount: parseInt(e.target.value) || 1})}
                  className="col-span-3"
                  min="1"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="reward" className="text-right">Reward per Task ($)</Label>
                <Input
                  id="reward"
                  type="number"
                  value={newProject.reward}
                  onChange={(e) => setNewProject({...newProject, reward: parseFloat(e.target.value) || 0})}
                  className="col-span-3"
                  step="0.01"
                  min="0"
                />
              </div>

              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="instructions" className="text-right">Instructions</Label>
                <Textarea
                  id="instructions"
                  value={newProject.instructions}
                  onChange={(e) => setNewProject({...newProject, instructions: e.target.value})}
                  className="col-span-3"
                  placeholder="Detailed task instructions"
                />
              </div>
            </div>

            <DialogFooter>
              <Button onClick={createProject}>Create Project</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs value={activeTab} onValueChange={setActiveTab}>
        <TabsList>
          <TabsTrigger value="my-tasks">My Tasks</TabsTrigger>
          <TabsTrigger value="projects">All Projects</TabsTrigger>
        </TabsList>

        <TabsContent value="my-tasks" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : tasks.length === 0 ? (
            <Card>
              <CardContent className="py-8 text-center">
                <p className="text-gray-500">No tasks assigned yet. Tasks will be automatically assigned based on your skills and performance.</p>
              </CardContent>
            </Card>
          ) : (
            <div className="grid gap-4">
              {tasks.map((task) => (
                <Card key={task._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle className="text-lg">{task.title}</CardTitle>
                        <CardDescription>{task.projectId?.title}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(task.status)}>
                        {task.status.replace('_', ' ')}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-4">{task.description}</p>
                    <div className="flex justify-between items-center">
                      <div className="flex gap-4 text-sm text-gray-500">
                        <span>Reward: ${task.reward}</span>
                        <span>Est. Time: {task.estimatedTime} min</span>
                        <span>Difficulty: {task.difficulty}</span>
                      </div>
                      {task.status === 'ASSIGNED' && (
                        <Button onClick={() => startTask(task._id)}>Start Task</Button>
                      )}
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>

        <TabsContent value="projects" className="space-y-4">
          {loading ? (
            <div className="flex justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
            </div>
          ) : (
            <div className="grid gap-4">
              {projects.map((project) => (
                <Card key={project._id}>
                  <CardHeader>
                    <div className="flex justify-between items-start">
                      <div>
                        <CardTitle>{project.title}</CardTitle>
                        <CardDescription>{project.description}</CardDescription>
                      </div>
                      <Badge className={getStatusColor(project.status)}>
                        {project.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-sm">
                      <div>
                        <span className="text-gray-500">Budget:</span>
                        <div className="font-medium">${project.totalBudget}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Tasks:</span>
                        <div className="font-medium">{project.completedTasks}/{project.totalTasks}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Category:</span>
                        <div className="font-medium">{project.category.replace('_', ' ')}</div>
                      </div>
                      <div>
                        <span className="text-gray-500">Progress:</span>
                        <div className="font-medium">{Math.round((project.completedTasks / project.totalTasks) * 100)}%</div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          )}
        </TabsContent>
      </Tabs>
      </div>
    </div>
  );
}