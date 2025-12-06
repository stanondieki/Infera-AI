'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, Calendar, User, Tag, Search, Eye, MessageCircle, Heart, Share2, Filter } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const blogPosts = [
  {
    id: 1,
    title: "The Future of AI in Enterprise: Trends to Watch in 2025",
    excerpt: "Explore the emerging AI trends that will reshape enterprise operations in 2025, from autonomous systems to ethical AI implementation.",
    category: "AI Trends",
    author: "Sarah Chen",
    authorRole: "AI Research Director",
    date: "December 5, 2025",
    readTime: "8 min read",
    image: "/api/placeholder/400/250",
    tags: ["AI", "Enterprise", "Machine Learning", "Automation"],
    views: 2847,
    comments: 23,
    featured: true
  },
  {
    id: 2,
    title: "Building Ethical AI: A Comprehensive Guide for Developers",
    excerpt: "Learn best practices for developing AI systems that are fair, transparent, and aligned with ethical principles.",
    category: "Best Practices",
    author: "Michael Rodriguez",
    authorRole: "Ethics in AI Specialist",
    date: "December 3, 2025",
    readTime: "12 min read",
    image: "/api/placeholder/400/250",
    tags: ["Ethics", "AI Development", "Bias", "Fairness"],
    views: 1923,
    comments: 18,
    featured: false
  },
  {
    id: 3,
    title: "How to Scale Your Data Science Team: Lessons from 100+ Startups",
    excerpt: "Insights from successful startups on building and scaling data science teams, including hiring strategies and team structure.",
    category: "Team Building",
    author: "Emily Johnson",
    authorRole: "Head of Talent Acquisition",
    date: "November 30, 2025",
    readTime: "10 min read",
    image: "/api/placeholder/400/250",
    tags: ["Data Science", "Team Building", "Hiring", "Startups"],
    views: 3156,
    comments: 34,
    featured: true
  },
  {
    id: 4,
    title: "MLOps Best Practices: From Development to Production",
    excerpt: "A comprehensive guide to implementing MLOps practices that ensure reliable, scalable machine learning deployments.",
    category: "Technical",
    author: "David Kim",
    authorRole: "Senior ML Engineer",
    date: "November 28, 2025",
    readTime: "15 min read",
    image: "/api/placeholder/400/250",
    tags: ["MLOps", "Deployment", "DevOps", "ML Engineering"],
    views: 2634,
    comments: 29,
    featured: false
  },
  {
    id: 5,
    title: "The ROI of AI: Measuring Success in AI Implementation",
    excerpt: "Learn how to measure and demonstrate the return on investment for AI initiatives in your organization.",
    category: "Business",
    author: "Lisa Thompson",
    authorRole: "AI Strategy Consultant",
    date: "November 25, 2025",
    readTime: "9 min read",
    image: "/api/placeholder/400/250",
    tags: ["ROI", "AI Strategy", "Business Value", "Metrics"],
    views: 1847,
    comments: 16,
    featured: false
  },
  {
    id: 6,
    title: "Natural Language Processing in 2025: What's New and What's Next",
    excerpt: "Discover the latest breakthroughs in NLP technology and their practical applications across industries.",
    category: "Technology",
    author: "Robert Chang",
    authorRole: "NLP Research Scientist",
    date: "November 22, 2025",
    readTime: "11 min read",
    image: "/api/placeholder/400/250",
    tags: ["NLP", "Language Models", "Innovation", "Research"],
    views: 2198,
    comments: 21,
    featured: false
  }
];

const categories = ["All", "AI Trends", "Best Practices", "Team Building", "Technical", "Business", "Technology"];

export default function BlogPage() {
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [searchTerm, setSearchTerm] = useState("");

  const filteredPosts = blogPosts.filter(post => {
    const matchesCategory = selectedCategory === "All" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.excerpt.toLowerCase().includes(searchTerm.toLowerCase()) ||
                         post.tags.some(tag => tag.toLowerCase().includes(searchTerm.toLowerCase()));
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = blogPosts.filter(post => post.featured);

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
              Blog
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
            Insights & Resources
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            AI Insights & Industry Expertise
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Stay ahead of the curve with expert insights, best practices, and the latest trends in AI and machine learning.
          </p>
        </motion.div>

        {/* Search and Filter */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="mb-12"
        >
          <div className="flex flex-col md:flex-row gap-4 mb-8">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search articles..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              />
            </div>
            <div className="flex items-center gap-2">
              <Filter className="h-5 w-5 text-gray-500" />
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-transparent"
              >
                {categories.map(category => (
                  <option key={category} value={category}>{category}</option>
                ))}
              </select>
            </div>
          </div>
        </motion.div>

        {/* Featured Posts */}
        {selectedCategory === "All" && searchTerm === "" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-8">Featured Articles</h2>
            <div className="grid md:grid-cols-2 gap-8">
              {featuredPosts.slice(0, 2).map((post) => (
                <Card key={post.id} className="group cursor-pointer overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-blue-500 to-purple-600 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                    <Badge className="absolute top-4 left-4 bg-white text-gray-900">
                      Featured
                    </Badge>
                  </div>
                  <CardContent className="p-6">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-xl font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4">{post.excerpt}</p>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-3">
                        <div className="h-8 w-8 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-4 w-4 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-sm">{post.author}</div>
                          <div className="text-gray-500 text-xs">{post.authorRole}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500 text-sm">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-4 w-4" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-4 w-4" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </motion.div>
        )}

        {/* All Posts */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-8">
            {selectedCategory === "All" ? "Latest Articles" : `${selectedCategory} Articles`}
            <span className="text-gray-500 font-normal ml-2">({filteredPosts.length})</span>
          </h2>
          
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredPosts.map((post, index) => (
              <motion.div
                key={post.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="group cursor-pointer h-full overflow-hidden bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <div className="aspect-video bg-gradient-to-br from-gray-400 to-gray-600 relative">
                    <div className="absolute inset-0 bg-black/20 group-hover:bg-black/10 transition-colors" />
                  </div>
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-center gap-2 mb-3">
                      <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                        {post.category}
                      </Badge>
                      <span className="text-sm text-gray-500">•</span>
                      <span className="text-sm text-gray-500">{post.readTime}</span>
                    </div>
                    <h3 className="text-lg font-bold text-gray-900 mb-3 group-hover:text-blue-600 transition-colors line-clamp-2">
                      {post.title}
                    </h3>
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{post.excerpt}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-4">
                      {post.tags.slice(0, 3).map((tag) => (
                        <Badge key={tag} variant="outline" className="text-xs">
                          {tag}
                        </Badge>
                      ))}
                    </div>

                    <div className="flex items-center justify-between pt-4 border-t border-gray-100">
                      <div className="flex items-center space-x-2">
                        <div className="h-6 w-6 bg-gradient-to-r from-blue-500 to-purple-500 rounded-full flex items-center justify-center">
                          <User className="h-3 w-3 text-white" />
                        </div>
                        <div>
                          <div className="font-medium text-gray-900 text-xs">{post.author}</div>
                          <div className="text-gray-500 text-xs">{post.date}</div>
                        </div>
                      </div>
                      <div className="flex items-center space-x-3 text-gray-500 text-xs">
                        <div className="flex items-center space-x-1">
                          <Eye className="h-3 w-3" />
                          <span>{post.views}</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <MessageCircle className="h-3 w-3" />
                          <span>{post.comments}</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>

          {filteredPosts.length === 0 && (
            <div className="text-center py-16">
              <div className="text-gray-400 mb-4">
                <Search className="h-16 w-16 mx-auto" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-2">No articles found</h3>
              <p className="text-gray-600">Try adjusting your search or filter criteria.</p>
            </div>
          )}
        </motion.div>

        {/* Newsletter Signup */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="text-center py-12">
              <h2 className="text-3xl font-bold mb-4">Stay Updated</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                Get the latest AI insights and expert tips delivered straight to your inbox.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto">
                <input
                  type="email"
                  placeholder="Enter your email"
                  className="px-4 py-3 rounded-lg text-gray-900 flex-1"
                />
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  Subscribe
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}