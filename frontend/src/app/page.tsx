"use client";

import { Header } from "../components/Header";
import { Hero } from "../components/Hero";
import { Features } from "../components/Features";
import { HowItWorks } from "../components/HowItWorks";
import { Opportunities } from "../components/Opportunities";
import { AllOpportunities } from "../components/AllOpportunities";
import { Testimonials } from "../components/Testimonials";
import { CTA } from "../components/CTA";
import { Footer } from "../components/Footer";
import { SignInDialog } from "../components/SignInDialog";
import { ApplyDialog } from "../components/ApplyDialog";
import { Dashboard } from "../components/Dashboard";
import { ApplicationsAdmin } from "../components/ApplicationsAdmin";
import { Toaster } from "../components/ui/sonner";
import { AuthProvider, useAuth } from "../utils/auth";
import { useState, useEffect } from "react";

type View = 'home' | 'dashboard' | 'all-opportunities' | 'admin';

function AppContent() {
  const { user } = useAuth();
  const [isSignInOpen, setIsSignInOpen] = useState(false);
  const [isApplyOpen, setIsApplyOpen] = useState(false);
  const [currentView, setCurrentView] = useState<View>('home');
  const [isAdminSignIn, setIsAdminSignIn] = useState(false); // Track if admin sign-in was requested

  useEffect(() => {
    // Listen for view all opportunities event
    const handleViewAllOpportunities = () => {
      setCurrentView('all-opportunities');
    };

    window.addEventListener('viewAllOpportunities', handleViewAllOpportunities);

    // Check for verification success in URL
    const urlParams = new URLSearchParams(window.location.search);
    if (urlParams.get('verified') === 'true') {
      setIsSignInOpen(true);
      // Clean up URL without the parameter
      window.history.replaceState({}, '', window.location.pathname);
    }

    return () => {
      window.removeEventListener('viewAllOpportunities', handleViewAllOpportunities);
    };
  }, []);

  const handleApplyClick = () => {
    if (user) {
      // User is signed in → Navigate to opportunities
      setCurrentView('all-opportunities');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // User not signed in → Show registration dialog
      setIsApplyOpen(true);
    }
  };

  const handleSignInClick = () => {
    setIsSignInOpen(true);
  };

  const handleDashboardClick = () => {
    if (!user) {
      // If user is not authenticated, show sign in dialog first
      setIsSignInOpen(true);
    } else {
      // User is authenticated, go to dashboard
      setCurrentView('dashboard');
    }
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    if (!user) {
      // If user is not authenticated, show admin sign in dialog
      setIsAdminSignIn(true);
      setIsSignInOpen(true);
    } else if (user.role === 'admin') {
      // User is authenticated and is admin, go to admin panel
      setCurrentView('admin');
      window.scrollTo({ top: 0, behavior: 'smooth' });
    } else {
      // User is authenticated but not admin, show error message
      alert('Access denied. Admin privileges required.');
    }
  };

  const handleSignInSuccess = (userData?: any) => {
    if (isAdminSignIn) {
      if (userData?.role === 'admin') {
        // If this was an admin sign-in request and user is admin, go to admin dashboard
        setCurrentView('admin');
        setIsAdminSignIn(false);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        // If admin sign-in was requested but user is not admin
        alert('Access denied. Admin privileges required to access the admin panel.');
        setCurrentView('dashboard');
        setIsAdminSignIn(false);
      }
    } else {
      // Normal user sign-in, go to regular dashboard
      setCurrentView('dashboard');
    }
  };

  return (
    <div className="min-h-screen">
      {currentView === 'home' && (
        <>
          <Header 
            onSignInClick={handleSignInClick} 
            onApplyClick={handleApplyClick} 
            onDashboardClick={handleDashboardClick}
          />
          <Hero 
            onGetStartedClick={handleApplyClick}
            onLearnMoreClick={() => {
              const element = document.getElementById('how-it-works');
              if (element) {
                element.scrollIntoView({ behavior: 'smooth', block: 'start' });
              }
            }}
          />
          <Features onApplyClick={handleApplyClick} />
          <HowItWorks onGetStartedClick={handleApplyClick} />
          <Opportunities onApplyClick={handleApplyClick} />
          <Testimonials />
          <CTA onGetStartedClick={handleApplyClick} />
          <Footer onApplyClick={handleApplyClick} onAdminClick={handleAdminClick} />
        </>
      )}

      {currentView === 'dashboard' && (
        <Dashboard onBack={handleBackToHome} />
      )}

      {currentView === 'all-opportunities' && (
        <AllOpportunities 
          onBack={handleBackToHome}
          onSignInClick={handleSignInClick}
          onApplyClick={handleApplyClick}
        />
      )}

      {currentView === 'admin' && (
        <ApplicationsAdmin onBack={handleBackToHome} />
      )}
      
      <SignInDialog 
        open={isSignInOpen} 
        onOpenChange={(open) => {
          setIsSignInOpen(open);
          if (!open) setIsAdminSignIn(false); // Reset admin flag when dialog closes
        }}
        onSignInSuccess={handleSignInSuccess}
        onSwitchToApply={() => setIsApplyOpen(true)}
        isAdminSignIn={isAdminSignIn}
      />
      <ApplyDialog 
        open={isApplyOpen} 
        onOpenChange={setIsApplyOpen}
        onSwitchToSignIn={() => setIsSignInOpen(true)}
      />
      <Toaster position="top-center" />
    </div>
  );
}

export default function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  );
}
