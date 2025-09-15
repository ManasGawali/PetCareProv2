import { motion } from 'motion/react';
import { Card } from './ui/card';
import { Button } from './ui/button';
import { Scissors, Heart, GraduationCap, Stethoscope, Dog, Bath } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

const services = [
  {
    id: 1,
    title: 'Professional Grooming',
    description: 'Full-service grooming including bath, haircut, nail trimming, and ear cleaning for all breeds.',
    icon: Scissors,
    image: 'https://images.unsplash.com/photo-1583337130417-3346a1be7dee?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $45',
    duration: '1-2 hours',
    color: '#6EC18E'
  },
  {
    id: 2,
    title: 'Dog Walking & Exercise',
    description: 'Daily walks, park visits, and exercise sessions tailored to your pet\'s energy level and needs.',
    icon: Dog,
    image: 'https://images.unsplash.com/photo-1544717297-fa95b6ee9643?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $25',
    duration: '30-60 mins',
    color: '#F4C2C2'
  },
  {
    id: 3,
    title: 'Pet Training',
    description: 'Behavioral training, obedience classes, and specialized training programs by certified trainers.',
    icon: GraduationCap,
    image: 'https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $65',
    duration: '45-90 mins',
    color: '#FFD66B'
  },
  {
    id: 4,
    title: 'Veterinary Visits',
    description: 'In-home health checkups, vaccinations, and medical consultations with licensed veterinarians.',
    icon: Stethoscope,
    image: 'https://images.unsplash.com/photo-1576013551627-0cc20b96c2a7?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $85',
    duration: '30-45 mins',
    color: '#6EC18E'
  },
  {
    id: 5,
    title: 'Pet Sitting & Care',
    description: 'Overnight care, feeding, medication administration, and companionship while you\'re away.',
    icon: Heart,
    image: 'https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $35/day',
    duration: 'Flexible',
    color: '#F4C2C2'
  },
  {
    id: 6,
    title: 'Bath & Spa Services',
    description: 'Relaxing spa treatments including aromatherapy baths, deep conditioning, and massage.',
    icon: Bath,
    image: 'https://images.unsplash.com/photo-1582037929124-98dc74942772?w=400&h=300&fit=crop&crop=center',
    price: 'Starting at $55',
    duration: '1-1.5 hours',
    color: '#FFD66B'
  }
];

export function ServiceCategories() {
  return (
    <section id="services" className="py-24 bg-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-16"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            Our Premium Services
          </h2>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            From grooming to veterinary care, we provide comprehensive pet services 
            delivered by certified professionals right to your home.
          </p>
        </motion.div>

        {/* Services Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {services.map((service, index) => {
            const IconComponent = service.icon;
            return (
              <motion.div
                key={service.id}
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                whileInView={{ opacity: 1, scale: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ 
                  duration: 0.3, 
                  delay: index * 0.05,
                  ease: [0.4, 0, 0.2, 1]
                }}
                whileHover={{ 
                  y: -4,
                  transition: { duration: 0.15 }
                }}
                whileTap={{ 
                  scale: 0.96,
                  transition: { duration: 0.15 }
                }}
              >
                <Card className="relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-shadow duration-300 bg-white group cursor-pointer">
                  {/* Image */}
                  <div className="relative h-48 overflow-hidden">
                    <ImageWithFallback
                      src={service.image}
                      alt={service.title}
                      className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/50 to-transparent" />
                    
                    {/* Icon */}
                    <motion.div
                      className="absolute top-4 right-4 w-12 h-12 rounded-full flex items-center justify-center text-white shadow-lg"
                      style={{ backgroundColor: service.color }}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      <IconComponent className="w-6 h-6" />
                    </motion.div>

                    {/* Price Badge */}
                    <div className="absolute bottom-4 left-4 bg-white/90 backdrop-blur-sm px-3 py-1 rounded-full">
                      <span className="text-sm font-semibold text-[#333333]">{service.price}</span>
                    </div>
                  </div>

                  {/* Content */}
                  <div className="p-6">
                    <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
                      {service.title}
                    </h3>
                    <p className="text-[#666666] mb-4 line-clamp-3" style={{ fontFamily: 'var(--font-body)' }}>
                      {service.description}
                    </p>
                    
                    <div className="flex items-center justify-between mb-4">
                      <span className="text-sm text-[#666666]">Duration: {service.duration}</span>
                    </div>

                    {/* View Details Link */}
                    <motion.div
                      initial={{ opacity: 0, y: 10 }}
                      whileInView={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: 0.1 }}
                      className="pt-4 border-t border-[#E0E0E0]"
                    >
                      <Button
                        variant="ghost"
                        className="w-full text-[#6EC18E] hover:text-[#5BB07F] hover:bg-[#6EC18E]/10 font-semibold group"
                      >
                        View Details
                        <motion.span
                          className="ml-2 inline-block"
                          whileHover={{ x: 4 }}
                          transition={{ duration: 0.15 }}
                        >
                          →
                        </motion.span>
                      </Button>
                    </motion.div>
                  </div>
                </Card>
              </motion.div>
            );
          })}
        </div>

        {/* CTA Section */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.3 }}
          className="text-center mt-16"
        >
          <p className="text-lg text-[#666666] mb-8">
            Can't find what you're looking for? We offer custom services tailored to your pet's unique needs.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
          >
            <Button
              size="lg"
              className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-4 text-lg relative overflow-hidden"
            >
              <motion.div
                className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                initial={{ x: '-100%' }}
                whileHover={{ x: '100%' }}
                transition={{ duration: 0.6 }}
              />
              <span className="relative z-10">Request Custom Service</span>
            </Button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}