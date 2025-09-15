import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Label } from './ui/label';
import { Switch } from './ui/switch';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Badge } from './ui/badge';
import { Separator } from './ui/separator';
import { 
  User, 
  Phone, 
  Mail, 
  Lock, 
  Edit3, 
  Save, 
  Check, 
  Camera, 
  Calendar, 
  Heart, 
  MapPin, 
  Plus, 
  Home, 
  Building, 
  LogOut,
  Bell,
  MessageSquare,
  Smartphone,
  X
} from 'lucide-react';

interface User {
  email: string;
  password: string;
  fullName: string;
}

interface ProfilePageProps {
  onNavigate: (page: string) => void;
  onSignOut: () => void;
  currentUser?: User | null;
}

const mockAddresses = [
  {
    id: '1',
    name: 'Home',
    type: 'Home',
    address: '123 Oak Street, San Francisco, CA 94102',
    isDefault: true
  },
  {
    id: '2',
    name: 'Work',
    type: 'Work', 
    address: '456 Market Street, Suite 200, San Francisco, CA 94105',
    isDefault: false
  }
];

export function ProfilePage({ onNavigate, onSignOut, currentUser }: ProfilePageProps) {
  const [isEditing, setIsEditing] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [formData, setFormData] = useState({
    fullName: currentUser?.fullName || 'Jane Doe',
    phone: '+1 (555) 123-4567',
    email: currentUser?.email || 'jane.doe@email.com',
    password: '••••••••'
  });
  const [originalData, setOriginalData] = useState(formData);
  const [notifications, setNotifications] = useState({
    email: true,
    sms: false,
    app: true
  });
  const [addresses, setAddresses] = useState(mockAddresses);

  // Update form data when currentUser changes
  useEffect(() => {
    if (currentUser) {
      const newFormData = {
        fullName: currentUser.fullName,
        phone: '+1 (555) 123-4567', // Default phone
        email: currentUser.email,
        password: '••••••••'
      };
      setFormData(newFormData);
      setOriginalData(newFormData);
    }
  }, [currentUser]);

  const handleEditToggle = () => {
    if (isEditing) {
      setFormData(originalData);
    } else {
      setOriginalData(formData);
    }
    setIsEditing(!isEditing);
  };

  const handleSave = async () => {
    setIsSaving(true);
    
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 1500));
    
    setIsSaving(false);
    setSaveSuccess(true);
    setIsEditing(false);
    setOriginalData(formData);
    
    // Reset success state
    setTimeout(() => setSaveSuccess(false), 2000);
  };

  const handleInputChange = (field: string, value: string) => {
    setFormData(prev => ({ ...prev, [field]: value }));
  };

  const handleNotificationChange = (type: string, value: boolean) => {
    setNotifications(prev => ({ ...prev, [type]: value }));
  };

  // Get user initials for avatar fallback
  const getUserInitials = () => {
    if (formData.fullName) {
      return formData.fullName
        .split(' ')
        .map(name => name[0])
        .join('')
        .toUpperCase()
        .slice(0, 2);
    }
    return 'U';
  };

  const quickLinks = [
    { label: 'Edit Profile', icon: Edit3, active: true, action: handleEditToggle },
    { label: 'My Pets', icon: Heart, active: false, action: () => onNavigate('pets') },
    { label: 'My Bookings', icon: Calendar, active: false, action: () => onNavigate('dashboard') },
    { label: 'Saved Services', icon: Heart, active: false, action: () => {} },
    { label: 'Logout', icon: LogOut, active: false, action: onSignOut, isLogout: true }
  ];

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="flex gap-8">
          {/* Left Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3 }}
            className="w-80 flex-shrink-0"
          >
            <Card className="p-6 sticky top-32">
              {/* Avatar Section */}
              <div className="text-center mb-8">
                <motion.div
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ scale: 1, opacity: 1 }}
                  transition={{ duration: 0.6, delay: 0.2 }}
                  className="relative inline-block mb-4"
                >
                  <div className="relative">
                    <Avatar className="w-32 h-32">
                      <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b601?w=128&h=128&fit=crop&crop=face" />
                      <AvatarFallback className="bg-[#6EC18E] text-white text-3xl">
                        {getUserInitials()}
                      </AvatarFallback>
                    </Avatar>
                    
                    {/* Animated Status Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 border-[#6EC18E]"
                      animate={{ 
                        scale: [1, 1.1, 1],
                        opacity: [0.5, 1, 0.5]
                      }}
                      transition={{ 
                        duration: 2, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }}
                    />
                    
                    {/* Camera Icon */}
                    <motion.div
                      className="absolute bottom-2 right-2 w-8 h-8 bg-[#6EC18E] rounded-full flex items-center justify-center cursor-pointer"
                      whileHover={{ scale: 1.1 }}
                      whileTap={{ scale: 0.9 }}
                    >
                      <Camera className="w-4 h-4 text-white" />
                    </motion.div>
                  </div>
                </motion.div>
                
                <motion.button
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.4 }}
                  className="text-[#6EC18E] text-sm relative group"
                >
                  Change Photo
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.15 }}
                  />
                </motion.button>
                
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: 0.3 }}
                  className="mt-4"
                >
                  <h3 className="text-2xl font-bold text-[#333333] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                    {formData.fullName}
                  </h3>
                  <p className="text-sm text-[#666666] font-medium" style={{ fontFamily: 'var(--font-body)' }}>
                    {formData.email}
                  </p>
                </motion.div>
              </div>

              <Separator className="mb-6" />

              {/* Quick Links */}
              <nav className="space-y-2">
                {quickLinks.map((link, index) => {
                  const IconComponent = link.icon;
                  return (
                    <motion.button
                      key={link.label}
                      initial={{ opacity: 0, x: -10 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ duration: 0.2, delay: 0.5 + index * 0.1 }}
                      onClick={link.action}
                      className={`w-full flex items-center space-x-3 p-3 rounded-lg text-left transition-all duration-150 relative group ${
                        link.active 
                          ? 'bg-[#6EC18E]/10 text-[#6EC18E]' 
                          : link.isLogout
                          ? 'text-[#E74C3C] hover:bg-[#E74C3C]/10'
                          : 'text-[#666666] hover:bg-[#F5F5F5] hover:text-[#333333]'
                      }`}
                      whileHover={link.isLogout ? { 
                        scale: 1.02,
                        y: -1
                      } : {}}
                      whileTap={{ scale: 0.98 }}
                    >
                      <IconComponent className="w-5 h-5" />
                      <span className="font-medium">{link.label}</span>
                      
                      {!link.active && !link.isLogout && (
                        <motion.div
                          className="absolute bottom-0 left-3 right-3 h-0.5 bg-[#6EC18E] rounded-full"
                          initial={{ width: 0 }}
                          whileHover={{ width: 'calc(100% - 24px)' }}
                          transition={{ duration: 0.15 }}
                        />
                      )}
                    </motion.button>
                  );
                })}
              </nav>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1 max-w-4xl">
            <div className="space-y-8">
              {/* Personal Info Section */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold text-[#333333] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Personal Information
                </motion.h2>
                
                <Card className="p-6">
                  <div className="flex items-center justify-between mb-6">
                    <h3 className="text-lg font-semibold text-[#333333]">Profile Details</h3>
                    <Button
                      variant={isEditing ? "outline" : "default"}
                      onClick={handleEditToggle}
                      className={isEditing ? "text-[#666666]" : "bg-[#6EC18E] hover:bg-[#5BB07F] text-white"}
                    >
                      {isEditing ? (
                        <>
                          <X className="w-4 h-4 mr-2" />
                          Cancel
                        </>
                      ) : (
                        <>
                          <Edit3 className="w-4 h-4 mr-2" />
                          Edit
                        </>
                      )}
                    </Button>
                  </div>

                  <AnimatePresence mode="wait">
                    <motion.div
                      key={isEditing ? 'editing' : 'viewing'}
                      initial={{ opacity: 0, x: 20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: -20 }}
                      transition={{ duration: 0.2 }}
                      className="grid grid-cols-1 md:grid-cols-2 gap-6"
                    >
                      {/* Full Name */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.1 }}
                      >
                        <Label className="text-sm font-medium text-[#333333] mb-2 flex items-center">
                          <User className="w-4 h-4 mr-2 text-[#666666]" />
                          Full Name
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.fullName}
                            onChange={(e) => handleInputChange('fullName', e.target.value)}
                            className="focus:ring-[#6EC18E] focus:border-[#6EC18E]"
                          />
                        ) : (
                          <p className="text-[#666666] py-2 px-3 bg-[#F5F5F5] rounded-md">{formData.fullName}</p>
                        )}
                      </motion.div>

                      {/* Phone */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 }}
                      >
                        <Label className="text-sm font-medium text-[#333333] mb-2 flex items-center">
                          <Phone className="w-4 h-4 mr-2 text-[#666666]" />
                          Phone Number
                        </Label>
                        {isEditing ? (
                          <Input
                            value={formData.phone}
                            onChange={(e) => handleInputChange('phone', e.target.value)}
                            className="focus:ring-[#6EC18E] focus:border-[#6EC18E]"
                          />
                        ) : (
                          <p className="text-[#666666] py-2 px-3 bg-[#F5F5F5] rounded-md">{formData.phone}</p>
                        )}
                      </motion.div>

                      {/* Email */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.3 }}
                      >
                        <Label className="text-sm font-medium text-[#333333] mb-2 flex items-center">
                          <Mail className="w-4 h-4 mr-2 text-[#666666]" />
                          Email Address
                        </Label>
                        {isEditing ? (
                          <Input
                            type="email"
                            value={formData.email}
                            onChange={(e) => handleInputChange('email', e.target.value)}
                            className="focus:ring-[#6EC18E] focus:border-[#6EC18E]"
                          />
                        ) : (
                          <p className="text-[#666666] py-2 px-3 bg-[#F5F5F5] rounded-md">{formData.email}</p>
                        )}
                      </motion.div>

                      {/* Password */}
                      <motion.div
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.2, delay: 0.4 }}
                      >
                        <Label className="text-sm font-medium text-[#333333] mb-2 flex items-center">
                          <Lock className="w-4 h-4 mr-2 text-[#666666]" />
                          Password
                        </Label>
                        {isEditing ? (
                          <Input
                            type="password"
                            placeholder="Enter new password"
                            className="focus:ring-[#6EC18E] focus:border-[#6EC18E]"
                          />
                        ) : (
                          <p className="text-[#666666] py-2 px-3 bg-[#F5F5F5] rounded-md">{formData.password}</p>
                        )}
                      </motion.div>
                    </motion.div>
                  </AnimatePresence>

                  {isEditing && (
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3 }}
                      className="mt-6 flex justify-end"
                    >
                      <motion.div
                        whileHover={{ scale: 1.02 }}
                        whileTap={{ scale: 0.98 }}
                      >
                        <Button
                          onClick={handleSave}
                          disabled={isSaving}
                          className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden min-w-[120px]"
                        >
                          <AnimatePresence mode="wait">
                            {isSaving ? (
                              <motion.div
                                key="saving"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center"
                              >
                                <motion.div
                                  animate={{ rotate: 360 }}
                                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                                  className="w-4 h-4 border-2 border-white border-t-transparent rounded-full mr-2"
                                />
                                Saving...
                              </motion.div>
                            ) : saveSuccess ? (
                              <motion.div
                                key="success"
                                initial={{ scale: 0 }}
                                animate={{ scale: 1 }}
                                exit={{ scale: 0 }}
                                className="flex items-center"
                              >
                                <Check className="w-4 h-4 mr-2" />
                                Saved!
                              </motion.div>
                            ) : (
                              <motion.div
                                key="save"
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                exit={{ opacity: 0 }}
                                className="flex items-center"
                              >
                                <Save className="w-4 h-4 mr-2" />
                                Save Changes
                              </motion.div>
                            )}
                          </AnimatePresence>
                          
                          {/* Shimmer effect */}
                          <motion.div
                            className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                            initial={{ x: '-100%' }}
                            whileHover={{ x: '100%' }}
                            transition={{ duration: 0.6 }}
                          />
                        </Button>
                      </motion.div>
                    </motion.div>
                  )}
                </Card>
              </motion.div>

              {/* Notification Preferences */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.2 }}
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold text-[#333333] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Notification Preferences
                </motion.h2>
                
                <Card className="p-6">
                  <div className="space-y-6">
                    {[
                      { key: 'email', label: 'Email Notifications', icon: Mail, description: 'Receive updates about your bookings and account' },
                      { key: 'sms', label: 'SMS Notifications', icon: MessageSquare, description: 'Get text messages for urgent updates' },
                      { key: 'app', label: 'App Notifications', icon: Smartphone, description: 'Push notifications when using the mobile app' }
                    ].map((item, index) => {
                      const IconComponent = item.icon;
                      return (
                        <motion.div
                          key={item.key}
                          initial={{ opacity: 0, y: 10 }}
                          animate={{ opacity: 1, y: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex items-center justify-between p-4 rounded-lg border border-[#E0E0E0] hover:border-[#6EC18E]/50 transition-colors"
                        >
                          <div className="flex items-center space-x-4">
                            <div className="w-10 h-10 bg-[#6EC18E]/10 rounded-lg flex items-center justify-center">
                              <IconComponent className="w-5 h-5 text-[#6EC18E]" />
                            </div>
                            <div>
                              <h4 className="font-medium text-[#333333]">{item.label}</h4>
                              <p className="text-sm text-[#666666]">{item.description}</p>
                            </div>
                          </div>
                          
                          <motion.div
                            whileTap={{ scale: 0.95 }}
                          >
                            <Switch
                              checked={notifications[item.key as keyof typeof notifications]}
                              onCheckedChange={(checked) => handleNotificationChange(item.key, checked)}
                              className="data-[state=checked]:bg-[#6EC18E]"
                            />
                          </motion.div>
                        </motion.div>
                      );
                    })}
                  </div>
                </Card>
              </motion.div>

              {/* Address Management */}
              <motion.div
                initial={{ opacity: 0, x: 20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
              >
                <motion.h2
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  transition={{ duration: 0.3 }}
                  className="text-2xl font-bold text-[#333333] mb-6"
                  style={{ fontFamily: 'var(--font-heading)' }}
                >
                  Address Management
                </motion.h2>
                
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {addresses.map((address, index) => (
                    <motion.div
                      key={address.id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.1 }}
                      whileHover={{ y: -2 }}
                      className="group"
                    >
                      <Card className="p-6 hover:shadow-lg transition-shadow duration-300 relative">
                        <div className="flex items-start justify-between mb-4">
                          <div className="flex items-center space-x-3">
                            <div className="w-10 h-10 bg-[#6EC18E]/10 rounded-lg flex items-center justify-center">
                              {address.type === 'Home' ? (
                                <Home className="w-5 h-5 text-[#6EC18E]" />
                              ) : (
                                <Building className="w-5 h-5 text-[#6EC18E]" />
                              )}
                            </div>
                            <div>
                              <h4 className="font-semibold text-[#333333]">{address.name}</h4>
                              <Badge variant={address.isDefault ? "default" : "secondary"} className="text-xs">
                                {address.isDefault ? 'Default' : address.type}
                              </Badge>
                            </div>
                          </div>
                          
                          <motion.button
                            initial={{ opacity: 0, scale: 0.8 }}
                            whileHover={{ opacity: 1, scale: 1 }}
                            className="opacity-0 group-hover:opacity-100 w-8 h-8 bg-[#6EC18E] text-white rounded-full flex items-center justify-center transition-all"
                          >
                            <Edit3 className="w-4 h-4" />
                          </motion.button>
                        </div>
                        
                        <div className="flex items-start space-x-2">
                          <MapPin className="w-4 h-4 text-[#666666] mt-1 flex-shrink-0" />
                          <p className="text-[#666666] text-sm leading-relaxed">{address.address}</p>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                  
                  {/* Add New Address */}
                  <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: addresses.length * 0.1 }}
                    whileHover={{ y: -2, scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    <Card className="p-6 border-2 border-dashed border-[#E0E0E0] hover:border-[#6EC18E] transition-colors duration-300 cursor-pointer min-h-[140px] flex items-center justify-center">
                      <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        transition={{ duration: 0.3 }}
                        className="text-center"
                      >
                        <motion.div
                          whileHover={{ scale: 1.1 }}
                          className="w-12 h-12 bg-[#6EC18E]/10 rounded-full flex items-center justify-center mx-auto mb-3"
                        >
                          <Plus className="w-6 h-6 text-[#6EC18E]" />
                        </motion.div>
                        <h4 className="font-medium text-[#333333] mb-1">Add New Address</h4>
                        <p className="text-sm text-[#666666]">Add your first address</p>
                      </motion.div>
                    </Card>
                  </motion.div>
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}