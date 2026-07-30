import React, { useState } from 'react';
import { X, Copy, Check, Share2, MessageSquare, Send, Facebook, Twitter } from 'lucide-react';
import { Movie } from '../types';

interface ShareModalProps {
  movie: Movie | null;
  onClose: () => void;
}

export const ShareModal: React.FC<ShareModalProps> = ({ movie, onClose }) => {
  const [copied, setCopied] = useState(false);

  if (!movie) return null;

  const shareUrl = window.location.href;

  const copyToClipboard = () => {
    navigator.clipboard.writeText(shareUrl);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const shareTitle = `Watch ${movie.title} on MovieFlix!`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-fadeIn">
      <div className="relative w-full max-w-md bg-zinc-950 border border-white/10 rounded-2xl p-6 shadow-2xl space-y-5">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <div className="flex items-center space-x-2">
            <Share2 className="w-5 h-5 text-red-500" />
            <h3 className="text-white font-bold text-base">Share Movie</h3>
          </div>
          <button onClick={onClose} className="p-1 text-gray-400 hover:text-white">
            <X className="w-5 h-5" />
          </button>
        </div>

        <div className="flex items-center space-x-3 p-3 rounded-xl bg-zinc-900 border border-white/5">
          <img
            src={movie.posterUrl}
            alt={movie.title}
            className="w-12 h-16 object-cover rounded-lg"
          />
          <div>
            <h4 className="text-sm font-bold text-white">{movie.title}</h4>
            <p className="text-xs text-gray-400">{movie.releaseYear} • {movie.genres.join(', ')}</p>
          </div>
        </div>

        {/* Copy Link Input */}
        <div className="space-y-1.5">
          <label className="text-xs font-semibold text-gray-400">Movie Link</label>
          <div className="flex items-center space-x-2">
            <input
              type="text"
              readOnly
              value={shareUrl}
              className="flex-1 bg-zinc-900 border border-white/10 rounded-xl px-3 py-2 text-xs text-gray-300 focus:outline-none"
            />
            <button
              onClick={copyToClipboard}
              className="bg-red-600 hover:bg-red-700 text-white px-3.5 py-2 rounded-xl text-xs font-bold flex items-center space-x-1.5 transition-colors"
              id="copy-share-link-btn"
            >
              {copied ? <Check className="w-4 h-4 text-emerald-300" /> : <Copy className="w-4 h-4" />}
              <span>{copied ? 'Copied' : 'Copy'}</span>
            </button>
          </div>
        </div>

        {/* Social Sharing */}
        <div className="grid grid-cols-4 gap-2 pt-2">
          <a
            href={`https://api.whatsapp.com/send?text=${encodeURIComponent(shareTitle + ' ' + shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30 transition-colors"
          >
            <MessageSquare className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">WhatsApp</span>
          </a>

          <a
            href={`https://twitter.com/intent/tweet?text=${encodeURIComponent(shareTitle)}&url=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-sky-600/20 text-sky-400 border border-sky-500/30 hover:bg-sky-600/30 transition-colors"
          >
            <Twitter className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Twitter</span>
          </a>

          <a
            href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-blue-600/20 text-blue-400 border border-blue-500/30 hover:bg-blue-600/30 transition-colors"
          >
            <Facebook className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Facebook</span>
          </a>

          <a
            href={`https://t.me/share/url?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(shareTitle)}`}
            target="_blank"
            rel="noopener noreferrer"
            className="flex flex-col items-center justify-center p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 hover:bg-indigo-600/30 transition-colors"
          >
            <Send className="w-5 h-5 mb-1" />
            <span className="text-[10px] font-bold">Telegram</span>
          </a>
        </div>
      </div>
    </div>
  );
};
