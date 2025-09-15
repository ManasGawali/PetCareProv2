import { motion } from 'motion/react';

export function LoadingScreen() {
  return (
    <div className="fixed inset-0 bg-white z-50 flex items-center justify-center">
      <div className="text-center">
        <motion.div
          className="w-16 h-16 border-4 border-[#6EC18E] border-t-transparent rounded-full mx-auto mb-4"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
        <motion.h2
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.2 }}
          className="text-2xl font-bold text-[#333333] mb-2"
          style={{ fontFamily: 'var(--font-heading)' }}
        >
          PetCare Pro Deluxe
        </motion.h2>
        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.4 }}
          className="text-[#666666]"
          style={{ fontFamily: 'var(--font-body)' }}
        >
          Initializing your pet care platform...
        </motion.p>
      </div>
    </div>
  );
}