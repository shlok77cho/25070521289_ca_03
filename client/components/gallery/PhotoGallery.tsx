import React, { useState } from 'react';
import { Search, Heart, Award, Plus, Sparkles, Filter } from 'lucide-react';
import type { GalleryItem } from '../../types/index.ts';
import { PhotoLightboxModal } from './PhotoLightboxModal.tsx';
import { SubmitPhotoModal } from './SubmitPhotoModal.tsx';

interface PhotoGalleryProps {
  items: GalleryItem[];
  loading: boolean;
  onVote: (id: string) => void;
  onSubmitPhoto: (data: Partial<GalleryItem>) => Promise<void>;
}

export const PhotoGallery: React.FC<PhotoGalleryProps> = ({
  items,
  loading,
  onVote,
  onSubmitPhoto,
}) => {
  const [selectedCategory, setSelectedCategory] = useState('All Categories');
  const [selectedSort, setSelectedSort] = useState<'votes' | 'recent'>('votes');
  const [searchTerm, setSearchTerm] = useState('');
  const [activeItem, setActiveItem] = useState<GalleryItem | null>(null);
  const [isSubmitOpen, setIsSubmitOpen] = useState(false);

  const categories = [
    'All Categories',
    'Best in Show',
    'Grooming Artistry',
    'Feline Elegance',
    'Agility Speed Trials',
    'Spectators Choice',
  ];

  const filteredItems = items
    .filter((item) => {
      const matchesCat =
        selectedCategory === 'All Categories' || item.category === selectedCategory;
      const matchesSearch =
        item.petName.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.breed.toLowerCase().includes(searchTerm.toLowerCase()) ||
        item.ownerName.toLowerCase().includes(searchTerm.toLowerCase());
      return matchesCat && matchesSearch;
    })
    .sort((a, b) => {
      if (selectedSort === 'votes') {
        return b.votes - a.votes;
      }
      return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
    });

  return (
    <section className="py-12 bg-white min-h-screen">
      <div className="max-w-7xl mx-auto px-6">
        {/* Gallery Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 pb-8 border-b border-slate-200">
          <div>
            <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
              Exhibitor Showcase & Hall of Champions
            </div>
            <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
              Championship Photo Galleries
            </h2>
            <p className="text-sm text-slate-600 mt-2 max-w-xl">
              Impeccably groomed purebreds, high-speed agility contenders, and charismatic companions captured across regional show rings.
            </p>
          </div>

          <div className="flex items-center gap-3 shrink-0">
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="flex items-center gap-2 px-4 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
            >
              <Plus className="w-4 h-4" />
              <span>Submit Pet Photo</span>
            </button>
          </div>
        </div>

        {/* Filters and Controls */}
        <div className="mt-8 flex flex-col md:flex-row items-stretch md:items-center justify-between gap-4">
          {/* Categories Segmented Control */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-2 md:pb-0 scrollbar-none">
            {categories.map((cat) => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 text-xs font-medium rounded-lg whitespace-nowrap shrink-0 transition-colors cursor-pointer ${
                  selectedCategory === cat
                    ? 'bg-slate-900 text-white shadow-xs'
                    : 'bg-slate-100 text-slate-600 hover:text-slate-900 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>

          {/* Search & Sort Controls */}
          <div className="flex items-center gap-3">
            <div className="relative flex-1 sm:w-60">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                placeholder="Search pet or breed..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-9 pr-3 py-1.5 text-xs bg-slate-50 border border-slate-200 rounded-lg text-slate-800 placeholder-slate-400 focus:outline-none focus:bg-white focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <select
              value={selectedSort}
              onChange={(e) => setSelectedSort(e.target.value as any)}
              className="px-3 py-1.5 text-xs font-medium border border-slate-200 rounded-lg bg-white text-slate-700 cursor-pointer focus:outline-none"
            >
              <option value="votes">Most Votes</option>
              <option value="recent">Newest Additions</option>
            </select>
          </div>
        </div>

        {/* Loading */}
        {loading && (
          <div className="py-24 text-center text-sm text-slate-500">
            Loading championship gallery photos...
          </div>
        )}

        {/* Empty State */}
        {!loading && filteredItems.length === 0 && (
          <div className="py-20 text-center bg-slate-50 rounded-2xl border border-slate-200 mt-8 p-8">
            <h3 className="text-base font-semibold text-slate-900">No photos in this category</h3>
            <p className="text-xs text-slate-500 mt-1">Be the first to upload a competitor photo!</p>
            <button
              onClick={() => setIsSubmitOpen(true)}
              className="mt-4 px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
            >
              Submit Photo
            </button>
          </div>
        )}

        {/* Photo Grid */}
        {!loading && filteredItems.length > 0 && (
          <div className="mt-8 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-7">
            {filteredItems.map((item) => (
              <div
                key={item.id}
                className="group bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-xs hover:shadow-md hover:border-slate-300 transition-all flex flex-col"
              >
                {/* Image Container with Aspect Ratio */}
                <div
                  onClick={() => setActiveItem(item)}
                  className="relative aspect-4/3 overflow-hidden bg-slate-100 cursor-pointer"
                >
                  <img
                    src={item.imageUrl}
                    alt={item.petName}
                    className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                    referrerPolicy="no-referrer"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />

                  {/* Gradient Scrim */}
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-end p-4">
                    <span className="text-xs text-white font-medium">Click to inspect photo & pedigree</span>
                  </div>

                  {/* Category unboxed tag on image corner */}
                  <div className="absolute top-3 left-3 bg-slate-900/80 backdrop-blur-xs text-white text-[11px] font-medium px-2.5 py-1 rounded">
                    {item.category}
                  </div>

                  {item.featured && (
                    <div className="absolute top-3 right-3 bg-amber-500 text-slate-950 text-[10px] font-bold uppercase tracking-wider px-2 py-0.5 rounded">
                      Featured
                    </div>
                  )}
                </div>

                {/* Card Body */}
                <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                  <div className="space-y-2">
                    {/* Unboxed metadata */}
                    <div className="flex items-center gap-1.5 text-xs text-slate-500">
                      <span>{item.species}</span>
                      <span aria-hidden="true">·</span>
                      <span className="font-medium text-slate-700">{item.breed}</span>
                      <span aria-hidden="true">·</span>
                      <span>{item.location}</span>
                    </div>

                    <h3
                      onClick={() => setActiveItem(item)}
                      className="text-xl font-bold text-slate-900 font-display group-hover:text-amber-800 transition-colors cursor-pointer"
                    >
                      {item.petName}
                    </h3>

                    <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">
                      {item.story}
                    </p>
                  </div>

                  {/* Ribbon list */}
                  {item.ribbons && item.ribbons.length > 0 && (
                    <div className="flex flex-wrap gap-1.5 pt-1">
                      {item.ribbons.slice(0, 2).map((ribbon, rIdx) => (
                        <div
                          key={rIdx}
                          className="flex items-center gap-1 text-[11px] font-medium text-amber-900 bg-amber-50/80 px-2 py-0.5 rounded border border-amber-200/50"
                        >
                          <Award className="w-3 h-3 text-amber-700 shrink-0" />
                          <span className="truncate max-w-[160px]">{ribbon}</span>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Bottom Strip: Owner & Vote Action */}
                  <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-xs">
                    <span className="text-slate-500 truncate max-w-[130px]">
                      By <strong className="text-slate-700 font-medium">{item.ownerName}</strong>
                    </span>

                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        onVote(item.id);
                      }}
                      className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200/60 font-semibold transition-colors cursor-pointer"
                      title="Vote for this competitor"
                    >
                      <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
                      <span className="tabular-nums">{item.votes}</span>
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Lightbox Modal */}
      <PhotoLightboxModal
        item={activeItem}
        onClose={() => setActiveItem(null)}
        onVote={onVote}
      />

      {/* Submit Photo Modal */}
      <SubmitPhotoModal
        isOpen={isSubmitOpen}
        onClose={() => setIsSubmitOpen(false)}
        onSubmit={onSubmitPhoto}
      />
    </section>
  );
};
