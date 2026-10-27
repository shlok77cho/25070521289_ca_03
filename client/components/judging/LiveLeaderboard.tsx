import React from 'react';
import { Award, Star, CheckCircle, Shield, Trophy } from 'lucide-react';
import type { GalleryItem } from '../../types/index.ts';

interface LiveLeaderboardProps {
  galleryItems: GalleryItem[];
  onSelectPet: (item: GalleryItem) => void;
  onOpenRegister: () => void;
}

export const LiveLeaderboard: React.FC<LiveLeaderboardProps> = ({
  galleryItems,
  onSelectPet,
  onOpenRegister,
}) => {
  // Sort by votes
  const sortedChampions = [...galleryItems].sort((a, b) => b.votes - a.votes);

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              Circuit Standings & Evaluation Criteria
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Season Points & Championship Laurels
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Current standings across regional show rings, top-voted companions, and official AKC & FIFe standard evaluation rubrics.
            </p>
          </div>

          <button
            onClick={onOpenRegister}
            className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer shrink-0"
          >
            Enter Season Circuit
          </button>
        </div>

        {/* Podium Top 3 Standings */}
        <div className="mt-10">
          <h3 className="text-sm font-bold text-slate-900 uppercase tracking-wider mb-5 flex items-center gap-2">
            <Trophy className="w-4 h-4 text-amber-600" />
            <span>Grand Circuit Leaderboard · Top Competitors</span>
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {sortedChampions.slice(0, 3).map((champion, rank) => (
              <div
                key={champion.id}
                onClick={() => onSelectPet(champion)}
                className={`relative rounded-2xl p-6 border transition-all cursor-pointer flex flex-col justify-between ${
                  rank === 0
                    ? 'bg-amber-50/70 border-amber-300/80 shadow-sm'
                    : 'bg-white border-slate-200 shadow-xs hover:border-slate-300'
                }`}
              >
                <div className="space-y-4">
                  <div className="flex items-center justify-between">
                    <span
                      className={`text-xs font-bold uppercase tracking-wider px-2.5 py-1 rounded ${
                        rank === 0
                          ? 'bg-amber-600 text-white'
                          : rank === 1
                          ? 'bg-slate-800 text-white'
                          : 'bg-slate-200 text-slate-800'
                      }`}
                    >
                      {rank === 0 ? '1st Place · Best in Show' : rank === 1 ? '2nd Place · Reserve' : '3rd Place'}
                    </span>
                    <span className="text-xs text-slate-500 font-medium tabular-nums">
                      {champion.votes} Votes
                    </span>
                  </div>

                  <div className="aspect-4/3 rounded-xl overflow-hidden bg-slate-100 border border-slate-200">
                    <img
                      src={champion.imageUrl}
                      alt={champion.petName}
                      className="w-full h-full object-cover"
                      referrerPolicy="no-referrer"
                    />
                  </div>

                  <div>
                    <div className="text-xs text-slate-500">
                      {champion.species} · {champion.breed}
                    </div>
                    <div className="text-xl font-bold text-slate-900 font-display mt-0.5">
                      {champion.petName}
                    </div>
                    <div className="text-xs text-slate-600 mt-1">
                      Handler: <strong className="text-slate-800">{champion.ownerName}</strong>
                    </div>
                  </div>
                </div>

                <div className="pt-4 mt-4 border-t border-slate-200/60 flex items-center justify-between text-xs">
                  <span className="text-amber-800 font-medium">{champion.category}</span>
                  <span className="text-slate-500">Click to inspect</span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Judging Rubric Details */}
        <div className="mt-16 pt-12 border-t border-slate-200">
          <h3 className="text-lg font-bold text-slate-900 font-display mb-6">
            Official Ring Judging & Conformation Rubric
          </h3>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                01. Structure & Gait (30%)
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Balanced Biomechanics</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Smooth reach and drive in the ring triangle. Skeletal alignment, correct topline, angulation, and effortless rhythmic locomotion.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                02. Breed Standard (30%)
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Head, Eye & Silhouette</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Adherence to certified breed standards including ear placement, cranial proportions, ocular clarity, muzzle depth, and tail carriage.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                03. Coat & Condition (25%)
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Texture & Artistry</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Optimal coat density, skin health, clean hand-scissoring or natural breed presentation without artificial dyes or prohibited aids.
              </p>
            </div>

            <div className="p-5 rounded-2xl bg-slate-50 border border-slate-200 space-y-2">
              <div className="text-xs font-bold text-amber-800 uppercase tracking-wider">
                04. Ring Temperament (15%)
              </div>
              <h4 className="font-semibold text-slate-900 text-sm">Poise & Composure</h4>
              <p className="text-xs text-slate-600 leading-relaxed">
                Confident, alert, and calm disposition during judge examination. Friendly handler connection and dignified showmanship.
              </p>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
