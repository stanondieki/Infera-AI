const { MongoClient } = require('mongodb');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, 'backend', '.env') });

const uri = process.env.MONGODB_URI;

async function main() {
  try {
    console.log('🔗 Connecting to MongoDB...');
    const client = new MongoClient(uri);
    await client.connect();
    
    const db = client.db('taskify');
    
    // List all collections
    const collections = await db.listCollections().toArray();
    console.log('\n📂 Available Collections:');
    collections.forEach(col => {
      console.log(`  - ${col.name}`);
    });
    
    // Check each collection for data
    for (const col of collections) {
      const count = await db.collection(col.name).countDocuments();
      console.log(`\n📊 ${col.name}: ${count} documents`);
      
      if (count > 0 && count < 20) {
        const samples = await db.collection(col.name).find({}).limit(3).toArray();
        samples.forEach((doc, index) => {
          console.log(`  ${index + 1}. ${JSON.stringify(doc, null, 2).substring(0, 200)}...`);
        });
      }
    }
    
    await client.close();
    
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

main();