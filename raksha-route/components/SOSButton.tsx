
import React, { useState } from 'react';

interface SOSButtonProps {
  isActive: boolean;
  onActivate: () => void;
  onCancel: () => void;
}

const SOSButton: React.FC<SOSButtonProps> = ({ isActive, onActivate, onCancel }) => {
  const [showConfirm, setShowConfirm] = useState(false);

  const handleTrigger = () => {
    if (isActive) {
      onCancel();
    } else {
      setShowConfirm(true);
    }
  };

  const confirmSOS = () => {
    setShowConfirm(false);
    onActivate();
  };

  return (
    <>
      <div className="fixed bottom-10 right-10 z-[70]">
        <button
          onClick={handleTrigger}
          className={`w-20 h-20 rounded-[2rem] flex flex-col items-center justify-center shadow-[0_24px_48px_-12px_rgba(244,63,94,0.4)] transition-all transform active:scale-90 border-[6px] ${
            isActive 
              ? 'bg-white text-rose-600 border-rose-600' 
              : 'bg-rose-600 text-white border-rose-500/50 hover:bg-rose-700 animate-pulse'
          }`}
        >
          {isActive ? (
            <i className="fas fa-xmark text-2xl"></i>
          ) : (
            <>
              <i className="fas fa-bolt-lightning text-2xl"></i>
              <span className="text-[10px] font-black mt-1 uppercase tracking-tighter">SOS</span>
            </>
          )}
        </button>
      </div>

      {showConfirm && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-6 bg-slate-900/80 backdrop-blur-xl animate-in fade-in duration-300">
          <div className="bg-white rounded-[4rem] p-12 max-w-md w-full shadow-[0_64px_128px_-12px_rgba(0,0,0,0.4)] animate-in zoom-in-95 border border-slate-100">
            <div className="w-24 h-24 bg-rose-50 rounded-[2.5rem] flex items-center justify-center mx-auto mb-8 border border-rose-100">
              <i className="fas fa-triangle-exclamation text-4xl text-rose-600 animate-pulse"></i>
            </div>
            <h3 className="text-3xl font-black text-center text-slate-900 mb-4 tracking-tight">Confirm Emergency?</h3>
            <p className="text-center text-slate-500 font-medium text-sm mb-12 leading-relaxed">
              This will broadcast your location to your entire Guardian Circle and alert emergency responders immediately.
            </p>
            <div className="flex flex-col gap-4">
              <button
                onClick={confirmSOS}
                className="w-full py-6 bg-rose-600 text-white rounded-3xl font-black text-xs uppercase tracking-[0.25em] shadow-2xl hover:bg-rose-700 active:scale-[0.98] transition-all"
              >
                Broadcast SOS Alert
              </button>
              <button
                onClick={() => setShowConfirm(false)}
                className="w-full py-5 bg-slate-100 text-slate-600 rounded-3xl font-black text-[10px] uppercase tracking-widest hover:bg-slate-200 transition-all"
              >
                I am Currently Safe
              </button>
            </div>
          </div>
        </div>
      )}
    </>
  );
};

export default SOSButton;
