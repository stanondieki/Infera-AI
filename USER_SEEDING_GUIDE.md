# User Data Seeding Guide

This guide provides multiple ways to seed comprehensive user data for the Infera AI platform, including a user with 3 months of realistic work history.

## 📊 What Gets Seeded

**User Profile: Sarah Chen**
- Email: `sarah.chen.ai@gmail.com`
- Password: `password123`
- Role: User (not admin)
- Skills: AI/ML expertise with multilingual capabilities
- 3 months of complete work history

**Work History & Earnings:**
- **September 2024**: $1,506 across 3 projects (12 tasks)
- **October 2024**: $2,234 across 3 projects (12 tasks)  
- **November 2024**: $1,200 across 3 projects (12 tasks)
- **Total**: $4,940 over 47 completed tasks

**Project Categories:**
- AI Training & Model Evaluation
- Data Annotation & Computer Vision
- Content Moderation & Bias Detection
- Code Review & Security Analysis
- Audio Transcription & Text Classification

## 🚀 Quick Start (Recommended)

### Option 1: Simple JavaScript Seeding
```powershell
# Install dependencies (if not already installed)
npm install

# Run the quick seeding script
npm run seed-user
```

### Option 2: TypeScript Version (Advanced)
```powershell
# Install TypeScript dependencies
npm install

# Run TypeScript seeding
npm run seed-user-ts
```

### Option 3: Manual Execution
```powershell
# Direct execution with Node.js
node quick-seed.js

# Or with backend compiled (if you have backend built)
cd backend
npm run build
cd ..
node quick-seed.js
```

## 📋 Detailed Seeding Output

The script will create:

### September 2024 Projects ($1,506)
1. **Genesis B1 Multilingual Training** - $650
   - Cultural Context Evaluation (Spanish) - $200
   - Multilingual Response Rating (Mandarin) - $150
   - Conversation Flow Analysis (Japanese) - $175
   - Final Quality Review - $125

2. **Impala Vision A3 Automotive** - $500
   - Vehicle Detection - $160
   - Weather Condition Annotation - $120
   - Edge Case Identification - $140
   - Quality Control Review - $80

3. **Phoenix Eval Rating C2** - $356
   - Response Accuracy Evaluation - $108
   - Safety Assessment Review - $90
   - Helpfulness Rating Analysis - $108
   - Final Report Compilation - $50

### October 2024 Projects ($2,234)
1. **Bulba Gen Complex Reasoning** - $990
   - Logical Reasoning Assessment - $300
   - Creative Problem Solving Evaluation - $240
   - Complex Scenario Testing - $270
   - Final Performance Analysis - $180

2. **Flamingo Multimodal B6** - $800
   - Text-Image Integration Testing - $224
   - Audio-Visual Correlation Analysis - $196
   - Cross-Modal Response Evaluation - $224
   - Integration Quality Review - $156

3. **Geranium YY Code Review** - $444
   - Security Vulnerability Assessment - $140
   - Code Efficiency Review - $140
   - Best Practices Compliance Check - $140
   - Final Report & Recommendations - $24

### November 2024 Projects ($1,200)
1. **Ostrich LLM Bias Detection** - $600
   - Political Content Bias Analysis - $154
   - Cultural Sensitivity Review - $132
   - Fact-checking Verification - $176
   - Final Bias Report - $138

2. **Titan Audio Transcription** - $400
   - Technical Meeting Transcription - $128
   - Multilingual Speaker Identification - $96
   - Quality Control & Editing - $112
   - Final Delivery Package - $64

3. **Nova Text Classification V2** - $200
   - Positive Sentiment Labeling - $48
   - Negative Sentiment Labeling - $48
   - Topic Category Assignment - $60
   - Quality Validation Check - $44

## 🔧 Environment Setup

Make sure you have the following environment variables in your `.env` file:

```env
MONGODB_URI=your_mongodb_connection_string
# Example: mongodb://localhost:27017/infera_ai
# Or: mongodb+srv://username:password@cluster.mongodb.net/infera_ai
```

## 📚 Technical Details

### Database Collections Created/Updated:
- **Users**: 1 new user with complete profile
- **Projects**: 9 realistic projects across 3 months
- **Tasks**: 36 completed tasks with realistic timing and payments

### Task Status & Payment:
- All tasks marked as `COMPLETED` and `PAID`
- Realistic completion dates across the 3-month period
- Variable hourly rates ($12-35/hour depending on complexity)
- High-quality ratings (4-5 stars) and positive feedback

### User Statistics:
- Total Earnings: $4,940
- Completed Tasks: 47
- Rating: 4.8/5
- Review Count: 45
- Overall Accuracy: 97.9%
- Account Status: Verified & Approved

## 🔍 Verification & Testing

After seeding, you can verify the data by:

1. **Login to the platform** with:
   - Email: `sarah.chen.ai@gmail.com`
   - Password: `password123`

2. **Check the dashboard** to see:
   - Total earnings displayed
   - Completed tasks count
   - Rating and statistics

3. **View task history** to see:
   - 9 projects across 3 months
   - 36 completed tasks
   - Realistic payment progression

## 🔧 Troubleshooting

### MongoDB Connection Issues
```powershell
# Check if MongoDB is running
# For local MongoDB:
mongod --version

# For MongoDB Atlas, verify your connection string
```

### Permission Issues
```powershell
# Run as administrator if needed
Start-Process powershell -Verb runAs
```

### Missing Dependencies
```powershell
# Install all required packages
npm install bcryptjs dotenv mongoose ts-node typescript
npm install --save-dev @types/bcryptjs @types/node
```

### Existing User Data
The script automatically:
- Detects existing users with the same email
- Cleans up old projects and tasks
- Creates fresh data to avoid conflicts

## 📝 Customization

To modify the seeded data:

1. **Edit `quick-seed.js`** for the JavaScript version
2. **Edit `seed-user-data.ts`** for the TypeScript version
3. **Adjust the projects array** to change:
   - Earnings amounts
   - Project types
   - Completion dates
   - Task descriptions

### Example Customization:
```javascript
// Change earnings for a month
tasks: [
  { title: 'Custom Task', hours: 10, payment: 500, completedAt: new Date('2024-09-05') }
]
```

## 🎯 Use Cases

This seeded data is perfect for:
- **Demo purposes**: Show realistic user progression
- **Testing dashboards**: Verify analytics and reporting
- **Development**: Test features with rich historical data
- **UI testing**: Ensure components handle various data states
- **Performance testing**: Test with realistic data volumes

## 📊 Data Insights

The seeded data provides insights into:
- **Seasonal earnings variations** (Oct was the highest earning month)
- **Project complexity progression** (from simple annotation to complex reasoning)
- **Diverse skill utilization** across different AI domains
- **Consistent high-quality performance** (97.9% accuracy)
- **Professional growth trajectory** over 3 months