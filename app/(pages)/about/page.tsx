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
  { year: '2020', event: 'T Vanamm Founded in Hyderabad' },
  { year: '2021', event: 'First 10 Franchise Outlets Launched' },
  { year: '2022', event: 'Expanded to 50+ Outlets across South India' },
  { year: '2023', event: 'Crossed 100+ Outlets, Pan India Expansion Begins' },
  { year: '2024', event: '200+ Outlets across India' },
  { year: '2025', event: '250+ Outlets — India\'s Fastest Growing Tea Franchise' }
];

export default function AboutPage() {
  return (
    <>
      <section className="bg-[#006437] py-20 text-center">
        <div className="container mx-auto px-4 mt-8">
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-4xl md:text-6xl font-playfair font-bold text-white mb-4"
          >
            Our Story
          </motion.h1>
          <div className="text-white/80 text-sm font-medium tracking-widest uppercase">
            <Link href="/" className="hover:text-white">Home</Link> <span className="mx-2">&gt;</span> About
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
            <motion.div initial={{ opacity: 0, x: -50 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <h2 className="text-3xl font-playfair font-bold text-[#006437] mb-6">Building a Movement</h2>
              <div className="w-16 h-1 bg-[#C8A96E] rounded-full mb-6" />
              <p className="text-gray-700 text-lg leading-relaxed mb-8">
                T Vanamm was born in 2020 from a simple belief — that every Indian deserves a pure, authentic cup of tea. What started as one vision in Hyderabad has grown into a family of 250+ franchise outlets across India in just 4 years. We did not just build a brand. We built a movement — empowering entrepreneurs across India to own their business under a trusted, premium name.
              </p>
              <blockquote className="border-l-4 border-[#C8A96E] pl-6 italic bg-gray-50 p-6 rounded-r-lg shadow-sm">
                &quot;T Vanamm was born from a simple belief — that every Indian deserves a pure, authentic cup of tea. That belief, since 2020, has grown into 250+ outlets across India.&quot;
                <footer className="mt-4 text-[#006437] font-bold text-sm not-italic uppercase tracking-wide">
                  — Suroju Josnnasri, Founder, T Vanamm
                </footer>
              </blockquote>
            </motion.div>
            <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} className="relative aspect-square md:aspect-[4/3] rounded-2xl overflow-hidden shadow-2xl">
              <Image src="/images/cafe_interior_1775287651976.png" alt="Founder Story" fill className="object-cover" />
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100">
              <h3 className="text-3xl font-playfair font-bold text-[#006437] mb-6">Our Vision</h3>
              <p className="text-gray-600 leading-relaxed text-lg">
                To become India&apos;s most loved tea and coffee franchise — building businesses that redefine everyday experiences and empower entrepreneurs across every corner of the country.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="bg-[#006437] p-10 rounded-2xl shadow-xl">
              <h3 className="text-3xl font-playfair font-bold text-white mb-6">Our Mission</h3>
              <p className="text-white/80 leading-relaxed text-lg">
                To scale a premium tea and coffee franchise model built on quality, consistency, and full partner support — creating profitable opportunities for franchise owners and memorable experiences for every customer.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-playfair font-bold text-[#006437] mb-4">Core Values</h2>
            <div className="w-16 h-1 bg-[#C8A96E] mx-auto rounded-full" />
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 max-w-6xl mx-auto">
            {values.map((v, i) => (
              <motion.div key={i} initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="text-center p-8 rounded-xl bg-gray-50 hover:bg-[#006437]/5 transition-colors border border-gray-100">
                <div className="w-16 h-16 bg-[#C8A96E] text-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-md"><v.icon size={32} /></div>
                <h4 className="text-xl font-bold text-gray-900 mb-3">{v.title}</h4>
                <p className="text-gray-600">{v.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-24 bg-[#004e2a] text-white">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="text-center mb-20">
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">Our Journey</h2>
            <div className="w-16 h-1 bg-[#C8A96E] mx-auto rounded-full" />
          </div>
          <div className="max-w-3xl mx-auto relative border-l-2 border-[#C8A96E]/30 pl-8 ml-4 md:ml-auto">
            {milestones.map((m, i) => (
              <motion.div key={i} initial={{ opacity: 0, x: -30 }} whileInView={{ opacity: 1, x: 0 }} transition={{ delay: i * 0.1 }} viewport={{ once: true }} className="mb-12 relative">
                <div className="absolute -left-10 w-4 h-4 bg-[#C8A96E] rounded-full border-4 border-[#004e2a] box-content" />
                <div className="text-[#C8A96E] font-bold text-2xl mb-2">{m.year}</div>
                <div className="text-lg md:text-xl font-playfair">{m.event}</div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <IndiaPresenceSection />

      <section className="py-20 bg-[#C8A96E]">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-playfair font-bold text-white mb-8">Ready to be part of the T Vanamm family?</h2>
          <Link href="/contact" className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-colors text-lg">Enquire Now</Link>
        </div>
      </section>
    </>
  );
}
