import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header';
import { Hero } from './components/Hero';
import { ServiceCategories } from './components/ServiceCategories';
import { HowItWorks } from './components/HowItWorks';
import { ServiceCatalog } from './components/ServiceCatalog';
import { BookingFlow } from './components/BookingFlow';
import { BookingDashboard } from './components/BookingDashboard';
import { LiveTracking } from './components/LiveTracking';
import { LoginPage } from './components/LoginPage';
import { SignUpPage } from './components/SignUpPage';
import { PetFoodCatalog } from './components/PetFoodCatalog';
import { PetAccessories } from './components/PetAccessories';
import { AboutPage } from './components/AboutPage';
import { CartPage } from './components/CartPage';
import { ProfilePage } from './components/ProfilePage';
import { LoadingScreen } from './components/LoadingScreen';
import { ErrorBoundary } from './components/ErrorBoundary';
import { Button } from './components/ui/button';
import { ArrowUp } from 'lucide-react';
import { authAPI, cartAPI, healthCheck } from './utils/api.ts';
import { config, isDevelopment } from './src/config/env';

type PageType = 'home' | 'services' | 'booking' | 'dashboard' | 'pets' | 'live-tracking' | 
               'login' | 'signup' | 'food' | 'accessories' | 'about' | 'cart' | 'how-it-works' | 'profile';

interface User {
  id: string;
  email: string;
  fullName: string;
  phone?: string;
  avatar?: string;
  role: string;
  verified: boolean;
}

function App() {
  const [currentPage, setCurrentPage] = useState<PageType>('home');
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState<User | null>(null);
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [selectedServiceId, setSelectedServiceId] = useState<number | null>(null);
  const [cartItemCount, setCartItemCount] = useState(0);
  const [backendHealthy, setBackendHealthy] = useState(true);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Initialize app and check authentication
  useEffect(() => {
    initializeApp();
  }, []);

  // Update cart count when user signs in/out
  useEffect(() => {
    if (isSignedIn) {
      updateCartCount();
    } else {
      setCartItemCount(0);
    }
  }, [isSignedIn]);

  const initializeApp = async () => {
    try {
      setIsLoading(true);

      // Check backend health
      const isHealthy = await healthCheck();
      setBackendHealthy(isHealthy);

      if (!isHealthy) {
        console.warn('Backend is not responding, falling back to demo mode');
        setIsLoading(false);
        return;
      }

      // Try to get current user if token exists
      try {
        const response = await authAPI.getCurrentUser();
        if (response.success && response.data?.user) {
          setCurrentUser(response.data.user);
          setIsSignedIn(true);
        }
      } catch (error) {
        console.log('No valid session found');
        // Clear any invalid tokens
        await authAPI.logout();
      }
    } catch (error) {
      console.error('App initialization error:', error);
      setBackendHealthy(false);
    } finally {
      setIsLoading(false);
    }
  };

  const updateCartCount = async () => {
    try {
      const response = await cartAPI.getCartSummary();
      if (response.success && response.data) {
        setCartItemCount(response.data.totalItems || 0);
      }
    } catch (error) {
      console.error('Failed to update cart count:', error);
    }
  };

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = async (email: string, password: string): Promise<{ success: boolean; error?: string }> => {
    if (!backendHealthy) {
      return { success: false, error: 'Backend service is currently unavailable. Please try again later.' };
    }

    try {
      setIsLoading(true);
      const response = await authAPI.login(email, password);
      
      if (response.success && response.data?.user) {
        setCurrentUser(response.data.user);
        setIsSignedIn(true);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Login failed' };
      }
    } catch (error: any) {
      console.error('Sign in error:', error);
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignUp = async (email: string, password: string, fullName: string): Promise<{ success: boolean; error?: string }> => {
    if (!backendHealthy) {
      return { success: false, error: 'Backend service is currently unavailable. Please try again later.' };
    }

    try {
      setIsLoading(true);
      const response = await authAPI.register({
        email,
        password,
        fullName,
      });
      
      if (response.success && response.data?.user) {
        setCurrentUser(response.data.user);
        setIsSignedIn(true);
        return { success: true };
      } else {
        return { success: false, error: response.message || 'Registration failed' };
      }
    } catch (error: any) {
      console.error('Sign up error:', error);
      return { success: false, error: error.message || 'Network error occurred' };
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignOut = async () => {
    try {
      await authAPI.logout();
    } catch (error) {
      console.error('Sign out error:', error);
    } finally {
      setCurrentUser(null);
      setIsSignedIn(false);
      setCartItemCount(0);
      setCurrentPage('home');
    }
  };

  const handleNavigation = (page: string) => {
    // Show login page for protected routes when not signed in
    if (['dashboard', 'pets', 'booking', 'profile'].includes(page) && !isSignedIn) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page as PageType);
  };

  const handleBookService = (serviceId?: number) => {
    if (serviceId) {
      setSelectedServiceId(serviceId);
    }
    if (!isSignedIn) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage('booking');
  };

  const handleBookingComplete = () => {
    setCurrentPage('dashboard');
    setSelectedServiceId(null);
  };

  const handleShowLiveTracking = () => {
    setCurrentPage('live-tracking');
  };

  const handleAddToCart = async (item: any) => {
    if (!isSignedIn) {
      setCurrentPage('login');
      return;
    }

    try {
      await cartAPI.addToCart(item.id, 1);
      await updateCartCount();
    } catch (error) {
      console.error('Failed to add item to cart:', error);
    }
  };

  const handleUpdateCartItem = async (itemId: string, quantity: number) => {
    try {
      await cartAPI.updateCartItem(itemId, quantity);
      await updateCartCount();
    } catch (error) {
      console.error('Failed to update cart item:', error);
    }
  };

  // Show loading screen during initialization
  if (isLoading) {
    return <LoadingScreen />;
  }

  // Backend health warning
  if (!backendHealthy) {
    return (
      <div className="min-h-screen bg-[#F5F5F5] flex items-center justify-center">
        <div className="max-w-md mx-auto text-center p-8 bg-white rounded-lg shadow-lg">
          <div className="w-16 h-16 bg-[#F4C2C2] rounded-full flex items-center justify-center mx-auto mb-4">
            <span className="text-2xl">⚠️</span>
          </div>
          <h2 className="text-2xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Service Temporarily Unavailable
          </h2>
          <p className="text-[#666666] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
            Our backend service is currently unavailable. Please ensure the backend server is running on port 3001.
          </p>
          <Button
            onClick={() => window.location.reload()}
            className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
          >
            Retry Connection
          </Button>
          <div className="mt-4 text-sm text-[#666666]">
            <p>To start the backend server:</p>
            <div className="bg-[#F5F5F5] p-3 rounded mt-2 text-left space-y-1">
              <code className="block">cd backend</code>
              <code className="block">npm install</code>
              <code className="block">npm run test  # Simple test server</code>
              <div className="text-xs text-gray-500 mt-2">
                Or use: npm run dev (full server)
              </div>
            </div>
            <div className="mt-2 text-xs text-gray-500">
              Expected at: {config.apiUrl}
            </div>
          </div>
        </div>
      </div>
    );
  }

  const renderCurrentPage = () => {
    switch (currentPage) {
      case 'home':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <main>
              <Hero />
              <ServiceCategories />
              <HowItWorks />
              
              {/* Demo Section for Service Catalog */}
              <section className="py-24 bg-white">
                <div className="max-w-4xl mx-auto px-6 text-center">
                  <motion.div
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ duration: 0.6 }}
                  >
                    <h2 className="text-4xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                      Ready to Book a Service?
                    </h2>
                    <p className="text-xl text-[#666666] mb-8" style={{ fontFamily: 'var(--font-body)' }}>
                      Browse our complete catalog of professional pet care services and book your appointment today.
                    </p>
                    <motion.div
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.98 }}
                    >
                      <Button
                        size="lg"
                        onClick={() => handleNavigation('services')}
                        className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-4 text-lg relative overflow-hidden"
                      >
                        <motion.div
                          className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                          initial={{ x: '-100%' }}
                          whileHover={{ x: '100%' }}
                          transition={{ duration: 0.6 }}
                        />
                        <span className="relative z-10">View All Services</span>
                      </Button>
                    </motion.div>
                  </motion.div>
                </div>
              </section>
            </main>
          </motion.div>
        );

      case 'login':
        return (
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: 20 }}
            transition={{ duration: 0.6 }}
          >
            <LoginPage 
              onSignIn={handleSignIn}
              onNavigateToSignUp={() => setCurrentPage('signup')}
              onSignInSuccess={() => setCurrentPage('services')}
            />
          </motion.div>
        );

      case 'signup':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <SignUpPage 
              onSignUp={handleSignUp}
              onNavigateToLogin={() => setCurrentPage('login')}
              onSignUpSuccess={() => setCurrentPage('services')}
            />
          </motion.div>
        );

      case 'services':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.6 }}
          >
            <ServiceCatalog onBookService={handleBookService} />
          </motion.div>
        );

      case 'booking':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingFlow 
              onComplete={handleBookingComplete}
              selectedServiceId={selectedServiceId}
            />
          </motion.div>
        );

      case 'dashboard':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <BookingDashboard onShowLiveTracking={handleShowLiveTracking} />
          </motion.div>
        );

      case 'live-tracking':
        return (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
          >
            <LiveTracking onClose={() => setCurrentPage('dashboard')} />
          </motion.div>
        );

      case 'food':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PetFoodCatalog 
              onAddToCart={handleAddToCart}
              cartItemCount={cartItemCount}
              onViewCart={() => setCurrentPage('cart')}
            />
          </motion.div>
        );

      case 'accessories':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <PetAccessories 
              onAddToCart={handleAddToCart}
              cartItemCount={cartItemCount}
              onViewCart={() => setCurrentPage('cart')}
            />
          </motion.div>
        );

      case 'how-it-works':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <HowItWorks />
          </motion.div>
        );

      case 'about':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <AboutPage />
          </motion.div>
        );

      case 'cart':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <CartPage 
              onUpdateItem={handleUpdateCartItem}
              onContinueShopping={() => setCurrentPage('food')}
              onCartUpdate={updateCartCount}
            />
          </motion.div>
        );

      case 'profile':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
          >
            <ProfilePage 
              onNavigate={handleNavigation}
              onSignOut={handleSignOut}
              currentUser={currentUser}
            />
          </motion.div>
        );

      case 'pets':
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="min-h-screen bg-[#F5F5F5] pt-24"
          >
            <div className="max-w-4xl mx-auto px-6 py-16 text-center">
              <h1 className="text-4xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                My Pets
              </h1>
              <p className="text-xl text-[#666666] mb-8" style={{ fontFamily: 'var(--font-body)' }}>
                This page is coming soon! Manage your pet profiles, medical records, and preferences.
              </p>
              <Button
                onClick={() => setCurrentPage('home')}
                className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
              >
                Back to Home
              </Button>
            </div>
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <ErrorBoundary>
      <div className="min-h-screen bg-white">
        {/* Development Banner */}
        {isDevelopment && config.enableDevTools && (
          <div className="bg-[#FFD66B] text-[#333333] px-4 py-2 text-sm text-center">
            🔧 Development Mode | API: {config.apiUrl} | Backend: {backendHealthy ? 'Connected' : 'Disconnected'}
          </div>
        )}
        <Header 
          currentPage={currentPage === 'live-tracking' ? 'dashboard' : currentPage}
          isSignedIn={isSignedIn}
          onNavigate={handleNavigation}
          onSignIn={() => setCurrentPage('login')}
          onSignOut={handleSignOut}
          cartItemCount={cartItemCount}
          currentUser={currentUser}
        />
        
        <AnimatePresence mode="wait">
          {renderCurrentPage()}
        </AnimatePresence>

        {/* Footer - Only show on home page */}
        {currentPage === 'home' && (
          <motion.footer
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="bg-[#333333] text-white py-16"
          >
            <div className="max-w-7xl mx-auto px-6">
              <motion.div
                initial={{ opacity: 0, y: 30 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6 }}
                className="grid grid-cols-1 md:grid-cols-4 gap-8"
              >
                {/* Company Info */}
                <div className="col-span-1 md:col-span-2">
                  <h3 className="text-2xl font-bold mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                    PetCare Pro Deluxe
                  </h3>
                  <p className="text-gray-300 mb-6 leading-relaxed">
                    Premium at-home pet services delivered by certified professionals. 
                    Your pet's health, happiness, and comfort are our top priorities.
                  </p>
                  <div className="flex space-x-4">
                    <div className="w-8 h-8 bg-[#6EC18E] rounded-full flex items-center justify-center">
                      <span className="text-white text-sm">✓</span>
                    </div>
                    <span className="text-gray-300">Licensed & Insured</span>
                  </div>
                </div>

                {/* Services */}
                <div>
                  <h4 className="font-semibold mb-4">Services</h4>
                  <motion.ul 
                    className="space-y-2 text-gray-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, staggerChildren: 0.1 }}
                  >
                    {['Grooming', 'Dog Walking', 'Pet Sitting', 'Training', 'Veterinary', 'Bath & Spa'].map((service) => (
                      <motion.li 
                        key={service}
                        initial={{ x: -20, opacity: 0 }}
                        whileInView={{ x: 0, opacity: 1 }}
                        className="hover:text-[#6EC18E] transition-colors cursor-pointer"
                        onClick={() => handleNavigation('services')}
                      >
                        {service}
                      </motion.li>
                    ))}
                  </motion.ul>
                </div>

                {/* Contact */}
                <div>
                  <h4 className="font-semibold mb-4">Contact</h4>
                  <motion.div 
                    className="space-y-2 text-gray-300"
                    initial={{ opacity: 0 }}
                    whileInView={{ opacity: 1 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    <p>📞 1-800-PET-CARE</p>
                    <p>✉️ hello@petcarepro.com</p>
                    <p>🕒 24/7 Support Available</p>
                  </motion.div>
                </div>
              </motion.div>

              {/* Newsletter */}
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.4 }}
                className="border-t border-gray-600 pt-8 mt-8 text-center"
              >
                <h4 className="font-semibold mb-4">Stay Updated</h4>
                <div className="flex flex-col sm:flex-row items-center justify-center gap-4 max-w-md mx-auto">
                  <input
                    type="email"
                    placeholder="Enter your email"
                    className="flex-1 px-4 py-2 rounded-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:border-[#6EC18E] focus:outline-none transition-colors"
                  />
                  <Button className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-6 py-2">
                    Subscribe
                  </Button>
                </div>
              </motion.div>

              {/* Copyright */}
              <motion.div
                initial={{ opacity: 0 }}
                whileInView={{ opacity: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.6, delay: 0.6 }}
                className="text-center text-gray-400 text-sm mt-8 pt-8 border-t border-gray-600"
              >
                © 2025 PetCare Pro Deluxe. All rights reserved. Made with ❤️ for pets and their families.
              </motion.div>
            </div>
          </motion.footer>
        )}

        {/* Back to Top Button */}
        <AnimatePresence>
          {showBackToTop && currentPage === 'home' && (
            <motion.button
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 20 }}
              transition={{ duration: 0.3 }}
              onClick={scrollToTop}
              className="fixed bottom-8 right-8 w-12 h-12 bg-[#6EC18E] hover:bg-[#5BB07F] text-white rounded-full shadow-lg flex items-center justify-center z-40 group"
            >
              <motion.div
                whileHover={{ y: -2 }}
                transition={{ duration: 0.15 }}
              >
                <ArrowUp className="w-5 h-5" />
              </motion.div>
            </motion.button>
          )}
        </AnimatePresence>
      </div>
    </ErrorBoundary>
  );
}

export default App;