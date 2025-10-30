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
      title: 'Code Review & Quality Assurance',
      description: 'Review AI-generated code and provide detailed feedback on quality, efficiency, and industry best practices.',
      skills: ['Python', 'JavaScript', 'Code Review'],
      color: 'blue',
      bgColor: 'bg-blue-500',
      bgLight: 'bg-blue-50',
      textColor: 'text-blue-600',
      icon: '💻'
    },
    {
      category: 'AI/ML',
      rate: '$35-50/hr',
      title: 'Prompt Engineering & Optimization',
      description: 'Create and refine sophisticated prompts to improve AI model responses and accuracy across various tasks.',
      skills: ['LLMs', 'Natural Language', 'Testing'],
      color: 'purple',
      bgColor: 'bg-purple-500',
      bgLight: 'bg-purple-50',
      textColor: 'text-purple-600',
      icon: '🤖'
    },
    {
      category: 'Data Science',
      rate: '$25-40/hr',
      title: 'Data Annotation & Labeling',
      description: 'Label and categorize complex datasets to help train machine learning models with exceptional accuracy.',
      skills: ['Attention to Detail', 'Classification', 'Quality Control'],
      color: 'green',
      bgColor: 'bg-green-500',
      bgLight: 'bg-green-50',
      textColor: 'text-green-600',
      icon: '📊'
    },
    {
      category: 'Writing & Editing',
      rate: '$30-45/hr',
      title: 'Content Evaluation & Analysis',
      description: 'Assess AI-generated content for accuracy, coherence, tone, and appropriateness across multiple domains.',
      skills: ['Writing', 'Fact-Checking', 'Analysis'],
      color: 'orange',
      bgColor: 'bg-orange-500',
      bgLight: 'bg-orange-50',
      textColor: 'text-orange-600',
      icon: '✍️'
    },
    {
      category: 'Education',
      rate: '$45-65/hr',
      title: 'STEM Tutoring & Problem Solving',
      description: 'Help train AI models in mathematical reasoning, scientific problem-solving, and educational methodology.',
      skills: ['Mathematics', 'Physics', 'Teaching'],
      color: 'blue',
      bgColor: 'bg-indigo-500',
      bgLight: 'bg-indigo-50',
      textColor: 'text-indigo-600',
      icon: '🎓'
    },
    {
      category: 'Creative',
      rate: '$35-55/hr',
      title: 'Creative Writing & Storytelling',
      description: 'Generate engaging creative content and evaluate AI storytelling capabilities across different genres.',
      skills: ['Creative Writing', 'Storytelling', 'Editing'],
      color: 'pink',
      bgColor: 'bg-pink-500',
      bgLight: 'bg-pink-50',
      textColor: 'text-pink-600',
      icon: '🎨'
    }
  ];

  return (
    <section id="opportunities" className="py-20 bg-white relative overflow-hidden">
      {/* Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-20 right-20 w-32 h-32 bg-blue-100 rounded-full opacity-50"></div>
        <div className="absolute bottom-20 left-20 w-24 h-24 bg-purple-100 rounded-full opacity-30"></div>
        <div className="absolute top-1/2 left-1/4 w-16 h-16 bg-pink-100 rounded-full opacity-40"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-12">
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-800 mb-4">
            Available <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium">Opportunities</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Explore diverse projects across multiple domains and skill levels
          </p>
        </div>

        {/* Enhanced Category Filter */}
        <div className="flex flex-wrap justify-center gap-3 mb-12">
          {categories.map((category, index) => (
            <button
              key={category.name}
              className={`group px-5 py-2.5 rounded-full text-sm font-normal transition-all duration-300 ${
                category.active
                  ? 'bg-gradient-to-r from-blue-500 to-purple-600 text-white shadow-lg'
                  : 'bg-white text-gray-600 hover:bg-gray-50 border border-gray-200 hover:border-gray-300 hover:shadow-sm'
              }`}
              style={{
                animationDelay: `${index * 50}ms`
              }}
            >
              {category.name}
            </button>
          ))}
        </div>

        {/* Enhanced Opportunities Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 mb-12">
          {opportunities.map((opportunity, index) => (
            <div 
              key={index} 
              className="group bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 relative overflow-hidden"
              style={{
                animationDelay: `${index * 100}ms`
              }}
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity">
                <div className={`w-full h-full ${opportunity.bgColor} rounded-full transform rotate-12`}></div>
              </div>

              {/* Category Badge and Rate */}
              <div className="flex items-center justify-between mb-4">
                <div className="flex items-center space-x-2">
                  <span className="text-2xl">{opportunity.icon}</span>
                  <span className="text-sm font-normal text-gray-500">
                    {opportunity.category}
                  </span>
                </div>
                <div className={`${opportunity.bgLight} ${opportunity.textColor} px-3 py-1 rounded-full`}>
                  <span className="text-sm font-medium">{opportunity.rate}</span>
                </div>
              </div>

              {/* Title */}
              <h3 className="text-lg font-medium text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                {opportunity.title}
              </h3>

              {/* Description */}
              <p className="text-gray-500 text-sm leading-relaxed mb-5 font-light">
                {opportunity.description}
              </p>

              {/* Skills */}
              <div className="flex flex-wrap gap-2 mb-6">
                {opportunity.skills.map((skill, skillIndex) => (
                  <span
                    key={skillIndex}
                    className="bg-gray-50 text-gray-600 px-3 py-1.5 rounded-full text-xs font-normal hover:bg-gray-100 transition-colors"
                  >
                    {skill}
                  </span>
                ))}
              </div>

              {/* Enhanced Apply Button */}
              <button className={`group/btn w-full ${opportunity.bgColor} hover:scale-105 text-white py-3 rounded-2xl font-medium transition-all duration-300 flex items-center justify-center space-x-2 shadow-lg hover:shadow-xl relative overflow-hidden`}>
                <span className="relative z-10">Apply Now</span>
                <span className="relative z-10 group-hover/btn:translate-x-1 transition-transform duration-300">→</span>
                
                {/* Button shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent transform -skew-x-12 -translate-x-full group-hover/btn:translate-x-full transition-transform duration-700"></div>
              </button>

              {/* Bottom accent */}
              <div className={`absolute bottom-0 left-0 w-0 h-1 ${opportunity.bgColor} group-hover:w-full transition-all duration-700 rounded-b-3xl`}></div>
            </div>
          ))}
        </div>

        {/* Enhanced View All Button */}
        <div className="text-center">
          <button className="group bg-white hover:bg-gray-50 text-gray-700 px-8 py-3 rounded-2xl font-medium transition-all duration-300 border border-gray-200 hover:border-gray-300 hover:shadow-lg flex items-center space-x-2 mx-auto">
            <span>View All Opportunities</span>
            <span className="group-hover:translate-x-1 transition-transform duration-300">→</span>
          </button>
        </div>
      </div>
    </section>
  );
}