// Browser console test - copy and paste this into your browser console
// when you're logged into your live site

console.log('🧪 Testing Live Task Creation from Browser');

// Search for token in all possible locations
console.log('🔍 Searching for authentication token...');

// Check localStorage
console.log('\n📦 LocalStorage contents:');
for (let i = 0; i < localStorage.length; i++) {
  const key = localStorage.key(i);
  const value = localStorage.getItem(key);
  console.log(`  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
}

// Check sessionStorage
console.log('\n📦 SessionStorage contents:');
for (let i = 0; i < sessionStorage.length; i++) {
  const key = sessionStorage.key(i);
  const value = sessionStorage.getItem(key);
  console.log(`  ${key}: ${value?.substring(0, 50)}${value?.length > 50 ? '...' : ''}`);
}

// Try multiple possible token keys
const possibleKeys = [
  'auth_token', 'accessToken', 'token', 'authToken', 'jwt', 'bearer_token',
  'user_token', 'session_token', 'api_token', 'inferaai_token'
];

let token = null;
let tokenSource = null;

// Check for infera_session JSON structure first
const inferaSession = localStorage.getItem('infera_session');
if (inferaSession) {
  try {
    const session = JSON.parse(inferaSession);
    console.log('🔍 Infera session structure:', session);
    
    // Look for token in various possible locations within the session
    if (session.accessToken) {
      token = session.accessToken;
      tokenSource = 'localStorage.infera_session.accessToken';
    } else if (session.token) {
      token = session.token;
      tokenSource = 'localStorage.infera_session.token';
    } else if (session.user && session.user.accessToken) {
      token = session.user.accessToken;
      tokenSource = 'localStorage.infera_session.user.accessToken';
    } else if (session.auth && session.auth.accessToken) {
      token = session.auth.accessToken;
      tokenSource = 'localStorage.infera_session.auth.accessToken';
    }
  } catch (e) {
    console.log('❌ Error parsing infera_session:', e.message);
  }
}

// Search localStorage for standard keys if not found
if (!token) {
  for (const key of possibleKeys) {
    const value = localStorage.getItem(key);
    if (value && value.length > 20) {
      token = value;
      tokenSource = `localStorage.${key}`;
      break;
    }
  }
}

// Search sessionStorage if not found
if (!token) {
  for (const key of possibleKeys) {
    const value = sessionStorage.getItem(key);
    if (value && value.length > 20) {
      token = value;
      tokenSource = `sessionStorage.${key}`;
      break;
    }
  }
}

console.log('\n🔑 Token search results:');
console.log('🔑 Token found:', token ? 'Yes' : 'No');
console.log('🔑 Token source:', tokenSource || 'Not found');
console.log('🔑 Token length:', token?.length || 0);

if (!token) {
  console.log('❌ No token found. Try logging in again.');
} else {
  // Test the task creation endpoint
  const testTask = {
    title: 'Browser Debug Test Task',
    description: 'Testing from browser console',
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

  console.log('📤 Sending task creation request...');

  fetch('https://inferaai-hfh4hmd4frcee8e9.centralindia-01.azurewebsites.net/api/tasks/create', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'Authorization': `Bearer ${token}`
    },
    body: JSON.stringify(testTask)
  })
  .then(async response => {
    const text = await response.text();
    console.log('📨 Response status:', response.status);
    console.log('📨 Response headers:', Object.fromEntries(response.headers.entries()));
    console.log('📨 Response body:', text);
    
    try {
      const json = JSON.parse(text);
      console.log('📨 Parsed response:', json);
    } catch (e) {
      console.log('📨 Raw response (not JSON):', text);
    }

    // If 401, let's check the token format
    if (response.status === 401) {
      console.log('🔍 Debugging 401 error...');
      console.log('🔑 Token starts with:', token.substring(0, 20));
      
      // Check if JWT
      const parts = token.split('.');
      if (parts.length === 3) {
        try {
          const header = JSON.parse(atob(parts[0]));
          const payload = JSON.parse(atob(parts[1]));
          console.log('🔑 JWT Header:', header);
          console.log('🔑 JWT Payload:', payload);
          console.log('🔑 Token expires:', new Date(payload.exp * 1000));
          console.log('🔑 Current time:', new Date());
        } catch (e) {
          console.log('🔑 JWT decode error:', e.message);
        }
      }
    }
  })
  .catch(error => {
    console.error('❌ Network error:', error);
  });
}

console.log('\n📋 Instructions:');
console.log('1. Make sure you\'re logged into your admin account');
console.log('2. Copy and paste this entire script into your browser console');
console.log('3. Check the output for debugging info');