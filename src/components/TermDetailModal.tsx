import React from 'react';
import { X, Sparkles } from 'lucide-react';
import { VocabularyEntry } from '../types';
import { VocabularyCard } from './VocabularyCard';

interface TermDetailModalProps {
  entry: VocabularyEntry | null;
  onClose: () => void;
  isBookmarked: boolean;
  onToggleBookmark: (id: string) => void;
  onSelectTerm: (term: string) => void;
}

export const TermDetailModal: React.FC<TermDetailModalProps> = ({
  entry,
  onClose,
  isBookmarked,
  onToggleBookmark,
  onSelectTerm,
}) => {
  if (!entry) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-3 bg-black/85 backdrop-blur-md overflow-y-auto">
      <div className="bg-[#0b0b0b] rounded-xl max-w-2xl w-full max-h-[92vh] overflow-y-auto border border-stone-800 shadow-2xl p-2 sm:p-3 my-4">
        <div className="flex items-center justify-between p-2.5 bg-[#141414] border border-stone-900 text-stone-100 rounded-lg mb-3">
          <div className="flex items-center space-x-1.5">
            <Sparkles className="w-4 h-4 text-teal-400" />
            <span className="font-serif font-semibold text-xs sm:text-sm text-teal-200">
              Term Explanation
            </span>
          </div>
          <button
            onClick={onClose}
            className="p-1 rounded-md bg-stone-950 text-stone-400 border border-stone-900 hover:bg-stone-900 hover:text-stone-200 transition-colors cursor-pointer min-h-[32px] min-w-[32px] flex items-center justify-center"
            title="Close details"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        <VocabularyCard
          entry={entry}
          isBookmarked={isBookmarked}
          onToggleBookmark={onToggleBookmark}
          onSelectTerm={onSelectTerm}
          defaultExpanded={true}
        />
      </div>
    </div>
  );
};
