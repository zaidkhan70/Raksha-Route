
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
    { label: 'Dashboard', view: View.DASHBOARD, icon: 'fa-grid-2' },
    { label: 'Navigate', view: View.NAVIGATE, icon: 'fa-map-location-dot' },
    { label: 'Guardians', view: View.CONTACTS, icon: 'fa-shield-heart' },
    { label: 'Rakshak AI', view: View.RAKSHAK, icon: 'fa-robot' },
    { label: 'SOS Hub', view: View.SOS, icon: 'fa-bolt-lightning' },
  ];

  return (
    <nav className="sticky top-0 z-50 glass-card mx-4 sm:mx-8 mt-6 rounded-[2rem] border-white/50 premium-shadow">
      <div className="max-w-7xl mx-auto px-6 sm:px-8">
        <div className="flex justify-between h-20">
          <div className="flex items-center">
            <div 
              className="flex-shrink-0 flex items-center cursor-pointer group"
              onClick={() => setView(View.DASHBOARD)}
            >
              <div className="w-12 h-12 bg-indigo-600 rounded-[1.2rem] flex items-center justify-center shadow-lg shadow-indigo-200 transition-transform group-hover:scale-105">
                <i className="fas fa-shield-heart text-white text-xl"></i>
              </div>
              <div className="ml-4 flex flex-col">
                <span className="text-xl font-black tracking-tighter bg-gradient-to-r from-slate-900 to-indigo-600 bg-clip-text text-transparent leading-none">
                  Raksha Route
                </span>
                <span className="text-[9px] font-black text-slate-400 uppercase tracking-[0.3em] mt-1">Guardian Shield</span>
              </div>
            </div>
          </div>

          {/* Desktop Menu */}
          <div className="hidden lg:flex items-center space-x-2">
            {navItems.map((item) => (
              <button
                key={item.label}
                onClick={() => setView(item.view)}
                className={`px-5 py-2.5 rounded-xl text-[11px] font-black uppercase tracking-widest transition-all ${
                  currentView === item.view
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-100'
                    : 'text-slate-500 hover:text-indigo-600 hover:bg-indigo-50/50'
                }`}
              >
                {item.label}
              </button>
            ))}
            <div className="h-6 w-[1px] bg-slate-100 mx-4"></div>
            <button
              onClick={() => setView(View.PROFILE)}
              className={`w-10 h-10 rounded-full border-2 transition-all flex items-center justify-center ${
                currentView === View.PROFILE ? 'border-indigo-600 bg-indigo-50' : 'border-transparent bg-slate-50'
              }`}
            >
              <i className="fas fa-user text-slate-400"></i>
            </button>
            <button
              onClick={onLogout}
              className="ml-4 p-2.5 text-slate-400 hover:text-rose-600 transition-colors"
              title="Logout"
            >
              <i className="fas fa-power-off text-sm"></i>
            </button>
          </div>

          {/* Mobile Menu Button */}
          <div className="flex lg:hidden items-center">
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="w-12 h-12 rounded-2xl bg-slate-50 flex items-center justify-center text-slate-600"
            >
              <i className={`fas ${isOpen ? 'fa-xmark' : 'fa-bars-staggered'} text-lg`}></i>
            </button>
          </div>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="lg:hidden p-4 space-y-2 border-t border-slate-50">
          {navItems.map((item) => (
            <button
              key={item.label}
              onClick={() => { setView(item.view); setIsOpen(false); }}
              className={`w-full text-left px-6 py-4 rounded-2xl text-sm font-bold flex items-center gap-4 ${
                currentView === item.view ? 'bg-indigo-600 text-white shadow-xl shadow-indigo-100' : 'text-slate-600 hover:bg-slate-50'
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
            <i className="fas fa-power-off w-6 text-sm"></i>
            Logout System
          </button>
        </div>
      )}
    </nav>
  );
};

export default Navbar;
