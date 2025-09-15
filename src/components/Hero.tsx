import { useState, useEffect } from 'react';
import { motion, useScroll, useTransform } from 'motion/react';
import { Button } from './ui/button';
import { ArrowRight, Play } from 'lucide-react';
import { ImageWithFallback } from './figma/ImageWithFallback';

export function Hero() {
  const [typedText, setTypedText] = useState('');
  const [showCursor, setShowCursor] = useState(true);
  const fullText = 'Premium Pet Care at Your Doorstep';
  
  const { scrollY } = useScroll();
  const backgroundY = useTransform(scrollY, [0, 500], [0, 20]);
  
  useEffect(() => {
    let i = 0;
    const typeTimer = setInterval(() => {
      if (i < fullText.length) {
        setTypedText(fullText.slice(0, i + 1));
        i++;
      } else {
        clearInterval(typeTimer);
        // Start cursor blink
        const cursorTimer = setInterval(() => {
          setShowCursor(prev => !prev);
        }, 500);
        return () => clearInterval(cursorTimer);
      }
    }, 50);
    
    return () => clearInterval(typeTimer);
  }, []);

  return (
    <section className="relative min-h-screen flex items-center justify-center overflow-hidden bg-gradient-to-br from-[#F5F5F5] to-white">
      {/* Parallax Background */}
      <motion.div
        style={{ y: backgroundY }}
        className="absolute inset-0 opacity-20"
      >
        <div className="absolute top-20 left-20 w-32 h-32 rounded-full bg-[#6EC18E]/30 animate-float" />
        <div className="absolute top-40 right-32 w-24 h-24 rounded-full bg-[#F4C2C2]/40 animate-float" style={{ animationDelay: '1s' }} />
        <div className="absolute bottom-32 left-32 w-28 h-28 rounded-full bg-[#FFD66B]/35 animate-float" style={{ animationDelay: '2s' }} />
        <div className="absolute top-1/2 right-20 w-20 h-20 rounded-full bg-[#6EC18E]/25 animate-float" style={{ animationDelay: '0.5s' }} />
      </motion.div>

      {/* Background Illustrations */}
      <div className="absolute inset-0 flex items-center justify-end pr-20 opacity-10">
        <div className="w-96 h-96 relative">
          <ImageWithFallback
            src="https://images.unsplash.com/photo-1601758228041-f3b2795255f1?w=400&h=400&fit=crop&crop=center"
            alt="Pet silhouettes"
            className="w-full h-full object-contain"
          />
        </div>
      </div>

      <div className="relative z-10 max-w-7xl mx-auto px-6 py-32 text-center">
        <div className="max-w-4xl mx-auto">
          {/* Animated Headline */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
            className="mb-8"
          >
            <h1 className="text-5xl md:text-7xl font-bold text-[#333333] mb-4" style={{ fontFamily: 'var(--font-heading)' }}>
              <span className="block">
                {typedText}
                {showCursor && <span className="border-r-2 border-[#6EC18E] animate-pulse ml-1" />}
              </span>
            </h1>
          </motion.div>

          {/* Animated Subheading */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 3.5 }}
            className="text-xl md:text-2xl text-[#666666] mb-12 max-w-3xl mx-auto leading-relaxed"
            style={{ fontFamily: 'var(--font-body)' }}
          >
            Professional grooming, walking, training, and veterinary services delivered right to your home. 
            Your beloved pets deserve the very best care.
          </motion.p>

          {/* Animated CTAs */}
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4 }}
            className="flex flex-col sm:flex-row items-center justify-center gap-6"
          >
            {/* Primary CTA */}
            <motion.div
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                size="lg"
                className="bg-[#6EC18E] hover:bg-[#5BB07F] text-white px-8 py-4 text-lg relative overflow-hidden group border-0"
                style={{ width: '200px', height: '56px' }}
              >
                <motion.div
                  className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent"
                  initial={{ x: '-100%' }}
                  whileHover={{ x: '100%' }}
                  transition={{ duration: 0.6 }}
                />
                <span className="relative z-10 flex items-center">
                  Book Service
                  <ArrowRight className="ml-2 w-5 h-5" />
                </span>
              </Button>
            </motion.div>

            {/* Secondary CTA */}
            <motion.div
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              transition={{ duration: 0.15 }}
            >
              <Button
                variant="ghost"
                size="lg"
                className="text-[#333333] hover:text-[#6EC18E] px-8 py-4 text-lg group relative"
                style={{ width: '200px', height: '56px' }}
              >
                <Play className="mr-2 w-5 h-5" />
                <span className="relative">
                  Watch Demo
                  <motion.div
                    className="absolute bottom-0 left-0 h-0.5 bg-[#6EC18E] rounded-full"
                    initial={{ width: 0 }}
                    whileHover={{ width: '100%' }}
                    transition={{ duration: 0.15 }}
                  />
                </span>
              </Button>
            </motion.div>
          </motion.div>

          {/* Trust Indicators */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 4.5 }}
            className="mt-16 flex flex-col sm:flex-row items-center justify-center gap-8 text-[#666666]"
          >
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#6EC18E] flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Licensed & Insured</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#6EC18E] flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>24/7 Support</span>
            </div>
            <div className="flex items-center space-x-2">
              <div className="w-6 h-6 rounded-full bg-[#6EC18E] flex items-center justify-center">
                <span className="text-white text-sm">✓</span>
              </div>
              <span>Same-Day Service</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}