import React from 'react';
import { MOOD_CATEGORIES, MoodCategory } from '../data/quranData';
import { Sparkles, Check } from 'lucide-react';

interface MoodSelectorProps {
  selectedMoodId: string;
  onSelectMood: (moodId: string) => void;
  theme?: 'dark' | 'light';
}

export const MoodSelector: React.FC<MoodSelectorProps> = ({
  selectedMoodId,
  onSelectMood,
  theme = 'dark',
}) => {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="font-heading text-4xl sm:text-5xl uppercase tracking-wide text-amber-500">
          CLIMATES OF THE HEART
        </h2>
        <p className={`text-xs sm:text-sm font-medium mt-1 ${
          theme === 'dark' ? 'text-stone-300' : 'text-[#4A3228]'
        }`}>
          Select what your soul is experiencing to receive resonant Quranic comfort.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3.5">
        {MOOD_CATEGORIES.map((category) => {
          const isSelected = selectedMoodId === category.id;
          return (
            <button
              key={category.id}
              type="button"
              onClick={() => onSelectMood(category.id)}
              className={`mood-card-interactive p-5 text-left rounded-2xl border-2 cursor-pointer flex flex-col justify-between ${
                isSelected
                  ? theme === 'dark'
                    ? 'mood-card-selected bg-stone-800 border-amber-400 text-amber-100 shadow-[0_0_16px_rgba(251,191,36,0.18)]'
                    : 'mood-card-selected bg-[#FEF08A] border-[#2C1810] text-[#2C1810] shadow-[6px_6px_0px_#2C1810]'
                  : theme === 'dark'
                    ? 'bg-[#151922] border-stone-800 text-stone-300 hover:border-stone-600 hover:bg-[#191f2c]'
                    : 'bg-white border-[#2C1810]/30 text-[#2C1810] hover:border-[#2C1810] hover:shadow-[3px_3px_0px_#2C1810]'
              }`}
            >
              <div>
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div className="flex items-center gap-2">
                    <span
                      className="w-2.5 h-2.5 rounded-full inline-block shrink-0 transition-transform"
                      style={{
                        backgroundColor: category.dominantColor,
                        transform: isSelected ? 'scale(1.3)' : 'scale(1)',
                      }}
                    />
                    <span className="font-bold text-sm sm:text-base">
                      {category.name}
                    </span>
                  </div>

                  <span className="font-arabic text-sm font-bold text-amber-500 whitespace-nowrap">
                    {category.arabicTitle}
                  </span>
                </div>

                <div className="text-xs font-serif italic mb-2 opacity-80">
                  {category.subtitle}
                </div>

                <p className="text-xs leading-relaxed opacity-70 line-clamp-2">
                  {category.description}
                </p>
              </div>

              <div className="mt-4 pt-3 border-t border-current/15 flex items-center justify-between text-[11px] font-bold">
                <span className="uppercase tracking-wider flex items-center gap-1.5">
                  {isSelected ? (
                    <>
                      <Check className="w-3.5 h-3.5 text-amber-500" />
                      <span>Active State</span>
                    </>
                  ) : (
                    <span>Explore Verses</span>
                  )}
                </span>
                <span className={`transition-transform duration-200 ${isSelected ? 'translate-x-1 font-black text-amber-500' : ''}`}>
                  →
                </span>
              </div>
            </button>
          );
        })}
      </div>
    </div>
  );
};
