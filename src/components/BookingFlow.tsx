import { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Calendar } from './ui/calendar';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Switch } from './ui/switch';
import { Label } from './ui/label';
import { Input } from './ui/input';
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar';
import { Carousel, CarouselContent, CarouselItem, CarouselNext, CarouselPrevious } from './ui/carousel';
import { 
  Scissors, 
  Star, 
  Clock, 
  MapPin, 
  Check, 
  Calendar as CalendarIcon,
  CreditCard,
  Heart,
  Shield,
  Sparkles,
  CheckCircle,
  Plus,
  Minus
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

interface Pet {
  id: string;
  name: string;
  type: string;
  breed: string;
  image: string;
}

const mockPets: Pet[] = [
  { id: '1', name: 'Max', type: 'Dog', breed: 'Golden Retriever', image: 'https://images.unsplash.com/photo-1552053831-71594a27632d?w=100&h=100&fit=crop&crop=faces' },
  { id: '2', name: 'Luna', type: 'Cat', breed: 'Persian', image: 'https://images.unsplash.com/photo-1574144611937-0df059b5ef3e?w=100&h=100&fit=crop&crop=faces' }
];

const addOns = [
  { id: 'nail-trim', name: 'Nail Trimming', price: 1200, description: 'Professional nail trimming and filing' },
  { id: 'ear-cleaning', name: 'Ear Cleaning', price: 960, description: 'Gentle ear cleaning and inspection' },
  { id: 'teeth-brushing', name: 'Teeth Brushing', price: 1440, description: 'Dental hygiene and breath freshening' },
  { id: 'premium-shampoo', name: 'Premium Shampoo', price: 2000, description: 'Organic, hypoallergenic shampoo treatment' }
];

const caregivers = [
  { id: '1', name: 'Sarah Johnson', rating: 4.9, reviews: 156, image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?w=100&h=100&fit=crop&crop=face', experience: '5 years' },
  { id: '2', name: 'Mike Chen', rating: 4.8, reviews: 203, image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face', experience: '3 years' },
  { id: '3', name: 'Emily Davis', rating: 5.0, reviews: 89, image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=100&h=100&fit=crop&crop=face', experience: '7 years' }
];

interface BookingFlowProps {
  service?: {
    id: number;
    title: string;
    description: string;
    price: number;
    duration: string;
    rating: number;
    reviews: number;
    image: string;
    includes: string[];
  };
  onComplete?: () => void;
}

export function BookingFlow({ service, onComplete }: BookingFlowProps) {
  const [currentStep, setCurrentStep] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [selectedTime, setSelectedTime] = useState<string>();
  const [selectedPet, setSelectedPet] = useState<string>();
  const [selectedAddOns, setSelectedAddOns] = useState<string[]>([]);
  const [isProcessing, setIsProcessing] = useState(false);
  const [isComplete, setIsComplete] = useState(false);

  const mockService = service || {
    id: 1,
    title: 'Professional Grooming',
    description: 'Full-service grooming including bath, haircut, nail trimming, and ear cleaning for all breeds.',
    price: 3600,
    duration: '1-2 hours',
    rating: 4.9,
    reviews: 234,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=600&h=400&fit=crop&crop=center',
    includes: ['Full bath & dry', 'Professional haircut', 'Nail trimming', 'Ear cleaning', 'Brush out', 'Health check']
  };

  const images = [
    mockService.image,
    'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=600&h=400&fit=crop&crop=center',
    'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&crop=center'
  ];

  const timeSlots = [
    '9:00 AM', '10:00 AM', '11:00 AM', '12:00 PM',
    '1:00 PM', '2:00 PM', '3:00 PM', '4:00 PM', '5:00 PM'
  ];

  const steps = [
    { number: 1, title: 'Date & Pet', completed: currentStep > 1 },
    { number: 2, title: 'Add-Ons', completed: currentStep > 2 },
    { number: 3, title: 'Payment', completed: currentStep > 3 },
    { number: 4, title: 'Confirmation', completed: isComplete }
  ];

  const calculateTotal = () => {
    const addOnTotal = selectedAddOns.reduce((total, addOnId) => {
      const addOn = addOns.find(a => a.id === addOnId);
      return total + (addOn?.price || 0);
    }, 0);
    return mockService.price + addOnTotal;
  };

  const handleAddOnToggle = (addOnId: string) => {
    setSelectedAddOns(prev =>
      prev.includes(addOnId)
        ? prev.filter(id => id !== addOnId)
        : [...prev, addOnId]
    );
  };

  const handleNextStep = () => {
    if (currentStep < 4) {
      setCurrentStep(currentStep + 1);
    } else if (currentStep === 4) {
      handleBookingComplete();
    }
  };

  const handleBookingComplete = async () => {
    setIsProcessing(true);
    // Simulate payment processing
    await new Promise(resolve => setTimeout(resolve, 2000));
    setIsProcessing(false);
    setIsComplete(true);
    
    // Show confetti effect and redirect after delay
    setTimeout(() => {
      onComplete?.();
    }, 3000);
  };

  const renderStepContent = () => {
    switch (currentStep) {
      case 1:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            {/* Date Selection */}
            <div>
              <Label className="text-base font-semibold mb-3 block">Select Date</Label>
              <Calendar
                mode="single"
                selected={selectedDate}
                onSelect={setSelectedDate}
                disabled={(date) => date < new Date()}
                className="rounded-lg border"
              />
            </div>

            {/* Time Selection */}
            {selectedDate && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3 }}
              >
                <Label className="text-base font-semibold mb-3 block">Select Time</Label>
                <div className="grid grid-cols-3 gap-2">
                  {timeSlots.map((time) => (
                    <Button
                      key={time}
                      variant={selectedTime === time ? "default" : "outline"}
                      size="sm"
                      onClick={() => setSelectedTime(time)}
                      className={selectedTime === time ? "bg-[#6EC18E] hover:bg-[#5BB07F]" : ""}
                    >
                      {time}
                    </Button>
                  ))}
                </div>
              </motion.div>
            )}

            {/* Pet Selection */}
            {selectedDate && selectedTime && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.1 }}
              >
                <Label className="text-base font-semibold mb-3 block">Select Pet</Label>
                <div className="space-y-3">
                  {mockPets.map((pet) => (
                    <div
                      key={pet.id}
                      className={`p-4 rounded-lg border cursor-pointer transition-all ${
                        selectedPet === pet.id
                          ? 'border-[#6EC18E] bg-[#6EC18E]/5'
                          : 'border-[#E0E0E0] hover:border-[#6EC18E]'
                      }`}
                      onClick={() => setSelectedPet(pet.id)}
                    >
                      <div className="flex items-center space-x-3">
                        <Avatar className="w-12 h-12">
                          <AvatarImage src={pet.image} />
                          <AvatarFallback>{pet.name[0]}</AvatarFallback>
                        </Avatar>
                        <div className="flex-1">
                          <h4 className="font-semibold text-[#333333]">{pet.name}</h4>
                          <p className="text-sm text-[#666666]">{pet.breed} • {pet.type}</p>
                        </div>
                        {selectedPet === pet.id && (
                          <CheckCircle className="w-5 h-5 text-[#6EC18E]" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </motion.div>
            )}
          </motion.div>
        );

      case 2:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-base font-semibold mb-3 block">Add-On Services</Label>
              <p className="text-sm text-[#666666] mb-4">
                Enhance your pet's grooming experience with our premium add-on services.
              </p>
              
              <div className="space-y-4">
                {addOns.map((addOn, index) => (
                  <motion.div
                    key={addOn.id}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.2, delay: index * 0.05 }}
                    className="flex items-center justify-between p-4 rounded-lg border border-[#E0E0E0] hover:border-[#6EC18E] transition-colors"
                  >
                    <div className="flex-1">
                      <h4 className="font-semibold text-[#333333]">{addOn.name}</h4>
                      <p className="text-sm text-[#666666]">{addOn.description}</p>
                      <p className="text-sm font-semibold text-[#6EC18E] mt-1">+₹{addOn.price}</p>
                    </div>
                    <Switch
                      checked={selectedAddOns.includes(addOn.id)}
                      onCheckedChange={() => handleAddOnToggle(addOn.id)}
                    />
                  </motion.div>
                ))}
              </div>
            </div>
          </motion.div>
        );

      case 3:
        return (
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -20 }}
            transition={{ duration: 0.3 }}
            className="space-y-6"
          >
            <div>
              <Label className="text-base font-semibold mb-4 block">Payment Information</Label>
              
              <div className="space-y-4">
                <div>
                  <Label htmlFor="cardNumber">Card Number</Label>
                  <Input
                    id="cardNumber"
                    placeholder="1234 5678 9012 3456"
                    className="mt-1"
                  />
                </div>
                
                <div className="grid grid-cols-2 gap-4">
                  <div>
                    <Label htmlFor="expiry">Expiry Date</Label>
                    <Input
                      id="expiry"
                      placeholder="MM/YY"
                      className="mt-1"
                    />
                  </div>
                  <div>
                    <Label htmlFor="cvv">CVV</Label>
                    <Input
                      id="cvv"
                      placeholder="123"
                      className="mt-1"
                    />
                  </div>
                </div>
                
                <div>
                  <Label htmlFor="name">Cardholder Name</Label>
                  <Input
                    id="name"
                    placeholder="John Doe"
                    className="mt-1"
                  />
                </div>
              </div>

              <div className="mt-6 p-4 bg-[#F5F5F5] rounded-lg">
                <div className="flex items-center space-x-2 text-sm text-[#666666]">
                  <Shield className="w-4 h-4" />
                  <span>Your payment information is encrypted and secure</span>
                </div>
              </div>
            </div>
          </motion.div>
        );

      case 4:
        return (
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.3 }}
            className="text-center space-y-6"
          >
            {isComplete ? (
              <>
                <motion.div
                  initial={{ scale: 0 }}
                  animate={{ scale: 1 }}
                  transition={{ duration: 0.5, type: "spring", bounce: 0.5 }}
                  className="w-20 h-20 bg-[#6EC18E] rounded-full flex items-center justify-center mx-auto"
                >
                  <CheckCircle className="w-12 h-12 text-white" />
                </motion.div>
                
                <div>
                  <h3 className="text-2xl font-bold text-[#333333] mb-2">Booking Confirmed!</h3>
                  <p className="text-[#666666]">
                    Your grooming appointment has been successfully booked. 
                    You'll receive a confirmation email shortly.
                  </p>
                </div>

                <div className="bg-[#F5F5F5] rounded-lg p-4 text-left">
                  <h4 className="font-semibold text-[#333333] mb-2">Booking Details</h4>
                  <div className="space-y-1 text-sm text-[#666666]">
                    <p>Service: {mockService.title}</p>
                    <p>Pet: {mockPets.find(p => p.id === selectedPet)?.name}</p>
                    <p>Date: {selectedDate?.toDateString()}</p>
                    <p>Time: {selectedTime}</p>
                    <p>Total: ₹{calculateTotal()}</p>
                  </div>
                </div>
              </>
            ) : (
              <>
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                  className="w-16 h-16 border-4 border-[#6EC18E] border-t-transparent rounded-full mx-auto"
                />
                <div>
                  <h3 className="text-xl font-bold text-[#333333] mb-2">Processing Payment...</h3>
                  <p className="text-[#666666]">Please wait while we confirm your booking.</p>
                </div>
              </>
            )}
          </motion.div>
        );

      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column - Service Details */}
          <div className="lg:col-span-2">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
            >
              <Card className="overflow-hidden">
                {/* Image Carousel */}
                <div className="relative h-80">
                  <Carousel className="w-full h-full">
                    <CarouselContent>
                      {images.map((image, index) => (
                        <CarouselItem key={index}>
                          <div className="relative w-full h-80">
                            <ImageWithFallback
                              src={image}
                              alt={`${mockService.title} ${index + 1}`}
                              className="w-full h-full object-cover"
                            />
                          </div>
                        </CarouselItem>
                      ))}
                    </CarouselContent>
                    <CarouselPrevious className="left-4" />
                    <CarouselNext className="right-4" />
                  </Carousel>
                </div>

                {/* Service Info */}
                <div className="p-6">
                  <div className="flex items-start justify-between mb-4">
                    <div>
                      <h1 className="text-3xl font-bold text-[#333333] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
                        {mockService.title}
                      </h1>
                      <div className="flex items-center space-x-4 text-sm text-[#666666]">
                        <div className="flex items-center">
                          <Star className="w-4 h-4 fill-[#FFD66B] text-[#FFD66B] mr-1" />
                          <span className="font-medium text-[#333333]">{mockService.rating}</span>
                          <span className="ml-1">({mockService.reviews} reviews)</span>
                        </div>
                        <div className="flex items-center">
                          <Clock className="w-4 h-4 mr-1" />
                          {mockService.duration}
                        </div>
                        <div className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          At your home
                        </div>
                      </div>
                    </div>
                    <div className="text-right">
                      <div className="text-3xl font-bold text-[#6EC18E]" style={{ fontFamily: 'var(--font-heading)' }}>
                        ₹{mockService.price}
                      </div>
                      <div className="text-sm text-[#666666]">starting price</div>
                    </div>
                  </div>

                  <p className="text-[#666666] mb-6" style={{ fontFamily: 'var(--font-body)' }}>
                    {mockService.description}
                  </p>

                  {/* What's Included */}
                  <div className="mb-6">
                    <h3 className="text-lg font-semibold text-[#333333] mb-3">What's Included</h3>
                    <div className="grid grid-cols-2 gap-3">
                      {mockService.includes.map((item, index) => (
                        <motion.div
                          key={item}
                          initial={{ opacity: 0, scale: 0.8 }}
                          animate={{ opacity: 1, scale: 1 }}
                          transition={{ duration: 0.2, delay: index * 0.05 }}
                          className="flex items-center space-x-2"
                        >
                          <div className="w-6 h-6 bg-[#6EC18E] rounded-full flex items-center justify-center flex-shrink-0">
                            <Check className="w-4 h-4 text-white" />
                          </div>
                          <span className="text-[#666666]">{item}</span>
                        </motion.div>
                      ))}
                    </div>
                  </div>

                  {/* Caregiver Preview */}
                  <div>
                    <h3 className="text-lg font-semibold text-[#333333] mb-3">Available Caregivers</h3>
                    <div className="flex space-x-4 overflow-x-auto pb-2">
                      {caregivers.map((caregiver, index) => (
                        <motion.div
                          key={caregiver.id}
                          initial={{ opacity: 0, x: 20 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ duration: 0.3, delay: index * 0.1 }}
                          className="flex-shrink-0 p-3 bg-[#F5F5F5] rounded-lg min-w-[200px]"
                        >
                          <div className="flex items-center space-x-3">
                            <Avatar className="w-12 h-12">
                              <AvatarImage src={caregiver.image} />
                              <AvatarFallback>{caregiver.name.split(' ').map(n => n[0]).join('')}</AvatarFallback>
                            </Avatar>
                            <div>
                              <h4 className="font-semibold text-[#333333]">{caregiver.name}</h4>
                              <div className="flex items-center text-sm text-[#666666]">
                                <Star className="w-3 h-3 fill-[#FFD66B] text-[#FFD66B] mr-1" />
                                <span>{caregiver.rating} ({caregiver.reviews})</span>
                              </div>
                              <div className="text-xs text-[#666666]">{caregiver.experience} experience</div>
                            </div>
                          </div>
                        </motion.div>
                      ))}
                    </div>
                  </div>
                </div>
              </Card>
            </motion.div>
          </div>

          {/* Right Column - Booking Sidebar */}
          <div className="lg:col-span-1">
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.3, delay: 0.2 }}
              className="sticky top-32"
            >
              <Card className="p-6">
                {/* Step Indicator */}
                <div className="mb-8">
                  <div className="flex items-center justify-between mb-4">
                    {steps.map((step, index) => (
                      <div key={step.number} className="flex flex-col items-center">
                        <motion.div
                          className={`w-10 h-10 rounded-full flex items-center justify-center text-sm font-semibold transition-all ${
                            step.completed
                              ? 'bg-[#6EC18E] text-white'
                              : currentStep === step.number
                              ? 'bg-[#6EC18E] text-white'
                              : 'bg-[#E0E0E0] text-[#666666]'
                          }`}
                          initial={{ scale: 0.8 }}
                          animate={{ 
                            scale: currentStep === step.number ? [1, 1.1, 1] : 1
                          }}
                          transition={{ duration: 0.3 }}
                        >
                          {step.completed ? (
                            <motion.div
                              initial={{ scale: 0 }}
                              animate={{ scale: 1 }}
                              transition={{ duration: 0.3 }}
                            >
                              <Check className="w-5 h-5" />
                            </motion.div>
                          ) : (
                            step.number
                          )}
                        </motion.div>
                        <span className="text-xs text-[#666666] mt-1">{step.title}</span>
                      </div>
                    ))}
                  </div>
                  
                  {/* Progress Line */}
                  <div className="relative">
                    <div className="absolute top-0 left-0 h-1 bg-[#E0E0E0] rounded-full w-full" />
                    <motion.div
                      className="absolute top-0 left-0 h-1 bg-[#6EC18E] rounded-full"
                      initial={{ width: '0%' }}
                      animate={{ width: `${((currentStep - 1) / (steps.length - 1)) * 100}%` }}
                      transition={{ duration: 0.6, ease: [0.4, 0, 0.2, 1] }}
                    />
                  </div>
                </div>

                {/* Step Content */}
                <div className="mb-6 min-h-[400px]">
                  <AnimatePresence mode="wait">
                    {renderStepContent()}
                  </AnimatePresence>
                </div>

                {/* Price Summary */}
                <div className="border-t border-[#E0E0E0] pt-4 mb-6">
                  <div className="space-y-2">
                    <div className="flex justify-between text-[#666666]">
                      <span>Service</span>
                      <span>₹{mockService.price}</span>
                    </div>
                    {selectedAddOns.map((addOnId) => {
                      const addOn = addOns.find(a => a.id === addOnId);
                      return addOn ? (
                        <div key={addOnId} className="flex justify-between text-[#666666]">
                          <span>{addOn.name}</span>
                          <span>+₹{addOn.price}</span>
                        </div>
                      ) : null;
                    })}
                    <div className="flex justify-between text-lg font-bold text-[#333333] border-t border-[#E0E0E0] pt-2">
                      <span>Total</span>
                      <motion.span
                        key={calculateTotal()}
                        initial={{ scale: 1.1 }}
                        animate={{ scale: 1 }}
                        transition={{ duration: 0.2 }}
                      >
                        ₹{calculateTotal()}
                      </motion.span>
                    </div>
                  </div>
                </div>

                {/* Action Buttons */}
                <div className="space-y-3">
                  <Button
                    onClick={handleNextStep}
                    disabled={
                      (currentStep === 1 && (!selectedDate || !selectedTime || !selectedPet)) ||
                      (currentStep === 4 && (isProcessing || isComplete))
                    }
                    className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden"
                  >
                    <motion.div
                      className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                      initial={{ x: '-100%' }}
                      whileHover={{ x: '100%' }}
                      transition={{ duration: 0.6 }}
                    />
                    <span className="relative z-10">
                      {currentStep === 4 
                        ? isComplete 
                          ? 'Booking Complete'
                          : isProcessing 
                          ? 'Processing...'
                          : 'Confirm & Pay'
                        : 'Continue'
                      }
                    </span>
                  </Button>
                  
                  {currentStep > 1 && !isComplete && (
                    <Button
                      variant="outline"
                      onClick={() => setCurrentStep(currentStep - 1)}
                      className="w-full"
                    >
                      Back
                    </Button>
                  )}
                </div>
              </Card>
            </motion.div>
          </div>
        </div>
      </div>
    </div>
  );
}