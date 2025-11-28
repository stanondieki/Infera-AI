import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { RadioGroup, RadioGroupItem } from "./ui/radio-group";
import { Slider } from "./ui/slider";
import { Switch } from "./ui/switch";
import { useState, useEffect, useCallback, useMemo, useRef } from "react";
import React from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { submitApplication, checkApplicationStatus } from "../utils/applications";
import {
  User,
  Mail,
  Briefcase,
  GraduationCap,
  FileText,
  CheckCircle,
  ArrowRight,
  ArrowLeft,
  Sparkles,
  Clock,
  Globe,
  Award,
  Save,
  AlertCircle,
  DollarSign,
  Calendar,
  MapPin,
  Phone,
  Linkedin,
  Github,
  ExternalLink,
  Star,
  TrendingUp,
  Zap,
  Brain,
  Target,
  Trophy,
  Rocket,
  Shield,
  Heart,
  Coffee,
  BookOpen,
  Code,
  Database,
  Cloud,
  Building,
  X,
  Eye,
  EyeOff,
  Loader2,
  TrendingDown,
  Search,
  MapPin as LocationIcon,
  Wifi,
  WifiOff,
  Lightbulb,
  BarChart3,
  Users,
  Timer,
  CheckCircle2,
  AlertTriangle,
  Info,
  Sparkle,
  RefreshCw,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Logo, LogoSimple } from "./Logo";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn?: () => void;
}

interface FormValidation {
  [key: string]: {
    isValid: boolean;
    error: string;
    suggestions?: string[];
  };
}

interface LiveMarketData {
  averageHourlyRate: number;
  demandLevel: 'low' | 'medium' | 'high' | 'very-high';
  popularSkills: string[];
  jobOpenings: number;
}

interface FormData {
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
  
  // Agreement
  agreeToTerms: boolean;
  agreeToNewsletter: boolean;
  agreeToDataProcessing: boolean;
  
  // Account Setup
  password: string;
  confirmPassword: string;
}

export function ApplyDialog({ open, onOpenChange, onSwitchToSignIn }: ApplyDialogProps) {
  const [currentStep, setCurrentStep] = useState<number>(1);
  const [formData, setFormData] = useState<FormData>({
    // Personal Information
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    city: "",
    timezone: "",
    
    // Professional Background
    expertise: "",
    experience: "",
    education: "",
    currentRole: "",
    company: "",
    industry: "",
    salary: "",
    
    // Skills & Preferences
    skills: [],
    primarySkill: "",
    learningGoals: [],
    projectTypes: [],
    
    // Availability & Commitment
    availability: "",
    hoursPerWeek: "",
    startDate: "",
    timeCommitment: "",
    workingHours: "",
    weekendAvailability: false,
    
    // Profile & Portfolio
    bio: "",
    motivation: "",
    linkedIn: "",
    portfolio: "",
    github: "",
    resume: "",
    
    // Preferences & Goals
    earningGoals: "",
    communicationStyle: "",
    mentorshipInterest: false,
    collaborationPreference: "",
    
    // Agreement
    agreeToTerms: false,
    agreeToNewsletter: false,
    agreeToDataProcessing: false,
    
    // Account Setup
    password: "",
    confirmPassword: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [autoSaveStatus, setAutoSaveStatus] = useState<'saved' | 'saving' | 'error' | null>(null);
  const [estimatedEarnings, setEstimatedEarnings] = useState<number>(0);
  
  // Enhanced state for live features
  const [liveValidation, setLiveValidation] = useState<FormValidation>({});
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [suggestions, setSuggestions] = useState<{ [key: string]: string[] }>({});
  const [isOnline, setIsOnline] = useState(typeof navigator !== 'undefined' ? navigator.onLine : true);
  const [profileStrength, setProfileStrength] = useState(0);
  const [marketData, setMarketData] = useState<LiveMarketData | null>(null);
  const [completionTime, setCompletionTime] = useState<number>(0);
  const [startTime] = useState(Date.now());
  const [locationDetected, setLocationDetected] = useState(false);
  const [skillDemand, setSkillDemand] = useState<{ [skill: string]: number }>({});
  
  // Refs
  const formRef = useRef<HTMLFormElement>(null);
  const debounceTimerRef = useRef<NodeJS.Timeout | null>(null);
  
  const totalSteps = 6;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Personal Info", icon: User, description: "Basic details about you" },
    { number: 2, title: "Professional", icon: Briefcase, description: "Your experience & background" },
    { number: 3, title: "Skills & Goals", icon: Brain, description: "What you bring & want to learn" },
    { number: 4, title: "Availability", icon: Calendar, description: "When can you contribute" },
    { number: 5, title: "Final Details", icon: Rocket, description: "Portfolio & preferences" },
  ];

  // Enhanced skill categories with more comprehensive options
  const skillCategories = {
    "AI & Machine Learning": [
      "Python", "TensorFlow", "PyTorch", "Scikit-learn", "Keras", 
      "Computer Vision", "Natural Language Processing", "Deep Learning",
      "Neural Networks", "Reinforcement Learning", "MLOps", "AutoML"
    ],
    "Data Science": [
      "Data Analysis", "Statistics", "R", "SQL", "pandas", "NumPy",
      "Jupyter", "Tableau", "Power BI", "Excel", "SPSS", "SAS"
    ],
    "Programming & Development": [
      "JavaScript", "React", "Node.js", "Java", "C++", "C#", "Go",
      "Rust", "Swift", "Kotlin", "PHP", "Ruby", "TypeScript"
    ],
    "Cloud & Infrastructure": [
      "AWS", "Azure", "Google Cloud", "Docker", "Kubernetes", 
      "DevOps", "CI/CD", "Linux", "Git", "Terraform", "Ansible"
    ],
    "Design & Creative": [
      "UI/UX Design", "Figma", "Adobe Creative Suite", "Sketch",
      "Prototyping", "User Research", "Graphic Design", "Video Editing"
    ],
    "Business & Management": [
      "Project Management", "Product Management", "Business Analysis",
      "Strategy", "Marketing", "Sales", "Operations", "Finance"
    ]
  };

  // Smart suggestions database
  const companySuggestions = [
    "Google", "Microsoft", "Amazon", "Apple", "Meta", "Netflix", "OpenAI", "Anthropic",
    "Tesla", "NVIDIA", "Intel", "IBM", "Oracle", "Salesforce", "Adobe", "Uber", "Airbnb",
    "Spotify", "Twitter", "LinkedIn", "GitHub", "Stripe", "Shopify", "Square", "PayPal"
  ];

  const roleSuggestions = [
    "Data Scientist", "Machine Learning Engineer", "AI Researcher", "Software Engineer",
    "Data Engineer", "DevOps Engineer", "Product Manager", "Research Scientist",
    "ML Infrastructure Engineer", "Computer Vision Engineer", "NLP Engineer", 
    "AI Product Manager", "Data Analyst", "Full Stack Developer", "Backend Developer",
    "Frontend Developer", "Mobile Developer", "Cloud Architect", "MLOps Engineer"
  ];

  const citySuggestions = [
    "San Francisco", "New York", "London", "Berlin", "Toronto", "Seattle", "Austin",
    "Los Angeles", "Boston", "Chicago", "Amsterdam", "Paris", "Tokyo", "Singapore",
    "Sydney", "Vancouver", "Tel Aviv", "Zurich", "Stockholm", "Copenhagen"
  ];

  // Memoize allSkills to prevent infinite re-renders
  const allSkills = useMemo(() => Object.values(skillCategories).flat(), []);

  const countries = [
    "United States", "United Kingdom", "Canada", "Australia", "Germany",
    "France", "Netherlands", "Sweden", "Norway", "Denmark", "Switzerland",
    "India", "Singapore", "Japan", "South Korea", "Brazil", "Mexico",
    "Argentina", "Chile", "South Africa", "Nigeria", "Kenya", "Egypt",
    "UAE", "Israel", "Poland", "Czech Republic", "Hungary", "Romania",
    "Ukraine", "Russia", "China", "Taiwan", "Hong Kong", "Thailand",
    "Malaysia", "Indonesia", "Philippines", "Vietnam", "New Zealand"
  ];

  const industries = [
    "Technology", "Healthcare", "Finance", "Education", "E-commerce",
    "Manufacturing", "Automotive", "Aerospace", "Energy", "Telecommunications",
    "Media & Entertainment", "Gaming", "Real Estate", "Consulting",
    "Non-profit", "Government", "Agriculture", "Food & Beverage",
    "Fashion", "Travel & Tourism", "Sports", "Legal", "Insurance"
  ];

  const projectTypeOptions = [
    "Data Annotation & Labeling", "Model Training & Fine-tuning", 
    "AI Content Creation", "Computer Vision Projects", "NLP Tasks",
    "Chatbot Development", "Research & Analysis", "Code Review",
    "Technical Writing", "Mentoring & Teaching", "Quality Assurance",
    "Product Testing", "Business Intelligence", "Market Research"
  ];

  const learningGoalOptions = [
    "Advanced Machine Learning", "AI Ethics & Governance", "MLOps & Deployment",
    "Quantum Computing", "Blockchain Technology", "AR/VR Development",
    "Leadership Skills", "Business Strategy", "Technical Writing",
    "Public Speaking", "Team Management", "Cross-functional Collaboration"
  ];

  // Live validation functions
  const validateField = useCallback((fieldName: string, value: any): { isValid: boolean; error: string; suggestions?: string[] } => {
    switch (fieldName) {
      case 'email':
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!value) return { isValid: false, error: 'Email is required' };
        if (!emailRegex.test(value)) return { isValid: false, error: 'Please enter a valid email' };
        return { isValid: true, error: '' };
      
      case 'firstName':
      case 'lastName':
        if (!value?.trim()) return { isValid: false, error: `${fieldName === 'firstName' ? 'First' : 'Last'} name is required` };
        if (value.length < 2) return { isValid: false, error: 'Name must be at least 2 characters' };
        if (!/^[a-zA-Z\s'-]+$/.test(value)) return { isValid: false, error: 'Name contains invalid characters' };
        return { isValid: true, error: '' };
      
      case 'phone':
        if (!value) return { isValid: false, error: 'Phone number is required' };
        const phoneRegex = /^[\+]?[1-9][\d]{0,15}$/;
        if (!phoneRegex.test(value.replace(/[\s\-\(\)]/g, ''))) {
          return { isValid: false, error: 'Please enter a valid phone number' };
        }
        return { isValid: true, error: '' };
      
      case 'company':
        if (!value) return { isValid: true, error: '' }; // Optional field
        const matchingCompanies = companySuggestions.filter(c => 
          c.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        return { isValid: true, error: '', suggestions: matchingCompanies };
      
      case 'currentRole':
        if (!value?.trim()) return { isValid: false, error: 'Current role is required' };
        const matchingRoles = roleSuggestions.filter(r => 
          r.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        return { isValid: true, error: '', suggestions: matchingRoles };
      
      case 'city':
        if (!value?.trim()) return { isValid: false, error: 'City is required' };
        const matchingCities = citySuggestions.filter(c => 
          c.toLowerCase().includes(value.toLowerCase())
        ).slice(0, 5);
        return { isValid: true, error: '', suggestions: matchingCities };
      
      case 'bio':
        if (!value?.trim()) return { isValid: false, error: 'Bio is required' };
        if (value.length < 100) return { isValid: false, error: `Bio must be at least 100 characters (${value.length}/100)` };
        if (value.length > 500) return { isValid: false, error: `Bio is too long (${value.length}/500)` };
        return { isValid: true, error: '' };
      
      case 'motivation':
        if (!value?.trim()) return { isValid: false, error: 'Motivation is required' };
        if (value.length < 50) return { isValid: false, error: `Motivation must be at least 50 characters (${value.length}/50)` };
        if (value.length > 300) return { isValid: false, error: `Motivation is too long (${value.length}/300)` };
        return { isValid: true, error: '' };
      
      case 'password':
        if (!value) return { isValid: false, error: 'Password is required' };
        if (value.length < 8) return { isValid: false, error: 'Password must be at least 8 characters' };
        if (!/(?=.*[a-z])(?=.*[A-Z])(?=.*\d)/.test(value)) {
          return { isValid: false, error: 'Password must contain uppercase, lowercase, and number' };
        }
        return { isValid: true, error: '' };
      
      default:
        return { isValid: true, error: '' };
    }
  }, []);

  // Debounced field validation
  const debouncedValidation = useCallback((fieldName: string, value: any) => {
    if (debounceTimerRef.current) clearTimeout(debounceTimerRef.current);
    
    debounceTimerRef.current = setTimeout(() => {
      const validation = validateField(fieldName, value);
      setLiveValidation(prev => ({
        ...prev,
        [fieldName]: validation
      }));
      
      if (validation.suggestions) {
        setSuggestions(prev => ({
          ...prev,
          [fieldName]: validation.suggestions || []
        }));
      }
    }, 300);
  }, [validateField]);

  // Calculate profile strength
  const calculateProfileStrength = useMemo(() => {
    let score = 0;
    const weights = {
      personalInfo: 20, // firstName, lastName, email, phone, country, city
      professional: 25, // expertise, experience, education, currentRole, industry
      skills: 20, // skills array, primarySkill
      availability: 15, // availability, hoursPerWeek, startDate
      portfolio: 10, // bio, motivation, linkedIn, portfolio, github
      agreement: 10 // terms agreement
    };

    // Personal info (20 points)
    const personalFields = [formData.firstName, formData.lastName, formData.email, formData.phone, formData.country, formData.city];
    const personalComplete = personalFields.filter(field => field?.trim()).length;
    score += (personalComplete / personalFields.length) * weights.personalInfo;

    // Professional (25 points)
    const professionalFields = [formData.expertise, formData.experience, formData.education, formData.currentRole, formData.industry];
    const professionalComplete = professionalFields.filter(field => field?.trim()).length;
    score += (professionalComplete / professionalFields.length) * weights.professional;

    // Skills (20 points)
    if (formData.skills?.length > 0) score += weights.skills * 0.7;
    if (formData.primarySkill) score += weights.skills * 0.3;

    // Availability (15 points)
    const availabilityFields = [formData.availability, formData.hoursPerWeek, formData.startDate];
    const availabilityComplete = availabilityFields.filter(field => field?.trim()).length;
    score += (availabilityComplete / availabilityFields.length) * weights.availability;

    // Portfolio (10 points)
    let portfolioScore = 0;
    if (formData.bio?.length >= 100) portfolioScore += 0.4;
    if (formData.motivation?.length >= 50) portfolioScore += 0.3;
    if (formData.linkedIn) portfolioScore += 0.1;
    if (formData.portfolio) portfolioScore += 0.1;
    if (formData.github) portfolioScore += 0.1;
    score += portfolioScore * weights.portfolio;

    // Agreement (10 points)
    if (formData.agreeToTerms && formData.agreeToDataProcessing) score += weights.agreement;

    return Math.round(score);
  }, [formData]);

  // Update profile strength
  useEffect(() => {
    setProfileStrength(calculateProfileStrength);
  }, [calculateProfileStrength]);

  // Mock market data - in real app, fetch from API
  useEffect(() => {
    const fetchMarketData = async () => {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      const mockData: LiveMarketData = {
        averageHourlyRate: 45 + Math.random() * 20,
        demandLevel: ['medium', 'high', 'very-high'][Math.floor(Math.random() * 3)] as 'medium' | 'high' | 'very-high',
        popularSkills: ['Python', 'Machine Learning', 'React', 'Node.js', 'AWS'],
        jobOpenings: 1200 + Math.floor(Math.random() * 500)
      };
      
      setMarketData(mockData);
    };

    // Only fetch once when component mounts and we're online
    if (isOnline && !marketData) {
      fetchMarketData();
    }
  }, [isOnline, marketData]);

  // Skill demand simulation - run once on mount
  useEffect(() => {
    const demand: { [skill: string]: number } = {};
    allSkills.forEach(skill => {
      demand[skill] = Math.random() * 100;
    });
    setSkillDemand(demand);
  }, []); // Empty dependency array to run only once

  // Online status monitoring
  useEffect(() => {
    const handleOnline = () => setIsOnline(true);
    const handleOffline = () => setIsOnline(false);
    
    window.addEventListener('online', handleOnline);
    window.addEventListener('offline', handleOffline);
    
    return () => {
      window.removeEventListener('online', handleOnline);
      window.removeEventListener('offline', handleOffline);
    };
  }, []);

  // Auto-detect location
  useEffect(() => {
    if (open && !locationDetected && !formData.city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async (position) => {
          try {
            // In a real app, use a geolocation API
            const response = await fetch(`https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${position.coords.latitude}&longitude=${position.coords.longitude}&localityLanguage=en`);
            const data = await response.json();
            
            setFormData(prev => ({
              ...prev,
              city: data.city || data.locality,
              country: data.countryName
            }));
            
            setLocationDetected(true);
            toast.success("📍 Location detected and filled automatically!", { duration: 3000 });
          } catch (error) {
            console.log('Location detection failed:', error);
          }
        },
        (error) => {
          console.log('Geolocation denied:', error);
        }
      );
    }
  }, [open, locationDetected, formData.city]);

  // Completion time tracking
  useEffect(() => {
    const timer = setInterval(() => {
      setCompletionTime(Date.now() - startTime);
    }, 1000);

    return () => clearInterval(timer);
  }, [startTime]);

  // Cleanup debounce timer on unmount
  useEffect(() => {
    return () => {
      if (debounceTimerRef.current) {
        clearTimeout(debounceTimerRef.current);
      }
    };
  }, []);

  // Calculate estimated earnings based on skills and experience
  useEffect(() => {
    const baseRate = 25; // Base hourly rate
    const experienceMultiplier = {
      "0-1": 1,
      "2-3": 1.2,
      "4-5": 1.5,
      "6-10": 1.8,
      "10+": 2.2
    };
    
    const skillBonus = (formData.skills?.length || 0) * 2;
    const hours = parseInt(formData.hoursPerWeek) || 0;
    const multiplier = experienceMultiplier[formData.experience as keyof typeof experienceMultiplier] || 1;
    
    const weeklyEarnings = (baseRate + skillBonus) * multiplier * hours;
    const monthlyEarnings = weeklyEarnings * 4.33; // Average weeks per month
    
    setEstimatedEarnings(monthlyEarnings);
  }, [formData.skills, formData.experience, formData.hoursPerWeek]);

  // Auto-save functionality with enhanced error handling
  useEffect(() => {
    if (open && (formData.firstName || formData.lastName || formData.email)) {
      setAutoSaveStatus('saving');
      const timer = setTimeout(() => {
        try {
          const draftData = {
            ...formData,
            lastSaved: new Date().toISOString(),
            currentStep,
            progress: (currentStep / totalSteps) * 100
          };
          localStorage.setItem('inferaAI_draft_application', JSON.stringify(draftData));
          setAutoSaveStatus('saved');
          setTimeout(() => setAutoSaveStatus(null), 2000);
        } catch (error) {
          console.error('Auto-save failed:', error);
          setAutoSaveStatus('error');
          setTimeout(() => setAutoSaveStatus(null), 3000);
        }
      }, 1500);

      return () => clearTimeout(timer);
    }
  }, [formData, currentStep, open]);

  // Load draft on open with better UX
  useEffect(() => {
    if (open) {
      try {
        const draft = localStorage.getItem('inferaAI_draft_application');
        if (draft) {
          const parsedDraft = JSON.parse(draft);
          const daysSinceLastSaved = (new Date().getTime() - new Date(parsedDraft.lastSaved).getTime()) / (1000 * 60 * 60 * 24);
          
          if (daysSinceLastSaved < 7) { // Keep draft for 7 days
            setFormData(parsedDraft);
            setCurrentStep(parsedDraft.currentStep || 1);
            toast.success("✨ Welcome back! Your draft has been restored.", { 
              duration: 4000,
              description: `You can continue from Step ${parsedDraft.currentStep || 1}`
            });
          } else {
            localStorage.removeItem('inferaAI_draft_application');
          }
        }
      } catch (error) {
        console.error('Error loading draft:', error);
        localStorage.removeItem('inferaAI_draft_application');
      }
    }
  }, [open]);

  // Keyboard navigation
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (!open) return;
      
      if (e.key === 'Enter' && e.ctrlKey) {
        e.preventDefault();
        if (currentStep < totalSteps) {
          handleNext();
        } else {
          handleSubmit();
        }
      } else if (e.key === 'ArrowLeft' && e.ctrlKey && currentStep > 1) {
        e.preventDefault();
        handleBack();
      } else if (e.key === 'ArrowRight' && e.ctrlKey && currentStep < totalSteps) {
        e.preventDefault();
        handleNext();
      }
    };

    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [open, currentStep, totalSteps]);

  const getStepValidationErrors = useCallback((step: number): string[] => {
    const errors: string[] = [];
    
    switch (step) {
      case 1: // Personal Information
        if (!formData.firstName?.trim()) errors.push("First name is required");
        if (!formData.lastName?.trim()) errors.push("Last name is required");
        if (!formData.email?.trim()) errors.push("Email is required");
        else if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(formData.email.trim())) {
          errors.push("Please enter a valid email address");
        }
        if (!formData.phone?.trim()) errors.push("Phone number is required");
        if (!formData.country) errors.push("Country is required");
        if (!formData.city?.trim()) errors.push("City is required");
        break;
        
      case 2: // Professional Background
        if (!formData.expertise) errors.push("Area of expertise is required");
        if (!formData.experience) errors.push("Years of experience is required");
        if (!formData.education) errors.push("Education level is required");
        if (!formData.currentRole?.trim()) errors.push("Current role is required");
        if (!formData.industry) errors.push("Industry is required");
        break;
        
      case 3: // Skills & Goals
        if (!formData.skills || formData.skills.length === 0) errors.push("At least one skill is required");
        if (!formData.primarySkill) errors.push("Primary skill is required");
        if (!formData.learningGoals || formData.learningGoals.length === 0) errors.push("At least one learning goal is required");
        if (!formData.projectTypes || formData.projectTypes.length === 0) errors.push("At least one project type preference is required");
        break;
        
      case 4: // Availability
        if (!formData.availability) errors.push("Availability is required");
        if (!formData.hoursPerWeek) errors.push("Hours per week is required");
        if (!formData.startDate) errors.push("Start date is required");
        if (!formData.timeCommitment) errors.push("Time commitment is required");
        if (!formData.workingHours?.trim()) errors.push("Preferred working hours is required");
        break;
        
      case 5: // Final Details
        if (!formData.bio?.trim()) errors.push("Bio is required");
        else if (formData.bio.length < 100) {
          errors.push(`Bio must be at least 100 characters (currently ${formData.bio.length})`);
        }
        if (!formData.motivation?.trim()) errors.push("Motivation is required");
        else if (formData.motivation.length < 50) {
          errors.push(`Motivation must be at least 50 characters (currently ${formData.motivation.length})`);
        }
        if (!formData.earningGoals) errors.push("Earning goals is required");
        if (!formData.communicationStyle) errors.push("Communication style is required");
        if (!formData.agreeToTerms) errors.push("You must agree to the terms and conditions");
        if (!formData.agreeToDataProcessing) errors.push("You must agree to data processing");
        break;
        
      case 6: // Account Setup
        if (!formData.password?.trim()) errors.push("Password is required");
        else {
          if (formData.password.length < 6) errors.push("Password must be at least 6 characters");
          // More lenient - require at least one letter and one number
          if (!/[a-zA-Z]/.test(formData.password)) errors.push("Password must contain at least one letter");
          if (!/\d/.test(formData.password)) errors.push("Password must contain at least one number");
        }
        if (!formData.confirmPassword?.trim()) errors.push("Password confirmation is required");
        else if (formData.password !== formData.confirmPassword) {
          errors.push("Passwords do not match");
        }
        break;
    }
    
    return errors;
  }, [formData]);

  const validateStep = (step: number): boolean => {
    const errors = getStepValidationErrors(step);
    setValidationErrors(errors);
    
    if (errors.length > 0) {
      errors.forEach(error => toast.error(error, { duration: 3000 }));
      return false;
    }
    
    return true;
  };

  const handleNext = () => {
    const isValid = validateStep(currentStep);
    if (isValid) {
      setCurrentStep(currentStep + 1);
      toast.success(`Step ${currentStep} completed! ✨`, { duration: 1500 });
      setValidationErrors([]);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
    setValidationErrors([]);
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    console.log('🔄 Submit button clicked!', { currentStep, totalSteps });
    
    // Always validate the final step before submission
    if (!validateStep(6)) {
      toast.error("Please fill in all required fields correctly", { duration: 3000 });
      console.log('❌ Validation failed for step 6');
      return;
    }
    
    console.log('✅ Validation passed, starting submission...');
    setIsSubmitting(true);
    
    try {
      console.log('🚀 Starting application submission from dialog...', { currentStep, formData: { email: formData.email, firstName: formData.firstName } });
      
      const response = await submitApplication(formData);
      
      console.log('✅ Application submission response:', response);
      
      setIsSubmitting(false);
      
      if (response.userCreated) {
        toast.success("🎉 Application submitted and account created! Check your email for login instructions.", { duration: 7000 });
      } else {
        toast.success("🎉 Application submitted successfully! You can create an account using the sign-in dialog.", { duration: 5000 });
      }
      
      // Clear draft from localStorage
      localStorage.removeItem('inferaAI_draft_application');
      
      onOpenChange(false);
      
      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          // Personal Information
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          city: "",
          timezone: "",
          
          // Professional Background
          expertise: "",
          experience: "",
          education: "",
          currentRole: "",
          company: "",
          industry: "",
          salary: "",
          
          // Skills & Preferences
          skills: [],
          primarySkill: "",
          learningGoals: [],
          projectTypes: [],
          
          // Availability & Commitment
          availability: "",
          hoursPerWeek: "",
          startDate: "",
          timeCommitment: "",
          workingHours: "",
          weekendAvailability: false,
          
          // Profile & Portfolio
          bio: "",
          motivation: "",
          linkedIn: "",
          portfolio: "",
          github: "",
          resume: "",
          
          // Preferences & Goals
          earningGoals: "",
          communicationStyle: "",
          mentorshipInterest: false,
          collaborationPreference: "",
          
          // Agreement
          agreeToTerms: false,
          agreeToNewsletter: false,
          agreeToDataProcessing: false,
          
          // Account Setup
          password: "",
          confirmPassword: "",
        });
        setValidationErrors([]);
      }, 500);
    } catch (error: any) {
      console.error('❌ Application submission failed:', error);
      console.error('Error details:', error.response?.data);
      setIsSubmitting(false);
      
      if (error.message?.includes('already have an active application')) {
        toast.error(
          "You already have an active application. Would you like to sign in to your existing account instead?", 
          { 
            duration: 8000,
            action: {
              label: "Sign In",
              onClick: () => {
                onOpenChange(false);
                if (onSwitchToSignIn) {
                  onSwitchToSignIn();
                }
              }
            }
          }
        );
      } else {
        toast.error(error.message || "❌ Failed to submit application. Please try again.", { duration: 5000 });
      }
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: (prev.skills || []).includes(skill)
        ? (prev.skills || []).filter(s => s !== skill)
        : [...(prev.skills || []), skill]
    }));
  };

  const toggleLearningGoal = (goal: string) => {
    setFormData(prev => ({
      ...prev,
      learningGoals: (prev.learningGoals || []).includes(goal)
        ? (prev.learningGoals || []).filter(g => g !== goal)
        : [...(prev.learningGoals || []), goal]
    }));
  };

  const toggleProjectType = (type: string) => {
    setFormData(prev => ({
      ...prev,
      projectTypes: (prev.projectTypes || []).includes(type)
        ? (prev.projectTypes || []).filter(t => t !== type)
        : [...(prev.projectTypes || []), type]
    }));
  };

  const handleGoogleSignUp = () => {
    toast.info("🚀 Google Sign-Up will be available soon! Stay tuned.", { duration: 3000 });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] w-[95vw] p-0 gap-0 max-h-[85vh] h-[85vh] flex flex-col bg-white">
        <DialogHeader className="sr-only">
          <DialogTitle>Apply to Taskify</DialogTitle>
          <DialogDescription>
            Join our community of experts and start earning today.
          </DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-3 text-white flex-shrink-0">
            <div className="relative z-10">
              <div className="flex justify-center mb-1">
                <LogoSimple />
              </div>
              <div className="text-center mb-2">
                <h2 className="text-lg font-bold mb-0.5">Join Taskify</h2>
                <p className="text-blue-100 text-xs mb-1">
                  Start your journey as an AI expert and earn while you learn
                </p>
                
                {/* Progress Indicator */}
                <div className="bg-white/20 rounded-full h-1.5 mb-2">
                  <motion.div
                    className="bg-white rounded-full h-1.5"
                    initial={{ width: 0 }}
                    animate={{ width: `${progress}%` }}
                    transition={{ duration: 0.3 }}
                  />
                </div>
                
                <div className="flex justify-between text-xs text-blue-100 mb-3">
                  <div className="flex items-center gap-3">
                    <span>Step {currentStep} of {totalSteps}</span>
                    <div className="flex items-center gap-1">
                      {isOnline ? (
                        <Wifi className="h-3 w-3 text-green-300" />
                      ) : (
                        <WifiOff className="h-3 w-3 text-red-300" />
                      )}
                      <span className="text-xs">{isOnline ? 'Online' : 'Offline'}</span>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    {autoSaveStatus === 'saving' && (
                      <div className="flex items-center gap-1">
                        <Loader2 className="h-3 w-3 animate-spin" />
                        <span>Saving...</span>
                      </div>
                    )}
                    {autoSaveStatus === 'saved' && (
                      <div className="flex items-center gap-1">
                        <CheckCircle className="h-3 w-3" />
                        <span>Saved</span>
                      </div>
                    )}
                    {autoSaveStatus === 'error' && (
                      <div className="flex items-center gap-1">
                        <AlertCircle className="h-3 w-3" />
                        <span>Save Error</span>
                      </div>
                    )}
                    {estimatedEarnings > 0 && (
                      <div className="flex items-center gap-1">
                        <TrendingUp className="h-3 w-3" />
                        <span>${estimatedEarnings.toFixed(0)}/mo</span>
                      </div>
                    )}
                    <div className="flex items-center gap-1">
                      <Timer className="h-3 w-3" />
                      <span>{Math.floor(completionTime / 60000)}:{((completionTime % 60000) / 1000).toFixed(0).padStart(2, '0')}</span>
                    </div>
                  </div>
                </div>

                {/* Profile Strength Meter */}
                <div className="bg-white/20 rounded-lg p-1.5 mb-1.5">
                  <div className="flex items-center justify-between mb-0.5">
                    <span className="text-xs font-medium">Profile Strength</span>
                    <span className="text-xs font-bold">{profileStrength}%</span>
                  </div>
                  <div className="bg-white/20 rounded-full h-1 mb-0.5">
                    <motion.div
                      className={`rounded-full h-1 transition-all duration-500 ${
                        profileStrength < 30 ? 'bg-red-400' : 
                        profileStrength < 70 ? 'bg-yellow-400' : 
                        'bg-green-400'
                      }`}
                      initial={{ width: 0 }}
                      animate={{ width: `${profileStrength}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-blue-100">
                    <span>
                      {profileStrength < 30 ? '🌱 Getting Started' : 
                       profileStrength < 70 ? '📈 Good Progress' : 
                       '⭐ Excellent Profile'}
                    </span>
                    {marketData && (
                      <span className="flex items-center gap-1">
                        <BarChart3 className="h-2 w-2" />
                        Market: {marketData.demandLevel === 'very-high' ? '🔥' : marketData.demandLevel === 'high' ? '📈' : '📊'} {marketData.demandLevel}
                      </span>
                    )}
                  </div>
                </div>
              </div>

                {/* Validation Errors */}
              {validationErrors.length > 0 && (
                <div className="bg-red-500/20 border border-red-400 rounded-md p-2 mb-2">
                  <div className="flex items-center gap-1 mb-0.5">
                    <AlertCircle className="h-3 w-3 text-red-200" />
                    <span className="text-xs font-medium text-red-100">Please fix the following:</span>
                  </div>
                  <ul className="list-disc list-inside text-red-100 space-y-0 text-xs">
                    {validationErrors.map((error, index) => (
                      <li key={index}>{error}</li>
                    ))}
                  </ul>
                </div>
              )}              {/* Step Navigation */}
              <div className="flex justify-between">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center gap-0 transition-all ${
                      step.number <= currentStep ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`h-5 w-5 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.number === currentStep
                          ? "bg-white text-blue-600 border-white scale-110"
                          : step.number < currentStep
                          ? "bg-white/20 border-white text-white"
                          : "bg-transparent border-white/50 text-white"
                    }`}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle className="h-2.5 w-2.5" />
                      ) : (
                        <step.icon className="h-2.5 w-2.5" />
                      )}
                    </div>
                    <span className="text-xs text-center leading-tight mt-0.5">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto bg-gray-50 min-h-0">
            <form onSubmit={handleSubmit} className="p-3 pb-4">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-4"
                >
                  {/* Step 1: Personal Information */}
                  {currentStep === 1 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-blue-600 rounded-full flex items-center justify-center">
                              <User className="h-4 w-4 text-white" />
                            </div>
                            Personal Information
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Let's get to know you better. Your information helps us match you with the perfect opportunities.</p>
                          
                          <div className="flex items-center gap-2 text-sm text-blue-700 bg-blue-100 p-3 rounded-lg">
                            <Shield className="h-4 w-4" />
                            <span>Your data is secure and will only be used for application processing.</span>
                          </div>
                        </CardContent>
                      </Card>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="firstName" className="text-sm font-semibold text-gray-700">First Name *</Label>
                          <div className="relative">
                            <Input
                              id="firstName"
                              placeholder="Enter your first name"
                              value={formData.firstName}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, firstName: value });
                                debouncedValidation('firstName', value);
                              }}
                              className={`h-10 pl-4 pr-10 border-2 transition-all bg-white ${
                                liveValidation.firstName ? 
                                  liveValidation.firstName.isValid ? 'border-green-500' : 'border-red-500' : 
                                  'border-gray-300 focus:border-blue-500'
                              }`}
                              autoComplete="given-name"
                              autoFocus
                            />
                            {liveValidation.firstName && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {liveValidation.firstName.isValid ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {liveValidation.firstName && !liveValidation.firstName.isValid && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {liveValidation.firstName.error}
                            </p>
                          )}
                        </div>
                        
                        <div className="space-y-2">
                          <Label htmlFor="lastName" className="text-sm font-semibold text-gray-700">Last Name *</Label>
                          <div className="relative">
                            <Input
                              id="lastName"
                              placeholder="Enter your last name"
                              value={formData.lastName}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, lastName: value });
                                debouncedValidation('lastName', value);
                              }}
                              className={`h-10 pl-4 pr-10 border-2 transition-all bg-white ${
                                liveValidation.lastName ? 
                                  liveValidation.lastName.isValid ? 'border-green-500' : 'border-red-500' : 
                                  'border-gray-300 focus:border-blue-500'
                              }`}
                              autoComplete="family-name"
                            />
                            {liveValidation.lastName && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {liveValidation.lastName.isValid ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {liveValidation.lastName && !liveValidation.lastName.isValid && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {liveValidation.lastName.error}
                            </p>
                          )}
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email" className="text-sm font-semibold text-gray-700">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="your.email@example.com"
                            value={formData.email}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, email: value });
                              debouncedValidation('email', value);
                            }}
                            className={`pl-12 pr-10 h-10 border-2 transition-all bg-white ${
                              liveValidation.email ? 
                                liveValidation.email.isValid ? 'border-green-500' : 'border-red-500' : 
                                'border-gray-300 focus:border-blue-500'
                            }`}
                            autoComplete="email"
                          />
                          {liveValidation.email && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {liveValidation.email.isValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {liveValidation.email && !liveValidation.email.isValid ? (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {liveValidation.email.error}
                          </p>
                        ) : (
                          <p className="text-xs text-gray-500">We'll send important updates to this email</p>
                        )}
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                        <div className="space-y-2">
                          <Label htmlFor="phone" className="text-sm font-semibold text-gray-700">Phone Number *</Label>
                          <div className="relative">
                            <Phone className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="phone"
                              type="tel"
                              placeholder="+1 (555) 123-4567"
                              value={formData.phone}
                              onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                              className="pl-12 h-10 border-2 focus:border-blue-500 transition-colors bg-white"
                              autoComplete="tel"
                            />
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="country" className="text-sm font-semibold text-gray-700">Country *</Label>
                          <Select
                            value={formData.country}
                            onValueChange={(value) => setFormData({ ...formData, country: value })}
                          >
                            <SelectTrigger className="h-10 border-2 focus:border-blue-500 bg-white">
                              <SelectValue placeholder="Select your country" />
                            </SelectTrigger>
                            <SelectContent className="max-h-64 overflow-y-auto bg-white border-2">
                              {countries.map((country) => (
                                <SelectItem key={country} value={country.toLowerCase().replace(/\s+/g, '-')} className="bg-white hover:bg-blue-50">
                                  {country}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="city" className="text-sm font-semibold text-gray-700 flex items-center gap-2">
                          City *
                          {locationDetected && (
                            <Badge variant="secondary" className="text-xs bg-green-100 text-green-800">
                              Auto-detected
                            </Badge>
                          )}
                        </Label>
                        <div className="relative">
                          <LocationIcon className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                          <Input
                            id="city"
                            placeholder="Enter your city"
                            value={formData.city}
                            onChange={(e) => {
                              const value = e.target.value;
                              setFormData({ ...formData, city: value });
                              debouncedValidation('city', value);
                            }}
                            className={`pl-12 pr-10 h-10 border-2 transition-all bg-white ${
                              liveValidation.city ? 
                                liveValidation.city.isValid ? 'border-green-500' : 'border-red-500' : 
                                'border-gray-300 focus:border-blue-500'
                            }`}
                          />
                          {liveValidation.city && (
                            <div className="absolute right-3 top-1/2 -translate-y-1/2">
                              {liveValidation.city.isValid ? (
                                <CheckCircle2 className="h-5 w-5 text-green-500" />
                              ) : (
                                <AlertTriangle className="h-5 w-5 text-red-500" />
                              )}
                            </div>
                          )}
                        </div>
                        {suggestions.city && suggestions.city.length > 0 && (
                          <div className="bg-white border border-blue-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                            {suggestions.city.map((city, index) => (
                              <div
                                key={index}
                                className="px-3 py-2 hover:bg-blue-50 cursor-pointer text-sm"
                                onClick={() => {
                                  setFormData({ ...formData, city });
                                  setSuggestions(prev => ({ ...prev, city: [] }));
                                }}
                              >
                                <LocationIcon className="h-3 w-3 inline mr-2 text-blue-500" />
                                {city}
                              </div>
                            ))}
                          </div>
                        )}
                        {liveValidation.city && !liveValidation.city.isValid && (
                          <p className="text-xs text-red-600 flex items-center gap-1">
                            <AlertTriangle className="h-3 w-3" />
                            {liveValidation.city.error}
                          </p>
                        )}
                      </div>
                      
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-4">
                          <div className="flex items-start gap-3">
                            <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                              <Sparkles className="h-4 w-4 text-white" />
                            </div>
                            <div>
                              <h4 className="font-semibold text-green-900 mb-1">Why Join Taskify?</h4>
                              <ul className="text-sm text-green-700 space-y-1">
                                <li>• Earn $25-80+ per hour working on AI projects</li>
                                <li>• Flexible schedule - work when you want</li>
                                <li>• Learn from industry experts and grow your skills</li>
                                <li>• Join a global community of AI professionals</li>
                              </ul>
                            </div>
                          </div>
                        </CardContent>
                      </Card>
                    </div>
                  )}

                  {/* Step 2: Professional Background */}
                  {currentStep === 2 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-purple-50 to-indigo-50 border-purple-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-purple-600 rounded-full flex items-center justify-center">
                              <Briefcase className="h-4 w-4 text-white" />
                            </div>
                            Professional Background
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Tell us about your professional experience and expertise in AI.</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-4">
                        <div className="space-y-2">
                          <Label htmlFor="expertise" className="text-sm font-semibold text-gray-700">Primary Area of Expertise *</Label>
                          <Select
                            value={formData.expertise}
                            onValueChange={(value) => setFormData({ ...formData, expertise: value })}
                          >
                            <SelectTrigger className="h-10 border-2 focus:border-purple-500 bg-white">
                              <SelectValue placeholder="Select your area of expertise" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2">
                              <SelectItem value="machine-learning" className="bg-white hover:bg-purple-50">🤖 Machine Learning</SelectItem>
                              <SelectItem value="data-science" className="bg-white hover:bg-purple-50">📊 Data Science</SelectItem>
                              <SelectItem value="computer-vision" className="bg-white hover:bg-purple-50">👁️ Computer Vision</SelectItem>
                              <SelectItem value="nlp" className="bg-white hover:bg-purple-50">🗣️ Natural Language Processing</SelectItem>
                              <SelectItem value="deep-learning" className="bg-white hover:bg-purple-50">🧠 Deep Learning</SelectItem>
                              <SelectItem value="ai-research" className="bg-white hover:bg-purple-50">🔬 AI Research</SelectItem>
                              <SelectItem value="software-engineering" className="bg-white hover:bg-purple-50">💻 Software Engineering</SelectItem>
                              <SelectItem value="data-engineering" className="bg-white hover:bg-purple-50">⚙️ Data Engineering</SelectItem>
                              <SelectItem value="ai-ethics" className="bg-white hover:bg-purple-50">⚖️ AI Ethics</SelectItem>
                              <SelectItem value="robotics" className="bg-white hover:bg-purple-50">🤖 Robotics</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="experience" className="text-sm font-semibold text-gray-700">Years of Experience *</Label>
                            <Select
                              value={formData.experience}
                              onValueChange={(value) => setFormData({ ...formData, experience: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-purple-500 bg-white">
                                <SelectValue placeholder="Select experience" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="0-1" className="bg-white hover:bg-purple-50">🌱 0-1 years (Entry Level)</SelectItem>
                                <SelectItem value="2-3" className="bg-white hover:bg-purple-50">📈 2-3 years (Junior)</SelectItem>
                                <SelectItem value="4-5" className="bg-white hover:bg-purple-50">🚀 4-5 years (Mid-Level)</SelectItem>
                                <SelectItem value="6-10" className="bg-white hover:bg-purple-50">⭐ 6-10 years (Senior)</SelectItem>
                                <SelectItem value="10+" className="bg-white hover:bg-purple-50">🏆 10+ years (Expert)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="education" className="text-sm font-semibold text-gray-700">Education Level *</Label>
                            <Select
                              value={formData.education}
                              onValueChange={(value) => setFormData({ ...formData, education: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-purple-500 bg-white">
                                <SelectValue placeholder="Select education" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="high-school" className="bg-white hover:bg-purple-50">🎓 High School</SelectItem>
                                <SelectItem value="associate" className="bg-white hover:bg-purple-50">📜 Associate Degree</SelectItem>
                                <SelectItem value="bachelor" className="bg-white hover:bg-purple-50">🎓 Bachelor's Degree</SelectItem>
                                <SelectItem value="master" className="bg-white hover:bg-purple-50">🎓 Master's Degree</SelectItem>
                                <SelectItem value="phd" className="bg-white hover:bg-purple-50">🎓 PhD</SelectItem>
                                <SelectItem value="bootcamp" className="bg-white hover:bg-purple-50">💻 Coding Bootcamp</SelectItem>
                                <SelectItem value="self-taught" className="bg-white hover:bg-purple-50">📚 Self-Taught</SelectItem>
                                <SelectItem value="other" className="bg-white hover:bg-purple-50">📋 Other</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="currentRole" className="text-sm font-semibold text-gray-700">Current Role *</Label>
                          <div className="relative">
                            <Building className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="currentRole"
                              placeholder="e.g., Senior Data Scientist at TechCorp"
                              value={formData.currentRole}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, currentRole: value });
                                debouncedValidation('currentRole', value);
                              }}
                              className={`pl-12 pr-10 h-10 border-2 transition-all bg-white ${
                                liveValidation.currentRole ? 
                                  liveValidation.currentRole.isValid ? 'border-green-500' : 'border-red-500' : 
                                  'border-gray-300 focus:border-purple-500'
                              }`}
                            />
                            {liveValidation.currentRole && (
                              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                                {liveValidation.currentRole.isValid ? (
                                  <CheckCircle2 className="h-5 w-5 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-5 w-5 text-red-500" />
                                )}
                              </div>
                            )}
                          </div>
                          {suggestions.currentRole && suggestions.currentRole.length > 0 && (
                            <div className="bg-white border border-purple-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                              {suggestions.currentRole.map((role, index) => (
                                <div
                                  key={index}
                                  className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                                  onClick={() => {
                                    setFormData({ ...formData, currentRole: role });
                                    setSuggestions(prev => ({ ...prev, currentRole: [] }));
                                  }}
                                >
                                  <Lightbulb className="h-3 w-3 inline mr-2 text-purple-500" />
                                  {role}
                                </div>
                              ))}
                            </div>
                          )}
                          {liveValidation.currentRole && !liveValidation.currentRole.isValid && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {liveValidation.currentRole.error}
                            </p>
                          )}
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="company" className="text-sm font-semibold text-gray-700">Company/Organization</Label>
                            <div className="relative">
                              <Input
                                id="company"
                                placeholder="e.g., Google, Microsoft, Freelance"
                                value={formData.company}
                                onChange={(e) => {
                                  const value = e.target.value;
                                  setFormData({ ...formData, company: value });
                                  debouncedValidation('company', value);
                                }}
                                className="h-10 border-2 focus:border-purple-500 transition-colors bg-white"
                              />
                            </div>
                            {suggestions.company && suggestions.company.length > 0 && (
                              <div className="bg-white border border-purple-200 rounded-lg shadow-lg max-h-32 overflow-y-auto">
                                {suggestions.company.map((company, index) => (
                                  <div
                                    key={index}
                                    className="px-3 py-2 hover:bg-purple-50 cursor-pointer text-sm"
                                    onClick={() => {
                                      setFormData({ ...formData, company });
                                      setSuggestions(prev => ({ ...prev, company: [] }));
                                    }}
                                  >
                                    <Building className="h-3 w-3 inline mr-2 text-purple-500" />
                                    {company}
                                  </div>
                                ))}
                              </div>
                            )}
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="industry" className="text-sm font-semibold text-gray-700">Industry *</Label>
                            <Select
                              value={formData.industry}
                              onValueChange={(value) => setFormData({ ...formData, industry: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-purple-500 bg-white">
                                <SelectValue placeholder="Select industry" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2 max-h-48 overflow-y-auto">
                                {industries.map((industry) => (
                                  <SelectItem key={industry} value={industry.toLowerCase().replace(/\s+/g, '-')} className="bg-white hover:bg-purple-50">
                                    {industry}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 3: Skills & Goals */}
                  {currentStep === 3 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-green-50 to-teal-50 border-green-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                              <Brain className="h-4 w-4 text-white" />
                            </div>
                            Skills & Learning Goals
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Select your technical skills and what you'd like to learn while working with us.</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">Technical Skills * (Select all that apply)</Label>
                          <Tabs defaultValue="AI & Machine Learning" className="w-full">
                            <TabsList className="grid w-full grid-cols-3 lg:grid-cols-6 bg-white">
                              {Object.keys(skillCategories).map((category) => (
                                <TabsTrigger key={category} value={category} className="text-xs">
                                  {category.split(' ')[0]}
                                </TabsTrigger>
                              ))}
                            </TabsList>
                            {Object.entries(skillCategories).map(([category, skills]) => (
                              <TabsContent key={category} value={category} className="mt-4">
                                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                                  {skills.map((skill) => {
                                    const demand = skillDemand[skill] || 0;
                                    const isHighDemand = demand > 70;
                                    const isMediumDemand = demand > 40;
                                    
                                    return (
                                      <div
                                        key={skill}
                                        onClick={() => toggleSkill(skill)}
                                        className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center text-sm font-medium relative ${
                                          formData.skills?.includes(skill)
                                            ? "bg-green-600 text-white border-green-600 shadow-md transform scale-105"
                                            : "bg-white text-gray-700 border-gray-200 hover:border-green-300 hover:shadow-sm"
                                        }`}
                                      >
                                        <div className="flex items-center justify-between">
                                          <span className="flex-1">{skill}</span>
                                          {isHighDemand && (
                                            <div className="absolute -top-1 -right-1 bg-red-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                              🔥
                                            </div>
                                          )}
                                          {isMediumDemand && !isHighDemand && (
                                            <div className="absolute -top-1 -right-1 bg-orange-500 text-white rounded-full w-4 h-4 flex items-center justify-center text-xs">
                                              📈
                                            </div>
                                          )}
                                        </div>
                                        {isOnline && (
                                          <div className="mt-1 text-xs opacity-70">
                                            Demand: {demand.toFixed(0)}%
                                          </div>
                                        )}
                                      </div>
                                    );
                                  })}
                                </div>
                              </TabsContent>
                            ))}
                          </Tabs>
                          {(formData.skills?.length || 0) > 0 && (
                            <div className="mt-4 p-4 bg-green-50 rounded-lg">
                              <p className="text-sm font-medium text-green-900 mb-2">
                                Selected skills ({formData.skills?.length || 0}):
                              </p>
                              <div className="flex flex-wrap gap-2">
                                {(formData.skills || []).map((skill) => (
                                  <Badge key={skill} variant="secondary" className="text-xs bg-green-100 text-green-800">
                                    {skill}
                                    <button
                                      onClick={(e) => {
                                        e.stopPropagation();
                                        toggleSkill(skill);
                                      }}
                                      className="ml-1 hover:text-green-600"
                                    >
                                      <X className="h-3 w-3" />
                                    </button>
                                  </Badge>
                                ))}
                              </div>
                            </div>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="primarySkill" className="text-sm font-semibold text-gray-700">Primary Skill *</Label>
                          <Select
                            value={formData.primarySkill}
                            onValueChange={(value) => setFormData({ ...formData, primarySkill: value })}
                          >
                            <SelectTrigger className="h-10 border-2 focus:border-green-500 bg-white">
                              <SelectValue placeholder="Select your strongest skill" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2 max-h-48 overflow-y-auto">
                              {allSkills.map((skill) => (
                                <SelectItem key={skill} value={skill} className="bg-white hover:bg-green-50">
                                  {skill}
                                </SelectItem>
                              ))}
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">Learning Goals * (What would you like to learn?)</Label>
                          <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                            {learningGoalOptions.map((goal) => (
                              <div
                                key={goal}
                                onClick={() => toggleLearningGoal(goal)}
                                className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                                  formData.learningGoals?.includes(goal)
                                    ? "bg-blue-600 text-white border-blue-600 shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-blue-300"
                                }`}
                              >
                                {goal}
                              </div>
                            ))}
                          </div>
                        </div>

                        <div className="space-y-3">
                          <Label className="text-sm font-semibold text-gray-700">Preferred Project Types * (Select all that interest you)</Label>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {projectTypeOptions.map((type) => (
                              <div
                                key={type}
                                onClick={() => toggleProjectType(type)}
                                className={`cursor-pointer p-3 rounded-lg border-2 transition-all text-center text-sm font-medium ${
                                  formData.projectTypes?.includes(type)
                                    ? "bg-purple-600 text-white border-purple-600 shadow-md"
                                    : "bg-white text-gray-700 border-gray-200 hover:border-purple-300"
                                }`}
                              >
                                {type}
                              </div>
                            ))}
                          </div>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 4: Availability */}
                  {currentStep === 4 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-orange-50 to-red-50 border-orange-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-orange-600 rounded-full flex items-center justify-center">
                              <Calendar className="h-4 w-4 text-white" />
                            </div>
                            Availability & Commitment
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Let us know when you're available and how much time you can commit.</p>
                          
                          {estimatedEarnings > 0 && (
                            <motion.div 
                              initial={{ opacity: 0, y: 20 }}
                              animate={{ opacity: 1, y: 0 }}
                              className="bg-gradient-to-r from-green-100 to-emerald-100 border border-green-300 p-4 rounded-lg"
                            >
                              <div className="flex items-center justify-between mb-3">
                                <div className="flex items-center gap-2 text-green-800">
                                  <DollarSign className="h-5 w-5" />
                                  <span className="font-semibold">Estimated Monthly Earnings</span>
                                </div>
                                <motion.span 
                                  key={estimatedEarnings}
                                  initial={{ scale: 1.2, color: '#22c55e' }}
                                  animate={{ scale: 1, color: '#166534' }}
                                  className="text-2xl font-bold text-green-800"
                                >
                                  ${estimatedEarnings.toFixed(0)}
                                </motion.span>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 text-sm">
                                <div className="text-green-600">
                                  <div className="flex justify-between">
                                    <span>Base rate:</span>
                                    <span>$25/hr</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Experience bonus:</span>
                                    <span>+{((formData.experience === '0-1' ? 0 : formData.experience === '2-3' ? 20 : formData.experience === '4-5' ? 50 : formData.experience === '6-10' ? 80 : 120))}%</span>
                                  </div>
                                </div>
                                <div className="text-green-600">
                                  <div className="flex justify-between">
                                    <span>Skills bonus:</span>
                                    <span>+${((formData.skills?.length || 0) * 2)}/hr</span>
                                  </div>
                                  <div className="flex justify-between">
                                    <span>Hours/week:</span>
                                    <span>{formData.hoursPerWeek || '0'}</span>
                                  </div>
                                </div>
                              </div>
                              
                              {marketData && (
                                <div className="mt-3 pt-3 border-t border-green-200">
                                  <p className="text-xs text-green-600 flex items-center gap-1">
                                    <BarChart3 className="h-3 w-3" />
                                    Market average: ${marketData.averageHourlyRate.toFixed(0)}/hr • 
                                    {marketData.jobOpenings} open positions • 
                                    Demand is {marketData.demandLevel}
                                  </p>
                                </div>
                              )}
                            </motion.div>
                          )}
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="availability" className="text-sm font-semibold text-gray-700">When can you start? *</Label>
                            <Select
                              value={formData.availability}
                              onValueChange={(value) => setFormData({ ...formData, availability: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-orange-500 bg-white">
                                <SelectValue placeholder="Select availability" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="immediately" className="bg-white hover:bg-orange-50">🚀 Immediately</SelectItem>
                                <SelectItem value="1-week" className="bg-white hover:bg-orange-50">📅 Within 1 week</SelectItem>
                                <SelectItem value="2-weeks" className="bg-white hover:bg-orange-50">📅 Within 2 weeks</SelectItem>
                                <SelectItem value="1-month" className="bg-white hover:bg-orange-50">📅 Within 1 month</SelectItem>
                                <SelectItem value="flexible" className="bg-white hover:bg-orange-50">🔄 Flexible</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="hoursPerWeek" className="text-sm font-semibold text-gray-700">Hours per week *</Label>
                            <Select
                              value={formData.hoursPerWeek}
                              onValueChange={(value) => setFormData({ ...formData, hoursPerWeek: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-orange-500 bg-white">
                                <SelectValue placeholder="Select hours" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="5-10" className="bg-white hover:bg-orange-50">⏰ 5-10 hours (Part-time)</SelectItem>
                                <SelectItem value="10-20" className="bg-white hover:bg-orange-50">⏰ 10-20 hours (Half-time)</SelectItem>
                                <SelectItem value="20-30" className="bg-white hover:bg-orange-50">⏰ 20-30 hours (Active)</SelectItem>
                                <SelectItem value="30-40" className="bg-white hover:bg-orange-50">⏰ 30-40 hours (Full-time)</SelectItem>
                                <SelectItem value="40+" className="bg-white hover:bg-orange-50">⏰ 40+ hours (Dedicated)</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="startDate" className="text-sm font-semibold text-gray-700">Preferred Start Date *</Label>
                          <Input
                            id="startDate"
                            type="date"
                            value={formData.startDate}
                            onChange={(e) => setFormData({ ...formData, startDate: e.target.value })}
                            className="h-10 border-2 focus:border-orange-500 transition-colors bg-white"
                            min={new Date().toISOString().split('T')[0]}
                          />
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="timeCommitment" className="text-sm font-semibold text-gray-700">Time Commitment *</Label>
                          <Select
                            value={formData.timeCommitment}
                            onValueChange={(value) => setFormData({ ...formData, timeCommitment: value })}
                          >
                            <SelectTrigger className="h-10 border-2 focus:border-orange-500 bg-white">
                              <SelectValue placeholder="Select commitment level" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2">
                              <SelectItem value="short-term" className="bg-white hover:bg-orange-50">📋 Short-term (1-3 months)</SelectItem>
                              <SelectItem value="medium-term" className="bg-white hover:bg-orange-50">📅 Medium-term (3-6 months)</SelectItem>
                              <SelectItem value="long-term" className="bg-white hover:bg-orange-50">🎯 Long-term (6+ months)</SelectItem>
                              <SelectItem value="ongoing" className="bg-white hover:bg-orange-50">🔄 Ongoing/Permanent</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="workingHours" className="text-sm font-semibold text-gray-700">Preferred Working Hours *</Label>
                          <Select
                            value={formData.workingHours}
                            onValueChange={(value) => setFormData({ ...formData, workingHours: value })}
                          >
                            <SelectTrigger className="h-10 border-2 focus:border-orange-500 bg-white">
                              <SelectValue placeholder="Select working hours" />
                            </SelectTrigger>
                            <SelectContent className="bg-white border-2">
                              <SelectItem value="morning" className="bg-white hover:bg-orange-50">🌅 Morning (6 AM - 12 PM)</SelectItem>
                              <SelectItem value="afternoon" className="bg-white hover:bg-orange-50">☀️ Afternoon (12 PM - 6 PM)</SelectItem>
                              <SelectItem value="evening" className="bg-white hover:bg-orange-50">🌆 Evening (6 PM - 12 AM)</SelectItem>
                              <SelectItem value="night" className="bg-white hover:bg-orange-50">🌙 Night (12 AM - 6 AM)</SelectItem>
                              <SelectItem value="flexible" className="bg-white hover:bg-orange-50">🔄 Flexible</SelectItem>
                            </SelectContent>
                          </Select>
                        </div>

                        <div className="flex items-center space-x-2">
                          <Switch
                            id="weekendAvailability"
                            checked={formData.weekendAvailability}
                            onCheckedChange={(checked) => setFormData({ ...formData, weekendAvailability: checked })}
                          />
                          <Label htmlFor="weekendAvailability" className="text-sm font-semibold text-gray-700">
                            Available on weekends
                          </Label>
                        </div>
                      </div>
                    </div>
                  )}

                  {/* Step 5: Final Details */}
                  {currentStep === 5 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-pink-50 to-purple-50 border-pink-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-pink-600 rounded-full flex items-center justify-center">
                              <Rocket className="h-4 w-4 text-white" />
                            </div>
                            Final Details & Portfolio
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Tell us more about yourself and share your work.</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="bio" className="text-sm font-semibold text-gray-700">Bio * (Minimum 100 characters)</Label>
                          <Textarea
                            id="bio"
                            placeholder="Tell us about yourself, your background, interests, and what makes you passionate about AI..."
                            value={formData.bio}
                            onChange={(e) => setFormData({ ...formData, bio: e.target.value })}
                            className="min-h-[80px] border-2 focus:border-pink-500 transition-colors bg-white resize-none"
                          />
                          <p className="text-xs text-gray-500">
                            {formData.bio?.length || 0}/100 characters minimum
                          </p>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="motivation" className="text-sm font-semibold text-gray-700">Why do you want to join Taskify? * (Minimum 50 characters)</Label>
                          <Textarea
                            id="motivation"
                            placeholder="What motivates you to work with AI? What are your goals?"
                            value={formData.motivation}
                            onChange={(e) => setFormData({ ...formData, motivation: e.target.value })}
                            className="min-h-[60px] border-2 focus:border-pink-500 transition-colors bg-white resize-none"
                          />
                          <p className="text-xs text-gray-500">
                            {formData.motivation?.length || 0}/50 characters minimum
                          </p>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="earningGoals" className="text-sm font-semibold text-gray-700">Monthly Earning Goals *</Label>
                            <Select
                              value={formData.earningGoals}
                              onValueChange={(value) => setFormData({ ...formData, earningGoals: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-pink-500 bg-white">
                                <SelectValue placeholder="Select earning goal" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="500-1000" className="bg-white hover:bg-pink-50">💰 $500 - $1,000</SelectItem>
                                <SelectItem value="1000-2500" className="bg-white hover:bg-pink-50">💰 $1,000 - $2,500</SelectItem>
                                <SelectItem value="2500-5000" className="bg-white hover:bg-pink-50">💰 $2,500 - $5,000</SelectItem>
                                <SelectItem value="5000-10000" className="bg-white hover:bg-pink-50">💰 $5,000 - $10,000</SelectItem>
                                <SelectItem value="10000+" className="bg-white hover:bg-pink-50">💰 $10,000+</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="communicationStyle" className="text-sm font-semibold text-gray-700">Communication Style *</Label>
                            <Select
                              value={formData.communicationStyle}
                              onValueChange={(value) => setFormData({ ...formData, communicationStyle: value })}
                            >
                              <SelectTrigger className="h-10 border-2 focus:border-pink-500 bg-white">
                                <SelectValue placeholder="Select style" />
                              </SelectTrigger>
                              <SelectContent className="bg-white border-2">
                                <SelectItem value="direct" className="bg-white hover:bg-pink-50">🎯 Direct & Concise</SelectItem>
                                <SelectItem value="collaborative" className="bg-white hover:bg-pink-50">🤝 Collaborative</SelectItem>
                                <SelectItem value="detailed" className="bg-white hover:bg-pink-50">📝 Detailed & Thorough</SelectItem>
                                <SelectItem value="casual" className="bg-white hover:bg-pink-50">😊 Casual & Friendly</SelectItem>
                              </SelectContent>
                            </Select>
                          </div>
                        </div>

                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                          <div className="space-y-2">
                            <Label htmlFor="linkedIn" className="text-sm font-semibold text-gray-700">LinkedIn Profile</Label>
                            <div className="relative">
                              <Linkedin className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-blue-600" />
                              <Input
                                id="linkedIn"
                                placeholder="https://linkedin.com/in/yourprofile"
                                value={formData.linkedIn}
                                onChange={(e) => setFormData({ ...formData, linkedIn: e.target.value })}
                                className="pl-12 h-10 border-2 focus:border-pink-500 transition-colors bg-white"
                              />
                            </div>
                          </div>

                          <div className="space-y-2">
                            <Label htmlFor="github" className="text-sm font-semibold text-gray-700">GitHub Profile</Label>
                            <div className="relative">
                              <Github className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-700" />
                              <Input
                                id="github"
                                placeholder="https://github.com/yourusername"
                                value={formData.github}
                                onChange={(e) => setFormData({ ...formData, github: e.target.value })}
                                className="pl-12 h-10 border-2 focus:border-pink-500 transition-colors bg-white"
                              />
                            </div>
                          </div>
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="portfolio" className="text-sm font-semibold text-gray-700">Portfolio/Website</Label>
                          <div className="relative">
                            <ExternalLink className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="portfolio"
                              placeholder="https://yourportfolio.com"
                              value={formData.portfolio}
                              onChange={(e) => setFormData({ ...formData, portfolio: e.target.value })}
                              className="pl-12 h-10 border-2 focus:border-pink-500 transition-colors bg-white"
                            />
                          </div>
                        </div>

                        <div className="space-y-4">
                          <div className="flex items-center space-x-2">
                            <Switch
                              id="mentorshipInterest"
                              checked={formData.mentorshipInterest}
                              onCheckedChange={(checked) => setFormData({ ...formData, mentorshipInterest: checked })}
                            />
                            <Label htmlFor="mentorshipInterest" className="text-sm font-semibold text-gray-700">
                              Interested in mentoring junior AI professionals
                            </Label>
                          </div>

                          <div className="space-y-3">
                            <Label className="text-sm font-semibold text-gray-700">Terms & Conditions *</Label>
                            <div className="space-y-3">
                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="agreeToTerms"
                                  checked={formData.agreeToTerms}
                                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToTerms: !!checked })}
                                />
                                <Label htmlFor="agreeToTerms" className="text-sm text-gray-700 leading-relaxed">
                                  I agree to the <a href="#" className="text-pink-600 hover:underline">Terms of Service</a> and <a href="#" className="text-pink-600 hover:underline">Privacy Policy</a>
                                </Label>
                              </div>

                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="agreeToDataProcessing"
                                  checked={formData.agreeToDataProcessing}
                                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToDataProcessing: !!checked })}
                                />
                                <Label htmlFor="agreeToDataProcessing" className="text-sm text-gray-700 leading-relaxed">
                                  I consent to the processing of my personal data for application purposes
                                </Label>
                              </div>

                              <div className="flex items-start space-x-2">
                                <Checkbox
                                  id="agreeToNewsletter"
                                  checked={formData.agreeToNewsletter}
                                  onCheckedChange={(checked) => setFormData({ ...formData, agreeToNewsletter: !!checked })}
                                />
                                <Label htmlFor="agreeToNewsletter" className="text-sm text-gray-700 leading-relaxed">
                                  I would like to receive updates about new opportunities and platform news (optional)
                                </Label>
                              </div>
                            </div>
                          </div>
                        </div>

                        <Card className="bg-gradient-to-r from-green-50 to-blue-50 border-green-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 bg-green-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Trophy className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Ready to Start Your AI Journey?</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  You're about to join a community of {(Math.random() * 1000 + 5000).toFixed(0)}+ AI professionals worldwide.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li>• Average response time: 24-48 hours</li>
                                  <li>• 95% of qualified applicants get their first project within 2 weeks</li>
                                  <li>• Access to exclusive training materials upon acceptance</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Step 6: Account Setup */}
                  {currentStep === 6 && (
                    <div className="space-y-4">
                      <Card className="bg-gradient-to-r from-green-50 to-emerald-50 border-green-200">
                        <CardContent className="p-4">
                          <h3 className="text-lg font-bold text-gray-900 mb-2 flex items-center gap-2">
                            <div className="h-8 w-8 bg-green-600 rounded-full flex items-center justify-center">
                              <Shield className="h-4 w-4 text-white" />
                            </div>
                            Account Setup
                          </h3>
                          <p className="text-gray-600 mb-3 text-sm">Create your secure account to access the platform.</p>
                        </CardContent>
                      </Card>

                      <div className="space-y-6">
                        <div className="space-y-2">
                          <Label htmlFor="password" className="text-sm font-semibold text-gray-700">Password *</Label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="password"
                              type={showPassword ? "text" : "password"}
                              placeholder="Create a strong password"
                              value={formData.password}
                              onChange={(e) => {
                                const value = e.target.value;
                                setFormData({ ...formData, password: value });
                                debouncedValidation('password', value);
                              }}
                              className={`pl-12 pr-20 h-10 border-2 transition-all bg-white ${
                                liveValidation.password ? 
                                  liveValidation.password.isValid ? 'border-green-500' : 'border-red-500' : 
                                  'border-gray-300 focus:border-green-500'
                              }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {liveValidation.password && (
                                liveValidation.password.isValid ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )
                              )}
                              <button
                                type="button"
                                onClick={() => setShowPassword(!showPassword)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          <div className="text-xs space-y-1">
                            <p className="text-gray-600 font-medium">Password requirements:</p>
                            <ul className="space-y-1 ml-2">
                              <li className={`flex items-center gap-2 ${formData.password.length >= 8 ? 'text-green-600' : 'text-gray-500'}`}>
                                {formData.password.length >= 8 ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                                At least 8 characters ({formData.password.length}/8)
                              </li>
                              <li className={`flex items-center gap-2 ${/[a-zA-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                {/[a-zA-Z]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                                At least one letter
                              </li>
                              <li className={`flex items-center gap-2 ${/\d/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                {/\d/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                                At least one number
                              </li>
                              <li className={`flex items-center gap-2 ${/[A-Z]/.test(formData.password) ? 'text-green-600' : 'text-gray-500'}`}>
                                {/[A-Z]/.test(formData.password) ? <CheckCircle2 className="h-3 w-3" /> : <div className="h-3 w-3 border border-gray-300 rounded-full" />}
                                At least one uppercase letter
                              </li>
                            </ul>
                          </div>
                          {liveValidation.password && !liveValidation.password.isValid && (
                            <p className="text-xs text-red-600 flex items-center gap-1">
                              <AlertTriangle className="h-3 w-3" />
                              {liveValidation.password.error}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <Label htmlFor="confirmPassword" className="text-sm font-semibold text-gray-700">Confirm Password *</Label>
                          <div className="relative">
                            <Shield className="absolute left-4 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                            <Input
                              id="confirmPassword"
                              type={showConfirmPassword ? "text" : "password"}
                              placeholder="Confirm your password"
                              value={formData.confirmPassword}
                              onChange={(e) => setFormData({ ...formData, confirmPassword: e.target.value })}
                              className={`pl-12 pr-20 h-10 border-2 transition-all bg-white ${
                                formData.confirmPassword ? 
                                  formData.password === formData.confirmPassword && formData.password.length > 0 ? 
                                    'border-green-500' : 'border-red-500' : 
                                  'border-gray-300 focus:border-green-500'
                              }`}
                            />
                            <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-2">
                              {formData.confirmPassword && (
                                formData.password === formData.confirmPassword && formData.password.length > 0 ? (
                                  <CheckCircle2 className="h-4 w-4 text-green-500" />
                                ) : (
                                  <AlertTriangle className="h-4 w-4 text-red-500" />
                                )
                              )}
                              <button
                                type="button"
                                onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                                className="text-gray-400 hover:text-gray-600"
                              >
                                {showConfirmPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                              </button>
                            </div>
                          </div>
                          {formData.confirmPassword && formData.password !== formData.confirmPassword && (
                            <motion.p 
                              initial={{ opacity: 0 }}
                              animate={{ opacity: 1 }}
                              className="text-xs text-red-600 flex items-center gap-1"
                            >
                              <AlertTriangle className="h-3 w-3" />
                              Passwords do not match
                            </motion.p>
                          )}
                          {formData.confirmPassword && formData.password === formData.confirmPassword && formData.password.length > 0 && (
                            <motion.p 
                              initial={{ opacity: 0, scale: 0.9 }}
                              animate={{ opacity: 1, scale: 1 }}
                              className="text-xs text-green-600 flex items-center gap-1"
                            >
                              <CheckCircle2 className="h-3 w-3" />
                              Passwords match perfectly!
                            </motion.p>
                          )}
                        </div>

                        <Card className="bg-gradient-to-r from-blue-50 to-indigo-50 border-blue-200">
                          <CardContent className="p-4">
                            <div className="flex items-start gap-3">
                              <div className="h-8 w-8 bg-blue-500 rounded-full flex items-center justify-center flex-shrink-0 mt-1">
                                <Shield className="h-4 w-4 text-white" />
                              </div>
                              <div>
                                <h4 className="font-semibold text-gray-900 mb-1">Secure Account Creation</h4>
                                <p className="text-sm text-gray-600 mb-2">
                                  Your account will be created immediately after successful application submission.
                                </p>
                                <ul className="text-sm text-gray-600 space-y-1">
                                  <li>• Instant access to your dashboard</li>
                                  <li>• Secure password encryption</li>
                                  <li>• Email notifications for new opportunities</li>
                                </ul>
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      </div>
                    </div>
                  )}

                  {/* Add steps 3, 4, and 5 here - continuing in next part due to length */}
                </motion.div>
              </AnimatePresence>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="border-t bg-gradient-to-r from-gray-50 to-white p-2 flex-shrink-0">
            {/* Live Tips Bar - Only show on larger screens */}
            {isOnline && (
              <div className="bg-blue-50 border border-blue-200 rounded-md p-1 mb-1 hidden sm:block">
                <div className="flex items-center gap-1">
                  <Lightbulb className="h-3 w-3 text-blue-600" />
                  <div className="text-xs text-blue-700">
                    {currentStep === 1 && "💡 Tip: Use your real information for faster verification"}
                    {currentStep === 2 && "🚀 Tip: Select skills in high demand (marked with 🔥) to boost earnings"}
                    {currentStep === 3 && "⭐ Tip: Adding more skills increases your project match rate by 40%"}
                    {currentStep === 4 && "💰 Tip: Higher weekly availability = More earning opportunities"}
                    {currentStep === 5 && "📈 Tip: Complete portfolio links increase acceptance rate by 60%"}
                    {currentStep === 6 && "🔐 Tip: Strong passwords protect your earnings and personal data"}
                  </div>
                </div>
              </div>
            )}
            
            <div className="flex justify-between items-center">
              <div className="flex items-center gap-3">
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={currentStep === 1}
                  className="flex items-center gap-2 hover:bg-gray-100"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </Button>
                
                {/* Quick Stats */}
                <div className="hidden sm:flex items-center gap-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Users className="h-3 w-3" />
                    <span>{profileStrength}% complete</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <Timer className="h-3 w-3" />
                    <span>{Math.floor(completionTime / 60000)}m</span>
                  </div>
                  {estimatedEarnings > 0 && (
                    <div className="flex items-center gap-1 text-green-600">
                      <DollarSign className="h-3 w-3" />
                      <span>${estimatedEarnings.toFixed(0)}/mo</span>
                    </div>
                  )}
                </div>
              </div>

              <div className="text-xs text-gray-500 text-center">
                <div className="flex items-center gap-3">
                  <span className="hidden sm:inline">Ctrl+← → navigate • Ctrl+Enter continue</span>
                  <div className="flex items-center gap-1">
                    {isOnline ? (
                      <>
                        <Wifi className="h-3 w-3 text-green-500" />
                        <span className="text-green-600">Live</span>
                      </>
                    ) : (
                      <>
                        <WifiOff className="h-3 w-3 text-red-500" />
                        <span className="text-red-600">Offline</span>
                      </>
                    )}
                  </div>
                </div>
              </div>

              <div className="flex items-center gap-2">
                {currentStep < totalSteps ? (
                  <>
                    {currentStep > 1 && (
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => setCurrentStep(totalSteps)}
                        className="text-xs text-gray-600 hover:text-blue-600"
                      >
                        Skip to end
                      </Button>
                    )}
                    <Button
                      type="button"
                      onClick={handleNext}
                      className="flex items-center gap-2 bg-blue-600 hover:bg-blue-700 text-white px-6"
                    >
                      Next
                      <ArrowRight className="h-4 w-4" />
                    </Button>
                  </>
                ) : (
                  <Button
                    type="button"
                    onClick={handleSubmit}
                    disabled={isSubmitting}
                    className="flex items-center gap-2 bg-green-600 hover:bg-green-700 text-white px-8"
                  >
                    {isSubmitting ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Rocket className="h-4 w-4" />
                    )}
                    {isSubmitting ? "Submitting..." : "Submit Application"}
                  </Button>
                )}
              </div>
            </div>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
