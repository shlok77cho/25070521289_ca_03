import React, { useState, useId } from 'react';
import { Search, Calendar as CalendarIcon, Clock, MapPin, Users, Award, X, List, Grid, Building2 } from 'lucide-react';
import type { Competition } from '../../types/index.ts';

interface EventCalendarProps {
  competitions: Competition[];
  loading: boolean;
  onSelectCompetition: (competition: Competition) => void;
  onRegisterCompetition: (competition: Competition) => void;
}

export const EventCalendar: React.FC<EventCalendarProps> = ({
  competitions,
  loading,
  onSelectCompetition,
  onRegisterCompetition,
}) => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [viewMode, setViewMode] = useState<'list' | 'month'>('list');
  const searchInputId = useId();

  const categories = [
    'All',
    'Conformation',
    'Agility Speed Trials',
    'Grooming Artistry',
    'Longhair Championship',
    'Novelty & Trick',
  ];

  // Popular venues for quick search filtering
  const quickVenueSuggestions = [
    'Emerald Valley Pavilion',
    'Ridge Sports Arena',
    'Grand Marina Center',
    'Riverfront Civic Pavilion',
  ];

  // Dynamic filter by venue or show name using state
  const trimmedSearch = searchTerm.trim().toLowerCase();

  const filteredCompetitions = competitions.filter((comp) => {
    const matchesSearch =
      !trimmedSearch ||
      comp.title.toLowerCase().includes(trimmedSearch) ||
      comp.venue.toLowerCase().includes(trimmedSearch) ||
      comp.location.toLowerCase().includes(trimmedSearch);

    const matchesCategory =
      selectedCategory === 'All' ||
      comp.categories.some((c) => c.toLowerCase().includes(selectedCategory.toLowerCase()));

    return matchesSearch && matchesCategory;
  });

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Section Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-6 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              Event Calendar & Local Competitions
            </div>
            <h1 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Championship Circuit Schedules
            </h1>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Sanctioned regional pet shows, breed conformation specialties, and agility trials across the Pacific Northwest circuit.
            </p>
          </div>

          {/* View Mode Toggle */}
          <div className="flex items-center gap-1 p-1 bg-white border border-slate-200 rounded-lg shrink-0">
            <button
              onClick={() => setViewMode('list')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'list' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <List className="w-3.5 h-3.5" />
              <span>Schedule Cards</span>
            </button>
            <button
              onClick={() => setViewMode('month')}
              className={`flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium rounded-md transition-colors cursor-pointer ${
                viewMode === 'month' ? 'bg-slate-900 text-white shadow-xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Grid className="w-3.5 h-3.5" />
              <span>Month Overview</span>
            </button>
          </div>
        </div>

        {/* PROMINENT SEARCH BAR AT THE TOP OF THE COMPETITIONS CALENDAR */}
        <div className="mt-8 bg-white rounded-2xl border border-slate-200 p-5 shadow-xs">
          <div className="flex flex-col gap-3">
            <label
              htmlFor={searchInputId}
              className="text-xs font-bold text-slate-900 uppercase tracking-wider flex items-center justify-between"
            >
              <span>Search Shows & Venues</span>
              <span className="text-[11px] font-medium text-slate-500 lowercase">
                Filter by show name or venue
              </span>
            </label>

            <div className="relative flex items-center">
              <Search className="w-5 h-5 text-slate-400 absolute left-4 pointer-events-none" />
              <input
                id={searchInputId}
                type="text"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                placeholder="Type a show name (e.g. 'Metro All-Breed', 'Cascade Agility') or venue (e.g. 'Emerald Valley', 'Ridge Sports Arena')..."
                className="w-full pl-12 pr-10 py-3 text-sm bg-slate-50 border border-slate-200 rounded-xl text-slate-900 placeholder-slate-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-slate-900 focus:border-slate-900 transition-all"
              />
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  aria-label="Clear search"
                  className="absolute right-3.5 p-1 text-slate-400 hover:text-slate-700 rounded-full hover:bg-slate-200 transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              )}
            </div>

            {/* Quick Venue Filter Suggestions */}
            <div className="flex flex-wrap items-center gap-2 pt-1 text-xs text-slate-500">
              <span className="flex items-center gap-1 text-slate-600 font-medium shrink-0">
                <Building2 className="w-3.5 h-3.5 text-slate-400" />
                <span>Venues:</span>
              </span>
              {quickVenueSuggestions.map((venue) => {
                const isActive = searchTerm.toLowerCase() === venue.toLowerCase();
                return (
                  <button
                    key={venue}
                    type="button"
                    onClick={() => setSearchTerm(isActive ? '' : venue)}
                    className={`px-2.5 py-1 rounded-lg text-xs transition-colors cursor-pointer border ${
                      isActive
                        ? 'bg-slate-900 text-white border-slate-900 font-medium'
                        : 'bg-slate-100 text-slate-700 border-slate-200/80 hover:bg-slate-200'
                    }`}
                  >
                    {venue}
                  </button>
                );
              })}
              {searchTerm && (
                <button
                  type="button"
                  onClick={() => setSearchTerm('')}
                  className="text-xs text-amber-800 hover:text-amber-900 font-medium underline ml-auto cursor-pointer"
                >
                  Clear search
                </button>
              )}
            </div>
          </div>
        </div>

        {/* Filter Controls Bar (Categories & Live Count) */}
        <div className="mt-6 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Category Segmented Buttons */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-white border border-slate-200 text-slate-600 hover:text-slate-900 hover:border-slate-300'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Results Summary Count */}
          <div className="text-xs text-slate-600 font-medium shrink-0">
            Showing <strong className="text-slate-900 tabular-nums">{filteredCompetitions.length}</strong> of{' '}
            <span className="tabular-nums">{competitions.length}</span> competitions
            {trimmedSearch && (
              <span className="text-amber-800 ml-1">
                matching "{searchTerm}"
              </span>
            )}
          </div>
        </div>

        {/* Loading State */}
        {loading && (
          <div className="py-20 text-center text-sm text-slate-500">
            Loading competition calendar schedules...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredCompetitions.length === 0 && (
          <div className="py-20 text-center bg-white rounded-2xl border border-slate-200 mt-8 p-8 shadow-xs">
            <CalendarIcon className="w-10 h-10 text-slate-300 mx-auto mb-3" />
            <h3 className="text-base font-semibold text-slate-900">
              No competitions found
            </h3>
            <p className="text-xs text-slate-500 mt-1 max-w-sm mx-auto">
              No shows matched "{searchTerm}". Try searching for another venue name like "Emerald Valley" or clear the search.
            </p>
            <div className="mt-4 flex items-center justify-center gap-3">
              <button
                onClick={() => {
                  setSearchTerm('');
                  setSelectedCategory('All');
                }}
                className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
              >
                Clear Search & Reset Filters
              </button>
            </div>
          </div>
        )}

        {/* Content: List Mode */}
        {!loading && viewMode === 'list' && filteredCompetitions.length > 0 && (
          <div className="mt-8 space-y-5">
            {filteredCompetitions.map((comp) => {
              const [year, month, day] = comp.date.split('-');
              const dateObj = new Date(parseInt(year, 10), parseInt(month, 10) - 1, parseInt(day, 10));
              const monthName = dateObj.toLocaleString('en-US', { month: 'short' });
              const dayNum = dateObj.getDate();
              const spotsLeft = comp.capacity - comp.registeredCount;
              const percentFilled = Math.min(100, Math.round((comp.registeredCount / comp.capacity) * 100));

              return (
                <div
                  key={comp.id}
                  className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:border-slate-300 hover:shadow-sm transition-all"
                >
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
                    {/* Date Block */}
                    <div className="lg:col-span-2 flex items-center lg:flex-col lg:justify-center p-3 sm:p-4 rounded-xl bg-slate-50 border border-slate-200/80 text-center">
                      <div className="text-xs uppercase font-bold text-amber-800 tracking-wider">
                        {monthName}
                      </div>
                      <div className="text-3xl font-extrabold text-slate-900 font-display tabular-nums ml-2 lg:ml-0">
                        {dayNum}
                      </div>
                      <div className="text-xs text-slate-500 ml-2 lg:ml-0 mt-0.5">
                        {year}
                      </div>
                    </div>

                    {/* Main Competition Details */}
                    <div className="lg:col-span-7 space-y-3">
                      <div>
                        <div className="text-xs font-medium text-slate-500 mb-1">
                          {comp.theme}
                        </div>
                        <h3 className="text-xl font-bold text-slate-900 font-display">
                          {comp.title}
                        </h3>
                      </div>

                      <div className="flex flex-wrap items-center gap-y-1.5 gap-x-4 text-xs text-slate-600">
                        <span className="flex items-center gap-1.5 font-medium text-slate-800 bg-amber-50/70 px-2 py-0.5 rounded border border-amber-200/50">
                          <MapPin className="w-3.5 h-3.5 text-amber-700" />
                          <span>{comp.venue}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span>{comp.location}</span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1.5">
                          <Clock className="w-3.5 h-3.5 text-slate-400" />
                          <span>{comp.time}</span>
                        </span>
                        <span aria-hidden="true" className="text-slate-300">·</span>
                        <span className="flex items-center gap-1.5">
                          <Award className="w-3.5 h-3.5 text-slate-400" />
                          <span>{comp.prizePool}</span>
                        </span>
                      </div>

                      {/* Categories List */}
                      <div className="flex flex-wrap gap-1.5 pt-1">
                        {comp.categories.map((c, i) => (
                          <span
                            key={i}
                            className="px-2 py-0.5 text-xs text-slate-600 bg-slate-100 rounded border border-slate-200/60"
                          >
                            {c}
                          </span>
                        ))}
                      </div>

                      {/* Capacity progress */}
                      <div className="pt-1 flex items-center gap-3 text-xs text-slate-500">
                        <div className="w-36 bg-slate-100 rounded-full h-1.5 overflow-hidden">
                          <div
                            className="bg-slate-800 h-full rounded-full transition-all"
                            style={{ width: `${percentFilled}%` }}
                          />
                        </div>
                        <span className="tabular-nums">
                          {comp.registeredCount}/{comp.capacity} Enrolled ({spotsLeft} spots remaining)
                        </span>
                      </div>
                    </div>

                    {/* Action Block */}
                    <div className="lg:col-span-3 flex flex-row lg:flex-col items-center lg:items-end justify-between gap-3 pt-4 lg:pt-0 border-t lg:border-t-0 border-slate-100">
                      <div className="text-left lg:text-right">
                        <div className="text-xs text-slate-500">Entry Fee</div>
                        <div className="text-2xl font-bold text-slate-900 tabular-nums font-display">
                          ${comp.entryFee}
                        </div>
                      </div>

                      <div className="flex flex-col sm:flex-row lg:flex-col gap-2 w-full sm:w-auto">
                        <button
                          onClick={() => onRegisterCompetition(comp)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer whitespace-nowrap text-center"
                        >
                          Register Pet
                        </button>
                        <button
                          onClick={() => onSelectCompetition(comp)}
                          className="px-4 py-2 text-xs font-medium text-slate-700 bg-slate-100 rounded-lg hover:bg-slate-200 transition-colors cursor-pointer whitespace-nowrap text-center"
                        >
                          Rules & Judges
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Content: Month Overview Grid Mode */}
        {!loading && viewMode === 'month' && filteredCompetitions.length > 0 && (
          <div className="mt-8 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredCompetitions.map((comp) => (
              <div
                key={comp.id}
                className="bg-white rounded-2xl border border-slate-200 p-6 flex flex-col justify-between shadow-xs hover:border-slate-300 transition-all space-y-4"
              >
                <div className="space-y-3">
                  <div className="flex items-center justify-between text-xs text-slate-500">
                    <span className="font-semibold text-amber-800">{comp.date}</span>
                    <span className="tabular-nums">${comp.entryFee} Entry</span>
                  </div>

                  <h3 className="text-lg font-bold text-slate-900 font-display">
                    {comp.title}
                  </h3>

                  <p className="text-xs text-slate-600 line-clamp-2">
                    {comp.description}
                  </p>

                  <div className="text-xs text-slate-500 space-y-1.5 pt-1">
                    <div className="flex items-center gap-1.5 font-medium text-slate-800">
                      <MapPin className="w-3.5 h-3.5 text-amber-700 shrink-0" />
                      <span className="truncate">{comp.venue}</span>
                    </div>
                    <div className="text-slate-500 text-[11px] pl-5">
                      {comp.location} ({comp.address})
                    </div>
                    <div className="flex items-center gap-1.5 pt-1">
                      <Users className="w-3.5 h-3.5 text-slate-400" />
                      <span className="tabular-nums">{comp.registeredCount} / {comp.capacity} Registered</span>
                    </div>
                  </div>
                </div>

                <div className="pt-3 border-t border-slate-100 flex items-center justify-between gap-2">
                  <button
                    onClick={() => onSelectCompetition(comp)}
                    className="text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                  >
                    View Details
                  </button>
                  <button
                    onClick={() => onRegisterCompetition(comp)}
                    className="px-3.5 py-1.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                  >
                    Enter Ring
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </section>
  );
};
