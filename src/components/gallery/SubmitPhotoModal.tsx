import React, { useState } from 'react';
import { X, Upload, Camera, Check } from 'lucide-react';
import type { GalleryItem } from '../../types/index.ts';

interface SubmitPhotoModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSubmit: (data: Partial<GalleryItem>) => Promise<void>;
}

export const SubmitPhotoModal: React.FC<SubmitPhotoModalProps> = ({
  isOpen,
  onClose,
  onSubmit,
}) => {
  const [petName, setPetName] = useState('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Other'>('Dog');
  const [breed, setBreed] = useState('');
  const [category, setCategory] = useState('Best in Show');
  const [ownerName, setOwnerName] = useState('');
  const [location, setLocation] = useState('');
  const [title, setTitle] = useState('');
  const [story, setStory] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [selectedPreset, setSelectedPreset] = useState<number | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  if (!isOpen) return null;

  // Preset sample show photos exhibitors can pick or enter custom URL
  const presets = [
    {
      title: 'Championship Ring Winner',
      url: '/src/assets/images/hero_pet_championship_1793106525108.jpg',
      label: 'Golden Retriever Ring',
    },
    {
      title: 'Poodle Continental Rosette',
      url: '/src/assets/images/gallery_canine_show_1793106524535.jpg',
      label: 'Grooming Master Rosette',
    },
    {
      title: 'Silver Maine Coon',
      url: '/src/assets/images/gallery_feline_elegance_1793106525605.jpg',
      label: 'Feline Elegance',
    },
    {
      title: 'Agility Course Hurdle',
      url: '/src/assets/images/gallery_agility_champion_1793106525148.jpg',
      label: 'Agility Steeplechase',
    },
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError(null);

    const finalImage = imageUrl.trim() || (selectedPreset !== null ? presets[selectedPreset].url : '');
    if (!petName.trim() || !ownerName.trim() || !finalImage) {
      setError('Please provide Pet Name, Owner Name, and a valid photo.');
      return;
    }

    try {
      setLoading(true);
      await onSubmit({
        petName,
        species,
        breed: breed || 'Companion Show Competitor',
        category,
        ownerName,
        location: location || 'Pacific Northwest Circuit',
        title: title || `${petName}'s Championship Moment`,
        story: story || 'Competed with distinction in local show trials.',
        imageUrl: finalImage,
        ribbons: ['Show Entry Certificate', 'Ring Merit 2026'],
      });
      onClose();
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-slate-900/60 backdrop-blur-sm animate-fade-in">
      <div className="bg-white rounded-2xl max-w-xl w-full max-h-[90vh] overflow-y-auto shadow-2xl border border-slate-200">
        <div className="p-6 border-b border-slate-100 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Camera className="w-5 h-5 text-slate-900" />
            <h2 className="text-xl font-bold text-slate-900 font-display">
              Submit Show Entry Photo
            </h2>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 text-slate-400 hover:text-slate-700 rounded-lg hover:bg-slate-100 transition-colors cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        <form onSubmit={handleSubmit} className="p-6 space-y-5 text-xs">
          {error && (
            <div className="p-3 rounded-lg bg-rose-50 text-rose-700 border border-rose-200">
              {error}
            </div>
          )}

          {/* Photo Selection / Preset */}
          <div className="space-y-2">
            <label className="font-semibold text-slate-800 uppercase tracking-wider block">
              1. Choose Photo Or Provide URL
            </label>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2">
              {presets.map((preset, idx) => (
                <button
                  type="button"
                  key={idx}
                  onClick={() => {
                    setSelectedPreset(idx);
                    setImageUrl(preset.url);
                  }}
                  className={`relative rounded-lg overflow-hidden border-2 text-left cursor-pointer transition-all aspect-square ${
                    selectedPreset === idx ? 'border-amber-600 ring-2 ring-amber-600/20' : 'border-slate-200 opacity-80 hover:opacity-100'
                  }`}
                >
                  <img src={preset.url} alt={preset.label} className="w-full h-full object-cover" />
                  <div className="absolute inset-x-0 bottom-0 bg-black/60 p-1 text-[10px] text-white truncate text-center">
                    {preset.label}
                  </div>
                  {selectedPreset === idx && (
                    <div className="absolute top-1 right-1 bg-amber-600 text-white rounded-full p-0.5">
                      <Check className="w-3 h-3" />
                    </div>
                  )}
                </button>
              ))}
            </div>

            <div className="pt-2">
              <input
                type="text"
                placeholder="Or paste external image URL (https://...)"
                value={imageUrl}
                onChange={(e) => {
                  setImageUrl(e.target.value);
                  setSelectedPreset(null);
                }}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Pet Details */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Pet Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Duke of Amber"
                value={petName}
                onChange={(e) => setPetName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Species</label>
              <select
                value={species}
                onChange={(e) => setSpecies(e.target.value as any)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="Dog">Dog</option>
                <option value="Cat">Cat</option>
                <option value="Bird">Bird</option>
                <option value="Other">Other Companion</option>
              </select>
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Breed</label>
              <input
                type="text"
                placeholder="e.g. Bernese Mountain Dog"
                value={breed}
                onChange={(e) => setBreed(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Show Category</label>
              <select
                value={category}
                onChange={(e) => setCategory(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
              >
                <option value="Best in Show">Best in Show</option>
                <option value="Grooming Artistry">Grooming Artistry</option>
                <option value="Feline Elegance">Feline Elegance</option>
                <option value="Agility Speed Trials">Agility Speed Trials</option>
                <option value="Spectators Choice">Spectators Choice</option>
              </select>
            </div>
          </div>

          {/* Handler & Location */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div className="space-y-1">
              <label className="font-semibold text-slate-800">Owner / Handler Name *</label>
              <input
                type="text"
                required
                placeholder="e.g. Clara Montgomery"
                value={ownerName}
                onChange={(e) => setOwnerName(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>

            <div className="space-y-1">
              <label className="font-semibold text-slate-800">City / Club</label>
              <input
                type="text"
                placeholder="e.g. Portland, OR"
                value={location}
                onChange={(e) => setLocation(e.target.value)}
                className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
              />
            </div>
          </div>

          {/* Story / Caption */}
          <div className="space-y-1">
            <label className="font-semibold text-slate-800">Backstory / Ring Highlight</label>
            <textarea
              rows={3}
              placeholder="Share your pet's training journey, championship ribbon, or ring performance..."
              value={story}
              onChange={(e) => setStory(e.target.value)}
              className="w-full px-3 py-2 border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
            />
          </div>

          <div className="pt-4 border-t border-slate-100 flex items-center justify-end gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={loading}
              className="px-5 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-sm cursor-pointer disabled:opacity-50"
            >
              {loading ? 'Submitting to MongoDB...' : 'Publish to Gallery'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};
