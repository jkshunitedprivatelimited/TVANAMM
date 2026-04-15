'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('T VANAMM_cookie_consent');
    if (!consent) {
      // Show immediately or after a short delay
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('T VANAMM_cookie_consent', 'accepted');
    setShow(false);
    // Ideally here we trigger or unblock GA4 config, assuming GTM waits for this or we load it directly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie_consent_accepted'));
    }
  };

  const handleDecline = () => {
    localStorage.setItem('T VANAMM_cookie_consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ x: -100, opacity: 0 }}
          animate={{ x: 0, opacity: 1 }}
          exit={{ x: -100, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="fixed bottom-6 left-6 z-[100] w-[calc(100%-100px)] md:w-auto md:max-w-md bg-white/95 backdrop-blur-md border border-gray-200 shadow-[0_20px_50px_rgba(0,0,0,0.15)] p-5 md:p-6 rounded-2xl"
        >
          <div className="flex flex-col gap-4">
            <div className="text-sm text-gray-700 leading-relaxed">
              <span className="font-bold text-[#006437] block mb-1 text-base">Cookie Settings</span>
              We use cookies for analytics and to improve your experience on our site. By clicking &quot;Accept&quot;, you agree to our use of cookies according to our Privacy Policy.
            </div>
            <div className="flex items-center justify-end gap-3">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-500 hover:text-gray-900 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-6 py-2.5 text-sm font-bold bg-[#006437] text-white rounded-xl hover:bg-[#004e2a] shadow-lg shadow-[#006437]/20 transition-all active:scale-95"
              >
                Accept All
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
