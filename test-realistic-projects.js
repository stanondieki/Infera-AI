// Test script for realistic project system
// Run this with: node test-realistic-projects.js

const API_BASE = 'http://localhost:5000/api';

// Test getting templates
async function testGetTemplates() {
  try {
    console.log('🧪 Testing GET /api/task-projects/templates...');
    
    const response = await fetch(`${API_BASE}/task-projects/templates`);
    const data = await response.json();
    
    console.log('✅ Templates fetched successfully:');
    console.log('📊 Number of templates:', data.templates?.length || 0);
    console.log('🏷️ Categories available:', Object.keys(data.categories || {}));
    
    if (data.templates && data.templates.length > 0) {
      console.log('🎯 Sample template:', data.templates[0].name);
      console.log('   Description:', data.templates[0].description);
      console.log('   Category:', data.templates[0].category);
      console.log('   Difficulty:', data.templates[0].difficulty);
      console.log('   Reward Range: $' + data.templates[0].rewardRange.min + '-$' + data.templates[0].rewardRange.max);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error testing templates:', error.message);
    return null;
  }
}

// Test admin authentication (you'll need to replace with actual admin token)
async function getAdminToken() {
  try {
    // Try to login with admin credentials
    const loginResponse = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        email: 'admin@inferaai.com', // Default admin email
        password: 'Admin123!' // Default admin password
      })
    });
    
    if (loginResponse.ok) {
      const loginData = await loginResponse.json();
      return loginData.token;
    } else {
      console.log('ℹ️ Admin login failed, testing without authentication...');
      return null;
    }
  } catch (error) {
    console.log('ℹ️ Could not get admin token, testing endpoints without auth...');
    return null;
  }
}

// Test seeding realistic projects (requires admin)
async function testSeedProjects(token) {
  try {
    console.log('\\n🌱 Testing POST /api/task-projects/seed...');
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}/task-projects/seed`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ count: 3 })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Projects seeded successfully:');
      console.log('📈 Projects created:', data.projects?.length || 0);
      if (data.projects && data.projects.length > 0) {
        data.projects.forEach((project, index) => {
          console.log(`   ${index + 1}. ${project.title}`);
        });
      }
    } else {
      console.log('⚠️ Seeding failed (likely needs admin auth):', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error testing seed:', error.message);
    return null;
  }
}

// Test creating project from template (requires admin)
async function testCreateFromTemplate(token) {
  try {
    console.log('\\n🎨 Testing POST /api/task-projects/from-template...');
    
    const headers = { 'Content-Type': 'application/json' };
    if (token) headers['Authorization'] = `Bearer ${token}`;
    
    const response = await fetch(`${API_BASE}/task-projects/from-template`, {
      method: 'POST',
      headers,
      body: JSON.stringify({ 
        templateIndex: 0,  // Use first template
        customData: {
          title: 'Test Genesis A1 - Custom'
        }
      })
    });
    
    const data = await response.json();
    
    if (response.ok) {
      console.log('✅ Project created from template:');
      console.log('🏷️ Project name:', data.project?.title);
      console.log('📝 Description:', data.project?.description?.substring(0, 100) + '...');
    } else {
      console.log('⚠️ Template creation failed (likely needs admin auth):', data.message);
    }
    
    return data;
  } catch (error) {
    console.error('❌ Error testing template creation:', error.message);
    return null;
  }
}

// Main test function
async function runTests() {
  console.log('🚀 Testing Realistic Project System');
  console.log('====================================\\n');
  
  // Test 1: Get templates (public endpoint)
  const templatesData = await testGetTemplates();
  
  // Test 2: Try to get admin token
  const adminToken = await getAdminToken();
  
  // Test 3: Seed projects (admin required)
  await testSeedProjects(adminToken);
  
  // Test 4: Create from template (admin required)
  await testCreateFromTemplate(adminToken);
  
  console.log('\\n🎉 Testing completed!');
  console.log('\\nNext steps:');
  console.log('1. Open http://localhost:3000 in your browser');
  console.log('2. Sign in as admin (admin@inferaai.com / Admin123!)');
  console.log('3. Go to Task System tab in dashboard');
  console.log('4. Try "Seed Realistic Projects" button');
  console.log('5. Try "Use Template" button to see realistic project templates');
}

// Handle both Node.js and browser environments
if (typeof window === 'undefined') {
  // Node.js environment
  const fetch = require('node-fetch');
  runTests().catch(console.error);
} else {
  // Browser environment
  window.testRealisticProjects = runTests;
  console.log('Run testRealisticProjects() in browser console to test');
}