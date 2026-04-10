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
///checking the main branch

const ICON_MAP: Record<string, React.ElementType> = {
  Building2: Building2,
  Banknote: Banknote,
  GraduationCap: GraduationCap,
  Megaphone: Megaphone,
  ClipboardCheck: ClipboardCheck,
  TrendingUp: TrendingUp,
};
// checking the main production 
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
      transition: { staggerChildren: 0.15 }
    }
  };

  const cardVariants = {
    hidden: { opacity: 0, y: 30 },
    show: { opacity: 1, y: 0, transition: { type: "spring" as const, bounce: 0.4, duration: 0.8 } }
  };

  return (
    <section className="py-24 relative overflow-hidden bg-gray-50/50">
      <div className="absolute top-0 inset-x-0 h-px bg-gradient-to-r from-transparent via-primary/20 to-transparent" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
          >
            Why Choose T Vanamm?
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-accent mx-auto rounded-full" 
          />
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-50px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10"
        >
          {displayReasons.map((reason, i) => {
            const IconComponent = ICON_MAP[reason.icon] || Building2;
            return (
              <motion.div 
                key={i}
                variants={cardVariants}
                className="bg-white p-8 lg:p-10 rounded-2xl shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-gray-100 group relative overflow-hidden"
              >
                {/* Decorative background gradient */}
                <div className="absolute -right-20 -top-20 w-40 h-40 bg-accent/5 rounded-full blur-3xl group-hover:bg-accent/10 transition-colors duration-500" />
                
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-accent-light transition-all duration-500 shadow-sm group-hover:shadow-md transform group-hover:-translate-y-1 relative z-10">
                  <IconComponent size={32} strokeWidth={1.5} />
                </div>
                <h3 className="text-xl font-bold text-gray-900 mb-4 font-playfair relative z-10">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm md:text-base relative z-10">
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
