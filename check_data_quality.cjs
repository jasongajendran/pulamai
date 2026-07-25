const fs = require('fs');
const path = './src/data/lexiconData.ts';
const content = fs.readFileSync(path, 'utf8');
const tempPath = './temp_check.cjs';
let code = content.replace(/import\s+[^;]+;/g, '').replace(/export\s+const\s+LEXICON_DATA\s*=\s*/, 'module.exports = ');
fs.writeFileSync(tempPath, code);
const data = require(tempPath);
fs.unlinkSync(tempPath);

const emptySynonyms = data.filter(e => e.synonyms.length === 0).length;
const emptyAntonyms = data.filter(e => e.antonyms.length === 0).length;
console.log(`Entries with empty synonyms: ${emptySynonyms}`);
console.log(`Entries with empty antonyms: ${emptyAntonyms}`);
