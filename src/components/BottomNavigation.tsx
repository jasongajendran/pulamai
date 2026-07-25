import React, { useState, useEffect } from 'react';
import { Home, Layers, Award, Bookmark, Sparkles, ArrowUp } from 'lucide-react';

interface BottomNavigationProps {
  activeTab: 'dictionary' | 'flashcards' | 'quiz' | 'bookmarks' | 'daily';
  setActiveTab: (tab: 'dictionary' | 'flashcards' | 'quiz' | 'bookmarks' | 'daily') => void;
  bookmarkCount: number;
}

export const BottomNavigation: React.FC<BottomNavigationProps> = ({
  activeTab,
  setActiveTab,
  bookmarkCount,
}) => {
  const [showScrollTop, setShowScrollTop] = useState(false);

  // Monitor scroll height to show active scroll states if desired
  useEffect(() => {
    const handleScroll = () => {
      if (window.scrollY > 200) {
        setShowScrollTop(true);
      } else {
        setShowScrollTop(false);
      }
    };
    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const scrollToTop = () => {
    window.scrollTo({
      top: 0,
      behavior: 'smooth',
    });
  };

  const handleTabClick = (tab: 'dictionary' | 'flashcards' | 'quiz' | 'bookmarks' | 'daily') => {
    setActiveTab(tab);
    // Smooth scroll to top when changing tabs
    setTimeout(() => {
      scrollToTop();
    }, 50);
  };

  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 w-[calc(100%-1.5rem)] max-w-lg transition-all duration-300 ease-in-out">
      {/* Glassmorphic outer shell */}
      <div className="bg-stone-950/80 backdrop-blur-xl border border-stone-800/90 shadow-[0_8px_32px_rgba(0,0,0,0.6)] rounded-2xl p-1.5 sm:p-2 flex items-center justify-between gap-1">
        
        {/* Navigation Items */}
        <div className="flex items-center justify-start flex-1 gap-1">
          {/* Home / Dictionary Tab */}
          <button
            onClick={() => handleTabClick('dictionary')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[44px] ${
              activeTab === 'dictionary'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
            }`}
            title="Home / Dictionary"
          >
            <Home className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium font-sans">Home</span>
          </button>

          {/* Flashcards Tab */}
          <button
            onClick={() => handleTabClick('flashcards')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[44px] ${
              activeTab === 'flashcards'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
            }`}
            title="Flashcards"
          >
            <Layers className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium font-sans">Flash</span>
          </button>

          {/* Quiz Tab */}
          <button
            onClick={() => handleTabClick('quiz')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[44px] ${
              activeTab === 'quiz'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
            }`}
            title="Quiz"
          >
            <Award className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium font-sans">Quiz</span>
          </button>

          {/* Bookmarks Tab */}
          <button
            onClick={() => handleTabClick('bookmarks')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[44px] ${
              activeTab === 'bookmarks'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
            }`}
            title="Bookmarks"
          >
            <div className="relative">
              <Bookmark className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
              {bookmarkCount > 0 && (
                <span className="absolute -top-1 -right-2 bg-rose-500 text-stone-950 text-[8px] font-bold px-1 rounded-full min-w-[12px] h-3.5 flex items-center justify-center">
                  {bookmarkCount}
                </span>
              )}
            </div>
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium font-sans">Saved</span>
          </button>

          {/* Daily Word Tab */}
          <button
            onClick={() => handleTabClick('daily')}
            className={`flex flex-col items-center justify-center flex-1 py-1.5 px-1 rounded-xl transition-all duration-200 cursor-pointer relative min-h-[44px] ${
              activeTab === 'daily'
                ? 'bg-teal-500/15 text-teal-300 border border-teal-500/20 shadow-[inset_0_1px_1px_rgba(255,255,255,0.05)]'
                : 'text-stone-400 hover:text-stone-200 hover:bg-stone-900/50 border border-transparent'
            }`}
            title="Daily Word"
          >
            <Sparkles className="w-4 h-4 sm:w-[18px] sm:h-[18px]" />
            <span className="text-[9px] sm:text-[10px] mt-0.5 font-medium font-sans">Daily</span>
          </button>
        </div>

        {/* Divider */}
        <div className="h-8 w-[1px] bg-stone-800/80 mx-1 self-center" />

        {/* Scroll To Top action button */}
        <button
          onClick={scrollToTop}
          className={`flex flex-col items-center justify-center py-1.5 px-1 sm:px-1.5 rounded-xl transition-all duration-200 cursor-pointer min-h-[44px] ${
            showScrollTop 
              ? 'text-teal-400 hover:text-teal-300 hover:bg-teal-950/20' 
              : 'text-stone-600 hover:text-stone-500 cursor-not-allowed opacity-40'
          }`}
          disabled={!showScrollTop}
          title="Scroll to Top"
        >
          <ArrowUp className="w-4 h-4 sm:w-[18px] sm:h-[18px] animate-bounce" style={{ animationDuration: '3s' }} />
          <span className="text-[9px] sm:text-[10px] mt-0.5 font-semibold font-sans">Top</span>
        </button>
      </div>
    </div>
  );
};
