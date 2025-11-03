import { Card, CardContent, CardHeader } from './ui/card';
import { Badge } from './ui/badge';
import { Button } from './ui/button';
import { motion } from 'framer-motion';
import { ArrowRight, Clock, DollarSign, Users, Star, TrendingUp, MapPin } from 'lucide-react';

const featuredOpportunities = [
  {
    id: '1',
    title: 'AI Training Data Specialist',
    category: 'AI/ML',
    rate: '$25-40/hr',
    description: 'Help train large language models by creating high-quality training data and providing feedback on AI responses.',
    skills: ['Machine Learning', 'Python', 'Data Analysis'],
    timeCommitment: '10-20 hrs/week',
    applicants: 234,
    rating: 4.9,
    location: 'Remote',
    badge: 'Top Pay',
    badgeColor: 'bg-green-100 text-green-700 border-green-200',
    trending: true
  },
  {
    id: '2',
    title: 'Code Review & Optimization',
    category: 'Software Engineering',
    rate: '$30-50/hr',
    description: 'Review and optimize code for AI systems, ensuring best practices and performance improvements.',
    skills: ['JavaScript', 'Python', 'Code Review'],
    timeCommitment: '15-25 hrs/week',
    applicants: 156,
    rating: 4.8,
    location: 'Remote',
    badge: 'High Demand',
    badgeColor: 'bg-blue-100 text-blue-700 border-blue-200',
    trending: false
  },
  {
    id: '3',
    title: 'Technical Content Creator',
    category: 'Writing & Education',
    rate: '$20-35/hr',
    description: 'Create educational content and tutorials about AI technologies for training purposes.',
    skills: ['Technical Writing', 'AI Knowledge', 'Content Creation'],
    timeCommitment: '8-15 hrs/week',
    applicants: 89,
    rating: 4.7,
    location: 'Worldwide',
    badge: 'Flexible',
    badgeColor: 'bg-purple-100 text-purple-700 border-purple-200',
    trending: true
  }
];

interface OpportunitiesProps {
  onApplyClick: () => void;
}

export function Opportunities({ onApplyClick }: OpportunitiesProps) {
  const handleViewAll = () => {
    // Trigger event to switch to all opportunities view
    window.dispatchEvent(new CustomEvent('viewAllOpportunities'));
  };

  return (
    <section id="opportunities" className="py-20 bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-16">
          <motion.h2 
            className="text-4xl font-bold text-gray-900 mb-4"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            viewport={{ once: true }}
          >
            Current <span className="bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">Opportunities</span>
          </motion.h2>
          <motion.p 
            className="text-xl text-gray-600 max-w-3xl mx-auto"
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.1 }}
            viewport={{ once: true }}
          >
            Explore high-paying opportunities to help train the next generation of AI systems
          </motion.p>
        </div>

        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8 mb-12">
          {featuredOpportunities.map((opportunity, index) => (
            <motion.div
              key={opportunity.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              viewport={{ once: true }}
            >
              <Card className="h-full hover:shadow-xl transition-all duration-300 border border-gray-100/50 bg-white group cursor-pointer">
                <CardHeader className="pb-4">
                  <div className="flex justify-between items-start mb-3">
                    <div className="flex items-center gap-2">
                      <Badge className={`${opportunity.badgeColor} font-medium`}>
                        {opportunity.badge}
                      </Badge>
                      {opportunity.trending && (
                        <div className="flex items-center text-orange-600 text-xs font-medium">
                          <TrendingUp className="h-3 w-3 mr-1" />
                          Trending
                        </div>
                      )}
                    </div>
                    <div className="flex items-center text-green-600 font-bold text-lg">
                      <DollarSign className="h-5 w-5 mr-1" />
                      {opportunity.rate}
                    </div>
                  </div>

                  <h3 className="text-xl font-bold text-gray-900 group-hover:text-blue-600 transition-colors">
                    {opportunity.title}
                  </h3>
                  
                  <Badge variant="outline" className="w-fit text-xs">
                    {opportunity.category}
                  </Badge>
                </CardHeader>
                
                <CardContent className="pt-0">
                  <p className="text-gray-600 mb-6 line-clamp-3 leading-relaxed">
                    {opportunity.description}
                  </p>

                  <div className="flex flex-wrap gap-2 mb-6">
                    {opportunity.skills.slice(0, 3).map((skill) => (
                      <Badge 
                        key={skill} 
                        variant="outline" 
                        className="text-xs bg-gray-50 border-gray-200 text-gray-700"
                      >
                        {skill}
                      </Badge>
                    ))}
                  </div>

                  <div className="space-y-4 mb-6">
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-gray-600">
                        <Clock className="h-4 w-4 mr-2" />
                        {opportunity.timeCommitment}
                      </div>
                      <div className="flex items-center text-gray-600">
                        <MapPin className="h-4 w-4 mr-2" />
                        {opportunity.location}
                      </div>
                    </div>
                    
                    <div className="flex items-center justify-between text-sm">
                      <div className="flex items-center text-amber-600">
                        <Star className="h-4 w-4 mr-1 fill-current" />
                        <span className="font-medium">{opportunity.rating}</span>
                      </div>
                      <div className="flex items-center text-gray-600">
                        <Users className="h-4 w-4 mr-1" />
                        {opportunity.applicants} applied
                      </div>
                    </div>
                  </div>

                  <Button 
                    onClick={onApplyClick}
                    className="w-full bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-medium py-3 rounded-lg transition-all duration-300 group-hover:shadow-lg"
                  >
                    Apply Now
                    <ArrowRight className="h-4 w-4 ml-2 group-hover:translate-x-1 transition-transform" />
                  </Button>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>

        <motion.div 
          className="text-center bg-gradient-to-r from-blue-50 to-purple-50 rounded-2xl p-8 mt-12"
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
          viewport={{ once: true }}
        >
          <h3 className="text-2xl font-bold text-gray-900 mb-4">
            Ready to Explore More?
          </h3>
          <p className="text-gray-600 mb-6 max-w-2xl mx-auto">
            Join over 10,000 professionals earning competitive rates while helping shape AI technology. 
            Browse hundreds of opportunities across different specializations.
          </p>
          
          <div className="flex flex-wrap justify-center gap-8 mb-8 text-sm text-gray-600">
            <div className="flex items-center">
              <div className="w-2 h-2 bg-green-500 rounded-full mr-2"></div>
              500+ Active Projects
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-blue-500 rounded-full mr-2"></div>
              Weekly Payments
            </div>
            <div className="flex items-center">
              <div className="w-2 h-2 bg-purple-500 rounded-full mr-2"></div>
              Global Remote Work
            </div>
          </div>
          
          <Button 
            onClick={handleViewAll}
            size="lg" 
            className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white px-8 py-4 text-lg font-medium rounded-xl shadow-lg hover:shadow-xl transition-all duration-300"
          >
            Browse All Opportunities
            <ArrowRight className="ml-3 h-5 w-5" />
          </Button>
        </motion.div>
      </div>
    </section>
  );
}