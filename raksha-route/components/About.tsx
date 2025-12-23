
import React from 'react';

const About: React.FC = () => {
  return (
    <div className="max-w-4xl mx-auto space-y-12 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="text-center">
        <div className="w-24 h-24 gradient-bg rounded-3xl mx-auto flex items-center justify-center shadow-2xl mb-6">
           <i className="fas fa-shield-heart text-white text-5xl"></i>
        </div>
        <h1 className="text-4xl font-black text-gray-900 mb-4 tracking-tight">Raksha Route</h1>
        <p className="text-xl text-gray-500 font-medium">Protecting what matters most, proactively.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-indigo-50 text-indigo-600 rounded-xl flex items-center justify-center mb-6">
            <i className="fas fa-eye text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">Our Vision</h3>
          <p className="text-gray-600 font-medium leading-relaxed">
            To create a world where every woman and child can travel freely without fear, 
            empowered by technology that watches over them like a guardian.
          </p>
        </div>
        <div className="bg-white p-8 rounded-[2rem] border border-slate-100 shadow-sm">
          <div className="w-12 h-12 bg-violet-50 text-violet-600 rounded-xl flex items-center justify-center mb-6">
            <i className="fas fa-rocket text-xl"></i>
          </div>
          <h3 className="text-2xl font-bold text-gray-900 mb-4">The Mission</h3>
          <p className="text-gray-600 font-medium leading-relaxed">
            By leveraging AI, real-time data, and community intelligence, 
            we provide the safest possible navigation paths and instant emergency support.
          </p>
        </div>
      </div>

      <section className="bg-indigo-900 text-white p-10 rounded-[2.5rem] relative overflow-hidden">
        <div className="relative z-10">
          <h3 className="text-3xl font-black mb-6">Core Values</h3>
          <ul className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <i className="fas fa-check text-xs"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg">Trust & Privacy</h4>
                <p className="text-white/70 text-sm">Your data is yours. Encrypted and safe.</p>
              </div>
            </li>
            <li className="flex items-start gap-4">
              <div className="w-8 h-8 rounded-full bg-white/20 flex items-center justify-center flex-shrink-0 mt-1">
                <i className="fas fa-check text-xs"></i>
              </div>
              <div>
                <h4 className="font-bold text-lg">Actionable AI</h4>
                <p className="text-white/70 text-sm">Not just talk, but real safety scores and routes.</p>
              </div>
            </li>
          </ul>
        </div>
        <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-600/30 rounded-full -translate-y-1/2 translate-x-1/2 blur-3xl"></div>
      </section>

      <div className="text-center text-gray-400 font-bold text-xs uppercase tracking-[0.3em]">
        © 2024 Raksha Route • Made with Care in India
      </div>
    </div>
  );
};

export default About;
