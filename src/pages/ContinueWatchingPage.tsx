import React from 'react';
import { Clock, Play, Trash2 } from 'lucide-react';
import { Movie, WatchProgress } from '../types';

interface ContinueWatchingPageProps {
  movies: Movie[];
  progressDict: Record<string, WatchProgress>;
  onPlay: (movie: Movie, episodeId?: string, time?: number) => void;
  onOpenDetails: (movie: Movie) => void;
}

export const ContinueWatchingPage: React.FC<ContinueWatchingPageProps> = ({
  movies,
  progressDict,
  onPlay,
  onOpenDetails,
}) => {
  const items = Object.values(progressDict)
    .map((p: WatchProgress) => {
      const movie = movies.find((m) => m.id === p.movieId);
      return { progress: p, movie };
    })
    .filter((item): item is { progress: WatchProgress; movie: Movie } => !!item.movie)
    .sort((a, b) => b.progress.updatedAt - a.progress.updatedAt);

  const formatRemaining = (cur: number, dur: number) => {
    const rem = Math.max(0, dur - cur);
    const m = Math.floor(rem / 60);
    return `${m}m left`;
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-white/10 pb-6">
        <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
          <Clock className="w-8 h-8 text-red-500" />
          <span>Continue Watching</span>
        </h1>
        <p className="text-xs text-gray-400 mt-1">
          Pick up right where you left off across all your streaming devices.
        </p>
      </div>

      {items.length === 0 ? (
        <div className="py-20 text-center space-y-3 bg-zinc-900/40 rounded-3xl border border-white/5">
          <Clock className="w-12 h-12 text-gray-600 mx-auto" />
          <h3 className="text-white font-bold text-lg">No Active Streams in Progress</h3>
          <p className="text-xs text-gray-400">
            Start watching any movie or TV episode and your progress will auto-save here!
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {items.map(({ progress, movie }) => {
            const percent = Math.round((progress.currentTime / progress.duration) * 100);
            return (
              <div
                key={movie.id}
                className="bg-zinc-900 rounded-2xl overflow-hidden border border-white/10 flex flex-col justify-between group hover:border-red-500/50 transition-all shadow-xl"
              >
                <div className="relative aspect-video w-full bg-zinc-950 overflow-hidden">
                  <img
                    src={movie.bannerUrl || movie.posterUrl}
                    alt={movie.title}
                    className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                  />
                  <div className="absolute inset-0 bg-black/40 group-hover:bg-black/20 transition-colors flex items-center justify-center">
                    <button
                      onClick={() => onPlay(movie, progress.episodeId, progress.currentTime)}
                      className="w-12 h-12 rounded-full bg-red-600 hover:bg-red-500 text-white flex items-center justify-center shadow-lg shadow-red-600/50 hover:scale-110 transition-transform"
                    >
                      <Play className="w-6 h-6 fill-white ml-0.5" />
                    </button>
                  </div>

                  {/* Progress Bar */}
                  <div className="absolute bottom-0 left-0 right-0 h-2 bg-zinc-800">
                    <div className="h-full bg-red-600" style={{ width: `${percent}%` }} />
                  </div>
                </div>

                <div className="p-4 flex items-center justify-between">
                  <div>
                    <h3 className="text-sm font-bold text-white line-clamp-1">{movie.title}</h3>
                    <p className="text-xs text-gray-400 mt-0.5 font-mono">
                      {percent}% completed • {formatRemaining(progress.currentTime, progress.duration)}
                    </p>
                  </div>

                  <button
                    onClick={() => onPlay(movie, progress.episodeId, progress.currentTime)}
                    className="bg-red-600/20 text-red-400 hover:bg-red-600 hover:text-white px-3 py-1.5 rounded-xl text-xs font-bold border border-red-500/30 transition-all"
                  >
                    Resume
                  </button>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
};
