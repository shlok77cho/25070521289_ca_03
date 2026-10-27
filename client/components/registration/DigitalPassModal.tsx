import React from 'react';
import { X, CheckCircle, Award, Calendar, MapPin, Printer, QrCode } from 'lucide-react';
import type { Registration } from '../../types/index.ts';

interface DigitalPassModalProps {
  registration: Registration | null;
  onClose: () => void;
  onViewRoster: () => void;
}

export const DigitalPassModal: React.FC<DigitalPassModalProps> = ({
  registration,
  onClose,
  onViewRoster,
}) => {
  if (!registration) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-lg w-full overflow-hidden shadow-2xl border border-slate-200">
        {/* Pass Header */}
        <div className="p-6 bg-slate-900 text-white flex items-start justify-between">
          <div className="space-y-1">
            <div className="flex items-center gap-2 text-amber-400 text-xs font-semibold tracking-wider uppercase">
              <CheckCircle className="w-4 h-4" />
              <span>Official Ring Entry Confirmed</span>
            </div>
            <h2 className="text-xl font-bold font-display">
              Exhibitor Ring Pass
            </h2>
            <div className="text-xs text-slate-300 font-mono">
              Pass ID: {registration.registrationCode}
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-1 text-slate-400 hover:text-white rounded-lg transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Pass Card Details */}
        <div className="p-6 space-y-6 text-xs text-slate-600">
          {/* Main Pet Banner */}
          <div className="p-4 rounded-xl bg-amber-50/70 border border-amber-200/80 flex items-center justify-between">
            <div>
              <span className="text-[11px] text-amber-900 font-semibold uppercase tracking-wider block">
                Competitor Name
              </span>
              <span className="text-2xl font-bold text-slate-900 font-display">
                {registration.petName}
              </span>
              <span className="text-xs text-slate-600 block mt-0.5">
                {registration.species} · {registration.breed} ({registration.gender}, {registration.ageYears} yrs)
              </span>
            </div>

            <div className="text-right">
              <span className="text-[10px] text-slate-500 uppercase block">Ring Status</span>
              <span className="inline-block mt-0.5 px-2.5 py-1 rounded bg-emerald-100 text-emerald-800 font-semibold text-xs border border-emerald-200">
                {registration.status}
              </span>
            </div>
          </div>

          {/* Division & Competition */}
          <div className="grid grid-cols-2 gap-4 pb-4 border-b border-slate-100">
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Competition</span>
              <span className="font-semibold text-slate-800 block text-xs">
                {registration.competitionTitle}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Division & Class</span>
              <span className="font-semibold text-slate-800 block text-xs">
                {registration.division} · {registration.classCategory}
              </span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Exhibitor / Owner</span>
              <span className="font-semibold text-slate-800 block text-xs">
                {registration.ownerName}
              </span>
              <span className="text-[11px] text-slate-500">{registration.ownerEmail}</span>
            </div>
            <div>
              <span className="text-slate-400 block mb-0.5 font-medium">Club Affiliation</span>
              <span className="font-semibold text-slate-800 block text-xs">
                {registration.clubAffiliation || 'Independent Exhibitor'}
              </span>
            </div>
          </div>

          {/* Simulated Barcode & Check-in instructions */}
          <div className="p-4 bg-slate-50 rounded-xl border border-slate-200/70 text-center space-y-3">
            <div className="flex justify-center items-center gap-1 font-mono tracking-widest text-slate-800 text-sm font-bold">
              ||| | | |||| || ||| | ||| |||| | | |||
            </div>
            <div className="text-[11px] font-mono text-slate-500">
              {registration.registrationCode}
            </div>
            <p className="text-[11px] text-slate-500">
              Present this digital pass or registration code at the ring stewards table during morning benching check-in.
            </p>
          </div>
        </div>

        {/* Modal Actions */}
        <div className="p-6 bg-slate-50 border-t border-slate-200 flex items-center justify-between gap-3">
          <button
            onClick={() => window.print()}
            className="flex items-center gap-1.5 px-3.5 py-2 text-xs font-medium text-slate-700 bg-white border border-slate-200 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <Printer className="w-3.5 h-3.5" />
            <span>Print Pass</span>
          </button>

          <div className="flex items-center gap-2">
            <button
              onClick={() => {
                onClose();
                onViewRoster();
              }}
              className="px-4 py-2 text-xs font-medium text-slate-700 hover:text-slate-900 transition-colors cursor-pointer"
            >
              View in Roster
            </button>
            <button
              onClick={onClose}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
