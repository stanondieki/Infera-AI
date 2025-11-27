// Test script to debug live task creation API
const https = require('https');

const API_BASE = 'https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api';

// Test credentials - replace with your actual admin credentials
const TEST_CREDENTIALS = {
  email: 'admin@inferaai.com',
  password: 'your_password_here' // You'll need to replace this
};

async function makeRequest(path, method = 'GET', data = null, token = null) {
  return new Promise((resolve, reject) => {
    const url = new URL(API_BASE + path);
    
    const options = {
      hostname: url.hostname,
      port: 443,
      path: url.pathname,
      method: method,
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      }
    };

    if (token) {
      options.headers['Authorization'] = `Bearer ${token}`;
    }

    if (data) {
      const jsonData = JSON.stringify(data);
      options.headers['Content-Length'] = Buffer.byteLength(jsonData);
    }

    const req = https.request(options, (res) => {
      let body = '';
      res.on('data', chunk => body += chunk);
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, data: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, data: body });
        }
      });
    });

    req.on('error', reject);
    
    if (data) {
      req.write(JSON.stringify(data));
    }
    
    req.end();
  });
}

async function testTaskCreation() {
  console.log('🧪 Testing Live Task Creation API');
  console.log('=' .repeat(50));

  try {
    // Step 1: Test login
    console.log('\n1. Testing Login...');
    const loginResponse = await makeRequest('/auth/login', 'POST', TEST_CREDENTIALS);
    console.log('   Status:', loginResponse.status);
    console.log('   Response:', JSON.stringify(loginResponse.data, null, 2));

    if (loginResponse.status !== 200 || !loginResponse.data.accessToken) {
      console.log('❌ Login failed - cannot continue');
      return;
    }

    const token = loginResponse.data.accessToken;
    console.log('✅ Login successful, token received');

    // Step 2: Test /auth/me endpoint
    console.log('\n2. Testing Token Validation...');
    const meResponse = await makeRequest('/auth/me', 'GET', null, token);
    console.log('   Status:', meResponse.status);
    console.log('   Response:', JSON.stringify(meResponse.data, null, 2));

    if (meResponse.status !== 200) {
      console.log('❌ Token validation failed');
      return;
    }

    console.log('✅ Token validation successful');

    // Step 3: Test task creation endpoint
    console.log('\n3. Testing Task Creation...');
    const testTask = {
      title: 'Debug Test Task',
      description: 'Testing task creation API',
      category: 'DATA_ANNOTATION',
      type: 'classification',
      instructions: 'Test instructions',
      estimatedHours: 1,
      hourlyRate: 15,
      deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
      priority: 'medium',
      testContent: {
        instructions: 'Test content',
        materials: 'Test materials',
        sampleInput: 'Test input',
        expectedOutput: 'Test output'
      },
      requirements: ['Test requirement']
    };

    const taskResponse = await makeRequest('/tasks/create', 'POST', testTask, token);
    console.log('   Status:', taskResponse.status);
    console.log('   Response:', JSON.stringify(taskResponse.data, null, 2));

    if (taskResponse.status === 201) {
      console.log('✅ Task creation successful!');
    } else {
      console.log('❌ Task creation failed');
      
      // Additional debugging
      console.log('\n🔍 Debug Info:');
      console.log('   Token format:', token.substring(0, 20) + '...');
      console.log('   Token length:', token.length);
      
      // Check if it's a JWT
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const payload = JSON.parse(Buffer.from(parts[1], 'base64').toString());
          console.log('   JWT payload:', JSON.stringify(payload, null, 2));
        } catch (e) {
          console.log('   JWT decode error:', e.message);
        }
      }
    }

    // Step 4: Test tasks list endpoint
    console.log('\n4. Testing Tasks List...');
    const tasksResponse = await makeRequest('/tasks', 'GET', null, token);
    console.log('   Status:', tasksResponse.status);
    console.log('   Tasks count:', tasksResponse.data?.tasks?.length || 0);

  } catch (error) {
    console.error('❌ Test failed:', error.message);
  }
}

// Run the test
console.log('⚠️  IMPORTANT: Replace TEST_CREDENTIALS.password with your actual admin password');
console.log('Then run: node debug-live-api.js\n');

if (TEST_CREDENTIALS.password === 'your_password_here') {
  console.log('❌ Please update the password in the script first');
} else {
  testTaskCreation();
}