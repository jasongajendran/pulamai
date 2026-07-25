const fs = require('fs');

const letters = ['A','B','C','D','E','F','G','H','I','J','K','L','M','N','O','P','Q','R','S','T','U','V','W','X','Y','Z'];

// Let's create a dictionary of 20 distinct intermediate words for each letter A-Z with complete fields.
const letterData = {
  A: [
    { id: "adaptable", word: "Adaptable", pos: "adj", def: "Able to adjust to new conditions.", tamil: "தகவமைத்துக் கொள்ளக்கூடிய", lit: "She proved adaptable during the crisis.", litTa: "நெருக்கடியின் போது அவள் தகவமைத்துக் கொண்டாள்.", form: "Teams must be adaptable to change.", formTa: "குழுக்கள் மாற்றத்திற்கு ஏற்ப தகவமைத்துக்கொள்ள வேண்டும்.", syn: ["flexible"], ant: ["rigid"] },
    { id: "ambitious", word: "Ambitious", pos: "adj", def: "Having a strong desire for success.", tamil: "உயர் லட்சியம் கொண்ட", lit: "His ambitious plan succeeded.", litTa: "அவரது லட்சியத் திட்டம் வெற்றி பெற்றது.", form: "We have ambitious goals.", formTa: "எங்களிடம் உயர் லட்சிய இலக்குகள் உள்ளன.", syn: ["driven"], ant: ["lazy"] },
    { id: "amiable", word: "Amiable", pos: "adj", def: "Friendly and pleasant.", tamil: "நட்பான", lit: "The amiable host greeted everyone.", litTa: "நட்பான விருந்தளிப்பவர் அனைவரையும் வரவேற்றார்.", form: "An amiable demeanor builds trust.", formTa: "நட்பான தோற்றம் நம்பிக்கையை உருவாக்குகிறது.", syn: ["cordial"], ant: ["hostile"] },
    { id: "allocate", word: "Allocate", pos: "verb", def: "Distribute resources for a purpose.", tamil: "ஒதுக்கீடு செய்தல்", lit: "Funds were allocated for research.", litTa: "ஆராய்ச்சிக்காக நிதி ஒதுக்கப்பட்டது.", form: "We must allocate time wisely.", formTa: "நாங்கள் நேரத்தை புத்திசாலித்தனமாக ஒதுக்க வேண்டும்.", syn: ["assign"], ant: ["retain"] },
    { id: "authentic", word: "Authentic", pos: "adj", def: "Genuine and of undisputed origin.", tamil: "உண்மையான", lit: "The document is authentic.", litTa: "ஆவணம் உண்மையானது.", form: "Verify authentic sources.", formTa: "உண்மையான ஆதாரங்களை சரிபார்க்கவும்.", syn: ["real"], ant: ["fake"] },
    { id: "advocate", word: "Advocate", pos: "noun", def: "A public supporter of a cause.", tamil: "ஆதரவாளர்", lit: "She is an advocate for peace.", litTa: "அவள் அமைதிக்கான ஆதரவாளர்.", form: "Advocate for fair policies.", formTa: "நியாயமான கொள்கைகளுக்காக வாதிடுங்கள்.", syn: ["champion"], ant: ["opponent"] },
    { id: "abundance", word: "Abundance", pos: "noun", def: "A very large quantity.", tamil: "மிகுதி", lit: "An abundance of caution.", litTa: "மிகுதியான எச்சரிக்கை.", form: "Resources exist in abundance.", formTa: "வளங்கள் மிகுதியாக உள்ளன.", syn: ["plenty"], ant: ["scarcity"] },
    { id: "appease", word: "Appease", pos: "verb", def: "Pacify by acceding to demands.", tamil: "சமாதானப்படுத்துதல்", lit: "Efforts to appease the critics.", litTa: "விமர்சகர்களைச் சமாதானப்படுத்தும் முயற்சிகள்.", form: "Negotiations appease tensions.", formTa: "பேச்சுவார்த்தைகள் பதட்டங்களைச் சமாதானப்படுத்துகின்றன.", syn: ["pacify"], ant: ["provoke"] },
    { id: "astute", word: "Astute", pos: "adj", def: "Showing accurate assessment.", tamil: "விவேகமான", lit: "An astute observation.", litTa: "ஒரு விவேகமான கவனிப்பு.", form: "Astute business decisions.", formTa: "விவேகமான வணிக முடிவுகள்.", syn: ["shrewd"], ant: ["naive"] },
    { id: "audacious", word: "Audacious", pos: "adj", def: "Showing bold risks.", tamil: "துணிச்சலான", lit: "An audacious rescue mission.", litTa: "ஒரு துணிச்சலான மீட்புப் பணி.", form: "Audacious innovation.", formTa: "துணிச்சலான புதுமை.", syn: ["bold"], ant: ["timid"] },
    { id: "anomaly", word: "Anomaly", pos: "noun", def: "Something that deviates from normal.", tamil: "விதிவிலக்கு", lit: "A statistical anomaly.", litTa: "புள்ளிவிவர முரண்பாடு.", form: "Check for any anomaly.", formTa: "ஏதேனும் முரண்பாடு உள்ளதா என சோதிக்கவும்.", syn: ["irregularity"], ant: ["normality"] },
    { id: "alleviate", word: "Alleviate", pos: "verb", def: "Make suffering less severe.", tamil: "தணித்தல்", lit: "Medicine to alleviate pain.", litTa: "வலியைத் தணிக்க மருந்து.", form: "Policies to alleviate poverty.", formTa: "வறுமையைக் குறைக்க கொள்கைகள்.", syn: ["ease"], ant: ["worsen"] },
    { id: "aesthetic", word: "Aesthetic", pos: "adj", def: "Concerned with beauty.", tamil: "அழகுியல் தொடர்பான", lit: "Aesthetic appreciation.", litTa: "அழகுியல் பாராட்டு.", form: "Aesthetic design principles.", formTa: "அழகுியல் வடிவமைப்பு கொள்கைகள்.", syn: ["artistic"], ant: ["plain"] },
    { id: "aspire", word: "Aspire", pos: "verb", def: "Direct ambitions toward goals.", tamil: "இலட்சியமாகக் கொள்ளுதல்", lit: "Aspire to greatness.", litTa: "சிறப்பை இலட்சியமாகக் கொள்ளுங்கள்.", form: "Students aspire to succeed.", formTa: "மாணவர்கள் வெற்றிபெற விரும்புகிறார்கள்.", syn: ["strive"], ant: ["despair"] },
    { id: "assert", word: "Assert", pos: "verb", def: "State forcefully.", tamil: "உறுதியாகக் கூறுதல்", lit: "Assert one's rights.", litTa: "ஒருவரின் உரிமைகளை நிலைநாட்டுக.", form: "Assert leadership.", formTa: "தலைமையை நிலைநாட்டுக.", syn: ["declare"], ant: ["deny"] },
    { id: "anonymous", word: "Anonymous", pos: "adj", def: "Of unknown name.", tamil: "அடையாளம் தெரியாத", lit: "An anonymous letter.", litTa: "அடையாளம் தெரியாத கடிதம்.", form: "Anonymous feedback.", formTa: "பெயரிடப்படாத கருத்து.", syn: ["unnamed"], ant: ["named"] },
    { id: "articulative", word: "Articulative", pos: "adj", def: "Expressing clearly.", tamil: "தெளிவாக வெளிப்படுத்தும்", lit: "An articulative speaker.", litTa: "தெளிவாகப் பேசும் பேச்சாளர்.", form: "Articulative arguments.", formTa: "தெளிவான வாதங்கள்.", syn: ["clear"], ant: ["vague"] },
    { id: "altruistic", word: "Altruistic", pos: "adj", def: "Selfless concern for others.", tamil: "சுயநலமற்ற", lit: "Altruistic service.", litTa: "சுயநலமற்ற சேவை.", form: "Altruistic initiatives.", formTa: "சுயநலமற்ற முயற்சிகள்.", syn: ["selfless"], ant: ["selfish"] },
    { id: "augment", word: "Augment", pos: "verb", def: "Increase by adding.", tamil: "பெருக்குதல்", lit: "Augment income.", litTa: "வருமானத்தைப் பெருக்குதல்.", form: "Augment capacity.", formTa: "திறனை அதிகரித்தல்.", syn: ["increase"], ant: ["reduce"] },
    { id: "apprehend", word: "Apprehend", pos: "verb", def: "Arrest or understand.", tamil: "கைது செய்தல் / புரிந்து கொள்ளுதல்", lit: "Police apprehended the suspect.", litTa: "போலீசார் சந்தேக நபரை கைது செய்தனர்.", form: "Apprehend complex ideas.", formTa: "சிக்கலான யோசனைகளைப் புரிந்துகொள்ளுதல்.", syn: ["capture"], ant: ["release"] }
  ]
};

// Let's generate programmatic 20 words for letters B through Z so every single letter has 20 high quality intermediate words.
for (const char of letters) {
  if (char === 'A') continue;
  const list = [];
  for (let i = 1; i <= 20; i++) {
    const wordBase = `${char.toLowerCase()}word${i}`;
    // Let's create realistic words for each letter to ensure variety
    // Or even better, let's define specific real intermediate words for each letter.
  }
}

console.log("Script template ready");
