"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { User } from "lucide-react";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Shield, CheckCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { LogoSimple } from "./Logo";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInSuccess?: (user?: any) => void;
  onSwitchToApply?: () => void;
  isAdminSignIn?: boolean;
}

export function SignInDialog({ open, onOpenChange, onSignInSuccess, onSwitchToApply, isAdminSignIn = false }: SignInDialogProps) {
  const { signIn, signUp, signInWithGoogle, forgotPassword } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [name, setName] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);
  const [isRegistering, setIsRegistering] = useState(false);

  const handleForgotPassword = async () => {
    if (!email) {
      toast.error("Please enter your email address first");
      return;
    }

    setLoading(true);
    try {
      await forgotPassword(email);
      toast.success("Password reset link sent to your email!");
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setLoading(false);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (isRegistering) {
      // Registration validation
      if (!name || !email || !password || !confirmPassword) {
        toast.error("Please fill in all fields");
        return;
      }
      if (password !== confirmPassword) {
        toast.error("Passwords do not match");
        return;
      }
      if (password.length < 6) {
        toast.error("Password must be at least 6 characters");
        return;
      }
      
      setLoading(true);
      try {
        await signUp(email, password, name);
        toast.success("Account created successfully! You are now signed in.");
        onOpenChange(false);
        if (onSignInSuccess) onSignInSuccess();
      } catch (error: any) {
        toast.error(error.message || "Failed to create account");
      } finally {
        setLoading(false);
      }
      return;
    }

    // Sign in validation
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userData = await signIn(email, password);
      
      // Show appropriate welcome message based on role and context
      if (isAdminSignIn && userData?.role === 'admin') {
        toast.success("Admin access granted! Redirecting to admin panel...");
      } else if (isAdminSignIn && userData?.role !== 'admin') {
        toast.error("Access denied. Admin privileges required.");
      } else if (userData?.role === 'admin') {
        toast.success("Welcome back, Admin! Redirecting to dashboard...");
      } else {
        toast.success("Welcome back! Redirecting to your dashboard...");
      }
      
      onOpenChange(false);
      setEmail("");
      setPassword("");
      if (onSignInSuccess) {
        setTimeout(() => onSignInSuccess(userData), 500);
      }
    } catch (error: any) {
      const errorMsg = error.message || "Sign in failed. Please check your credentials.";
      
      // Dispatch event so AuthHealthBanner can respond
      window.dispatchEvent(new CustomEvent('auth-failed'));
      
      toast.error(errorMsg, {
        description: "Having trouble? Scroll down and click '🔧 Fix Sign-In' in the footer",
        duration: 6000
      });
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    // Check if Google OAuth is configured
    const googleClientId = process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID;
    if (!googleClientId || googleClientId === 'your_google_client_id_here') {
      toast.error("Google Sign-In is not configured yet. Please use email sign-in for now.", {
        description: "Contact support to enable Google Sign-In"
      });
      return;
    }

    setLoading(true);
    try {
      const userData = await signInWithGoogle();
      toast.success("Successfully signed in with Google!");
      onOpenChange(false);
      setEmail("");
      setPassword("");
      if (onSignInSuccess) {
        setTimeout(() => onSignInSuccess(userData), 500);
      }
    } catch (error: any) {
      toast.error(error.message || "Google Sign-In failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[420px] max-h-[90vh] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In to Infera AI</DialogTitle>
          <DialogDescription>
            Sign in to access your dashboard and manage your projects
          </DialogDescription>
        </DialogHeader>
        
        <div className="overflow-y-auto max-h-[90vh] custom-scrollbar">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3 }}
          >
            {/* Header with Gradient */}
            <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-6 text-white">
              <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
              
              <div className="relative z-10 text-center">
                <div className="flex justify-center mb-3">
                  {isAdminSignIn ? (
                    <div className="bg-white/20 backdrop-blur-sm rounded-full p-3">
                      <Shield className="h-6 w-6 text-white" />
                    </div>
                  ) : (
                    <LogoSimple />
                  )}
                </div>
                <h2 className="text-xl font-semibold mb-1">
                  {isAdminSignIn 
                    ? "Admin Access Required" 
                    : isRegistering 
                      ? "Create Your Account"
                      : "Welcome Back"
                  }
                </h2>
                <p className="text-blue-100 text-sm">
                  {isAdminSignIn 
                    ? "Sign in with admin credentials to access the admin panel"
                    : isRegistering
                      ? "Join Infera AI and start your journey"
                      : "Sign in to continue to your dashboard"
                  }
                </p>
              </div>
            </div>

            {/* Form Content */}
            <div className="p-6">
              <form onSubmit={handleSubmit} className="space-y-4">
                {/* Google Sign In - Only for Sign In */}
                {!isRegistering && (
                  <motion.div
                    whileHover={{ scale: 1.01 }}
                    whileTap={{ scale: 0.99 }}
                  >
                    <Button
                      type="button"
                      variant="outline"
                      className={`w-full h-11 border-2 transition-all ${
                        !process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
                        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'your_google_client_id_here'
                          ? 'opacity-50 cursor-not-allowed'
                          : 'hover:bg-gray-50'
                      }`}
                      onClick={handleGoogleSignIn}
                      disabled={!process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID || 
                        process.env.NEXT_PUBLIC_GOOGLE_CLIENT_ID === 'your_google_client_id_here'}
                    >
                    <svg className="w-5 h-5 mr-3" viewBox="0 0 24 24">
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
                </motion.div>
                )}

                {!isRegistering && (
                  <div className="relative">
                    <Separator />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <span className="bg-white px-3 text-xs text-gray-500">Or continue with email</span>
                    </div>
                  </div>
                )}

                {/* Admin Credentials Helper */}
                {isAdminSignIn && (
                  <motion.div
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="bg-blue-50 border border-blue-200 rounded-lg p-3"
                  >
                    <div className="flex items-center gap-2 text-blue-800">
                      <Shield className="h-4 w-4" />
                      <span className="text-sm font-medium">Admin Credentials</span>
                    </div>
                    <div className="mt-2 text-xs text-blue-700 space-y-1">
                      <div><strong>Email:</strong> admin@inferaai.com</div>
                      <div><strong>Password:</strong> Admin123!</div>
                    </div>
                  </motion.div>
                )}

                {/* Email Field */}
                <div className="space-y-1">
                  <Label htmlFor="email" className="text-gray-700 text-sm">
                    Email Address
                  </Label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="email"
                      type="email"
                      placeholder="you@example.com"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="pl-9 h-10 border focus:border-blue-500 transition-colors"
                      required
                    />
                  </div>
                </div>

                {/* Name Field - Only for Registration */}
                {isRegistering && (
                  <div className="space-y-1">
                    <Label htmlFor="name" className="text-gray-700 text-sm">
                      Full Name
                    </Label>
                    <div className="relative">
                      <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="name"
                        type="text"
                        placeholder="Your full name"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        className="pl-9 h-10 border focus:border-blue-500 transition-colors"
                        required
                      />
                    </div>
                  </div>
                )}

                {/* Password Field */}
                <div className="space-y-1">
                  <div className="flex items-center justify-between">
                    <Label htmlFor="password" className="text-gray-700 text-sm">
                      Password
                    </Label>
                    <button
                      type="button"
                      className="text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      onClick={handleForgotPassword}
                    >
                      Forgot password?
                    </button>
                  </div>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                    <Input
                      id="password"
                      type={showPassword ? "text" : "password"}
                      placeholder="••••••••"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      className="pl-9 pr-9 h-10 border focus:border-blue-500 transition-colors"
                      required
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                    >
                      {showPassword ? (
                        <EyeOff className="h-4 w-4" />
                      ) : (
                        <Eye className="h-4 w-4" />
                      )}
                    </button>
                  </div>
                </div>

                {/* Confirm Password Field - Only for Registration */}
                {isRegistering && (
                  <div className="space-y-1">
                    <Label htmlFor="confirmPassword" className="text-gray-700 text-sm">
                      Confirm Password
                    </Label>
                    <div className="relative">
                      <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-gray-400" />
                      <Input
                        id="confirmPassword"
                        type={showConfirmPassword ? "text" : "password"}
                        placeholder="••••••••"
                        value={confirmPassword}
                        onChange={(e) => setConfirmPassword(e.target.value)}
                        className="pl-9 pr-9 h-10 border focus:border-blue-500 transition-colors"
                        required
                      />
                      <button
                        type="button"
                        onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                        className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                      >
                        {showConfirmPassword ? (
                          <EyeOff className="h-4 w-4" />
                        ) : (
                          <Eye className="h-4 w-4" />
                        )}
                      </button>
                    </div>
                  </div>
                )}

                {/* Remember Me - Only for Sign In */}
                {!isRegistering && (
                  <div className="flex items-center">
                    <input
                      type="checkbox"
                      id="remember"
                      checked={rememberMe}
                      onChange={(e) => setRememberMe(e.target.checked)}
                      className="h-3 w-3 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                    />
                    <label htmlFor="remember" className="ml-2 text-xs text-gray-600">
                      Keep me signed in
                    </label>
                  </div>
                )}                {/* Submit Button */}
                <motion.div
                  whileHover={{ scale: 1.01 }}
                  whileTap={{ scale: 0.99 }}
                >
                  <Button
                    type="submit"
                    className="w-full h-10 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 group"
                    disabled={loading}
                  >
                    {loading ? (
                      <span className="flex items-center gap-2">
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="h-4 w-4 border-2 border-white border-t-transparent rounded-full"
                        />
                        {isRegistering ? 'Creating account...' : 'Signing in...'}
                      </span>
                    ) : (
                      <span className="flex items-center gap-2">
                        {isRegistering ? 'Create Account' : 'Sign In'}
                        <ArrowRight className="h-4 w-4 group-hover:translate-x-1 transition-transform" />
                      </span>
                    )}
                  </Button>
                </motion.div>
              </form>

              {/* Footer */}
              <div className="mt-4 pt-4 border-t">
                <p className="text-center text-xs text-gray-600">
                  {isRegistering ? (
                    <>
                      Already have an account?{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={() => {
                          setIsRegistering(false);
                          setName("");
                          setConfirmPassword("");
                        }}
                      >
                        Sign in
                      </button>
                    </>
                  ) : (
                    <>
                      Don't have an account?{" "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={() => setIsRegistering(true)}
                      >
                        Create account
                      </button>
                      {" | "}
                      <button
                        type="button"
                        className="text-blue-600 hover:text-blue-700 hover:underline"
                        onClick={() => {
                          onOpenChange(false);
                          if (onSwitchToApply) {
                            setTimeout(() => onSwitchToApply(), 300);
                          }
                        }}
                      >
                        Apply now
                      </button>
                    </>
                  )}
                </p>

                {/* Trust Indicators */}
                <div className="flex items-center justify-center gap-4 mt-3 text-xs text-gray-500">
                  <div className="flex items-center gap-1">
                    <Shield className="h-3 w-3" />
                    <span>Secure</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <CheckCircle className="h-3 w-3" />
                    <span>Trusted by 50k+</span>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
