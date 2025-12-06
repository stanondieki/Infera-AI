'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, ChevronDown, ChevronUp, HelpCircle, Search } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Input } from '../../components/ui/input';

export default function FAQ() {
  const [searchTerm, setSearchTerm] = useState('');
  const [openItems, setOpenItems] = useState<number[]>([]);

  const faqCategories = [
    {
      category: "Getting Started",
      questions: [
        {
          question: "How do I apply to become an AI expert on the platform?",
          answer: "Click the 'Apply Now' button and complete our comprehensive application process. You'll need to provide your background, expertise areas, portfolio samples, and pass our technical assessment. The review process typically takes 3-5 business days."
        },
        {
          question: "What qualifications do I need to join as an expert?",
          answer: "We look for professionals with proven experience in AI/ML, relevant academic credentials (PhD/Master's preferred), published research, industry experience, or demonstrable expertise in specific AI domains like computer vision, NLP, or deep learning."
        },
        {
          question: "How does the expert verification process work?",
          answer: "Our verification process includes: 1) Application review, 2) Technical assessment, 3) Portfolio evaluation, 4) Reference checks, and 5) Interview with our technical team. We ensure all experts meet our high standards."
        }
      ]
    },
    {
      category: "Platform & Projects",
      questions: [
        {
          question: "What types of AI projects are available?",
          answer: "Projects range from model training and optimization, data preprocessing, algorithm development, computer vision tasks, natural language processing, reinforcement learning, and custom AI solution development. Projects vary from short-term tasks to long-term collaborations."
        },
        {
          question: "How are projects assigned to experts?",
          answer: "Our AI-powered matching system considers your expertise, availability, project requirements, and past performance ratings. You can also browse and apply for projects that interest you through our marketplace."
        },
        {
          question: "Can I work on multiple projects simultaneously?",
          answer: "Yes, you can work on multiple projects as long as you can meet all deadlines and quality requirements. We recommend managing your workload carefully to maintain high-quality outputs."
        }
      ]
    },
    {
      category: "Payments & Earnings",
      questions: [
        {
          question: "How much can I earn as an AI expert?",
          answer: "Earnings vary based on expertise level, project complexity, and time commitment. Expert rates typically range from $50-200/hour for tasks, with project-based work ranging from $500-$50,000+. Top-rated experts often earn $10,000+ monthly."
        },
        {
          question: "When and how do I get paid?",
          answer: "Payments are processed monthly on the 29th for all completed and approved work. We support multiple payment methods including bank transfers, PayPal, and cryptocurrency. Payment details are provided during onboarding."
        },
        {
          question: "Are there any fees deducted from my earnings?",
          answer: "We charge a platform fee of 10-15% depending on your expert level and volume of work. Higher-rated experts and those with more completed projects enjoy lower fee rates. Enterprise projects may have different fee structures."
        }
      ]
    },
    {
      category: "Support & Policies",
      questions: [
        {
          question: "What support is available if I have issues with a project?",
          answer: "We offer 24/7 support through our help center, live chat, and email. For complex issues, you can request mediation from our technical team. We also provide project management tools and communication channels."
        },
        {
          question: "What happens if a project is cancelled or disputed?",
          answer: "We have a comprehensive dispute resolution process. Payment is held in escrow until project completion. In case of disputes, our mediation team reviews all evidence and makes fair decisions based on project deliverables and communication records."
        },
        {
          question: "Can I take a break or pause my expert status?",
          answer: "Yes, you can temporarily pause your availability or take breaks. Simply update your status in your profile settings. We recommend completing ongoing projects before taking extended breaks to maintain your ratings."
        }
      ]
    }
  ];

  const toggleItem = (index: number) => {
    setOpenItems(prev => 
      prev.includes(index) 
        ? prev.filter(i => i !== index)
        : [...prev, index]
    );
  };

  const filteredFAQs = faqCategories.map(category => ({
    ...category,
    questions: category.questions.filter(
      q => q.question.toLowerCase().includes(searchTerm.toLowerCase()) ||
           q.answer.toLowerCase().includes(searchTerm.toLowerCase())
    )
  })).filter(category => category.questions.length > 0);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-indigo-50 to-purple-50">
      {/* Header */}
      <div className="bg-white/95 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50 shadow-lg">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            <Link href="/">
              <Button
                variant="ghost"
                size="sm"
                className="hover:bg-blue-50 hover:text-blue-600 transition-colors"
              >
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <h1 className="text-xl font-semibold text-gray-900">FAQ</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-12">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex justify-center mb-6"
            >
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                <HelpCircle className="h-8 w-8 text-white" />
              </div>
            </motion.div>
            <motion.h1 
              className="text-4xl md:text-5xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Frequently Asked Questions
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-2xl mx-auto"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
            >
              Find answers to common questions about joining our AI expert platform
            </motion.p>
          </div>

          {/* Search */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="mb-12"
          >
            <div className="relative max-w-md mx-auto">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
              <Input
                type="text"
                placeholder="Search frequently asked questions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10 py-3 border-gray-300 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>
          </motion.div>

          {/* FAQ Categories */}
          <div className="space-y-8">
            {filteredFAQs.map((category, categoryIndex) => (
              <motion.div
                key={categoryIndex}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 1.0 + categoryIndex * 0.1 }}
              >
                <Card className="shadow-xl bg-white/90 backdrop-blur-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-2xl font-bold text-gray-900">
                      {category.category}
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      {category.questions.map((faq, faqIndex) => {
                        const globalIndex = categoryIndex * 100 + faqIndex;
                        const isOpen = openItems.includes(globalIndex);
                        
                        return (
                          <div key={faqIndex} className="border border-gray-200 rounded-lg">
                            <button
                              onClick={() => toggleItem(globalIndex)}
                              className="w-full px-6 py-4 text-left flex items-center justify-between hover:bg-gray-50 transition-colors"
                            >
                              <h3 className="font-semibold text-gray-900 pr-4">
                                {faq.question}
                              </h3>
                              {isOpen ? (
                                <ChevronUp className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              ) : (
                                <ChevronDown className="h-5 w-5 text-gray-500 flex-shrink-0" />
                              )}
                            </button>
                            {isOpen && (
                              <div className="px-6 pb-4">
                                <p className="text-gray-600 leading-relaxed">{faq.answer}</p>
                              </div>
                            )}
                          </div>
                        );
                      })}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Contact Support CTA */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.4 }}
            className="mt-16"
          >
            <Card className="shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8 text-center">
                <h3 className="text-2xl font-bold mb-4">Still have questions?</h3>
                <p className="text-lg mb-6 opacity-90">
                  Our support team is here to help you get started
                </p>
                <Button size="lg" variant="outline" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                  Contact Support
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}