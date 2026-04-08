import React from 'react';
import { motion } from 'framer-motion';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

interface SkeletonProps {
  className?: string;
}

export const Skeleton: React.FC<SkeletonProps> = ({ className }) => {
  return (
    <motion.div
      animate={{
        opacity: [0.5, 1, 0.5],
      }}
      transition={{
        duration: 1.5,
        repeat: Infinity,
        ease: "easeInOut",
      }}
      className={cn("bg-charcoal/5 rounded-md", className)}
    />
  );
};

export const ProfileSkeleton: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12 animate-pulse">
      <header className="mb-8 md:mb-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <Skeleton className="w-12 h-12 md:w-20 md:h-20 rounded-2xl md:rounded-[2rem]" />
          <div className="space-y-2">
            <Skeleton className="h-8 md:h-12 w-48 md:w-64" />
            <Skeleton className="h-3 md:h-4 w-24 md:w-32" />
          </div>
        </div>
        <Skeleton className="w-24 h-10 md:w-32 md:h-12 rounded-xl md:rounded-2xl" />
      </header>

      <div className="space-y-6 md:space-y-8">
        <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-8 md:space-y-12 border border-white/40">
          <div className="grid md:grid-cols-2 gap-8 md:gap-12">
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
            <div className="space-y-2">
              <Skeleton className="h-3 w-16" />
              <Skeleton className="h-8 w-full" />
            </div>
          </div>
          <div className="space-y-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-32 w-full rounded-2xl" />
          </div>
          <div className="space-y-4">
            <Skeleton className="h-3 w-32" />
            <Skeleton className="h-48 w-full rounded-2xl" />
          </div>
        </div>
      </div>
    </div>
  );
};

export const DashboardSkeleton: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[2rem]" />
        ))}
      </div>
      <div className="glass p-8 rounded-[2.5rem] space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="space-y-4">
          {[1, 2, 3, 4].map((i) => (
            <Skeleton key={i} className="h-20 rounded-2xl" />
          ))}
        </div>
      </div>
    </div>
  );
};

export const ApplicationsSkeleton: React.FC = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 pb-20">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-2">
          <Skeleton className="h-12 md:h-16 w-64 md:w-96" />
          <Skeleton className="h-4 w-48 md:w-64" />
        </div>
        <Skeleton className="w-32 h-12 rounded-xl" />
      </header>

      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[1, 2, 3, 4].map((i) => (
          <Skeleton key={i} className="h-32 rounded-3xl" />
        ))}
      </div>

      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <Skeleton className="flex-1 h-14 rounded-2xl" />
        <Skeleton className="w-full lg:w-48 h-14 rounded-2xl" />
      </div>

      <div className="space-y-4">
        {[1, 2, 3, 4, 5].map((i) => (
          <Skeleton key={i} className="h-32 rounded-[2.5rem]" />
        ))}
      </div>
    </div>
  );
};
