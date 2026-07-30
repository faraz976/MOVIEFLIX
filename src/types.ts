export interface DownloadUrls {
  quality480p?: string;
  quality720p?: string;
  quality1080p?: string;
  quality4k?: string;
}

export interface CastMember {
  name: string;
  character?: string;
  image?: string;
}

export type ContentType = 'movie' | 'tvshow';

export interface Episode {
  id: string;
  seasonNumber: number;
  episodeNumber: number;
  title: string;
  description: string;
  runtime: string;
  bunnyVideoId?: string;
  streamUrl?: string;
  thumbnailUrl?: string;
}

export interface Movie {
  id: string;
  title: string;
  type: ContentType;
  posterUrl: string;
  bannerUrl: string;
  description: string;
  genres: string[];
  language: string;
  country: string;
  releaseYear: number;
  runtime: string;
  imdbRating: number;
  director: string;
  cast: CastMember[];
  trailerUrl?: string;
  
  // Bunny Stream Config
  bunnyLibraryId?: string; // Optional override if different from global settings
  bunnyVideoId?: string;   // Video ID in Bunny Stream
  directStreamUrl?: string; // Optional direct HLS / MP4 fallback URL

  downloadUrls?: DownloadUrls;
  
  // Flags
  isFeatured?: boolean;
  isTrending?: boolean;
  isLatest?: boolean;
  isPopular?: boolean;
  isHidden?: boolean;

  // TV Show specific
  seasonsCount?: number;
  episodes?: Episode[];

  viewsCount?: number;
  createdAt: string;
  updatedAt: string;
}

export interface WatchProgress {
  movieId: string;
  episodeId?: string;
  currentTime: number;
  duration: number;
  updatedAt: number;
}

export interface BunnyStreamSettings {
  libraryId: string;
  apiKey: string;
  pullZoneUrl: string;
  cdnHostname: string;
}

export interface FirebaseSettings {
  apiKey: string;
  authDomain: string;
  projectId: string;
  storageBucket: string;
  messagingSenderId: string;
  appId: string;
}

export interface UserProfile {
  uid: string;
  email: string | null;
  displayName: string | null;
  photoURL: string | null;
  isAdmin: boolean;
}
