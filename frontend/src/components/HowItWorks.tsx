export function HowItWorks() {
  const steps = [
    {
      number: 1,
      icon: "👤",
      time: "5 minutes",
      title: "Sign Up & Complete Profile",
      description: "Create your account in minutes and showcase your expertise. Tell us about your skills, experience, and areas of interest.",
      features: [
        "Quick registration",
        "Skill assessment", 
        "Profile verification"
      ],
      color: "blue",
      bgColor: "bg-blue-500",
      borderColor: "border-blue-200",
      timeColor: "text-blue-600"
    },
    {
      number: 2,
      icon: "📋",
      time: "1-2 hours",
      title: "Get Verified",
      description: "Complete a short qualification test to demonstrate your capabilities. This ensures you're matched with the right projects.",
      features: [
        "Skills test",
        "Background check",
        "Quality review"
      ],
      color: "purple",
      bgColor: "bg-purple-500",
      borderColor: "border-purple-200",
      timeColor: "text-purple-600"
    },
    {
      number: 3,
      icon: "💼",
      time: "Instant",
      title: "Choose Projects",
      description: "Browse available opportunities and select projects that match your skills and schedule. Start working immediately.",
      features: [
        "Diverse projects",
        "Flexible hours",
        "Real-time updates"
      ],
      color: "orange",
      bgColor: "bg-orange-500",
      borderColor: "border-orange-200",
      timeColor: "text-orange-600"
    },
    {
      number: 4,
      icon: "💰",
      time: "Weekly",
      title: "Earn & Grow",
      description: "Complete tasks, maintain high quality, and get paid weekly. Build your reputation and unlock premium opportunities.",
      features: [
        "Weekly payments",
        "Performance bonuses",
        "Career advancement"
      ],
      color: "green",
      bgColor: "bg-green-500",
      borderColor: "border-green-200",
      timeColor: "text-green-600"
    }
  ];

  return (
    <section id="how-it-works" className="py-16 bg-white">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-blue-50 text-blue-600 px-4 py-2 rounded-full text-sm font-normal inline-flex items-center mb-6">
            <span className="mr-2">📋</span>
            Simple Process
          </div>
          <h2 className="text-3xl lg:text-4xl font-normal text-gray-800 mb-4">
            How <span className="bg-gradient-to-r from-blue-500 to-purple-600 bg-clip-text text-transparent font-medium">It Works</span>
          </h2>
          <p className="text-base text-gray-500 max-w-2xl mx-auto font-light">
            Get started in just 4 simple steps and start earning within 24 hours
          </p>
        </div>

        {/* Steps Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
          {steps.map((step, index) => (
            <div key={index} className="group relative">
              {/* Connecting Line */}
              {index < steps.length - 1 && (
                <div className="hidden lg:block absolute top-20 -right-3 w-6 h-0.5 bg-gradient-to-r from-gray-200 to-gray-300 z-10">
                  <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-2 h-2 bg-gray-300 rounded-full"></div>
                </div>
              )}
              
              {/* Step Card */}
              <div className="bg-white rounded-3xl p-6 border border-gray-100 hover:border-gray-200 shadow-sm hover:shadow-lg transition-all duration-500 group-hover:-translate-y-2 relative overflow-hidden">
                {/* Step Number Badge */}
                <div className="absolute -top-3 left-6">
                  <div className={`w-10 h-10 ${step.bgColor} text-white rounded-2xl flex items-center justify-center font-medium text-sm shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    {step.number}
                  </div>
                </div>
                
                {/* Background Pattern */}
                <div className="absolute top-0 right-0 w-16 h-16 opacity-5 group-hover:opacity-10 transition-opacity">
                  <div className={`w-full h-full ${step.bgColor} rounded-full transform rotate-12`}></div>
                </div>
                
                {/* Icon */}
                <div className={`w-14 h-14 ${step.bgColor} rounded-2xl flex items-center justify-center mb-4 mt-3 shadow-md group-hover:scale-105 transition-transform duration-300`}>
                  <span className="text-white text-2xl">{step.icon}</span>
                </div>
                
                {/* Time Badge */}
                <div className="mb-4">
                  <span className={`${step.timeColor} bg-gray-50 px-3 py-1 rounded-full text-xs font-normal flex items-center w-fit`}>
                    <span className="mr-1">⏱</span>
                    {step.time}
                  </span>
                </div>
                
                {/* Content */}
                <h3 className="text-lg font-medium text-gray-800 mb-3 group-hover:text-gray-900 transition-colors">
                  {step.title}
                </h3>
                
                <p className="text-gray-500 text-sm leading-relaxed mb-6 font-light">
                  {step.description}
                </p>
                
                {/* Features List */}
                <div className="space-y-3">
                  {step.features.map((feature, featureIndex) => (
                    <div key={featureIndex} className="flex items-center text-gray-600 text-sm">
                      <div className="w-4 h-4 bg-green-500 rounded-full mr-3 flex items-center justify-center flex-shrink-0">
                        <span className="text-white text-xs">✓</span>
                      </div>
                      <span className="font-light">{feature}</span>
                    </div>
                  ))}
                </div>
                
                {/* Bottom accent */}
                <div className={`absolute bottom-0 left-0 w-0 h-1 ${step.bgColor} group-hover:w-full transition-all duration-700 rounded-b-3xl`}></div>
              </div>
            </div>
          ))}
        </div>

        {/* Enhanced Bottom Section */}
        <div className="bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 lg:p-12 text-center relative overflow-hidden">
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
            <div className="absolute bottom-10 right-10 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
            <div className="absolute top-1/2 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-ping"></div>
          </div>
          
          <div className="relative z-10">
            <h3 className="text-2xl lg:text-3xl font-normal text-white mb-4">
              Why Thousands Choose Us
            </h3>
            <p className="text-blue-100 mb-8 max-w-2xl mx-auto font-light">
              Join a thriving community of experts earning competitive income on their own terms
            </p>
            
            {/* Enhanced Stats */}
            <div className="grid md:grid-cols-3 gap-6">
              {[
                { icon: "⏰", stat: "24/7", label: "Flexible Schedule", color: "from-blue-400 to-blue-600" },
                { icon: "🔒", stat: "100%", label: "Secure Platform", color: "from-purple-400 to-purple-600" },
                { icon: "✓", stat: "98.5%", label: "Success Rate", color: "from-pink-400 to-pink-600" }
              ].map((item, index) => (
                <div key={index} className="group bg-white/10 backdrop-blur-lg rounded-2xl p-6 border border-white/20 hover:border-white/40 transition-all duration-300 hover:-translate-y-1">
                  <div className={`w-12 h-12 bg-gradient-to-br ${item.color} rounded-xl flex items-center justify-center mx-auto mb-3 shadow-lg group-hover:scale-110 transition-transform duration-300`}>
                    <span className="text-white text-xl">{item.icon}</span>
                  </div>
                  <div className="text-2xl font-medium text-white mb-1 group-hover:scale-105 transition-transform duration-300">{item.stat}</div>
                  <div className="text-blue-100 text-sm font-light">{item.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}