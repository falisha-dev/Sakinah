import React from 'react';
import { SavedJournalEntry } from './EmotionReflectionModal';
import { Trash2, Copy, Check, Feather, BookOpen } from 'lucide-react';

interface JournalViewProps {
  entries: SavedJournalEntry[];
  onDeleteEntry: (id: string) => void;
  onClearAll: () => void;
  onNavigateToContemplate: () => void;
  theme?: 'dark' | 'light';
}

export const JournalView: React.FC<JournalViewProps> = ({
  entries,
  onDeleteEntry,
  onClearAll,
  onNavigateToContemplate,
  theme = 'dark',
}) => {
  const [copiedId, setCopiedId] = React.useState<string | null>(null);

  const handleCopyDua = (id: string, dua: string) => {
    navigator.clipboard.writeText(dua);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  if (entries.length === 0) {
    return (
      <div className={`rounded-3xl border-2 p-8 sm:p-14 text-center max-w-xl mx-auto my-12 transition-colors ${
        theme === 'dark'
          ? 'bg-[#151922] border-stone-700 text-stone-100 shadow-xl'
          : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[8px_8px_0px_#2C1810]'
      }`}>
        <Feather className="w-10 h-10 text-amber-500 mx-auto mb-4" />
        <h3 className="font-heading text-3xl sm:text-4xl uppercase tracking-wide mb-2">
          SANCTUARY IS EMPTY
        </h3>
        <p className={`text-xs sm:text-sm leading-relaxed mb-6 font-medium ${
          theme === 'dark' ? 'text-stone-400' : 'text-[#4A3228]'
        }`}>
          When you contemplate a verse and articulate what is on your heart, your personalized reflections and du&apos;as will be preserved here for recurring solace.
        </p>
        <button
          onClick={onNavigateToContemplate}
          className={`inline-flex items-center gap-2 px-6 py-3 rounded-full font-bold text-xs border-2 transition-transform active:scale-95 cursor-pointer ${
            theme === 'dark'
              ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
              : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
          }`}
        >
          <BookOpen className="w-4 h-4" />
          <span>Begin Today&apos;s Contemplation</span>
        </button>
      </div>
    );
  }

  const [confirmClear, setConfirmClear] = React.useState(false);

  const handleClearClick = () => {
    if (!confirmClear) {
      setConfirmClear(true);
      setTimeout(() => setConfirmClear(false), 3500);
      return;
    }
    onClearAll();
    setConfirmClear(false);
  };

  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className={`flex items-center justify-between pb-4 border-b-2 ${
        theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/20'
      }`}>
        <div>
          <h2 className="font-heading text-4xl sm:text-5xl uppercase tracking-wide text-amber-500">
            CONTEMPLATION JOURNAL
          </h2>
          <p className={`text-xs sm:text-sm font-medium ${
            theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
          }`}>
            {entries.length} preserved {entries.length === 1 ? 'reflection' : 'reflections'} of your spiritual journey
          </p>
        </div>

        <button
          type="button"
          onClick={handleClearClick}
          className={`text-xs font-bold transition-all py-1 px-3 border rounded-full cursor-pointer ${
            confirmClear
              ? 'bg-rose-600 text-white border-rose-600'
              : 'text-stone-400 hover:text-rose-500 border-current'
          }`}
        >
          {confirmClear ? 'Tap to Confirm' : 'Clear History'}
        </button>
      </div>

      <div className="space-y-5">
        {entries.map((entry) => (
          <article
            key={entry.id}
            className={`rounded-2xl border-2 p-6 sm:p-7 space-y-4 transition-colors ${
              theme === 'dark'
                ? 'bg-[#151922] border-stone-700 text-stone-100 shadow-md'
                : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[5px_5px_0px_#2C1810]'
            }`}
          >
            {/* Entry Header */}
            <div className={`flex items-center justify-between text-xs font-bold pb-3 border-b-2 ${
              theme === 'dark' ? 'border-stone-800 text-stone-400' : 'border-[#2C1810]/15 text-[#4A3228]'
            }`}>
              <div className="flex items-center gap-2">
                <span className="text-amber-500 uppercase">{entry.moodName}</span>
                <span aria-hidden="true">·</span>
                <span>{entry.dateStr}</span>
                <span aria-hidden="true">·</span>
                <span>Surah {entry.verseSurah} {entry.verseAyah}</span>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopyDua(entry.id, entry.comfortDua)}
                  title="Copy du'a"
                  className={`p-1.5 rounded-full border transition-colors cursor-pointer ${
                    theme === 'dark' ? 'border-stone-700 text-stone-300 hover:text-white' : 'border-[#2C1810] text-[#2C1810] hover:bg-stone-100'
                  }`}
                >
                  {copiedId === entry.id ? (
                    <Check className="w-3.5 h-3.5 text-emerald-500" />
                  ) : (
                    <Copy className="w-3.5 h-3.5" />
                  )}
                </button>
                <button
                  onClick={() => onDeleteEntry(entry.id)}
                  title="Delete entry"
                  className="p-1.5 text-stone-400 hover:text-rose-500 transition-colors cursor-pointer"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              </div>
            </div>

            {/* Verse anchor quote */}
            <div className={`text-xs font-serif italic p-3.5 rounded-xl border ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-800 text-stone-300'
                : 'bg-[#FFFDF5] border-[#2C1810]/20 text-[#2C1810]'
            }`}>
              &ldquo;{entry.verseText}&rdquo;
            </div>

            {/* User personal feeling note */}
            {entry.userNotes && (
              <div>
                <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-60 block mb-1">
                  Heart&apos;s Voice
                </span>
                <p className="text-sm font-semibold italic leading-relaxed">
                  &ldquo;{entry.userNotes}&rdquo;
                </p>
              </div>
            )}

            {/* Reflection */}
            <div>
              <span className="text-[11px] uppercase tracking-wider font-extrabold opacity-60 block mb-1">
                Contemplative Insight
              </span>
              <p className="text-sm leading-relaxed">
                {entry.reflection}
              </p>
            </div>

            {/* Actionable Practice */}
            {entry.actionableWisdom && (
              <div className={`p-3 rounded-xl border text-xs ${
                theme === 'dark'
                  ? 'bg-stone-900/60 border-stone-800 text-stone-200'
                  : 'bg-[#FEFCE8] border-[#2C1810]/20 text-[#2C1810]'
              }`}>
                <span className="font-bold">Quiet Practice: </span>
                {entry.actionableWisdom}
              </div>
            )}

            {/* Dua */}
            {entry.comfortDua && (
              <div className="text-xs font-serif italic text-amber-500 pt-1 font-semibold">
                Du&apos;a: &ldquo;{entry.comfortDua}&rdquo;
              </div>
            )}
          </article>
        ))}
      </div>
    </div>
  );
};
