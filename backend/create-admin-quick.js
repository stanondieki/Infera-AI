const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb+srv://stanondieki:0pZVVK9ehcWyPa5x@cluster0.wvnjr.mongodb.net/taskify?retryWrites=true&w=majority';

// User schema (simplified)
const UserSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  createdAt: { type: Date, default: Date.now }
});

const User = mongoose.model('User', UserSchema);

async function createAdmin() {
  try {
    console.log('🔌 Connecting to MongoDB...');
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Admin details
    const adminData = {
      name: 'Taskify Admin',
      email: '39839125o@gmail.com',
      password: 'TaskifyAdmin2025!',
      role: 'admin',
      isActive: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log('❌ Admin user already exists with this email');
      process.exit(1);
    }

    // Hash password
    console.log('🔐 Hashing password...');
    const saltRounds = 12;
    const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

    // Create admin user
    const adminUser = new User({
      ...adminData,
      password: hashedPassword
    });

    await adminUser.save();

    console.log('✅ Admin user created successfully!');
    console.log('📧 Email:', adminData.email);
    console.log('🔑 Password:', adminData.password);
    console.log('👤 Role:', adminData.role);
    console.log('\n🚀 You can now sign in to the admin panel with these credentials');

  } catch (error) {
    console.error('❌ Error creating admin:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

createAdmin();