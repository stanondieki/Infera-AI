const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple user schema for testing
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String
});

const User = mongoose.model('User', userSchema);

async function testLogin() {
  try {
    // Use the same connection as backend
    const backendEnv = require('dotenv').config({ path: './backend/.env' });
    const uri = backendEnv.parsed.MONGODB_URI;
    
    await mongoose.connect(uri);
    console.log('✅ Connected to MongoDB');
    
    // Find the user
    const user = await User.findOne({ email: 'william.macy.ai@gmail.com' });
    
    if (!user) {
      console.log('❌ User not found');
      return;
    }
    
    console.log('👤 User found:', {
      name: user.name,
      email: user.email,
      role: user.role,
      passwordLength: user.password?.length || 0
    });
    
    // Test password
    const testPassword = 'kem91fibA1!';
    console.log(`🔑 Testing password: "${testPassword}"`);
    
    const isMatch = await bcrypt.compare(testPassword, user.password);
    console.log('🔐 Password match:', isMatch);
    
    if (!isMatch) {
      console.log('❌ Password does not match');
      console.log('🔍 Stored hash preview:', user.password.substring(0, 20) + '...');
      
      // Try creating a new hash to compare
      const newHash = await bcrypt.hash(testPassword, 10);
      console.log('🆕 New hash preview:', newHash.substring(0, 20) + '...');
      
      // Test if stored password might be plain text
      if (user.password === testPassword) {
        console.log('⚠️ Password is stored as plain text!');
      }
    } else {
      console.log('✅ Password matches - login should work');
    }
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  } finally {
    await mongoose.connection.close();
  }
}

testLogin();