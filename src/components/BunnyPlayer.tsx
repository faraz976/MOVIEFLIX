import React, { useState, useEffect, useRef } from 'react';
import {
  Play,
  Pause,
  RotateCcw,
  RotateCw,
  Maximize,
  Minimize,
  Volume2,
  VolumeX,
  Settings,
  Tv,
  ListVideo,
  ChevronLeft,
  Share2,
  Download,
  Check,
  AlertCircle
} from 'lucide-react';
import Hls from 'hls.js';
import { Movie, Episode, BunnyStreamSettings, WatchProgress } from '../types';
import { resolveVideoStreamUrl } from '../lib/bunny';
import { saveWatchProgress } from '../lib/storage';

interface BunnyPlayerProps {
  movie: Movie;
  selectedEpisode?: Episode;
  onSelectEpisode?: (episode: Episode) => void;
  bunnySettings: BunnyStreamSettings;
  onClose: () => void;
  onShare: (movie: Movie) => void;
  initialTime?: number;
}

export const BunnyPlayer: React.FC<BunnyPlayerProps> = ({
  movie,
  selectedEpisode,
  onSelectEpisode,
  bunnySettings,
  onClose,
  onShare,
  initialTime = 0,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const playerContainerRef = useRef<HTMLDivElement>(null);

  const [useFallbackStream, setUseFallbackStream] = useState(false);
  const activeVideoId = selectedEpisode?.bunnyVideoId || movie.bunnyVideoId;
  const activeStreamUrl = selectedEpisode?.streamUrl || movie.directStreamUrl;

  const streamInfo = resolveVideoStreamUrl(
    activeVideoId,
    activeStreamUrl,
    movie.bunnyLibraryId,
    bunnySettings,
    useFallbackStream
  );

  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolume] = useState(1);
  const [currentTime, setCurrentTime] = useState(initialTime);
  const [duration, setDuration] = useState(0);
  const [isFullscreen, setIsFullscreen] = useState(false);
  const [playbackSpeed, setPlaybackSpeed] = useState(1);
  const [selectedQuality, setSelectedQuality] = useState('Auto');
  const [showSettingsMenu, setShowSettingsMenu] = useState(false);
  const [showEpisodeSelector, setShowEpisodeSelector] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [hasError, setHasError] = useState(false);
  const [showGestureOverlay, setShowGestureOverlay] = useState<'forward' | 'backward' | null>(null);

  // Initialize Video element with Hls.js if applicable
  useEffect(() => {
    setHasError(false);
    setIsLoading(true);

    if (streamInfo.type === 'embed') {
      // Bunny Stream iframe handles playback internally
      setIsLoading(false);
      return;
    }

    const videoEl = videoRef.current;
    if (!videoEl) return;

    let hls: Hls | null = null;

    if (streamInfo.type === 'hls' && Hls.isSupported()) {
      hls = new Hls({
        enableWorker: true,
        lowLatencyMode: true,
      });
      hls.loadSource(streamInfo.url);
      hls.attachMedia(videoEl);

      hls.on(Hls.Events.MANIFEST_PARSED, () => {
        setIsLoading(false);
        if (initialTime > 0) {
          videoEl.currentTime = initialTime;
        }
        videoEl.play().catch(() => setIsPlaying(false));
      });

      hls.on(Hls.Events.ERROR, (_, data) => {
        if (data.fatal) {
          console.warn('HLS stream load warning, falling back:', data);
          setHasError(true);
          setIsLoading(false);
        }
      });
    } else if (videoEl.canPlayType('application/vnd.apple.mpegurl') || streamInfo.type === 'mp4') {
      videoEl.src = streamInfo.url;
      videoEl.addEventListener('loadedmetadata', () => {
        setIsLoading(false);
        if (initialTime > 0) {
          videoEl.currentTime = initialTime;
        }
        videoEl.play().catch(() => setIsPlaying(false));
      });
      videoEl.addEventListener('error', () => {
        setHasError(true);
        setIsLoading(false);
      });
    }

    return () => {
      if (hls) {
        hls.destroy();
      }
    };
  }, [streamInfo.url, streamInfo.type, initialTime]);

  // Handle HTML5 video events & update Watch Progress periodically
  useEffect(() => {
    const videoEl = videoRef.current;
    if (!videoEl) return;

    const handleTimeUpdate = () => {
      setCurrentTime(videoEl.currentTime);
      setDuration(videoEl.duration || 0);

      // Auto save watch progress every 3 seconds
      if (videoEl.currentTime > 5 && videoEl.duration > 0) {
        saveWatchProgress({
          movieId: movie.id,
          episodeId: selectedEpisode?.id,
          currentTime: videoEl.currentTime,
          duration: videoEl.duration,
          updatedAt: Date.now(),
        });
      }
    };

    const handleEnded = () => {
      setIsPlaying(false);
      // Auto next episode if TV Show
      if (movie.episodes && selectedEpisode && onSelectEpisode) {
        const currentIndex = movie.episodes.findIndex((ep) => ep.id === selectedEpisode.id);
        if (currentIndex >= 0 && currentIndex < movie.episodes.length - 1) {
          onSelectEpisode(movie.episodes[currentIndex + 1]);
        }
      }
    };

    videoEl.addEventListener('timeupdate', handleTimeUpdate);
    videoEl.addEventListener('ended', handleEnded);

    return () => {
      videoEl.removeEventListener('timeupdate', handleTimeUpdate);
      videoEl.removeEventListener('ended', handleEnded);
    };
  }, [movie.id, selectedEpisode, movie.episodes, onSelectEpisode]);

  // Keyboard Shortcuts Handler
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't trigger if user is typing in input
      if (['INPUT', 'TEXTAREA'].includes((e.target as HTMLElement).tagName)) return;

      const videoEl = videoRef.current;

      switch (e.key.toLowerCase()) {
        case ' ':
        case 'k':
          e.preventDefault();
          togglePlay();
          break;
        case 'f':
          e.preventDefault();
          toggleFullscreen();
          break;
        case 'm':
          e.preventDefault();
          toggleMute();
          break;
        case 'arrowright':
          e.preventDefault();
          skipTime(10);
          break;
        case 'arrowleft':
          e.preventDefault();
          skipTime(-10);
          break;
        case 'arrowup':
          e.preventDefault();
          if (videoEl) {
            const newVol = Math.min(1, videoEl.volume + 0.1);
            videoEl.volume = newVol;
            setVolume(newVol);
          }
          break;
        case 'arrowdown':
          e.preventDefault();
          if (videoEl) {
            const newVol = Math.max(0, videoEl.volume - 0.1);
            videoEl.volume = newVol;
            setVolume(newVol);
          }
          break;
        case 'escape':
          if (isFullscreen) toggleFullscreen();
          break;
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isFullscreen, isPlaying]);

  const togglePlay = () => {
    if (videoRef.current) {
      if (isPlaying) {
        videoRef.current.pause();
        setIsPlaying(false);
      } else {
        videoRef.current.play();
        setIsPlaying(true);
      }
    }
  };

  const skipTime = (seconds: number) => {
    if (videoRef.current) {
      videoRef.current.currentTime = Math.max(0, Math.min(videoRef.current.duration, videoRef.current.currentTime + seconds));
      setShowGestureOverlay(seconds > 0 ? 'forward' : 'backward');
      setTimeout(() => setShowGestureOverlay(null), 600);
    }
  };

  const toggleMute = () => {
    if (videoRef.current) {
      videoRef.current.muted = !isMuted;
      setIsMuted(!isMuted);
    }
  };

  const handleVolumeChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const val = parseFloat(e.target.value);
    setVolume(val);
    if (videoRef.current) {
      videoRef.current.volume = val;
      setIsMuted(val === 0);
    }
  };

  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const seekTime = parseFloat(e.target.value);
    setCurrentTime(seekTime);
    if (videoRef.current) {
      videoRef.current.currentTime = seekTime;
    }
  };

  const toggleFullscreen = () => {
    if (!playerContainerRef.current) return;
    if (!document.fullscreenElement) {
      playerContainerRef.current.requestFullscreen().catch(console.error);
      setIsFullscreen(true);
    } else {
      document.exitFullscreen().catch(console.error);
      setIsFullscreen(false);
    }
  };

  const togglePictureInPicture = () => {
    if (videoRef.current && document.pictureInPictureEnabled) {
      if (document.pictureInPictureElement) {
        document.exitPictureInPicture();
      } else {
        videoRef.current.requestPictureInPicture().catch(console.error);
      }
    }
  };

  const changeSpeed = (speed: number) => {
    setPlaybackSpeed(speed);
    if (videoRef.current) {
      videoRef.current.playbackRate = speed;
    }
    setShowSettingsMenu(false);
  };

  const formatTime = (seconds: number) => {
    if (isNaN(seconds)) return '00:00';
    const h = Math.floor(seconds / 3600);
    const m = Math.floor((seconds % 3600) / 60);
    const s = Math.floor(seconds % 60);
    if (h > 0) {
      return `${h}:${m < 10 ? '0' : ''}${m}:${s < 10 ? '0' : ''}${s}`;
    }
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div
      ref={playerContainerRef}
      className="fixed inset-0 z-50 bg-black flex flex-col justify-between overflow-hidden select-none"
    >
      {/* Header Bar */}
      <div className="absolute top-0 left-0 right-0 z-30 p-4 bg-gradient-to-b from-black/90 via-black/50 to-transparent flex items-center justify-between">
        <div className="flex items-center space-x-3">
          <button
            onClick={onClose}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Back to Catalog"
            id="player-back-btn"
          >
            <ChevronLeft className="w-6 h-6" />
          </button>
          <div>
            <h2 className="text-white text-base sm:text-lg font-bold line-clamp-1">
              {movie.title}
            </h2>
            {selectedEpisode && (
              <p className="text-xs text-red-400 font-medium">
                S{selectedEpisode.seasonNumber} E{selectedEpisode.episodeNumber}: {selectedEpisode.title}
              </p>
            )}
          </div>
        </div>

        <div className="flex items-center space-x-2">
          <div className="hidden sm:flex items-center space-x-1.5 bg-black/60 border border-white/10 px-2.5 py-1 rounded-full text-[10px] text-gray-300 font-mono">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>{streamInfo.sourceName}</span>
          </div>

          {movie.type === 'tvshow' && movie.episodes && movie.episodes.length > 0 && (
            <button
              onClick={() => setShowEpisodeSelector(!showEpisodeSelector)}
              className="flex items-center space-x-1.5 bg-white/10 hover:bg-white/20 text-white px-3 py-1.5 rounded-lg text-xs font-semibold backdrop-blur-md border border-white/10"
              id="player-episodes-btn"
            >
              <ListVideo className="w-4 h-4 text-purple-400" />
              <span className="hidden sm:inline">Episodes</span>
            </button>
          )}

          <button
            onClick={() => onShare(movie)}
            className="p-2 rounded-full bg-white/10 hover:bg-white/20 text-white backdrop-blur-md transition-colors"
            title="Share Movie"
          >
            <Share2 className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Main Video Viewport */}
      <div className="relative w-full h-full flex items-center justify-center bg-black">
        {/* Loading Spinner */}
        {isLoading && !hasError && (
          <div className="absolute z-20 flex flex-col items-center justify-center text-white space-y-3">
            <div className="w-12 h-12 border-4 border-red-600 border-t-transparent rounded-full animate-spin" />
            <p className="text-xs font-semibold tracking-wider text-gray-400 uppercase">
              Loading {streamInfo.sourceName}...
            </p>
          </div>
        )}

        {/* Error / Fallback Recovery Card */}
        {hasError && (
          <div className="absolute z-30 max-w-md p-6 bg-zinc-950/95 border border-amber-500/40 rounded-3xl text-center space-y-4 shadow-2xl backdrop-blur-xl animate-fadeIn">
            <AlertCircle className="w-11 h-11 text-amber-400 mx-auto" />
            <div>
              <h3 className="text-white font-extrabold text-base">Video Stream Warning</h3>
              <p className="text-xs text-gray-300 mt-1">
                The primary video URL or Bunny Video ID ({activeVideoId || 'None'}) encountered a loading restriction or CORS issue.
              </p>
            </div>

            <div className="flex flex-col gap-2 pt-1">
              <button
                onClick={() => {
                  setUseFallbackStream(true);
                  setHasError(false);
                }}
                className="w-full bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-black text-xs font-black uppercase tracking-wider py-2.5 rounded-xl shadow-lg shadow-amber-950/50 transition-all flex items-center justify-center space-x-2"
                id="player-switch-backup-stream-btn"
              >
                <Play className="w-4 h-4 fill-black" />
                <span>Play Backup Stream Demo</span>
              </button>

              <button
                onClick={() => {
                  setHasError(false);
                  setIsLoading(true);
                }}
                className="w-full bg-zinc-800 hover:bg-zinc-700 text-white text-xs font-bold py-2 rounded-xl transition-colors"
              >
                Retry Original Connection
              </button>
            </div>
          </div>
        )}

        {/* Gesture Animation overlay */}
        {showGestureOverlay && (
          <div className="absolute z-30 p-4 rounded-full bg-red-600/80 text-white animate-ping">
            {showGestureOverlay === 'forward' ? (
              <RotateCw className="w-8 h-8" />
            ) : (
              <RotateCcw className="w-8 h-8" />
            )}
          </div>
        )}

        {/* Render Bunny Stream Iframe embed or HTML5 Video element */}
        {streamInfo.type === 'embed' ? (
          <iframe
            src={streamInfo.url}
            className="w-full h-full border-0"
            allow="accelerometer; gyroscope; autoplay; encrypted-media; picture-in-picture; fullscreen"
            allowFullScreen
            title={movie.title}
          />
        ) : (
          <video
            ref={videoRef}
            className="w-full h-full object-contain cursor-pointer"
            onClick={togglePlay}
            playsInline
          />
        )}
      </div>

      {/* HTML5 Player Custom Overlay Controls (active when direct stream or HLS is rendered) */}
      {streamInfo.type !== 'embed' && (
        <div className="absolute bottom-0 left-0 right-0 z-30 p-4 sm:p-6 bg-gradient-to-t from-black via-black/80 to-transparent space-y-2">
          {/* Progress Seek Bar */}
          <div className="flex items-center space-x-3 text-xs text-gray-300 font-mono">
            <span>{formatTime(currentTime)}</span>
            <input
              type="range"
              min="0"
              max={duration || 100}
              value={currentTime}
              onChange={handleSeek}
              className="w-full h-1.5 bg-zinc-700 accent-red-600 rounded-lg cursor-pointer"
            />
            <span>{formatTime(duration)}</span>
          </div>

          {/* Controls Bar */}
          <div className="flex items-center justify-between pt-1">
            <div className="flex items-center space-x-3 sm:space-x-4">
              {/* Play / Pause */}
              <button
                onClick={togglePlay}
                className="p-2 rounded-full bg-red-600 hover:bg-red-500 text-white transition-colors"
                id="player-toggle-play-btn"
              >
                {isPlaying ? <Pause className="w-5 h-5 fill-white" /> : <Play className="w-5 h-5 fill-white ml-0.5" />}
              </button>

              {/* Skip -10s / +10s */}
              <button
                onClick={() => skipTime(-10)}
                className="text-gray-300 hover:text-white transition-colors"
                title="Rewind 10s"
              >
                <RotateCcw className="w-5 h-5" />
              </button>
              <button
                onClick={() => skipTime(10)}
                className="text-gray-300 hover:text-white transition-colors"
                title="Skip 10s"
              >
                <RotateCw className="w-5 h-5" />
              </button>

              {/* Mute & Volume */}
              <div className="hidden sm:flex items-center space-x-2">
                <button onClick={toggleMute} className="text-gray-300 hover:text-white">
                  {isMuted || volume === 0 ? <VolumeX className="w-5 h-5" /> : <Volume2 className="w-5 h-5" />}
                </button>
                <input
                  type="range"
                  min="0"
                  max="1"
                  step="0.05"
                  value={isMuted ? 0 : volume}
                  onChange={handleVolumeChange}
                  className="w-16 h-1 bg-zinc-700 accent-red-600 rounded"
                />
              </div>
            </div>

            {/* Right Controls: Speed, Quality, PIP, Fullscreen */}
            <div className="flex items-center space-x-3 text-xs">
              <div className="relative">
                <button
                  onClick={() => setShowSettingsMenu(!showSettingsMenu)}
                  className="p-2 text-gray-300 hover:text-white transition-colors"
                  title="Playback Settings"
                >
                  <Settings className="w-5 h-5" />
                </button>

                {/* Settings Popup */}
                {showSettingsMenu && (
                  <div className="absolute right-0 bottom-10 w-48 bg-zinc-900 border border-white/20 rounded-xl p-3 shadow-2xl space-y-3 z-40">
                    <div>
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Speed</p>
                      <div className="grid grid-cols-3 gap-1">
                        {[0.75, 1, 1.25, 1.5, 2].map((s) => (
                          <button
                            key={s}
                            onClick={() => changeSpeed(s)}
                            className={`py-1 rounded text-center text-xs font-semibold ${
                              playbackSpeed === s
                                ? 'bg-red-600 text-white'
                                : 'bg-white/5 text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            {s}x
                          </button>
                        ))}
                      </div>
                    </div>

                    <div className="border-t border-white/10 pt-2">
                      <p className="text-[10px] text-gray-400 font-bold uppercase mb-1">Quality</p>
                      <div className="space-y-1">
                        {['Auto (HLS)', '1080p Full HD', '720p HD', '480p SD'].map((q) => (
                          <button
                            key={q}
                            onClick={() => {
                              setSelectedQuality(q);
                              setShowSettingsMenu(false);
                            }}
                            className={`w-full text-left px-2 py-1 rounded text-xs flex items-center justify-between ${
                              selectedQuality === q ? 'bg-red-600/30 text-red-400 font-bold' : 'text-gray-300 hover:bg-white/10'
                            }`}
                          >
                            <span>{q}</span>
                            {selectedQuality === q && <Check className="w-3.5 h-3.5" />}
                          </button>
                        ))}
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Picture in Picture */}
              <button
                onClick={togglePictureInPicture}
                className="hidden sm:block text-gray-300 hover:text-white"
                title="Picture in Picture"
              >
                <Tv className="w-5 h-5" />
              </button>

              {/* Fullscreen */}
              <button
                onClick={toggleFullscreen}
                className="p-2 text-gray-300 hover:text-white transition-colors"
                title="Fullscreen (F)"
                id="player-fullscreen-btn"
              >
                {isFullscreen ? <Minimize className="w-5 h-5" /> : <Maximize className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Episode Drawer overlay for TV Shows */}
      {showEpisodeSelector && movie.episodes && (
        <div className="absolute right-0 top-16 bottom-0 z-40 w-80 bg-zinc-950/95 border-l border-white/10 backdrop-blur-xl p-4 overflow-y-auto space-y-3">
          <div className="flex items-center justify-between border-b border-white/10 pb-3">
            <h3 className="text-white font-bold text-sm">Select Episode</h3>
            <button
              onClick={() => setShowEpisodeSelector(false)}
              className="text-gray-400 hover:text-white text-xs"
            >
              Close
            </button>
          </div>
          <div className="space-y-2">
            {movie.episodes.map((ep) => {
              const isSelected = selectedEpisode?.id === ep.id;
              return (
                <button
                  key={ep.id}
                  onClick={() => {
                    if (onSelectEpisode) onSelectEpisode(ep);
                    setShowEpisodeSelector(false);
                  }}
                  className={`w-full text-left p-3 rounded-xl border transition-all flex items-start space-x-3 ${
                    isSelected
                      ? 'bg-red-600/20 border-red-500 text-white'
                      : 'bg-white/5 border-white/5 text-gray-300 hover:bg-white/10'
                  }`}
                >
                  <div className="w-7 h-7 rounded-lg bg-red-600 text-white font-bold text-xs flex items-center justify-center flex-shrink-0 mt-0.5">
                    {ep.episodeNumber}
                  </div>
                  <div>
                    <h4 className="text-xs font-bold line-clamp-1">{ep.title}</h4>
                    <p className="text-[10px] text-gray-400 line-clamp-2 mt-0.5">
                      {ep.description}
                    </p>
                    <span className="text-[10px] text-red-400 mt-1 block font-mono">{ep.runtime}</span>
                  </div>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
};
