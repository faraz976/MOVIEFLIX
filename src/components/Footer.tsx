import React from 'react';
import { PlayCircle, ShieldCheck, Zap, Globe, Heart } from 'lucide-react';

interface FooterProps {
  setActiveTab: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ setActiveTab }) => {
  return (
    <footer className="bg-[#050505] border-t border-white/5 text-gray-400 pt-12 pb-24 lg:pb-8 mt-16 select-none">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-10">
          {/* Column 1: Brand & Tagline */}
          <div className="space-y-4 md:col-span-1">
            <div className="flex items-center space-x-2">
              <div className="w-8 h-8 rounded-lg bg-gradient-to-tr from-[#E50914] to-red-500 flex items-center justify-center shadow-lg shadow-red-900/40">
                <PlayCircle className="w-5 h-5 text-white fill-white/20" />
              </div>
              <span className="text-xl font-black tracking-tighter text-[#E50914] uppercase font-sans">
                MOVIE<span className="text-white">FLIX</span>
              </span>
            </div>
            <p className="text-xs text-gray-400 leading-relaxed">
              Next-generation immersive streaming experience powered by Bunny Stream CDN, adaptive HLS playback, and high-definition video encoding.
            </p>
            <div className="flex items-center space-x-2 text-[11px] text-[#E50914] font-bold bg-red-950/30 border border-red-900/40 px-3 py-1.5 rounded-lg w-fit">
              <Zap className="w-3.5 h-3.5 fill-[#E50914]" />
              <span>Bunny Stream Edge CDN</span>
            </div>
          </div>

          {/* Column 2: Quick Links */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-[#E50914] pl-2">
              Navigation
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('home')} className="hover:text-white transition-colors">
                  Home Spotlight
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('movies')} className="hover:text-white transition-colors">
                  All Movies
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('tvshows')} className="hover:text-white transition-colors">
                  TV & Web Series
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Categories & Genres
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('downloads')} className="hover:text-white transition-colors">
                  Offline Downloads
                </button>
              </li>
            </ul>
          </div>

          {/* Column 3: Categories */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-[#E50914] pl-2">
              Top Categories
            </h4>
            <ul className="space-y-2 text-xs">
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Hollywood Blockbusters
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Bollywood & Indian
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Pakistani Cinema
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Action & Sci-Fi
                </button>
              </li>
              <li>
                <button onClick={() => setActiveTab('categories')} className="hover:text-white transition-colors">
                  Horror & Thrillers
                </button>
              </li>
            </ul>
          </div>

          {/* Column 4: Platform Features & Tech Stack */}
          <div>
            <h4 className="text-white text-xs font-bold uppercase tracking-widest mb-4 border-l-2 border-[#E50914] pl-2">
              Tech Specs
            </h4>
            <div className="space-y-2 text-xs">
              <div className="flex items-center space-x-2">
                <ShieldCheck className="w-4 h-4 text-emerald-400" />
                <span>Adaptive HLS Streaming</span>
              </div>
              <div className="flex items-center space-x-2">
                <Globe className="w-4 h-4 text-blue-400" />
                <span>Global Bunny Stream CDN</span>
              </div>
              <div className="flex items-center space-x-2">
                <Heart className="w-4 h-4 text-[#E50914]" />
                <span>Responsive & PWA Ready</span>
              </div>
            </div>
          </div>
        </div>

        {/* Bottom Bar matching design HTML */}
        <div className="pt-6 border-t border-white/5 flex flex-col sm:flex-row items-center justify-between text-[10px] tracking-widest uppercase text-gray-500">
          <div className="flex flex-wrap gap-4 sm:gap-8">
            <span>Copyright © {new Date().getFullYear()} MovieFlix Inc.</span>
            <span className="hover:text-white cursor-pointer transition-colors">Privacy Policy</span>
            <span className="hover:text-white cursor-pointer transition-colors">Terms of Service</span>
          </div>
          <div className="mt-4 sm:mt-0 flex gap-4">
            <span className="text-[#E50914] font-bold">4K Ultra HD Streaming Enabled</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
