// Task Assignment Service - Intelligent Task Distribution
import { Project, ProjectTask, TaskAssignment } from '../models/Project';
import User, { IUser } from '../models/User';
import mongoose from 'mongoose';
import { REALISTIC_PROJECT_TEMPLATES, generateProjectName, PROJECT_CATEGORIES } from '../data/projectTemplates';

export class TaskAssignmentService {
  
  /**
   * Create a realistic project from templates
   */
  async createRealisticProject(templateIndex?: number, customData?: any) {
    const template = templateIndex !== undefined 
      ? REALISTIC_PROJECT_TEMPLATES[templateIndex]
      : REALISTIC_PROJECT_TEMPLATES[Math.floor(Math.random() * REALISTIC_PROJECT_TEMPLATES.length)];
    
    const taskCount = customData?.taskCount || Math.floor(Math.random() * 50) + 50; // 50-100 tasks
    const rewardPerTask = customData?.reward || (template.rewardRange.min + Math.random() * (template.rewardRange.max - template.rewardRange.min));
    const estimatedHours = (template.estimatedTime * taskCount) / 60; // Convert minutes to hours
    
    const projectData = {
      title: customData?.title || template.name,
      description: customData?.description || template.description,
      category: customData?.category || template.category,
      totalBudget: customData?.totalBudget || (rewardPerTask * taskCount), 
      paymentPerTask: rewardPerTask,
      estimatedHours: estimatedHours,
      deadline: customData?.deadline || new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // 30 days from now
      totalTasks: taskCount, // This is what createProject expects
      difficulty: customData?.difficulty || template.difficulty,
      instructions: customData?.instructions || template.instructions,
      requiredSkills: template.requiredSkills.map((skill: string) => ({
        skill: skill,
        level: template.difficulty
      })),
      tags: template.tags
    };

    return this.createProject(projectData, customData?.createdBy);
  }

  /**
   * Generate multiple realistic projects for platform seeding
   */
  // Allow passing createdBy so seeded projects have a valid owner
  async seedRealisticProjects(count: number = 5, createdBy?: string) {
    console.log(`🌱 Starting to seed ${count} realistic projects...`);
    const projects = [];
    for (let i = 0; i < count; i++) {
      try {
        console.log(`📝 Creating project ${i + 1}/${count}...`);
        // Pass createdBy into createRealisticProject so required "createdBy" is satisfied
        const project = await this.createRealisticProject(undefined, { createdBy });
        projects.push(project);
        console.log(`✅ Project ${i + 1} created successfully: ${project.title}`);

        // Add small delay to avoid overwhelming the database
        await new Promise(resolve => setTimeout(resolve, 100));
      } catch (error: any) {
        console.error(`❌ Failed to create project ${i + 1}:`, error);
        if (error instanceof Error) {
          console.error(`❌ Error details:`, error.message);
          console.error(`❌ Stack trace:`, error.stack);
        }
      }
    }
    console.log(`🎉 Seeding completed. Created ${projects.length} projects.`);
    return projects;
  }
  
  /**
   * Create a new project and generate tasks
   */
  async createProject(projectData: any, createdBy: string) {
    console.log('🎯 Creating project with data:', JSON.stringify(projectData, null, 2));
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Create the project
      const project = new Project({
        ...projectData,
        createdBy,
        status: 'DRAFT',
      });
      
      console.log('💾 Saving project to database...');
      await project.save({ session });
      console.log('✅ Project saved successfully');
      
      // Generate initial quality control tasks (10% of total)
      console.log('🎲 Generating QC tasks...');
      await this.generateQualityControlTasks(project._id.toString(), projectData.totalTasks, session);
      console.log('✅ QC tasks generated');
      
      await session.commitTransaction();
      console.log('✅ Transaction committed');
      return project;
    } catch (error: any) {
      console.error('❌ Error in createProject:', error);
      if (error instanceof Error) {
        console.error('❌ Error message:', error.message);
        console.error('❌ Error stack:', error.stack);
      }
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  /**
   * Generate tasks for a project (batch creation)
   */
  async generateTasks(projectId: string, taskDataArray: any[], batchSize: number = 100) {
    const project = await Project.findById(projectId);
    if (!project) throw new Error('Project not found');
    
    const tasks = [];
    
    for (let i = 0; i < taskDataArray.length; i += batchSize) {
      const batch = taskDataArray.slice(i, i + batchSize);
      
      const batchTasks = batch.map((taskData, index) => ({
        projectId,
        taskNumber: project.totalTasks + i + index + 1,
        batchId: `batch_${Date.now()}_${Math.floor(i / batchSize)}`,
        data: taskData,
        instructions: project.instructions,
        timeLimit: this.calculateTimeLimit(project.category),
        status: 'PENDING',
      }));
      
      const createdTasks = await ProjectTask.insertMany(batchTasks);
      tasks.push(...createdTasks);
    }
    
    // Update project task count
    await Project.findByIdAndUpdate(projectId, {
      $inc: { totalTasks: taskDataArray.length }
    });
    
    // Start auto-assignment if enabled
    if (project.assignmentMethod === 'AUTO') {
      await this.autoAssignTasks(projectId);
    }
    
    return tasks;
  }
  
  /**
   * Intelligent auto-assignment of tasks to qualified users
   */
  async autoAssignTasks(projectId: string) {
    const project = await Project.findById(projectId);
    if (!project || project.status !== 'ACTIVE') return;
    
    // Find qualified and available users
    const qualifiedUsers = await this.findQualifiedUsers(project);
    
    // Get pending tasks
    const pendingTasks = await ProjectTask.find({
      projectId,
      status: 'PENDING',
    }).limit(project.maxConcurrentWorkers * project.tasksPerBatch);
    
    // Smart assignment algorithm
    await this.distributeTasks(pendingTasks, qualifiedUsers, project);
  }
  
  /**
   * Find users qualified for a project
   */
  async findQualifiedUsers(project: any) {
    const query: any = {
      role: 'user',
      isVerified: true,
      'profile.isActive': true,
    };
    
    // Filter by required skills
    if (project.requiredSkills && project.requiredSkills.length > 0) {
      query['skills.name'] = { 
        $in: project.requiredSkills.map((rs: any) => rs.skill) 
      };
    }
    
    // Filter by qualifications
    if (project.qualifications && project.qualifications.length > 0) {
      query.qualifications = { 
        $in: project.qualifications 
      };
    }
    
    const users = await User.find(query)
      .populate('skills')
      .populate('statistics');
    
    // Filter by performance metrics
    return users.filter((user: IUser) => {
      // Check accuracy requirements
      if (user.statistics && user.statistics.overallAccuracy < project.minimumAccuracy) {
        return false;
      }
      
      // Check if user is already at max tasks for this project
      const currentAssignment = user.activeAssignments?.find(
        (a: any) => a.projectId.toString() === project._id.toString()
      );
      
      if (currentAssignment && currentAssignment.tasksCompleted >= project.maxTasksPerUser) {
        return false;
      }
      
      return true;
    });
  }
  
  /**
   * Distribute tasks among qualified users using weighted algorithm
   */
  async distributeTasks(tasks: any[], users: any[], project: any) {
    if (!tasks.length || !users.length) return;
    
    // Calculate user weights based on performance, availability, and preferences
    const userWeights = users.map(user => ({
      user,
      weight: this.calculateUserWeight(user, project),
    })).sort((a, b) => b.weight - a.weight);
    
    // Distribute tasks
    for (const task of tasks) {
      // Add quality control tasks randomly (10% chance)
      if (Math.random() < 0.1) {
        task.isQualityCheck = true;
        const qcSample = project.qualityControlSamples[
          Math.floor(Math.random() * project.qualityControlSamples.length)
        ];
        if (qcSample) {
          task.data = qcSample.taskData;
          task.expectedAnswer = qcSample.correctAnswer;
        }
      }
      
      // Find best available user
      const selectedUser = this.selectUserForTask(userWeights, project);
      
      if (selectedUser) {
        await this.assignTaskToUser(task._id, selectedUser.user._id, project);
      }
    }
  }
  
  /**
   * Calculate user weight for task assignment
   */
  calculateUserWeight(user: any, project: any): number {
    let weight = 100; // Base weight
    
    // Performance bonus
    if (user.statistics?.overallAccuracy > 95) weight += 20;
    else if (user.statistics?.overallAccuracy > 90) weight += 10;
    
    // Experience bonus
    if (user.statistics?.totalTasksCompleted > 1000) weight += 15;
    else if (user.statistics?.totalTasksCompleted > 100) weight += 8;
    
    // Skill match bonus
    const matchingSkills = user.skills?.filter((skill: any) => 
      project.requiredSkills.some((rs: any) => rs.skill === skill.name)
    );
    weight += (matchingSkills?.length || 0) * 5;
    
    // Availability penalty
    const activeTasksCount = user.activeTasks?.length || 0;
    if (activeTasksCount > 10) weight -= 20;
    else if (activeTasksCount > 5) weight -= 10;
    
    // Recent activity bonus
    const lastActiveDate = new Date(user.lastActiveAt);
    const daysSinceActive = (Date.now() - lastActiveDate.getTime()) / (1000 * 60 * 60 * 24);
    if (daysSinceActive < 1) weight += 10;
    else if (daysSinceActive > 7) weight -= 15;
    
    return Math.max(weight, 0);
  }
  
  /**
   * Select best user for a task
   */
  selectUserForTask(userWeights: any[], project: any) {
    // Filter users who aren't at capacity
    const availableUsers = userWeights.filter(uw => {
      const currentTaskCount = uw.user.activeTasks?.length || 0;
      return currentTaskCount < project.tasksPerBatch;
    });
    
    if (!availableUsers.length) return null;
    
    // Weighted random selection (higher weight = higher chance)
    const totalWeight = availableUsers.reduce((sum, uw) => sum + uw.weight, 0);
    let random = Math.random() * totalWeight;
    
    for (const userWeight of availableUsers) {
      random -= userWeight.weight;
      if (random <= 0) {
        return userWeight;
      }
    }
    
    return availableUsers[0]; // Fallback
  }
  
  /**
   * Assign specific task to user
   */
  async assignTaskToUser(taskId: string, userId: string, project: any) {
    const session = await mongoose.startSession();
    session.startTransaction();
    
    try {
      // Update task
      await ProjectTask.findByIdAndUpdate(taskId, {
        assignedTo: userId,
        assignedAt: new Date(),
        status: 'ASSIGNED',
      }, { session });
      
      // Find or create task assignment record
      let assignment = await TaskAssignment.findOne({
        userId,
        projectId: project._id,
      });
      
      if (!assignment) {
        assignment = new TaskAssignment({
          userId,
          projectId: project._id,
          taskIds: [new mongoose.Types.ObjectId(taskId)],
          batchSize: project.tasksPerBatch,
          status: 'ACTIVE',
        });
      } else {
        assignment.taskIds.push(new mongoose.Types.ObjectId(taskId));
      }
      
      await assignment.save({ session });
      
      // Send notification to user
      await this.notifyUserOfNewTask(userId, taskId, project);
      
      await session.commitTransaction();
    } catch (error) {
      await session.abortTransaction();
      throw error;
    } finally {
      session.endSession();
    }
  }
  
  /**
   * Handle task submission and quality control
   */
  async submitTask(taskId: string, userId: string, submission: any) {
    const task = await ProjectTask.findById(taskId).populate('projectId');
    // Handle assignedTo - can be single ObjectId or array
    const assignedTo = task?.assignedTo;
    let isAssignedToUser = false;
    
    if (Array.isArray(assignedTo)) {
      isAssignedToUser = assignedTo.some((id: any) => id.toString() === userId);
    } else if (assignedTo) {
      isAssignedToUser = assignedTo.toString() === userId;
    }
    
    if (!task || !isAssignedToUser) {
      throw new Error('Task not found or not assigned to user');
    }
    
    const timeSpent = Date.now() - new Date(task.startedAt!).getTime();
    
    // Update task with submission
    task.submission = {
      ...submission,
      timeSpent,
    };
    task.status = 'SUBMITTED';
    task.submittedAt = new Date();
    
    await task.save();
    
    // Automatic evaluation for quality control tasks
    if (task.isQualityCheck && task.expectedAnswer) {
      await this.evaluateQualityControlTask(task, userId);
    }
    
    // Auto-assign next task if available
    await this.assignNextTaskToUser(userId, task.projectId._id.toString());
    
    return task;
  }
  
  /**
   * Evaluate quality control task automatically
   */
  async evaluateQualityControlTask(task: any, userId: string) {
    const isCorrect = this.compareAnswers(task.submission.answer, task.expectedAnswer);
    const score = isCorrect ? 100 : 0;
    
    task.review = {
      status: isCorrect ? 'APPROVED' : 'REJECTED',
      score,
      feedback: isCorrect ? 'Correct answer' : 'Incorrect answer',
      reviewNotes: 'Automatic quality control evaluation',
    };
    task.status = isCorrect ? 'APPROVED' : 'REJECTED';
    task.reviewedAt = new Date();
    
    await task.save();
    
    // Update user statistics
    await this.updateUserStatistics(userId, isCorrect, task);
    
    // If user fails quality control, pause their assignment
    if (!isCorrect) {
      await this.handleQualityControlFailure(userId, task.projectId);
    }
  }
  
  /**
   * Generate quality control tasks
   */
  async generateQualityControlTasks(projectId: string, totalTasks: number, session?: any) {
    const qcTaskCount = Math.ceil(totalTasks * 0.1); // 10% quality control
    
    // This would be implemented based on project type
    // For now, we'll create placeholder QC tasks
    const qcTasks = Array.from({ length: qcTaskCount }, (_, index) => ({
      projectId,
      taskNumber: -1 - index, // Negative numbers for QC tasks
      isQualityCheck: true,
      data: { type: 'quality_control', index },
      instructions: 'This is a quality control task.',
      status: 'PENDING',
    }));
    
    await ProjectTask.insertMany(qcTasks, { session });
  }
  
  /**
   * Calculate appropriate time limit based on task category
   */
  calculateTimeLimit(category: string): number {
    const timeLimits = {
      'AI_TRAINING': 45,
      'DATA_ANNOTATION': 30,
      'CONTENT_MODERATION': 20,
      'MODEL_EVALUATION': 60,
      'TRANSCRIPTION': 15,
      'TRANSLATION': 90,
    };
    
    return timeLimits[category as keyof typeof timeLimits] || 30;
  }
  
  /**
   * Compare submitted answer with expected answer
   */
  compareAnswers(submitted: any, expected: any): boolean {
    // This would implement sophisticated comparison logic based on task type
    if (typeof submitted === 'string' && typeof expected === 'string') {
      return submitted.toLowerCase().trim() === expected.toLowerCase().trim();
    }
    
    return JSON.stringify(submitted) === JSON.stringify(expected);
  }
  
  /**
   * Update user statistics after task completion
   */
  async updateUserStatistics(userId: string, isCorrect: boolean, task: any) {
    const user = await User.findById(userId);
    if (!user) return;
    
    if (!user.statistics) {
      user.statistics = {
        totalTasksCompleted: 0,
        totalTasksApproved: 0,
        overallAccuracy: 0,
      };
    }
    
    user.statistics.totalTasksCompleted += 1;
    if (isCorrect) {
      user.statistics.totalTasksApproved += 1;
    }
    
    user.statistics.overallAccuracy = 
      (user.statistics.totalTasksApproved / user.statistics.totalTasksCompleted) * 100;
    
    await user.save();
  }
  
  /**
   * Handle quality control failure
   */
  async handleQualityControlFailure(userId: string, projectId: string) {
    // Pause user's assignment for this project
    await TaskAssignment.findOneAndUpdate(
      { userId, projectId },
      { status: 'PAUSED' }
    );
    
    // Unassign pending tasks
    await ProjectTask.updateMany(
      { assignedTo: userId, projectId, status: 'ASSIGNED' },
      { 
        $unset: { assignedTo: 1, assignedAt: 1 },
        status: 'PENDING'
      }
    );
    
    // Send notification to user about quality control failure
    // This would integrate with your notification system
  }
  
  /**
   * Assign next batch of tasks to user
   */
  async assignNextTaskToUser(userId: string, projectId: string) {
    const assignment = await TaskAssignment.findOne({ userId, projectId });
    if (!assignment || assignment.status !== 'ACTIVE') return;
    
    const availableTasks = await ProjectTask.find({
      projectId,
      status: 'PENDING',
    }).limit(assignment.batchSize);
    
    if (availableTasks.length > 0) {
      const project = await Project.findById(projectId);
      await this.distributeTasks(availableTasks, [{ _id: userId }], project);
    }
  }
  
  /**
   * Send notification to user about new task
   */
  async notifyUserOfNewTask(userId: string, taskId: string, project: any) {
    // This would integrate with your notification system
    console.log(`New task ${taskId} assigned to user ${userId} for project ${project.title}`);
  }
}

export const taskAssignmentService = new TaskAssignmentService();