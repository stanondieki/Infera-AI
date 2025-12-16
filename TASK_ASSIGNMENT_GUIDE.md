# Task Assignment Guide for Infera AI

This guide explains how to create, assign, and manage tasks in the Infera AI platform.

## Table of Contents
1. [Understanding the Task System](#understanding-the-task-system)
2. [Project Categories](#project-categories)
3. [How to Assign Tasks](#how-to-assign-tasks)
4. [Example Tasks for Each Category](#example-tasks-for-each-category)
5. [API Endpoints](#api-endpoints)
6. [Best Practices](#best-practices)

---

## Understanding the Task System

### Task Hierarchy
```
Project (Container)
  └── Tasks (Individual work items)
        └── Assigned to Users
              └── Task Submissions
```

### Task States
| Status | Description |
|--------|-------------|
| `draft` | Task created but not assigned |
| `assigned` | Task assigned to a user |
| `in_progress` | User has started working |
| `submitted` | User has submitted their work |
| `under_review` | Admin is reviewing |
| `approved` | Task accepted |
| `rejected` | Task needs revision |
| `completed` | Fully completed and paid |

### Task Fields
| Field | Required | Description |
|-------|----------|-------------|
| `title` | ✅ | Task name |
| `description` | ✅ | What the task is about |
| `type` | ✅ | Task type (see below) |
| `category` | ✅ | Project category |
| `assignedTo` | ❌ | User ID to assign to |
| `deadline` | ❌ | Due date |
| `hourlyRate` | ❌ | Payment rate |
| `priority` | ❌ | low/medium/high/critical |
| `instructions` | ❌ | Detailed work instructions |
| `requirements` | ❌ | Array of requirements |
| `taskData` | ❌ | Category-specific data |

---

## Project Categories

### 1. AI_TRAINING
Train AI models through conversational data, response evaluation, and model feedback.
- **Task Types**: `ai_training`, `training`, `multilingual`, `conversational`
- **Use Cases**: Chatbot training, LLM fine-tuning, response quality assessment

### 2. DATA_ANNOTATION  
Label and annotate data for machine learning models.
- **Task Types**: `data_annotation`, `annotation`, `classification`, `labeling`
- **Use Cases**: Image classification, bounding boxes, NER, semantic segmentation

### 3. CONTENT_MODERATION
Review content for policy compliance and safety.
- **Task Types**: `content_moderation`, `moderation`, `safety`, `review`
- **Use Cases**: Safety review, hate speech detection, adult content filtering

### 4. MODEL_EVALUATION
Evaluate AI model outputs for quality and accuracy.
- **Task Types**: `evaluation`, `quality_assessment`, `model_evaluation`
- **Use Cases**: Response quality rating, accuracy testing, bias detection

### 5. CODE_REVIEW
Review code for bugs, security, and best practices.
- **Task Types**: `code_review`, `code`, `programming`
- **Use Cases**: Bug detection, security audit, code quality review

### 6. TRANSCRIPTION
Convert audio/video content to text.
- **Task Types**: `transcription`, `audio`, `speech`
- **Use Cases**: Audio transcription, video captions, meeting notes

### 7. TRANSLATION
Translate content between languages.
- **Task Types**: `translation`, `language`, `localization`
- **Use Cases**: Document translation, app localization

---

## How to Assign Tasks

### Method 1: Admin Dashboard (UI)

1. **Navigate to Admin Panel**
   - Go to `/dashboard` → Admin section → Tasks

2. **Click "Create Task" or "Add Task"**
   - Opens the `CreateTaskDialogV2` component

3. **Fill in Task Details**
   - Select a template or create custom
   - Choose category and type
   - Set deadline and payment
   - Write instructions

4. **Assign to User**
   - Select from dropdown of available users
   - Or leave unassigned (will be "draft")

5. **Submit**
   - Task is created and user is notified

### Method 2: API (Programmatic)

```javascript
// POST /api/tasks/create
const response = await fetch('/api/tasks/create', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    title: 'Classify Food Images - Batch 1',
    description: 'Classify 50 food images into appropriate categories',
    type: 'data_annotation',
    category: 'DATA_ANNOTATION',
    assignedTo: '507f1f77bcf86cd799439011', // User ObjectId
    deadline: '2024-12-21T00:00:00Z',
    hourlyRate: 15,
    priority: 'medium',
    instructions: 'Review each image and select the correct food category...',
    requirements: [
      'Classify all 50 images',
      'Minimum 95% confidence required',
      'Flag unclear images'
    ],
    taskData: {
      difficultyLevel: 'beginner',
      requiredSkills: ['image_classification', 'attention_to_detail'],
      guidelines: 'Use provided category list. When unsure, select "other".',
      qualityMetrics: ['accuracy', 'consistency', 'speed']
    }
  })
});
```

### Method 3: Bulk Task Creation

```javascript
// POST /api/tasks/create-ai-tasks
const response = await fetch('/api/tasks/create-ai-tasks', {
  method: 'POST',
  headers: {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${adminToken}`
  },
  body: JSON.stringify({
    category: 'natural_language',
    taskCount: 10,
    difficulty: 'intermediate'
  })
});
```

---

## Example Tasks for Each Category

### AI_TRAINING Examples

#### Example 1: Conversational AI Training
```json
{
  "title": "Rate AI Chatbot Responses",
  "description": "Evaluate AI-generated responses for helpfulness and accuracy",
  "type": "ai_training",
  "category": "AI_TRAINING",
  "instructions": "Read each conversation and rate the AI's response on:\n1. Relevance (1-5)\n2. Helpfulness (1-5)\n3. Accuracy (1-5)\n4. Tone (1-5)\n\nProvide brief feedback for each rating.",
  "requirements": [
    "Rate all 20 conversations",
    "Provide written feedback for scores below 3",
    "Flag any harmful or inappropriate responses"
  ],
  "taskData": {
    "difficultyLevel": "intermediate",
    "requiredSkills": ["conversation_analysis", "critical_thinking"],
    "guidelines": "Focus on whether the response actually helps the user achieve their goal.",
    "qualityMetrics": ["inter_annotator_agreement", "detailed_feedback"],
    "inputs": [
      {
        "context": "User: How do I reset my password?",
        "ai_response": "I'd be happy to help you reset your password! Please go to the login page and click 'Forgot Password'. Enter your email address, and you'll receive a reset link within 5 minutes."
      }
    ]
  },
  "estimatedTime": 45,
  "hourlyRate": 18
}
```

#### Example 2: Multilingual Response Quality
```json
{
  "title": "Spanish Conversation Quality Check",
  "description": "Evaluate Spanish AI responses for naturalness and cultural appropriateness",
  "type": "multilingual",
  "category": "AI_TRAINING",
  "instructions": "Evaluate each Spanish conversation for:\n1. Translation accuracy\n2. Natural fluency\n3. Cultural appropriateness\n4. Formality level correctness",
  "requirements": [
    "Native or near-native Spanish proficiency required",
    "Evaluate all 15 conversations",
    "Provide corrections for any errors found"
  ],
  "taskData": {
    "difficultyLevel": "advanced",
    "requiredSkills": ["spanish_fluency", "cultural_awareness", "linguistics"],
    "guidelines": "Pay special attention to regional variations and formal/informal registers.",
    "language": "spanish"
  },
  "estimatedTime": 60,
  "hourlyRate": 22
}
```

---

### DATA_ANNOTATION Examples

#### Example 1: Food Image Classification
```json
{
  "title": "Food Image Classification - Restaurant Dataset",
  "description": "Classify food images into categories for a restaurant recommendation app",
  "type": "data_annotation",
  "category": "DATA_ANNOTATION",
  "instructions": "For each image:\n1. Select the primary food category\n2. Add secondary tags if applicable\n3. Rate image quality (1-5)\n4. Set confidence level (50-100%)",
  "requirements": [
    "Classify all 100 images",
    "Minimum 90% accuracy required",
    "Complete within 2 hours"
  ],
  "taskData": {
    "difficultyLevel": "beginner",
    "requiredSkills": ["image_classification", "attention_to_detail"],
    "guidelines": "Categories: pizza, burger, salad, pasta, seafood, dessert, soup, sandwich, meat, vegetarian, asian, mexican, other",
    "qualityMetrics": ["classification_accuracy", "consistency", "completion_rate"],
    "categories": ["pizza", "burger", "salad", "pasta", "seafood", "dessert", "soup", "sandwich", "meat", "vegetarian", "asian", "mexican", "other"]
  },
  "estimatedTime": 120,
  "hourlyRate": 15
}
```

#### Example 2: Object Detection for Autonomous Vehicles
```json
{
  "title": "Autonomous Vehicle Object Detection",
  "description": "Draw bounding boxes around objects in driving scenarios",
  "type": "data_annotation",
  "category": "DATA_ANNOTATION",
  "instructions": "For each image:\n1. Draw tight bounding boxes around all objects\n2. Label each object (vehicle, pedestrian, cyclist, traffic_light, stop_sign, etc.)\n3. Mark occluded objects with 'partial' tag\n4. Set confidence level for each annotation",
  "requirements": [
    "Annotate all 50 images",
    "90% IoU accuracy required",
    "All safety-critical objects must be annotated"
  ],
  "taskData": {
    "difficultyLevel": "intermediate",
    "requiredSkills": ["object_detection", "attention_to_detail", "spatial_reasoning"],
    "guidelines": "Priority: pedestrians > cyclists > vehicles > signs. Always err on the side of caution for safety-critical objects.",
    "qualityMetrics": ["bounding_box_iou", "classification_accuracy", "safety_coverage"],
    "labels": [
      {"id": "vehicle", "name": "Vehicle", "color": "#EF4444"},
      {"id": "pedestrian", "name": "Pedestrian", "color": "#10B981"},
      {"id": "cyclist", "name": "Cyclist", "color": "#3B82F6"},
      {"id": "traffic_light", "name": "Traffic Light", "color": "#EAB308"},
      {"id": "stop_sign", "name": "Stop Sign", "color": "#DC2626"}
    ]
  },
  "estimatedTime": 90,
  "hourlyRate": 20
}
```

#### Example 3: Named Entity Recognition (NER)
```json
{
  "title": "News Article Entity Extraction",
  "description": "Identify and label named entities in news articles",
  "type": "data_annotation",
  "category": "DATA_ANNOTATION",
  "instructions": "Highlight and label all named entities:\n- PERSON: Names of people\n- ORG: Organizations, companies\n- LOC: Locations, cities, countries\n- DATE: Dates and times\n- MONEY: Monetary values\n- PRODUCT: Product names",
  "requirements": [
    "Process 30 articles",
    "Label ALL entities - none should be missed",
    "Maintain consistent labeling across articles"
  ],
  "taskData": {
    "difficultyLevel": "intermediate",
    "requiredSkills": ["text_analysis", "ner", "attention_to_detail"],
    "guidelines": "When entity spans are ambiguous, include the full proper noun phrase.",
    "qualityMetrics": ["entity_recall", "entity_precision", "consistency"],
    "entityTypes": ["PERSON", "ORG", "LOC", "DATE", "MONEY", "PRODUCT"]
  },
  "estimatedTime": 75,
  "hourlyRate": 17
}
```

---

### CONTENT_MODERATION Examples

#### Example 1: Social Media Content Review
```json
{
  "title": "Social Media Post Moderation",
  "description": "Review user posts for policy violations",
  "type": "content_moderation",
  "category": "CONTENT_MODERATION",
  "instructions": "Review each post for:\n1. Safety - violence, self-harm, dangerous activities\n2. Hate Speech - discrimination, slurs, harassment\n3. Adult Content - explicit sexual content\n4. Misinformation - false claims, fake news\n5. Spam - promotional content, scams\n\nDecisions: APPROVE, REMOVE, or ESCALATE",
  "requirements": [
    "Review all 50 posts",
    "Provide reason for each decision",
    "Escalate uncertain cases"
  ],
  "taskData": {
    "difficultyLevel": "intermediate",
    "requiredSkills": ["content_review", "policy_understanding", "critical_thinking"],
    "guidelines": "When in doubt, escalate. Better to over-flag than miss violations.",
    "qualityMetrics": ["accuracy", "false_positive_rate", "false_negative_rate"],
    "categories": [
      {"id": "safety", "name": "Safety", "weight": 1.5},
      {"id": "hate_speech", "name": "Hate Speech", "weight": 1.5},
      {"id": "adult_content", "name": "Adult Content", "weight": 1.3},
      {"id": "misinformation", "name": "Misinformation", "weight": 1.2},
      {"id": "spam", "name": "Spam", "weight": 0.8}
    ]
  },
  "estimatedTime": 60,
  "hourlyRate": 18
}
```

#### Example 2: AI Output Safety Review
```json
{
  "title": "AI Response Safety Audit",
  "description": "Review AI-generated content for safety and appropriateness",
  "type": "content_moderation",
  "category": "CONTENT_MODERATION",
  "instructions": "Evaluate each AI response for:\n1. Harmful instructions - could cause physical harm\n2. Illegal advice - promotes illegal activity\n3. Bias - discriminatory or stereotyping content\n4. Factual accuracy - verifiably false claims\n5. Privacy - reveals personal information",
  "requirements": [
    "Review all 40 AI responses",
    "Flag all safety concerns",
    "Provide severity rating (1-5) for each issue"
  ],
  "taskData": {
    "difficultyLevel": "advanced",
    "requiredSkills": ["ai_safety", "critical_analysis", "policy_knowledge"],
    "guidelines": "Apply the precautionary principle. If content could be misused, flag it.",
    "qualityMetrics": ["safety_detection_rate", "false_positive_rate", "severity_accuracy"]
  },
  "estimatedTime": 90,
  "hourlyRate": 25
}
```

---

### CODE_REVIEW Examples

#### Example 1: Security Code Review
```json
{
  "title": "API Security Code Review",
  "description": "Review backend API code for security vulnerabilities",
  "type": "code_review",
  "category": "CODE_REVIEW",
  "instructions": "Review code for:\n1. SQL Injection vulnerabilities\n2. XSS vulnerabilities\n3. Authentication/Authorization issues\n4. Sensitive data exposure\n5. Insecure dependencies\n\nFor each issue: identify line, describe problem, suggest fix.",
  "requirements": [
    "Review all 5 code files",
    "Categorize issues by severity",
    "Provide remediation suggestions"
  ],
  "taskData": {
    "difficultyLevel": "expert",
    "requiredSkills": ["security", "backend_development", "owasp_top_10"],
    "guidelines": "Reference OWASP guidelines. Focus on OWASP Top 10 vulnerabilities.",
    "qualityMetrics": ["vulnerability_detection", "false_positive_rate", "fix_quality"],
    "language": "javascript",
    "code": "// Code will be loaded from task"
  },
  "estimatedTime": 120,
  "hourlyRate": 40
}
```

#### Example 2: Code Quality Review
```json
{
  "title": "React Component Code Review",
  "description": "Review React components for best practices and performance",
  "type": "code_review",
  "category": "CODE_REVIEW",
  "instructions": "Review for:\n1. Performance issues (unnecessary re-renders)\n2. Accessibility (a11y) compliance\n3. Code organization and readability\n4. Error handling\n5. TypeScript type safety",
  "requirements": [
    "Review 10 React components",
    "Rate each component 1-5",
    "Provide specific improvement suggestions"
  ],
  "taskData": {
    "difficultyLevel": "intermediate",
    "requiredSkills": ["react", "typescript", "frontend_development"],
    "guidelines": "Follow React best practices and Airbnb style guide.",
    "qualityMetrics": ["issue_detection", "suggestion_quality", "consistency"],
    "language": "typescript"
  },
  "estimatedTime": 90,
  "hourlyRate": 30
}
```

---

### MODEL_EVALUATION Examples

#### Example 1: LLM Response Quality
```json
{
  "title": "GPT Response Quality Evaluation",
  "description": "Evaluate LLM responses for quality and accuracy",
  "type": "model_evaluation",
  "category": "MODEL_EVALUATION",
  "instructions": "For each prompt-response pair, rate:\n1. Relevance (1-10)\n2. Accuracy (1-10)\n3. Helpfulness (1-10)\n4. Conciseness (1-10)\n5. Safety (1-10)",
  "requirements": [
    "Evaluate 100 responses",
    "Provide written justification for low scores",
    "Identify patterns in model weaknesses"
  ],
  "taskData": {
    "difficultyLevel": "advanced",
    "requiredSkills": ["ai_evaluation", "critical_thinking", "domain_knowledge"],
    "guidelines": "Be consistent. Use the full range of scores. Document your reasoning.",
    "qualityMetrics": ["inter_rater_reliability", "score_distribution", "feedback_quality"]
  },
  "estimatedTime": 180,
  "hourlyRate": 22
}
```

---

### RESEARCH Examples

#### Example 1: Market Research Analysis
```json
{
  "title": "AI Startup Competitive Analysis",
  "description": "Research and analyze the competitive landscape of AI startups",
  "type": "research",
  "category": "RESEARCH",
  "instructions": "Research and provide:\n1. Executive Summary\n2. Market Overview\n3. Key Players Analysis\n4. Technology Comparison\n5. Market Trends\n6. Recommendations",
  "requirements": [
    "Minimum 2000 words",
    "At least 10 citations required",
    "Include data visualizations descriptions"
  ],
  "taskData": {
    "difficultyLevel": "advanced",
    "requiredSkills": ["research", "analysis", "writing", "ai_knowledge"],
    "guidelines": "Focus on companies founded in the last 3 years. Include funding data.",
    "qualityMetrics": ["depth_of_analysis", "citation_quality", "actionable_insights"],
    "topic": "AI Startup Competitive Landscape 2024",
    "keywords": ["artificial intelligence", "machine learning", "startup funding", "market analysis"]
  },
  "estimatedTime": 240,
  "hourlyRate": 35
}
```

---

## API Endpoints

### Task Management

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/tasks/create` | Create single task |
| POST | `/api/tasks/create-ai-tasks` | Bulk create AI training tasks |
| GET | `/api/tasks` | List all tasks |
| GET | `/api/tasks/:id` | Get task details |
| PUT | `/api/tasks/:id` | Update task |
| DELETE | `/api/tasks/:id` | Delete task |
| POST | `/api/tasks/:id/assign` | Assign task to user |
| POST | `/api/tasks/:id/submit` | Submit task work |
| POST | `/api/tasks/:id/approve` | Approve submitted task |
| POST | `/api/tasks/:id/reject` | Reject with feedback |

### User Management for Assignment

| Method | Endpoint | Description |
|--------|----------|-------------|
| GET | `/api/users` | List available users |
| GET | `/api/users/:id/tasks` | Get user's assigned tasks |

---

## Best Practices

### Task Creation
1. **Clear Instructions**: Be specific about what you expect
2. **Realistic Deadlines**: Allow sufficient time for quality work
3. **Fair Compensation**: Pay rates should reflect difficulty
4. **Examples**: Provide examples when possible
5. **Quality Metrics**: Define how success will be measured

### Task Assignment
1. **Match Skills**: Assign based on user qualifications
2. **Workload Balance**: Don't overload any single user
3. **Progressive Difficulty**: Start users with easier tasks
4. **Feedback Loop**: Review and provide constructive feedback

### Quality Control
1. **Sample Review**: Review a percentage of completed tasks
2. **Inter-annotator Agreement**: Have multiple users do same task
3. **Gold Standard Tasks**: Include known-answer tasks for quality checks
4. **Continuous Feedback**: Help users improve over time

---

## Quick Start: Create Your First Task

1. **Login as Admin** at `/auth/login`

2. **Go to Dashboard** → Admin → Tasks

3. **Click "Create Task"**

4. **Use a template** or fill manually:
   - Title: "Food Image Classification Batch 1"
   - Category: DATA_ANNOTATION
   - Type: data_annotation
   - Instructions: "Classify each image..."
   - Select user to assign

5. **Submit** and monitor progress

---

## Need Help?

- Check backend logs: `npm run dev` in `/backend`
- Check frontend console for API errors
- Review task in database: MongoDB Compass
- Contact: [Your support email]
