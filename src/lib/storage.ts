import { Movie, WatchProgress, BunnyStreamSettings, UserProfile } from '../types';
import { INITIAL_MOVIES } from '../data/initialMovies';
import { DEFAULT_BUNNY_SETTINGS } from './bunny';

const KEYS = {
  MOVIES: 'movieflix_movies_catalog',
  FAVORITES: 'movieflix_user_favorites',
  PROGRESS: 'movieflix_watch_progress',
  HISTORY: 'movieflix_watch_history',
  BUNNY_SETTINGS: 'movieflix_bunny_settings',
  ADMIN_PIN: 'movieflix_admin_pin',
  CURRENT_USER: 'movieflix_current_user',
};

// --- Catalog Storage ---
export function getStoredMovies(): Movie[] {
  try {
    const raw = localStorage.getItem(KEYS.MOVIES);
    if (!raw) {
      localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
      return INITIAL_MOVIES;
    }
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) && parsed.length > 0 ? parsed : INITIAL_MOVIES;
  } catch {
    return INITIAL_MOVIES;
  }
}

export function saveMoviesCatalog(movies: Movie[]) {
  try {
    localStorage.setItem(KEYS.MOVIES, JSON.stringify(movies));
    if (typeof window !== 'undefined') {
      window.dispatchEvent(new CustomEvent('movieflix_catalog_updated', { detail: movies }));
    }
  } catch (err) {
    console.error('Failed to save catalog:', err);
  }
}

export function resetMoviesCatalog(): Movie[] {
  localStorage.setItem(KEYS.MOVIES, JSON.stringify(INITIAL_MOVIES));
  if (typeof window !== 'undefined') {
    window.dispatchEvent(new CustomEvent('movieflix_catalog_updated', { detail: INITIAL_MOVIES }));
  }
  return INITIAL_MOVIES;
}

// --- Favorites Storage ---
export function getStoredFavorites(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.FAVORITES);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function toggleFavoriteMovie(movieId: string): string[] {
  const current = getStoredFavorites();
  let updated: string[];
  if (current.includes(movieId)) {
    updated = current.filter((id) => id !== movieId);
  } else {
    updated = [...current, movieId];
  }
  localStorage.setItem(KEYS.FAVORITES, JSON.stringify(updated));
  return updated;
}

// --- Watch Progress Storage ---
export function getStoredProgress(): Record<string, WatchProgress> {
  try {
    const raw = localStorage.getItem(KEYS.PROGRESS);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function saveWatchProgress(progress: WatchProgress) {
  const current = getStoredProgress();
  // Only save if progress > 5 seconds and not completed (>95%)
  if (progress.duration > 0 && progress.currentTime / progress.duration > 0.95) {
    delete current[progress.movieId];
  } else {
    current[progress.movieId] = progress;
  }
  localStorage.setItem(KEYS.PROGRESS, JSON.stringify(current));
  addToWatchHistory(progress.movieId);
}

// --- Watch History Storage ---
export function getStoredHistory(): string[] {
  try {
    const raw = localStorage.getItem(KEYS.HISTORY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

export function addToWatchHistory(movieId: string): string[] {
  const history = getStoredHistory().filter((id) => id !== movieId);
  const updated = [movieId, ...history].slice(0, 50); // keep last 50
  localStorage.setItem(KEYS.HISTORY, JSON.stringify(updated));
  return updated;
}

// --- Bunny Settings Storage ---
export function getBunnySettings(): BunnyStreamSettings {
  try {
    const raw = localStorage.getItem(KEYS.BUNNY_SETTINGS);
    return raw ? JSON.parse(raw) : DEFAULT_BUNNY_SETTINGS;
  } catch {
    return DEFAULT_BUNNY_SETTINGS;
  }
}

export function saveBunnySettings(settings: BunnyStreamSettings) {
  localStorage.setItem(KEYS.BUNNY_SETTINGS, JSON.stringify(settings));
}

// --- Admin Authentication & PIN ---
export function getAdminPin(): string {
  return localStorage.getItem(KEYS.ADMIN_PIN) || '1234';
}

export function setAdminPin(pin: string) {
  localStorage.setItem(KEYS.ADMIN_PIN, pin);
}

export function getCurrentUser(): UserProfile | null {
  try {
    const raw = localStorage.getItem(KEYS.CURRENT_USER);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

export function setCurrentUser(user: UserProfile | null) {
  if (!user) {
    localStorage.removeItem(KEYS.CURRENT_USER);
  } else {
    localStorage.setItem(KEYS.CURRENT_USER, JSON.stringify(user));
  }
}
