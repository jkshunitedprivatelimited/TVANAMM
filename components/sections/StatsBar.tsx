'use client';

import { useInView, motion } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

type StatItem = {
  value?: number;
  suffix?: string;
  prefix?: string;
  textValue?: string;
  label: string;
};

const defaultStats: StatItem[] = [
  { value: 120, suffix: '+', label: 'Tea Varieties' },
  { value: 20, suffix: 'K+', label: 'Customers Served Daily' },
  { value: 250, suffix: '+', label: 'Outlets' },
  { value: 5, suffix: '+', label: 'Years of Experience' }
];

function Counter({ from, to, duration = 5.0 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-100px" });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        const easeOutQuart = 1 - Math.pow(1 - progress, 4);
        setCount(Math.floor(easeOutQuart * (to - from) + from));
        if (progress < 1) {
          window.requestAnimationFrame(step);
        }
      };
      window.requestAnimationFrame(step);
    }
  }, [inView, from, to, duration]);

  return <span ref={nodeRef}>{count}</span>;
}

export interface SanityStatItem {
  value: string;
  label: string;
}

export function StatsBar({ stats: sanityStats }: { stats?: SanityStatItem[] }) {
  const displayStats: StatItem[] = sanityStats?.length ? sanityStats.map(s => {
    const numericValue = parseInt(s.value);
    const suffix = s.value?.replace(/[0-9]/g, '');
    
    if (isNaN(numericValue)) {
      return { textValue: s.value, label: s.label };
    }
    return { value: numericValue, suffix: suffix, label: s.label };
  }) : defaultStats;

  return (
    <section className="bg-primary-dark py-16 relative z-20 shadow-2xl border-y border-white/10 overflow-hidden">
      <div className="absolute inset-0 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay opacity-5 pointer-events-none" />
      
      <div className="container mx-auto px-4 relative z-10">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 md:gap-4 md:divide-x divide-accent/20 text-center">
          {displayStats.map((stat: StatItem, i: number) => (
            <motion.div 
              key={i} 
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ delay: i * 0.15, duration: 0.6, ease: "easeOut" }}
              className="flex flex-col items-center justify-center p-4 group"
            >
              <div className="text-4xl md:text-5xl lg:text-6xl font-playfair font-bold text-white mb-3 group-hover:scale-105 transition-transform duration-500 drop-shadow-md">
                {stat.prefix}
                <span className="text-glow">
                  {stat.value ? <Counter from={0} to={stat.value} /> : stat.textValue}
                  {stat.suffix}
                </span>
              </div>
              <div className="text-accent font-medium tracking-widest uppercase text-xs md:text-sm">{stat.label}</div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
