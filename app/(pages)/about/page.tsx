'use client';

import { motion } from 'framer-motion';
import { IndiaPresenceSection } from '@/components/sections/IndiaPresenceSection';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lightbulb, Heart, TrendingUp, ShieldAlert, Users } from 'lucide-react';

const values = [
  { icon: ShieldCheck, title: 'Quality', description: 'Uncompromising standard in every leaf sourced and every cup brewed.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Constantly evolving our menu while respecting traditional setups.' },
  { icon: Heart, title: 'Integrity', description: 'Honest business practices with our partners and customers.' },
  { icon: TrendingUp, title: 'Growth', description: 'Focused on scaling profitably for every single franchise owner.' },
  { icon: ShieldAlert, title: 'Compliance', description: 'Strict adherence to all FSSAI and standard operating procedures.' },
  { icon: Users, title: 'Responsibility', description: 'Building communities across India, one outlet at a time.' }
];

const milestones = [
  { year: '2021', title: 'Company Founded', event: 'Mrs. N. Naga Jyothi establishes T VANAMM with a vision to revolutionize healthy beverages.' },
  { year: '2022', title: 'Product Line Expansion', event: 'Launched premium tea collection and introduced innovative ice-cream flavors.' },
  { year: '2023', title: 'Quality Certifications', event: 'Achieved organic certification and established rigorous quality-control standards.' },
  { year: '2024', title: 'Market Growth', event: 'Expanded to 500+ customers across India with a 4.9★ rating and stronger supply chain.' },
  { year: '2025', title: 'Future Vision', event: 'Scaling nationwide presence and launching Affordable Tea Franchise opportunities.' }
];

export default function AboutPage() {
  return (
    <>
      {/* Hero Section */}
      <section className="bg-primary flex flex-col justify-center items-center text-center relative overflow-hidden pt-32 pb-12 md:pt-36 md:pb-16">
        {/* Background Effects */}
        <div className="absolute inset-0 bg-gradient-to-b from-primary-dark via-primary to-primary-dark/95 z-0" />
        <div className="absolute inset-0 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay opacity-10 z-0" />
        <div className="absolute top-0 right-0 w-96 h-96 bg-accent/20 rounded-full blur-[120px] pointer-events-none z-0" />
        
        <div className="container mx-auto px-4 relative z-10">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8 }}
            className="text-5xl md:text-7xl font-playfair font-bold text-white mb-6 drop-shadow-md"
          >
            Our Story
          </motion.h1>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.2 }}
            className="text-accent-light text-sm font-medium tracking-widest uppercase flex items-center justify-center gap-3"
          >
            <Link href="/" className="hover:text-white transition-colors duration-300">Home</Link> 
            <span className="text-white/30">•</span> 
            <span className="text-white">About</span>
          </motion.div>
        </div>
      </section>

      {/* Meet Our Visionary Founder Section */}
      <section className="py-24 bg-gray-50/50 relative overflow-hidden">
        <div className="absolute right-0 top-0 w-[500px] h-[500px] bg-primary/5 rounded-full blur-[150px] pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16 items-center max-w-7xl mx-auto">
            
            {/* Image Column */}
            <motion.div 
              initial={{ opacity: 0, x: -50 }} 
              whileInView={{ opacity: 1, x: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut" }}
              viewport={{ once: true }} 
              className="lg:col-span-5 relative"
            >
              <div className="relative aspect-[3/4] md:aspect-square lg:aspect-[4/5] rounded-[2.5rem] overflow-hidden shadow-2xl border-4 border-white group">
                <div className="absolute inset-0 bg-primary/10 mix-blend-overlay z-10 group-hover:bg-primary/0 transition-colors duration-700 pointer-events-none" />
                <Image 
                  src="/images/Josnnasri.jpeg" 
                  alt="Mrs. N. Naga Jyothi - Founder & CEO" 
                  fill 
                  className="object-cover group-hover:scale-105 transition-transform duration-1000 object-center" 
                  sizes="(max-w-768px) 100vw, 50vw"
                />
                
                {/* Floating Badge */}
                <div className="absolute -bottom-6 -right-6 md:bottom-8 md:-right-8 bg-white p-5 md:p-6 rounded-3xl shadow-2xl border border-gray-100 z-20 flex items-center gap-4 group-hover:-translate-y-2 transition-transform duration-500">
                  <div className="w-12 h-12 md:w-14 md:h-14 bg-accent/10 rounded-2xl flex items-center justify-center text-accent font-bold text-xl md:text-2xl font-playfair">NJ</div>
                  <div>
                    <div className="font-bold text-gray-900 border-b border-gray-100 pb-1 mb-1 text-sm md:text-base">15+ Years</div>
                    <div className="text-xs md:text-sm text-gray-500">FMCG Experience</div>
                  </div>
                </div>
              </div>
            </motion.div>

            {/* Content Column */}
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.8, ease: "easeOut", delay: 0.2 }}
              viewport={{ once: true }}
              className="lg:col-span-7 lg:pl-10 mt-10 lg:mt-0"
            >
              <h2 className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6 leading-tight">Meet Our Visionary Founder</h2>
              <div className="w-20 h-1.5 bg-accent rounded-full mb-8 shadow-sm" />
              
              <div className="space-y-6 text-gray-600 text-lg leading-relaxed font-light mb-10">
                <p>
                  <strong className="text-gray-900 shadow-sm">Mrs. N. Naga Jyothi</strong> founded T VANAMM in 2021 with a vision to transform the beverage industry by prioritizing health, quality, and customer satisfaction—building a trusted Tea Franchise in India.
                </p>
                <p>
                  With 15+ years of FMCG experience, she blended traditional brewing methods with modern nutrition science to craft our distinctive product line and scalable partner model.
                </p>
                <p>
                  Her leadership centers on transparency, innovation, and community impact—from direct trade relationships to sustainable sourcing and SOP-driven quality.
                </p>
              </div>

              <blockquote className="relative p-8 md:p-10 rounded-[2rem] bg-white shadow-xl shadow-primary/5 border border-gray-100 overflow-hidden group">
                {/* Decorative Quotes */}
                <span className="absolute top-4 right-8 text-8xl font-playfair text-primary/5 group-hover:text-accent/10 transition-colors duration-500 leading-none pointer-events-none">"</span>
                <div className="absolute top-0 left-0 w-2 h-full bg-gradient-to-b from-accent to-accent-light" />
                
                <p className="relative z-10 text-xl md:text-2xl font-playfair italic text-gray-800 leading-snug">
                  "My vision is to make T VANAMM a household name across India, bringing health, happiness, and authentic flavors to every family."
                </p>
                
                <footer className="mt-8 flex items-center justify-between border-t border-gray-50 pt-6">
                  <div>
                    <div className="text-primary font-bold text-lg mb-1">Mrs. N. Naga Jyothi</div>
                    <div className="text-xs md:text-sm font-bold tracking-widest uppercase text-accent">Founder & CEO</div>
                  </div>
                  <div className="text-right">
                    <div className="text-gray-900 font-bold mb-1">2021</div>
                    <div className="text-[10px] md:text-xs tracking-wider text-gray-400 uppercase font-bold">Company Founded</div>
                  </div>
                </footer>
              </blockquote>
            </motion.div>
            
          </div>
        </div>
      </section>

      {/* Vision & Mission */}
      <section className="py-24 bg-white relative">
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ duration: 0.6 }}
              viewport={{ once: true }} 
              className="bg-gray-50 p-10 md:p-14 rounded-3xl shadow-lg border border-gray-100 group hover:shadow-2xl hover:shadow-primary/5 transition-all duration-300"
            >
              <h3 className="text-3xl font-playfair font-bold text-primary mb-6 group-hover:text-accent transition-colors">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg font-light">
                To become India&apos;s most loved tea and coffee franchise — building businesses that redefine everyday experiences and empower entrepreneurs across every corner of the country.
              </p>
            </motion.div>
            <motion.div 
              initial={{ opacity: 0, y: 30 }} 
              whileInView={{ opacity: 1, y: 0 }} 
              transition={{ delay: 0.2, duration: 0.6 }} 
              viewport={{ once: true }} 
              className="bg-primary p-10 md:p-14 rounded-3xl shadow-xl relative overflow-hidden group"
            >
              <div className="absolute right-0 top-0 w-64 h-64 bg-primary-dark rounded-full blur-3xl opacity-50 group-hover:scale-110 transition-transform duration-700 pointer-events-none" />
              <div className="relative z-10">
                <h3 className="text-3xl font-playfair font-bold text-white mb-6 group-hover:text-accent-light transition-colors">Our Mission</h3>
                <p className="text-white/90 leading-relaxed text-lg font-light">
                  To scale a premium tea and coffee franchise model built on quality, consistency, and full partner support — creating profitable opportunities for franchise owners and memorable experiences for every customer.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Core Values */}
      <section className="py-24 bg-gray-50/50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-playfair font-bold text-primary mb-6"
            >
              Core Values
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="w-24 h-1.5 bg-accent mx-auto rounded-full" 
            />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 xl:gap-10 max-w-7xl mx-auto">
            {values.map((v, i) => (
              <motion.div 
                key={i} 
                initial={{ opacity: 0, scale: 0.95, y: 20 }} 
                whileInView={{ opacity: 1, scale: 1, y: 0 }} 
                transition={{ delay: i * 0.1, duration: 0.5 }} 
                viewport={{ once: true }} 
                className="bg-white p-10 rounded-3xl shadow-sm hover:shadow-2xl hover:shadow-primary/10 transition-all duration-300 border border-gray-100 group relative overflow-hidden"
              >
                <div className="absolute -right-10 -top-10 w-32 h-32 bg-accent/5 rounded-full blur-2xl group-hover:bg-accent/10 transition-colors duration-500" />
                <div className="w-16 h-16 bg-primary/5 text-primary rounded-2xl flex items-center justify-center mb-8 group-hover:bg-primary group-hover:text-white transition-all duration-500 group-hover:-translate-y-1 relative z-10">
                  <v.icon size={32} strokeWidth={1.5} />
                </div>
                <h4 className="text-2xl font-bold text-gray-900 mb-4 font-playfair relative z-10">{v.title}</h4>
                <p className="text-gray-600 font-light leading-relaxed relative z-10">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Our Journey */}
      <section className="py-24 bg-primary text-white relative overflow-hidden">
        <div className="absolute inset-0 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay opacity-5 z-0" />
        <div className="absolute left-0 bottom-0 w-[500px] h-[500px] bg-primary-dark rounded-full blur-[150px] z-0 pointer-events-none" />
        
        <div className="container mx-auto px-4 lg:px-8 relative z-10">
          <div className="text-center mb-24 group inline-block relative left-1/2 -translate-x-1/2 cursor-default">
            <motion.h2 
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              className="text-4xl md:text-5xl font-playfair font-bold text-white mb-6 drop-shadow-md transition-colors"
            >
              Our Journey
            </motion.h2>
            <motion.div 
              initial={{ width: 0 }}
              whileInView={{ width: 96 }}
              viewport={{ once: true }}
              transition={{ duration: 0.8, delay: 0.2 }}
              className="h-1.5 bg-accent mx-auto rounded-full shadow-[0_0_15px_rgba(212,175,55,0.6)] group-hover:w-full transition-[width] duration-500" 
            />
          </div>
          <div className="max-w-5xl mx-auto relative mt-16 px-4 md:px-0">
            {/* Desktop Center Line */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/10 rounded-full z-0 pointer-events-none" />
            <motion.div 
               initial={{ height: 0 }}
               whileInView={{ height: '100%' }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
               viewport={{ once: true }}
               className="hidden md:block absolute left-1/2 top-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-accent-light via-accent to-transparent shadow-[0_0_20px_rgba(212,175,55,1)] rounded-full z-0 pointer-events-none"
            />

            {/* Mobile Left Line */}
            <div className="md:hidden absolute left-[32px] top-0 bottom-0 w-[2px] -translate-x-1/2 bg-white/10 rounded-full z-0 pointer-events-none" />
            <motion.div 
               initial={{ height: 0 }}
               whileInView={{ height: '100%' }}
               transition={{ duration: 2.5, ease: "easeInOut" }}
               viewport={{ once: true }}
               className="md:hidden absolute left-[32px] top-0 w-[2px] -translate-x-1/2 bg-gradient-to-b from-accent-light via-accent to-transparent shadow-[0_0_15px_rgba(212,175,55,1)] rounded-full z-0 pointer-events-none"
            />

            <div className="flex flex-col gap-8 md:gap-16 relative z-10 w-full pt-8 pb-12">
              {milestones.map((m, i) => {
                const isEven = i % 2 === 0;
                return (
                  <motion.div 
                    key={i} 
                    initial={{ opacity: 0, y: 30 }} 
                    whileInView={{ opacity: 1, y: 0 }} 
                    transition={{ duration: 0.6 }} 
                    viewport={{ once: true, margin: "-100px" }} 
                    className={`relative flex flex-col md:flex-row items-center justify-between w-full group ${isEven ? 'md:flex-row-reverse' : ''}`}
                  >
                    {/* Empty Space for Desktop Grid */}
                    <div className="hidden md:block w-5/12" />
                    
                    {/* The Center Dot */}
                    <div className="absolute left-[32px] md:left-1/2 top-10 md:top-1/2 -translate-x-1/2 -translate-y-1/2 w-5 h-5 bg-primary border-[3px] border-accent rounded-full box-content shadow-[0_0_15px_rgba(212,175,55,0.8)] group-hover:scale-125 group-hover:bg-accent transition-all duration-300 z-20 flex items-center justify-center">
                      <div className="w-1.5 h-1.5 bg-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity" />
                    </div>
                    
                    {/* Content Card */}
                    <div className={`w-full md:w-5/12 pl-[72px] md:pl-0 ${isEven ? 'md:text-right' : 'md:text-left'}`}>
                      <div className="bg-white/5 backdrop-blur-xl p-8 md:p-10 rounded-3xl border border-white/10 group-hover:bg-white/10 group-hover:-translate-y-1 group-hover:border-accent/40 shadow-xl transition-all duration-300 overflow-hidden relative">
                        {/* Interactive Background Glow */}
                        <div className={`absolute top-1/2 -translate-y-1/2 w-40 h-40 bg-accent/20 rounded-full blur-[60px] pointer-events-none transition-all duration-500 ${isEven ? '-right-10 group-hover:bg-accent/30' : '-left-10 group-hover:bg-accent/30'}`} />
                        
                        <div className="text-accent font-bold text-3xl font-playfair tracking-widest mb-2 drop-shadow-sm">{m.year}</div>
                        <h3 className="text-xl md:text-2xl font-bold text-white mb-4 leading-snug group-hover:text-accent-light transition-colors relative inline-block">
                          {m.title}
                          <div className={`absolute -bottom-1.5 h-[2px] bg-accent rounded-full transition-all duration-500 w-0 group-hover:w-full ${isEven ? 'right-0' : 'left-0'}`} />
                        </h3>
                        <p className="text-[15px] md:text-base text-white/70 font-light leading-relaxed">{m.event}</p>
                      </div>
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </div>
      </section>

      <IndiaPresenceSection />

      {/* CTA */}
      <section className="py-24 bg-accent relative overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-b from-transparent to-black/10 z-0 pointer-events-none" />
        <div className="container mx-auto px-4 text-center relative z-10">
          <motion.h2 
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-4xl md:text-5xl font-playfair font-bold text-white mb-10 drop-shadow-md max-w-3xl mx-auto leading-tight"
          >
            Ready to be part of the T Vanamm family?
          </motion.h2>
          <motion.div
             initial={{ opacity: 0, scale: 0.9 }}
             whileInView={{ opacity: 1, scale: 1 }}
             viewport={{ once: true }}
             transition={{ delay: 0.2 }}
          >
            <Link 
              href="/contact" 
              className="inline-flex items-center justify-center px-10 py-5 bg-primary text-white font-bold rounded-xl shadow-xl hover:shadow-2xl hover:bg-primary-dark transition-all duration-300 text-lg group overflow-hidden relative"
            >
              <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out" />
              <span className="relative z-10 flex items-center gap-2 tracking-wide">
                Enquire Now
              </span>
            </Link>
          </motion.div>
        </div>
      </section>
    </>
  );
}
