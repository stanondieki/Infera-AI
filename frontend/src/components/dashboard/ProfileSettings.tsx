import { useState, useRef, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback, AvatarImage } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Bell, Eye, Globe, Save, Camera, Upload, X } from 'lucide-react';
import { useAuth } from '../../utils/auth';
import { motion, AnimatePresence } from 'framer-motion';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { TwoFactorDialog } from './TwoFactorDialog';
import { ManageSessionsDialog } from './ManageSessionDialog';
import { LoginHistoryDialog } from './LoginHistoryDialog';
import { updateProfileImage } from '../../utils/profileImage';

export function ProfileSettings() {
  const { user } = useAuth();
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [manageSessionsOpen, setManageSessionsOpen] = useState(false);
  const [loginHistoryOpen, setLoginHistoryOpen] = useState(false);
  const [profileImage, setProfileImage] = useState<string | null>(null);
  const [showImageUpload, setShowImageUpload] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Load profile image from localStorage on mount
  useEffect(() => {
    const savedImage = localStorage.getItem('profileImage');
    if (savedImage) {
      setProfileImage(savedImage);
    }
  }, []);

  // Close image upload popover when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      const target = event.target as HTMLElement;
      if (showImageUpload && !target.closest('.group')) {
        setShowImageUpload(false);
      }
    };

    if (showImageUpload) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [showImageUpload]);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.name || '',
    email: user?.email || '',
    phone: user?.phone || '+1 (555) 123-4567',
    location: user?.location || 'San Francisco, CA',
    bio: user?.bio || 'Passionate AI contributor working on cutting-edge projects.',
    jobTitle: user?.jobTitle || 'AI Training Specialist',
    company: user?.company || 'Infera AI',
    website: user?.website || 'https://inferaai.com',
    timezone: user?.timezone || 'America/Los_Angeles',
    language: user?.language || 'English',
  });

  // Notification preferences
  const [notifications, setNotifications] = useState({
    emailNotifications: true,
    pushNotifications: true,
    taskUpdates: true,
    paymentAlerts: true,
    weeklyReports: true,
    promotionalEmails: false,
    securityAlerts: true,
  });

  // Privacy settings
  const [privacy, setPrivacy] = useState({
    profileVisibility: 'public',
    showEarnings: false,
    showProjects: true,
    allowMessaging: true,
    showOnLeaderboard: true,
  });

  const handleSaveProfile = async () => {
    setIsSaving(true);
    try {
      // Simulate API call
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Profile updated successfully!');
      setIsEditing(false);
    } catch (error) {
      toast.error('Failed to update profile');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancelEdit = () => {
    // Reset to original values
    setProfileData({
      name: user?.name || '',
      email: user?.email || '',
      phone: user?.phone || '+1 (555) 123-4567',
      location: user?.location || 'San Francisco, CA',
      bio: user?.bio || 'Passionate AI contributor working on cutting-edge projects.',
      jobTitle: user?.jobTitle || 'AI Training Specialist',
      company: user?.company || 'Infera AI',
      website: user?.website || 'https://inferaai.com',
      timezone: user?.timezone || 'America/Los_Angeles',
      language: user?.language || 'English',
    });
    setIsEditing(false);
  };

  const handleSaveNotifications = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Notification preferences saved!');
    } catch (error) {
      toast.error('Failed to save preferences');
    }
  };

  const handleSavePrivacy = async () => {
    try {
      await new Promise(resolve => setTimeout(resolve, 500));
      toast.success('Privacy settings saved!');
    } catch (error) {
      toast.error('Failed to save settings');
    }
  };

  const handleImageUpload = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Check file size (max 5MB)
    if (file.size > 5 * 1024 * 1024) {
      toast.error('Image size should be less than 5MB');
      return;
    }

    // Check file type
    if (!file.type.startsWith('image/')) {
      toast.error('Please upload an image file');
      return;
    }

    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      setProfileImage(base64String);
      localStorage.setItem('profileImage', base64String);
      updateProfileImage(base64String); // Notify other components
      toast.success('Profile picture updated!');
      setShowImageUpload(false);
    };
    reader.onerror = () => {
      toast.error('Failed to upload image');
    };
    reader.readAsDataURL(file);
  };

  const handleRemoveImage = () => {
    setProfileImage(null);
    localStorage.removeItem('profileImage');
    updateProfileImage(null); // Notify other components
    toast.success('Profile picture removed');
    setShowImageUpload(false);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  const handleCameraClick = () => {
    setShowImageUpload(!showImageUpload);
  };

  return (
    <div className="space-y-4 md:space-y-6 pb-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-4 md:p-8">
            <div className="flex flex-col md:flex-row items-start gap-4 md:gap-6">
              <div className="relative mx-auto md:mx-0 group">
                <Avatar className="h-20 w-20 md:h-24 md:w-24 ring-4 ring-blue-500/20 shadow-lg">
                  {profileImage && <AvatarImage src={profileImage} alt={profileData.name} />}
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-xl md:text-2xl">
                    {profileData.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg hover:scale-110 transition-transform"
                  onClick={handleCameraClick}
                >
                  <Camera className="h-4 w-4" />
                </Button>
                
                {/* Image Upload Popover */}
                <AnimatePresence>
                  {showImageUpload && (
                    <motion.div
                      initial={{ opacity: 0, scale: 0.95, y: -10 }}
                      animate={{ opacity: 1, scale: 1, y: 0 }}
                      exit={{ opacity: 0, scale: 0.95, y: -10 }}
                      transition={{ duration: 0.2 }}
                      className="absolute top-full left-1/2 -translate-x-1/2 mt-2 w-64 bg-white rounded-lg shadow-xl border border-gray-200 p-4 z-50"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between">
                          <h4 className="text-sm text-gray-900">Profile Picture</h4>
                          <Button
                            size="icon"
                            variant="ghost"
                            className="h-6 w-6"
                            onClick={() => setShowImageUpload(false)}
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        </div>
                        
                        <input
                          type="file"
                          ref={fileInputRef}
                          onChange={handleImageUpload}
                          accept="image/*"
                          className="hidden"
                          id="profile-image-upload"
                        />
                        
                        <Button
                          variant="outline"
                          className="w-full gap-2 text-sm"
                          onClick={() => fileInputRef.current?.click()}
                        >
                          <Upload className="h-4 w-4" />
                          Upload Photo
                        </Button>
                        
                        {profileImage && (
                          <Button
                            variant="outline"
                            className="w-full gap-2 text-sm text-red-600 hover:text-red-700 hover:bg-red-50"
                            onClick={handleRemoveImage}
                          >
                            <X className="h-4 w-4" />
                            Remove Photo
                          </Button>
                        )}
                        
                        <p className="text-xs text-gray-500 text-center">
                          JPG, PNG or GIF (Max 5MB)
                        </p>
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
              
              <div className="flex-grow w-full">
                <div className="flex flex-col md:flex-row items-start md:justify-between gap-3 md:gap-0">
                  <div className="text-center md:text-left w-full md:w-auto">
                    <h2 className="text-xl md:text-2xl text-gray-900">{profileData.name}</h2>
                    <p className="text-sm md:text-base text-gray-600">{profileData.jobTitle}</p>
                    <div className="flex items-center justify-center md:justify-start gap-2 mt-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white text-xs">
                        Premium Member
                      </Badge>
                      <Badge variant="outline" className="gap-1 text-xs">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2 w-full md:w-auto mt-3 md:mt-0" size="sm">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2 w-full md:w-auto mt-3 md:mt-0">
                      <Button variant="outline" onClick={handleCancelEdit} className="flex-1 md:flex-none" size="sm">
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2 flex-1 md:flex-none" size="sm">
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save'}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-3 md:gap-4 mt-4 md:mt-6 pt-4 md:pt-6 border-t border-gray-200">
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-600">Total Earnings</p>
                    <p className="text-base md:text-lg text-gray-900">
                      {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                        ? `$${user?.totalEarnings || 4940}` 
                        : `$${user?.totalEarnings || 12450}`}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-600">Tasks Completed</p>
                    <p className="text-base md:text-lg text-gray-900">
                      {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                        ? user?.completedTasks || 47 
                        : user?.completedTasks || 740}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-600">Success Rate</p>
                    <p className="text-base md:text-lg text-gray-900">
                      {user?.email === 'william.macy@email.com' || user?.email === 'william.macy.ai@gmail.com' 
                        ? '94%' 
                        : '98.5%'}
                    </p>
                  </div>
                  <div className="text-center md:text-left">
                    <p className="text-xs text-gray-600">Member Since</p>
                    <p className="text-base md:text-lg text-gray-900">
                      {user?.joinedDate 
                        ? new Date(user.joinedDate).getFullYear().toString()
                        : '2025'}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Personal Information */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.1 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <User className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription className="text-sm">Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 md:gap-6">
              <div className="space-y-2">
                <Label htmlFor="name">Full Name *</Label>
                <div className="relative">
                  <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="name"
                    value={profileData.name}
                    onChange={(e) => setProfileData({ ...profileData, name: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Enter your full name"
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
                    value={profileData.email}
                    onChange={(e) => setProfileData({ ...profileData, email: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="your.email@example.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="phone">Phone Number</Label>
                <div className="relative">
                  <Phone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="phone"
                    value={profileData.phone}
                    onChange={(e) => setProfileData({ ...profileData, phone: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="+1 (555) 123-4567"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="location">Location</Label>
                <div className="relative">
                  <MapPin className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="location"
                    value={profileData.location}
                    onChange={(e) => setProfileData({ ...profileData, location: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="City, Country"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="jobTitle">Job Title</Label>
                <div className="relative">
                  <Briefcase className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="jobTitle"
                    value={profileData.jobTitle}
                    onChange={(e) => setProfileData({ ...profileData, jobTitle: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="Your job title"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="company">Company</Label>
                <Input
                  id="company"
                  value={profileData.company}
                  onChange={(e) => setProfileData({ ...profileData, company: e.target.value })}
                  disabled={!isEditing}
                  placeholder="Company name"
                />
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="website">Website</Label>
                <div className="relative">
                  <Globe className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                  <Input
                    id="website"
                    value={profileData.website}
                    onChange={(e) => setProfileData({ ...profileData, website: e.target.value })}
                    disabled={!isEditing}
                    className="pl-10"
                    placeholder="https://yourwebsite.com"
                  />
                </div>
              </div>
              
              <div className="space-y-2">
                <Label htmlFor="timezone">Timezone</Label>
                <Select
                  value={profileData.timezone}
                  onValueChange={(value) => setProfileData({ ...profileData, timezone: value })}
                  disabled={!isEditing}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="America/Los_Angeles">Pacific Time (PT)</SelectItem>
                    <SelectItem value="America/Denver">Mountain Time (MT)</SelectItem>
                    <SelectItem value="America/Chicago">Central Time (CT)</SelectItem>
                    <SelectItem value="America/New_York">Eastern Time (ET)</SelectItem>
                    <SelectItem value="Europe/London">London (GMT)</SelectItem>
                    <SelectItem value="Europe/Paris">Paris (CET)</SelectItem>
                    <SelectItem value="Asia/Tokyo">Tokyo (JST)</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            
            <div className="space-y-2">
              <Label htmlFor="bio">Bio</Label>
              <Textarea
                id="bio"
                value={profileData.bio}
                onChange={(e) => setProfileData({ ...profileData, bio: e.target.value })}
                disabled={!isEditing}
                rows={4}
                placeholder="Tell us about yourself..."
                className="resize-none"
              />
              <p className="text-xs text-gray-500">{profileData.bio.length} / 500 characters</p>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Notification Preferences */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.2 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Bell className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription className="text-sm">Manage how you receive notifications and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Email Notifications</Label>
                  <p className="text-xs md:text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Push Notifications</Label>
                  <p className="text-xs md:text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNotifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Task Updates</Label>
                  <p className="text-xs md:text-sm text-gray-500">Notifications about task status changes</p>
                </div>
                <Switch
                  checked={notifications.taskUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, taskUpdates: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Payment Alerts</Label>
                  <p className="text-xs md:text-sm text-gray-500">Get notified when payments are processed</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, paymentAlerts: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Weekly Reports</Label>
                  <p className="text-xs md:text-sm text-gray-500">Receive weekly performance summaries</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Promotional Emails</Label>
                  <p className="text-xs md:text-sm text-gray-500">News, tips, and special offers</p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, promotionalEmails: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Security Alerts</Label>
                  <p className="text-xs md:text-sm text-gray-500">Important security and account updates</p>
                </div>
                <Switch
                  checked={notifications.securityAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, securityAlerts: checked })
                  }
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSaveNotifications} className="gap-2 w-full md:w-auto" size="sm">
                <Save className="h-4 w-4" />
                Save Preferences
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Privacy Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.3 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Eye className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription className="text-sm">Control who can see your profile and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility" className="text-sm md:text-base">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                >
                  <SelectTrigger className="text-sm md:text-base">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public" className="text-sm md:text-base">Public - Anyone can view</SelectItem>
                    <SelectItem value="members" className="text-sm md:text-base">Members Only - Only Infera AI members</SelectItem>
                    <SelectItem value="private" className="text-sm md:text-base">Private - Only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Show Earnings</Label>
                  <p className="text-xs md:text-sm text-gray-500">Display your earnings on your public profile</p>
                </div>
                <Switch
                  checked={privacy.showEarnings}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showEarnings: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Show Projects</Label>
                  <p className="text-xs md:text-sm text-gray-500">Let others see your completed projects</p>
                </div>
                <Switch
                  checked={privacy.showProjects}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showProjects: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Allow Messaging</Label>
                  <p className="text-xs md:text-sm text-gray-500">Let other members send you messages</p>
                </div>
                <Switch
                  checked={privacy.allowMessaging}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowMessaging: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-3 md:p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5 flex-1 mr-3">
                  <Label className="text-sm md:text-base">Show on Leaderboard</Label>
                  <p className="text-xs md:text-sm text-gray-500">Appear in public rankings and competitions</p>
                </div>
                <Switch
                  checked={privacy.showOnLeaderboard}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showOnLeaderboard: checked })
                  }
                />
              </div>
            </div>
            
            <div className="flex justify-end">
              <Button onClick={handleSavePrivacy} className="gap-2 w-full md:w-auto" size="sm">
                <Save className="h-4 w-4" />
                Save Settings
              </Button>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Security Settings */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.4 }}
      >
        <Card className="shadow-xl">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="flex items-center gap-2 text-lg md:text-xl">
              <Shield className="h-4 w-4 md:h-5 md:w-5 text-blue-600" />
              Security
            </CardTitle>
            <CardDescription className="text-sm">Manage your account security and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4 md:space-y-6 p-4 md:p-6">
            <div className="space-y-3 md:space-y-4">
              <div className="p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base">Password</Label>
                    <p className="text-xs md:text-sm text-gray-500">Last changed 45 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen(true)} className="w-full md:w-auto text-xs md:text-sm">
                    Change Password
                  </Button>
                </div>
              </div>
              
              <div className="p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base">Two-Factor Authentication</Label>
                    <p className="text-xs md:text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setTwoFactorOpen(true)} className="w-full md:w-auto text-xs md:text-sm">
                    Enable 2FA
                  </Button>
                </div>
              </div>
              
              <div className="p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base">Active Sessions</Label>
                    <p className="text-xs md:text-sm text-gray-500">2 devices currently signed in</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setManageSessionsOpen(true)} className="w-full md:w-auto text-xs md:text-sm">
                    Manage Sessions
                  </Button>
                </div>
              </div>
              
              <div className="p-3 md:p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                  <div className="space-y-1">
                    <Label className="text-sm md:text-base">Login History</Label>
                    <p className="text-xs md:text-sm text-gray-500">View your recent login activity</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLoginHistoryOpen(true)} className="w-full md:w-auto text-xs md:text-sm">
                    View History
                  </Button>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Danger Zone */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4, delay: 0.5 }}
      >
        <Card className="shadow-xl border-red-200">
          <CardHeader className="p-4 md:p-6">
            <CardTitle className="text-red-600 text-lg md:text-xl">Danger Zone</CardTitle>
            <CardDescription className="text-sm">Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3 md:space-y-4 p-4 md:p-6">
            <div className="p-3 md:p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-3">
                <div className="space-y-1">
                  <Label className="text-sm md:text-base text-red-900">Delete Account</Label>
                  <p className="text-xs md:text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm" className="w-full md:w-auto text-xs md:text-sm">
                  Delete Account
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </motion.div>

      {/* Dialogs */}
      <ChangePasswordDialog open={changePasswordOpen} onOpenChange={setChangePasswordOpen} />
      <TwoFactorDialog open={twoFactorOpen} onOpenChange={setTwoFactorOpen} />
      <ManageSessionsDialog open={manageSessionsOpen} onOpenChange={setManageSessionsOpen} />
      <LoginHistoryDialog open={loginHistoryOpen} onOpenChange={setLoginHistoryOpen} />
    </div>
  );
}
