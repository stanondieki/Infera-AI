export function HowItWorks() {
  return (
    <section className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium inline-flex items-center mb-6">
            <span className="mr-2">📋</span>
            Simple Process
          </div>
          <h2 className="text-4xl lg:text-5xl font-bold text-gray-900 mb-4">
            How <span className="text-blue-500">It Works</span>
          </h2>
          <p className="text-lg text-gray-600 max-w-2xl mx-auto">
            Get started in just 4 simple steps and start earning within 24 hours
          </p>
        </div>

        {/* Steps */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Step 1 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Step Number */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-blue-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  1
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-blue-500 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <span className="text-white text-xl">👤</span>
              </div>
              
              {/* Time */}
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span className="mr-1">⏱</span>
                5 minutes
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Sign Up & Complete Profile
              </h3>
              
              <p className="text-gray-600 mb-4">
                Create your account in minutes and showcase your skills, experience, and areas of interest.
              </p>
              
              {/* Features */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Quick registration
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Skill assessment
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Profile verification
                </div>
              </div>
            </div>
            
            {/* Arrow for larger screens */}
            <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <div className="w-8 h-0.5 bg-blue-300"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-blue-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          </div>

          {/* Step 2 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Step Number */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-purple-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  2
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-purple-500 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <span className="text-white text-xl">📋</span>
              </div>
              
              {/* Time */}
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span className="mr-1">⏱</span>
                1-2 hours
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Get Verified
              </h3>
              
              <p className="text-gray-600 mb-4">
                Complete a short qualification test to demonstrate your capabilities. This ensures you're matched with the right projects.
              </p>
              
              {/* Features */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Skills test
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Background check
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Quality review
                </div>
              </div>
            </div>
            
            {/* Arrow for larger screens */}
            <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <div className="w-8 h-0.5 bg-purple-300"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-purple-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          </div>

          {/* Step 3 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Step Number */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-orange-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  3
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-orange-500 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <span className="text-white text-xl">💼</span>
              </div>
              
              {/* Time */}
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span className="mr-1">⏱</span>
                Instant
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Choose Projects
              </h3>
              
              <p className="text-gray-600 mb-4">
                Browse available opportunities and select projects that match your skills and schedule. Start working immediately.
              </p>
              
              {/* Features */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Diverse projects
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Flexible hours
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Real-time updates
                </div>
              </div>
            </div>
            
            {/* Arrow for larger screens */}
            <div className="hidden lg:block absolute top-1/2 -right-4 transform -translate-y-1/2">
              <div className="w-8 h-0.5 bg-orange-300"></div>
              <div className="absolute right-0 top-1/2 transform -translate-y-1/2 w-0 h-0 border-l-4 border-l-orange-300 border-t-2 border-b-2 border-t-transparent border-b-transparent"></div>
            </div>
          </div>

          {/* Step 4 */}
          <div className="relative">
            <div className="bg-white rounded-2xl p-6 border border-gray-100 hover:shadow-lg transition-shadow">
              {/* Step Number */}
              <div className="absolute -top-4 left-6">
                <div className="w-8 h-8 bg-green-500 text-white rounded-full flex items-center justify-center font-bold text-sm">
                  4
                </div>
              </div>
              
              {/* Icon */}
              <div className="w-12 h-12 bg-green-500 rounded-2xl flex items-center justify-center mb-4 mt-2">
                <span className="text-white text-xl">💰</span>
              </div>
              
              {/* Time */}
              <div className="text-xs text-gray-500 mb-2 flex items-center">
                <span className="mr-1">⏱</span>
                Weekly
              </div>
              
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                Earn & Grow
              </h3>
              
              <p className="text-gray-600 mb-4">
                Complete tasks, maintain high quality, and get paid weekly. Build your reputation and unlock premium opportunities.
              </p>
              
              {/* Features */}
              <div className="space-y-2 text-sm">
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Weekly payments
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Performance bonuses
                </div>
                <div className="flex items-center text-gray-700">
                  <div className="w-4 h-4 bg-green-500 rounded-full mr-2 flex items-center justify-center">
                    <span className="text-white text-xs">✓</span>
                  </div>
                  Career advancement
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500 rounded-3xl p-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Why Thousands Choose Us
          </h3>
          <p className="text-blue-100 mb-8 max-w-2xl mx-auto">
            Join a thriving community of experts earning competitive income on their own terms
          </p>
          
          {/* Stats */}
          <div className="grid grid-cols-3 gap-8">
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">⏰</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">24/7</div>
              <div className="text-blue-100 text-sm">Flexible Schedule</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">🔒</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">100%</div>
              <div className="text-blue-100 text-sm">Secure Platform</div>
            </div>
            
            <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20">
              <div className="w-12 h-12 bg-white/20 rounded-xl flex items-center justify-center mx-auto mb-3">
                <span className="text-white text-xl">✓</span>
              </div>
              <div className="text-2xl font-bold text-white mb-1">98.5%</div>
              <div className="text-blue-100 text-sm">Success Rate</div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}