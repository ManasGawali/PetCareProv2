import { Heart, Award, Users, Globe, Star, CheckCircle } from 'lucide-react';

export const teamMembers = [
  {
    id: '1',
    name: 'Sarah Johnson',
    role: 'Founder & CEO',
    image: 'https://images.unsplash.com/photo-1494790108755-2616b612b601?w=200&h=200&fit=crop&crop=face',
    bio: 'Veterinarian with 15+ years of experience, passionate about revolutionizing pet care.',
    social: {
      email: 'sarah@petcarepro.com',
      linkedin: 'sarahjohnson',
      twitter: 'sarahpetcare'
    }
  },
  {
    id: '2',
    name: 'Michael Chen',
    role: 'Head of Operations',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=200&h=200&fit=crop&crop=face',
    bio: 'Former tech executive turned pet industry innovator, ensuring seamless service delivery.',
    social: {
      email: 'michael@petcarepro.com',
      linkedin: 'michaelchen',
      twitter: 'mikeops'
    }
  },
  {
    id: '3',
    name: 'Emily Rodriguez',
    role: 'Lead Veterinarian',
    image: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=200&h=200&fit=crop&crop=face',
    bio: 'Certified veterinary specialist with expertise in emergency care and pet wellness.',
    social: {
      email: 'emily@petcarepro.com',
      linkedin: 'emilyrodriguez',
      twitter: 'dremilyvet'
    }
  },
  {
    id: '4',
    name: 'David Park',
    role: 'Technology Director',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=200&h=200&fit=crop&crop=face',
    bio: 'Full-stack developer building the future of pet care technology and user experiences.',
    social: {
      email: 'david@petcarepro.com',
      linkedin: 'davidpark',
      twitter: 'devdavidpark'
    }
  }
];

export const milestones = [
  {
    year: '2020',
    title: 'Company Founded',
    description: 'Started with a vision to bring professional pet care directly to pet owners\' homes.',
    icon: Heart,
    color: '#6EC18E'
  },
  {
    year: '2021',
    title: 'First 1,000 Customers',
    description: 'Reached our first major milestone with over 1,000 happy pet families served.',
    icon: Users,
    color: '#F4C2C2'
  },
  {
    year: '2022',
    title: 'Licensed & Certified',
    description: 'Achieved full veterinary licensing and professional certification across all services.',
    icon: Award,
    color: '#FFD66B'
  },
  {
    year: '2023',
    title: 'Multi-State Expansion',
    description: 'Expanded operations to serve pet families across 5 states with 24/7 support.',
    icon: Globe,
    color: '#6EC18E'
  },
  {
    year: '2024',
    title: '50,000+ Pets Served',
    description: 'Proudly caring for over 50,000 beloved pets with our professional team.',
    icon: Star,
    color: '#F4C2C2'
  }
];

export const values = [
  {
    title: 'Pet-First Philosophy',
    description: 'Every decision we make puts your pet\'s health, safety, and happiness first.',
    icon: Heart
  },
  {
    title: 'Professional Excellence',
    description: 'Our team consists of licensed, certified, and continuously trained pet care professionals.',
    icon: Award
  },
  {
    title: 'Convenience & Care',
    description: 'We bring premium pet care services directly to your home, on your schedule.',
    icon: CheckCircle
  }
];