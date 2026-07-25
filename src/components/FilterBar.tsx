import React from 'react';
import { Search, X, Filter } from 'lucide-react';
import { CategoryTag } from '../types';

const CATEGORIES: CategoryTag[] = [
  'Literature',
  'Philosophy',
  'Politics',
  'Science',
  'Formal Speech',
  'Arts & Culture',
  'Ethics & Society',
  'Poetics & Rhetoric',
  'Theology & Religion',
  'Biblical Studies'
];

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  selectedTag: CategoryTag | null;
  setSelectedTag: (tag: CategoryTag | null) => void;
  onClearAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
  selectedTag,
  setSelectedTag,
  onClearAll,
}) => {
  return (
    <div className="bg-[#0f0f0f] rounded-xl border border-stone-800/80 p-3 shadow-md mb-4">
      {/* Search Input */}
      <div className="flex items-center gap-2.5">
        <div className="relative flex-1">
          <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none text-teal-400">
            <Search className="w-4 h-4" />
          </div>
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search word, meaning, context..."
            className="w-full pl-9 pr-9 py-2 bg-stone-950 border border-stone-900 rounded-lg text-stone-100 placeholder-stone-500 text-xs focus:outline-none focus:ring-1 focus:ring-teal-500/50 focus:border-teal-500/50 focus:bg-stone-950/90 transition-all shadow-inner animate-fadeIn"
          />
          {searchQuery && (
            <button
              onClick={onClearAll}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-stone-500 hover:text-stone-300 cursor-pointer"
              title="Clear search"
            >
              <X className="w-3.5 h-3.5" />
            </button>
          )}
        </div>
      </div>
      
      {/* Category Filters */}
      <div className="flex items-center gap-2 mt-3 overflow-x-auto pb-1 scrollbar-hide">
        <Filter className="w-3.5 h-3.5 text-stone-500 shrink-0" />
        <div className="flex gap-2">
          {CATEGORIES.map((tag) => (
            <button
              key={tag}
              onClick={() => setSelectedTag(selectedTag === tag ? null : tag)}
              className={`px-3 py-1 rounded-full text-xs font-medium whitespace-nowrap transition-colors cursor-pointer ${
                selectedTag === tag
                  ? 'bg-teal-500/20 text-teal-300 border border-teal-500/50'
                  : 'bg-stone-900 text-stone-400 border border-stone-800 hover:bg-stone-800 hover:text-stone-300'
              }`}
            >
              {tag}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
};
