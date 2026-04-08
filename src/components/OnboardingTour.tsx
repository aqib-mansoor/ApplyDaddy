import React, { useState, useEffect, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronRight, ChevronLeft, X, Sparkles, Crown } from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';

interface Step {
  id: string;
  targetId: string;
  title: string;
  content: string;
  path: string;
  position: 'top' | 'bottom' | 'left' | 'right' | 'center';
}

const steps: Step[] = [
  {
    id: 'welcome',
    targetId: 'dashboard-header',
    title: "Welcome to ApplyDaddy!",
    content: "I'm here to help you land that dream job. Let's take a quick tour of your new workspace.",
    path: '/dashboard',
    position: 'bottom'
  },
  {
    id: 'profile',
    targetId: 'nav-profile',
    title: "Complete Your Profile",
    content: "First things first: tell Daddy about your skills and experience. This helps me craft better pitches for you.",
    path: '/dashboard',
    position: 'right'
  },
  {
    id: 'generate',
    targetId: 'nav-generate',
    title: "The Magic Lab",
    content: "This is where we generate your winning emails and WhatsApp messages. Just paste a job description and watch me work.",
    path: '/dashboard',
    position: 'right'
  },
  {
    id: 'job-input',
    targetId: 'job-post-input',
    title: "Paste & Prosper",
    content: "Simply paste the job description here. Don't worry about the mess, I'll clean it up.",
    path: '/generate',
    position: 'bottom'
  },
  {
    id: 'magic-fill',
    targetId: 'magic-fill-btn',
    title: "Lazy? Use Magic Fill",
    content: "Click this to automatically extract the company name and job title from the text. Daddy's efficient like that.",
    path: '/generate',
    position: 'top'
  },
  {
    id: 'generate-btn',
    targetId: 'generate-btn',
    title: "Let's Go!",
    content: "Once you're ready, hit this button to generate your personalized responses.",
    path: '/generate',
    position: 'top'
  }
];

const OnboardingTour: React.FC = () => {
  const [currentStep, setCurrentStep] = useState(-1);
  const [targetRect, setTargetRect] = useState<DOMRect | null>(null);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    const hasSeenTour = localStorage.getItem('daddy_onboarding_complete');
    if (!hasSeenTour) {
      // Start tour after a short delay
      const timer = setTimeout(() => setCurrentStep(0), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const updateTargetRect = useCallback(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      const element = document.getElementById(step.targetId);
      if (element) {
        setTargetRect(element.getBoundingClientRect());
      } else {
        setTargetRect(null);
      }
    }
  }, [currentStep]);

  useEffect(() => {
    updateTargetRect();
    window.addEventListener('resize', updateTargetRect);
    window.addEventListener('scroll', updateTargetRect);
    return () => {
      window.removeEventListener('resize', updateTargetRect);
      window.removeEventListener('scroll', updateTargetRect);
    };
  }, [updateTargetRect]);

  useEffect(() => {
    if (currentStep >= 0 && currentStep < steps.length) {
      const step = steps[currentStep];
      if (location.pathname !== step.path) {
        navigate(step.path);
      }
    }
  }, [currentStep, navigate, location.pathname]);

  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      completeTour();
    }
  };

  const handleBack = () => {
    if (currentStep > 0) {
      setCurrentStep(currentStep - 1);
    }
  };

  const completeTour = () => {
    localStorage.setItem('daddy_onboarding_complete', 'true');
    setCurrentStep(-1);
  };

  if (currentStep === -1) return null;

  const step = steps[currentStep];

  return (
    <div className="fixed inset-0 z-[100] pointer-events-none">
      {/* Overlay */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        className="absolute inset-0 bg-charcoal/20 backdrop-blur-[2px] pointer-events-auto"
        onClick={completeTour}
      />

      {/* Spotlight */}
      {targetRect && (
        <motion.div
          initial={false}
          animate={{
            top: targetRect.top - 8,
            left: targetRect.left - 8,
            width: targetRect.width + 16,
            height: targetRect.height + 16,
          }}
          className="absolute border-2 border-terracotta rounded-2xl shadow-[0_0_0_9999px_rgba(26,26,26,0.4)] z-[101]"
        />
      )}

      {/* Tooltip */}
      <AnimatePresence mode="wait">
        <motion.div
          key={step.id}
          initial={{ opacity: 0, y: 20, scale: 0.9 }}
          animate={{ 
            opacity: 1, 
            scale: 1,
            top: targetRect ? (step.position === 'bottom' ? targetRect.bottom + 24 : step.position === 'top' ? targetRect.top - 200 : targetRect.top) : '50%',
            left: targetRect ? (step.position === 'right' ? targetRect.right + 24 : targetRect.left) : '50%',
            x: targetRect ? 0 : '-50%',
            y: targetRect ? 0 : '-50%',
          }}
          exit={{ opacity: 0, scale: 0.9 }}
          className="absolute z-[102] w-full max-w-sm glass p-6 rounded-[2rem] shadow-2xl border-none pointer-events-auto"
        >
          <button 
            onClick={completeTour}
            className="absolute top-4 right-4 p-1 hover:bg-cream rounded-full transition-colors"
          >
            <X size={16} className="text-warm-gray" />
          </button>

          <div className="flex items-center gap-3 mb-4">
            <div className="w-10 h-10 bg-terracotta/10 rounded-xl flex items-center justify-center text-terracotta">
              <Sparkles size={20} />
            </div>
            <h4 className="text-lg font-display text-charcoal">{step.title}</h4>
          </div>

          <p className="text-sm text-warm-gray leading-relaxed mb-6">
            {step.content}
          </p>

          <div className="flex items-center justify-between">
            <div className="flex gap-1">
              {steps.map((_, i) => (
                <div 
                  key={i} 
                  className={`w-1.5 h-1.5 rounded-full transition-all ${i === currentStep ? 'bg-terracotta w-4' : 'bg-warm-gray/20'}`}
                />
              ))}
            </div>

            <div className="flex gap-2">
              {currentStep > 0 && (
                <button
                  onClick={handleBack}
                  className="p-2 glass text-warm-gray hover:text-charcoal rounded-xl transition-all"
                >
                  <ChevronLeft size={20} />
                </button>
              )}
              <button
                onClick={handleNext}
                className="px-6 py-2 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta/90 transition-all shadow-lg shadow-terracotta/20 flex items-center gap-2"
              >
                {currentStep === steps.length - 1 ? 'Finish' : 'Next'}
                <ChevronRight size={18} />
              </button>
            </div>
          </div>
        </motion.div>
      </AnimatePresence>
    </div>
  );
};

export default OnboardingTour;
