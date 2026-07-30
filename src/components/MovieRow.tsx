import React, { useRef } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from './MovieCard';

interface MovieRowProps {
  title: string;
  subtitle?: string;
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap?: Record<string, number>;
}

export const MovieRow: React.FC<MovieRowProps> = ({
  title,
  subtitle,
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap = {},
}) => {
  const rowRef = useRef<HTMLDivElement>(null);

  const scroll = (direction: 'left' | 'right') => {
    if (rowRef.current) {
      const { scrollLeft, clientWidth } = rowRef.current;
      const scrollAmount = clientWidth * 0.75;
      rowRef.current.scrollTo({
        left: direction === 'left' ? scrollLeft - scrollAmount : scrollLeft + scrollAmount,
        behavior: 'smooth',
      });
    }
  };

  if (movies.length === 0) return null;

  return (
    <section className="space-y-3 py-4">
      {/* Row Header */}
      <div className="flex items-end justify-between px-4 sm:px-6 lg:px-8">
        <div>
          <h2 className="text-xl sm:text-2xl font-extrabold text-white tracking-tight flex items-center gap-2">
            <span className="w-1.5 h-6 bg-[#E50914] rounded-full" />
            {title}
          </h2>
          {subtitle && <p className="text-xs text-gray-400 mt-0.5">{subtitle}</p>}
        </div>

        {/* Scroll Arrows */}
        <div className="hidden sm:flex items-center space-x-1">
          <button
            onClick={() => scroll('left')}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Scroll Left"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => scroll('right')}
            className="p-2 rounded-full bg-zinc-900 hover:bg-zinc-800 text-gray-300 hover:text-white border border-white/10 transition-colors"
            title="Scroll Right"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Row Horizontal Scroll Track */}
      <div
        ref={rowRef}
        className="flex space-x-4 overflow-x-auto scrollbar-none px-4 sm:px-6 lg:px-8 py-2 scroll-smooth"
      >
        {movies.map((movie) => (
          <div key={movie.id} className="flex-none w-44 sm:w-52 lg:w-60">
            <MovieCard
              movie={movie}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(movie.id)}
              progressPercent={progressMap[movie.id]}
            />
          </div>
        ))}
      </div>
    </section>
  );
};
