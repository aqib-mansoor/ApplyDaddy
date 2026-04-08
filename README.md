# ApplyDaddy - Job Response Automation Platform

Daddy's got your back. Generate tailored job application responses in seconds.

## Features
- **Industrial Premium Design**: Dark, high-contrast, and fast.
- **AI-Powered**: Uses Gemini 2.0 Flash to generate emails and WhatsApp messages.
- **Firebase Integration**: Secure authentication and real-time data storage.
- **Bento Dashboard**: Quick overview of your application success rate and queue.
- **Fully Responsive**: Works on mobile, tablet, and desktop.

## Setup Instructions

### 1. Firebase Project Creation
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Create a new project named "ApplyDaddy".
3. Enable **Authentication** and activate **Email/Password** and **Google** providers.
4. Create a **Firestore Database** in test mode (or production with the provided rules).
5. Register a Web App and copy the configuration object.

### 2. Google AI Studio (Gemini API)
The Gemini API key is managed via the environment variable `GEMINI_API_KEY`. You can set this in the Settings menu of AI Studio.

### 3. Firebase Configuration
The application uses `firebase-applet-config.json` for its Firebase configuration. Ensure this file exists in the root directory with your project details.

### 4. Installation
```bash
npm install
```

### 5. Running the App
```bash
npm run dev
```

## Security Rules
Apply these rules to your Firestore database:
```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
    match /applications/{appId} {
      allow read, write: if request.auth != null && request.resource.data.userId == request.auth.uid;
      allow read, delete, update: if request.auth != null && resource.data.userId == request.auth.uid;
    }
  }
}
```

Daddy's out. Good luck with the job hunt!
