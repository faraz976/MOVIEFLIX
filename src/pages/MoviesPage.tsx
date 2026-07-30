import React, { useState, useMemo } from 'react';
import { Film, Filter, SlidersHorizontal, Star } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

interface MoviesPageProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap: Record<string, number>;
}

export const MoviesPage: React.FC<MoviesPageProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap,
}) => {
  const [selectedGenre, setSelectedGenre] = useState<string>('All');
  const [selectedLanguage, setSelectedLanguage] = useState<string>('All');
  const [minRating, setMinRating] = useState<number>(0);
  const [sortBy, setSortBy] = useState<'newest' | 'oldest' | 'rating' | 'views'>('newest');

  const allGenres = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => m.genres.forEach((g) => set.add(g)));
    return ['All', ...Array.from(set)];
  }, [movies]);

  const allLanguages = useMemo(() => {
    const set = new Set<string>();
    movies.forEach((m) => {
      if (m.language) set.add(m.language);
    });
    return ['All', ...Array.from(set)];
  }, [movies]);

  const filteredMovies = useMemo(() => {
    return movies
      .filter((m) => !m.isHidden && m.type === 'movie')
      .filter((m) => selectedGenre === 'All' || m.genres.includes(selectedGenre))
      .filter((m) => selectedLanguage === 'All' || m.language === selectedLanguage)
      .filter((m) => m.imdbRating >= minRating)
      .sort((a, b) => {
        if (sortBy === 'newest') return b.releaseYear - a.releaseYear;
        if (sortBy === 'oldest') return a.releaseYear - b.releaseYear;
        if (sortBy === 'rating') return b.imdbRating - a.imdbRating;
        if (sortBy === 'views') return (b.viewsCount || 0) - (a.viewsCount || 0);
        return 0;
      });
  }, [movies, selectedGenre, selectedLanguage, minRating, sortBy]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      {/* Title */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-white/10 pb-6">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <Film className="w-8 h-8 text-red-500" />
            <span>Movies Catalog</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Explore feature films with adaptive HLS Bunny Stream player support.
          </p>
        </div>

        {/* Filter Counters */}
        <div className="text-xs text-gray-400 bg-zinc-900 border border-white/10 px-4 py-2 rounded-xl">
          Showing <span className="text-white font-bold">{filteredMovies.length}</span> movies
        </div>
      </div>

      {/* Filter Control Bar */}
      <div className="bg-zinc-900/90 border border-white/10 rounded-2xl p-4 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 backdrop-blur-md">
        {/* Genre Filter */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Genre
          </label>
          <select
            value={selectedGenre}
            onChange={(e) => setSelectedGenre(e.target.value)}
            className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            {allGenres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        </div>

        {/* Language Filter */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Language
          </label>
          <select
            value={selectedLanguage}
            onChange={(e) => setSelectedLanguage(e.target.value)}
            className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            {allLanguages.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
        </div>

        {/* Rating Filter */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Min IMDb Rating
          </label>
          <select
            value={minRating}
            onChange={(e) => setMinRating(parseFloat(e.target.value))}
            className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value={0}>All Ratings</option>
            <option value={7}>7.0+ Rated</option>
            <option value={8}>8.0+ Rated</option>
            <option value={8.5}>8.5+ Rated</option>
          </select>
        </div>

        {/* Sort By */}
        <div>
          <label className="text-[11px] font-bold text-gray-400 uppercase block mb-1">
            Sort By
          </label>
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value as any)}
            className="w-full bg-zinc-950 border border-white/15 rounded-xl px-3 py-2 text-xs text-white focus:outline-none focus:border-red-500"
          >
            <option value="newest">Release Year (Newest)</option>
            <option value="oldest">Release Year (Oldest)</option>
            <option value="rating">Highest IMDb Rating</option>
            <option value="views">Most Viewed</option>
          </select>
        </div>
      </div>

      {/* Movie Grid */}
      {filteredMovies.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-zinc-900/50 rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">No Movies Match Your Criteria</h3>
          <p className="text-xs text-gray-400">Try resetting filters or picking a different genre.</p>
          <button
            onClick={() => {
              setSelectedGenre('All');
              setSelectedLanguage('All');
              setMinRating(0);
              setSortBy('newest');
            }}
            className="bg-red-600 text-white font-bold text-xs px-4 py-2 rounded-xl"
          >
            Reset Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {filteredMovies.map((movie) => (
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
  );
};
