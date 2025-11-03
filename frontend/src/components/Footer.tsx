import { Facebook, Twitter, Linkedin, Instagram } from "lucide-react";
import { toast } from "sonner";
import { Logo } from "./Logo";

interface FooterProps {
  onApplyClick: () => void;
  onAdminClick?: () => void;
}

export function Footer({ onApplyClick, onAdminClick }: FooterProps) {
  const scrollToSection = (id: string) => {
    const element = document.getElementById(id);
    if (element) {
      element.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleSocialClick = (platform: string) => {
    toast.info(`${platform} page coming soon!`);
  };

  const handleComingSoon = (page: string) => {
    toast.info(`${page} page coming soon!`);
  };
  return (
    <footer className="bg-gray-900 text-gray-300">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div className="grid md:grid-cols-4 gap-8 mb-8">
          <div>
            <div className="mb-4">
              <Logo variant="white" size="md" />
            </div>
            <p className="text-gray-400 mb-4">
              Empowering experts worldwide to shape the future of AI.
            </p>
            <div className="flex gap-4">
              <button onClick={() => handleSocialClick('Facebook')} className="hover:text-blue-400 transition-colors">
                <Facebook className="h-5 w-5" />
              </button>
              <button onClick={() => handleSocialClick('Twitter')} className="hover:text-blue-400 transition-colors">
                <Twitter className="h-5 w-5" />
              </button>
              <button onClick={() => handleSocialClick('LinkedIn')} className="hover:text-blue-400 transition-colors">
                <Linkedin className="h-5 w-5" />
              </button>
              <button onClick={() => handleSocialClick('Instagram')} className="hover:text-blue-400 transition-colors">
                <Instagram className="h-5 w-5" />
              </button>
            </div>
          </div>

          <div>
            <h3 className="text-white mb-4">For Experts</h3>
            <ul className="space-y-2">
              <li><button onClick={onApplyClick} className="hover:text-blue-400 transition-colors">Apply Now</button></li>
              <li><button onClick={() => scrollToSection('how-it-works')} className="hover:text-blue-400 transition-colors">How It Works</button></li>
              <li><button onClick={() => scrollToSection('opportunities')} className="hover:text-blue-400 transition-colors">Opportunities</button></li>
              <li><button onClick={() => handleComingSoon('FAQ')} className="hover:text-blue-400 transition-colors">FAQ</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">For Businesses</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleComingSoon('Enterprise Solutions')} className="hover:text-blue-400 transition-colors">Enterprise Solutions</button></li>
              <li><button onClick={() => handleComingSoon('Case Studies')} className="hover:text-blue-400 transition-colors">Case Studies</button></li>
              <li><button onClick={() => handleComingSoon('Pricing')} className="hover:text-blue-400 transition-colors">Pricing</button></li>
              <li><button onClick={() => handleComingSoon('Contact Sales')} className="hover:text-blue-400 transition-colors">Contact Sales</button></li>
            </ul>
          </div>

          <div>
            <h3 className="text-white mb-4">Company</h3>
            <ul className="space-y-2">
              <li><button onClick={() => handleComingSoon('About Us')} className="hover:text-blue-400 transition-colors">About Us</button></li>
              <li><button onClick={() => handleComingSoon('Blog')} className="hover:text-blue-400 transition-colors">Blog</button></li>
              <li><button onClick={() => handleComingSoon('Careers')} className="hover:text-blue-400 transition-colors">Careers</button></li>
              <li><button onClick={() => handleComingSoon('Press')} className="hover:text-blue-400 transition-colors">Press</button></li>
            </ul>
          </div>
        </div>

        <div className="border-t border-gray-800 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p 
            className="text-gray-400 cursor-pointer hover:text-purple-400 transition-colors group" 
            onClick={() => onAdminClick?.()}
            title="Click to access Admin Panel"
          >
            © 2025 Infera AI. All rights reserved.
            <span className="text-xs text-purple-500 opacity-0 group-hover:opacity-100 transition-opacity ml-2">
              [Admin]
            </span>
          </p>
          <div className="flex gap-6 flex-wrap justify-center">
            <button onClick={() => handleComingSoon('Privacy Policy')} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Privacy Policy</button>
            <button onClick={() => handleComingSoon('Terms of Service')} className="text-gray-400 hover:text-blue-400 transition-colors text-sm">Terms of Service</button>
          </div>
        </div>
      </div>
    </footer>
  );
}
