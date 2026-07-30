import React, { useState, useEffect } from 'react';
import { AnimatePresence, motion } from 'motion/react';
import { ShieldAlert } from 'lucide-react';

import { Movie, Episode, BunnyStreamSettings, UserProfile, WatchProgress } from './types';
import {
  getStoredMovies,
  saveMoviesCatalog,
  getStoredFavorites,
  toggleFavoriteMovie,
  getStoredProgress,
  getBunnySettings,
  saveBunnySettings,
  getCurrentUser,
  setCurrentUser,
} from './lib/storage';

import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { BunnyPlayer } from './components/BunnyPlayer';
import { MovieDetailsModal } from './components/MovieDetailsModal';
import { ShareModal } from './components/ShareModal';
import { AdminLoginModal } from './components/AdminLoginModal';
import { AuthModal } from './components/AuthModal';

import { HomePage } from './pages/HomePage';
import { MoviesPage } from './pages/MoviesPage';
import { TVShowsPage } from './pages/TVShowsPage';
import { CategoriesPage } from './pages/CategoriesPage';
import { SearchPage } from './pages/SearchPage';
import { DownloadsPage } from './pages/DownloadsPage';
import { FavoritesPage } from './pages/FavoritesPage';
import { ContinueWatchingPage } from './pages/ContinueWatchingPage';
import { AdminDashboardPage } from './pages/AdminDashboardPage';

export default function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [searchQuery, setSearchQuery] = useState<string>('');

  const [movies, setMovies] = useState<Movie[]>([]);
  const [favorites, setFavorites] = useState<string[]>([]);
  const [progressDict, setProgressDict] = useState<Record<string, WatchProgress>>({});
  const [bunnySettings, setBunnySettingsState] = useState<BunnyStreamSettings>(getBunnySettings());

  const [currentUser, setCurrentUserState] = useState<UserProfile | null>(null);
  const [isAdmin, setIsAdmin] = useState<boolean>(false);

  // Active Modals & Player State
  const [playingMovie, setPlayingMovie] = useState<Movie | null>(null);
  const [playingEpisode, setPlayingEpisode] = useState<Episode | undefined>(undefined);
  const [playingTime, setPlayingTime] = useState<number>(0);

  const [detailsMovie, setDetailsMovie] = useState<Movie | null>(null);
  const [sharingMovie, setSharingMovie] = useState<Movie | null>(null);

  const [showAdminLoginModal, setShowAdminLoginModal] = useState<boolean>(false);
  const [showAuthModal, setShowAuthModal] = useState<boolean>(false);

  // Initial Data Loading
  useEffect(() => {
    setMovies(getStoredMovies());
    setFavorites(getStoredFavorites());
    setProgressDict(getStoredProgress());
    setBunnySettingsState(getBunnySettings());
    const user = getCurrentUser();
    setCurrentUserState(user);
    if (user?.isAdmin) setIsAdmin(true);
  }, []);

  // Update progress dict periodically when user streams
  useEffect(() => {
    const handleStorageChange = () => {
      setProgressDict(getStoredProgress());
    };
    window.addEventListener('storage', handleStorageChange);
    return () => window.removeEventListener('storage', handleStorageChange);
  }, []);

  const handleSaveMovies = (newCatalog: Movie[]) => {
    setMovies(newCatalog);
    saveMoviesCatalog(newCatalog);
  };

  const handleToggleFavorite = (movieId: string) => {
    const updated = toggleFavoriteMovie(movieId);
    setFavorites(updated);
  };

  const handleSaveBunnySettings = (newSettings: BunnyStreamSettings) => {
    setBunnySettingsState(newSettings);
    saveBunnySettings(newSettings);
  };

  const handlePlayMovie = (movie: Movie, episodeId?: string, startTime?: number) => {
    let targetEpisode: Episode | undefined;
    if (episodeId && movie.episodes) {
      targetEpisode = movie.episodes.find((ep) => ep.id === episodeId);
    } else if (movie.type === 'tvshow' && movie.episodes && movie.episodes.length > 0) {
      targetEpisode = movie.episodes[0];
    }

    setPlayingMovie(movie);
    setPlayingEpisode(targetEpisode);
    setPlayingTime(startTime || 0);

    // Update view counter
    const updated = movies.map((m) =>
      m.id === movie.id ? { ...m, viewsCount: (m.viewsCount || 0) + 1 } : m
    );
    setMovies(updated);
    saveMoviesCatalog(updated);
  };

  const handleClosePlayer = () => {
    setPlayingMovie(null);
    setPlayingEpisode(undefined);
    setProgressDict(getStoredProgress());
  };

  const handleLogout = () => {
    setCurrentUser(null);
    setCurrentUserState(null);
    setIsAdmin(false);
  };

  const handleAdminLoginSuccess = () => {
    setIsAdmin(true);
    setActiveTab('admin');
  };

  // Convert progressDict to progress percentage map
  const progressMap: Record<string, number> = {};
  Object.values(progressDict).forEach((p: WatchProgress) => {
    if (p.duration > 0) {
      progressMap[p.movieId] = Math.round((p.currentTime / p.duration) * 100);
    }
  });

  return (
    <div className="min-h-screen bg-[#050505] text-white font-sans antialiased selection:bg-[#E50914] selection:text-white flex flex-col justify-between">
      {/* Top Fixed Header Navbar (Hidden when inside standalone Admin Panel) */}
      {!(activeTab === 'admin' && isAdmin) && (
        <Navbar
          activeTab={activeTab}
          setActiveTab={setActiveTab}
          searchQuery={searchQuery}
          setSearchQuery={setSearchQuery}
          currentUser={currentUser}
          onOpenAuth={() => setShowAuthModal(true)}
          onLogout={handleLogout}
          onOpenAdminLogin={() => setShowAdminLoginModal(true)}
          isAdmin={isAdmin}
        />
      )}

      {/* Main Content Area */}
      <main className="flex-grow">
        <AnimatePresence mode="wait">
          <motion.div
            key={activeTab}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.25 }}
          >
            {activeTab === 'home' && (
              <HomePage
                movies={movies}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'movies' && (
              <MoviesPage
                movies={movies}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'tvshows' && (
              <TVShowsPage
                movies={movies}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'categories' && (
              <CategoriesPage
                movies={movies}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'search' && (
              <SearchPage
                movies={movies}
                searchQuery={searchQuery}
                setSearchQuery={setSearchQuery}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                favorites={favorites}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'downloads' && (
              <DownloadsPage movies={movies} onOpenDetails={(m) => setDetailsMovie(m)} />
            )}

            {activeTab === 'favorites' && (
              <FavoritesPage
                movies={movies}
                favorites={favorites}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
                onToggleFavorite={handleToggleFavorite}
                progressMap={progressMap}
              />
            )}

            {activeTab === 'continue' && (
              <ContinueWatchingPage
                movies={movies}
                progressDict={progressDict}
                onPlay={handlePlayMovie}
                onOpenDetails={(m) => setDetailsMovie(m)}
              />
            )}

            {activeTab === 'admin' && (
              isAdmin ? (
                <AdminDashboardPage
                  movies={movies}
                  onSaveMovies={handleSaveMovies}
                  bunnySettings={bunnySettings}
                  onSaveBunnySettings={handleSaveBunnySettings}
                  onLogoutAdmin={() => {
                    setIsAdmin(false);
                    setActiveTab('home');
                  }}
                />
              ) : (
                <div className="pt-32 pb-20 text-center space-y-4 max-w-md mx-auto">
                  <div className="w-16 h-16 rounded-2xl bg-amber-500/10 border border-amber-500/30 flex items-center justify-center mx-auto text-amber-400">
                    <ShieldAlert className="w-8 h-8" />
                  </div>
                  <h2 className="text-xl font-bold text-white">Admin Authentication Required</h2>
                  <p className="text-xs text-gray-400">
                    Please log in with your admin security key to access the MovieFlix Control Center.
                  </p>
                  <button
                    onClick={() => setShowAdminLoginModal(true)}
                    className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-2.5 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
                  >
                    Open Admin Login Modal
                  </button>
                </div>
              )
            )}
          </motion.div>
        </AnimatePresence>
      </main>

      {/* Footer (Hidden when inside standalone Admin Panel) */}
      {!(activeTab === 'admin' && isAdmin) && <Footer setActiveTab={setActiveTab} />}

      {/* FULLSCREEN BUNNY STREAM VIDEO PLAYER */}
      {playingMovie && (
        <BunnyPlayer
          movie={playingMovie}
          selectedEpisode={playingEpisode}
          onSelectEpisode={(ep) => setPlayingEpisode(ep)}
          bunnySettings={bunnySettings}
          onClose={handleClosePlayer}
          onShare={(m) => setSharingMovie(m)}
          initialTime={playingTime}
        />
      )}

      {/* MOVIE DETAILS MODAL */}
      {detailsMovie && (
        <MovieDetailsModal
          movie={detailsMovie}
          onClose={() => setDetailsMovie(null)}
          onPlay={handlePlayMovie}
          onToggleFavorite={handleToggleFavorite}
          isFavorite={favorites.includes(detailsMovie.id)}
          onShare={(m) => setSharingMovie(m)}
          allMovies={movies}
        />
      )}

      {/* SHARE MODAL */}
      {sharingMovie && (
        <ShareModal movie={sharingMovie} onClose={() => setSharingMovie(null)} />
      )}

      {/* ADMIN LOGIN MODAL */}
      {showAdminLoginModal && (
        <AdminLoginModal
          onSuccess={handleAdminLoginSuccess}
          onClose={() => setShowAdminLoginModal(false)}
        />
      )}

      {/* USER AUTH MODAL */}
      {showAuthModal && (
        <AuthModal
          onClose={() => setShowAuthModal(false)}
          onSuccess={(u) => {
            setCurrentUserState(u);
            if (u.isAdmin) setIsAdmin(true);
          }}
        />
      )}
    </div>
  );
}
