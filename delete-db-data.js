const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const uri = process.env.MONGODB_URI;

async function connectToDatabase() {
  const client = new MongoClient(uri);
  await client.connect();
  return client.db('taskify');
}

async function showCurrentData() {
  console.log('🔍 Current Database Contents:');
  console.log('=' .repeat(50));
  
  const db = await connectToDatabase();
  
  // Show users
  const users = await db.collection('users').find({}).toArray();
  console.log(`\n👥 Users (${users.length}):`);
  users.forEach((user, index) => {
    console.log(`  ${index + 1}. ${user.email} (${user.role}) - Created: ${user.createdAt?.toISOString().split('T')[0] || 'Unknown'}`);
  });
  
  // Show tasks
  const tasks = await db.collection('tasks').find({}).toArray();
  console.log(`\n📋 Tasks (${tasks.length}):`);
  tasks.forEach((task, index) => {
    console.log(`  ${index + 1}. ${task.title} - Category: ${task.category} - Created: ${task.createdAt?.toISOString().split('T')[0] || 'Unknown'}`);
  });
  
  // Show applications
  const applications = await db.collection('applications').find({}).toArray();
  console.log(`\n📝 Applications (${applications.length}):`);
  applications.forEach((app, index) => {
    console.log(`  ${index + 1}. Task: ${app.taskId} - User: ${app.userId} - Status: ${app.status}`);
  });
  
  // Show projects
  const projects = await db.collection('projects').find({}).toArray();
  console.log(`\n🚀 Projects (${projects.length}):`);
  projects.forEach((project, index) => {
    console.log(`  ${index + 1}. ${project.title} - Status: ${project.status} - Created: ${project.createdAt?.toISOString().split('T')[0] || 'Unknown'}`);
  });
  
  // Show opportunities
  const opportunities = await db.collection('opportunities').find({}).toArray();
  console.log(`\n🎯 Opportunities (${opportunities.length}):`);
  opportunities.forEach((opp, index) => {
    console.log(`  ${index + 1}. ${opp.title} - Category: ${opp.category} - Created: ${opp.createdAt?.toISOString().split('T')[0] || 'Unknown'}`);
  });
}

async function deleteAllTasks() {
  console.log('🗑️  Deleting all tasks...');
  const db = await connectToDatabase();
  const result = await db.collection('tasks').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} tasks`);
}

async function deleteAllApplications() {
  console.log('🗑️  Deleting all applications...');
  const db = await connectToDatabase();
  const result = await db.collection('applications').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} applications`);
}

async function deleteAllProjects() {
  console.log('🗑️  Deleting all projects...');
  const db = await connectToDatabase();
  const result = await db.collection('projects').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} projects`);
}

async function deleteAllOpportunities() {
  console.log('🗑️  Deleting all opportunities...');
  const db = await connectToDatabase();
  const result = await db.collection('opportunities').deleteMany({});
  console.log(`✅ Deleted ${result.deletedCount} opportunities`);
}

async function deleteTestUsers() {
  console.log('🗑️  Deleting test users (keeping admin)...');
  const db = await connectToDatabase();
  const result = await db.collection('users').deleteMany({
    email: { $ne: 'admin@inferaai.com' }
  });
  console.log(`✅ Deleted ${result.deletedCount} test users`);
}

async function deleteEverythingExceptAdmin() {
  console.log('🚨 DELETING ALL DATA (except admin user)...');
  const db = await connectToDatabase();
  
  const tasks = await db.collection('tasks').deleteMany({});
  const applications = await db.collection('applications').deleteMany({});
  const projects = await db.collection('projects').deleteMany({});
  const opportunities = await db.collection('opportunities').deleteMany({});
  const users = await db.collection('users').deleteMany({
    email: { $ne: 'admin@inferaai.com' }
  });
  
  console.log('✅ Deletion Summary:');
  console.log(`  - Tasks: ${tasks.deletedCount}`);
  console.log(`  - Applications: ${applications.deletedCount}`);
  console.log(`  - Projects: ${projects.deletedCount}`);
  console.log(`  - Opportunities: ${opportunities.deletedCount}`);
  console.log(`  - Users: ${users.deletedCount}`);
}

async function main() {
  try {
    const args = process.argv.slice(2);
    const command = args[0];
    
    switch (command) {
      case 'show':
        await showCurrentData();
        break;
      case 'delete-tasks':
        await deleteAllTasks();
        break;
      case 'delete-applications':
        await deleteAllApplications();
        break;
      case 'delete-projects':
        await deleteAllProjects();
        break;
      case 'delete-opportunities':
        await deleteAllOpportunities();
        break;
      case 'delete-test-users':
        await deleteTestUsers();
        break;
      case 'delete-all':
        await deleteEverythingExceptAdmin();
        break;
      default:
        console.log('🛠️  Database Management Tool');
        console.log('Usage: node delete-db-data.js [command]');
        console.log('\nAvailable commands:');
        console.log('  show                 - Show current database contents');
        console.log('  delete-tasks         - Delete all tasks');
        console.log('  delete-applications  - Delete all applications');
        console.log('  delete-projects      - Delete all projects');
        console.log('  delete-opportunities - Delete all opportunities');
        console.log('  delete-test-users    - Delete all users except admin');
        console.log('  delete-all           - Delete everything except admin user');
        console.log('\nExample: node delete-db-data.js show');
    }
    
    process.exit(0);
  } catch (error) {
    console.error('❌ Error:', error.message);
    process.exit(1);
  }
}

main();