import { apiClient, API_ENDPOINTS, buildApiUrl } from './api';

export interface ApplicationFormData {
  // Personal Information
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  city: string;
  timezone: string;
  
  // Professional Background
  expertise: string;
  experience: string;
  education: string;
  currentRole: string;
  company: string;
  industry: string;
  salary: string;
  
  // Skills & Preferences
  skills: string[];
  primarySkill: string;
  learningGoals: string[];
  projectTypes: string[];
  
  // Availability & Commitment
  availability: string;
  hoursPerWeek: string;
  startDate: string;
  timeCommitment: string;
  workingHours: string;
  weekendAvailability: boolean;
  
  // Profile & Portfolio
  bio: string;
  motivation: string;
  linkedIn: string;
  portfolio: string;
  github: string;
  resume: string;
  
  // Preferences & Goals
  earningGoals: string;
  communicationStyle: string;
  mentorshipInterest: boolean;
  collaborationPreference: string;
  
  // Account Setup
  password: string;
  confirmPassword: string;
  
  // Agreement
  agreeToTerms: boolean;
  agreeToNewsletter: boolean;
  agreeToDataProcessing: boolean;
}

export interface Application extends Omit<ApplicationFormData, 'password' | 'confirmPassword'> {
  id: string;
  status: 'pending' | 'reviewing' | 'accepted' | 'rejected';
  submittedDate: string;
  reviewedDate?: string;
  reviewedBy?: string;
  notes?: string;
}

export async function submitApplication(formData: ApplicationFormData) {
  try {
    console.log('🚀 Starting application submission...', { email: formData.email });
    
    // Prepare application data (exclude password fields)
    const { password, confirmPassword, ...applicationData } = formData;
    
    // First submit the application
    console.log('📝 Submitting application to backend...');
    const response = await apiClient.post(buildApiUrl(API_ENDPOINTS.APPLICATIONS.SUBMIT), applicationData);
    console.log('✅ Application submitted successfully:', response);
    
    // Create user account after successful application submission
    try {
      console.log('👤 Creating user account...');
      
      // Create user account with user's chosen password
      const userResponse = await apiClient.post(buildApiUrl(API_ENDPOINTS.AUTH.REGISTER), {
        email: formData.email,
        password: formData.password,
        name: `${formData.firstName} ${formData.lastName}`
      });
      
      console.log('✅ User account created successfully:', userResponse);
      
      return {
        ...response,
        userCreated: true,
        message: 'Application submitted and account created successfully! You can now sign in with your chosen password.'
      };
    } catch (userError: any) {
      console.log('⚠️ Account creation failed, but application was submitted:', userError.message);
      return {
        ...response,
        userCreated: false,
        message: 'Application submitted successfully! You can create an account separately using the sign-in dialog.'
      };
    }
  } catch (error: any) {
    console.error('❌ Application submission error:', error);
    console.error('Error details:', error.response?.data);
    throw new Error(error.response?.data?.message || 'Failed to submit application. Please try again.');
  }
}

export async function getApplications(status?: string, accessToken?: string) {
  try {
    const endpoint = status && status !== 'all'
      ? `${API_ENDPOINTS.APPLICATIONS.LIST}?status=${status}`
      : API_ENDPOINTS.APPLICATIONS.LIST;
    
    const response = await apiClient.get(buildApiUrl(endpoint), accessToken);
    
    return {
      applications: response.data?.applications || [],
      total: response.data?.total || 0,
      success: true
    };
  } catch (error: any) {
    console.error('Error fetching applications:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch applications');
  }
}

export async function updateApplicationStatus(
  applicationId: string, 
  status: string, 
  notes?: string, 
  accessToken?: string
) {
  try {
    const response = await apiClient.put(
      buildApiUrl(API_ENDPOINTS.APPLICATIONS.UPDATE_STATUS(applicationId)),
      { status, notes },
      accessToken
    );
    
    return response;
  } catch (error: any) {
    console.error('Error updating application status:', error);
    throw new Error(error.response?.data?.message || 'Failed to update application status');
  }
}

export async function getApplicationStats(accessToken?: string) {
  try {
    const response = await apiClient.get(buildApiUrl(API_ENDPOINTS.APPLICATIONS.STATS), accessToken);
    return response.data;
  } catch (error: any) {
    console.error('Error fetching application stats:', error);
    throw new Error(error.response?.data?.message || 'Failed to fetch application statistics');
  }
}