import React, { useState } from 'react';
import { NavLink, useNavigate } from 'react-router-dom';
import { 
  LayoutDashboard, 
  User, 
  Sparkles, 
  History, 
  LogOut,
  Crown,
  Settings
} from 'lucide-react';
import { auth } from '../firebase';
import { signOut } from 'firebase/auth';
import toast from 'react-hot-toast';
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';
import ConfirmModal from './ConfirmModal';

function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

const Sidebar: React.FC = () => {
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      // Clear job-related localStorage keys
      const keysToRemove = [
        'daddy_jobPost',
        'daddy_companyName',
        'daddy_jobTitle',
        'daddy_tone',
        'daddy_generated',
        'daddy_editedResponse'
      ];
      keysToRemove.forEach(key => {
        localStorage.removeItem(key);
        sessionStorage.removeItem(key);
      });
      
      // Clear all session storage just in case
      sessionStorage.clear();
      
      toast.success("Logged out. Daddy's waiting.");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const navItems = [
    { name: 'Dashboard', path: '/dashboard', icon: LayoutDashboard },
    { name: 'Profile', path: '/profile', icon: User },
    { name: 'Generate', path: '/generate', icon: Sparkles },
    { name: 'Applications', path: '/applications', icon: History },
    { name: 'Settings', path: '/settings', icon: Settings },
  ];

  return (
    <>
      {/* Desktop Sidebar */}
      <aside className="hidden lg:flex flex-col w-72 h-screen fixed left-0 top-0 bg-white border-r border-charcoal/5 p-8 z-40">
        <div className="flex items-center gap-3 mb-12 group cursor-pointer" onClick={() => navigate('/')}>
          <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center shadow-lg shadow-terracotta/20 group-hover:rotate-12 transition-transform">
            <Crown className="text-white" size={24} />
          </div>
          <h1 className="text-2xl font-display text-charcoal font-bold tracking-tight">ApplyDaddy</h1>
        </div>

        <nav className="flex-1 space-y-2">
          {navItems.map((item) => (
            <NavLink
              key={item.path}
              id={`nav-${item.name.toLowerCase()}`}
              to={item.path}
              className={({ isActive }) => cn(
                "flex items-center gap-4 px-6 py-4 rounded-2xl font-bold transition-all group",
                isActive 
                  ? "bg-sage/10 text-sage shadow-sm" 
                  : "text-warm-gray hover:bg-cream/50 hover:text-charcoal"
              )}
            >
              <item.icon size={20} className={cn(
                "transition-colors",
                "group-hover:text-terracotta"
              )} />
              {item.name}
            </NavLink>
          ))}
        </nav>

        <button
          onClick={() => setIsLogoutModalOpen(true)}
          className="flex items-center gap-4 px-6 py-4 rounded-2xl font-bold text-warm-gray hover:bg-terracotta/10 hover:text-terracotta transition-all mt-auto group"
        >
          <LogOut size={20} className="group-hover:rotate-12 transition-transform" />
          Logout
        </button>
      </aside>

      {/* Mobile Bottom Nav */}
      <nav className="lg:hidden fixed bottom-0 left-0 right-0 glass-dark m-2 p-1.5 flex items-center justify-around z-50 rounded-[2rem] shadow-2xl border-white/20">
        {navItems.map((item) => (
          <NavLink
            key={item.path}
            to={item.path}
            className={({ isActive }) => cn(
              "flex flex-col items-center gap-1 p-2 rounded-xl transition-all flex-1",
              isActive 
                ? "bg-sage text-white shadow-lg shadow-sage/20" 
                : "text-white/60 hover:text-white"
            )}
          >
            <item.icon size={18} />
            <span className="text-[9px] font-bold uppercase tracking-wider">{item.name}</span>
          </NavLink>
        ))}
      </nav>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to leave? Daddy will miss you."
        confirmText="Logout"
        type="danger"
      />
    </>
  );
};

export default Sidebar;
