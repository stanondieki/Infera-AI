import React from 'react';
import { ArrowLeft, Shield, Eye, Lock, Database, UserCheck, Globe, Mail } from 'lucide-react';
import Link from 'next/link';
import { Card, CardContent, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';
import { Separator } from '../../components/ui/separator';

export default function PrivacyPolicy() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 max-w-4xl">
        {/* Header */}
        <div className="mb-8">
          <Link 
            href="/" 
            className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-700 mb-4 transition-colors"
          >
            <ArrowLeft className="h-4 w-4" />
            Back to Home
          </Link>
          
          <div className="flex items-center gap-3 mb-4">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Shield className="h-6 w-6 text-blue-600" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-gray-900">Privacy Policy</h1>
              <p className="text-gray-600">Last updated: November 28, 2025</p>
            </div>
          </div>
          
          <Card className="bg-blue-50 border-blue-200">
            <CardContent className="p-4">
              <p className="text-blue-800">
                <strong>Payment Processing Notice:</strong> All payments are processed on the 29th of each month. 
                Payment processing takes 1-2 business days to complete and reflect in your account.
              </p>
            </CardContent>
          </Card>
        </div>

        {/* Table of Contents */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              Quick Navigation
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid md:grid-cols-2 gap-2">
              <a href="#information-collection" className="text-blue-600 hover:underline">1. Information We Collect</a>
              <a href="#information-use" className="text-blue-600 hover:underline">2. How We Use Information</a>
              <a href="#information-sharing" className="text-blue-600 hover:underline">3. Information Sharing</a>
              <a href="#data-security" className="text-blue-600 hover:underline">4. Data Security</a>
              <a href="#user-rights" className="text-blue-600 hover:underline">5. Your Rights</a>
              <a href="#payment-data" className="text-blue-600 hover:underline">6. Payment Data</a>
              <a href="#cookies" className="text-blue-600 hover:underline">7. Cookies & Tracking</a>
              <a href="#contact" className="text-blue-600 hover:underline">8. Contact Us</a>
            </div>
          </CardContent>
        </Card>

        {/* Content Sections */}
        <div className="space-y-8">
          
          {/* Section 1: Information Collection */}
          <Card id="information-collection">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Database className="h-5 w-5 text-blue-600" />
                1. Information We Collect
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <h4 className="font-semibold mb-2">Personal Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Name, email address, and contact information</li>
                  <li>Profile information and professional background</li>
                  <li>Payment and billing information</li>
                  <li>Identity verification documents (when required)</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Task and Work Data</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Task submissions and work products</li>
                  <li>Performance metrics and quality scores</li>
                  <li>Time tracking and activity logs</li>
                  <li>Communication within our platform</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Technical Information</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>IP address, browser type, and device information</li>
                  <li>Usage patterns and platform interactions</li>
                  <li>Log files and system activity</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 2: Information Use */}
          <Card id="information-use">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-green-600" />
                2. How We Use Your Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <ul className="list-disc list-inside space-y-2 text-gray-700">
                <li><strong>Service Provision:</strong> To provide and improve our AI training platform services</li>
                <li><strong>Task Management:</strong> To assign, track, and evaluate task completion</li>
                <li><strong>Payment Processing:</strong> To process payments and maintain financial records</li>
                <li><strong>Quality Assurance:</strong> To monitor work quality and platform integrity</li>
                <li><strong>Communication:</strong> To send important updates, notifications, and support</li>
                <li><strong>Platform Security:</strong> To protect against fraud and unauthorized access</li>
                <li><strong>Legal Compliance:</strong> To comply with applicable laws and regulations</li>
              </ul>
            </CardContent>
          </Card>

          {/* Section 3: Information Sharing */}
          <Card id="information-sharing">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Globe className="h-5 w-5 text-purple-600" />
                3. Information Sharing and Disclosure
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">We do not sell your personal information. We may share information in these limited circumstances:</p>
              
              <div>
                <h4 className="font-semibold mb-2">Service Providers</h4>
                <p className="text-gray-700 mb-2">We work with trusted third parties who help us operate our platform:</p>
                <ul className="list-disc list-inside space-y-1 text-gray-700 ml-4">
                  <li>Payment processors (Stripe, PayPal)</li>
                  <li>Cloud hosting services (Azure, AWS)</li>
                  <li>Analytics and monitoring tools</li>
                  <li>Customer support platforms</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Legal Requirements</h4>
                <p className="text-gray-700">We may disclose information when required by law, court order, or to protect our legal rights and the safety of our users.</p>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Business Transfers</h4>
                <p className="text-gray-700">In the event of a merger, acquisition, or sale of assets, user information may be transferred as part of the business transaction.</p>
              </div>
            </CardContent>
          </Card>

          {/* Section 4: Data Security */}
          <Card id="data-security">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Lock className="h-5 w-5 text-red-600" />
                4. Data Security and Protection
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">We implement industry-standard security measures to protect your data:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Technical Safeguards</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>SSL/TLS encryption for data transmission</li>
                    <li>Encrypted data storage</li>
                    <li>Regular security audits and updates</li>
                    <li>Multi-factor authentication options</li>
                  </ul>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Administrative Controls</h4>
                  <ul className="list-disc list-inside space-y-1 text-gray-700">
                    <li>Limited access to personal data</li>
                    <li>Employee privacy training</li>
                    <li>Data breach response procedures</li>
                    <li>Regular privacy impact assessments</li>
                  </ul>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Section 5: User Rights */}
          <Card id="user-rights">
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <UserCheck className="h-5 w-5 text-indigo-600" />
                5. Your Privacy Rights
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">You have the following rights regarding your personal information:</p>
              
              <div className="space-y-3">
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">Access</Badge>
                  <p className="text-gray-700">Request a copy of the personal information we hold about you</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">Correction</Badge>
                  <p className="text-gray-700">Request correction of inaccurate or incomplete information</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">Deletion</Badge>
                  <p className="text-gray-700">Request deletion of your personal information (subject to legal requirements)</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">Portability</Badge>
                  <p className="text-gray-700">Request transfer of your data to another service provider</p>
                </div>
                
                <div className="flex items-start gap-3">
                  <Badge className="mt-1">Objection</Badge>
                  <p className="text-gray-700">Object to processing of your personal information for certain purposes</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600 bg-gray-50 p-3 rounded-lg">
                To exercise these rights, please contact us at privacy@inferaai.com with your request and proof of identity.
              </p>
            </CardContent>
          </Card>

          {/* Section 6: Payment Data */}
          <Card id="payment-data" className="border-orange-200 bg-orange-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-orange-800">
                <Mail className="h-5 w-5" />
                6. Payment Data and Processing Schedule
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="bg-orange-100 p-4 rounded-lg border border-orange-200">
                <h4 className="font-semibold mb-2 text-orange-800">Important Payment Information</h4>
                <ul className="list-disc list-inside space-y-1 text-orange-700">
                  <li><strong>Payment Schedule:</strong> All payments are processed on the 29th of each month</li>
                  <li><strong>Processing Time:</strong> Payments take 1-2 business days to complete and reflect in your account</li>
                  <li><strong>Currency:</strong> All payments are processed in USD unless otherwise specified</li>
                  <li><strong>Minimum Payout:</strong> Minimum balance of $50 required for payment processing</li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-2">Payment Data Security</h4>
                <ul className="list-disc list-inside space-y-1 text-gray-700">
                  <li>Payment information is processed through PCI-DSS compliant providers</li>
                  <li>We do not store complete payment card information on our servers</li>
                  <li>All financial transactions are encrypted and monitored for fraud</li>
                  <li>Payment history is maintained for tax and regulatory compliance</li>
                </ul>
              </div>
            </CardContent>
          </Card>

          {/* Section 7: Cookies */}
          <Card id="cookies">
            <CardHeader>
              <CardTitle>7. Cookies and Tracking Technologies</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <p className="text-gray-700">We use cookies and similar technologies to improve your experience:</p>
              
              <div className="grid md:grid-cols-2 gap-4">
                <div>
                  <h4 className="font-semibold mb-2">Essential Cookies</h4>
                  <p className="text-gray-700 text-sm">Required for basic platform functionality, authentication, and security.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Analytics Cookies</h4>
                  <p className="text-gray-700 text-sm">Help us understand how users interact with our platform to improve services.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Preference Cookies</h4>
                  <p className="text-gray-700 text-sm">Remember your settings and preferences for a personalized experience.</p>
                </div>
                
                <div>
                  <h4 className="font-semibold mb-2">Marketing Cookies</h4>
                  <p className="text-gray-700 text-sm">Used to deliver relevant advertisements and track campaign effectiveness.</p>
                </div>
              </div>
              
              <p className="text-sm text-gray-600">
                You can manage cookie preferences through your browser settings or our cookie consent banner.
              </p>
            </CardContent>
          </Card>

          {/* Section 8: Contact */}
          <Card id="contact" className="border-blue-200 bg-blue-50">
            <CardHeader>
              <CardTitle className="flex items-center gap-2 text-blue-800">
                <Mail className="h-5 w-5" />
                8. Contact Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <p className="text-gray-700">
                  If you have questions about this Privacy Policy or our data practices, please contact us:
                </p>
                
                <div className="grid md:grid-cols-2 gap-4">
                  <div>
                    <h4 className="font-semibold mb-2">General Inquiries</h4>
                    <p className="text-gray-700">Email: privacy@inferaai.com</p>
                    <p className="text-gray-700">Response time: 1-2 business days</p>
                  </div>
                  
                  <div>
                    <h4 className="font-semibold mb-2">Data Protection Officer</h4>
                    <p className="text-gray-700">Email: dpo@inferaai.com</p>
                    <p className="text-gray-700">For GDPR and data rights requests</p>
                  </div>
                </div>
                
                <Separator />
                
                <div className="text-sm text-gray-600">
                  <p className="mb-2"><strong>Infera AI Inc.</strong></p>
                  <p>This Privacy Policy is effective as of November 28, 2025, and will remain in effect except with respect to any changes in its provisions in the future, which will be in effect immediately after being posted on this page.</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Footer */}
        <div className="mt-12 text-center">
          <p className="text-gray-600 mb-4">
            By using Infera AI, you acknowledge that you have read and understood this Privacy Policy.
          </p>
          <div className="flex justify-center gap-4">
            <Link href="/terms" className="text-blue-600 hover:underline">Terms & Conditions</Link>
            <span className="text-gray-400">|</span>
            <Link href="/" className="text-blue-600 hover:underline">Back to Platform</Link>
          </div>
        </div>
      </div>
    </div>
  );
}