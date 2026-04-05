'use client';
export const dynamic = 'force-dynamic';

import { motion } from 'framer-motion';
import * as LucideIcons from 'lucide-react';

interface Step {
  number: string;
  icon: string;
  title: string;
  description: string;
}

interface HowItWorksSectionProps {
  steps?: Step[];
}

const defaultSteps = [
  {
    number: '01',
    icon: 'FileText',
    title: 'Apply',
    description: 'Fill in the franchise enquiry form with your basic details and investment capacity.',
  },
  {
    number: '02',
    icon: 'PhoneCall',
    title: 'Connect',
    description: 'Our expert team will call you to discuss margins, location, and the complete business model.',
  },
  {
    number: '03',
    icon: 'Rocket',
    title: 'Launch',
    description: 'We help you launch with setup, full training, and marketing support from day one.',
  },
];

export function HowItWorksSection({ steps = defaultSteps }: HowItWorksSectionProps) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            Your Journey to Owning an Outlet
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-12 left-[10%] right-[10%] h-[2px] bg-gray-200 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-full bg-[#006437]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative z-10">
            {steps.map((step, i) => {
              // Dynamically pick the icon from Lucide
              const Icon = (LucideIcons as unknown as Record<string, React.ElementType>)[step.icon] || LucideIcons.HelpCircle;
              
              return (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.6, delay: i * 0.2 }}
                  viewport={{ once: true, margin: "-100px" }}
                  className="flex flex-col items-center text-center group"
                >
                  <div className="w-24 h-24 rounded-full bg-white border-4 border-[#006437] shadow-lg flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -top-4 -right-4 w-10 h-10 rounded-full bg-[#C8A96E] text-white flex items-center justify-center font-bold">
                      {step.number}
                    </div>
                    <Icon size={36} className="text-[#006437]" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 max-w-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
