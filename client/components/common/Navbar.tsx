import React from 'react';
import type { User } from '../../types/index.ts';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  currentUser: User | null;
  onOpenAuth: () => void;
  onOpenRegister: () => void;
  onLogout: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({
  activeTab,
  setActiveTab,
  currentUser,
  onOpenAuth,
  onOpenRegister,
  onLogout,
}) => {
  return (
    <header className="sticky top-0 z-40 bg-white/95 backdrop-blur-md border-b border-slate-200">
      <div className="max-w-7xl mx-auto flex items-center justify-between gap-8 px-6 py-4">
        {/* Zone 1: Single text element wordmark */}
        <button
          onClick={() => setActiveTab('home')}
          className="text-xl font-extrabold tracking-tight text-slate-900 font-display whitespace-nowrap shrink-0 text-left cursor-pointer"
        >
          PawExcellence
        </button>

        {/* Zone 2: 4-5 concise single-line text navigation links */}
        <nav className="hidden md:flex items-center gap-7 text-sm font-medium text-slate-600">
          <button
            onClick={() => setActiveTab('calendar')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'calendar'
                ? 'text-slate-900 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Competitions
          </button>
          <button
            onClick={() => setActiveTab('gallery')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'gallery'
                ? 'text-slate-900 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Photo Gallery
          </button>
          <button
            onClick={() => setActiveTab('register')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'register'
                ? 'text-slate-900 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Registration
          </button>
          <button
            onClick={() => setActiveTab('standings')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'standings'
                ? 'text-slate-900 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Standings
          </button>
          <button
            onClick={() => setActiveTab('directory')}
            className={`transition-colors whitespace-nowrap shrink-0 pb-0.5 border-b-2 cursor-pointer ${
              activeTab === 'directory'
                ? 'text-slate-900 border-amber-600 font-semibold'
                : 'border-transparent hover:text-slate-900 hover:border-slate-300'
            }`}
          >
            Exhibitor Roster
          </button>
        </nav>

        {/* Zone 3: 1 primary action */}
        <div className="flex items-center gap-3 shrink-0">
          {currentUser ? (
            <div className="flex items-center gap-3">
              <span className="hidden sm:inline text-xs text-slate-600 font-medium">
                {currentUser.name} ({currentUser.role})
              </span>
              <button
                onClick={onLogout}
                className="text-xs text-slate-500 hover:text-slate-900 underline transition-colors cursor-pointer"
              >
                Sign Out
              </button>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                Register Pet
              </button>
            </div>
          ) : (
            <div className="flex items-center gap-3">
              <button
                onClick={onOpenAuth}
                className="text-xs font-medium text-slate-700 hover:text-slate-900 px-3 py-1.5 transition-colors cursor-pointer"
              >
                Exhibitor Login
              </button>
              <button
                onClick={onOpenRegister}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors whitespace-nowrap shrink-0 cursor-pointer shadow-sm"
              >
                Register Pet
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
