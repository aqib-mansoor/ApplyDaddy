# ApplyDaddy (Premium Job Application AI) 👑

**"Daddy's got your back. Stop wasting time writing application letters; let Daddy work the magic."**

ApplyDaddy is a high-performance, AI-driven platform designed to help job seekers generate hyper-personalized application responses (Email & WhatsApp) in seconds. Built with a premium "Industrial Modern" aesthetic, it leverages the latest Gemini AI models to turn cold job descriptions into winning pitches.

---

## 🚀 Key Features

### 1. AI Magic Generation ✨
*   **Hyper-Personalized Responses**: Analyzes your profile (skills, experience, education) against a job description to craft custom emails and messages.
*   **Multi-Channel Support**: Generates both a professional Email draft and a direct, high-impact WhatsApp message.
*   **Tone Control**: Choose between *Professional*, *Casual*, or *Enthusiastic* tones to match the company culture.

### 2. Magic Fill (Metadata Extraction) 🔍
*   **Automated Extraction**: Paste a messy job description and let the AI instantly identify the Company Name and Job Title.
*   **Disambiguation**: If multiple roles are found, Daddy presents you with choices to ensure total accuracy.

### 3. Smart History tracker 📊
*   **Status Management**: Track the lifecycle of your applications from *Pending* to *Interview* to *Offer*.
*   **One-Click Actions**: Quick copy buttons for re-using drafts and status selectors to keep your board organized.
*   **Advanced Filtering**: Filter by status or date range (Today, Last 7 Days, Last 30 Days) with relative time display.

### 4. Advanced User Profiles 👤
*   **Centralized Skillset**: Store your professional DNA (Experience, Education, Skills, Bio) which the AI uses as context for every generation.
*   **Privacy First**: Your personal data is stored securely in Firebase and only accessible to you.

### 5. Premium UI/UX 🎨
*   **Industrial Design**: A refined, dark high-contrast theme featuring custom glassmorphism and bento-grid layouts.
*   **Immersive Animations**: Smooth transitions powered by GSAP and Framer Motion, with a Three.js interactive hero background.
*   **Accessibility**: Fully responsive design that feels native on mobile, tablet, and desktop.

---

## 🛠️ Tech Stack

*   **Frontend**: React 19, Vite, TypeScript
*   **Styling**: Tailwind CSS 4 (+ `@tailwindcss/vite`), Lucide Icons
*   **Database & Auth**: Firebase 12 (Firestore & Authentication)
*   **AI Engine**: Google Generative AI (Gemini SDK)
*   **State Management**: Zustand
*   **Animations**: Framer Motion / Motion, GSAP, Lottie-React, Three.js (+ Fiber/Drei)
*   **Utilities**: Date-fns, React-Hot-Toast, Canvas-Confetti, React-Quill-New (for rich editing)
*   **Data Fetching**: React Query (TanStack Query)

---

## ⚙️ Configuration & Setup

### 1. Environment Variables
Create a `.env` file in the root directory (refer to `.env.example`):

```env
# Firebase Configuration
VITE_FIREBASE_API_KEY=your_api_key
VITE_FIREBASE_AUTH_DOMAIN=your_project.firebaseapp.com
VITE_FIREBASE_PROJECT_ID=your_project_id
VITE_FIREBASE_STORAGE_BUCKET=your_project.appspot.com
VITE_FIREBASE_MESSAGING_SENDER_ID=your_sender_id
VITE_FIREBASE_APP_ID=your_app_id
VITE_FIREBASE_FIRESTORE_DATABASE_ID=(default)

# AI Service (Gemini)
GEMINI_API_KEY=your_gemini_api_key_from_google_ai_studio
```

### 2. Firebase Setup
1.  **Authentication**: Enable Google and Identity (Email/Password) Providers.
2.  **Firestore**: Create a database and apply the provided `firestore.rules`.
3.  **Config**: Populate `firebase-applet-config.json` with your project identifiers.

### 3. Installation & Development

```bash
# Install dependencies
npm install

# Start development server (Port 3000)
npm run dev

# Build for production
npm run build
```

---

## 🔐 Security & Legal
*   **Auth Persistence**: "Remember Me" functionality using `browserLocalPersistence`.
*   **Secure Validation**: Robust email regex and password length validation.
*   **Legal Compliance**: Integrated Cookie Consent mechanisms and easily accessible Privacy/Terms/Cookie Policy modals.

---

## 📄 License
This project is for demonstration and personal use. All responses are AI-generated; always review drafts before sending to employers.

**Daddy's out. Go get that dream job! 🥂**
