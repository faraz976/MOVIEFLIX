import React, { useState, useMemo } from 'react';
import { Search, Sparkles, Film, X } from 'lucide-react';
import { Movie } from '../types';
import { MovieCard } from '../components/MovieCard';

interface SearchPageProps {
  movies: Movie[];
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap: Record<string, number>;
}

export const SearchPage: React.FC<SearchPageProps> = ({
  movies,
  searchQuery,
  setSearchQuery,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap,
}) => {
  const [selectedTag, setSelectedTag] = useState<string>('');

  const popularTags = ['Action', 'Horror', '2024', 'Urdu', 'Hindi', 'Hollywood', 'Denis Villeneuve', 'Shah Rukh Khan'];

  const results = useMemo(() => {
    const query = searchQuery.toLowerCase().trim();
    return movies
      .filter((m) => !m.isHidden)
      .filter((m) => {
        if (!query && !selectedTag) return true;
        const tag = selectedTag.toLowerCase();
        const matchesQuery =
          !query ||
          m.title.toLowerCase().includes(query) ||
          m.description.toLowerCase().includes(query) ||
          m.director.toLowerCase().includes(query) ||
          m.genres.some((g) => g.toLowerCase().includes(query)) ||
          m.cast.some((c) => c.name.toLowerCase().includes(query)) ||
          m.language.toLowerCase().includes(query) ||
          m.country.toLowerCase().includes(query);

        const matchesTag =
          !selectedTag ||
          m.genres.some((g) => g.toLowerCase() === tag) ||
          m.releaseYear.toString() === tag ||
          m.language.toLowerCase() === tag ||
          m.director.toLowerCase().includes(tag) ||
          m.cast.some((c) => c.name.toLowerCase().includes(tag));

        return matchesQuery && matchesTag;
      });
  }, [movies, searchQuery, selectedTag]);

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      {/* Search Input Bar */}
      <div className="relative max-w-2xl mx-auto">
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search by movie title, actor, director, genre, language..."
          className="w-full bg-zinc-900 border-2 border-red-600/50 rounded-2xl py-4 pl-12 pr-10 text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:ring-4 focus:ring-red-600/20 text-sm sm:text-base shadow-2xl transition-all"
          autoFocus
          id="main-search-input"
        />
        <Search className="w-6 h-6 text-red-500 absolute left-4 top-4" />
        {searchQuery && (
          <button
            onClick={() => setSearchQuery('')}
            className="p-1 text-gray-400 hover:text-white absolute right-4 top-4"
          >
            <X className="w-5 h-5" />
          </button>
        )}
      </div>

      {/* Suggested Filter Tags */}
      <div className="flex flex-wrap items-center justify-center gap-2 pt-1">
        <span className="text-xs text-gray-400 font-bold uppercase mr-1 flex items-center gap-1">
          <Sparkles className="w-3.5 h-3.5 text-amber-400" /> Popular Suggestions:
        </span>
        {popularTags.map((tag) => {
          const isSelected = selectedTag === tag;
          return (
            <button
              key={tag}
              onClick={() => setSelectedTag(isSelected ? '' : tag)}
              className={`text-xs px-3 py-1 rounded-full border font-semibold transition-all ${
                isSelected
                  ? 'bg-red-600 border-red-500 text-white shadow-md shadow-red-600/30'
                  : 'bg-zinc-900 border-white/10 text-gray-300 hover:text-white hover:bg-zinc-800'
              }`}
            >
              {tag}
            </button>
          );
        })}
      </div>

      {/* Search Output Header */}
      <div className="flex items-center justify-between border-b border-white/10 pb-3 pt-4">
        <h2 className="text-xl font-black text-white">
          {searchQuery || selectedTag ? `Search Results (${results.length})` : 'Explore Catalog'}
        </h2>
        {(searchQuery || selectedTag) && (
          <button
            onClick={() => {
              setSearchQuery('');
              setSelectedTag('');
            }}
            className="text-xs text-red-400 hover:underline"
          >
            Clear Search
          </button>
        )}
      </div>

      {/* Results Grid */}
      {results.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-white/5">
          <Film className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">No Results Found</h3>
          <p className="text-xs text-gray-400">
            We couldn't find any movie or TV show matching "{searchQuery || selectedTag}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4 sm:gap-6">
          {results.map((movie) => (
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
