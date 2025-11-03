import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { Textarea } from "./ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "./ui/select";
import { Checkbox } from "./ui/checkbox";
import { useState } from "react";
import { toast } from "sonner";
import { motion, AnimatePresence } from "framer-motion";
import { submitApplication } from "../utils/applications";
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
  ChevronRight,
} from "lucide-react";
import { Progress } from "./ui/progress";
import { Badge } from "./ui/badge";
import { Separator } from "./ui/separator";
import { Logo } from "./Logo";

interface ApplyDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSwitchToSignIn?: () => void;
}

interface FormData {
  // Step 1: Basic Info
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  country: string;
  
  // Step 2: Professional Background
  expertise: string;
  experience: string;
  education: string;
  currentRole: string;
  
  // Step 3: Skills & Availability
  skills: string[];
  availability: string;
  hoursPerWeek: string;
  
  // Step 4: Additional Info
  bio: string;
  linkedIn: string;
  portfolio: string;
  agreeToTerms: boolean;
}

export function ApplyDialog({ open, onOpenChange, onSwitchToSignIn }: ApplyDialogProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [formData, setFormData] = useState<FormData>({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    country: "",
    expertise: "",
    experience: "",
    education: "",
    currentRole: "",
    skills: [],
    availability: "",
    hoursPerWeek: "",
    bio: "",
    linkedIn: "",
    portfolio: "",
    agreeToTerms: false,
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const totalSteps = 4;
  const progress = (currentStep / totalSteps) * 100;

  const steps = [
    { number: 1, title: "Basic Info", icon: User },
    { number: 2, title: "Background", icon: Briefcase },
    { number: 3, title: "Skills", icon: GraduationCap },
    { number: 4, title: "Final Details", icon: FileText },
  ];

  const availableSkills = [
    "Python", "JavaScript", "Machine Learning", "Data Analysis",
    "Natural Language Processing", "Computer Vision", "Deep Learning",
    "SQL", "R", "TensorFlow", "PyTorch", "React", "Node.js"
  ];

  const validateStep = (step: number): boolean => {
    console.log('=== VALIDATION START ===');
    console.log('Validating step:', step);
    console.log('Form data:', JSON.stringify(formData, null, 2));
    
    // TEMPORARY: Skip validation for testing
    const skipValidation = false;
    if (skipValidation) {
      console.log('VALIDATION SKIPPED - returning true');
      return true;
    }
    
    switch (step) {
      case 1:
        console.log('Checking firstName:', formData.firstName);
        if (!formData.firstName || formData.firstName.trim() === "") {
          console.log('FAILED: firstName is empty');
          toast.error("Please enter your first name");
          return false;
        }
        
        console.log('Checking lastName:', formData.lastName);
        if (!formData.lastName || formData.lastName.trim() === "") {
          console.log('FAILED: lastName is empty');
          toast.error("Please enter your last name");
          return false;
        }
        
        console.log('Checking email:', formData.email);
        if (!formData.email || formData.email.trim() === "") {
          console.log('FAILED: email is empty');
          toast.error("Please enter your email address");
          return false;
        }
        
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        console.log('Testing email with regex:', emailRegex.test(formData.email.trim()));
        if (!emailRegex.test(formData.email.trim())) {
          console.log('FAILED: email format invalid');
          toast.error("Please enter a valid email address");
          return false;
        }
        
        console.log('Checking country:', formData.country);
        if (!formData.country) {
          console.log('FAILED: country is empty');
          toast.error("Please select your country");
          return false;
        }
        
        console.log('✓ Step 1 validation PASSED!');
        return true;
      case 2:
        if (!formData.expertise) {
          toast.error("Please select your area of expertise");
          return false;
        }
        if (!formData.experience) {
          toast.error("Please select your years of experience");
          return false;
        }
        if (!formData.education) {
          toast.error("Please select your education level");
          return false;
        }
        return true;
      case 3:
        if (formData.skills.length === 0) {
          toast.error("Please select at least one skill");
          return false;
        }
        if (!formData.availability) {
          toast.error("Please select when you can start");
          return false;
        }
        if (!formData.hoursPerWeek) {
          toast.error("Please select your available hours per week");
          return false;
        }
        return true;
      case 4:
        if (!formData.bio) {
          toast.error("Please tell us why you want to join Infera AI");
          return false;
        }
        if (formData.bio.length < 50) {
          toast.error(`Please provide more details (${formData.bio.length}/50 characters minimum)`);
          return false;
        }
        if (!formData.agreeToTerms) {
          toast.error("Please agree to the terms and conditions");
          return false;
        }
        return true;
      default:
        return true;
    }
  };

  const handleNext = () => {
    console.log('handleNext called, current step:', currentStep);
    const isValid = validateStep(currentStep);
    console.log('Validation result:', isValid);
    
    if (isValid) {
      const nextStep = currentStep + 1;
      console.log('Moving to step:', nextStep);
      setCurrentStep(nextStep);
      toast.success("Step completed! Moving to next section...", { duration: 1500 });
    } else {
      console.log('Validation failed, staying on step:', currentStep);
    }
  };

  const handleBack = () => {
    setCurrentStep((prev) => Math.max(prev - 1, 1));
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      if (currentStep < totalSteps) {
        handleNext();
      } else {
        handleSubmit();
      }
    }
  };

  const handleSubmit = async (e?: React.FormEvent) => {
    if (e) {
      e.preventDefault();
    }
    
    if (!validateStep(currentStep)) {
      return;
    }

    setIsSubmitting(true);
    
    try {
      // Submit application to backend
      const response = await submitApplication(formData);
      
      setIsSubmitting(false);
      toast.success(
        "🎉 Application submitted successfully! We'll review it and get back to you within 48 hours.",
        { duration: 5000 }
      );
      onOpenChange(false);
      
      // Reset form
      setTimeout(() => {
        setCurrentStep(1);
        setFormData({
          firstName: "",
          lastName: "",
          email: "",
          phone: "",
          country: "",
          expertise: "",
          experience: "",
          education: "",
          currentRole: "",
          skills: [],
          availability: "",
          hoursPerWeek: "",
          bio: "",
          linkedIn: "",
          portfolio: "",
          agreeToTerms: false,
        });
      }, 500);
    } catch (error: any) {
      setIsSubmitting(false);
      toast.error(
        error.message || "Failed to submit application. Please try again.",
        { duration: 5000 }
      );
    }
  };

  const toggleSkill = (skill: string) => {
    setFormData(prev => ({
      ...prev,
      skills: prev.skills.includes(skill)
        ? prev.skills.filter(s => s !== skill)
        : [...prev.skills, skill]
    }));
  };

  const handleGoogleSignUp = () => {
    toast.info("Google Sign-Up will be available soon!");
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[700px] p-0 gap-0 overflow-hidden max-h-[90vh]">
        <DialogHeader className="sr-only">
          <DialogTitle>Apply to Infera AI</DialogTitle>
          <DialogDescription>
            Join our community of experts and start earning today. Complete the application form to get started.
          </DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.3 }}
          className="flex flex-col h-full"
        >
          {/* Header */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-3">
                <Logo variant="white" size="sm" animated={false} />
              </div>
              <h2 className="text-xl text-center mb-1">Join Infera AI</h2>
              <p className="text-blue-100 text-center text-sm mb-4">
                Start your journey as an AI expert
              </p>

              {/* Progress Bar */}
              <div className="space-y-2">
                <div className="flex justify-between text-xs text-blue-100">
                  <span>Step {currentStep} of {totalSteps}</span>
                  <span>{Math.round(progress)}% Complete</span>
                </div>
                <Progress value={progress} className="h-2 bg-white/20" />
              </div>

              {/* Step Indicators */}
              <div className="flex justify-between mt-4">
                {steps.map((step) => (
                  <div
                    key={step.number}
                    className={`flex flex-col items-center gap-1 ${
                      step.number <= currentStep ? "opacity-100" : "opacity-40"
                    }`}
                  >
                    <div
                      className={`h-8 w-8 rounded-full flex items-center justify-center border-2 transition-all ${
                        step.number === currentStep
                          ? "bg-white text-blue-600 border-white scale-110"
                          : step.number < currentStep
                          ? "bg-white/20 border-white text-white"
                          : "bg-transparent border-white/50 text-white"
                      }`}
                    >
                      {step.number < currentStep ? (
                        <CheckCircle className="h-4 w-4" />
                      ) : (
                        <step.icon className="h-4 w-4" />
                      )}
                    </div>
                    <span className="text-xs hidden sm:block">{step.title}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Form Content */}
          <div className="flex-1 overflow-y-auto">
            <form onSubmit={handleSubmit} onKeyDown={handleKeyDown} className="p-6">
              <AnimatePresence mode="wait">
                <motion.div
                  key={currentStep}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  transition={{ duration: 0.3 }}
                  className="space-y-5"
                >
                  {/* Step 1: Basic Info */}
                  {currentStep === 1 && (
                    <>
                      <div className="bg-blue-50 border-l-4 border-blue-500 p-4 rounded-r-lg mb-4">
                        <h3 className="text-lg text-gray-900 mb-1 flex items-center gap-2">
                          <User className="h-5 w-5 text-blue-600" />
                          Basic Information
                        </h3>
                        <p className="text-sm text-gray-600">Let's start with your contact details. Fields marked with * are required.</p>
                      </div>

                      <div className="grid grid-cols-2 gap-4">
                        <div className="space-y-2">
                          <Label htmlFor="firstName">First Name *</Label>
                          <Input
                            id="firstName"
                            placeholder="John"
                            value={formData.firstName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, firstName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                        <div className="space-y-2">
                          <Label htmlFor="lastName">Last Name *</Label>
                          <Input
                            id="lastName"
                            placeholder="Doe"
                            value={formData.lastName}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, lastName: e.target.value })}
                            className="h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="email">Email Address *</Label>
                        <div className="relative">
                          <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                          <Input
                            id="email"
                            type="email"
                            placeholder="you@example.com"
                            value={formData.email}
                            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, email: e.target.value })}
                            className="pl-10 h-11"
                          />
                        </div>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="phone">Phone Number</Label>
                        <Input
                          id="phone"
                          type="tel"
                          placeholder="+1 (555) 000-0000"
                          value={formData.phone}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, phone: e.target.value })}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="country">Country *</Label>
                        <Select
                          value={formData.country}
                          onValueChange={(value: string) => setFormData({ ...formData, country: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select your country" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="us">United States</SelectItem>
                            <SelectItem value="uk">United Kingdom</SelectItem>
                            <SelectItem value="ca">Canada</SelectItem>
                            <SelectItem value="au">Australia</SelectItem>
                            <SelectItem value="de">Germany</SelectItem>
                            <SelectItem value="fr">France</SelectItem>
                            <SelectItem value="in">India</SelectItem>
                            <SelectItem value="other">Other</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <Separator />

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <p className="text-sm text-blue-900 mb-3">Or sign up with:</p>
                        <Button
                          type="button"
                          variant="outline"
                          className="w-full h-11"
                          onClick={handleGoogleSignUp}
                        >
                          <svg className="w-5 h-5 mr-2" viewBox="0 0 24 24">
                            <path
                              fill="#4285F4"
                              d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                            />
                            <path
                              fill="#34A853"
                              d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                            />
                            <path
                              fill="#FBBC05"
                              d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                            />
                            <path
                              fill="#EA4335"
                              d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                            />
                          </svg>
                          Continue with Google
                        </Button>
                      </div>
                    </>
                  )}

                  {/* Step 2: Professional Background */}
                  {currentStep === 2 && (
                    <>
                      <div className="bg-purple-50 border-l-4 border-purple-500 p-4 rounded-r-lg mb-4">
                        <h3 className="text-lg text-gray-900 mb-1 flex items-center gap-2">
                          <Briefcase className="h-5 w-5 text-purple-600" />
                          Professional Background
                        </h3>
                        <p className="text-sm text-gray-600">Tell us about your expertise and experience</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="expertise">Primary Area of Expertise *</Label>
                        <Select
                          value={formData.expertise}
                          onValueChange={(value: string) => setFormData({ ...formData, expertise: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select your expertise" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="software-engineering">Software Engineering</SelectItem>
                            <SelectItem value="data-science">Data Science & Analytics</SelectItem>
                            <SelectItem value="ai-ml">AI & Machine Learning</SelectItem>
                            <SelectItem value="nlp">Natural Language Processing</SelectItem>
                            <SelectItem value="computer-vision">Computer Vision</SelectItem>
                            <SelectItem value="writing">Content Writing & Editing</SelectItem>
                            <SelectItem value="math-science">Mathematics & Science</SelectItem>
                            <SelectItem value="creative">Creative & Design</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="experience">Years of Professional Experience *</Label>
                        <Select
                          value={formData.experience}
                          onValueChange={(value: string) => setFormData({ ...formData, experience: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select experience level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="0-1">Less than 1 year</SelectItem>
                            <SelectItem value="1-2">1-2 years</SelectItem>
                            <SelectItem value="3-5">3-5 years</SelectItem>
                            <SelectItem value="6-10">6-10 years</SelectItem>
                            <SelectItem value="10+">10+ years</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="education">Highest Level of Education *</Label>
                        <Select
                          value={formData.education}
                          onValueChange={(value: string) => setFormData({ ...formData, education: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select education level" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="high-school">High School</SelectItem>
                            <SelectItem value="associate">Associate Degree</SelectItem>
                            <SelectItem value="bachelor">Bachelor's Degree</SelectItem>
                            <SelectItem value="master">Master's Degree</SelectItem>
                            <SelectItem value="phd">Ph.D. or Doctorate</SelectItem>
                            <SelectItem value="bootcamp">Coding Bootcamp/Certification</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="currentRole">Current Role/Title</Label>
                        <Input
                          id="currentRole"
                          placeholder="e.g., Senior Data Scientist"
                          value={formData.currentRole}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, currentRole: e.target.value })}
                          className="h-11"
                        />
                      </div>
                    </>
                  )}

                  {/* Step 3: Skills & Availability */}
                  {currentStep === 3 && (
                    <>
                      <div className="bg-green-50 border-l-4 border-green-500 p-4 rounded-r-lg mb-4">
                        <h3 className="text-lg text-gray-900 mb-1 flex items-center gap-2">
                          <GraduationCap className="h-5 w-5 text-green-600" />
                          Skills & Availability
                        </h3>
                        <p className="text-sm text-gray-600">Select your skills and preferred schedule</p>
                      </div>

                      <div className="space-y-2">
                        <Label>Technical Skills * (Select all that apply)</Label>
                        <div className="flex flex-wrap gap-2 p-4 border rounded-lg bg-gray-50">
                          {availableSkills.map((skill) => (
                            <Badge
                              key={skill}
                              variant={formData.skills.includes(skill) ? "default" : "outline"}
                              className={`cursor-pointer transition-all ${
                                formData.skills.includes(skill)
                                  ? "bg-blue-600 hover:bg-blue-700"
                                  : "hover:bg-gray-100"
                              }`}
                              onClick={() => toggleSkill(skill)}
                            >
                              {formData.skills.includes(skill) && (
                                <CheckCircle className="h-3 w-3 mr-1" />
                              )}
                              {skill}
                            </Badge>
                          ))}
                        </div>
                        <p className="text-xs text-gray-500">{formData.skills.length} skills selected</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="availability">When can you start? *</Label>
                        <Select
                          value={formData.availability}
                          onValueChange={(value: string) => setFormData({ ...formData, availability: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select availability" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="immediately">Immediately</SelectItem>
                            <SelectItem value="1-week">Within 1 week</SelectItem>
                            <SelectItem value="2-weeks">Within 2 weeks</SelectItem>
                            <SelectItem value="1-month">Within 1 month</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="hoursPerWeek">Hours Available Per Week *</Label>
                        <Select
                          value={formData.hoursPerWeek}
                          onValueChange={(value: string) => setFormData({ ...formData, hoursPerWeek: value })}
                        >
                          <SelectTrigger className="h-11">
                            <SelectValue placeholder="Select hours per week" />
                          </SelectTrigger>
                          <SelectContent>
                            <SelectItem value="5-10">5-10 hours</SelectItem>
                            <SelectItem value="10-20">10-20 hours</SelectItem>
                            <SelectItem value="20-30">20-30 hours</SelectItem>
                            <SelectItem value="30-40">30-40 hours</SelectItem>
                            <SelectItem value="40+">40+ hours (Full-time)</SelectItem>
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
                        <div className="flex gap-3">
                          <Clock className="h-5 w-5 text-blue-600 flex-shrink-0 mt-0.5" />
                          <div>
                            <p className="text-sm text-blue-900 mb-1">Flexible Work Schedule</p>
                            <p className="text-xs text-blue-700">
                              Work on your own schedule. Most experts complete 10-20 hours per week.
                            </p>
                          </div>
                        </div>
                      </div>
                    </>
                  )}

                  {/* Step 4: Final Details */}
                  {currentStep === 4 && (
                    <>
                      <div className="bg-orange-50 border-l-4 border-orange-500 p-4 rounded-r-lg mb-4">
                        <h3 className="text-lg text-gray-900 mb-1 flex items-center gap-2">
                          <FileText className="h-5 w-5 text-orange-600" />
                          Final Details
                        </h3>
                        <p className="text-sm text-gray-600">Tell us more about yourself and review your application</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="bio">
                          Why do you want to join Infera AI? * (Min 50 characters)
                        </Label>
                        <Textarea
                          id="bio"
                          placeholder="Share your motivation, relevant experience, and what makes you a great fit for AI training projects..."
                          rows={5}
                          value={formData.bio}
                          onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => setFormData({ ...formData, bio: e.target.value })}
                          className="resize-none"
                        />
                        <p className="text-xs text-gray-500">{formData.bio.length} characters</p>
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="linkedIn">LinkedIn Profile (Optional)</Label>
                        <Input
                          id="linkedIn"
                          type="url"
                          placeholder="https://linkedin.com/in/yourprofile"
                          value={formData.linkedIn}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, linkedIn: e.target.value })}
                          className="h-11"
                        />
                      </div>

                      <div className="space-y-2">
                        <Label htmlFor="portfolio">Portfolio/Website (Optional)</Label>
                        <Input
                          id="portfolio"
                          type="url"
                          placeholder="https://yourportfolio.com"
                          value={formData.portfolio}
                          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setFormData({ ...formData, portfolio: e.target.value })}
                          className="h-11"
                        />
                      </div>

                      <Separator />

                      <div className="space-y-4">
                        <div className="flex items-start gap-3">
                          <Checkbox
                            id="terms"
                            checked={formData.agreeToTerms}
                            onCheckedChange={(checked: boolean) =>
                              setFormData({ ...formData, agreeToTerms: checked })
                            }
                            className="mt-1"
                          />
                          <label htmlFor="terms" className="text-sm text-gray-700 leading-relaxed">
                            I agree to the{" "}
                            <button type="button" className="text-blue-600 hover:underline">
                              Terms of Service
                            </button>{" "}
                            and{" "}
                            <button type="button" className="text-blue-600 hover:underline">
                              Privacy Policy
                            </button>
                            . I understand that I will be working as an independent contractor. *
                          </label>
                        </div>
                      </div>

                      <div className="grid grid-cols-3 gap-4 p-4 bg-gradient-to-r from-blue-50 to-purple-50 rounded-lg border border-blue-200">
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <Globe className="h-6 w-6 text-blue-600" />
                          </div>
                          <p className="text-xs text-gray-600">Global Opportunities</p>
                        </div>
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <Award className="h-6 w-6 text-purple-600" />
                          </div>
                          <p className="text-xs text-gray-600">Competitive Pay</p>
                        </div>
                        <div className="text-center">
                          <div className="flex justify-center mb-2">
                            <Sparkles className="h-6 w-6 text-pink-600" />
                          </div>
                          <p className="text-xs text-gray-600">Flexible Schedule</p>
                        </div>
                      </div>
                    </>
                  )}
                </motion.div>
              </AnimatePresence>
            </form>
          </div>

          {/* Footer Navigation */}
          <div className="border-t bg-gradient-to-r from-blue-50 to-purple-50 p-6">
            {/* Progress hint */}
            <div className="text-center mb-4">
              <div className="bg-white rounded-lg p-2 mb-2 inline-block">
                <p className="text-xs text-gray-500">
                  Currently on: <span className="font-semibold text-blue-600">Step {currentStep} of {totalSteps}</span>
                </p>
              </div>
              <p className="text-xs text-gray-600">
                {currentStep < totalSteps ? (
                  <>Fill in the required fields and click <span className="font-semibold text-blue-600">Continue</span> to proceed</>
                ) : (
                  <>Review your information and click <span className="font-semibold text-green-600">Submit</span> to apply</>
                )}
              </p>
              
              {/* Debug Test Button */}
              <div className="mt-2">
                <Button
                  type="button"
                  size="sm"
                  variant="outline"
                  onClick={() => {
                    console.log('TEST: Direct step increment');
                    console.log('Current step before:', currentStep);
                    setCurrentStep(prev => {
                      const newStep = prev + 1;
                      console.log('New step:', newStep);
                      return newStep;
                    });
                  }}
                  className="text-xs h-6 px-2"
                >
                  [TEST] Skip to Next Step
                </Button>
              </div>
            </div>

            <div className="flex items-center justify-between gap-4">
              {currentStep > 1 ? (
                <Button
                  type="button"
                  variant="outline"
                  onClick={handleBack}
                  disabled={isSubmitting}
                  className="flex-1 h-12 border-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              ) : (
                <div className="flex-1"></div>
              )}

              {currentStep < totalSteps ? (
                <Button
                  type="button"
                  onClick={() => {
                    console.log('Continue button clicked!');
                    handleNext();
                  }}
                  className="flex-1 h-14 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg hover:shadow-xl transition-all group text-white border-0 text-base"
                >
                  <span className="mr-2">Continue to Step {currentStep + 1}</span>
                  <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                </Button>
              ) : (
                <Button
                  type="button"
                  onClick={handleSubmit}
                  disabled={isSubmitting}
                  className="flex-1 h-12 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 shadow-lg hover:shadow-xl transition-all group text-white border-0"
                >
                  {isSubmitting ? (
                    <>
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-4 w-4 border-2 border-white border-t-transparent rounded-full mr-2"
                      />
                      Submitting...
                    </>
                  ) : (
                    <>
                      <span className="mr-2">Submit Application</span>
                      <CheckCircle className="h-5 w-5 group-hover:scale-110 transition-transform" />
                    </>
                  )}
                </Button>
              )}
            </div>

            <p className="text-center text-xs text-gray-500 mt-4">
              Already have an account?{" "}
              <button
                type="button"
                className="text-blue-600 hover:underline"
                onClick={() => {
                  onOpenChange(false);
                  if (onSwitchToSignIn) {
                    setTimeout(() => onSwitchToSignIn(), 300);
                  }
                }}
              >
                Sign in here
              </button>
            </p>
          </div>
        </motion.div>
      </DialogContent>
    </Dialog>
  );
}
