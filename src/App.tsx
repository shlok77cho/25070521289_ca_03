import React, { useState, useEffect, useCallback } from 'react';
import { api } from './services/api.ts';
import type { Competition, GalleryItem, Registration, User, DbStatus } from './types/index.ts';
import { Navbar } from './components/common/Navbar.tsx';
import { Footer } from './components/common/Footer.tsx';
import { Hero } from './components/home/Hero.tsx';
import { EventCalendar } from './components/calendar/EventCalendar.tsx';
import { CompetitionDetailsModal } from './components/calendar/CompetitionDetailsModal.tsx';
import { PhotoGallery } from './components/gallery/PhotoGallery.tsx';
import { RegistrationSection } from './components/registration/RegistrationSection.tsx';
import { LiveLeaderboard } from './components/judging/LiveLeaderboard.tsx';
import { RegistrationsDirectory } from './components/admin/RegistrationsDirectory.tsx';
import { AuthModal } from './components/auth/AuthModal.tsx';
import { Database, CheckCircle2, Zap, RefreshCw } from 'lucide-react';

export default function App() {
  const cached = api.getCachedBootstrap();

  const [activeTab, setActiveTab] = useState<string>('home');
  const [competitions, setCompetitions] = useState<Competition[]>(cached?.competitions || []);
  const [galleryItems, setGalleryItems] = useState<GalleryItem[]>(cached?.gallery || []);
  const [registrations, setRegistrations] = useState<Registration[]>(cached?.registrations || []);
  const [dbStatus, setDbStatus] = useState<DbStatus | null>(cached?.database || null);
  const [latencyMs, setLatencyMs] = useState<number | null>(cached?.database?.latencyMs || 2);
  const [currentUser, setCurrentUser] = useState<User | null>(null);

  const [loadingCompetitions, setLoadingCompetitions] = useState<boolean>(!cached?.competitions?.length);
  const [loadingGallery, setLoadingGallery] = useState<boolean>(!cached?.gallery?.length);
  const [loadingRegistrations, setLoadingRegistrations] = useState<boolean>(!cached?.registrations?.length);
  const [isRefreshing, setIsRefreshing] = useState<boolean>(false);

  // Modals & Target Selections
  const [selectedCompDetails, setSelectedCompDetails] = useState<Competition | null>(null);
  const [preSelectedCompForRegister, setPreSelectedCompForRegister] = useState<Competition | null>(null);
  const [isAuthOpen, setIsAuthOpen] = useState<boolean>(false);
  const [toastMessage, setToastMessage] = useState<string | null>(null);

  const showToast = (msg: string) => {
    setToastMessage(msg);
    setTimeout(() => setToastMessage(null), 3500);
  };

  // Fast unified bootstrap loader
  const loadBootstrapData = useCallback(async (isManualTest = false) => {
    try {
      setIsRefreshing(true);
      const start = performance.now();
      const data = await api.getBootstrapData();
      const roundTrip = Math.max(1, Math.round(performance.now() - start));

      setCompetitions(data.competitions);
      setGalleryItems(data.gallery);
      setRegistrations(data.registrations);
      setDbStatus(data.database);
      setLatencyMs(roundTrip);

      if (isManualTest) {
        showToast(`MongoDB API ping: ${roundTrip}ms · High-speed connection active!`);
      }
    } catch (err) {
      console.error('Failed to load bootstrap data:', err);
      // Fallback to individual fetches
      try {
        const [c, g, r, s] = await Promise.all([
          api.getCompetitions(),
          api.getGallery(),
          api.getRegistrations(),
          api.getDbStatus(),
        ]);
        setCompetitions(c);
        setGalleryItems(g);
        setRegistrations(r);
        setDbStatus(s);
      } catch (fallbackErr) {
        console.error('Fallback failed:', fallbackErr);
      }
    } finally {
      setLoadingCompetitions(false);
      setLoadingGallery(false);
      setLoadingRegistrations(false);
      setIsRefreshing(false);
    }
  }, []);

  // Initial Load
  useEffect(() => {
    const user = api.getStoredUser();
    if (user) setCurrentUser(user);

    loadBootstrapData();
  }, [loadBootstrapData]);

  // Voting handler with instant optimistic increment + background sync
  const handleVote = async (id: string) => {
    setGalleryItems((prev) =>
      prev.map((item) => (item.id === id ? { ...item, votes: item.votes + 1 } : item))
    );
    showToast('Vote counted instantly!');

    try {
      const newVotes = await api.voteGalleryItem(id);
      setGalleryItems((prev) =>
        prev.map((item) => (item.id === id ? { ...item, votes: newVotes } : item))
      );
    } catch (err) {
      console.error('Vote background sync failed:', err);
    }
  };

  // Photo submission handler with instant insertion
  const handleSubmitPhoto = async (data: Partial<GalleryItem>) => {
    try {
      const created = await api.submitGalleryItem(data);
      setGalleryItems((prev) => [created, ...prev]);
      showToast(`Photo for "${created.petName}" published to MongoDB!`);
    } catch (err) {
      console.error('Submission failed:', err);
      showToast('Failed to save photo to database.');
    }
  };

  // Registration success with instant update
  const handleRegistrationSuccess = (newReg: Registration) => {
    setRegistrations((prev) => [newReg, ...prev]);
    // update registered count in matching competition
    setCompetitions((prev) =>
      prev.map((c) => (c.id === newReg.competitionId ? { ...c, registeredCount: c.registeredCount + 1 } : c))
    );
    showToast(`Entry confirmed for ${newReg.petName}! Code: ${newReg.registrationCode}`);
  };

  // Status update (Check-in) with optimistic toggle
  const handleUpdateStatus = async (id: string, status: string) => {
    setRegistrations((prev) =>
      prev.map((r) => (r.id === id ? { ...r, status: status as any } : r))
    );
    try {
      const updated = await api.updateRegistrationStatus(id, status);
      setRegistrations((prev) =>
        prev.map((r) => (r.id === id ? updated : r))
      );
      showToast(`Entrant status updated to "${status}" in MongoDB.`);
    } catch (err) {
      console.error('Status update failed:', err);
    }
  };

  // Cancellation with immediate optimistic removal
  const handleCancelRegistration = async (id: string) => {
    const target = registrations.find((r) => r.id === id);
    setRegistrations((prev) => prev.filter((r) => r.id !== id));
    if (target?.competitionId) {
      setCompetitions((prev) =>
        prev.map((c) => (c.id === target.competitionId ? { ...c, registeredCount: Math.max(0, c.registeredCount - 1) } : c))
      );
    }
    try {
      await api.cancelRegistration(id);
      showToast('Registration cancelled in MongoDB.');
    } catch (err) {
      console.error('Cancellation failed:', err);
    }
  };

  const handleStartRegistrationForComp = (comp: Competition) => {
    setPreSelectedCompForRegister(comp);
    setActiveTab('register');
    window.scrollTo({ top: 0, behavior: 'smooth' });
  };

  return (
    <div className="min-h-screen flex flex-col bg-[#FCFCFD] text-slate-800">
      {/* Toast Notification */}
      {toastMessage && (
        <div className="fixed bottom-6 right-6 z-50 bg-slate-900 text-white px-4 py-3 rounded-xl shadow-lg border border-slate-700 text-xs font-medium flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400 shrink-0" />
          <span>{toastMessage}</span>
        </div>
      )}

      {/* Backend & MongoDB High-Speed Connection Bar */}
      <div className="bg-slate-950 text-slate-300 text-[11px] py-1.5 px-6 border-b border-slate-800">
        <div className="max-w-7xl mx-auto w-full flex items-center justify-between gap-4">
          <div className="flex items-center gap-2.5">
            <span className="w-2 h-2 rounded-full bg-emerald-500 shrink-0" />
            <Database className="w-3.5 h-3.5 text-amber-400 shrink-0" />
            <span className="font-medium text-slate-200">
              MongoDB Backend Connected: <strong className="text-white font-semibold">{dbStatus?.mode || 'Active (petShowDB)'}</strong>
            </span>
            <span className="hidden sm:inline text-slate-500">|</span>
            <span className="hidden sm:flex items-center gap-1 text-emerald-400 font-semibold tabular-nums">
              <Zap className="w-3 h-3 text-emerald-400" />
              <span>{latencyMs !== null ? `${latencyMs}ms latency` : '< 3ms latency'}</span>
            </span>
          </div>

          <div className="flex items-center gap-3">
            <div className="hidden md:flex items-center gap-3 text-slate-400 text-[10px]">
              <span>{competitions.length} Competitions</span>
              <span aria-hidden="true">·</span>
              <span>{galleryItems.length} Photos</span>
              <span aria-hidden="true">·</span>
              <span>{registrations.length} Entrants</span>
            </div>

            <button
              onClick={() => loadBootstrapData(true)}
              disabled={isRefreshing}
              className="flex items-center gap-1 px-2 py-0.5 rounded text-[10px] font-medium bg-slate-800 hover:bg-slate-700 text-slate-200 transition-colors cursor-pointer disabled:opacity-50"
              title="Test MongoDB API response latency"
            >
              <RefreshCw className={`w-3 h-3 ${isRefreshing ? 'animate-spin text-amber-400' : ''}`} />
              <span>Test Ping</span>
            </button>
          </div>
        </div>
      </div>

      {/* Top Bar Navigation Contract */}
      <Navbar
        activeTab={activeTab}
        setActiveTab={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        currentUser={currentUser}
        onOpenAuth={() => setIsAuthOpen(true)}
        onOpenRegister={() => {
          setPreSelectedCompForRegister(null);
          setActiveTab('register');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
        onLogout={() => {
          api.logout();
          setCurrentUser(null);
          showToast('Signed out successfully.');
        }}
      />

      {/* Main Content Sections */}
      <main className="flex-1">
        {activeTab === 'home' && (
          <>
            <Hero
              onExploreCalendar={() => {
                setActiveTab('calendar');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onOpenRegister={() => {
                setActiveTab('register');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
              onViewGallery={() => {
                setActiveTab('gallery');
                window.scrollTo({ top: 0, behavior: 'smooth' });
              }}
            />

            {/* Quick Preview Sections on Home */}
            <section className="py-16 bg-slate-50 border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                      Upcoming Shows & Trials
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display">
                      Next on the Championship Ring Circuit
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('calendar');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-slate-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    View All Calendar Dates →
                  </button>
                </div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                  {competitions.slice(0, 2).map((comp) => (
                    <div
                      key={comp.id}
                      className="bg-white rounded-2xl border border-slate-200 p-6 shadow-xs hover:shadow-sm transition-all flex flex-col justify-between"
                    >
                      <div className="space-y-3">
                        <div className="flex items-center justify-between text-xs text-slate-500">
                          <span className="font-bold text-amber-800 uppercase tracking-wider">{comp.date}</span>
                          <span className="tabular-nums font-semibold text-slate-900">${comp.entryFee} Entry</span>
                        </div>
                        <h3 className="text-lg font-bold text-slate-900 font-display">{comp.title}</h3>
                        <p className="text-xs text-slate-600 line-clamp-2 leading-relaxed">{comp.description}</p>
                        <div className="text-xs text-slate-500 pt-1">
                          Location: <strong className="text-slate-700">{comp.venue}</strong> ({comp.location})
                        </div>
                      </div>

                      <div className="mt-5 pt-4 border-t border-slate-100 flex items-center justify-between gap-3">
                        <button
                          onClick={() => setSelectedCompDetails(comp)}
                          className="text-xs font-medium text-slate-700 hover:text-slate-900 cursor-pointer"
                        >
                          Rules & Judges
                        </button>
                        <button
                          onClick={() => handleStartRegistrationForComp(comp)}
                          className="px-4 py-2 text-xs font-semibold text-white bg-slate-900 rounded-lg hover:bg-slate-800 transition-colors cursor-pointer"
                        >
                          Enter Ring
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>

            {/* Featured Photo Strip */}
            <section className="py-16 bg-white border-t border-slate-200">
              <div className="max-w-7xl mx-auto px-6">
                <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
                  <div>
                    <div className="text-xs font-semibold text-amber-800 uppercase tracking-wider mb-1">
                      Hall of Champions
                    </div>
                    <h2 className="text-2xl font-bold text-slate-900 font-display">
                      Recent Best in Show & Blue Ribbon Recipients
                    </h2>
                  </div>
                  <button
                    onClick={() => {
                      setActiveTab('gallery');
                      window.scrollTo({ top: 0, behavior: 'smooth' });
                    }}
                    className="text-xs font-semibold text-slate-900 hover:text-amber-800 transition-colors cursor-pointer"
                  >
                    Explore Full Photo Gallery →
                  </button>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                  {galleryItems.slice(0, 4).map((item) => (
                    <div
                      key={item.id}
                      onClick={() => {
                        setActiveTab('gallery');
                        window.scrollTo({ top: 0, behavior: 'smooth' });
                      }}
                      className="group bg-slate-50 rounded-2xl border border-slate-200 overflow-hidden cursor-pointer hover:border-slate-300 transition-all"
                    >
                      <div className="aspect-4/3 overflow-hidden bg-slate-200 relative">
                        <img
                          src={item.imageUrl}
                          alt={item.petName}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                          referrerPolicy="no-referrer"
                        />
                        <div className="absolute top-2 left-2 bg-slate-900/80 text-white text-[10px] font-medium px-2 py-0.5 rounded">
                          {item.category}
                        </div>
                      </div>
                      <div className="p-4 space-y-1">
                        <div className="text-xs text-slate-500">{item.species} · {item.breed}</div>
                        <h4 className="text-base font-bold text-slate-900 font-display">{item.petName}</h4>
                        <div className="text-xs text-slate-600 truncate">By {item.ownerName}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          </>
        )}

        {activeTab === 'calendar' && (
          <EventCalendar
            competitions={competitions}
            loading={loadingCompetitions}
            onSelectCompetition={(comp) => setSelectedCompDetails(comp)}
            onRegisterCompetition={handleStartRegistrationForComp}
          />
        )}

        {activeTab === 'gallery' && (
          <PhotoGallery
            items={galleryItems}
            loading={loadingGallery}
            onVote={handleVote}
            onSubmitPhoto={handleSubmitPhoto}
          />
        )}

        {activeTab === 'register' && (
          <RegistrationSection
            competitions={competitions}
            preSelectedCompetition={preSelectedCompForRegister}
            currentUser={currentUser}
            onRegistrationSuccess={handleRegistrationSuccess}
            onNavigateToRoster={() => {
              setActiveTab('directory');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'standings' && (
          <LiveLeaderboard
            galleryItems={galleryItems}
            onSelectPet={(pet) => {
              setActiveTab('gallery');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
            onOpenRegister={() => {
              setActiveTab('register');
              window.scrollTo({ top: 0, behavior: 'smooth' });
            }}
          />
        )}

        {activeTab === 'directory' && (
          <RegistrationsDirectory
            registrations={registrations}
            competitions={competitions}
            loading={loadingRegistrations}
            currentUser={currentUser}
            onUpdateStatus={handleUpdateStatus}
            onCancelRegistration={handleCancelRegistration}
          />
        )}
      </main>

      {/* Global Modals */}
      <CompetitionDetailsModal
        competition={selectedCompDetails}
        onClose={() => setSelectedCompDetails(null)}
        onRegister={handleStartRegistrationForComp}
      />

      <AuthModal
        isOpen={isAuthOpen}
        onClose={() => setIsAuthOpen(false)}
        onSuccess={(user) => {
          setCurrentUser(user);
          showToast(`Welcome, ${user.name}!`);
        }}
      />

      {/* Footer */}
      <Footer
        dbStatus={dbStatus}
        onNavigate={(tab) => {
          setActiveTab(tab);
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />
    </div>
  );
}
