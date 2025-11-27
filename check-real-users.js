const https = require('https');

console.log('🔍 Checking Real Users in Your Database');
console.log('=====================================\n');

const baseUrl = 'inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net';

// First, get admin token to authenticate
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

    console.log('🔐 Authenticating as admin...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          if (res.statusCode === 200 && result.accessToken) {
            console.log('✅ Admin authentication successful');
            resolve(result.accessToken);
          } else {
            console.log('❌ Admin authentication failed:', result.message);
            resolve(null);
          }
        } catch (e) {
          console.log('❌ Login response parse error');
          resolve(null);
        }
      });
    });

    req.on('error', () => {
      console.log('❌ Network error during login');
      resolve(null);
    });

    req.write(loginData);
    req.end();
  });
}

// Get real users from database
async function getRealUsers(token) {
  return new Promise((resolve) => {
    const options = {
      hostname: baseUrl,
      path: '/api/users/assignable',
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json'
      }
    };

    console.log('\n📊 Fetching real users from your database...');

    const req = https.request(options, (res) => {
      let data = '';
      res.on('data', (chunk) => data += chunk);
      res.on('end', () => {
        try {
          const result = JSON.parse(data);
          
          if (res.statusCode === 200) {
            console.log('✅ Successfully retrieved users');
            console.log(`👥 Total users in database: ${result.users.length}`);
            
            if (result.users.length === 0) {
              console.log('\n⚠️ NO USERS FOUND IN DATABASE');
              console.log('Your database is empty. You need users to assign tasks to.');
              console.log('\n💡 Solutions:');
              console.log('1. Create users through application submissions');
              console.log('2. Create users through registration');
              console.log('3. Import users from your old database');
            } else {
              console.log('\n📋 Available users for task assignment:');
              result.users.forEach((user, index) => {
                console.log(`${index + 1}. ${user.name} (${user.email}) - Role: ${user.role}`);
              });
            }
          } else {
            console.log(`❌ Failed to get users: ${result.message}`);
          }
        } catch (e) {
          console.log('❌ Response parse error');
        }
        resolve();
      });
    });

    req.on('error', (error) => {
      console.log(`❌ Network error: ${error.message}`);
      resolve();
    });

    req.end();
  });
}

async function checkDatabase() {
  const token = await getAdminToken();
  if (token) {
    await getRealUsers(token);
  }
  
  console.log('\n🎯 Next Steps:');
  console.log('1. If no users exist, you need to create real users first');
  console.log('2. Users can be created through:');
  console.log('   - Application submissions on task-ify.com');
  console.log('   - Direct registration');
  console.log('   - Admin user creation');
  console.log('3. Once you have users, they will appear in the task assignment dropdown');
}

checkDatabase().catch(console.error);