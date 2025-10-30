'use client';

import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  const scrollToSection = (sectionId: string) => {
    const element = document.getElementById(sectionId);
    if (element) {
      const headerHeight = 64; // 16 * 4 = 64px (h-16)
      const elementPosition = element.offsetTop - headerHeight;
      
      window.scrollTo({
        top: elementPosition,
        behavior: 'smooth',
      });
    }
  };

  return (
    <header className="w-full bg-white border-b border-gray-100 fixed top-0 z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <button 
              onClick={() => scrollToSection('hero')}
              className="flex items-center space-x-2"
            >
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">I</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Infera AI</span>
            </button>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <button 
              onClick={() => scrollToSection('why-choose')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Why Choose Us
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Testimonials
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('opportunities')}
              className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors"
            >
              Opportunities
            </button>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium transition-colors">
              Sign In
            </button>
            <button 
              onClick={() => scrollToSection('cta')}
              className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors"
            >
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}