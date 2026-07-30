import React from 'react';
import { Heart, Film } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

interface FavoritesPageProps {
  movies: Movie[];
  favorites: string[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  progressMap: Record<string, number>;
}

export const FavoritesPage: React.FC<FavoritesPageProps> = ({
  movies,
  favorites,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  progressMap,
}) => {
  const favMovies = movies.filter((m) => favorites.includes(m.id));

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-white/10 pb-6 flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <Heart className="w-8 h-8 text-red-500 fill-red-500" />
            <span>My Bookmarked List</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Your saved movies and series ready for quick streaming access.
          </p>
        </div>
        <span className="text-xs text-gray-400 bg-zinc-900 px-3 py-1.5 rounded-xl border border-white/10 font-bold">
          {favMovies.length} Saved
        </span>
      </div>

      {favMovies.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-white/5">
          <Heart className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">Your List is Empty</h3>
          <p className="text-xs text-gray-400">
            Click the heart icon on any movie poster to save it to your bookmarks.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {favMovies.map((movie) => (
            <MovieCard
              key={movie.id}
              movie={movie}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onToggleFavorite={onToggleFavorite}
              isFavorite={true}
              progressPercent={progressMap[movie.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
