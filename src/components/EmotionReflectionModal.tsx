import React, { useState } from 'react';
import { QuranVerse } from '../data/quranData';
import { X, Send, Sparkles, Check, Bookmark, RefreshCw } from 'lucide-react';

export interface SavedJournalEntry {
  id: string;
  timestamp: number;
  dateStr: string;
  moodName: string;
  userNotes: string;
  verseId: string;
  verseSurah: string;
  verseAyah: number;
  verseText: string;
  reflection: string;
  actionableWisdom: string;
  comfortDua: string;
}

interface EmotionReflectionModalProps {
  verse: QuranVerse | null;
  onClose: () => void;
  onSaveEntry: (entry: SavedJournalEntry) => void;
  theme?: 'dark' | 'light';
}

export const EmotionReflectionModal: React.FC<EmotionReflectionModalProps> = ({
  verse,
  onClose,
  onSaveEntry,
  theme = 'dark',
}) => {
  const [userEmotionText, setUserEmotionText] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [generatedResult, setGeneratedResult] = useState<{
    reflection: string;
    actionableWisdom: string;
    comfortDua: string;
  } | null>(null);
  const [isSaved, setIsSaved] = useState(false);

  if (!verse) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);

    try {
      const response = await fetch('/api/reflect', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          emotion: verse.moodName,
          userNotes: userEmotionText,
          currentVerse: {
            surahName: verse.surahName,
            surahNumber: verse.surahNumber,
            ayahNumber: verse.ayahNumber,
            translation: verse.translation,
          },
        }),
      });

      const data = await response.json();
      setGeneratedResult({
        reflection: data.reflection || data.fallback?.reflection,
        actionableWisdom: data.actionableWisdom || data.fallback?.actionableWisdom,
        comfortDua: data.comfortDua || data.fallback?.comfortDua,
      });
    } catch (err) {
      console.error('Failed to generate reflection:', err);
      setGeneratedResult({
        reflection: "Even in moments when you cannot put your sorrow into words, your heart is fully known by the Divine. Turn this weight into stillness.",
        actionableWisdom: "Close your eyes, take 4 slow breaths, and whisper: 'Rabbi shrah li sadri' (My Lord, expand my chest with peace).",
        comfortDua: "Allahumma inni as'aluka sakīnatan fee qalbi (O Allah, I ask You for serene peace in my heart)."
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSaveToJournal = () => {
    if (!generatedResult) return;

    const newEntry: SavedJournalEntry = {
      id: 'entry-' + Date.now(),
      timestamp: Date.now(),
      dateStr: new Date().toLocaleDateString('en-US', {
        month: 'short',
        day: 'numeric',
        year: 'numeric',
      }),
      moodName: verse.moodName,
      userNotes: userEmotionText || 'Contemplation on verse ' + verse.surahNumber + ':' + verse.ayahNumber,
      verseId: verse.id,
      verseSurah: verse.surahName,
      verseAyah: verse.ayahNumber,
      verseText: verse.translation,
      reflection: generatedResult.reflection,
      actionableWisdom: generatedResult.actionableWisdom,
      comfortDua: generatedResult.comfortDua,
    };

    onSaveEntry(newEntry);
    setIsSaved(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-xs">
      <div
        className={`border-3 rounded-3xl w-full max-w-2xl max-h-[90vh] overflow-y-auto p-6 sm:p-8 flex flex-col justify-between shadow-2xl relative transition-colors ${
          theme === 'dark'
            ? 'bg-[#151922] border-stone-700 text-stone-100'
            : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[10px_10px_0px_#2C1810]'
        }`}
        role="dialog"
        aria-modal="true"
      >
        {/* Header */}
        <div className={`flex items-center justify-between pb-4 border-b-2 ${
          theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/20'
        }`}>
          <div>
            <h3 className="font-heading text-3xl uppercase tracking-wide">
              EMOTIONAL REFLECTION
            </h3>
            <p className="text-xs font-bold text-amber-500">
              Surah {verse.surahName} {verse.surahNumber}:{verse.ayahNumber} · {verse.moodName}
            </p>
          </div>
          <button
            onClick={onClose}
            className={`p-2 rounded-full border-2 transition-colors cursor-pointer ${
              theme === 'dark' ? 'border-stone-700 hover:bg-stone-800' : 'border-[#2C1810] hover:bg-stone-100'
            }`}
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Body */}
        <div className="py-5 space-y-6">
          {/* Verse quote reference */}
          <div className={`p-4 rounded-2xl border-2 ${
            theme === 'dark' ? 'bg-stone-900 border-stone-800' : 'bg-[#FEFCE8] border-[#2C1810]/20'
          }`}>
            <p className="font-arabic text-xl text-right dir-rtl leading-relaxed mb-2 font-bold">
              {verse.arabicText}
            </p>
            <p className="text-xs font-semibold italic opacity-80">
              &ldquo;{verse.translation}&rdquo;
            </p>
          </div>

          {!generatedResult ? (
            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label
                  htmlFor="user-emotion-input"
                  className="block text-xs font-bold mb-2 uppercase tracking-wide"
                >
                  What is weighing on your heart right now? (Optional)
                </label>
                <textarea
                  id="user-emotion-input"
                  rows={4}
                  value={userEmotionText}
                  onChange={(e) => setUserEmotionText(e.target.value)}
                  placeholder="Share your sincere feelings, struggles, thoughts, or quiet hopes..."
                  className={`w-full rounded-2xl p-4 text-sm font-medium focus:outline-none transition-colors resize-none border-2 ${
                    theme === 'dark'
                      ? 'bg-stone-900 border-stone-700 text-stone-200 placeholder-stone-500 focus:border-amber-400'
                      : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] placeholder-stone-400 focus:border-[#2C1810]'
                  }`}
                />
              </div>

              <div className="flex items-center justify-end gap-3 pt-2">
                <button
                  type="button"
                  onClick={onClose}
                  className={`px-5 py-2.5 rounded-full font-bold text-xs border-2 transition-colors cursor-pointer ${
                    theme === 'dark' ? 'border-stone-700 hover:bg-stone-800' : 'border-[#2C1810] hover:bg-stone-100'
                  }`}
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={isLoading}
                  className={`inline-flex items-center gap-2 px-6 py-2.5 rounded-full font-bold text-xs border-2 transition-transform active:scale-95 cursor-pointer ${
                    theme === 'dark'
                      ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                      : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                  }`}
                >
                  {isLoading ? (
                    <>
                      <RefreshCw className="w-3.5 h-3.5 animate-spin" />
                      <span>Contemplating...</span>
                    </>
                  ) : (
                    <>
                      <Send className="w-3.5 h-3.5" />
                      <span>Receive Spiritual Reflection</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          ) : (
            <div className="space-y-5 animate-fade-in">
              {/* Generated Reflection */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider opacity-60">
                  Contemplative Reflection
                </div>
                <p className={`text-sm leading-relaxed p-4 rounded-2xl border-2 font-medium ${
                  theme === 'dark'
                    ? 'bg-stone-900 border-stone-800 text-stone-200'
                    : 'bg-[#FFFDF5] border-[#2C1810]/20 text-[#2C1810]'
                }`}>
                  {generatedResult.reflection}
                </p>
              </div>

              {/* Actionable Wisdom */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider opacity-60">
                  Quiet Practice
                </div>
                <p className={`text-sm leading-relaxed p-4 rounded-2xl border-2 font-medium ${
                  theme === 'dark'
                    ? 'bg-stone-900 border-stone-800 text-stone-200'
                    : 'bg-[#FEFCE8] border-[#2C1810]/20 text-[#2C1810]'
                }`}>
                  {generatedResult.actionableWisdom}
                </p>
              </div>

              {/* Comfort Dua */}
              <div className="space-y-2">
                <div className="text-xs font-extrabold uppercase tracking-wider opacity-60">
                  Supplication for the Soul
                </div>
                <p className={`text-sm italic font-serif leading-relaxed p-4 rounded-2xl border-2 font-semibold ${
                  theme === 'dark'
                    ? 'bg-stone-900 border-stone-800 text-amber-300'
                    : 'bg-[#FEF08A]/40 border-[#2C1810]/20 text-[#2C1810]'
                }`}>
                  &ldquo;{generatedResult.comfortDua}&rdquo;
                </p>
              </div>

              {/* Modal footer actions */}
              <div className={`flex items-center justify-between pt-4 border-t-2 ${
                theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/20'
              }`}>
                <button
                  onClick={() => setGeneratedResult(null)}
                  className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-colors cursor-pointer ${
                    theme === 'dark' ? 'border-stone-700 hover:bg-stone-800' : 'border-[#2C1810] hover:bg-stone-100'
                  }`}
                >
                  Write Another
                </button>

                <div className="flex items-center gap-3">
                  <button
                    onClick={handleSaveToJournal}
                    disabled={isSaved}
                    className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs border-2 transition-transform active:scale-95 cursor-pointer ${
                      theme === 'dark'
                        ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                        : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
                    } ${isSaved ? 'opacity-70' : ''}`}
                  >
                    {isSaved ? (
                      <>
                        <Check className="w-3.5 h-3.5 text-emerald-400" />
                        <span>Saved to Journal</span>
                      </>
                    ) : (
                      <>
                        <Bookmark className="w-3.5 h-3.5" />
                        <span>Save to Journal</span>
                      </>
                    )}
                  </button>
                  <button
                    onClick={onClose}
                    className={`px-4 py-2 rounded-full border-2 text-xs font-bold transition-colors cursor-pointer ${
                      theme === 'dark' ? 'border-stone-700 hover:bg-stone-800' : 'border-[#2C1810] hover:bg-stone-100'
                    }`}
                  >
                    Close
                  </button>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};
