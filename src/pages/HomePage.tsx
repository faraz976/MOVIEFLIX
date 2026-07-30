import React from 'react';
import { Movie } from '../types';
import { HeroBanner } from '../components/HeroBanner';
import { MovieRow } from '../components/MovieRow';

interface HomePageProps {
  movies: Movie[];
  onPlay: (movie: Movie) => void;
  onOpenDetails: (movie: Movie) => void;
  onToggleFavorite: (movieId: string) => void;
  favorites: string[];
  progressMap: Record<string, number>;
}

export const HomePage: React.FC<HomePageProps> = ({
  movies,
  onPlay,
  onOpenDetails,
  onToggleFavorite,
  favorites,
  progressMap,
}) => {
  const visibleMovies = movies.filter((m) => !m.isHidden);

  const trending = visibleMovies.filter((m) => m.isTrending);
  const latest = visibleMovies.filter((m) => m.isLatest);
  const popular = visibleMovies.filter((m) => m.isPopular || m.viewsCount && m.viewsCount > 150000);
  const action = visibleMovies.filter((m) => m.genres.includes('Action'));
  const horror = visibleMovies.filter((m) => m.genres.includes('Horror'));
  const comedy = visibleMovies.filter((m) => m.genres.includes('Comedy'));
  const romance = visibleMovies.filter((m) => m.genres.includes('Romance'));
  const animation = visibleMovies.filter((m) => m.genres.includes('Animation'));
  const indian = visibleMovies.filter((m) => m.country === 'India' || m.genres.includes('Indian') || m.genres.includes('Bollywood'));
  const pakistani = visibleMovies.filter((m) => m.country === 'Pakistan' || m.genres.includes('Pakistani'));
  const hollywood = visibleMovies.filter((m) => m.country === 'USA' || m.genres.includes('Hollywood'));

  return (
    <div className="space-y-6 pb-12">
      {/* Hero Banner Slider */}
      <HeroBanner
        movies={visibleMovies}
        onPlay={onPlay}
        onOpenDetails={onOpenDetails}
        onToggleFavorite={onToggleFavorite}
        favorites={favorites}
      />

      <div className="-mt-10 relative z-20 space-y-6">
        {/* Row 1: Trending Movies */}
        <MovieRow
          title="🔥 Trending Now"
          subtitle="Top streamed movies across the globe this week"
          movies={trending}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 2: Latest Releases */}
        <MovieRow
          title="✨ Latest Releases"
          subtitle="Freshly added titles with Bunny HLS stream support"
          movies={latest}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 3: Popular Movies */}
        <MovieRow
          title="⭐ Popular & Highest Rated"
          subtitle="Critically acclaimed films with high IMDb ratings"
          movies={popular}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 4: Hollywood */}
        <MovieRow
          title="🎬 Hollywood Hits"
          subtitle="Sci-Fi blockbusters and high-octane thrillers"
          movies={hollywood}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 5: Indian / Bollywood */}
        <MovieRow
          title="🇮🇳 Indian & Bollywood Cinema"
          subtitle="Epic historical sagas and high-energy drama"
          movies={indian}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 6: Pakistani Cinema */}
        <MovieRow
          title="🇵🇰 Pakistani Cinema"
          subtitle="Soulful romances, comedy blockbusters, and mountain sagas"
          movies={pakistani}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 7: Action & Sci-Fi */}
        <MovieRow
          title="⚡ Action & Sci-Fi"
          subtitle="High-intensity combat and futuristic worlds"
          movies={action}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 8: Horror & Suspense */}
        <MovieRow
          title="👻 Horror & Suspense"
          subtitle="Creepy mysteries and supernatural entities"
          movies={horror}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 9: Comedy */}
        <MovieRow
          title="😂 Comedy & Laughs"
          subtitle="Hilarious roomate chaos and funny misadventures"
          movies={comedy}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />

        {/* Row 10: Animation */}
        <MovieRow
          title="🎨 Animated Adventures"
          subtitle="Breath-taking visuals and dragon realms"
          movies={animation}
          onPlay={onPlay}
          onOpenDetails={onOpenDetails}
          onToggleFavorite={onToggleFavorite}
          favorites={favorites}
          progressMap={progressMap}
        />
      </div>
    </div>
  );
};
