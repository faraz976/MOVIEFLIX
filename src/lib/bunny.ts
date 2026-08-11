import { BunnyStreamSettings } from '../types';

export const DEFAULT_BUNNY_SETTINGS: BunnyStreamSettings = {
  libraryId: '123456', // Default Bunny Stream Library ID placeholder
  apiKey: '',
  pullZoneUrl: 'video.mediadelivery.net',
  cdnHostname: 'vz-123456.b-cdn.net',
};

/**
 * Get Bunny Stream Embed iframe URL for a video ID
 */
export interface ResolvedStream {
  type: 'embed' | 'hls' | 'mp4';
  url: string;
  sourceName: string;
  isFallback?: boolean;
}

/**
 * Extract YouTube video ID if given a YouTube watch or short link
 */
export function parseYouTubeVideoId(url: string): string | null {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|\&v=)([^#\&\?]*).*/;
  const match = url.match(regExp);
  return match && match[2].length === 11 ? match[2] : null;
}

/**
 * Extract Google Drive video ID if given a Google Drive link
 */
export function parseGoogleDriveVideoId(url: string): string | null {
  if (!url) return null;
  const match = url.match(/drive\.google\.com\/(?:file\/d\/|open\?id=)([a-zA-Z0-9_-]+)/);
  return match ? match[1] : null;
}

/**
 * Get Bunny Stream Embed iframe URL for a video ID
 */
export function getBunnyEmbedUrl(
  videoId: string,
  libraryId?: string,
  settings: BunnyStreamSettings = DEFAULT_BUNNY_SETTINGS,
  options: { autoplay?: boolean; muted?: boolean; loop?: boolean } = {}
): string {
  if (!videoId) return '';

  const libId = libraryId || settings.libraryId || '123456';
  const autoplay = options.autoplay ? 'true' : 'false';
  const muted = options.muted ? 'true' : 'false';
  const loop = options.loop ? 'true' : 'false';

  return `https://iframe.mediadelivery.net/embed/${libId}/${videoId}?autoplay=${autoplay}&loop=${loop}&muted=${muted}&preload=true&responsive=true`;
}

/**
 * Get Bunny Stream direct HLS playlist URL if HLS streaming directly
 */
export function getBunnyHlsUrl(
  videoId: string,
  libraryId?: string,
  settings: BunnyStreamSettings = DEFAULT_BUNNY_SETTINGS
): string {
  if (!videoId) return '';
  const cdnHost = settings.cdnHostname || 'vz-123456.b-cdn.net';
  return `https://${cdnHost}/${videoId}/playlist.m3u8`;
}

/**
 * Sanitize or generate direct video source URL
 */
export function resolveVideoStreamUrl(
  videoId?: string,
  directUrl?: string,
  libraryId?: string,
  settings: BunnyStreamSettings = DEFAULT_BUNNY_SETTINGS,
  useFallbackStream = false
): ResolvedStream {
  if (useFallbackStream) {
    return {
      type: 'mp4',
      url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      sourceName: 'Backup Demo Stream (MP4)',
      isFallback: true,
    };
  }

  // 1. Prioritize Direct Stream URL if provided
  if (directUrl && directUrl.trim() !== '') {
    const cleanUrl = directUrl.trim();

    // Check YouTube link
    const ytId = parseYouTubeVideoId(cleanUrl);
    if (ytId) {
      return {
        type: 'embed',
        url: `https://www.youtube-nocookie.com/embed/${ytId}?autoplay=1&rel=0`,
        sourceName: 'YouTube Player',
      };
    }

    // Check Google Drive link
    const gDriveId = parseGoogleDriveVideoId(cleanUrl);
    if (gDriveId) {
      return {
        type: 'embed',
        url: `https://drive.google.com/file/d/${gDriveId}/preview`,
        sourceName: 'Google Drive Player',
      };
    }

    // Check existing embed iframe links
    if (cleanUrl.includes('/embed/') || cleanUrl.includes('/play/')) {
      return {
        type: 'embed',
        url: cleanUrl,
        sourceName: 'Embedded Video Player',
      };
    }

    // Check HLS playlist
    if (cleanUrl.includes('.m3u8')) {
      return {
        type: 'hls',
        url: cleanUrl,
        sourceName: 'HLS Live Stream',
      };
    }

    // Direct MP4 / WebM / CDN URL
    return {
      type: 'mp4',
      url: cleanUrl,
      sourceName: 'Direct Video Stream',
    };
  }

  // 2. Bunny Stream Video ID (if directUrl was empty or not set)
  if (videoId && videoId.trim() !== '') {
    const cleanId = videoId.trim();
    // If it's a dummy placeholder ID like 'bunny-cyber-2099', fallback to demo video instead of breaking iframe
    if (cleanId.startsWith('bunny-') || cleanId.startsWith('demo-')) {
      return {
        type: 'mp4',
        url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/TearsOfSteel.mp4',
        sourceName: 'Demo Catalog Stream (MP4)',
        isFallback: true,
      };
    }

    const libId = libraryId || settings.libraryId || '123456';
    return {
      type: 'embed',
      url: getBunnyEmbedUrl(cleanId, libId, settings, { autoplay: true }),
      sourceName: `Bunny Stream (Lib ${libId})`,
    };
  }

  // 3. Fallback reliable sample video stream
  return {
    type: 'mp4',
    url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
    sourceName: 'Default Backup Stream',
    isFallback: true,
  };
}
