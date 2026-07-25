import React, { useState } from 'react';
import { Volume2, RotateCw, ChevronLeft, ChevronRight, Shuffle, Bookmark, BookmarkCheck, BookOpen, MessageSquareQuote } from 'lucide-react';
import { VocabularyEntry } from '../types';

interface FlashcardsViewProps {
  entries: VocabularyEntry[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

// Fetch the best British Female voice, strictly excluding male voices
const getBritishFemaleVoice = (): SpeechSynthesisVoice | null => {
  if (typeof window === 'undefined' || !('speechSynthesis' in window)) return null;
  const voices = window.speechSynthesis.getVoices();
  
  // Filter for English languages
  const enVoices = voices.filter(
    (v) => v.lang.toLowerCase().startsWith('en')
  );
  if (enVoices.length === 0) return null;

  // Known male keywords/names to strictly exclude
  const maleKeywords = [
    'male', 'daniel', 'george', 'david', 'mark', 'ravi', 'james', 'guy', 'peter', 
    'raju', 'steve', 'tom', 'alex', 'fred', 'bruce', 'ralph', 'albert', 'richard', 
    'ryan', 'sam', 'stefan', 'sean', 'microsoft david', 'microsoft james', 
    'microsoft george', 'microsoft ravi', 'google uk english male', 'google us english male'
  ];

  // Filter out any male voice
  const nonMaleVoices = enVoices.filter((v) => {
    const nameLower = v.name.toLowerCase();
    return !maleKeywords.some((kw) => nameLower.includes(kw));
  });

  if (nonMaleVoices.length === 0) {
    // If absolutely no non-male English voice is found, we can try to fall back 
    // to any voice that explicitly has "female" or doesn't have "male"
    const generalNonMale = voices.filter((v) => !v.name.toLowerCase().includes('male'));
    return generalNonMale.length > 0 ? generalNonMale[0] : null;
  }

  // Filter for British (en-GB) voices among non-male options
  const gbFemaleVoices = nonMaleVoices.filter(
    (v) => v.lang.toLowerCase() === 'en-gb' || v.lang.toLowerCase().startsWith('en-gb')
  );

  // Female keywords to prioritize (preferring young, modern British voice profiles first)
  const femaleKeywords = [
    'sonia', 'libby', 'zoe', 'serena', 'google uk english female', 'alice', 
    'fiona', 'sara', 'sally', 'clara', 'amy', 'emily', 'karen', 'samantha', 
    'victoria', 'moira', 'tessa', 'veena', 'kathy', 'hazel', 'susan'
  ];

  // 1. Check en-GB non-male voices for explicit female keywords
  for (const kw of femaleKeywords) {
    const found = gbFemaleVoices.find((v) => v.name.toLowerCase().includes(kw));
    if (found) return found;
  }

  // 2. If no explicit keyword matches, but we have en-GB non-male voices, return the first one
  if (gbFemaleVoices.length > 0) return gbFemaleVoices[0];

  // 3. Fallback: Check general non-male English voices for explicit female keywords
  for (const kw of femaleKeywords) {
    const found = nonMaleVoices.find((v) => v.name.toLowerCase().includes(kw));
    if (found) return found;
  }

  // 4. Ultimate fallback: return first non-male English voice
  return nonMaleVoices[0];
};

export const FlashcardsView: React.FC<FlashcardsViewProps> = ({
  entries,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const [filterMode, setFilterMode] = useState<'all' | 'bookmarked'>('all');
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);

  const activeEntries = filterMode === 'bookmarked'
    ? entries.filter((e) => bookmarkedIds.includes(e.id))
    : entries;

  if (activeEntries.length === 0) {
    return (
      <div className="bg-[#0f0f0f] rounded-xl p-6 text-center border border-stone-800 shadow-md max-w-xl mx-auto my-4 space-y-3">
        <Bookmark className="w-10 h-10 text-stone-700 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-stone-200">
          No Saved Words
        </h3>
        <p className="text-stone-500 text-xs">
          Save words in the dictionary to practice them here.
        </p>
        <button
          onClick={() => setFilterMode('all')}
          className="px-3.5 py-1.5 bg-teal-300 text-stone-950 font-bold rounded-lg text-xs hover:bg-teal-200 cursor-pointer transition-colors"
        >
          Switch to All Words
        </button>
      </div>
    );
  }

  const currentEntry = activeEntries[currentIndex % activeEntries.length];
  const isBookmarked = bookmarkedIds.includes(currentEntry.id);

  const handleNext = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev + 1) % activeEntries.length);
  };

  const handlePrev = () => {
    setIsFlipped(false);
    setCurrentIndex((prev) => (prev - 1 + activeEntries.length) % activeEntries.length);
  };

  const handleShuffle = () => {
    setIsFlipped(false);
    const randomIndex = Math.floor(Math.random() * activeEntries.length);
    setCurrentIndex(randomIndex);
  };

  const handleSpeak = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(currentEntry.word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.94; // Optimized rate for natural, articulate speech
      utterance.pitch = 1.12; // Elevated pitch to sound younger and brighter
      const voice = getBritishFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }
      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <div className="max-w-xl mx-auto py-2 px-2 sm:px-4">
      {/* Header Controls */}
      <div className="flex flex-col sm:flex-row items-center justify-between gap-3 mb-4 bg-[#0f0f0f] p-3 rounded-xl border border-stone-800/80 shadow-md">
        <div>
          <h2 className="text-sm sm:text-base font-serif font-bold text-stone-100">
            Interactive Flashcards
          </h2>
          <p className="text-[10px] text-stone-500">
            Click card to flip and view explanation &amp; Tamil meaning.
          </p>
        </div>

        <div className="flex items-center space-x-1.5">
          <button
            onClick={() => {
              setFilterMode('all');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer transition-colors ${
              filterMode === 'all'
                ? 'bg-teal-300 text-stone-950 font-bold'
                : 'bg-stone-950 text-stone-400 hover:bg-stone-900 border border-stone-900'
            }`}
          >
            All Words ({entries.length})
          </button>
          <button
            onClick={() => {
              setFilterMode('bookmarked');
              setCurrentIndex(0);
              setIsFlipped(false);
            }}
            className={`px-2.5 py-1 rounded-lg text-[10px] sm:text-xs font-semibold cursor-pointer transition-colors ${
              filterMode === 'bookmarked'
                ? 'bg-rose-950/40 text-rose-300 font-bold border border-rose-800/60'
                : 'bg-stone-950 text-stone-400 hover:bg-stone-900 border border-stone-900'
            }`}
          >
            Saved ({bookmarkedIds.length})
          </button>
        </div>
      </div>

      {/* Progress & Card Position Indicator */}
      <div className="flex items-center justify-between text-[11px] font-semibold text-stone-500 mb-1.5 px-0.5">
        <span>
          Word {currentIndex + 1} / {activeEntries.length}
        </span>
        <span className="text-teal-400 font-serif">
          Vocabulary Card
        </span>
      </div>

      {/* Flashcard Container */}
      <div
        onClick={() => setIsFlipped(!isFlipped)}
        className="cursor-pointer min-h-[300px] sm:min-h-[340px] bg-gradient-to-b from-[#121212] to-[#0d0d0d] rounded-xl border border-stone-800 shadow-lg p-5 sm:p-6 flex flex-col justify-between transition-all hover:border-teal-500/25 relative overflow-hidden group"
      >
        {/* Bookmark Tag on Card */}
        <button
          onClick={(e) => {
            e.stopPropagation();
            onToggleBookmark(currentEntry.id);
          }}
          className="absolute top-3.5 right-3.5 p-1.5 rounded-full bg-stone-950 hover:bg-rose-950 text-stone-300 hover:text-rose-200 transition-colors cursor-pointer z-10 border border-stone-900"
          title={isBookmarked ? 'Remove Saved' : 'Save Word'}
        >
          {isBookmarked ? (
            <BookmarkCheck className="w-4 h-4 text-rose-400" />
          ) : (
            <Bookmark className="w-4 h-4 text-stone-500" />
          )}
        </button>

        {/* FRONT OF CARD */}
        {!isFlipped ? (
          <div className="flex-1 flex flex-col items-center justify-center text-center space-y-3.5 my-auto animate-fadeIn">
            <span className="text-[9px] font-bold text-teal-300 uppercase tracking-widest bg-teal-950/40 px-2.5 py-0.5 rounded-full border border-teal-500/20 font-serif">
              Vocabulary Card
            </span>

            <h3 className="text-3xl sm:text-4xl font-serif font-bold text-stone-100 tracking-wide">
              {currentEntry.word}
            </h3>

            <div className="flex items-center justify-center space-x-1.5">
              <span className="text-xs italic text-stone-400 font-medium bg-stone-950/80 px-2 py-0.5 rounded border border-stone-900">
                {currentEntry.partOfSpeech}
              </span>
              <button
                onClick={handleSpeak}
                className="p-1.5 rounded-full bg-stone-950 text-teal-400 hover:bg-teal-950 border border-stone-900 transition-colors cursor-pointer"
                title="Listen in British accent"
              >
                <Volume2 className="w-4 h-4" />
              </button>
            </div>

            <div className="pt-4 text-[10px] font-semibold text-teal-400 flex items-center space-x-1 animate-pulse">
              <RotateCw className="w-3.5 h-3.5" />
              <span>Tap to Flip</span>
            </div>
          </div>
        ) : (
          /* BACK OF CARD */
          <div className="flex-1 flex flex-col justify-between space-y-3.5 my-auto animate-fadeIn">
            <div className="space-y-3">
              <div className="flex items-center justify-between pb-1.5 border-b border-stone-900">
                <span className="text-[9px] font-bold text-teal-300 uppercase tracking-wider bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-900/30 font-serif">
                  English &amp; Tamil Explanation
                </span>
                <span className="text-sm font-serif font-bold text-stone-300">
                  {currentEntry.word}
                </span>
              </div>

              {/* English Definition */}
              <div className="bg-stone-950/50 p-2.5 rounded-lg border border-stone-900/60">
                <p className="text-xs sm:text-sm text-stone-200 leading-relaxed font-sans font-medium">
                  {currentEntry.englishDefinition}
                </p>
              </div>

              {/* Tamil Meaning */}
              <div className="bg-stone-950/20 p-1">
                <p className="text-base sm:text-lg font-serif font-semibold text-stone-100 leading-relaxed">
                  {currentEntry.tamilDefinition}
                </p>
              </div>

              {/* Literary Example */}
              <div className="bg-[#141414] p-2.5 rounded-r border-y border-r border-stone-900 border-l-2 border-l-teal-400/85 space-y-0.5">
                <span className="text-[10px] font-bold text-teal-400 font-serif flex items-center">
                  <BookOpen className="w-3 h-3 mr-1" />
                  Literary Usage:
                </span>
                <p className="text-[11px] font-serif font-semibold text-stone-300 leading-relaxed">
                  {currentEntry.literaryContext.tamil}
                </p>
              </div>

              {/* Formal Speech Example */}
              <div className="bg-[#141414] p-2.5 rounded-r border-y border-r border-stone-900 border-l-2 border-l-amber-400/85 space-y-0.5">
                <span className="text-[10px] font-bold text-amber-400 font-serif flex items-center">
                  <MessageSquareQuote className="w-3 h-3 mr-1" />
                  Formal Context:
                </span>
                <p className="text-[11px] font-serif font-semibold text-stone-300 leading-relaxed">
                  {currentEntry.formalSpeechContext.tamil}
                </p>
              </div>
            </div>

            <div className="pt-2 border-t border-stone-900 flex items-center justify-end text-[10px] text-stone-500">
              <span className="text-teal-400 font-semibold flex items-center">
                <RotateCw className="w-3 h-3 mr-1" />
                Tap to Flip Back
              </span>
            </div>
          </div>
        )}
      </div>

      {/* Navigation & Shuffle Controls */}
      <div className="flex items-center justify-between mt-4 bg-[#0f0f0f] p-2 rounded-xl border border-stone-800/80 shadow-md">
        <button
          onClick={handlePrev}
          className="flex items-center space-x-1 px-3 py-1.5 bg-stone-950 text-stone-300 rounded-lg text-xs font-semibold border border-stone-900 hover:bg-teal-950/20 hover:text-teal-200 hover:border-teal-900 transition-colors cursor-pointer min-h-[36px]"
        >
          <ChevronLeft className="w-4 h-4" />
          <span>Prev</span>
        </button>

        <button
          onClick={handleShuffle}
          className="flex items-center space-x-1 px-3 py-1.5 bg-teal-300 text-stone-950 font-bold rounded-lg text-xs hover:bg-teal-200 transition-colors cursor-pointer min-h-[36px]"
          title="Randomize sequence"
        >
          <Shuffle className="w-3.5 h-3.5 mr-1" />
          <span>Shuffle</span>
        </button>

        <button
          onClick={handleNext}
          className="flex items-center space-x-1 px-3 py-1.5 bg-stone-950 text-stone-300 rounded-lg text-xs font-semibold border border-stone-900 hover:bg-teal-950/20 hover:text-teal-200 hover:border-teal-900 transition-colors cursor-pointer min-h-[36px]"
        >
          <span>Next</span>
          <ChevronRight className="w-4 h-4" />
        </button>
      </div>
    </div>
  );
};
