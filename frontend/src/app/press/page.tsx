'use client';

import React from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, Users, Award, Globe, Newspaper, Download, ExternalLink, Building2, Zap, Target } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const pressReleases = [
  {
    id: 1,
    title: "Taskify Raises $50M Series B to Accelerate Team Productivity Platform",
    date: "December 1, 2025",
    excerpt: "Leading AI talent platform secures major funding round led by Andreessen Horowitz to expand internationally and enhance platform capabilities.",
    type: "Funding",
    featured: true,
    downloadUrl: "/press/series-b-announcement.pdf"
  },
  {
    id: 2,
    title: "Infera AI Partners with Fortune 500 Companies to Bridge AI Talent Gap",
    date: "November 15, 2025", 
    excerpt: "Strategic partnerships with leading enterprises demonstrate growing demand for specialized AI expertise across industries.",
    type: "Partnership",
    featured: true,
    downloadUrl: "/press/fortune-500-partnerships.pdf"
  },
  {
    id: 3,
    title: "Industry Report: The Future of AI Talent - 2025 Market Analysis",
    date: "October 30, 2025",
    excerpt: "Comprehensive study reveals critical insights into AI talent shortage, salary trends, and skill demands across global markets.",
    type: "Research",
    featured: false,
    downloadUrl: "/press/ai-talent-report-2025.pdf"
  },
  {
    id: 4,
    title: "Infera AI Launches Advanced Matching Algorithm Using Proprietary ML",
    date: "October 10, 2025",
    excerpt: "New machine learning system improves talent matching accuracy by 40%, reducing time-to-hire for specialized AI roles.",
    type: "Product",
    featured: false,
    downloadUrl: "/press/matching-algorithm-launch.pdf"
  },
  {
    id: 5,
    title: "CEO Sarah Chen Named to Forbes 30 Under 30 in Enterprise Technology",
    date: "September 20, 2025",
    excerpt: "Recognition highlights leadership in transforming how companies access and hire AI talent globally.",
    type: "Award",
    featured: false,
    downloadUrl: "/press/forbes-30-under-30.pdf"
  }
];

const mediaKit = {
  logos: [
    { name: "Primary Logo (PNG)", size: "2.1 MB", format: "PNG" },
    { name: "Primary Logo (SVG)", size: "156 KB", format: "SVG" },
    { name: "Logo Mark Only", size: "890 KB", format: "PNG" },
    { name: "White Logo", size: "1.8 MB", format: "PNG" }
  ],
  photos: [
    { name: "CEO Headshot - Sarah Chen", size: "3.2 MB", format: "JPG" },
    { name: "Team Photo - San Francisco Office", size: "4.1 MB", format: "JPG" },
    { name: "Product Screenshots", size: "8.5 MB", format: "ZIP" },
    { name: "Company Event Photos", size: "12.3 MB", format: "ZIP" }
  ],
  documents: [
    { name: "Company Fact Sheet", size: "245 KB", format: "PDF" },
    { name: "Executive Bios", size: "180 KB", format: "PDF" },
    { name: "Product Overview", size: "1.2 MB", format: "PDF" }
  ]
};

const awards = [
  {
    title: "Best AI Startup 2025",
    organization: "TechCrunch Disrupt",
    year: "2025",
    description: "Recognized for innovative approach to AI talent matching"
  },
  {
    title: "Forbes 30 Under 30",
    organization: "Forbes Magazine", 
    year: "2025",
    description: "CEO Sarah Chen honored in Enterprise Technology category"
  },
  {
    title: "Fast Company Most Innovative Companies",
    organization: "Fast Company",
    year: "2024",
    description: "Listed in AI/Machine Learning category for platform innovation"
  },
  {
    title: "Deloitte Technology Fast 500",
    organization: "Deloitte",
    year: "2024", 
    description: "Ranked #47 for rapid revenue growth and innovation"
  }
];

export default function PressPage() {
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
              Press & Media
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
            Press & Media
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            In the News
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay updated on Taskify's latest announcements, partnerships, awards, and insights shaping the future of team collaboration.
          </p>
        </motion.div>

        {/* Key Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Newspaper className="h-6 w-6 text-blue-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">200+</div>
              <div className="text-gray-600">Media Mentions</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-green-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Award className="h-6 w-6 text-green-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">8</div>
              <div className="text-gray-600">Industry Awards</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-purple-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Globe className="h-6 w-6 text-purple-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">50+</div>
              <div className="text-gray-600">Countries Covered</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="h-12 w-12 bg-orange-100 rounded-full flex items-center justify-center mx-auto mb-4">
                <Building2 className="h-6 w-6 text-orange-600" />
              </div>
              <div className="text-2xl font-bold text-gray-900">$50M</div>
              <div className="text-gray-600">Series B Raised</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Featured Press Releases */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-gray-900 mb-8">Latest News</h2>
          
          {/* Featured Articles */}
          <div className="grid lg:grid-cols-2 gap-8 mb-12">
            {pressReleases.filter(pr => pr.featured).map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300 group cursor-pointer">
                  <CardHeader>
                    <div className="flex items-center justify-between mb-3">
                      <Badge 
                        className={`${
                          release.type === 'Funding' ? 'bg-green-100 text-green-800' :
                          release.type === 'Partnership' ? 'bg-blue-100 text-blue-800' :
                          release.type === 'Product' ? 'bg-purple-100 text-purple-800' :
                          release.type === 'Award' ? 'bg-yellow-100 text-yellow-800' :
                          'bg-gray-100 text-gray-800'
                        }`}
                      >
                        {release.type}
                      </Badge>
                      <Badge variant="outline">Featured</Badge>
                    </div>
                    <CardTitle className="group-hover:text-blue-600 transition-colors">
                      {release.title}
                    </CardTitle>
                    <CardDescription className="flex items-center text-gray-500">
                      <Calendar className="h-4 w-4 mr-2" />
                      {release.date}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-gray-600 mb-6">{release.excerpt}</p>
                    <div className="flex gap-3">
                      <Button size="sm" className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                        <ExternalLink className="h-4 w-4 mr-2" />
                        Read More
                      </Button>
                      <Button size="sm" variant="outline">
                        <Download className="h-4 w-4 mr-2" />
                        Download
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* All Press Releases */}
          <h3 className="text-xl font-semibold text-gray-900 mb-6">All Press Releases</h3>
          <div className="space-y-4">
            {pressReleases.map((release, index) => (
              <motion.div
                key={release.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="bg-white/80 backdrop-blur-xl border-0 shadow-lg hover:shadow-xl transition-all duration-300 group cursor-pointer">
                  <CardContent className="p-6">
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-3 mb-2">
                          <Badge 
                            variant="secondary"
                            className={`${
                              release.type === 'Funding' ? 'bg-green-100 text-green-800' :
                              release.type === 'Partnership' ? 'bg-blue-100 text-blue-800' :
                              release.type === 'Product' ? 'bg-purple-100 text-purple-800' :
                              release.type === 'Award' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'
                            }`}
                          >
                            {release.type}
                          </Badge>
                          <span className="text-sm text-gray-500 flex items-center">
                            <Calendar className="h-4 w-4 mr-1" />
                            {release.date}
                          </span>
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2 group-hover:text-blue-600 transition-colors">
                          {release.title}
                        </h3>
                        <p className="text-gray-600">{release.excerpt}</p>
                      </div>
                      <div className="flex gap-2 ml-4">
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline">
                          <ExternalLink className="h-4 w-4" />
                        </Button>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        <div className="grid lg:grid-cols-2 gap-12">
          {/* Awards & Recognition */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.5 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Award className="h-6 w-6 text-yellow-600" />
                  Awards & Recognition
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-6">
                {awards.map((award, index) => (
                  <div key={index} className="border-l-4 border-blue-500 pl-4">
                    <h4 className="font-semibold text-gray-900">{award.title}</h4>
                    <p className="text-sm text-blue-600 mb-1">{award.organization} • {award.year}</p>
                    <p className="text-sm text-gray-600">{award.description}</p>
                  </div>
                ))}
              </CardContent>
            </Card>
          </motion.div>

          {/* Media Kit */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.6, delay: 0.6 }}
          >
            <Card className="bg-white/90 backdrop-blur-xl border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Download className="h-6 w-6 text-purple-600" />
                  Media Kit
                </CardTitle>
                <CardDescription>
                  High-resolution logos, photos, and brand assets for media use.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Logos & Brand Assets</h4>
                  <div className="space-y-2">
                    {mediaKit.logos.map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.format} • {item.size}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <div>
                  <h4 className="font-semibold text-gray-900 mb-3">Photos</h4>
                  <div className="space-y-2">
                    {mediaKit.photos.slice(0, 2).map((item, index) => (
                      <div key={index} className="flex items-center justify-between p-2 bg-gray-50 rounded-lg">
                        <div>
                          <div className="font-medium text-sm">{item.name}</div>
                          <div className="text-xs text-gray-500">{item.format} • {item.size}</div>
                        </div>
                        <Button size="sm" variant="outline">
                          <Download className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                  </div>
                </div>

                <Button className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  Download Complete Media Kit
                </Button>
              </CardContent>
            </Card>
          </motion.div>
        </div>

        {/* Contact Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Media Inquiries</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                For press inquiries, interviews, or additional information, please contact our media team.
              </p>
              <div className="grid md:grid-cols-2 gap-8 max-w-2xl mx-auto">
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Press Contact</h3>
                  <p className="text-blue-100">Sarah Johnson</p>
                  <p className="text-blue-100">Director of Communications</p>
                  <p className="text-blue-100">press@infera.ai</p>
                  <p className="text-blue-100">+1 (555) 123-4567</p>
                </div>
                <div className="text-center">
                  <h3 className="font-semibold mb-2">Investor Relations</h3>
                  <p className="text-blue-100">Michael Chen</p>
                  <p className="text-blue-100">VP of Finance</p>
                  <p className="text-blue-100">investors@infera.ai</p>
                  <p className="text-blue-100">+1 (555) 123-4568</p>
                </div>
              </div>
              <Button size="lg" variant="secondary" className="mt-8 bg-white text-blue-600 hover:bg-blue-50">
                Contact Press Team
              </Button>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}