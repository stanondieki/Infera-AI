// AI Training Task Templates

export const aiTrainingTaskTemplates = {
  // Computer Vision Tasks
  computer_vision: [
    {
      title: "Image Classification for Medical AI",
      type: "data_labeling",
      category: "computer_vision",
      difficultyLevel: "advanced",
      domainExpertise: "medical",
      requiredSkills: ["computer_vision", "medical_knowledge", "image_analysis"],
      taskData: {
        guidelines: "Classify medical images according to diagnostic criteria. Follow HIPAA guidelines and medical imaging standards.",
        qualityMetrics: ["Diagnostic accuracy", "Consistent labeling", "Attention to detail", "Medical terminology usage"],
        examples: [
          {
            input: "chest_xray_001.jpg",
            expectedOutput: "normal",
            explanation: "Clear lung fields, normal heart size, no pathological findings"
          }
        ]
      },
      annotationGuidelines: `
1. Review each medical image carefully for pathological findings
2. Use standardized medical terminology
3. Consider patient privacy and confidentiality
4. Cross-reference with provided medical criteria
5. Flag uncertain cases for expert review
      `,
      qualityStandards: [
        "95% diagnostic accuracy required",
        "Consistent terminology usage",
        "Complete annotation of all visible pathology",
        "Proper handling of edge cases"
      ],
      estimatedTime: 15, // minutes per task
      paymentPerTask: 8.50
    },
    {
      title: "Autonomous Vehicle Object Detection",
      type: "data_labeling", 
      category: "computer_vision",
      difficultyLevel: "intermediate",
      requiredSkills: ["computer_vision", "object_detection", "autonomous_systems"],
      taskData: {
        guidelines: "Annotate objects in driving scenarios for autonomous vehicle training. Focus on safety-critical objects.",
        qualityMetrics: ["Bounding box precision", "Object classification accuracy", "Occlusion handling", "Edge case identification"],
        examples: [
          {
            input: "street_scene_001.jpg",
            expectedOutput: {
              pedestrians: [{x: 150, y: 200, width: 40, height: 120, confidence: "high"}],
              vehicles: [{x: 300, y: 180, width: 200, height: 80, type: "sedan"}], 
              traffic_signs: [{x: 500, y: 50, width: 30, height: 30, type: "stop_sign"}]
            },
            explanation: "Comprehensive object detection in urban driving scenario"
          }
        ]
      },
      annotationGuidelines: `
1. Draw precise bounding boxes around all objects
2. Classify objects using provided taxonomy
3. Handle partial occlusion cases carefully
4. Mark uncertain objects for review
5. Pay special attention to safety-critical scenarios
      `,
      qualityStandards: [
        "90% bounding box IoU accuracy",
        "95% classification accuracy",
        "Complete annotation of safety-critical objects",
        "Proper handling of occlusions"
      ],
      estimatedTime: 12,
      paymentPerTask: 6.00
    }
  ],

  // Natural Language Processing Tasks
  natural_language: [
    {
      title: "Legal Document Analysis for AI Training",
      type: "content_generation",
      category: "natural_language",
      difficultyLevel: "expert", 
      domainExpertise: "legal",
      requiredSkills: ["legal_knowledge", "text_analysis", "nlp", "contract_law"],
      taskData: {
        guidelines: "Analyze legal documents and extract key information for AI model training. Maintain legal accuracy and confidentiality.",
        qualityMetrics: ["Legal accuracy", "Key information extraction", "Proper legal terminology", "Confidentiality compliance"],
        examples: [
          {
            input: "Sample contract clause about liability limitations...",
            expectedOutput: {
              clause_type: "liability_limitation",
              key_terms: ["mutual indemnification", "consequential damages", "limitation_cap"],
              enforceability: "likely_enforceable",
              jurisdiction: "delaware"
            }
          }
        ]
      },
      annotationGuidelines: `
1. Extract all relevant legal concepts and terms
2. Identify clause types and legal implications  
3. Assess enforceability under applicable law
4. Maintain client confidentiality at all times
5. Flag complex legal issues for expert review
      `,
      qualityStandards: [
        "98% legal accuracy required",
        "Complete extraction of key terms",
        "Proper legal classification",
        "Confidentiality compliance verified"
      ],
      estimatedTime: 25,
      paymentPerTask: 15.00
    },
    {
      title: "Conversational AI Response Evaluation",
      type: "quality_assessment",
      category: "natural_language", 
      difficultyLevel: "intermediate",
      requiredSkills: ["conversation_analysis", "ai_evaluation", "linguistics"],
      taskData: {
        guidelines: "Evaluate AI-generated responses for naturalness, relevance, and helpfulness. Rate according to conversation quality metrics.",
        qualityMetrics: ["Response relevance", "Conversational flow", "Factual accuracy", "Tone appropriateness"],
        examples: [
          {
            input: {
              context: "User asking for recipe recommendations",
              ai_response: "I'd be happy to suggest some delicious recipes! What type of cuisine are you interested in?"
            },
            expectedOutput: {
              relevance_score: 9,
              naturalness_score: 8,
              helpfulness_score: 7,
              overall_rating: 8,
              feedback: "Good engagement, could be more specific"
            }
          }
        ]
      },
      annotationGuidelines: `
1. Evaluate response quality on multiple dimensions
2. Consider context and conversation flow
3. Rate naturalness and human-like quality
4. Assess factual accuracy when applicable
5. Provide constructive feedback for improvement
      `,
      qualityStandards: [
        "Consistent rating methodology",
        "Detailed qualitative feedback", 
        "Inter-annotator agreement >85%",
        "Identification of edge cases"
      ],
      estimatedTime: 8,
      paymentPerTask: 4.50
    }
  ],

  // Multimodal AI Tasks
  multimodal: [
    {
      title: "Image-Text Alignment for Multimodal AI",
      type: "ai_training_data",
      category: "multimodal",
      difficultyLevel: "advanced",
      requiredSkills: ["multimodal_ai", "computer_vision", "nlp", "content_analysis"],
      taskData: {
        guidelines: "Evaluate alignment between images and text descriptions for multimodal AI training. Ensure semantic consistency.",
        qualityMetrics: ["Semantic alignment", "Descriptive accuracy", "Cultural sensitivity", "Bias identification"],
        examples: [
          {
            input: {
              image: "family_dinner_scene.jpg",
              text: "A happy family of four enjoying dinner together at home"
            },
            expectedOutput: {
              alignment_score: 9,
              accuracy_score: 8,
              issues_identified: [],
              improvement_suggestions: "Could specify evening time and dining room setting"
            }
          }
        ]
      },
      annotationGuidelines: `
1. Verify semantic consistency between image and text
2. Check for cultural biases or stereotypes
3. Evaluate descriptive completeness and accuracy
4. Identify potential ethical concerns
5. Suggest improvements for better alignment
      `,
      qualityStandards: [
        "95% semantic alignment accuracy",
        "Bias detection and flagging",
        "Cultural sensitivity verification",
        "Constructive improvement feedback"
      ],
      estimatedTime: 10,
      paymentPerTask: 7.25
    }
  ],

  // Content Generation Tasks  
  generative_ai: [
    {
      title: "Creative Writing for AI Training",
      type: "content_generation",
      category: "generative_ai", 
      difficultyLevel: "intermediate",
      domainExpertise: "creative_writing",
      requiredSkills: ["creative_writing", "storytelling", "content_creation"],
      taskData: {
        guidelines: "Create high-quality creative content for AI model training. Focus on originality, coherence, and engaging narratives.",
        qualityMetrics: ["Originality", "Narrative coherence", "Engaging style", "Grammar and syntax"],
        examples: [
          {
            input: "Write a short story about artificial intelligence discovering emotions",
            expectedOutput: "A well-structured 500-word story with clear beginning, middle, end, character development, and emotional depth"
          }
        ]
      },
      annotationGuidelines: `
1. Ensure original, non-plagiarized content
2. Maintain narrative coherence and flow
3. Use engaging and appropriate writing style
4. Follow provided content guidelines and themes
5. Proofread for grammar and clarity
      `,
      qualityStandards: [
        "100% original content verification",
        "Strong narrative structure",
        "Engaging and appropriate tone",
        "Error-free grammar and syntax"
      ],
      estimatedTime: 30,
      paymentPerTask: 18.00
    }
  ]
};

export const getTaskTemplatesByCategory = (category: string) => {
  return aiTrainingTaskTemplates[category as keyof typeof aiTrainingTaskTemplates] || [];
};

export const getAllTaskTemplates = () => {
  return Object.values(aiTrainingTaskTemplates).flat();
};

export const getRandomTaskTemplate = (category?: string) => {
  const templates = category ? getTaskTemplatesByCategory(category) : getAllTaskTemplates();
  return templates[Math.floor(Math.random() * templates.length)];
};