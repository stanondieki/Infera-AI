const mongoose = require('mongoose');
const bcrypt = require('bcryptjs');

// User Schema (simplified version for this script)
const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  role: { type: String, enum: ['user', 'admin'], default: 'user' },
  isActive: { type: Boolean, default: true },
  isVerified: { type: Boolean, default: true },
  joinedDate: { type: Date, default: Date.now },
  createdAt: { type: Date, default: Date.now },
  updatedAt: { type: Date, default: Date.now },
  totalEarnings: { type: Number, default: 0 },
  completedTasks: { type: Number, default: 0 },
  rating: { type: Number, default: 5 },
  reviewCount: { type: Number, default: 0 },
  skills: { type: [String], default: [] },
  languages: { type: [String], default: [] }
});

const User = mongoose.model('User', userSchema);

async function createAdminUser() {
  try {
    // MongoDB connection string - you can modify this if needed
    const mongoUri = process.env.MONGODB_URI || 'mongodb+srv://stanodieki:Standieki123@cluster0.syis8.mongodb.net/taskify?retryWrites=true&w=majority&appName=Cluster0';
    
    console.log('🔗 Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('✅ Connected to MongoDB');

    // Admin user details - CHANGE THESE!
    const adminData = {
      name: 'Taskify Admin',
      email: 'admin@taskify.com',  // Change this to your desired admin email
      password: 'TaskifyAdmin2024!', // Change this to a secure password
      role: 'admin',
      isActive: true,
      isVerified: true
    };

    // Check if admin already exists
    const existingAdmin = await User.findOne({ email: adminData.email });
    if (existingAdmin) {
      console.log(`⚠️  Admin user with email ${adminData.email} already exists`);
      
      // Update existing admin
      existingAdmin.role = 'admin';
      existingAdmin.isActive = true;
      existingAdmin.isVerified = true;
      await existingAdmin.save();
      console.log('✅ Existing user updated to admin role');
    } else {
      // Hash password
      console.log('🔐 Hashing password...');
      const saltRounds = 12;
      const hashedPassword = await bcrypt.hash(adminData.password, saltRounds);

      // Create new admin user
      const newAdmin = new User({
        ...adminData,
        password: hashedPassword
      });

      await newAdmin.save();
      console.log('✅ Admin user created successfully!');
    }

    console.log('\n📋 Admin Credentials:');
    console.log(`Email: ${adminData.email}`);
    console.log(`Password: ${adminData.password}`);
    console.log('\n⚠️  IMPORTANT: Please change the password after first login!');
    console.log('🔒 Store these credentials securely and delete this script after use.\n');

  } catch (error) {
    console.error('❌ Error creating admin user:', error.message);
  } finally {
    await mongoose.disconnect();
    console.log('🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the script
createAdminUser();