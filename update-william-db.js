const { MongoClient } = require('mongodb');

// MongoDB connection  
const MONGODB_URI = 'mongodb+srv://stanondieki:0pZVVK9ehcWyPa5x@cluster0.wvnjr.mongodb.net/taskify?retryWrites=true&w=majority';

async function updateWilliamInDatabase() {
  let client;
  
  try {
    client = new MongoClient(MONGODB_URI);
    await client.connect();
    console.log('Connected to MongoDB');
    
    const db = client.db('infera_ai');
    const usersCollection = db.collection('users');
    
    // William's showcase data
    const williamData = {
      totalEarnings: 4940,
      completedTasks: 47,
      // Add other fields that might be needed
      successRate: 94,
      activeProjects: 9,
      achievements: 12,
      lastActiveAt: new Date(),
      isVerified: true,
      approvalStatus: 'approved',
      // Ensure we have the name
      name: 'William Macy'
    };
    
    // Update William's record - try both email variations
    const williamEmails = ['william.macy@email.com', 'william.macy.ai@gmail.com'];
    
    for (const email of williamEmails) {
      const result = await usersCollection.updateOne(
        { email: email },
        { 
          $set: williamData,
          $setOnInsert: {
            email: email,
            role: 'user',
            isActive: true,
            createdAt: new Date(),
            joinedDate: new Date('2025-09-01').toISOString() // 3 months ago
          }
        },
        { upsert: true }
      );
      
      if (result.matchedCount > 0) {
        console.log(`✅ Updated existing William record with email: ${email}`);
        console.log(`   - Total Earnings: $${williamData.totalEarnings}`);
        console.log(`   - Completed Tasks: ${williamData.completedTasks}`);
        console.log(`   - Success Rate: ${williamData.successRate}%`);
        console.log(`   - Achievements: ${williamData.achievements}`);
      } else if (result.upsertedCount > 0) {
        console.log(`✅ Created new William record with email: ${email}`);
      }
    }
    
    // Verify the update
    const william = await usersCollection.findOne({ 
      email: { $in: williamEmails } 
    });
    
    if (william) {
      console.log('\n📊 William\'s Database Record:');
      console.log('Email:', william.email);
      console.log('Name:', william.name);
      console.log('Total Earnings:', william.totalEarnings);
      console.log('Completed Tasks:', william.completedTasks);
      console.log('Success Rate:', william.successRate);
      console.log('Achievements:', william.achievements);
      console.log('Active Projects:', william.activeProjects);
      console.log('Verified:', william.isVerified);
      console.log('Approval Status:', william.approvalStatus);
    } else {
      console.log('❌ William record not found after update');
    }
    
  } catch (error) {
    console.error('❌ Error updating William in database:', error);
  } finally {
    if (client) {
      await client.close();
      console.log('\n🔒 Database connection closed');
    }
  }
}

// Run the update
updateWilliamInDatabase();