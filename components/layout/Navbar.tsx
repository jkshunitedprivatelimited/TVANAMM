'use client';

import { useState } from 'react';
import Link from 'next/link';
import Image from 'next/image';
import { motion, AnimatePresence } from 'framer-motion';
import { Menu, X } from 'lucide-react';
import { usePathname } from 'next/navigation';

const navLinks = [
  { name: 'Home', href: '/' },
  { name: 'About', href: '/about' },
  { name: 'Gallery', href: '/gallery' },
  { name: 'Blog', href: '/blog' },
];

export function Navbar() {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const pathname = usePathname();

  const handleGetFranchise = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname !== '/') {
      return;
    }
    e.preventDefault();
    const formSection = document.getElementById('franchise-enquiry');
    if (formSection) {
      formSection.scrollIntoView({ behavior: 'smooth' });
    }
  };

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 bg-white shadow-md py-1 transition-all duration-300"
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 transition-transform hover:scale-105 group">
            <Image 
              src="/images/logo_gif.gif" 
              alt="T Vanamm Logo" 
              width={55} 
              height={55} 
              className="object-contain" 
              unoptimized
            />
            <div className="flex flex-col">
              <span className="font-playfair font-bold text-2xl tracking-wide text-[#006437]">
                T Vanamm
              </span>
              <span className="font-playfair italic text-xs text-[#006437] -mt-1 ml-4 opacity-90 group-hover:text-[#C8A96E] transition-colors">
                &quot;A Taste of Purity&quot;
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => (
              <Link
                key={link.name}
                href={link.href}
                className="text-base font-semibold transition-colors text-[#006437] hover:text-[#C8A96E]"
              >
                {link.name}
              </Link>
            ))}
            <Link
              href="/#franchise-enquiry"
              onClick={handleGetFranchise}
              className="px-5 py-2.5 rounded hover:opacity-90 font-semibold transition-all bg-[#C8A96E] text-white"
            >
              Get Franchise
            </Link>
          </nav>

          {/* Mobile Menu Toggle */}
          <button
            className="md:hidden p-2 rounded-md text-[#006437]"
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={24} />
          </button>
        </div>
      </header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/50 md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-3/4 max-w-sm bg-white shadow-2xl flex flex-col"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-4 border-b border-gray-100">
                <span className="font-playfair font-bold text-[#006437] text-xl">T Vanamm</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-500 hover:text-[#006437] rounded-md"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-4 p-6">
                {navLinks.map((link) => (
                  <Link
                    key={link.name}
                    href={link.href}
                    onClick={() => setMobileMenuOpen(false)}
                    className="text-lg font-medium text-gray-800 hover:text-[#006437]"
                  >
                    {link.name}
                  </Link>
                ))}
              </div>

              <div className="mt-auto p-6 border-t border-gray-100">
                <Link
                  href="/#franchise-enquiry"
                  onClick={(e) => {
                    handleGetFranchise(e);
                    setMobileMenuOpen(false);
                  }}
                  className="flex justify-center items-center w-full bg-[#006437] text-white py-3 rounded-md font-semibold"
                >
                  Get Franchise
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
