import { motion } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';
import { TeamMemberCard } from './about/TeamMemberCard';
import { MilestoneItem } from './about/MilestoneItem';
import { ValueItem } from './about/ValueItem';
import { teamMembers, milestones, values } from './constants/aboutData';

export function AboutPage() {
  return (
    <div className="min-h-screen bg-white pt-24">
      {/* Hero Section */}
      <motion.section
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative py-20 overflow-hidden"
      >
        <div className="absolute inset-0">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=1200&h=600&fit=crop&crop=center"
            alt="Happy pets with caregivers"
            className="w-full h-full object-cover"
          />
          <div className="absolute inset-0 bg-gradient-to-r from-black/60 to-black/40" />
        </div>
        
        <div className="relative z-10 max-w-4xl mx-auto px-6 text-center text-white">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
            className="text-5xl md:text-6xl font-bold mb-6"
            style={{ fontFamily: 'var(--font-heading)' }}
          >
            Our Mission is Your Pet's Happiness
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="text-xl md:text-2xl leading-relaxed max-w-3xl mx-auto"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            We're revolutionizing pet care by bringing professional, compassionate services 
            directly to your home, ensuring your beloved companions receive the best care possible.
          </motion.p>
        </div>
      </motion.section>

      {/* Story Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-7xl mx-auto px-6">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
            {/* Image */}
            <motion.div
              initial={{ opacity: 0, x: -50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <div className="relative">
                <ImageWithFallback
                  src="https://images.unsplash.com/photo-1548199973-03cce0bbc87b?w=600&h=400&fit=crop&crop=center"
                  alt="Pet care story"
                  className="w-full h-96 object-cover rounded-2xl shadow-xl"
                />
                <div className="absolute -bottom-6 -right-6 w-32 h-32 bg-[#6EC18E] rounded-2xl flex items-center justify-center">
                  <div className="text-center text-white">
                    <div className="text-2xl font-bold">50k+</div>
                    <div className="text-sm">Pets Served</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content */}
            <motion.div
              initial={{ opacity: 0, x: 50 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6 }}
            >
              <h2 className="text-4xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
                Our Story
              </h2>
              <div className="space-y-4 text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
                <p className="text-lg leading-relaxed">
                  Founded in 2020 by Dr. Sarah Johnson, PetCare Pro began with a simple observation: 
                  pet parents wanted the best care for their companions, but traditional pet care 
                  required stressful trips and long waits.
                </p>
                <p className="text-lg leading-relaxed">
                  We envisioned a world where premium pet care comes to you—where your pets 
                  can receive professional grooming, health check-ups, and specialized care 
                  in the comfort and safety of their own home.
                </p>
                <p className="text-lg leading-relaxed">
                  Today, we're proud to serve thousands of pet families across multiple states, 
                  with a team of licensed professionals who share our passion for exceptional pet care.
                </p>
              </div>

              {/* Values */}
              <div className="mt-8 space-y-4">
                {values.map((value, index) => (
                  <ValueItem key={value.title} value={value} index={index} />
                ))}
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Team Section */}
      <section className="py-20 bg-white">
        <div className="max-w-7xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Meet Our Team
            </h2>
            <p className="text-xl text-[#666666] max-w-3xl mx-auto" style={{ fontFamily: 'var(--font-body)' }}>
              Passionate professionals dedicated to providing exceptional care for your beloved pets.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {teamMembers.map((member, index) => (
              <TeamMemberCard key={member.id} member={member} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* Timeline Section */}
      <section className="py-20 bg-[#F5F5F5]">
        <div className="max-w-4xl mx-auto px-6">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="text-center mb-16"
          >
            <h2 className="text-4xl font-bold text-[#333333] mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Our Journey
            </h2>
            <p className="text-xl text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
              Key milestones in our mission to revolutionize pet care.
            </p>
          </motion.div>

          <div className="relative">
            {/* Timeline Line */}
            <div className="absolute left-1/2 transform -translate-x-1/2 w-1 h-full bg-[#E0E0E0] rounded-full" />

            {milestones.map((milestone, index) => (
              <MilestoneItem key={milestone.year} milestone={milestone} index={index} />
            ))}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-[#333333] text-white">
        <div className="max-w-4xl mx-auto px-6 text-center">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-4xl font-bold mb-6" style={{ fontFamily: 'var(--font-heading)' }}>
              Join Our Team
            </h2>
            <p className="text-xl text-gray-300 mb-8 leading-relaxed" style={{ fontFamily: 'var(--font-body)' }}>
              Are you passionate about pet care? We're always looking for dedicated professionals 
              to join our mission of bringing exceptional care directly to pet families.
            </p>
            <motion.div
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.98 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="border-2 border-white text-white hover:bg-white hover:text-[#333333] px-8 py-4 text-lg relative overflow-hidden group"
              >
                <span className="relative z-10 flex items-center">
                  View Open Positions
                  <motion.div
                    animate={{ x: [0, 4, 0] }}
                    transition={{ duration: 1, repeat: Infinity }}
                    className="ml-2"
                  >
                    <ArrowRight className="w-5 h-5" />
                  </motion.div>
                </span>
                <motion.div
                  className="absolute bottom-0 left-0 h-0.5 bg-white rounded-full"
                  initial={{ width: 0 }}
                  whileHover={{ width: '100%' }}
                  transition={{ duration: 0.15 }}
                />
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>
    </div>
  );
}