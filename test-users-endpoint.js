const https = require('https');

console.log('🔍 Testing Users Endpoint for Task Assignment');
console.log('=============================================\n');

const baseUrl = 'inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net';

function testUsersEndpoint() {
  return new Promise((resolve) => {
    const options = {
      hostname: baseUrl,
      path: '/api/users',
      method: 'GET',
      headers: {
        'User-Agent': 'Taskify-Test/1.0',
        'Accept': 'application/json'
      }
    };

    console.log(`📡 Testing: ${baseUrl}/api/users`);

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log(`✅ Users Endpoint: SUCCESS`);
            console.log(`   👥 Total Users: ${jsonData.total || 0}`);
            console.log(`   📋 Users Count: ${jsonData.users ? jsonData.users.length : 0}`);
            
            if (jsonData.users && jsonData.users.length > 0) {
              console.log(`   📝 Sample Users:`);
              jsonData.users.slice(0, 5).forEach(user => {
                console.log(`     - ${user.name} (${user.email}) - Role: ${user.role} - Active: ${user.isActive}`);
              });
            }
          } else {
            console.log(`❌ Users Endpoint: FAILED (${res.statusCode})`);
            console.log(`   📝 Message: ${jsonData.message || 'No message'}`);
            if (jsonData.error) {
              console.log(`   🔥 Error: ${jsonData.error}`);
            }
          }
        } catch (parseError) {
          console.log(`❌ Users Endpoint: JSON Parse Error`);
          console.log(`   📄 Response: ${data.substring(0, 200)}...`);
        }
        
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Users Endpoint: Network Error`);
      console.log(`   🔥 Error: ${error.message}`);
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log(`⏰ Users Endpoint: Timeout`);
      req.destroy();
      resolve();
    });

    req.end();
  });
}

// Test creating a few sample users first
async function createSampleUsers() {
  console.log('🔧 Creating Sample Users for Task Assignment');
  
  const sampleUsers = [
    {
      name: 'Alice Johnson',
      email: 'alice@taskify.com',
      password: 'Password123!',
      role: 'user'
    },
    {
      name: 'Bob Smith',
      email: 'bob@taskify.com', 
      password: 'Password123!',
      role: 'user'
    },
    {
      name: 'Carol Davis',
      email: 'carol@taskify.com',
      password: 'Password123!',
      role: 'user'
    }
  ];

  for (const user of sampleUsers) {
    const options = {
      hostname: baseUrl,
      path: '/api/auth/register',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'User-Agent': 'Taskify-Test/1.0'
      }
    };

    const postData = JSON.stringify({
      ...user,
      allowUpdate: true
    });

    await new Promise((resolve) => {
      const req = https.request(options, (res) => {
        let data = '';
        res.on('data', (chunk) => data += chunk);
        res.on('end', () => {
          try {
            const result = JSON.parse(data);
            if (res.statusCode === 200 || res.statusCode === 201) {
              console.log(`✅ Created user: ${user.name}`);
            } else {
              console.log(`⚠️ User ${user.name}: ${result.message || 'Already exists or error'}`);
            }
          } catch (e) {
            console.log(`⚠️ User ${user.name}: Response error`);
          }
          resolve();
        });
      });

      req.on('error', () => resolve());
      req.write(postData);
      req.end();
    });
  }
  
  console.log('');
}

async function runTest() {
  await createSampleUsers();
  await testUsersEndpoint();
  
  console.log('\n💡 Frontend Issue Solutions:');
  console.log('1. Check if frontend is making authenticated requests to /api/users');
  console.log('2. Verify admin token is being sent in Authorization header');
  console.log('3. Check network tab in browser for failed requests');
  console.log('4. Ensure CORS is allowing the request from task-ify.com');
}

runTest().catch(console.error);