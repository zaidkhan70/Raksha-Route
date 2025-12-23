
import React, { useState } from 'react';
import { firebaseAuth } from '../services/firebase';
import { UserProfile } from '../types';

interface AuthProps {
  onLoginSuccess: (user: UserProfile) => void;
}

const Auth: React.FC<AuthProps> = ({ onLoginSuccess }) => {
  const [isLogin, setIsLogin] = useState(true);
  const [loading, setLoading] = useState(false);
  const [googleLoading, setGoogleLoading] = useState(false);
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
          emergencyPreferences: 'Standard SOS Protocol Enabled',
        };
        await firebaseAuth.signup(formData.email, formData.password, profile);
        setSuccessMsg("Registration successful! Now, please enter your details to Login.");
        setIsLogin(true); 
      }
    } catch (err: any) {
      setError(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogin = async () => {
    setGoogleLoading(true);
    setError(null);
    try {
      const profile = await firebaseAuth.loginWithGoogle();
      onLoginSuccess(profile);
    } catch (err: any) {
      setError("Google Login failed. Please try again.");
    } finally {
      setGoogleLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center p-6 bg-slate-50 relative overflow-hidden">
      {/* Background Decor */}
      <div className="absolute top-0 left-0 w-full h-full pointer-events-none overflow-hidden">
        <div className="absolute -top-24 -left-24 w-96 h-96 bg-indigo-100 rounded-full blur-3xl opacity-50"></div>
        <div className="absolute top-1/2 -right-24 w-80 h-80 bg-violet-100 rounded-full blur-3xl opacity-50"></div>
      </div>

      <div className="w-full max-w-md bg-white rounded-[3rem] shadow-2xl border border-slate-100 overflow-hidden relative z-10 animate-in fade-in zoom-in-95 duration-500">
        <div className="p-10">
          <div className="flex justify-center mb-8">
            <div className="w-16 h-16 bg-indigo-600 rounded-2xl flex items-center justify-center shadow-xl ring-4 ring-indigo-50">
              <i className="fas fa-shield-heart text-white text-3xl"></i>
            </div>
          </div>

          <h1 className="text-3xl font-black text-slate-900 text-center mb-2">
            {isLogin ? 'Welcome Back' : 'Create Account'}
          </h1>
          <p className="text-slate-500 text-sm text-center font-medium mb-10 leading-relaxed">
            {isLogin ? 'Protecting your journey with Raksha Route' : 'Join the safest circle for women & children'}
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-100 text-red-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
              <i className="fas fa-circle-exclamation text-sm"></i>
              {error}
            </div>
          )}

          {successMsg && (
            <div className="mb-6 p-4 bg-emerald-50 border border-emerald-100 text-emerald-600 rounded-2xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 animate-in slide-in-from-top-2">
              <i className="fas fa-circle-check text-sm"></i>
              {successMsg}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {!isLogin && (
              <>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold text-sm transition-all peer"
                    placeholder=" "
                  />
                  <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-600 pointer-events-none">
                    Full Name
                  </label>
                </div>
                <div className="relative group">
                  <input
                    type="text"
                    required
                    value={formData.phone}
                    onChange={(e) => setFormData({ ...formData, phone: e.target.value })}
                    className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold text-sm transition-all peer"
                    placeholder=" "
                  />
                  <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-600 pointer-events-none">
                    Phone Number
                  </label>
                </div>
              </>
            )}

            <div className="relative group">
              <input
                type="email"
                required
                value={formData.email}
                onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold text-sm transition-all peer"
                placeholder=" "
              />
              <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-600 pointer-events-none">
                Email Address
              </label>
            </div>

            <div className="relative group">
              <input
                type="password"
                required
                value={formData.password}
                onChange={(e) => setFormData({ ...formData, password: e.target.value })}
                className="w-full px-5 pt-7 pb-3 bg-slate-50 border border-slate-100 rounded-2xl focus:ring-2 focus:ring-indigo-500 outline-none text-slate-900 font-bold text-sm transition-all peer"
                placeholder=" "
              />
              <label className="absolute left-5 top-2 text-[10px] font-black text-slate-400 uppercase tracking-widest transition-all peer-placeholder-shown:top-5 peer-placeholder-shown:text-sm peer-placeholder-shown:font-bold peer-focus:top-2 peer-focus:text-[10px] peer-focus:text-indigo-600 pointer-events-none">
                Password
              </label>
            </div>

            <button
              type="submit"
              disabled={loading || googleLoading}
              className="w-full py-5 bg-slate-900 text-white rounded-2xl font-black text-xs uppercase tracking-[0.2em] shadow-2xl hover:bg-slate-800 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-3 mt-4"
            >
              {loading ? (
                <i className="fas fa-circle-notch fa-spin text-lg"></i>
              ) : (
                <>
                  <i className={`fas ${isLogin ? 'fa-right-to-bracket' : 'fa-user-plus'}`}></i>
                  {isLogin ? 'Login' : 'Register'}
                </>
              )}
            </button>
          </form>

          <div className="relative my-8">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-slate-100"></div>
            </div>
            <div className="relative flex justify-center text-[10px] uppercase tracking-[0.2em] font-black text-slate-300">
              <span className="bg-white px-4">Or sign in with</span>
            </div>
          </div>

          <button
            type="button"
            onClick={handleGoogleLogin}
            disabled={loading || googleLoading}
            className="w-full py-4.5 bg-white border border-slate-200 text-slate-700 rounded-2xl font-bold text-xs uppercase tracking-widest shadow-sm hover:bg-slate-50 transition-all active:scale-95 disabled:opacity-50 flex items-center justify-center gap-4"
          >
            {googleLoading ? (
              <i className="fas fa-circle-notch fa-spin"></i>
            ) : (
              <>
                <svg className="w-5 h-5" viewBox="0 0 48 48">
                  <path fill="#EA4335" d="M24 9.5c3.54 0 6.71 1.22 9.21 3.6l6.85-6.85C35.9 2.38 30.47 0 24 0 14.62 0 6.51 5.38 2.56 13.22l7.98 6.19C12.43 13.72 17.74 9.5 24 9.5z"/>
                  <path fill="#4285F4" d="M46.98 24.55c0-1.57-.15-3.09-.38-4.55H24v9.02h12.94c-.58 2.96-2.26 5.48-4.78 7.18l7.73 6c4.51-4.18 7.09-10.36 7.09-17.65z"/>
                  <path fill="#FBBC05" d="M10.53 28.59c-.48-1.45-.76-2.99-.76-4.59s.27-3.14.76-4.59l-7.98-6.19C.92 16.46 0 20.12 0 24s.92 7.54 2.56 10.78l7.97-6.19z"/>
                  <path fill="#34A853" d="M24 48c6.48 0 11.93-2.13 15.89-5.81l-7.73-6c-2.15 1.45-4.92 2.3-8.16 2.3-6.26 0-11.57-4.22-13.47-9.91l-7.98 6.19C6.51 42.62 14.62 48 24 48z"/>
                </svg>
                Google Account
              </>
            )}
          </button>

          <div className="mt-8 text-center">
            <button
              onClick={handleToggle}
              className="text-xs font-black text-indigo-600 uppercase tracking-widest hover:text-indigo-800 transition-colors"
            >
              {isLogin ? "Don't have an account? Sign Up" : 'Already registered? Login'}
            </button>
          </div>
        </div>
        
        <div className="bg-slate-50 p-6 text-center border-t border-slate-100">
           <p className="text-[10px] text-slate-400 font-black uppercase tracking-[0.1em]">
              Secured with AI & Guardian Shield Encryption
           </p>
        </div>
      </div>
    </div>
  );
};

export default Auth;
