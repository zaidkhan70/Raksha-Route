
import React, { useState } from 'react';
import { firebaseAuth } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [successMsg, setSuccessMsg] = useState<string | null>(null);

  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: '',
    phone: '',
    address: '',
  });

  const handleToggle = () => {
    setIsLogin(!isLogin);
    setError(null);
    setSuccessMsg(null);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    setSuccessMsg(null);

    try {
      if (isLogin) {
        const profile = await firebaseAuth.login(formData.email, formData.password);
        onLoginSuccess(profile);
      } else {
        const profile: UserProfile = {
          name: formData.name,
          phone: formData.phone,
          address: formData.address,
          emergencyPreferences: 'SOS Alerts Enabled',
        };
        await firebaseAuth.signup(formData.email, formData.password, profile);
        setSuccessMsg("Account created successfully! You can now login.");
        setIsLogin(true); 
      }
    } catch (err: any) {
      setError(err.message || "Login failed. Please check your credentials.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[2.5rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10 pb-6">
          <div className="flex justify-center mb-8 relative">
            <div className="w-16 h-16 bg-slate-900 rounded-2xl flex items-center justify-center shadow-xl">
              <i className="fas fa-user-shield text-white text-3xl"></i>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 text-center mb-2">
            {isLogin ? 'User Login' : 'Create Account'}
          </h1>
          <p className="text-slate-500 text-xs text-center font-bold mb-10 leading-relaxed px-4 opacity-70">
            {isLogin ? 'Enter your details to access your account.' : 'Register to start using safety features.'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <i className="fas fa-circle-exclamation text-sm"></i>
              <span className="flex-1">{error}</span>
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3">
              <i className="fas fa-circle-check text-sm"></i>
              <span className="flex-1">{successMsg}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <div className="relative group">
                <input
                  type="text"
                  required
                  value={formData.name}
                  onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                  className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-900 font-bold text-sm"
                  placeholder=" "
                />
                <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                  Full Name
                </label>
              </div>
            )}

            <div className="relative group">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-900 font-bold text-sm"
                placeholder=" "
              />
              <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl outline-none text-slate-900 font-bold text-sm"
                placeholder=" "
              />
              <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50"
            >
              {loading ? <i className="fas fa-circle-notch fa-spin"></i> : (
                <>{isLogin ? 'Login' : 'Create Account'}</>
              )}
            </button>
          </form>

          <div className="mt-8 text-center">
            <button
              onClick={handleToggle}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:underline"
            >
              {isLogin ? "Need an account? Sign Up" : 'Already registered? Login'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Auth;
