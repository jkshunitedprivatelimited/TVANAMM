'use client';

import Link from 'next/link';

export function ReadyToJoinSection() {
  return (
    <section className="relative z-10 py-12 md:py-16 bg-[#C8A96E] overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-8 leading-tight">
          Ready to be part of <br className="block md:hidden" /> the <span className="text-[#006437] whitespace-nowrap">T Vanamm</span> family?
        </h2>
        <Link 
          href="/#franchise-enquiry" 
          scroll={true}
          className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-all transform hover:scale-105 active:scale-95 text-lg"
        >
          Enquire Now
        </Link>
      </div>
    </section>
  );
}
