import React, { useState } from 'react';
import { X, User, Lock, Mail, PlayCircle, CheckCircle } from 'lucide-react';
import { UserProfile } from '../types';
import { setCurrentUser } from '../lib/storage';

interface AuthModalProps {
  onClose: () => void;
  onSuccess: (user: UserProfile) => void;
}

export const AuthModal: React.FC<AuthModalProps> = ({ onClose, onSuccess }) => {
  const [isSignUp, setIsSignUp] = useState(false);
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [displayName, setDisplayName] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    const user: UserProfile = {
      uid: `user_${Date.now()}`,
      email: email || 'user@movieflix.com',
      displayName: displayName || (email ? email.split('@')[0] : 'MovieFlix User'),
      photoURL: null,
      isAdmin: false,
    };
    setCurrentUser(user);
    onSuccess(user);
    onClose();
  };

  const handleGuestMode = () => {
    const guestUser: UserProfile = {
      uid: `guest_${Date.now()}`,
      email: 'guest@movieflix.com',
      displayName: 'Guest Streamer',
      photoURL: null,
      isAdmin: false,
    };
    setCurrentUser(guestUser);
    onSuccess(guestUser);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-md animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-3xl p-6 shadow-2xl space-y-6">
        <button onClick={onClose} className="absolute top-4 right-4 p-1 text-gray-400 hover:text-white">
          <X className="w-5 h-5" />
        </button>

        <div className="text-center space-y-2">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-tr from-red-700 to-red-500 text-white flex items-center justify-center mx-auto shadow-lg shadow-red-600/30">
            <PlayCircle className="w-7 h-7 fill-white/20" />
          </div>
          <h3 className="text-white font-black text-2xl tracking-tight">
            {isSignUp ? 'Create MovieFlix Account' : 'Welcome Back'}
          </h3>
          <p className="text-xs text-gray-400">
            Sign in to sync your favorites, continue watching across devices, and unlock HD downloads.
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-4">
          {isSignUp && (
            <div>
              <label className="text-xs font-semibold text-gray-300 block mb-1">Your Name</label>
              <div className="relative">
                <input
                  type="text"
                  required
                  value={displayName}
                  onChange={(e) => setDisplayName(e.target.value)}
                  placeholder="John Doe"
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500"
                />
                <User className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              </div>
            </div>
          )}

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Email Address</label>
            <div className="relative">
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@example.com"
                className="w-full bg-zinc-900 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <Mail className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <div>
            <label className="text-xs font-semibold text-gray-300 block mb-1">Password</label>
            <div className="relative">
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full bg-zinc-900 border border-white/15 rounded-xl py-2.5 pl-10 pr-4 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <Lock className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            </div>
          </div>

          <button
            type="submit"
            className="w-full bg-red-600 hover:bg-red-700 text-white font-extrabold py-3 rounded-xl shadow-lg shadow-red-600/40 transition-all text-sm uppercase tracking-wider"
          >
            {isSignUp ? 'Register Account' : 'Sign In Now'}
          </button>
        </form>

        <div className="relative border-t border-white/10 pt-4 text-center">
          <button
            onClick={handleGuestMode}
            className="w-full bg-white/10 hover:bg-white/15 text-white font-semibold py-2.5 rounded-xl text-xs border border-white/10 flex items-center justify-center space-x-2 transition-colors"
          >
            <CheckCircle className="w-4 h-4 text-emerald-400" />
            <span>Continue as Guest Streamer</span>
          </button>

          <p className="text-xs text-gray-400 mt-4">
            {isSignUp ? 'Already registered?' : "Don't have an account?"}{' '}
            <button
              onClick={() => setIsSignUp(!isSignUp)}
              className="text-red-400 hover:underline font-bold"
            >
              {isSignUp ? 'Sign In' : 'Sign Up'}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
};
