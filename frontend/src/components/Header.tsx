import Link from 'next/link';
import Image from 'next/image';

export function Header() {
  return (
    <header className="w-full bg-white border-b border-gray-100">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex items-center">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 bg-gradient-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                <span className="text-white text-sm font-bold">I</span>
              </div>
              <span className="text-xl font-semibold text-gray-900">Infera AI</span>
            </div>
          </div>

          {/* Navigation */}
          <nav className="hidden md:flex items-center space-x-8">
            <Link href="#experts" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              For Experts
            </Link>
            <Link href="#opportunities" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Opportunities
            </Link>
            <Link href="#how-it-works" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              How It Works
            </Link>
            <Link href="#testimonials" className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Testimonials
            </Link>
          </nav>

          {/* Auth Buttons */}
          <div className="flex items-center space-x-4">
            <button className="text-gray-600 hover:text-gray-900 text-sm font-medium">
              Sign In
            </button>
            <button className="bg-blue-500 hover:bg-blue-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-colors">
              Apply Now
            </button>
          </div>
        </div>
      </div>
    </header>
  );
}