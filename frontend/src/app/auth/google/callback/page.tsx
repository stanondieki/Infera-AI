"use client";

import { useEffect } from 'react';
import { useRouter, useSearchParams } from 'next/navigation';

export default function GoogleCallbackPage() {
  const router = useRouter();
  const searchParams = useSearchParams();

  useEffect(() => {
    // This page is opened in a popup, we just need to keep it open
    // so the parent window can read the URL parameters
    const code = searchParams?.get('code');
    const error = searchParams?.get('error');
    
    if (code || error) {
      // The parent window will detect this and handle the authentication
      // We can close this popup after a short delay
      setTimeout(() => {
        window.close();
      }, 1000);
    }
  }, [searchParams]);

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-50 to-purple-50">
      <div className="text-center">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-600 mx-auto mb-4"></div>
        <p className="text-gray-600">Completing sign-in...</p>
      </div>
    </div>
  );
}