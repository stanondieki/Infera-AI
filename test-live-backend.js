const https = require('https');

console.log('🧪 Testing Taskify Backend After MongoDB Configuration');
console.log('=====================================================\n');

// Test endpoints
const tests = [
  {
    name: 'Health Check',
    path: '/health',
    description: 'Basic backend health and configuration'
  },
  {
    name: 'Opportunities List',
    path: '/api/opportunities',
    description: 'Database connectivity through opportunities endpoint'
  },
  {
    name: 'User Debug Info',
    path: '/api/auth/debug/users',
    description: 'User collection status'
  }
];

const baseUrl = 'inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net';

function testEndpoint(test) {
  return new Promise((resolve) => {
    const options = {
      hostname: baseUrl,
      path: test.path,
      method: 'GET',
      headers: {
        'User-Agent': 'Taskify-Test/1.0',
        'Accept': 'application/json'
      }
    };

    console.log(`🔍 Testing: ${test.name}`);
    console.log(`📡 URL: https://${baseUrl}${test.path}`);

    const req = https.request(options, (res) => {
      let data = '';
      
      res.on('data', (chunk) => {
        data += chunk;
      });

      res.on('end', () => {
        try {
          const jsonData = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log(`✅ ${test.name}: SUCCESS`);
            
            // Show relevant information based on endpoint
            if (test.path === '/health') {
              console.log(`   📊 Database: ${jsonData.database}`);
              console.log(`   📧 Email: ${jsonData.email}`);
              console.log(`   🔧 MongoDB URI: ${jsonData.environment?.mongoUri}`);
              console.log(`   🔑 JWT Secret: ${jsonData.environment?.jwtSecret}`);
            } else if (test.path === '/api/opportunities') {
              const count = jsonData.opportunities ? jsonData.opportunities.length : 0;
              console.log(`   📋 Found ${count} opportunities`);
              if (jsonData.fallbackData) {
                console.log(`   ⚠️ Using fallback data (${jsonData.fallbackData.length} items)`);
                console.log(`   🔍 Debug info:`, jsonData.debug);
              }
            } else if (test.path === '/api/auth/debug/users') {
              console.log(`   👥 Users found: ${jsonData.count || 0}`);
              if (jsonData.users && jsonData.users.length > 0) {
                console.log(`   📝 Sample users:`, jsonData.users.slice(0, 3).map(u => ({
                  email: u.email,
                  role: u.role,
                  active: u.isActive
                })));
              }
            }
          } else {
            console.log(`❌ ${test.name}: FAILED (${res.statusCode})`);
            console.log(`   📝 Message: ${jsonData.message || 'No message'}`);
            if (jsonData.debug) {
              console.log(`   🔍 Debug: ${JSON.stringify(jsonData.debug)}`);
            }
          }
        } catch (parseError) {
          console.log(`❌ ${test.name}: JSON Parse Error`);
          console.log(`   📄 Response: ${data.substring(0, 200)}...`);
        }
        
        console.log('');
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ ${test.name}: Network Error`);
      console.log(`   🔥 Error: ${error.message}`);
      console.log('');
      resolve();
    });

    req.setTimeout(10000, () => {
      console.log(`⏰ ${test.name}: Timeout`);
      console.log('');
      req.destroy();
      resolve();
    });

    req.end();
  });
}

async function runAllTests() {
  console.log(`⚡ Testing ${tests.length} endpoints...\n`);
  
  for (const test of tests) {
    await testEndpoint(test);
    // Small delay between tests
    await new Promise(resolve => setTimeout(resolve, 1000));
  }
  
  console.log('🏁 All tests completed!');
  console.log('\n📋 Next Steps:');
  console.log('1. If all tests pass, try logging in at https://task-ify.com');
  console.log('2. If database shows "healthy", try submitting an application');
  console.log('3. Check the debug panel on the website for real-time status');
}

runAllTests().catch(console.error);