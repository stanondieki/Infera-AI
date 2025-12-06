'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import Link from 'next/link';
import { ArrowLeft, Check, X, Star, Zap, Shield, Users } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

export default function Pricing() {
  const [isAnnual, setIsAnnual] = useState(false);

  const plans = [
    {
      name: "Starter",
      description: "Perfect for individual projects and small teams",
      price: isAnnual ? 299 : 349,
      originalPrice: isAnnual ? 399 : 449,
      icon: <Zap className="h-8 w-8 text-blue-600" />,
      popular: false,
      features: [
        "Up to 5 AI training tasks per month",
        "Access to 1,000+ verified experts",
        "Standard support (24-48h response)",
        "Basic project management tools",
        "Community forum access",
        "Standard data security"
      ],
      notIncluded: [
        "Priority expert matching",
        "Custom integrations",
        "Dedicated account manager"
      ]
    },
    {
      name: "Professional", 
      description: "Ideal for growing companies with regular AI training needs",
      price: isAnnual ? 899 : 999,
      originalPrice: isAnnual ? 1199 : 1299,
      icon: <Star className="h-8 w-8 text-purple-600" />,
      popular: true,
      features: [
        "Up to 25 AI training tasks per month",
        "Priority access to top-rated experts",
        "Priority support (4-12h response)",
        "Advanced project management",
        "Custom workflow integrations",
        "Enhanced data security",
        "Detailed analytics and reporting",
        "Team collaboration tools"
      ],
      notIncluded: [
        "Unlimited tasks",
        "24/7 phone support"
      ]
    },
    {
      name: "Enterprise",
      description: "For large organizations with complex AI development needs",
      price: "Custom",
      originalPrice: null,
      icon: <Shield className="h-8 w-8 text-green-600" />,
      popular: false,
      features: [
        "Unlimited AI training tasks",
        "Dedicated expert pool",
        "24/7 priority support + phone",
        "Custom enterprise integrations",
        "Advanced security & compliance",
        "Dedicated account manager",
        "Custom SLAs and contracts",
        "White-label solutions",
        "On-premise deployment options"
      ],
      notIncluded: []
    }
  ];

  const faqs = [
    {
      question: "How does the expert matching work?",
      answer: "Our AI-powered matching system connects you with experts based on your project requirements, domain expertise needed, and timeline constraints."
    },
    {
      question: "Can I upgrade or downgrade my plan?",
      answer: "Yes, you can change your plan at any time. Upgrades take effect immediately, while downgrades take effect at your next billing cycle."
    },
    {
      question: "What if I need more tasks than my plan allows?",
      answer: "You can purchase additional task credits or upgrade to a higher plan. We'll notify you when you're approaching your limit."
    },
    {
      question: "Is there a free trial available?",
      answer: "Yes, we offer a 14-day free trial with access to up to 3 AI training tasks to help you evaluate our platform."
    }
  ];

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
            <h1 className="text-xl font-semibold text-gray-900">Pricing</h1>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          {/* Hero Section */}
          <div className="text-center mb-16">
            <motion.h1 
              className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 bg-clip-text text-transparent mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              Simple, Transparent Pricing
            </motion.h1>
            <motion.p 
              className="text-xl text-gray-600 max-w-3xl mx-auto mb-8"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
            >
              Choose the perfect plan for your team. Start with our free tier and scale as you grow with Taskify's powerful features.
            </motion.p>
            
            {/* Billing Toggle */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.6 }}
              className="flex items-center justify-center gap-4 mb-12"
            >
              <span className={`text-sm ${!isAnnual ? 'font-semibold' : 'text-gray-500'}`}>Monthly</span>
              <button
                onClick={() => setIsAnnual(!isAnnual)}
                className={`relative w-14 h-7 rounded-full transition-colors ${isAnnual ? 'bg-blue-600' : 'bg-gray-300'}`}
              >
                <div className={`absolute top-1 w-5 h-5 bg-white rounded-full transition-transform ${isAnnual ? 'translate-x-7' : 'translate-x-1'}`} />
              </button>
              <span className={`text-sm ${isAnnual ? 'font-semibold' : 'text-gray-500'}`}>
                Annual 
                <Badge variant="secondary" className="ml-2">Save 25%</Badge>
              </span>
            </motion.div>
          </div>

          {/* Pricing Cards */}
          <div className="grid lg:grid-cols-3 gap-8 mb-16">
            {plans.map((plan, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5, delay: 0.8 + index * 0.1 }}
                className={`relative ${plan.popular ? 'scale-105' : ''}`}
              >
                {plan.popular && (
                  <div className="absolute -top-4 left-1/2 transform -translate-x-1/2">
                    <Badge className="bg-gradient-to-r from-blue-600 to-purple-600 text-white px-4 py-1">
                      Most Popular
                    </Badge>
                  </div>
                )}
                <Card className={`shadow-2xl bg-white/90 backdrop-blur-xl border-0 h-full ${plan.popular ? 'ring-2 ring-blue-500' : ''}`}>
                  <CardHeader className="text-center pb-4">
                    <div className="flex justify-center mb-4">{plan.icon}</div>
                    <CardTitle className="text-2xl font-bold">{plan.name}</CardTitle>
                    <CardDescription className="text-gray-600">{plan.description}</CardDescription>
                    <div className="mt-4">
                      {typeof plan.price === 'number' ? (
                        <div>
                          <div className="text-4xl font-bold text-gray-900">
                            ${plan.price}
                            <span className="text-lg font-normal text-gray-500">/month</span>
                          </div>
                          {plan.originalPrice && (
                            <div className="text-sm text-gray-500 line-through">
                              Was ${plan.originalPrice}/month
                            </div>
                          )}
                        </div>
                      ) : (
                        <div className="text-4xl font-bold text-gray-900">{plan.price}</div>
                      )}
                    </div>
                  </CardHeader>
                  <CardContent>
                    <Button 
                      className={`w-full mb-6 ${plan.popular 
                        ? 'bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700' 
                        : 'bg-gray-900 hover:bg-gray-800'
                      }`}
                    >
                      {plan.name === 'Enterprise' ? 'Contact Sales' : 'Start Free Trial'}
                    </Button>
                    
                    <div className="space-y-3">
                      <h4 className="font-semibold text-gray-900 mb-3">What's included:</h4>
                      {plan.features.map((feature, featureIndex) => (
                        <div key={featureIndex} className="flex items-start gap-3">
                          <Check className="h-5 w-5 text-green-600 flex-shrink-0 mt-0.5" />
                          <span className="text-sm text-gray-700">{feature}</span>
                        </div>
                      ))}
                      
                      {plan.notIncluded.length > 0 && (
                        <div className="pt-4 space-y-3">
                          <h4 className="font-semibold text-gray-500 mb-3">Not included:</h4>
                          {plan.notIncluded.map((feature, featureIndex) => (
                            <div key={featureIndex} className="flex items-start gap-3">
                              <X className="h-5 w-5 text-gray-400 flex-shrink-0 mt-0.5" />
                              <span className="text-sm text-gray-500">{feature}</span>
                            </div>
                          ))}
                        </div>
                      )}
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* FAQ Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.1 }}
            className="mb-16"
          >
            <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {faqs.map((faq, index) => (
                <Card key={index} className="shadow-xl bg-white/90 backdrop-blur-xl border-0">
                  <CardHeader>
                    <CardTitle className="text-lg">{faq.question}</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600">{faq.answer}</p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>

          {/* CTA Section */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 1.3 }}
          >
            <Card className="shadow-2xl bg-gradient-to-r from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-12 text-center">
                <h3 className="text-3xl font-bold mb-4">Ready to Get Started?</h3>
                <p className="text-xl mb-8 opacity-90">
                  Start your free trial today and experience the power of AI expert collaboration
                </p>
                <div className="flex flex-col sm:flex-row gap-4 justify-center">
                  <Button size="lg" variant="outline" className="bg-white text-blue-600 border-white hover:bg-gray-100">
                    Start Free Trial
                  </Button>
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    Schedule Demo
                  </Button>
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}