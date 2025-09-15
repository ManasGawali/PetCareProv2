import { motion } from 'motion/react';
import { LucideIcon } from 'lucide-react';

interface Value {
  title: string;
  description: string;
  icon: LucideIcon;
}

interface ValueItemProps {
  value: Value;
  index: number;
}

export function ValueItem({ value, index }: ValueItemProps) {
  const IconComponent = value.icon;
  
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      className="flex items-start space-x-4"
    >
      <div className="w-12 h-12 bg-[#6EC18E] rounded-lg flex items-center justify-center flex-shrink-0">
        <IconComponent className="w-6 h-6 text-white" />
      </div>
      <div>
        <h3 className="text-lg font-semibold text-[#333333] mb-2">{value.title}</h3>
        <p className="text-[#666666]">{value.description}</p>
      </div>
    </motion.div>
  );
}