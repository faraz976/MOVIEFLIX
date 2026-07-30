import React from 'react';
import { Tv, Play, ListVideo } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

interface TVShowsPageProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap: Record<string, number>;
}

export const TVShowsPage: React.FC<TVShowsPageProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap,
}) => {
  const tvShows = movies.filter((m) => !m.isHidden && m.type === 'tvshow');

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
          <Tv className="w-8 h-8 text-purple-500" />
          <span>TV Shows & Web Series</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Binge-watch seasons, episodes, and original drama series with auto-next episode playback.
        </p>
      </div>

      {tvShows.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-zinc-900/50 rounded-3xl border border-white/5">
          <Tv className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">No TV Shows Added Yet</h3>
          <p className="text-xs text-gray-400">Add TV shows in the Admin panel with seasons & episode streams.</p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {tvShows.map((show) => (
            <MovieCard
              key={show.id}
              movie={show}
              onPlay={onPlay}
              onOpenDetails={onOpenDetails}
              onToggleFavorite={onToggleFavorite}
              isFavorite={favorites.includes(show.id)}
              progressPercent={progressMap[show.id]}
            />
          ))}
        </div>
      )}
    </div>
  );
};
