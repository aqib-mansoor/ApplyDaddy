import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { 
  Crown, 
  ArrowRight, 
  Zap, 
  Target, 
  Send, 
  ChevronDown, 
  Github, 
  Twitter, 
  Linkedin,
  Sparkles,
  MousePointer2,
  CheckCircle2,
  Mail,
  MessageSquare,
  Star,
  Heart,
  RefreshCw,
  UserCircle,
  Clipboard,
  Wand2,
  Rocket
} from 'lucide-react';
import AuthModal from '../components/AuthModal';
import { useAuthStore } from '../store/useAuthStore';
import { Navigate } from 'react-router-dom';
import LoadingScreen from '../components/LoadingScreen';
import gsap from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const LandingPage: React.FC = () => {
  const { user, loading: authLoading } = useAuthStore();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [authMode, setAuthMode] = useState<'login' | 'signup'>('login');
  const [openFaq, setOpenFaq] = useState<number | null>(null);
  
  const headlineRef = useRef<HTMLHeadingElement>(null);

  useEffect(() => {
    if (headlineRef.current && headlineRef.current.children.length === 0) {
      const words = headlineRef.current.innerText.split(' ');
      headlineRef.current.innerHTML = words.map(word => `<span class="inline-block">${word}</span>`).join(' ');
      
      gsap.fromTo(headlineRef.current.querySelectorAll('span'), 
        { y: 50, opacity: 0 },
        { y: 0, opacity: 1, duration: 0.8, stagger: 0.1, ease: 'power3.out' }
      );
    }
  }, []);

  if (authLoading) {
    return <LoadingScreen />;
  }

  if (user) return <Navigate to="/dashboard" />;

  const openModal = (mode: 'login' | 'signup') => {
    setAuthMode(mode);
    setIsAuthModalOpen(true);
  };

  const features = [
    {
      title: "15 Seconds Per Application",
      description: "Stop wasting hours. Daddy generates tailored responses in the blink of an eye.",
      icon: Zap,
      color: "text-gold bg-gold/10"
    },
    {
      title: "Tailored to Your Skills",
      description: "Daddy knows your worth. Every response is crafted to highlight your unique strengths.",
      icon: Target,
      color: "text-terracotta bg-terracotta/10"
    },
    {
      title: "Email + WhatsApp Ready",
      description: "Whether it's a formal email or a quick WhatsApp nudge, Daddy's got you covered.",
      icon: Send,
      color: "text-sage bg-sage/10"
    }
  ];

  const steps = [
    { 
      title: "Setup Profile", 
      desc: "Tell Daddy your skills once. We'll remember them for every application.",
      icon: UserCircle,
      color: "from-blue-500 to-indigo-500"
    },
    { 
      title: "Paste Job", 
      desc: "Copy the job description from any site. Daddy handles the rest.",
      icon: Clipboard,
      color: "from-terracotta to-gold"
    },
    { 
      title: "Generate", 
      desc: "AI crafts the perfect response tailored to your unique strengths.",
      icon: Wand2,
      color: "from-sage to-emerald-500"
    },
    { 
      title: "Apply", 
      desc: "Copy, send, and get hired. It's that simple.",
      icon: Rocket,
      color: "from-purple-500 to-pink-500"
    }
  ];

  const testimonials = [
    {
      name: "Sarah Jenkins",
      role: "Product Designer",
      company: "Meta",
      content: "ApplyDaddy saved me weeks of work. I got 3 interviews in my first week using it!",
      avatar: "https://picsum.photos/seed/sarah/100/100"
    },
    {
      name: "Michael Chen",
      role: "Software Engineer",
      company: "Google",
      content: "The tone is perfect. It sounds exactly like me, but on my best day. Truly a game changer.",
      avatar: "https://picsum.photos/seed/michael/100/100"
    },
    {
      name: "Elena Rodriguez",
      role: "Marketing Manager",
      company: "Amazon",
      content: "I was skeptical at first, but the responses are so tailored. It's like having a personal assistant.",
      avatar: "https://picsum.photos/seed/elena/100/100"
    }
  ];

  const faqs = [
    { q: "Is it really free?", a: "Yes! Daddy's generous. We offer a robust free tier for everyone." },
    { q: "How accurate is the AI?", a: "Daddy uses Google's Gemini API, the most powerful AI available, to ensure your responses are top-tier." },
    { q: "Can I use for any job site?", a: "Absolutely. Just copy the job description from LinkedIn, Indeed, or anywhere else." },
    { q: "Is my data safe?", a: "Your privacy is Daddy's priority. We use secure Firebase storage and never share your data." },
    { q: "Does it support WhatsApp?", a: "Yes! We generate both professional emails and direct WhatsApp messages." },
    { q: "What if I'm not tech-savvy?", a: "If you can copy and paste, you can use ApplyDaddy. It's that simple." }
  ];

  return (
    <div className="min-h-screen bg-cream selection:bg-terracotta/30 overflow-x-hidden">
      <AuthModal 
        isOpen={isAuthModalOpen} 
        onClose={() => setIsAuthModalOpen(false)} 
        initialMode={authMode} 
      />

      {/* Header */}
      <header className="fixed top-0 left-0 right-0 z-50 glass px-4 md:px-6 py-3 md:py-4 flex items-center justify-between border-b border-charcoal/5 md:m-4 md:rounded-3xl">
        <div className="flex items-center gap-2 group cursor-pointer">
          <div className="w-8 h-8 md:w-10 md:h-10 bg-terracotta rounded-xl flex items-center justify-center shadow-lg shadow-terracotta/20 group-hover:rotate-12 transition-transform">
            <Crown className="text-white w-5 h-5 md:w-6 md:h-6" />
          </div>
          <h1 className="text-xl md:text-2xl font-display text-charcoal font-bold tracking-tight">ApplyDaddy</h1>
        </div>

        <nav className="hidden md:flex items-center gap-8 text-sm font-bold text-warm-gray">
          <a href="#features" className="hover:text-terracotta transition-colors">Features</a>
          <a href="#how-it-works" className="hover:text-terracotta transition-colors">How It Works</a>
          <a href="#faq" className="hover:text-terracotta transition-colors">FAQ</a>
        </nav>

        <div className="flex items-center gap-4">
          <button 
            onClick={() => openModal('login')}
            className="hidden sm:block text-sm font-bold text-charcoal hover:text-terracotta transition-colors"
          >
            Login
          </button>
          <button 
            onClick={() => openModal('signup')}
            className="btn-primary"
          >
            Get Started
          </button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative pt-32 md:pt-48 pb-20 px-6 max-w-7xl mx-auto flex flex-col lg:flex-row items-center gap-12 md:gap-16">
        {/* Background Accents */}
        <div className="absolute top-20 right-0 w-64 md:w-96 h-64 md:h-96 bg-gold/10 rounded-full blur-3xl -z-10 animate-pulse"></div>
        <div className="absolute bottom-0 left-0 w-64 md:w-96 h-64 md:h-96 bg-terracotta/5 rounded-full blur-3xl -z-10"></div>
        
        {/* Floating Particles */}
        <div className="absolute inset-0 pointer-events-none overflow-hidden">
          {[...Array(10)].map((_, i) => (
            <motion.div
              key={i}
              className={`absolute w-2 h-2 rounded-full ${['bg-terracotta', 'bg-sage', 'bg-gold'][i % 3]}`}
              initial={{ 
                x: Math.random() * window.innerWidth, 
                y: Math.random() * window.innerHeight,
                opacity: 0.2
              }}
              animate={{ 
                y: [null, Math.random() * -100, Math.random() * 100],
                x: [null, Math.random() * 100, Math.random() * -100],
              }}
              transition={{ 
                duration: 5 + Math.random() * 10, 
                repeat: Infinity, 
                ease: "linear" 
              }}
            />
          ))}
        </div>

        <div className="flex-1 text-center lg:text-left">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-charcoal/5 mb-8"
          >
            <Sparkles className="text-gold" size={16} />
            <span className="text-xs font-bold text-charcoal uppercase tracking-widest">Powered by Gemini 3.1</span>
          </motion.div>

          <h2 
            ref={headlineRef}
            className="text-4xl md:text-6xl lg:text-8xl font-display text-charcoal leading-[1.1] mb-6 md:mb-8"
          >
            Land Your Dream Job Without the Effort.
          </h2>

          <motion.p 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="text-xl text-warm-gray mb-12 max-w-2xl mx-auto lg:mx-0 leading-relaxed"
          >
            Daddy crafts hyper-personalized applications in seconds. Stop staring at a blank screen and start getting interviews.
          </motion.p>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.6 }}
            className="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-6"
          >
            <motion.button 
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => openModal('signup')}
              className="group px-10 py-5 bg-charcoal text-white font-bold rounded-2xl hover:bg-charcoal/90 transition-all shadow-2xl shadow-charcoal/20 flex items-center gap-3 active:scale-95 relative overflow-hidden"
            >
              <span className="relative z-10">Start Applying Now</span>
              <ArrowRight size={20} className="relative z-10 group-hover:translate-x-1 transition-transform" />
              <motion.div 
                className="absolute inset-0 bg-linear-to-r from-terracotta to-gold opacity-0 group-hover:opacity-20 transition-opacity"
              />
            </motion.button>
            
            <div className="flex items-center gap-4">
              <div className="flex -space-x-3">
                {[1, 2, 3, 4].map(i => (
                  <img 
                    key={i}
                    src={`https://picsum.photos/seed/user${i}/100/100`}
                    className="w-10 h-10 rounded-full border-2 border-white shadow-sm"
                    alt="User"
                    referrerPolicy="no-referrer"
                  />
                ))}
              </div>
              <p className="text-sm font-bold text-warm-gray">
                <span className="text-charcoal">500+</span> users hired
              </p>
            </div>
          </motion.div>
        </div>

        {/* Hero Illustration: Mock UI */}
        <motion.div 
          initial={{ opacity: 0, x: 50 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ delay: 0.7, duration: 0.8 }}
          className="flex-1 w-full relative"
        >
          <div className="relative z-10 glass p-4 rounded-[2.5rem] shadow-2xl border-white/40">
            <div className="bg-white rounded-[2rem] overflow-hidden shadow-inner p-6 space-y-6">
              {/* Mock Job Post */}
              <div className="space-y-3">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 bg-sage/20 rounded-lg flex items-center justify-center">
                    <MousePointer2 className="text-sage" size={16} />
                  </div>
                  <div className="h-4 w-32 bg-cream rounded-full flex items-center px-3">
                    <span className="text-[8px] font-bold text-charcoal/40">Product Designer</span>
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="h-2 w-full bg-cream rounded-full"></div>
                  <div className="h-2 w-3/4 bg-cream rounded-full"></div>
                  <div className="h-2 w-1/2 bg-cream rounded-full"></div>
                </div>
              </div>

              {/* AI Transformation Line */}
              <div className="relative py-4">
                <div className="absolute inset-0 flex items-center">
                  <div className="w-full border-t border-dashed border-terracotta/30"></div>
                </div>
                <div className="relative flex justify-center">
                  <motion.div 
                    animate={{ scale: [1, 1.1, 1] }}
                    transition={{ duration: 2, repeat: Infinity }}
                    className="bg-terracotta text-white px-4 py-1 rounded-full text-[10px] font-bold uppercase tracking-widest shadow-lg"
                  >
                    AI Magic Processing
                  </motion.div>
                </div>
              </div>

              {/* Mock Result */}
              <div className="space-y-4">
                <motion.div 
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1 }}
                  className="p-4 bg-sage/5 rounded-2xl border border-sage/10 space-y-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <Mail className="text-sage" size={14} />
                    <span className="text-[10px] font-bold text-sage">Professional Email</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-sage/20 rounded-full"></div>
                    <div className="h-1.5 w-full bg-sage/20 rounded-full"></div>
                    <div className="h-1.5 w-2/3 bg-sage/20 rounded-full"></div>
                  </div>
                </motion.div>
                <motion.div 
                  initial={{ opacity: 0, x: 10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 1.5 }}
                  className="p-4 bg-gold/5 rounded-2xl border border-gold/10 space-y-2"
                >
                  <div className="flex items-center gap-2 mb-2">
                    <MessageSquare className="text-gold" size={14} />
                    <span className="text-[10px] font-bold text-gold">WhatsApp Nudge</span>
                  </div>
                  <div className="space-y-1.5">
                    <div className="h-1.5 w-full bg-gold/20 rounded-full"></div>
                    <div className="h-1.5 w-3/4 bg-gold/20 rounded-full"></div>
                  </div>
                </motion.div>
              </div>
            </div>
          </div>

          {/* Floating Accents */}
          <motion.div 
            animate={{ y: [0, -20, 0] }}
            transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
            className="absolute -top-6 -right-4 md:-top-10 md:-right-10 glass p-3 md:p-4 rounded-2xl shadow-xl z-20"
          >
            <div className="flex items-center gap-2 md:gap-3">
              <div className="w-8 h-8 md:w-10 md:h-10 bg-emerald-500 rounded-full flex items-center justify-center text-white">
                <CheckCircle2 className="w-4 h-4 md:w-5 md:h-5" />
              </div>
              <div>
                <p className="text-[10px] md:text-xs font-bold text-charcoal">Interview Secured!</p>
                <p className="text-[8px] md:text-[10px] text-warm-gray">Just now at Google</p>
              </div>
            </div>
          </motion.div>
        </motion.div>
      </section>

      {/* Trusted By Section */}
      <section className="py-12 border-y border-charcoal/5 bg-white/30 overflow-hidden">
        <div className="max-w-7xl mx-auto px-6">
          <p className="text-center text-[10px] font-bold text-warm-gray uppercase tracking-[0.3em] mb-8">Users Hired At</p>
          <div className="flex flex-wrap justify-center items-center gap-8 md:gap-24 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
            {['Google', 'Meta', 'Amazon', 'Netflix', 'Apple'].map((name, i) => (
              <motion.span 
                key={name} 
                initial={{ opacity: 0, y: 10 }}
                whileInView={{ opacity: 1, y: 0 }}
                transition={{ delay: i * 0.1 }}
                viewport={{ once: true }}
                className="text-xl md:text-2xl font-display font-bold text-charcoal cursor-default"
              >
                {name}
              </motion.span>
            ))}
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section id="features" className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-display text-charcoal mb-6 squiggly inline-block">Why Daddy's the Best</h3>
            <p className="text-xl text-warm-gray max-w-2xl mx-auto">No more generic applications. No more silence. Just results.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {features.map((feature, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                whileHover={{ y: -10, rotateY: 5, rotateX: 5 }}
                className="glass p-10 rounded-[2.5rem] transition-all border-none shadow-xl shadow-charcoal/5 group"
              >
                <div className={`w-16 h-16 rounded-2xl flex items-center justify-center mb-8 ${feature.color} group-hover:scale-110 transition-transform`}>
                  <feature.icon size={32} />
                </div>
                <h4 className="text-2xl font-bold text-charcoal mb-4">{feature.title}</h4>
                <p className="text-warm-gray leading-relaxed text-lg">{feature.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* How It Works */}
      <section id="how-it-works" className="py-32 px-6 relative overflow-hidden">
        <div className="absolute top-0 right-0 w-96 h-96 bg-terracotta/5 rounded-full blur-3xl -z-10"></div>
        <div className="absolute bottom-0 left-0 w-96 h-96 bg-gold/5 rounded-full blur-3xl -z-10"></div>
        
        <div className="max-w-7xl mx-auto relative z-10">
          <div className="text-center mb-24">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              className="inline-flex items-center gap-2 px-4 py-2 bg-white rounded-full shadow-sm border border-charcoal/5 mb-6"
            >
              <Zap className="text-gold" size={16} />
              <span className="text-xs font-bold text-charcoal uppercase tracking-widest">Simple & Fast</span>
            </motion.div>
            <h3 className="text-5xl md:text-6xl font-display text-charcoal mb-6">How It Works</h3>
            <p className="text-warm-gray text-xl max-w-2xl mx-auto">Four simple steps to land your dream job with Daddy's help.</p>
          </div>
          
          <div className="relative">
            {/* Connecting Line (Desktop) */}
            <div className="hidden lg:block absolute top-1/2 left-0 w-full h-0.5 bg-linear-to-r from-transparent via-charcoal/5 to-transparent -translate-y-1/2 -z-10"></div>
            
            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-12">
              {steps.map((step, i) => (
                <motion.div 
                  key={i}
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.2 }}
                  className="relative flex flex-col items-center text-center group"
                >
                  <div className="relative mb-10">
                    {/* Step Number Badge */}
                    <div className="absolute -top-4 -right-4 w-8 h-8 bg-charcoal text-white text-xs font-bold rounded-full flex items-center justify-center border-4 border-cream z-10">
                      {i + 1}
                    </div>
                    
                    {/* Icon Container */}
                    <motion.div 
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      className={`w-24 h-24 bg-linear-to-br ${step.color} p-0.5 rounded-[2rem] shadow-xl group-hover:shadow-2xl transition-all duration-500`}
                    >
                      <div className="w-full h-full bg-white rounded-[1.9rem] flex items-center justify-center">
                        <step.icon size={40} className="text-charcoal group-hover:text-terracotta transition-colors" />
                      </div>
                    </motion.div>
                    
                    {/* Decorative Ring */}
                    <div className="absolute inset-0 border-2 border-dashed border-charcoal/10 rounded-[2.5rem] -m-4 group-hover:rotate-45 transition-transform duration-1000"></div>
                  </div>
                  
                  <h4 className="text-2xl font-bold text-charcoal mb-4">{step.title}</h4>
                  <p className="text-warm-gray leading-relaxed">{step.desc}</p>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Social Proof Section */}
      <section className="py-32 px-6">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-display text-charcoal mb-6">What the Kids Say</h3>
            <p className="text-xl text-warm-gray">Real stories from real job seekers.</p>
          </div>

          <div className="grid md:grid-cols-3 gap-8">
            {testimonials.map((t, i) => (
              <motion.div
                key={i}
                initial={{ opacity: 0, scale: 0.9 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: i * 0.2 }}
                className="glass p-8 rounded-[2.5rem] flex flex-col justify-between"
              >
                <div>
                  <div className="flex gap-1 mb-6">
                    {[...Array(5)].map((_, i) => (
                      <Star key={i} size={16} className="fill-gold text-gold" />
                    ))}
                  </div>
                  <p className="text-charcoal italic mb-8 leading-relaxed">"{t.content}"</p>
                </div>
                <div className="flex items-center gap-4">
                  <img src={t.avatar} alt={t.name} className="w-12 h-12 rounded-full border-2 border-white shadow-sm" referrerPolicy="no-referrer" />
                  <div>
                    <h5 className="font-bold text-charcoal text-sm">{t.name}</h5>
                    <p className="text-xs text-warm-gray">{t.role} at {t.company}</p>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* FAQ Section */}
      <section id="faq" className="py-32 px-6">
        <div className="max-w-3xl mx-auto">
          <div className="text-center mb-20">
            <h3 className="text-5xl font-display text-charcoal mb-6">Common Questions</h3>
            <p className="text-xl text-warm-gray">Everything you need to know about Daddy.</p>
          </div>

          <div className="space-y-4">
            {faqs.map((faq, i) => (
              <div key={i} className="glass rounded-3xl overflow-hidden border-none shadow-lg shadow-charcoal/5">
                <button 
                  onClick={() => setOpenFaq(openFaq === i ? null : i)}
                  className="w-full p-8 flex items-center justify-between text-left hover:bg-white/50 transition-colors"
                >
                  <span className="text-lg font-bold text-charcoal">{faq.q}</span>
                  <motion.div 
                    animate={{ rotate: openFaq === i ? 180 : 0 }}
                    className="p-2 rounded-full bg-terracotta/10 text-terracotta"
                  >
                    <ChevronDown size={20} />
                  </motion.div>
                </button>
                <AnimatePresence>
                  {openFaq === i && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="p-8 pt-0 text-warm-gray leading-relaxed text-lg border-t border-charcoal/5">
                        {faq.a}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Final CTA */}
      <section className="py-20 md:py-40 px-6 text-center relative overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-terracotta/5 rounded-full blur-[120px] -z-10"></div>
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[600px] h-[600px] bg-gold/5 rounded-full blur-[100px] -z-10 animate-pulse"></div>

        <motion.div 
          initial={{ opacity: 0, y: 40 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          className="max-w-4xl mx-auto glass p-10 md:p-20 rounded-[3rem] md:rounded-[5rem] shadow-2xl border-white/20 relative overflow-hidden group"
        >
          {/* Inner glow */}
          <div className="absolute inset-0 bg-linear-to-br from-white/40 to-transparent pointer-events-none"></div>
          
          <div className="relative z-10">
            <motion.div
              animate={{ rotate: [0, 10, -10, 0] }}
              transition={{ duration: 5, repeat: Infinity }}
              className="inline-block mb-8"
            >
              <div className="w-20 h-20 bg-terracotta rounded-3xl flex items-center justify-center shadow-2xl shadow-terracotta/40 mx-auto">
                <Crown className="text-white" size={40} />
              </div>
            </motion.div>

            <h3 className="text-4xl md:text-6xl font-display text-charcoal mb-8 leading-tight">
              Ready to let Daddy <br />
              <span className="gradient-text">get you hired?</span>
            </h3>
            
            <p className="text-xl md:text-2xl text-warm-gray mb-12 max-w-xl mx-auto leading-relaxed">
              Join 500+ professionals who stopped begging and started applying with confidence.
            </p>

            <div className="flex flex-col sm:flex-row items-center justify-center gap-6">
              <button 
                onClick={() => openModal('signup')}
                className="group px-12 py-6 bg-charcoal text-white font-bold rounded-2xl hover:bg-charcoal/90 transition-all shadow-2xl shadow-charcoal/20 flex items-center gap-3 text-xl relative overflow-hidden"
              >
                <span className="relative z-10">Get Started for Free</span>
                <ArrowRight size={24} className="relative z-10 group-hover:translate-x-1 transition-transform" />
                <div className="absolute inset-0 bg-linear-to-r from-terracotta to-gold opacity-0 group-hover:opacity-20 transition-opacity"></div>
              </button>
            </div>

            <p className="mt-8 text-sm font-bold text-warm-gray flex items-center justify-center gap-2">
              <CheckCircle2 size={16} className="text-sage" />
              No credit card required • Instant access
            </p>
          </div>
        </motion.div>
      </section>

      {/* Footer */}
      <footer className="relative bg-charcoal text-white pt-32 pb-12 px-6 overflow-hidden">
        {/* Decorative background elements */}
        <div className="absolute top-0 left-1/4 w-96 h-96 bg-terracotta/10 rounded-full blur-[100px] -z-0"></div>
        <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-gold/5 rounded-full blur-[100px] -z-0"></div>

        <div className="max-w-7xl mx-auto relative z-10">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-12 gap-16 mb-20">
            {/* Brand Column */}
            <div className="lg:col-span-4 space-y-8">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 bg-terracotta rounded-2xl flex items-center justify-center shadow-xl shadow-terracotta/20">
                  <Crown className="text-white" size={28} />
                </div>
                <h1 className="text-3xl font-display font-bold tracking-tight">ApplyDaddy</h1>
              </div>
              <p className="text-white/60 text-lg leading-relaxed max-w-sm">
                Empowering job seekers with AI-driven precision. Stop staring at blank screens and start landing interviews with Daddy's magic.
              </p>
              <div className="flex items-center gap-4">
                {[
                  { icon: Twitter, href: "#" },
                  { icon: Linkedin, href: "#" },
                  { icon: Github, href: "#" }
                ].map((social, i) => (
                  <motion.a
                    key={i}
                    whileHover={{ y: -5, backgroundColor: 'rgba(224, 122, 95, 1)' }}
                    href={social.href}
                    className="w-12 h-12 bg-white/5 rounded-xl flex items-center justify-center transition-colors border border-white/10"
                  >
                    <social.icon size={20} />
                  </motion.a>
                ))}
              </div>
            </div>

            {/* Links Columns */}
            <div className="lg:col-span-2 space-y-8">
              <h5 className="text-lg font-bold">Product</h5>
              <ul className="space-y-4 text-white/50">
                <li><a href="#features" className="hover:text-terracotta transition-colors">Features</a></li>
                <li><a href="#how-it-works" className="hover:text-terracotta transition-colors">How It Works</a></li>
                <li><a href="#" className="hover:text-terracotta transition-colors">Pricing</a></li>
                <li><a href="#" className="hover:text-terracotta transition-colors">Updates</a></li>
              </ul>
            </div>

            <div className="lg:col-span-2 space-y-8">
              <h5 className="text-lg font-bold">Company</h5>
              <ul className="space-y-4 text-white/50">
                <li><a href="#" className="hover:text-terracotta transition-colors">About Us</a></li>
                <li><a href="#" className="hover:text-terracotta transition-colors">Privacy Policy</a></li>
                <li><a href="#" className="hover:text-terracotta transition-colors">Terms of Service</a></li>
                <li><a href="#faq" className="hover:text-terracotta transition-colors">FAQ</a></li>
              </ul>
            </div>

            {/* Newsletter Column */}
            <div className="lg:col-span-4 space-y-8">
              <h5 className="text-lg font-bold">Stay in the Loop</h5>
              <p className="text-white/50">Get Daddy's weekly job-hunting tips and AI updates delivered to your inbox.</p>
              <div className="relative group">
                <input 
                  type="email" 
                  placeholder="Enter your email" 
                  className="w-full px-6 py-4 bg-white/5 border border-white/10 rounded-2xl outline-none focus:ring-2 focus:ring-terracotta/50 transition-all group-hover:border-white/20"
                />
                <button className="absolute right-2 top-2 bottom-2 px-6 bg-terracotta text-white font-bold rounded-xl hover:bg-terracotta/90 transition-all flex items-center gap-2">
                  Join
                  <ArrowRight size={16} />
                </button>
              </div>
              <p className="text-[10px] text-white/30 uppercase tracking-widest font-bold">
                Join 2,000+ subscribers
              </p>
            </div>
          </div>

          {/* Bottom Bar */}
          <div className="pt-12 border-t border-white/5 flex flex-col md:flex-row items-center justify-between gap-8">
            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>© 2024 ApplyDaddy. All rights reserved.</span>
            </div>
            
            <div className="flex items-center gap-8 text-sm text-white/40">
              <a href="#" className="hover:text-white transition-colors">Privacy</a>
              <a href="#" className="hover:text-white transition-colors">Terms</a>
              <a href="#" className="hover:text-white transition-colors">Cookies</a>
            </div>

            <div className="flex items-center gap-2 text-sm text-white/40">
              <span>Made with</span>
              <motion.span 
                animate={{ scale: [1, 1.2, 1] }} 
                transition={{ repeat: Infinity, duration: 1.5 }}
              >
                <Heart className="text-terracotta fill-terracotta" size={16} />
              </motion.span>
              <span>by Daddy</span>
            </div>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default LandingPage;
