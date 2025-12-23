
import React, { useState, useEffect, useRef } from 'react';
import { View, Contact, UserProfile } from './types';
import Navbar from './components/Navbar';
import Dashboard from './components/Dashboard';
import Navigate from './components/Navigate';
import Contacts from './components/Contacts';
import ChatBot from './components/ChatBot';
import Profile from './components/Profile';
import About from './components/About';
import SOSButton from './components/SOSButton';
import Auth from './components/Auth';
import Landing from './components/Landing';

const App: React.FC = () => {
  const [currentView, setCurrentView] = useState<View>(View.LANDING);
  const [isSOSActive, setIsSOSActive] = useState(false);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<UserProfile | null>(null);
  const [sosStatus, setSosStatus] = useState<string | null>(null);

  // Audio Refs
  const audioContextRef = useRef<AudioContext | null>(null);
  const oscillatorRef = useRef<OscillatorNode | null>(null);

  // Initialize from localStorage or empty array
  const [emergencyContacts, setEmergencyContacts] = useState<Contact[]>(() => {
    const saved = localStorage.getItem('raksha_contacts');
    return saved ? JSON.parse(saved) : [];
  });

  // Load Session
  useEffect(() => {
    const saved = localStorage.getItem('raksha_session');
    if (saved) {
      setUser(JSON.parse(saved));
      setIsAuthenticated(true);
      setCurrentView(View.DASHBOARD);
    }
  }, []);

  // Persist Contacts
  useEffect(() => {
    localStorage.setItem('raksha_contacts', JSON.stringify(emergencyContacts));
  }, [emergencyContacts]);

  // Siren Control Effect
  useEffect(() => {
    if (isSOSActive) {
      startSiren();
    } else {
      stopSiren();
    }
    return () => stopSiren();
  }, [isSOSActive]);

  const startSiren = () => {
    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioContextClass();
      audioContextRef.current = ctx;

      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      const now = ctx.currentTime;
      
      osc.frequency.setValueAtTime(400, now);
      let time = now;
      for (let i = 0; i < 300; i++) {
        osc.frequency.exponentialRampToValueAtTime(1000, time + 0.6);
        osc.frequency.exponentialRampToValueAtTime(400, time + 1.2);
        time += 1.2;
      }

      gain.gain.setValueAtTime(0.4, now);
      osc.connect(gain);
      gain.connect(ctx.destination);
      
      osc.start();
      oscillatorRef.current = osc;
    } catch (e) {
      console.error("Audio Context failed to start", e);
    }
  };

  const stopSiren = () => {
    if (oscillatorRef.current) {
      try { oscillatorRef.current.stop(); } catch(e) {}
      oscillatorRef.current.disconnect();
      oscillatorRef.current = null;
    }
    if (audioContextRef.current) {
      audioContextRef.current.close();
      audioContextRef.current = null;
    }
  };

  const handleLoginSuccess = (userProfile: UserProfile) => {
    setUser(userProfile);
    setIsAuthenticated(true);
    setCurrentView(View.DASHBOARD);
    localStorage.setItem('raksha_session', JSON.stringify(userProfile));
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setUser(null);
    setCurrentView(View.LANDING);
    localStorage.removeItem('raksha_session');
    stopSiren();
    setIsSOSActive(false);
  };

  const handleSOSActivate = () => {
    setIsSOSActive(true);
    setSosStatus("Initializing SOS Protocol...");
    setTimeout(() => setSosStatus("GPS Location Shared with Guardian Circle"), 2000);
    setTimeout(() => setSosStatus("Local Authorities (112) Notified"), 4000);
  };

  const handleSOSCancel = () => {
    setIsSOSActive(false);
    setSosStatus(null);
    stopSiren();
  };

  const addContact = (contact: Contact) => setEmergencyContacts([...emergencyContacts, contact]);
  const updateContact = (contact: Contact) => setEmergencyContacts(emergencyContacts.map(c => c.id === contact.id ? contact : c));
  const deleteContact = (id: string) => setEmergencyContacts(emergencyContacts.filter(c => c.id !== id));

  const renderView = () => {
    if (!isAuthenticated) {
      if (currentView === View.LANDING) {
        return <Landing onStart={() => setCurrentView(View.PROFILE)} />;
      }
      return <Auth onLoginSuccess={handleLoginSuccess} />;
    }

    switch (currentView) {
      case View.DASHBOARD:
        return user ? <Dashboard user={user} contacts={emergencyContacts} setView={setCurrentView} /> : null;
      case View.NAVIGATE:
        return <Navigate />;
      case View.CONTACTS:
        return <Contacts contacts={emergencyContacts} onAdd={addContact} onUpdate={updateContact} onDelete={deleteContact} />;
      case View.RAKSHAK:
        return <ChatBot />;
      case View.SOS:
        return (
          <div className="max-w-4xl mx-auto space-y-8 animate-in fade-in slide-in-from-bottom-4">
            <h1 className="text-3xl font-black text-slate-900">SOS Hub</h1>
            <div className={`border p-8 lg:p-16 rounded-[4rem] text-center shadow-xl transition-all duration-500 ${isSOSActive ? 'bg-red-600 text-white border-red-500' : 'bg-red-50 text-red-900 border-red-100'}`}>
              <i className={`fas fa-triangle-exclamation text-7xl mb-8 ${isSOSActive ? 'text-white animate-bounce' : 'text-red-600 animate-pulse'}`}></i>
              <h2 className="text-2xl font-black uppercase tracking-widest mb-4">
                {isSOSActive ? 'EMERGENCY PROTOCOL ACTIVE' : 'Emergency Protocol'}
              </h2>
              <p className={`font-bold mb-10 max-w-lg mx-auto ${isSOSActive ? 'text-red-100' : 'text-red-700'}`}>
                {isSOSActive 
                  ? "Help is on the way. Please stay in a well-lit area if possible." 
                  : "Clicking the button below will alert your entire Guardian Circle and local 112 services with your live GPS location."}
              </p>
              
              {isSOSActive && (
                <div className="mb-10 bg-white/20 p-6 rounded-3xl font-black text-xs uppercase tracking-widest animate-pulse border border-white/30">
                  <i className="fas fa-tower-broadcast mr-3"></i>
                  {sosStatus || "SOS Broadcasting"}
                </div>
              )}

              {!isSOSActive ? (
                <button 
                  onClick={handleSOSActivate}
                  className="px-16 py-8 bg-red-600 text-white rounded-[2.5rem] font-black text-2xl shadow-2xl hover:bg-red-700 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Trigger SOS Now
                </button>
              ) : (
                <button 
                  onClick={handleSOSCancel}
                  className="px-12 py-5 bg-white text-red-600 rounded-[2rem] font-black text-sm shadow-xl hover:bg-slate-50 transition-all active:scale-95 uppercase tracking-widest"
                >
                  Cancel SOS / I am Safe
                </button>
              )}
            </div>
          </div>
        );
      case View.PROFILE:
        // @ts-ignore
        return user ? <Profile user={user} setUser={setUser} /> : null;
      case View.ABOUT:
        return <About />;
      default:
        return user ? <Dashboard user={user} contacts={emergencyContacts} setView={setCurrentView} /> : null;
    }
  };

  return (
    <div className={`min-h-screen font-sans pb-24 transition-colors duration-500 ${isSOSActive ? 'bg-red-50' : 'bg-slate-50'}`}>
      {isAuthenticated && <Navbar currentView={currentView} setView={setCurrentView} onLogout={handleLogout} />}
      <main className={`${isAuthenticated ? 'max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8' : ''}`}>
        {renderView()}
      </main>
      
      {isAuthenticated && (
        <SOSButton 
          isActive={isSOSActive} 
          onActivate={handleSOSActivate} 
          onCancel={handleSOSCancel} 
        />
      )}

      {isSOSActive && (
        <div className="fixed inset-0 pointer-events-none z-[100] border-[12px] border-red-500/30 animate-pulse"></div>
      )}
    </div>
  );
};

export default App;
