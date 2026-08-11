import React, { useState } from 'react';
import {
  ShieldAlert,
  Plus,
  Edit,
  Trash2,
  Eye,
  EyeOff,
  Star,
  Flame,
  Search,
  Settings,
  Film,
  Tv,
  RotateCcw,
  Check,
  X,
  ExternalLink,
  Zap,
  HardDrive,
  Grid,
  Download,
  Upload,
  Copy,
  Globe,
  Share2
} from 'lucide-react';
import { Movie, BunnyStreamSettings, DownloadUrls } from '../types';
import { getBunnySettings, saveBunnySettings, resetMoviesCatalog } from '../lib/storage';

interface AdminDashboardPageProps {
  movies: Movie[];
  onSaveMovies: (movies: Movie[]) => void;
  bunnySettings: BunnyStreamSettings;
  onSaveBunnySettings: (settings: BunnyStreamSettings) => void;
  onLogoutAdmin: () => void;
}

export const AdminDashboardPage: React.FC<AdminDashboardPageProps> = ({
  movies,
  onSaveMovies,
  bunnySettings,
  onSaveBunnySettings,
  onLogoutAdmin,
}) => {
  const [adminTab, setAdminTab] = useState<'movies' | 'settings' | 'deploy'>('movies');
  const [searchAdmin, setSearchAdmin] = useState('');
  const [isEditing, setIsEditing] = useState<Movie | null>(null);
  const [isCreating, setIsCreating] = useState(false);

  // Export & Import Catalog Helpers
  const handleExportJSON = () => {
    const dataStr = 'data:text/json;charset=utf-8,' + encodeURIComponent(JSON.stringify(movies, null, 2));
    const downloadAnchor = document.createElement('a');
    downloadAnchor.setAttribute('href', dataStr);
    downloadAnchor.setAttribute('download', 'movieflix_catalog.json');
    document.body.appendChild(downloadAnchor);
    downloadAnchor.click();
    downloadAnchor.remove();
    showNotification('Catalog JSON downloaded successfully!');
  };

  const handleImportJSON = (e: React.ChangeEvent<HTMLInputElement>) => {
    const fileReader = new FileReader();
    if (e.target.files && e.target.files[0]) {
      fileReader.readAsText(e.target.files[0], 'UTF-8');
      fileReader.onload = (event) => {
        try {
          const parsed = JSON.parse(event.target?.result as string);
          if (Array.isArray(parsed) && parsed.length > 0) {
            onSaveMovies(parsed);
            showNotification(`Successfully imported ${parsed.length} items to catalog!`);
          } else {
            alert('Invalid catalog JSON structure. Must be an array of movies.');
          }
        } catch {
          alert('Failed to parse JSON file.');
        }
      };
    }
  };

  const handleCopyTSCode = () => {
    const code = `import { Movie } from '../types';\n\nexport const INITIAL_MOVIES: Movie[] = ${JSON.stringify(movies, null, 2)};\n`;
    navigator.clipboard.writeText(code);
    showNotification('Copied TypeScript code for initialMovies.ts to clipboard!');
  };

  // Bunny Settings State
  const [libId, setLibId] = useState(bunnySettings.libraryId || '');
  const [cdnHost, setCdnHost] = useState(bunnySettings.cdnHostname || '');
  const [apiKey, setApiKey] = useState(bunnySettings.apiKey || '');
  const [saveSuccess, setSaveSuccess] = useState(false);
  const [adminNotification, setAdminNotification] = useState<string | null>(null);

  // Custom Modal States for Deletion & Reset
  const [deletingMovie, setDeletingMovie] = useState<Movie | null>(null);
  const [showResetConfirm, setShowResetConfirm] = useState(false);

  // Form State for Movie Add / Edit
  const [formState, setFormState] = useState<Partial<Movie>>({
    title: '',
    type: 'movie',
    posterUrl: '',
    bannerUrl: '',
    description: '',
    genres: ['Action'],
    language: 'English',
    country: 'USA',
    releaseYear: 2024,
    runtime: '2h 00m',
    imdbRating: 8.0,
    director: '',
    cast: [{ name: '' }],
    trailerUrl: '',
    bunnyVideoId: '',
    directStreamUrl: '',
    downloadUrls: { quality480p: '', quality720p: '', quality1080p: '' },
    isFeatured: false,
    isTrending: true,
    isLatest: true,
    isPopular: false,
    isHidden: false,
  });

  const showNotification = (msg: string) => {
    setAdminNotification(msg);
    setTimeout(() => setAdminNotification(null), 3500);
  };

  const handleOpenCreate = () => {
    setFormState({
      id: `movie-${Date.now()}`,
      title: '',
      type: 'movie',
      posterUrl: 'https://images.unsplash.com/photo-1578632767115-351597cf2477?w=600&auto=format&fit=crop&q=80',
      bannerUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af9f23?w=1600&auto=format&fit=crop&q=80',
      description: '',
      genres: ['Action', 'Thriller'],
      language: 'English',
      country: 'USA',
      releaseYear: 2024,
      runtime: '2h 00m',
      imdbRating: 8.0,
      director: 'Director Name',
      cast: [{ name: 'Lead Actor', character: 'Main Role' }],
      trailerUrl: '',
      bunnyVideoId: '',
      directStreamUrl: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      downloadUrls: {
        quality480p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality720p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
        quality1080p: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
      },
      isFeatured: false,
      isTrending: true,
      isLatest: true,
      isPopular: false,
      isHidden: false,
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    });
    setIsCreating(true);
    setIsEditing(null);
  };

  const handleOpenEdit = (movie: Movie) => {
    setIsEditing(movie);
    setFormState({
      ...movie,
      genres: movie.genres && movie.genres.length > 0 ? [...movie.genres] : ['Action'],
      downloadUrls: movie.downloadUrls ? { ...movie.downloadUrls } : {},
    });
    setIsCreating(false);
  };

  const handleSaveMovieForm = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState.title || !formState.posterUrl) return;

    const updatedMovie: Movie = {
      id: formState.id || `movie-${Date.now()}`,
      title: formState.title.trim(),
      type: formState.type || 'movie',
      posterUrl: formState.posterUrl.trim(),
      bannerUrl: (formState.bannerUrl || formState.posterUrl).trim(),
      description: formState.description || '',
      genres: formState.genres && formState.genres.length > 0 ? formState.genres : ['Action'],
      language: formState.language || 'English',
      country: formState.country || 'USA',
      releaseYear: Number(formState.releaseYear) || 2024,
      runtime: formState.runtime || '2h 00m',
      imdbRating: Number(formState.imdbRating) || 7.5,
      director: formState.director || 'Unknown',
      cast: formState.cast || [],
      episodes: formState.episodes || [],
      viewsCount: formState.viewsCount || 0,
      trailerUrl: formState.trailerUrl || '',
      bunnyVideoId: formState.bunnyVideoId || '',
      bunnyLibraryId: formState.bunnyLibraryId || '',
      directStreamUrl: formState.directStreamUrl || '',
      downloadUrls: formState.downloadUrls || {},
      isFeatured: !!formState.isFeatured,
      isTrending: !!formState.isTrending,
      isLatest: !!formState.isLatest,
      isPopular: !!formState.isPopular,
      isHidden: !!formState.isHidden,
      createdAt: formState.createdAt || new Date().toISOString(),
      updatedAt: new Date().toISOString(),
    };

    if (isCreating) {
      onSaveMovies([updatedMovie, ...movies]);
      showNotification(`"${updatedMovie.title}" has been added to the catalog!`);
    } else if (isEditing) {
      onSaveMovies(movies.map((m) => (m.id === updatedMovie.id ? updatedMovie : m)));
      showNotification(`"${updatedMovie.title}" updated successfully!`);
    }

    setIsCreating(false);
    setIsEditing(null);
  };

  const confirmDeleteMovie = () => {
    if (!deletingMovie) return;
    const title = deletingMovie.title;
    onSaveMovies(movies.filter((m) => m.id !== deletingMovie.id));
    setDeletingMovie(null);
    showNotification(`"${title}" deleted from catalog.`);
  };

  const handleToggleHide = (id: string) => {
    const target = movies.find((m) => m.id === id);
    onSaveMovies(
      movies.map((m) => (m.id === id ? { ...m, isHidden: !m.isHidden } : m))
    );
    showNotification(`Status updated for "${target?.title || 'Title'}".`);
  };

  const handleToggleFeature = (id: string) => {
    const target = movies.find((m) => m.id === id);
    onSaveMovies(
      movies.map((m) => (m.id === id ? { ...m, isFeatured: !m.isFeatured } : m))
    );
    showNotification(`Featured spotlight toggled for "${target?.title || 'Title'}".`);
  };

  const handleSaveSettings = (e: React.FormEvent) => {
    e.preventDefault();
    const updated = {
      ...bunnySettings,
      libraryId: libId,
      cdnHostname: cdnHost,
      apiKey: apiKey,
    };
    onSaveBunnySettings(updated);
    setSaveSuccess(true);
    showNotification('Bunny Stream API configuration updated!');
    setTimeout(() => setSaveSuccess(false), 3000);
  };

  const confirmResetCatalog = () => {
    const reset = resetMoviesCatalog();
    onSaveMovies(reset);
    setShowResetConfirm(false);
    showNotification('Catalog reset to default factory titles.');
  };

  const filteredAdminMovies = movies.filter(
    (m) =>
      m.title.toLowerCase().includes(searchAdmin.toLowerCase()) ||
      m.genres.some((g) => g.toLowerCase().includes(searchAdmin.toLowerCase()))
  );

  return (
    <div className="min-h-screen bg-[#08080a] text-white">
      {/* Standalone Top Admin Navigation Header */}
      <header className="sticky top-0 z-50 bg-[#0c0c10]/95 backdrop-blur-md border-b border-amber-500/20 px-4 sm:px-8 py-4 flex items-center justify-between shadow-xl">
        <div className="flex items-center space-x-4">
          <div className="flex items-center space-x-2.5">
            <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-amber-600 to-amber-400 flex items-center justify-center shadow-lg shadow-amber-950/60">
              <ShieldAlert className="w-5 h-5 text-black" />
            </div>
            <div>
              <span className="text-xl font-black tracking-wider text-amber-400 font-sans uppercase">
                MOVIE<span className="text-white">FLIX</span>
              </span>
              <span className="ml-2 text-[10px] font-mono font-bold bg-amber-500/20 text-amber-400 border border-amber-500/30 px-2 py-0.5 rounded uppercase">
                ADMIN PORTAL
              </span>
            </div>
          </div>
        </div>

        <div className="flex items-center space-x-3">
          <div className="hidden md:flex items-center space-x-2 text-xs font-mono text-emerald-400 bg-emerald-950/40 border border-emerald-800/40 px-3 py-1.5 rounded-lg">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
            <span>Authenticated</span>
          </div>

          <button
            onClick={() => setShowResetConfirm(true)}
            className="flex items-center space-x-1.5 bg-zinc-900 hover:bg-zinc-800 text-gray-300 px-3 py-2 rounded-xl text-xs font-semibold border border-white/10 transition-colors"
            title="Reset Catalog to Factory Demo"
            id="reset-demo-catalog-btn"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">Reset Demo</span>
          </button>

          <button
            onClick={onLogoutAdmin}
            className="flex items-center space-x-2 bg-gradient-to-r from-red-600 to-red-700 hover:from-red-500 hover:to-red-600 text-white px-4 py-2 rounded-xl text-xs font-extrabold shadow-lg shadow-red-950/50 transition-all uppercase tracking-wider"
            id="exit-admin-portal-btn"
          >
            <X className="w-4 h-4" />
            <span>Exit Admin</span>
          </button>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {/* Admin Notification Alert */}
        {adminNotification && (
          <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/50 text-emerald-300 text-xs font-bold flex items-center justify-between shadow-xl animate-fadeIn">
            <div className="flex items-center space-x-2">
              <Check className="w-4 h-4 text-emerald-400" />
              <span>{adminNotification}</span>
            </div>
            <button onClick={() => setAdminNotification(null)} className="text-emerald-400 hover:text-white">
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Overview Banner */}
        <div className="bg-gradient-to-r from-amber-950/30 via-zinc-900 to-zinc-950 p-6 rounded-2xl border border-amber-500/20 shadow-2xl flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div>
            <span className="text-xs font-mono font-bold text-amber-400 uppercase tracking-widest block mb-1">
              Isolated Control Workspace
            </span>
            <h1 className="text-2xl sm:text-3xl font-black text-white tracking-tight">
              Content & Stream Management System
            </h1>
            <p className="text-xs text-gray-400 mt-1 max-w-xl">
              Add new movies/TV series, update video URLs, configure Bunny Stream CDN API credentials, and manage featured sliders.
            </p>
          </div>

          <div className="flex items-center gap-3">
            <button
              onClick={handleOpenCreate}
              className="flex items-center space-x-2 bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-5 py-2.5 rounded-xl text-xs uppercase tracking-wider shadow-lg shadow-amber-500/20 transition-all"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Content</span>
            </button>
          </div>
        </div>

        {/* Overview Stats Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1 backdrop-blur-sm">
            <span className="text-xs text-gray-400 font-bold block">Total Catalog Items</span>
            <span className="text-2xl font-black text-white">{movies.length}</span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1 backdrop-blur-sm">
            <span className="text-xs text-amber-400 font-bold block">Featured Titles</span>
            <span className="text-2xl font-black text-white">
              {movies.filter((m) => m.isFeatured).length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1 backdrop-blur-sm">
            <span className="text-xs text-red-500 font-bold block">Trending Items</span>
            <span className="text-2xl font-black text-white">
              {movies.filter((m) => m.isTrending).length}
            </span>
          </div>
          <div className="p-4 rounded-2xl bg-zinc-900/80 border border-white/10 space-y-1 backdrop-blur-sm">
            <span className="text-xs text-emerald-400 font-bold block">Bunny Stream ID</span>
            <span className="text-sm font-black text-white font-mono truncate block">
              Lib: {bunnySettings.libraryId || 'Default'}
            </span>
          </div>
        </div>

      {/* Tabs Header */}
      <div className="flex border-b border-white/10 overflow-x-auto">
        <button
          onClick={() => setAdminTab('movies')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            adminTab === 'movies'
              ? 'border-red-600 text-red-500'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Film className="w-4 h-4" />
          <span>Manage Movies ({movies.length})</span>
        </button>
        <button
          onClick={() => setAdminTab('settings')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            adminTab === 'settings'
              ? 'border-amber-500 text-amber-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
        >
          <Settings className="w-4 h-4" />
          <span>Bunny Stream Config</span>
        </button>
        <button
          onClick={() => setAdminTab('deploy')}
          className={`py-3 px-6 text-sm font-bold border-b-2 transition-colors flex items-center space-x-2 whitespace-nowrap ${
            adminTab === 'deploy'
              ? 'border-emerald-500 text-emerald-400'
              : 'border-transparent text-gray-400 hover:text-white'
          }`}
          id="admin-tab-deploy-btn"
        >
          <Globe className="w-4 h-4" />
          <span>Public Hosting & Data Sync</span>
        </button>
      </div>

      {/* TAB 1: MOVIES MANAGEMENT */}
      {adminTab === 'movies' && (
        <div className="space-y-6">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div className="relative max-w-sm w-full">
              <input
                type="text"
                value={searchAdmin}
                onChange={(e) => setSearchAdmin(e.target.value)}
                placeholder="Search catalog titles..."
                className="w-full bg-zinc-900 border border-white/15 rounded-xl py-2 pl-9 pr-4 text-xs text-white focus:outline-none focus:border-red-500"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </div>

            <button
              onClick={handleOpenCreate}
              className="flex items-center justify-center space-x-2 bg-red-600 hover:bg-red-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs shadow-lg shadow-red-600/30 transition-all"
              id="admin-add-movie-btn"
            >
              <Plus className="w-4 h-4" />
              <span>Add New Movie / Series</span>
            </button>
          </div>

          {/* Table of Movies */}
          <div className="bg-zinc-900 border border-white/10 rounded-2xl overflow-hidden shadow-2xl overflow-x-auto">
            <table className="w-full text-left text-xs text-gray-300">
              <thead className="bg-zinc-950 text-gray-400 uppercase font-mono text-[10px] border-b border-white/10">
                <tr>
                  <th className="p-3.5">Title</th>
                  <th className="p-3.5">Type</th>
                  <th className="p-3.5">Year / Rating</th>
                  <th className="p-3.5">Genres</th>
                  <th className="p-3.5">Bunny Video ID</th>
                  <th className="p-3.5">Status</th>
                  <th className="p-3.5 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-white/5 font-medium">
                {filteredAdminMovies.map((movie) => (
                  <tr key={movie.id} className="hover:bg-white/5 transition-colors">
                    <td className="p-3.5 flex items-center space-x-3">
                      <img
                        src={movie.posterUrl}
                        alt={movie.title}
                        className="w-10 h-14 object-cover rounded-lg flex-shrink-0"
                      />
                      <div>
                        <span className="font-bold text-white block text-sm line-clamp-1">
                          {movie.title}
                        </span>
                        <span className="text-[10px] text-gray-400">{movie.language} • {movie.country}</span>
                      </div>
                    </td>

                    <td className="p-3.5 uppercase font-mono text-[11px]">
                      <span className={`px-2 py-0.5 rounded font-bold ${movie.type === 'tvshow' ? 'bg-purple-900/40 text-purple-400 border border-purple-500/30' : 'bg-blue-900/40 text-blue-400 border border-blue-500/30'}`}>
                        {movie.type}
                      </span>
                    </td>

                    <td className="p-3.5">
                      <div className="font-bold text-white">{movie.releaseYear}</div>
                      <div className="text-amber-400 font-mono text-[11px]">⭐ {movie.imdbRating}</div>
                    </td>

                    <td className="p-3.5">
                      <div className="flex flex-wrap gap-1 max-w-[150px]">
                        {movie.genres.map((g) => (
                          <span key={g} className="bg-zinc-800 text-gray-300 px-1.5 py-0.5 rounded text-[10px]">
                            {g}
                          </span>
                        ))}
                      </div>
                    </td>

                    <td className="p-3.5 font-mono text-[11px] text-amber-400">
                      {movie.bunnyVideoId || 'Direct HLS'}
                    </td>

                    <td className="p-3.5">
                      <div className="flex items-center space-x-1.5">
                        {movie.isFeatured && (
                          <span className="bg-amber-500/20 text-amber-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            FEATURED
                          </span>
                        )}
                        {movie.isHidden && (
                          <span className="bg-red-950 text-red-400 px-1.5 py-0.5 rounded text-[10px] font-bold">
                            HIDDEN
                          </span>
                        )}
                      </div>
                    </td>

                    <td className="p-3.5 text-right">
                      <div className="flex items-center justify-end space-x-2">
                        <button
                          onClick={() => handleToggleFeature(movie.id)}
                          className={`p-1.5 rounded-lg border transition-colors ${
                            movie.isFeatured
                              ? 'bg-amber-500/20 text-amber-400 border-amber-500/40'
                              : 'bg-white/5 text-gray-400 hover:text-white border-white/10'
                          }`}
                          title="Toggle Featured Spotlight"
                        >
                          <Star className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => handleToggleHide(movie.id)}
                          className="p-1.5 rounded-lg bg-white/5 hover:bg-white/10 text-gray-400 hover:text-white border border-white/10 transition-colors"
                          title={movie.isHidden ? 'Unhide Movie' : 'Hide Movie'}
                        >
                          {movie.isHidden ? <EyeOff className="w-3.5 h-3.5 text-red-400" /> : <Eye className="w-3.5 h-3.5 text-emerald-400" />}
                        </button>

                        <button
                          onClick={() => handleOpenEdit(movie)}
                          className="p-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-400 hover:text-white border border-blue-500/30 transition-colors"
                          title="Edit Movie"
                          id={`admin-edit-movie-${movie.id}`}
                        >
                          <Edit className="w-3.5 h-3.5" />
                        </button>

                        <button
                          onClick={() => setDeletingMovie(movie)}
                          className="p-1.5 rounded-lg bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white border border-red-500/30 transition-colors"
                          title="Delete Movie"
                          id={`admin-delete-movie-${movie.id}`}
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* TAB 2: BUNNY STREAM & SETTINGS */}
      {adminTab === 'settings' && (
        <div className="max-w-2xl bg-zinc-900 border border-white/10 rounded-3xl p-6 space-y-6">
          <div className="flex items-center space-x-3 border-b border-white/10 pb-4">
            <Zap className="w-6 h-6 text-amber-400" />
            <div>
              <h3 className="text-white font-bold text-lg">Bunny Stream CDN API Configuration</h3>
              <p className="text-xs text-gray-400">
                Configure your Bunny Stream Library ID & CDN endpoints. Stream embeds are auto-generated from Video IDs.
              </p>
            </div>
          </div>

          {saveSuccess && (
            <div className="p-3 rounded-xl bg-emerald-950/60 border border-emerald-500/40 text-emerald-400 text-xs flex items-center space-x-2">
              <Check className="w-4 h-4" />
              <span>Bunny Stream configuration updated successfully!</span>
            </div>
          )}

          <form onSubmit={handleSaveSettings} className="space-y-4 text-xs">
            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Bunny Stream Library ID
              </label>
              <input
                type="text"
                value={libId}
                onChange={(e) => setLibId(e.target.value)}
                placeholder="e.g. 123456"
                className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
              <p className="text-[10px] text-gray-400 mt-1">Found in your Bunny.net Stream Dashboard.</p>
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Bunny CDN Hostname
              </label>
              <input
                type="text"
                value={cdnHost}
                onChange={(e) => setCdnHost(e.target.value)}
                placeholder="e.g. vz-123456.b-cdn.net"
                className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <div>
              <label className="text-gray-300 font-bold block mb-1">
                Bunny API Key (Optional Secret)
              </label>
              <input
                type="password"
                value={apiKey}
                onChange={(e) => setApiKey(e.target.value)}
                placeholder="••••••••••••••••"
                className="w-full bg-zinc-950 border border-white/15 rounded-xl p-3 text-white font-mono focus:border-amber-500 focus:outline-none"
              />
            </div>

            <button
              type="submit"
              className="bg-amber-500 hover:bg-amber-400 text-black font-extrabold px-6 py-3 rounded-xl text-xs uppercase tracking-wider transition-all shadow-lg shadow-amber-500/20"
            >
              Save Configuration
            </button>
          </form>
        </div>
      )}

      {/* TAB 3: PUBLIC HOSTING & DATA SYNC */}
      {adminTab === 'deploy' && (
        <div className="space-y-6 animate-fadeIn">
          {/* Informational Guidance Box */}
          <div className="p-6 rounded-3xl bg-zinc-900/90 border border-emerald-500/30 space-y-3 shadow-xl">
            <div className="flex items-center space-x-2 text-emerald-400">
              <Globe className="w-5 h-5" />
              <h3 className="font-bold text-base text-white">How Public Deployment & Data Persistence Works</h3>
            </div>
            <p className="text-xs text-gray-300 leading-relaxed">
              When you deploy this website publicly (e.g. on <strong className="text-emerald-400">Netlify, Vercel, GitHub Pages, or Web App</strong>), all changes made in this admin panel update instantly in your local browser.
            </p>
            <p className="text-xs text-gray-300 leading-relaxed">
              To make your new movies and edits permanent for <strong className="text-white">ALL public users visiting your website</strong> on any phone or device, use the 1-click tools below to download or copy your updated catalog directly into the source code!
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Download / Upload JSON Backup */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-amber-400">
                  <HardDrive className="w-5 h-5" />
                  <h4 className="font-bold text-white text-sm">Backup & Restore Catalog (JSON)</h4>
                </div>
                <p className="text-xs text-gray-400">
                  Export your entire catalog ({movies.length} titles) to a <code className="text-amber-300">movieflix_catalog.json</code> file, or restore data on a new browser/device.
                </p>
              </div>

              <div className="flex flex-col sm:flex-row gap-3 pt-2">
                <button
                  onClick={handleExportJSON}
                  className="flex-1 bg-amber-500/10 hover:bg-amber-500/20 text-amber-400 border border-amber-500/30 font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 transition-all"
                  id="admin-export-json-btn"
                >
                  <Download className="w-4 h-4" />
                  <span>Download JSON Backup</span>
                </button>

                <label className="flex-1 bg-zinc-800 hover:bg-zinc-700 text-white font-bold px-4 py-2.5 rounded-xl text-xs flex items-center justify-center space-x-2 border border-white/10 cursor-pointer transition-all">
                  <Upload className="w-4 h-4 text-emerald-400" />
                  <span>Import JSON File</span>
                  <input
                    type="file"
                    accept=".json"
                    onChange={handleImportJSON}
                    className="hidden"
                    id="admin-import-json-input"
                  />
                </label>
              </div>
            </div>

            {/* Copy Code for Deployment */}
            <div className="p-6 rounded-3xl bg-zinc-900 border border-white/10 space-y-4 flex flex-col justify-between">
              <div className="space-y-2">
                <div className="flex items-center space-x-2 text-emerald-400">
                  <Copy className="w-5 h-5" />
                  <h4 className="font-bold text-white text-sm">Deploy Permanent Public Catalog</h4>
                </div>
                <p className="text-xs text-gray-400">
                  Copy the complete TypeScript code for <code className="text-emerald-300">src/data/initialMovies.ts</code> so that every visitor sees all added movies automatically.
                </p>
              </div>

              <button
                onClick={handleCopyTSCode}
                className="w-full bg-gradient-to-r from-emerald-600 to-emerald-500 hover:from-emerald-500 hover:to-emerald-400 text-black font-black px-4 py-3 rounded-xl text-xs uppercase tracking-wider flex items-center justify-center space-x-2 shadow-lg shadow-emerald-950/50 transition-all"
                id="admin-copy-ts-code-btn"
              >
                <Copy className="w-4 h-4 fill-black" />
                <span>Copy Code for initialMovies.ts</span>
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CREATE / EDIT MOVIE FORM MODAL */}
      {(isCreating || isEditing) && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md overflow-y-auto animate-fadeIn">
          <div className="relative w-full max-w-2xl bg-zinc-950 border border-white/15 rounded-3xl p-6 shadow-2xl my-8 space-y-6">
            <div className="flex items-center justify-between border-b border-white/10 pb-4">
              <h3 className="text-white font-bold text-lg">
                {isCreating ? 'Add New Title' : `Edit: ${formState.title}`}
              </h3>
              <button
                onClick={() => {
                  setIsCreating(false);
                  setIsEditing(null);
                }}
                className="p-1 text-gray-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleSaveMovieForm} className="space-y-4 text-xs">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Movie Title *</label>
                  <input
                    type="text"
                    required
                    value={formState.title || ''}
                    onChange={(e) => setFormState({ ...formState, title: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>

                <div>
                  <label className="text-gray-300 font-bold block mb-1">Content Type</label>
                  <select
                    value={formState.type || 'movie'}
                    onChange={(e) => setFormState({ ...formState, type: e.target.value as any })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                  >
                    <option value="movie">Movie</option>
                    <option value="tvshow">TV Show / Web Series</option>
                  </select>
                </div>
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Genres (comma separated)</label>
                <input
                  type="text"
                  value={formState.genres?.join(', ') || ''}
                  onChange={(e) =>
                    setFormState({
                      ...formState,
                      genres: e.target.value.split(',').map((g) => g.trim()).filter(Boolean),
                    })
                  }
                  placeholder="e.g. Action, Sci-Fi, Thriller"
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              <div>
                <label className="text-gray-300 font-bold block mb-1">Description / Plot</label>
                <textarea
                  rows={3}
                  value={formState.description || ''}
                  onChange={(e) => setFormState({ ...formState, description: e.target.value })}
                  className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                />
              </div>

              {/* Bunny Stream Integration & Direct Stream URL */}
              <div className="p-4 rounded-2xl bg-amber-950/20 border border-amber-500/30 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-amber-400 font-extrabold block uppercase tracking-wider text-[11px] font-mono">
                    Video Stream & CDN Settings
                  </span>
                  <button
                    type="button"
                    onClick={() =>
                      setFormState({
                        ...formState,
                        directStreamUrl:
                          'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4',
                      })
                    }
                    className="text-[10px] font-bold bg-amber-500/20 text-amber-300 hover:bg-amber-500 hover:text-black border border-amber-500/40 px-2.5 py-1 rounded-lg transition-colors"
                    title="Insert working sample MP4 URL"
                  >
                    + Insert Sample MP4 Link
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="text-gray-300 font-bold block mb-1 text-xs">
                      Bunny Stream Video ID
                    </label>
                    <input
                      type="text"
                      value={formState.bunnyVideoId || ''}
                      onChange={(e) => setFormState({ ...formState, bunnyVideoId: e.target.value })}
                      placeholder="e.g. 8f9b2c3a-1234-4567-89ab-cdef12345678"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Enter GUID from your Bunny.net Stream library dashboard.
                    </p>
                  </div>

                  <div>
                    <label className="text-gray-300 font-bold block mb-1 text-xs">
                      Direct Video URL (MP4 / YouTube / Google Drive)
                    </label>
                    <input
                      type="text"
                      value={formState.directStreamUrl || ''}
                      onChange={(e) => setFormState({ ...formState, directStreamUrl: e.target.value })}
                      placeholder="https://drive.google.com/file/d/.../view"
                      className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white font-mono text-xs focus:border-amber-500 focus:outline-none"
                    />
                    <p className="text-[10px] text-gray-400 mt-1">
                      Supports direct .mp4, HLS, YouTube links, or Google Drive links.
                    </p>
                  </div>
                </div>
              </div>

              {/* Images */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Poster Image URL *</label>
                  <input
                    type="text"
                    required
                    value={formState.posterUrl || ''}
                    onChange={(e) => setFormState({ ...formState, posterUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Banner Backdrop URL</label>
                  <input
                    type="text"
                    value={formState.bannerUrl || ''}
                    onChange={(e) => setFormState({ ...formState, bannerUrl: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2.5 text-white focus:border-red-500 focus:outline-none"
                  />
                </div>
              </div>

              {/* Specifications */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Year</label>
                  <input
                    type="number"
                    value={formState.releaseYear || 2024}
                    onChange={(e) => setFormState({ ...formState, releaseYear: parseInt(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Runtime</label>
                  <input
                    type="text"
                    value={formState.runtime || ''}
                    onChange={(e) => setFormState({ ...formState, runtime: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">IMDb Rating</label>
                  <input
                    type="number"
                    step="0.1"
                    value={formState.imdbRating || 8.0}
                    onChange={(e) => setFormState({ ...formState, imdbRating: parseFloat(e.target.value) })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                </div>
                <div>
                  <label className="text-gray-300 font-bold block mb-1">Language</label>
                  <input
                    type="text"
                    value={formState.language || 'English'}
                    onChange={(e) => setFormState({ ...formState, language: e.target.value })}
                    className="w-full bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              {/* Downloads */}
              <div className="space-y-2">
                <span className="text-gray-300 font-bold block">Download Quality URLs</span>
                <div className="grid grid-cols-3 gap-2">
                  <input
                    type="text"
                    placeholder="480p URL"
                    value={formState.downloadUrls?.quality480p || ''}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        downloadUrls: { ...formState.downloadUrls, quality480p: e.target.value },
                      })
                    }
                    className="bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="720p URL"
                    value={formState.downloadUrls?.quality720p || ''}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        downloadUrls: { ...formState.downloadUrls, quality720p: e.target.value },
                      })
                    }
                    className="bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                  <input
                    type="text"
                    placeholder="1080p URL"
                    value={formState.downloadUrls?.quality1080p || ''}
                    onChange={(e) =>
                      setFormState({
                        ...formState,
                        downloadUrls: { ...formState.downloadUrls, quality1080p: e.target.value },
                      })
                    }
                    className="bg-zinc-900 border border-white/15 rounded-xl p-2 text-white"
                  />
                </div>
              </div>

              {/* Toggles */}
              <div className="flex flex-wrap items-center gap-4 pt-2 border-t border-white/10">
                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isFeatured || false}
                    onChange={(e) => setFormState({ ...formState, isFeatured: e.target.checked })}
                    className="rounded border-white/20 accent-red-600"
                  />
                  <span className="text-gray-300 font-bold">Featured Spotlight</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isTrending || false}
                    onChange={(e) => setFormState({ ...formState, isTrending: e.target.checked })}
                    className="rounded border-white/20 accent-red-600"
                  />
                  <span className="text-gray-300 font-bold">Trending Tag</span>
                </label>

                <label className="flex items-center space-x-2 cursor-pointer">
                  <input
                    type="checkbox"
                    checked={formState.isLatest || false}
                    onChange={(e) => setFormState({ ...formState, isLatest: e.target.checked })}
                    className="rounded border-white/20 accent-red-600"
                  />
                  <span className="text-gray-300 font-bold">Latest Release</span>
                </label>
              </div>

              {/* Buttons */}
              <div className="pt-4 flex justify-end space-x-3">
                <button
                  type="button"
                  onClick={() => {
                    setIsCreating(false);
                    setIsEditing(null);
                  }}
                  className="px-4 py-2.5 rounded-xl bg-zinc-800 text-gray-300 hover:text-white font-bold"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  className="px-6 py-2.5 rounded-xl bg-[#E50914] hover:bg-red-700 text-white font-extrabold uppercase shadow-lg shadow-red-950/60 transition-all text-xs"
                  id="admin-save-movie-submit-btn"
                >
                  {isEditing ? 'Save Changes' : 'Publish New Movie'}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* CUSTOM DELETE MOVIE CONFIRMATION MODAL */}
      {deletingMovie && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-950 border border-red-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-red-500">
              <div className="w-10 h-10 rounded-2xl bg-red-950/80 border border-red-500/30 flex items-center justify-center">
                <Trash2 className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Delete Catalog Item</h3>
                <p className="text-xs text-gray-400">This action cannot be undone.</p>
              </div>
            </div>

            <div className="p-3.5 rounded-2xl bg-zinc-900 border border-white/10 flex items-center space-x-3">
              <img
                src={deletingMovie.posterUrl}
                alt={deletingMovie.title}
                className="w-10 h-14 object-cover rounded-lg"
              />
              <div>
                <p className="text-sm font-bold text-white">{deletingMovie.title}</p>
                <p className="text-[11px] text-gray-400 font-mono">
                  {deletingMovie.releaseYear} • {deletingMovie.type.toUpperCase()}
                </p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              Are you sure you want to delete <span className="font-bold text-white">"{deletingMovie.title}"</span> from your MovieFlix streaming catalog?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setDeletingMovie(null)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-gray-300 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmDeleteMovie}
                className="px-5 py-2.5 rounded-xl bg-red-600 hover:bg-red-700 text-white text-xs font-extrabold uppercase shadow-lg shadow-red-950/60 transition-all"
                id="confirm-delete-movie-btn"
              >
                Delete Title
              </button>
            </div>
          </div>
        </div>
      )}

      {/* CUSTOM RESET DEMO CATALOG CONFIRMATION MODAL */}
      {showResetConfirm && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/85 backdrop-blur-md animate-fadeIn">
          <div className="relative w-full max-w-md bg-zinc-950 border border-amber-500/40 rounded-3xl p-6 shadow-2xl space-y-4">
            <div className="flex items-center space-x-3 text-amber-400">
              <div className="w-10 h-10 rounded-2xl bg-amber-950/80 border border-amber-500/30 flex items-center justify-center">
                <RotateCcw className="w-5 h-5" />
              </div>
              <div>
                <h3 className="text-white font-bold text-base">Reset Demo Catalog</h3>
                <p className="text-xs text-gray-400">Restore factory movie & TV show titles.</p>
              </div>
            </div>

            <p className="text-xs text-gray-300">
              This will reset all custom added movies, edits, and Bunny Stream Video IDs back to the original demo catalog. Continue?
            </p>

            <div className="flex items-center justify-end space-x-3 pt-2">
              <button
                type="button"
                onClick={() => setShowResetConfirm(false)}
                className="px-4 py-2.5 rounded-xl bg-zinc-800 text-gray-300 hover:text-white text-xs font-bold"
              >
                Cancel
              </button>
              <button
                type="button"
                onClick={confirmResetCatalog}
                className="px-5 py-2.5 rounded-xl bg-amber-500 hover:bg-amber-400 text-black text-xs font-extrabold uppercase shadow-lg shadow-amber-500/20 transition-all"
                id="confirm-reset-catalog-btn"
              >
                Reset Catalog
              </button>
            </div>
          </div>
        </div>
      )}
      </div>
    </div>
  );
};
