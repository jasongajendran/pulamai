const fs = require('fs');
const path = './src/data/lexiconData.ts';

const content = fs.readFileSync(path, 'utf8');
const tempPath = './temp_lexicon.cjs';
let code = content
  .replace(/import\s+[^;]+;/g, '')
  .replace(/export\s+const\s+LEXICON_DATA:\s*VocabularyEntry\[\]\s*=\s*/, 'module.exports = ');
fs.writeFileSync(tempPath, code);
const data = require(tempPath);
fs.unlinkSync(tempPath);

const existingIds = new Set(data.map(d => d.id.toLowerCase()));
const existingWords = new Set(data.map(d => d.word.toLowerCase()));

// Let's define 20 real, high-quality moderate/intermediate words for each letter A-Z
const alphabetPool = {
  A: [
    {id: "adapt", word: "Adapt", pos: "verb", diff: "Moderate", tags: ["General"], def: "To adjust to new conditions or environments.", tamil: "தகவமைத்துக் கொள்ளுதல்", lit: "Organisms must adapt to survive.", litTa: "உயிரினங்கள் உயிர்வாழ தகவமைத்துக் கொள்ள வேண்டும்.", form: "We need to adapt our strategy.", formTa: "நமது மூலோபாயத்தை நாம் தகவமைக்க வேண்டும்.", syn: ["adjust"], ant: ["resist"] },
    {id: "admire", word: "Admire", pos: "verb", diff: "Moderate", tags: ["General"], def: "To regard with respect or warm approval.", tamil: "பாராட்டுதல் / வியத்தல்", lit: "I admire her dedication.", litTa: "அவளது அர்ப்பணிப்பை நான் பாராட்டுகிறேன்.", form: "We admire professional excellence.", formTa: "தொழில்முறை சிறப்பை நாங்கள் பாராட்டுகிறோம்.", syn: ["respect"], ant: ["despise"] },
    {id: "afford", word: "Afford", pos: "verb", diff: "Moderate", tags: ["General"], def: "To have enough money or time for something.", tamil: "வசதி பெறுதல் / இயலுதல்", lit: "They could afford a new home.", litTa: "அவர்களால் புதிய வீடு வாங்க இயன்றது.", form: "We cannot afford delays.", formTa: "எங்களால் தாமதங்களைத் தாங்க முடியாது.", syn: ["manage"], ant: ["lack"] },
    {id: "aim", word: "Aim", pos: "noun", diff: "Moderate", tags: ["General"], def: "A purpose or intention.", tamil: "குறிக்கோள்", lit: "His primary aim was education.", litTa: "அவரது முக்கிய குறிக்கோள் கல்வி.", form: "Our aim is clarity.", formTa: "எங்கள் குறிக்கோள் தெளிவு.", syn: ["goal"], ant: ["aimlessness"] },
    {id: "alert", word: "Alert", pos: "adj", diff: "Moderate", tags: ["General"], def: "Quick to notice any unusual and potentially dangerous or difficult circumstances.", tamil: "விழிப்புடன் கூடிய", lit: "The guard remained alert all night.", litTa: "காவலாளி இரவு முழுவதும் விழிப்புடன் இருந்தார்.", form: "Stay alert online.", formTa: "இணையத்தில் விழிப்புடன் இருங்கள்.", syn: ["watchful"], ant: ["dormant"] },
    {id: "allow", word: "Allow", pos: "verb", diff: "Moderate", tags: ["General"], def: "To give permission for something.", tamil: "அனுமதித்தல்", lit: "The rules allow parking here.", litTa: "விதிகள் இங்கு நிறுத்த அனுமதிக்கின்றன.", form: "Please allow us to assist.", formTa: "எங்களுக்கு உதவ அனுமதிக்கவும்.", syn: ["permit"], ant: ["forbid"] },
    {id: "alter", word: "Alter", pos: "verb", diff: "Moderate", tags: ["General"], def: "To change or cause to change in character or composition.", tamil: "மாற்றுதல்", lit: "Plans were altered due to weather.", litTa: "வானிலை காரணமாக திட்டங்கள் மாற்றப்பட்டன.", form: "Do not alter original files.", formTa: "அசல் கோப்புகளை மாற்ற வேண்டாம்.", syn: ["modify"], ant: ["preserve"] },
    {id: "amuse", word: "Amuse", pos: "verb", diff: "Moderate", tags: ["General"], def: "To provide entertainment or occupy pleasantly.", tamil: "மகிழ்ச்சியூட்டுதல்", lit: "The story amused the children.", litTa: "கதை குழந்தைகளை மகிழ்வித்தது.", form: "Jokes can amuse audiences.", formTa: "நகைச்சுவைகள் பார்வையாளர்களை மகிழ்விக்கலாம்.", syn: ["entertain"], ant: ["bore"] },
    {id: "analyze", word: "Analyze", pos: "verb", diff: "Moderate", tags: ["Science"], def: "To examine methodically and in detail.", tamil: "ஆராய்ந்து பகுத்தல்", lit: "Scientists analyze data carefully.", litTa: "விஞ்ஞானிகள் தரவுகளை கவனமாகப் பகுப்பாய்வு செய்கிறார்கள்.", form: "Analyze market trends.", formTa: "சந்தை போக்குகளை பகுப்பாய்வு செய்யவும்.", syn: ["examine"], ant: ["guess"] },
    {id: "announce", word: "Announce", pos: "verb", diff: "Moderate", tags: ["General"], def: "To make a public and formal declaration.", tamil: "அறிவித்தல்", lit: "The winner was announced.", litTa: "வெற்றியாளர் அறிவிக்கப்பட்டார்.", form: "Announce new features.", formTa: "புதிய அம்சங்களை அறிவிக்கவும்.", syn: ["proclaim"], ant: ["conceal"] },
    {id: "annual", word: "Annual", pos: "adj", diff: "Moderate", tags: ["General"], def: "Occurring once every year.", tamil: "ஆண்டுதோறும் நிகழும்", lit: "Their annual conference.", litTa: "அவர்களது வருடாந்திர மாநாடு.", form: "Annual reports are due.", formTa: "ஆண்டு அறிக்கைகள் சமர்ப்பிக்கப்பட வேண்டும்.", syn: ["yearly"], ant: ["daily"] },
    {id: "answer", word: "Answer", pos: "verb", diff: "Moderate", tags: ["General"], def: "To respond to a question.", tamil: "பதிலளித்தல்", lit: "She answered correctly.", litTa: "அவள் சரியாக பதிலளித்தாள்.", form: "Please answer inquiries promptly.", formTa: " விசாரணைகளுக்கு உடனடியாக பதிலளிக்கவும்.", syn: ["reply"], ant: ["ignore"] },
    {id: "anxious", word: "Anxious", pos: "adj", diff: "Moderate", tags: ["General"], def: "Experiencing worry, unease, or nervousness.", tamil: "கவலை கொள்ளும்", lit: "He was anxious about results.", litTa: "அவர் முடிவுகள் குறித்து கவலையாக இருந்தார்.", form: "Avoid anxious thoughts.", formTa: "கவலை நிறைந்த எண்ணங்களைத் தவிர்க்கவும்.", syn: ["worried"], ant: ["calm"] },
    {id: "apologize", word: "Apologize", pos: "verb", diff: "Moderate", tags: ["General"], def: "To express regret for something one has done.", tamil: "மன்னிப்புக் கேட்டல்", lit: "He apologized for the delay.", litTa: "தாமதத்திற்கு அவர் மன்னிப்பு கேட்டார்.", form: "Always apologize when wrong.", formTa: "தவறு செய்யும் போது எப்போதும் மன்னிப்பு கேளுங்கள்.", syn: ["regret"], ant: ["blame"] },
    {id: "appeal", word: "Appeal", pos: "noun", diff: "Moderate", tags: ["Legal"], def: "A serious or heartfelt request.", tamil: "முறையீடு / ஈர்ப்பு", lit: "The judge denied the appeal.", litTa: "நீதிபதி முறையீட்டை நிராகரித்தார்.", form: "The design has wide appeal.", formTa: "இந்த வடிவமைப்பு பரவலான ஈர்ப்பைக் கொண்டுள்ளது.", syn: ["plea"], ant: ["rejection"] },
    {id: "apply", word: "Apply", pos: "verb", diff: "Moderate", tags: ["General"], def: "To make a formal application or put to use.", tamil: "விண்ணப்பித்தல் / பயன்படுத்துதல்", lit: "Apply for the position.", litTa: "பதவிக்கு விண்ணப்பிக்கவும்.", form: "Apply theory to practice.", formTa: "கோட்பாட்டை நடைமுறைக்குப் பயன்படுத்துங்கள்.", syn: ["utilize"], ant: ["neglect"] },
    {id: "appoint", word: "Appoint", pos: "verb", diff: "Moderate", tags: ["General"], def: "To assign a job or role.", tamil: "நியமித்தல்", lit: "She was appointed director.", litTa: "அவள் இயக்குநராக நியமிக்கப்பட்டாள்.", form: "Appoint committee members.", formTa: "குழு உறுப்பினர்களை நியமிக்கவும்.", syn: ["assign"], ant: ["dismiss"] },
    {id: "appreciate", word: "Appreciate", pos: "verb", diff: "Moderate", tags: ["General"], def: "To recognize the full worth of.", tamil: "மதிப்பளித்தல் / பாராட்டுதல்", lit: "I appreciate your help.", litTa: "உங்கள் உதவியை நான் பாராட்டுகிறேன்.", form: "Appreciate art and music.", formTa: "கலையையும் இசையையும் மதிக்கவும்.", syn: ["value"], ant: ["scorn"] },
    {id: "approach", word: "Approach", pos: "verb", diff: "Moderate", tags: ["General"], def: "To come near or nearer to.", tamil: "அணுகுதல்", lit: "Winter is approaching.", litTa: "குளிர்காலம் நெருங்குகிறது.", form: "Approach problems calmly.", formTa: "பிரச்சனைகளை அமைதியாக அணுகுங்கள்.", syn: ["near"], ant: ["retreat"] },
    {id: "approve", word: "Approve", pos: "verb", diff: "Moderate", tags: ["General"], def: "To officially agree to or accept.", tamil: "ஒப்புதல் அளித்தல்", lit: "The board approved the budget.", litTa: "வாரியம் பட்ஜெட்டுக்கு ஒப்புதல் அளித்தது.", form: "Approve requested changes.", formTa: "கோரப்பட்ட மாற்றங்களை அங்கீகரிக்கவும்.", syn: ["endorse"], ant: ["reject"] }
  ]
};

console.log("Alphabet pool ready");
