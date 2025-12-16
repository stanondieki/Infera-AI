// Test dashboard stats calculation for William Macy
const { MongoClient } = require('mongodb');

const MONGODB_URI = 'mongodb+srv://stanondieki:0pZVVK9ehcWyPa5x@cluster0.wvnjr.mongodb.net/taskify?retryWrites=true&w=majority';

async function testDashboardStats() {
  const client = new MongoClient(MONGODB_URI);
  
  try {
    await client.connect();
    console.log('✅ Connected to MongoDB');
    
    const db = client.db('taskify');
    
    // Find William Macy
    const user = await db.collection('users').findOne({ email: 'william.macy@email.com' });
    console.log('👤 User found:', user ? {
      name: user.name,
      email: user.email,
      totalEarnings: user.totalEarnings,
      completedTasks: user.completedTasks
    } : 'Not found');
    
    if (user) {
      // Find his tasks
      const tasks = await db.collection('tasks').find({ 
        assignedTo: user._id 
      }).toArray();
      
      console.log(`\n📋 Found ${tasks.length} tasks for William Macy:`);
      
      const tasksByStatus = {};
      let totalEarningsFromTasks = 0;
      
      tasks.forEach(task => {
        if (!tasksByStatus[task.status]) {
          tasksByStatus[task.status] = 0;
        }
        tasksByStatus[task.status]++;
        
        // Calculate earnings
        if (['completed', 'submitted', 'under_review'].includes(task.status)) {
          let taskEarning = 0;
          if (task.payment) {
            taskEarning = task.payment;
          } else if (task.hourlyRate && task.estimatedHours) {
            taskEarning = Math.floor(task.hourlyRate * task.estimatedHours);
          }
          totalEarningsFromTasks += taskEarning;
          
          console.log(`  💰 Task "${task.title}" (${task.status}): $${taskEarning}`);
        }
      });
      
      console.log('\n📊 Tasks by Status:', tasksByStatus);
      
      // Calculate success rate like the dashboard does
      const totalAssignedTasks = tasks.length;
      const successfulTasks = tasks.filter(task => 
        ['completed', 'submitted'].includes(task.status)
      ).length;
      const successRate = totalAssignedTasks > 0 ? Math.round((successfulTasks / totalAssignedTasks) * 100) : 0;
      
      console.log(`\n🎯 Success Rate Calculation:`);
      console.log(`  - Total assigned tasks: ${totalAssignedTasks}`);
      console.log(`  - Successful tasks (completed/submitted): ${successfulTasks}`);
      console.log(`  - Success rate: ${successRate}%`);
      
      // Calculate achievements
      const achievements = [];
      if (successfulTasks >= 1) achievements.push('First Task Completed');
      if (successfulTasks >= 5) achievements.push('Task Master');
      if (successfulTasks >= 10) achievements.push('Elite Contributor');
      if (user.totalEarnings >= 50) achievements.push('First Earnings');
      if (user.totalEarnings >= 200) achievements.push('High Earner');
      if (successRate >= 90 && totalAssignedTasks >= 3) achievements.push('Quality Expert');
      if (user.totalEarnings >= 1000) achievements.push('Top Earner');
      if (user.totalEarnings >= 4000) achievements.push('Elite Performer');
      
      console.log(`\n🏆 Achievements (${achievements.length} total):`);
      achievements.forEach(achievement => console.log(`  - ${achievement}`));
      
      console.log(`\n💰 Earnings:`);
      console.log(`  - User profile totalEarnings: $${user.totalEarnings}`);
      console.log(`  - Calculated from tasks: $${totalEarningsFromTasks}`);
    }
    
  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await client.close();
  }
}

testDashboardStats();