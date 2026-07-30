import React, { useState } from 'react';
import {
  X,
  Play,
  Star,
  Download,
  Share2,
  Heart,
  Globe,
  Clock,
  UserCheck,
  Film,
  Tv,
  ExternalLink
} from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieDetailsModalProps {
  movie: Movie | null;
  onClose: () => void;
  onPlay: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  isFavorite: boolean;
  onShare: (movie: Movie) => void;
  allMovies: Movie[];
}

export const MovieDetailsModal: React.FC<MovieDetailsModalProps> = ({
  movie,
  onClose,
  onPlay,
  onToggleFavorite,
  isFavorite,
  onShare,
  allMovies,
}) => {
  const [activeTab, setActiveTab] = useState<'overview' | 'downloads' | 'trailer'>('overview');

  if (!movie) return null;

  const relatedMovies = allMovies
    .filter((m) => m.id !== movie.id && m.genres.some((g) => movie.genres.includes(g)))
    .slice(0, 4);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-6 bg-black/80 backdrop-blur-md overflow-y-auto animate-fadeIn">
      <div className="relative w-full max-w-4xl bg-zinc-950 border border-white/10 rounded-3xl overflow-hidden shadow-2xl my-8">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-20 p-2.5 rounded-full bg-black/70 hover:bg-black text-gray-300 hover:text-white transition-all backdrop-blur-md border border-white/10"
          id="modal-close-btn"
        >
          <X className="w-5 h-5" />
        </button>

        {/* Hero Backdrop Banner */}
        <div className="relative h-64 sm:h-96 w-full bg-zinc-900 overflow-hidden">
          <img
            src={movie.bannerUrl || movie.posterUrl}
            alt={movie.title}
            className="w-full h-full object-cover object-center"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/60 to-transparent" />
          <div className="absolute inset-0 bg-gradient-to-r from-zinc-950 via-zinc-950/40 to-transparent" />

          {/* Floating Actions on Hero */}
          <div className="absolute bottom-6 left-6 right-6 flex flex-col sm:flex-row items-start sm:items-end justify-between gap-4 z-10">
            <div className="space-y-2 max-w-xl">
              <div className="flex flex-wrap items-center gap-2">
                <span className="bg-red-600 text-white text-[10px] font-black px-2.5 py-0.5 rounded uppercase tracking-wider">
                  {movie.type === 'tvshow' ? 'TV SERIES' : 'FEATURE FILM'}
                </span>
                <span className="bg-amber-500/20 text-amber-400 border border-amber-500/30 text-xs font-bold px-2 py-0.5 rounded flex items-center gap-1">
                  <Star className="w-3.5 h-3.5 fill-amber-400" />
                  {movie.imdbRating} IMDb
                </span>
                <span className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded font-mono">
                  {movie.releaseYear}
                </span>
                <span className="text-xs text-gray-300 bg-white/10 px-2 py-0.5 rounded font-mono">
                  {movie.runtime}
                </span>
              </div>
              <h1 className="text-2xl sm:text-4xl font-black text-white tracking-tight">
                {movie.title}
              </h1>
            </div>

            <div className="flex items-center space-x-2">
              <button
                onClick={() => {
                  onClose();
                  onPlay(movie);
                }}
                className="flex items-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-6 py-3 rounded-xl shadow-lg shadow-red-600/40 hover:scale-105 transition-all"
                id="modal-watch-now-btn"
              >
                <Play className="w-5 h-5 fill-white" />
                <span>Watch Now</span>
              </button>

              <button
                onClick={() => onToggleFavorite(movie.id)}
                className={`p-3 rounded-xl border transition-all ${
                  isFavorite
                    ? 'bg-red-600/30 border-red-500 text-red-500'
                    : 'bg-white/10 border-white/20 text-gray-300 hover:text-white'
                }`}
                title="Favorite"
              >
                <Heart className={`w-5 h-5 ${isFavorite ? 'fill-red-500' : ''}`} />
              </button>

              <button
                onClick={() => onShare(movie)}
                className="p-3 rounded-xl bg-white/10 border border-white/20 text-gray-300 hover:text-white transition-all"
                title="Share"
              >
                <Share2 className="w-5 h-5" />
              </button>
            </div>
          </div>
        </div>

        {/* Modal Navigation Tabs */}
        <div className="flex border-b border-white/10 px-6 pt-2 bg-zinc-950">
          <button
            onClick={() => setActiveTab('overview')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
              activeTab === 'overview'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            Overview & Cast
          </button>
          <button
            onClick={() => setActiveTab('downloads')}
            className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors flex items-center space-x-1.5 ${
              activeTab === 'downloads'
                ? 'border-red-600 text-red-500'
                : 'border-transparent text-gray-400 hover:text-white'
            }`}
          >
            <Download className="w-4 h-4" />
            <span>Download Links</span>
          </button>
          {movie.trailerUrl && (
            <button
              onClick={() => setActiveTab('trailer')}
              className={`py-3 px-4 text-xs sm:text-sm font-bold border-b-2 transition-colors ${
                activeTab === 'trailer'
                  ? 'border-red-600 text-red-500'
                  : 'border-transparent text-gray-400 hover:text-white'
              }`}
            >
              Official Trailer
            </button>
          )}
        </div>

        {/* Modal Body */}
        <div className="p-6 space-y-6">
          {activeTab === 'overview' && (
            <div className="space-y-6">
              {/* Plot Summary */}
              <div>
                <h3 className="text-white text-sm font-bold uppercase tracking-wider mb-2 text-red-400">
                  Synopsis
                </h3>
                <p className="text-gray-300 text-sm leading-relaxed">{movie.description}</p>
              </div>

              {/* Metadata Specs Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 p-4 rounded-2xl bg-zinc-900/60 border border-white/5 text-xs">
                <div>
                  <span className="text-gray-400 block font-medium">Country</span>
                  <span className="text-white font-bold">{movie.country}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Language</span>
                  <span className="text-white font-bold">{movie.language}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Director</span>
                  <span className="text-white font-bold">{movie.director}</span>
                </div>
                <div>
                  <span className="text-gray-400 block font-medium">Bunny Stream ID</span>
                  <span className="text-amber-400 font-mono font-bold truncate block">
                    {movie.bunnyVideoId || 'Embedded'}
                  </span>
                </div>
              </div>

              {/* Genres Chips */}
              <div>
                <h4 className="text-xs text-gray-400 font-bold uppercase mb-2">Genres</h4>
                <div className="flex flex-wrap gap-2">
                  {movie.genres.map((g) => (
                    <span
                      key={g}
                      className="text-xs text-white bg-zinc-800 border border-white/10 px-3 py-1 rounded-full font-medium"
                    >
                      {g}
                    </span>
                  ))}
                </div>
              </div>

              {/* Cast List */}
              {movie.cast && movie.cast.length > 0 && (
                <div>
                  <h4 className="text-xs text-gray-400 font-bold uppercase mb-3">Key Cast</h4>
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-3">
                    {movie.cast.map((c, idx) => (
                      <div
                        key={idx}
                        className="flex items-center space-x-3 p-2.5 rounded-xl bg-zinc-900/40 border border-white/5"
                      >
                        <div className="w-8 h-8 rounded-full bg-red-600/30 text-red-400 border border-red-500/30 flex items-center justify-center font-bold text-xs">
                          {c.name.charAt(0)}
                        </div>
                        <div>
                          <p className="text-xs font-bold text-white leading-tight">{c.name}</p>
                          {c.character && (
                            <p className="text-[10px] text-gray-400">{c.character}</p>
                          )}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Related Movies Grid */}
              {relatedMovies.length > 0 && (
                <div className="pt-4 border-t border-white/10">
                  <h3 className="text-white font-bold text-sm mb-3">You Might Also Like</h3>
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                    {relatedMovies.map((rel) => (
                      <div
                        key={rel.id}
                        onClick={() => {
                          onClose();
                          onPlay(rel);
                        }}
                        className="group cursor-pointer space-y-1.5"
                      >
                        <div className="aspect-[2/3] rounded-xl overflow-hidden bg-zinc-900 border border-white/10 group-hover:border-red-500">
                          <img
                            src={rel.posterUrl}
                            alt={rel.title}
                            className="w-full h-full object-cover group-hover:scale-105 transition-transform"
                          />
                        </div>
                        <p className="text-xs font-bold text-white line-clamp-1 group-hover:text-red-400">
                          {rel.title}
                        </p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {/* Downloads Tab */}
          {activeTab === 'downloads' && (
            <div className="space-y-4">
              <p className="text-xs text-gray-400">
                Direct high-speed downloads hosted via CDN. Click any resolution to begin download in a new tab:
              </p>

              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                {movie.downloadUrls?.quality480p && (
                  <a
                    href={movie.downloadUrls.quality480p}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white flex flex-col justify-between space-y-3 group transition-all"
                  >
                    <div>
                      <span className="text-xs text-gray-400 font-bold block">Standard Quality</span>
                      <span className="text-lg font-black text-white">480p SD</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-red-400 font-bold group-hover:text-red-300">
                      <span>Download File</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                )}

                {movie.downloadUrls?.quality720p && (
                  <a
                    href={movie.downloadUrls.quality720p}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-red-500/40 text-white flex flex-col justify-between space-y-3 group transition-all shadow-lg shadow-red-950/20"
                  >
                    <div>
                      <span className="text-xs text-red-400 font-bold block">Recommended</span>
                      <span className="text-lg font-black text-white">720p HD</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-red-400 font-bold group-hover:text-red-300">
                      <span>Download File</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                )}

                {movie.downloadUrls?.quality1080p && (
                  <a
                    href={movie.downloadUrls.quality1080p}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="p-4 rounded-2xl bg-zinc-900 hover:bg-zinc-800 border border-white/10 text-white flex flex-col justify-between space-y-3 group transition-all"
                  >
                    <div>
                      <span className="text-xs text-gray-400 font-bold block">Ultra Clarity</span>
                      <span className="text-lg font-black text-white">1080p Full HD</span>
                    </div>
                    <div className="flex items-center space-x-1.5 text-xs text-red-400 font-bold group-hover:text-red-300">
                      <span>Download File</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </div>
                  </a>
                )}
              </div>
            </div>
          )}

          {/* Trailer Tab */}
          {activeTab === 'trailer' && movie.trailerUrl && (
            <div className="aspect-video w-full rounded-2xl overflow-hidden bg-black border border-white/10">
              <iframe
                src={movie.trailerUrl}
                title={`${movie.title} Trailer`}
                className="w-full h-full border-0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
