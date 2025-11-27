#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const readline = require('readline');

const rl = readline.createInterface({
  input: process.stdin,
  output: process.stdout
});

console.log('🔧 MongoDB Atlas Connection Setup');
console.log('=====================================\n');

console.log('📋 To get your MongoDB Atlas connection string:');
console.log('1. Go to https://cloud.mongodb.com/');
console.log('2. Select your project and cluster');
console.log('3. Click "Connect" → "Connect your application"');
console.log('4. Select "Node.js" driver');
console.log('5. Copy the connection string\n');

console.log('📝 Your connection string should look like:');
console.log('mongodb+srv://username:password@cluster.mongodb.net/database?retryWrites=true&w=majority\n');

rl.question('🔗 Please paste your MongoDB Atlas connection string: ', (connectionString) => {
  if (!connectionString || connectionString.trim() === '') {
    console.log('❌ No connection string provided. Exiting...');
    rl.close();
    return;
  }

  // Basic validation
  if (!connectionString.includes('mongodb+srv://') && !connectionString.includes('mongodb://')) {
    console.log('⚠️ Warning: This doesn\'t look like a MongoDB connection string.');
    console.log('Make sure it starts with "mongodb+srv://" or "mongodb://"');
  }

  if (connectionString.includes('<password>')) {
    console.log('⚠️ Warning: Remember to replace <password> with your actual database password!');
  }

  // Create .env.local file
  const envContent = `# MongoDB Atlas Connection String
MONGODB_URI=${connectionString.trim()}

# Environment
NODE_ENV=development

# Other configuration (optional for MongoDB test)
JWT_SECRET=your-jwt-secret-key-here
SMTP_HOST=smtp.gmail.com
SMTP_USER=testsolutil76@gmail.com
SMTP_PASS=xxunlgxwgcndlvjc`;

  const envPath = path.join(__dirname, '.env.local');
  
  try {
    fs.writeFileSync(envPath, envContent);
    console.log('\n✅ .env.local file created successfully!');
    console.log('📁 Location:', envPath);
    console.log('\n🧪 Now you can test your connection:');
    console.log('   node test-mongodb.js');
  } catch (error) {
    console.error('\n❌ Failed to create .env.local file:', error.message);
  }

  rl.close();
});

rl.on('close', () => {
  console.log('\n🎯 Next steps:');
  console.log('1. Run: node test-mongodb.js');
  console.log('2. If successful, add the same MONGODB_URI to your Azure App Service configuration');
  console.log('3. Test your live deployment at: https://task-ify.com');
  process.exit(0);
});