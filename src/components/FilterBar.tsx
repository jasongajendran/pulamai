import React from 'react';
import { Search, X } from 'lucide-react';

interface FilterBarProps {
  searchQuery: string;
  setSearchQuery: (query: string) => void;
  onClearAll: () => void;
}

export const FilterBar: React.FC<FilterBarProps> = ({
  searchQuery,
  setSearchQuery,
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
    </div>
  );
};
