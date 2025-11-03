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

  useEffect(() => {
    // Listen for view all opportunities event
    const handleViewAllOpportunities = () => {
      setCurrentView('all-opportunities');
    };

    window.addEventListener('viewAllOpportunities', handleViewAllOpportunities);
    return () => {
      window.removeEventListener('viewAllOpportunities', handleViewAllOpportunities);
    };
  }, []);

  const handleApplyClick = () => {
    setIsApplyOpen(true);
  };

  const handleSignInClick = () => {
    setIsSignInOpen(true);
  };

  const handleDashboardClick = () => {
    setCurrentView('dashboard');
  };

  const handleBackToHome = () => {
    setCurrentView('home');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleAdminClick = () => {
    setCurrentView('admin');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignInSuccess = () => {
    setCurrentView('dashboard');
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
        />
      )}

      {currentView === 'admin' && (
        <ApplicationsAdmin onBack={handleBackToHome} />
      )}
      
      <SignInDialog 
        open={isSignInOpen} 
        onOpenChange={setIsSignInOpen}
        onSignInSuccess={handleSignInSuccess}
        onSwitchToApply={() => setIsApplyOpen(true)}
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
