import React from 'react';
import { ArrowLeft, FileText, AlertTriangle, DollarSign, Shield, Users, Gavel, Clock } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Alert, AlertDescription } from '../../components/ui/alert';

export default function TermsAndConditions() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-purple-50 via-white to-blue-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-purple-600 hover:text-purple-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-purple-100 rounded-lg">
              <FileText className="h-6 w-6 text-purple-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Terms and Conditions</h1>
              <p className="text-gray-600">Last updated: November 28, 2025</p>
            </div>
          </div>
          
          <Alert className="bg-green-50 border-green-200">
            <DollarSign className="h-4 w-4 text-green-600" />
            <AlertDescription className="text-green-800">
              <strong>Payment Schedule:</strong> All payments are processed on the 29th of each month. 
              Payment processing takes 1-2 business days to complete. Minimum payout threshold: $50.
            </AlertDescription>
          </Alert>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <FileText className="h-5 w-5" />
              Agreement Overview
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              <a href="#acceptance" className="text-purple-600 hover:underline">1. Acceptance of Terms</a>
              <a href="#platform-description" className="text-purple-600 hover:underline">2. Platform Description</a>
              <a href="#user-accounts" className="text-purple-600 hover:underline">3. User Accounts</a>
              <a href="#payment-terms" className="text-purple-600 hover:underline">4. Payment Terms</a>
              <a href="#user-conduct" className="text-purple-600 hover:underline">5. User Conduct</a>
              <a href="#task-completion" className="text-purple-600 hover:underline">6. Task Completion</a>
              <a href="#intellectual-property" className="text-purple-600 hover:underline">7. Intellectual Property</a>
              <a href="#limitation-liability" className="text-purple-600 hover:underline">8. Limitation of Liability</a>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Section 1: Acceptance */}
          <Card id="acceptance">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Gavel className="h-5 w-5 text-purple-600" />
                1. Acceptance of Terms
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Welcome to Infera AI, a platform for AI training data annotation and related tasks. By accessing or using our platform, 
                you agree to be bound by these Terms and Conditions ("Terms"). If you do not agree to these Terms, 
                please do not use our services.
              </p>
              
              <div className="bg-yellow-50 p-4 rounded-lg border border-yellow-200">
                <h4 className="font-semibold mb-2 text-yellow-800">Important Notice</h4>
                <p className="text-yellow-700">
                  These Terms constitute a legally binding agreement between you and Infera AI Inc. 
                  We may update these Terms from time to time, and continued use of the platform constitutes acceptance of any changes.
                </p>
              </div>
              
              <ul className="list-disc list-inside space-y-1 text-gray-700">
                <li>You must be at least 18 years old to use this platform</li>
                <li>You must have the legal capacity to enter into binding contracts</li>
                <li>You are responsible for compliance with local laws and regulations</li>
                <li>Business entities must have proper authorization to use our services</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 2: Platform Description */}
          <Card id="platform-description">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-blue-600" />
                2. Platform Description and Services
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">
                Infera AI provides a platform connecting skilled workers with AI training data tasks including:
              </p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Available Task Types</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Data Annotation and Labeling</li>
                    <li>Content Moderation</li>
                    <li>Translation Services</li>
                    <li>Transcription Tasks</li>
                    <li>Research and Analysis</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Platform Features</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Task management system</li>
                    <li>Quality assurance workflows</li>
                    <li>Payment processing</li>
                    <li>Performance tracking</li>
                    <li>Communication tools</li>
                  </ul>
                </div>
              </div>
              
              <Alert>
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  We reserve the right to modify, suspend, or discontinue any part of our services at any time with reasonable notice.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 3: User Accounts */}
          <Card id="user-accounts">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-green-600" />
                3. User Accounts and Registration
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Account Requirements</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Provide accurate and complete registration information</li>
                  <li>Maintain the security of your account credentials</li>
                  <li>Promptly update account information when it changes</li>
                  <li>You are responsible for all activities under your account</li>
                  <li>One account per person - multiple accounts are prohibited</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Account Verification</h4>
                <p className="text-gray-700 mb-2">We may require identity verification including:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Government-issued identification</li>
                  <li>Proof of address documentation</li>
                  <li>Tax identification information</li>
                  <li>Bank account verification for payments</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Account Suspension or Termination</h4>
                <p className="text-gray-700">
                  We reserve the right to suspend or terminate accounts for violations of these Terms, 
                  fraudulent activity, or other reasons deemed necessary for platform security and integrity.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Payment Terms */}
          <Card id="payment-terms" className="border-green-200 bg-green-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-green-800">
                <DollarSign className="h-5 w-5" />
                4. Payment Terms and Conditions
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-green-100 p-4 rounded-lg border border-green-200">
                <h4 className="font-semibold mb-2 text-green-800">Payment Schedule & Processing</h4>
                <ul className="list-disc list-inside space-y-1 text-green-700">
                  <li><strong>Monthly Payment Cycle:</strong> All payments are processed on the 29th of each month</li>
                  <li><strong>Processing Time:</strong> Payment processing takes 1-2 business days to complete</li>
                  <li><strong>Minimum Payout:</strong> $50 minimum balance required for payment processing</li>
                  <li><strong>Payment Methods:</strong> PayPal, Stripe, or bank transfer (varies by region)</li>
                  <li><strong>Currency:</strong> All payments processed in USD unless otherwise specified</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Task Payment Structure</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Fixed-rate payments per completed task</li>
                  <li>Hourly rates for time-based projects</li>
                  <li>Bonus payments for exceptional quality work</li>
                  <li>Payment rates clearly displayed before task acceptance</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Payment Conditions</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Tasks must be approved and meet quality standards</li>
                  <li>Payments subject to quality review and approval process</li>
                  <li>Disputed payments will be reviewed within 5-10 business days</li>
                  <li>Tax obligations are the responsibility of the user</li>
                  <li>Payment processing fees may apply based on selected payment method</li>
                </ul>
              </div>
              
              <Alert>
                <Clock className="h-4 w-4" />
                <AlertDescription>
                  <strong>Late Payment Policy:</strong> If the 29th falls on a weekend or holiday, payments will be processed on the next business day. 
                  Users will be notified of any delays via email.
                </AlertDescription>
              </Alert>
            </CardContent>
          </Card>

          {/* Section 5: User Conduct */}
          <Card id="user-conduct">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Users className="h-5 w-5 text-red-600" />
                5. User Conduct and Prohibited Activities
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">Users agree to use the platform responsibly and professionally. Prohibited activities include:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2 text-red-700">Strictly Prohibited</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Submitting false or misleading information</li>
                    <li>Plagiarism or copying others' work</li>
                    <li>Using automated tools without permission</li>
                    <li>Sharing account credentials</li>
                    <li>Harassment or inappropriate communication</li>
                    <li>Attempting to game or manipulate the system</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2 text-orange-700">Quality Standards</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Follow all task instructions carefully</li>
                    <li>Maintain high-quality work standards</li>
                    <li>Meet specified deadlines</li>
                    <li>Communicate professionally</li>
                    <li>Report technical issues promptly</li>
                    <li>Respect intellectual property rights</li>
                  </ul>
                </div>
              </div>
              
              <div className="bg-red-50 p-4 rounded-lg border border-red-200">
                <h4 className="font-semibold mb-2 text-red-800">Consequences of Violations</h4>
                <p className="text-red-700">
                  Violations may result in task rejection, account suspension, payment withholding, or permanent termination. 
                  Repeated or severe violations may also result in legal action.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Section 6: Task Completion */}
          <Card id="task-completion">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5 text-indigo-600" />
                6. Task Completion and Quality Assurance
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Task Assignment Process</h4>
                <ol className="list-decimal list-inside space-y-1 text-gray-700">
                  <li>Tasks are assigned based on skills, availability, and performance history</li>
                  <li>Users must accept tasks within the specified timeframe</li>
                  <li>Task instructions and requirements must be followed precisely</li>
                  <li>Work must be submitted before the stated deadline</li>
                </ol>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Quality Review Process</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>All submitted work undergoes quality review</li>
                  <li>Tasks may be accepted, rejected, or require revisions</li>
                  <li>Quality scores affect future task assignments and payments</li>
                  <li>Feedback is provided for rejected or revised work</li>
                  <li>Users can appeal quality decisions through our dispute process</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Performance Metrics</h4>
                <div className="grid md:grid-cols-3 gap-4">
                  <div className="text-center p-3 bg-blue-50 rounded-lg">
                    <Badge className="mb-2">Quality Score</Badge>
                    <p className="text-sm text-gray-600">Based on accuracy and adherence to guidelines</p>
                  </div>
                  <div className="text-center p-3 bg-green-50 rounded-lg">
                    <Badge className="mb-2">Completion Rate</Badge>
                    <p className="text-sm text-gray-600">Percentage of accepted tasks completed on time</p>
                  </div>
                  <div className="text-center p-3 bg-purple-50 rounded-lg">
                    <Badge className="mb-2">Efficiency Rating</Badge>
                    <p className="text-sm text-gray-600">Speed and productivity measurements</p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Intellectual Property */}
          <Card id="intellectual-property">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-yellow-600" />
                7. Intellectual Property Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Platform Ownership</h4>
                <p className="text-gray-700">
                  Infera AI retains all rights, title, and interest in the platform, including software, 
                  design, trademarks, and proprietary methodologies.
                </p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Work Product Rights</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Completed task deliverables become the property of Infera AI or its clients</li>
                  <li>Users retain no rights to work products after submission</li>
                  <li>Work may be used for AI training, research, or commercial purposes</li>
                  <li>Users grant perpetual, worldwide license for submitted work</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">User Obligations</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Respect third-party intellectual property rights</li>
                  <li>Do not submit copyrighted material without permission</li>
                  <li>Report suspected intellectual property violations</li>
                  <li>Comply with platform confidentiality requirements</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 8: Limitation of Liability */}
          <Card id="limitation-liability">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <AlertTriangle className="h-5 w-5 text-red-600" />
                8. Limitation of Liability and Disclaimers
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Service Disclaimers</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Platform provided "as is" without warranties of any kind</li>
                  <li>No guarantee of continuous, uninterrupted service</li>
                  <li>No guarantee of specific income or task availability</li>
                  <li>Users responsible for backup of their work and data</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Liability Limitations</h4>
                <p className="text-gray-700 mb-2">
                  To the maximum extent permitted by law, Infera AI's liability is limited to:
                </p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>The amount of payments earned in the 12 months preceding the claim</li>
                  <li>No liability for indirect, consequential, or punitive damages</li>
                  <li>No liability for lost profits, data, or business opportunities</li>
                  <li>Force majeure events beyond our reasonable control</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Indemnification</h4>
                <p className="text-gray-700">
                  Users agree to indemnify and hold harmless Infera AI from any claims, damages, or expenses 
                  arising from their use of the platform, violation of these Terms, or infringement of third-party rights.
                </p>
              </div>
            </CardContent>
          </Card>

          {/* Additional Important Terms */}
          <Card className="border-purple-200 bg-purple-50">
            <CardHeader>
              <CardTitle className="text-purple-800">Additional Important Terms</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Dispute Resolution</h4>
                  <p className="text-gray-700 text-sm">
                    Disputes will be resolved through binding arbitration in accordance with applicable laws. 
                    Users waive rights to class action lawsuits.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Governing Law</h4>
                  <p className="text-gray-700 text-sm">
                    These Terms are governed by the laws of [Your Jurisdiction] without regard to conflict of law principles.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Severability</h4>
                  <p className="text-gray-700 text-sm">
                    If any provision is found unenforceable, the remaining terms will continue in full force and effect.
                  </p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Contact Information</h4>
                  <p className="text-gray-700 text-sm">
                    Legal questions: legal@inferaai.com<br/>
                    Terms updates: terms@inferaai.com
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            By using Infera AI, you acknowledge that you have read, understood, and agree to be bound by these Terms and Conditions.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/privacy" className="text-purple-600 hover:underline">Privacy Policy</Link>
            <span className="text-gray-400">|</span>
            <Link href="/" className="text-purple-600 hover:underline">Back to Platform</Link>
          </div>
        </div>
      </div>
    </div>
  );
}