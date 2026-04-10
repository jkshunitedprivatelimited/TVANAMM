'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { IndiaPresenceSection } from '@/components/sections/IndiaPresenceSection';
import Link from 'next/link';
import Image from 'next/image';
import { ShieldCheck, Lightbulb, Heart, TrendingUp, ShieldAlert, Users, Check } from 'lucide-react';
import { client } from '@/lib/sanity/client';
import { urlFor } from '@/lib/sanity/image';

const values = [
  { icon: ShieldCheck, title: 'Quality', description: 'Uncompromising standard in every leaf sourced and every cup brewed.' },
  { icon: Lightbulb, title: 'Innovation', description: 'Constantly evolving our menu while respecting traditional setups.' },
  { icon: Heart, title: 'Integrity', description: 'Honest business practices with our partners and customers.' },
  { icon: TrendingUp, title: 'Growth', description: 'Focused on scaling profitably for every single franchise owner.' },
  { icon: ShieldAlert, title: 'Compliance', description: 'Strict adherence to all FSSAI and standard operating procedures.' },
  { icon: Users, title: 'Responsibility', description: 'Building communities across India, one outlet at a time.' }
];

const milestones: { year: string; title?: string; event: string }[] = [
  { year: '2021', title: 'Company Founded', event: 'Mrs. N. Naga Jyothi establishes T VANAMM with a vision to revolutionize healthy beverages.' },
  { year: '2022', title: 'Product Line Expansion', event: 'Launched premium tea collection and introduced innovative ice-cream flavors.' },
  { year: '2023', title: 'Quality Certifications', event: 'Achieved organic certification and established rigorous quality-control standards.' },
  { year: '2024', title: 'Market Growth', event: 'Expanded to 500+ customers across India with a 4.9★ rating and stronger supply chain.' },
  { year: '2025', title: 'Future Vision', event: 'Scaling nationwide presence and launching Affordable Tea Franchise opportunities.' }
];

export default function AboutPage() {
  const [founderImageUrl, setFounderImageUrl] = useState<string | null>(null);

  useEffect(() => {
    client.fetch(`*[_type == "aboutPage"][0]{ founderImage }`)
      .then((data: { founderImage?: Record<string, unknown> }) => {
        if (data?.founderImage) {
          setFounderImageUrl(urlFor(data.founderImage).width(200).height(200).url());
        }
      })
      .catch(() => { /* fallback to initials */ });
  }, []);

  return (
    <>
      <section className="relative bg-gradient-to-br from-[#006437] via-[#005530] to-[#004025] py-12 text-center overflow-hidden">
        {/* Subtle pattern overlay */}
        <div className="absolute inset-0 opacity-10 bg-[url('/images/hero_background_1775287501927.png')] bg-cover bg-center mix-blend-overlay" />
        <div className="container relative z-10 mx-auto px-4 mt-16">
          <div className="text-white/60 text-xs font-medium tracking-widest uppercase mb-4">
            <Link href="/" className="hover:text-white transition-colors">Home</Link> <span className="mx-2">&gt;</span> <span className="text-white/90">About</span>
          </div>
          <motion.h1 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-3xl md:text-5xl font-playfair font-bold text-white mb-3"
          >
            Our Story
          </motion.h1>
          <motion.div
            initial={{ width: 0 }}
            animate={{ width: 64 }}
            transition={{ delay: 0.3, duration: 0.6 }}
            className="h-1 bg-[#C8A96E] mx-auto rounded-full mb-3"
          />
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.4 }}
            className="text-white/70 text-sm max-w-md mx-auto"
          >
            Building India&apos;s most trusted Tea Franchise — one cup at a time.
          </motion.p>
        </div>
      </section>

      {/* Meet Our Visionary Founder */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.h2
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            className="text-3xl md:text-5xl font-playfair font-bold text-[#006437] mb-16"
          >
            Meet Our Visionary Founder
          </motion.h2>

          <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 items-start">
            {/* Left Column — Bio */}
            <motion.div initial={{ opacity: 0, x: -40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <p className="text-gray-700 text-lg leading-relaxed mb-6">
                <span className="font-bold">Mrs. N. Naga Jyothi</span> founded T VANAMM in 2021 with a vision to transform the beverage industry by prioritizing health, quality, and customer satisfaction—building a trusted <span className="font-bold">Tea Franchise in India</span>.
              </p>
              <p className="text-gray-600 leading-relaxed mb-6">
                With 15+ years of FMCG experience, she blended traditional brewing methods with modern nutrition science to craft our distinctive product line and scalable partner model.
              </p>
              <p className="text-gray-600 leading-relaxed">
                Her leadership centers on transparency, innovation, and community impact—from direct trade relationships to sustainable sourcing and SOP-driven quality.
              </p>
            </motion.div>

            {/* Right Column — Profile Card */}
            <motion.div initial={{ opacity: 0, x: 40 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }}>
              <div className="bg-gray-50 border border-gray-100 rounded-2xl p-8 text-center shadow-sm">
                {founderImageUrl ? (
                  <div className="w-24 h-24 rounded-full overflow-hidden mx-auto mb-4 border-4 border-[#006437]/20">
                    <Image src={founderImageUrl} alt="Mrs. N. Naga Jyothi" width={96} height={96} className="object-cover w-full h-full" />
                  </div>
                ) : (
                  <div className="w-24 h-24 bg-[#006437]/10 text-[#006437] font-bold text-2xl rounded-full flex items-center justify-center mx-auto mb-4">
                    NJ
                  </div>
                )}
                <h3 className="text-xl font-bold text-gray-900">Mrs. N. Naga Jyothi</h3>
                <p className="text-[#006437] font-semibold text-sm mb-4">Founder &amp; CEO</p>
                <blockquote className="border-l-4 border-[#006437] pl-4 text-left italic text-gray-600 text-sm leading-relaxed mb-6">
                  &quot;My vision is to make T VANAMM a household name across India, bringing health, happiness, and authentic flavors to every family.&quot;
                </blockquote>
                <div className="flex justify-center gap-8">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#006437]">15+</div>
                    <div className="text-xs text-gray-500 mt-1">Years Experience</div>
                  </div>
                  <div className="text-center">
                    <div className="text-2xl font-bold text-[#006437]">2021</div>
                    <div className="text-xs text-gray-500 mt-1">Company Founded</div>
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Key Achievements — Full Width */}
      <section className="py-16 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h3 className="text-2xl md:text-3xl font-playfair font-bold text-[#006437] mb-8 text-center">Key Achievements</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 max-w-6xl mx-auto">
              {[
                { stat: '500+', label: 'Customers', desc: 'Built T VANAMM from startup to 500+ customers and a growing partner network' },
                { stat: '200+', label: 'Farming Families', desc: 'Partnerships with 200+ farming families through fair-trade sourcing' },
                { stat: '#1', label: 'Pioneer', desc: 'Pioneer in sustainable tea practices and ethical distribution' },
                { stat: '4.9★', label: 'Satisfaction', desc: 'Maintained 4.9★ customer satisfaction—fueling an Affordable Tea Franchise growth model' },
              ].map((item, i) => (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="bg-white border border-gray-100 rounded-2xl p-6 text-center shadow-sm hover:shadow-lg transition-shadow"
                >
                  <div className="text-3xl font-bold text-[#006437] mb-2">{item.stat}</div>
                  <div className="text-sm font-semibold text-[#C8A96E] uppercase tracking-wide mb-3">{item.label}</div>
                  <p className="text-gray-600 text-sm leading-relaxed">{item.desc}</p>
                </motion.div>
              ))}
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-24 bg-gray-50">
        <div className="container mx-auto px-4 lg:px-8">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8 max-w-5xl mx-auto">
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 hover:bg-[#006437] group transition-colors duration-300 cursor-default">
              <h3 className="text-3xl font-playfair font-bold text-[#006437] group-hover:text-white mb-6 transition-colors duration-300">Our Vision</h3>
              <p className="text-gray-600 group-hover:text-white/90 leading-relaxed text-lg transition-colors duration-300">
                To become India&apos;s most loved tea and coffee franchise — building businesses that redefine everyday experiences and empower entrepreneurs across every corner of the country.
              </p>
            </motion.div>
            <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }} viewport={{ once: true }} className="bg-white p-10 rounded-2xl shadow-xl border border-gray-100 hover:bg-[#006437] group transition-colors duration-300 cursor-default">
              <h3 className="text-3xl font-playfair font-bold text-[#006437] group-hover:text-white mb-6 transition-colors duration-300">Our Mission</h3>
              <p className="text-gray-600 group-hover:text-white/90 leading-relaxed text-lg transition-colors duration-300">
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
          <div className="text-center mb-20 max-w-3xl mx-auto">
            <h2 className="text-3xl font-playfair font-bold text-white mb-4">Our Journey</h2>
            <div className="w-16 h-1 bg-[#C8A96E] mx-auto rounded-full mb-6" />
            <p className="text-white/90 text-lg">
              From a visionary idea to a trusted Tea Franchise in India — built on quality, training, and partner success.
            </p>
          </div>
          {/* Alternating Timeline */}
          <div className="max-w-4xl mx-auto relative">
            {/* Center line (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-0.5 bg-[#C8A96E]/30 -translate-x-1/2" />
            {/* Left line (mobile only) */}
            <div className="md:hidden absolute left-4 top-0 bottom-0 w-0.5 bg-[#C8A96E]/30" />

            {milestones.map((m, i) => {
              const isLeft = i % 2 === 0;
              return (
                <motion.div
                  key={i}
                  initial={{ opacity: 0, x: isLeft ? -30 : 30 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  transition={{ delay: i * 0.1 }}
                  viewport={{ once: true }}
                  className="mb-12 relative md:flex md:items-start"
                >
                  {/* Desktop: Center dot */}
                  <div className="hidden md:block absolute left-1/2 -translate-x-1/2 w-4 h-4 bg-[#C8A96E] rounded-full border-4 border-[#004e2a] box-content z-10" />
                  {/* Mobile: Left dot */}
                  <div className="md:hidden absolute left-2.5 w-3 h-3 bg-[#C8A96E] rounded-full border-4 border-[#004e2a] box-content z-10 top-1" />

                  {/* Left side content */}
                  <div className={`hidden md:block w-1/2 pr-12 ${isLeft ? '' : 'opacity-0 pointer-events-none'}`}>
                    {isLeft && (
                      <div className="text-right">
                        <div className="text-[#C8A96E] font-bold text-2xl mb-2">{m.year}</div>
                        {m.title && <div className="text-xl font-bold text-white mb-2">{m.title}</div>}
                        <div className="text-base font-playfair text-white/90">{m.event}</div>
                      </div>
                    )}
                  </div>

                  {/* Right side content */}
                  <div className={`hidden md:block w-1/2 pl-12 ${!isLeft ? '' : 'opacity-0 pointer-events-none'}`}>
                    {!isLeft && (
                      <div className="text-left">
                        <div className="text-[#C8A96E] font-bold text-2xl mb-2">{m.year}</div>
                        {m.title && <div className="text-xl font-bold text-white mb-2">{m.title}</div>}
                        <div className="text-base font-playfair text-white/90">{m.event}</div>
                      </div>
                    )}
                  </div>

                  {/* Mobile: always left-aligned */}
                  <div className="md:hidden pl-10">
                    <div className="text-[#C8A96E] font-bold text-2xl mb-2">{m.year}</div>
                    {m.title && <div className="text-xl font-bold text-white mb-2">{m.title}</div>}
                    <div className="text-lg font-playfair text-white/90">{m.event}</div>
                  </div>
                </motion.div>
              );
            })}
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
