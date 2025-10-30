export function CTA() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-full px-4 py-2 inline-flex items-center">
              <span className="text-white text-sm font-medium">
                🚀 Start Your Journey Today
              </span>
            </div>
            
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl font-bold text-white leading-tight">
                Ready to Shape the Future of AI?
              </h2>
              
              <p className="text-lg text-blue-100 max-w-md">
                Join Infera AI today and become part of the global community shaping the future of artificial intelligence. Start earning within 24 hours.
              </p>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center justify-center">
                Get Started Free
                <span className="ml-2">→</span>
              </button>
              <div className="flex items-center space-x-4 text-white text-sm">
                <div className="flex items-center">
                  <span className="mr-2">💳</span>
                  No credit card required
                </div>
                <div className="flex items-center">
                  <span className="mr-2">❌</span>
                  Cancel anytime
                </div>
                <div className="flex items-center">
                  <span className="mr-2">🔒</span>
                  Secure & trusted platform
                </div>
              </div>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-2 gap-6 pt-8">
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  <div className="text-2xl font-bold text-white">50,000+</div>
                </div>
                <div className="text-blue-100 text-sm">Active Contributors</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🌍</span>
                  </div>
                  <div className="text-2xl font-bold text-white">120+</div>
                </div>
                <div className="text-blue-100 text-sm">Countries</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  <div className="text-2xl font-bold text-white">$25M+</div>
                </div>
                <div className="text-blue-100 text-sm">Total Earnings</div>
              </div>
              
              <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
                <div className="flex items-center mb-2">
                  <div className="w-8 h-8 bg-white/20 rounded-lg flex items-center justify-center mr-3">
                    <span className="text-white text-sm">🔒</span>
                  </div>
                  <div className="text-2xl font-bold text-white">98.5%</div>
                </div>
                <div className="text-blue-100 text-sm">Success Rate</div>
              </div>
            </div>
          </div>

          {/* Right Content - Team Image */}
          <div className="relative">
            <div className="bg-white/10 backdrop-blur-sm rounded-3xl p-8 border border-white/20">
              {/* Placeholder for team image */}
              <div className="aspect-square bg-gradient-to-br from-white/20 to-white/10 rounded-2xl flex items-center justify-center relative overflow-hidden">
                <div className="text-6xl mb-4">👨‍💼👩‍💼👨‍💻👩‍💻👨‍🔬</div>
                
                {/* Floating Elements */}
                <div className="absolute top-4 right-4 bg-white rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-sm font-bold text-blue-600 flex items-center">
                    <span className="mr-1">⚡</span>
                    24hr
                  </div>
                  <div className="text-xs text-gray-500">Quick Start</div>
                </div>
                
                <div className="absolute bottom-4 left-4 bg-green-500 rounded-lg px-3 py-2 shadow-lg">
                  <div className="text-sm font-bold text-white flex items-center">
                    <span className="mr-1">⭐</span>
                    4.9/5.0
                  </div>
                  <div className="text-xs text-green-100">Platform Rating</div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}