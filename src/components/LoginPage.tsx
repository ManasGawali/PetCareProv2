import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Separator } from './ui/separator';
import { Card } from './ui/card';
import { Badge } from './ui/badge';
import { Heart, Mail, Lock, Eye, EyeOff, AlertCircle, Copy, Check } from 'lucide-react';
import { useAuth } from '../hooks/useAuth';
import { googleAuth } from '../utils/supabase/auth';

interface LoginPageProps {
  onSignIn: (email: string, password: string) => Promise<{ success: boolean; error?: string }>;
  onNavigateToSignUp: () => void;
  demoAccounts?: { email: string; password: string; fullName: string }[];
  onSignInSuccess: () => void;
}

export function LoginPage({ onSignIn, onNavigateToSignUp, demoAccounts = [], onSignInSuccess }: LoginPageProps) {
  // Default demo accounts if not provided
  const defaultDemoAccounts = [
    {
      email: "john@example.com",
      password: "demo123",
      fullName: "John Doe"
    },
    {
      email: "sarah@example.com", 
      password: "demo123",
      fullName: "Sarah Wilson"
    },
    {
      email: "mike@example.com",
      password: "demo123", 
      fullName: "Mike Johnson"
    }
  ];
  
  const accountsToShow = demoAccounts.length > 0 ? demoAccounts : defaultDemoAccounts;
  const { signInWithGoogle, signInWithEmail, isLoading: authLoading } = useAuth();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [emailFocused, setEmailFocused] = useState(false);
  const [passwordFocused, setPasswordFocused] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  const [copiedAccount, setCopiedAccount] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Basic validation
    if (!email || !email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (!password) {
      setError('Please enter your password.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try backend authentication first
      const result = await signInWithEmail(email, password);
      
      if (result.success) {
        onSignInSuccess();
      } else {
        // Fallback to original authentication for demo accounts
        const legacyResult = await onSignIn(email, password);
        if (legacyResult.success) {
          onSignInSuccess();
        } else {
          setError(result.error || legacyResult.error || 'Sign in failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Login error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  const handleGoogleLogin = async () => {
    try {
      setIsSubmitting(true);
      setError('');
      
      const result = await googleAuth.signInWithGoogle();
      
      if (result.success) {
        onSignInSuccess();
      } else {
        setError(result.error || 'Google sign-in failed. Please try again.');
      }
    } catch (error) {
      console.error('Google login error:', error);
      setError('Google sign-in failed. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const copyAccountDetails = (account: { email: string; password: string }) => {
    setEmail(account.email);
    setPassword(account.password);
    setCopiedAccount(account.email);
    setTimeout(() => setCopiedAccount(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center p-6 pt-24">
      {/* Background Pattern */}
      <div className="absolute inset-0 opacity-5">
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#6EC18E] animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-[#F4C2C2] animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-32 w-28 h-28 rounded-full bg-[#FFD66B] animate-float" style={{ animationDelay: '2s' }} />
      </div>

      <div className="w-full max-w-6xl flex items-start gap-8">
        {/* Demo Accounts Panel */}
        <motion.div
          initial={{ x: -50, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="hidden lg:block w-80 flex-shrink-0"
        >
          <Card className="p-6">
            <h3 className="text-lg font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              Demo Accounts
            </h3>
            <p className="text-sm text-[#666666] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
              Try these demo accounts to explore the application:
            </p>
            
            <div className="space-y-3">
              {accountsToShow.map((account, index) => (
                <motion.div
                  key={account.email}
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.2, delay: 0.3 + index * 0.1 }}
                  className="p-3 bg-[#F5F5F5] rounded-lg border border-[#E0E0E0] hover:border-[#6EC18E] transition-colors group"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h4 className="font-medium text-[#333333] text-sm">{account.fullName}</h4>
                    <motion.button
                      onClick={() => copyAccountDetails(account)}
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                      className="w-6 h-6 bg-[#6EC18E] text-white rounded-full flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <AnimatePresence mode="wait">
                        {copiedAccount === account.email ? (
                          <motion.div
                            key="check"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Check className="w-3 h-3" />
                          </motion.div>
                        ) : (
                          <motion.div
                            key="copy"
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0 }}
                          >
                            <Copy className="w-3 h-3" />
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </motion.button>
                  </div>
                  <div className="text-xs text-[#666666] space-y-1">
                    <div className="flex items-center">
                      <Mail className="w-3 h-3 mr-2" />
                      <code className="bg-white px-1 rounded">{account.email}</code>
                    </div>
                    <div className="flex items-center">
                      <Lock className="w-3 h-3 mr-2" />
                      <code className="bg-white px-1 rounded">{account.password}</code>
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="mt-4 p-3 bg-blue-50 border border-blue-200 rounded-lg">
              <p className="text-xs text-blue-700">
                💡 Click the copy button to fill in the login form with demo credentials.
              </p>
            </div>
          </Card>
        </motion.div>

        {/* Login Card */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.3, ease: [0.4, 0, 0.2, 1] }}
          className="flex-1 max-w-md mx-auto lg:mx-0"
        >
          <div 
            className="bg-white rounded-3xl shadow-sm p-8 relative z-10"
            style={{ width: '400px', minHeight: '500px' }}
          >
            {/* Header */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              className="text-center mb-8"
            >
              <div className="flex items-center justify-center mb-4">
                <div className="w-12 h-12 rounded-full bg-gradient-to-br from-[#6EC18E] to-[#4AA06B] flex items-center justify-center">
                  <Heart className="w-7 h-7 text-white" />
                </div>
              </div>
              <h2 className="text-3xl font-bold text-[#333333] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                Welcome Back
              </h2>
              <p className="text-sm text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
                Please sign in to continue
              </p>
            </motion.div>

            {/* Error Message */}
            <AnimatePresence>
              {error && (
                <motion.div
                  initial={{ opacity: 0, y: -10, height: 0 }}
                  animate={{ opacity: 1, y: 0, height: 'auto' }}
                  exit={{ opacity: 0, y: -10, height: 0 }}
                  transition={{ duration: 0.2 }}
                  className="mb-6 p-3 bg-red-50 border border-red-200 rounded-lg flex items-center"
                >
                  <AlertCircle className="w-4 h-4 text-red-600 mr-2 flex-shrink-0" />
                  <p className="text-sm text-red-700">{error}</p>
                </motion.div>
              )}
            </AnimatePresence>

            {/* Form */}
            <form onSubmit={handleSubmit} className="space-y-6">
              {/* Email Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
                className="relative"
              >
                <div className="relative">
                  <Input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onFocus={() => setEmailFocused(true)}
                    onBlur={() => setEmailFocused(false)}
                    className="w-full px-4 py-3 border-0 border-b-2 border-[#E0E0E0] bg-transparent rounded-none focus:border-[#6EC18E] focus:ring-0 transition-colors duration-150"
                    placeholder=" "
                    disabled={isSubmitting}
                  />
                  <Label
                    className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                      emailFocused || email
                        ? 'top-0 text-xs text-[#6EC18E] -translate-y-2'
                        : 'top-3 text-base text-[#666666]'
                    }`}
                  >
                    Email Address
                  </Label>
                  <Mail className="absolute right-4 top-3 w-5 h-5 text-[#666666]" />
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: emailFocused ? '100%' : 0 }}
                  transition={{ duration: 0.15 }}
                />
              </motion.div>

              {/* Password Field */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="relative"
              >
                <div className="relative">
                  <Input
                    type={showPassword ? 'text' : 'password'}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onFocus={() => setPasswordFocused(true)}
                    onBlur={() => setPasswordFocused(false)}
                    className="w-full px-4 py-3 border-0 border-b-2 border-[#E0E0E0] bg-transparent rounded-none focus:border-[#6EC18E] focus:ring-0 transition-colors duration-150 pr-20"
                    placeholder=" "
                    disabled={isSubmitting}
                  />
                  <Label
                    className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                      passwordFocused || password
                        ? 'top-0 text-xs text-[#6EC18E] -translate-y-2'
                        : 'top-3 text-base text-[#666666]'
                    }`}
                  >
                    Password
                  </Label>
                  <div className="absolute right-4 top-3 flex items-center space-x-2">
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="text-[#666666] hover:text-[#333333] transition-colors"
                      disabled={isSubmitting}
                    >
                      {showPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                    </button>
                    <Lock className="w-5 h-5 text-[#666666]" />
                  </div>
                </div>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                  initial={{ width: 0 }}
                  animate={{ width: passwordFocused ? '100%' : 0 }}
                  transition={{ duration: 0.15 }}
                />
              </motion.div>

              {/* Forgot Password */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 }}
                className="text-right"
              >
                <button
                  type="button"
                  className="text-sm text-[#6EC18E] hover:text-[#5BB07F] relative group"
                  disabled={isSubmitting}
                >
                  Forgot password?
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.15 }}
                  />
                </button>
              </motion.div>

              {/* Sign In Button */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: isSubmitting ? 1 : 1.02, y: isSubmitting ? 0 : -2 }}
                whileTap={{ scale: isSubmitting ? 1 : 0.98 }}
              >
                <Button
                  type="submit"
                  disabled={isSubmitting}
                  className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white py-3 relative overflow-hidden group disabled:opacity-70 disabled:cursor-not-allowed"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: isSubmitting ? '-100%' : '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  <span className="relative z-10 flex items-center justify-center">
                    {isSubmitting ? (
                      <>
                        <motion.div
                          animate={{ rotate: 360 }}
                          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                          className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                        />
                        Signing In...
                      </>
                    ) : (
                      'Sign In'
                    )}
                  </span>
                </Button>
              </motion.div>
            </form>

            {/* Divider */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="my-6"
            >
              <div className="relative">
                <Separator />
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="bg-white px-3 text-sm text-[#666666]">or</span>
                </div>
              </div>
            </motion.div>

            {/* Social Login */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              className="space-y-3"
            >
              <motion.button
                type="button"
                onClick={handleGoogleLogin}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                disabled={isSubmitting || authLoading}
                className="w-full flex items-center justify-center space-x-3 py-3 border border-[#E0E0E0] rounded-lg hover:border-[#6EC18E] hover:bg-[#6EC18E]/5 transition-all duration-150 disabled:opacity-50 disabled:cursor-not-allowed"
              >
                <motion.div
                  whileHover={{ scale: (isSubmitting || authLoading) ? 1 : 1.1 }}
                  transition={{ duration: 0.15 }}
                >
                  {(isSubmitting || authLoading) ? (
                    <motion.div
                      animate={{ rotate: 360 }}
                      transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                      className="w-5 h-5 border-2 border-gray-400 border-t-transparent rounded-full"
                    />
                  ) : (
                    <div className="w-5 h-5 bg-red-500 rounded-full flex items-center justify-center">
                      <span className="text-white text-xs font-bold">G</span>
                    </div>
                  )}
                </motion.div>
                <span className="text-[#333333]">
                  {(isSubmitting || authLoading) ? 'Signing in...' : 'Continue with Google'}
                </span>
              </motion.button>
            </motion.div>

            {/* Sign Up Link */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.8 }}
              className="text-center mt-6"
            >
              <p className="text-sm text-[#666666]">
                Don't have an account?{' '}
                <button
                  type="button"
                  onClick={onNavigateToSignUp}
                  disabled={isSubmitting}
                  className="text-[#6EC18E] hover:text-[#5BB07F] font-medium relative group disabled:opacity-50 disabled:cursor-not-allowed"
                >
                  Sign up
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: isSubmitting ? 0 : '100%' }}
                    transition={{ duration: 0.15 }}
                  />
                </button>
              </p>
            </motion.div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}