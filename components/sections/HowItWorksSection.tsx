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
    icon: 'MessageSquareText',
    title: 'Connect',
    description: 'Share your note and a few basics so we can understand your request.',
  },
  {
    number: '02',
    icon: 'ListChecks',
    title: 'Review',
    description: 'We check requirements and share a clear next-step list.',
  },
  {
    number: '03',
    icon: 'Handshake',
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
      <div className="absolute top-0 right-0 w-1/3 h-full bg-gradient-to-l from-primary/5 to-transparent pointer-events-none" />
      <div className="container mx-auto px-4 lg:px-8 relative z-10">
        <div className="text-center mb-16 md:mb-24">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
          >
            How We Work
          </motion.h2>
          <motion.div 
            initial={{ width: 0 }}
            whileInView={{ width: 96 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.2 }}
            className="h-1.5 bg-accent mx-auto rounded-full mb-6" 
          />
          <motion.p 
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
            transition={{ duration: 0.8, delay: 0.4 }}
            className="max-w-2xl mx-auto text-gray-600 leading-relaxed"
          >
            This flow keeps things simple: clear steps, clear ownership, and fewer surprises. You’ll know what to prepare and what comes next.
          </motion.p>
        </div>

        <div className="relative max-w-6xl mx-auto">
          {/* Connecting Line (Desktop) */}
          <div className="hidden md:block absolute top-[44px] left-[10%] right-[10%] h-[2px] bg-gray-100 z-0 drop-shadow-sm">
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: '100%' }}
              transition={{ duration: 1.5, delay: 0.2, ease: 'easeOut' }}
              viewport={{ once: true, margin: "-100px" }}
              className="h-full bg-gradient-to-r from-accent to-primary"
            />
          </div>

          <div className="grid grid-cols-1 md:grid-cols-5 gap-8 md:gap-4 relative z-10">
            {steps.map((step, i) => {
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
                  <div className="w-20 h-20 md:w-24 md:h-24 rounded-full bg-white border-4 border-white shadow-[0_0_15px_rgba(0,100,50,0.15)] flex items-center justify-center mb-6 relative group-hover:-translate-y-2 transition-all duration-300">
                    <div className="absolute inset-0 rounded-full border border-gray-100 opacity-0 group-hover:opacity-100 scale-110 transition-all duration-300" />
                    <div className="absolute -top-3 -right-3 w-8 h-8 md:w-10 md:h-10 rounded-full bg-accent text-white flex items-center justify-center font-bold shadow-md text-sm md:text-base border-2 border-white">
                      {step.number}
                    </div>
                    <Icon size={32} className="text-primary group-hover:scale-110 transition-transform duration-300" strokeWidth={1.5} />
                  </div>
                  <h3 className="text-xl md:text-2xl font-bold text-gray-900 mb-3 font-playfair group-hover:text-primary transition-colors">{step.title}</h3>
                  <p className="text-sm md:text-base text-gray-500 max-w-[200px] leading-relaxed">{step.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </div>
    </section>
  );
}
