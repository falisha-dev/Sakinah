import React, { useState, useEffect } from 'react';
import { DAILY_ADHKAR, AdhkarItem } from '../data/quranData';
import { Check, RotateCcw, Sun, Moon, Sparkles, Volume2, VolumeX, ShieldCheck, ChevronRight } from 'lucide-react';

interface DailyAdhkarViewProps {
  theme: 'dark' | 'light';
}

type AdhkarCategory = 'morning' | 'evening' | 'sleep';

export const DailyAdhkarView: React.FC<DailyAdhkarViewProps> = ({ theme }) => {
  const [selectedCategory, setSelectedCategory] = useState<AdhkarCategory>(() => {
    // Automatically default to morning or evening based on local hour
    const hour = new Date().getHours();
    if (hour >= 4 && hour < 15) return 'morning';
    if (hour >= 15 && hour < 21) return 'evening';
    return 'sleep';
  });

  const [soundEnabled, setSoundEnabled] = useState(true);

  // Counts map: { [adhkarId]: count }
  const [counts, setCounts] = useState<{ [id: string]: number }>(() => {
    try {
      const today = new Date().toISOString().split('T')[0];
      const savedDate = localStorage.getItem('sakinah_adhkar_date');
      if (savedDate !== today) {
        localStorage.setItem('sakinah_adhkar_date', today);
        return {};
      }
      const saved = localStorage.getItem('sakinah_adhkar_counts');
      return saved ? JSON.parse(saved) : {};
    } catch {
      return {};
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('sakinah_adhkar_counts', JSON.stringify(counts));
      localStorage.setItem('sakinah_adhkar_date', new Date().toISOString().split('T')[0]);
    } catch (e) {
      console.error(e);
    }
  }, [counts]);

  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(580, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(290, ctx.currentTime + 0.035);

      gain.gain.setValueAtTime(0.06, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.04);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.045);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleIncrement = (item: AdhkarItem) => {
    playClick();
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    setCounts((prev) => {
      const current = prev[item.id] || 0;
      if (current >= item.targetCount) return prev; // already complete
      return {
        ...prev,
        [item.id]: current + 1,
      };
    });
  };

  const handleResetCategory = () => {
    setCounts((prev) => {
      const next = { ...prev };
      const itemsInCat = DAILY_ADHKAR.filter((i) => i.category === selectedCategory);
      itemsInCat.forEach((i) => {
        delete next[i.id];
      });
      return next;
    });
  };

  const categoryItems = DAILY_ADHKAR.filter((i) => i.category === selectedCategory);
  const completedCount = categoryItems.filter(
    (i) => (counts[i.id] || 0) >= i.targetCount
  ).length;

  const progressPercent = categoryItems.length > 0
    ? Math.round((completedCount / categoryItems.length) * 100)
    : 0;

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      {/* Top Header & Session Bar */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <span className="font-heading text-4xl sm:text-5xl tracking-wide uppercase text-amber-500">
            DAILY ADHKAR
          </span>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${
            theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
          }`}>
            Prophetic supplications and morning, evening, and bedtime divine protection.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
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
            onClick={handleResetCategory}
            className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            Reset {selectedCategory}
          </button>
        </div>
      </div>

      {/* Category Pills Switcher */}
      <div className="flex items-center gap-2.5 overflow-x-auto pb-1 scrollbar-none">
        <button
          type="button"
          onClick={() => setSelectedCategory('morning')}
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 ${
            selectedCategory === 'morning'
              ? theme === 'dark'
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
                : 'bg-[#2C1810] text-[#FFFDF5] border-[#2C1810] shadow-[3px_3px_0px_#F59E0B]'
              : theme === 'dark'
                ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                : 'bg-white text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
          }`}
        >
          <Sun className="w-4 h-4 text-amber-500" />
          <span>Morning Adhkar (أذكار الصباح)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('evening')}
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 ${
            selectedCategory === 'evening'
              ? theme === 'dark'
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
                : 'bg-[#2C1810] text-[#FFFDF5] border-[#2C1810] shadow-[3px_3px_0px_#F59E0B]'
              : theme === 'dark'
                ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                : 'bg-white text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
          }`}
        >
          <Moon className="w-4 h-4 text-indigo-400" />
          <span>Evening Adhkar (أذكار المساء)</span>
        </button>

        <button
          type="button"
          onClick={() => setSelectedCategory('sleep')}
          className={`px-5 py-2.5 rounded-full font-bold text-xs flex items-center gap-2 transition-all cursor-pointer border-2 ${
            selectedCategory === 'sleep'
              ? theme === 'dark'
                ? 'bg-amber-400 text-stone-950 border-amber-300 shadow-sm'
                : 'bg-[#2C1810] text-[#FFFDF5] border-[#2C1810] shadow-[3px_3px_0px_#F59E0B]'
              : theme === 'dark'
                ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                : 'bg-white text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
          }`}
        >
          <Sparkles className="w-4 h-4 text-purple-400" />
          <span>Sleep Adhkar (أذكار النوم)</span>
        </button>
      </div>

      {/* Completion Banner */}
      <div className={`p-4 rounded-2xl border-2 flex items-center justify-between transition-colors ${
        theme === 'dark'
          ? 'bg-stone-900 border-stone-800 text-stone-200'
          : 'bg-[#FEFCE8] border-[#2C1810]/20 text-[#2C1810]'
      }`}>
        <div className="flex items-center gap-3">
          <ShieldCheck className="w-5 h-5 text-amber-500" />
          <div className="text-xs font-bold">
            <span>{completedCount} of {categoryItems.length} Completed</span>
            <span className="opacity-70 font-normal ml-2">({progressPercent}%)</span>
          </div>
        </div>

        <div className="w-32 sm:w-48 h-2.5 bg-stone-300/40 rounded-full overflow-hidden">
          <div
            className={`h-full transition-all duration-300 ${
              theme === 'dark' ? 'bg-amber-400' : 'bg-[#2C1810]'
            }`}
            style={{ width: `${progressPercent}%` }}
          />
        </div>
      </div>

      {/* Adhkar Items Stack */}
      <div className="space-y-4">
        {categoryItems.map((item) => {
          const currentCount = counts[item.id] || 0;
          const isComplete = currentCount >= item.targetCount;

          return (
            <article
              key={item.id}
              className={`rounded-2xl border-2 p-5 sm:p-7 space-y-4 transition-all ${
                isComplete
                  ? theme === 'dark'
                    ? 'bg-stone-900/90 border-amber-400/80 shadow-sm opacity-95'
                    : 'bg-[#FEF9E7] border-[#2C1810] shadow-[3px_3px_0px_#2C1810]'
                  : theme === 'dark'
                    ? 'bg-[#151922] border-stone-800'
                    : 'bg-white border-[#2C1810]/30 shadow-[3px_3px_0px_#2C1810]/40'
              }`}
            >
              {/* Header */}
              <div className="flex items-start justify-between gap-3 pb-3 border-b-2 border-current/15">
                <div>
                  <h4 className="font-bold text-sm sm:text-base">
                    {item.title}
                  </h4>
                  <span className="text-[11px] font-mono opacity-70 block mt-0.5">
                    {item.source}
                  </span>
                </div>

                <div className="text-right">
                  <span className={`px-2.5 py-1 rounded-full text-xs font-mono font-bold border ${
                    isComplete
                      ? 'bg-emerald-500 text-white border-emerald-600'
                      : 'bg-amber-400/20 text-amber-500 border-amber-400/40'
                  }`}>
                    {currentCount} / {item.targetCount}
                  </span>
                </div>
              </div>

              {/* Arabic Script */}
              <div className="py-2 text-right dir-rtl">
                <p className={`font-arabic text-xl sm:text-2xl leading-[2.2] tracking-wide select-text ${
                  theme === 'dark' ? 'text-amber-100' : 'text-[#2C1810]'
                }`}>
                  {item.arabic}
                </p>
              </div>

              {/* Transliteration & Translation */}
              <div className="space-y-2 text-xs">
                <p className="font-serif italic opacity-75 leading-relaxed">
                  {item.transliteration}
                </p>
                <p className="font-semibold leading-relaxed">
                  &ldquo;{item.translation}&rdquo;
                </p>
              </div>

              {/* Benefit & Action */}
              <div className="pt-3 border-t-2 border-current/15 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <p className="text-[11px] opacity-75 max-w-lg leading-relaxed">
                  <strong className="text-amber-500">Virtue:</strong> {item.benefit}
                </p>

                <button
                  type="button"
                  onClick={() => handleIncrement(item)}
                  disabled={isComplete}
                  className={`px-5 py-2 rounded-full font-bold text-xs border-2 flex items-center justify-center gap-1.5 transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
                    isComplete
                      ? 'bg-emerald-500 text-white border-emerald-600 opacity-90 cursor-default'
                      : theme === 'dark'
                        ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                        : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                  }`}
                >
                  {isComplete ? (
                    <>
                      <Check className="w-3.5 h-3.5" />
                      <span>Completed</span>
                    </>
                  ) : (
                    <>
                      <span>Tap to Recite ({currentCount + 1}/{item.targetCount})</span>
                    </>
                  )}
                </button>
              </div>
            </article>
          );
        })}
      </div>
    </div>
  );
};
