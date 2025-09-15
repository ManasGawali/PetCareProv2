import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Tabs, TabsContent, TabsList, TabsTrigger } from './ui/tabs';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog';
import { Textarea } from './ui/textarea';
import { 
  Calendar,
  Clock,
  MapPin,
  Eye,
  Navigation,
  Star,
  Phone,
  MessageCircle,
  MoreVertical,
  CheckCircle,
  Timer,
  Truck,
  X,
  User,
  Heart,
  Camera,
  FileText
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { LiveTracking } from './LiveTracking';

interface Booking {
  id: string;
  serviceName: string;
  serviceImage: string;
  date: string;
  time: string;
  status: 'upcoming' | 'in-progress' | 'completed' | 'cancelled';
  pet: {
    name: string;
    image: string;
    type: string;
  };
  caregiver: {
    name: string;
    image: string;
    rating: number;
    phone: string;
  };
  price: number;
  address: string;
  duration: string;
  notes?: string;
  serviceDetails?: {
    includes: string[];
    specialInstructions?: string;
    completedTasks?: string[];
    beforePhotos?: string[];
    afterPhotos?: string[];
    caregiverNotes?: string;
  };
}

const mockBookings: Booking[] = [
  {
    id: '1',
    serviceName: 'Professional Grooming',
    serviceImage: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=300&h=200&fit=crop&crop=center',
    date: 'Today',
    time: '2:00 PM - 3:30 PM',
    status: 'in-progress',
    pet: {
      name: 'Max',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=faces',
      type: 'Golden Retriever'
    },
    caregiver: {
      name: 'Sarah Johnson',
      image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face',
      rating: 4.9,
      phone: '+1 (555) 123-4567'
    },
    price: 6000,
    address: '123 Main St, City, State',
    duration: '1.5 hours',
    serviceDetails: {
      includes: ['Full bath & dry', 'Professional haircut', 'Nail trimming', 'Ear cleaning', 'Brush out'],
      specialInstructions: 'Max is sensitive around his paws, please be gentle during nail trimming.'
    }
  },
  {
    id: '2',
    serviceName: 'Dog Walking',
    serviceImage: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=300&h=200&fit=crop&crop=center',
    date: 'Tomorrow',
    time: '10:00 AM - 11:00 AM',
    status: 'upcoming',
    pet: {
      name: 'Max',
      image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=faces',
      type: 'Golden Retriever'
    },
    caregiver: {
      name: 'Mike Chen',
      image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
      rating: 4.8,
      phone: '+1 (555) 987-6543'
    },
    price: 2000,
    address: '123 Main St, City, State',
    duration: '1 hour',
    serviceDetails: {
      includes: ['30-min walk', 'Fresh water refill', 'Basic health check', 'Photo updates'],
      specialInstructions: 'Max loves the park on 5th street. Please take the usual route.'
    }
  },
  {
    id: '3',
    serviceName: 'Pet Training',
    serviceImage: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=300&h=200&fit=crop&crop=center',
    date: 'Dec 20, 2024',
    time: '3:00 PM - 4:30 PM',
    status: 'completed',
    pet: {
      name: 'Luna',
      image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=100&h=100&fit=crop&crop=faces',
      type: 'Persian Cat'
    },
    caregiver: {
      name: 'Emily Davis',
      image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face',
      rating: 5.0,
      phone: '+1 (555) 456-7890'
    },
    price: 5200,
    address: '123 Main St, City, State',
    duration: '1.5 hours',
    serviceDetails: {
      includes: ['Basic obedience training', 'Litter box training', 'Behavioral assessment', 'Training plan'],
      specialInstructions: 'Focus on reducing scratching behavior',
      completedTasks: [
        'Assessed Luna\'s current behavior patterns',
        'Implemented positive reinforcement techniques',
        'Introduced new scratching posts',
        'Provided detailed training schedule for owner'
      ],
      beforePhotos: ['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=200&h=200&fit=crop'],
      afterPhotos: ['https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=200&h=200&fit=crop'],
      caregiverNotes: 'Luna responded very well to the training session. She\'s quite intelligent and picked up the new commands quickly. I recommend continuing with the daily 10-minute practice sessions as outlined in the training plan.'
    }
  }
];

interface BookingDashboardProps {
  onShowLiveTracking?: () => void;
}

export function BookingDashboard({ onShowLiveTracking }: BookingDashboardProps) {
  const [activeTab, setActiveTab] = useState('upcoming');
  const [selectedBooking, setSelectedBooking] = useState<string | null>(null);
  const [showLiveTracking, setShowLiveTracking] = useState(false);
  const [reviewDialogOpen, setReviewDialogOpen] = useState(false);
  const [detailsDialogOpen, setDetailsDialogOpen] = useState(false);
  const [selectedBookingForModal, setSelectedBookingForModal] = useState<Booking | null>(null);
  const [reviewRating, setReviewRating] = useState(5);
  const [reviewText, setReviewText] = useState('');

  const upcomingBookings = mockBookings.filter(b => b.status === 'upcoming' || b.status === 'in-progress');
  const pastBookings = mockBookings.filter(b => b.status === 'completed' || b.status === 'cancelled');

  const getStatusColor = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming': return 'bg-[#FFD66B] text-[#333333]';
      case 'in-progress': return 'bg-[#6EC18E] text-white';
      case 'completed': return 'bg-[#333333] text-white';
      case 'cancelled': return 'bg-[#E74C3C] text-white';
      default: return 'bg-[#E0E0E0] text-[#666666]';
    }
  };

  const getStatusIcon = (status: Booking['status']) => {
    switch (status) {
      case 'upcoming': return <Timer className="w-4 h-4" />;
      case 'in-progress': return <Navigation className="w-4 h-4" />;
      case 'completed': return <CheckCircle className="w-4 h-4" />;
      case 'cancelled': return <div className="w-4 h-4 rounded-full bg-current" />;
      default: return null;
    }
  };

  const handleLiveTrack = (bookingId: string) => {
    setSelectedBooking(bookingId);
    setShowLiveTracking(true);
  };

  const handleShowDetails = (booking: Booking) => {
    setSelectedBookingForModal(booking);
    setDetailsDialogOpen(true);
  };

  const handleShowReview = (booking: Booking) => {
    setSelectedBookingForModal(booking);
    setReviewDialogOpen(true);
  };

  const handleSubmitReview = () => {
    // Here you would typically submit the review to your backend
    console.log('Review submitted:', {
      bookingId: selectedBookingForModal?.id,
      rating: reviewRating,
      review: reviewText
    });
    setReviewDialogOpen(false);
    setReviewText('');
    setReviewRating(5);
    setSelectedBookingForModal(null);
  };

  if (showLiveTracking) {
    return <LiveTracking onClose={() => setShowLiveTracking(false)} />;
  }

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <h1 className="text-4xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            My Bookings
          </h1>
          <p className="text-xl text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
            Manage your pet care appointments and track services in real-time
          </p>
        </motion.div>

        {/* Tabs */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
        >
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid w-full max-w-md grid-cols-2 mb-8">
              <TabsTrigger value="upcoming" className="relative">
                Upcoming
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                  initial={{ width: activeTab === 'upcoming' ? '100%' : 0 }}
                  animate={{ width: activeTab === 'upcoming' ? '100%' : 0 }}
                  transition={{ duration: 0.15 }}
                />
              </TabsTrigger>
              <TabsTrigger value="past" className="relative">
                Past
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                  initial={{ width: activeTab === 'past' ? '100%' : 0 }}
                  animate={{ width: activeTab === 'past' ? '100%' : 0 }}
                  transition={{ duration: 0.15 }}
                />
              </TabsTrigger>
            </TabsList>

            {/* Upcoming Bookings */}
            <TabsContent value="upcoming" className="space-y-6">
              <AnimatePresence>
                {upcomingBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Service Image */}
                          <div className="relative w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={booking.serviceImage}
                              alt={booking.serviceName}
                              className="w-full h-full object-cover"
                            />
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-3">
                              <div>
                                <h3 className="text-xl font-bold text-[#333333] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {booking.serviceName}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-[#666666]">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {booking.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {booking.time}
                                  </div>
                                  <div className="flex items-center">
                                    <MapPin className="w-4 h-4 mr-1" />
                                    At your home
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={`${getStatusColor(booking.status)} flex items-center space-x-1`}>
                                  {getStatusIcon(booking.status)}
                                  <span className="capitalize">{booking.status.replace('-', ' ')}</span>
                                </Badge>
                                <span className="text-xl font-bold text-[#6EC18E]">₹{booking.price}</span>
                              </div>
                            </div>

                            {/* Pet & Caregiver Info */}
                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-4">
                                {/* Pet */}
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={booking.pet.image} />
                                    <AvatarFallback>{booking.pet.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-[#333333]">{booking.pet.name}</p>
                                    <p className="text-xs text-[#666666]">{booking.pet.type}</p>
                                  </div>
                                </div>

                                {/* Caregiver */}
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-8 h-8">
                                    <AvatarImage src={booking.caregiver.image} />
                                    <AvatarFallback>{booking.caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <div>
                                    <p className="text-sm font-medium text-[#333333]">{booking.caregiver.name}</p>
                                    <div className="flex items-center text-xs text-[#666666]">
                                      <Star className="w-3 h-3 fill-[#FFD66B] text-[#FFD66B] mr-1" />
                                      {booking.caregiver.rating}
                                    </div>
                                  </div>
                                </div>
                              </div>

                              {/* Action Buttons */}
                              <div className="flex items-center space-x-2">
                                <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                  <Button 
                                    variant="outline" 
                                    size="sm"
                                    onClick={() => handleShowDetails(booking)}
                                  >
                                    <Eye className="w-4 h-4 mr-2" />
                                    Details
                                  </Button>
                                </motion.div>
                                
                                {booking.status === 'in-progress' && (
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      onClick={() => handleLiveTrack(booking.id)}
                                      className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
                                      size="sm"
                                    >
                                      <Navigation className="w-4 h-4 mr-2" />
                                      Live Track
                                    </Button>
                                  </motion.div>
                                )}

                                {booking.status === 'upcoming' && (
                                  <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
                                    <Button
                                      variant="outline"
                                      size="sm"
                                      className="text-[#6EC18E] border-[#6EC18E] hover:bg-[#6EC18E] hover:text-white"
                                    >
                                      <Phone className="w-4 h-4 mr-2" />
                                      Contact
                                    </Button>
                                  </motion.div>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>

              {upcomingBookings.length === 0 && (
                <motion.div
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="text-center py-16"
                >
                  <div className="w-24 h-24 bg-[#F5F5F5] rounded-full flex items-center justify-center mx-auto mb-4">
                    <Calendar className="w-12 h-12 text-[#666666]" />
                  </div>
                  <h3 className="text-lg font-semibold text-[#333333] mb-2">No upcoming bookings</h3>
                  <p className="text-[#666666] mb-6">Book a service to get started with premium pet care.</p>
                  <Button className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white">
                    Book Service
                  </Button>
                </motion.div>
              )}
            </TabsContent>

            {/* Past Bookings */}
            <TabsContent value="past" className="space-y-6">
              <AnimatePresence>
                {pastBookings.map((booking, index) => (
                  <motion.div
                    key={booking.id}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    exit={{ opacity: 0, y: -20 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{ y: -2 }}
                  >
                    <Card className="overflow-hidden border-0 shadow-md hover:shadow-lg transition-all duration-300 opacity-90">
                      <div className="p-6">
                        <div className="flex items-start space-x-4">
                          {/* Service Image */}
                          <div className="relative w-20 h-20 rounded-lg overflow-hidden flex-shrink-0">
                            <ImageWithFallback
                              src={booking.serviceImage}
                              alt={booking.serviceName}
                              className="w-full h-full object-cover grayscale"
                            />
                          </div>

                          {/* Booking Details */}
                          <div className="flex-1 min-w-0">
                            <div className="flex items-start justify-between mb-2">
                              <div>
                                <h3 className="text-lg font-bold text-[#333333] mb-1" style={{ fontFamily: 'var(--font-heading)' }}>
                                  {booking.serviceName}
                                </h3>
                                <div className="flex items-center space-x-4 text-sm text-[#666666]">
                                  <div className="flex items-center">
                                    <Calendar className="w-4 h-4 mr-1" />
                                    {booking.date}
                                  </div>
                                  <div className="flex items-center">
                                    <Clock className="w-4 h-4 mr-1" />
                                    {booking.time}
                                  </div>
                                </div>
                              </div>
                              <div className="flex items-center space-x-2">
                                <Badge className={getStatusColor(booking.status)}>
                                  {getStatusIcon(booking.status)}
                                  <span className="ml-1 capitalize">{booking.status}</span>
                                </Badge>
                                <span className="text-lg font-bold text-[#666666]">₹{booking.price}</span>
                              </div>
                            </div>

                            <div className="flex items-center justify-between">
                              <div className="flex items-center space-x-3">
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={booking.pet.image} />
                                    <AvatarFallback className="text-xs">{booking.pet.name[0]}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-[#666666]">{booking.pet.name}</span>
                                </div>
                                <div className="flex items-center space-x-2">
                                  <Avatar className="w-6 h-6">
                                    <AvatarImage src={booking.caregiver.image} />
                                    <AvatarFallback className="text-xs">{booking.caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                                  </Avatar>
                                  <span className="text-sm text-[#666666]">{booking.caregiver.name}</span>
                                </div>
                              </div>

                              <div className="flex items-center space-x-2">
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="text-[#666666] hover:text-[#333333]"
                                  onClick={() => handleShowDetails(booking)}
                                >
                                  <Eye className="w-4 h-4 mr-1" />
                                  View
                                </Button>
                                {booking.status === 'completed' && (
                                  <Button 
                                    variant="ghost" 
                                    size="sm" 
                                    className="text-[#6EC18E] hover:text-[#5BB07F]"
                                    onClick={() => handleShowReview(booking)}
                                  >
                                    <Star className="w-4 h-4 mr-1" />
                                    Review
                                  </Button>
                                )}
                              </div>
                            </div>
                          </div>
                        </div>
                      </div>
                    </Card>
                  </motion.div>
                ))}
              </AnimatePresence>
            </TabsContent>
          </Tabs>
        </motion.div>

        {/* Details Dialog */}
        <Dialog open={detailsDialogOpen} onOpenChange={setDetailsDialogOpen}>
          <DialogContent className="max-w-2xl max-h-[80vh] overflow-y-auto">
            <DialogHeader>
              <DialogTitle className="text-2xl font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                Booking Details
              </DialogTitle>
            </DialogHeader>
            
            {selectedBookingForModal && (
              <div className="space-y-6">
                {/* Service Info */}
                <div className="flex items-start space-x-4">
                  <div className="w-24 h-24 rounded-lg overflow-hidden flex-shrink-0">
                    <ImageWithFallback
                      src={selectedBookingForModal.serviceImage}
                      alt={selectedBookingForModal.serviceName}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="flex-1">
                    <h3 className="text-xl font-bold text-[#333333] mb-2">{selectedBookingForModal.serviceName}</h3>
                    <div className="space-y-1 text-sm text-[#666666]">
                      <div className="flex items-center">
                        <Calendar className="w-4 h-4 mr-2" />
                        {selectedBookingForModal.date} at {selectedBookingForModal.time}
                      </div>
                      <div className="flex items-center">
                        <MapPin className="w-4 h-4 mr-2" />
                        {selectedBookingForModal.address}
                      </div>
                      <div className="flex items-center">
                        <Clock className="w-4 h-4 mr-2" />
                        Duration: {selectedBookingForModal.duration}
                      </div>
                    </div>
                  </div>
                  <div className="text-right">
                    <Badge className={getStatusColor(selectedBookingForModal.status)}>
                      {selectedBookingForModal.status.replace('-', ' ')}
                    </Badge>
                    <p className="text-xl font-bold text-[#6EC18E] mt-2">₹{selectedBookingForModal.price}</p>
                  </div>
                </div>

                {/* Pet & Caregiver Info */}
                <div className="grid grid-cols-2 gap-4">
                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <Heart className="w-4 h-4 mr-2 text-[#6EC18E]" />
                      Pet Information
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedBookingForModal.pet.image} />
                        <AvatarFallback>{selectedBookingForModal.pet.name[0]}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#333333]">{selectedBookingForModal.pet.name}</p>
                        <p className="text-sm text-[#666666]">{selectedBookingForModal.pet.type}</p>
                      </div>
                    </div>
                  </Card>

                  <Card className="p-4">
                    <h4 className="font-semibold mb-3 flex items-center">
                      <User className="w-4 h-4 mr-2 text-[#6EC18E]" />
                      Caregiver
                    </h4>
                    <div className="flex items-center space-x-3">
                      <Avatar className="w-12 h-12">
                        <AvatarImage src={selectedBookingForModal.caregiver.image} />
                        <AvatarFallback>{selectedBookingForModal.caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                      </Avatar>
                      <div>
                        <p className="font-medium text-[#333333]">{selectedBookingForModal.caregiver.name}</p>
                        <div className="flex items-center text-sm text-[#666666]">
                          <Star className="w-3 h-3 fill-[#FFD66B] text-[#FFD66B] mr-1" />
                          {selectedBookingForModal.caregiver.rating} rating
                        </div>
                        <p className="text-xs text-[#666666]">{selectedBookingForModal.caregiver.phone}</p>
                      </div>
                    </div>
                  </Card>
                </div>

                {/* Service Details */}
                {selectedBookingForModal.serviceDetails && (
                  <div className="space-y-4">
                    <h4 className="font-semibold text-[#333333] flex items-center">
                      <FileText className="w-4 h-4 mr-2 text-[#6EC18E]" />
                      Service Includes
                    </h4>
                    <div className="grid grid-cols-2 gap-2">
                      {selectedBookingForModal.serviceDetails.includes.map((item, index) => (
                        <div key={index} className="flex items-center space-x-2 text-sm">
                          <CheckCircle className="w-4 h-4 text-[#6EC18E]" />
                          <span>{item}</span>
                        </div>
                      ))}
                    </div>

                    {selectedBookingForModal.serviceDetails.specialInstructions && (
                      <div>
                        <h5 className="font-medium text-[#333333] mb-2">Special Instructions</h5>
                        <p className="text-sm text-[#666666] bg-[#F5F5F5] p-3 rounded-lg">
                          {selectedBookingForModal.serviceDetails.specialInstructions}
                        </p>
                      </div>
                    )}

                    {/* Completed Service Details */}
                    {selectedBookingForModal.status === 'completed' && selectedBookingForModal.serviceDetails.completedTasks && (
                      <div>
                        <h5 className="font-medium text-[#333333] mb-2">Completed Tasks</h5>
                        <div className="space-y-2">
                          {selectedBookingForModal.serviceDetails.completedTasks.map((task, index) => (
                            <div key={index} className="flex items-start space-x-2 text-sm">
                              <CheckCircle className="w-4 h-4 text-[#6EC18E] mt-0.5" />
                              <span>{task}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    )}

                    {/* Photos */}
                    {selectedBookingForModal.status === 'completed' && (selectedBookingForModal.serviceDetails.beforePhotos || selectedBookingForModal.serviceDetails.afterPhotos) && (
                      <div>
                        <h5 className="font-medium text-[#333333] mb-2 flex items-center">
                          <Camera className="w-4 h-4 mr-2" />
                          Service Photos
                        </h5>
                        <div className="grid grid-cols-2 gap-4">
                          {selectedBookingForModal.serviceDetails.beforePhotos && (
                            <div>
                              <p className="text-sm text-[#666666] mb-2">Before</p>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedBookingForModal.serviceDetails.beforePhotos.map((photo, index) => (
                                  <img key={index} src={photo} alt={`Before ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                ))}
                              </div>
                            </div>
                          )}
                          {selectedBookingForModal.serviceDetails.afterPhotos && (
                            <div>
                              <p className="text-sm text-[#666666] mb-2">After</p>
                              <div className="grid grid-cols-2 gap-2">
                                {selectedBookingForModal.serviceDetails.afterPhotos.map((photo, index) => (
                                  <img key={index} src={photo} alt={`After ${index + 1}`} className="w-full h-20 object-cover rounded-lg" />
                                ))}
                              </div>
                            </div>
                          )}
                        </div>
                      </div>
                    )}

                    {/* Caregiver Notes */}
                    {selectedBookingForModal.status === 'completed' && selectedBookingForModal.serviceDetails.caregiverNotes && (
                      <div>
                        <h5 className="font-medium text-[#333333] mb-2">Caregiver Notes</h5>
                        <p className="text-sm text-[#666666] bg-[#F5F5F5] p-3 rounded-lg">
                          {selectedBookingForModal.serviceDetails.caregiverNotes}
                        </p>
                      </div>
                    )}
                  </div>
                )}
              </div>
            )}
          </DialogContent>
        </Dialog>

        {/* Review Dialog */}
        <Dialog open={reviewDialogOpen} onOpenChange={setReviewDialogOpen}>
          <DialogContent className="max-w-md">
            <DialogHeader>
              <DialogTitle className="text-xl font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                Rate Your Experience
              </DialogTitle>
            </DialogHeader>
            
            {selectedBookingForModal && (
              <div className="space-y-6">
                {/* Service & Caregiver Info */}
                <div className="text-center">
                  <h3 className="font-semibold text-[#333333] mb-1">{selectedBookingForModal.serviceName}</h3>
                  <p className="text-sm text-[#666666]">with {selectedBookingForModal.caregiver.name}</p>
                </div>

                {/* Star Rating */}
                <div className="text-center">
                  <p className="text-sm text-[#666666] mb-3">How would you rate this service?</p>
                  <div className="flex justify-center space-x-1">
                    {[1, 2, 3, 4, 5].map((star) => (
                      <button
                        key={star}
                        onClick={() => setReviewRating(star)}
                        className="transition-colors"
                      >
                        <Star 
                          className={`w-8 h-8 ${star <= reviewRating ? 'fill-[#FFD66B] text-[#FFD66B]' : 'text-gray-300'}`} 
                        />
                      </button>
                    ))}
                  </div>
                </div>

                {/* Review Text */}
                <div>
                  <label className="text-sm font-medium text-[#333333] mb-2 block">
                    Share your experience (optional)
                  </label>
                  <Textarea
                    value={reviewText}
                    onChange={(e) => setReviewText(e.target.value)}
                    placeholder="Tell others about your experience with this service..."
                    className="min-h-[100px]"
                  />
                </div>

                {/* Submit Button */}
                <div className="flex space-x-3">
                  <Button
                    variant="outline"
                    onClick={() => {
                      setReviewDialogOpen(false);
                      setReviewText('');
                      setReviewRating(5);
                      setSelectedBookingForModal(null);
                    }}
                    className="flex-1"
                  >
                    Cancel
                  </Button>
                  <Button
                    onClick={handleSubmitReview}
                    className="flex-1 bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
                  >
                    Submit Review
                  </Button>
                </div>
              </div>
            )}
          </DialogContent>
        </Dialog>
      </div>
    </div>
  );
}