import React from 'react';
import { Download, ExternalLink, HardDrive, ShieldCheck } from 'lucide-react';
import { Movie } from '../types';

interface DownloadsPageProps {
  movies: Movie[];
  onOpenDetails: (movie: Movie) => void;
}

export const DownloadsPage: React.FC<DownloadsPageProps> = ({ movies, onOpenDetails }) => {
  const downloadableMovies = movies.filter(
    (m) =>
      !m.isHidden &&
      (m.downloadUrls?.quality480p ||
        m.downloadUrls?.quality720p ||
        m.downloadUrls?.quality1080p ||
        m.downloadUrls?.quality4k)
  );

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16 space-y-6">
      <div className="border-b border-white/10 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-black text-white tracking-tight flex items-center space-x-3">
            <Download className="w-8 h-8 text-red-500" />
            <span>High-Speed Offline Downloads</span>
          </h1>
          <p className="text-xs text-gray-400 mt-1">
            Download movies directly in 480p, 720p, 1080p or 4K to watch offline without buffer.
          </p>
        </div>

        <div className="flex items-center space-x-2 bg-emerald-950/40 text-emerald-400 border border-emerald-900/60 px-3.5 py-1.5 rounded-xl text-xs font-bold w-fit">
          <ShieldCheck className="w-4 h-4" />
          <span>CDN Edge Fast Speeds</span>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
        {downloadableMovies.map((movie) => (
          <div
            key={movie.id}
            className="p-4 rounded-2xl bg-zinc-900 border border-white/10 hover:border-red-500/40 transition-all flex space-x-4"
          >
            <img
              src={movie.posterUrl}
              alt={movie.title}
              className="w-20 h-28 object-cover rounded-xl flex-shrink-0 cursor-pointer"
              onClick={() => onOpenDetails(movie)}
            />

            <div className="flex-1 flex flex-col justify-between">
              <div>
                <h3
                  onClick={() => onOpenDetails(movie)}
                  className="text-sm font-bold text-white hover:text-red-400 line-clamp-1 cursor-pointer"
                >
                  {movie.title}
                </h3>
                <p className="text-[11px] text-gray-400 mt-0.5">{movie.releaseYear} • {movie.runtime}</p>
              </div>

              <div className="space-y-1.5 pt-2">
                <span className="text-[10px] text-gray-400 font-bold uppercase block">
                  Available Qualities
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {movie.downloadUrls?.quality480p && (
                    <a
                      href={movie.downloadUrls.quality480p}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-white/10 flex items-center space-x-1"
                    >
                      <span>480p</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {movie.downloadUrls?.quality720p && (
                    <a
                      href={movie.downloadUrls.quality720p}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-red-600/20 hover:bg-red-600/30 text-red-400 border border-red-500/40 flex items-center space-x-1"
                    >
                      <span>720p HD</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                  {movie.downloadUrls?.quality1080p && (
                    <a
                      href={movie.downloadUrls.quality1080p}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="text-[11px] font-bold px-2.5 py-1 rounded bg-zinc-800 hover:bg-zinc-700 text-gray-300 border border-white/10 flex items-center space-x-1"
                    >
                      <span>1080p</span>
                      <ExternalLink className="w-3 h-3" />
                    </a>
                  )}
                </div>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
