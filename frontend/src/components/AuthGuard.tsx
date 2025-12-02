'use client';

import React from 'react';
import { useAuth } from '@/utils/auth';
import { useRouter, usePathname } from 'next/navigation';
import { useEffect } from 'react';
import PendingApprovalPage from './PendingApprovalPage';

interface AuthGuardProps {
  children: React.ReactNode;
}

export default function AuthGuard({ children }: AuthGuardProps) {
  const { user, isAuthenticated, isLoading } = useAuth();
  const router = useRouter();
  const pathname = usePathname();

  // Public routes that don't need authentication
  const publicRoutes = [
    '/',
    '/auth/signin',
    '/auth/signup', 
    '/auth/verify-email',
    '/auth/forgot-password',
    '/auth/reset-password',
    '/privacy',
    '/terms'
  ];

  const isPublicRoute = pathname ? publicRoutes.some(route => pathname.startsWith(route)) : false;

  useEffect(() => {
    // Don't redirect while loading or if pathname is null
    if (isLoading || !pathname) return;

    // If not authenticated and trying to access protected route
    if (!isAuthenticated && !isPublicRoute) {
      router.push('/auth/signin');
      return;
    }

    // If authenticated but on auth pages, redirect to appropriate page
    if (isAuthenticated && (pathname.startsWith('/auth/signin') || pathname.startsWith('/auth/signup'))) {
      // Check if user needs approval
      if (user?.approvalStatus === 'pending') {
        // Stay on pending approval page (will be handled below)
        return;
      }
      
      // Redirect approved users to dashboard
      router.push('/dashboard');
      return;
    }
  }, [isAuthenticated, isLoading, pathname, router, user]);

  // Show loading while auth state is being determined
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
      </div>
    );
  }

  // Show pending approval page for verified but unapproved users
  if (isAuthenticated && user?.approvalStatus === 'pending' && !isPublicRoute) {
    return <PendingApprovalPage />;
  }

  // Show rejected message for rejected users
  if (isAuthenticated && user?.approvalStatus === 'rejected' && !isPublicRoute) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center p-4">
        <div className="bg-white rounded-lg shadow-lg p-8 max-w-md text-center">
          <div className="text-red-500 text-6xl mb-4">❌</div>
          <h1 className="text-2xl font-bold text-gray-900 mb-4">Application Rejected</h1>
          <p className="text-gray-600 mb-6">
            Unfortunately, your application has been rejected. Please contact support for more information.
          </p>
          <button 
            onClick={() => router.push('/auth/signin')}
            className="bg-blue-600 text-white px-6 py-2 rounded-lg hover:bg-blue-700 transition-colors"
          >
            Back to Sign In
          </button>
        </div>
      </div>
    );
  }

  return <>{children}</>;
}