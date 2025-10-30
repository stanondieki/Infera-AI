import express from 'express';

const router = express.Router();

// Get all projects
router.get('/', async (req, res) => {
  try {
    // Mock project data matching the opportunities from the screenshots
    const projects = [
      {
        id: 1,
        title: 'Code Review & Debugging',
        category: 'Software Engineering',
        rate: '$40-60/hr',
        description: 'Review AI-generated code and provide feedback on quality, efficiency, and best practices.',
        skills: ['Python', 'JavaScript', 'Code Review'],
        available: true
      },
      {
        id: 2,
        title: 'Prompt Engineering',
        category: 'AI/ML',
        rate: '$35-50/hr',
        description: 'Create and refine prompts to improve AI model responses and accuracy.',
        skills: ['LLMs', 'Natural Language', 'Testing'],
        available: true
      },
      {
        id: 3,
        title: 'Data Annotation',
        category: 'Data Science',
        rate: '$25-40/hr',
        description: 'Label and categorize data to help train machine learning models with high accuracy.',
        skills: ['Attention to Detail', 'Classification', 'Quality Control'],
        available: true
      },
      {
        id: 4,
        title: 'Content Evaluation',
        category: 'Writing & Editing',
        rate: '$30-45/hr',
        description: 'Assess AI-generated content for accuracy, coherence, and appropriateness.',
        skills: ['Writing', 'Fact-Checking', 'Analysis'],
        available: true
      },
      {
        id: 5,
        title: 'Math & Science Tutoring',
        category: 'Education',
        rate: '$45-65/hr',
        description: 'Help train AI models in mathematical reasoning and scientific problem-solving.',
        skills: ['Mathematics', 'Physics', 'Teaching'],
        available: true
      },
      {
        id: 6,
        title: 'Creative Writing',
        category: 'Creative',
        rate: '$35-55/hr',
        description: 'Generate creative content and evaluate AI storytelling capabilities.',
        skills: ['Creative Writing', 'Storytelling', 'Editing'],
        available: true
      }
    ];

    res.json(projects);
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

// Apply to a project
router.post('/:id/apply', async (req, res) => {
  try {
    const { id } = req.params;
    const { userId, coverLetter } = req.body;

    // Mock application process
    res.json({ 
      message: 'Application submitted successfully',
      projectId: id,
      status: 'pending'
    });
  } catch (error) {
    res.status(500).json({ message: 'Server error' });
  }
});

module.exports = router;