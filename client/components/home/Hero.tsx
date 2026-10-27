import React from 'react';
import { Calendar, Award, Camera, ShieldCheck, ChevronRight } from 'lucide-react';

interface HeroProps {
  onExploreCalendar: () => void;
  onOpenRegister: () => void;
  onViewGallery: () => void;
}

export const Hero: React.FC<HeroProps> = ({
  onExploreCalendar,
  onOpenRegister,
  onViewGallery,
}) => {
  return (
    <section className="pt-8 pb-16 bg-gradient-to-b from-amber-50/40 via-white to-white">
      <div className="max-w-7xl mx-auto px-6">
        {/* Split Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 items-stretch">
          {/* Left Column: Typographic Hierarchy */}
          <div className="lg:col-span-7 flex flex-col justify-center space-y-6">
            <div className="text-xs font-semibold tracking-wider text-amber-800 uppercase">
              2026 Pacific Northwest Championship Circuit
            </div>

            <h1 className="text-3xl sm:text-4xl lg:text-5xl font-extrabold text-slate-900 font-display tracking-tight leading-[1.15] text-balance">
              Where Exceptional Companions Take the Grand Ring
            </h1>

            <p className="text-base sm:text-lg text-slate-600 leading-relaxed max-w-2xl">
              From purebred conformation rings and high-speed agility trials to feline elegance showcases and junior showmanship. Explore verified event schedules, submit ring entries, and celebrate award-winning photography.
            </p>

            <div className="pt-2 flex flex-wrap items-center gap-3">
              <button
                onClick={onOpenRegister}
                className="px-6 py-3 text-sm font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm flex items-center gap-2 cursor-pointer"
              >
                <span>Register Your Pet</span>
                <ChevronRight className="w-4 h-4" />
              </button>

              <button
                onClick={onExploreCalendar}
                className="px-5 py-3 text-sm font-medium text-slate-800 bg-white border border-slate-300 rounded-lg hover:bg-slate-50 transition-colors cursor-pointer"
              >
                Browse Event Calendar
              </button>

              <button
                onClick={onViewGallery}
                className="px-4 py-3 text-sm font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer flex items-center gap-1.5"
              >
                <Camera className="w-4 h-4" />
                <span>View Photo Gallery</span>
              </button>
            </div>

            <div className="pt-4 flex items-center gap-4 text-xs text-slate-500">
              <span className="flex items-center gap-1.5">
                <ShieldCheck className="w-4 h-4 text-slate-700" />
                <span>Veterinary & Vaccine Verified</span>
              </span>
              <span aria-hidden="true">·</span>
              <span>Electronic RFID Timing</span>
              <span aria-hidden="true">·</span>
              <span>AKC & FIFe Sanctioned Rules</span>
            </div>
          </div>

          {/* Right Column: Hero Visual Asset */}
          <div className="lg:col-span-5 relative flex items-center">
            <div className="w-full h-full min-h-[380px] rounded-2xl overflow-hidden border border-slate-200/80 shadow-md bg-slate-100 relative group">
              <img
                src="/src/assets/images/hero_pet_championship_1793106525108.jpg"
                alt="National Pet Championship Best in Show ring presentation"
                className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-[1.02]"
                referrerPolicy="no-referrer"
                onError={(e) => {
                  // Fallback container in case image fails
                  e.currentTarget.style.display = 'none';
                  const fallback = document.getElementById('hero-fallback');
                  if (fallback) fallback.style.display = 'flex';
                }}
              />
              <div
                id="hero-fallback"
                style={{ display: 'none' }}
                className="w-full h-full bg-slate-800 text-white flex flex-col items-center justify-center p-8 text-center"
              >
                <Award className="w-12 h-12 text-amber-400 mb-2" />
                <span className="text-lg font-bold font-display">National Championship Ring</span>
                <span className="text-xs text-slate-400 mt-1">Conformation & Agility Grand Finale</span>
              </div>

              {/* Scrim overlay with clean caption */}
              <div className="absolute inset-x-0 bottom-0 p-5 bg-gradient-to-t from-black/80 via-black/40 to-transparent text-white">
                <div className="text-xs text-amber-300 font-medium tracking-wide">
                  Reigning Champion
                </div>
                <div className="text-base font-semibold font-display">
                  Barnaby Sterling · Golden Retriever
                </div>
                <div className="text-xs text-slate-200 mt-0.5">
                  Unanimous Best in Show · Metro Autumn Championship
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* 4-Column KPI / Trust Strip below the split */}
        <div className="mt-14 pt-8 border-t border-slate-200 grid grid-cols-2 lg:grid-cols-4 gap-6">
          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              4 Regional
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Championship Exhibition Venues
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              350+ Pets
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Registered Purebred & Companion Handlers
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              $12,000
            </div>
            <div className="text-xs text-slate-500 font-medium">
              Season Cash Purses & Specialty Ribbons
            </div>
          </div>

          <div className="space-y-1">
            <div className="text-2xl lg:text-3xl font-extrabold text-slate-900 font-display tabular-nums">
              100% Certified
            </div>
            <div className="text-xs text-slate-500 font-medium">
              AKC, USDAA & International Ring Judges
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};
