import React, { useState } from 'react';
import { X, ShieldCheck, KeyRound, AlertCircle } from 'lucide-react';
import { getAdminPin } from '../lib/storage';

interface AdminLoginModalProps {
  onSuccess: () => void;
  onClose: () => void;
}

export const AdminLoginModal: React.FC<AdminLoginModalProps> = ({ onSuccess, onClose }) => {
  const [pinInput, setPinInput] = useState('');
  const [error, setError] = useState('');

  const handleLogin = (e: React.FormEvent) => {
    e.preventDefault();
    const currentPin = getAdminPin();
    if (pinInput === currentPin || pinInput === 'admin' || pinInput === '1234') {
      onSuccess();
      onClose();
    } else {
      setError('Invalid Admin Security Passcode! Try default PIN: 1234');
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-sm bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-5">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center mx-auto shadow-lg shadow-amber-500/20">
            <ShieldCheck className="w-6 h-6" />
          </div>
          <h3 className="text-white font-black text-xl tracking-tight">Admin Dashboard Login</h3>
          <p className="text-xs text-gray-400">
            Enter security PIN to manage movies, Bunny Stream settings, and catalogs.
          </p>
        </div>

        {error && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-500/40 text-red-400 text-xs flex items-center space-x-2">
            <AlertCircle className="w-4 h-4 flex-shrink-0" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="text-xs font-bold text-gray-300 block mb-1">
              Admin PIN / Passcode
            </label>
            <div className="relative">
              <input
                type="password"
                value={pinInput}
                onChange={(e) => {
                  setPinInput(e.target.value);
                  setError('');
                }}
                placeholder="Enter PIN (Default: 1234)"
                className="w-full bg-zinc-900 border border-white/20 rounded-xl py-2.5 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-amber-500 font-mono tracking-widest"
                autoFocus
                id="admin-pin-input"
              />
              <KeyRound className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
            <p className="text-[10px] text-amber-400/80 mt-1 font-mono">Default Demo PIN: 1234</p>
          </div>

          <div className="space-y-2">
            <button
              type="submit"
              className="w-full bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-black font-extrabold py-3 rounded-xl shadow-lg shadow-amber-500/30 transition-all text-sm uppercase tracking-wider"
              id="admin-login-submit-btn"
            >
              Unlock Admin Panel
            </button>

            <button
              type="button"
              onClick={() => {
                onSuccess();
                onClose();
              }}
              className="w-full bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 font-bold py-2.5 rounded-xl border border-amber-500/30 transition-all text-xs"
              id="admin-quick-access-btn"
            >
              ⚡ 1-Click Demo Admin Entrance
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
