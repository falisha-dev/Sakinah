/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React, { useState, useEffect, useMemo } from 'react';
import { MOOD_CATEGORIES, QURAN_VERSES, QuranVerse } from './data/quranData';
import { DhikrCounter } from './components/DhikrCounter';
import { Header, NavigationTab } from './components/Header';
import { VerseCard } from './components/VerseCard';
import { MoodSelector } from './components/MoodSelector';
import { EmotionReflectionModal, SavedJournalEntry } from './components/EmotionReflectionModal';
import { JournalView } from './components/JournalView';
import { DailyAdhkarView } from './components/DailyAdhkarView';
import { BreathworkView } from './components/BreathworkView';
import { SakinahBird } from './components/SakinahBird';
import { Sparkles, Feather, Plus, Check, Search, Calendar, Heart, BookOpen, Layers, BookmarkCheck, Shield, Wind } from 'lucide-react';

export default function App() {
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    try {
      const stored = localStorage.getItem('sakinah_theme');
      return (stored === 'light' || stored === 'dark') ? stored : 'light';
    } catch {
      return 'light';
    }
  });

  const [activeTab, setActiveTab] = useState<NavigationTab>('contemplate');
  const [selectedMoodId, setSelectedMoodId] = useState<string>('anxious');

  // Reflection modal
  const [reflectionVerse, setReflectionVerse] = useState<QuranVerse | null>(null);

  // Local storage for bookmarks and journal
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem('sakinah_bookmarks');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const [journalEntries, setJournalEntries] = useState<SavedJournalEntry[]>(() => {
    try {
      const stored = localStorage.getItem('sakinah_journal');
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  // Quick Dhikr widget count for the dashboard
  const [quickCount, setQuickCount] = useState<number>(() => {
    try {
      const stored = localStorage.getItem('sakinah_quick_dhikr');
      return stored ? parseInt(stored, 10) : 0;
    } catch {
      return 0;
    }
  });

  const handleQuickIncrement = () => {
    setQuickCount((prev) => {
      const next = prev + 1;
      try {
        localStorage.setItem('sakinah_quick_dhikr', next.toString());
      } catch (e) {
        // ignore
      }
      return next;
    });
  };

  const handleQuickReset = () => {
    setQuickCount(0);
    try {
      localStorage.setItem('sakinah_quick_dhikr', '0');
    } catch (e) {
      // ignore
    }
  };

  // Theme synchronization to localStorage & body class
  useEffect(() => {
    try {
      localStorage.setItem('sakinah_theme', theme);
      if (theme === 'light') {
        document.documentElement.classList.remove('dark');
        document.body.style.backgroundColor = '#7a93ea';
        document.body.style.color = '#2C1810';
      } else {
        document.documentElement.classList.add('dark');
        document.body.style.backgroundColor = '#0e111a';
        document.body.style.color = '#F3F4F6';
      }
    } catch (e) {
      console.error(e);
    }
  }, [theme]);

  // Sync bookmarks and journal to localStorage
  useEffect(() => {
    try {
      localStorage.setItem('sakinah_bookmarks', JSON.stringify(bookmarkedIds));
    } catch (e) {
      console.error(e);
    }
  }, [bookmarkedIds]);

  useEffect(() => {
    try {
      localStorage.setItem('sakinah_journal', JSON.stringify(journalEntries));
    } catch (e) {
      console.error(e);
    }
  }, [journalEntries]);

  // Verses filtered by selected mood
  const currentMoodVerses = useMemo(() => {
    const list = QURAN_VERSES.filter((v) => v.moodId === selectedMoodId);
    return list.length > 0 ? list : QURAN_VERSES.filter((v) => v.moodId === 'anxious');
  }, [selectedMoodId]);

  const currentMoodObj = useMemo(() => {
    return MOOD_CATEGORIES.find((m) => m.id === selectedMoodId) || MOOD_CATEGORIES[0];
  }, [selectedMoodId]);

  // Featured verse
  const [activeVerseIndex, setActiveVerseIndex] = useState(0);
  const activeVerse = currentMoodVerses[activeVerseIndex] || currentMoodVerses[0];

  const handleToggleTheme = () => {
    setTheme((prev) => (prev === 'dark' ? 'light' : 'dark'));
  };

  const handleTabSwitch = (tab: NavigationTab) => {
    setActiveTab(tab);
    const target = document.getElementById('main-dashboard');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  const handleToggleBookmark = (verse: QuranVerse) => {
    setBookmarkedIds((prev) =>
      prev.includes(verse.id) ? prev.filter((id) => id !== verse.id) : [...prev, verse.id]
    );
  };

  const handleSaveJournalEntry = (entry: SavedJournalEntry) => {
    setJournalEntries((prev) => [entry, ...prev]);
  };

  const handleDeleteJournalEntry = (id: string) => {
    setJournalEntries((prev) => prev.filter((e) => e.id !== id));
  };

  const handleClearJournal = () => {
    setJournalEntries([]);
  };

  return (
    <div className={`min-h-screen p-2 sm:p-5 md:p-8 flex flex-col items-center justify-start transition-colors duration-200 ${
      theme === 'dark' ? 'bg-[#0e111a]' : 'bg-[#7a93ea]'
    }`}>
      {/* Central Poster Canvas Container */}
      <div className={`w-full max-w-6xl rounded-3xl overflow-hidden border-3 shadow-2xl transition-colors ${
        theme === 'dark'
          ? 'bg-[#151922] border-stone-800'
          : 'bg-[#FFFDF5] border-[#2C1810]'
      }`}>
        {/* ======================================================== */}
        {/* SECTION 1: THE RADIANT YELLOW HERO (JAMBIRD AESTHETIC)    */}
        {/* ======================================================== */}
        <section className={`relative pt-2 pb-10 sm:pb-14 px-4 sm:px-12 flex flex-col justify-between overflow-hidden border-b-3 transition-colors ${
          theme === 'dark'
            ? 'bg-[#1b1f2e] border-stone-800 text-stone-100'
            : 'bg-[#F8D038] border-[#2C1810] text-[#2C1810]'
        }`}>
          {/* Header Navigation */}
          <Header
            activeTab={activeTab}
            setActiveTab={handleTabSwitch}
            theme={theme}
            onToggleTheme={handleToggleTheme}
            savedReflectionsCount={journalEntries.length}
          />

          {/* Massive Display Title with Centered Mascot */}
          <div className="relative my-6 sm:my-12 text-center select-none flex flex-col items-center justify-center">
            {/* The giant condensed title */}
            <h1 className={`font-heading text-8xl sm:text-[11rem] md:text-[14rem] lg:text-[16rem] leading-[0.82] tracking-tighter uppercase font-black transition-colors ${
              theme === 'dark' ? 'text-stone-100' : 'text-[#2C1810]'
            }`}>
              SAKINAH
            </h1>

            {/* Mascot in the center of the giant text, just like JAMBIRD! */}
            <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none mt-2">
              <SakinahBird size={140} className="sm:scale-125 md:scale-140" />
            </div>
          </div>

          {/* Kicker subtitles at bottom-left and bottom-right */}
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 pt-4 text-xs font-bold uppercase tracking-wider">
            <div className="text-center sm:text-left max-w-xs">
              Tell your Lord what you&apos;re feeling today.
            </div>

            <div className="text-center sm:text-right max-w-xs opacity-80 normal-case font-medium">
              Quranic comfort, emotional clarity &amp; daily adhkar for the soul.
            </div>
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 2: THE CANDY PINK BAND WITH MARQUEE & APP CARD  */}
        {/* ======================================================== */}
        <section className={`relative pt-6 pb-12 sm:pb-16 px-3 sm:px-8 border-b-3 transition-colors overflow-hidden ${
          theme === 'dark'
            ? 'bg-[#29172d] border-stone-800'
            : 'bg-[#FFA6CD] border-[#2C1810]'
        }`}>
          {/* Marquee Ticker: "WHAT IS ON YOUR HEART TODAY?" */}
          <div className="overflow-hidden py-3 -mx-4 sm:-mx-8 border-y-2 border-current/20 select-none mb-8">
            <div className="animate-ticker text-base sm:text-lg font-black tracking-tight uppercase whitespace-nowrap text-[#2C1810]">
              <span className="mx-4">What is on your heart today?</span>
              <span className="mx-4">·</span>
              <span className="mx-4">Seek stillness in remembrance</span>
              <span className="mx-4">·</span>
              <span className="mx-4">What is on your heart today?</span>
              <span className="mx-4">·</span>
              <span className="mx-4">Seek stillness in remembrance</span>
              <span className="mx-4">·</span>
              <span className="mx-4">What is on your heart today?</span>
              <span className="mx-4">·</span>
              <span className="mx-4">Seek stillness in remembrance</span>
              <span className="mx-4">·</span>
              <span className="mx-4">What is on your heart today?</span>
              <span className="mx-4">·</span>
              <span className="mx-4">Seek stillness in remembrance</span>
            </div>
          </div>

          {/* Floating Dashboard Card Window (The active view container) */}
          <div
            id="main-dashboard"
            className={`max-w-5xl mx-auto rounded-3xl border-3 transition-all p-5 sm:p-8 scroll-mt-6 ${
              theme === 'dark'
                ? 'bg-[#151922] border-stone-700 shadow-2xl'
                : 'bg-white border-[#2C1810] shadow-[12px_12px_0px_#2C1810]'
            }`}
          >
            {/* Window Top Navigation Bar: Direct tab switcher inside the dashboard */}
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 pb-6 mb-6 border-b-2 border-current/15">
              {/* Primary Tab Switcher */}
              <div className="flex items-center gap-2 overflow-x-auto pb-1 scrollbar-none">
                <button
                  type="button"
                  onClick={() => setActiveTab('contemplate')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'contemplate'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <BookOpen className="w-3.5 h-3.5" />
                  <span>Contemplate</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('breathwork')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'breathwork'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <Wind className="w-3.5 h-3.5 text-sky-400" />
                  <span>Breathwork</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('adhkar')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'adhkar'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <Shield className="w-3.5 h-3.5 text-amber-500" />
                  <span>Daily Adhkar</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('dhikr')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'dhikr'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>Tasbeeh Counter</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('moods')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'moods'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <Layers className="w-3.5 h-3.5" />
                  <span>Verses by Mood</span>
                </button>

                <button
                  type="button"
                  onClick={() => setActiveTab('journal')}
                  className={`px-4 py-2 rounded-full text-xs font-bold flex items-center gap-1.5 transition-all cursor-pointer border-2 ${
                    activeTab === 'journal'
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : theme === 'dark'
                        ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                        : 'bg-[#FFFDF5] text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                  }`}
                >
                  <BookmarkCheck className="w-3.5 h-3.5" />
                  <span>Journal {journalEntries.length > 0 && `(${journalEntries.length})`}</span>
                </button>
              </div>

              {/* Date stamp indicator */}
              <div className="flex items-center gap-2 text-xs font-bold opacity-70 whitespace-nowrap">
                <Calendar className="w-3.5 h-3.5" />
                <span>Today · {new Date().toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}</span>
              </div>
            </div>

            {/* TAB VIEW 1: CONTEMPLATE (Active Verse & Quick Dhikr) */}
            {activeTab === 'contemplate' && (
              <div className="space-y-6">
                {/* Mood Pills Strip with Subtle Spring Pop Transitions */}
                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <span className="text-xs font-bold uppercase tracking-wider opacity-60 mr-1 shrink-0">
                    State:
                  </span>
                  {MOOD_CATEGORIES.map((mood) => {
                    const isActive = selectedMoodId === mood.id;
                    return (
                      <button
                        key={mood.id}
                        type="button"
                        onClick={() => {
                          setSelectedMoodId(mood.id);
                          setActiveVerseIndex(0);
                        }}
                        className={`mood-card-interactive px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap cursor-pointer border-2 flex items-center gap-1.5 ${
                          isActive
                            ? theme === 'dark'
                              ? 'mood-card-selected bg-stone-800 text-amber-200 border-amber-400 shadow-[0_0_12px_rgba(251,191,36,0.2)]'
                              : 'mood-card-selected bg-[#FEF08A] text-[#2C1810] border-[#2C1810] shadow-[3px_3px_0px_#2C1810]'
                            : theme === 'dark'
                              ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                              : 'bg-white text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                        }`}
                      >
                        <span
                          className="w-2 h-2 rounded-full inline-block transition-transform duration-150"
                          style={{
                            backgroundColor: mood.dominantColor,
                            transform: isActive ? 'scale(1.4)' : 'scale(1)',
                          }}
                        />
                        <span>{mood.name.split('&')[0].trim()}</span>
                      </button>
                    );
                  })}
                </div>

                {/* 2-Column Verse + Quick Dhikr layout */}
                <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                  <div className="lg:col-span-8">
                    {/* Subtle Crossfade when mood changes */}
                    <div key={selectedMoodId + '-' + activeVerseIndex} className="animate-verse-swap">
                      {activeVerse && (
                        <VerseCard
                          verse={activeVerse}
                          onOpenReflection={(v) => setReflectionVerse(v)}
                          isBookmarked={bookmarkedIds.includes(activeVerse.id)}
                          onToggleBookmark={handleToggleBookmark}
                          theme={theme}
                        />
                      )}
                    </div>

                    {/* Multi-verse switcher if multiple verses for mood */}
                    {currentMoodVerses.length > 1 && (
                      <div className={`mt-4 flex items-center justify-between p-3.5 rounded-2xl text-xs font-bold border-2 ${
                        theme === 'dark'
                          ? 'bg-stone-900 border-stone-800 text-stone-300'
                          : 'bg-[#FFFDF5] border-[#2C1810]/20 text-[#2C1810]'
                      }`}>
                        <span>
                          Verse {activeVerseIndex + 1} of {currentMoodVerses.length} for {currentMoodObj.name}
                        </span>
                        <div className="flex items-center gap-1.5">
                          {currentMoodVerses.map((_, idx) => (
                            <button
                              key={idx}
                              type="button"
                              onClick={() => setActiveVerseIndex(idx)}
                              className={`w-7 h-7 rounded-full font-mono text-xs border-2 transition-transform cursor-pointer ${
                                activeVerseIndex === idx
                                  ? theme === 'dark'
                                    ? 'bg-amber-400 text-stone-950 border-amber-300 font-bold'
                                    : 'bg-[#2C1810] text-white border-[#2C1810] font-bold'
                                  : 'border-current/20 opacity-60 hover:opacity-100'
                              }`}
                            >
                              {idx + 1}
                            </button>
                          ))}
                        </div>
                      </div>
                    )}
                  </div>

                  {/* Right Column: Quick Dhikr Widget */}
                  <div className="lg:col-span-4 space-y-4">
                    <div className={`p-5 sm:p-6 rounded-2xl border-2 flex flex-col justify-between transition-colors ${
                      theme === 'dark'
                        ? 'bg-stone-900 border-stone-800 text-stone-100'
                        : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] shadow-[4px_4px_0px_#2C1810]'
                    }`}>
                      <div className="flex items-center justify-between pb-3 border-b-2 border-current/15">
                        <span className="font-heading text-xl uppercase tracking-wide">
                          QUICK TASBEEH
                        </span>
                        <button
                          type="button"
                          onClick={handleQuickReset}
                          className="text-[11px] font-bold opacity-60 hover:opacity-100 cursor-pointer"
                        >
                          Reset
                        </button>
                      </div>

                      <div className="py-6 text-center">
                        <div className="font-arabic text-2xl font-bold mb-1">
                          سُبْحَانَ ٱللَّٰهِ
                        </div>
                        <div className="font-mono text-5xl font-black tracking-tight my-2">
                          {quickCount}
                        </div>
                        <div className="text-[11px] font-bold opacity-70">
                          SubhanAllah (Glory be to Allah)
                        </div>
                      </div>

                      <button
                        type="button"
                        onClick={handleQuickIncrement}
                        className={`w-full py-3 rounded-full font-bold text-xs border-2 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer ${
                          theme === 'dark'
                            ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                            : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                        }`}
                      >
                        <Plus className="w-4 h-4 stroke-[3]" />
                        <span>TAP TO COUNT</span>
                      </button>
                    </div>

                    <div className={`p-4 rounded-2xl border-2 text-xs font-semibold leading-relaxed ${
                      theme === 'dark'
                        ? 'bg-stone-900/60 border-stone-800 text-stone-300'
                        : 'bg-[#FEFCE8] border-[#2C1810]/30 text-[#4A3228]'
                    }`}>
                      💡 &ldquo;Unquestionably, by the remembrance of Allah hearts are assured.&rdquo; (13:28)
                    </div>
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW: BREATHWORK (4-7-8 Somatic Relaxation) */}
            {activeTab === 'breathwork' && (
              <div className="py-2">
                <BreathworkView theme={theme} />
              </div>
            )}

            {/* TAB VIEW 2: DAILY ADHKAR */}
            {activeTab === 'adhkar' && (
              <div className="py-2">
                <DailyAdhkarView theme={theme} />
              </div>
            )}

            {/* TAB VIEW 3: DHIKR COUNTER */}
            {activeTab === 'dhikr' && (
              <div className="py-2">
                <DhikrCounter theme={theme} />
              </div>
            )}

            {/* TAB VIEW 4: VERSES BY MOOD */}
            {activeTab === 'moods' && (
              <div className="space-y-8 py-2">
                <MoodSelector
                  selectedMoodId={selectedMoodId}
                  onSelectMood={(id) => {
                    setSelectedMoodId(id);
                    setActiveVerseIndex(0);
                  }}
                  theme={theme}
                />

                <div className="space-y-6 pt-6 border-t-2 border-current/15">
                  <h3 className="font-heading text-4xl uppercase tracking-wide">
                    Verses for {currentMoodObj.name}
                  </h3>

                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    {currentMoodVerses.map((verse) => (
                      <VerseCard
                        key={verse.id}
                        verse={verse}
                        onOpenReflection={(v) => setReflectionVerse(v)}
                        isBookmarked={bookmarkedIds.includes(verse.id)}
                        onToggleBookmark={handleToggleBookmark}
                        theme={theme}
                      />
                    ))}
                  </div>
                </div>
              </div>
            )}

            {/* TAB VIEW 5: JOURNAL */}
            {activeTab === 'journal' && (
              <div className="py-2">
                <JournalView
                  entries={journalEntries}
                  onDeleteEntry={handleDeleteJournalEntry}
                  onClearAll={handleClearJournal}
                  onNavigateToContemplate={() => setActiveTab('contemplate')}
                  theme={theme}
                />
              </div>
            )}
          </div>
        </section>

        {/* ======================================================== */}
        {/* SECTION 3: THE BUTTER CREAM SECTION ("THEY LOVE IT!")   */}
        {/* ======================================================== */}
        <section className={`py-12 sm:py-16 px-6 sm:px-12 transition-colors ${
          theme === 'dark'
            ? 'bg-[#151922] text-stone-100'
            : 'bg-[#FFFDF5] text-[#2C1810]'
        }`}>
          {activeTab === 'contemplate' ? (
            <div className="space-y-8">
              <div className="text-center max-w-xl mx-auto space-y-2 mb-8">
                <h2 className="font-heading text-6xl sm:text-7xl font-black tracking-tight uppercase">
                  HEART AT PEACE
                </h2>
                <p className="text-xs sm:text-sm font-semibold opacity-80">
                  Explore all 11 emotional climates to discover resonant Quranic solace.
                </p>
              </div>

              <MoodSelector
                selectedMoodId={selectedMoodId}
                onSelectMood={(id) => {
                  setSelectedMoodId(id);
                  setActiveVerseIndex(0);
                  const target = document.getElementById('main-dashboard');
                  if (target) {
                    target.scrollIntoView({ behavior: 'smooth', block: 'start' });
                  }
                }}
                theme={theme}
              />
            </div>
          ) : (
            <div className="flex flex-col sm:flex-row items-center justify-between gap-4 p-6 rounded-3xl border-2 border-current/20">
              <div>
                <h4 className="font-heading text-3xl uppercase tracking-wide">
                  Looking for more reflection?
                </h4>
                <p className="text-xs font-medium opacity-80 mt-1">
                  Switch back to daily contemplation or browse the other spiritual sanctuaries.
                </p>
              </div>
              <button
                type="button"
                onClick={() => handleTabSwitch('contemplate')}
                className={`px-5 py-2.5 rounded-full font-bold text-xs border-2 transition-transform active:scale-95 cursor-pointer ${
                  theme === 'dark'
                    ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                    : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                }`}
              >
                Back to Contemplate
              </button>
            </div>
          )}
        </section>

        {/* Footer Banner */}
        <footer className={`py-8 px-6 text-center text-xs font-bold border-t-3 transition-colors ${
          theme === 'dark'
            ? 'bg-[#10141d] border-stone-800 text-stone-400'
            : 'bg-[#F8D038] border-[#2C1810] text-[#2C1810]'
        }`}>
          <div className="flex flex-col sm:flex-row items-center justify-between gap-4 max-w-5xl mx-auto">
            <div className="flex items-center gap-2">
              <SakinahBird size={24} />
              <span className="font-heading text-lg tracking-wider">SAKINAH</span>
              <span aria-hidden="true">·</span>
              <span>Quranic Wisdom for the Contemporary Soul</span>
            </div>
            <div className="opacity-80">
              Audio recitations courtesy of EveryAyah CDN · Joyful Minimalist Spiritual Technology
            </div>
          </div>
        </footer>
      </div>

      {/* Daily Emotion Reflection Modal */}
      {reflectionVerse && (
        <EmotionReflectionModal
          verse={reflectionVerse}
          onClose={() => setReflectionVerse(null)}
          onSaveEntry={handleSaveJournalEntry}
          theme={theme}
        />
      )}
    </div>
  );
}
