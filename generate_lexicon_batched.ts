import { GoogleGenAI, Type } from "@google/genai";
import * as fs from "fs";
import * as path from "path";
import dotenv from "dotenv";

dotenv.config();

const apiKey = process.env.GEMINI_API_KEY;
if (!apiKey) {
  console.error("GEMINI_API_KEY environment variable is required");
  process.exit(1);
}

const ai = new GoogleGenAI({
  apiKey: apiKey,
  httpOptions: {
    headers: {
      'User-Agent': 'aistudio-build',
    }
  }
});

const cacheFilePath = path.join(process.cwd(), 'vocab_cache.json');

// Initialize cache
let cache: Record<string, any[]> = {};
if (fs.existsSync(cacheFilePath)) {
  try {
    cache = JSON.parse(fs.readFileSync(cacheFilePath, 'utf-8'));
    console.log(`Loaded cached vocabulary. Cached letters: ${Object.keys(cache).filter(k => cache[k] && cache[k].length >= 25).join(', ')}`);
  } catch (e) {
    cache = {};
  }
}

const vocabularyEntrySchema = {
  type: Type.OBJECT,
  properties: {
    id: { type: Type.STRING },
    word: { type: Type.STRING },
    phonetic: { type: Type.STRING },
    partOfSpeech: { type: Type.STRING },
    difficulty: { type: Type.STRING, enum: ['Moderate', 'Advanced', 'Literary'] },
    tags: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    englishDefinition: { type: Type.STRING },
    tamilDefinition: { type: Type.STRING },
    etymology: {
      type: Type.OBJECT,
      properties: {
        origin: { type: Type.STRING },
        tamilEquivNote: { type: Type.STRING }
      },
      required: ['origin', 'tamilEquivNote']
    },
    literaryContext: {
      type: Type.OBJECT,
      properties: {
        english: { type: Type.STRING },
        tamil: { type: Type.STRING },
        sourceNote: { type: Type.STRING }
      },
      required: ['english', 'tamil', 'sourceNote']
    },
    formalSpeechContext: {
      type: Type.OBJECT,
      properties: {
        english: { type: Type.STRING },
        tamil: { type: Type.STRING },
        sourceNote: { type: Type.STRING }
      },
      required: ['english', 'tamil', 'sourceNote']
    },
    synonyms: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    },
    antonyms: {
      type: Type.ARRAY,
      items: { type: Type.STRING }
    }
  },
  required: [
    'id', 'word', 'phonetic', 'partOfSpeech', 'difficulty', 'tags',
    'englishDefinition', 'tamilDefinition', 'etymology', 'literaryContext',
    'formalSpeechContext', 'synonyms', 'antonyms'
  ]
};

const responseSchema = {
  type: Type.ARRAY,
  items: {
    type: Type.OBJECT,
    properties: {
      letter: { type: Type.STRING },
      words: {
        type: Type.ARRAY,
        items: vocabularyEntrySchema
      }
    },
    required: ['letter', 'words']
  }
};

function cleanJsonText(text: string): string {
  let clean = text.trim();
  if (clean.startsWith('```')) {
    clean = clean.replace(/^```(json)?/, '').replace(/```$/, '').trim();
  }
  return clean;
}

async function generateBatch(letters: string[]): Promise<any[]> {
  console.log(`[Batch] Requesting vocabulary for: ${letters.join(', ')}...`);
  const prompt = `Generate exactly 25 vocabulary words for each of the following letters: ${letters.join(', ')}.
For each letter, the words must start with that letter.
The words must range from intermediate to advanced level and be highly relevant to at least one of these themes:
1. Daily spoken words (e.g. conversation, interaction terms)
2. Words relating to elderly (e.g. geriatric, care, longevity, senescence, frail)
3. Health & general health (e.g. therapeutic, ailment, diagnosis, wellness, vaccine)
4. Bible & spiritual (e.g. covenant, sanctuary, benediction, gospel, parable, testament)
5. Current affairs & society (e.g. coalition, bipartisan, infrastructure, diplomacy)
6. Conversation & messaging (e.g. succinct, eloquent, feedback, colloquial or elegant terms)

Each word must have real IPA phonetics, clear English definition, and accurate, beautiful pure Tamil translation (no transliteration).
Include origin/etymology and dual contexts (literary context and formal/conversational speech context) in English and Tamil.
Ensure the 'tags' property only uses values from: 'Literature', 'Philosophy', 'Politics', 'Science', 'Formal Speech', 'Arts & Culture', 'Ethics & Society', 'Poetics & Rhetoric'.
The 'id' must be unique, lowercase and derived from the word.

Return an array where each object has 'letter' and 'words' properties, with exactly 25 items in 'words'.`;

  for (let attempt = 1; attempt <= 3; attempt++) {
    try {
      const response = await ai.models.generateContent({
        model: "gemini-3.5-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.1
        }
      });

      const rawText = response.text || "[]";
      const cleaned = cleanJsonText(rawText);
      const data = JSON.parse(cleaned);

      if (!Array.isArray(data) || data.length === 0) {
        throw new Error("Returned empty or non-array result");
      }

      console.log(`[Batch] Successfully generated batch for ${letters.join(', ')} on attempt ${attempt}`);
      return data;
    } catch (e: any) {
      console.error(`[Batch] Attempt ${attempt} failed for ${letters.join(', ')}: ${e.message}`);
      if (e.message.includes('429')) {
        console.log("Rate limit hit. Sleeping for 30 seconds...");
        await new Promise(resolve => setTimeout(resolve, 30000));
      } else {
        await new Promise(resolve => setTimeout(resolve, 3000));
      }
    }
  }
  throw new Error(`Failed to generate batch for ${letters.join(', ')} after 3 attempts`);
}

async function main() {
  const allAlphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');
  
  // Group alphabet into batches of 5
  const batches: string[][] = [];
  const batchSize = 5;
  
  for (let i = 0; i < allAlphabet.length; i += batchSize) {
    const chunk = allAlphabet.slice(i, i + batchSize);
    // Only include letters that don't already have 25 words in cache
    const missing = chunk.filter(l => !cache[l] || cache[l].length < 25);
    if (missing.length > 0) {
      batches.push(missing);
    }
  }

  console.log(`Total batches to generate: ${batches.length}`);

  for (const batch of batches) {
    try {
      const results = await generateBatch(batch);
      for (const item of results) {
        const letter = item.letter.toUpperCase();
        const words = item.words || [];
        
        // Sanitize and format
        const validTags = ['Literature', 'Philosophy', 'Politics', 'Science', 'Formal Speech', 'Arts & Culture', 'Ethics & Society', 'Poetics & Rhetoric'];
        words.forEach((entry: any) => {
          entry.tags = (entry.tags || []).filter((t: string) => validTags.includes(t));
          if (entry.tags.length === 0) {
            entry.tags = ['Formal Speech'];
          }
          entry.id = String(entry.word).toLowerCase().replace(/[^a-z0-9]/g, '');
        });

        cache[letter] = words;
        console.log(`Saved letter [${letter}] with ${words.length} words to cache`);
      }

      // Save cache file after every successful batch
      fs.writeFileSync(cacheFilePath, JSON.stringify(cache, null, 2), 'utf-8');
      console.log(`Saved batch update to cache. Cache contains: ${Object.keys(cache).join(', ')}`);

      // Sleep a bit between batches
      await new Promise(resolve => setTimeout(resolve, 3000));
    } catch (e: any) {
      console.error(`Stopping run due to batch failure: ${e.message}`);
      process.exit(1);
    }
  }

  // Combine and write the final file
  console.log("Combining all letters from cache...");
  const allEntries: any[] = [];
  for (const letter of allAlphabet) {
    const list = cache[letter] || [];
    allEntries.push(...list);
  }

  // Deduplicate by word ID
  const uniqueMap = new Map<string, any>();
  allEntries.forEach(entry => {
    uniqueMap.set(entry.id, entry);
  });
  const finalEntries = Array.from(uniqueMap.values());
  console.log(`Total unique words combined: ${finalEntries.length}`);

  // Format the file
  const fileContent = `import { VocabularyEntry } from '../types';

export const LEXICON_DATA: VocabularyEntry[] = ${JSON.stringify(finalEntries, null, 2)};
`;

  const outputPath = path.join(process.cwd(), 'src', 'data', 'lexiconData.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`SUCCESS! Saved complete lexicon dataset to ${outputPath}`);
}

main().catch(console.error);
