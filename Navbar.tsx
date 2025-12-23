
import React, { useState } from 'react';
import { View } from '../types';

interface NavbarProps {
  currentView: View;
  setView: (view: View) => void;
  onLogout: () => void;
}

const Navbar: React.FC<NavbarProps> = ({ currentView, setView, onLogout }) => {
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { label: 'Home', view: View.DASHBOARD, icon: 'fa-home' },
    { label: 'Map', view: View.NAVIGATE, icon: 'fa-map' },
    { label: 'Contacts', view: View.CONTACTS, icon: 'fa-users' },
    { label: 'AI Assistant', view: View.RAKSHAK, icon: 'fa-robot' },
    { label: 'Emergency', view: View.SOS, icon: 'fa-bolt' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 sm:mx-8 mt-6 rounded-3xl border-white/50 premium-shadow">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => setView(View.DASHBOARD)}
            >
              <div className="w-10 h-10 bg-slate-900 rounded-xl flex items-center justify-center shadow-lg transition-transform group-hover:scale-105">
                <i className="fas fa-shield-alt text-white text-lg"></i>
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-lg font-black tracking-tighter text-slate-900 leading-none">
                  Raksha Route
                </span>
                <span className="text-[8px] font-black text-slate-400 uppercase tracking-[0.2em] mt-1">Safety Companion</span>
              </div>
            </div>
          </div>

          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`px-5 py-2.5 rounded-xl text-[10px] font-black uppercase tracking-widest transition-all ${
                  currentView === item.view
                    ? 'bg-slate-900 text-white shadow-md'
                    : 'text-slate-500 hover:bg-slate-50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-slate-100 mx-4"></div>
            <button
              onClick={() => setView(View.PROFILE)}
              className={`w-10 h-10 rounded-full flex items-center justify-center border-2 transition-all ${
                currentView === View.PROFILE ? 'border-slate-900 bg-slate-50' : 'border-transparent bg-slate-100'
              }`}
            >
              <i className="fas fa-user text-slate-400"></i>
            </button>
            <button
              onClick={onLogout}
              className="ml-4 p-2.5 text-slate-400 hover:text-rose-600"
              title="Logout"
            >
              <i className="fas fa-power-off text-sm"></i>
            </button>
          </div>

          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-10 h-10 rounded-xl bg-slate-50 flex items-center justify-center text-slate-600"
            >
              <i className={`fas ${isOpen ? 'fa-xmark' : 'fa-bars'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {isOpen && (
        <div className="lg:hidden p-4 space-y-2 border-t border-slate-50">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setView(item.view); setIsOpen(false); }}
              className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-4 ${
                currentView === item.view ? 'bg-slate-900 text-white' : 'text-slate-600 hover:bg-slate-50'
              }`}
            >
              <i className={`fas ${item.icon} w-6`}></i>
              {item.label}
            </button>
          ))}
          <button
            onClick={onLogout}
            className="w-full text-left px-6 py-4 rounded-2xl text-sm font-bold text-rose-600 flex items-center gap-4"
          >
            <i className="fas fa-power-off w-6"></i>
            Logout
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
