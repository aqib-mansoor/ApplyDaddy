import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Cookie, X, ArrowRight } from 'lucide-react';

interface CookieConsentProps {
  onOpenCookies: () => void;
}

const CookieConsent: React.FC<CookieConsentProps> = ({ onOpenCookies }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = localStorage.getItem('cookie-consent');
    if (!consent) {
      const timer = setTimeout(() => setIsVisible(true), 2000);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    localStorage.setItem('cookie-consent', 'accepted');
    setIsVisible(false);
  };

  const handleDecline = () => {
    localStorage.setItem('cookie-consent', 'declined');
    setIsVisible(false);
  };

  return (
    <AnimatePresence>
      {isVisible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          className="fixed bottom-6 left-6 right-6 md:left-auto md:max-w-md z-[90]"
        >
          <div className="glass p-6 md:p-8 rounded-[2.5rem] shadow-2xl border-white/40 relative overflow-hidden group">
            {/* Background Accent */}
            <div className="absolute -top-12 -right-12 w-24 h-24 bg-gold/10 rounded-full blur-2xl group-hover:bg-gold/20 transition-colors"></div>
            
            <div className="relative z-10 space-y-6">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 bg-gold/10 rounded-2xl flex items-center justify-center">
                  <Cookie className="text-gold" size={24} />
                </div>
                <div>
                  <h4 className="text-lg font-bold text-charcoal">Cookie Notice</h4>
                  <p className="text-xs font-bold text-warm-gray uppercase tracking-widest">We value your privacy</p>
                </div>
              </div>

              <p className="text-sm text-warm-gray leading-relaxed">
                Daddy uses cookies to enhance your experience, analyze site traffic, and keep you logged in. By clicking "Accept", you agree to our use of cookies.
              </p>

              <div className="flex flex-col sm:flex-row gap-3">
                <button 
                  onClick={handleAccept}
                  className="flex-1 btn-primary py-3 text-sm"
                >
                  Accept All
                </button>
                <button 
                  onClick={handleDecline}
                  className="flex-1 px-6 py-3 bg-charcoal/5 text-charcoal font-bold rounded-full hover:bg-charcoal/10 transition-all text-sm"
                >
                  Decline
                </button>
              </div>

              <button 
                onClick={onOpenCookies}
                className="w-full flex items-center justify-center gap-2 text-xs font-bold text-warm-gray hover:text-terracotta transition-colors group/link"
              >
                Read our Cookie Policy
                <ArrowRight size={12} className="group-hover/link:translate-x-1 transition-transform" />
              </button>
            </div>

            <button 
              onClick={() => setIsVisible(false)}
              className="absolute top-4 right-4 w-8 h-8 rounded-full hover:bg-charcoal/5 flex items-center justify-center transition-colors"
            >
              <X size={16} className="text-warm-gray" />
            </button>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default CookieConsent;
