import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { LucideIcon } from 'lucide-react';

interface Milestone {
  year: string;
  title: string;
  description: string;
  icon: LucideIcon;
  color: string;
}

interface MilestoneItemProps {
  milestone: Milestone;
  index: number;
}

export function MilestoneItem({ milestone, index }: MilestoneItemProps) {
  const IconComponent = milestone.icon;
  const isEven = index % 2 === 0;
  
  return (
    <motion.div
      initial={{ opacity: 0, x: isEven ? -50 : 50 }}
      whileInView={{ opacity: 1, x: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.6, delay: index * 0.2 }}
      className={`relative flex items-center mb-12 ${
        isEven ? 'flex-row' : 'flex-row-reverse'
      }`}
    >
      {/* Content */}
      <div className={`w-5/12 ${isEven ? 'pr-8 text-right' : 'pl-8 text-left'}`}>
        <Card className="p-6 border-0 shadow-md">
          <div className="flex items-center mb-3">
            <Badge 
              className="text-white font-bold"
              style={{ backgroundColor: milestone.color }}
            >
              {milestone.year}
            </Badge>
          </div>
          <h3 className="text-xl font-bold text-[#333333] mb-3" style={{ fontFamily: 'var(--font-heading)' }}>
            {milestone.title}
          </h3>
          <p className="text-[#666666]" style={{ fontFamily: 'var(--font-body)' }}>
            {milestone.description}
          </p>
        </Card>
      </div>

      {/* Icon */}
      <motion.div
        whileHover={{ scale: 1.1 }}
        className="absolute left-1/2 transform -translate-x-1/2 w-16 h-16 rounded-full flex items-center justify-center shadow-lg z-10"
        style={{ backgroundColor: milestone.color }}
      >
        <IconComponent className="w-8 h-8 text-white" />
      </motion.div>

      {/* Spacer */}
      <div className="w-5/12" />
    </motion.div>
  );
}