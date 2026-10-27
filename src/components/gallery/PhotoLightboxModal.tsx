import React from 'react';
import { X, Heart, Award, MapPin, Calendar, User, ShieldCheck } from 'lucide-react';
import type { GalleryItem } from '../../types/index.ts';

interface PhotoLightboxModalProps {
  item: GalleryItem | null;
  onClose: () => void;
  onVote: (id: string) => void;
}

export const PhotoLightboxModal: React.FC<PhotoLightboxModalProps> = ({
  item,
  onClose,
  onVote,
}) => {
  if (!item) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-950/80 backdrop-blur-md animate-fade-in">
      <div className="bg-white rounded-2xl max-w-4xl w-full max-h-[92vh] overflow-hidden shadow-2xl border border-slate-200 flex flex-col md:flex-row">
        {/* Left Side: Photo Frame */}
        <div className="md:w-3/5 bg-slate-900 relative flex items-center justify-center min-h-[320px] md:min-h-[500px]">
          <img
            src={item.imageUrl}
            alt={item.petName}
            className="w-full h-full object-contain max-h-[550px]"
            referrerPolicy="no-referrer"
          />
          <div className="absolute top-4 left-4 bg-slate-900/70 backdrop-blur-sm px-3 py-1 rounded text-white text-xs font-medium">
            {item.category}
          </div>
        </div>

        {/* Right Side: Details & Story */}
        <div className="md:w-2/5 p-6 flex flex-col justify-between overflow-y-auto max-h-[550px] bg-white">
          <div className="space-y-5">
            {/* Header */}
            <div className="flex items-start justify-between gap-3">
              <div>
                <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider">
                  {item.species} · {item.breed}
                </div>
                <h2 className="text-2xl font-bold text-slate-900 font-display mt-0.5">
                  {item.petName}
                </h2>
              </div>
              <button
                onClick={onClose}
                className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Title & Backstory */}
            <div className="space-y-2">
              <h3 className="text-sm font-semibold text-slate-800">
                {item.title}
              </h3>
              <p className="text-xs text-slate-600 leading-relaxed">
                {item.story}
              </p>
            </div>

            {/* Awards & Ribbons */}
            <div>
              <h4 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
                <Award className="w-3.5 h-3.5 text-amber-600" />
                <span>Award Rosettes & Titles</span>
              </h4>
              <div className="space-y-1.5">
                {item.ribbons.map((ribbon, idx) => (
                  <div
                    key={idx}
                    className="flex items-center gap-2 p-2 rounded-lg bg-amber-50/70 border border-amber-200/60 text-xs font-medium text-amber-900"
                  >
                    <span className="w-1.5 h-1.5 rounded-full bg-amber-600 shrink-0" />
                    <span>{ribbon}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Metadata */}
            <div className="space-y-2 pt-2 border-t border-slate-100 text-xs text-slate-500">
              <div className="flex items-center gap-2">
                <User className="w-3.5 h-3.5 text-slate-400" />
                <span>Handler / Breeder: <strong className="text-slate-700">{item.ownerName}</strong></span>
              </div>
              <div className="flex items-center gap-2">
                <MapPin className="w-3.5 h-3.5 text-slate-400" />
                <span>Origin Circuit: {item.location}</span>
              </div>
              {item.competitionTitle && (
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-3.5 h-3.5 text-slate-400" />
                  <span>Show Ring: {item.competitionTitle}</span>
                </div>
              )}
              {item.judgeScore && (
                <div className="flex items-center gap-2">
                  <Calendar className="w-3.5 h-3.5 text-slate-400" />
                  <span>Conformation Evaluation: <strong className="text-slate-800 tabular-nums">{item.judgeScore}/100</strong></span>
                </div>
              )}
            </div>
          </div>

          {/* Voting Action */}
          <div className="pt-6 border-t border-slate-100 flex items-center justify-between gap-4 mt-4">
            <div className="text-xs text-slate-500">
              <span className="text-slate-900 font-bold tabular-nums text-base mr-1">
                {item.votes}
              </span>
              <span>Community Votes</span>
            </div>

            <button
              onClick={() => onVote(item.id)}
              className="flex items-center gap-2 px-4 py-2.5 bg-rose-50 text-rose-700 border border-rose-200/80 rounded-lg hover:bg-rose-100 transition-colors text-xs font-semibold cursor-pointer"
            >
              <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
              <span>Vote For {item.petName}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
