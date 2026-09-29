import React, { useState } from 'react';
import { MOOD_CATEGORIES, SITUATION_ADHKAR, SituationDhikr } from '../data/quranData';
import { Copy, Check, RotateCcw, Volume2, VolumeX, Sparkles, BookOpen, ChevronRight } from 'lucide-react';

interface AdhkariViewProps {
  selectedMoodId: string;
  onSelectMood: (moodId: string) => void;
  theme?: 'dark' | 'light';
}

export const AdhkariView: React.FC<AdhkariViewProps> = ({
  selectedMoodId,
  onSelectMood,
  theme = 'dark',
}) => {
  const [counts, setCounts] = useState<{ [id: string]: number }>({});
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [soundEnabled, setSoundEnabled] = useState(true);

  const activeMoodObj = MOOD_CATEGORIES.find((m) => m.id === selectedMoodId) || MOOD_CATEGORIES[0];

  // Adhkar for currently selected mood
  const currentAdhkar = SITUATION_ADHKAR.filter((a) => a.moodId === selectedMoodId);

  // Soft sine audio tone on tap
  const playClick = () => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(680, ctx.currentTime);
      osc.frequency.exponentialRampToValueAtTime(340, ctx.currentTime + 0.04);

      gain.gain.setValueAtTime(0.08, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, ctx.currentTime + 0.045);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.05);
    } catch {
      // AudioContext unavailable
    }
  };

  const handleIncrement = (dhikr: SituationDhikr) => {
    playClick();
    if (navigator.vibrate) {
      navigator.vibrate(15);
    }

    setCounts((prev) => {
      const current = prev[dhikr.id] || 0;
      return {
        ...prev,
        [dhikr.id]: current + 1,
      };
    });
  };

  const handleReset = (id: string) => {
    setCounts((prev) => ({
      ...prev,
      [id]: 0,
    }));
  };

  const handleCopy = (dhikr: SituationDhikr) => {
    const textToCopy = `${dhikr.title}\n\n${dhikr.arabicText}\n\n${dhikr.transliteration}\n\n"${dhikr.translation}"\n\n— Source: ${dhikr.source}`;
    navigator.clipboard.writeText(textToCopy);
    setCopiedId(dhikr.id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-8">
      {/* Top Header & Situation Selector */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-4 border-b-2 border-current/15">
        <div>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-heading text-4xl sm:text-5xl uppercase tracking-wide text-amber-500">
              ADHKARI · أذكاري
            </span>
            <span className={`text-xs px-2.5 py-1 rounded-full font-bold border ${
              theme === 'dark' ? 'bg-stone-800 border-stone-700 text-amber-300' : 'bg-[#FEF08A] border-[#2C1810] text-[#2C1810]'
            }`}>
              {SITUATION_ADHKAR.length} Situations
            </span>
          </div>
          <p className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
          }`}>
            Prophetic supplications and sacred invocations tailored for each circumstance of the soul.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute counter tone' : 'Enable counter tone'}
            className={`p-2 rounded-full border-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:text-white'
                : 'bg-white border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            {soundEnabled ? <Volume2 className="w-4 h-4" /> : <VolumeX className="w-4 h-4" />}
          </button>
        </div>
      </div>

      {/* Situation Filter Pills */}
      <div>
        <div className="text-xs font-extrabold uppercase tracking-wider opacity-60 mb-2.5">
          Select Your Current Situation:
        </div>
        <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
          {MOOD_CATEGORIES.map((cat) => {
            const isActive = selectedMoodId === cat.id;
            return (
              <button
                key={cat.id}
                type="button"
                onClick={() => onSelectMood(cat.id)}
                className={`px-3.5 py-1.5 rounded-full text-xs font-bold whitespace-nowrap transition-transform active:scale-95 cursor-pointer border-2 ${
                  isActive
                    ? theme === 'dark'
                      ? 'bg-amber-400 text-stone-950 border-amber-300'
                      : 'bg-[#FEF08A] text-[#2C1810] border-[#2C1810] shadow-[2px_2px_0px_#2C1810]'
                    : theme === 'dark'
                      ? 'bg-stone-800 text-stone-300 border-stone-700 hover:border-stone-500'
                      : 'bg-white text-[#2C1810] border-[#2C1810]/30 hover:border-[#2C1810]'
                }`}
              >
                <span>{cat.name.split('&')[0]}</span>
                <span className="font-arabic text-[11px] ml-1.5 opacity-80">{cat.arabicTitle.split(' ')[0]}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Active Situation Banner */}
      <div className={`p-4 sm:p-5 rounded-2xl border-2 flex items-center justify-between gap-4 transition-colors ${
        theme === 'dark'
          ? 'bg-stone-900/80 border-stone-800 text-stone-200'
          : 'bg-[#FEFCE8] border-[#2C1810]/20 text-[#2C1810]'
      }`}>
        <div>
          <div className="flex items-center gap-2 text-xs font-bold text-amber-500 uppercase">
            <span>Invocations for</span>
            <ChevronRight className="w-3.5 h-3.5" />
            <span className="font-extrabold">{activeMoodObj.name}</span>
          </div>
          <p className="text-xs mt-1 opacity-80 font-medium">
            {activeMoodObj.description}
          </p>
        </div>
        <div className="font-arabic text-xl sm:text-2xl font-bold opacity-80 whitespace-nowrap">
          {activeMoodObj.arabicTitle}
        </div>
      </div>

      {/* Adhkar Cards List */}
      <div className="space-y-6">
        {currentAdhkar.map((dhikr) => {
          const currentCount = counts[dhikr.id] || 0;
          const target = dhikr.recommendedCount;
          const isCompleted = currentCount >= target;
          const progressPercent = Math.min(100, (currentCount / target) * 100);

          return (
            <div
              key={dhikr.id}
              className={`rounded-3xl border-2 p-6 sm:p-8 space-y-6 transition-all ${
                theme === 'dark'
                  ? 'bg-[#151922] border-stone-700 text-stone-100 shadow-md'
                  : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[6px_6px_0px_#2C1810]'
              }`}
            >
              {/* Card Header */}
              <div className={`flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-4 border-b-2 ${
                theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/15'
              }`}>
                <div>
                  <h3 className="font-bold text-base sm:text-lg">
                    {dhikr.title}
                  </h3>
                  <div className="flex items-center gap-2 text-xs opacity-70 mt-0.5">
                    <span>Source: {dhikr.source}</span>
                    <span>·</span>
                    <span>Target: {target}x</span>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <button
                    type="button"
                    onClick={() => handleCopy(dhikr)}
                    className={`p-2 rounded-full border-2 text-xs font-bold flex items-center gap-1.5 transition-colors cursor-pointer ${
                      theme === 'dark'
                        ? 'border-stone-700 hover:bg-stone-800 text-stone-300'
                        : 'border-[#2C1810] hover:bg-stone-100 text-[#2C1810]'
                    }`}
                    title="Copy invocation"
                  >
                    {copiedId === dhikr.id ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-500" />
                        <span className="text-[11px] text-emerald-500">Copied</span>
                      </>
                    ) : (
                      <>
                        <Copy className="w-3.5 h-3.5" />
                        <span className="text-[11px]">Copy</span>
                      </>
                    )}
                  </button>

                  {currentCount > 0 && (
                    <button
                      type="button"
                      onClick={() => handleReset(dhikr.id)}
                      className="p-2 text-stone-400 hover:text-stone-200 transition-colors cursor-pointer"
                      title="Reset counter"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>

              {/* Big Arabic Text */}
              <div className="py-2 text-right dir-rtl">
                <p className={`font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.2] tracking-wide select-text ${
                  theme === 'dark' ? 'text-amber-100' : 'text-[#2C1810]'
                }`}>
                  {dhikr.arabicText}
                </p>
              </div>

              {/* Transliteration & English Translation */}
              <div className="space-y-2.5">
                <p className="text-xs text-stone-400 italic font-serif leading-relaxed">
                  {dhikr.transliteration}
                </p>
                <p className={`text-sm sm:text-base leading-relaxed font-semibold ${
                  theme === 'dark' ? 'text-stone-200' : 'text-[#2C1810]'
                }`}>
                  &ldquo;{dhikr.translation}&rdquo;
                </p>
              </div>

              {/* Context & Prophetic Virtue */}
              <div className={`p-4 rounded-2xl border text-xs leading-relaxed ${
                theme === 'dark'
                  ? 'bg-stone-900 border-stone-800 text-stone-300'
                  : 'bg-[#FFFDF5] border-[#2C1810]/20 text-[#4A3228]'
              }`}>
                <span className="font-bold text-amber-500">Prophetic Virtue: </span>
                <span>{dhikr.contextOrVirtue}</span>
              </div>

              {/* Interactive Repetition Counter Bar */}
              <div className={`p-4 rounded-2xl border-2 flex flex-col sm:flex-row sm:items-center justify-between gap-4 ${
                theme === 'dark'
                  ? 'bg-stone-900/60 border-stone-800'
                  : 'bg-[#FEFCE8] border-[#2C1810]/20'
              }`}>
                {/* Progress status */}
                <div className="space-y-1.5 flex-1">
                  <div className="flex items-center justify-between text-xs font-bold">
                    <span className="flex items-center gap-1.5">
                      {isCompleted ? (
                        <span className="text-emerald-500 flex items-center gap-1 font-extrabold">
                          <Check className="w-3.5 h-3.5 stroke-[3]" />
                          Completed ({currentCount}/{target})
                        </span>
                      ) : (
                        <span>Repetitions: {currentCount} of {target}</span>
                      )}
                    </span>
                    <span className="font-mono text-stone-400">{Math.round(progressPercent)}%</span>
                  </div>

                  <div className="h-2 rounded-full bg-stone-300/40 overflow-hidden">
                    <div
                      className={`h-full transition-all duration-200 ${
                        isCompleted
                          ? 'bg-emerald-500'
                          : theme === 'dark' ? 'bg-amber-400' : 'bg-[#2C1810]'
                      }`}
                      style={{ width: `${progressPercent}%` }}
                    />
                  </div>
                </div>

                {/* Tactile Count Button */}
                <button
                  type="button"
                  onClick={() => handleIncrement(dhikr)}
                  className={`px-6 py-3 rounded-full font-bold text-xs border-2 flex items-center justify-center gap-2 transition-transform active:scale-95 cursor-pointer whitespace-nowrap ${
                    isCompleted
                      ? theme === 'dark'
                        ? 'bg-emerald-500 border-emerald-400 text-stone-950 hover:bg-emerald-400'
                        : 'bg-emerald-600 border-[#2C1810] text-white hover:bg-emerald-500'
                      : theme === 'dark'
                        ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                        : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                  }`}
                >
                  <Sparkles className="w-3.5 h-3.5" />
                  <span>{isCompleted ? 'READ AGAIN (+1)' : 'TAP TO RECITE (+1)'}</span>
                </button>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
