export function Benefits() {
  const benefits = [
    {
      icon: "👥",
      title: "Expert Community",
      description: "Join 50,000+ professionals",
      gradient: "from-blue-400 to-blue-600"
    },
    {
      icon: "⚡",
      title: "Fast Onboarding", 
      description: "Start earning within 24 hours",
      gradient: "from-purple-400 to-purple-600"
    },
    {
      icon: "💝",
      title: "Supportive Team",
      description: "24/7 dedicated support",
      gradient: "from-pink-400 to-pink-600"
    },
    {
      icon: "⭐",
      title: "Recognition Program",
      description: "Earn badges and rewards",
      gradient: "from-yellow-400 to-orange-500"
    }
  ];

  return (
    <section id="benefits" className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0">
        <div className="absolute top-10 left-10 w-20 h-20 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute top-40 right-20 w-16 h-16 bg-white/10 rounded-full animate-bounce"></div>
        <div className="absolute bottom-20 left-1/4 w-12 h-12 bg-white/5 rounded-full animate-pulse"></div>
        <div className="absolute bottom-40 right-1/3 w-8 h-8 bg-white/10 rounded-full animate-ping"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-3xl lg:text-4xl font-normal text-white mb-4">
            More Reasons to Join Today
          </h2>
          <p className="text-base text-blue-100 max-w-2xl mx-auto font-light">
            Experience the benefits that set Infera AI apart from other platforms
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
          {benefits.map((benefit, index) => (
            <div 
              key={index}
              className="group relative bg-white/10 backdrop-blur-lg rounded-3xl p-8 text-center border border-white/20 hover:border-white/40 transition-all duration-500 hover:-translate-y-3 hover:bg-white/15"
              style={{
                animationDelay: `${index * 150}ms`
              }}
            >
              {/* Glow Effect */}
              <div className="absolute inset-0 rounded-3xl bg-gradient-to-br from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
              
              {/* Icon Container */}
              <div className="relative mb-6">
                <div className={`w-20 h-20 bg-gradient-to-br ${benefit.gradient} rounded-2xl flex items-center justify-center mx-auto shadow-lg group-hover:scale-110 group-hover:rotate-6 transition-all duration-500`}>
                  <span className="text-white text-3xl">{benefit.icon}</span>
                </div>
                {/* Floating indicator */}
                <div className="absolute -top-2 -right-2 w-6 h-6 bg-white/30 rounded-full opacity-0 group-hover:opacity-100 animate-pulse transition-opacity duration-500"></div>
              </div>
              
              {/* Content */}
              <h3 className="text-lg font-medium text-white mb-3 group-hover:text-blue-100 transition-colors">
                {benefit.title}
              </h3>
              <p className="text-blue-100 text-sm font-light leading-relaxed">
                {benefit.description}
              </p>
              
              {/* Bottom accent line */}
              <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 w-0 h-1 bg-gradient-to-r from-blue-400 to-pink-400 rounded-full group-hover:w-16 transition-all duration-700"></div>
            </div>
          ))}
        </div>

        {/* Enhanced CTA Button */}
        <div className="text-center">
          <div className="inline-block relative group">
            {/* Button glow */}
            <div className="absolute -inset-1 bg-gradient-to-r from-blue-400 via-purple-400 to-pink-400 rounded-2xl blur opacity-25 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"></div>
            
            <button className="relative bg-white text-blue-600 px-10 py-4 rounded-xl font-medium text-lg hover:bg-gray-50 transition-all duration-300 inline-flex items-center shadow-2xl group-hover:scale-105 group-hover:shadow-3xl">
              <span className="mr-3">Start Your Journey</span>
              <span className="text-xl group-hover:translate-x-1 transition-transform duration-300">🚀</span>
              
              {/* Sparkle effects */}
              <div className="absolute -top-1 -right-1 w-3 h-3 bg-yellow-400 rounded-full opacity-0 group-hover:opacity-100 animate-ping"></div>
              <div className="absolute -bottom-1 -left-1 w-2 h-2 bg-pink-400 rounded-full opacity-0 group-hover:opacity-100 animate-pulse"></div>
            </button>
          </div>
          
          {/* Trust indicators */}
          <div className="mt-8 flex justify-center items-center space-x-8 text-white/70 text-sm">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
              <span className="font-light">Instant Access</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-400 rounded-full animate-pulse"></div>
              <span className="font-light">No Setup Fees</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-purple-400 rounded-full animate-pulse"></div>
              <span className="font-light">Cancel Anytime</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}