import { useState, useEffect } from 'react';
import { motion } from 'motion/react';
import { ArrowLeft, Phone, MessageCircle, X } from 'lucide-react';
import { Button } from './ui/button';
import { Card } from './ui/card';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface ServiceBooking {
  id: string;
  name: string;
  time: string;
  status: 'completed' | 'in-progress' | 'on-the-way' | 'scheduled';
  image: string;
}

const mockBookings: ServiceBooking[] = [
  {
    id: '1',
    name: 'Professional Grooming',
    time: '2:00 PM - 3:30 PM',
    status: 'completed',
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=280&h=200&fit=crop&crop=center'
  },
  {
    id: '2',
    name: 'Bath & Spa Treatment',
    time: '3:45 PM - 4:30 PM',
    status: 'in-progress',
    image: 'https://images.unsplash.com/photo-1582037929124-98dc74942772?w=280&h=200&fit=crop&crop=center'
  },
  {
    id: '3',
    name: 'Nail Trimming',
    time: '4:45 PM - 5:00 PM',
    status: 'on-the-way',
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=280&h=200&fit=crop&crop=center'
  }
];

export function LiveTracking({ onClose }: { onClose?: () => void }) {
  const [eta, setEta] = useState({ minutes: 9, seconds: 16 });
  const [progress, setProgress] = useState(2); // Current step (0-4)

  // ETA Countdown
  useEffect(() => {
    const timer = setInterval(() => {
      setEta(prev => {
        if (prev.seconds > 0) {
          return { ...prev, seconds: prev.seconds - 1 };
        } else if (prev.minutes > 0) {
          return { minutes: prev.minutes - 1, seconds: 59 };
        }
        return prev;
      });
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  const getStatusColor = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'completed': return '#6EC18E';
      case 'in-progress': return '#FFD66B';
      case 'on-the-way': return '#F4C2C2';
      default: return '#E0E0E0';
    }
  };

  const getStatusText = (status: ServiceBooking['status']) => {
    switch (status) {
      case 'completed': return 'Completed';
      case 'in-progress': return 'In Progress';
      case 'on-the-way': return 'On the Way';
      default: return 'Scheduled';
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5]">
      {/* Sticky Top Bar */}
      <motion.div
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.3 }}
        className="sticky top-0 z-50 bg-white shadow-sm border-b border-[#E0E0E0]"
        style={{ height: '80px' }}
      >
        <div className="max-w-7xl mx-auto px-6 h-full flex items-center justify-between">
          {/* Back Arrow */}
          <Button
            variant="ghost"
            size="sm"
            onClick={onClose}
            className="text-[#333333] hover:text-[#6EC18E] hover:bg-[#6EC18E]/10"
          >
            <ArrowLeft className="w-6 h-6" />
          </Button>

          {/* ETA Display */}
          <div className="text-center">
            <motion.div
              key={`${eta.minutes}:${eta.seconds}`}
              initial={{ scale: 1.1, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ duration: 0.3 }}
              className="text-5xl font-bold text-[#333333]"
              style={{ fontFamily: 'var(--font-heading)' }}
            >
              {eta.minutes}:{eta.seconds.toString().padStart(2, '0')}
            </motion.div>
            <p className="text-sm text-[#666666] mt-1">Estimated arrival</p>
          </div>

          <div className="w-10" /> {/* Spacer for centering */}
        </div>

        {/* Progress Bar */}
        <div className="px-6">
          <div className="flex space-x-2 h-2">
            {[0, 1, 2, 3, 4].map((step) => (
              <motion.div
                key={step}
                className="flex-1 rounded-full overflow-hidden bg-[#E0E0E0]"
                initial={{ scaleX: 0 }}
                animate={{ scaleX: 1 }}
                transition={{ duration: 0.3, delay: step * 0.1 }}
              >
                <motion.div
                  className="h-full bg-[#6EC18E]"
                  initial={{ width: '0%' }}
                  animate={{ 
                    width: step <= progress ? '100%' : '0%'
                  }}
                  transition={{ duration: 0.6, delay: 0.5 + step * 0.1 }}
                />
                {step === progress && (
                  <motion.div
                    className="h-full bg-[#6EC18E]"
                    animate={{ 
                      opacity: [0.8, 1, 0.8],
                      scaleY: [1, 1.1, 1]
                    }}
                    transition={{ 
                      duration: 1,
                      repeat: Infinity
                    }}
                  />
                )}
              </motion.div>
            ))}
          </div>
        </div>
      </motion.div>

      {/* Map View */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.2 }}
        className="relative bg-gradient-to-br from-[#6EC18E]/20 to-[#F4C2C2]/20"
        style={{ height: '500px' }}
      >
        {/* Mock Map Background */}
        <div className="absolute inset-0 bg-gradient-to-br from-[#E8F5E8] to-[#F0F8FF] opacity-80" />
        
        {/* Map Grid Pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="w-full h-full" style={{
            backgroundImage: `linear-gradient(rgba(0,0,0,0.1) 1px, transparent 1px),
                             linear-gradient(90deg, rgba(0,0,0,0.1) 1px, transparent 1px)`,
            backgroundSize: '50px 50px'
          }} />
        </div>

        {/* Home Pin */}
        <motion.div
          initial={{ scale: 0, y: 20 }}
          animate={{ scale: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.8 }}
          className="absolute top-20 left-20 bg-[#6EC18E] text-white rounded-full w-12 h-12 flex items-center justify-center shadow-lg"
        >
          🏠
        </motion.div>

        {/* Caregiver Vehicle Marker */}
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.3, delay: 1 }}
          className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2"
        >
          <motion.div
            animate={{ 
              scale: [1, 1.2, 1],
              rotate: [0, 5, -5, 0]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity,
              ease: "easeInOut"
            }}
            className="bg-[#333333] text-white rounded-lg w-16 h-16 flex items-center justify-center shadow-xl"
          >
            🚗
          </motion.div>
          
          {/* Pulse Ring */}
          <motion.div
            className="absolute inset-0 rounded-lg border-2 border-[#6EC18E]"
            animate={{ 
              scale: [1, 1.5, 1],
              opacity: [0.8, 0, 0.8]
            }}
            transition={{ 
              duration: 2,
              repeat: Infinity
            }}
          />
        </motion.div>

        {/* Route Path */}
        <motion.svg
          className="absolute inset-0 w-full h-full pointer-events-none"
          initial={{ pathLength: 0 }}
          animate={{ pathLength: 0.7 }}
          transition={{ duration: 2, delay: 1.2 }}
        >
          <motion.path
            d="M 80 80 Q 300 200 720 250"
            stroke="#6EC18E"
            strokeWidth="3"
            strokeDasharray="8 8"
            fill="none"
            strokeLinecap="round"
          />
        </motion.svg>
      </motion.div>

      {/* Service Summary Panel */}
      <motion.div
        initial={{ y: 240, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, delay: 0.4 }}
        className="bg-white rounded-t-3xl shadow-xl relative z-10"
        style={{ marginTop: '-240px', minHeight: '240px' }}
      >
        <div className="p-6">
          {/* Header */}
          <div className="flex items-center justify-between mb-6">
            <h3 className="text-2xl font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
              Your Booking
            </h3>
            <Button variant="ghost" className="text-[#6EC18E] hover:text-[#5BB07F]">
              <span className="relative">
                View Details
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.15 }}
                />
              </span>
            </Button>
          </div>

          {/* Service Cards */}
          <div className="flex gap-4 overflow-x-auto pb-4 mb-6">
            {mockBookings.map((booking, index) => (
              <motion.div
                key={booking.id}
                initial={{ x: 50, opacity: 0 }}
                animate={{ x: 0, opacity: 1 }}
                transition={{ duration: 0.3, delay: 0.6 + index * 0.1 }}
                className="flex-shrink-0"
                style={{ width: '280px' }}
              >
                <Card className="overflow-hidden border-0 shadow-md">
                  <div className="relative h-20">
                    <ImageWithFallback
                      src={booking.image}
                      alt={booking.name}
                      className="w-full h-full object-cover"
                    />
                    <div className="absolute inset-0 bg-gradient-to-r from-black/50 to-transparent" />
                    <div className="absolute top-2 right-2">
                      <motion.div
                        className="px-3 py-1 rounded-full text-xs font-semibold text-white"
                        style={{ backgroundColor: getStatusColor(booking.status) }}
                        initial={{ width: 0 }}
                        animate={{ width: 'auto' }}
                        transition={{ duration: 0.6, delay: 0.8 + index * 0.1 }}
                      >
                        {getStatusText(booking.status)}
                      </motion.div>
                    </div>
                  </div>
                  <div className="p-4">
                    <h4 className="font-semibold text-[#333333] mb-1">{booking.name}</h4>
                    <p className="text-sm text-[#666666]">{booking.time}</p>
                  </div>
                </Card>
              </motion.div>
            ))}
          </div>

          {/* Caregiver Info */}
          <motion.div
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ duration: 0.3, delay: 1 }}
            className="flex items-center justify-between p-4 bg-[#F5F5F5] rounded-xl"
          >
            <div className="flex items-center space-x-4">
              <div className="relative">
                <Avatar className="w-16 h-16">
                  <AvatarImage src="https://images.unsplash.com/photo-1494790108755-2616b612b601?w=64&h=64&fit=crop&crop=face" />
                  <AvatarFallback>M</AvatarFallback>
                </Avatar>
                <motion.div
                  className="absolute inset-0 rounded-full border-2 border-[#6EC18E]"
                  animate={{ 
                    scale: [1, 1.1, 1],
                    opacity: [0.5, 1, 0.5]
                  }}
                  transition={{ 
                    duration: 2,
                    repeat: Infinity
                  }}
                />
              </div>
              <div>
                <h4 className="font-semibold text-[#333333]">Melissa</h4>
                <p className="text-sm text-[#666666]">is on the way in a Chevrolet Malibu</p>
                <div className="flex items-center mt-1">
                  <div className="w-2 h-2 bg-[#6EC18E] rounded-full mr-2" />
                  <span className="text-xs text-[#6EC18E] font-medium">Available</span>
                </div>
              </div>
            </div>
            
            <div className="flex space-x-2">
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                  <Phone className="w-4 h-4" />
                </Button>
              </motion.div>
              <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                <Button size="sm" variant="outline" className="w-10 h-10 p-0">
                  <MessageCircle className="w-4 h-4" />
                </Button>
              </motion.div>
            </div>
          </motion.div>
        </div>
      </motion.div>

      {/* Floating Cancel Button */}
      <motion.div
        initial={{ scale: 0, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.3, delay: 1.2 }}
        className="fixed bottom-6 left-6"
      >
        <motion.button
          whileHover={{ 
            scale: 1.05,
            boxShadow: "0 8px 25px rgba(231, 76, 60, 0.3)"
          }}
          whileTap={{ scale: 0.95 }}
          className="w-16 h-16 rounded-full bg-white border-2 border-[#E74C3C] text-[#E74C3C] hover:bg-[#E74C3C] hover:text-white transition-all duration-200 flex items-center justify-center shadow-lg group"
        >
          <motion.div
            whileHover={{ rotate: 180 }}
            transition={{ duration: 0.3 }}
          >
            <X className="w-6 h-6" />
          </motion.div>
        </motion.button>
      </motion.div>
    </div>
  );
}