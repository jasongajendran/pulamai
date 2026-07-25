const fs = require('fs');
const path = './src/data/lexiconData.ts';
const content = fs.readFileSync(path, 'utf8');
const tempPath = './temp_lexicon.cjs';
let code = content.replace(/import\s+[^;]+;/g, '').replace(/export\s+const\s+LEXICON_DATA\s*=\s*/, 'module.exports = ');
fs.writeFileSync(tempPath, code);
const data = require(tempPath);
fs.unlinkSync(tempPath);

data.forEach((entry, index) => {
  entry.id = `${entry.word.toLowerCase()}-${index}`;
});

const newContent = `import { VocabularyEntry } from '../types';\n\nexport const LEXICON_DATA = ${JSON.stringify(data, null, 2)};\n`;
fs.writeFileSync(path, newContent);
console.log("Added unique IDs to all lexicon entries.");
