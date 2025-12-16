// Test what data the dashboard is getting for William Macy
const axios = require('axios');

async function testDashboardData() {
  try {
    // First, login to get a token
    console.log('🔐 Logging in as William Macy...');
    const loginResponse = await axios.post('http://localhost:5000/api/auth/login', {
      email: 'william.macy.ai@gmail.com',
      password: 'kem91fibA1!'
    });
    
    if (!loginResponse.data.success) {
      console.error('❌ Login failed:', loginResponse.data.message);
      return;
    }
    
    console.log('✅ Login response:', loginResponse.data);
    const token = loginResponse.data.accessToken || loginResponse.data.token;
    console.log('✅ Login successful, got token:', token ? 'Present' : 'Missing');
    
    // Now test the tasks endpoint
    console.log('\n📋 Fetching user tasks...');
    const tasksResponse = await axios.get('http://localhost:5000/api/tasks/my-tasks', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    console.log('📊 Tasks Response:');
    console.log(`  - Success: ${tasksResponse.data.success}`);
    console.log(`  - Total tasks: ${tasksResponse.data.tasks?.length || 0}`);
    
    if (tasksResponse.data.tasks && tasksResponse.data.tasks.length > 0) {
      let totalEarnings = 0;
      console.log('\n💰 Task Earnings Breakdown:');
      
      tasksResponse.data.tasks.forEach((task, index) => {
        const earnings = task.totalEarnings || 0;
        totalEarnings += earnings;
        console.log(`  ${index + 1}. ${task.title} - Status: ${task.status} - Earnings: $${earnings}`);
      });
      
      console.log(`\n💵 TOTAL CALCULATED EARNINGS: $${totalEarnings}`);
    } else {
      console.log('❌ No tasks found!');
    }
    
    // Also test the user profile
    console.log('\n👤 Fetching user profile...');
    const userResponse = await axios.get('http://localhost:5000/api/users/profile', {
      headers: {
        'Authorization': `Bearer ${token}`
      }
    });
    
    if (userResponse.data.success) {
      console.log('📊 User Profile:');
      console.log(`  - Name: ${userResponse.data.user.name}`);
      console.log(`  - Total Earnings (profile): $${userResponse.data.user.totalEarnings || 0}`);
      console.log(`  - Completed Tasks: ${userResponse.data.user.completedTasks || 0}`);
    }
    
  } catch (error) {
    console.error('❌ Test failed:');
    if (error.response) {
      console.error('  Response status:', error.response.status);
      console.error('  Response data:', error.response.data);
    } else if (error.request) {
      console.error('  No response received:', error.request);
    } else {
      console.error('  Error:', error.message);
    }
    console.error('  Full error:', error);
  }
}

testDashboardData();