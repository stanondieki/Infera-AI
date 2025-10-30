export function Opportunities() {
  const categories = [
    { name: 'All', active: true },
    { name: 'Software Engineering', active: false },
    { name: 'AI/ML', active: false },
    { name: 'Data Science', active: false },
    { name: 'Writing & Editing', active: false },
    { name: 'Education', active: false },
    { name: 'Creative', active: false },
  ];

  const opportunities = [
    {
      category: 'Software Engineering',
      rate: '$40-60/hr',
      title: 'Code Review & Debugging',
      description: 'Review AI-generated code and provide feedback on quality, efficiency, and best practices.',
      skills: ['Python', 'JavaScript', 'Code Review'],
      color: 'blue'
    },
    {
      category: 'AI/ML',
      rate: '$35-50/hr',
      title: 'Prompt Engineering',
      description: 'Create and refine prompts to improve AI model responses and accuracy.',
      skills: ['LLMs', 'Natural Language', 'Testing'],
      color: 'purple'
    },
    {
      category: 'Data Science',
      rate: '$25-40/hr',
      title: 'Data Annotation',
      description: 'Label and categorize data to help train machine learning models with high accuracy.',
      skills: ['Attention to Detail', 'Classification', 'Quality Control'],
      color: 'green'
    },
    {
      category: 'Writing & Editing',
      rate: '$30-45/hr',
      title: 'Content Evaluation',
      description: 'Assess AI-generated content for accuracy, coherence, and appropriateness.',
      skills: ['Writing', 'Fact-Checking', 'Analysis'],
      color: 'orange'
    },
    {
      category: 'Education',
      rate: '$45-65/hr',
      title: 'Math & Science Tutoring',
      description: 'Help train AI models in mathematical reasoning and scientific problem-solving.',
      skills: ['Mathematics', 'Physics', 'Teaching'],
      color: 'blue'
    },
    {
      category: 'Creative',
      rate: '$35-55/hr',
      title: 'Creative Writing',
      description: 'Generate creative content and evaluate AI storytelling capabilities.',
      skills: ['Creative Writing', 'Storytelling', 'Editing'],
      color: 'pink'
    }
  ];

  return (
    <section className="py-20 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            Available Opportunities
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Explore diverse projects across multiple domains and skill levels
          </p>
        </div>

        {/* Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category) => (
            <button
              key={category.name}
              className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                category.active
                  ? 'bg-blue-500 text-white'
                  : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
              }`}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {opportunities.map((opportunity, index) => (
            <div key={index} className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Category and Rate */}
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-gray-600">
                  {opportunity.category}
                </span>
                <span className={`text-lg font-bold ${
                  opportunity.color === 'blue' ? 'text-blue-500' :
                  opportunity.color === 'purple' ? 'text-purple-500' :
                  opportunity.color === 'green' ? 'text-green-500' :
                  opportunity.color === 'orange' ? 'text-orange-500' :
                  opportunity.color === 'pink' ? 'text-pink-500' : 'text-blue-500'
                }`}>
                  {opportunity.rate}
                </span>
              </div>

              {/* Title */}
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                {opportunity.title}
              </h3>

              {/* Description */}
              <p className="text-gray-600 mb-4">
                {opportunity.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {opportunity.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Apply Button */}
              <button className="w-full bg-blue-500 hover:bg-blue-600 text-white py-3 rounded-xl font-medium transition-colors">
                Apply Now
              </button>
            </div>
          ))}
        </div>

        {/* View All Button */}
        <div className="text-center">
          <button className="bg-gray-100 hover:bg-gray-200 text-gray-700 px-8 py-3 rounded-xl font-medium transition-colors">
            View All Opportunities
          </button>
        </div>
      </div>
    </section>
  );
}