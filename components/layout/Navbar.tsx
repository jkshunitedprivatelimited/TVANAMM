'use client';

import { useState, useEffect } from 'react';
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
  const [scrolled, setScrolled] = useState(false);
  const pathname = usePathname();

  useEffect(() => {
    const handleScroll = () => {
      setScrolled(window.scrollY > 20);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

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
      <motion.header
        initial={{ y: -100 }}
        animate={{ y: 0 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          scrolled ? 'bg-white/90 backdrop-blur-md shadow-md py-3' : 'bg-transparent py-5'
        }`}
      >
        <div className="container mx-auto px-4 lg:px-8 flex justify-between items-center">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-3 relative group">
            <motion.div whileHover={{ scale: 1.05 }} transition={{ type: 'spring', stiffness: 300 }}>
              <Image 
                src="/images/logo.png" 
                alt="T Vanamm Logo" 
                width={60} 
                height={60} 
                className="object-contain drop-shadow-md" 
              />
            </motion.div>
            <div className="flex flex-col">
              <span className={`font-playfair font-bold text-2xl tracking-wide transition-colors duration-300 ${scrolled ? 'text-primary' : 'text-white drop-shadow-sm'}`}>
                T Vanamm
              </span>
              <span className="font-playfair italic text-xs text-accent -mt-1 ml-4 transition-colors font-medium">
                &quot;A Taste of Purity&quot;
              </span>
            </div>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            {navLinks.map((link) => {
              const isActive = pathname === link.href;
              return (
                <Link
                  key={link.name}
                  href={link.href}
                  className="relative group text-base font-semibold transition-colors"
                >
                  <span className={`${scrolled ? (isActive ? 'text-primary' : 'text-primary-dark') : (isActive ? 'text-accent' : 'text-white')} group-hover:text-accent transition-colors duration-300`}>
                    {link.name}
                  </span>
                  {isActive && (
                    <motion.div
                      layoutId="activeTab"
                      className="absolute -bottom-1 left-0 right-0 h-0.5 bg-accent"
                    />
                  )}
                  <span className="absolute -bottom-1 left-0 w-0 h-0.5 bg-accent transition-all duration-300 group-hover:w-full opacity-0 group-hover:opacity-100" />
                </Link>
              );
            })}
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Link
                href="/#franchise-enquiry"
                onClick={handleGetFranchise}
                className="px-6 py-2.5 rounded-full font-semibold transition-all shadow-lg hover:shadow-xl bg-accent text-white hover:bg-accent-light hover:text-primary-dark"
              >
                Get Franchise
              </Link>
            </motion.div>
          </nav>

          {/* Mobile Menu Toggle */}
          <motion.button
            whileTap={{ scale: 0.9 }}
            className={`md:hidden p-2 rounded-md ${scrolled ? 'text-primary' : 'text-white'}`}
            onClick={() => setMobileMenuOpen(true)}
            aria-label="Open menu"
          >
            <Menu size={28} />
          </motion.button>
        </div>
      </motion.header>

      {/* Mobile Drawer */}
      <AnimatePresence>
        {mobileMenuOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-[60] bg-black/60 backdrop-blur-sm md:hidden"
            onClick={() => setMobileMenuOpen(false)}
          >
            <motion.div
              initial={{ x: '100%' }}
              animate={{ x: 0 }}
              exit={{ x: '100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="absolute right-0 top-0 bottom-0 w-4/5 max-w-sm bg-white shadow-2xl flex flex-col pt-safe"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex justify-between items-center p-6 border-b border-gray-100/50">
                <span className="font-playfair font-bold text-primary text-2xl">T Vanamm</span>
                <button
                  onClick={() => setMobileMenuOpen(false)}
                  className="p-2 text-gray-400 hover:text-accent rounded-full bg-gray-50 transition-colors"
                >
                  <X size={24} />
                </button>
              </div>

              <div className="flex flex-col gap-2 p-6">
                {navLinks.map((link, i) => (
                  <motion.div
                    key={link.name}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.1 }}
                  >
                    <Link
                      href={link.href}
                      onClick={() => setMobileMenuOpen(false)}
                      className={`block py-3 px-4 rounded-xl text-lg font-medium transition-colors ${
                        pathname === link.href ? 'bg-primary/5 text-primary' : 'text-gray-700 hover:bg-gray-50 hover:text-primary'
                      }`}
                    >
                      {link.name}
                    </Link>
                  </motion.div>
                ))}
              </div>

              <div className="mt-auto p-6 border-t border-gray-100/50">
                <motion.div whileTap={{ scale: 0.95 }}>
                  <Link
                    href="/#franchise-enquiry"
                    onClick={(e) => {
                      handleGetFranchise(e);
                      setMobileMenuOpen(false);
                    }}
                    className="flex justify-center items-center w-full bg-primary text-white py-4 rounded-xl font-semibold shadow-lg hover:bg-primary-dark transition-colors"
                  >
                    Get Franchise
                  </Link>
                </motion.div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
