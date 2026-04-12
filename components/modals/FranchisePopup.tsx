'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EnquiryForm } from '../forms/EnquiryForm';

export function FranchisePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Delay the popup slightly so it doesn't instantly snap in their face
    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[2000] flex justify-center items-center overflow-y-auto py-8 px-4">
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/60 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
          >
            {/* Close Button */}
            <button
              onClick={() => setIsOpen(false)}
              className="absolute top-4 right-4 p-2 bg-gray-100 text-gray-500 hover:text-gray-800 hover:bg-gray-200 rounded-full transition-colors z-20"
              aria-label="Close popup"
            >
              <X size={20} />
            </button>

            {/* Content */}
            <div className="p-6 md:p-8">
              <div className="text-center mb-6">
                <div className="inline-block px-3 py-1 bg-[#006437]/10 text-[#006437] text-xs font-bold tracking-wider rounded-md mb-3 uppercase">
                  Limited Opportunity
                </div>
                <h2 className="text-2xl font-playfair font-bold text-gray-900 leading-tight">
                  Start Your Journey <br/>
                  with <span className="text-[#C8A96E] tracking-wide">T Vanamm</span>
                </h2>
                <p className="text-gray-500 text-sm mt-3">
                  Take the first step towards a profitable venture. Complete the form to download our franchise brochure.
                </p>
              </div>

              <EnquiryForm hideHeadline={true} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
