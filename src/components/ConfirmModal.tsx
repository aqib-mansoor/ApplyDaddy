import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AlertTriangle, X } from 'lucide-react';

interface ConfirmModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmModal: React.FC<ConfirmModalProps> = ({
  isOpen,
  onClose,
  onConfirm,
  title,
  message,
  confirmText = 'Confirm',
  cancelText = 'Cancel',
  type = 'danger'
}) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/40 backdrop-blur-sm"
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className="relative w-full max-w-md glass p-8 rounded-[2rem] shadow-2xl border-none"
          >
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 hover:bg-cream rounded-full transition-colors"
            >
              <X size={20} className="text-warm-gray" />
            </button>

            <div className="flex flex-col items-center text-center">
              <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-6 ${
                type === 'danger' ? 'bg-terracotta/10 text-terracotta' : 
                type === 'warning' ? 'bg-gold/10 text-gold' : 
                'bg-sage/10 text-sage'
              }`}>
                <AlertTriangle size={32} />
              </div>

              <h3 className="text-2xl font-serif text-charcoal mb-2">{title}</h3>
              <p className="text-warm-gray mb-8">{message}</p>

              <div className="flex items-center gap-4 w-full">
                <button
                  onClick={onClose}
                  className="flex-1 py-3 px-6 glass text-sm font-bold text-charcoal hover:bg-white transition-all rounded-xl"
                >
                  {cancelText}
                </button>
                <button
                  onClick={() => {
                    onConfirm();
                    onClose();
                  }}
                  className={`flex-1 py-3 px-6 text-sm font-bold text-white transition-all rounded-xl shadow-lg ${
                    type === 'danger' ? 'bg-terracotta hover:bg-terracotta/90 shadow-terracotta/20' : 
                    type === 'warning' ? 'bg-gold hover:bg-gold/90 shadow-gold/20' : 
                    'bg-sage hover:bg-sage/90 shadow-sage/20'
                  }`}
                >
                  {confirmText}
                </button>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default ConfirmModal;
