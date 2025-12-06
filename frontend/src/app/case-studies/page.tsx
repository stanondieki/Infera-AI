'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Users, TrendingUp, Clock, ExternalLink, Star, Award, Target } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const caseStudies = [
  {
    id: 1,
    title: "TechCorp Reduces Hiring Time by 70%",
    company: "TechCorp Solutions",
    industry: "Technology",
    challenge: "Finding qualified AI/ML engineers within tight deadlines",
    solution: "Leveraged Taskify's project management tools to streamline development workflows",
    results: ["70% reduction in hiring time", "50+ qualified candidates in 2 weeks", "95% client satisfaction rate"],
    timeline: "2 weeks",
    teamSize: "15 experts",
    image: "/api/placeholder/400/250"
  },
  {
    id: 2,
    title: "FinanceGlobal Scales Data Science Team",
    company: "FinanceGlobal Inc.",
    industry: "Financial Services", 
    challenge: "Scaling data science capabilities for risk modeling projects",
    solution: "Connected with specialized data scientists through our platform",
    results: ["3x faster project delivery", "$2M+ cost savings", "Enhanced model accuracy by 25%"],
    timeline: "1 month",
    teamSize: "8 experts",
    image: "/api/placeholder/400/250"
  },
  {
    id: 3,
    title: "HealthTech Innovation Platform Launch",
    company: "MedInnovate",
    industry: "Healthcare",
    challenge: "Building AI-powered diagnostic tools with limited in-house expertise",
    solution: "Assembled cross-functional team of AI engineers and healthcare specialists",
    results: ["Successful platform launch", "FDA approval achieved", "40% improvement in diagnostic accuracy"],
    timeline: "3 months",
    teamSize: "12 experts",
    image: "/api/placeholder/400/250"
  }
];

export default function CaseStudiesPage() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-50 via-blue-50/30 to-purple-50/30">
      {/* Header */}
      <div className="bg-white/80 backdrop-blur-xl border-b border-gray-200/50 sticky top-0 z-50">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center justify-between">
            <Link href="/">
              <Button variant="ghost" className="hover:bg-blue-50 hover:text-blue-600 transition-colors">
                <ArrowLeft className="h-4 w-4 mr-2" />
                Back to Home
              </Button>
            </Link>
            <div className="text-sm text-gray-600">
              Case Studies
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Hero Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <Badge className="bg-blue-100 text-blue-800 px-4 py-2 mb-6">
            Success Stories
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Transforming Businesses with AI Expertise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            See how leading companies have accelerated their AI initiatives and achieved remarkable results through our expert network.
          </p>
        </motion.div>

        {/* Stats Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Users className="h-6 w-6 text-blue-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">500+</h3>
              <p className="text-gray-600">Projects Completed</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <TrendingUp className="h-6 w-6 text-green-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">89%</h3>
              <p className="text-gray-600">Success Rate</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Clock className="h-6 w-6 text-purple-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">60%</h3>
              <p className="text-gray-600">Faster Delivery</p>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-orange-600" />
              </div>
              <h3 className="text-2xl font-bold text-gray-900">95%</h3>
              <p className="text-gray-600">Client Satisfaction</p>
            </CardContent>
          </Card>
        </motion.div>

        {/* Case Studies Grid */}
        <div className="space-y-12">
          {caseStudies.map((study, index) => (
            <motion.div
              key={study.id}
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.1 * index }}
            >
              <Card className="overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-2xl">
                <div className="grid md:grid-cols-2 gap-8">
                  <div className="p-8">
                    <div className="flex items-center gap-3 mb-4">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {study.industry}
                      </Badge>
                      <div className="flex items-center text-sm text-gray-500">
                        <Clock className="h-4 w-4 mr-1" />
                        {study.timeline}
                      </div>
                      <div className="flex items-center text-sm text-gray-500">
                        <Users className="h-4 w-4 mr-1" />
                        {study.teamSize}
                      </div>
                    </div>

                    <h2 className="text-2xl font-bold text-gray-900 mb-2">{study.title}</h2>
                    <p className="text-lg font-medium text-blue-600 mb-6">{study.company}</p>

                    <div className="space-y-6">
                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Challenge</h3>
                        <p className="text-gray-600">{study.challenge}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-2">Solution</h3>
                        <p className="text-gray-600">{study.solution}</p>
                      </div>

                      <div>
                        <h3 className="font-semibold text-gray-900 mb-3">Results</h3>
                        <ul className="space-y-2">
                          {study.results.map((result, idx) => (
                            <li key={idx} className="flex items-center text-gray-600">
                              <Star className="h-4 w-4 text-yellow-500 mr-2 flex-shrink-0" />
                              {result}
                            </li>
                          ))}
                        </ul>
                      </div>
                    </div>

                    <Button className="mt-6 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <ExternalLink className="h-4 w-4 mr-2" />
                      View Full Case Study
                    </Button>
                  </div>

                  <div className="relative bg-gradient-to-br from-blue-500 to-purple-600 flex items-center justify-center">
                    <div className="text-center text-white p-8">
                      <Target className="h-24 w-24 mx-auto mb-4 opacity-20" />
                      <h3 className="text-xl font-semibold mb-2">Success Metrics</h3>
                      <div className="space-y-3">
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="text-2xl font-bold">70%</div>
                          <div className="text-sm">Time Reduction</div>
                        </div>
                        <div className="bg-white/20 rounded-lg p-3">
                          <div className="text-2xl font-bold">95%</div>
                          <div className="text-sm">Satisfaction</div>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          ))}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Ready to Start Your Success Story?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Join hundreds of companies that have transformed their AI initiatives with our expert network.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/contact-sales">
                  <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                    Get Started Today
                  </Button>
                </Link>
                <Link href="/pricing">
                  <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                    View Pricing
                  </Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}