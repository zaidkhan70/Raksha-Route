
import React from 'react';
import { View, UserProfile, Contact } from '../types';

interface DashboardProps {
  user: UserProfile;
  contacts: Contact[];
  setView: (view: View) => void;
}

const Dashboard: React.FC<DashboardProps> = ({ user, contacts, setView }) => {
  const stats = [
    { label: 'Contacts', value: `${contacts.length} Active`, icon: 'fa-users', color: 'text-indigo-600', bg: 'bg-indigo-50' },
    { label: 'Safety Status', value: 'Safe', icon: 'fa-check-circle', color: 'text-emerald-600', bg: 'bg-emerald-50' },
    { label: 'Safe Zones', value: 'Nearby', icon: 'fa-map-pin', color: 'text-violet-600', bg: 'bg-violet-50' },
  ];

  const quickActions = [
    { title: 'Safe Route', desc: 'Plan your journey', icon: 'fa-map-location-dot', view: View.NAVIGATE, color: 'text-white', bg: 'bg-indigo-600' },
    { title: 'Ask AI', desc: 'Get safety advice', icon: 'fa-robot', view: View.RAKSHAK, color: 'text-slate-900', bg: 'bg-white' },
    { title: 'Trusted Contacts', desc: 'Manage your circle', icon: 'fa-address-book', view: View.CONTACTS, color: 'text-slate-900', bg: 'bg-white' },
    { title: 'SOS Alerts', desc: 'Emergency support', icon: 'fa-bolt-lightning', view: View.SOS, color: 'text-rose-600', bg: 'bg-rose-50' },
  ];

  const helplines = [
    { name: 'Police', number: '112', icon: 'fa-shield-halved', color: 'text-blue-600' },
    { name: 'Women Help', number: '181', icon: 'fa-venus', color: 'text-rose-600' },
    { name: 'Child Help', number: '1098', icon: 'fa-children', color: 'text-amber-600' },
    { name: 'Medical', number: '108', icon: 'fa-truck-medical', color: 'text-red-600' },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-2 border-b border-slate-100">
        <div>
          <h1 className="text-3xl font-extrabold text-slate-900 tracking-tight leading-tight">
            Welcome, {user.name.split(' ')[0]} 👋
          </h1>
          <p className="text-slate-400 text-sm font-semibold uppercase tracking-[0.2em] mt-1">
            Safety Monitoring Active
          </p>
        </div>
        <div className="flex items-center gap-3">
           <button 
             onClick={() => setView(View.NAVIGATE)}
             className="px-6 py-3.5 bg-slate-900 text-white font-black rounded-2xl shadow-xl hover:bg-indigo-600 transition-all active:scale-95 flex items-center gap-3 text-xs uppercase tracking-widest"
           >
             <i className="fas fa-location-arrow"></i> Find Safe Route
           </button>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-5">
        {stats.map((stat, i) => (
          <div key={i} className="glass-card p-6 rounded-3xl flex items-center gap-5">
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

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5">
        {quickActions.map((action, i) => (
          <button
            key={i}
            onClick={() => setView(action.view)}
            className={`${action.bg} ${action.color} p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-md transition-all text-left flex flex-col justify-between h-48 group`}
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

      <section className="glass-card p-8 rounded-[2rem]">
        <div className="flex items-center justify-between mb-8">
           <h2 className="text-[11px] font-black text-slate-400 uppercase tracking-[0.25em]">Emergency Contacts</h2>
           <span className="px-3 py-1 bg-rose-50 text-rose-600 text-[10px] font-black rounded-lg border border-rose-100">24/7 Support</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {helplines.map((help, i) => (
            <a
              key={i}
              href={`tel:${help.number}`}
              className="flex items-center gap-4 p-5 rounded-3xl bg-slate-50/50 border border-slate-100 hover:bg-white transition-all group"
            >
              <div className={`w-10 h-10 rounded-xl bg-white shadow-sm flex items-center justify-center ${help.color}`}>
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
    </div>
  );
};

export default Dashboard;
