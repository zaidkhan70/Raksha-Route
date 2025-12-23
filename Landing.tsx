
import React, { useEffect } from 'react';

// @ts-ignore
declare const AOS: any;

interface LandingProps {
  onStart: () => void;
}

const Landing: React.FC<LandingProps> = ({ onStart }) => {
  useEffect(() => {
    if (typeof AOS !== 'undefined') {
      AOS.init({
        duration: 1000,
        once: true,
        mirror: false,
      });
    }
  }, []);

  return (
    <div className="min-h-screen bg-slate-50 overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative pt-20 pb-32 overflow-hidden">
        <div className="container mx-auto px-6 relative z-10">
          <div className="flex flex-col lg:flex-row items-center gap-16">
            <div className="lg:w-1/2" data-aos="fade-right">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-indigo-100 text-indigo-600 font-bold text-xs uppercase tracking-widest mb-8">
                <i className="fas fa-shield-halved"></i>
                India's Most Trusted Safety App
              </div>
              <h1 className="text-5xl lg:text-7xl font-black text-slate-900 leading-[1.1] mb-8">
                Your Safety, <br />
                <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-600 to-violet-600">Our Priority.</span>
              </h1>
              <p className="text-xl text-slate-500 font-medium mb-12 max-w-lg">
                Proactive route intelligence, instant SOS support, and AI-powered protection for women and children on the go.
              </p>
              <div className="flex flex-col sm:flex-row gap-4">
                <button 
                  onClick={onStart}
                  className="px-10 py-5 bg-slate-900 text-white rounded-[2rem] font-black text-sm uppercase tracking-widest shadow-2xl hover:bg-slate-800 transition-all active:scale-95"
                >
                  Get Started Now
                </button>
              </div>
            </div>
            <div className="lg:w-1/2 relative" data-aos="zoom-in" data-aos-delay="200">
              <div className="absolute inset-0 bg-indigo-200 rounded-full blur-[120px] opacity-30"></div>
              <img 
                src="https://images.unsplash.com/photo-1573164713714-d95e436ab8d6?q=80&w=2069&auto=format&fit=crop" 
                className="relative rounded-[4rem] shadow-2xl border-8 border-white transform rotate-3 hover:rotate-0 transition-transform duration-700" 
                alt="Safety Concept"
              />
              <div className="absolute -bottom-10 -left-10 bg-white p-6 rounded-[2.5rem] shadow-2xl animate-bounce">
                <div className="flex items-center gap-4">
                  <div className="w-12 h-12 bg-emerald-100 text-emerald-600 rounded-2xl flex items-center justify-center">
                    <i className="fas fa-location-dot text-xl"></i>
                  </div>
                  <div>
                    <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">Live Monitoring</p>
                    <p className="text-sm font-bold text-slate-900">Guardian Circle Active</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-24 bg-white">
        <div className="container mx-auto px-6">
          <div className="text-center mb-20" data-aos="fade-up">
            <h2 className="text-3xl lg:text-5xl font-black text-slate-900 mb-4">Powerful Features</h2>
            <p className="text-slate-500 font-medium">Built with the latest AI technology to keep you safe.</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-12">
            {[
              { title: 'Route Shield', icon: 'fa-map-location-dot', color: 'bg-indigo-50 text-indigo-600', desc: 'Predictive safety scores for every route you take.' },
              { title: 'SOS Protocol', icon: 'fa-bolt', color: 'bg-red-50 text-red-600', desc: 'One-tap emergency alert to your circle and police.' },
              { title: 'Rakshak AI', icon: 'fa-robot', color: 'bg-slate-50 text-slate-800', desc: 'Intelligent guardian assistant available 24/7.' }
            ].map((f, i) => (
              <div key={i} className="p-10 rounded-[3rem] bg-slate-50 border border-slate-100 hover:shadow-xl transition-all" data-aos="fade-up" data-aos-delay={i * 100}>
                <div className={`w-16 h-16 ${f.color} rounded-2xl flex items-center justify-center mb-8 shadow-sm`}>
                  <i className={`fas ${f.icon} text-2xl`}></i>
                </div>
                <h3 className="text-2xl font-bold text-slate-900 mb-4">{f.title}</h3>
                <p className="text-slate-500 font-medium leading-relaxed">{f.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-12 bg-slate-900 text-white">
        <div className="container mx-auto px-6 text-center">
          <div className="flex flex-col items-center gap-4">
            <div className="flex items-center gap-3">
              <i className="fas fa-shield-heart text-indigo-400 text-3xl"></i>
              <span className="text-2xl font-black tracking-tighter">Raksha Route</span>
            </div>
            <p className="text-slate-400 text-xs font-black uppercase tracking-[0.3em]">
              by Valtorion Groups
            </p>
          </div>
        </div>
      </footer>
    </div>
  );
};

export default Landing;
