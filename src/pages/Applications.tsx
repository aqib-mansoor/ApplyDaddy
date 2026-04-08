import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import { 
  Search, 
  Filter, 
  Download, 
  Trash2, 
  Eye, 
  MoreVertical,
  ChevronLeft,
  ChevronRight,
  ChevronDown,
  X,
  AlertTriangle,
  CheckCircle2,
  Clock,
  XCircle,
  ExternalLink,
  Mail,
  MessageCircle,
  Sparkles,
  Crown,
  History as HistoryIcon
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getApplications, updateApplicationStatus, deleteApplication } from '../services/applicationService';
import { Application } from '../types';
import { format, formatDistanceToNow, isWithinInterval, subDays } from 'date-fns';
import toast from 'react-hot-toast';
import { ApplicationsSkeleton } from '../components/Skeleton';

const Applications: React.FC = () => {
  const { user } = useAuthStore();
  const navigate = useNavigate();
  const [applications, setApplications] = useState<Application[]>([]);
  const [loading, setLoading] = useState(true);
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState<Application['status'] | 'all'>('all');
  const [startDate, setStartDate] = useState('');
  const [endDate, setEndDate] = useState('');
  const [dateRangeFilter, setDateRangeFilter] = useState<'all' | 'today' | 'week' | 'month' | 'custom'>('all');
  const [selectedApp, setSelectedApp] = useState<Application | null>(null);
  const [deleteConfirmId, setDeleteConfirmId] = useState<string | null>(null);

  useEffect(() => {
    if (user) {
      fetchApps();
    }
  }, [user]);

  const fetchApps = async () => {
    try {
      const apps = await getApplications(user!.uid);
      setApplications(apps);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Application['status']) => {
    try {
      await updateApplicationStatus(id, status);
      setApplications(apps => apps.map(a => a.id === id ? { ...a, status } : a));
      toast.success(`Status updated to ${status}!`);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const handleDelete = async () => {
    if (!deleteConfirmId) return;
    try {
      await deleteApplication(deleteConfirmId);
      setApplications(apps => apps.filter(a => a.id !== deleteConfirmId));
      toast.success("Application deleted.");
      setDeleteConfirmId(null);
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  const exportCSV = () => {
    const headers = ['Company', 'Job Title', 'Status', 'Date Applied'];
    const rows = applications.map(app => [
      app.companyName,
      app.jobTitle,
      app.status,
      app.appliedDate?.seconds ? format(new Date(app.appliedDate.seconds * 1000), 'yyyy-MM-dd') : 'N/A'
    ]);
    const csvContent = [headers, ...rows].map(e => e.join(",")).join("\n");
    const blob = new Blob([csvContent], { type: 'text/csv;charset=utf-8;' });
    const link = document.createElement("a");
    const url = URL.createObjectURL(blob);
    link.setAttribute("href", url);
    link.setAttribute("download", "applications.csv");
    link.style.visibility = 'hidden';
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const filteredApps = applications.filter(app => {
    const matchesSearch = app.companyName.toLowerCase().includes(searchTerm.toLowerCase()) || 
                         app.jobTitle.toLowerCase().includes(searchTerm.toLowerCase());
    const matchesStatus = statusFilter === 'all' || app.status === statusFilter;
    
    let matchesDate = true;
    if (app.appliedDate) {
      const appDate = app.appliedDate.seconds 
        ? new Date(app.appliedDate.seconds * 1000) 
        : new Date(app.appliedDate);
      
      if (dateRangeFilter === 'today') {
        const today = new Date();
        today.setHours(0, 0, 0, 0);
        if (appDate < today) matchesDate = false;
      } else if (dateRangeFilter === 'week') {
        const weekAgo = subDays(new Date(), 7);
        if (appDate < weekAgo) matchesDate = false;
      } else if (dateRangeFilter === 'month') {
        const monthAgo = subDays(new Date(), 30);
        if (appDate < monthAgo) matchesDate = false;
      } else if (dateRangeFilter === 'custom') {
        if (startDate) {
          const start = new Date(startDate);
          start.setHours(0, 0, 0, 0);
          if (appDate < start) matchesDate = false;
        }
        if (endDate) {
          const end = new Date(endDate);
          end.setHours(23, 59, 59, 999);
          if (appDate > end) matchesDate = false;
        }
      }
    }

    return matchesSearch && matchesStatus && matchesDate;
  });

  const statusColors = {
    pending: 'bg-warm-gray/10 text-warm-gray',
    applied: 'bg-sage/10 text-sage',
    interview: 'bg-gold/10 text-gold',
    rejected: 'bg-terracotta/10 text-terracotta',
    accepted: 'bg-emerald-500/10 text-emerald-500'
  };

  const statusIcons = {
    pending: Clock,
    applied: CheckCircle2,
    interview: Sparkles,
    rejected: XCircle,
    accepted: Crown
  };

  const stats = {
    total: applications.length,
    interviews: applications.filter(a => a.status === 'interview').length,
    accepted: applications.filter(a => a.status === 'accepted').length,
    successRate: applications.length > 0 
      ? Math.round(((applications.filter(a => ['interview', 'accepted'].includes(a.status)).length) / applications.length) * 100) 
      : 0
  };

  if (loading) return <ApplicationsSkeleton />;

  return (
    <div className="max-w-7xl mx-auto px-4 md:px-0 pb-20">
      <header className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div>
          <h2 className="text-3xl md:text-5xl font-display text-charcoal mb-2">Application History</h2>
          <p className="text-warm-gray text-sm md:text-base">Track your progress and stay organized with Daddy.</p>
        </div>
        <div className="flex items-center gap-3">
          {(searchTerm || statusFilter !== 'all' || dateRangeFilter !== 'all') && (
            <button 
              onClick={() => {
                setSearchTerm('');
                setStatusFilter('all');
                setDateRangeFilter('all');
                setStartDate('');
                setEndDate('');
              }}
              className="text-xs font-bold text-terracotta hover:underline flex items-center gap-1 px-4 py-2"
            >
              <X size={14} />
              Clear Filters
            </button>
          )}
          <button 
            onClick={exportCSV}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-6 py-3 bg-charcoal text-white text-xs font-bold rounded-2xl hover:bg-charcoal/90 transition-all shadow-lg shadow-charcoal/10"
          >
            <Download size={18} />
            <span>Export CSV</span>
          </button>
        </div>
      </header>

      {/* Stats Summary */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-4 mb-12">
        {[
          { label: 'Total Apps', value: stats.total, icon: HistoryIcon, color: 'text-charcoal', bg: 'bg-charcoal/5' },
          { label: 'Interviews', value: stats.interviews, icon: Sparkles, color: 'text-gold', bg: 'bg-gold/10' },
          { label: 'Offers', value: stats.accepted, icon: Crown, color: 'text-sage', bg: 'bg-sage/10' },
          { label: 'Success Rate', value: `${stats.successRate}%`, icon: CheckCircle2, color: 'text-terracotta', bg: 'bg-terracotta/10' },
        ].map((stat, i) => (
          <motion.div
            key={stat.label}
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: i * 0.1 }}
            className="glass p-6 rounded-3xl border-none shadow-sm"
          >
            <div className={`w-10 h-10 ${stat.bg} ${stat.color} rounded-xl flex items-center justify-center mb-4`}>
              <stat.icon size={20} />
            </div>
            <p className="text-xs font-bold text-warm-gray uppercase tracking-widest mb-1">{stat.label}</p>
            <p className={`text-2xl md:text-3xl font-display ${stat.color}`}>{stat.value}</p>
          </motion.div>
        ))}
      </div>

      {/* Filters & Search */}
      <div className="flex flex-col lg:flex-row gap-4 mb-8">
        <div className="relative flex-1">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={20} />
          <input
            type="text"
            placeholder="Search company or job title..."
            value={searchTerm}
            onChange={e => setSearchTerm(e.target.value)}
            className="w-full pl-12 pr-4 py-4 bg-white border border-charcoal/5 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all shadow-sm"
          />
        </div>
        <div className="flex flex-wrap gap-4">
          <div className="relative flex-1 lg:w-48">
            <Filter className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={20} />
            <select
              value={statusFilter}
              onChange={e => setStatusFilter(e.target.value as any)}
              className="w-full pl-12 pr-10 py-4 bg-white border border-charcoal/5 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all shadow-sm appearance-none font-bold text-charcoal text-sm"
            >
              <option value="all">All Statuses</option>
              <option value="pending">Pending</option>
              <option value="applied">Applied</option>
              <option value="interview">Interview</option>
              <option value="rejected">Rejected</option>
              <option value="accepted">Accepted</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" size={16} />
          </div>

          <div className="relative flex-1 lg:w-48">
            <Clock className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={20} />
            <select
              value={dateRangeFilter}
              onChange={e => setDateRangeFilter(e.target.value as any)}
              className="w-full pl-12 pr-10 py-4 bg-white border border-charcoal/5 rounded-2xl focus:ring-2 focus:ring-terracotta/50 outline-none transition-all shadow-sm appearance-none font-bold text-charcoal text-sm"
            >
              <option value="all">All Time</option>
              <option value="today">Today</option>
              <option value="week">Last 7 Days</option>
              <option value="month">Last 30 Days</option>
              <option value="custom">Custom Range</option>
            </select>
            <ChevronDown className="absolute right-4 top-1/2 -translate-y-1/2 text-warm-gray pointer-events-none" size={16} />
          </div>

          {dateRangeFilter === 'custom' && (
            <motion.div 
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              className="flex flex-col sm:flex-row items-stretch sm:items-center gap-2 bg-white border border-charcoal/5 rounded-2xl p-2 shadow-sm min-w-[280px]"
            >
              <div className="flex-1 flex flex-col px-3 py-1 hover:bg-cream/30 rounded-xl transition-colors">
                <label className="text-[10px] font-bold text-warm-gray uppercase tracking-widest mb-0.5">From</label>
                <input 
                  type="date" 
                  value={startDate}
                  onChange={e => setStartDate(e.target.value)}
                  className="bg-transparent text-sm font-bold text-charcoal outline-none w-full cursor-pointer min-h-[24px]"
                />
              </div>
              <div className="hidden sm:block w-px h-8 bg-charcoal/5"></div>
              <div className="flex-1 flex flex-col px-3 py-1 hover:bg-cream/30 rounded-xl transition-colors">
                <label className="text-[10px] font-bold text-warm-gray uppercase tracking-widest mb-0.5">To</label>
                <input 
                  type="date" 
                  value={endDate}
                  onChange={e => setEndDate(e.target.value)}
                  className="bg-transparent text-sm font-bold text-charcoal outline-none w-full cursor-pointer min-h-[24px]"
                />
              </div>
            </motion.div>
          )}
        </div>
      </div>

      {/* Applications List */}
      <div className="space-y-4">
        {filteredApps.length > 0 ? (
          <div className="grid grid-cols-1 gap-4">
            {filteredApps.map((app, i) => (
              <motion.div
                key={app.id}
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                transition={{ delay: i * 0.05 }}
                className="glass p-6 md:p-8 rounded-[2.5rem] border-none shadow-xl shadow-charcoal/5 hover:shadow-2xl hover:shadow-charcoal/10 transition-all group relative overflow-hidden"
              >
                <div className="flex flex-col md:flex-row md:items-center justify-between gap-6">
                  <div className="flex items-center gap-6">
                    <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-terracotta font-bold text-2xl shadow-lg border border-charcoal/5 group-hover:rotate-6 transition-transform">
                      {app.companyName[0]}
                    </div>
                    <div>
                      <h3 className="text-xl font-display text-charcoal mb-1">{app.companyName}</h3>
                      <div className="flex flex-wrap items-center gap-3">
                        <span className="text-sm font-bold text-warm-gray">{app.jobTitle}</span>
                        <span className="w-1 h-1 bg-warm-gray/30 rounded-full"></span>
                        <span className="text-xs text-warm-gray flex items-center gap-1">
                          <Clock size={12} />
                          {app.appliedDate?.seconds 
                            ? (Date.now() / 1000 - app.appliedDate.seconds < 86400 * 7
                                ? formatDistanceToNow(new Date(app.appliedDate.seconds * 1000), { addSuffix: true })
                                : format(new Date(app.appliedDate.seconds * 1000), 'MMM d, yyyy'))
                            : 'Recently'}
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="flex flex-wrap items-center gap-4">
                    <div className="relative">
                      <select
                        value={app.status}
                        onChange={e => handleStatusChange(app.id, e.target.value as any)}
                        className={`
                          pl-4 pr-10 py-2.5 rounded-full text-[10px] font-bold uppercase tracking-widest outline-none transition-all appearance-none cursor-pointer shadow-sm
                          ${statusColors[app.status]}
                        `}
                      >
                        <option value="pending">Pending</option>
                        <option value="applied">Applied</option>
                        <option value="interview">Interview</option>
                        <option value="rejected">Rejected</option>
                        <option value="accepted">Accepted</option>
                      </select>
                      <ChevronDown className="absolute right-3 top-1/2 -translate-y-1/2 pointer-events-none opacity-50" size={14} />
                    </div>

                    <div className="flex items-center gap-2">
                      <button 
                        onClick={() => setSelectedApp(app)}
                        className="p-3 bg-white text-warm-gray hover:text-charcoal hover:bg-charcoal/5 rounded-2xl transition-all shadow-sm border border-charcoal/5"
                        title="View Details"
                      >
                        <Eye size={20} />
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(app.generatedEmail.body);
                          toast.success("Email copied!");
                        }}
                        className="p-3 bg-white text-warm-gray hover:text-blue-500 hover:bg-blue-50 rounded-2xl transition-all shadow-sm border border-charcoal/5 flex items-center gap-2"
                        title="Copy Email"
                      >
                        <Mail size={20} />
                        <span className="hidden xl:inline text-xs font-bold">Email</span>
                      </button>
                      <button 
                        onClick={() => {
                          navigator.clipboard.writeText(app.generatedWhatsapp);
                          toast.success("WhatsApp message copied!");
                        }}
                        className="p-3 bg-white text-warm-gray hover:text-emerald-500 hover:bg-emerald-50 rounded-2xl transition-all shadow-sm border border-charcoal/5 flex items-center gap-2"
                        title="Copy WhatsApp"
                      >
                        <MessageCircle size={20} />
                        <span className="hidden xl:inline text-xs font-bold">WhatsApp</span>
                      </button>
                      <button 
                        onClick={() => setDeleteConfirmId(app.id)}
                        className="p-3 bg-white text-warm-gray hover:text-red-500 hover:bg-red-50 rounded-2xl transition-all shadow-sm border border-charcoal/5"
                        title="Delete"
                      >
                        <Trash2 size={20} />
                      </button>
                    </div>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        ) : (
          <div className="glass py-20 text-center rounded-[3rem] border-none">
            <div className="w-24 h-24 bg-cream rounded-full flex items-center justify-center mx-auto mb-6">
              <Search size={40} className="text-warm-gray/20" />
            </div>
            <p className="text-2xl font-display text-charcoal mb-2">No applications found</p>
            <p className="text-warm-gray mb-8">Try adjusting your filters or start a new application.</p>
            <div className="flex flex-col sm:flex-row items-center justify-center gap-4">
              {(searchTerm || statusFilter !== 'all' || startDate || endDate) && (
                <button 
                  onClick={() => {
                    setSearchTerm('');
                    setStatusFilter('all');
                    setStartDate('');
                    setEndDate('');
                  }}
                  className="btn-secondary px-8 py-4"
                >
                  Clear All Filters
                </button>
              )}
              <button 
                onClick={() => navigate('/generate')}
                className="btn-primary px-8 py-4"
              >
                Start New Application
              </button>
            </div>
          </div>
        )}
      </div>

      {/* Details Modal */}
      <AnimatePresence>
        {selectedApp && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setSelectedApp(null)}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-2xl glass p-8 rounded-[2.5rem] shadow-2xl border-none max-h-[90vh] overflow-y-auto"
            >
              <button
                onClick={() => setSelectedApp(null)}
                className="absolute top-6 right-6 p-2 hover:bg-cream/50 rounded-full transition-colors"
              >
                <X size={24} className="text-warm-gray" />
              </button>

              <div className="flex items-center gap-4 mb-8">
                <div className="w-16 h-16 bg-white rounded-2xl flex items-center justify-center text-terracotta font-bold text-2xl shadow-lg border border-charcoal/5">
                  {selectedApp.companyName[0]}
                </div>
                <div>
                  <h3 className="text-2xl font-display text-charcoal">{selectedApp.companyName}</h3>
                  <p className="text-warm-gray font-bold">{selectedApp.jobTitle}</p>
                </div>
              </div>

              <div className="space-y-8">
                {/* Email Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-blue-500 font-bold text-sm">
                      <Mail size={18} />
                      Generated Email
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(`${selectedApp.generatedEmail.subject}\n\n${selectedApp.generatedEmail.body}`);
                        toast.success("Email copied!");
                      }}
                      className="text-xs font-bold text-terracotta hover:underline"
                    >
                      Copy All
                    </button>
                  </div>
                  <div className="p-4 bg-cream/50 rounded-xl border border-white/20">
                    <p className="text-[10px] font-bold text-warm-gray uppercase tracking-widest mb-1">Subject</p>
                    <p className="text-sm font-bold text-charcoal">{selectedApp.generatedEmail.subject}</p>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-white/20 text-sm text-warm-gray leading-relaxed whitespace-pre-wrap">
                    {selectedApp.generatedEmail.body}
                  </div>
                </div>

                {/* WhatsApp Section */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-emerald-500 font-bold text-sm">
                      <MessageCircle size={18} />
                      WhatsApp Message
                    </div>
                    <button 
                      onClick={() => {
                        navigator.clipboard.writeText(selectedApp.generatedWhatsapp);
                        toast.success("WhatsApp message copied!");
                      }}
                      className="text-xs font-bold text-terracotta hover:underline"
                    >
                      Copy
                    </button>
                  </div>
                  <div className="p-6 bg-white rounded-2xl border border-white/20 text-sm text-warm-gray leading-relaxed whitespace-pre-wrap">
                    {selectedApp.generatedWhatsapp}
                  </div>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

      {/* Delete Confirmation Modal */}
      <AnimatePresence>
        {deleteConfirmId && (
          <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="absolute inset-0 bg-charcoal/40 backdrop-blur-md"
            />
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="relative w-full max-w-sm glass p-8 rounded-[2.5rem] shadow-2xl border-none text-center"
            >
              <div className="w-20 h-20 bg-terracotta/10 rounded-full flex items-center justify-center mx-auto mb-6">
                <AlertTriangle size={40} className="text-terracotta" />
              </div>
              <h3 className="text-2xl font-display text-charcoal mb-2">Are you sure?</h3>
              <p className="text-warm-gray mb-8">This application will be gone forever. Daddy can't bring it back.</p>
              
              <div className="flex gap-4">
                <button
                  onClick={() => setDeleteConfirmId(null)}
                  className="flex-1 py-4 glass text-warm-gray font-bold rounded-2xl hover:bg-white transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={handleDelete}
                  className="flex-1 py-4 bg-terracotta text-white font-bold rounded-2xl hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/30"
                >
                  Delete
                </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Applications;
