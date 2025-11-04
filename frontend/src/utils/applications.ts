import { apiClient, API_ENDPOINTS } from './api';

export interface ApplicationFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  expertise: string;
  experience: string;
  education: string;
  currentRole: string;
  skills: string[];
  availability: string;
  hoursPerWeek: string;
  bio: string;
  linkedIn: string;
  portfolio: string;
  agreeToTerms: boolean;
}

export interface Application extends ApplicationFormData {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  notes?: string;
}

const APPLICATIONS_STORAGE_KEY = 'inferaai_admin_applications';

function getInitialApplications(): Application[] {
  return [
    {
      id: '1',
      firstName: 'Alex',
      lastName: 'Thompson',
      email: 'alex.thompson@example.com',
      phone: '+1 (555) 123-4567',
      country: 'United States',
      expertise: 'Data Science',
      experience: '5+ years',
      education: "Master's Degree",
      currentRole: 'Senior Data Scientist',
      skills: ['Python', 'Machine Learning', 'Data Analysis', 'SQL'],
      availability: 'Part-time',
      hoursPerWeek: '15-20',
      bio: 'Experienced data scientist with a strong background in machine learning and AI. Passionate about training AI models and improving their accuracy through quality data annotation and validation.',
      linkedIn: 'https://linkedin.com/in/alexthompson',
      portfolio: 'https://alexthompson.dev',
      agreeToTerms: true,
      status: 'pending',
      submittedDate: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '2',
      firstName: 'Maria',
      lastName: 'Garcia',
      email: 'maria.garcia@example.com',
      phone: '+1 (555) 234-5678',
      country: 'Spain',
      expertise: 'Translation',
      experience: '3-5 years',
      education: "Bachelor's Degree",
      currentRole: 'Professional Translator',
      skills: ['Spanish', 'English', 'French', 'Translation', 'Localization'],
      availability: 'Full-time',
      hoursPerWeek: '30+',
      bio: 'Native Spanish speaker with extensive experience in technical and creative translation. Fluent in multiple languages with a keen eye for cultural nuances and context.',
      linkedIn: 'https://linkedin.com/in/mariagarcia',
      portfolio: '',
      agreeToTerms: true,
      status: 'accepted',
      submittedDate: new Date(Date.now() - 15 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedDate: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: 'Admin User',
      notes: 'Excellent qualifications and experience. Approved for translation projects.',
    },
    {
      id: '3',
      firstName: 'James',
      lastName: 'Wilson',
      email: 'james.wilson@example.com',
      phone: '+44 20 1234 5678',
      country: 'United Kingdom',
      expertise: 'Software Engineering',
      experience: '5+ years',
      education: "Bachelor's Degree",
      currentRole: 'Full Stack Developer',
      skills: ['JavaScript', 'TypeScript', 'React', 'Node.js', 'Code Review'],
      availability: 'Part-time',
      hoursPerWeek: '10-15',
      bio: 'Full stack developer with expertise in modern web technologies. Interested in helping improve AI code generation through thorough code review and quality assessment.',
      linkedIn: 'https://linkedin.com/in/jameswilson',
      portfolio: 'https://github.com/jameswilson',
      agreeToTerms: true,
      status: 'reviewing',
      submittedDate: new Date(Date.now() - 5 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedDate: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: 'Admin User',
    },
    {
      id: '4',
      firstName: 'Priya',
      lastName: 'Sharma',
      email: 'priya.sharma@example.com',
      phone: '+91 98765 43210',
      country: 'India',
      expertise: 'Content Writing',
      experience: '3-5 years',
      education: "Master's Degree",
      currentRole: 'Content Strategist',
      skills: ['Creative Writing', 'Content Strategy', 'SEO', 'Editing'],
      availability: 'Part-time',
      hoursPerWeek: '20-25',
      bio: 'Creative content writer and strategist with a passion for storytelling. Experienced in creating engaging content across various formats and industries.',
      linkedIn: 'https://linkedin.com/in/priyasharma',
      portfolio: 'https://priyawrites.com',
      agreeToTerms: true,
      status: 'pending',
      submittedDate: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
    },
    {
      id: '5',
      firstName: 'Robert',
      lastName: 'Kim',
      email: 'robert.kim@example.com',
      phone: '+1 (555) 345-6789',
      country: 'South Korea',
      expertise: 'AI/ML',
      experience: '5+ years',
      education: 'PhD',
      currentRole: 'AI Research Scientist',
      skills: ['Python', 'TensorFlow', 'PyTorch', 'Deep Learning', 'NLP'],
      availability: 'Part-time',
      hoursPerWeek: '10-15',
      bio: 'AI researcher specializing in natural language processing and deep learning. Published multiple papers on LLM training and optimization.',
      linkedIn: 'https://linkedin.com/in/robertkim',
      portfolio: 'https://scholar.google.com/robertkim',
      agreeToTerms: true,
      status: 'accepted',
      submittedDate: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedDate: new Date(Date.now() - 18 * 24 * 60 * 60 * 1000).toISOString(),
      reviewedBy: 'Admin User',
      notes: 'Highly qualified candidate. Perfect fit for advanced AI training tasks.',
    },
  ];
}

function loadApplications(): Application[] {
  try {
    const stored = localStorage.getItem(APPLICATIONS_STORAGE_KEY);
    if (stored) {
      return JSON.parse(stored);
    }
  } catch (error) {
    console.error('Error loading applications from storage:', error);
  }
  return getInitialApplications();
}

function saveApplications(applications: Application[]): void {
  try {
    localStorage.setItem(APPLICATIONS_STORAGE_KEY, JSON.stringify(applications));
  } catch (error) {
    console.error('Error saving applications to storage:', error);
  }
}

export async function submitApplication(formData: ApplicationFormData) {
  try {
    const response = await apiClient.post(API_ENDPOINTS.APPLICATIONS.SUBMIT, formData);
    return response;
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const applications = loadApplications();

  // Check if email already exists
  if (applications.some(app => app.email === formData.email)) {
    throw new Error('An application with this email address has already been submitted');
  }

  const newApplication: Application = {
    ...formData,
    id: `app_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`,
    status: 'pending',
    submittedDate: new Date().toISOString(),
  };

  applications.push(newApplication);
  saveApplications(applications);

  return {
    message: 'Application submitted successfully',
    applicationId: newApplication.id,
    status: 'pending',
  };
}

export async function getApplications(status?: string, accessToken?: string) {
  try {
    const endpoint = status && status !== 'all'
      ? `${API_ENDPOINTS.APPLICATIONS.LIST}?status=${status}`
      : API_ENDPOINTS.APPLICATIONS.LIST;
    
    const response = await apiClient.get(endpoint, accessToken);
    
    return {
      applications: response.applications || [],
      total: response.total || 0
    };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const applications = loadApplications();
  const filtered = status && status !== 'all' 
    ? applications.filter(app => app.status === status)
    : applications;

  return {
    applications: filtered,
    total: filtered.length
  };
}

export async function updateApplicationStatus(
  applicationId: string,
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected',
  notes?: string,
  accessToken?: string
): Promise<{ application: Application }> {
  try {
    const response = await apiClient.put(
      API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId),
      { status, notes },
      accessToken
    );
    
    return { application: response.application };
  } catch (error: any) {
    console.log('Backend API error:', error.message);
    console.log('Falling back to local storage');
  }

  // Fallback to local storage
  const applications = loadApplications();
  const appIndex = applications.findIndex(app => app.id === applicationId);

  if (appIndex === -1) {
    throw new Error('Application not found');
  }

  applications[appIndex] = {
    ...applications[appIndex],
    status,
    notes: notes || applications[appIndex].notes,
    reviewedDate: new Date().toISOString(),
    reviewedBy: 'Admin User',
  };

  saveApplications(applications);
  return { application: applications[appIndex] };
}
