'use client';

import { motion } from 'framer-motion';
import { 
  Leaf,
  Utensils,
  ShieldCheck,
  Recycle,
  Building2
} from 'lucide-react';

const ICON_MAP: Record<string, React.ElementType> = {
  Leaf: Leaf,
  Utensils: Utensils,
  ShieldCheck: ShieldCheck,
  Recycle: Recycle,
  Building2: Building2,
};

export interface WhyCard {
  icon: string;
  title: string;
  description: string;
}

const defaultReasons: WhyCard[] = [
  {
    icon: 'Leaf',
    title: '100% Organic Ingredients',
    description: 'Sourced directly from certified organic farms with full traceability.',
  },
  {
    icon: 'Utensils',
    title: 'Traditional Recipes',
    description: 'Time-tested formulations refined for modern tastes and consistent margins.',
  },
  {
    icon: 'ShieldCheck',
    title: 'Quality Assured',
    description: 'Rigorous testing and SOP-driven control at every step of production.',
  },
  {
    icon: 'Recycle',
    title: 'Sustainable Practices',
    description: 'Ethical sourcing and efficient logistics for a greener Franchise Tea Business.',
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
    <section className="py-12 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 lg:px-8">
        <div className="text-center mb-16 max-w-4xl mx-auto">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4 leading-tight">
            Why Choose <span className="text-[#C8A96E]">T VANAMM</span>?
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
          <p className="text-gray-600 text-base md:text-lg leading-relaxed px-2">
            Our commitment to quality, tradition, and innovation sets us apart as a leading Tea Franchise in India.
            <br className="hidden md:block" />
            An Affordable and Profitable Chai Franchise model for partners.
          </p>
        </div>

        <motion.div 
          variants={containerVariants}
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, margin: "-100px" }}
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6"
        >
          {displayReasons.map((reason, i) => {
            const IconComponent = ICON_MAP[reason.icon] || Building2;
            return (
              <motion.div 
                key={i}
                variants={cardVariants}
                className="bg-white p-6 md:p-8 rounded-2xl shadow-sm hover:shadow-xl hover:shadow-[#006437]/10 transition-all duration-300 border border-gray-100 group flex flex-col items-center justify-center text-center"
              >
                <div className="w-16 h-16 bg-[#006437]/10 text-[#006437] rounded-full flex items-center justify-center mb-5 group-hover:bg-[#006437] group-hover:text-white transition-colors duration-300 shrink-0">
                  <IconComponent size={28} />
                </div>
                <h3 className="text-lg font-bold text-gray-900 mb-3">{reason.title}</h3>
                <p className="text-gray-600 leading-relaxed text-sm">
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
