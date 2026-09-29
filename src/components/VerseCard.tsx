import React, { useState, useRef, useEffect } from 'react';
import { QuranVerse } from '../data/quranData';
import { Play, Pause, Bookmark, BookmarkCheck, Feather, Info, ChevronDown, ChevronUp } from 'lucide-react';

interface VerseCardProps {
  verse: QuranVerse;
  onOpenReflection: (verse: QuranVerse) => void;
  isBookmarked: boolean;
  onToggleBookmark: (verse: QuranVerse) => void;
  theme?: 'dark' | 'light';
}

export const VerseCard: React.FC<VerseCardProps> = ({
  verse,
  onOpenReflection,
  isBookmarked,
  onToggleBookmark,
  theme = 'dark',
}) => {
  const [isPlayingAudio, setIsPlayingAudio] = useState(false);
  const [audioProgress, setAudioProgress] = useState(0);
  const [audioDuration, setAudioDuration] = useState(0);
  const [showTafsir, setShowTafsir] = useState(false);
  const audioRef = useRef<HTMLAudioElement | null>(null);

  // Audio lifecycle
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    // Reset playback state when switching verses
    setIsPlayingAudio(false);
    setAudioProgress(0);

    const handleTimeUpdate = () => {
      if (audio.duration) {
        setAudioProgress((audio.currentTime / audio.duration) * 100);
      }
    };

    const handleLoadedMetadata = () => {
      setAudioDuration(audio.duration || 0);
    };

    const handleEnded = () => {
      setIsPlayingAudio(false);
      setAudioProgress(0);
    };

    const handleError = () => {
      setIsPlayingAudio(false);
    };

    audio.addEventListener('timeupdate', handleTimeUpdate);
    audio.addEventListener('loadedmetadata', handleLoadedMetadata);
    audio.addEventListener('ended', handleEnded);
    audio.addEventListener('error', handleError);

    return () => {
      audio.removeEventListener('timeupdate', handleTimeUpdate);
      audio.removeEventListener('loadedmetadata', handleLoadedMetadata);
      audio.removeEventListener('ended', handleEnded);
      audio.removeEventListener('error', handleError);
      audio.pause();
    };
  }, [verse.audioUrl, verse.id]);

  const toggleAudio = () => {
    const audio = audioRef.current;
    if (!audio) return;

    if (isPlayingAudio) {
      audio.pause();
      setIsPlayingAudio(false);
    } else {
      audio.play().then(() => {
        setIsPlayingAudio(true);
      }).catch((e) => {
        console.error('Audio playback error', e);
      });
    }
  };

  const formatSeconds = (sec: number) => {
    if (isNaN(sec)) return '0:00';
    const m = Math.floor(sec / 60);
    const s = Math.floor(sec % 60);
    return `${m}:${s < 10 ? '0' : ''}${s}`;
  };

  return (
    <div className={`rounded-2xl sm:rounded-3xl border-2 transition-colors p-6 sm:p-8 flex flex-col justify-between ${
      theme === 'dark'
        ? 'bg-[#151922] border-stone-700 text-stone-100 shadow-xl'
        : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[6px_6px_0px_#2C1810]'
    }`}>
      <audio ref={audioRef} src={verse.audioUrl} preload="none" />

      {/* Top Header Strip */}
      <div className={`flex items-center justify-between pb-5 border-b-2 ${
        theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/15'
      }`}>
        <div className="flex items-center gap-2 text-xs font-bold">
          <span className="text-amber-500 font-extrabold uppercase tracking-wide">
            {verse.moodName}
          </span>
          <span aria-hidden="true" className="text-stone-400">·</span>
          <span className={theme === 'dark' ? 'text-stone-300' : 'text-[#2C1810]'}>
            Surah {verse.surahName} ({verse.surahNumber}:{verse.ayahNumber})
          </span>
          <span aria-hidden="true" className="text-stone-400">·</span>
          <span className="font-arabic text-sm text-stone-400">{verse.surahNameArabic}</span>
        </div>

        <button
          onClick={() => onToggleBookmark(verse)}
          title={isBookmarked ? 'Remove bookmark' : 'Bookmark verse'}
          className={`p-2 rounded-full border-2 transition-transform active:scale-95 cursor-pointer ${
            theme === 'dark'
              ? 'bg-stone-800 border-stone-700 text-amber-300 hover:bg-stone-700'
              : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
          }`}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 fill-amber-400 text-amber-500" />
          ) : (
            <Bookmark className="w-4 h-4" />
          )}
        </button>
      </div>

      {/* Arabic Ayah Calligraphy */}
      <div className="py-8 text-right dir-rtl">
        <p className={`font-arabic text-2xl sm:text-3xl md:text-4xl leading-[2.3] tracking-wide select-text ${
          theme === 'dark' ? 'text-amber-100' : 'text-[#2C1810]'
        }`}>
          {verse.arabicText}
        </p>
      </div>

      {/* Transliteration & English Translation */}
      <div className="space-y-3 pb-6">
        <p className="text-xs text-stone-400 italic font-serif leading-relaxed">
          {verse.transliteration}
        </p>
        <p className={`text-base sm:text-lg leading-relaxed font-semibold ${
          theme === 'dark' ? 'text-stone-200' : 'text-[#2C1810]'
        }`}>
          &ldquo;{verse.translation}&rdquo;
        </p>
      </div>

      {/* Recitation Audio Player Pill */}
      <div className={`p-3.5 rounded-xl border-2 flex items-center gap-3 mb-5 transition-colors ${
        theme === 'dark'
          ? 'bg-stone-900 border-stone-800'
          : 'bg-[#FEFCE8] border-[#2C1810]/20'
      }`}>
        <button
          onClick={toggleAudio}
          className={`w-9 h-9 rounded-full border-2 flex items-center justify-center transition-transform active:scale-95 cursor-pointer ${
            theme === 'dark'
              ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
              : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
          }`}
          aria-label={isPlayingAudio ? 'Pause recitation' : 'Play recitation'}
        >
          {isPlayingAudio ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4 ml-0.5" />}
        </button>

        <div className="flex-1">
          <div className="flex items-center justify-between text-[11px] font-bold mb-1">
            <span className={theme === 'dark' ? 'text-stone-300' : 'text-[#2C1810]'}>
              EveryAyah Recitation (Mishary Alafasy)
            </span>
            <span className="font-mono text-stone-400">
              {formatSeconds(audioRef.current?.currentTime || 0)} / {formatSeconds(audioDuration)}
            </span>
          </div>
          <div className="h-2 rounded-full bg-stone-300/40 overflow-hidden">
            <div
              className={`h-full transition-all duration-150 ${
                theme === 'dark' ? 'bg-amber-400' : 'bg-[#2C1810]'
              }`}
              style={{ width: `${audioProgress}%` }}
            />
          </div>
        </div>
      </div>

      {/* Contemplation prompt & Tafsir Accordion */}
      <div className={`pt-4 border-t-2 space-y-3 ${
        theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/15'
      }`}>
        <div className="text-xs">
          <span className={`font-bold ${theme === 'dark' ? 'text-amber-300' : 'text-[#2C1810]'}`}>
            Contemplation: </span>
          <span className={`leading-relaxed ${theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'}`}>
            {verse.contemplationPrompt}
          </span>
        </div>

        <div>
          <button
            onClick={() => setShowTafsir(!showTafsir)}
            className={`flex items-center gap-1.5 text-xs font-bold transition-colors py-1 cursor-pointer ${
              theme === 'dark' ? 'text-stone-400 hover:text-stone-200' : 'text-stone-600 hover:text-[#2C1810]'
            }`}
          >
            <Info className="w-3.5 h-3.5" />
            <span>Spiritual Context & Tafsir</span>
            {showTafsir ? <ChevronUp className="w-3 h-3" /> : <ChevronDown className="w-3 h-3" />}
          </button>

          {showTafsir && (
            <p className={`mt-2 text-xs p-3.5 rounded-xl border leading-relaxed ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-800 text-stone-300'
                : 'bg-[#FFFDF5] border-[#2C1810]/20 text-[#4A3228]'
            }`}>
              {verse.tafsirContext}
            </p>
          )}
        </div>
      </div>

      {/* Action Footer */}
      <div className={`pt-5 mt-4 border-t-2 flex items-center justify-between flex-wrap gap-3 ${
        theme === 'dark' ? 'border-stone-800' : 'border-[#2C1810]/15'
      }`}>
        <span className="text-xs text-stone-400 font-medium">
          Anchored for {verse.spiritualTheme}
        </span>

        <button
          onClick={() => onOpenReflection(verse)}
          className={`inline-flex items-center gap-2 px-5 py-2.5 rounded-full font-bold text-xs border-2 transition-transform active:scale-95 cursor-pointer ${
            theme === 'dark'
              ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
              : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
          }`}
        >
          <Feather className="w-3.5 h-3.5" />
          <span>Reflect on My Emotion</span>
        </button>
      </div>
    </div>
  );
};
