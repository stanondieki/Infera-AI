"use client";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "./ui/dialog";
import { Button } from "./ui/button";
import { Input } from "./ui/input";
import { Label } from "./ui/label";
import { useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../utils/auth";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, ArrowRight, Eye, EyeOff, Sparkles, Shield, CheckCircle } from "lucide-react";
import { Separator } from "./ui/separator";
import { Logo } from "./Logo";

interface SignInDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSignInSuccess?: (user?: any) => void;
  onSwitchToApply?: () => void;
}

export function SignInDialog({ open, onOpenChange, onSignInSuccess, onSwitchToApply }: SignInDialogProps) {
  const { signIn } = useAuth();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [rememberMe, setRememberMe] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error("Please fill in all fields");
      return;
    }

    setLoading(true);
    try {
      const userData = await signIn(email, password);
      
      // Show appropriate welcome message based on role
      if (userData?.role === 'admin') {
        toast.success("Welcome back, Admin! Redirecting to admin panel...");
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
    toast.info("Google Sign-In will be available soon!");
    // In a real implementation, this would trigger Google OAuth
    // const { data, error } = await supabase.auth.signInWithOAuth({
    //   provider: 'google',
    //   options: {
    //     redirectTo: `${window.location.origin}/auth/callback`
    //   }
    // });
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-[480px] p-0 gap-0 overflow-hidden">
        <DialogHeader className="sr-only">
          <DialogTitle>Sign In to Infera AI</DialogTitle>
          <DialogDescription>
            Sign in to access your dashboard and manage your projects
          </DialogDescription>
        </DialogHeader>
        
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
        >
          {/* Header with Gradient */}
          <div className="relative bg-gradient-to-br from-blue-600 via-purple-600 to-pink-600 p-8 text-white">
            <div className="absolute inset-0 bg-[url('data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAwIiBoZWlnaHQ9IjIwMCIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48ZGVmcz48cGF0dGVybiBpZD0iZ3JpZCIgd2lkdGg9IjQwIiBoZWlnaHQ9IjQwIiBwYXR0ZXJuVW5pdHM9InVzZXJTcGFjZU9uVXNlIj48cGF0aCBkPSJNIDQwIDAgTCAwIDAgMCA0MCIgZmlsbD0ibm9uZSIgc3Ryb2tlPSJ3aGl0ZSIgc3Ryb2tlLW9wYWNpdHk9IjAuMSIgc3Ryb2tlLXdpZHRoPSIxIi8+PC9wYXR0ZXJuPjwvZGVmcz48cmVjdCB3aWR0aD0iMTAwJSIgaGVpZ2h0PSIxMDAlIiBmaWxsPSJ1cmwoI2dyaWQpIi8+PC9zdmc+')] opacity-20"></div>
            
            <div className="relative z-10">
              <div className="flex justify-center mb-4">
                <Logo variant="white" size="md" animated={false} />
              </div>
              <h2 className="text-2xl text-center mb-2">Welcome Back</h2>
              <p className="text-blue-100 text-center text-sm">
                Sign in to continue to your dashboard
              </p>
            </div>
          </div>

          {/* Form Content */}
          <div className="p-8">
            {/* Troubleshooting Alert */}
            <div className="mb-6 bg-yellow-50 border-2 border-yellow-300 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <div className="text-2xl">🔧</div>
                <div className="flex-1">
                  <p className="text-sm text-yellow-900 mb-1">
                    <strong>Having sign-in issues?</strong>
                  </p>
                  <p className="text-xs text-yellow-800 mb-2">
                    If you're getting "Invalid credentials" errors, scroll to the bottom of the page and click the yellow <strong>"🔧 Fix Sign-In"</strong> button in the footer.
                  </p>
                  <button
                    type="button"
                    onClick={() => {
                      onOpenChange(false);
                      setTimeout(() => {
                        window.scrollTo({ top: document.body.scrollHeight, behavior: 'smooth' });
                      }, 100);
                    }}
                    className="text-xs font-semibold text-yellow-700 hover:text-yellow-900 hover:underline"
                  >
                    Take me to the fix →
                  </button>
                </div>
              </div>
            </div>

            <form onSubmit={handleSubmit} className="space-y-5">
              {/* Google Sign In */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="button"
                  variant="outline"
                  className="w-full h-12 border-2 hover:bg-gray-50 transition-all"
                  onClick={handleGoogleSignIn}
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

              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-4 text-sm text-gray-500">Or continue with email</span>
                </div>
              </div>

              {/* Email Field */}
              <div className="space-y-2">
                <Label htmlFor="email" className="text-gray-700">
                  Email Address
                </Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="email"
                    type="email"
                    placeholder="you@example.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="pl-10 h-12 border-2 focus:border-blue-500 transition-colors"
                    required
                  />
                </div>
              </div>

              {/* Password Field */}
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password" className="text-gray-700">
                    Password
                  </Label>
                  <button
                    type="button"
                    className="text-sm text-blue-600 hover:text-blue-700 hover:underline"
                    onClick={() => toast.info("Password reset feature coming soon!")}
                  >
                    Forgot password?
                  </button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-5 w-5 text-gray-400" />
                  <Input
                    id="password"
                    type={showPassword ? "text" : "password"}
                    placeholder="••••••••"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="pl-10 pr-10 h-12 border-2 focus:border-blue-500 transition-colors"
                    required
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-gray-600"
                  >
                    {showPassword ? (
                      <EyeOff className="h-5 w-5" />
                    ) : (
                      <Eye className="h-5 w-5" />
                    )}
                  </button>
                </div>
              </div>

              {/* Remember Me */}
              <div className="flex items-center">
                <input
                  type="checkbox"
                  id="remember"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                  className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
                />
                <label htmlFor="remember" className="ml-2 text-sm text-gray-600">
                  Keep me signed in
                </label>
              </div>

              {/* Submit Button */}
              <motion.div
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
              >
                <Button
                  type="submit"
                  className="w-full h-12 bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white shadow-lg shadow-blue-500/30 group"
                  disabled={loading}
                >
                  {loading ? (
                    <span className="flex items-center gap-2">
                      <motion.div
                        animate={{ rotate: 360 }}
                        transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                        className="h-5 w-5 border-2 border-white border-t-transparent rounded-full"
                      />
                      Signing in...
                    </span>
                  ) : (
                    <span className="flex items-center gap-2">
                      Sign In
                      <ArrowRight className="h-5 w-5 group-hover:translate-x-1 transition-transform" />
                    </span>
                  )}
                </Button>
              </motion.div>

              {/* Demo & Admin Account Info */}
              <div className="space-y-3">
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.2 }}
                  className="bg-blue-50 border border-blue-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-blue-600 flex items-center justify-center flex-shrink-0">
                      <Sparkles className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-blue-900 mb-2">
                        <strong>Demo User Account:</strong>
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-blue-700 font-mono">demo@inferaai.com</p>
                        <p className="text-sm text-blue-700 font-mono">Demo123!</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('demo@inferaai.com');
                          setPassword('Demo123!');
                        }}
                        className="mt-2 text-xs text-blue-600 hover:text-blue-700 hover:underline"
                      >
                        Click to auto-fill
                      </button>
                    </div>
                  </div>
                </motion.div>

                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="bg-purple-50 border border-purple-200 rounded-xl p-4"
                >
                  <div className="flex items-start gap-3">
                    <div className="h-8 w-8 rounded-lg bg-purple-600 flex items-center justify-center flex-shrink-0">
                      <Shield className="h-4 w-4 text-white" />
                    </div>
                    <div className="flex-1">
                      <p className="text-sm text-purple-900 mb-2">
                        <strong>Admin Access:</strong>
                      </p>
                      <div className="space-y-1">
                        <p className="text-sm text-purple-700 font-mono">admin@inferaai.com</p>
                        <p className="text-sm text-purple-700 font-mono">Admin123!</p>
                      </div>
                      <button
                        type="button"
                        onClick={() => {
                          setEmail('admin@inferaai.com');
                          setPassword('Admin123!');
                        }}
                        className="mt-2 text-xs text-purple-600 hover:text-purple-700 hover:underline"
                      >
                        Click to auto-fill
                      </button>
                    </div>
                  </div>
                </motion.div>
              </div>
            </form>

            {/* Footer */}
            <div className="mt-6 pt-6 border-t">
              <p className="text-center text-sm text-gray-600">
                Don't have an account?{" "}
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
              </p>

              {/* Trust Indicators */}
              <div className="flex items-center justify-center gap-6 mt-4 text-xs text-gray-500">
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
      </DialogContent>
    </Dialog>
  );
}
