import React, { useState, useEffect } from 'react';
import { RotateCcw, Plus, Volume2, VolumeX, Sparkles } from 'lucide-react';
import { DHIKR_PHRASES, DhikrItem } from '../data/quranData';

interface DhikrCounterProps {
  theme: 'dark' | 'light';
}

export const DhikrCounter: React.FC<DhikrCounterProps> = ({ theme }) => {
  const [selectedDhikrId, setSelectedDhikrId] = useState<string>('subhanallah');
  const [targetCount, setTargetCount] = useState<number>(33);
  const [soundEnabled, setSoundEnabled] = useState(true);

  // Daily counts persisted in localStorage
  const [dailyCounts, setDailyCounts] = useState<{ [key: string]: number }>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('sakinah_dhikr_date');
      if (savedDate !== today) {
        localStorage.setItem('sakinah_dhikr_date', today);
        return {};
      }
      const stored = localStorage.getItem('sakinah_dhikr_counts');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Rounds map
  const [roundsMap, setRoundsMap] = useState<{ [key: string]: number }>(() => {
    try {
      const stored = localStorage.getItem('sakinah_dhikr_rounds');
      return stored ? JSON.parse(stored) : {};
    } catch {
      return {};
    }
  });

  // Sync to local storage
  useEffect(() => {
    try {
      localStorage.setItem('sakinah_dhikr_counts', JSON.stringify(dailyCounts));
      localStorage.setItem('sakinah_dhikr_rounds', JSON.stringify(roundsMap));
      localStorage.setItem('sakinah_dhikr_date', new Date().toISOString().split('T')[0]);
    } catch (e) {
      console.error(e);
    }
  }, [dailyCounts, roundsMap]);

  const activeDhikr = DHIKR_PHRASES.find((d) => d.id === selectedDhikrId) || DHIKR_PHRASES[0];
  const currentCount = dailyCounts[selectedDhikrId] || 0;
  const currentRounds = roundsMap[selectedDhikrId] || 0;

  // Gentle audio click synthesis (zero network asset)
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(620, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(310, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch (e) {
      // AudioContext unavailable
    }
  };

  const handleIncrement = () => {
    playClick();
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    setDailyCounts((prev) => {
      const prevCount = prev[selectedDhikrId] || 0;
      const nextCount = prevCount + 1;

      if (targetCount > 0 && nextCount % targetCount === 0) {
        setRoundsMap((rPrev) => ({
          ...rPrev,
          [selectedDhikrId]: (rPrev[selectedDhikrId] || 0) + 1,
        }));
      }

      return {
        ...prev,
        [selectedDhikrId]: nextCount,
      };
    });
  };

  const [confirmResetAll, setConfirmResetAll] = useState(false);

  const handleResetCurrent = () => {
    setDailyCounts((prev) => ({
      ...prev,
      [selectedDhikrId]: 0,
    }));
  };

  const handleDailyResetAll = () => {
    if (!confirmResetAll) {
      setConfirmResetAll(true);
      setTimeout(() => setConfirmResetAll(false), 3500);
      return;
    }
    setDailyCounts({});
    setRoundsMap({});
    setConfirmResetAll(false);
  };

  // Keyboard shortcut: Spacebar increments
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.code === 'Space' && e.target === document.body) {
        e.preventDefault();
        handleIncrement();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [selectedDhikrId, targetCount, soundEnabled]);

  const progressPercent = targetCount > 0
    ? Math.min(100, ((currentCount % targetCount) / targetCount) * 100)
    : 0;

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Title & Controls Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4">
        <div>
          <span className="font-heading text-4xl sm:text-5xl tracking-wide uppercase text-amber-500">
            TASBEEH & DHIKR
          </span>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${
            theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
          }`}>
            Track your daily spiritual remembrance with tactile calm.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute audio' : 'Enable audio'}
            className={`p-2 rounded-full border-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:text-white'
                : 'bg-white border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={handleDailyResetAll}
            className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-all active:scale-95 cursor-pointer ${
              confirmResetAll
                ? 'bg-rose-600 border-rose-600 text-white'
                : theme === 'dark'
                  ? 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                  : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            {confirmResetAll ? 'Tap to Confirm' : 'Daily Reset'}
          </button>
        </div>
      </div>

      {/* Phrases Selector Grid */}
      <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2.5">
        {DHIKR_PHRASES.map((item) => {
          const isSelected = selectedDhikrId === item.id;
          const count = dailyCounts[item.id] || 0;
          return (
            <button
              key={item.id}
              onClick={() => {
                setSelectedDhikrId(item.id);
                setTargetCount(item.recommendedTarget);
              }}
              className={`p-3 text-left rounded-2xl border-2 transition-all cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? theme === 'dark'
                    ? 'bg-stone-800 border-amber-400 text-amber-200'
                    : 'bg-[#FEF08A] border-[#2C1810] text-[#2C1810] shadow-[3px_3px_0px_#2C1810]'
                  : theme === 'dark'
                    ? 'bg-[#151922] border-stone-800 text-stone-400 hover:border-stone-700'
                    : 'bg-white border-[#2C1810]/30 text-[#4A3228] hover:border-[#2C1810]'
              }`}
            >
              <div>
                <div className="font-arabic text-sm leading-tight mb-1 font-bold">
                  {item.arabic}
                </div>
                <div className="text-xs font-bold truncate">
                  {item.name}
                </div>
              </div>

              <div className="mt-2 pt-2 border-t border-current/20 flex items-center justify-between text-[11px] font-mono">
                <span className="opacity-70">Today:</span>
                <span className="font-bold">{count}</span>
              </div>
            </button>
          );
        })}
      </div>

      {/* Main Big Minimalist Counter Card */}
      <div className={`rounded-3xl border-2 p-8 sm:p-12 text-center relative overflow-hidden transition-colors ${
        theme === 'dark'
          ? 'bg-[#151922] border-stone-700 text-stone-100 shadow-xl'
          : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[8px_8px_0px_#2C1810]'
      }`}>
        {/* Top Progress Bar */}
        <div className="absolute top-0 left-0 right-0 h-2 bg-stone-300/30">
          <div
            className={`h-full transition-all duration-150 ${
              theme === 'dark' ? 'bg-amber-400' : 'bg-[#2C1810]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>

        <div className="max-w-md mx-auto space-y-5">
          {/* Active Phrase Typography */}
          <div>
            <div className="font-arabic text-3xl sm:text-4xl md:text-5xl font-bold leading-relaxed mb-1">
              {activeDhikr.arabic}
            </div>
            <div className="text-xs font-serif italic text-stone-400">
              {activeDhikr.transliteration}
            </div>
            <p className="text-xs font-semibold mt-1 opacity-80">
              &ldquo;{activeDhikr.meaning}&rdquo;
            </p>
          </div>

          {/* Huge Number Display */}
          <div className="py-2">
            <div className="font-mono text-7xl sm:text-8xl font-black tracking-tight tabular-nums">
              {currentCount}
            </div>
            <div className="flex items-center justify-center gap-3 text-xs font-bold mt-2 font-mono">
              <span>Goal: {targetCount}</span>
              <span aria-hidden="true">·</span>
              <span>Round {currentRounds + 1}</span>
            </div>
          </div>

          {/* Big Tactile Non-Gradient Counter Button */}
          <div className="flex flex-col items-center gap-3 pt-2">
            <button
              onClick={handleIncrement}
              className={`w-36 h-36 sm:w-40 sm:h-40 rounded-full border-4 flex flex-col items-center justify-center transition-transform active:scale-95 cursor-pointer select-none ${
                theme === 'dark'
                  ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                  : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A] shadow-[6px_6px_0px_#F59E0B]'
              }`}
              aria-label="Increment Dhikr"
            >
              <Plus className="w-10 h-10 stroke-[3]" />
              <span className="font-heading text-xl tracking-wider uppercase mt-1">
                COUNT
              </span>
            </button>
            <span className="text-[11px] font-bold opacity-60">
              Tap circle or press Spacebar
            </span>
          </div>

          {/* Target Preset Selector & Reset Current */}
          <div className="flex items-center justify-between pt-6 border-t-2 border-current/15 text-xs font-bold">
            <div className="flex items-center gap-2">
              <span className="opacity-70">Target:</span>
              {[33, 99, 100].map((t) => (
                <button
                  key={t}
                  onClick={() => setTargetCount(t)}
                  className={`px-3 py-1 rounded-full border-2 font-mono transition-transform cursor-pointer ${
                    targetCount === t
                      ? theme === 'dark'
                        ? 'bg-amber-400 text-stone-950 border-amber-300'
                        : 'bg-[#2C1810] text-white border-[#2C1810]'
                      : 'border-transparent opacity-60 hover:opacity-100'
                  }`}
                >
                  {t}
                </button>
              ))}
            </div>

            <button
              onClick={handleResetCurrent}
              className="flex items-center gap-1 opacity-70 hover:opacity-100 transition-opacity cursor-pointer"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Current</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};
