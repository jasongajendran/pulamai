export type DifficultyLevel = 'Moderate' | 'Advanced' | 'Literary';

export type CategoryTag =
  | 'Literature'
  | 'Philosophy'
  | 'Politics'
  | 'Science'
  | 'Formal Speech'
  | 'Arts & Culture'
  | 'Ethics & Society'
  | 'Poetics & Rhetoric'
  | 'Theology & Religion'
  | 'Biblical Studies';

export interface ContextExample {
  english: string;
  tamil: string;
  sourceNote?: string;
}

export interface VocabularyEntry {
  id: string;
  word: string;
  partOfSpeech: string; // e.g. "adj.", "noun", "verb", "adv."
  difficulty: DifficultyLevel;
  tags: CategoryTag[];
  englishDefinition: string;
  tamilDefinition: string; // தமிழாக்கம்
  literaryContext: ContextExample; // இலக்கிய / கட்டுரை பயன்பாடு
  formalSpeechContext: ContextExample; // சொற்பொழிவு / உரையாடல் பயன்பாடு
  synonyms: string[];
  antonyms: string[];
}

export interface QuizQuestion {
  id: string;
  type: 'en-to-ta' | 'ta-to-en';
  questionWord: string;
  correctAnswer: string;
  options: string[];
  explanation: string;
  tamilTranslation: string;
  entryId: string;
}
