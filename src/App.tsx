import React, { useState, useEffect, useMemo } from 'react';
import { LEXICON_DATA } from './data/lexiconData';
import { VocabularyEntry, CategoryTag } from './types';
import { generateDerivedEntry } from './utils/fallbackLookup';
import { Header } from './components/Header';
import { BottomNavigation } from './components/BottomNavigation';
import { AZSelector } from './components/AZSelector';
import { FilterBar } from './components/FilterBar';
import { VocabularyCard } from './components/VocabularyCard';
import { TermDetailModal } from './components/TermDetailModal';
import { FlashcardsView } from './components/FlashcardsView';
import { QuizView } from './components/QuizView';
import { BookmarksView } from './components/BookmarksView';
import { DailyWordView } from './components/DailyWordView';
import { AlertCircle } from 'lucide-react';

export default function App() {
  const [activeTab, setActiveTab] = useState<'dictionary' | 'flashcards' | 'quiz' | 'bookmarks' | 'daily'>('dictionary');
  const [searchQuery, setSearchQuery] = useState<string>('');
  const [selectedLetter, setSelectedLetter] = useState<string | null>(null);
  const [selectedTag, setSelectedTag] = useState<CategoryTag | null>(null);

  // LocalStorage Bookmarks persistence
  const [bookmarkedIds, setBookmarkedIds] = useState<string[]>(() => {
    try {
      const saved = localStorage.getItem('pulamai_bookmarks');
      return saved ? JSON.parse(saved) : [];
    } catch {
      return [];
    }
  });

  useEffect(() => {
    try {
      localStorage.setItem('pulamai_bookmarks', JSON.stringify(bookmarkedIds));
    } catch {
      // ignore
    }
  }, [bookmarkedIds]);

  // Modal Term Lookup State
  const [modalEntry, setModalEntry] = useState<VocabularyEntry | null>(null);

  const toggleBookmark = (id: string) => {
    setBookmarkedIds((prev) =>
      prev.includes(id) ? prev.filter((item) => item !== id) : [...prev, id]
    );
  };

  const handleClearAllBookmarks = () => {
    if (window.confirm('Clear all saved bookmarks?')) {
      setBookmarkedIds([]);
    }
  };

  // Select term handler (works for synonyms, antonyms, or instant lookup)
  const handleSelectTerm = (term: string) => {
    const found = LEXICON_DATA.find(
      (e) => e.word.toLowerCase() === term.toLowerCase() || e.id === term.toLowerCase()
    );

    if (found) {
      setModalEntry(found);
    } else {
      const derived = generateDerivedEntry(term);
      setModalEntry(derived);
    }
  };

  // Letter Counts mapping for A-Z Selector
  const letterCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    LEXICON_DATA.forEach((entry) => {
      const firstChar = entry.word.charAt(0).toUpperCase();
      counts[firstChar] = (counts[firstChar] || 0) + 1;
    });
    return counts;
  }, []);

  // Filtered Lexicon Dataset
  const filteredEntries = useMemo(() => {
    const entries = LEXICON_DATA.filter((entry) => {
      // Letter filter
      if (selectedLetter && entry.word.charAt(0).toUpperCase() !== selectedLetter) {
        return false;
      }

      // Tag filter
      if (selectedTag && !entry.tags.includes(selectedTag)) {
        return false;
      }

      // Search Query filter
      if (searchQuery.trim() !== '') {
        const q = searchQuery.toLowerCase().trim();
        const matchesWord = entry.word.toLowerCase().includes(q);
        const matchesTamil = entry.tamilDefinition.toLowerCase().includes(q);
        const matchesEngDef = entry.englishDefinition.toLowerCase().includes(q);
        const matchesTag = entry.tags.some((t) => t.toLowerCase().includes(q));
        const matchesSyn = entry.synonyms.some((s) => s.toLowerCase().includes(q));
        const matchesAnt = entry.antonyms.some((a) => a.toLowerCase().includes(q));

        return (
          matchesWord ||
          matchesTamil ||
          matchesEngDef ||
          matchesTag ||
          matchesSyn ||
          matchesAnt
        );
      }

      return true;
    });

    return entries.sort((a, b) => a.word.localeCompare(b.word));
  }, [searchQuery, selectedLetter, selectedTag]);

  const handleClearAllFilters = () => {
    setSearchQuery('');
    setSelectedLetter(null);
    setSelectedTag(null);
  };

  return (
    <div className="min-h-screen bg-[#050505] text-stone-100 font-sans flex flex-col selection:bg-teal-500/20 selection:text-teal-200">
      {/* Top Header & Navigation */}
      <Header
        onLogoClick={() => {
          setActiveTab('dictionary');
          window.scrollTo({ top: 0, behavior: 'smooth' });
        }}
      />

      {/* Main Container */}
      <main className="flex-1 max-w-7xl w-full mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 pb-24">
        {activeTab === 'dictionary' && (
          <div>
            {/* A–Z Index Selector */}
            <AZSelector
              selectedLetter={selectedLetter}
              onSelectLetter={setSelectedLetter}
              letterCounts={letterCounts}
            />

            {/* Search and Filters Bar */}
            <FilterBar
              searchQuery={searchQuery}
              setSearchQuery={setSearchQuery}
              selectedTag={selectedTag}
              setSelectedTag={setSelectedTag}
              onClearAll={handleClearAllFilters}
            />

            {/* Lexicon Vocabulary List */}
            {filteredEntries.length > 0 ? (
              <div className="space-y-4">
                {filteredEntries.map((entry) => (
                  <VocabularyCard
                    key={entry.id}
                    entry={entry}
                    isBookmarked={bookmarkedIds.includes(entry.id)}
                    onToggleBookmark={toggleBookmark}
                    onSelectTerm={handleSelectTerm}
                  />
                ))}
              </div>
            ) : (
              /* Fallback when term not in core dataset */
              <div className="bg-[#0f0f0f] rounded-xl border border-stone-800 shadow-md p-6 text-center space-y-4 my-6">
                <AlertCircle className="w-10 h-10 text-teal-400 mx-auto" />
                <h3 className="text-lg font-serif font-bold text-stone-200">
                  No match found in primary lexicon
                </h3>
                <p className="text-stone-400 text-xs max-w-sm mx-auto leading-relaxed">
                  Click below to view a detailed English-Tamil explanation for "{searchQuery}".
                </p>
                <div className="flex flex-wrap justify-center gap-2 pt-1.5">
                  <button
                    onClick={() => handleSelectTerm(searchQuery)}
                    className="px-4 py-2 bg-teal-300 text-stone-950 rounded-lg text-xs font-bold hover:bg-teal-200 shadow-sm cursor-pointer min-h-[38px]"
                  >
                    View explanation for "{searchQuery}"
                  </button>
                  <button
                    onClick={handleClearAllFilters}
                    className="px-4 py-2 bg-stone-950 text-stone-300 border border-stone-850 hover:bg-stone-900 rounded-lg text-xs font-semibold transition-colors cursor-pointer min-h-[38px]"
                  >
                    Clear all filters
                  </button>
                </div>
              </div>
            )}
          </div>
        )}

        {activeTab === 'flashcards' && (
          <FlashcardsView
            entries={LEXICON_DATA}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
          />
        )}

        {activeTab === 'quiz' && <QuizView entries={LEXICON_DATA} />}

        {activeTab === 'bookmarks' && (
          <BookmarksView
            allEntries={LEXICON_DATA}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onSelectTerm={handleSelectTerm}
            onClearAllBookmarks={handleClearAllBookmarks}
          />
        )}

        {activeTab === 'daily' && (
          <DailyWordView
            entries={LEXICON_DATA}
            bookmarkedIds={bookmarkedIds}
            onToggleBookmark={toggleBookmark}
            onSelectTerm={handleSelectTerm}
          />
        )}
      </main>

      {/* Modal Overlay for Synonyms / Antonyms / Term Lookups */}
      <TermDetailModal
        entry={modalEntry}
        onClose={() => setModalEntry(null)}
        isBookmarked={modalEntry ? bookmarkedIds.includes(modalEntry.id) : false}
        onToggleBookmark={toggleBookmark}
        onSelectTerm={handleSelectTerm}
      />

      {/* Footer */}
      <footer className="bg-[#080808] text-stone-400 border-t border-stone-900 py-6 px-4 text-center mt-8 pb-28">
        <div className="max-w-7xl mx-auto space-y-1.5">
          <p className="text-xs font-serif text-teal-300 font-bold">
            Pulamai Lexicon — English &amp; Tamil Reference
          </p>
          <p className="text-[10px] text-stone-500 max-w-md mx-auto leading-relaxed">
            A scholarly bilingual reference dedicated to preserving the dignity and eloquence of Tamil translation and English literary prose.
          </p>
          <p className="text-[10px] text-stone-600 pt-1">
            © {new Date().getFullYear()} Pulamai Lexicon.
          </p>
        </div>
      </footer>

      {/* Floating Bottom Glass Navigation Dock */}
      <BottomNavigation
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        bookmarkCount={bookmarkedIds.length}
      />
    </div>
  );
}
