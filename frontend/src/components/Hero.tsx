import Image from 'next/image';
import { Header } from './Header';

export function Hero() {
  return (
    <section id="hero" className="min-h-screen bg-gray-50">
      <Header />
      
      {/* Blue badge */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-8">
        <div className="flex justify-start">
          <div className="bg-blue-100 text-blue-600 px-3 py-1 rounded-full text-sm font-medium flex items-center">
            <span className="mr-2">🚀</span>
            Join the Future of AI Training
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 lg:py-16">
        <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-start">
          {/* Left Content */}
          <div className="space-y-6 lg:space-y-8">
            <div className="space-y-4 lg:space-y-6">
              <h1 className="font-light text-gray-900 leading-tight" style={{ fontFamily: "'Poppins', sans-serif" }}>
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-1 lg:mb-2">Shape the</div>
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-1 lg:mb-2">Future</div>
                <div className="text-4xl sm:text-5xl lg:text-6xl mb-1 lg:mb-2">of</div>
                <div className="text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Artificial
                </div>
                <div className="text-4xl sm:text-5xl lg:text-6xl bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Intelligence
                </div>
              </h1>
              
              <p className="text-lg text-gray-600 max-w-lg leading-relaxed">
                Join Infera AI and help train the world's most advanced AI models. Work on your schedule, earn competitive rates, and contribute to cutting-edge technology.
              </p>
            </div>

            {/* Features */}
            <div className="flex flex-wrap gap-3 lg:gap-6">
              <div className="flex items-center text-gray-700 bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm text-sm lg:text-base">
                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full mr-2 lg:mr-3 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Flexible Schedule
              </div>
              <div className="flex items-center text-gray-700 bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm text-sm lg:text-base">
                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full mr-2 lg:mr-3 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Global Opportunities
              </div>
              <div className="flex items-center text-gray-700 bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm text-sm lg:text-base">
                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full mr-2 lg:mr-3 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Competitive Pay
              </div>
              <div className="flex items-center text-gray-700 bg-white px-3 lg:px-4 py-2 rounded-full shadow-sm text-sm lg:text-base">
                <div className="w-4 h-4 lg:w-5 lg:h-5 bg-green-500 rounded-full mr-2 lg:mr-3 flex items-center justify-center">
                  <span className="text-white text-xs">✓</span>
                </div>
                Expert Community
              </div>
            </div>

            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4 pt-4">
              <button className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 rounded-xl font-semibold flex items-center justify-center transition-all duration-300 transform hover:scale-105 shadow-lg hover:shadow-xl">
                <span className="mr-2">🚀</span>
                Get Started Today
                <span className="ml-2">→</span>
              </button>
              <button className="border-2 border-gray-300 text-gray-700 px-8 py-4 rounded-xl font-medium flex items-center justify-center hover:bg-gray-50 hover:border-gray-400 transition-all duration-300 group">
                <span className="mr-2 group-hover:scale-110 transition-transform">▶</span>
                Watch Demo
                <span className="ml-2 text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">2 min</span>
              </button>
            </div>

            {/* Trust Indicators */}
            <div className="pt-6">
              <div className="flex flex-wrap items-center gap-4 text-sm text-gray-600">
                <div className="flex items-center space-x-2">
                  <span className="text-green-500">✓</span>
                  <span>No credit card required</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-blue-500">🛡️</span>
                  <span>Bank-level security</span>
                </div>
                <div className="flex items-center space-x-2">
                  <span className="text-purple-500">⭐</span>
                  <span>4.9/5 rating (2,500+ reviews)</span>
                </div>
              </div>
            </div>

            {/* Quick Value Proposition */}
            <div className="bg-blue-50 border border-blue-200 rounded-xl p-4 mt-6">
              <div className="flex items-start space-x-3">
                <div className="w-8 h-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0">
                  <span className="text-white text-sm">💡</span>
                </div>
                <div>
                  <h3 className="font-semibold text-gray-900 mb-1">Start earning in 24 hours</h3>
                  <p className="text-sm text-gray-600">Complete verification, choose projects, and begin contributing to AI development immediately.</p>
                </div>
              </div>
            </div>
          </div>

          {/* Right Content - Robot Image with Stats */}
          <div className="relative space-y-11">
            <div className="bg-gradient-to-br from-blue-100 via-purple-100 to-pink-100 rounded-3xl relative overflow-hidden h-64 sm:h-80 lg:h-96 xl:h-[700px]">
              {/* Robot image covering entire card */}
              <Image
                src="/images/home/Robot.jpg"
                alt="AI Robot Illustration"
                fill
                className="object-cover rounded-3xl"
                priority
              />
              
              {/* Average Rate Card */}
              <div className="absolute top-4 right-4 bg-white rounded-xl p-3 shadow-lg z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-purple-600 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">$45/hr</div>
                    <div className="text-xs text-gray-500">Average Rate</div>
                  </div>
                </div>
              </div>
              
              {/* Success Rate Card */}
              <div className="absolute bottom-4 left-4 bg-white rounded-xl p-3 shadow-lg z-10">
                <div className="flex items-center space-x-2">
                  <div className="w-8 h-8 bg-green-500 rounded-full flex items-center justify-center">
                    <span className="text-white text-sm">✓</span>
                  </div>
                  <div>
                    <div className="text-lg font-bold text-gray-900">98.5%</div>
                    <div className="text-xs text-gray-500">Success Rate</div>
                  </div>
                </div>
              </div>
              
              {/* Decorative elements */}
              <div className="absolute top-16 left-8 w-3 h-3 bg-blue-400 rounded-full opacity-60 z-10"></div>
              <div className="absolute top-32 right-16 w-2 h-2 bg-purple-400 rounded-full opacity-60 z-10"></div>
              <div className="absolute bottom-20 right-8 w-4 h-4 bg-pink-400 rounded-full opacity-60 z-10"></div>
            </div>

            {/* Compact Stats - Now on the right side */}
            <div className="bg-white rounded-xl shadow-md p-4">
              <div className="grid grid-cols-3 gap-4 text-center">
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-purple-500 to-purple-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                    <span className="text-white text-sm">👥</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>50k+</div>
                  <div className="text-gray-600 text-xs font-medium">Contributors</div>
                </div>
                
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                    <span className="text-white text-sm">🌍</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>120+</div>
                  <div className="text-gray-600 text-xs font-medium">Countries</div>
                </div>
                
                <div className="group hover:scale-105 transition-all duration-300">
                  <div className="w-10 h-10 bg-gradient-to-br from-green-500 to-green-600 rounded-xl flex items-center justify-center mx-auto mb-2 shadow-md">
                    <span className="text-white text-sm">💰</span>
                  </div>
                  <div className="text-xl font-bold text-gray-900 mb-1" style={{ fontFamily: "'Poppins', sans-serif" }}>$25M+</div>
                  <div className="text-gray-600 text-xs font-medium">Paid Out</div>
                </div>
              </div>
              
              {/* Compact Features Row */}
              <div className="mt-4 pt-3 border-t border-gray-100">
                <div className="flex justify-center space-x-6 text-xs text-gray-600">
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-green-500 rounded-full"></span>
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
                    <span>Fast Pay</span>
                  </div>
                  <div className="flex items-center space-x-1">
                    <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
                    <span>24/7 Support</span>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}