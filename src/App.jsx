import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Header } from './components/Header.jsx';
import { Hero } from './components/Hero.jsx';
import { ServiceCategories } from './components/ServiceCategories.jsx';
import { HowItWorks } from './components/HowItWorks.jsx';
import { ServiceCatalog } from './components/ServiceCatalog.jsx';
import { BookingFlow } from './components/BookingFlow.jsx';
import { BookingDashboard } from './components/BookingDashboard.jsx';
import { LiveTracking } from './components/LiveTracking.jsx';
import { LoginPage } from './components/LoginPage.jsx';
import { SignUpPage } from './components/SignUpPage.jsx';
import { PetFoodCatalog } from './components/PetFoodCatalog.jsx';
import { PetAccessories } from './components/PetAccessories.jsx';
import { AboutPage } from './components/AboutPage.jsx';
import { CartPage } from './components/CartPage.jsx';
import { ProfilePage } from './components/ProfilePage.jsx';
import { Button } from './components/ui/button.jsx';
import { ArrowUp } from 'lucide-react';
import { useEffect } from 'react';

// Demo accounts for testing
const DEMO_USERS = [
  {
    email: 'demo@petcarepro.com',
    password: 'demo123',
    fullName: 'Demo User'
  },
  {
    email: 'jane.doe@email.com',
    password: 'password123',
    fullName: 'Jane Doe'
  },
  {
    email: 'john.smith@email.com',
    password: 'mypassword',
    fullName: 'John Smith'
  }
];

export default function App() {
  const [currentPage, setCurrentPage] = useState('home');
  const [showBackToTop, setShowBackToTop] = useState(false);
  const [isSignedIn, setIsSignedIn] = useState(false);
  const [currentUser, setCurrentUser] = useState(null);
  const [registeredUsers, setRegisteredUsers] = useState(DEMO_USERS);
  const [selectedServiceId, setSelectedServiceId] = useState(null);
  const [cartItems, setCartItems] = useState([]);

  // Back to top visibility
  useEffect(() => {
    const handleScroll = () => {
      setShowBackToTop(window.scrollY > 500);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  const handleSignIn = (email, password) => {
    // Find user in registered users
    const user = registeredUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase() && u.password === password
    );

    if (user) {
      setIsSignedIn(true);
      setCurrentUser(user);
      // Navigate to services page with slide-right transition as specified
      setCurrentPage('services');
      return { success: true };
    } else {
      // Check if email exists (wrong password)
      const emailExists = registeredUsers.find(u => 
        u.email.toLowerCase() === email.toLowerCase()
      );
      
      if (emailExists) {
        return { success: false, error: 'Incorrect password. Please try again.' };
      } else {
        return { success: false, error: 'No account found with this email address.' };
      }
    }
  };

  const handleSignUp = (email, password, fullName) => {
    // Check if user already exists
    const existingUser = registeredUsers.find(u => 
      u.email.toLowerCase() === email.toLowerCase()
    );

    if (existingUser) {
      return { success: false, error: 'An account with this email already exists.' };
    }

    // Create new user
    const newUser = {
      email: email.toLowerCase(),
      password,
      fullName
    };

    setRegisteredUsers(prev => [...prev, newUser]);
    setIsSignedIn(true);
    setCurrentUser(newUser);
    setCurrentPage('services');
    return { success: true };
  };

  const handleSignOut = () => {
    setIsSignedIn(false);
    setCurrentUser(null);
    setCurrentPage('home');
  };

  const handleNavigation = (page) => {
    // Show login page for protected routes when not signed in
    // Services page is publicly accessible, only booking requires login
    if (['dashboard', 'pets', 'booking', 'profile'].includes(page) && !isSignedIn) {
      setCurrentPage('login');
      return;
    }
    setCurrentPage(page);
  };

  const handleBookService = (serviceId) => {
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

  const handleAddToCart = (item) => {
    setCartItems(prev => {
      const existingItem = prev.find(i => i.id === item.id);
      if (existingItem) {
        return prev.map(i => i.id === item.id ? { ...i, quantity: i.quantity + 1 } : i);
      }
      return [...prev, { ...item, quantity: 1 }];
    });
  };

  const handleUpdateCartItem = (itemId, quantity) => {
    if (quantity <= 0) {
      setCartItems(prev => prev.filter(item => item.id !== itemId));
    } else {
      setCartItems(prev => prev.map(item => 
        item.id === itemId ? { ...item, quantity } : item
      ));
    }
  };

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
              demoAccounts={DEMO_USERS}
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
            <BookingFlow onComplete={handleBookingComplete} />
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
              cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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
              cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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
              items={cartItems}
              onUpdateItem={handleUpdateCartItem}
              onContinueShopping={() => setCurrentPage('food')}
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
    <div className="min-h-screen bg-white">
      <Header 
        currentPage={currentPage === 'live-tracking' ? 'dashboard' : currentPage}
        isSignedIn={isSignedIn}
        onNavigate={handleNavigation}
        onSignIn={() => setCurrentPage('login')}
        onSignOut={handleSignOut}
        cartItemCount={cartItems.reduce((sum, item) => sum + item.quantity, 0)}
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
  );
}