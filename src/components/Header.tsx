import React from 'react';
import { Library } from 'lucide-react';

interface HeaderProps {
  onLogoClick?: () => void;
}

export const Header: React.FC<HeaderProps> = ({ onLogoClick }) => {
  return (
    <header className="bg-[#090909] text-stone-100 border-b border-stone-850 shadow-sm">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-3.5 flex items-center justify-between">
        {/* Branding & Short Description */}
        <div className="flex items-center space-x-2.5 cursor-pointer" onClick={onLogoClick}>
          <div className="w-8.5 h-8.5 rounded-lg bg-gradient-to-br from-teal-500 to-teal-950 flex items-center justify-center text-teal-200 shadow-sm border border-teal-400/30">
            <Library className="w-5.5 h-5.5" />
          </div>
          <div>
            <h1 className="text-xl font-serif font-bold text-stone-100 tracking-wide leading-tight">
              Pulamai Lexicon
            </h1>
            <p className="text-[10px] sm:text-xs text-stone-500 font-sans">
              English &amp; Tamil Literary Vocabulary &amp; Formal Usage
            </p>
          </div>
        </div>
      </div>
    </header>
  );
};
