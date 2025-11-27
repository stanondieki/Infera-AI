const https = require('https');

console.log('🧪 Testing Task Creation API Directly');
console.log('===================================\n');

const baseUrl = 'inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net';

// First, get admin token
async function getAdminToken() {
  return new Promise((resolve) => {
    const options = {
      hostname: baseUrl,
      path: '/api/auth/login',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json'
      }
    };

    const loginData = JSON.stringify({
      email: 'admin@inferaai.com',
      password: 'Admin123!'
    });

    console.log('🔐 Getting admin token...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.accessToken) {
            console.log('✅ Admin token obtained');
            resolve(result.accessToken);
          } else {
            console.log('❌ Login failed:', result.message);
            resolve(null);
          }
        } catch (e) {
          console.log('❌ Login response error');
          resolve(null);
        }
      });
    });

    req.on('error', () => resolve(null));
    req.write(loginData);
    req.end();
  });
}

// Test creating a task with valid data
async function testTaskCreation(token) {
  return new Promise((resolve) => {
    const taskData = {
      title: 'Test AI Training Task',
      description: 'This is a test task to verify the API is working',
      type: 'ai-training',
      category: 'Natural Language Processing',
      instructions: 'Complete the task as specified',
      requirements: ['Basic AI knowledge'],
      deliverables: ['Completed dataset'],
      estimatedHours: 5,
      hourlyRate: 25,
      priority: 'medium',
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      assignedTo: '674708b82769a6da3410dd07' // Alice Johnson's ID from earlier test
    };

    const options = {
      hostname: baseUrl,
      path: '/api/tasks/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('\n🎯 Testing task creation...');
    console.log('📝 Task data:', JSON.stringify(taskData, null, 2));

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 201) {
            console.log('✅ Task creation SUCCESS!');
            console.log('📋 Created task ID:', result.task._id);
            console.log('👤 Assigned to:', result.task.assignedTo?.name || 'None');
          } else {
            console.log(`❌ Task creation FAILED (${res.statusCode})`);
            console.log('📝 Error message:', result.message);
            console.log('🔥 Error details:', result.error);
          }
        } catch (e) {
          console.log('❌ Response parse error');
          console.log('📄 Raw response:', data);
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Network error: ${error.message}`);
      resolve();
    });

    req.write(JSON.stringify(taskData));
    req.end();
  });
}

// Test with no assignment (should work)
async function testTaskCreationNoAssignment(token) {
  return new Promise((resolve) => {
    const taskData = {
      title: 'Test Unassigned Task',
      description: 'This task has no assignment',
      type: 'content-creation',
      category: 'Writing',
      instructions: 'Write content as needed',
      requirements: ['Writing skills'],
      deliverables: ['Written content'],
      estimatedHours: 3,
      hourlyRate: 20,
      priority: 'low',
      deadline: new Date(Date.now() + 5 * 24 * 60 * 60 * 1000).toISOString(),
      // No assignedTo field - should remain unassigned
    };

    const options = {
      hostname: baseUrl,
      path: '/api/tasks/create',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${token}`
      }
    };

    console.log('\n🎯 Testing unassigned task creation...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 201) {
            console.log('✅ Unassigned task creation SUCCESS!');
            console.log('📋 Task status:', result.task.status);
          } else {
            console.log(`❌ Unassigned task creation FAILED (${res.statusCode})`);
            console.log('📝 Error:', result.message);
          }
        } catch (e) {
          console.log('❌ Response parse error');
        }
        resolve();
      });
    });

    req.on('error', () => resolve());
    req.write(JSON.stringify(taskData));
    req.end();
  });
}

async function runTests() {
  const token = await getAdminToken();
  if (!token) {
    console.log('❌ Cannot proceed without admin token');
    return;
  }

  await testTaskCreation(token);
  await testTaskCreationNoAssignment(token);
  
  console.log('\n🏁 Task creation tests completed');
  console.log('If successful, tasks should now work from the frontend too!');
}

runTests().catch(console.error);