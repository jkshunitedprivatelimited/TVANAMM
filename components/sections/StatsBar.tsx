'use client';

import { useInView } from 'framer-motion';
import { useRef, useEffect, useState } from 'react';

type StatItem = {
  value?: number;
  suffix?: string;
  prefix?: string;
  textValue?: string;
  label: string;
};

const defaultStats: StatItem[] = [
  { value: 250, suffix: '+', label: 'Outlets' },
  { value: 120, suffix: '+', label: 'Beverages' },
  { value: 10, suffix: '+', label: 'States' },
];

function Counter({ from, to, duration = 10 }: { from: number; to: number; duration?: number }) {
  const [count, setCount] = useState(from);
  const nodeRef = useRef<HTMLSpanElement>(null);
  const inView = useInView(nodeRef, { once: true, margin: "-50px" });

  useEffect(() => {
    if (inView) {
      let startTime: number | null = null;
      const step = (timestamp: number) => {
        if (!startTime) startTime = timestamp;
        // linear progress from 0 to 1
        const progress = Math.min((timestamp - startTime) / (duration * 1000), 1);
        
        // softer easeOutQuad function so it doesn't shoot up too fast initially
        const easeOutProgress = 1 - (1 - progress) * (1 - progress);
        
        setCount(Math.floor(easeOutProgress * (to - from) + from));
        
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
  // Parse sanity stats into our internal format
  const displayStats: StatItem[] = sanityStats?.length ? sanityStats.map(s => {
    const numericValue = parseInt(s.value);
    let suffix = s.value?.replace(/[0-9]/g, '').trim();
    
    // Automatically add '+' if they only typed a number in Sanity
    if (!suffix && !isNaN(numericValue) && s.value) {
      suffix = '+';
    }

    if (isNaN(numericValue)) {
      return { textValue: s.value, label: s.label };
    }
    return { value: numericValue, suffix: suffix, label: s.label };
  }) : defaultStats;

  return (
    <section className="bg-[#004e2a] py-8 md:py-10 relative z-20 shadow-xl border-y border-[#006437]/50">
      <div className="container mx-auto px-4">
        <div className="flex flex-col md:flex-row justify-center md:justify-evenly gap-6 md:gap-4 md:divide-x divide-white/10 text-center">
          {displayStats.map((stat: StatItem, i: number) => (
            <div key={i} className="flex flex-col items-center justify-center flex-1">
              <div className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-1.5 md:mb-2">
                {stat.prefix}
                {stat.value ? <Counter from={0} to={stat.value} /> : stat.textValue}
                {stat.suffix}
              </div>
              <div className="text-[#C8A96E] font-medium tracking-wide uppercase text-xs md:text-sm">{stat.label}</div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
