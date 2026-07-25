import React, { useState } from 'react';
import { Bookmark, Copy, Trash2, Check } from 'lucide-react';
import { VocabularyEntry } from '../types';
import { VocabularyCard } from './VocabularyCard';

interface BookmarksViewProps {
  allEntries: VocabularyEntry[];
  bookmarkedIds: string[];
  onToggleBookmark: (id: string) => void;
  onClearAllBookmarks: () => void;
}

export const BookmarksView: React.FC<BookmarksViewProps> = ({
  allEntries,
  bookmarkedIds,
  onToggleBookmark,
  onClearAllBookmarks,
}) => {
  const [copied, setCopied] = useState(false);

  const bookmarkedEntries = allEntries.filter((entry) => bookmarkedIds.includes(entry.id));

  const handleCopyList = () => {
    if (bookmarkedEntries.length === 0) return;
    const formatted = bookmarkedEntries
      .map(
        (item) =>
          `• ${item.word} (${item.partOfSpeech}):\n  ${item.englishDefinition}\n  Tamil Meaning: ${item.tamilDefinition}\n`
      )
      .join('\n');

    navigator.clipboard.writeText(`Pulamai Lexicon Saved Vocabulary:\n\n${formatted}`);
    setCopied(true);
    setTimeout(() => setCopied(false), 2500);
  };

  if (bookmarkedEntries.length === 0) {
    return (
      <div className="max-w-xl mx-auto py-8 text-center bg-[#0f0f0f] rounded-xl border border-stone-850 shadow-md my-4 p-6 space-y-3">
        <Bookmark className="w-12 h-12 text-stone-700 mx-auto" />
        <h3 className="text-lg font-serif font-bold text-stone-200">
          No Bookmarked Words
        </h3>
        <p className="text-stone-500 text-xs max-w-sm mx-auto leading-relaxed">
          Click the 'Save' button next to any word in the dictionary to bookmark it for daily review.
        </p>
      </div>
    );
  }

  return (
    <div className="max-w-3xl mx-auto py-2 px-2 sm:px-4">
      {/* Bookmarks Header bar */}
      <div className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 shadow-md p-3.5 mb-4 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
        <div>
          <h2 className="text-base font-serif font-bold text-stone-100 flex items-center space-x-1.5">
            <Bookmark className="w-4 h-4 text-teal-400" />
            <span>Saved Vocabulary</span>
          </h2>
          <p className="text-[10px] text-stone-500">
            List of {bookmarkedEntries.length} saved words for daily review.
          </p>
        </div>

        <div className="flex items-center space-x-2">
          <button
            onClick={handleCopyList}
            className="flex items-center space-x-1 text-xs font-semibold text-stone-300 bg-stone-950 hover:bg-stone-900 border border-stone-850 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[34px]"
            title="Copy saved words list to clipboard"
          >
            {copied ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5 text-stone-500" />}
            <span>{copied ? 'Copied!' : 'Copy List'}</span>
          </button>

          <button
            onClick={onClearAllBookmarks}
            className="flex items-center space-x-1 text-xs font-semibold text-rose-300 bg-rose-950/20 hover:bg-rose-950/40 border border-rose-900/30 px-2.5 py-1.5 rounded-lg transition-colors cursor-pointer min-h-[34px]"
            title="Clear all saved bookmarks"
          >
            <Trash2 className="w-3.5 h-3.5 text-rose-400" />
            <span>Clear All</span>
          </button>
        </div>
      </div>

      {/* Vocabulary Cards List */}
      <div className="space-y-4">
        {bookmarkedEntries.map((entry) => (
          <VocabularyCard
            key={entry.id}
            entry={entry}
            isBookmarked={true}
            onToggleBookmark={onToggleBookmark}
          />
        ))}
      </div>
    </div>
  );
};
