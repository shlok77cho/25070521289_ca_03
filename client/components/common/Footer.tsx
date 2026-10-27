import React from 'react';
import type { DbStatus } from '../../types/index.ts';

interface FooterProps {
  dbStatus: DbStatus | null;
  onNavigate: (tab: string) => void;
}

export const Footer: React.FC<FooterProps> = ({ dbStatus, onNavigate }) => {
  return (
    <footer className="bg-slate-900 text-slate-300 border-t border-slate-800 mt-24">
      <div className="max-w-7xl mx-auto px-6 py-12">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          <div className="md:col-span-2 space-y-3">
            <span className="text-xl font-bold text-white font-display">PawExcellence</span>
            <p className="text-sm text-slate-400 max-w-md leading-relaxed">
              The regional standard for canine, feline, and companion showmanship. Supporting purebred conformation, agility steeplechase, and ethical companion exhibitions across the Pacific Northwest circuit.
            </p>
            <div className="pt-2 text-xs text-slate-500 flex items-center gap-2">
              <span>Sanctioned by Regional Pet Show Council</span>
              <span aria-hidden="true">·</span>
              <span>Full MongoDB Schema Architecture</span>
            </div>
          </div>

          <div>
            <span className="text-xs font-semibold text-white tracking-wider uppercase block mb-3">
              Competitions
            </span>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <button
                  onClick={() => onNavigate('calendar')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Event Calendar & Rings
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('register')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Entry Submission Form
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('standings')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Season Points & Rosettes
                </button>
              </li>
              <li>
                <button
                  onClick={() => onNavigate('directory')}
                  className="hover:text-white transition-colors cursor-pointer text-left"
                >
                  Exhibitor Roster
                </button>
              </li>
            </ul>
          </div>

          <div>
            <span className="text-xs font-semibold text-white tracking-wider uppercase block mb-3">
              Platform & Database
            </span>
            <ul className="space-y-2 text-sm text-slate-400">
              <li>
                <span className="text-slate-300">Backend: Node.js Express 5.0</span>
              </li>
              <li>
                <span className="text-slate-300">Database: MongoDB 7.7.0</span>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  {dbStatus?.mode || 'Connected to MongoDB Database'}
                </span>
              </li>
              <li>
                <span className="text-xs text-slate-500">
                  Collections: competitions, gallery, registrations, users
                </span>
              </li>
            </ul>
          </div>
        </div>

        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 PawExcellence Championship Registry. All rights reserved.</p>
          <div className="flex items-center gap-4">
            <span>Ring Safety Guidelines</span>
            <span aria-hidden="true">·</span>
            <span>Veterinary Protocols</span>
            <span aria-hidden="true">·</span>
            <span>Judge Code of Ethics</span>
          </div>
        </div>
      </div>
    </footer>
  );
};
