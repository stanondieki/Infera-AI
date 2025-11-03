import { Card, CardContent } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { toast } from 'sonner';
import { projectId, publicAnonKey } from '../utils/supabase/info';
import { useAuth } from '../utils/auth';
import { ArrowLeft, Search } from 'lucide-react';
import { Input } from './ui/input';

interface Opportunity {
  id: string;
  title: string;
  category: string;
  rate: string;
  description: string;
  skills: string[];
  requirements?: string;
  timeCommitment?: string;
  status: string;
}

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
}

export function AllOpportunities({ onBack, onSignInClick }: AllOpportunitiesProps) {
  const { user, accessToken } = useAuth();
  const [opportunities, setOpportunities] = useState<Opportunity[]>([]);
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [searchQuery, setSearchQuery] = useState('');
  const [hoveredCard, setHoveredCard] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [applying, setApplying] = useState<string | null>(null);

  useEffect(() => {
    fetchOpportunities();
  }, [selectedCategory]);

  const fetchOpportunities = async () => {
    try {
      const url = new URL(
        `https://${projectId}.supabase.co/functions/v1/make-server-35bc625a/opportunities`
      );
      if (selectedCategory !== 'All') {
        url.searchParams.append('category', selectedCategory);
      }

      const response = await fetch(url.toString(), {
        headers: {
          Authorization: `Bearer ${publicAnonKey}`,
        },
      });

      if (response.ok) {
        const data = await response.json();
        setOpportunities(data.opportunities || []);
      } else {
        toast.error('Failed to load opportunities');
      }
    } catch (error) {
      console.error('Error fetching opportunities:', error);
      toast.error('Failed to load opportunities');
    } finally {
      setLoading(false);
    }
  };

  const handleApply = async (opportunity: Opportunity) => {
    if (!user) {
      toast.error('Please sign in to apply');
      onSignInClick();
      return;
    }

    setApplying(opportunity.id);
    try {
      const response = await fetch(
        `https://${projectId}.supabase.co/functions/v1/make-server-35bc625a/apply`,
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${accessToken}`,
          },
          body: JSON.stringify({
            opportunityId: opportunity.id,
            opportunityTitle: opportunity.title,
          }),
        }
      );

      if (response.ok) {
        toast.success(`Successfully applied to ${opportunity.title}!`);
      } else {
        const error = await response.json();
        toast.error(error.error || 'Failed to submit application');
      }
    } catch (error) {
      console.error('Error applying:', error);
      toast.error('Failed to submit application');
    } finally {
      setApplying(null);
    }
  };

  const filteredOpportunities = opportunities.filter((opp) => {
    const matchesSearch =
      searchQuery === '' ||
      opp.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.description.toLowerCase().includes(searchQuery.toLowerCase()) ||
      opp.skills.some((skill) => skill.toLowerCase().includes(searchQuery.toLowerCase()));
    return matchesSearch;
  });

  return (
    <div className="min-h-screen bg-white">
      {/* Header */}
      <div className="bg-gradient-to-r from-blue-600 to-indigo-700 text-white py-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <Button
            variant="outline"
            onClick={onBack}
            className="mb-6 text-white border-white hover:bg-white hover:text-blue-600"
          >
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Home
          </Button>
          <h1 className="text-4xl md:text-5xl mb-4">All Opportunities</h1>
          <p className="text-xl text-blue-100 max-w-3xl">
            Explore all available AI training projects and find the perfect match for your skills
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        {/* Search and Filters */}
        <div className="mb-8 space-y-6">
          {/* Search Bar */}
          <div className="relative max-w-2xl">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-400" />
            <Input
              type="text"
              placeholder="Search opportunities by title, description, or skills..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-10"
            />
          </div>

          {/* Category Filter */}
          <div className="flex flex-wrap gap-3">
            {categories.map((category) => (
              <Button
                key={category}
                variant={selectedCategory === category ? 'default' : 'outline'}
                className={selectedCategory === category ? 'bg-blue-600 hover:bg-blue-700' : ''}
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>

        {/* Results Count */}
        <div className="mb-6">
          <p className="text-gray-600">
            Showing <span className="text-gray-900">{filteredOpportunities.length}</span>{' '}
            {filteredOpportunities.length === 1 ? 'opportunity' : 'opportunities'}
          </p>
        </div>

        {/* Opportunities Grid */}
        {loading ? (
          <div className="text-center py-12">
            <p className="text-gray-600">Loading opportunities...</p>
          </div>
        ) : filteredOpportunities.length === 0 ? (
          <motion.div
            className="text-center py-12"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
          >
            <p className="text-gray-600 text-lg mb-4">
              No opportunities found matching your criteria.
            </p>
            <Button
              variant="outline"
              onClick={() => {
                setSelectedCategory('All');
                setSearchQuery('');
              }}
            >
              Clear Filters
            </Button>
          </motion.div>
        ) : (
          <motion.div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6" layout>
            {filteredOpportunities.map((opp, index) => (
              <motion.div
                key={opp.id}
                layout
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: index * 0.05 }}
                onHoverStart={() => setHoveredCard(opp.id)}
                onHoverEnd={() => setHoveredCard(null)}
              >
                <Card className="hover:shadow-lg transition-shadow h-full flex flex-col">
                  <CardContent className="p-6 flex flex-col h-full">
                    <div className="flex items-start justify-between mb-4">
                      <Badge variant="secondary">{opp.category}</Badge>
                      <motion.span
                        className="text-blue-600"
                        animate={{
                          scale: hoveredCard === opp.id ? 1.1 : 1,
                        }}
                      >
                        {opp.rate}
                      </motion.span>
                    </div>
                    <h3 className="text-xl text-gray-900 mb-3">{opp.title}</h3>
                    <p className="text-gray-600 mb-4 flex-grow">{opp.description}</p>

                    {opp.requirements && (
                      <div className="mb-4 p-3 bg-gray-50 rounded-lg">
                        <p className="text-sm text-gray-700">
                          <span className="font-medium">Requirements:</span> {opp.requirements}
                        </p>
                      </div>
                    )}

                    {opp.timeCommitment && (
                      <div className="mb-4">
                        <p className="text-sm text-gray-600">
                          <span className="font-medium">Time Commitment:</span> {opp.timeCommitment}
                        </p>
                      </div>
                    )}

                    <div className="flex flex-wrap gap-2 mb-4">
                      {opp.skills.map((skill) => (
                        <span
                          key={skill}
                          className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                        >
                          {skill}
                        </span>
                      ))}
                    </div>

                    <Button
                      className="w-full bg-blue-600 hover:bg-blue-700"
                      onClick={() => handleApply(opp)}
                      disabled={applying === opp.id}
                    >
                      {applying === opp.id ? 'Applying...' : 'Apply Now'}
                    </Button>
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
