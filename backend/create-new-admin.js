const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');
require('dotenv').config();

// Simple User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  password: String,
  role: String,
  isVerified: Boolean,
  isActive: Boolean,
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', userSchema);

async function createNewAdmin() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const mongoURI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';
    await mongoose.connect(mongoURI);
    console.log('✅ Connected to MongoDB');

    // Check if admin with your email already exists
    const existingUser = await User.findOne({ email: '39839125o@gmail.com' });
    if (existingUser) {
      console.log('👤 User with this email already exists:', existingUser.role);
      if (existingUser.role !== 'admin') {
        // Update existing user to admin
        await User.updateOne(
          { email: '39839125o@gmail.com' },
          { role: 'admin', name: 'Taskify Admin' }
        );
        console.log('✅ Updated existing user to admin role');
      } else {
        console.log('✅ User is already an admin');
      }
      return;
    }

    // Create new admin user
    const hashedPassword = await bcrypt.hash('TaskifyAdmin2025!', 10);
    
    const newAdmin = new User({
      name: 'Taskify Admin',
      email: '39839125o@gmail.com',
      password: hashedPassword,
      role: 'admin',
      isVerified: true,
      isActive: true
    });

    await newAdmin.save();
    console.log('✅ New admin user created successfully!');
    console.log('📧 Email: 39839125o@gmail.com');
    console.log('🔑 Password: TaskifyAdmin2025!');
    console.log('👑 Role: admin');

  } catch (error) {
    console.error('❌ Error creating admin:', error);
  } finally {
    await mongoose.disconnect();
    console.log('👋 Disconnected from MongoDB');
  }
}

createNewAdmin();