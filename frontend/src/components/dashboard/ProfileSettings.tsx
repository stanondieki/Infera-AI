import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '../ui/card';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Label } from '../ui/label';
import { Textarea } from '../ui/textarea';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Badge } from '../ui/badge';
import { Separator } from '../ui/separator';
import { Switch } from '../ui/switch';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '../ui/select';
import { toast } from 'sonner';
import { User, Mail, Phone, MapPin, Briefcase, Calendar, Shield, Bell, Eye, Globe, Save, Camera } from 'lucide-react';
import { useAuth } from '../../utils/auth';
import { motion } from 'framer-motion';
import { ChangePasswordDialog } from './ChangePasswordDialog';
import { TwoFactorDialog } from './TwoFactorDialog';
import { ManageSessionsDialog } from './ManageSessionDialog';
import { LoginHistoryDialog } from './LoginHistoryDialog';

// Extend the User type to include user_metadata
interface ExtendedUser {
  email?: string;
  name?: string;
  user_metadata?: {
    name?: string;
    phone?: string;
    location?: string;
    bio?: string;
    jobTitle?: string;
    company?: string;
    website?: string;
    timezone?: string;
    language?: string;
  };
}

export function ProfileSettings() {
  const { user: authUser } = useAuth();
  const user = authUser as ExtendedUser;
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [changePasswordOpen, setChangePasswordOpen] = useState(false);
  const [twoFactorOpen, setTwoFactorOpen] = useState(false);
  const [manageSessionsOpen, setManageSessionsOpen] = useState(false);
  const [loginHistoryOpen, setLoginHistoryOpen] = useState(false);
  
  // Profile form state
  const [profileData, setProfileData] = useState({
    name: user?.user_metadata?.name || user?.name || '',
    email: user?.email || '',
    phone: user?.user_metadata?.phone || '+1 (555) 123-4567',
    location: user?.user_metadata?.location || 'San Francisco, CA',
    bio: user?.user_metadata?.bio || 'Passionate AI contributor working on cutting-edge projects.',
    jobTitle: user?.user_metadata?.jobTitle || 'AI Training Specialist',
    company: user?.user_metadata?.company || 'Infera AI',
    website: user?.user_metadata?.website || 'https://inferaai.com',
    timezone: user?.user_metadata?.timezone || 'America/Los_Angeles',
    language: user?.user_metadata?.language || 'English',
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
      name: user?.user_metadata?.name || user?.name || '',
      email: user?.email || '',
      phone: user?.user_metadata?.phone || '+1 (555) 123-4567',
      location: user?.user_metadata?.location || 'San Francisco, CA',
      bio: user?.user_metadata?.bio || 'Passionate AI contributor working on cutting-edge projects.',
      jobTitle: user?.user_metadata?.jobTitle || 'AI Training Specialist',
      company: user?.user_metadata?.company || 'Infera AI',
      website: user?.user_metadata?.website || 'https://inferaai.com',
      timezone: user?.user_metadata?.timezone || 'America/Los_Angeles',
      language: user?.user_metadata?.language || 'English',
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

  return (
    <div className="space-y-6">
      {/* Profile Header */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.4 }}
      >
        <Card className="shadow-xl bg-gradient-to-br from-blue-50 to-purple-50 border-blue-200">
          <CardContent className="p-8">
            <div className="flex items-start gap-6">
              <div className="relative">
                <Avatar className="h-24 w-24 ring-4 ring-blue-500/20 shadow-lg">
                  <AvatarFallback className="bg-gradient-to-br from-blue-600 to-purple-600 text-white text-2xl">
                    {profileData.name?.charAt(0).toUpperCase() || 'U'}
                  </AvatarFallback>
                </Avatar>
                <Button
                  size="icon"
                  variant="secondary"
                  className="absolute -bottom-2 -right-2 h-8 w-8 rounded-full shadow-lg"
                >
                  <Camera className="h-4 w-4" />
                </Button>
              </div>
              
              <div className="flex-grow">
                <div className="flex items-start justify-between">
                  <div>
                    <h2 className="text-2xl text-gray-900">{profileData.name}</h2>
                    <p className="text-gray-600">{profileData.jobTitle}</p>
                    <div className="flex items-center gap-2 mt-2">
                      <Badge className="bg-gradient-to-r from-purple-600 to-pink-600 text-white">
                        Premium Member
                      </Badge>
                      <Badge variant="outline" className="gap-1">
                        <Shield className="h-3 w-3" />
                        Verified
                      </Badge>
                    </div>
                  </div>
                  
                  {!isEditing ? (
                    <Button onClick={() => setIsEditing(true)} className="gap-2">
                      <User className="h-4 w-4" />
                      Edit Profile
                    </Button>
                  ) : (
                    <div className="flex gap-2">
                      <Button variant="outline" onClick={handleCancelEdit}>
                        Cancel
                      </Button>
                      <Button onClick={handleSaveProfile} disabled={isSaving} className="gap-2">
                        <Save className="h-4 w-4" />
                        {isSaving ? 'Saving...' : 'Save Changes'}
                      </Button>
                    </div>
                  )}
                </div>
                
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mt-6 pt-6 border-t border-gray-200">
                  <div>
                    <p className="text-xs text-gray-600">Total Earnings</p>
                    <p className="text-lg text-gray-900">$12,450</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Tasks Completed</p>
                    <p className="text-lg text-gray-900">740</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Success Rate</p>
                    <p className="text-lg text-gray-900">98.5%</p>
                  </div>
                  <div>
                    <p className="text-xs text-gray-600">Member Since</p>
                    <p className="text-lg text-gray-900">Jan 2024</p>
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-blue-600" />
              Personal Information
            </CardTitle>
            <CardDescription>Update your personal details and contact information</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="grid md:grid-cols-2 gap-6">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Bell className="h-5 w-5 text-blue-600" />
              Notification Preferences
            </CardTitle>
            <CardDescription>Manage how you receive notifications and updates</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Email Notifications</Label>
                  <p className="text-sm text-gray-500">Receive updates via email</p>
                </div>
                <Switch
                  checked={notifications.emailNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, emailNotifications: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Push Notifications</Label>
                  <p className="text-sm text-gray-500">Receive push notifications in your browser</p>
                </div>
                <Switch
                  checked={notifications.pushNotifications}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, pushNotifications: checked })
                  }
                />
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Task Updates</Label>
                  <p className="text-sm text-gray-500">Notifications about task status changes</p>
                </div>
                <Switch
                  checked={notifications.taskUpdates}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, taskUpdates: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Payment Alerts</Label>
                  <p className="text-sm text-gray-500">Get notified when payments are processed</p>
                </div>
                <Switch
                  checked={notifications.paymentAlerts}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, paymentAlerts: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Weekly Reports</Label>
                  <p className="text-sm text-gray-500">Receive weekly performance summaries</p>
                </div>
                <Switch
                  checked={notifications.weeklyReports}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, weeklyReports: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Promotional Emails</Label>
                  <p className="text-sm text-gray-500">News, tips, and special offers</p>
                </div>
                <Switch
                  checked={notifications.promotionalEmails}
                  onCheckedChange={(checked) =>
                    setNotifications({ ...notifications, promotionalEmails: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Security Alerts</Label>
                  <p className="text-sm text-gray-500">Important security and account updates</p>
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
              <Button onClick={handleSaveNotifications} className="gap-2">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5 text-blue-600" />
              Privacy & Visibility
            </CardTitle>
            <CardDescription>Control who can see your profile and activity</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="profileVisibility">Profile Visibility</Label>
                <Select
                  value={privacy.profileVisibility}
                  onValueChange={(value) => setPrivacy({ ...privacy, profileVisibility: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="public">Public - Anyone can view</SelectItem>
                    <SelectItem value="members">Members Only - Only Infera AI members</SelectItem>
                    <SelectItem value="private">Private - Only you</SelectItem>
                  </SelectContent>
                </Select>
              </div>
              
              <Separator />
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Earnings</Label>
                  <p className="text-sm text-gray-500">Display your earnings on your public profile</p>
                </div>
                <Switch
                  checked={privacy.showEarnings}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showEarnings: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Show Projects</Label>
                  <p className="text-sm text-gray-500">Let others see your completed projects</p>
                </div>
                <Switch
                  checked={privacy.showProjects}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, showProjects: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Allow Messaging</Label>
                  <p className="text-sm text-gray-500">Let other members send you messages</p>
                </div>
                <Switch
                  checked={privacy.allowMessaging}
                  onCheckedChange={(checked) =>
                    setPrivacy({ ...privacy, allowMessaging: checked })
                  }
                />
              </div>
              
              <div className="flex items-center justify-between p-4 rounded-lg border border-gray-200 hover:bg-gray-50 transition-colors">
                <div className="space-y-0.5">
                  <Label className="text-base">Show on Leaderboard</Label>
                  <p className="text-sm text-gray-500">Appear in public rankings and competitions</p>
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
              <Button onClick={handleSavePrivacy} className="gap-2">
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
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-blue-600" />
              Security
            </CardTitle>
            <CardDescription>Manage your account security and password</CardDescription>
          </CardHeader>
          <CardContent className="space-y-6">
            <div className="space-y-4">
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Password</Label>
                    <p className="text-sm text-gray-500">Last changed 45 days ago</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setChangePasswordOpen(true)}>
                    Change Password
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Two-Factor Authentication</Label>
                    <p className="text-sm text-gray-500">Add an extra layer of security</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setTwoFactorOpen(true)}>
                    Enable 2FA
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Active Sessions</Label>
                    <p className="text-sm text-gray-500">2 devices currently signed in</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setManageSessionsOpen(true)}>
                    Manage Sessions
                  </Button>
                </div>
              </div>
              
              <div className="p-4 rounded-lg border border-gray-200 bg-gray-50">
                <div className="flex items-start justify-between">
                  <div className="space-y-1">
                    <Label className="text-base">Login History</Label>
                    <p className="text-sm text-gray-500">View your recent login activity</p>
                  </div>
                  <Button variant="outline" size="sm" onClick={() => setLoginHistoryOpen(true)}>
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
          <CardHeader>
            <CardTitle className="text-red-600">Danger Zone</CardTitle>
            <CardDescription>Irreversible account actions</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="p-4 rounded-lg border border-red-200 bg-red-50">
              <div className="flex items-start justify-between">
                <div className="space-y-1">
                  <Label className="text-base text-red-900">Delete Account</Label>
                  <p className="text-sm text-red-700">Permanently delete your account and all data</p>
                </div>
                <Button variant="destructive" size="sm">
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
