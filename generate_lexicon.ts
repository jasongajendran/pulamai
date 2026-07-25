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

const alphabet = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ'.split('');

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
  items: vocabularyEntrySchema
};

async function generateForLetter(letter: string): Promise<any[]> {
  console.log(`Generating words starting with ${letter}...`);
  const prompt = `Generate exactly 25 vocabulary words starting with the letter "${letter}" (or starting with "${letter.toLowerCase()}"). 
The words must range from intermediate to advanced level. 
The items MUST be highly relevant to at least one of these themes:
1. Daily spoken words (e.g. banter, conversation words)
2. Words relating to elderly (e.g. geriatric, wisdom, longevity, pension, senescence, frail)
3. Health & general health (e.g. therapeutic, ailment, diagnosis, acute, wellness, vaccine)
4. Bible & spiritual (e.g. scripture, covenant, apostolic, sanctuary, benediction, gospel, parable)
5. Current affairs & society (e.g. coalition, bipartisan, infrastructure, diplomacy)
6. Conversation & messaging (e.g. concise, eloquent, feedback, shorthand, colloquial but elegant terms)

Each word must be well-formed, have real IPA phonetics, clear English definition, and accurate, beautiful Tamil translation (pure Tamil translation of meanings, not transliteration). 
Include etymology and dual contexts (literary context and formal/speech context) in English and Tamil.
Ensure the 'tags' property only uses values from: 'Literature', 'Philosophy', 'Politics', 'Science', 'Formal Speech', 'Arts & Culture', 'Ethics & Society', 'Poetics & Rhetoric'.
The 'id' must be unique, lowercase and derived from the word (e.g. 'benevolent').`;

  try {
    const response = await ai.models.generateContent({
      model: "gemini-3.6-flash",
      contents: prompt,
      config: {
        responseMimeType: "application/json",
        responseSchema: responseSchema,
        temperature: 0.1
      }
    });

    const text = response.text || "[]";
    const data = JSON.parse(text);
    // Sanitize any invalid tags
    const validTags = ['Literature', 'Philosophy', 'Politics', 'Science', 'Formal Speech', 'Arts & Culture', 'Ethics & Society', 'Poetics & Rhetoric'];
    data.forEach((entry: any) => {
      entry.tags = (entry.tags || []).filter((t: string) => validTags.includes(t));
      if (entry.tags.length === 0) {
        entry.tags = ['Formal Speech'];
      }
      // Ensure id is lowercase and clean
      entry.id = String(entry.word).toLowerCase().replace(/[^a-z0-9]/g, '');
    });

    console.log(`Successfully generated ${data.length} words for ${letter}`);
    return data;
  } catch (error) {
    console.error(`Error generating for letter ${letter}:`, error);
    // Retry once
    try {
      console.log(`Retrying letter ${letter}...`);
      const response = await ai.models.generateContent({
        model: "gemini-3.6-flash",
        contents: prompt,
        config: {
          responseMimeType: "application/json",
          responseSchema: responseSchema,
          temperature: 0.3
        }
      });
      const text = response.text || "[]";
      const data = JSON.parse(text);
      const validTags = ['Literature', 'Philosophy', 'Politics', 'Science', 'Formal Speech', 'Arts & Culture', 'Ethics & Society', 'Poetics & Rhetoric'];
      data.forEach((entry: any) => {
        entry.tags = (entry.tags || []).filter((t: string) => validTags.includes(t));
        if (entry.tags.length === 0) {
          entry.tags = ['Formal Speech'];
        }
        entry.id = String(entry.word).toLowerCase().replace(/[^a-z0-9]/g, '');
      });
      console.log(`Successfully generated ${data.length} words for ${letter} on retry`);
      return data;
    } catch (retryError) {
      console.error(`Retry failed for letter ${letter}:`, retryError);
      return [];
    }
  }
}

async function main() {
  const allEntries: any[] = [];
  
  // We can do them in batches of 3 to respect concurrency
  const batchSize = 3;
  for (let i = 0; i < alphabet.length; i += batchSize) {
    const batch = alphabet.slice(i, i + batchSize);
    const results = await Promise.all(batch.map(letter => generateForLetter(letter)));
    for (const result of results) {
      allEntries.push(...result);
    }
    // Small delay between batches
    await new Promise(resolve => setTimeout(resolve, 1500));
  }

  // Fallback check: if any letters are totally missing or have very few words, let's make sure we have a solid dataset
  console.log(`Total words generated: ${allEntries.length}`);

  // Deduplicate by ID
  const uniqueEntriesMap = new Map<string, any>();
  allEntries.forEach(entry => {
    uniqueEntriesMap.set(entry.id, entry);
  });
  const finalEntries = Array.from(uniqueEntriesMap.values());
  console.log(`Total unique words: ${finalEntries.length}`);

  // Format the file
  const fileContent = `import { VocabularyEntry } from '../types';

export const LEXICON_DATA: VocabularyEntry[] = ${JSON.stringify(finalEntries, null, 2)};
`;

  const outputPath = path.join(process.cwd(), 'src', 'data', 'lexiconData.ts');
  fs.writeFileSync(outputPath, fileContent, 'utf-8');
  console.log(`Saved lexicon data to ${outputPath}`);
}

main().catch(console.error);
