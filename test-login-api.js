// Test login via API call
const axios = require('axios');

async function testLoginAPI() {
  try {
    console.log('🧪 Testing login via API...');
    
    const response = await axios.post('http://localhost:5000/api/auth/debug/test-login', {
      email: 'william.macy.ai@gmail.com',
      password: 'kem91fibA1!'
    });
    
    console.log('✅ API Response:');
    console.log(JSON.stringify(response.data, null, 2));
    
  } catch (error) {
    console.error('❌ API Error:', error.response?.data || error.message);
  }
}

testLoginAPI();