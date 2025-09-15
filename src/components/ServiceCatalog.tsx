import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { servicesAPI } from '../utils/api';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Badge } from './ui/badge';
import { Slider } from './ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from './ui/select';
import { Checkbox } from './ui/checkbox';
import { Calendar } from './ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from './ui/popover';
import { 
  Filter, 
  ChevronDown, 
  ChevronUp, 
  Scissors, 
  Heart, 
  GraduationCap, 
  Stethoscope, 
  Dog, 
  Bath,
  Star,
  Clock,
  MapPin,
  ChevronLeft,
  ChevronRight
} from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

// Icon mapping for backend services
const iconMap: { [key: string]: any } = {
  'grooming': Scissors,
  'walking': Dog,
  'exercise': Dog,
  'training': GraduationCap,
  'veterinary': Stethoscope,
  'medical': Stethoscope,
  'sitting': Heart,
  'spa': Bath
};

interface ServiceCatalogProps {
  onBookService?: (serviceId: number) => void;
}

export function ServiceCatalog({ onBookService }: ServiceCatalogProps) {
  const [filtersOpen, setFiltersOpen] = useState(false);
  const [priceRange, setPriceRange] = useState([0, 8000]);
  const [selectedPetTypes, setSelectedPetTypes] = useState<string[]>([]);
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [currentPage, setCurrentPage] = useState(1);
  const [selectedDate, setSelectedDate] = useState<Date>();
  const [services, setServices] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  
  const itemsPerPage = 6;
  const totalPages = Math.ceil(services.length / itemsPerPage);
  const currentServices = services.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  // Load services from API
  useEffect(() => {
    loadServices();
  }, []);

  const loadServices = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await servicesAPI.getAll();
      if (response.success) {
        // Transform backend data to match frontend expectations
        const transformedServices = response.data.map((service: any) => ({
          ...service,
          title: service.name,
          icon: iconMap[service.category] || Scissors,
          petTypes: ['dogs', 'cats'], // Default for demo
          availability: 'today', // Default for demo
          duration: service.duration ? `${service.duration} mins` : '60 mins'
        }));
        setServices(transformedServices);
      } else {
        setError('Failed to load services');
      }
    } catch (error) {
      console.error('Error loading services:', error);
      setError('Failed to load services. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const petTypes = [
    { id: 'dogs', label: 'Dogs' },
    { id: 'cats', label: 'Cats' },
    { id: 'rabbits', label: 'Rabbits' },
    { id: 'birds', label: 'Birds' }
  ];

  const categories = [
    { id: 'grooming', label: 'Grooming' },
    { id: 'exercise', label: 'Exercise' },
    { id: 'training', label: 'Training' },
    { id: 'medical', label: 'Medical' },
    { id: 'sitting', label: 'Pet Sitting' }
  ];

  const handlePetTypeChange = (petType: string, checked: boolean) => {
    if (checked) {
      setSelectedPetTypes([...selectedPetTypes, petType]);
    } else {
      setSelectedPetTypes(selectedPetTypes.filter(type => type !== petType));
    }
  };

  const handleCategoryChange = (category: string, checked: boolean) => {
    if (checked) {
      setSelectedCategories([...selectedCategories, category]);
    } else {
      setSelectedCategories(selectedCategories.filter(cat => cat !== category));
    }
  };

  return (
    <div className="min-h-screen bg-[#F5F5F5] pt-24">
      <div className="max-w-7xl mx-auto px-6 py-8">
        {/* Breadcrumb */}
        <motion.nav
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3 }}
          className="mb-8"
        >
          <ol className="flex items-center space-x-2 text-sm text-[#666666]">
            <li>
              <button className="hover:text-[#6EC18E] transition-colors">Home</button>
            </li>
            <li>/</li>
            <li className="text-[#333333] font-medium relative">
              Services
              <motion.div
                className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                initial={{ width: 0 }}
                animate={{ width: '100%' }}
                transition={{ duration: 0.3, delay: 0.2 }}
              />
            </li>
          </ol>
        </motion.nav>

        {/* Page Header */}
        <motion.div
          initial={{ opacity: 0, x: -30 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.3, delay: 0.1 }}
          className="mb-8"
        >
          <h2 className="text-4xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
            Choose a Service
          </h2>
          <p className="text-xl text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
            Professional pet care services delivered to your home
          </p>
        </motion.div>

        <div className="flex gap-8">
          {/* Filters Sidebar */}
          <motion.aside
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.3, delay: 0.2 }}
            className={`w-80 flex-shrink-0 ${filtersOpen ? 'block' : 'hidden lg:block'}`}
          >
            <Card className="p-6 sticky top-32">
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-lg font-semibold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                  Filters
                </h3>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setFiltersOpen(!filtersOpen)}
                  className="lg:hidden"
                >
                  <motion.div
                    animate={{ rotate: filtersOpen ? 180 : 0 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronUp className="w-4 h-4" />
                  </motion.div>
                </Button>
              </div>

              <div className="space-y-6">
                {/* Pet Type Filter */}
                <div>
                  <h4 className="font-medium text-[#333333] mb-3">Pet Type</h4>
                  <div className="space-y-3">
                    {petTypes.map((type, index) => (
                      <motion.div
                        key={type.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={type.id}
                          checked={selectedPetTypes.includes(type.id)}
                          onCheckedChange={(checked) => handlePetTypeChange(type.id, checked as boolean)}
                        />
                        <label htmlFor={type.id} className="text-[#666666] cursor-pointer">
                          {type.label}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Service Category Filter */}
                <div>
                  <h4 className="font-medium text-[#333333] mb-3">Service Category</h4>
                  <div className="space-y-3">
                    {categories.map((category, index) => (
                      <motion.div
                        key={category.id}
                        initial={{ opacity: 0, x: -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ duration: 0.2, delay: 0.2 + index * 0.05 }}
                        className="flex items-center space-x-2"
                      >
                        <Checkbox
                          id={category.id}
                          checked={selectedCategories.includes(category.id)}
                          onCheckedChange={(checked) => handleCategoryChange(category.id, checked as boolean)}
                        />
                        <label htmlFor={category.id} className="text-[#666666] cursor-pointer">
                          {category.label}
                        </label>
                      </motion.div>
                    ))}
                  </div>
                </div>

                {/* Price Range */}
                <div>
                  <h4 className="font-medium text-[#333333] mb-3">Price Range</h4>
                  <div className="px-2">
                    <Slider
                      value={priceRange}
                      onValueChange={setPriceRange}
                      max={8000}
                      min={0}
                      step={200}
                      className="mb-3"
                    />
                    <div className="flex justify-between text-sm text-[#666666]">
                      <span>₹{priceRange[0]}</span>
                      <span>₹{priceRange[1]}</span>
                    </div>
                  </div>
                </div>

                {/* Date Picker */}
                <div>
                  <h4 className="font-medium text-[#333333] mb-3">Preferred Date</h4>
                  <Popover>
                    <PopoverTrigger asChild>
                      <Button variant="outline" className="w-full justify-start text-left">
                        <Calendar className="mr-2 h-4 w-4" />
                        {selectedDate ? selectedDate.toDateString() : "Select date"}
                      </Button>
                    </PopoverTrigger>
                    <PopoverContent className="w-auto p-0" align="start">
                      <Calendar
                        mode="single"
                        selected={selectedDate}
                        onSelect={setSelectedDate}
                        initialFocus
                      />
                    </PopoverContent>
                  </Popover>
                </div>
              </div>
            </Card>
          </motion.aside>

          {/* Main Content */}
          <div className="flex-1">
            {/* Mobile Filter Toggle */}
            <div className="lg:hidden mb-6">
              <Button
                variant="outline"
                onClick={() => setFiltersOpen(!filtersOpen)}
                className="w-full justify-between"
              >
                <div className="flex items-center">
                  <Filter className="w-4 h-4 mr-2" />
                  Filters
                </div>
                <motion.div
                  animate={{ rotate: filtersOpen ? 180 : 0 }}
                  transition={{ duration: 0.15 }}
                >
                  <ChevronDown className="w-4 h-4" />
                </motion.div>
              </Button>
            </div>

            {/* Loading State */}
            {loading && (
              <div className="flex items-center justify-center py-20">
                <motion.div
                  className="w-12 h-12 border-4 border-[#6EC18E] border-t-transparent rounded-full"
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                />
                <span className="ml-4 text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
                  Loading services...
                </span>
              </div>
            )}

            {/* Error State */}
            {error && (
              <div className="text-center py-20">
                <p className="text-red-500 mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  {error}
                </p>
                <Button
                  onClick={loadServices}
                  className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
                >
                  Try Again
                </Button>
              </div>
            )}

            {/* Services Grid */}
            {!loading && !error && (
              <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6 mb-8">
                <AnimatePresence mode="wait">
                  {currentServices.map((service, index) => {
                    const IconComponent = service.icon;
                    return (
                      <motion.div
                        key={`${currentPage}-${service.id}`}
                        initial={{ opacity: 0, scale: 0.9, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.9, y: -20 }}
                        transition={{ 
                          duration: 0.3, 
                          delay: index * 0.05,
                          ease: [0.4, 0, 0.2, 1]
                        }}
                        whileHover={{ 
                          y: -4,
                          transition: { duration: 0.15 }
                        }}
                      >
                        <Card className="overflow-hidden border-0 shadow-md hover:shadow-xl transition-all duration-300 bg-white group cursor-pointer">
                          {/* Image */}
                          <div className="relative h-48 overflow-hidden">
                            <ImageWithFallback
                              src={service.image}
                              alt={service.title || service.name}
                              className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                            />
                            <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                            
                            {/* Icon */}
                            <motion.div
                              className="absolute top-4 right-4 w-12 h-12 bg-[#6EC18E] rounded-full flex items-center justify-center text-white shadow-lg"
                              whileHover={{ scale: 1.1, rotate: 5 }}
                              transition={{ duration: 0.15 }}
                            >
                              <IconComponent className="w-6 h-6" />
                            </motion.div>

                            {/* Availability Badge */}
                            <div className="absolute top-4 left-4">
                              <Badge 
                                variant="secondary" 
                                className={`${
                                  service.availability === 'today' 
                                    ? 'bg-[#6EC18E] text-white' 
                                    : 'bg-white/90 text-[#333333]'
                                }`}
                              >
                                {service.availability === 'today' ? 'Available Today' : 
                                 service.availability === 'tomorrow' ? 'Tomorrow' : 'This Week'}
                              </Badge>
                            </div>

                            {/* Price */}
                            <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                              <span className="text-sm font-semibold text-[#333333]">From ₹{service.price}</span>
                            </div>
                          </div>

                          {/* Content */}
                          <div className="p-6">
                            <div className="flex items-start justify-between mb-3">
                              <h3 className="text-lg font-bold text-[#333333]" style={{ fontFamily: 'var(--font-heading)' }}>
                                {service.title || service.name}
                              </h3>
                              <div className="flex items-center space-x-1 text-sm">
                                <Star className="w-4 h-4 fill-[#FFD66B] text-[#FFD66B]" />
                                <span className="font-medium text-[#333333]">{service.rating}</span>
                                <span className="text-[#666666]">({service.reviews})</span>
                              </div>
                            </div>
                            
                            <p className="text-[#666666] mb-4 line-clamp-2" style={{ fontFamily: 'var(--font-body)' }}>
                              {service.description}
                            </p>
                            
                            <div className="flex items-center justify-between mb-4 text-sm text-[#666666]">
                              <div className="flex items-center">
                                <Clock className="w-4 h-4 mr-1" />
                                {service.duration}
                              </div>
                              <div className="flex items-center">
                                <MapPin className="w-4 h-4 mr-1" />
                                At your home
                              </div>
                            </div>

                            {/* Book Now Button */}
                            <motion.div
                              initial={{ opacity: 0, y: 10 }}
                              animate={{ opacity: 1, y: 0 }}
                              transition={{ duration: 0.3, delay: 0.1 }}
                            >
                              <Button
                                onClick={() => onBookService?.(service.id)}
                                className="w-full bg-[#6EC18E] hover:bg-[#5BB07F] text-white relative overflow-hidden group"
                              >
                                <motion.div
                                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                                  initial={{ x: '-100%' }}
                                  whileHover={{ x: '100%' }}
                                  transition={{ duration: 0.6 }}
                                />
                                <span className="relative z-10">Book Now</span>
                              </Button>
                            </motion.div>
                          </div>
                        </Card>
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}

            {/* Pagination */}
            {!loading && !error && services.length > 0 && totalPages > 1 && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.3 }}
                className="flex items-center justify-center space-x-2"
              >
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.max(1, prev - 1))}
                  disabled={currentPage === 1}
                  className="group"
                >
                  <motion.div
                    whileHover={{ x: -2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </motion.div>
                </Button>
                
                {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                  <Button
                    key={page}
                    variant={currentPage === page ? "default" : "outline"}
                    size="sm"
                    onClick={() => setCurrentPage(page)}
                    className={currentPage === page ? "bg-[#6EC18E] hover:bg-[#5BB07F]" : ""}
                  >
                    {page}
                  </Button>
                ))}
                
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => setCurrentPage(prev => Math.min(totalPages, prev + 1))}
                  disabled={currentPage === totalPages}
                  className="group"
                >
                  <motion.div
                    whileHover={{ x: 2 }}
                    transition={{ duration: 0.15 }}
                  >
                    <ChevronRight className="w-4 h-4" />
                  </motion.div>
                </Button>
              </motion.div>
            )}

            {/* No Services Message */}
            {!loading && !error && services.length === 0 && (
              <div className="text-center py-20">
                <p className="text-[#666666] mb-4" style={{ fontFamily: 'var(--font-body)' }}>
                  No services found. Please check back later.
                </p>
                <Button
                  onClick={loadServices}
                  className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white"
                >
                  Refresh
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}