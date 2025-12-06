'use client';

import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { Button } from './ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Badge } from './ui/badge';
import { useAuth } from '../utils/auth';
import { apiClient } from '../utils/api';
import { 
  Clock, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Shield,
  FileText,
  User,
  Calendar,
  LogOut,
  Home,
  RefreshCw,
  HelpCircle,
  ExternalLink,
  Bell,
  Settings,
  ChevronRight,
  Star,
  Zap,
  Globe
} from 'lucide-react';

interface ApplicationStatus {
  status: string;
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

interface VerificationPendingDashboardProps {
  onBack: () => void;
}

export default function VerificationPendingDashboard({ onBack }: VerificationPendingDashboardProps) {
  const { user, signOut } = useAuth();
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [loadingApplication, setLoadingApplication] = useState(false);

  const getStatusColor = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'pending':
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      case 'pending':
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status: string | undefined) => {
    switch (status) {
      case 'approved':
        return 'Approved';
      case 'rejected':
        return 'Rejected';
      case 'pending':
      default:
        return 'Pending Review';
    }
  };

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        setLoadingApplication(true);
        const response = await apiClient.get('/api/applications/status');
        if (response.data) {
          setApplicationStatus(response.data);
        }
      } catch (error) {
        console.error('Error fetching application status:', error);
      } finally {
        setLoadingApplication(false);
      }
    };

    if (user) {
      fetchApplicationStatus();
    }
  }, [user]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Enhanced Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          {/* Top Navigation Bar */}
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center space-x-4">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <div className="hidden md:flex items-center text-sm text-gray-500">
                <span>Dashboard</span>
                <ChevronRight className="h-4 w-4 mx-1" />
                <span className="text-gray-900 font-medium">Account Verification</span>
              </div>
            </div>
            
            {/* Right side navigation */}
            <div className="flex items-center gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex hover:bg-gray-100 transition-colors"
                title="Refresh Status"
                onClick={() => window.location.reload()}
              >
                <RefreshCw className="h-4 w-4" />
              </Button>
              
              <Button
                variant="ghost"
                size="sm"
                className="hidden md:flex hover:bg-gray-100 transition-colors"
                title="Help & Support"
              >
                <HelpCircle className="h-4 w-4" />
              </Button>

              {/* User Menu */}
              <div className="relative ml-4 pl-4 border-l border-gray-200">
                <Button
                  variant="ghost"
                  className="flex items-center gap-3 hover:bg-gray-50 transition-colors p-2"
                  onClick={() => {
                    const dropdown = document.getElementById('user-dropdown');
                    if (dropdown) {
                      dropdown.classList.toggle('hidden');
                    }
                  }}
                >
                  <div className="text-right hidden sm:block">
                    <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                    <p className="text-xs text-gray-500">{user?.email}</p>
                  </div>
                  <div className="h-9 w-9 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-lg">
                    <User className="h-5 w-5 text-white" />
                  </div>
                  <ChevronRight className="h-4 w-4 text-gray-400 transform rotate-90" />
                </Button>

                {/* Dropdown Menu */}
                <div
                  id="user-dropdown"
                  className="hidden absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-gray-200 z-50"
                >
                  <div className="py-2">
                    <div className="px-4 py-2 border-b border-gray-100">
                      <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                      <p className="text-xs text-gray-500">{user?.email}</p>
                    </div>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Account Settings
                    </Button>
                    <Button
                      variant="ghost"
                      className="w-full justify-start px-4 py-2 text-sm text-red-600 hover:bg-red-50"
                      onClick={() => {
                        signOut();
                        onBack();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Sign Out
                    </Button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Enhanced Status Card */}
          <Card className="mb-8 shadow-2xl bg-gradient-to-br from-white via-blue-50/30 to-purple-50/30 backdrop-blur-xl border-0 overflow-hidden relative">
            {/* Background decoration */}
            <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-blue-400/10 to-purple-400/10 rounded-full -translate-y-16 translate-x-16"></div>
            <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-pink-400/10 to-yellow-400/10 rounded-full translate-y-12 -translate-x-12"></div>
            
            <CardHeader className="text-center pb-6 relative z-10">
              <motion.div
                initial={{ scale: 0.8, rotate: -10 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ duration: 0.6, delay: 0.2, type: "spring" }}
                className="mx-auto mb-6 h-24 w-24 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 flex items-center justify-center shadow-2xl relative"
              >
                <Shield className="h-12 w-12 text-white" />
                <motion.div
                  animate={{ scale: [1, 1.2, 1] }}
                  transition={{ duration: 2, repeat: Infinity, delay: 1 }}
                  className="absolute inset-0 rounded-full bg-gradient-to-r from-blue-500 via-purple-500 to-pink-500 opacity-20"
                ></motion.div>
              </motion.div>
              
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.4 }}
              >
                <CardTitle className="text-3xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-3">
                  Account Verification in Progress
                </CardTitle>
                <CardDescription className="text-gray-600 max-w-2xl mx-auto text-lg leading-relaxed">
                  Your application is being carefully reviewed by our team. We'll notify you as soon as the verification process is complete.
                </CardDescription>
              </motion.div>
            </CardHeader>
            
            <CardContent className="text-center pb-8 relative z-10">
              <motion.div
                initial={{ opacity: 0, scale: 0.9 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.5, delay: 0.6 }}
              >
                <Badge className={`${getStatusColor(user?.approvalStatus)} gap-3 px-6 py-3 text-base font-medium shadow-lg`}>
                  {getStatusIcon(user?.approvalStatus)}
                  {getStatusText(user?.approvalStatus)}
                </Badge>
              </motion.div>
              
              {/* Progress indicator */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="mt-6 max-w-md mx-auto"
              >
                <div className="flex items-center justify-between text-xs text-gray-500 mb-2">
                  <span>Application Submitted</span>
                  <span>Under Review</span>
                  <span>Approved</span>
                </div>
                <div className="w-full bg-gray-200 rounded-full h-2">
                  <motion.div
                    initial={{ width: "0%" }}
                    animate={{ width: "66%" }}
                    transition={{ duration: 1, delay: 1 }}
                    className="bg-gradient-to-r from-blue-500 to-purple-500 h-2 rounded-full relative"
                  >
                    <div className="absolute right-0 top-1/2 transform translate-x-1/2 -translate-y-1/2 w-3 h-3 bg-white border-2 border-purple-500 rounded-full"></div>
                  </motion.div>
                </div>
              </motion.div>
            </CardContent>
          </Card>

          {/* Quick Actions Panel */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mb-8"
          >
            <Card className="shadow-xl bg-white/90 backdrop-blur-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2 text-lg">
                  <Zap className="h-5 w-5 text-blue-600" />
                  Quick Actions
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <Button
                    variant="ghost"
                    className="h-20 flex-col gap-2 hover:bg-blue-50 hover:text-blue-600 transition-all duration-200"
                    onClick={() => window.location.reload()}
                  >
                    <RefreshCw className="h-6 w-6" />
                    <span className="text-xs">Refresh Status</span>
                  </Button>
                  
                  <Link href="/contact-sales">
                    <Button
                      variant="ghost"
                      className="h-20 flex-col gap-2 hover:bg-green-50 hover:text-green-600 transition-all duration-200"
                    >
                      <Mail className="h-6 w-6" />
                      <span className="text-xs">Contact Support</span>
                    </Button>
                  </Link>
                  
                  <Link href="/faq">
                    <Button
                      variant="ghost"
                      className="h-20 flex-col gap-2 hover:bg-purple-50 hover:text-purple-600 transition-all duration-200"
                    >
                      <HelpCircle className="h-6 w-6" />
                      <span className="text-xs">Help Center</span>
                    </Button>
                  </Link>
                  
                  <Button
                    variant="ghost"
                    className="h-20 flex-col gap-2 hover:bg-orange-50 hover:text-orange-600 transition-all duration-200"
                    onClick={() => {
                      signOut();
                      onBack();
                    }}
                  >
                    <LogOut className="h-6 w-6" />
                    <span className="text-xs">Switch Account</span>
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Information Grid */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Enhanced Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="shadow-xl bg-gradient-to-br from-white to-blue-50/30 backdrop-blur-xl border-0 h-full overflow-hidden relative">
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-blue-400/10 to-green-400/10 rounded-full -translate-y-10 translate-x-10"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-full bg-gradient-to-r from-blue-500 to-green-500">
                      <CheckCircle className="h-5 w-5 text-white" />
                    </div>
                    What Happens Next?
                  </CardTitle>
                </CardHeader>
                
                <CardContent className="space-y-5 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">1</span>
                      </div>
                      <div className="w-0.5 h-8 bg-gradient-to-b from-blue-500 to-purple-500 mt-1"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Application Review</p>
                      <p className="text-xs text-gray-600 mt-1">Our expert team carefully reviews your profile and qualifications</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="flex items-start gap-4"
                  >
                    <div className="flex flex-col items-center">
                      <div className="h-8 w-8 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 flex items-center justify-center">
                        <span className="text-white text-sm font-semibold">2</span>
                      </div>
                      <div className="w-0.5 h-8 bg-gradient-to-b from-purple-500 to-pink-500 mt-1"></div>
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Email Notification</p>
                      <p className="text-xs text-gray-600 mt-1">You'll receive an instant notification within 24-48 hours</p>
                    </div>
                  </motion.div>
                  
                  <motion.div
                    initial={{ opacity: 0, x: -10 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="flex items-start gap-4"
                  >
                    <div className="h-8 w-8 rounded-full bg-gradient-to-r from-green-500 to-emerald-500 flex items-center justify-center">
                      <Star className="h-4 w-4 text-white" />
                    </div>
                    <div>
                      <p className="text-sm font-semibold text-gray-900">Full Platform Access</p>
                      <p className="text-xs text-gray-600 mt-1">Unlock all features and start your earning journey</p>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Enhanced Tips & Resources */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.5 }}
            >
              <Card className="shadow-xl bg-gradient-to-br from-white to-purple-50/30 backdrop-blur-xl border-0 h-full overflow-hidden relative">
                <div className="absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr from-purple-400/10 to-pink-400/10 rounded-full translate-y-12 -translate-x-12"></div>
                
                <CardHeader className="relative z-10">
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <div className="p-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500">
                      <FileText className="h-5 w-5 text-white" />
                    </div>
                    Maximize Your Success
                  </CardTitle>
                  <CardDescription className="text-gray-600">
                    Prepare for approval with these actionable tips
                  </CardDescription>
                </CardHeader>
                
                <CardContent className="space-y-4 relative z-10">
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.6 }}
                    className="p-4 bg-gradient-to-r from-blue-50 to-blue-100/50 rounded-xl border border-blue-200/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-blue-500">
                        <User className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-blue-900">Complete Your Profile</p>
                        <p className="text-xs text-blue-700 mt-1">Add skills, experience, and portfolio to showcase your expertise</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.7 }}
                    className="p-4 bg-gradient-to-r from-green-50 to-emerald-100/50 rounded-xl border border-green-200/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-green-500">
                        <Globe className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-green-900">Explore Opportunities</p>
                        <p className="text-xs text-green-700 mt-1">Browse available projects and understand market demands</p>
                      </div>
                    </div>
                  </motion.div>

                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: 0.8 }}
                    className="p-4 bg-gradient-to-r from-purple-50 to-pink-100/50 rounded-xl border border-purple-200/50 hover:shadow-md transition-shadow"
                  >
                    <div className="flex items-start gap-3">
                      <div className="p-1 rounded-full bg-purple-500">
                        <Star className="h-3 w-3 text-white" />
                      </div>
                      <div>
                        <p className="text-sm font-semibold text-purple-900">Join Our Community</p>
                        <p className="text-xs text-purple-700 mt-1">Connect with professionals and get insider tips</p>
                      </div>
                    </div>
                  </motion.div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Application Status */}
          {applicationStatus && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="mb-8"
            >
              <Card className="shadow-xl bg-white/80 backdrop-blur-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <FileText className="h-5 w-5 text-gray-600" />
                    Application Status
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <p className="text-sm font-medium text-gray-900">Status</p>
                      <Badge className={`${getStatusColor(applicationStatus.status)} text-xs mt-1`}>
                        {getStatusText(applicationStatus.status)}
                      </Badge>
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Submitted</p>
                      <p className="text-sm text-gray-600 flex items-center gap-1">
                        <Calendar className="h-3 w-3" />
                        {new Date(applicationStatus.submittedAt).toLocaleDateString()}
                      </p>
                    </div>
                    {applicationStatus.reviewedAt && (
                      <div>
                        <p className="text-sm font-medium text-gray-900">Reviewed</p>
                        <p className="text-sm text-gray-600 flex items-center gap-1">
                          <Calendar className="h-3 w-3" />
                          {new Date(applicationStatus.reviewedAt).toLocaleDateString()}
                        </p>
                      </div>
                    )}
                    {applicationStatus.reviewNotes && (
                      <div className="sm:col-span-2">
                        <p className="text-sm font-medium text-gray-900">Review Notes</p>
                        <p className="text-sm text-gray-600 mt-1 p-3 bg-gray-50 rounded-md">
                          {applicationStatus.reviewNotes}
                        </p>
                      </div>
                    )}
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          )}

          {/* Enhanced Contact & Support Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.7 }}
            className="mb-8"
          >
            <Card className="shadow-xl bg-gradient-to-br from-white to-orange-50/30 backdrop-blur-xl border-0 overflow-hidden relative">
              <div className="absolute top-0 right-0 w-32 h-32 bg-gradient-to-br from-orange-400/10 to-red-400/10 rounded-full -translate-y-16 translate-x-16"></div>
              
              <CardHeader className="relative z-10">
                <CardTitle className="flex items-center gap-2 text-xl">
                  <div className="p-2 rounded-full bg-gradient-to-r from-orange-500 to-red-500">
                    <Mail className="h-6 w-6 text-white" />
                  </div>
                  Need Assistance?
                </CardTitle>
                <CardDescription className="text-gray-600 text-base">
                  Our dedicated support team is ready to help you succeed
                </CardDescription>
              </CardHeader>
              
              <CardContent className="relative z-10">
                <div className="grid md:grid-cols-2 gap-6">
                  {/* Support Options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Get Help</h3>
                    <Link href="/contact-sales">
                      <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg">
                        <Mail className="h-4 w-4 mr-2" />
                        Contact Support Team
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" className="w-full border-blue-200 text-blue-700 hover:bg-blue-50">
                        <HelpCircle className="h-4 w-4 mr-2" />
                        Browse Help Center
                      </Button>
                    </Link>
                    <Link href="/faq">
                      <Button variant="outline" className="w-full border-green-200 text-green-700 hover:bg-green-50">
                        <FileText className="h-4 w-4 mr-2" />
                        View FAQ & Guides
                      </Button>
                    </Link>
                  </div>

                  {/* Account Options */}
                  <div className="space-y-4">
                    <h3 className="font-semibold text-gray-900 mb-3">Account Options</h3>
                    <Button 
                      variant="outline" 
                      className="w-full border-orange-200 text-orange-700 hover:bg-orange-50"
                      onClick={() => window.location.reload()}
                    >
                      <RefreshCw className="h-4 w-4 mr-2" />
                      Check Status Again
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full border-gray-200 text-gray-700 hover:bg-gray-50"
                      onClick={() => {
                        // For now, show a coming soon message since profile page doesn't exist yet
                        alert('Profile update feature coming soon! You will be able to update your profile after verification is complete.');
                      }}
                    >
                      <Settings className="h-4 w-4 mr-2" />
                      Update Profile Info
                    </Button>
                    <Button 
                      variant="outline" 
                      className="w-full text-red-600 border-red-300 hover:bg-red-50 hover:text-red-700"
                      onClick={() => {
                        signOut();
                        onBack();
                      }}
                    >
                      <LogOut className="h-4 w-4 mr-2" />
                      Switch to Different Account
                    </Button>
                  </div>
                </div>

                {/* Quick Contact Info */}
                <div className="mt-6 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-xl border border-blue-200/50">
                  <div className="flex items-center gap-2 mb-2">
                    <Bell className="h-4 w-4 text-blue-600" />
                    <span className="text-sm font-medium text-blue-900">Average Response Time</span>
                  </div>
                  <p className="text-sm text-blue-700">Our support team typically responds within 2-4 hours during business days</p>
                </div>
              </CardContent>
            </Card>
          </motion.div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
          >
            <Card className="shadow-xl bg-white/80 backdrop-blur-xl border-0">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <User className="h-5 w-5 text-gray-600" />
                  Account Information
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div>
                    <p className="text-sm font-medium text-gray-900">Full Name</p>
                    <p className="text-sm text-gray-600">{user?.name || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Email Address</p>
                    <p className="text-sm text-gray-600">{user?.email || 'Not provided'}</p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Application Date</p>
                    <p className="text-sm text-gray-600 flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {user?.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'Unknown'}
                    </p>
                  </div>
                  <div>
                    <p className="text-sm font-medium text-gray-900">Verification Status</p>
                    <Badge className={`${getStatusColor(user?.approvalStatus)} text-xs mt-1`}>
                      {getStatusText(user?.approvalStatus)}
                    </Badge>
                  </div>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}