import React, { useState, useEffect } from 'react';
import { Play, Info, Volume2, VolumeX, Star, Download, Heart } from 'lucide-react';
import { Movie } from '../types';

interface HeroBannerProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
}

export const HeroBanner: React.FC<HeroBannerProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
}) => {
  const featuredMovies = movies.filter((m) => m.isFeatured || m.isTrending).slice(0, 5);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isMuted, setIsMuted] = useState(true);

  useEffect(() => {
    if (featuredMovies.length <= 1) return;
    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % featuredMovies.length);
    }, 8000);
    return () => clearInterval(interval);
  }, [featuredMovies.length]);

  const currentMovie = featuredMovies[currentIndex] || movies[0];

  if (!currentMovie) return null;

  const isFav = favorites.includes(currentMovie.id);

  return (
    <div className="relative w-full h-[75vh] min-h-[520px] max-h-[780px] overflow-hidden bg-[#050505] select-none">
      {/* Background Banner Backdrop with Immersive Linear Gradients */}
      <div className="absolute inset-0">
        <div
          className="absolute inset-0 bg-cover bg-center bg-no-repeat transition-all duration-1000 scale-105"
          style={{
            backgroundImage: `linear-gradient(to right, #050505 10%, transparent 60%), linear-gradient(to top, #050505 0%, transparent 40%), url('${
              currentMovie.bannerUrl || currentMovie.posterUrl
            }')`,
          }}
        />
      </div>

      {/* Content Container */}
      <div className="relative z-10 max-w-7xl mx-auto h-full px-4 sm:px-6 lg:px-8 flex flex-col justify-end pb-16 sm:pb-20">
        <div className="max-w-2xl space-y-4 animate-fadeIn">
          {/* Badges / Subtitle */}
          <div className="mb-2 flex flex-wrap items-center gap-2.5">
            <span className="bg-white/20 text-[10px] px-2 py-0.5 rounded border border-white/30 backdrop-blur-md font-bold uppercase tracking-wider text-white">
              {currentMovie.type === 'tvshow' ? 'ORIGINAL SERIES' : 'BLOCKBUSTER MOVIE'}
            </span>
            <span className="text-[#E50914] font-bold text-xs uppercase tracking-widest flex items-center gap-1">
              <Star className="w-3.5 h-3.5 fill-[#E50914]" />
              {currentMovie.imdbRating} IMDb • {currentMovie.releaseYear}
            </span>
            <span className="text-gray-400 text-xs font-mono">
              {currentMovie.runtime}
            </span>
          </div>

          {/* Title */}
          <h1 className="text-4xl sm:text-6xl lg:text-7xl font-extrabold text-white tracking-tighter uppercase leading-none drop-shadow-2xl">
            {currentMovie.title}
          </h1>

          {/* Genres */}
          <div className="flex flex-wrap gap-2 pt-1">
            {currentMovie.genres.map((g) => (
              <span
                key={g}
                className="text-xs text-[#E50914] bg-red-950/40 border border-red-900/40 px-2.5 py-0.5 rounded-full font-semibold"
              >
                {g}
              </span>
            ))}
          </div>

          {/* Description */}
          <p className="max-w-xl text-base sm:text-lg text-gray-300 mb-6 line-clamp-3 italic leading-relaxed">
            {currentMovie.description}
          </p>

          {/* Action Buttons */}
          <div className="flex flex-wrap items-center gap-3 pt-2">
            <button
              onClick={() => onPlay(currentMovie)}
              className="flex items-center gap-2.5 bg-white text-black px-7 py-3 rounded-lg font-bold hover:bg-gray-200 transition-colors shadow-xl text-sm"
              id="hero-watch-now-btn"
            >
              <Play className="w-5 h-5 fill-black" />
              <span>Play Now</span>
            </button>

            <button
              onClick={() => onOpenDetails(currentMovie)}
              className="flex items-center gap-2.5 bg-white/20 backdrop-blur-md border border-white/20 text-white px-7 py-3 rounded-lg font-bold hover:bg-white/30 transition-colors text-sm"
              id="hero-more-info-btn"
            >
              <Info className="w-5 h-5" />
              <span>More Info</span>
            </button>

            <button
              onClick={() => onToggleFavorite(currentMovie.id)}
              className={`p-3 rounded-lg border backdrop-blur-md transition-all ${
                isFav
                  ? 'bg-[#E50914] border-[#E50914] text-white'
                  : 'bg-white/10 border-white/20 text-gray-300 hover:text-white hover:bg-white/20'
              }`}
              title={isFav ? 'Remove from My List' : 'Add to My List'}
              id="hero-favorite-btn"
            >
              <Heart className={`w-5 h-5 ${isFav ? 'fill-white' : ''}`} />
            </button>

            {currentMovie.downloadUrls?.quality720p && (
              <a
                href={currentMovie.downloadUrls.quality720p}
                target="_blank"
                rel="noopener noreferrer"
                className="p-3 rounded-lg bg-white/10 border border-white/20 text-gray-300 hover:text-white hover:bg-white/20 backdrop-blur-md transition-all hidden sm:flex items-center"
                title="Download 720p"
              >
                <Download className="w-5 h-5" />
              </a>
            )}
          </div>
        </div>

        {/* Carousel Slide Indicators */}
        {featuredMovies.length > 1 && (
          <div className="absolute right-6 bottom-16 flex items-center space-x-2">
            {featuredMovies.map((_, idx) => (
              <button
                key={idx}
                onClick={() => setCurrentIndex(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentIndex === idx ? 'w-8 bg-red-600' : 'w-2 bg-white/30 hover:bg-white/60'
                }`}
                aria-label={`Go to slide ${idx + 1}`}
              />
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
