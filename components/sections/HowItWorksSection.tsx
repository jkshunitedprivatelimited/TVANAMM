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
    icon: 'MessageSquare',
    title: 'Connect',
    description: 'Share your note and a few basics so we can understand your request.',
  },
  {
    number: '02',
    icon: 'ClipboardCheck',
    title: 'Review',
    description: 'We check requirements and share a clear next-step list.',
  },
  {
    number: '03',
    icon: 'Users',
    title: 'Align',
    description: 'We share working guidelines and ensure everyone is on the same page.',
  },
  {
    number: '04',
    icon: 'Settings',
    title: 'Set Up',
    description: 'We help organise the essentials and confirm readiness.',
  },
  {
    number: '05',
    icon: 'Rocket',
    title: 'Go Live',
    description: 'We confirm the final checklist and move forward as planned.',
  },
];

export function HowItWorksSection({ steps = defaultSteps }: HowItWorksSectionProps) {
  return (
    <section className="py-24 bg-white relative overflow-hidden">
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-20">
          <h2 className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-4">
            Your Journey <br className="block md:hidden" /> to Owning an Outlet
          </h2>
          <div className="w-24 h-1 bg-[#C8A96E] mx-auto rounded-full" />
        </div>

        <div className="relative max-w-5xl mx-auto">
          {/* Connecting Line (Desktop Large only) */}
          <div className="hidden lg:block absolute top-10 left-[10%] right-[10%] h-[2px] bg-gray-200 z-0">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.2 }}
              viewport={{ once: true }}
              className="h-full bg-[#006437]"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 md:gap-6 relative z-10">
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
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 border-[#006437] shadow-lg flex items-center justify-center mb-6 relative group-hover:scale-110 transition-transform duration-300">
                    <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#C8A96E] text-white flex items-center justify-center font-bold text-sm md:text-base shadow-sm">
                      {step.number}
                    </div>
                    <Icon size={32} className="text-[#006437]" />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3">{step.title}</h3>
                  <p className="text-gray-600 max-w-sm text-sm">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
