import React from 'react';
import { Play, Star, Heart, Download, Tv } from 'lucide-react';
import { Movie } from '../types';

interface MovieCardProps {
  movie: Movie;
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  isFavorite: boolean;
  progressPercent?: number;
}

export const MovieCard: React.FC<MovieCardProps> = ({
  movie,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  isFavorite,
  progressPercent,
}) => {
  return (
    <div className="group relative bg-[#111] rounded-xl overflow-hidden border border-white/5 hover:border-white/20 transition-all duration-300 hover:shadow-2xl hover:-translate-y-1 flex flex-col h-full select-none">
      {/* Poster Image Container */}
      <div className="relative aspect-[2/3] w-full overflow-hidden bg-[#050505]">
        <img
          src={movie.posterUrl}
          alt={movie.title}
          loading="lazy"
          className="w-full h-full object-cover object-center group-hover:scale-105 transition-transform duration-500"
        />

        {/* Top Badges */}
        <div className="absolute top-2 left-2 right-2 flex items-center justify-between z-10">
          {/* Rating Badge */}
          <div className="bg-black/60 backdrop-blur-md text-amber-400 text-[10px] font-bold px-1.5 py-0.5 rounded border border-white/10 flex items-center gap-1 shadow-sm">
            <Star className="w-3 h-3 fill-amber-400" />
            <span>{movie.imdbRating} ★</span>
          </div>

          {/* Type or Trending Badge */}
          <div className="flex items-center gap-1">
            {movie.type === 'tvshow' && (
              <span className="bg-purple-600/90 text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase flex items-center gap-0.5">
                <Tv className="w-2.5 h-2.5" /> Series
              </span>
            )}
            {movie.isTrending && (
              <span className="bg-[#E50914] text-white text-[10px] font-bold px-1.5 py-0.5 rounded uppercase">
                HOT
              </span>
            )}
          </div>
        </div>

        {/* Favorite heart button */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleFavorite(movie.id);
          }}
          className={`absolute top-2 right-2 z-20 p-1.5 rounded-full backdrop-blur-md border transition-all ${
            isFavorite
              ? 'bg-[#E50914] border-red-500 text-white'
              : 'bg-black/60 border-white/10 text-gray-300 hover:text-white hover:bg-black/90'
          }`}
          title={isFavorite ? 'Remove from Favorites' : 'Add to Favorites'}
        >
          <Heart className={`w-3.5 h-3.5 ${isFavorite ? 'fill-white' : ''}`} />
        </button>

        {/* Hover Overlay with Play Button */}
        <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex flex-col items-center justify-center p-4 space-y-2 z-10">
          <button
            onClick={() => onPlay(movie)}
            className="w-12 h-12 rounded-full bg-[#E50914] hover:bg-red-700 text-white flex items-center justify-center shadow-lg shadow-red-950/80 hover:scale-110 transition-transform"
            title="Watch Now"
          >
            <Play className="w-6 h-6 fill-white ml-0.5" />
          </button>
          <button
            onClick={() => onOpenDetails(movie)}
            className="text-[11px] text-white bg-white/20 hover:bg-white/30 px-3 py-1 rounded-full border border-white/20 font-medium backdrop-blur-sm"
          >
            More Details
          </button>
        </div>

        {/* Continue Watching Progress Bar if applicable */}
        {progressPercent !== undefined && progressPercent > 0 && (
          <div className="absolute bottom-0 left-0 right-0 h-1.5 bg-zinc-800 z-20">
            <div
              className="h-full bg-gradient-to-r from-[#E50914] to-red-500"
              style={{ width: `${Math.min(100, Math.max(0, progressPercent))}%` }}
            />
          </div>
        )}
      </div>

      {/* Card Info Section */}
      <div className="p-3 flex flex-col justify-between flex-grow">
        <div>
          <h3
            onClick={() => onOpenDetails(movie)}
            className="text-xs sm:text-sm font-bold text-white hover:text-[#E50914] transition-colors line-clamp-1 cursor-pointer"
          >
            {movie.title}
          </h3>

          <div className="flex items-center justify-between mt-1 text-[10px] text-gray-400 font-medium">
            <span>{movie.releaseYear} • {movie.genres[0] || 'Drama'}</span>
            <span className="truncate max-w-[80px] text-right">{movie.language}</span>
          </div>
        </div>

        {/* Bottom Bar: Action buttons */}
        <div className="mt-2.5 pt-2 border-t border-white/5 flex items-center justify-between gap-1.5">
          <button
            onClick={() => onPlay(movie)}
            className="flex-1 bg-[#E50914] hover:bg-red-700 text-white py-1.5 rounded font-bold text-[11px] flex items-center justify-center space-x-1 shadow-sm transition-colors"
          >
            <Play className="w-3 h-3 fill-white" />
            <span>Watch</span>
          </button>

          {movie.downloadUrls?.quality720p || movie.downloadUrls?.quality1080p ? (
            <a
              href={movie.downloadUrls.quality1080p || movie.downloadUrls.quality720p}
              target="_blank"
              rel="noopener noreferrer"
              className="p-1.5 rounded bg-white/10 hover:bg-white/20 text-gray-300 hover:text-white transition-colors border border-white/10"
              title="Download High Quality"
            >
              <Download className="w-3.5 h-3.5" />
            </a>
          ) : null}
        </div>
      </div>
    </div>
  );
};
