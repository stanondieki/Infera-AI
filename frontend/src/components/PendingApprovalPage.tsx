'use client';

import React, { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, CheckCircle2, Mail, Phone, MessageSquare } from 'lucide-react';
import { useAuth } from '@/utils/auth';

export default function PendingApprovalPage() {
  const { user, logout } = useAuth();
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      setIsLoggingOut(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center p-4">
      <Card className="w-full max-w-2xl">
        <CardHeader className="text-center">
          <div className="w-20 h-20 mx-auto mb-6 rounded-full bg-yellow-100 flex items-center justify-center">
            <Clock className="w-10 h-10 text-yellow-600" />
          </div>
          <CardTitle className="text-2xl text-gray-900">Application Under Review</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Welcome Message */}
          <div className="text-center space-y-2">
            <p className="text-lg font-medium text-gray-900">
              Welcome, {user?.name}! 👋
            </p>
            <p className="text-gray-600">
              Thank you for joining Taskify. Your application is currently being reviewed by our team.
            </p>
          </div>

          {/* Status Steps */}
          <div className="space-y-4">
            <div className="flex items-center space-x-3 p-4 bg-green-50 rounded-lg border border-green-200">
              <CheckCircle2 className="w-6 h-6 text-green-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-green-900">Email Verified</p>
                <p className="text-sm text-green-700">Your email address has been confirmed</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-yellow-50 rounded-lg border border-yellow-200">
              <Clock className="w-6 h-6 text-yellow-600 flex-shrink-0" />
              <div>
                <p className="font-medium text-yellow-900">Application Review</p>
                <p className="text-sm text-yellow-700">Our team is reviewing your application</p>
              </div>
            </div>

            <div className="flex items-center space-x-3 p-4 bg-gray-50 rounded-lg border border-gray-200 opacity-60">
              <div className="w-6 h-6 bg-gray-300 rounded-full flex-shrink-0"></div>
              <div>
                <p className="font-medium text-gray-600">Account Approved</p>
                <p className="text-sm text-gray-500">Access to the full dashboard</p>
              </div>
            </div>
          </div>

          {/* What's Next */}
          <div className="bg-blue-50 rounded-lg p-6 border border-blue-200">
            <h3 className="font-semibold text-blue-900 mb-3">What happens next?</h3>
            <ul className="space-y-2 text-sm text-blue-800">
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>Our team will review your application within 24-48 hours</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>You'll receive an email notification once your account is approved</span>
              </li>
              <li className="flex items-start space-x-2">
                <span className="text-blue-600 mt-0.5">•</span>
                <span>After approval, you'll have full access to tasks and earning opportunities</span>
              </li>
            </ul>
          </div>

          {/* Contact Support */}
          <div className="border-t pt-6">
            <h3 className="font-semibold text-gray-900 mb-4">Need Help?</h3>
            <div className="grid md:grid-cols-3 gap-4">
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Mail className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Email Support</p>
                <p className="text-xs text-gray-600 mt-1">support@taskify.com</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <MessageSquare className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Live Chat</p>
                <p className="text-xs text-gray-600 mt-1">Available 9AM-6PM</p>
              </div>
              <div className="text-center p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <Phone className="w-6 h-6 text-gray-600 mx-auto mb-2" />
                <p className="text-sm font-medium text-gray-900">Phone</p>
                <p className="text-xs text-gray-600 mt-1">+1 (555) 123-4567</p>
              </div>
            </div>
          </div>

          {/* Logout Button */}
          <div className="pt-4 border-t">
            <Button 
              variant="outline" 
              onClick={handleLogout}
              disabled={isLoggingOut}
              className="w-full"
            >
              {isLoggingOut ? 'Signing out...' : 'Sign Out'}
            </Button>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}