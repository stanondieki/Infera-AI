const mongoose = require('mongoose');
const path = require('path');

// Load environment variables from .env.local first, then .env
require('dotenv').config({ path: path.join(__dirname, '.env.local') });
require('dotenv').config(); // Fallback to .env if .env.local doesn't exist

// Test MongoDB connection
async function testMongoConnection() {
  console.log('🔗 Testing MongoDB Connection...\n');
  
  // Get MongoDB URI from environment
  const mongoURI = process.env.MONGODB_URI;
  
  if (!mongoURI) {
    console.error('❌ MONGODB_URI not found in environment variables!');
    console.log('\n🔧 Setup Instructions:');
    console.log('1. Create a .env.local file in this directory');
    console.log('2. Add your MongoDB Atlas connection string:');
    console.log('   MONGODB_URI=mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority');
    console.log('\n📋 Get your connection string from:');
    console.log('   - MongoDB Atlas Dashboard → Connect → Connect your application');
    console.log('   - Choose "Node.js" driver');
    console.log('   - Copy the connection string and replace <password> with your actual password');
    process.exit(1);
  }
  
  console.log('📍 Connection URI format:', mongoURI.replace(/:\/\/[^@]+@/, '://***:***@'));
  console.log('📊 Environment:', process.env.NODE_ENV || 'development');
  console.log('💾 Using MongoDB URI from:', process.env.MONGODB_URI ? '.env.local or .env file' : 'default');
  console.log('');

  try {
    // Connect with timeout options
    console.log('⏳ Connecting to MongoDB...');
    await mongoose.connect(mongoURI, {
      serverSelectionTimeoutMS: 10000, // 10 seconds timeout
      connectTimeoutMS: 10000,
      socketTimeoutMS: 45000,
    });
    
    console.log('✅ MongoDB connected successfully!');
    console.log('📋 Connection details:');
    console.log(`   - Database: ${mongoose.connection.db.databaseName}`);
    console.log(`   - Host: ${mongoose.connection.host}`);
    console.log(`   - Port: ${mongoose.connection.port}`);
    console.log(`   - Ready State: ${mongoose.connection.readyState}`);
    
    // Test basic operations
    console.log('\n🔍 Testing basic operations...');
    
    // Test ping
    await mongoose.connection.db.admin().ping();
    console.log('✅ Database ping successful');
    
    // List collections
    const collections = await mongoose.connection.db.listCollections().toArray();
    console.log(`✅ Found ${collections.length} collections:`, collections.map(c => c.name));
    
    // Test User model (if exists)
    try {
      const User = require('./backend/src/models/User');
      const userCount = await User.countDocuments();
      console.log(`✅ Users collection: ${userCount} documents found`);
      
      // Show first few users (without passwords)
      if (userCount > 0) {
        const users = await User.find({}).select('name email role isActive createdAt').limit(5);
        console.log('👥 Sample users:', users.map(u => ({
          name: u.name,
          email: u.email,
          role: u.role,
          isActive: u.isActive
        })));
      }
    } catch (modelError) {
      console.log('⚠️ Could not load User model (this is normal if running outside backend)');
    }
    
    // Test write operation
    try {
      const testCollection = mongoose.connection.db.collection('connection_test');
      const testDoc = { test: true, timestamp: new Date() };
      const result = await testCollection.insertOne(testDoc);
      console.log('✅ Write test successful, inserted ID:', result.insertedId);
      
      // Clean up test document
      await testCollection.deleteOne({ _id: result.insertedId });
      console.log('✅ Cleanup successful');
    } catch (writeError) {
      console.log('⚠️ Write test failed:', writeError.message);
    }
    
    console.log('\n🎉 All tests passed! MongoDB connection is working properly.');
    
  } catch (error) {
    console.error('\n❌ MongoDB connection failed!');
    console.error('Error details:', error.message);
    
    if (error.message.includes('ETIMEDOUT')) {
      console.log('\n🔧 Timeout Solutions:');
      console.log('1. Check your internet connection');
      console.log('2. Verify MongoDB Atlas cluster is running (not paused)');
      console.log('3. Check IP whitelist in MongoDB Atlas (add 0.0.0.0/0 for testing)');
      console.log('4. Verify network access settings in Atlas');
    } else if (error.message.includes('authentication failed')) {
      console.log('\n🔧 Authentication Solutions:');
      console.log('1. Check username and password in connection string');
      console.log('2. Verify database user exists in MongoDB Atlas');
      console.log('3. Check database user permissions');
      console.log('4. Ensure password doesn\'t contain special characters that need encoding');
    } else if (error.message.includes('getaddrinfo ENOTFOUND')) {
      console.log('\n🔧 DNS/Network Solutions:');
      console.log('1. Check the cluster URL in your connection string');
      console.log('2. Verify internet connection');
      console.log('3. Try using a different network (mobile hotspot)');
    }
    
    console.log('\n📝 Connection String Format:');
    console.log('mongodb+srv://<username>:<password>@<cluster>.mongodb.net/<database>?retryWrites=true&w=majority');
    
  } finally {
    await mongoose.disconnect();
    console.log('\n🔌 Disconnected from MongoDB');
    process.exit(0);
  }
}

// Run the test
testMongoConnection().catch(console.error);