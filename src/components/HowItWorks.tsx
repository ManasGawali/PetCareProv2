import { motion } from 'motion/react';
import { Calendar, MapPin, Heart, CheckCircle } from 'lucide-react';

const steps = [
  {
    id: 1,
    title: 'Book Your Service',
    description: 'Choose from our range of professional pet care services and select your preferred time slot.',
    icon: Calendar,
    color: '#6EC18E'
  },
  {
    id: 2,
    title: 'We Come to You',
    description: 'Our certified professionals arrive at your doorstep with all necessary equipment and supplies.',
    icon: MapPin,
    color: '#F4C2C2'
  },
  {
    id: 3,
    title: 'Premium Care Delivered',
    description: 'Your pet receives personalized, professional care in the comfort and safety of your own home.',
    icon: Heart,
    color: '#FFD66B'
  }
];

export function HowItWorks() {
  return (
    <section id="how-it-works" className="py-24 bg-[#F5F5F5]">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="text-center mb-20"
        >
          <h2 className="text-4xl md:text-5xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
            How It Works
          </h2>
          <p className="text-xl text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
            Getting premium pet care has never been easier. Just three simple steps 
            to give your pet the best care possible.
          </p>
        </motion.div>

        {/* Steps Container */}
        <div className="relative">
          {/* Connecting Line */}
          <div className="hidden md:block absolute top-20 left-1/2 transform -translate-x-1/2 w-full max-w-4xl">
            <svg className="w-full h-2" viewBox="0 0 800 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <motion.path
                d="M40 4 L760 4"
                stroke="#E0E0E0"
                strokeWidth="2"
                strokeDasharray="8 8"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 1.5, delay: 0.5, ease: [0.4, 0, 0.2, 1] }}
              />
              <motion.path
                d="M40 4 L760 4"
                stroke="#6EC18E"
                strokeWidth="2"
                strokeLinecap="round"
                initial={{ pathLength: 0 }}
                whileInView={{ pathLength: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 2, delay: 1, ease: [0.4, 0, 0.2, 1] }}
              />
            </svg>
          </div>

          {/* Steps Grid */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8">
            {steps.map((step, index) => {
              const IconComponent = step.icon;
              return (
                <motion.div
                  key={step.id}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ 
                    duration: 0.3, 
                    delay: index * 0.05,
                    ease: [0.4, 0, 0.2, 1]
                  }}
                  className="text-center relative"
                >
                  {/* Step Circle */}
                  <motion.div
                    className="relative mx-auto mb-6 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    whileInView={{ scale: [0, 1.2, 1] }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.2 + index * 0.05,
                      times: [0, 0.6, 1]
                    }}
                  >
                    {/* Background Circle */}
                    <div 
                      className="w-20 h-20 rounded-full flex items-center justify-center shadow-lg relative z-10"
                      style={{ backgroundColor: step.color }}
                    >
                      <IconComponent className="w-10 h-10 text-white" />
                    </div>
                    
                    {/* Step Number */}
                    <motion.div
                      className="absolute -top-2 -right-2 w-8 h-8 bg-[#333333] text-white rounded-full flex items-center justify-center text-sm font-bold z-20"
                      initial={{ scale: 0, rotate: -45 }}
                      whileInView={{ scale: 1, rotate: 0 }}
                      viewport={{ once: true }}
                      transition={{ 
                        duration: 0.3,
                        delay: 0.4 + index * 0.05
                      }}
                    >
                      {step.id}
                    </motion.div>

                    {/* Pulse Ring */}
                    <motion.div
                      className="absolute inset-0 rounded-full border-2 opacity-30"
                      style={{ borderColor: step.color }}
                      animate={{ 
                        scale: [1, 1.3, 1],
                        opacity: [0.3, 0, 0.3]
                      }}
                      transition={{ 
                        duration: 2,
                        repeat: Infinity,
                        delay: index * 0.5
                      }}
                    />
                  </motion.div>

                  {/* Content */}
                  <motion.div
                    initial={{ opacity: 0, y: 10 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ 
                      duration: 0.3,
                      delay: 0.3 + index * 0.05
                    }}
                  >
                    <h3 className="text-2xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
                      {step.title}
                    </h3>
                    <p className="text-[#666666] leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
                      {step.description}
                    </p>
                  </motion.div>
                </motion.div>
              );
            })}
          </div>
        </div>

        {/* Bottom CTA */}
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6, delay: 0.8 }}
          className="text-center mt-16 p-8 bg-white rounded-2xl shadow-lg"
        >
          <div className="flex items-center justify-center mb-4">
            <CheckCircle className="w-8 h-8 text-[#6EC18E] mr-3" />
            <span className="text-lg font-semibold text-[#333333]">Ready to get started?</span>
          </div>
          <p className="text-[#666666] mb-6">
            Join thousands of happy pet parents who trust PetCare Pro for their beloved companions.
          </p>
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.98 }}
            className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-3 rounded-lg font-semibold transition-colors duration-200"
          >
            Book Your First Service
          </motion.button>
        </motion.div>
      </div>
    </section>
  );
}