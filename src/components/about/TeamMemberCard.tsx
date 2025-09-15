import { motion } from 'motion/react';
import { Card } from '../ui/card';
import { Badge } from '../ui/badge';
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar';
import { Mail, Linkedin, Twitter } from 'lucide-react';

interface TeamMember {
  id: string;
  name: string;
  role: string;
  image: string;
  bio: string;
  social: {
    email: string;
    linkedin: string;
    twitter: string;
  };
}

interface TeamMemberCardProps {
  member: TeamMember;
  index: number;
}

export function TeamMemberCard({ member, index }: TeamMemberCardProps) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 30 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      transition={{ duration: 0.3, delay: index * 0.1 }}
      whileHover={{ y: -5 }}
    >
      <Card className="p-6 text-center border-0 shadow-md hover:shadow-xl transition-all duration-300">
        <motion.div
          whileHover={{ scale: 1.05 }}
          transition={{ duration: 0.2 }}
          className="relative mb-4"
        >
          <Avatar className="w-24 h-24 mx-auto">
            <AvatarImage src={member.image} />
            <AvatarFallback className="bg-[#6EC18E] text-white text-xl">
              {member.name.split(' ').map(n => n[0]).join('')}
            </AvatarFallback>
          </Avatar>
          <motion.div
            className="absolute inset-0 rounded-full border-2 border-[#6EC18E] opacity-0"
            whileHover={{ 
              opacity: [0, 1, 0],
              scale: [1, 1.1, 1.2]
            }}
            transition={{ duration: 0.8 }}
          />
        </motion.div>
        
        <h3 className="text-xl font-bold text-[#333333] mb-2" style={{ fontFamily: 'var(--font-heading)' }}>
          {member.name}
        </h3>
        <Badge variant="secondary" className="mb-4">
          {member.role}
        </Badge>
        <p className="text-sm text-[#666666] mb-6 leading-relaxed">
          {member.bio}
        </p>

        {/* Social Links */}
        <div className="flex items-center justify-center space-x-3">
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-[#6EC18E] text-white rounded-full flex items-center justify-center"
          >
            <Mail className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-blue-600 text-white rounded-full flex items-center justify-center"
          >
            <Linkedin className="w-4 h-4" />
          </motion.button>
          <motion.button
            whileHover={{ scale: 1.1 }}
            whileTap={{ scale: 0.9 }}
            className="w-8 h-8 bg-blue-400 text-white rounded-full flex items-center justify-center"
          >
            <Twitter className="w-4 h-4" />
          </motion.button>
        </div>
      </Card>
    </motion.div>
  );
}