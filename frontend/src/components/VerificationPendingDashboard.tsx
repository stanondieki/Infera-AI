import React, { useEffect, useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Clock, 
  Mail, 
  CheckCircle, 
  AlertCircle, 
  ArrowLeft,
  Shield,
  FileText,
  User,
  Calendar
} from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { apiClient, API_ENDPOINTS } from '../utils/api';

interface VerificationPendingDashboardProps {
  user: {
    name?: string;
    email?: string;
    isVerified?: boolean;
    approvalStatus?: 'pending' | 'approved' | 'rejected';
    createdAt?: string;
  };
  onBack: () => void;
}

interface ApplicationStatus {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedAt: string;
  reviewedAt?: string;
  reviewNotes?: string;
}

export default function VerificationPendingDashboard({ user, onBack }: VerificationPendingDashboardProps) {
  const [applicationStatus, setApplicationStatus] = useState<ApplicationStatus | null>(null);
  const [loadingApplication, setLoadingApplication] = useState(true);

  useEffect(() => {
    const fetchApplicationStatus = async () => {
      try {
        const response = await apiClient.get(API_ENDPOINTS.APPLICATIONS.MY_APPLICATION);
        if (response.success) {
          setApplicationStatus(response.application);
        }
      } catch (error) {
        console.log('No application found for user');
      } finally {
        setLoadingApplication(false);
      }
    };

    fetchApplicationStatus();
  }, []);

  const getStatusColor = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'rejected':
        return 'bg-red-100 text-red-800 border-red-200';
      default:
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
    }
  };

  const getStatusIcon = (status?: string) => {
    switch (status) {
      case 'approved':
        return <CheckCircle className="h-4 w-4" />;
      case 'rejected':
        return <AlertCircle className="h-4 w-4" />;
      default:
        return <Clock className="h-4 w-4" />;
    }
  };

  const getStatusText = (status?: string) => {
    switch (status) {
      case 'approved':
        return 'Account Approved';
      case 'rejected':
        return 'Application Rejected';
      default:
        return 'Pending Review';
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-purple-50/30 to-gray-50">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <div className="flex items-center">
              <Button
                variant="ghost"
                size="sm"
                onClick={onBack}
                className="mr-4"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back
              </Button>
              <h1 className="text-xl font-semibold text-gray-900">Account Verification</h1>
            </div>
            <div className="flex items-center gap-3">
              <div className="text-right">
                <p className="text-sm font-medium text-gray-900">{user?.name}</p>
                <p className="text-xs text-gray-500">{user?.email}</p>
              </div>
              <div className="h-8 w-8 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center">
                <User className="h-4 w-4 text-white" />
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
          {/* Status Card */}
          <Card className="mb-8 shadow-2xl bg-white/90 backdrop-blur-xl border-0">
            <CardHeader className="text-center pb-4">
              <motion.div
                initial={{ scale: 0.8 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.5, delay: 0.2 }}
                className="mx-auto mb-4 h-20 w-20 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 flex items-center justify-center"
              >
                <Shield className="h-10 w-10 text-white" />
              </motion.div>
              <CardTitle className="text-2xl text-gray-900 mb-2">
                Account Verification Required
              </CardTitle>
              <CardDescription className="text-gray-600 max-w-lg mx-auto">
                Your account is currently under review. Our team will verify your application and notify you once approved.
              </CardDescription>
            </CardHeader>
            <CardContent className="text-center">
              <Badge className={`${getStatusColor(user?.approvalStatus)} gap-2 px-4 py-2 text-sm`}>
                {getStatusIcon(user?.approvalStatus)}
                {getStatusText(user?.approvalStatus)}
              </Badge>
            </CardContent>
          </Card>

          {/* Information Cards */}
          <div className="grid md:grid-cols-2 gap-6 mb-8">
            {/* Next Steps */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <Card className="shadow-xl bg-white/80 backdrop-blur-xl border-0 h-full">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2 text-lg">
                    <CheckCircle className="h-5 w-5 text-green-600" />
                    What Happens Next?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Application Review</p>
                      <p className="text-xs text-gray-600">Our team reviews your profile and qualifications</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-blue-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Email Notification</p>
                      <p className="text-xs text-gray-600">You'll receive an approval email within 24-48 hours</p>
                    </div>
                  </div>
                  <div className="flex items-start gap-3">
                    <div className="h-2 w-2 rounded-full bg-green-500 mt-2"></div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">Full Access</p>
                      <p className="text-xs text-gray-600">Access all features and start earning</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </motion.div>

            {/* Application Status */}
            {applicationStatus && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="mb-8 shadow-xl bg-white/80 backdrop-blur-xl border-0">
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

            {!applicationStatus && !loadingApplication && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.3 }}
              >
                <Card className="mb-8 shadow-xl bg-orange-50/80 backdrop-blur-xl border border-orange-200">
                  <CardHeader>
                    <CardTitle className="flex items-center gap-2 text-orange-800">
                      <AlertCircle className="h-5 w-5" />
                      No Application Found
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm text-orange-700 mb-4">
                      We couldn't find an application associated with your account. To access the platform, please submit an application first.
                    </p>
                    <Button variant="outline" className="text-orange-700 border-orange-300 hover:bg-orange-100">
                      Submit Application
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            )}

            {/* Contact Support */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              <Card className="mb-8 shadow-xl bg-white/80 backdrop-blur-xl border-0">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <Mail className="h-5 w-5 text-gray-600" />
                    Need Help?
                  </CardTitle>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-sm text-gray-600">
                    If you have questions about your application or need assistance, our support team is here to help.
                  </p>
                  <div className="space-y-3">
                    <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Mail className="h-4 w-4 mr-2" />
                      Contact Support
                    </Button>
                    <Button variant="outline" className="w-full">
                      <FileText className="h-4 w-4 mr-2" />
                      View FAQ
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          </div>

          {/* Account Details */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.5 }}
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