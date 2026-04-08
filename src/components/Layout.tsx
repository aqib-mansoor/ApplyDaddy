import React from 'react';
import { Outlet, Navigate } from 'react-router-dom';
import { useAuthStore } from '../store/useAuthStore';
import Sidebar from './Sidebar';
import OnboardingTour from './OnboardingTour';
import LoadingScreen from './LoadingScreen';
import { motion } from 'framer-motion';

const Layout: React.FC = () => {
  const { user, loading } = useAuthStore();

  if (loading) {
    return <LoadingScreen />;
  }

  if (!user) {
    return <Navigate to="/" />;
  }

  return (
    <div className="min-h-screen bg-cream">
      <Sidebar />
      <OnboardingTour />
      <main className="lg:ml-72 p-6 md:p-12 pb-32 lg:pb-12">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <Outlet />
        </motion.div>
      </main>
    </div>
  );
};

export default Layout;
