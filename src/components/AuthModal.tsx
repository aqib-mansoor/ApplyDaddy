import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  X, 
  Mail, 
  Lock, 
  User, 
  ArrowRight, 
  Chrome, 
  RefreshCw,
  Eye,
  EyeOff,
  Crown,
  Sparkles,
  ShieldCheck,
  Zap
} from 'lucide-react';
import { 
  signInWithEmailAndPassword, 
  createUserWithEmailAndPassword, 
  signInWithPopup, 
  updateProfile 
} from 'firebase/auth';
import { auth, googleProvider } from '../firebase';
import { createUserProfile, getUserProfile } from '../services/userService';
import toast from 'react-hot-toast';

interface AuthModalProps {
  isOpen: boolean;
  onClose: () => void;
  initialMode?: 'login' | 'signup';
}

const AuthModal: React.FC<AuthModalProps> = ({ isOpen, onClose, initialMode = 'login' }) => {
  const [mode, setMode] = useState<'login' | 'signup'>(initialMode);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleAuth = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    try {
      if (mode === 'signup') {
        const { user } = await createUserWithEmailAndPassword(auth, email, password);
        await updateProfile(user, { displayName: fullName });
        await createUserProfile({
          uid: user.uid,
          fullName,
          email,
          skills: [],
          experience: '',
          bio: '',
        });
        toast.success("Welcome to ApplyDaddy!");
      } else {
        await signInWithEmailAndPassword(auth, email, password);
        toast.success("Welcome back!");
      }
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleSignIn = async () => {
    setLoading(true);
    try {
      const { user } = await signInWithPopup(auth, googleProvider);
      
      // Check if profile exists before creating
      const existingProfile = await getUserProfile(user.uid);
      if (!existingProfile) {
        await createUserProfile({
          uid: user.uid,
          fullName: user.displayName || '',
          email: user.email || '',
          skills: [],
          experience: '',
          bio: '',
        });
      }
      
      toast.success("Welcome to ApplyDaddy!");
      onClose();
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={onClose}
            className="absolute inset-0 bg-charcoal/60 backdrop-blur-xl"
          />
          
          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 40 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 40 }}
            className="relative w-full max-w-4xl bg-white rounded-[2.5rem] md:rounded-[3.5rem] shadow-2xl overflow-hidden flex flex-col md:flex-row min-h-[500px] md:min-h-[600px]"
          >
            {/* Left Side: Branding (Desktop) */}
            <div className="hidden md:flex md:w-[40%] bg-charcoal relative overflow-hidden p-12 flex-col justify-between">
              {/* Decorative background blurs */}
              <div className="absolute -top-20 -left-20 w-64 h-64 bg-terracotta/20 rounded-full blur-[80px]" />
              <div className="absolute -bottom-20 -right-20 w-64 h-64 bg-sage/20 rounded-full blur-[80px]" />
              
              <div className="relative z-10">
                <div className="flex items-center gap-3 mb-12">
                  <div className="w-10 h-10 bg-terracotta rounded-xl flex items-center justify-center shadow-lg shadow-terracotta/20">
                    <Crown className="text-white" size={24} />
                  </div>
                  <h1 className="text-2xl font-display text-white font-bold tracking-tight">ApplyDaddy</h1>
                </div>

                <div className="space-y-8">
                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.3 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-white/10 rounded-lg text-terracotta">
                      <Zap size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Lightning Fast</h4>
                      <p className="text-white/50 text-xs mt-1">Generate tailored responses in under 15 seconds.</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.4 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-white/10 rounded-lg text-sage">
                      <Sparkles size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">AI Powered</h4>
                      <p className="text-white/50 text-xs mt-1">Leveraging Gemini 3.1 for hyper-personalized pitches.</p>
                    </div>
                  </motion.div>

                  <motion.div 
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.5 }}
                    className="flex items-start gap-4"
                  >
                    <div className="p-2 bg-white/10 rounded-lg text-gold">
                      <ShieldCheck size={20} />
                    </div>
                    <div>
                      <h4 className="text-white font-bold text-sm">Secure & Private</h4>
                      <p className="text-white/50 text-xs mt-1">Your data is encrypted and never shared.</p>
                    </div>
                  </motion.div>
                </div>
              </div>

              <div className="relative z-10">
                <p className="text-white/30 text-[10px] font-bold uppercase tracking-[0.2em]">Trusted by 5,000+ job seekers</p>
              </div>
            </div>

            {/* Right Side: Form */}
            <div className="flex-1 p-8 md:p-16 relative">
              <button
                onClick={onClose}
                className="absolute top-6 right-6 p-2 hover:bg-cream rounded-full transition-colors z-20"
              >
                <X className="text-warm-gray w-6 h-6" />
              </button>

              <div className="max-w-sm mx-auto h-full flex flex-col justify-center">
                <div className="mb-10">
                  <motion.div
                    key={mode}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="space-y-2"
                  >
                    <h2 className="text-3xl md:text-4xl font-display text-charcoal tracking-tight">
                      {mode === 'login' ? 'Welcome Back' : 'Create Account'}
                    </h2>
                    <p className="text-warm-gray text-sm md:text-base">
                      {mode === 'login' ? "Daddy's been waiting for you." : "Start your journey to a better career today."}
                    </p>
                  </motion.div>
                </div>

                <form onSubmit={handleAuth} className="space-y-5">
                  <AnimatePresence mode="wait">
                    {mode === 'signup' && (
                      <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        exit={{ opacity: 0, height: 0 }}
                        className="relative"
                      >
                        <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                        <input
                          type="text"
                          placeholder="Full Name"
                          value={fullName}
                          onChange={(e) => setFullName(e.target.value)}
                          required
                          className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-charcoal/5 rounded-2xl focus:ring-4 focus:ring-terracotta/10 focus:border-terracotta/30 outline-none transition-all placeholder:text-warm-gray/40 font-medium"
                        />
                      </motion.div>
                    )}
                  </AnimatePresence>

                  <div className="relative">
                    <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                    <input
                      type="email"
                      placeholder="Email Address"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      required
                      className="w-full pl-12 pr-4 py-4 bg-cream/30 border border-charcoal/5 rounded-2xl focus:ring-4 focus:ring-terracotta/10 focus:border-terracotta/30 outline-none transition-all placeholder:text-warm-gray/40 font-medium"
                    />
                  </div>

                  <div className="relative">
                    <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                    <input
                      type={showPassword ? "text" : "password"}
                      placeholder="Password"
                      value={password}
                      onChange={(e) => setPassword(e.target.value)}
                      required
                      className="w-full pl-12 pr-12 py-4 bg-cream/30 border border-charcoal/5 rounded-2xl focus:ring-4 focus:ring-terracotta/10 focus:border-terracotta/30 outline-none transition-all placeholder:text-warm-gray/40 font-medium"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray hover:text-charcoal transition-colors"
                    >
                      {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                    </button>
                  </div>

                  <button
                    type="submit"
                    disabled={loading}
                    className="w-full py-4 bg-charcoal text-white font-bold rounded-2xl hover:bg-charcoal/90 transition-all shadow-xl shadow-charcoal/10 flex items-center justify-center gap-3 disabled:opacity-50 group"
                  >
                    {loading ? <RefreshCw className="animate-spin" size={20} /> : (
                      <>
                        {mode === 'login' ? 'Sign In' : 'Create Account'}
                        <ArrowRight size={20} className="group-hover:translate-x-1 transition-transform" />
                      </>
                    )}
                  </button>
                </form>

                <div className="relative my-10">
                  <div className="absolute inset-0 flex items-center">
                    <div className="w-full border-t border-charcoal/5"></div>
                  </div>
                  <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] text-warm-gray font-bold">
                    <span className="bg-white px-4">Or continue with</span>
                  </div>
                </div>

                <button
                  onClick={handleGoogleSignIn}
                  disabled={loading}
                  className="w-full py-4 bg-white border border-charcoal/5 text-charcoal font-bold rounded-2xl hover:bg-cream/50 transition-all flex items-center justify-center gap-3 shadow-sm disabled:opacity-50"
                >
                  <Chrome size={20} className="text-terracotta" />
                  Google Account
                </button>

                <p className="mt-10 text-center text-sm text-warm-gray font-medium">
                  {mode === 'login' ? "New to ApplyDaddy?" : "Already have an account?"}{' '}
                  <button
                    onClick={() => setMode(mode === 'login' ? 'signup' : 'login')}
                    className="text-terracotta font-bold hover:underline ml-1"
                  >
                    {mode === 'login' ? 'Create one' : 'Sign in'}
                  </button>
                </p>
              </div>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
};

export default AuthModal;
