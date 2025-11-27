import { apiClient, API_ENDPOINTS } from './api';

export interface Opportunity {
  // Backend fields
  _id?: string;
  id: string;
  title: string;
  category: string;
  description: string;
  
  // Skills (backend uses requiredSkills)
  skills?: string[];
  requiredSkills?: string[];
  preferredSkills?: string[];
  
  // Rate structure (backend uses hourlyRate object)
  rate?: string;
  hourlyRate?: {
    min: number;
    max: number;
    currency: string;
  };
  
  // Time commitment (backend uses object structure)
  timeCommitment?: string | {
    hoursPerWeek: {
      min: number;
      max: number;
    };
    duration?: string;
  };
  
  // Applicant counts (backend uses different field names)
  applicants?: number;
  applications?: number;
  currentApplicants?: number;
  maxApplicants?: number;
  
  rating?: number;
  location: string;
  status?: string;
  priority?: string;
  experienceLevel?: string;
  
  // Display fields
  badge?: string;
  badgeColor?: string;
  trending?: boolean;
  featured?: boolean;
  company?: string;
  requirements?: string[];
  benefits?: string[];
  duration?: string;
  level?: 'entry' | 'intermediate' | 'advanced';
  
  // Backend timestamps
  publishedAt?: string;
  applicationDeadline?: string;
  createdAt?: string;
  updatedAt?: string;
}

// Fallback hardcoded data for when API is unavailable
const fallbackOpportunities: Opportunity[] = [
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
    trending: true,
    featured: true
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
    trending: false,
    featured: true
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
    trending: false,
    featured: true
  },
  {
    id: '4',
    title: 'Data Annotation Specialist',
    category: 'Data Science',
    rate: '$18-28/hr',
    description: 'Annotate and label datasets for machine learning model training across various domains.',
    skills: ['Data Annotation', 'Machine Learning', 'Attention to Detail'],
    timeCommitment: '20-30 hrs/week',
    applicants: 312,
    rating: 4.6,
    location: 'Remote',
    badge: 'Entry Level',
    badgeColor: 'bg-orange-100 text-orange-700 border-orange-200',
    trending: true,
    featured: false
  },
  {
    id: '5',
    title: 'AI Model Tester',
    category: 'QA & Testing',
    rate: '$22-35/hr',
    description: 'Test AI models and systems for accuracy, performance, and bias detection.',
    skills: ['Testing', 'AI/ML', 'Quality Assurance'],
    timeCommitment: '12-18 hrs/week',
    applicants: 187,
    rating: 4.8,
    location: 'Remote',
    badge: 'Growing',
    badgeColor: 'bg-teal-100 text-teal-700 border-teal-200',
    trending: false,
    featured: false
  }
];

export async function getOpportunities(category?: string, featured?: boolean): Promise<{ opportunities: Opportunity[], total: number }> {
  try {
    let endpoint = API_ENDPOINTS.OPPORTUNITIES.LIST;
    const params = new URLSearchParams();
    
    if (category && category !== 'All') {
      params.append('category', category);
    }
    
    if (featured) {
      endpoint = API_ENDPOINTS.OPPORTUNITIES.FEATURED;
    }
    
    if (params.toString()) {
      endpoint += `?${params.toString()}`;
    }
    
    const response = await apiClient.get(endpoint);
    
    // If backend returns empty opportunities, use fallback data
    if (!response.opportunities || response.opportunities.length === 0) {
      console.log('Backend returned no opportunities, using fallback data');
      
      // Filter fallback data based on parameters
      let filtered = fallbackOpportunities;
      
      if (featured) {
        filtered = filtered.filter(opp => opp.featured);
      }
      
      if (category && category !== 'All') {
        filtered = filtered.filter(opp => opp.category === category);
      }
      
      return {
        opportunities: filtered,
        total: filtered.length
      };
    }
    
    return {
      opportunities: response.opportunities || [],
      total: response.total || 0
    };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    
    // Check if error response contains fallback data and debug info
    if (error.response?.data?.fallbackData) {
      console.log('🔍 Debug information from backend:', error.response.data.debug);
      console.log('📊 Using backend-provided fallback data');
      
      return {
        opportunities: error.response.data.fallbackData,
        total: error.response.data.fallbackData.length
      };
    }
    
    console.log('Falling back to hardcoded data');
    
    // Filter fallback data based on parameters
    let filtered = fallbackOpportunities;
    
    if (featured) {
      filtered = filtered.filter(opp => opp.featured);
    }
    
    if (category && category !== 'All') {
      filtered = filtered.filter(opp => opp.category === category);
    }
    
    return {
      opportunities: filtered,
      total: filtered.length
    };
  }
}

export async function getOpportunity(id: string): Promise<Opportunity | null> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.OPPORTUNITIES.GET(id));
    return response.opportunity || null;
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to hardcoded data');
    
    const opportunity = fallbackOpportunities.find(opp => opp.id === id);
    return opportunity || null;
  }
}

export async function createOpportunity(opportunityData: Omit<Opportunity, 'id'>, accessToken: string): Promise<Opportunity> {
  try {
    const response = await apiClient.post(API_ENDPOINTS.OPPORTUNITIES.CREATE, opportunityData, accessToken);
    return response.opportunity;
  } catch (error: any) {
    console.error('Failed to create opportunity:', error.message);
    throw error;
  }
}

export async function updateOpportunity(id: string, opportunityData: Partial<Opportunity>, accessToken: string): Promise<Opportunity> {
  try {
    const response = await apiClient.put(API_ENDPOINTS.OPPORTUNITIES.UPDATE(id), opportunityData, accessToken);
    return response.opportunity;
  } catch (error: any) {
    console.error('Failed to update opportunity:', error.message);
    throw error;
  }
}

export async function deleteOpportunity(id: string, accessToken: string): Promise<void> {
  try {
    await apiClient.delete(API_ENDPOINTS.OPPORTUNITIES.DELETE(id), accessToken);
  } catch (error: any) {
    console.error('Failed to delete opportunity:', error.message);
    throw error;
  }
}

export async function getOpportunitiesStats(accessToken: string): Promise<any> {
  try {
    const response = await apiClient.get(API_ENDPOINTS.OPPORTUNITIES.STATS, accessToken);
    return response;
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to static stats');
    
    return {
      total: fallbackOpportunities.length,
      featured: fallbackOpportunities.filter(opp => opp.featured).length,
      categories: [...new Set(fallbackOpportunities.map(opp => opp.category))].length,
      averageRating: 4.7
    };
  }
}