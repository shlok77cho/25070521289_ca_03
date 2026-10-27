import React from 'react';
import { X, Calendar, Clock, MapPin, Award, UserCheck, ShieldAlert, CheckCircle, ExternalLink } from 'lucide-react';
import type { Competition } from '../../types/index.ts';

interface CompetitionDetailsModalProps {
  competition: Competition | null;
  onClose: () => void;
  onRegister: (competition: Competition) => void;
}

export const CompetitionDetailsModal: React.FC<CompetitionDetailsModalProps> = ({
  competition,
  onClose,
  onRegister,
}) => {
  if (!competition) return null;

  const mapsQuery = encodeURIComponent(`${competition.venue}, ${competition.address}, ${competition.location}`);
  const googleMapsUrl = `https://www.google.com/maps/search/?api=1&query=${mapsQuery}`;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        {/* Header */}
        <div className="p-6 border-b border-slate-100 flex items-start justify-between gap-4">
          <div>
            <div className="text-xs font-semibold text-amber-700 uppercase tracking-wider mb-1">
              {competition.theme}
            </div>
            <h2 className="text-2xl font-bold text-slate-900 font-display">
              {competition.title}
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Content Body */}
        <div className="p-6 space-y-6 text-sm text-slate-600">
          {/* Key Schedule & Venue Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 p-4 rounded-xl bg-slate-50 border border-slate-200/70">
            <div className="flex items-start gap-3">
              <Calendar className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900">Event Date & Registration</div>
                <div className="text-slate-700 font-medium">{competition.date}</div>
                <div className="text-xs text-slate-500 mt-0.5">Deadline: {competition.registrationDeadline}</div>
              </div>
            </div>

            <div className="flex items-start gap-3">
              <Clock className="w-5 h-5 text-slate-700 shrink-0 mt-0.5" />
              <div>
                <div className="text-xs font-semibold text-slate-900">Ring Schedule</div>
                <div className="text-slate-700 font-medium">{competition.time}</div>
                <div className="text-xs text-slate-500 mt-0.5">Check-in opens 60m prior</div>
              </div>
            </div>

            <div className="sm:col-span-2 p-3.5 rounded-lg bg-white border border-slate-200/90 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-start gap-3">
                <MapPin className="w-5 h-5 text-amber-700 shrink-0 mt-0.5" />
                <div>
                  <div className="text-xs font-semibold text-slate-900">Venue Location & Address</div>
                  <div className="text-slate-800 font-medium">{competition.venue} · {competition.location}</div>
                  <div className="text-xs text-slate-500 mt-0.5">{competition.address}</div>
                </div>
              </div>

              <a
                href={googleMapsUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-slate-800 bg-slate-50 border border-slate-300 rounded-lg hover:bg-slate-100 hover:text-slate-900 hover:border-slate-400 transition-colors shadow-2xs self-start sm:self-center shrink-0 cursor-pointer"
                title="Open location in Google Maps"
              >
                <MapPin className="w-3.5 h-3.5 text-amber-600" />
                <span>View on Map</span>
                <ExternalLink className="w-3 h-3 text-slate-400" />
              </a>
            </div>
          </div>

          {/* Description */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              About This Competition
            </h3>
            <p className="leading-relaxed text-slate-700">
              {competition.description}
            </p>
          </div>

          {/* Featured Divisions */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
              Competitive Classes & Divisions
            </h3>
            <div className="flex flex-wrap gap-2">
              {competition.categories.map((cat, idx) => (
                <span
                  key={idx}
                  className="px-3 py-1.5 rounded-lg text-xs font-medium bg-slate-100 text-slate-800 border border-slate-200"
                >
                  {cat}
                </span>
              ))}
            </div>
          </div>

          {/* Judges Panel */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <UserCheck className="w-4 h-4 text-slate-700" />
              <span>Presiding Judges Panel</span>
            </h3>
            <div className="space-y-2">
              {competition.judges.map((judge, idx) => (
                <div key={idx} className="p-3 rounded-lg border border-slate-200/80 bg-white flex items-center justify-between">
                  <div>
                    <div className="font-semibold text-slate-900 text-xs">{judge.name}</div>
                    <div className="text-xs text-slate-500">{judge.title}</div>
                  </div>
                  <div className="text-xs text-slate-600 bg-slate-50 px-2 py-1 rounded border border-slate-200">
                    {judge.certification}
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Ring Protocols & Requirements */}
          <div>
            <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2 flex items-center gap-1.5">
              <ShieldAlert className="w-4 h-4 text-slate-700" />
              <span>Veterinary & Ring Protocols</span>
            </h3>
            <ul className="space-y-1.5 text-xs text-slate-600">
              {competition.rules.map((rule, idx) => (
                <li key={idx} className="flex items-start gap-2">
                  <CheckCircle className="w-3.5 h-3.5 text-emerald-600 shrink-0 mt-0.5" />
                  <span>{rule}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* Fee & Prize Overview */}
          <div className="flex items-center justify-between p-4 bg-amber-50/60 rounded-xl border border-amber-200/60">
            <div>
              <div className="text-xs text-amber-900 font-medium">Standard Entry Fee</div>
              <div className="text-xl font-bold text-slate-900 tabular-nums font-display">
                ${competition.entryFee} <span className="text-xs font-normal text-slate-500">per class entry</span>
              </div>
            </div>
            <div className="text-right">
              <div className="text-xs text-amber-900 font-medium">Prize Pool & Awards</div>
              <div className="text-sm font-semibold text-amber-800">
                {competition.prizePool}
              </div>
            </div>
          </div>
        </div>

        {/* Modal Footer CTA */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-4">
          <div className="text-xs text-slate-500">
            <span>Capacity: </span>
            <strong className="text-slate-800 tabular-nums">
              {competition.registeredCount}/{competition.capacity} Entrants
            </strong>
          </div>

          <div className="flex items-center gap-3">
            <a
              href={googleMapsUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="hidden sm:inline-flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 hover:text-slate-900 transition-colors shadow-2xs cursor-pointer"
            >
              <MapPin className="w-3.5 h-3.5 text-amber-600" />
              <span>View on Map</span>
              <ExternalLink className="w-3 h-3 text-slate-400" />
            </a>
            <button
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Close
            </button>
            <button
              onClick={() => {
                onClose();
                onRegister(competition);
              }}
              className="px-5 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer"
            >
              Proceed to Registration
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
