import { useState, useRef, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Checkbox } from './ui/checkbox';
import { Heart, Mail, Lock, User, Eye, EyeOff, Check, AlertCircle } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { useAuth } from '../hooks/useAuth';

interface SignUpPageProps {
  onSignUp: (email: string, password: string, fullName: string) => { success: boolean; error?: string };
  onNavigateToLogin: () => void;
  onSignUpSuccess: () => void;
}

export function SignUpPage({ onSignUp, onNavigateToLogin, onSignUpSuccess }: SignUpPageProps) {
  const { signUp, isLoading: authLoading } = useAuth();
  const [formData, setFormData] = useState({
    fullName: '',
    email: '',
    password: '',
    confirmPassword: ''
  });
  const [focused, setFocused] = useState({
    fullName: false,
    email: false,
    password: false,
    confirmPassword: false
  });
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [termsAccepted, setTermsAccepted] = useState(false);
  const [checkAnimated, setCheckAnimated] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState('');
  
  const illustrationRef = useRef<HTMLDivElement>(null);
  const [mousePosition, setMousePosition] = useState({ x: 0, y: 0 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (illustrationRef.current) {
        const rect = illustrationRef.current.getBoundingClientRect();
        const centerX = rect.left + rect.width / 2;
        const centerY = rect.top + rect.height / 2;
        const x = (e.clientX - centerX) / rect.width;
        const y = (e.clientY - centerY) / rect.height;
        setMousePosition({ x: x * 10, y: y * 10 });
      }
    };

    window.addEventListener('mousemove', handleMouseMove);
    return () => window.removeEventListener('mousemove', handleMouseMove);
  }, []);

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleFocus = (field: string, isFocused: boolean) => {
    setFocused(prev => ({ ...prev, [field]: isFocused }));
  };

  const handleTermsChange = (checked: boolean) => {
    setTermsAccepted(checked);
    if (checked && !checkAnimated) {
      setCheckAnimated(true);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    // Validation
    if (!formData.fullName.trim()) {
      setError('Please enter your full name.');
      return;
    }
    
    if (!formData.email || !formData.email.includes('@')) {
      setError('Please enter a valid email address.');
      return;
    }
    
    if (!formData.password || formData.password.length < 6) {
      setError('Password must be at least 6 characters long.');
      return;
    }
    
    if (formData.password !== formData.confirmPassword) {
      setError('Passwords do not match.');
      return;
    }
    
    if (!termsAccepted) {
      setError('Please accept the Terms of Service and Privacy Policy.');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Try backend authentication first
      const result = await signUp(formData.email, formData.password, formData.fullName);
      
      if (result.success) {
        onSignUpSuccess();
      } else {
        // Fallback to original signup
        const legacyResult = onSignUp(formData.email, formData.password, formData.fullName);
        if (legacyResult.success) {
          onSignUpSuccess();
        } else {
          setError(result.error || legacyResult.error || 'Registration failed. Please try again.');
        }
      }
    } catch (error) {
      console.error('Sign-up error:', error);
      setError('An unexpected error occurred. Please try again.');
    }
    
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] flex">
      {/* Left Side - Illustration */}
      <motion.div
        initial={{ opacity: 0, x: -50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="hidden lg:flex lg:w-1/2 relative overflow-hidden bg-gradient-to-br from-[#6EC18E]/10 to-[#F4C2C2]/10"
      >
        <div
          ref={illustrationRef}
          className="relative w-full h-full flex items-center justify-center p-16"
        >
          {/* Background Elements */}
          <div className="absolute inset-0">
            <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#6EC18E]/20 animate-float" />
            <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-[#F4C2C2]/30 animate-float" style={{ animationDelay: '1s' }} />
            <div className="absolute bottom-32 left-32 w-28 h-28 rounded-full bg-[#FFD66B]/25 animate-float" style={{ animationDelay: '2s' }} />
            <div className="absolute bottom-16 right-32 w-14 h-14 rounded-full bg-[#6EC18E]/25 animate-float" style={{ animationDelay: '3s' }} />
          </div>

          {/* Main Illustration */}
          <motion.div
            style={{
              transform: `translate(${mousePosition.x}px, ${mousePosition.y}px)`,
            }}
            transition={{ type: 'spring', stiffness: 50, damping: 15 }}
            className="relative z-10 max-w-lg"
          >
            <div className="text-center">
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.6, delay: 0.3 }}
                className="mb-8"
              >
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center"
                  alt="Pet caregiver with happy pets"
                  className="w-80 h-60 object-cover rounded-2xl shadow-xl"
                />
              </motion.div>
              
              <motion.h2
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-3xl font-bold text-[#333333] mb-4"
                style={{ fontFamily: 'var(--font-heading)' }}
              >
                Join Our Pet Care Family
              </motion.h2>
              
              <motion.p
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.6, delay: 0.7 }}
                className="text-lg text-[#666666] leading-relaxed"
                style={{ fontFamily: 'var(--font-body)' }}
              >
                Connect with certified pet care professionals and give your beloved companions the premium care they deserve.
              </motion.p>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Right Side - Sign Up Form */}
      <motion.div
        initial={{ opacity: 0, x: 50 }}
        animate={{ opacity: 1, x: 0 }}
        transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
        className="w-full lg:w-1/2 flex items-center justify-center p-8"
      >
        <div className="w-full max-w-md">
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
            <h1 className="text-3xl font-bold text-[#333333] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
              Create Account
            </h1>
            <p className="text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
              Start your journey with PetCare Pro today
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

          {/* Sign Up Form */}
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* Full Name */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="relative"
            >
              <div className="relative">
                <Input
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => handleInputChange('fullName', e.target.value)}
                  onFocus={() => handleFocus('fullName', true)}
                  onBlur={() => handleFocus('fullName', false)}
                  className="w-full px-4 py-3 border-0 border-b-2 bg-transparent rounded-none focus:ring-0 transition-colors duration-150 border-[#E0E0E0] focus:border-[#6EC18E]"
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <Label
                  className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                    focused.fullName || formData.fullName
                      ? 'top-0 text-xs text-[#6EC18E] -translate-y-2'
                      : 'top-3 text-base text-[#666666]'
                  }`}
                >
                  Full Name
                </Label>
                <User className="absolute right-4 top-3 w-5 h-5 text-[#666666]" />
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: focused.fullName ? '100%' : 0 }}
                transition={{ duration: 0.15 }}
              />
            </motion.div>

            {/* Email */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.3 }}
              className="relative"
            >
              <div className="relative">
                <Input
                  type="email"
                  value={formData.email}
                  onChange={(e) => handleInputChange('email', e.target.value)}
                  onFocus={() => handleFocus('email', true)}
                  onBlur={() => handleFocus('email', false)}
                  className="w-full px-4 py-3 border-0 border-b-2 bg-transparent rounded-none focus:ring-0 transition-colors duration-150 border-[#E0E0E0] focus:border-[#6EC18E]"
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <Label
                  className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                    focused.email || formData.email
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
                animate={{ width: focused.email ? '100%' : 0 }}
                transition={{ duration: 0.15 }}
              />
            </motion.div>

            {/* Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.4 }}
              className="relative"
            >
              <div className="relative">
                <Input
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={(e) => handleInputChange('password', e.target.value)}
                  onFocus={() => handleFocus('password', true)}
                  onBlur={() => handleFocus('password', false)}
                  className="w-full px-4 py-3 border-0 border-b-2 bg-transparent rounded-none focus:ring-0 transition-colors duration-150 pr-20 border-[#E0E0E0] focus:border-[#6EC18E]"
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <Label
                  className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                    focused.password || formData.password
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
                animate={{ width: focused.password ? '100%' : 0 }}
                transition={{ duration: 0.15 }}
              />
            </motion.div>

            {/* Confirm Password */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.5 }}
              className="relative"
            >
              <div className="relative">
                <Input
                  type={showConfirmPassword ? 'text' : 'password'}
                  value={formData.confirmPassword}
                  onChange={(e) => handleInputChange('confirmPassword', e.target.value)}
                  onFocus={() => handleFocus('confirmPassword', true)}
                  onBlur={() => handleFocus('confirmPassword', false)}
                  className="w-full px-4 py-3 border-0 border-b-2 bg-transparent rounded-none focus:ring-0 transition-colors duration-150 pr-20 border-[#E0E0E0] focus:border-[#6EC18E]"
                  placeholder=" "
                  disabled={isSubmitting}
                />
                <Label
                  className={`absolute left-4 transition-all duration-150 pointer-events-none ${
                    focused.confirmPassword || formData.confirmPassword
                      ? 'top-0 text-xs text-[#6EC18E] -translate-y-2'
                      : 'top-3 text-base text-[#666666]'
                  }`}
                >
                  Confirm Password
                </Label>
                <div className="absolute right-4 top-3 flex items-center space-x-2">
                  <button
                    type="button"
                    onClick={() => setShowConfirmPassword(!showConfirmPassword)}
                    className="text-[#666666] hover:text-[#333333] transition-colors"
                    disabled={isSubmitting}
                  >
                    {showConfirmPassword ? <EyeOff className="w-5 h-5" /> : <Eye className="w-5 h-5" />}
                  </button>
                  <Lock className="w-5 h-5 text-[#666666]" />
                </div>
              </div>
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: focused.confirmPassword ? '100%' : 0 }}
                transition={{ duration: 0.15 }}
              />
            </motion.div>

            {/* Terms Checkbox */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.6 }}
              className="flex items-start space-x-3"
            >
              <div className="relative">
                <Checkbox
                  id="terms"
                  checked={termsAccepted}
                  onCheckedChange={handleTermsChange}
                  className="mt-1"
                  disabled={isSubmitting}
                />
                {checkAnimated && termsAccepted && (
                  <motion.div
                    initial={{ scale: 0, rotate: -90 }}
                    animate={{ scale: 1, rotate: 0 }}
                    transition={{ duration: 0.3, type: 'spring' }}
                    className="absolute inset-0 flex items-center justify-center"
                  >
                    <Check className="w-3 h-3 text-white" />
                  </motion.div>
                )}
              </div>
              <Label htmlFor="terms" className="text-sm text-[#666666] leading-relaxed cursor-pointer">
                I agree to the{' '}
                <button type="button" className="text-[#6EC18E] hover:text-[#5BB07F] underline" disabled={isSubmitting}>
                  Terms of Service
                </button>
                {' '}and{' '}
                <button type="button" className="text-[#6EC18E] hover:text-[#5BB07F] underline" disabled={isSubmitting}>
                  Privacy Policy
                </button>
              </Label>
            </motion.div>

            {/* Sign Up Button */}
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.7 }}
              whileHover={{ scale: isSubmitting ? 1 : 1.02 }}
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
                      Creating Account...
                    </>
                  ) : (
                    'Create Account'
                  )}
                </span>
              </Button>
            </motion.div>
          </form>

          {/* Login Link */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.3, delay: 0.8 }}
            className="text-center mt-6"
          >
            <p className="text-sm text-[#666666]">
              Already have an account?{' '}
              <button
                type="button"
                onClick={onNavigateToLogin}
                disabled={isSubmitting}
                className="text-[#6EC18E] hover:text-[#5BB07F] font-medium relative group disabled:opacity-50 disabled:cursor-not-allowed"
              >
                Sign in
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
  );
}