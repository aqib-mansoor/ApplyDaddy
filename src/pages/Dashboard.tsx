import React, { useEffect, useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { 
  TrendingUp, 
  Clock, 
  ShieldCheck, 
  ChevronRight, 
  ExternalLink,
  MoreHorizontal,
  AlertCircle
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getApplications } from '../services/applicationService';
import { getUserProfile } from '../services/userService';
import { Application, UserProfile } from '../types';
import { format, formatDistanceToNow } from 'date-fns';
import { useNavigate } from 'react-router-dom';
import toast from 'react-hot-toast';
import gsap from 'gsap';
import { DashboardSkeleton } from '../components/Skeleton';

const Dashboard: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  
  const counterRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (user) {
      const fetchData = async () => {
        try {
          const [apps, userProfile] = await Promise.all([
            getApplications(user.uid),
            getUserProfile(user.uid)
          ]);
          setApplications(apps);
          setProfile(userProfile);
        } catch (error) {
          console.error(error);
        } finally {
          setLoading(false);
        }
      };
      fetchData();
    }
  }, [user]);

  const interviewRate = applications.length > 0 
    ? Math.round((applications.filter(a => a.status === 'interview' || a.status === 'accepted').length / applications.length) * 100)
    : 0;

  useEffect(() => {
    if (!loading && counterRef.current) {
      gsap.to(counterRef.current, {
        innerText: interviewRate,
        duration: 2,
        snap: { innerText: 1 },
        ease: "power2.out"
      });
    }
  }, [loading, interviewRate]);

  const pendingApps = applications.filter(a => a.status === 'pending' || a.status === 'applied').slice(0, 3);

  const greeting = () => {
    const hour = new Date().getHours();
    if (hour < 12) return 'Good morning';
    if (hour < 18) return 'Good afternoon';
    return 'Good evening';
  };

  if (loading) return <DashboardSkeleton />;

  return (
    <div className="max-w-7xl mx-auto">
      <header id="dashboard-header" className="mb-8 md:mb-12">
        <motion.h2 
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          className="text-3xl md:text-4xl font-display text-charcoal mb-2"
        >
          {greeting()}, {profile?.fullName || user?.displayName || user?.email?.split('@')[0]}!
        </motion.h2>
        <p className="text-warm-gray text-sm md:text-base">Daddy's ready to get you hired today.</p>
      </header>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Card 1: Interview Rate */}
        <motion.div
          id="stat-interview-rate"
          whileHover={{ y: -5 }}
          className="glass p-6 md:p-8 rounded-3xl flex flex-col items-center justify-center text-center relative overflow-hidden"
        >
          <div className="absolute top-4 left-4 p-2 bg-gold/10 rounded-xl">
            <TrendingUp className="text-gold" size={20} />
          </div>
          <h3 className="text-lg font-bold text-charcoal mb-8">Interview Rate</h3>
          
          <div className="relative w-40 h-40 flex items-center justify-center">
            <svg className="w-full h-full transform -rotate-90">
              <circle
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                fill="transparent"
                className="text-cream"
              />
              <motion.circle
                initial={{ strokeDasharray: "0 440" }}
                animate={{ strokeDasharray: `${(interviewRate / 100) * 440} 440` }}
                transition={{ duration: 2, ease: "easeOut" }}
                cx="80"
                cy="80"
                r="70"
                stroke="currentColor"
                strokeWidth="12"
                strokeLinecap="round"
                fill="transparent"
                className="text-terracotta"
              />
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center">
              <span className="text-4xl font-bold text-charcoal">
                <span ref={counterRef}>0</span>%
              </span>
              <span className="text-xs text-warm-gray font-medium">Success</span>
            </div>
          </div>
          
          <p className="mt-8 text-sm text-warm-gray">
            {interviewRate > 50 ? "Daddy's proud of you!" : "Keep going, Daddy's here."}
          </p>
        </motion.div>

        {/* Card 2: Pending Applications */}
        <motion.div
          id="stat-queue"
          whileHover={{ y: -5 }}
          className="lg:col-span-1 glass p-6 md:p-8 rounded-3xl flex flex-col"
        >
          <div className="flex items-center justify-between mb-8">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-sage/10 rounded-xl">
                <Clock className="text-sage" size={20} />
              </div>
              <h3 className="text-lg font-bold text-charcoal">The Queue</h3>
            </div>
            <button 
              onClick={() => navigate('/applications')}
              className="text-xs font-bold text-terracotta hover:underline"
            >
              View All
            </button>
          </div>

          <div className="flex-1 space-y-4">
            {pendingApps.length > 0 ? (
              pendingApps.map((app) => (
                <div 
                  key={app.id} 
                  onClick={() => navigate('/applications')}
                  className="group flex items-center gap-4 p-4 bg-cream/50 hover:bg-white rounded-2xl transition-all border border-transparent hover:border-white shadow-sm hover:shadow-md cursor-pointer"
                >
                  <div className="w-10 h-10 bg-white rounded-xl flex items-center justify-center text-terracotta font-bold shadow-sm">
                    {app.companyName[0]}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm font-bold text-charcoal truncate">{app.companyName}</p>
                    <p className="text-xs text-warm-gray truncate">{app.jobTitle}</p>
                  </div>
                  <ChevronRight size={16} className="text-warm-gray group-hover:text-terracotta transition-colors" />
                </div>
              ))
            ) : (
              <div className="h-full flex flex-col items-center justify-center text-center p-4">
                <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mb-4">
                  <AlertCircle size={40} className="text-warm-gray/30" />
                </div>
                <p className="text-sm text-warm-gray">No pending apps. <br/> Go generate some!</p>
              </div>
            )}
          </div>
        </motion.div>

        {/* Card 3: Account Status */}
        <motion.div
          whileHover={{ y: -5 }}
          className="glass p-6 md:p-8 rounded-3xl flex flex-col justify-between relative overflow-hidden group"
        >
          <div className="absolute -top-12 -right-12 w-32 h-32 bg-gold/5 rounded-full blur-3xl group-hover:scale-150 transition-transform duration-1000"></div>
          
          <div>
            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-terracotta/10 rounded-xl">
                <ShieldCheck className="text-terracotta" size={20} />
              </div>
              <h3 className="text-lg font-bold text-charcoal">The Pro</h3>
            </div>

            <div className="space-y-6">
              <div>
                <div className="inline-flex items-center gap-2 px-3 py-1 bg-gold/20 text-gold text-xs font-bold rounded-full mb-2 animate-pulse">
                  <span className="w-1.5 h-1.5 bg-gold rounded-full"></span>
                  Free Tier Active
                </div>
                <p className="text-2xl font-display text-charcoal">Unlimited generations.</p>
                <p className="text-warm-gray mt-1">Daddy's generous.</p>
              </div>

              <div className="p-4 bg-cream/50 rounded-2xl border border-white/20 relative overflow-hidden">
                <motion.div 
                  className="absolute inset-0 bg-linear-to-r from-transparent via-white/30 to-transparent -translate-x-full"
                  animate={{ translateX: ['100%', '-100%'] }}
                  transition={{ duration: 2, repeat: Infinity, ease: "linear" }}
                />
                <div className="flex justify-between text-xs font-bold text-charcoal mb-2">
                  <span>Usage Stats</span>
                  <span className="text-terracotta">∞ / ∞</span>
                </div>
                <div className="w-full h-2 bg-white rounded-full overflow-hidden">
                  <div className="w-full h-full bg-terracotta/30"></div>
                </div>
              </div>
            </div>
          </div>

          <button 
            onClick={() => toast.success("You're on the Unlimited Free Plan. Daddy loves you!")}
            className="w-full mt-8 py-3 glass text-sm font-bold text-charcoal hover:bg-white transition-all rounded-xl flex items-center justify-center gap-2"
          >
            View Limits
            <ExternalLink size={14} />
          </button>
        </motion.div>
      </div>

      {/* Recent Activity Section */}
      <section className="mt-12">
        <div className="flex items-center justify-between mb-6">
          <h3 className="text-2xl font-display text-charcoal">Recent Activity</h3>
          <button 
            onClick={() => navigate('/applications')}
            className="text-sm font-bold text-terracotta hover:underline"
          >
            See All
          </button>
        </div>
        
        <div className="glass rounded-3xl overflow-hidden">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse min-w-[600px]">
              <thead>
                <tr className="bg-cream/50">
                  <th className="px-6 py-4 text-xs font-bold text-warm-gray uppercase tracking-wider">Company</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-gray uppercase tracking-wider">Job Title</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-gray uppercase tracking-wider">Status</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-gray uppercase tracking-wider">Date</th>
                  <th className="px-6 py-4 text-xs font-bold text-warm-gray uppercase tracking-wider"></th>
                </tr>
              </thead>
              <tbody className="divide-y divide-warm-gray/5">
                {applications.slice(0, 5).map((app) => (
                  <tr 
                    key={app.id} 
                    onClick={() => navigate('/applications')}
                    className="hover:bg-cream/20 transition-colors group cursor-pointer"
                  >
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-sage/10 rounded-lg flex items-center justify-center text-sage font-bold text-xs">
                          {app.companyName[0]}
                        </div>
                        <span className="text-sm font-bold text-charcoal">{app.companyName}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">{app.jobTitle}</td>
                    <td className="px-6 py-4">
                      <span className={`
                        px-3 py-1 rounded-full text-[10px] font-bold uppercase tracking-wider
                        ${app.status === 'applied' ? 'bg-sage/10 text-sage' : 
                          app.status === 'interview' ? 'bg-gold/10 text-gold' :
                          app.status === 'rejected' ? 'bg-terracotta/10 text-terracotta' :
                          'bg-warm-gray/10 text-warm-gray'}
                      `}>
                        {app.status}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-sm text-warm-gray">
                      {app.appliedDate?.seconds 
                        ? (Date.now() / 1000 - app.appliedDate.seconds < 86400 * 7
                            ? formatDistanceToNow(new Date(app.appliedDate.seconds * 1000), { addSuffix: true })
                            : format(new Date(app.appliedDate.seconds * 1000), 'MMM d, yyyy'))
                        : 'Just now'}
                    </td>
                    <td className="px-6 py-4 text-right">
                      <button className="p-2 text-warm-gray hover:text-charcoal transition-colors">
                        <MoreHorizontal size={18} />
                      </button>
                    </td>
                  </tr>
                ))}
                {applications.length === 0 && (
                  <tr>
                    <td colSpan={5} className="px-6 py-12 text-center text-warm-gray italic">
                      No applications yet. Go to the Generate tab to start!
                    </td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
