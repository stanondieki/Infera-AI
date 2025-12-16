const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Import the actual backend User model
const path = require('path');

async function testBackendLogin() {
  try {
    // Use the backend's connection
    const backendEnv = require('dotenv').config({ path: './backend/.env' });
    const uri = backendEnv.parsed.MONGODB_URI;
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Use the same User model as backend
    const User = require('./backend/src/models/User.ts').default;
    
    console.log('👤 Testing login for: william.macy.ai@gmail.com');
    console.log('🔑 Testing password: kem91fibA1!');
    
    // Find user exactly like backend does
    const user = await User.findOne({ email: 'william.macy.ai@gmail.com' }).select('+password');
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('📋 User details:');
    console.log('  - Name:', user.name);
    console.log('  - Email:', user.email);
    console.log('  - Role:', user.role);
    console.log('  - isActive:', user.isActive);
    console.log('  - isVerified:', user.isVerified);
    console.log('  - approvalStatus:', user.approvalStatus);
    console.log('  - Password hash length:', user.password?.length || 0);
    
    // Check each condition that backend checks
    console.log('\n🔍 Backend validation checks:');
    
    // 1. User exists ✓
    console.log('  1. User exists: ✅');
    
    // 2. Account is active
    if (!user.isActive) {
      console.log('  2. Account active: ❌ - Account deactivated');
      return;
    }
    console.log('  2. Account active: ✅');
    
    // 3. Password verification
    const isPasswordValid = await user.comparePassword('kem91fibA1!');
    if (!isPasswordValid) {
      console.log('  3. Password valid: ❌ - Password does not match');
      
      // Test direct bcrypt comparison
      const directCompare = await bcrypt.compare('kem91fibA1!', user.password);
      console.log('     Direct bcrypt compare:', directCompare);
      return;
    }
    console.log('  3. Password valid: ✅');
    
    // 4. Email verified
    if (!user.isVerified) {
      console.log('  4. Email verified: ❌ - Email not verified');
      return;
    }
    console.log('  4. Email verified: ✅');
    
    // 5. Approval status
    if (user.approvalStatus === 'rejected') {
      console.log('  5. Approval status: ❌ - Account rejected');
      return;
    }
    if (user.approvalStatus === 'pending') {
      console.log('  5. Approval status: ⚠️ - Account pending approval');
      return;
    }
    console.log('  5. Approval status: ✅');
    
    console.log('\n🎉 All checks passed - Login should work!');
    
  } catch (error) {
    console.error('❌ Error:', error.message);
    console.error('Stack:', error.stack);
  } finally {
    await mongoose.connection.close();
  }
}

testBackendLogin();