export function WhyChoose() {
  const features = [
    {
      icon: "$",
      iconBg: "bg-green-500",
      tag: "Top Pay",
      tagColor: "bg-blue-100 text-blue-600",
      title: "Competitive Compensation",
      description: "Earn $15-50+ per hour based on your expertise and project complexity. Weekly payments directly to your account.",
      highlight: "$15-50/hr",
      highlightColor: "text-green-600",
      barColor: "bg-blue-500"
    },
    {
      icon: "⏰",
      iconBg: "bg-blue-500",
      tag: "Flexible",
      tagColor: "bg-purple-100 text-purple-600",
      title: "Ultimate Flexibility",
      description: "Work whenever and wherever you want. Choose projects that match your schedule and interests.",
      highlight: "24/7 Access",
      highlightColor: "text-blue-600",
      barColor: "bg-purple-500"
    },
    {
      icon: "🌍",
      iconBg: "bg-purple-500",
      tag: "Worldwide",
      tagColor: "bg-pink-100 text-pink-600",
      title: "Global Opportunities",
      description: "Access diverse AI training projects from companies worldwide. Work on cutting-edge technology from anywhere.",
      highlight: "120+ Countries",
      highlightColor: "text-purple-600",
      barColor: "bg-pink-500"
    },
    {
      icon: "🎓",
      iconBg: "bg-orange-500",
      tag: "Learn & Earn",
      tagColor: "bg-orange-100 text-orange-600",
      title: "Skill Development",
      description: "Enhance your expertise in AI, machine learning, and data science while earning. Get certified for completed projects.",
      highlight: "Free Training",
      highlightColor: "text-orange-600",
      barColor: "bg-orange-500"
    },
    {
      icon: "🔒",
      iconBg: "bg-purple-600",
      tag: "Secure",
      tagColor: "bg-indigo-100 text-indigo-600",
      title: "Secure Platform",
      description: "Your data and earnings are protected with enterprise-grade security. Transparent payment terms and support.",
      highlight: "Bank-Level",
      highlightColor: "text-purple-600",
      barColor: "bg-indigo-500"
    },
    {
      icon: "📈",
      iconBg: "bg-pink-500",
      tag: "Growth",
      tagColor: "bg-red-100 text-red-600",
      title: "Career Growth",
      description: "Build a portfolio of AI projects, gain recognition, and unlock higher-paying opportunities as you progress.",
      highlight: "Unlimited",
      highlightColor: "text-pink-600",
      barColor: "bg-red-500"
    }
  ];

  return (
    <section id="why-choose" className="py-16 bg-gradient-to-b from-gray-50 to-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-12">
          <div className="bg-gradient-to-r from-blue-500 to-purple-600 text-white px-4 py-2 rounded-full text-sm font-normal inline-flex items-center mb-6 shadow-lg">
            <span className="mr-2">✨</span>
            Why Choose Us
          </div>
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-800 mb-4">
            Why Choose <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium">Infera AI?</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto leading-relaxed">
            Join the leading platform for AI training and unlock opportunities that match your expertise and lifestyle
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {features.map((feature, index) => (
            <div 
              key={index}
              className="group bg-white rounded-3xl p-6 shadow-sm hover:shadow-xl transition-all duration-500 hover:-translate-y-2 border border-gray-50 hover:border-gray-100 relative overflow-hidden"
            >
              {/* Background Pattern */}
              <div className="absolute top-0 right-0 w-20 h-20 opacity-5 group-hover:opacity-10 transition-opacity duration-500">
                <div className={`w-full h-full ${feature.iconBg} rounded-full transform rotate-12 scale-150`}></div>
              </div>
              
              {/* Icon */}
              <div className={`w-14 h-14 ${feature.iconBg} rounded-2xl flex items-center justify-center mb-4 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                <span className="text-white text-xl">{feature.icon}</span>
              </div>
              
              {/* Tag */}
              <div className="mb-4">
                <span className={`${feature.tagColor} px-3 py-1.5 rounded-full text-xs font-normal`}>
                  {feature.tag}
                </span>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-normal text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                {feature.title}
              </h3>
              <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">
                {feature.description}
              </p>
              
              {/* Highlight */}
              <div className={`text-xl font-medium ${feature.highlightColor} mb-3 group-hover:scale-105 transition-transform duration-300`}>
                {feature.highlight}
              </div>
              
              {/* Enhanced Progress Bar */}
              <div className="w-full bg-gray-100 rounded-full h-1.5 mb-2">
                <div className={`h-1.5 ${feature.barColor} rounded-full transition-all duration-700 group-hover:w-full`} style={{width: '60%'}}></div>
              </div>
              
              {/* Subtle accent line */}
              <div className={`w-8 h-0.5 ${feature.barColor} rounded-full mt-2 group-hover:w-16 transition-all duration-500`}></div>
            </div>
          ))}
        </div>
        
        {/* Bottom accent */}
        <div className="text-center mt-12">
          <div className="inline-flex items-center space-x-2 text-gray-400 text-sm">
            <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
            <span className="font-light">Trusted by 10,000+ AI professionals worldwide</span>
            <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
          </div>
        </div>
      </div>
    </section>
  );
}