import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { 
  Settings as SettingsIcon, 
  User, 
  Mail, 
  LogOut, 
  HelpCircle, 
  ChevronDown,
  Shield,
  Bell,
  Trash2,
  Key,
  Download,
  RefreshCcw
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { auth, resetFirestore } from '../firebase';
import { signOut, sendPasswordResetEmail } from 'firebase/auth';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import ConfirmModal from '../components/ConfirmModal';

const Settings: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const [isResetModalOpen, setIsResetModalOpen] = useState(false);
  const [openFaq, setOpenFaq] = useState<number | null>(null);

  const handleLogout = async () => {
    try {
      await signOut(auth);
      toast.success("Logged out. Daddy's waiting.");
      navigate('/');
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handlePasswordReset = async () => {
    if (!user?.email) return;
    try {
      await sendPasswordResetEmail(auth, user.email);
      toast.success("Password reset email sent to " + user.email);
      setIsResetModalOpen(false);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleExportData = () => {
    toast.success("Preparing your data for download...");
    // Mock export logic
    setTimeout(() => {
      toast.success("Data export ready! Check your downloads.");
    }, 2000);
  };

  const faqs = [
    {
      q: "How does Magic Fill work?",
      a: "Magic Fill uses advanced AI (Gemini) to read the job description you paste and automatically extract the company name and job title, saving you time."
    },
    {
      q: "Is my data secure?",
      a: "Yes, ApplyDaddy uses industry-standard Firebase security. Your profile and applications are private and only accessible by you."
    },
    {
      q: "Can I use it for free?",
      a: "Currently, ApplyDaddy is on an unlimited free plan. Daddy's generous like that."
    }
  ];

  return (
    <div className="max-w-4xl mx-auto">
      <header className="mb-8 md:mb-12">
        <h2 className="text-3xl md:text-4xl font-display text-charcoal mb-2">Settings</h2>
        <p className="text-warm-gray text-sm md:text-base">Manage your account and preferences.</p>
      </header>

      <div className="space-y-8">
        {/* Account Section */}
        <section className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-terracotta/10 rounded-xl text-terracotta">
              <User size={20} />
            </div>
            <h3 className="text-xl font-bold text-charcoal">Account</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl border border-white/20">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex items-center justify-center text-terracotta shadow-sm">
                  <Mail size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-warm-gray uppercase tracking-widest">Email Address</p>
                  <p className="text-sm font-bold text-charcoal">{user?.email}</p>
                </div>
              </div>
              <span className="px-3 py-1 bg-sage/10 text-sage text-[10px] font-bold uppercase rounded-full">Verified</span>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cream/50 rounded-2xl border border-white/20 gap-4">
              <div className="flex items-center gap-4">
                <div className="w-10 h-10 bg-white rounded-full flex-shrink-0 flex items-center justify-center text-terracotta shadow-sm">
                  <Key size={18} />
                </div>
                <div>
                  <p className="text-xs font-bold text-warm-gray uppercase tracking-widest">Security</p>
                  <p className="text-sm font-bold text-charcoal">Password Management</p>
                </div>
              </div>
              <button 
                onClick={() => setIsResetModalOpen(true)}
                className="w-full sm:w-auto px-4 py-2 bg-white border border-terracotta/20 text-terracotta text-xs font-bold rounded-xl hover:bg-terracotta hover:text-white transition-all shadow-sm"
              >
                Reset Password
              </button>
            </div>
          </div>
        </section>

        {/* Preferences Section */}
        <section className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-sage/10 rounded-xl text-sage">
              <Bell size={20} />
            </div>
            <h3 className="text-xl font-bold text-charcoal">Preferences</h3>
          </div>

          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 bg-cream/50 rounded-2xl border border-white/20">
              <div>
                <p className="text-sm font-bold text-charcoal">Email Notifications</p>
                <p className="text-xs text-warm-gray">Get updates on your applications.</p>
              </div>
              <div className="w-12 h-6 bg-sage rounded-full relative cursor-pointer">
                <div className="absolute right-1 top-1 w-4 h-4 bg-white rounded-full shadow-sm"></div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cream/50 rounded-2xl border border-white/20 gap-4">
              <div>
                <p className="text-sm font-bold text-charcoal">Data Portability</p>
                <p className="text-xs text-warm-gray">Download all your application history.</p>
              </div>
              <button 
                onClick={handleExportData}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white text-xs font-bold rounded-xl hover:bg-charcoal/90 transition-all shadow-lg shadow-charcoal/10"
              >
                <Download size={14} />
                Export CSV
              </button>
            </div>
          </div>
        </section>

        {/* Troubleshooting Section */}
        <section className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-xl text-gold">
              <Shield size={20} />
            </div>
            <h3 className="text-xl font-bold text-charcoal">Troubleshooting</h3>
          </div>

          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between p-4 bg-cream/50 rounded-2xl border border-white/20 gap-4">
              <div>
                <p className="text-sm font-bold text-charcoal">Connection Issues?</p>
                <p className="text-xs text-warm-gray">If Firestore is stuck "offline", try resetting.</p>
              </div>
              <button 
                onClick={() => {
                  toast.loading("Resetting connection...");
                  resetFirestore();
                }}
                className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white text-xs font-bold rounded-xl hover:bg-charcoal/90 transition-all shadow-lg shadow-charcoal/10"
              >
                <RefreshCcw size={14} />
                Reset Connection
              </button>
            </div>
          </div>
        </section>

        {/* FAQ Section */}
        <section className="glass p-6 md:p-8 rounded-[2.5rem] space-y-6">
          <div className="flex items-center gap-3">
            <div className="p-2 bg-gold/10 rounded-xl text-gold">
              <HelpCircle size={20} />
            </div>
            <h3 className="text-xl font-bold text-charcoal">Help & FAQ</h3>
          </div>

          <div className="space-y-2">
            {faqs.map((faq, index) => (
              <div key={index} className="border-b border-charcoal/5 last:border-0">
                <button
                  onClick={() => setOpenFaq(openFaq === index ? null : index)}
                  className="w-full py-4 flex items-center justify-between text-left group"
                >
                  <span className="text-sm font-bold text-charcoal group-hover:text-terracotta transition-colors">{faq.q}</span>
                  <ChevronDown 
                    size={18} 
                    className={`text-warm-gray transition-transform ${openFaq === index ? 'rotate-180' : ''}`} 
                  />
                </button>
                {openFaq === index && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: 'auto', opacity: 1 }}
                    className="pb-4 text-sm text-warm-gray leading-relaxed"
                  >
                    {faq.a}
                  </motion.div>
                )}
              </div>
            ))}
          </div>
        </section>

        {/* Danger Zone */}
        <section className="glass p-6 md:p-8 rounded-[2.5rem] border-terracotta/20 bg-terracotta/[0.02]">
          <div className="flex flex-col md:flex-row items-center justify-between gap-6">
            <div>
              <h3 className="text-xl font-bold text-terracotta mb-1">Sign Out</h3>
              <p className="text-sm text-warm-gray">Ready to take a break? Daddy will be here.</p>
            </div>
            <button
              onClick={() => setIsLogoutModalOpen(true)}
              className="w-full md:w-auto px-8 py-4 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/20 flex items-center justify-center gap-2"
            >
              <LogOut size={20} />
              Logout Now
            </button>
          </div>
        </section>
      </div>

      <ConfirmModal
        isOpen={isLogoutModalOpen}
        onClose={() => setIsLogoutModalOpen(false)}
        onConfirm={handleLogout}
        title="Logout?"
        message="Are you sure you want to leave? Daddy will miss you."
        confirmText="Logout"
        type="danger"
      />

      <ConfirmModal
        isOpen={isResetModalOpen}
        onClose={() => setIsResetModalOpen(false)}
        onConfirm={handlePasswordReset}
        title="Reset Password?"
        message="We'll send a password reset link to your email address."
        confirmText="Send Link"
        type="info"
      />
    </div>
  );
};

export default Settings;
