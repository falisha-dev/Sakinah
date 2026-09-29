import React, { useState } from 'react';
import { Moon, Sun, Sparkles, Menu, X, BookOpen, Layers, BookmarkCheck, Shield, Wind } from 'lucide-react';
import { SakinahBird } from './SakinahBird';

export type NavigationTab = 'contemplate' | 'adhkar' | 'breathwork' | 'dhikr' | 'moods' | 'journal';

interface HeaderProps {
  activeTab: NavigationTab;
  setActiveTab: (tab: NavigationTab) => void;
  theme: 'dark' | 'light';
  onToggleTheme: () => void;
  savedReflectionsCount: number;
}

export const Header: React.FC<HeaderProps> = ({
  activeTab,
  setActiveTab,
  theme,
  onToggleTheme,
  savedReflectionsCount,
}) => {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const handleTabClick = (tab: NavigationTab) => {
    setActiveTab(tab);
    setMobileMenuOpen(false);

    // Smoothly scroll to the main interactive dashboard
    const target = document.getElementById('main-dashboard');
    if (target) {
      target.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <header className="w-full px-4 sm:px-6 py-4 z-30 transition-colors">
      <div className="flex items-center justify-between">
        {/* Brand logo & mascot */}
        <button
          type="button"
          onClick={() => handleTabClick('contemplate')}
          className="flex items-center gap-2.5 cursor-pointer group text-left focus:outline-none"
        >
          <SakinahBird size={36} className="transform group-hover:rotate-6 transition-transform" />
          <div className="flex flex-col">
            <span className={`font-heading text-2xl tracking-wide leading-none ${
              theme === 'dark' ? 'text-amber-300' : 'text-[#2C1810]'
            }`}>
              SAKINAH
            </span>
            <span className="font-arabic text-[11px] text-stone-500 leading-none">
              سكينة · Peace of Mind
            </span>
          </div>
        </button>

        {/* Center navigation links (Desktop) */}
        <nav className="hidden xl:flex items-center gap-6 text-sm font-bold tracking-tight">
          <button
            type="button"
            onClick={() => handleTabClick('contemplate')}
            className={`transition-colors py-1 relative cursor-pointer ${
              activeTab === 'contemplate'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            Contemplate
            {activeTab === 'contemplate' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('breathwork')}
            className={`transition-colors py-1 relative cursor-pointer flex items-center gap-1.5 ${
              activeTab === 'breathwork'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            <Wind className="w-3.5 h-3.5 text-sky-400" />
            <span>Breathwork</span>
            {activeTab === 'breathwork' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('adhkar')}
            className={`transition-colors py-1 relative cursor-pointer flex items-center gap-1 ${
              activeTab === 'adhkar'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            <Shield className="w-3.5 h-3.5 text-amber-500" />
            <span>Daily Adhkar</span>
            {activeTab === 'adhkar' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('dhikr')}
            className={`transition-colors py-1 relative cursor-pointer ${
              activeTab === 'dhikr'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            Tasbeeh
            {activeTab === 'dhikr' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('moods')}
            className={`transition-colors py-1 relative cursor-pointer ${
              activeTab === 'moods'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            Verses by Mood
            {activeTab === 'moods' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('journal')}
            className={`transition-colors py-1 relative flex items-center gap-1.5 cursor-pointer ${
              activeTab === 'journal'
                ? theme === 'dark' ? 'text-white' : 'text-[#2C1810]'
                : theme === 'dark' ? 'text-stone-400 hover:text-white' : 'text-[#6B4B3E] hover:text-[#2C1810]'
            }`}
          >
            Journal
            {savedReflectionsCount > 0 && (
              <span className={`text-[11px] px-1.5 py-0.2 rounded-full font-mono font-bold ${
                theme === 'dark' ? 'bg-stone-800 text-amber-300' : 'bg-[#2C1810] text-[#FFFDF5]'
              }`}>
                {savedReflectionsCount}
              </span>
            )}
            {activeTab === 'journal' && (
              <span className={`absolute -bottom-1 left-0 right-0 h-1 rounded-full ${
                theme === 'dark' ? 'bg-amber-300' : 'bg-[#2C1810]'
              }`} />
            )}
          </button>
        </nav>

        {/* Right actions: Theme toggle, Breathwork CTA, & Mobile Hamburger */}
        <div className="flex items-center gap-2 sm:gap-3">
          <button
            type="button"
            onClick={onToggleTheme}
            aria-label={theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode'}
            className={`p-2 rounded-full border-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-amber-300 hover:bg-stone-800'
                : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810] hover:bg-[#F3EFE0]'
            }`}
          >
            {theme === 'dark' ? <Sun className="w-4 h-4" /> : <Moon className="w-4 h-4" />}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('breathwork')}
            className={`hidden sm:inline-flex items-center gap-1.5 px-4 py-2 text-xs font-bold rounded-full border-2 transition-transform active:scale-95 cursor-pointer ${
              theme === 'dark'
                ? 'bg-sky-400 border-sky-300 text-stone-950 hover:bg-sky-300'
                : 'bg-[#2C1810] border-[#2C1810] text-[#FFFDF5] hover:bg-[#44261A]'
            }`}
          >
            <Wind className="w-3.5 h-3.5" />
            <span>4-7-8 Breath</span>
          </button>

          {/* Mobile menu toggle */}
          <button
            type="button"
            onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
            aria-label="Toggle navigation menu"
            className={`xl:hidden p-2 rounded-full border-2 transition-colors cursor-pointer ${
              theme === 'dark'
                ? 'bg-stone-900 border-stone-700 text-stone-200'
                : 'bg-[#FFFDF5] border-[#2C1810] text-[#2C1810]'
            }`}
          >
            {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
          </button>
        </div>
      </div>

      {/* Mobile Drawer Menu */}
      {mobileMenuOpen && (
        <div className={`xl:hidden mt-3 p-4 rounded-2xl border-2 space-y-2 animate-fade-in ${
          theme === 'dark'
            ? 'bg-[#151922] border-stone-700 text-stone-100'
            : 'bg-white border-[#2C1810] text-[#2C1810] shadow-[4px_4px_0px_#2C1810]'
        }`}>
          <button
            type="button"
            onClick={() => handleTabClick('contemplate')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'contemplate'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookOpen className="w-4 h-4" />
              Contemplate
            </span>
            {activeTab === 'contemplate' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('breathwork')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'breathwork'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <Wind className="w-4 h-4 text-sky-400" />
              Breathwork (4-7-8)
            </span>
            {activeTab === 'breathwork' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('adhkar')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'adhkar'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <Shield className="w-4 h-4 text-amber-500" />
              Daily Adhkar
            </span>
            {activeTab === 'adhkar' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('dhikr')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'dhikr'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Tasbeeh Counter
            </span>
            {activeTab === 'dhikr' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('moods')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'moods'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <Layers className="w-4 h-4" />
              Verses by Mood
            </span>
            {activeTab === 'moods' && <span>✓</span>}
          </button>

          <button
            type="button"
            onClick={() => handleTabClick('journal')}
            className={`w-full p-2.5 rounded-xl text-left font-bold text-sm flex items-center justify-between border-2 ${
              activeTab === 'journal'
                ? theme === 'dark'
                  ? 'bg-stone-800 border-amber-400 text-amber-300'
                  : 'bg-[#FEF08A] border-[#2C1810]'
                : 'border-transparent opacity-80'
            }`}
          >
            <span className="flex items-center gap-2">
              <BookmarkCheck className="w-4 h-4" />
              Journal {savedReflectionsCount > 0 && `(${savedReflectionsCount})`}
            </span>
            {activeTab === 'journal' && <span>✓</span>}
          </button>
        </div>
      )}
    </header>
  );
};
