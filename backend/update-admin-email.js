const mongoose = require('mongoose');
require('dotenv').config();

// Simple User schema for this script
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isVerified: Boolean,
  isActive: Boolean
});

const User = mongoose.model('User', userSchema);

async function updateAdminEmail() {
  try {
    // Connect to MongoDB
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Find the existing admin
    const existingAdmin = await User.findOne({ role: 'admin' });
    if (!existingAdmin) {
      console.log('❌ No admin user found');
      return;
    }

    console.log(`📧 Found admin: ${existingAdmin.email}`);

    // Update the admin email
    const result = await User.updateOne(
      { role: 'admin' },
      { 
        email: '39839125o@gmail.com',
        name: 'Taskify Admin',
        password: '$2b$10$YourHashedPasswordHere' // You'll need to hash this
      }
    );

    console.log('✅ Admin email updated to: 39839125o@gmail.com');
    console.log('📊 Update result:', result);

    // Verify the update
    const updatedAdmin = await User.findOne({ role: 'admin' });
    console.log('✅ Verification - Admin email is now:', updatedAdmin.email);

  } catch (error) {
    console.error('❌ Error:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

updateAdminEmail();