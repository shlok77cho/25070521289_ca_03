import React, { useState, useEffect } from 'react';
import { ShieldCheck, CheckCircle2, ChevronRight, ChevronLeft, Award, HelpCircle } from 'lucide-react';
import type { Competition, Registration } from '../../types/index.ts';
import { DigitalPassModal } from './DigitalPassModal.tsx';

interface RegistrationSectionProps {
  competitions: Competition[];
  preSelectedCompetition?: Competition | null;
  currentUser?: User | null;
  onRegistrationSuccess: (registration: Registration) => void;
  onNavigateToRoster: () => void;
}

export const RegistrationSection: React.FC<RegistrationSectionProps> = ({
  competitions,
  preSelectedCompetition,
  currentUser,
  onRegistrationSuccess,
  onNavigateToRoster,
}) => {
  const [step, setStep] = useState<number>(1);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [confirmedPass, setConfirmedPass] = useState<Registration | null>(null);

  // Form State
  const [competitionId, setCompetitionId] = useState<string>('');
  const [division, setDivision] = useState<string>('Conformation / Breed Standard');
  const [classCategory, setClassCategory] = useState<string>('Open Adult');

  const [petName, setPetName] = useState<string>('');
  const [species, setSpecies] = useState<'Dog' | 'Cat' | 'Bird' | 'Small Animal' | 'Exotic'>('Dog');
  const [breed, setBreed] = useState<string>('');
  const [ageYears, setAgeYears] = useState<number>(3);
  const [gender, setGender] = useState<'Male' | 'Female'>('Male');
  const [microchipNumber, setMicrochipNumber] = useState<string>('');
  const [vaccinationVerified, setVaccinationVerified] = useState<boolean>(true);

  const [ownerName, setOwnerName] = useState<string>('');
  const [ownerEmail, setOwnerEmail] = useState<string>('');
  const [ownerPhone, setOwnerPhone] = useState<string>('');
  const [handlerName, setHandlerName] = useState<string>('');
  const [clubAffiliation, setClubAffiliation] = useState<string>('');
  const [notes, setNotes] = useState<string>('');

  useEffect(() => {
    if (preSelectedCompetition) {
      setCompetitionId(preSelectedCompetition.id);
    } else if (competitions.length > 0 && !competitionId) {
      setCompetitionId(competitions[0].id);
    }
  }, [preSelectedCompetition, competitions, competitionId]);

  useEffect(() => {
    if (currentUser) {
      if (!ownerName && currentUser.name) setOwnerName(currentUser.name);
      if (!ownerEmail && currentUser.email) setOwnerEmail(currentUser.email);
    }
  }, [currentUser]);

  const selectedComp = competitions.find((c) => c.id === competitionId) || competitions[0];

  const validateStep = (currentStep: number): boolean => {
    setError(null);
    if (currentStep === 1) {
      if (!competitionId) {
        setError('Please select a championship competition.');
        return false;
      }
      return true;
    }
    if (currentStep === 2) {
      if (!petName.trim()) {
        setError('Please enter your pet’s registered name.');
        return false;
      }
      if (!breed.trim()) {
        setError('Please enter your pet’s breed or companion description.');
        return false;
      }
      if (!vaccinationVerified) {
        setError('Proof of current rabies and mandatory vaccinations is required for ring admission.');
        return false;
      }
      return true;
    }
    if (currentStep === 3) {
      if (!ownerName.trim()) {
        setError('Please enter the primary exhibitor / owner name.');
        return false;
      }
      if (!ownerEmail.trim() || !ownerEmail.includes('@')) {
        setError('Please enter a valid owner email address for digital pass dispatch.');
        return false;
      }
      if (!ownerPhone.trim()) {
        setError('Please provide a daytime contact phone number.');
        return false;
      }
      return true;
    }
    return true;
  };

  const handleNext = () => {
    if (validateStep(step)) {
      setStep((prev) => Math.min(4, prev + 1));
    }
  };

  const handleBack = () => {
    setError(null);
    setStep((prev) => Math.max(1, prev - 1));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!validateStep(1) || !validateStep(2) || !validateStep(3)) return;

    setSubmitting(true);
    setError(null);

    try {
      const response = await fetch('/api/registrations', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          competitionId,
          competitionTitle: selectedComp?.title || 'Local Pet Exhibition',
          petName,
          species,
          breed,
          ageYears: Number(ageYears),
          gender,
          division,
          classCategory,
          microchipNumber: microchipNumber || undefined,
          vaccinationVerified,
          ownerName,
          ownerEmail,
          ownerPhone,
          handlerName: handlerName || ownerName,
          clubAffiliation: clubAffiliation || 'Independent Exhibitor',
          notes: notes || undefined,
        }),
      });

      const json = await response.json();
      if (!response.ok || !json.success) {
        throw new Error(json.message || 'Failed to submit pet registration');
      }

      setConfirmedPass(json.data);
      onRegistrationSuccess(json.data);
    } catch (err) {
      setError((err as Error).message);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <section className="py-12 bg-slate-50 min-h-screen">
      <div className="max-w-4xl mx-auto px-6">
        {/* Header */}
        <div className="text-center max-w-2xl mx-auto mb-10">
          <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
            Official Ring Entry System
          </div>
          <h2 className="text-3xl font-extrabold text-slate-900 font-display tracking-tight">
            Exhibitor & Competitor Registration
          </h2>
          <p className="text-sm text-slate-600 mt-2">
            Submit your pet’s official credentials to enter purebred conformation, agility trials, or companion specialty classes.
          </p>
        </div>

        {/* Wizard Steps Bar */}
        <div className="mb-8 p-4 bg-white rounded-2xl border border-slate-200 shadow-xs">
          <div className="grid grid-cols-4 gap-2 text-center">
            {[
              { num: 1, label: 'Competition & Class' },
              { num: 2, label: 'Pet Credentials' },
              { num: 3, label: 'Owner & Handler' },
              { num: 4, label: 'Review & Confirm' },
            ].map((s) => (
              <div
                key={s.num}
                className={`py-2 px-1 rounded-lg transition-colors ${
                  step === s.num
                    ? 'bg-slate-900 text-white'
                    : step > s.num
                    ? 'bg-slate-100 text-slate-900 font-medium'
                    : 'text-slate-400'
                }`}
              >
                <div className="text-xs font-bold tabular-nums">Step {s.num}</div>
                <div className="text-[11px] truncate hidden sm:block">{s.label}</div>
              </div>
            ))}
          </div>
        </div>

        {/* Main Form Box */}
        <div className="bg-white rounded-2xl border border-slate-200 p-8 shadow-xs">
          {error && (
            <div className="mb-6 p-4 rounded-xl bg-rose-50 border border-rose-200 text-rose-700 text-xs">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            {/* STEP 1 */}
            {step === 1 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Select Target Event & Ring Division
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Choose the upcoming regional show and division you wish to compete in.
                  </p>
                </div>

                <div className="space-y-2">
                  <label className="text-xs font-semibold text-slate-800 uppercase tracking-wider block">
                    Championship Event *
                  </label>
                  <select
                    value={competitionId}
                    onChange={(e) => setCompetitionId(e.target.value)}
                    className="w-full px-3.5 py-2.5 text-xs border border-slate-200 rounded-xl bg-slate-50 focus:bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                  >
                    {competitions.map((comp) => (
                      <option key={comp.id} value={comp.id}>
                        {comp.title} — {comp.date} ({comp.location}) — ${comp.entryFee} Entry
                      </option>
                    ))}
                  </select>
                </div>

                {selectedComp && (
                  <div className="p-4 rounded-xl bg-amber-50/60 border border-amber-200/70 text-xs space-y-2">
                    <div className="flex items-center justify-between">
                      <span className="font-semibold text-amber-900">{selectedComp.venue}</span>
                      <span className="text-amber-800 font-bold tabular-nums">${selectedComp.entryFee} Entry Fee</span>
                    </div>
                    <div className="text-slate-600">
                      Date: <strong className="text-slate-800">{selectedComp.date}</strong> ({selectedComp.time})
                    </div>
                    <div className="text-slate-600">
                      Entry Deadline: <span className="text-slate-800">{selectedComp.registrationDeadline}</span>
                    </div>
                  </div>
                )}

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Competitive Division</label>
                    <select
                      value={division}
                      onChange={(e) => setDivision(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Conformation / Breed Standard">Conformation / Breed Standard</option>
                      <option value="Agility Steeplechase">Agility Steeplechase</option>
                      <option value="Master Obstacle & Weaves">Master Obstacle & Weaves</option>
                      <option value="Feline Longhair / Shorthair">Feline Longhair / Shorthair</option>
                      <option value="Grooming Artistry & Scissor">Grooming Artistry & Scissor</option>
                      <option value="Companion Trick & Novelty">Companion Trick & Novelty</option>
                      <option value="Junior Showmanship">Junior Showmanship</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Class Category</label>
                    <select
                      value={classCategory}
                      onChange={(e) => setClassCategory(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Open Adult">Open Adult</option>
                      <option value="Puppy / Kitten (6-12 Months)">Puppy / Kitten (6-12 Months)</option>
                      <option value="Bred-by-Exhibitor">Bred-by-Exhibitor</option>
                      <option value="Veteran Champion (7+ Years)">Veteran Champion (7+ Years)</option>
                      <option value="Novice Jumpers">Novice Jumpers</option>
                      <option value="Household Companion">Household Companion</option>
                    </select>
                  </div>
                </div>
              </div>
            )}

            {/* STEP 2 */}
            {step === 2 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Pet Demographics & Health Records
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Provide certified pedigree, breed attributes, and veterinary declarations.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Pet Official Show Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Sterling Prince of Cascade"
                      value={petName}
                      onChange={(e) => setPetName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Species</label>
                    <select
                      value={species}
                      onChange={(e) => setSpecies(e.target.value as any)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                    >
                      <option value="Dog">Dog</option>
                      <option value="Cat">Cat</option>
                      <option value="Bird">Bird</option>
                      <option value="Small Animal">Small Animal (Rabbit, Guinea Pig)</option>
                      <option value="Exotic">Exotic Companion</option>
                    </select>
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Breed / Variety *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Golden Retriever, Maine Coon"
                      value={breed}
                      onChange={(e) => setBreed(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="grid grid-cols-2 gap-2">
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800">Age (Years)</label>
                      <input
                        type="number"
                        min={0.5}
                        max={20}
                        step={0.5}
                        value={ageYears}
                        onChange={(e) => setAgeYears(parseFloat(e.target.value) || 1)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                      />
                    </div>
                    <div className="space-y-1.5">
                      <label className="text-xs font-semibold text-slate-800">Gender</label>
                      <select
                        value={gender}
                        onChange={(e) => setGender(e.target.value as any)}
                        className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg bg-white focus:outline-none focus:ring-1 focus:ring-slate-900"
                      >
                        <option value="Male">Male</option>
                        <option value="Female">Female</option>
                      </select>
                    </div>
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-800">Microchip or Tattoo ID (Optional)</label>
                    <input
                      type="text"
                      placeholder="e.g. 985141002341902"
                      value={microchipNumber}
                      onChange={(e) => setMicrochipNumber(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>

                <div className="p-4 rounded-xl bg-slate-50 border border-slate-200 flex items-start gap-3">
                  <input
                    type="checkbox"
                    id="vaccineCheck"
                    checked={vaccinationVerified}
                    onChange={(e) => setVaccinationVerified(e.target.checked)}
                    className="mt-1 w-4 h-4 rounded text-slate-900 focus:ring-slate-900 cursor-pointer"
                  />
                  <label htmlFor="vaccineCheck" className="text-xs text-slate-700 cursor-pointer">
                    <strong className="text-slate-900 block mb-0.5">Veterinary Health Declaration</strong>
                    I certify that this pet has current rabies and species-appropriate vaccinations administered by a licensed veterinarian within 12 months, and is free from contagious illness.
                  </label>
                </div>
              </div>
            )}

            {/* STEP 3 */}
            {step === 3 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Exhibitor, Handler & Club Affiliation
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Contact information for ring pass delivery and benching callouts.
                  </p>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Primary Owner / Exhibitor Name *</label>
                    <input
                      type="text"
                      required
                      placeholder="e.g. Arthur Pendelton"
                      value={ownerName}
                      onChange={(e) => setOwnerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Contact Email *</label>
                    <input
                      type="email"
                      required
                      placeholder="e.g. arthur@example.com"
                      value={ownerEmail}
                      onChange={(e) => setOwnerEmail(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Daytime Phone *</label>
                    <input
                      type="tel"
                      required
                      placeholder="e.g. (503) 555-0199"
                      value={ownerPhone}
                      onChange={(e) => setOwnerPhone(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5">
                    <label className="text-xs font-semibold text-slate-800">Ring Handler (If different)</label>
                    <input
                      type="text"
                      placeholder="Leave blank if self-handled"
                      value={handlerName}
                      onChange={(e) => setHandlerName(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-800">Club or Kennel Affiliation</label>
                    <input
                      type="text"
                      placeholder="e.g. AKC Northwest Chapter, CFA Fanciers, or Independent"
                      value={clubAffiliation}
                      onChange={(e) => setClubAffiliation(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>

                  <div className="space-y-1.5 sm:col-span-2">
                    <label className="text-xs font-semibold text-slate-800">Special Handling / Benching Requests</label>
                    <textarea
                      rows={2}
                      placeholder="Any ring accommodations or bench proximity requirements..."
                      value={notes}
                      onChange={(e) => setNotes(e.target.value)}
                      className="w-full px-3 py-2 text-xs border border-slate-200 rounded-lg focus:outline-none focus:ring-1 focus:ring-slate-900"
                    />
                  </div>
                </div>
              </div>
            )}

            {/* STEP 4 */}
            {step === 4 && (
              <div className="space-y-6">
                <div>
                  <h3 className="text-base font-bold text-slate-900 font-display">
                    Review Entry & Confirm Registration
                  </h3>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Please review your entry details before dispatching to the MongoDB show database.
                  </p>
                </div>

                <div className="p-5 rounded-xl bg-slate-50 border border-slate-200 space-y-4 text-xs">
                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Selected Event</span>
                      <strong className="text-slate-900 text-sm block font-display">
                        {selectedComp?.title}
                      </strong>
                      <span className="text-slate-500">{selectedComp?.date} · {selectedComp?.venue}</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Division & Class</span>
                      <strong className="text-slate-900 block">{division}</strong>
                      <span className="text-slate-500">{classCategory}</span>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-4 pb-3 border-b border-slate-200/80">
                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Pet Competitor</span>
                      <strong className="text-slate-900 text-sm block font-display">{petName}</strong>
                      <span className="text-slate-500">{species} · {breed} ({gender}, {ageYears} yrs)</span>
                    </div>

                    <div>
                      <span className="text-slate-400 block mb-0.5 font-medium">Exhibitor</span>
                      <strong className="text-slate-900 block">{ownerName}</strong>
                      <span className="text-slate-500">{ownerEmail} · {ownerPhone}</span>
                    </div>
                  </div>

                  <div className="flex items-center justify-between pt-1">
                    <div>
                      <span className="text-slate-500 block">Total Ring Entry Fee</span>
                      <span className="text-2xl font-bold text-slate-900 font-display tabular-nums">
                        ${selectedComp?.entryFee || 40}
                      </span>
                    </div>
                    <div className="text-right text-[11px] text-slate-500">
                      <span>Instant Digital Pass Generation</span>
                      <span className="block text-emerald-600 font-semibold mt-0.5">
                        ✓ Health Verification Checked
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* Navigation Buttons */}
            <div className="mt-8 pt-6 border-t border-slate-100 flex items-center justify-between">
              {step > 1 ? (
                <button
                  type="button"
                  onClick={handleBack}
                  className="flex items-center gap-1.5 px-4 py-2 text-xs font-medium text-slate-600 hover:text-slate-900 transition-colors cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back</span>
                </button>
              ) : (
                <div />
              )}

              {step < 4 ? (
                <button
                  type="button"
                  onClick={handleNext}
                  className="flex items-center gap-1.5 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-xs cursor-pointer"
                >
                  <span>Continue</span>
                  <ChevronRight className="w-4 h-4" />
                </button>
              ) : (
                <button
                  type="submit"
                  disabled={submitting}
                  className="flex items-center gap-2 px-6 py-2.5 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors shadow-md cursor-pointer disabled:opacity-50"
                >
                  <CheckCircle2 className="w-4 h-4" />
                  <span>{submitting ? 'Registering in Database...' : 'Confirm & Generate Pass'}</span>
                </button>
              )}
            </div>
          </form>
        </div>
      </div>

      {/* Digital Pass Modal */}
      <DigitalPassModal
        registration={confirmedPass}
        onClose={() => setConfirmedPass(null)}
        onViewRoster={onNavigateToRoster}
      />
    </section>
  );
};
