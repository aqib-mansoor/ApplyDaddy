import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import ReactQuill from 'react-quill-new';
import { 
  User, 
  Mail, 
  Plus, 
  X, 
  Save, 
  FileText, 
  Briefcase,
  Sparkles,
  Edit2
} from 'lucide-react';
import { useAuthStore } from '../store/useAuthStore';
import { getUserProfile, updateUserProfile } from '../services/userService';
import { UserProfile } from '../types';
import toast from 'react-hot-toast';
import { ProfileSkeleton } from '../components/Skeleton';

const Profile: React.FC = () => {
  const { user } = useAuthStore();
  const [profile, setProfile] = useState<UserProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [isEditing, setIsEditing] = useState(false);
  const [newSkill, setNewSkill] = useState('');

  useEffect(() => {
    if (user) {
      getUserProfile(user.uid).then(p => {
        setProfile(p);
        setLoading(false);
      });
    }
  }, [user]);

  const handleSave = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!user || !profile) return;
    setSaving(true);
    try {
      await updateUserProfile(user.uid, profile);
      toast.success("Profile updated! Daddy's impressed.");
      setIsEditing(false);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSaving(false);
    }
  };

  const addSkill = () => {
    if (!newSkill.trim() || !profile) return;
    if (profile.skills.includes(newSkill.trim())) {
      toast.error("You already have this skill!");
      return;
    }
    setProfile({ ...profile, skills: [...profile.skills, newSkill.trim()] });
    setNewSkill('');
  };

  const removeSkill = (skill: string) => {
    if (!profile) return;
    setProfile({ ...profile, skills: profile.skills.filter(s => s !== skill) });
  };
  
  if (loading) return <ProfileSkeleton />;

  const quillModules = {
    toolbar: [
      ['bold', 'italic', 'underline'],
      [{ 'list': 'ordered'}, { 'list': 'bullet' }],
      ['clean']
    ],
  };

  const quillFormats = [
    'bold', 'italic', 'underline',
    'list'
  ];

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 pb-12">
      <header className="mb-8 md:mb-12 flex items-center justify-between gap-4">
        <div className="flex items-center gap-4 md:gap-6">
          <div className="w-12 h-12 md:w-20 md:h-20 bg-gradient-to-br from-terracotta to-sage rounded-2xl md:rounded-[2rem] flex items-center justify-center text-white shadow-xl shadow-terracotta/20 relative overflow-hidden group">
            <User size={24} className="md:w-10 md:h-10 relative z-10" />
            <div className="absolute inset-0 bg-white/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500" />
          </div>
          <div>
            <h2 className="text-2xl md:text-5xl font-display text-charcoal tracking-tight leading-none mb-1 md:mb-2">My Profile</h2>
            <p className="text-[10px] md:text-sm text-warm-gray font-bold uppercase tracking-widest opacity-70">Professional Identity</p>
          </div>
        </div>
        {!isEditing && (
          <motion.button
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            onClick={() => setIsEditing(true)}
            className="flex items-center justify-center gap-2 px-4 py-2 md:px-6 md:py-3 bg-charcoal text-white text-xs md:text-base font-bold rounded-xl md:rounded-2xl hover:bg-charcoal/90 transition-all shadow-lg shadow-charcoal/10"
          >
            <Edit2 size={14} className="md:w-[18px] md:h-[18px]" />
            <span className="hidden xs:inline">Edit Profile</span>
            <span className="xs:hidden">Edit</span>
          </motion.button>
        )}
      </header>

      {isEditing ? (
        <motion.form 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          onSubmit={handleSave} 
          className="space-y-6 md:space-y-8"
        >
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-10 border border-white/40 shadow-xl shadow-charcoal/5">
            <div className="grid md:grid-cols-2 gap-6 md:gap-10">
              {/* Full Name */}
              <div className="relative group">
                <User className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray group-focus-within:text-terracotta transition-colors" size={18} />
                <input
                  type="text"
                  value={profile?.fullName || ''}
                  onChange={e => setProfile(prev => prev ? { ...prev, fullName: e.target.value } : null)}
                  placeholder=" "
                  className="peer w-full pl-11 pr-4 pt-6 pb-2 bg-white/40 border border-charcoal/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-terracotta/30 outline-none transition-all text-sm md:text-base"
                />
                <label className="absolute left-11 top-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray peer-placeholder-shown:top-1/2 peer-placeholder-shown:-translate-y-1/2 peer-placeholder-shown:text-xs md:peer-placeholder-shown:text-sm peer-placeholder-shown:font-normal peer-placeholder-shown:tracking-normal transition-all pointer-events-none">
                  Full Name
                </label>
              </div>

              {/* Email (Read Only) */}
              <div className="relative group opacity-60">
                <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-warm-gray" size={18} />
                <input
                  type="email"
                  value={profile?.email || ''}
                  readOnly
                  placeholder=" "
                  className="peer w-full pl-11 pr-4 pt-6 pb-2 bg-white/20 border border-charcoal/5 rounded-xl md:rounded-2xl outline-none text-sm md:text-base cursor-not-allowed"
                />
                <label className="absolute left-11 top-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray transition-all pointer-events-none">
                  Email Address
                </label>
              </div>
            </div>

            {/* Bio */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray ml-2">
                <FileText size={14} className="text-terracotta" />
                Short Bio / Elevator Pitch
              </label>
              <div className="rich-editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={profile?.bio || ''}
                  onChange={val => setProfile(prev => prev ? { ...prev, bio: val } : null)}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Tell Daddy about yourself..."
                />
              </div>
            </div>

            {/* Experience */}
            <div className="space-y-3">
              <label className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray ml-2">
                <Briefcase size={14} className="text-terracotta" />
                Work Experience (Paste your resume summary)
              </label>
              <div className="rich-editor-wrapper">
                <ReactQuill
                  theme="snow"
                  value={profile?.experience || ''}
                  onChange={val => setProfile(prev => prev ? { ...prev, experience: val } : null)}
                  modules={quillModules}
                  formats={quillFormats}
                  placeholder="Paste your professional experience here..."
                />
              </div>
            </div>
          </div>

          {/* Skills Section */}
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 border border-white/40 shadow-xl shadow-charcoal/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-xl">
                  <Sparkles className="text-gold" size={18} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-charcoal">My Skills</h3>
              </div>
              <span className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">{profile?.skills.length || 0} Skills</span>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3 min-h-[80px] md:min-h-[100px] p-4 md:p-6 bg-white/20 rounded-2xl md:rounded-3xl border border-dashed border-charcoal/10">
              <AnimatePresence>
                {profile?.skills.map((skill) => (
                  <motion.div
                    key={skill}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    whileHover={{ y: -2 }}
                    className="px-3 py-1.5 bg-white text-charcoal font-bold text-[10px] md:text-xs rounded-full shadow-sm border border-charcoal/5 flex items-center gap-2 group"
                  >
                    {skill}
                    <button
                      type="button"
                      onClick={() => removeSkill(skill)}
                      className="text-warm-gray hover:text-terracotta transition-colors"
                    >
                      <X size={12} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
              {profile?.skills.length === 0 && (
                <p className="text-xs md:text-sm text-warm-gray italic self-center mx-auto">No skills added yet. Daddy's waiting.</p>
              )}
            </div>

            <div className="flex gap-3 md:gap-4">
              <div className="relative flex-1">
                <input
                  type="text"
                  value={newSkill}
                  onChange={e => setNewSkill(e.target.value)}
                  onKeyDown={e => e.key === 'Enter' && (e.preventDefault(), addSkill())}
                  placeholder="Add a skill..."
                  className="w-full px-5 py-3 md:py-4 bg-white/40 border border-charcoal/5 rounded-xl md:rounded-2xl focus:ring-2 focus:ring-terracotta/30 outline-none transition-all text-sm md:text-base"
                />
              </div>
              <button
                type="button"
                onClick={addSkill}
                className="p-3 md:p-4 bg-charcoal text-white rounded-xl md:rounded-2xl hover:bg-charcoal/90 transition-all shadow-lg shadow-charcoal/10 active:scale-95"
              >
                <Plus size={20} />
              </button>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-3 md:gap-4 pt-4">
            <button
              type="button"
              onClick={() => setIsEditing(false)}
              className="flex-1 py-3 md:py-4 bg-white/50 text-charcoal font-bold rounded-xl md:rounded-2xl hover:bg-white/80 transition-all border border-charcoal/10 text-xs md:text-base order-2 sm:order-1"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={saving}
              className="flex-[2] py-3 md:py-4 bg-terracotta text-white font-bold rounded-xl md:rounded-2xl hover:bg-terracotta/90 transition-all shadow-xl shadow-terracotta/20 flex items-center justify-center gap-2 md:gap-3 disabled:opacity-50 text-xs md:text-base order-1 sm:order-2"
            >
              {saving ? (
                <motion.div
                  animate={{ rotate: 360 }}
                  transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
                  className="w-4 h-4 md:w-5 md:h-5 border-2 border-white border-t-transparent rounded-full"
                />
              ) : (
                <>
                  <Save size={16} className="md:w-[20px] md:h-[20px]" />
                  Save Changes
                </>
              )}
            </button>
          </div>
        </motion.form>
      ) : (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6 md:space-y-8"
        >
          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-8 md:space-y-12 border border-white/40 shadow-xl shadow-charcoal/5">
            <div className="grid md:grid-cols-2 gap-8 md:gap-12">
              <div className="space-y-1 md:space-y-2 overflow-hidden">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray">Full Name</p>
                <p className="text-xl md:text-2xl font-display text-charcoal break-words">{profile?.fullName || 'Not set'}</p>
              </div>
              <div className="space-y-1 md:space-y-2 overflow-hidden">
                <p className="text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray">Email Address</p>
                <p className="text-lg md:text-xl font-display text-charcoal/80 break-words">{profile?.email}</p>
              </div>
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray">
                <FileText size={14} className="text-terracotta" />
                Short Bio / Elevator Pitch
              </div>
              <div 
                className="prose prose-sm md:prose-base max-w-none text-charcoal/90 bg-white/30 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/40 leading-relaxed break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: profile?.bio || '<p class="italic text-warm-gray">No bio added yet.</p>' }}
              />
            </div>

            <div className="space-y-4">
              <div className="flex items-center gap-2 text-[9px] md:text-[10px] font-bold uppercase tracking-widest text-warm-gray">
                <Briefcase size={14} className="text-terracotta" />
                Work Experience
              </div>
              <div 
                className="prose prose-sm md:prose-base max-w-none text-charcoal/90 bg-white/30 p-5 md:p-8 rounded-2xl md:rounded-[2rem] border border-white/40 leading-relaxed break-words overflow-hidden"
                dangerouslySetInnerHTML={{ __html: profile?.experience || '<p class="italic text-warm-gray">No experience added yet.</p>' }}
              />
            </div>
          </div>

          <div className="glass p-6 md:p-10 rounded-[2rem] md:rounded-[3rem] space-y-6 md:space-y-8 border border-white/40 shadow-xl shadow-charcoal/5">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-3">
                <div className="p-2 bg-gold/10 rounded-xl">
                  <Sparkles className="text-gold" size={18} />
                </div>
                <h3 className="text-lg md:text-xl font-bold text-charcoal">My Skills</h3>
              </div>
              <span className="text-[10px] font-bold text-warm-gray uppercase tracking-widest">{profile?.skills.length || 0} Skills</span>
            </div>

            <div className="flex flex-wrap gap-2 md:gap-3">
              {profile?.skills.map((skill) => (
                <motion.div
                  key={skill}
                  whileHover={{ y: -2 }}
                  className="px-4 py-2 md:px-5 md:py-2.5 bg-white text-charcoal font-bold text-[10px] md:text-xs rounded-full shadow-sm border border-charcoal/5"
                >
                  {skill}
                </motion.div>
              ))}
              {profile?.skills.length === 0 && (
                <p className="text-xs md:text-sm text-warm-gray italic">No skills added yet.</p>
              )}
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
};

export default Profile;
