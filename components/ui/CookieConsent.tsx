'use client';

import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';

export function CookieConsent() {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('tvanamm_cookie_consent');
    if (!consent) {
      // Show immediately or after a short delay
      const timer = setTimeout(() => setShow(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('tvanamm_cookie_consent', 'accepted');
    setShow(false);
    // Ideally here we trigger or unblock GA4 config, assuming GTM waits for this or we load it directly
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new Event('cookie_consent_accepted'));
    }
  };

  const handleDecline = () => {
    localStorage.setItem('tvanamm_cookie_consent', 'declined');
    setShow(false);
  };

  return (
    <AnimatePresence>
      {show && (
        <motion.div
          initial={{ y: 150, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 150, opacity: 0 }}
          transition={{ type: 'spring', damping: 25, stiffness: 180 }}
          className="fixed bottom-0 left-0 right-0 z-[100] bg-white border-t border-gray-200 shadow-2xl p-4 md:p-6"
        >
          <div className="container mx-auto max-w-5xl flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="text-sm text-gray-700 max-w-3xl">
              We use cookies for analytics and to improve your experience on our site. By clicking &quot;Accept&quot;, you agree to our use of cookies according to our Privacy Policy.
            </div>
            <div className="flex items-center gap-3 shrink-0">
              <button
                onClick={handleDecline}
                className="px-4 py-2 text-sm font-medium text-gray-600 hover:text-gray-900 transition-colors"
              >
                Decline
              </button>
              <button
                onClick={handleAccept}
                className="px-5 py-2 text-sm font-semibold bg-[#006437] text-white rounded hover:bg-[#004e2a] transition-colors"
              >
                Accept
              </button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
