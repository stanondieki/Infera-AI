'use client';

export function CTA() {
  return (
    <section id="cta" className="py-24 bg-gradient-to-br from-blue-600 via-purple-600 to-indigo-800 relative overflow-hidden">
      {/* Background Effects */}
      <div className="absolute inset-0">
        <div className="absolute top-20 left-10 w-32 h-32 bg-white/10 rounded-full blur-xl animate-pulse"></div>
        <div className="absolute bottom-20 right-10 w-40 h-40 bg-purple-300/20 rounded-full blur-xl animate-pulse delay-300"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-60 h-60 bg-blue-300/10 rounded-full blur-2xl animate-pulse delay-700"></div>
        <div className="absolute top-10 right-1/4 w-20 h-20 bg-yellow-300/10 rounded-full blur-lg animate-float"></div>
        <div className="absolute bottom-10 left-1/4 w-24 h-24 bg-pink-300/10 rounded-full blur-lg animate-float delay-500"></div>
      </div>
      
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 relative z-10">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Left Content */}
          <div className="space-y-8">
            <div className="space-y-6">
              <h2 className="text-4xl lg:text-5xl xl:text-6xl font-bold text-white leading-tight">
                Ready to Shape the{' '}
                <span className="bg-gradient-to-r from-yellow-400 via-orange-500 to-red-500 bg-clip-text text-transparent animate-gradient">
                  Future of AI?
                </span>
              </h2>
              
              <p className="text-xl text-blue-100 leading-relaxed">
                Join thousands of innovators, creators, and AI enthusiasts who are building 
                the next generation of intelligent solutions. Start your journey today and be part of the AI revolution.
              </p>
            </div>
            
            {/* CTA Buttons */}
            <div className="flex flex-col sm:flex-row gap-4">
              <button className="group relative overflow-hidden bg-white text-blue-600 px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:scale-105 hover:shadow-2xl transform hover:-translate-y-1">
                <span className="relative z-10 flex items-center justify-center">
                  Start Building Now
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-yellow-400 to-orange-500 opacity-0 group-hover:opacity-20 transition-opacity duration-300"></div>
              </button>
              
              <button className="group border-2 border-white/30 text-white px-8 py-4 rounded-2xl font-bold text-lg transition-all duration-300 hover:bg-white/10 hover:border-white/50 hover:scale-105 transform hover:-translate-y-1">
                <span className="flex items-center justify-center">
                  Explore Platform
                  <svg className="ml-2 w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5l7 7-7 7" />
                  </svg>
                </span>
              </button>
            </div>
          </div>

          {/* Right Content - Team Meeting Visual */}
          <div className="relative">
            {/* Main Team Meeting Card */}
            <div className="relative bg-white/15 backdrop-blur-lg rounded-3xl p-8 border border-white/20 shadow-2xl">
              {/* Team Meeting Illustration */}
              <div className="aspect-[4/3] bg-gradient-to-br from-blue-50 to-indigo-100 rounded-2xl flex items-center justify-center relative overflow-hidden shadow-inner">
                {/* Team Meeting Visual */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-100 via-purple-50 to-indigo-100"></div>
                
                {/* Meeting Table */}
                <div className="relative w-full h-full flex items-center justify-center">
                  {/* Conference Table */}
                  <div className="absolute bottom-1/4 w-3/4 h-1/4 bg-gradient-to-r from-gray-300 to-gray-400 rounded-full transform perspective-1000 rotateX-60 shadow-lg"></div>
                  
                  {/* Team Members Around Table */}
                  <div className="relative z-10 grid grid-cols-3 gap-4 w-full h-full items-center justify-items-center p-8">
                    {/* Top Row */}
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-blue-400 to-blue-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">👨‍💼</div>
                      <div className="w-8 h-12 bg-gradient-to-b from-blue-500 to-blue-600 rounded-b-lg mt-1 shadow-md"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-purple-400 to-purple-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">👩‍💻</div>
                      <div className="w-8 h-12 bg-gradient-to-b from-purple-500 to-purple-600 rounded-b-lg mt-1 shadow-md"></div>
                    </div>
                    <div className="flex flex-col items-center">
                      <div className="w-12 h-12 bg-gradient-to-br from-green-400 to-green-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">👨‍🔬</div>
                      <div className="w-8 h-12 bg-gradient-to-b from-green-500 to-green-600 rounded-b-lg mt-1 shadow-md"></div>
                    </div>
                    
                    {/* Bottom Row */}
                    <div className="flex flex-col items-center col-start-1">
                      <div className="w-12 h-12 bg-gradient-to-br from-orange-400 to-orange-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">👩‍💼</div>
                      <div className="w-8 h-12 bg-gradient-to-b from-orange-500 to-orange-600 rounded-b-lg mt-1 shadow-md"></div>
                    </div>
                    <div className="flex flex-col items-center col-start-3">
                      <div className="w-12 h-12 bg-gradient-to-br from-pink-400 to-pink-600 rounded-full flex items-center justify-center text-white text-lg shadow-lg">👨‍💻</div>
                      <div className="w-8 h-12 bg-gradient-to-b from-pink-500 to-pink-600 rounded-b-lg mt-1 shadow-md"></div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Quick Start Badge */}
                <div className="absolute top-4 right-4 bg-white rounded-xl px-4 py-3 shadow-xl animate-float">
                  <div className="flex items-center space-x-2">
                    <div className="w-8 h-8 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center">
                      <svg className="w-4 h-4 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                      </svg>
                    </div>
                    <div>
                      <div className="text-sm font-bold text-gray-800">24hr</div>
                      <div className="text-xs text-gray-500">Quick Start</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Rating Badge */}
                <div className="absolute bottom-4 left-4 bg-gradient-to-r from-green-500 to-emerald-500 rounded-xl px-4 py-3 shadow-xl animate-float delay-700">
                  <div className="flex items-center space-x-2">
                    <div className="flex space-x-1">
                      {[...Array(5)].map((_, i) => (
                        <svg key={i} className="w-3 h-3 text-yellow-300 fill-current" viewBox="0 0 20 20">
                          <path d="M9.049 2.927c.3-.921 1.603-.921 1.902 0l1.07 3.292a1 1 0 00.95.69h3.462c.969 0 1.371 1.24.588 1.81l-2.8 2.034a1 1 0 00-.364 1.118l1.07 3.292c.3.921-.755 1.688-1.54 1.118l-2.8-2.034a1 1 0 00-1.175 0l-2.8 2.034c-.784.57-1.838-.197-1.539-1.118l1.07-3.292a1 1 0 00-.364-1.118L2.98 8.72c-.783-.57-.38-1.81.588-1.81h3.461a1 1 0 00.951-.69l1.07-3.292z" />
                        </svg>
                      ))}
                    </div>
                    <div>
                      <div className="text-sm font-bold text-white">4.9/5.0</div>
                      <div className="text-xs text-green-100">Platform Rating</div>
                    </div>
                  </div>
                </div>
                
                {/* Floating Success Badge */}
                <div className="absolute top-1/2 right-0 transform translate-x-1/2 bg-white rounded-xl px-3 py-2 shadow-xl animate-float delay-1000">
                  <div className="text-xs font-bold text-blue-600">98.5% Success</div>
                </div>
              </div>
            </div>
          </div>
        </div>
        
        {/* Stats Cards Grid */}
        <div className="mt-16 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-400 to-blue-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 20h5v-2a3 3 0 00-5.356-1.857M17 20H7m10 0v-2c0-.656-.126-1.283-.356-1.857M7 20H2v-2a3 3 0 015.356-1.857M7 20v-2c0-.656.126-1.283.356-1.857m0 0a5.002 5.002 0 019.288 0M15 7a3 3 0 11-6 0 3 3 0 016 0zm6 3a2 2 0 11-4 0 2 2 0 014 0zM7 10a2 2 0 11-4 0 2 2 0 014 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">50,000+</div>
            </div>
            <div className="text-blue-100 text-sm font-medium">Active Contributors</div>
          </div>
          
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-green-400 to-green-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">120+</div>
            </div>
            <div className="text-blue-100 text-sm font-medium">Countries</div>
          </div>
          
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-yellow-400 to-orange-500 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8c-1.657 0-3 .895-3 2s1.343 2 3 2 3 .895 3 2-1.343 2-3 2m0-8c1.11 0 2.08.402 2.599 1M12 8V7m0 1v8m0 0v1m0-1c-1.11 0-2.08-.402-2.599-1M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">$25M+</div>
            </div>
            <div className="text-blue-100 text-sm font-medium">Total Earnings</div>
          </div>
          
          <div className="group bg-white/10 backdrop-blur-sm rounded-2xl p-6 border border-white/20 hover:bg-white/15 transition-all duration-300 hover:scale-105 hover:shadow-xl">
            <div className="flex items-center mb-3">
              <div className="w-10 h-10 bg-gradient-to-br from-purple-400 to-purple-600 rounded-lg flex items-center justify-center mr-3 group-hover:scale-110 transition-transform duration-300">
                <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                </svg>
              </div>
              <div className="text-2xl font-bold text-white">98.5%</div>
            </div>
            <div className="text-blue-100 text-sm font-medium">Success Rate</div>
          </div>
        </div>
        
        {/* Trust Indicators */}
        <div className="mt-12 flex flex-wrap justify-center items-center gap-8 text-blue-100">
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">No credit card required</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            <span className="text-sm font-medium">Cancel anytime</span>
          </div>
          <div className="flex items-center space-x-2">
            <svg className="w-5 h-5 text-green-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
            </svg>
            <span className="text-sm font-medium">Secure & trusted platform</span>
          </div>
        </div>
      </div>
      
      {/* Custom Animations */}
      <style jsx>{`
        @keyframes float {
          0%, 100% { transform: translateY(0px); }
          50% { transform: translateY(-10px); }
        }
        
        @keyframes gradient {
          0%, 100% { background-position: 0% 50%; }
          50% { background-position: 100% 50%; }
        }
        
        .animate-float {
          animation: float 3s ease-in-out infinite;
        }
        
        .animate-gradient {
          background-size: 200% 200%;
          animation: gradient 3s ease infinite;
        }
        
        .perspective-1000 {
          perspective: 1000px;
        }
        
        .rotateX-60 {
          transform: rotateX(60deg);
        }
      `}</style>
    </section>
  );
}