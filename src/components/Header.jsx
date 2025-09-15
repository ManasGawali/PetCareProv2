import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { Button } from './ui/button.jsx';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar.jsx';
import { Heart, User, Menu, X, ChevronDown, ShoppingCart } from 'lucide-react';

export function Header({ 
  currentPage = 'home', 
  isSignedIn = false, 
  onNavigate, 
  onSignIn, 
  onSignOut,
  cartItemCount = 0,
  currentUser
}) {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = isSignedIn ? [
    { label: 'Home', key: 'home', href: '#home' },
    { label: 'Services', key: 'services', href: '#services' },
    { label: 'Food', key: 'food', href: '#food' },
    { label: 'Accessories', key: 'accessories', href: '#accessories' },
    { label: 'My Pets', key: 'pets', href: '#pets' },
    { label: 'My Bookings', key: 'dashboard', href: '#dashboard' }
  ] : [
    { label: 'Services', key: 'services', href: '#services' },
    { label: 'Food', key: 'food', href: '#food' },
    { label: 'Accessories', key: 'accessories', href: '#accessories' },
    { label: 'How It Works', key: 'how-it-works', href: '#how-it-works' },
    { label: 'About', key: 'about', href: '#about' }
  ];

  const handleSignOut = () => {
    setIsUserMenuOpen(false);
    onSignOut?.();
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (currentUser?.fullName) {
      return currentUser.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  return (
    <motion.header
      initial={{ y: -80, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
      className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
        isScrolled ? 'bg-white/95 backdrop-blur-sm shadow-sm' : 'bg-transparent'
      }`}
      style={{ height: '80px' }}
    >
      <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
        {/* Logo */}
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.2 }}
          className="flex items-center space-x-3 cursor-pointer"
          onClick={() => onNavigate?.('home')}
        >
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#6EC18E] to-[#4AA06B] flex items-center justify-center">
            <Heart className="w-6 h-6 text-white" />
          </div>
          <span className="text-2xl font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
            PetCare Pro
          </span>
        </motion.div>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center space-x-8">
          {navItems.map((item, index) => (
            <motion.button
              key={item.key}
              onClick={() => onNavigate?.(item.key)}
              initial={{ y: -20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
              className={`relative transition-colors duration-150 group ${
                currentPage === item.key 
                  ? 'text-[#333333] font-semibold' 
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
              style={{ fontFamily: 'var(--font-body)' }}
            >
              {item.label}
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                initial={{ width: currentPage === item.key ? '100%' : 0 }}
                whileHover={{ width: '100%' }}
                transition={{ duration: 0.15 }}
              />
            </motion.button>
          ))}
        </nav>

        {/* Desktop Actions */}
        <div className="hidden md:flex items-center space-x-4">
          {/* Cart Icon */}
          <motion.button
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.3, delay: 0.4 }}
            onClick={() => onNavigate?.('cart')}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="relative p-2 text-[#666666] hover:text-[#333333] transition-colors"
          >
            <ShoppingCart className="w-6 h-6" />
            {cartItemCount > 0 && (
              <motion.div
                initial={{ scale: 0 }}
                animate={{ scale: 1 }}
                className="absolute -top-1 -right-1 w-5 h-5 bg-[#6EC18E] text-white rounded-full flex items-center justify-center text-xs font-bold"
              >
                {cartItemCount}
              </motion.div>
            )}
          </motion.button>

          {isSignedIn && currentUser ? (
            /* User Menu */
            <div className="relative">
              <motion.button
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                onClick={() => setIsUserMenuOpen(!isUserMenuOpen)}
                className="flex items-center space-x-3 p-2 rounded-lg hover:bg-[#F5F5F5] transition-colors group"
              >
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b601?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback className="bg-[#6EC18E] text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[#333333] font-medium">{currentUser.fullName}</span>
                <motion.div
                  animate={{ rotate: isUserMenuOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-4 h-4 text-[#666666] group-hover:text-[#333333]" />
                </motion.div>
              </motion.button>

              {/* Dropdown Menu */}
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ 
                  opacity: isUserMenuOpen ? 1 : 0,
                  y: isUserMenuOpen ? 0 : 10,
                  scale: isUserMenuOpen ? 1 : 0.95,
                  pointerEvents: isUserMenuOpen ? 'auto' : 'none'
                }}
                transition={{ duration: 0.15 }}
                className="absolute top-full right-0 mt-2 w-48 bg-white rounded-lg shadow-lg border border-[#E0E0E0] py-2"
              >
                <button 
                  onClick={() => {
                    onNavigate?.('profile');
                    setIsUserMenuOpen(false);
                  }}
                  className="w-full text-left px-4 py-2 text-[#333333] hover:bg-[#F5F5F5] transition-colors"
                >
                  Profile Settings
                </button>
                <button className="w-full text-left px-4 py-2 text-[#333333] hover:bg-[#F5F5F5] transition-colors">
                  Payment Methods
                </button>
                <button className="w-full text-left px-4 py-2 text-[#333333] hover:bg-[#F5F5F5] transition-colors">
                  Notifications
                </button>
                <hr className="my-2 border-[#E0E0E0]" />
                <button 
                  onClick={handleSignOut}
                  className="w-full text-left px-4 py-2 text-[#E74C3C] hover:bg-[#F5F5F5] transition-colors"
                >
                  Sign Out
                </button>
              </motion.div>
            </div>
          ) : (
            /* Sign In/Up Buttons */
            <>
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.5 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={onSignIn}
                  className="text-[#666666] hover:text-[#333333] hover:bg-[#F5F5F5]"
                >
                  <User className="w-4 h-4 mr-2" />
                  Sign In
                </Button>
              </motion.div>
              
              <motion.div
                initial={{ scale: 0.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 }}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.96 }}
              >
                <Button
                  onClick={() => onNavigate?.('services')}
                  className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden group"
                  size="sm"
                >
                  <motion.div
                    className="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent"
                    initial={{ x: '-100%' }}
                    whileHover={{ x: '100%' }}
                    transition={{ duration: 0.6 }}
                  />
                  Book Now
                </Button>
              </motion.div>
            </>
          )}
        </div>

        {/* Mobile Menu Button */}
        <motion.button
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.3, delay: 0.4 }}
          className="md:hidden text-[#333333] p-2"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </motion.button>
      </div>

      {/* Mobile Menu */}
      <motion.div
        initial={{ opacity: 0, height: 0 }}
        animate={{ 
          opacity: isMobileMenuOpen ? 1 : 0, 
          height: isMobileMenuOpen ? 'auto' : 0 
        }}
        transition={{ duration: 0.3 }}
        className="md:hidden bg-white border-t border-[#E0E0E0] overflow-hidden"
      >
        <div className="px-6 py-4 space-y-4">
          {navItems.map((item) => (
            <button
              key={item.key}
              onClick={() => {
                onNavigate?.(item.key);
                setIsMobileMenuOpen(false);
              }}
              className={`block w-full text-left py-2 ${
                currentPage === item.key 
                  ? 'text-[#333333] font-semibold' 
                  : 'text-[#666666] hover:text-[#333333]'
              }`}
            >
              {item.label}
            </button>
          ))}
          
          {/* Cart Link */}
          <button
            onClick={() => {
              onNavigate?.('cart');
              setIsMobileMenuOpen(false);
            }}
            className="flex items-center w-full text-left py-2 text-[#666666] hover:text-[#333333]"
          >
            <ShoppingCart className="w-4 h-4 mr-2" />
            Cart {cartItemCount > 0 && `(${cartItemCount})`}
          </button>
          
          {isSignedIn && currentUser ? (
            <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
              <div className="flex items-center space-x-3 py-2">
                <Avatar className="w-8 h-8">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b601?w=32&h=32&fit=crop&crop=face" />
                  <AvatarFallback className="bg-[#6EC18E] text-white text-sm">
                    {getUserInitials()}
                  </AvatarFallback>
                </Avatar>
                <span className="text-[#333333] font-medium">{currentUser.fullName}</span>
              </div>
              <button
                onClick={() => {
                  onNavigate?.('profile');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full text-left py-2 text-[#333333] hover:text-[#6EC18E] transition-colors"
              >
                Profile Settings
              </button>
              <Button 
                onClick={handleSignOut}
                variant="outline" 
                className="w-full justify-start text-[#E74C3C] border-[#E74C3C] hover:bg-[#E74C3C] hover:text-white"
              >
                Sign Out
              </Button>
            </div>
          ) : (
            <div className="pt-4 border-t border-[#E0E0E0] space-y-3">
              <Button 
                onClick={() => {
                  onSignIn?.();
                  setIsMobileMenuOpen(false);
                }}
                variant="ghost" 
                className="w-full justify-start"
              >
                <User className="w-4 h-4 mr-2" />
                Sign In
              </Button>
              <Button 
                onClick={() => {
                  onNavigate?.('services');
                  setIsMobileMenuOpen(false);
                }}
                className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
              >
                Book Now
              </Button>
            </div>
          )}
        </div>
      </motion.div>
    </motion.header>
  );
}