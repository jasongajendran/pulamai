import React from 'react';

interface AZSelectorProps {
  selectedLetter: string | null;
  onSelectLetter: (letter: string | null) => void;
  letterCounts: Record<string, number>;
}

export const AZSelector: React.FC<AZSelectorProps> = ({
  selectedLetter,
  onSelectLetter,
  letterCounts,
}) => {
  const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

  return (
    <div className="bg-[#0f0f0f] border border-stone-800/80 rounded-xl p-2 shadow-md my-3">
      <div className="flex items-center gap-1 overflow-x-auto no-scrollbar pb-0.5 sm:flex-wrap sm:justify-start">
        <button
          onClick={() => onSelectLetter(null)}
          className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all h-7 shrink-0 cursor-pointer flex items-center justify-center ${
            selectedLetter === null
              ? 'bg-teal-300 text-stone-950 font-bold border border-teal-400 shadow-sm'
              : 'bg-stone-950 text-stone-400 hover:bg-stone-900 border border-stone-900'
          }`}
        >
          ALL
        </button>

        {alphabet.map((letter) => {
          const count = letterCounts[letter] || 0;
          const isSelected = selectedLetter === letter;

          return (
            <button
              key={letter}
              onClick={() => onSelectLetter(letter)}
              className={`relative px-3 py-1 rounded-lg text-[11px] font-semibold transition-all h-7 shrink-0 flex items-center justify-center cursor-pointer ${
                isSelected
                  ? 'bg-teal-300 text-stone-950 font-bold ring-1 ring-teal-400'
                  : count > 0
                  ? 'bg-stone-950 text-teal-200 border border-teal-500/20 hover:bg-teal-950/40 hover:border-teal-400'
                  : 'bg-stone-950/40 text-stone-600 border border-stone-900 hover:bg-stone-900/40'
              }`}
              title={`${letter}: ${count} terms`}
            >
              <span>{letter}</span>
            </button>
          );
        })}
      </div>
    </div>
  );
};
