'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X } from 'lucide-react';
import { EnquiryForm } from '../forms/EnquiryForm';

const POPUP_DISMISSED_KEY = 'tvanamm_popup_dismissed';
const DISMISS_DURATION_MS = 24 * 60 * 60 * 1000; // 24 hours

export function FranchisePopup() {
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    // Check if user already dismissed the popup recently
    const dismissedAt = localStorage.getItem(POPUP_DISMISSED_KEY);
    if (dismissedAt) {
      const elapsed = Date.now() - parseInt(dismissedAt, 10);
      if (elapsed < DISMISS_DURATION_MS) return; // Don't show again within 24h
    }

    const timer = setTimeout(() => {
      setIsOpen(true);
    }, 1500);
    
    return () => clearTimeout(timer);
  }, []);

  const handleClose = () => {
    setIsOpen(false);
    localStorage.setItem(POPUP_DISMISSED_KEY, Date.now().toString());
  };

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
            onClick={handleClose}
          />

          {/* Modal */}
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative bg-white w-full max-w-lg rounded-2xl shadow-2xl overflow-hidden z-10"
            role="dialog"
            aria-modal="true"
            aria-label="Franchise Enquiry"
          >
            {/* Close Button */}
            <button
              onClick={handleClose}
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
                  with <span className="text-[#C8A96E] tracking-wide">T VANAMM</span>
                </h2>
                <div className="text-black text-sm mt-4 space-y-1 leading-relaxed">
                  <p className="font-medium text-black">Take the first step towards a profitable venture.</p>
                  <p>Complete the form to download our franchise brochure.</p>
                </div>
              </div>

              <EnquiryForm hideHeadline={true} />
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
