import React, { useState, useEffect, useRef } from 'react';
import { Play, Pause, RotateCcw, Volume2, VolumeX, Wind, Sparkles, BookOpen, Heart, CheckCircle2 } from 'lucide-react';

interface BreathworkViewProps {
  theme: 'dark' | 'light';
}

type BreathPhase = 'inhale' | 'hold' | 'exhale';

const CONTEMPLATION_VERSES = [
  {
    arabic: 'أَلَا بِذِكْرِ ٱللَّهِ تَطْمَئِنُّ ٱلْقُلُوبُ',
    transliteration: "Ala bithikri Allahi tatma'innu alquloob",
    translation: 'Unquestionably, by the remembrance of Allah hearts are assured.',
    reference: 'Surah Ar-Ra’d (13:28)',
  },
  {
    arabic: 'رَبِّ اشْرَحْ لِي صَدْرِي وَيَسِّرْ لِي أَمْرِي',
    transliteration: 'Rabbi-shrah lee sadree wayassir lee amree',
    translation: 'My Lord, expand for me my breast [with ease] and ease for me my task.',
    reference: 'Surah Taha (20:25-26)',
  },
  {
    arabic: 'وَهُوَ مَعَكُمْ أَيْنَ مَا كُنتُمْ',
    transliteration: 'Wahuwa ma’akum ayna ma kuntum',
    translation: 'And He is with you wherever you are.',
    reference: 'Surah Al-Hadid (57:4)',
  },
  {
    arabic: 'أَلَمْ نَشْرَحْ لَكَ صَدْرَكَ ۞ وَوَضَعْنَا عَنكَ وِزْرَكَ',
    transliteration: 'Alam nashrah laka sadrak, wawada’na ‘anka wizrak',
    translation: 'Did We not expand for you your breast, and remove from you your burden?',
    reference: 'Surah Ash-Sharh (94:1-2)',
  },
  {
    arabic: 'وَمَن يَتَوَكَّلْ عَلَى ٱللَّهِ فَهُوَ حَسْبُهُۥٓ',
    transliteration: 'Waman yatawakkal ‘ala Allahi fahuwa hasbuh',
    translation: 'And whoever relies upon Allah - then He is sufficient for him.',
    reference: 'Surah At-Talaq (65:3)',
  },
];

export const BreathworkView: React.FC<BreathworkViewProps> = ({ theme }) => {
  const [isActive, setIsActive] = useState(false);
  const [phase, setPhase] = useState<BreathPhase>('inhale');
  const [countdown, setCountdown] = useState(4);
  const [completedCycles, setCompletedCycles] = useState(0);
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [verseIndex, setVerseIndex] = useState(0);
  const [resetKey, setResetKey] = useState(0);

  const phaseRef = useRef<BreathPhase>('inhale');
  const timerRef = useRef<number | null>(null);

  const playTone = (type: 'inhale' | 'hold' | 'exhale') => {
    if (!soundEnabled) return;
    try {
      const AudioCtx = window.AudioContext || (window as any).webkitAudioContext;
      const ctx = new AudioCtx();
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      let freq = 432; // Healing A frequency
      if (type === 'inhale') freq = 528; // Transformation/Ease
      if (type === 'hold') freq = 432;
      if (type === 'exhale') freq = 360; // Deep grounding

      osc.frequency.setValueAtTime(freq, ctx.currentTime);
      gain.gain.setValueAtTime(0.04, ctx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + 0.6);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start();
      osc.stop(ctx.currentTime + 0.65);
    } catch {
      // AudioContext unavailable
    }
  };

  useEffect(() => {
    if (!isActive) {
      if (timerRef.current) clearInterval(timerRef.current);
      return;
    }

    timerRef.current = window.setInterval(() => {
      setCountdown((prev) => {
        if (prev > 1) {
          return prev - 1;
        }

        // Transition phases
        const currentPhase = phaseRef.current;
        if (currentPhase === 'inhale') {
          phaseRef.current = 'hold';
          setPhase('hold');
          playTone('hold');
          return 7;
        } else if (currentPhase === 'hold') {
          phaseRef.current = 'exhale';
          setPhase('exhale');
          playTone('exhale');
          return 8;
        } else {
          // Finished exhale -> back to inhale
          phaseRef.current = 'inhale';
          setPhase('inhale');
          setCompletedCycles((c) => c + 1);
          setVerseIndex((v) => (v + 1) % CONTEMPLATION_VERSES.length);
          playTone('inhale');
          return 4;
        }
      });
    }, 1000);

    return () => {
      if (timerRef.current) clearInterval(timerRef.current);
    };
  }, [isActive, soundEnabled]);

  const handleToggle = () => {
    if (!isActive) {
      playTone('inhale');
    }
    setIsActive((prev) => !prev);
  };

  const handleReset = () => {
    setIsActive(false);
    setPhase('inhale');
    phaseRef.current = 'inhale';
    setCountdown(4);
    setCompletedCycles(0);
    setResetKey((k) => k + 1);
  };

  const currentVerse = CONTEMPLATION_VERSES[verseIndex];

  // Visual text based on phase
  const phaseDetails = {
    inhale: {
      label: 'INHALE',
      arabic: 'تَنَفَّسْ بِسْمِ ٱللَّهِ',
      instruction: 'Inhale deeply through your nose, drawing serene divine peace into your chest.',
      color: '#38bdf8', // quiet sky
      scale: 'scale-125',
    },
    hold: {
      label: 'HOLD',
      arabic: 'سُكُونٌ وَحَمْد',
      instruction: 'Hold your breath gently in stillness, basking in silent gratitude.',
      color: '#fbbf24', // quiet amber
      scale: 'scale-125',
    },
    exhale: {
      label: 'EXHALE',
      arabic: 'تَوَكُّلٌ وَسَلَام',
      instruction: 'Slowly release through your mouth, surrendering all worry and control to Allah.',
      color: '#34d399', // quiet emerald
      scale: 'scale-90',
    },
  }[phase];

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      {/* Header section */}
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 pb-2">
        <div>
          <span className="font-heading text-4xl sm:text-5xl tracking-wide uppercase text-amber-500">
            4-7-8 BREATHWORK
          </span>
          <p className={`text-xs sm:text-sm font-medium mt-1 ${
            theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
          }`}>
            Somatic regulation paired with Quranic remembrance to quiet an anxious nervous system.
          </p>
        </div>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={() => setSoundEnabled(!soundEnabled)}
            title={soundEnabled ? 'Mute guidance chimes' : 'Enable guidance chimes'}
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
            onClick={handleReset}
            className={`px-3.5 py-1.5 rounded-full border-2 text-xs font-bold transition-transform active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-stone-300 hover:bg-stone-800'
                : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            <RotateCcw className="w-3.5 h-3.5 inline mr-1" />
            Reset
          </button>
        </div>
      </div>

      {/* Main Breathing Stage Card */}
      <div className={`rounded-3xl border-3 p-6 sm:p-10 transition-all flex flex-col items-center justify-center text-center relative overflow-hidden ${
        theme === 'dark'
          ? 'bg-[#151922] border-stone-700 shadow-2xl'
          : 'bg-[#FFFDF5] border-[#2C1810] shadow-[8px_8px_0px_#2C1810]'
      }`}>
        {/* Cycles counter pill top */}
        <div className="flex items-center gap-2 text-xs font-bold font-mono uppercase tracking-wider mb-6 opacity-75">
          <Sparkles className="w-3.5 h-3.5 text-amber-500" />
          <span>{completedCycles} Cycles Completed</span>
          <span>·</span>
          <span>{Math.round((completedCycles * 19) / 60)} min of mindfulness</span>
        </div>

        {/* The Animated Breathing Sphere Container */}
        <div key={resetKey} className="relative w-64 h-64 sm:w-72 sm:h-72 my-4 flex items-center justify-center select-none">
          {/* Subtle Outer Ripple Ring (Animated via CSS) */}
          <div
            className={`absolute inset-0 rounded-full border-2 border-dashed transition-transform duration-1000 ${
              isActive ? 'animate-breathe-ring' : 'opacity-20 scale-95'
            }`}
            style={{
              borderColor: phaseDetails.color,
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />

          {/* Secondary Glow Disc */}
          <div
            className={`absolute w-52 h-52 sm:w-60 sm:h-60 rounded-full transition-all duration-1000 blur-xl opacity-30 ${
              isActive ? 'animate-breathe-ring' : 'opacity-10 scale-90'
            }`}
            style={{
              backgroundColor: phaseDetails.color,
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          />

          {/* Central Visual Guide Sphere */}
          <div
            className={`w-44 h-44 sm:w-52 sm:h-52 rounded-full border-3 flex flex-col items-center justify-center transition-all duration-700 shadow-lg ${
              isActive ? 'animate-breathe-sphere' : 'scale-95'
            } ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-600 text-stone-100'
                : 'bg-white border-[#2C1810] text-[#2C1810]'
            }`}
            style={{
              animationPlayState: isActive ? 'running' : 'paused',
            }}
          >
            {/* Phase name */}
            <span
              className="text-xs font-black tracking-widest uppercase transition-colors"
              style={{ color: phaseDetails.color }}
            >
              {isActive ? phaseDetails.label : 'READY'}
            </span>

            {/* Large Countdown Digit */}
            <span className="font-heading text-6xl sm:text-7xl font-black leading-none my-1 tracking-tight">
              {isActive ? countdown : '4-7-8'}
            </span>

            {/* Arabic micro-whisper */}
            <span className="font-arabic text-sm font-bold text-amber-500 leading-none">
              {isActive ? phaseDetails.arabic : 'سكينة'}
            </span>
          </div>
        </div>

        {/* Phase Action Prompt */}
        <div className="max-w-md mx-auto my-4 space-y-1">
          <p className="font-bold text-sm sm:text-base">
            {isActive ? phaseDetails.instruction : 'Press Begin to start the 4-7-8 breathing practice.'}
          </p>
          <div className="flex items-center justify-center gap-4 text-[11px] font-bold opacity-60 uppercase tracking-wider pt-1">
            <span className={phase === 'inhale' && isActive ? 'text-sky-400 font-black' : ''}>4s Inhale</span>
            <span>→</span>
            <span className={phase === 'hold' && isActive ? 'text-amber-400 font-black' : ''}>7s Hold</span>
            <span>→</span>
            <span className={phase === 'exhale' && isActive ? 'text-emerald-400 font-black' : ''}>8s Exhale</span>
          </div>
        </div>

        {/* Primary Punchy Control Button (Strict zero-gradient discipline) */}
        <div className="mt-4">
          <button
            type="button"
            onClick={handleToggle}
            className={`px-8 py-3.5 rounded-full font-bold text-sm border-2 flex items-center gap-2 transition-transform active:scale-95 cursor-pointer shadow-md ${
              isActive
                ? 'bg-amber-400 border-amber-300 text-stone-950 hover:bg-amber-300'
                : theme === 'dark'
                  ? 'bg-sky-400 border-sky-300 text-stone-950 hover:bg-sky-300'
                  : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
            }`}
          >
            {isActive ? (
              <>
                <Pause className="w-4 h-4 stroke-[3]" />
                <span>PAUSE SESSION</span>
              </>
            ) : (
              <>
                <Play className="w-4 h-4 stroke-[3] fill-current" />
                <span>BEGIN 4-7-8 PRACTICE</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Paired Quranic Contemplation Card */}
      <div className={`p-6 sm:p-8 rounded-3xl border-2 space-y-3 transition-colors ${
        theme === 'dark'
          ? 'bg-stone-900 border-stone-800 text-stone-200'
          : 'bg-[#FEFCE8] border-[#2C1810]/20 text-[#2C1810]'
      }`}>
        <div className="flex items-center justify-between pb-2 border-b border-current/15">
          <div className="flex items-center gap-2">
            <BookOpen className="w-4 h-4 text-amber-500" />
            <span className="font-heading text-lg tracking-wide uppercase">
              PAIRED CONTEMPLATION
            </span>
          </div>
          <span className="text-[11px] font-mono opacity-70">
            {currentVerse.reference}
          </span>
        </div>

        {/* Arabic scripture */}
        <p className="font-arabic text-xl sm:text-2xl text-right leading-[2.2] py-1 text-amber-500 font-bold select-text">
          {currentVerse.arabic}
        </p>

        {/* Translation */}
        <p className="font-semibold text-sm sm:text-base leading-relaxed">
          &ldquo;{currentVerse.translation}&rdquo;
        </p>

        <p className="text-xs font-serif italic opacity-75">
          {currentVerse.transliteration}
        </p>
      </div>

      {/* How It Works Explainer Box */}
      <div className={`p-5 rounded-2xl border-2 text-xs leading-relaxed space-y-2 ${
        theme === 'dark'
          ? 'bg-stone-900/60 border-stone-800 text-stone-300'
          : 'bg-white border-[#2C1810]/20 text-[#4A3228]'
      }`}>
        <h4 className="font-bold uppercase tracking-wider flex items-center gap-1.5 text-amber-500">
          <Heart className="w-3.5 h-3.5" />
          The Science &amp; Spirit of 4-7-8 Breathwork
        </h4>
        <p>
          By extending the exhalation to 8 seconds, this breathing pattern stimulates the vagus nerve and activates the parasympathetic nervous system (the &ldquo;rest and digest&rdquo; response). Paired with deliberate remembrance of Allah, it shifts the heart from cortisol-driven anxiety into sacred composure (<em>Sakinah</em>).
        </p>
      </div>
    </div>
  );
};
