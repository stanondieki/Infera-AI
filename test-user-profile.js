// Test fetching user profile with earnings
const axios = require('axios');

async function testUserProfile() {
  try {
    console.log('🧪 Testing user profile fetch...');
    
    // First, let's see if we can get the user directly without auth
    const response = await axios.get('http://localhost:5000/api/auth/debug/users');
    
    console.log('✅ Users Response:');
    const users = response.data.users;
    const williamUser = users.find(u => u.email === 'william.macy.ai@gmail.com');
    
    if (williamUser) {
      console.log('👤 William Macy user found:');
      console.log(JSON.stringify(williamUser, null, 2));
    } else {
      console.log('❌ William Macy user not found');
    }
    
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
  }
}

testUserProfile();