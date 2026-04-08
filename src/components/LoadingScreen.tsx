import React from 'react';
import { motion } from 'framer-motion';
import { Crown } from 'lucide-react';

const LoadingScreen: React.FC = () => {
  return (
    <div className="min-h-screen bg-cream flex flex-col items-center justify-center relative overflow-hidden">
      {/* Background decorative elements */}
      <motion.div
        animate={{
          scale: [1, 1.2, 1],
          rotate: [0, 90, 0],
          opacity: [0.1, 0.2, 0.1],
        }}
        transition={{ duration: 8, repeat: Infinity, ease: "linear" }}
        className="absolute -top-24 -left-24 w-96 h-96 bg-terracotta rounded-full blur-[100px]"
      />
      <motion.div
        animate={{
          scale: [1, 1.3, 1],
          rotate: [0, -90, 0],
          opacity: [0.1, 0.15, 0.1],
        }}
        transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
        className="absolute -bottom-24 -right-24 w-96 h-96 bg-sage rounded-full blur-[100px]"
      />

      <div className="relative z-10 flex flex-col items-center">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5 }}
          className="relative"
        >
          {/* Pulsing rings */}
          <motion.div
            animate={{
              scale: [1, 1.5],
              opacity: [0.5, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut" }}
            className="absolute inset-0 bg-terracotta/20 rounded-3xl"
          />
          <motion.div
            animate={{
              scale: [1, 1.8],
              opacity: [0.3, 0],
            }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeOut", delay: 0.5 }}
            className="absolute inset-0 bg-sage/20 rounded-3xl"
          />

          <div className="w-20 h-20 bg-charcoal rounded-3xl flex items-center justify-center shadow-2xl relative z-10">
            <Crown className="text-white" size={40} />
          </div>
        </motion.div>

        <motion.div
          initial={{ y: 20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.3, duration: 0.5 }}
          className="mt-8 text-center"
        >
          <h1 className="text-2xl font-display text-charcoal font-bold tracking-tight">ApplyDaddy</h1>
          <div className="mt-4 flex gap-1 justify-center">
            {[0, 1, 2].map((i) => (
              <motion.div
                key={i}
                animate={{
                  scale: [1, 1.5, 1],
                  backgroundColor: ["#E07A5F", "#8BA88F", "#E07A5F"],
                }}
                transition={{
                  duration: 1,
                  repeat: Infinity,
                  delay: i * 0.2,
                }}
                className="w-2 h-2 rounded-full"
              />
            ))}
          </div>
        </motion.div>
      </div>
    </div>
  );
};

export default LoadingScreen;
