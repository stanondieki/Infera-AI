const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const uri = process.env.MONGODB_URI;

async function debugConnection() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    console.log('📍 URI:', uri?.replace(/\/\/[^:]+:[^@]+@/, '//***:***@')); // Hide credentials
    
    const client = new MongoClient(uri);
    await client.connect();
    
    console.log('✅ Connected successfully');
    
    // List all databases
    const adminDb = client.db().admin();
    const databases = await adminDb.listDatabases();
    console.log('\n📂 Available Databases:');
    databases.databases.forEach(db => {
      console.log(`  - ${db.name} (${(db.sizeOnDisk / 1024 / 1024).toFixed(2)} MB)`);
    });
    
    // Check the specific database we're using
    const dbName = 'taskify';
    const db = client.db(dbName);
    
    console.log(`\n🎯 Checking database: ${dbName}`);
    
    // List collections in taskify database
    const collections = await db.listCollections().toArray();
    console.log(`\n📋 Collections in '${dbName}':`, collections.length);
    
    if (collections.length === 0) {
      console.log('❌ No collections found in taskify database');
      
      // Try to find data in other databases
      for (const database of databases.databases) {
        if (database.name !== 'admin' && database.name !== 'local' && database.name !== 'config') {
          const testDb = client.db(database.name);
          const testCollections = await testDb.listCollections().toArray();
          if (testCollections.length > 0) {
            console.log(`\n🔍 Found collections in '${database.name}':`, testCollections.map(c => c.name));
          }
        }
      }
    } else {
      collections.forEach(col => {
        console.log(`  ✓ ${col.name}`);
      });
      
      // Check document counts
      console.log('\n📊 Document counts:');
      for (const col of collections) {
        const count = await db.collection(col.name).countDocuments();
        console.log(`  - ${col.name}: ${count} documents`);
      }
    }
    
    // Try to create a test collection to see if we have write permissions
    console.log('\n🧪 Testing write permissions...');
    try {
      await db.collection('test_connection').insertOne({ 
        test: true, 
        timestamp: new Date(),
        message: 'Connection test successful'
      });
      console.log('✅ Write test successful');
      
      // Clean up test document
      await db.collection('test_connection').deleteOne({ test: true });
      console.log('🧹 Test document cleaned up');
    } catch (writeError) {
      console.log('❌ Write test failed:', writeError.message);
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Connection Error:', error.message);
    console.error('Stack:', error.stack);
  }
}

debugConnection();