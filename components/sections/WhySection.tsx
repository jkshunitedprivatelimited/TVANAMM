'use client';

import { motion } from 'framer-motion';
import { 
  Building2, 
  Banknote, 
  GraduationCap, 
  Megaphone, 
  ClipboardCheck, 
  TrendingUp 
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Building2: Building2,
  Banknote: Banknote,
  GraduationCap: GraduationCap,
  Megaphone: Megaphone,
  ClipboardCheck: ClipboardCheck,
  TrendingUp: TrendingUp,
};

export interface WhyCard {
  icon: string;
  title: string;
  description: string;
}

const defaultReasons: WhyCard[] = [
  {
    icon: 'Building2',
    title: 'Proven Business Model',
    description: 'Join a winning formula. With 250+ active outlets across India, our business model is tested, refined, and highly profitable.',
  },
  {
    icon: 'Banknote',
    title: 'Affordable Investment',
    description: 'Start your entrepreneurial journey with low setup costs and high return potential designed for rapid breakeven.',
  },
  {
    icon: 'GraduationCap',
    title: 'Full Training & Support',
    description: 'We provide comprehensive training for your staff on crafting all 120+ authentic beverages to perfection.',
  },
  {
    icon: 'Megaphone',
    title: 'Brand & Marketing Support',
    description: 'Benefit from our nationwide brand recognition. We supply ready-to-use marketing assets and localized promotion strategies.',
  },
  {
    icon: 'ClipboardCheck',
    title: 'Operations & Compliance',
    description: 'Run your business smoothly with our detailed standard operating procedures (SOPs) and compliance manuals.',
  },
  {
    icon: 'TrendingUp',
    title: 'Business Growth Support',
    description: 'Your growth is our growth. Enjoy dedicated support from day one from our experienced franchise management team.',
  },
];

export function WhySection({ cards }: { cards?: WhyCard[] }) {
  const displayReasons = cards?.length ? cards : defaultReasons;
  const containerVariants = {
    hidden: { opacity: 0 },
    show: {
      opacity: 1,
      transition: { staggerChildren: 0.1 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 20 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, stiffness: 100 } }
  };

  return (
    <section className="py-20 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            Why Choose T Vanamm?
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
        >
          {displayReasons.map((reason, i) => {
            const IconComponent = ICON_MAP[reason.icon] || Building2;
            return (
              <motion.div 
                key={i}
                variants={cardVariants}
                className="bg-white p-8 rounded-xl shadow-sm hover:shadow-xl hover:shadow-[#006437]/10 transition-all duration-300 border border-gray-100 group"
              >
                <div className="w-14 h-14 bg-[#006437]/10 text-[#006437] rounded-lg flex items-center justify-center mb-6 group-hover:bg-[#006437] group-hover:text-white transition-colors duration-300">
                  <IconComponent size={28} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base">
                  {reason.description}
                </p>
              </motion.div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
