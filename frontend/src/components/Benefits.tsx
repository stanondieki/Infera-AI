export function Benefits() {
  return (
    <section className="py-20 bg-gradient-to-br from-blue-500 via-purple-500 to-pink-500">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Header */}
        <div className="text-center mb-16">
          <h2 className="text-4xl lg:text-5xl font-bold text-white mb-4">
            More Reasons to Join Today
          </h2>
          <p className="text-lg text-blue-100 max-w-2xl mx-auto">
            Experience the benefits that set Infera AI apart from other platforms
          </p>
        </div>

        {/* Benefits Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
          {/* Expert Community */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">👥</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Expert Community
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Join 50,000+ professionals
            </p>
          </div>

          {/* Fast Onboarding */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⚡</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Fast Onboarding
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Start earning within 24 hours
            </p>
          </div>

          {/* Supportive Team */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">💝</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Supportive Team
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              24/7 dedicated support
            </p>
          </div>

          {/* Recognition Program */}
          <div className="bg-white/10 backdrop-blur-sm rounded-2xl p-6 text-center border border-white/20">
            <div className="w-16 h-16 bg-white/20 rounded-2xl flex items-center justify-center mx-auto mb-4">
              <span className="text-white text-2xl">⭐</span>
            </div>
            <h3 className="text-xl font-semibold text-white mb-2">
              Recognition Program
            </h3>
            <p className="text-blue-100 text-sm mb-4">
              Earn badges and rewards
            </p>
          </div>
        </div>

        {/* CTA Button */}
        <div className="text-center">
          <button className="bg-white text-blue-600 px-8 py-4 rounded-xl font-semibold text-lg hover:bg-gray-50 transition-colors inline-flex items-center">
            Start Your Journey
            <span className="ml-2">🚀</span>
          </button>
        </div>
      </div>
    </section>
  );
}