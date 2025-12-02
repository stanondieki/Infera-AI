'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Mail, ArrowLeft, CheckCircle2 } from 'lucide-react';
import Link from 'next/link';
import { toast } from 'sonner';

export default function ResendVerificationPage() {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const router = useRouter();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!email.trim()) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch('/api/auth/resend-verification', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email: email.trim() }),
      });

      const data = await response.json();

      if (data.success) {
        setIsSuccess(true);
        toast.success('Verification email sent successfully!');
      } else {
        toast.error(data.message || 'Failed to send verification email');
      }
    } catch (error) {
      console.error('Resend verification error:', error);
      toast.error('An error occurred. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-green-100 flex items-center justify-center">
              <CheckCircle2 className="w-8 h-8 text-green-600" />
            </div>
            <CardTitle>Verification Email Sent!</CardTitle>
          </CardHeader>
          <CardContent className="text-center space-y-4">
            <p className="text-gray-600">
              We've sent a new verification email to <strong>{email}</strong>. Please check your inbox and click the verification link.
            </p>
            
            <div className="bg-blue-50 rounded-lg p-4 border border-blue-200">
              <p className="text-blue-800 text-sm">
                <strong>Didn't receive the email?</strong> Check your spam folder or wait a few minutes and try again.
              </p>
            </div>

            <div className="space-y-2">
              <Button asChild className="w-full">
                <Link href="/auth/signin">Back to Sign In</Link>
              </Button>
              <Button 
                variant="ghost" 
                className="w-full"
                onClick={() => {
                  setIsSuccess(false);
                  setEmail('');
                }}
              >
                Send to Different Email
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-md">
        <CardHeader className="text-center">
          <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-blue-100 flex items-center justify-center">
            <Mail className="w-8 h-8 text-blue-600" />
          </div>
          <CardTitle>Resend Verification Email</CardTitle>
          <p className="text-sm text-gray-600 mt-2">
            Enter your email address to receive a new verification link
          </p>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-4">
            <div className="space-y-2">
              <Label htmlFor="email">Email Address</Label>
              <Input
                id="email"
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="Enter your email"
                required
                disabled={isLoading}
              />
            </div>

            <Button 
              type="submit" 
              className="w-full" 
              disabled={isLoading}
            >
              {isLoading ? 'Sending...' : 'Send Verification Email'}
            </Button>

            <div className="text-center">
              <Button asChild variant="ghost" size="sm">
                <Link href="/auth/signin" className="inline-flex items-center gap-2">
                  <ArrowLeft className="w-4 h-4" />
                  Back to Sign In
                </Link>
              </Button>
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}