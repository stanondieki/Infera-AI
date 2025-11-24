import { Button } from "./ui/button";
import { Menu, X, User, Shield } from "lucide-react";
import { useState } from "react";
import { useAuth } from "../utils/auth";
import { Logo } from "./Logo";

interface HeaderProps {
  onSignInClick: () => void;
  onApplyClick: () => void;
  onDashboardClick?: () => void;
}

export function Header({ onSignInClick, onApplyClick, onDashboardClick }: HeaderProps) {
  const { user } = useAuth();
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
      setIsMenuOpen(false);
    }
  };

  return (
    <header className="bg-white border-b sticky top-0 z-50 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          <button 
            onClick={() => window.scrollTo({ top: 0, behavior: 'smooth' })}
            className="hover:opacity-80 transition-opacity"
          >
            <Logo size="md" />
          </button>

          {/* Desktop Navigation */}
          <nav className="hidden md:flex items-center gap-8">
            <button 
              onClick={() => scrollToSection('features')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              For Experts
            </button>
            <button 
              onClick={() => scrollToSection('opportunities')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Opportunities
            </button>
            <button 
              onClick={() => scrollToSection('how-it-works')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              How It Works
            </button>
            <button 
              onClick={() => scrollToSection('testimonials')}
              className="text-gray-700 hover:text-blue-600 transition-colors"
            >
              Testimonials
            </button>
          </nav>

          <div className="hidden md:flex items-center gap-4">
            {user ? (
              <>
                <Button 
                  variant="ghost" 
                  onClick={onDashboardClick}
                  className="flex items-center gap-2"
                >
                  {user.role === 'admin' ? (
                    <>
                      <Shield className="h-4 w-4 text-purple-600" />
                      <span className="text-purple-600">{user.name}</span>
                    </>
                  ) : (
                    <>
                      <User className="h-4 w-4" />
                      {user.name}
                    </>
                  )}
                </Button>
                {user.role !== 'admin' && (
                  <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApplyClick}>
                    {user ? "View Opportunities" : "Apply Now"}
                  </Button>
                )}
              </>
            ) : (
              <>
                <Button variant="ghost" onClick={onSignInClick}>Sign In</Button>
                <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApplyClick}>
                  Apply Now
                </Button>
              </>
            )}
          </div>

          {/* Mobile menu button */}
          <button 
            className="md:hidden"
            onClick={() => setIsMenuOpen(!isMenuOpen)}
          >
            {isMenuOpen ? <X className="h-6 w-6" /> : <Menu className="h-6 w-6" />}
          </button>
        </div>

        {/* Mobile Navigation */}
        {isMenuOpen && (
          <div className="md:hidden py-4 border-t">
            <nav className="flex flex-col gap-4">
              <button 
                onClick={() => scrollToSection('features')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                For Experts
              </button>
              <button 
                onClick={() => scrollToSection('opportunities')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Opportunities
              </button>
              <button 
                onClick={() => scrollToSection('how-it-works')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                How It Works
              </button>
              <button 
                onClick={() => scrollToSection('testimonials')}
                className="text-left text-gray-700 hover:text-blue-600 transition-colors"
              >
                Testimonials
              </button>
              <div className="flex flex-col gap-2 pt-4">
                {user ? (
                  <>
                    <Button 
                      variant="ghost" 
                      onClick={onDashboardClick}
                      className="flex items-center gap-2"
                    >
                      {user.role === 'admin' ? (
                        <>
                          <Shield className="h-4 w-4 text-purple-600" />
                          <span className="text-purple-600">{user.name}</span>
                        </>
                      ) : (
                        <>
                          <User className="h-4 w-4" />
                          {user.name}
                        </>
                      )}
                    </Button>
                    {user.role !== 'admin' && (
                      <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApplyClick}>
                        View Opportunities
                      </Button>
                    )}
                  </>
                ) : (
                  <>
                    <Button variant="ghost" onClick={onSignInClick}>Sign In</Button>
                    <Button className="bg-blue-600 hover:bg-blue-700" onClick={onApplyClick}>
                      Apply Now
                    </Button>
                  </>
                )}
              </div>
            </nav>
          </div>
        )}
      </div>
    </header>
  );
}
