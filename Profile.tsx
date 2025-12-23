
import React, { useState } from 'react';
import { UserProfile } from '../types';
import { firebaseAuth } from '../services/firebase';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [isSaving, setIsSaving] = useState(false);
  const [isSaved, setIsSaved] = useState(false);
  const [localUser, setLocalUser] = useState<UserProfile>(user);

  const handleSave = async () => {
    setIsSaving(true);
    try {
      await firebaseAuth.updateProfile(localUser);
      setUser(localUser);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3000);
    } catch (error) {
      console.error("Failed to save profile:", error);
      alert("Profile could not be saved. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Simplified Header without photo */}
        <div className="bg-slate-900 px-12 py-12 flex items-center justify-between">
           <div>
              <h2 className="text-3xl font-black text-white tracking-tight mb-2">Account Settings</h2>
              <p className="text-[10px] font-black text-white/40 uppercase tracking-[0.3em]">Manage your security profile</p>
           </div>
           <div className="w-16 h-16 bg-white/10 rounded-2xl flex items-center justify-center text-white">
              <i className="fas fa-user-gear text-2xl"></i>
           </div>
        </div>
        
        <div className="py-12 px-8 sm:px-12">
          <div className="space-y-8">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-8">
              <div className="group">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3 ml-1">Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                  <input 
                    type="text" 
                    value={localUser.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3 ml-1">Mobile Number</label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-5 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                  <input 
                    type="text" 
                    value={localUser.phone} 
                    onChange={e => handleChange('phone', e.target.value)}
                    className="w-full pl-12 pr-6 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all text-sm"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3 ml-1">Home Address</label>
              <div className="relative">
                <i className="fas fa-location-dot absolute left-5 top-5 text-slate-300 text-sm"></i>
                <textarea 
                  rows={2}
                  value={localUser.address} 
                  onChange={e => handleChange('address', e.target.value)}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none text-sm"
                  placeholder="Enter your registered address..."
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-3 ml-1">Emergency SOS Note</label>
              <div className="relative">
                <i className="fas fa-message absolute left-5 top-5 text-slate-300 text-sm"></i>
                <textarea 
                  rows={3}
                  value={localUser.emergencyPreferences} 
                  onChange={e => handleChange('emergencyPreferences', e.target.value)}
                  className="w-full pl-12 pr-6 py-5 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-slate-900 focus:bg-white transition-all resize-none text-sm"
                  placeholder="Enter custom instructions for SOS alerts..."
                />
              </div>
            </div>
          </div>

          <div className="mt-12 flex flex-col items-center gap-6">
            {isSaved && (
              <div className="flex items-center gap-3 text-emerald-600 bg-emerald-50 px-6 py-3 rounded-2xl text-[11px] font-black uppercase tracking-widest animate-in fade-in zoom-in-95">
                <i className="fas fa-check-circle"></i>
                Changes saved successfully
              </div>
            )}
            <button 
              onClick={handleSave}
              disabled={isSaving}
              className={`w-full py-6 rounded-2xl text-white font-black text-xs uppercase tracking-widest shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                isSaved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
              } disabled:opacity-50`}
            >
              {isSaving ? <i className="fas fa-circle-notch fa-spin"></i> : <i className={`fas ${isSaved ? 'fa-check' : 'fa-floppy-disk'}`}></i>}
              {isSaved ? 'Updated' : isSaving ? 'Saving' : 'Save Profile Changes'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-slate-100 p-8 rounded-[2.5rem] border border-slate-200 flex items-center gap-6">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-slate-900 shadow-sm shrink-0">
            <i className="fas fa-lock text-xl"></i>
         </div>
         <div>
            <h4 className="text-sm font-black text-slate-900 mb-1">Privacy & Data Security</h4>
            <p className="text-[11px] text-slate-500 font-bold leading-relaxed">
              Your safety data is end-to-end encrypted. We only share your live location with your trusted contacts when you trigger an SOS.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Profile;
