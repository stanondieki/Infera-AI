import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { useAuth } from '../utils/auth';
import { getOpportunities, type Opportunity } from '../utils/opportunities';
import { ArrowLeft, Search, Sparkles, Users, TrendingUp } from 'lucide-react';
import { Input } from './ui/input';
import { Header } from './Header';

const categories = [
  'All',
  'Software Engineering',
  'AI/ML',
  'Data Science',
  'Writing & Editing',
  'Education',
  'Creative',
  'Languages',
];

interface AllOpportunitiesProps {
  onBack: () => void;
  onSignInClick: () => void;
  onApplyClick?: () => void;
}

export function AllOpportunities({ onBack, onSignInClick, onApplyClick }: AllOpportunitiesProps) {
  const { user, accessToken } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);
  const [appliedOpportunities, setAppliedOpportunities] = useState<Set<string>>(new Set());

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory]);

  useEffect(() => {
    if (user) {
      checkAppliedOpportunities();
    }
  }, [user, opportunities]);

  const fetchOpportunities = async () => {
    try {
      const result = await getOpportunities(selectedCategory);
      setOpportunities(result.opportunities);
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const checkAppliedOpportunities = async () => {
    if (!user || opportunities.length === 0) return;
    
    try {
      const token = localStorage.getItem('token');
      if (!token) return;

      const appliedSet = new Set<string>();
      
      // Check each opportunity to see if user has applied
      const checkPromises = opportunities.map(async (opportunity) => {
        const opportunityId = opportunity._id || opportunity.id;
        try {
          const response = await fetch(`/api/opportunity-applications/${opportunityId}/check-application`, {
            headers: {
              'Authorization': `Bearer ${token}`,
            },
          });
          
          if (response.ok) {
            const data = await response.json();
            if (data.hasApplied) {
              appliedSet.add(opportunityId);
            }
          }
        } catch (error) {
          console.error(`Error checking application for opportunity ${opportunityId}:`, error);
        }
      });
      
      await Promise.all(checkPromises);
      setAppliedOpportunities(appliedSet);
    } catch (error) {
      console.error('Error checking applied opportunities:', error);
    }
  };

  const handleApply = async (opportunity: Opportunity) => {
    if (!user) {
      toast.error('Please sign in to apply');
      onSignInClick();
      return;
    }

    const opportunityId = opportunity._id || opportunity.id;
    setApplying(opportunityId);
    
    try {
      const token = localStorage.getItem('token');
      if (!token) {
        toast.error('Authentication required. Please sign in again.');
        onSignInClick();
        return;
      }

      const response = await fetch(`/api/opportunity-applications/${opportunityId}/apply`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({
          // You can add optional fields here in the future like coverLetter, portfolioUrl, etc.
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        if (response.status === 409) {
          toast.error('You have already applied to this opportunity', {
            description: `Applied on: ${new Date(data.appliedAt).toLocaleDateString()}`,
            duration: 5000,
          });
        } else if (response.status === 404) {
          toast.error('Opportunity not found');
        } else {
          toast.error(data.error || 'Failed to submit application');
        }
        return;
      }

      // Add to applied opportunities set
      setAppliedOpportunities(prev => new Set([...prev, opportunityId]));
      
      toast.success(`Successfully applied to: ${opportunity.title}`, {
        description: "Your application has been submitted and is under review.",
        duration: 5000,
      });
    } catch (error) {
      console.error('Application submission error:', error);
      toast.error('Failed to submit application. Please try again.');
    } finally {
      setApplying(null);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      searchQuery === '' ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (opp.requiredSkills || opp.skills || []).some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Main Header */}
      <Header 
        onSignInClick={onSignInClick} 
        onApplyClick={onApplyClick || (() => {})}
        onDashboardClick={() => {}}
      />
      
      {/* Hero Section for All Opportunities */}
      <section className="relative bg-gradient-to-br from-blue-600 via-indigo-700 to-purple-800 text-white overflow-hidden">
        {/* Animated Background Elements */}
        <div className="absolute inset-0 overflow-hidden">
          {/* Grid Pattern */}
          <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iNjAiIGhlaWdodD0iNjAiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyI+PGRlZnM+PHBhdHRlcm4gaWQ9ImdyaWQiIHdpZHRoPSI2MCIgaGVpZ2h0PSI2MCIgcGF0dGVyblVuaXRzPSJ1c2VyU3BhY2VPblVzZSI+PHBhdGggZD0iTSA2MCAwIEwgMCAwIDAgNjAiIGZpbGw9Im5vbmUiIHN0cm9rZT0iIzMzMzMzMyIgc3Ryb2tlLW9wYWNpdHk9IjAuMDUiIHN0cm9rZS13aWR0aD0iMSIvPjwvcGF0dGVybj48L2RlZnM+PHJlY3Qgd2lkdGg9IjEwMCUiIGhlaWdodD0iMTAwJSIgZmlsbD0idXJsKCNncmlkKSIvPjwvc3ZnPg==')] opacity-30"></div>
          
          {/* Floating Orbs */}
          <motion.div
            className="absolute top-10 -left-20 w-64 h-64 bg-blue-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, 30, 0],
              y: [0, 20, 0],
              scale: [1, 1.1, 1],
            }}
            transition={{
              duration: 15,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          <motion.div
            className="absolute bottom-10 -right-20 w-64 h-64 bg-purple-500/20 rounded-full blur-3xl"
            animate={{
              x: [0, -20, 0],
              y: [0, -30, 0],
              scale: [1, 1.2, 1],
            }}
            transition={{
              duration: 18,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
        </div>

        <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <Button
              variant="outline"
              onClick={onBack}
              className="mb-8 text-white border-white/70 bg-white/10 backdrop-blur-sm hover:bg-white hover:text-blue-600 hover:border-white transition-all duration-300 shadow-lg"
            >
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Home
            </Button>
            
            <div className="grid lg:grid-cols-2 gap-12 items-center">
              <div>
                <motion.div
                  initial={{ opacity: 0, x: -30 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                >
                  <h1 className="text-4xl md:text-6xl font-bold mb-6 bg-gradient-to-r from-white to-blue-100 bg-clip-text text-transparent">
                    {user ? 'Available Opportunities' : 'All Opportunities'}
                  </h1>
                  <p className="text-xl text-blue-100 mb-8 leading-relaxed">
                    {user 
                      ? `Welcome back, ${user.name}! Browse and apply to opportunities that match your expertise.`
                      : 'Explore all available AI training projects and find the perfect match for your skills. Join a global community of experts contributing to the future of AI.'
                    }
                  </p>
                </motion.div>
                
                {/* Stats */}
                <motion.div
                  className="grid grid-cols-3 gap-6"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: 0.4 }}
                >
                  <div className="text-center">
                    <Users className="h-8 w-8 text-blue-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">50k+</div>
                    <div className="text-sm text-blue-200">Active Contributors</div>
                  </div>
                  <div className="text-center">
                    <Sparkles className="h-8 w-8 text-purple-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">500+</div>
                    <div className="text-sm text-blue-200">Projects Available</div>
                  </div>
                  <div className="text-center">
                    <TrendingUp className="h-8 w-8 text-green-300 mx-auto mb-2" />
                    <div className="text-2xl font-bold text-white">$25M+</div>
                    <div className="text-sm text-blue-200">Paid to Experts</div>
                  </div>
                </motion.div>
              </div>
              
              <motion.div
                className="relative"
                initial={{ opacity: 0, x: 30 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
              >
                <div className="relative z-0">
                  {/* Floating Icons */}
                  <motion.div
                    className="absolute -top-4 -right-4 w-16 h-16 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm z-20"
                    animate={{
                      y: [0, -10, 0],
                      rotate: [0, 5, 0],
                    }}
                    transition={{
                      duration: 3,
                      repeat: Infinity,
                      ease: "easeInOut",
                    }}
                  >
                    <Sparkles className="h-8 w-8 text-yellow-300" />
                  </motion.div>
                  
                  <motion.div
                    className="absolute -bottom-4 -left-4 w-12 h-12 bg-white/10 rounded-full flex items-center justify-center backdrop-blur-sm z-20"
                    animate={{
                      y: [0, 10, 0],
                      rotate: [0, -5, 0],
                    }}
                    transition={{
                      duration: 4,
                      repeat: Infinity,
                      ease: "easeInOut",
                      delay: 1,
                    }}
                  >
                    <TrendingUp className="h-6 w-6 text-green-300" />
                  </motion.div>
                  
                  {/* Main Content Card */}
                  <div className="bg-white/10 backdrop-blur-md rounded-2xl p-8 border border-white/20 relative z-10">
                    <h3 className="text-2xl font-semibold text-white mb-4">Ready to Get Started?</h3>
                    <p className="text-blue-100 mb-6">
                      Browse through hundreds of AI training opportunities and start earning while contributing to cutting-edge technology.
                    </p>
                    <div className="space-y-3">
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-blue-100">Flexible work schedules</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-blue-100">Competitive compensation</span>
                      </div>
                      <div className="flex items-center gap-3">
                        <div className="w-2 h-2 bg-green-400 rounded-full"></div>
                        <span className="text-blue-100">Global community</span>
                      </div>
                    </div>
                  </div>
                </div>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Search and Opportunities Section */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <motion.div
          className="mb-8 space-y-6"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
        >
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search opportunities by title, description, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10 h-12 text-lg border-2 focus:border-blue-500 transition-colors"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <motion.div
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                <Button
                  variant={selectedCategory === category ? 'default' : 'outline'}
                  className={`
                    transition-all duration-300
                    ${selectedCategory === category 
                      ? 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 shadow-lg' 
                      : 'hover:border-blue-500 hover:text-blue-600'
                    }
                  `}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </Button>
              </motion.div>
            ))}
          </div>
        </motion.div>

        {/* Results Count */}
        <motion.div
          className="mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <p className="text-gray-600 text-lg">
            Showing <span className="text-gray-900 font-semibold">{filteredOpportunities.length}</span>{' '}
            {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
            {selectedCategory !== 'All' && (
              <span className="text-blue-600"> in {selectedCategory}</span>
            )}
          </p>
        </motion.div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-16">
            <motion.div
              className="inline-block"
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
            >
              <Sparkles className="h-8 w-8 text-blue-600" />
            </motion.div>
            <p className="text-gray-600 mt-4 text-lg">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <motion.div
            className="text-center py-16"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="bg-gray-50 rounded-full w-24 h-24 flex items-center justify-center mx-auto mb-6">
              <Search className="h-12 w-12 text-gray-400" />
            </div>
            <p className="text-gray-600 text-xl mb-6">
              No opportunities found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
              className="hover:bg-blue-50 hover:border-blue-500 transition-all duration-300"
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 relative z-0" layout>
            {filteredOpportunities.map((opp, index) => (
              <motion.div
                key={opp._id || opp.id || `opp-${index}`}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredCard(opp._id || opp.id)}
                onHoverEnd={() => setHoveredCard(null)}
                whileHover={{ y: -5, zIndex: 50 }}
                className="relative z-10"
              >
                <Card className="hover:shadow-xl transition-all duration-300 h-full flex flex-col border-2 hover:border-blue-200 relative z-10">
                  <CardContent className="p-6 flex flex-col h-full relative z-20">
                    <div className="flex items-start justify-between mb-4">
                      <Badge 
                        variant="secondary" 
                        className="bg-blue-50 text-blue-700 border-blue-200"
                      >
                        {opp.category}
                      </Badge>
                      <motion.span
                        className="text-blue-600 font-bold text-lg"
                        animate={{
                          scale: hoveredCard === (opp._id || opp.id) ? 1.1 : 1,
                        }}
                        transition={{ duration: 0.2 }}
                      >
                        {opp.rate || 
                         (opp.hourlyRate 
                           ? `$${opp.hourlyRate.min}-${opp.hourlyRate.max}/${opp.hourlyRate.currency || 'hr'}` 
                           : '$25-40/hr')}
                      </motion.span>
                    </div>
                    <h3 className="text-xl font-semibold text-gray-900 mb-3 line-clamp-2">{opp.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow line-clamp-3">{opp.description}</p>

                    {opp.requirements && (
                      <div className="mb-4 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                        <p className="text-sm text-amber-800">
                          <span className="font-medium">Requirements:</span> {opp.requirements}
                        </p>
                      </div>
                    )}

                    {opp.timeCommitment && (
                      <div className="mb-4 p-3 bg-green-50 border border-green-200 rounded-lg">
                        <p className="text-sm text-green-800">
                          <span className="font-medium">Time Commitment:</span> {(() => {
                            if (typeof opp.timeCommitment === 'string') {
                              return opp.timeCommitment;
                            }
                            if (typeof opp.timeCommitment === 'object' && opp.timeCommitment) {
                              const tc = opp.timeCommitment as any;
                              if (tc.duration) {
                                return tc.duration;
                              }
                              if (tc.hoursPerWeek) {
                                return `${tc.hoursPerWeek.min || 10}-${tc.hoursPerWeek.max || 20} hrs/week`;
                              }
                            }
                            return '10-20 hrs/week';
                          })()}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-6">
                      {(opp.requiredSkills || opp.skills || []).slice(0, 4).map((skill, skillIndex) => (
                        <span
                          key={`${skill}-${skillIndex}`}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm font-medium hover:bg-gray-200 transition-colors"
                        >
                          {skill}
                        </span>
                      ))}
                      {(opp.requiredSkills || opp.skills || []).length > 4 && (
                        <span className="bg-gray-100 text-gray-500 px-3 py-1 rounded-full text-sm">
                          +{(opp.requiredSkills || opp.skills || []).length - 4} more
                        </span>
                      )}
                    </div>

                    <motion.div
                      whileHover={{ scale: 1.02 }}
                      whileTap={{ scale: 0.98 }}
                      className="relative z-30"
                    >
                      {(() => {
                        const opportunityId = opp._id || opp.id;
                        const hasApplied = appliedOpportunities.has(opportunityId);
                        const isApplying = applying === opportunityId;
                        
                        return (
                          <Button
                            className={`w-full transition-all duration-300 shadow-lg hover:shadow-xl relative z-40 ${
                              hasApplied 
                                ? 'bg-green-600 hover:bg-green-700 cursor-default' 
                                : 'bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700'
                            }`}
                            onClick={() => hasApplied ? null : handleApply(opp)}
                            disabled={isApplying || hasApplied}
                          >
                            {isApplying ? (
                              <motion.div
                                className="flex items-center gap-2"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                              >
                                <motion.div
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full"
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                />
                                Applying...
                              </motion.div>
                            ) : hasApplied ? (
                              <div className="flex items-center gap-2">
                                <svg className="w-4 h-4" fill="currentColor" viewBox="0 0 20 20">
                                  <path fillRule="evenodd" d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z" clipRule="evenodd" />
                                </svg>
                                Applied
                              </div>
                            ) : (
                              'Apply Now'
                            )}
                          </Button>
                        );
                      })()}
                    </motion.div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        )}
      </div>
    </div>
  );
}
