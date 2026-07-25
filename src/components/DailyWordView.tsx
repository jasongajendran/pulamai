import React, { useState } from 'react';
import { Sparkles, RefreshCw } from 'lucide-react';
import { VocabularyEntry } from '../types';
import { VocabularyCard } from './VocabularyCard';

interface DailyWordViewProps {
  entries: VocabularyEntry[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
}

export const DailyWordView: React.FC<DailyWordViewProps> = ({
  entries,
  bookmarkedIds,
  onToggleBookmark,
}) => {
  const todayIndex = new Date().getDate() % (entries.length || 1);
  const [featuredIndex, setFeaturedIndex] = useState(todayIndex);

  const featuredEntry = entries[featuredIndex % entries.length];
  const isBookmarked = bookmarkedIds.includes(featuredEntry.id);

  const handleShuffleWord = () => {
    const nextIndex = Math.floor(Math.random() * entries.length);
    setFeaturedIndex(nextIndex);
  };

  return (
    <div className="max-w-3xl mx-auto py-2 px-2 sm:px-4">
      {/* Banner */}
      <div className="bg-[#0f0f0f] rounded-xl p-4 border border-stone-800 shadow-md mb-4 relative overflow-hidden">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 relative z-10">
          <div>
            <span className="inline-flex items-center text-[10px] font-bold uppercase tracking-wider text-teal-300 bg-teal-950/40 px-2 py-0.5 rounded-full border border-teal-500/20 font-serif mb-1.5">
              <Sparkles className="w-3 h-3 mr-1 text-teal-400" />
              Featured Word
            </span>
            <h2 className="text-xl sm:text-2xl font-serif font-bold text-stone-100">
              {featuredEntry.word}
            </h2>
            <p className="text-xs text-stone-400 mt-0.5 font-serif">
              "{featuredEntry.tamilDefinition}"
            </p>
          </div>

          <button
            onClick={handleShuffleWord}
            className="flex items-center space-x-1.5 px-3.5 py-1.5 bg-teal-300 hover:bg-teal-200 text-stone-950 font-bold rounded-lg text-xs shadow-sm transition-colors cursor-pointer self-start sm:self-auto min-h-[36px]"
            title="Discover another word"
          >
            <RefreshCw className="w-3.5 h-3.5 mr-1" />
            <span>Discover Another</span>
          </button>
        </div>
      </div>

      {/* Full Vocabulary Card for Featured Word */}
      <VocabularyCard
        entry={featuredEntry}
        isBookmarked={isBookmarked}
        onToggleBookmark={onToggleBookmark}
      />
    </div>
  );
};
