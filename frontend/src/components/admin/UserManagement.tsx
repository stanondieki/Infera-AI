import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Plus, Search, Edit, Trash2, Key, Mail, DollarSign, UserCheck, UserX, Copy,
  Eye, EyeOff, RefreshCw, Shield, Crown, Activity, TrendingUp, Clock, Zap,
  CheckCircle, AlertCircle, Filter, Download, MoreVertical, Sparkles, Award
} from 'lucide-react';
import { User, createUser, updateUser, deleteUser, generatePassword, resetUserPassword } from '../../utils/users';
import { useAuth } from '../../utils/auth';
import { Button } from '../ui/button';
import { Input } from '../ui/input';
import { Badge } from '../ui/badge';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from '../ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '../ui/dropdown-menu';
import { Card, CardContent } from '../ui/card';
import { Label } from '../ui/label';
import { toast } from 'sonner';
import { Avatar, AvatarFallback } from '../ui/avatar';
import { Progress } from '../ui/progress';
import { Separator } from '../ui/separator';

interface UserManagementProps {
  users: User[];
  onRefresh: () => void;
}

export function UserManagement({ users, onRefresh }: UserManagementProps) {
  const { accessToken } = useAuth();
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<string>('all');
  const [roleFilter, setRoleFilter] = useState<string>('all');
  const [approvalFilter, setApprovalFilter] = useState<string>('all');
  const [showCreateDialog, setShowCreateDialog] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [isEditing, setIsEditing] = useState(false);
  const [generatedPassword, setGeneratedPassword] = useState<string | null>(null);
  const [showPassword, setShowPassword] = useState(false);
  const [customPassword, setCustomPassword] = useState('');
  const [useCustomPassword, setUseCustomPassword] = useState(false);
  const [viewCredentialsUser, setViewCredentialsUser] = useState<User | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    name: '',
    role: 'user' as 'user' | 'admin',
    hourly_rate: '',
    status: 'active' as 'active' | 'inactive' | 'suspended',
    approvalStatus: 'pending' as 'pending' | 'approved' | 'rejected',
  });

  const filteredUsers = users.filter(user => {
    const matchesSearch = 
      user.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      user.email?.toLowerCase().includes(searchTerm.toLowerCase());
    
    const matchesStatus = statusFilter === 'all' || (user.isActive ? 'active' : 'inactive') === statusFilter;
    const matchesRole = roleFilter === 'all' || user.role === roleFilter;
    const matchesApproval = approvalFilter === 'all' || (user.approvalStatus || 'pending') === approvalFilter;
    
    return matchesSearch && matchesStatus && matchesRole && matchesApproval;
  });

  const stats = {
    total: users.length,
    active: users.filter(u => u.isActive).length,
    admins: users.filter(u => u.role === 'admin').length,
    pending: users.filter(u => u.approvalStatus === 'pending' || !u.approvalStatus).length,
    avgEarnings: users.reduce((sum, u) => sum + (u.totalEarnings || 0), 0) / (users.length || 1),
  };

  const handleCreateUser = async () => {
    try {
      const password = useCustomPassword ? customPassword : generatePassword();
      const result = await createUser({
        email: formData.email,
        name: formData.name,
        role: formData.role,
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        password: password,
      }, accessToken || undefined);

      setGeneratedPassword(result.password);
      toast.success('User created successfully!', {
        description: `Password: ${result.password}`,
        duration: 10000,
      });
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to create user', {
        description: error.message,
      });
    }
  };

  const handleUpdateUser = async () => {
    if (!selectedUser) return;

    try {
      await updateUser(selectedUser.id, {
        name: formData.name,
        role: formData.role,
        isActive: formData.status === 'active',
        hourly_rate: formData.hourly_rate ? parseFloat(formData.hourly_rate) : undefined,
        approvalStatus: formData.approvalStatus,
      }, accessToken || undefined);

      toast.success('User updated successfully!');
      onRefresh();
      closeDialogs();
    } catch (error: any) {
      toast.error('Failed to update user', {
        description: error.message,
      });
    }
  };

  const handleDeleteUser = async (user: User) => {
    if (!confirm(`Are you sure you want to delete ${user.name}?`)) return;

    try {
      await deleteUser(user.id, accessToken || undefined);
      toast.success('User deleted successfully!');
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to delete user', {
        description: error.message,
      });
    }
  };

  const handleQuickApprove = async (user: User) => {
    try {
      await updateUser(user.id, { approvalStatus: 'approved' }, accessToken || undefined);
      toast.success(`${user.name} has been approved!`);
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to approve user', {
        description: error.message,
      });
    }
  };

  const handleQuickReject = async (user: User) => {
    if (!confirm(`Are you sure you want to reject ${user.name}?`)) return;
    
    try {
      await updateUser(user.id, { approvalStatus: 'rejected' }, accessToken || undefined);
      toast.success(`${user.name} has been rejected.`);
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to reject user', {
        description: error.message,
      });
    }
  };

  const handleResetPassword = async (user: User) => {
    try {
      const result = await resetUserPassword(user.id, accessToken || undefined);
      toast.success('Password reset successfully!', {
        description: `New password: ${result.password}`,
        duration: 15000,
      });
      // Copy to clipboard automatically
      navigator.clipboard.writeText(result.password);
      onRefresh();
    } catch (error: any) {
      toast.error('Failed to reset password', {
        description: error.message,
      });
    }
  };

  const handleViewCredentials = (user: User) => {
    setViewCredentialsUser(user);
  };

  const closeDialogs = () => {
    setShowCreateDialog(false);
    setIsEditing(false);
    setSelectedUser(null);
    setGeneratedPassword(null);
    setCustomPassword('');
    setUseCustomPassword(false);
    setShowPassword(false);
    resetForm();
  };

  const resetForm = () => {
    setFormData({
      email: '',
      name: '',
      role: 'user',
      hourly_rate: '',
      status: 'active',
      approvalStatus: 'pending',
    });
  };

  const openEditDialog = (user: User) => {
    setSelectedUser(user);
    setFormData({
      email: user.email,
      name: user.name,
      role: user.role,
      hourly_rate: user.hourly_rate?.toString() || '',
      status: user.isActive ? 'active' : 'inactive',
      approvalStatus: user.approvalStatus || 'pending',
    });
    setIsEditing(true);
  };

  const copyPassword = () => {
    if (generatedPassword) {
      navigator.clipboard.writeText(generatedPassword);
      toast.success('Password copied to clipboard!');
    }
  };

  const handleGenerateNewPassword = () => {
    const newPassword = generatePassword();
    setCustomPassword(newPassword);
    toast.success('New password generated!');
  };

  const getStatusConfig = (status: string) => {
    const configs = {
      active: { 
        color: 'bg-green-100 text-green-800 border-green-300',
        gradient: 'from-green-500 to-emerald-500',
        icon: CheckCircle 
      },
      inactive: { 
        color: 'bg-gray-100 text-gray-800 border-gray-300',
        gradient: 'from-gray-500 to-slate-500',
        icon: Clock 
      },
      suspended: { 
        color: 'bg-red-100 text-red-800 border-red-300',
        gradient: 'from-red-500 to-pink-500',
        icon: AlertCircle 
      },
    };
    return configs[status as keyof typeof configs] || configs.inactive;
  };

  const getRoleConfig = (role: string) => {
    return role === 'admin'
      ? { 
          color: 'bg-purple-100 text-purple-800 border-purple-300',
          gradient: 'from-purple-500 to-indigo-500',
          icon: Crown 
        }
      : { 
          color: 'bg-blue-100 text-blue-800 border-blue-300',
          gradient: 'from-blue-500 to-cyan-500',
          icon: UserCheck 
        };
  };

  const getInitials = (name: string) => {
    const names = name.trim().split(' ');
    if (names.length === 1) {
      return names[0].charAt(0).toUpperCase();
    }
    return `${names[0].charAt(0)}${names[names.length - 1].charAt(0)}`.toUpperCase();
  };

  return (
    <div className="space-y-6">
      {/* Stats Overview */}
      <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-blue-500 to-purple-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl" />
              <div className="relative">
                <p className="text-white/80 mb-2">Total Users</p>
                <h3 className="text-white text-3xl mb-1">{stats.total}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <TrendingUp className="h-4 w-4" />
                  <span>Platform-wide</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-green-500 to-emerald-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl" />
              <div className="relative">
                <p className="text-white/80 mb-2">Active Users</p>
                <h3 className="text-white text-3xl mb-1">{stats.active}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Activity className="h-4 w-4" />
                  <span>{((stats.active/stats.total)*100).toFixed(0)}% of total</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-yellow-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl" />
              <div className="relative">
                <p className="text-white/80 mb-2">Pending Approval</p>
                <h3 className="text-white text-3xl mb-1">{stats.pending}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Clock className="h-4 w-4" />
                  <span>Awaiting review</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-purple-500 to-pink-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl" />
              <div className="relative">
                <p className="text-white/80 mb-2">Administrators</p>
                <h3 className="text-white text-3xl mb-1">{stats.admins}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <Crown className="h-4 w-4" />
                  <span>System admins</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.3 }}
        >
          <Card className="border-0 shadow-lg bg-gradient-to-br from-orange-500 to-pink-600 text-white overflow-hidden">
            <CardContent className="p-6 relative">
              <div className="absolute -right-6 -top-6 h-24 w-24 rounded-full bg-white/10 backdrop-blur-xl" />
              <div className="relative">
                <p className="text-white/80 mb-2">Avg Earnings</p>
                <h3 className="text-white text-3xl mb-1">${stats.avgEarnings.toFixed(0)}</h3>
                <div className="flex items-center gap-1 text-sm text-white/80">
                  <DollarSign className="h-4 w-4" />
                  <span>Per user</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </motion.div>
      </div>

      {/* Filters and Actions */}
      <Card className="border-0 shadow-lg">
        <CardContent className="p-6">
          <div className="flex flex-col md:flex-row gap-4">
            <div className="flex-1 relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
              <Input
                placeholder="Search users by name or email..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="pl-10"
              />
            </div>
            <div className="flex gap-2 flex-wrap">
              <Select value={statusFilter} onValueChange={setStatusFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Status</SelectItem>
                  <SelectItem value="active">Active</SelectItem>
                  <SelectItem value="inactive">Inactive</SelectItem>
                  <SelectItem value="suspended">Suspended</SelectItem>
                </SelectContent>
              </Select>

              <Select value={roleFilter} onValueChange={setRoleFilter}>
                <SelectTrigger className="w-40">
                  <SelectValue placeholder="Role" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Roles</SelectItem>
                  <SelectItem value="user">Users</SelectItem>
                  <SelectItem value="admin">Admins</SelectItem>
                </SelectContent>
              </Select>

              <Select value={approvalFilter} onValueChange={setApprovalFilter}>
                <SelectTrigger className="w-44">
                  <SelectValue placeholder="Approval Status" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="all">All Approvals</SelectItem>
                  <SelectItem value="pending">Pending Approval</SelectItem>
                  <SelectItem value="approved">Approved</SelectItem>
                  <SelectItem value="rejected">Rejected</SelectItem>
                </SelectContent>
              </Select>

              <Button 
                onClick={() => setShowCreateDialog(true)} 
                className="gap-2 bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                <Plus className="h-4 w-4" />
                Add User
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Users Grid */}
      <div className="grid gap-4">
        <AnimatePresence mode="popLayout">
          {filteredUsers.length === 0 ? (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
            >
              <Card className="border-0 shadow-lg">
                <CardContent className="p-12 text-center">
                  <UserCheck className="h-16 w-16 text-gray-300 mx-auto mb-4" />
                  <h3 className="text-gray-900 mb-2">No users found</h3>
                  <p className="text-gray-600">Try adjusting your filters or search term</p>
                </CardContent>
              </Card>
            </motion.div>
          ) : (
            filteredUsers.map((user, index) => {
              const statusConfig = getStatusConfig(user.isActive ? 'active' : 'inactive');
              const roleConfig = getRoleConfig(user.role);
              const StatusIcon = statusConfig.icon;
              const RoleIcon = roleConfig.icon;

              return (
                <motion.div
                  key={user.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  transition={{ delay: index * 0.03 }}
                  layout
                >
                  <Card className="border-0 shadow-lg hover:shadow-xl transition-all duration-300 overflow-hidden group">
                    <div className={`h-1 bg-gradient-to-r ${statusConfig.gradient}`} />
                    <CardContent className="p-6">
                      <div className="flex flex-col md:flex-row gap-6">
                        {/* Avatar */}
                        <div className="relative">
                          <div className={`w-20 h-20 rounded-2xl bg-gradient-to-br ${roleConfig.gradient} flex items-center justify-center text-white shadow-lg`}>
                            <span className="text-2xl">{getInitials(user.name)}</span>
                          </div>
                          <div className={`absolute -bottom-2 -right-2 rounded-full p-2 bg-gradient-to-br ${statusConfig.gradient} shadow-lg`}>
                            <StatusIcon className="h-4 w-4 text-white" />
                          </div>
                        </div>

                        {/* User Info */}
                        <div className="flex-1 min-w-0">
                          <div className="flex items-start justify-between gap-4 mb-3">
                            <div>
                              <h3 className="text-gray-900 mb-2 flex items-center gap-2">
                                {user.name}
                                {user.role === 'admin' && (
                                  <Crown className="h-5 w-5 text-purple-500" />
                                )}
                              </h3>
                              <div className="flex flex-wrap items-center gap-2">
                                <Badge className={roleConfig.color}>
                                  <RoleIcon className="h-3 w-3 mr-1" />
                                  {user.role}
                                </Badge>
                                <Badge className={statusConfig.color}>
                                  {user.isActive ? 'Active' : 'Inactive'}
                                </Badge>
                                <Badge className={
                                  user.approvalStatus === 'approved' ? 'bg-green-100 text-green-800 border-green-300' :
                                  user.approvalStatus === 'rejected' ? 'bg-red-100 text-red-800 border-red-300' :
                                  'bg-orange-100 text-orange-800 border-orange-300'
                                }>
                                  {user.approvalStatus === 'approved' && <CheckCircle className="h-3 w-3 mr-1" />}
                                  {user.approvalStatus === 'rejected' && <AlertCircle className="h-3 w-3 mr-1" />}
                                  {(user.approvalStatus === 'pending' || !user.approvalStatus) && <Clock className="h-3 w-3 mr-1" />}
                                  {user.approvalStatus || 'pending'}
                                </Badge>
                              </div>
                            </div>

                            <DropdownMenu>
                              <DropdownMenuTrigger asChild>
                                <Button variant="ghost" size="sm" className="opacity-0 group-hover:opacity-100 transition-opacity">
                                  <MoreVertical className="h-4 w-4" />
                                </Button>
                              </DropdownMenuTrigger>
                              <DropdownMenuContent align="end" className="w-48">
                                <DropdownMenuLabel>Actions</DropdownMenuLabel>
                                <DropdownMenuSeparator />
                                <DropdownMenuItem onClick={() => openEditDialog(user)}>
                                  <Edit className="h-4 w-4 mr-2" />
                                  Edit User
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleViewCredentials(user)}>
                                  <Eye className="h-4 w-4 mr-2" />
                                  View Credentials
                                </DropdownMenuItem>
                                <DropdownMenuItem onClick={() => handleResetPassword(user)}>
                                  <Key className="h-4 w-4 mr-2" />
                                  Reset Password
                                </DropdownMenuItem>
                                <DropdownMenuSeparator />
                                {(user.approvalStatus === 'pending' || !user.approvalStatus) && (
                                  <>
                                    <DropdownMenuItem onClick={() => handleQuickApprove(user)} className="text-green-600">
                                      <CheckCircle className="h-4 w-4 mr-2" />
                                      Approve User
                                    </DropdownMenuItem>
                                    <DropdownMenuItem onClick={() => handleQuickReject(user)} className="text-red-600">
                                      <AlertCircle className="h-4 w-4 mr-2" />
                                      Reject User
                                    </DropdownMenuItem>
                                    <DropdownMenuSeparator />
                                  </>
                                )}
                                <DropdownMenuItem onClick={() => handleDeleteUser(user)} className="text-red-600">
                                  <Trash2 className="h-4 w-4 mr-2" />
                                  Delete User
                                </DropdownMenuItem>
                              </DropdownMenuContent>
                            </DropdownMenu>
                          </div>

                          <div className="grid md:grid-cols-2 gap-4">
                            <div className="space-y-2">
                              <div className="flex items-center gap-2 text-gray-600">
                                <Mail className="h-4 w-4 text-gray-400" />
                                <span className="truncate">{user.email}</span>
                              </div>
                              {user.hourly_rate && (
                                <div className="flex items-center gap-2 text-gray-600">
                                  <DollarSign className="h-4 w-4 text-green-500" />
                                  <span>${user.hourly_rate}/hr</span>
                                </div>
                              )}
                            </div>

                            <div className="space-y-2">
                              <div className="flex items-center justify-between text-gray-600">
                                <span className="flex items-center gap-2">
                                  <CheckCircle className="h-4 w-4 text-blue-500" />
                                  Tasks Completed
                                </span>
                                <span>{user.completedTasks || 0}</span>
                              </div>
                              <div className="flex items-center justify-between text-gray-600">
                                <span className="flex items-center gap-2">
                                  <Award className="h-4 w-4 text-purple-500" />
                                  Total Earned
                                </span>
                                <span className="text-green-600">${(user.totalEarnings || 0).toFixed(2)}</span>
                              </div>
                            </div>
                          </div>

                          {(user.completedTasks || 0) > 0 && (
                            <div className="mt-4">
                              <div className="flex items-center justify-between text-sm text-gray-600 mb-2">
                                <span>Performance</span>
                                <span>{Math.min(100, (user.completedTasks || 0) * 10)}%</span>
                              </div>
                              <Progress value={Math.min(100, (user.completedTasks || 0) * 10)} className="h-2" />
                            </div>
                          )}
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })
          )}
        </AnimatePresence>
      </div>

      {/* Create/Edit User Dialog */}
      <Dialog 
        open={showCreateDialog || isEditing} 
        onOpenChange={(open) => !open && closeDialogs()}
      >
        <DialogContent className="sm:max-w-[600px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              {isEditing ? (
                <>
                  <Edit className="h-5 w-5" />
                  Edit User
                </>
              ) : (
                <>
                  <Plus className="h-5 w-5" />
                  Create New User
                </>
              )}
            </DialogTitle>
            <DialogDescription>
              {isEditing ? 'Update user information and permissions' : 'Add a new user with auto-generated or custom password'}
            </DialogDescription>
          </DialogHeader>

          {generatedPassword && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              className="bg-gradient-to-r from-green-50 to-emerald-50 border-2 border-green-200 rounded-xl p-4"
            >
              <div className="flex items-center gap-2 mb-3">
                <CheckCircle className="h-5 w-5 text-green-600" />
                <p className="text-green-900">User created successfully!</p>
              </div>
              <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-green-200">
                <Key className="h-4 w-4 text-gray-400" />
                <code className="flex-1 text-sm font-mono">{generatedPassword}</code>
                <Button size="sm" variant="ghost" onClick={copyPassword}>
                  <Copy className="h-4 w-4" />
                </Button>
              </div>
              <p className="text-green-700 mt-3 flex items-center gap-2">
                <Sparkles className="h-4 w-4" />
                Save this password - it won't be shown again!
              </p>
            </motion.div>
          )}

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-4">
              <div className="col-span-2">
                <Label className="flex items-center gap-2">
                  <UserCheck className="h-4 w-4" />
                  Full Name
                </Label>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  placeholder="John Doe"
                />
              </div>
            </div>

            {!isEditing && (
              <>
                <div>
                  <Label className="flex items-center gap-2">
                    <Mail className="h-4 w-4" />
                    Email Address
                  </Label>
                  <Input
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                    placeholder="john@example.com"
                  />
                </div>

                <Separator />

                <div>
                  <div className="flex items-center justify-between mb-3">
                    <Label className="flex items-center gap-2">
                      <Key className="h-4 w-4" />
                      Password Settings
                    </Label>
                    <Button
                      type="button"
                      size="sm"
                      variant="outline"
                      onClick={() => setUseCustomPassword(!useCustomPassword)}
                      className="gap-2"
                    >
                      {useCustomPassword ? 'Use Auto-Generated' : 'Set Custom Password'}
                    </Button>
                  </div>

                  {useCustomPassword && (
                    <div className="space-y-3">
                      <div className="relative">
                        <Input
                          type={showPassword ? 'text' : 'password'}
                          value={customPassword}
                          onChange={(e) => setCustomPassword(e.target.value)}
                          placeholder="Enter password or generate one"
                        />
                        <Button
                          type="button"
                          size="sm"
                          variant="ghost"
                          onClick={() => setShowPassword(!showPassword)}
                          className="absolute right-1 top-1/2 -translate-y-1/2"
                        >
                          {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                        </Button>
                      </div>
                      <Button
                        type="button"
                        size="sm"
                        variant="outline"
                        onClick={handleGenerateNewPassword}
                        className="w-full gap-2"
                      >
                        <RefreshCw className="h-4 w-4" />
                        Generate Secure Password
                      </Button>
                    </div>
                  )}
                  
                  {!useCustomPassword && (
                    <p className="text-sm text-gray-600 bg-blue-50 p-3 rounded-lg border border-blue-200">
                      <Zap className="h-4 w-4 inline mr-2 text-blue-600" />
                      A secure password will be automatically generated
                    </p>
                  )}
                </div>

                <Separator />
              </>
            )}

            <div className="grid grid-cols-2 gap-4">
              <div>
                <Label className="flex items-center gap-2">
                  <Shield className="h-4 w-4" />
                  Role
                </Label>
                <Select 
                  value={formData.role} 
                  onValueChange={(value: 'user' | 'admin') => setFormData({ ...formData, role: value })}
                >
                  <SelectTrigger>
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="user">
                      <div className="flex items-center gap-2">
                        <UserCheck className="h-4 w-4" />
                        User
                      </div>
                    </SelectItem>
                    <SelectItem value="admin">
                      <div className="flex items-center gap-2">
                        <Crown className="h-4 w-4" />
                        Administrator
                      </div>
                    </SelectItem>
                  </SelectContent>
                </Select>
              </div>

              {isEditing && (
                <div>
                  <Label className="flex items-center gap-2">
                    <Activity className="h-4 w-4" />
                    Status
                  </Label>
                  <Select 
                    value={formData.status} 
                    onValueChange={(value: any) => setFormData({ ...formData, status: value })}
                  >
                    <SelectTrigger>
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="active">
                        <div className="flex items-center gap-2">
                          <CheckCircle className="h-4 w-4 text-green-500" />
                          Active
                        </div>
                      </SelectItem>
                      <SelectItem value="inactive">
                        <div className="flex items-center gap-2">
                          <Clock className="h-4 w-4 text-gray-500" />
                          Inactive
                        </div>
                      </SelectItem>
                      <SelectItem value="suspended">
                        <div className="flex items-center gap-2">
                          <AlertCircle className="h-4 w-4 text-red-500" />
                          Suspended
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>
              )}
            </div>

            <div>
              <Label className="flex items-center gap-2">
                <DollarSign className="h-4 w-4" />
                Hourly Rate (Optional)
              </Label>
              <Input
                type="number"
                step="0.01"
                value={formData.hourly_rate}
                onChange={(e) => setFormData({ ...formData, hourly_rate: e.target.value })}
                placeholder="25.00"
              />
              <p className="text-sm text-gray-600 mt-1">Set the default hourly rate for this user's tasks</p>
            </div>
          </div>

          <DialogFooter>
            <Button
              variant="outline"
              onClick={closeDialogs}
            >
              {generatedPassword ? 'Close' : 'Cancel'}
            </Button>
            {!generatedPassword && (
              <Button 
                onClick={isEditing ? handleUpdateUser : handleCreateUser}
                className="bg-gradient-to-r from-blue-500 to-purple-600 hover:from-blue-600 hover:to-purple-700"
              >
                {isEditing ? 'Update User' : 'Create User'}
              </Button>
            )}
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* View Credentials Dialog */}
      <Dialog open={!!viewCredentialsUser} onOpenChange={() => setViewCredentialsUser(null)}>
        <DialogContent className="sm:max-w-[500px]">
          <DialogHeader>
            <DialogTitle className="flex items-center gap-2">
              <Eye className="h-5 w-5" />
              User Credentials
            </DialogTitle>
            <DialogDescription>
              View login credentials for this user
            </DialogDescription>
          </DialogHeader>

          {viewCredentialsUser && (
            <div className="space-y-4">
              <div className="bg-gradient-to-r from-blue-50 to-purple-50 p-4 rounded-lg border-2 border-blue-200">
                <div className="flex items-center gap-3 mb-4">
                  <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${getRoleConfig(viewCredentialsUser.role).gradient} flex items-center justify-center text-white`}>
                    <span className="text-lg">{getInitials(viewCredentialsUser.name)}</span>
                  </div>
                  <div>
                    <h4 className="text-gray-900">
                      {viewCredentialsUser.name}
                    </h4>
                    <p className="text-gray-600 text-sm">{viewCredentialsUser.email}</p>
                  </div>
                </div>

                <Separator className="my-4" />

                <div className="space-y-3">
                  <div>
                    <Label className="text-xs text-gray-600 mb-1">Email</Label>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-blue-200">
                      <Mail className="h-4 w-4 text-gray-400" />
                      <code className="flex-1 text-sm">{viewCredentialsUser.email}</code>
                      <Button 
                        size="sm" 
                        variant="ghost" 
                        onClick={() => {
                          navigator.clipboard.writeText(viewCredentialsUser.email);
                          toast.success('Email copied!');
                        }}
                      >
                        <Copy className="h-4 w-4" />
                      </Button>
                    </div>
                  </div>

                  <div>
                    <Label className="text-xs text-gray-600 mb-1">Password</Label>
                    <div className="flex items-center gap-2 bg-white rounded-lg p-3 border border-blue-200">
                      <Key className="h-4 w-4 text-gray-400" />
                      <code className="flex-1 text-sm font-mono">
                        {viewCredentialsUser.password || 'No password set'}
                      </code>
                      {viewCredentialsUser.password && (
                        <Button 
                          size="sm" 
                          variant="ghost" 
                          onClick={() => {
                            navigator.clipboard.writeText(viewCredentialsUser.password!);
                            toast.success('Password copied!');
                          }}
                        >
                          <Copy className="h-4 w-4" />
                        </Button>
                      )}
                    </div>
                  </div>
                </div>

                {!viewCredentialsUser.password && (
                  <div className="mt-4 bg-yellow-50 border border-yellow-200 rounded-lg p-3">
                    <p className="text-sm text-yellow-800">
                      This user doesn't have a password set. Use "Reset Password" to generate one.
                    </p>
                  </div>
                )}
              </div>

              <div className="flex gap-2">
                <Button 
                  variant="outline" 
                  className="flex-1"
                  onClick={() => {
                    setViewCredentialsUser(null);
                    handleResetPassword(viewCredentialsUser);
                  }}
                >
                  <Key className="h-4 w-4 mr-2" />
                  Reset Password
                </Button>
                <Button 
                  variant="outline" 
                  onClick={() => setViewCredentialsUser(null)}
                >
                  Close
                </Button>
              </div>
            </div>
          )}
        </DialogContent>
      </Dialog>
    </div>
  );
}
