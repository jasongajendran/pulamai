# Pulamai Lexicon (புலமை சொற்களஞ்சியம்)

A responsive, highly polished bilingual English-to-Tamil vocabulary and literary expression application designed for scholars, literature enthusiasts, writers, public speakers, and avid readers.

---

## 🌟 Key Features

1. **A–Z Index & Dynamic Filtering**:
   - Interactive A–Z letter bar for fast alphabet navigation.
   - Filter words by difficulty levels (*Moderate*, *Advanced*, *Literary*) and domain tags (*Literature*, *Philosophy*, *Politics*, *Science*, *Formal Speech*, *Arts & Culture*, *Ethics & Society*, *Poetics & Rhetoric*).
   - Real-time search across English words, Tamil meanings, definitions, and example sentences.
   - Smart fallback mechanism for on-the-fly term explanations if a searched word or clicked synonym/antonym is not in the primary dataset.

2. **Bilingual Vocabulary Entries (English + Tamil)**:
   - **Precise Definitions**: Scholarly English explanation and natural, high-contrast Tamil translations (தமிழாக்கம்).
   - **Dual Context Example Cards**:
     - *Literary & Editorial Context (இலக்கிய / கட்டுரை பயன்பாடு)*
     - *Formal Conversation & Speech Context (சொற்பொழிவு / உரையாடல் பயன்பாடு)*
   - **Clickable Synonyms & Antonyms**: Instant lookup cards for related vocabulary.
   - **Curated Lexicon**: A diverse, curated vocabulary suitable for lifelong learners, including terms familiar and relevant to the 50–75 age demographic.

3. **Audio Pronunciation & Bookmarks**:
   - **Speech Synthesis (TTS)**: Built-in browser text-to-speech engine to hear standard English pronunciation.
   - **LocalStorage Bookmarking**: Save favorite vocabulary for daily review, with export/copy capabilities.

4. **Interactive Flashcards**:
   - Interactive flip-cards displaying the English term on the front and full Tamil meaning + dual context examples on the back.
   - Filter flashcards by all terms or bookmarked items, with shuffle controls.

5. **Quiz Mode (அறிவுத்திறன் தேர்வு)**:
   - Multiple choice tests covering English-to-Tamil and Tamil-to-English vocabulary retention.
   - Instant visual feedback: Correct answer highlighted, and detailed explanations provided for why both correct and incorrect choices were made.
   - Final score summary.

6. **Daily Featured Word (இன்றைய சிறப்புச் சொல்)**:
   - Highlighted daily literary word for continuous scholarly learning.

---

## 🚀 Local Development Setup

To run Pulamai Lexicon locally on your system:

### 1. Install Dependencies
```bash
npm install
```

### 2. Start Development Server
```bash
npm run dev
```
The application will launch on `http://localhost:3000`.

### 3. Run Typecheck & Linter
```bash
npm run lint
```

### 4. Build for Production
```bash
npm run build
```

---

## ⚙️ GitHub Pages Deployment Setup

This project includes a `.github/workflows/deploy.yml` workflow configured for automated deployment to GitHub Pages.

### Important: Required Permissions Setup

To ensure GitHub Actions can successfully deploy your site, complete these two settings in your GitHub repository:

1. **Enable Workflow Write Permissions**:
   - Navigate to your repository on GitHub.
   - Go to **Settings** → **Actions** → **General**.
   - Scroll down to **Workflow permissions**.
   - Select **Read and write permissions**.
   - Click **Save**.

2. **Set Pages Source to GitHub Actions**:
   - Go to **Settings** → **Pages**.
   - Under **Build and deployment** → **Source**, select **GitHub Actions**.

Whenever you push changes to the `main` or `master` branch, GitHub Actions will automatically verify TypeScript types, build the bundle, and publish the site.
