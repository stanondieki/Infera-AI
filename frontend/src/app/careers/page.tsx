'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { motion } from 'framer-motion';
import { ArrowLeft, MapPin, Users, Briefcase, Clock, Heart, Coffee, Zap, Target, Send, Calendar, Building } from 'lucide-react';
import { Button } from '../../components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../../components/ui/card';
import { Badge } from '../../components/ui/badge';

const jobOpenings = [
  {
    id: 1,
    title: "Senior AI Engineer",
    department: "Engineering",
    location: "San Francisco, CA / Remote",
    type: "Full-time",
    experience: "5+ years",
    description: "Lead the development of cutting-edge AI solutions and mentor junior engineers.",
    requirements: ["PhD/MS in AI/ML", "Python/TensorFlow/PyTorch", "Production ML systems"],
    benefits: ["$150K-$200K", "Equity", "Health/Dental", "Unlimited PTO"],
    urgent: true
  },
  {
    id: 2,
    title: "Product Manager - AI Platform",
    department: "Product",
    location: "New York, NY / Remote",
    type: "Full-time", 
    experience: "3+ years",
    description: "Drive product strategy for our AI talent matching platform.",
    requirements: ["Product management experience", "Technical background", "AI/ML understanding"],
    benefits: ["$120K-$160K", "Equity", "Health/Dental", "Remote work"],
    urgent: false
  },
  {
    id: 3,
    title: "Head of Sales",
    department: "Sales",
    location: "Remote",
    type: "Full-time",
    experience: "7+ years",
    description: "Scale our sales organization and drive enterprise growth.",
    requirements: ["Enterprise sales leadership", "SaaS experience", "Team building"],
    benefits: ["$130K-$180K + Commission", "Equity", "Travel budget"],
    urgent: true
  },
  {
    id: 4,
    title: "DevOps Engineer",
    department: "Engineering",
    location: "Austin, TX / Remote",
    type: "Full-time",
    experience: "4+ years",
    description: "Build and maintain scalable infrastructure for our AI platform.",
    requirements: ["AWS/GCP", "Kubernetes", "CI/CD", "Infrastructure as Code"],
    benefits: ["$110K-$150K", "Equity", "Learning budget", "Flexible hours"],
    urgent: false
  },
  {
    id: 5,
    title: "UX Designer",
    department: "Design",
    location: "Los Angeles, CA / Remote",
    type: "Full-time",
    experience: "3+ years",
    description: "Design intuitive experiences for our AI-powered platform.",
    requirements: ["UI/UX design", "Figma/Sketch", "User research", "Design systems"],
    benefits: ["$90K-$130K", "Equity", "Design tools", "Conference budget"],
    urgent: false
  },
  {
    id: 6,
    title: "Data Scientist Intern",
    department: "Data",
    location: "San Francisco, CA",
    type: "Internship",
    experience: "Student",
    description: "Work on real-world ML projects and gain hands-on experience.",
    requirements: ["Statistics/ML coursework", "Python/R", "Curiosity and drive"],
    benefits: ["$25/hour", "Mentorship", "Learning opportunities", "Full-time potential"],
    urgent: false
  }
];

const benefits = [
  { icon: Heart, title: "Health & Wellness", description: "Comprehensive health, dental, and vision insurance" },
  { icon: Coffee, title: "Work-Life Balance", description: "Unlimited PTO and flexible working hours" },
  { icon: Zap, title: "Growth & Learning", description: "$3K annual learning budget and conference attendance" },
  { icon: Target, title: "Equity & Ownership", description: "Meaningful equity stake in our growing company" },
  { icon: Users, title: "Amazing Team", description: "Work with world-class AI experts and innovators" },
  { icon: Building, title: "Remote-First", description: "Work from anywhere with quarterly team gatherings" }
];

export default function CareersPage() {
  const [selectedDepartment, setSelectedDepartment] = useState("All");
  const [applicationForm, setApplicationForm] = useState<{
    name: string;
    email: string;
    resume: File | null;
    coverLetter: string;
    jobId: number | null;
  }>({
    name: '',
    email: '',
    resume: null,
    coverLetter: '',
    jobId: null
  });
  const [showApplicationForm, setShowApplicationForm] = useState(false);

  const departments = ["All", ...Array.from(new Set(jobOpenings.map(job => job.department)))];
  const filteredJobs = selectedDepartment === "All" 
    ? jobOpenings 
    : jobOpenings.filter(job => job.department === selectedDepartment);

  const handleApply = (jobId: number) => {
    setApplicationForm({ ...applicationForm, jobId });
    setShowApplicationForm(true);
  };

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
              Careers
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
            Join Our Mission
          </Badge>
          <h1 className="text-4xl md:text-6xl font-bold bg-gradient-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-6">
            Shape the Future of AI Talent
          </h1>
          <p className="text-xl text-gray-600 max-w-3xl mx-auto leading-relaxed">
            Join our passionate team of innovators building the world's most advanced AI talent marketplace. 
            We're looking for exceptional people who want to make a meaningful impact.
          </p>
        </motion.div>

        {/* Company Stats */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
          className="grid md:grid-cols-4 gap-6 mb-16"
        >
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-blue-600 mb-2">50+</div>
              <div className="text-gray-600">Team Members</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-green-600 mb-2">$50M</div>
              <div className="text-gray-600">Series B Funding</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-purple-600 mb-2">10K+</div>
              <div className="text-gray-600">AI Experts</div>
            </CardContent>
          </Card>
          <Card className="text-center bg-white/80 backdrop-blur-xl border-0 shadow-xl">
            <CardContent className="pt-6">
              <div className="text-3xl font-bold text-orange-600 mb-2">500+</div>
              <div className="text-gray-600">Companies Served</div>
            </CardContent>
          </Card>
        </motion.div>

        {/* Benefits Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="mb-16"
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Why You'll Love Working Here
          </h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            {benefits.map((benefit, index) => {
              const IconComponent = benefit.icon;
              return (
                <motion.div
                  key={benefit.title}
                  initial={{ opacity: 0, y: 30 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.1 * index }}
                >
                  <Card className="h-full bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                    <CardContent className="p-6 text-center">
                      <div className="h-12 w-12 bg-blue-100 rounded-full flex items-center justify-center mx-auto mb-4">
                        <IconComponent className="h-6 w-6 text-blue-600" />
                      </div>
                      <h3 className="text-lg font-semibold text-gray-900 mb-2">{benefit.title}</h3>
                      <p className="text-gray-600">{benefit.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </motion.div>

        {/* Job Openings */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <h2 className="text-3xl font-bold text-center text-gray-900 mb-12">
            Open Positions
          </h2>

          {/* Department Filter */}
          <div className="flex justify-center mb-8">
            <div className="flex flex-wrap gap-2">
              {departments.map(department => (
                <Button
                  key={department}
                  variant={selectedDepartment === department ? "default" : "outline"}
                  onClick={() => setSelectedDepartment(department)}
                  className={selectedDepartment === department 
                    ? "bg-gradient-to-r from-blue-600 to-purple-600" 
                    : "hover:bg-blue-50"
                  }
                >
                  {department}
                </Button>
              ))}
            </div>
          </div>

          {/* Job Listings */}
          <div className="grid lg:grid-cols-2 gap-8">
            {filteredJobs.map((job, index) => (
              <motion.div
                key={job.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.1 * index }}
              >
                <Card className="h-full bg-white/90 backdrop-blur-xl border-0 shadow-xl hover:shadow-2xl transition-all duration-300">
                  <CardHeader>
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-2">
                          <Badge 
                            variant="secondary" 
                            className={`${job.department === 'Engineering' ? 'bg-blue-100 text-blue-800' :
                              job.department === 'Product' ? 'bg-green-100 text-green-800' :
                              job.department === 'Sales' ? 'bg-purple-100 text-purple-800' :
                              job.department === 'Design' ? 'bg-pink-100 text-pink-800' :
                              job.department === 'Data' ? 'bg-yellow-100 text-yellow-800' :
                              'bg-gray-100 text-gray-800'}`}
                          >
                            {job.department}
                          </Badge>
                          {job.urgent && (
                            <Badge className="bg-red-100 text-red-800">
                              Urgent
                            </Badge>
                          )}
                        </div>
                        <CardTitle className="text-xl mb-2">{job.title}</CardTitle>
                        <CardDescription className="text-gray-600">
                          {job.description}
                        </CardDescription>
                      </div>
                    </div>
                  </CardHeader>
                  <CardContent>
                    <div className="grid grid-cols-2 gap-4 mb-6 text-sm">
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {job.location}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {job.type}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Briefcase className="h-4 w-4 mr-2" />
                        {job.experience}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-2" />
                        {job.department}
                      </div>
                    </div>

                    <div className="mb-4">
                      <h4 className="font-semibold text-gray-900 mb-2">Requirements:</h4>
                      <ul className="text-sm text-gray-600 space-y-1">
                        {job.requirements.map((req, idx) => (
                          <li key={idx} className="flex items-center">
                            <div className="h-1.5 w-1.5 bg-blue-500 rounded-full mr-2" />
                            {req}
                          </li>
                        ))}
                      </ul>
                    </div>

                    <div className="mb-6">
                      <h4 className="font-semibold text-gray-900 mb-2">Benefits:</h4>
                      <div className="flex flex-wrap gap-2">
                        {job.benefits.map((benefit, idx) => (
                          <Badge key={idx} variant="outline" className="text-xs">
                            {benefit}
                          </Badge>
                        ))}
                      </div>
                    </div>

                    <Button 
                      onClick={() => handleApply(job.id)}
                      className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                    >
                      Apply Now
                    </Button>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Application Form Modal Placeholder */}
        {showApplicationForm && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
            <Card className="w-full max-w-md bg-white">
              <CardHeader>
                <CardTitle>Quick Application</CardTitle>
                <CardDescription>
                  Apply for this position - we'll get back to you within 48 hours.
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-4">
                <input
                  type="text"
                  placeholder="Full Name"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <input
                  type="email"
                  placeholder="Email Address"
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <textarea
                  placeholder="Why are you interested in this role?"
                  rows={3}
                  className="w-full px-3 py-2 border border-gray-300 rounded-md"
                />
                <div className="flex gap-2">
                  <Button 
                    onClick={() => setShowApplicationForm(false)}
                    variant="outline" 
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button 
                    className="flex-1 bg-gradient-to-r from-blue-600 to-purple-600"
                  >
                    <Send className="h-4 w-4 mr-2" />
                    Submit
                  </Button>
                </div>
              </CardContent>
            </Card>
          </div>
        )}

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16"
        >
          <Card className="bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 border-0 text-white">
            <CardContent className="py-12">
              <h2 className="text-3xl font-bold mb-4">Don't See Your Perfect Role?</h2>
              <p className="text-xl text-blue-100 mb-8 max-w-2xl mx-auto">
                We're always looking for exceptional talent. Send us your resume and we'll keep you in mind for future opportunities.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button size="lg" variant="secondary" className="bg-white text-blue-600 hover:bg-blue-50">
                  <Send className="h-4 w-4 mr-2" />
                  Send Resume
                </Button>
                <Button size="lg" variant="outline" className="border-white text-white hover:bg-white/10">
                  <Calendar className="h-4 w-4 mr-2" />
                  Schedule a Chat
                </Button>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>
    </div>
  );
}