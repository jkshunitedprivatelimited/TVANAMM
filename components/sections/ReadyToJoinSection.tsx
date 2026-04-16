'use client';

import { useRouter, usePathname } from 'next/navigation';

export function ReadyToJoinSection() {
  const router = useRouter();
  const pathname = usePathname();

  const handleNavigation = (e: React.MouseEvent) => {
    e.preventDefault();

    if (pathname === '/') {
      // If already on the home page, just scroll smoothly
      const element = document.getElementById('franchise-enquiry');
      if (element) {
        element.scrollIntoView({ behavior: 'smooth' });
      }
    } else {
      // If on another page, navigate to the home page with the hash
      router.push('/#franchise-enquiry');
    }
  };

  return (
    <section className="relative z-10 py-12 md:py-16 bg-[#C8A96E] overflow-hidden">
      <div className="container mx-auto px-4 text-center">
        <h2 className="text-3xl md:text-4xl lg:text-5xl font-playfair font-bold text-white mb-8 leading-tight">
          Ready to be part of <br className="block md:hidden" /> the <span className="text-[#006437] whitespace-nowrap">T VANAMM</span> family?
        </h2>
        <button 
          onClick={handleNavigation}
          className="inline-block px-8 py-4 bg-[#006437] text-white font-bold rounded-lg shadow-xl hover:bg-[#004e2a] transition-all transform hover:scale-105 active:scale-95 text-lg"
        >
          Enquire Now
        </button>
      </div>
    </section>
  );
}