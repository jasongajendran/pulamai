import React, { useState } from 'react';
import { Volume2, Bookmark, BookmarkCheck, ChevronDown, ChevronUp } from 'lucide-react';
import { VocabularyEntry } from '../types';

interface VocabularyCardProps {
  entry: VocabularyEntry;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  defaultExpanded?: boolean;
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

// Highlight target English word in example sentence using pastel colors
const highlightEnglish = (text: string, word: string, accentColor: 'teal' | 'amber' = 'teal') => {
  if (!text || !word) return text;
  const stem = word.length > 4 ? word.slice(0, Math.max(4, word.length - 2)) : word;
  const escaped = stem.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
  const regex = new RegExp(`(\\b\\w*${escaped}\\w*\\b|${word})`, 'gi');

  const parts = text.split(regex);
  const highlightClass =
    accentColor === 'teal'
      ? 'bg-teal-500/15 text-teal-200 border border-teal-400/20 px-1 py-0.5 rounded font-semibold'
      : 'bg-amber-500/15 text-amber-200 border border-amber-400/20 px-1 py-0.5 rounded font-semibold';

  return parts.map((part, i) =>
    regex.test(part) ? (
      <span key={i} className={highlightClass}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

// Highlight key Tamil word in example sentence using pastel colors
const highlightTamil = (text: string, tamilDef: string, accentColor: 'teal' | 'amber' = 'teal') => {
  if (!text || !tamilDef) return text;
  const keywords = tamilDef
    .split(/[,/()\s]+/)
    .map((k) => k.trim())
    .filter((k) => k.length >= 2);

  if (keywords.length === 0) return text;

  const pattern = keywords.map((k) => k.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')).join('|');
  const regex = new RegExp(`(${pattern})`, 'gi');

  const highlightClass =
    accentColor === 'teal'
      ? 'text-teal-300 font-bold bg-teal-500/10 px-1 py-0.5 rounded border border-teal-500/20'
      : 'text-amber-300 font-bold bg-amber-500/10 px-1 py-0.5 rounded border border-amber-500/20';

  const parts = text.split(regex);
  return parts.map((part, i) =>
    keywords.some((k) => k.toLowerCase() === part.toLowerCase()) ? (
      <span key={i} className={highlightClass}>
        {part}
      </span>
    ) : (
      part
    )
  );
};

export const VocabularyCard: React.FC<VocabularyCardProps> = ({
  entry,
  isBookmarked,
  onToggleBookmark,
  defaultExpanded = false,
}) => {
  const [playingItem, setPlayingItem] = useState<string | null>(null);
  const [isExpanded, setIsExpanded] = useState<boolean>(defaultExpanded);

  // Read ONLY the English word in British Female voice
  const handleSpeakWord = (e: React.MouseEvent) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(entry.word);
      utterance.lang = 'en-GB';
      utterance.rate = 0.94; // Optimized rate for natural, articulate speech
      utterance.pitch = 1.12; // Elevated pitch to sound younger and brighter
      const voice = getBritishFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setPlayingItem('word');
      utterance.onend = () => setPlayingItem(null);
      utterance.onerror = () => setPlayingItem(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  // Read out English example sentence in British Female voice
  const handleSpeakSentence = (e: React.MouseEvent, sentenceKey: string, sentenceText: string) => {
    e.stopPropagation();
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const utterance = new SpeechSynthesisUtterance(sentenceText);
      utterance.lang = 'en-GB';
      utterance.rate = 0.94; // Optimized rate for natural, articulate speech
      utterance.pitch = 1.12; // Elevated pitch to sound younger and brighter
      const voice = getBritishFemaleVoice();
      if (voice) {
        utterance.voice = voice;
      }

      utterance.onstart = () => setPlayingItem(sentenceKey);
      utterance.onend = () => setPlayingItem(null);
      utterance.onerror = () => setPlayingItem(null);

      window.speechSynthesis.speak(utterance);
    }
  };

  return (
    <article className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 shadow-md hover:border-teal-500/25 transition-all duration-200 overflow-hidden mb-4">
      {/* Top Header: English Word, Part of Speech, Action Controls */}
      <div className="bg-[#141414] px-4 py-2.5 border-b border-stone-800/60 flex flex-row items-center justify-between gap-3">
        <div className="flex items-center space-x-2.5">
          <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100 tracking-wide">
            {entry.word}
          </h2>
          <span className="text-[11px] font-sans italic text-stone-400 font-medium bg-stone-900 px-2 py-0.5 rounded-full border border-stone-800">
            {entry.partOfSpeech}
          </span>
        </div>

        {/* Actions: British Female TTS & Save */}
        <div className="flex items-center space-x-1.5">
          <button
            onClick={handleSpeakWord}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer min-h-[34px] ${
              playingItem === 'word'
                ? 'bg-teal-300 text-stone-950 border-teal-400 font-bold'
                : 'bg-stone-950 text-stone-300 border-stone-800 hover:bg-teal-950/40 hover:text-teal-200 hover:border-teal-900'
            }`}
            title="Listen in British Accent"
          >
            <Volume2 className={`w-3.5 h-3.5 ${playingItem === 'word' ? 'text-stone-950' : 'text-teal-400'}`} />
            <span className="hidden sm:inline">Listen</span>
          </button>

          <button
            onClick={(e) => {
              e.stopPropagation();
              onToggleBookmark(entry.id);
            }}
            className={`flex items-center space-x-1 px-2.5 py-1 rounded-lg text-[11px] font-semibold border transition-all cursor-pointer min-h-[34px] ${
              isBookmarked
                ? 'bg-rose-950/40 text-rose-300 border-rose-800/80 shadow-xs'
                : 'bg-stone-950 text-stone-400 border-stone-800 hover:bg-rose-950/20 hover:text-rose-200 hover:border-rose-900'
            }`}
            title={isBookmarked ? 'Remove bookmark' : 'Save word'}
          >
            {isBookmarked ? (
              <>
                <BookmarkCheck className="w-3.5 h-3.5 text-rose-400" />
                <span className="hidden sm:inline">Saved</span>
              </>
            ) : (
              <>
                <Bookmark className="w-3.5 h-3.5 text-stone-500" />
                <span className="hidden sm:inline">Save</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* Main Body */}
      <div className="p-4 space-y-3">
        {/* Definition Block - with subtle highlights as requested */}
        <div className="space-y-3 bg-[#141414] p-4 rounded-xl border border-stone-900">
          <p className="text-stone-200 text-[14px] sm:text-base leading-relaxed font-sans font-medium">
            <span className="bg-teal-500/8 text-teal-100/95 border-b border-teal-500/20 px-1.5 py-0.5 rounded-sm decoration-teal-500/30">
              {entry.englishDefinition}
            </span>
          </p>
          <p className="text-stone-100 text-base sm:text-lg font-serif font-semibold leading-relaxed pt-3 border-t border-stone-850">
            <span className="bg-amber-500/8 text-amber-100/95 border-b border-amber-500/20 px-1.5 py-0.5 rounded-sm decoration-amber-500/30">
              {entry.tamilDefinition}
            </span>
          </p>
        </div>

        {/* Synonyms & Antonyms (SYN: and ANT:) */}
        <div className="flex flex-col sm:flex-row sm:items-center gap-2 text-[11px] text-stone-400 pt-0.5">
          {/* Synonyms */}
          <div className="flex items-center space-x-1.5">
            <span className="font-serif font-bold text-emerald-400/80 shrink-0">SYN:</span>
            <div className="flex flex-wrap gap-1">
              {entry.synonyms.map((syn) => (
                <span
                  key={syn}
                  className="inline-flex items-center text-[10px] bg-emerald-950/30 text-emerald-300/90 border border-emerald-900/40 px-1.5 py-0.2 rounded font-medium"
                >
                  {syn}
                </span>
              ))}
            </div>
          </div>

          {/* Antonyms */}
          <div className="flex items-center space-x-1.5 sm:ml-4">
            <span className="font-serif font-bold text-rose-400/80 shrink-0">ANT:</span>
            <div className="flex flex-wrap gap-1">
              {entry.antonyms.map((ant) => (
                <span
                  key={ant}
                  className="inline-flex items-center text-[10px] bg-rose-950/30 text-rose-300/90 border border-rose-900/40 px-1.5 py-0.2 rounded font-medium"
                >
                  {ant}
                </span>
              ))}
            </div>
          </div>
        </div>

        {/* Toggle Details / Examples button */}
        <div className="pt-1.5 border-t border-stone-900 flex items-center justify-between">
          <button
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center space-x-1 text-xs font-semibold text-teal-400 hover:text-teal-300 transition-colors cursor-pointer"
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5" />
                <span>Hide Examples</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5" />
                <span>View Examples</span>
              </>
            )}
          </button>
        </div>

        {/* Examples Section */}
        {isExpanded && (
          <div className="space-y-3.5 pt-1.5 animate-fadeIn">
            {/* Color-Coding Legend */}
            <div className="flex items-center gap-3.5 text-[10px] text-stone-400 font-serif px-0.5">
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-teal-400" />
                <span>Literary Usage</span>
              </span>
              <span className="flex items-center gap-1">
                <span className="w-1.5 h-1.5 rounded-full bg-amber-400" />
                <span>Formal Context</span>
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
              {/* Literary Example (Teal Border Accent) */}
              <div className="bg-[#141414] p-3 rounded-r-lg border-y border-r border-stone-900 border-l-4 border-l-teal-400/80 space-y-1.5 relative">
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={(e) => handleSpeakSentence(e, 'lit', entry.literaryContext.english)}
                    className={`p-1 rounded-md border transition-colors cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center ${
                      playingItem === 'lit'
                        ? 'bg-teal-300 text-stone-950 border-teal-400'
                        : 'bg-stone-950 text-teal-400 border-stone-900 hover:bg-stone-900'
                    }`}
                    title="Listen in British Accent"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pr-8">
                  <p className="text-[13px] font-serif italic text-stone-200 leading-relaxed">
                    "{highlightEnglish(entry.literaryContext.english, entry.word, 'teal')}"
                  </p>
                  <p className="text-[13px] font-serif font-semibold text-stone-300 pt-1.5 border-t border-stone-900 leading-relaxed mt-1.5">
                    {highlightTamil(entry.literaryContext.tamil, entry.tamilDefinition, 'teal')}
                  </p>
                </div>
              </div>

              {/* Formal Speech Example (Amber Border Accent) */}
              <div className="bg-[#141414] p-3 rounded-r-lg border-y border-r border-stone-900 border-l-4 border-l-amber-400/80 space-y-1.5 relative">
                <div className="absolute top-2.5 right-2.5">
                  <button
                    onClick={(e) => handleSpeakSentence(e, 'formal', entry.formalSpeechContext.english)}
                    className={`p-1 rounded-md border transition-colors cursor-pointer min-h-[28px] min-w-[28px] flex items-center justify-center ${
                      playingItem === 'formal'
                        ? 'bg-amber-300 text-stone-950 border-amber-400'
                        : 'bg-stone-950 text-amber-400 border-stone-900 hover:bg-stone-900'
                    }`}
                    title="Listen in British Accent"
                  >
                    <Volume2 className="w-3.5 h-3.5" />
                  </button>
                </div>

                <div className="pr-8">
                  <p className="text-[13px] font-sans text-stone-200 leading-relaxed">
                    "{highlightEnglish(entry.formalSpeechContext.english, entry.word, 'amber')}"
                  </p>
                  <p className="text-[13px] font-serif font-semibold text-stone-300 pt-1.5 border-t border-stone-900 leading-relaxed mt-1.5">
                    {highlightTamil(entry.formalSpeechContext.tamil, entry.tamilDefinition, 'amber')}
                  </p>
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </article>
  );
};
