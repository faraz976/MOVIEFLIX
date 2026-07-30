import React, { useState } from 'react';
import { Grid, Flame, Film, Sparkles, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

interface CategoriesPageProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap: Record<string, number>;
}

export const CATEGORY_CARDS = [
  { id: 'Action', label: 'Action & Adventure', color: 'from-red-600 to-orange-600', icon: '⚡' },
  { id: 'Horror', label: 'Horror & Paranormal', color: 'from-purple-900 to-zinc-900', icon: '👻' },
  { id: 'Comedy', label: 'Comedy & Humour', color: 'from-amber-500 to-yellow-600', icon: '😂' },
  { id: 'Romance', label: 'Romance & Love', color: 'from-pink-600 to-rose-700', icon: '💖' },
  { id: 'Animation', label: 'Animation & Anime', color: 'from-blue-600 to-indigo-700', icon: '🎨' },
  { id: 'Indian', label: 'Indian & Bollywood', color: 'from-orange-600 to-amber-600', icon: '🇮🇳' },
  { id: 'Pakistani', label: 'Pakistani Cinema', color: 'from-emerald-700 to-teal-800', icon: '🇵🇰' },
  { id: 'Hollywood', label: 'Hollywood Cinema', color: 'from-cyan-600 to-blue-800', icon: '🎬' },
  { id: 'Sci-Fi', label: 'Sci-Fi & Cyberpunk', color: 'from-violet-700 to-purple-900', icon: '🚀' },
  { id: 'Drama', label: 'Drama & Thriller', color: 'from-slate-700 to-zinc-900', icon: '🎭' },
];

export const CategoriesPage: React.FC<CategoriesPageProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap,
}) => {
  const [selectedCategory, setSelectedCategory] = useState<string>('Action');

  const visibleMovies = movies.filter((m) => !m.isHidden);

  const categoryMovies = visibleMovies.filter((m) => {
    if (selectedCategory === 'Indian') return m.country === 'India' || m.genres.includes('Indian') || m.genres.includes('Bollywood');
    if (selectedCategory === 'Pakistani') return m.country === 'Pakistan' || m.genres.includes('Pakistani');
    if (selectedCategory === 'Hollywood') return m.country === 'USA' || m.genres.includes('Hollywood');
    return m.genres.includes(selectedCategory);
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-8">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
          <Grid className="w-8 h-8 text-red-500" />
          <span>Browse Categories & Genres</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Select a category tile to explore organized streaming collections.
        </p>
      </div>

      {/* Category Grid Tiles */}
      <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
        {CATEGORY_CARDS.map((cat) => {
          const isSelected = selectedCategory === cat.id;
          const count = visibleMovies.filter((m) => {
            if (cat.id === 'Indian') return m.country === 'India' || m.genres.includes('Indian') || m.genres.includes('Bollywood');
            if (cat.id === 'Pakistani') return m.country === 'Pakistan' || m.genres.includes('Pakistani');
            if (cat.id === 'Hollywood') return m.country === 'USA' || m.genres.includes('Hollywood');
            return m.genres.includes(cat.id);
          }).length;

          return (
            <button
              key={cat.id}
              onClick={() => setSelectedCategory(cat.id)}
              className={`relative overflow-hidden p-4 rounded-2xl border text-left transition-all duration-300 group flex flex-col justify-between h-28 ${
                isSelected
                  ? 'border-red-500 shadow-xl shadow-red-950/50 scale-105'
                  : 'border-white/10 hover:border-white/30 bg-zinc-900/60'
              }`}
            >
              <div className={`absolute inset-0 bg-gradient-to-br ${cat.color} opacity-30 group-hover:opacity-50 transition-opacity`} />

              <div className="relative z-10 flex items-center justify-between">
                <span className="text-2xl">{cat.icon}</span>
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-black/60 text-white border border-white/10">
                  {count} items
                </span>
              </div>

              <div className="relative z-10">
                <h3 className="text-xs font-black text-white tracking-tight group-hover:text-red-400 transition-colors">
                  {cat.label}
                </h3>
              </div>
            </button>
          );
        })}
      </div>

      {/* Selected Category Movies */}
      <div className="space-y-4 pt-4">
        <div className="flex items-center justify-between border-b border-white/10 pb-3">
          <h2 className="text-xl font-extrabold text-white">
            {CATEGORY_CARDS.find((c) => c.id === selectedCategory)?.label || selectedCategory} Movies
          </h2>
          <span className="text-xs text-gray-400">
            {categoryMovies.length} Titles Available
          </span>
        </div>

        {categoryMovies.length === 0 ? (
          <div className="py-16 text-center text-gray-400 space-y-2 bg-zinc-900/40 rounded-2xl border border-white/5">
            <Film className="w-10 h-10 text-gray-600 mx-auto" />
            <p className="text-xs">No movies currently listed in this category.</p>
          </div>
        ) : (
          <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
            {categoryMovies.map((movie) => (
              <MovieCard
                key={movie.id}
                movie={movie}
                onPlay={onPlay}
                onOpenDetails={onOpenDetails}
                onToggleFavorite={onToggleFavorite}
                isFavorite={favorites.includes(movie.id)}
                progressPercent={progressMap[movie.id]}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
