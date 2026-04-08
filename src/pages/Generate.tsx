import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Lottie from 'lottie-react';
import confetti from 'canvas-confetti';
import { 
  Building2, 
  Briefcase, 
  Sparkles, 
  Copy, 
  Check, 
  History, 
  RefreshCw, 
  AlertCircle,
  Mail,
  MessageCircle,
  Zap,
  Trash2,
  Edit3,
  Save,
  PlusCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getUserProfile } from '../services/userService';
import { generateResponse, extractJobMetadata } from '../services/geminiService';
import { getApplications, saveApplication } from '../services/applicationService';
import { Tone, GeneratedResponse } from '../types';
import toast from 'react-hot-toast';

const Generate: React.FC = () => {
  const { user } = useAuthStore();
  const [jobPost, setJobPost] = useState(() => localStorage.getItem('daddy_jobPost') || '');
  const [companyName, setCompanyName] = useState(() => localStorage.getItem('daddy_companyName') || '');
  const [jobTitle, setJobTitle] = useState(() => localStorage.getItem('daddy_jobTitle') || '');
  const [tone, setTone] = useState<Tone>(() => (localStorage.getItem('daddy_tone') as Tone) || 'professional');
  const [loading, setLoading] = useState(false);
  const [extracting, setExtracting] = useState(false);
  const [generated, setGenerated] = useState<GeneratedResponse | null>(() => {
    const saved = localStorage.getItem('daddy_generated');
    return saved ? JSON.parse(saved) : null;
  });
  const [copiedType, setCopiedType] = useState<'email' | 'whatsapp' | null>(null);
  const [saving, setSaving] = useState(false);
  const [isFirstTime, setIsFirstTime] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [editedResponse, setEditedResponse] = useState<GeneratedResponse | null>(() => {
    const saved = localStorage.getItem('daddy_editedResponse');
    return saved ? JSON.parse(saved) : null;
  });
  const [loadingMessageIndex, setLoadingMessageIndex] = useState(0);

  const loadingMessages = [
    "Daddy is reading the job post...",
    "Analyzing your skills...",
    "Finding the perfect tone...",
    "Crafting a winning pitch...",
    "Polishing the final response...",
    "Almost there, hang tight!"
  ];

  useEffect(() => {
    let interval: any;
    if (loading) {
      interval = setInterval(() => {
        setLoadingMessageIndex((prev) => (prev + 1) % loadingMessages.length);
      }, 2000);
    } else {
      setLoadingMessageIndex(0);
    }
    return () => clearInterval(interval);
  }, [loading]);

  // Persist state to localStorage
  useEffect(() => {
    localStorage.setItem('daddy_jobPost', jobPost);
    localStorage.setItem('daddy_companyName', companyName);
    localStorage.setItem('daddy_jobTitle', jobTitle);
    localStorage.setItem('daddy_tone', tone);
    if (generated) localStorage.setItem('daddy_generated', JSON.stringify(generated));
    else localStorage.removeItem('daddy_generated');
    if (editedResponse) localStorage.setItem('daddy_editedResponse', JSON.stringify(editedResponse));
    else localStorage.removeItem('daddy_editedResponse');
  }, [jobPost, companyName, jobTitle, tone, generated, editedResponse]);

  useEffect(() => {
    const checkFirstTime = async () => {
      if (!user) return;
      try {
        const apps = await getApplications(user.uid);
        setIsFirstTime(apps.length === 0);
      } catch (error) {
        console.error('Error checking application count:', error);
      }
    };
    checkFirstTime();
  }, [user]);

  const triggerConfetti = () => {
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => Math.random() * (max - min) + min;

    const interval: any = setInterval(function() {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 } });
      confetti({ ...defaults, particleCount, origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 } });
    }, 250);
  };

  const handleMagicFill = async () => {
    if (jobPost.length < 50) {
      toast.error('Paste at least 50 characters first!');
      return;
    }
    setExtracting(true);
    try {
      const metadata = await extractJobMetadata(jobPost);
      setCompanyName(metadata.company || '');
      setJobTitle(metadata.title || '');
      toast.success('Magic Fill complete!');
    } catch (error) {
      toast.error('Magic Fill failed.');
    } finally {
      setExtracting(false);
    }
  };

  const handleGenerate = async () => {
    if (!user) return;
    if (jobPost.length < 50) {
      toast.error('Job post is too short!');
      return;
    }

    setLoading(true);
    try {
      const profile = await getUserProfile(user.uid);
      if (!profile || !profile.fullName || profile.skills.length === 0) {
        toast.error('Please complete your profile first!');
        return;
      }

      const result = await generateResponse(jobPost, profile, tone);
      setGenerated(result);
      setEditedResponse(result);
      toast.success('Response generated!');

      if (isFirstTime) {
        triggerConfetti();
        setIsFirstTime(false);
        toast('🎉 Your first generation! You\'re on fire!', {
          icon: '🔥',
          duration: 5000,
        });
      }
    } catch (error: any) {
      toast.error(error.message || 'Generation failed.');
    } finally {
      setLoading(false);
    }
  };

  const handleCopy = (text: string, type: 'email' | 'whatsapp') => {
    navigator.clipboard.writeText(text);
    setCopiedType(type);
    toast.success('Copied to clipboard!');
    setTimeout(() => setCopiedType(null), 2000);
  };

  const handleSaveToHistory = async () => {
    if (!user || !editedResponse) return;
    setSaving(true);
    try {
      await saveApplication({
        userId: user.uid,
        jobPostText: jobPost,
        companyName: companyName || 'Unknown Company',
        jobTitle: jobTitle || 'Unknown Role',
        generatedEmail: {
          subject: editedResponse.subject,
          body: editedResponse.email
        },
        generatedWhatsapp: editedResponse.whatsapp,
        status: 'pending',
        appliedDate: new Date()
      });
      toast.success('Saved to history!');
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const handleReset = () => {
    setGenerated(null);
    setEditedResponse(null);
    setJobPost('');
    setCompanyName('');
    setJobTitle('');
    setIsEditing(false);
  };

  return (
    <div className="max-w-7xl mx-auto">
      <header className="mb-12">
        <h2 className="text-4xl font-display text-charcoal mb-2">Generate Response</h2>
        <p className="text-warm-gray">Let Daddy craft the perfect pitch for you.</p>
      </header>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Left Column: Input */}
        <div className="flex-[0.55] space-y-6">
          <div className="glass p-8 rounded-[2.5rem] space-y-6 relative overflow-hidden">
            {loading && (
              <div className="absolute inset-0 z-20 bg-white/80 backdrop-blur-md flex items-center justify-center">
                <div className="text-center max-w-xs w-full px-6">
                  <div className="relative w-48 h-48 mx-auto mb-8">
                    <motion.div
                      animate={{ 
                        scale: [1, 1.1, 1],
                        rotate: [0, 5, -5, 0]
                      }}
                      transition={{ duration: 4, repeat: Infinity }}
                      className="absolute inset-0 bg-terracotta/10 rounded-full blur-2xl"
                    />
                    <div className="absolute inset-0 flex items-center justify-center">
                      <Lottie 
                        animationData={{
                          v: "5.7.1",
                          fr: 30,
                          ip: 0,
                          op: 60,
                          w: 500,
                          h: 500,
                          nm: "Loading",
                          ddd: 0,
                          assets: [],
                          layers: [
                            {
                              ddd: 0,
                              ind: 1,
                              ty: 4,
                              nm: "Outer Ring",
                              sr: 1,
                              ks: {
                                o: { a: 0, k: 40, ix: 11 },
                                r: { a: 1, k: [{ t: 0, s: [0] }, { t: 60, s: [360] }], ix: 10 },
                                p: { a: 0, k: [250, 250, 0], ix: 2 },
                                a: { a: 0, k: [0, 0, 0], ix: 1 },
                                s: { a: 0, k: [100, 100, 100], ix: 6 }
                              },
                              shapes: [
                                {
                                  ty: "gr",
                                  it: [
                                    {
                                      d: 1,
                                      ty: "el",
                                      s: { a: 0, k: [240, 240], ix: 2 },
                                      p: { a: 0, k: [0, 0], ix: 3 },
                                      nm: "Ellipse Path 1",
                                      mn: "ADBE Vector Shape - Ellipse",
                                      hd: false
                                    },
                                    {
                                      ty: "st",
                                      c: { a: 0, k: [0.878, 0.478, 0.373, 1], ix: 3 },
                                      o: { a: 0, k: 100, ix: 4 },
                                      w: { a: 0, k: 4, ix: 5 },
                                      lc: 2,
                                      lj: 2,
                                      ml: 4,
                                      bm: 0,
                                      nm: "Stroke 1",
                                      mn: "ADBE Vector Graphic - Stroke",
                                      hd: false
                                    },
                                    {
                                      ty: "tr",
                                      p: { a: 0, k: [0, 0], ix: 2 },
                                      a: { a: 0, k: [0, 0], ix: 1 },
                                      s: { a: 0, k: [100, 100], ix: 3 },
                                      r: { a: 0, k: 0, ix: 6 },
                                      o: { a: 0, k: 100, ix: 7 },
                                      sk: { a: 0, k: 0, ix: 4 },
                                      sa: { a: 0, k: 0, ix: 5 },
                                      nm: "Transform"
                                    }
                                  ],
                                  nm: "Group 1",
                                  np: 2,
                                  cix: 2,
                                  bm: 0,
                                  ix: 1,
                                  mn: "ADBE Vector Group",
                                  hd: false
                                }
                              ]
                            },
                            {
                              ddd: 0,
                              ind: 2,
                              ty: 4,
                              nm: "Inner Ring",
                              sr: 1,
                              ks: {
                                o: { a: 0, k: 100, ix: 11 },
                                r: { a: 1, k: [{ t: 0, s: [360] }, { t: 60, s: [0] }], ix: 10 },
                                p: { a: 0, k: [250, 250, 0], ix: 2 },
                                a: { a: 0, k: [0, 0, 0], ix: 1 },
                                s: { a: 0, k: [100, 100, 100], ix: 6 }
                              },
                              shapes: [
                                {
                                  ty: "gr",
                                  it: [
                                    {
                                      d: 1,
                                      ty: "el",
                                      s: { a: 0, k: [180, 180], ix: 2 },
                                      p: { a: 0, k: [0, 0], ix: 3 },
                                      nm: "Ellipse Path 1",
                                      mn: "ADBE Vector Shape - Ellipse",
                                      hd: false
                                    },
                                    {
                                      ty: "st",
                                      c: { a: 0, k: [0.878, 0.478, 0.373, 1], ix: 3 },
                                      o: { a: 0, k: 100, ix: 4 },
                                      w: { a: 0, k: 8, ix: 5 },
                                      lc: 2,
                                      lj: 2,
                                      ml: 4,
                                      bm: 0,
                                      nm: "Stroke 1",
                                      mn: "ADBE Vector Graphic - Stroke",
                                      hd: false
                                    },
                                    {
                                      ty: "tr",
                                      p: { a: 0, k: [0, 0], ix: 2 },
                                      a: { a: 0, k: [0, 0], ix: 1 },
                                      s: { a: 0, k: [100, 100], ix: 3 },
                                      r: { a: 0, k: 0, ix: 6 },
                                      o: { a: 0, k: 100, ix: 7 },
                                      sk: { a: 0, k: 0, ix: 4 },
                                      sa: { a: 0, k: 0, ix: 5 },
                                      nm: "Transform"
                                    }
                                  ],
                                  nm: "Group 1",
                                  np: 2,
                                  cix: 2,
                                  bm: 0,
                                  ix: 1,
                                  mn: "ADBE Vector Group",
                                  hd: false
                                }
                              ]
                            }
                          ]
                        }} 
                        className="w-full h-full"
                      />
                    </div>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <motion.div
                        animate={{ 
                          scale: [1, 1.2, 1],
                          opacity: [0.5, 1, 0.5]
                        }}
                        transition={{ duration: 2, repeat: Infinity }}
                      >
                        <Sparkles size={48} className="text-terracotta" />
                      </motion.div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <AnimatePresence mode="wait">
                      <motion.h3 
                        key={loadingMessageIndex}
                        initial={{ opacity: 0, y: 10 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="text-xl font-display text-charcoal font-bold"
                      >
                        {loadingMessages[loadingMessageIndex]}
                      </motion.h3>
                    </AnimatePresence>
                    
                    <div className="w-full h-2 bg-cream rounded-full overflow-hidden border border-charcoal/5">
                      <motion.div 
                        className="h-full bg-terracotta"
                        initial={{ width: "0%" }}
                        animate={{ width: "95%" }}
                        transition={{ duration: 10, ease: "easeOut" }}
                      />
                    </div>
                    <p className="text-xs font-bold text-warm-gray uppercase tracking-widest">
                      AI Magic in progress
                    </p>
                  </div>
                </div>
              </div>
            )}

            <div className="space-y-2">
              <div className="flex justify-between items-end">
                <label className="text-sm font-bold text-charcoal ml-1">Job Description *</label>
                <span className={`text-xs font-medium ${jobPost.length > 5000 ? 'text-terracotta' : 'text-warm-gray'}`}>
                  {jobPost.length} / 5000
                </span>
              </div>
              <textarea
                id="job-post-input"
                value={jobPost}
                onChange={e => setJobPost(e.target.value)}
                disabled={loading}
                placeholder="Paste the full job description here..."
                rows={10}
                className="w-full p-6 bg-cream/50 border border-white/20 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all resize-none disabled:opacity-50"
              />
              <div className="w-full h-1 bg-cream rounded-full overflow-hidden">
                <motion.div 
                  className="h-full bg-terracotta"
                  initial={{ width: 0 }}
                  animate={{ width: `${Math.min((jobPost.length / 5000) * 100, 100)}%` }}
                />
              </div>
            </div>

            <div className="grid sm:grid-cols-2 gap-4">
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal ml-1">Company Name</label>
                <div className="relative">
                  <Building2 className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                  <input
                    type="text"
                    value={companyName}
                    onChange={e => setCompanyName(e.target.value)}
                    disabled={loading}
                    placeholder="e.g., Google"
                    className="w-full pl-12 pr-4 py-4 bg-cream/50 border border-white/20 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <label className="text-sm font-bold text-charcoal ml-1">Job Title</label>
                <div className="relative">
                  <Briefcase className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                  <input
                    type="text"
                    value={jobTitle}
                    onChange={e => setJobTitle(e.target.value)}
                    disabled={loading}
                    placeholder="e.g., Senior Developer"
                    className="w-full pl-12 pr-4 py-4 bg-cream/50 border border-white/20 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all disabled:opacity-50"
                  />
                </div>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-4 items-center justify-between pt-4">
              <div className="flex bg-cream/50 p-1 rounded-xl border border-white/20">
                {(['professional', 'casual', 'enthusiastic'] as Tone[]).map(t => (
                  <button
                    key={t}
                    onClick={() => setTone(t)}
                    disabled={loading}
                    className={`
                      px-4 py-2 rounded-lg text-xs font-bold capitalize transition-all
                      ${tone === t ? 'bg-white text-terracotta shadow-sm' : 'text-warm-gray hover:text-charcoal'}
                    `}
                  >
                    {t}
                  </button>
                ))}
              </div>

              <button
                id="magic-fill-btn"
                onClick={handleMagicFill}
                disabled={loading || extracting || jobPost.length < 50}
                className="flex items-center gap-2 text-sm font-bold text-sage hover:text-sage/80 transition-colors disabled:opacity-50"
              >
                {extracting ? <RefreshCw className="animate-spin" size={16} /> : <Sparkles size={16} />}
                Magic Fill
              </button>
            </div>

            <button
              id="generate-btn"
              onClick={handleGenerate}
              disabled={loading || jobPost.length < 50}
              className="w-full py-4 md:py-5 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/30 flex items-center justify-center gap-3 disabled:opacity-50 group relative overflow-hidden"
            >
              <div className="relative z-10 flex items-center gap-3">
                {loading ? (
                  <>
                    <RefreshCw className="animate-spin" size={20} />
                    Daddy is working...
                  </>
                ) : (
                  <>
                    <Sparkles size={20} className="group-hover:rotate-12 transition-transform" />
                    Generate Response
                  </>
                )}
              </div>
              {/* Liquid Fill Simulation */}
              <motion.div 
                className="absolute inset-0 bg-white/20"
                initial={{ y: '100%' }}
                animate={loading ? { y: '0%' } : { y: '100%' }}
                transition={{ duration: 5, ease: "linear" }}
              />
            </button>
          </div>
        </div>

        {/* Right Column: Output */}
        <div className="flex-[0.45] space-y-6">
          <AnimatePresence mode="wait">
            {generated && editedResponse ? (
              <motion.div
                key="output"
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                className="space-y-6"
              >
                <div className="flex items-center justify-between px-2">
                  <h3 className="text-xl font-display text-charcoal flex items-center gap-2">
                    <Sparkles size={20} className="text-terracotta" />
                    Your Pitch
                  </h3>
                  <button
                    onClick={() => setIsEditing(!isEditing)}
                    className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-bold transition-all ${
                      isEditing ? 'bg-terracotta text-white' : 'bg-white text-warm-gray hover:text-charcoal shadow-sm'
                    }`}
                  >
                    {isEditing ? <Save size={14} /> : <Edit3 size={14} />}
                    {isEditing ? 'Done Editing' : 'Edit Response'}
                  </button>
                </div>

                {/* Email Card */}
                <div className="glass p-6 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                      <Mail size={18} />
                      Professional Email
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => handleCopy(`${editedResponse.subject}\n\n${editedResponse.email}`, 'email')}
                        className="p-2 hover:bg-cream rounded-lg transition-colors text-warm-gray hover:text-terracotta"
                      >
                        {copiedType === 'email' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                  <div className="p-4 bg-cream/50 rounded-xl border border-white/20">
                    <p className="text-xs font-bold text-warm-gray mb-1 uppercase tracking-wider">Subject</p>
                    {isEditing ? (
                      <input
                        type="text"
                        value={editedResponse.subject}
                        onChange={e => setEditedResponse({ ...editedResponse, subject: e.target.value })}
                        className="w-full bg-white border border-charcoal/5 rounded-lg p-2 text-sm font-bold text-charcoal outline-none focus:ring-2 focus:ring-terracotta/50"
                      />
                    ) : (
                      <p className="text-sm font-bold text-charcoal font-mono">{editedResponse.subject}</p>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedResponse.email}
                      onChange={e => setEditedResponse({ ...editedResponse, email: e.target.value })}
                      rows={8}
                      className="w-full p-4 bg-white rounded-xl border border-charcoal/5 text-sm text-warm-gray leading-relaxed outline-none focus:ring-2 focus:ring-terracotta/50 resize-none"
                    />
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-white/20 max-h-60 overflow-y-auto text-sm text-warm-gray leading-relaxed whitespace-pre-wrap">
                      {editedResponse.email}
                    </div>
                  )}
                </div>

                {/* WhatsApp Card */}
                <div className="glass p-6 rounded-[2.5rem] space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                      <MessageCircle size={18} />
                      WhatsApp Message
                    </div>
                    {!isEditing && (
                      <button 
                        onClick={() => handleCopy(editedResponse.whatsapp, 'whatsapp')}
                        className="p-2 hover:bg-cream rounded-lg transition-colors text-warm-gray hover:text-terracotta"
                      >
                        {copiedType === 'whatsapp' ? <Check size={18} className="text-emerald-500" /> : <Copy size={18} />}
                      </button>
                    )}
                  </div>
                  {isEditing ? (
                    <textarea
                      value={editedResponse.whatsapp}
                      onChange={e => setEditedResponse({ ...editedResponse, whatsapp: e.target.value })}
                      rows={4}
                      className="w-full p-4 bg-white rounded-xl border border-charcoal/5 text-sm text-warm-gray leading-relaxed outline-none focus:ring-2 focus:ring-terracotta/50 resize-none"
                    />
                  ) : (
                    <div className="p-4 bg-white rounded-xl border border-white/20 text-sm text-warm-gray leading-relaxed whitespace-pre-wrap">
                      {editedResponse.whatsapp}
                    </div>
                  )}
                </div>

                <div className="space-y-4">
                  <p className="text-xs font-bold text-warm-gray uppercase tracking-widest ml-2">Next Steps</p>
                  <div className="flex flex-col sm:flex-row gap-4">
                    <button
                      onClick={handleSaveToHistory}
                      disabled={saving || isEditing}
                      className="flex-1 py-4 bg-charcoal text-white font-bold rounded-2xl hover:bg-charcoal/90 transition-all flex items-center justify-center gap-2 shadow-xl shadow-charcoal/20 disabled:opacity-50"
                    >
                      {saving ? <RefreshCw className="animate-spin" size={20} /> : <Save size={20} className="text-sage" />}
                      Save to History
                    </button>
                    <button
                      onClick={handleReset}
                      className="flex-1 py-4 glass text-charcoal font-bold rounded-2xl hover:bg-white transition-all flex items-center justify-center gap-2 shadow-lg shadow-charcoal/5"
                    >
                      <PlusCircle size={20} className="text-terracotta" />
                      Generate New
                    </button>
                  </div>
                  <button
                    onClick={() => {
                      setGenerated(null);
                      setEditedResponse(null);
                      setIsEditing(false);
                    }}
                    className="w-full py-3 text-xs font-bold text-warm-gray hover:text-terracotta transition-colors flex items-center justify-center gap-2"
                  >
                    <Trash2 size={14} />
                    Discard this version
                  </button>
                </div>
              </motion.div>
            ) : (
              <div className="glass p-12 rounded-[2.5rem] flex flex-col items-center justify-center text-center min-h-[400px]">
                <div className="w-32 h-32 bg-cream rounded-full flex items-center justify-center mb-6">
                  <AlertCircle size={48} className="text-warm-gray/20" />
                </div>
                <h3 className="text-xl font-bold text-charcoal mb-2">No response generated</h3>
                <p className="text-warm-gray">Fill in the job details and let Daddy work his magic.</p>
              </div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
};

export default Generate;
