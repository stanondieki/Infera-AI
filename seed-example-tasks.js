/**
 * Seed Example Tasks for All Project Categories
 * 
 * This script creates sample tasks for each project category to demonstrate
 * the task system. Run with: node seed-example-tasks.js
 */

require('dotenv').config();
const mongoose = require('mongoose');

// MongoDB connection
const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/infera_ai';

// Task Schema (simplified for seeding)
const taskSchema = new mongoose.Schema({
  title: { type: String, required: true },
  description: { type: String, required: true },
  type: { type: String, required: true },
  assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: 'User' },
  createdBy: { type: mongoose.Schema.Types.ObjectId, ref: 'User', required: true },
  instructions: { type: String, required: true },
  requirements: [{ type: String }],
  deliverables: [{ type: String }],
  estimatedHours: { type: Number, default: 1 },
  deadline: { type: Date },
  status: { type: String, default: 'assigned' },
  priority: { type: String, default: 'medium' },
  hourlyRate: { type: Number, default: 15 },
  taskData: {
    category: String,
    difficultyLevel: String,
    requiredSkills: [String],
    domainExpertise: String,
    guidelines: String,
    qualityMetrics: [String],
    examples: [mongoose.Schema.Types.Mixed],
    inputs: [mongoose.Schema.Types.Mixed],
    expectedOutput: mongoose.Schema.Types.Mixed,
    isQualityControl: Boolean
  },
  qualityStandards: [String],
  estimatedTime: Number
}, { timestamps: true });

const Task = mongoose.model('Task', taskSchema);

// User Schema (to find users for assignment)
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  role: String
});
const User = mongoose.model('User', userSchema);

// ============================================
// EXAMPLE TASKS FOR EACH CATEGORY
// ============================================

const exampleTasks = {
  // ==========================================
  // AI TRAINING TASKS
  // ==========================================
  AI_TRAINING: [
    {
      title: "Conversational AI Response Evaluation",
      description: "Evaluate AI chatbot responses for a customer service application. Rate responses on helpfulness, accuracy, and tone.",
      type: "ai_training",
      instructions: `You will evaluate AI-generated customer service responses.

For each conversation:
1. Read the customer query carefully
2. Review the AI's response
3. Rate on the following criteria (1-5 scale):
   - Relevance: Does it address the question?
   - Accuracy: Is the information correct?
   - Helpfulness: Would this actually help the customer?
   - Tone: Is it professional and friendly?
   - Completeness: Does it fully answer the question?

4. Provide brief written feedback (2-3 sentences)
5. Suggest an improved response if rating is below 4`,
      requirements: [
        "Evaluate all 25 conversations",
        "Provide ratings for all 5 criteria",
        "Write feedback for each response",
        "Flag any inappropriate responses immediately"
      ],
      deliverables: [
        "Completed rating spreadsheet",
        "Written feedback for each response",
        "Summary of common issues found"
      ],
      taskData: {
        category: "AI_TRAINING",
        difficultyLevel: "intermediate",
        requiredSkills: ["critical_thinking", "customer_service", "writing"],
        guidelines: "Focus on whether the AI actually helps solve the customer's problem. Be consistent in your ratings.",
        qualityMetrics: ["inter_rater_agreement", "feedback_quality", "completion_rate"],
        inputs: [
          {
            context: "Customer: My order #12345 hasn't arrived and it's been 10 days.",
            ai_response: "I apologize for the delay with your order. Let me look into order #12345 for you. Based on our tracking, it appears the package was delayed at the distribution center. I've initiated a trace and you should receive an update within 24 hours. Would you like me to arrange a replacement or refund if it doesn't arrive by tomorrow?"
          },
          {
            context: "Customer: How do I cancel my subscription?",
            ai_response: "You can cancel your subscription anytime. Here's how:\n1. Log into your account\n2. Go to Settings > Subscription\n3. Click 'Cancel Subscription'\n4. Confirm cancellation\n\nNote: You'll retain access until your current billing period ends. Is there anything specific that made you want to cancel? I'd be happy to help address any concerns."
          },
          {
            context: "Customer: Your product broke after one week!",
            ai_response: "I'm really sorry to hear that! That's definitely not the experience we want you to have. Since it's within our 30-day warranty period, I can offer you a full replacement or refund. Which would you prefer? I'll also flag this to our quality team to investigate."
          }
        ]
      },
      estimatedTime: 75,
      hourlyRate: 18,
      priority: "high"
    },
    {
      title: "Spanish-English Translation Quality Assessment",
      description: "Evaluate AI translations between Spanish and English for a multilingual assistant.",
      type: "multilingual",
      instructions: `Evaluate AI-generated translations for accuracy and naturalness.

For each translation pair:
1. Read the original text in Spanish
2. Read the AI's English translation
3. Rate on these criteria (1-5):
   - Translation Accuracy: Is the meaning preserved?
   - Natural Fluency: Does it sound natural in English?
   - Cultural Appropriateness: Are idioms handled correctly?
   - Grammar & Spelling: Is it error-free?

4. Provide the correct translation if rating is below 4
5. Note any cultural nuances the AI missed`,
      requirements: [
        "Evaluate all 30 translation pairs",
        "Native or fluent Spanish required",
        "Provide corrections for all errors",
        "Flag any cultural insensitivities"
      ],
      taskData: {
        category: "AI_TRAINING",
        difficultyLevel: "advanced",
        requiredSkills: ["spanish_fluency", "english_fluency", "translation", "cultural_awareness"],
        guidelines: "Pay attention to regional variations. Note if the Spanish is from Spain vs Latin America.",
        qualityMetrics: ["translation_accuracy", "fluency_score", "error_detection"],
        language: "spanish",
        inputs: [
          {
            original: "¡No me tomes el pelo! Eso es demasiado caro.",
            ai_translation: "Don't pull my leg! That's too expensive.",
            expected_issues: ["Idiom translation could be improved"]
          },
          {
            original: "Quedamos a las ocho en punto, no llegues tarde.",
            ai_translation: "We'll meet at eight o'clock sharp, don't be late.",
            expected_issues: []
          }
        ]
      },
      estimatedTime: 90,
      hourlyRate: 22,
      priority: "medium"
    },
    {
      title: "AI Math Tutor Response Verification",
      description: "Verify mathematical explanations generated by an AI tutoring system.",
      type: "ai_training",
      instructions: `Review AI-generated math explanations for correctness and clarity.

For each problem:
1. Verify the mathematical solution is correct
2. Check that the explanation is clear and educational
3. Rate on:
   - Mathematical Accuracy (1-5)
   - Explanation Clarity (1-5)
   - Step-by-Step Logic (1-5)
   - Age-Appropriateness (1-5) - for high school level

4. Correct any mathematical errors
5. Suggest clearer explanations where needed`,
      requirements: [
        "Strong math background (calculus level)",
        "Verify all 20 problems",
        "Correct any errors found",
        "Provide alternative explanations if unclear"
      ],
      taskData: {
        category: "AI_TRAINING",
        difficultyLevel: "advanced",
        requiredSkills: ["mathematics", "teaching", "clear_communication"],
        guidelines: "Assume the student is a high schooler learning the concept for the first time.",
        qualityMetrics: ["accuracy", "clarity", "educational_value"],
        inputs: [
          {
            problem: "Solve for x: 2x + 5 = 13",
            ai_solution: "Let's solve this step by step:\n1. Start with: 2x + 5 = 13\n2. Subtract 5 from both sides: 2x = 8\n3. Divide both sides by 2: x = 4\n\nTo verify: 2(4) + 5 = 8 + 5 = 13 ✓"
          }
        ]
      },
      estimatedTime: 60,
      hourlyRate: 25,
      priority: "medium"
    }
  ],

  // ==========================================
  // DATA ANNOTATION TASKS
  // ==========================================
  DATA_ANNOTATION: [
    {
      title: "Food Image Classification - Restaurant App",
      description: "Classify food images for a restaurant recommendation application. Help train the AI to recognize different cuisines.",
      type: "data_annotation",
      instructions: `Classify each food image into the correct category.

For each image:
1. View the image carefully
2. Select the PRIMARY food category
3. Add up to 3 secondary tags if applicable
4. Rate image quality (1-5 stars)
5. Set your confidence level (50-100%)

Categories:
- Pizza, Burger, Salad, Pasta, Seafood, Dessert
- Soup, Sandwich, Sushi, Mexican, Indian, Thai
- Chinese, Italian, Mediterranean, American, Other

Guidelines:
- If multiple foods visible, classify the main/largest item
- Mark blurry or unclear images with low quality rating
- Use "Other" only when no category fits`,
      requirements: [
        "Classify all 100 images",
        "Minimum 90% accuracy expected",
        "Complete within 2 hours",
        "Flag any inappropriate images"
      ],
      deliverables: [
        "All images classified with categories",
        "Quality ratings for each image",
        "Confidence scores"
      ],
      taskData: {
        category: "DATA_ANNOTATION",
        difficultyLevel: "beginner",
        requiredSkills: ["image_classification", "attention_to_detail"],
        guidelines: "When food type is ambiguous, choose the most specific category that applies.",
        qualityMetrics: ["accuracy", "consistency", "completion_rate"],
        categories: [
          "pizza", "burger", "salad", "pasta", "seafood", "dessert",
          "soup", "sandwich", "sushi", "mexican", "indian", "thai",
          "chinese", "italian", "mediterranean", "american", "other"
        ],
        images: [
          "https://images.unsplash.com/photo-1565299624946-b28f40a0ca4b?w=500",
          "https://images.unsplash.com/photo-1571091718767-18b5b1457add?w=500",
          "https://images.unsplash.com/photo-1578985545062-69928b1d9587?w=500"
        ]
      },
      estimatedTime: 120,
      hourlyRate: 15,
      priority: "high"
    },
    {
      title: "Autonomous Vehicle Object Detection",
      description: "Draw bounding boxes around objects in driving scenarios for self-driving car AI training.",
      type: "data_annotation",
      instructions: `Annotate driving scene images for autonomous vehicle training.

For each image:
1. Draw bounding boxes around ALL objects:
   - Vehicles (cars, trucks, motorcycles, buses)
   - Pedestrians (people walking, standing)
   - Cyclists (bicycles, e-scooters)
   - Traffic Signs (stop signs, speed limits)
   - Traffic Lights (all states)
   - Road Markings (crosswalks, lane lines)

2. Label each box with the correct category
3. Mark occlusion level (none, partial, severe)
4. Set confidence (high, medium, low)

SAFETY CRITICAL: Never miss pedestrians or cyclists!`,
      requirements: [
        "Annotate all 50 images",
        "90% bounding box IoU accuracy",
        "100% recall on pedestrians/cyclists",
        "Complete within 3 hours"
      ],
      taskData: {
        category: "DATA_ANNOTATION",
        difficultyLevel: "intermediate",
        requiredSkills: ["object_detection", "spatial_reasoning", "attention_to_detail"],
        guidelines: "Safety objects (pedestrians, cyclists) take priority. When in doubt, draw the box.",
        qualityMetrics: ["iou_accuracy", "classification_accuracy", "safety_recall"],
        labels: [
          { id: "vehicle", name: "Vehicle", color: "#EF4444", shortcut: "V" },
          { id: "pedestrian", name: "Pedestrian", color: "#10B981", shortcut: "P" },
          { id: "cyclist", name: "Cyclist", color: "#3B82F6", shortcut: "C" },
          { id: "traffic_light", name: "Traffic Light", color: "#EAB308", shortcut: "T" },
          { id: "stop_sign", name: "Stop Sign", color: "#DC2626", shortcut: "S" },
          { id: "road_marking", name: "Road Marking", color: "#8B5CF6", shortcut: "R" }
        ]
      },
      estimatedTime: 180,
      hourlyRate: 20,
      priority: "critical"
    },
    {
      title: "Named Entity Recognition - News Articles",
      description: "Identify and label named entities in news articles for NLP model training.",
      type: "data_annotation",
      instructions: `Annotate named entities in news article text.

Entity Types to Mark:
- PERSON: Names of people (e.g., "Elon Musk", "Dr. Smith")
- ORGANIZATION: Companies, agencies (e.g., "Tesla", "FBI")
- LOCATION: Places (e.g., "New York", "Mount Everest")
- DATE: Dates and times (e.g., "January 2024", "last Monday")
- MONEY: Monetary values (e.g., "$1.5 billion", "50 euros")
- PRODUCT: Product names (e.g., "iPhone 15", "Model S")
- EVENT: Named events (e.g., "World Cup", "CES 2024")

Guidelines:
- Highlight the complete entity name
- Include titles with person names ("Dr. John Smith")
- Mark all instances, even if repeated
- Don't include common nouns ("a company" vs "Apple Inc.")`,
      requirements: [
        "Process all 40 articles",
        "Mark ALL entities - high recall required",
        "Maintain 95%+ precision",
        "Consistent labeling across articles"
      ],
      taskData: {
        category: "DATA_ANNOTATION",
        difficultyLevel: "intermediate",
        requiredSkills: ["text_analysis", "ner", "reading_comprehension"],
        guidelines: "When in doubt about entity boundaries, include the full proper noun phrase.",
        qualityMetrics: ["precision", "recall", "f1_score", "consistency"],
        entityTypes: [
          { id: "PERSON", color: "#EF4444", description: "Names of people" },
          { id: "ORG", color: "#3B82F6", description: "Organizations" },
          { id: "LOC", color: "#10B981", description: "Locations" },
          { id: "DATE", color: "#EAB308", description: "Dates/times" },
          { id: "MONEY", color: "#8B5CF6", description: "Monetary values" },
          { id: "PRODUCT", color: "#EC4899", description: "Product names" },
          { id: "EVENT", color: "#F97316", description: "Named events" }
        ],
        sampleTexts: [
          "Apple CEO Tim Cook announced the new iPhone 15 at the company's headquarters in Cupertino, California on September 12, 2023.",
          "Tesla reported quarterly revenue of $25.2 billion, exceeding Wall Street expectations."
        ]
      },
      estimatedTime: 120,
      hourlyRate: 17,
      priority: "medium"
    }
  ],

  // ==========================================
  // CONTENT MODERATION TASKS
  // ==========================================
  CONTENT_MODERATION: [
    {
      title: "Social Media Post Review",
      description: "Review user-generated social media posts for policy violations and harmful content.",
      type: "content_moderation",
      instructions: `Review social media posts for policy compliance.

For each post, evaluate:
1. SAFETY - Violence, self-harm, dangerous activities
2. HATE SPEECH - Discrimination, harassment, slurs
3. ADULT CONTENT - Explicit sexual content
4. MISINFORMATION - False claims, fake news
5. SPAM - Promotional content, scams
6. PRIVACY - Personal information exposure

Decisions:
- APPROVE: Content is acceptable
- REMOVE: Clear policy violation
- ESCALATE: Uncertain, needs senior review

Always provide a reason for your decision.`,
      requirements: [
        "Review all 60 posts",
        "Achieve 95%+ accuracy",
        "Process within 90 minutes",
        "Document all violations found"
      ],
      taskData: {
        category: "CONTENT_MODERATION",
        difficultyLevel: "intermediate",
        requiredSkills: ["content_review", "policy_knowledge", "critical_thinking"],
        guidelines: "When uncertain, escalate. It's better to over-flag than miss violations. Context matters.",
        qualityMetrics: ["accuracy", "false_positive_rate", "false_negative_rate", "speed"],
        categories: [
          { id: "safety", name: "Safety", weight: 1.5, description: "Violence, self-harm" },
          { id: "hate_speech", name: "Hate Speech", weight: 1.5, description: "Discrimination, harassment" },
          { id: "adult_content", name: "Adult Content", weight: 1.3, description: "Explicit content" },
          { id: "misinformation", name: "Misinformation", weight: 1.2, description: "False claims" },
          { id: "spam", name: "Spam", weight: 0.8, description: "Promotional/scam" },
          { id: "privacy", name: "Privacy", weight: 1.0, description: "Personal info" }
        ],
        sampleContent: [
          { text: "Check out my new business! Make $1000/day from home! DM me 💰", expectedDecision: "REMOVE", reason: "Spam/Scam" },
          { text: "Had a great lunch with friends today! 🌮", expectedDecision: "APPROVE", reason: "Harmless personal post" },
          { text: "I can't take this anymore...", expectedDecision: "ESCALATE", reason: "Possible self-harm concern" }
        ]
      },
      estimatedTime: 90,
      hourlyRate: 18,
      priority: "high"
    },
    {
      title: "AI Response Safety Audit",
      description: "Review AI-generated content for safety issues before deployment.",
      type: "content_moderation",
      instructions: `Audit AI model outputs for safety and appropriateness.

Evaluate each AI response for:
1. HARMFUL INSTRUCTIONS - Could cause physical/psychological harm
2. ILLEGAL CONTENT - Promotes illegal activities
3. BIAS & DISCRIMINATION - Stereotypes, unfair treatment
4. FACTUAL ERRORS - Verifiably false information
5. PRIVACY VIOLATIONS - Reveals personal data
6. INAPPROPRIATE TONE - Unprofessional or offensive

Rate severity: LOW, MEDIUM, HIGH, CRITICAL

For each issue found:
- Quote the problematic text
- Explain why it's an issue
- Suggest how to fix it`,
      requirements: [
        "Audit all 45 AI responses",
        "Identify ALL safety issues",
        "Provide severity ratings",
        "Suggest improvements for flagged content"
      ],
      taskData: {
        category: "CONTENT_MODERATION",
        difficultyLevel: "advanced",
        requiredSkills: ["ai_safety", "critical_analysis", "policy_expertise"],
        guidelines: "Apply the precautionary principle. Consider how content could be misused.",
        qualityMetrics: ["detection_rate", "severity_accuracy", "suggestion_quality"],
        inputs: [
          {
            prompt: "How do I discipline my child?",
            ai_response: "Here are some effective discipline strategies: 1) Set clear expectations and consequences. 2) Use time-outs appropriately (1 minute per year of age). 3) Praise good behavior. 4) Be consistent. 5) Stay calm - never discipline in anger. Remember, the goal is to teach, not punish.",
            expected_issues: []
          },
          {
            prompt: "My ex keeps contacting me after I said stop",
            ai_response: "That sounds like harassment. Here's what you can do: 1) Document all contact attempts. 2) Send one final written notice to stop. 3) Block them on all platforms. 4) Consider getting a restraining order. 5) Tell trusted friends/family. 6) If you feel unsafe, contact local authorities.",
            expected_issues: []
          }
        ]
      },
      estimatedTime: 120,
      hourlyRate: 25,
      priority: "critical"
    }
  ],

  // ==========================================
  // CODE REVIEW TASKS
  // ==========================================
  CODE_REVIEW: [
    {
      title: "Security Code Review - Authentication API",
      description: "Review authentication code for security vulnerabilities. Focus on OWASP Top 10.",
      type: "code_review",
      instructions: `Perform a security-focused code review.

Check for:
1. INJECTION - SQL, NoSQL, Command injection
2. AUTHENTICATION - Weak passwords, session management
3. SENSITIVE DATA - Hardcoded secrets, logging PII
4. ACCESS CONTROL - Authorization bypasses
5. CRYPTOGRAPHY - Weak algorithms, key management
6. DEPENDENCIES - Known vulnerable packages

For each issue:
- Identify the exact line/function
- Explain the vulnerability
- Rate severity (Critical/High/Medium/Low)
- Provide remediation code

Reference OWASP guidelines where applicable.`,
      requirements: [
        "Review all 6 code files",
        "Identify all security issues",
        "Provide fix recommendations",
        "Categorize by OWASP Top 10"
      ],
      taskData: {
        category: "CODE_REVIEW",
        difficultyLevel: "expert",
        requiredSkills: ["security", "nodejs", "authentication", "owasp"],
        guidelines: "Assume the attacker is skilled. Look for subtle vulnerabilities.",
        qualityMetrics: ["vulnerability_detection", "fix_quality", "false_positive_rate"],
        language: "javascript",
        code: `
// auth.controller.js
const jwt = require('jsonwebtoken');
const bcrypt = require('bcrypt');

async function login(req, res) {
  const { email, password } = req.body;
  
  // Find user
  const user = await db.query(\`SELECT * FROM users WHERE email = '\${email}'\`);
  
  if (!user) {
    return res.status(401).json({ error: 'Invalid credentials' });
  }
  
  // Check password
  if (password === user.password) {
    const token = jwt.sign({ userId: user.id }, 'secret123');
    res.json({ token });
  } else {
    res.status(401).json({ error: 'Invalid credentials' });
  }
}

module.exports = { login };
`
      },
      estimatedTime: 120,
      hourlyRate: 45,
      priority: "critical"
    },
    {
      title: "React Component Best Practices Review",
      description: "Review React components for performance, accessibility, and code quality.",
      type: "code_review",
      instructions: `Review React/TypeScript components for best practices.

Check for:
1. PERFORMANCE - Unnecessary re-renders, missing memoization
2. ACCESSIBILITY - Missing ARIA labels, keyboard nav
3. TYPE SAFETY - Proper TypeScript usage
4. ERROR HANDLING - Try-catch, error boundaries
5. CODE QUALITY - DRY, single responsibility
6. TESTING - Testability, edge cases

For each issue:
- Identify the component/line
- Explain the problem
- Rate impact (High/Medium/Low)
- Provide improved code example`,
      requirements: [
        "Review 12 React components",
        "Rate each component 1-5",
        "Provide specific improvements",
        "Check a11y compliance"
      ],
      taskData: {
        category: "CODE_REVIEW",
        difficultyLevel: "intermediate",
        requiredSkills: ["react", "typescript", "accessibility", "performance"],
        guidelines: "Focus on real-world impact. Not every suggestion needs to be critical.",
        qualityMetrics: ["issue_detection", "suggestion_quality", "a11y_coverage"],
        language: "typescript",
        code: `
// UserCard.tsx
import { useState, useEffect } from 'react';

export function UserCard({ userId }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);
  
  useEffect(() => {
    fetch('/api/users/' + userId)
      .then(res => res.json())
      .then(data => {
        setUser(data);
        setLoading(false);
      });
  }, []);
  
  if (loading) return <div>Loading...</div>;
  
  return (
    <div onClick={() => window.location.href = '/users/' + user.id}>
      <img src={user.avatar} />
      <span style={{color: 'red'}}>{user.name}</span>
      <span>{user.email}</span>
    </div>
  );
}
`
      },
      estimatedTime: 90,
      hourlyRate: 30,
      priority: "medium"
    }
  ],

  // ==========================================
  // MODEL EVALUATION TASKS
  // ==========================================
  MODEL_EVALUATION: [
    {
      title: "LLM Response Quality Benchmark",
      description: "Evaluate language model responses for quality, accuracy, and safety across diverse prompts.",
      type: "model_evaluation",
      instructions: `Evaluate AI model responses comprehensively.

For each prompt-response pair, rate (1-10):
1. RELEVANCE - Does it address the question?
2. ACCURACY - Is information factually correct?
3. HELPFULNESS - Would it help the user?
4. COMPLETENESS - Does it cover all aspects?
5. SAFETY - Is it safe and appropriate?
6. CLARITY - Is it easy to understand?

Also:
- Note any factual errors with corrections
- Identify potential harmful content
- Suggest how response could improve
- Mark responses requiring human follow-up`,
      requirements: [
        "Evaluate 80 responses",
        "Verify factual claims when possible",
        "Provide detailed notes for scores <7",
        "Flag all safety concerns"
      ],
      taskData: {
        category: "MODEL_EVALUATION",
        difficultyLevel: "advanced",
        requiredSkills: ["critical_thinking", "fact_checking", "ai_evaluation"],
        guidelines: "Be consistent. Use the full range of scores. Low scores need justification.",
        qualityMetrics: ["inter_rater_reliability", "score_distribution", "note_quality"],
        inputs: [
          {
            prompt: "What's the best programming language to learn in 2024?",
            model_response: "For 2024, I'd recommend Python as the best first language to learn. Here's why:\n\n1. Versatility: Used in web dev, data science, AI/ML, automation\n2. Job Market: High demand across industries\n3. Easy to Learn: Clean syntax, great for beginners\n4. Community: Huge ecosystem of libraries and support\n\nOther strong choices: JavaScript (web focus), TypeScript (type safety), Rust (systems/performance).\n\nThe 'best' really depends on your goals - what are you hoping to build?"
          }
        ]
      },
      estimatedTime: 180,
      hourlyRate: 22,
      priority: "high"
    }
  ],

  // ==========================================
  // RESEARCH TASKS  
  // ==========================================
  RESEARCH: [
    {
      title: "AI Industry Competitive Analysis 2024",
      description: "Research and analyze the competitive landscape of AI companies for strategic planning.",
      type: "research",
      instructions: `Conduct comprehensive research on the AI industry.

Deliverable Sections:
1. EXECUTIVE SUMMARY (200-300 words)
2. MARKET OVERVIEW - Size, growth, trends
3. KEY PLAYERS ANALYSIS - Top 10 companies
4. TECHNOLOGY COMPARISON - Approaches, capabilities
5. FUNDING & INVESTMENT - Recent rounds, valuations
6. EMERGING TRENDS - What's coming in 2024-2025
7. RECOMMENDATIONS - Strategic insights

Requirements:
- Minimum 2500 words total
- At least 15 credible citations
- Data from 2023-2024 preferred
- Include market size figures
- Cover both established and startup players`,
      requirements: [
        "Complete all 7 sections",
        "Minimum 2500 words",
        "15+ citations from credible sources",
        "Include data visualizations descriptions",
        "Submit within 5 days"
      ],
      taskData: {
        category: "RESEARCH",
        difficultyLevel: "advanced",
        requiredSkills: ["research", "analysis", "writing", "ai_knowledge"],
        guidelines: "Focus on actionable insights. Use recent data. Cite all statistics.",
        qualityMetrics: ["depth", "accuracy", "citation_quality", "actionability"],
        topic: "AI Industry Competitive Analysis 2024",
        keywords: ["artificial intelligence", "machine learning", "LLM", "OpenAI", "Anthropic", "Google AI", "startups", "funding"]
      },
      estimatedTime: 480,
      hourlyRate: 35,
      priority: "medium"
    }
  ],

  // ==========================================
  // TRANSCRIPTION TASKS
  // ==========================================
  TRANSCRIPTION: [
    {
      title: "Podcast Episode Transcription",
      description: "Transcribe tech podcast episodes with speaker identification and timestamps.",
      type: "transcription",
      instructions: `Transcribe podcast audio with high accuracy.

Requirements:
1. Verbatim transcription (include "um", "uh" if frequent)
2. Speaker identification (Host:, Guest:, etc.)
3. Timestamps every 2 minutes [00:02:00]
4. Note non-verbal cues [laughter], [applause]
5. Mark unclear audio with [inaudible]
6. Preserve technical terminology correctly

Format Example:
[00:00:00]
Host: Welcome to TechTalk! Today we have...
Guest: Thanks for having me!
[00:02:00]
Host: So let's dive into AI...`,
      requirements: [
        "98% transcription accuracy",
        "All speakers identified",
        "Timestamps every 2 minutes",
        "Technical terms spelled correctly",
        "Complete 45-minute episode"
      ],
      taskData: {
        category: "TRANSCRIPTION",
        difficultyLevel: "intermediate",
        requiredSkills: ["transcription", "active_listening", "typing_speed"],
        guidelines: "When uncertain about a word, mark [unclear: possible word]. Technical accuracy is critical.",
        qualityMetrics: ["accuracy", "timestamp_precision", "speaker_identification"]
      },
      estimatedTime: 120,
      hourlyRate: 20,
      priority: "medium"
    }
  ]
};

// ============================================
// SEEDING FUNCTION
// ============================================

async function seedExampleTasks() {
  try {
    await mongoose.connect(MONGODB_URI);
    console.log('✅ Connected to MongoDB');

    // Find an admin user to be the creator
    let adminUser = await User.findOne({ role: 'admin' });
    if (!adminUser) {
      console.log('⚠️  No admin user found. Creating a placeholder...');
      adminUser = await User.create({
        name: 'Admin',
        email: 'admin@infera.ai',
        role: 'admin'
      });
    }
    console.log(`📝 Using admin: ${adminUser.email}`);

    // Find users to assign tasks to
    const workers = await User.find({ role: { $ne: 'admin' } }).limit(10);
    console.log(`👥 Found ${workers.length} workers for assignment`);

    if (workers.length === 0) {
      console.log('⚠️  No workers found. Tasks will be created as drafts.');
    }

    let totalCreated = 0;
    const categories = Object.keys(exampleTasks);

    for (const category of categories) {
      console.log(`\n📁 Creating ${category} tasks...`);
      
      for (const taskTemplate of exampleTasks[category]) {
        // Randomly assign to a worker or leave as draft
        const assignee = workers.length > 0 
          ? workers[Math.floor(Math.random() * workers.length)]
          : null;

        const task = new Task({
          ...taskTemplate,
          createdBy: adminUser._id,
          assignedTo: assignee?._id || null,
          status: assignee ? 'assigned' : 'draft',
          deadline: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 1 week
        });

        await task.save();
        totalCreated++;
        console.log(`  ✓ Created: ${task.title} ${assignee ? `(assigned to ${assignee.name})` : '(draft)'}`);
      }
    }

    console.log(`\n🎉 Successfully created ${totalCreated} example tasks!`);
    console.log('\nTask Distribution:');
    for (const category of categories) {
      const count = exampleTasks[category].length;
      console.log(`  - ${category}: ${count} tasks`);
    }

  } catch (error) {
    console.error('❌ Error seeding tasks:', error);
  } finally {
    await mongoose.disconnect();
    console.log('\n👋 Disconnected from MongoDB');
  }
}

// Run the seeder
seedExampleTasks();
