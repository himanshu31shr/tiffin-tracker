# Firebase Production Setup Guide

To use Firebase in production (on your live site), follow these steps:

## 1. Create a Firebase Project
1. Go to the [Firebase Console](https://console.firebase.google.com/).
2. Click **Add project** and follow the steps.

## 2. Enable Google Authentication
1. In the left menu, go to **Build** > **Authentication**.
2. Click **Get started**.
3. Go to the **Sign-in method** tab.
4. Click **Add new provider** and select **Google**.
5. Enable it, configure your support email, and save.

## 3. Create Firestore Database
1. In the left menu, go to **Build** > **Firestore Database**.
2. Click **Create database**.
3. Choose a location and start in **Production mode** (or Test mode, we will overwrite the rules).

## 4. Apply Security Rules
Copy the following rules into the **Rules** tab of your Firestore Database in the Firebase Console:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    match /users/{userId} {
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

## 5. Get Web App Configuration
1. Go to **Project settings** (gear icon in the top left).
2. Under **Your apps**, click the **Web** icon (`</>`) to register an app.
3. Name it (e.g., "Tiffin Tracker").
4. Copy the `firebaseConfig` object shown in the setup instructions.

## 6. Update the App
Replace the dummy configuration in `src/firebase.js` with your real credentials:

```javascript
const firebaseConfig = {
  apiKey: "YOUR_API_KEY",
  authDomain: "YOUR_PROJECT_ID.firebaseapp.com",
  projectId: "YOUR_PROJECT_ID",
  storageBucket: "YOUR_PROJECT_ID.appspot.com",
  messagingSenderId: "YOUR_SENDER_ID",
  appId: "YOUR_APP_ID"
};
```

## 7. Deploy Again
Once you update the file, commit the changes and run:
```bash
npm run deploy
```
or merge the PR and let the GitHub Action handle it!
