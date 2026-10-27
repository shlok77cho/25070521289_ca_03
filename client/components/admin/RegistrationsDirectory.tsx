import React, { useState } from 'react';
import { Search, UserCheck, ShieldCheck, Check, QrCode, FileText, Trash2 } from 'lucide-react';
import type { Registration, Competition, User } from '../../types/index.ts';
import { DigitalPassModal } from '../registration/DigitalPassModal.tsx';

interface RegistrationsDirectoryProps {
  registrations: Registration[];
  competitions: Competition[];
  loading: boolean;
  currentUser?: User | null;
  onUpdateStatus: (id: string, status: string) => Promise<void>;
  onCancelRegistration: (id: string) => Promise<void>;
}

export const RegistrationsDirectory: React.FC<RegistrationsDirectoryProps> = ({
  registrations,
  competitions,
  loading,
  currentUser,
  onUpdateStatus,
  onCancelRegistration,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCompFilter, setSelectedCompFilter] = useState('all');
  const [inspectingPass, setInspectingPass] = useState<Registration | null>(null);

  const filteredRegistrations = registrations.filter((reg) => {
    const matchesComp =
      selectedCompFilter === 'all' || reg.competitionId === selectedCompFilter;
    const q = searchTerm.toLowerCase();
    const matchesSearch =
      reg.petName.toLowerCase().includes(q) ||
      reg.ownerName.toLowerCase().includes(q) ||
      reg.breed.toLowerCase().includes(q) ||
      reg.registrationCode.toLowerCase().includes(q);

    return matchesComp && matchesSearch;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              Ring Check-In & Exhibitor Roster
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Official Entrant Directory
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Inspect verified competitor passes, manage bench check-in status, and review active entries across all sanctioned events.
            </p>
          </div>

          <div className="text-xs text-slate-500 font-medium">
            <span>Total Registered Entrants: </span>
            <strong className="text-slate-900 tabular-nums text-sm font-semibold">
              {registrations.length}
            </strong>
          </div>
        </div>

        {/* Active Role Indicator */}
        {currentUser && (
          <div className="mt-6 p-4 rounded-xl border border-slate-200 bg-white flex items-center justify-between text-xs shadow-2xs">
            <div className="flex items-center gap-2.5">
              <span className={`w-2 h-2 rounded-full ${currentUser.role === 'judge' ? 'bg-amber-600' : 'bg-emerald-500'}`} />
              <span className="text-slate-600">
                Active Session: <strong className="text-slate-900">{currentUser.name}</strong> ({currentUser.role === 'judge' ? 'Official Ring Judge' : 'Verified Exhibitor'})
              </span>
            </div>
            {currentUser.role === 'judge' ? (
              <span className="font-semibold text-amber-800 bg-amber-50 px-2.5 py-1 rounded border border-amber-200">
                Judge Ring Authority Enabled
              </span>
            ) : (
              <span className="text-slate-500">
                Exhibitor Portal
              </span>
            )}
          </div>
        )}

        {/* Filters */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <label className="text-xs font-semibold text-slate-700 whitespace-nowrap">Filter Event:</label>
            <select
              value={selectedCompFilter}
              onChange={(e) => setSelectedCompFilter(e.target.value)}
              className="px-3 py-1.5 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 focus:outline-none focus:ring-1 focus:ring-slate-900"
            >
              <option value="all">All Championship Events</option>
              {competitions.map((comp) => (
                <option key={comp.id} value={comp.id}>
                  {comp.title}
                </option>
              ))}
            </select>
          </div>

          <div className="relative w-full md:w-72">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search by code, pet, owner, breed..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full pl-9 pr-3 py-2 text-xs bg-white border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-20 text-center text-sm text-slate-500">
            Querying MongoDB registrations collection...
          </div>
        )}

        {/* Empty */}
        {!loading && filteredRegistrations.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 mt-8 p-8">
            <FileText className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">No entrants found</h3>
            <p className="text-xs text-slate-500 mt-1">Try another search term or register a pet.</p>
          </div>
        )}

        {/* Entrants Table */}
        {!loading && filteredRegistrations.length > 0 && (
          <div className="mt-8 bg-white rounded-2xl border border-slate-200 shadow-xs overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-left text-xs">
                <thead className="bg-slate-50 border-b border-slate-200 text-slate-500 font-semibold uppercase tracking-wider text-[11px]">
                  <tr>
                    <th className="py-3.5 px-4">Pass Code</th>
                    <th className="py-3.5 px-4">Pet Competitor</th>
                    <th className="py-3.5 px-4">Division & Class</th>
                    <th className="py-3.5 px-4">Exhibitor / Club</th>
                    <th className="py-3.5 px-4">Event</th>
                    <th className="py-3.5 px-4">Status</th>
                    <th className="py-3.5 px-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 text-slate-700">
                  {filteredRegistrations.map((reg) => (
                    <tr key={reg.id} className="hover:bg-slate-50/70 transition-colors">
                      {/* Pass Code */}
                      <td className="py-3.5 px-4 font-mono font-bold text-slate-900 whitespace-nowrap">
                        {reg.registrationCode}
                      </td>

                      {/* Pet */}
                      <td className="py-3.5 px-4">
                        <div className="font-bold text-slate-900 font-display text-sm">
                          {reg.petName}
                        </div>
                        <div className="text-[11px] text-slate-500">
                          {reg.species} · {reg.breed} ({reg.gender}, {reg.ageYears}y)
                        </div>
                      </td>

                      {/* Division */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <div className="font-medium text-slate-900">{reg.division}</div>
                        <div className="text-[11px] text-slate-500">{reg.classCategory}</div>
                      </td>

                      {/* Exhibitor */}
                      <td className="py-3.5 px-4">
                        <div className="font-medium text-slate-900">{reg.ownerName}</div>
                        <div className="text-[11px] text-slate-500 truncate max-w-[160px]">
                          {reg.clubAffiliation || reg.ownerEmail}
                        </div>
                      </td>

                      {/* Event */}
                      <td className="py-3.5 px-4">
                        <div className="text-slate-800 font-medium truncate max-w-[170px]" title={reg.competitionTitle}>
                          {reg.competitionTitle}
                        </div>
                      </td>

                      {/* Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded text-[11px] font-semibold border ${
                            reg.status === 'Checked-In'
                              ? 'bg-emerald-50 text-emerald-800 border-emerald-200'
                              : 'bg-amber-50 text-amber-800 border-amber-200'
                          }`}
                        >
                          {reg.status}
                        </span>
                      </td>

                      {/* Actions */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap space-x-2">
                        <button
                          onClick={() => setInspectingPass(reg)}
                          className="px-2.5 py-1 text-[11px] font-medium text-slate-700 bg-slate-100 hover:bg-slate-200 rounded transition-colors cursor-pointer"
                          title="View Digital Pass"
                        >
                          View Pass
                        </button>

                        <button
                          onClick={() =>
                            onUpdateStatus(
                              reg.id,
                              reg.status === 'Checked-In' ? 'Confirmed' : 'Checked-In'
                            )
                          }
                          className={`px-2.5 py-1 text-[11px] font-semibold rounded transition-colors cursor-pointer ${
                            reg.status === 'Checked-In'
                              ? 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                              : 'bg-slate-900 text-white hover:bg-slate-800'
                          }`}
                        >
                          {reg.status === 'Checked-In' ? 'Undo Check-In' : 'Check In'}
                        </button>

                        <button
                          onClick={() => {
                            if (window.confirm(`Are you sure you want to cancel entry for ${reg.petName}?`)) {
                              onCancelRegistration(reg.id);
                            }
                          }}
                          className="p-1 text-slate-400 hover:text-rose-600 transition-colors cursor-pointer inline-block align-middle"
                          title="Cancel Entry"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>

      {/* Inspecting Pass Modal */}
      <DigitalPassModal
        registration={inspectingPass}
        onClose={() => setInspectingPass(null)}
        onViewRoster={() => setInspectingPass(null)}
      />
    </section>
  );
};
