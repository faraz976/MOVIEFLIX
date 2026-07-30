import React, { useState, useEffect } from 'react';
import {
  Film,
  Search,
  Home,
  Tv,
  Grid,
  Heart,
  Download,
  Clock,
  ShieldAlert,
  User,
  LogOut,
  Menu,
  X,
  PlayCircle
} from 'lucide-react';
import { UserProfile } from '../types';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  searchQuery: string;
  setSearchQuery: (q: string) => void;
  currentUser: UserProfile | null;
  onOpenAuth: () => void;
  onLogout: () => void;
  onOpenAdminLogin: () => void;
  isAdmin: boolean;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  searchQuery,
  setSearchQuery,
  currentUser,
  onOpenAuth,
  onLogout,
  onOpenAdminLogin,
  isAdmin,
}) => {
  const [isScrolled, setIsScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 40);
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navItems = [
    { id: 'home', label: 'Home', icon: Home },
    { id: 'movies', label: 'Movies', icon: Film },
    { id: 'tvshows', label: 'TV Shows', icon: Tv },
    { id: 'categories', label: 'Categories', icon: Grid },
    { id: 'favorites', label: 'My List', icon: Heart },
    { id: 'continue', label: 'Continue Watching', icon: Clock },
    { id: 'downloads', label: 'Downloads', icon: Download },
  ];

  const handleTabClick = (id: string) => {
    setActiveTab(id);
    setMobileMenuOpen(false);
  };

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      setActiveTab('search');
    }
  };

  return (
    <>
      {/* Top Desktop Navigation */}
      <header
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-300 ${
          isScrolled
            ? 'bg-[#050505]/95 backdrop-blur-md shadow-2xl border-b border-white/5 py-3.5'
            : 'bg-gradient-to-b from-black/90 via-black/50 to-transparent py-4'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 flex items-center justify-between">
          {/* Brand Logo */}
          <div className="flex items-center space-x-8">
            <button
              onClick={() => handleTabClick('home')}
              className="flex items-center space-x-2.5 group focus:outline-none"
              id="brand-logo-btn"
            >
              <div className="w-9 h-9 rounded-lg bg-gradient-to-tr from-[#E50914] to-red-500 flex items-center justify-center shadow-lg shadow-red-900/50 group-hover:scale-105 transition-transform duration-200">
                <PlayCircle className="w-5.5 h-5.5 text-white fill-white/20" />
              </div>
              <span className="text-2xl sm:text-3xl font-black tracking-tighter text-[#E50914] font-sans uppercase drop-shadow-md group-hover:text-red-500 transition-colors">
                MOVIE<span className="text-white font-black">FLIX</span>
              </span>
            </button>

            {/* Desktop Navigation Links */}
            <nav className="hidden lg:flex items-center space-x-1">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all duration-200 ${
                      isActive
                        ? 'bg-[#E50914] text-white font-bold shadow-md shadow-red-950/50'
                        : 'text-gray-300 hover:text-white hover:bg-white/10'
                    }`}
                    id={`nav-link-${item.id}`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </nav>
          </div>

          {/* Right Section: Search & Profile & Admin */}
          <div className="flex items-center space-x-3">
            {/* Live Search Form */}
            <form onSubmit={handleSearchSubmit} className="relative hidden sm:block">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'search') setActiveTab('search');
                }}
                placeholder="Search movies, genres..."
                className="w-48 md:w-64 bg-black/60 border border-white/20 rounded-full py-1.5 pl-9 pr-4 text-xs text-white placeholder-gray-400 focus:outline-none focus:border-red-500 focus:w-72 focus:bg-black/90 transition-all duration-300 shadow-inner"
                id="search-input-header"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-2.5" />
            </form>

            {/* Admin Dashboard / Button */}
            {isAdmin ? (
              <button
                onClick={() => handleTabClick('admin')}
                className={`flex items-center space-x-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                  activeTab === 'admin'
                    ? 'bg-amber-600 text-white shadow-lg shadow-amber-600/30'
                    : 'bg-amber-500/20 text-amber-400 hover:bg-amber-500/30 border border-amber-500/40'
                }`}
                id="admin-dashboard-btn"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Panel</span>
              </button>
            ) : (
              <button
                onClick={onOpenAdminLogin}
                className="flex items-center space-x-1.5 text-xs font-bold text-amber-400 bg-amber-500/10 hover:bg-amber-500/20 px-3 py-1.5 rounded-lg border border-amber-500/30 transition-all shadow-sm"
                id="admin-login-nav-btn"
              >
                <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />
                <span>Admin Login</span>
              </button>
            )}

            {/* User Profile / Auth */}
            {currentUser ? (
              <div className="flex items-center space-x-2 bg-white/10 px-3 py-1.5 rounded-full border border-white/10">
                <div className="w-6 h-6 rounded-full bg-red-600 text-white font-bold text-xs flex items-center justify-center">
                  {currentUser.displayName ? currentUser.displayName.charAt(0).toUpperCase() : 'U'}
                </div>
                <span className="text-xs font-medium text-white max-w-[90px] truncate hidden xl:inline">
                  {currentUser.displayName || currentUser.email || 'User'}
                </span>
                <button
                  onClick={onLogout}
                  title="Logout"
                  className="text-gray-400 hover:text-white transition-colors pl-1"
                  id="user-logout-btn"
                >
                  <LogOut className="w-3.5 h-3.5" />
                </button>
              </div>
            ) : (
              <button
                onClick={onOpenAuth}
                className="flex items-center space-x-1.5 bg-[#E50914] hover:bg-red-700 text-white px-4 py-1.5 rounded-full text-xs font-bold shadow-md shadow-red-950/50 transition-all"
                id="sign-in-nav-btn"
              >
                <User className="w-3.5 h-3.5" />
                <span>Sign In</span>
              </button>
            )}

            {/* Mobile Hamburger Toggle */}
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="lg:hidden p-2 text-gray-300 hover:text-white focus:outline-none"
              id="mobile-menu-toggle-btn"
            >
              {mobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
            </button>
          </div>
        </div>

        {/* Mobile Search & Dropdown Menu */}
        {mobileMenuOpen && (
          <div className="lg:hidden bg-[#050505]/95 border-b border-white/10 px-4 pt-3 pb-6 space-y-3 mt-2 backdrop-blur-xl animate-fadeIn">
            {/* Mobile Search input */}
            <form onSubmit={handleSearchSubmit} className="relative">
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value);
                  if (activeTab !== 'search') setActiveTab('search');
                }}
                placeholder="Search movies, tv shows, genres..."
                className="w-full bg-[#111] border border-white/20 rounded-xl py-2 pl-10 pr-4 text-sm text-white focus:outline-none focus:border-[#E50914]"
              />
              <Search className="w-4 h-4 text-gray-400 absolute left-3.5 top-3" />
            </form>

            <div className="grid grid-cols-2 gap-2 pt-2">
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => handleTabClick(item.id)}
                    className={`flex items-center space-x-2 px-3 py-2.5 rounded-lg text-sm font-medium ${
                      isActive
                        ? 'bg-[#E50914] text-white font-bold'
                        : 'bg-white/5 text-gray-300 hover:bg-white/10'
                    }`}
                  >
                    <Icon className="w-4 h-4" />
                    <span>{item.label}</span>
                  </button>
                );
              })}
            </div>

            <div className="pt-2 border-t border-white/10 flex justify-between items-center">
              {!isAdmin && (
                <button
                  onClick={() => {
                    setMobileMenuOpen(false);
                    onOpenAdminLogin();
                  }}
                  className="text-xs text-amber-400 bg-amber-500/10 px-3 py-2 rounded-lg border border-amber-500/30"
                >
                  Admin Access
                </button>
              )}
              {isAdmin && (
                <button
                  onClick={() => handleTabClick('admin')}
                  className="text-xs text-white bg-amber-600 px-3 py-2 rounded-lg font-bold"
                >
                  Open Admin Dashboard
                </button>
              )}
            </div>
          </div>
        )}
      </header>

      {/* Mobile Bottom Fixed Bar */}
      <div className="lg:hidden fixed bottom-0 left-0 right-0 z-40 bg-[#050505]/95 border-t border-white/10 px-2 py-1.5 backdrop-blur-xl flex justify-around items-center">
        {navItems.slice(0, 5).map((item) => {
          const Icon = item.icon;
          const isActive = activeTab === item.id;
          return (
            <button
              key={item.id}
              onClick={() => setActiveTab(item.id)}
              className={`flex flex-col items-center py-1 px-2 rounded-lg text-[10px] font-medium transition-colors ${
                isActive ? 'text-[#E50914] font-bold' : 'text-gray-400 hover:text-white'
              }`}
            >
              <Icon className={`w-5 h-5 ${isActive ? 'scale-110 text-[#E50914]' : ''}`} />
              <span className="mt-0.5">{item.label}</span>
            </button>
          );
        })}
      </div>
    </>
  );
};
