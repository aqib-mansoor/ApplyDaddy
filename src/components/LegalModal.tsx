import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Shield, FileText, Cookie } from 'lucide-react';

interface LegalModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'privacy' | 'terms' | 'cookies';
}

const LegalModal: React.FC<LegalModalProps> = ({ isOpen, onClose, type }) => {
  const content = {
    privacy: {
      title: "Privacy Policy",
      icon: <Shield className="text-terracotta" size={24} />,
      sections: [
        {
          title: "1. Information We Collect",
          content: "We collect information you provide directly to us, such as when you create an account, update your profile, or use our AI generation services. This includes your name, email address, and any professional information you provide."
        },
        {
          title: "2. How We Use Your Information",
          content: "We use the information we collect to provide, maintain, and improve our services, to develop new features, and to protect ApplyDaddy and our users. This includes using your data to train and refine our AI models (anonymized)."
        },
        {
          title: "3. Data Security",
          content: "We use industry-standard security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. Your data is stored securely using Firebase."
        },
        {
          title: "4. Your Choices",
          content: "You can access, update, or delete your account information at any time through your account settings. You can also request a full export of your data."
        }
      ]
    },
    terms: {
      title: "Terms of Service",
      icon: <FileText className="text-sage" size={24} />,
      sections: [
        {
          title: "1. Acceptance of Terms",
          content: "By accessing or using ApplyDaddy, you agree to be bound by these Terms of Service and all applicable laws and regulations."
        },
        {
          title: "2. Use License",
          content: "Permission is granted to temporarily use ApplyDaddy for personal, non-commercial transitory viewing only. This is the grant of a license, not a transfer of title."
        },
        {
          title: "3. AI Content Disclaimer",
          content: "ApplyDaddy uses artificial intelligence to generate content. While we strive for accuracy, we do not guarantee the correctness or suitability of generated content for any specific purpose. Users are responsible for reviewing all generated content."
        },
        {
          title: "4. Limitations",
          content: "In no event shall ApplyDaddy or its suppliers be liable for any damages arising out of the use or inability to use the services."
        }
      ]
    },
    cookies: {
      title: "Cookie Policy",
      icon: <Cookie className="text-gold" size={24} />,
      sections: [
        {
          title: "1. What are Cookies?",
          content: "Cookies are small text files stored on your device when you visit a website. They help us remember your preferences and improve your experience."
        },
        {
          title: "2. How We Use Cookies",
          content: "We use cookies for authentication, security, and to analyze how our services are used. For example, cookies help us keep you logged in as you navigate between pages."
        },
        {
          title: "3. Third-Party Cookies",
          content: "We may use third-party services like Google Analytics that use cookies to collect anonymous information about your visit."
        },
        {
          title: "4. Managing Cookies",
          content: "Most web browsers allow you to control cookies through their settings. However, disabling cookies may limit your ability to use certain features of ApplyDaddy."
        }
      ]
    }
  };

  const activeContent = content[type];

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-6">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-md"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl bg-cream rounded-[2.5rem] shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
          >
            {/* Header */}
            <div className="p-6 md:p-8 border-b border-charcoal/5 flex items-center justify-between bg-white/50">
              <div className="flex items-center gap-4">
                <div className="w-12 h-12 rounded-2xl bg-white shadow-sm flex items-center justify-center">
                  {activeContent.icon}
                </div>
                <div>
                  <h3 className="text-2xl font-display font-bold text-charcoal">{activeContent.title}</h3>
                  <p className="text-xs font-bold text-warm-gray uppercase tracking-widest">Last Updated: April 2024</p>
                </div>
              </div>
              <button 
                onClick={onClose}
                className="w-10 h-10 rounded-full hover:bg-charcoal/5 flex items-center justify-center transition-colors"
              >
                <X size={20} className="text-warm-gray" />
              </button>
            </div>

            {/* Content */}
            <div className="flex-1 overflow-y-auto p-6 md:p-8 space-y-8 custom-scrollbar">
              {activeContent.sections.map((section, i) => (
                <div key={i} className="space-y-3">
                  <h4 className="text-lg font-bold text-charcoal">{section.title}</h4>
                  <p className="text-warm-gray leading-relaxed">{section.content}</p>
                </div>
              ))}
              
              <div className="p-6 bg-charcoal/5 rounded-2xl border border-charcoal/5">
                <p className="text-sm text-warm-gray italic text-center">
                  If you have any questions about our {activeContent.title.toLowerCase()}, please contact us at support@applydaddy.com
                </p>
              </div>
            </div>

            {/* Footer */}
            <div className="p-6 md:p-8 border-t border-charcoal/5 bg-white/50 flex justify-end">
              <button 
                onClick={onClose}
                className="btn-primary"
              >
                I Understand
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default LegalModal;
