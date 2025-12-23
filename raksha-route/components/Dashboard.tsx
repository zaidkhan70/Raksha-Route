
import React from 'react';
import { View, UserProfile, Contact } from '../types';

interface DashboardProps {
  user: UserProfile;
  contacts: Contact[];
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, contacts, setView }) => {
  const stats = [
    { label: 'Guardians', value: `${contacts.length} Active`, icon: 'fa-shield-heart', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Security Level', value: 'Maximum', icon: 'fa-lock', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Safe Zones', value: '14 Active', icon: 'fa-street-view', color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const quickActions = [
    { title: 'Safe Navigation', desc: 'Secure route intelligence', icon: 'fa-map-location-dot', view: View.NAVIGATE, color: 'text-white', bg: 'bg-indigo-600' },
    { title: 'Rakshak AI', desc: '24/7 Guardian chat', icon: 'fa-robot', view: View.RAKSHAK, color: 'text-slate-900', bg: 'bg-white' },
    { title: 'Guardian Circle', desc: 'Manage your trust list', icon: 'fa-users', view: View.CONTACTS, color: 'text-slate-900', bg: 'bg-white' },
    { title: 'Emergency Hub', desc: 'One-tap assistance', icon: 'fa-bolt-lightning', view: View.SOS, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const helplines = [
    { name: 'Police', number: '112', icon: 'fa-shield-halved', color: 'text-blue-600' },
    { name: 'Women', number: '181', icon: 'fa-venus', color: 'text-rose-600' },
    { name: 'Child', number: '1098', icon: 'fa-children', color: 'text-amber-600' },
    { name: 'Medical', number: '108', icon: 'fa-truck-medical', color: 'text-red-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Safe journey, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-[0.2em] mt-1">
            Guardian Protocol v2.4 Active
          </p>
        </div>
        <div className="flex items-center gap-3">
           <div className="hidden lg:flex flex-col items-end mr-4">
              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Device Status</span>
              <span className="text-xs font-bold text-emerald-600 flex items-center gap-2">
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                Encrypted & Syncing
              </span>
           </div>
           <button 
             onClick={() => setView(View.NAVIGATE)}
             className="px-6 py-3.5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3 text-xs uppercase tracking-widest"
           >
             <i className="fas fa-location-arrow"></i> Find Safe Route
           </button>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-[2rem] flex items-center gap-5 transition-transform hover:scale-[1.02]">
            <div className={`w-14 h-14 rounded-2xl ${stat.bg} ${stat.color} flex items-center justify-center text-xl shadow-sm`}>
              <i className={`fas ${stat.icon}`}></i>
            </div>
            <div>
              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{stat.label}</p>
              <p className="text-lg font-black text-slate-900">{stat.value}</p>
            </div>
          </div>
        ))}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => setView(action.view)}
            className={`${action.bg} ${action.color} p-8 rounded-[2.5rem] border border-slate-100 shadow-sm hover:shadow-xl hover:-translate-y-1 transition-all text-left flex flex-col justify-between h-48 group`}
          >
            <div className={`w-12 h-12 rounded-2xl flex items-center justify-center text-xl transition-transform group-hover:scale-110 ${action.bg === 'bg-white' ? 'bg-slate-50' : 'bg-white/20'}`}>
              <i className={`fas ${action.icon}`}></i>
            </div>
            <div>
              <h3 className="text-lg font-black tracking-tight">{action.title}</h3>
              <p className={`text-xs font-medium mt-1 ${action.bg === 'bg-indigo-600' ? 'text-indigo-100' : 'text-slate-400'}`}>
                {action.desc}
              </p>
            </div>
          </button>
        ))}
      </div>

      {/* Helplines Section */}
      <section className="glass-card p-8 rounded-[3rem]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Crisis Support Network</h2>
           <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg border border-rose-100">24/7 Response</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {helplines.map((help, i) => (
            <a
              key={i}
              href={`tel:${help.number}`}
              className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white hover:shadow-md hover:border-slate-200 transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${help.color} group-hover:scale-110 transition-transform`}>
                <i className={`fas ${help.icon}`}></i>
              </div>
              <div className="flex flex-col">
                <span className="text-[10px] font-black text-slate-400 uppercase leading-none mb-1.5">{help.name}</span>
                <span className="text-base font-black text-slate-900 leading-none tracking-tight">{help.number}</span>
              </div>
            </a>
          ))}
        </div>
      </section>

      {/* Dynamic Banner */}
      <section className="relative overflow-hidden rounded-[3rem] h-56 bg-slate-900 shadow-2xl group">
        <img 
          src="https://images.unsplash.com/photo-1557683316-973673baf926?q=80&w=2029&auto=format&fit=crop" 
          alt="Safety Network" 
          className="w-full h-full object-cover opacity-60 group-hover:scale-110 transition-transform duration-[3s]"
        />
        <div className="absolute inset-0 bg-gradient-to-r from-slate-900 via-slate-900/40 to-transparent flex items-center p-12">
           <div className="max-w-md space-y-4">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 text-[10px] font-black uppercase tracking-widest">
                 <i className="fas fa-satellite-dish animate-pulse"></i>
                 Live Monitoring Active
              </div>
              <h3 className="text-white text-2xl font-black tracking-tight leading-tight">Proactive Environment Scanning</h3>
              <p className="text-slate-300 text-sm font-medium leading-relaxed">
                Rakshak AI is analyzing lighting, footfall, and police proximity on your current path.
              </p>
           </div>
        </div>
      </section>
    </div>
  );
};

export default Dashboard;
