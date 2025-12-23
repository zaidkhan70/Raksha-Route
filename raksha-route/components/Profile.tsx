
import React, { useState } from 'react';
import { UserProfile } from '../types';

interface ProfileProps {
  user: UserProfile;
  setUser: React.Dispatch<React.SetStateAction<UserProfile>>;
}

const Profile: React.FC<ProfileProps> = ({ user, setUser }) => {
  const [isSaved, setIsSaved] = useState(false);
  const [localUser, setLocalUser] = useState<UserProfile>(user);

  const handleSave = () => {
    setUser(localUser);
    setIsSaved(true);
    setTimeout(() => setIsSaved(false), 3000);
  };

  const handleChange = (field: keyof UserProfile, value: string) => {
    setLocalUser(prev => ({ ...prev, [field]: value }));
  };

  return (
    <div className="max-w-2xl mx-auto animate-in fade-in slide-in-from-bottom-4 duration-500 pb-10">
      <div className="bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden">
        {/* Profile Header */}
        <div className="h-40 bg-gradient-to-br from-indigo-600 via-violet-600 to-indigo-700 relative">
          <div className="absolute -bottom-14 left-1/2 -translate-x-1/2">
             <div className="w-32 h-32 bg-white rounded-[2.5rem] p-2 shadow-2xl border border-slate-100 overflow-hidden group cursor-pointer">
                <div className="w-full h-full rounded-[2.1rem] overflow-hidden relative">
                  <img 
                    src="https://picsum.photos/seed/anjali/300/300" 
                    alt="Avatar" 
                    className="w-full h-full object-cover transition-transform group-hover:scale-110"
                  />
                  <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 flex items-center justify-center transition-opacity">
                    <i className="fas fa-camera text-white text-xl"></i>
                  </div>
                </div>
             </div>
          </div>
        </div>
        
        <div className="pt-20 pb-10 px-8 sm:px-12 text-center">
          <h2 className="text-2xl font-black text-slate-900 tracking-tight mb-1">{localUser.name}</h2>
          <p className="text-[11px] font-black text-indigo-600 uppercase tracking-[0.25em] mb-10 flex items-center justify-center gap-2">
            <i className="fas fa-circle-check text-[10px]"></i>
            Verified Digital Profile
          </p>
          
          <div className="space-y-6 text-left">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
              <div className="group">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Full Name</label>
                <div className="relative">
                  <i className="fas fa-user absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                  <input 
                    type="text" 
                    value={localUser.name} 
                    onChange={e => handleChange('name', e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm shadow-sm"
                  />
                </div>
              </div>
              <div className="group">
                <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Mobile Number</label>
                <div className="relative">
                  <i className="fas fa-phone absolute left-4 top-1/2 -translate-y-1/2 text-slate-300 text-sm"></i>
                  <input 
                    type="text" 
                    value={localUser.phone} 
                    onChange={e => handleChange('phone', e.target.value)}
                    className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all text-sm shadow-sm"
                  />
                </div>
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Home Address</label>
              <div className="relative">
                <i className="fas fa-location-dot absolute left-4 top-4 text-slate-300 text-sm"></i>
                <textarea 
                  rows={2}
                  value={localUser.address} 
                  onChange={e => handleChange('address', e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-sm shadow-sm"
                  placeholder="Enter your home or work address..."
                />
              </div>
            </div>

            <div className="group">
              <label className="text-[10px] font-black uppercase text-slate-400 tracking-widest block mb-2 ml-1 transition-colors group-focus-within:text-indigo-600">Emergency Protocols</label>
              <div className="relative">
                <i className="fas fa-hand-holding-heart absolute left-4 top-4 text-slate-300 text-sm"></i>
                <textarea 
                  rows={3}
                  value={localUser.emergencyPreferences} 
                  onChange={e => handleChange('emergencyPreferences', e.target.value)}
                  className="w-full pl-11 pr-4 py-4 bg-slate-50 border border-slate-100 rounded-2xl font-bold text-slate-900 outline-none focus:ring-2 focus:ring-indigo-500 focus:bg-white transition-all resize-none text-sm shadow-sm"
                  placeholder="e.g. Call my father if I trigger SOS..."
                />
              </div>
            </div>
          </div>

          <div className="mt-10 flex flex-col items-center gap-4">
            {isSaved && (
              <div className="flex items-center gap-2 text-emerald-600 bg-emerald-50 px-4 py-2 rounded-full text-xs font-black animate-in fade-in zoom-in-95">
                <i className="fas fa-check-circle"></i>
                PROFILE UPDATED SUCCESSFULLY
              </div>
            )}
            <button 
              onClick={handleSave}
              className={`w-full py-5 rounded-[1.5rem] text-white font-black text-xs uppercase tracking-widest shadow-2xl transition-all transform active:scale-95 flex items-center justify-center gap-3 ${
                isSaved ? 'bg-emerald-600' : 'bg-slate-900 hover:bg-slate-800'
              }`}
            >
              <i className={`fas ${isSaved ? 'fa-check' : 'fa-floppy-disk'}`}></i>
              {isSaved ? 'Changes Saved' : 'Save Security Profile'}
            </button>
          </div>
        </div>
      </div>
      
      <div className="mt-8 bg-indigo-50 p-6 rounded-[2.5rem] border border-indigo-100 flex items-center gap-5 shadow-sm">
         <div className="w-14 h-14 bg-white rounded-2xl flex items-center justify-center text-indigo-600 shadow-lg shrink-0">
            <i className="fas fa-fingerprint text-xl"></i>
         </div>
         <div>
            <p className="text-sm font-black text-indigo-900 leading-tight mb-1">Advanced Biometric Encryption</p>
            <p className="text-[11px] text-indigo-600/70 font-bold leading-relaxed">
              Your sensitive information like address and emergency contacts are encrypted and stored securely within the Raksha Network.
            </p>
         </div>
      </div>
    </div>
  );
};

export default Profile;
