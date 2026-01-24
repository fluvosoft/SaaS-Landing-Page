# Firebase Setup Instructions

## Required Firebase Information

To complete the Firebase integration, you need to provide the following information from your Firebase project:

### 1. Firebase Project Configuration

You'll need these 6 values from your Firebase Console:

1. **API Key** (`apiKey`)
   - Found in: Firebase Console > Project Settings > General > Your apps > Web app config
   - Format: `AIzaSy...` (long alphanumeric string)

2. **Auth Domain** (`authDomain`)
   - Format: `your-project-id.firebaseapp.com`
   - Usually: `{projectId}.firebaseapp.com`

3. **Project ID** (`projectId`)
   - Found in: Firebase Console > Project Settings > General
   - Format: `your-project-id` (lowercase, no spaces)

4. **Storage Bucket** (`storageBucket`)
   - Format: `your-project-id.appspot.com`
   - Usually: `{projectId}.appspot.com`

5. **Messaging Sender ID** (`messagingSenderId`)
   - Found in: Firebase Console > Project Settings > Cloud Messaging
   - Format: Numeric string (e.g., `123456789012`)

6. **App ID** (`appId`)
   - Found in: Firebase Console > Project Settings > Your apps > Web app config
   - Format: `1:123456789012:web:abcdef123456` (long alphanumeric string)

## How to Get These Values

### Step 1: Create/Select Firebase Project
1. Go to [Firebase Console](https://console.firebase.google.com/)
2. Click "Add project" or select an existing project
3. Follow the setup wizard if creating a new project

### Step 2: Enable Firestore Database
1. In Firebase Console, go to **Firestore Database** (left sidebar)
2. Click **Create database**
3. Choose **Start in test mode** (we'll set up security rules later)
4. Select a location for your database
5. Click **Enable**

### Step 3: Get Web App Configuration
1. In Firebase Console, click the **gear icon** (⚙️) > **Project settings**
2. Scroll down to **Your apps** section
3. If you don't have a web app yet:
   - Click the **Web icon** (`</>`)
   - Register your app with a nickname (e.g., "Lumiro Website")
   - Click **Register app**
4. Copy the `firebaseConfig` object values

### Step 4: Set Up Environment Variables
1. Copy `.env.example` to `.env` in the project root
2. Fill in all the Firebase configuration values:

```env
PUBLIC_FIREBASE_API_KEY=your-api-key-here
PUBLIC_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
PUBLIC_FIREBASE_PROJECT_ID=your-project-id
PUBLIC_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
PUBLIC_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
PUBLIC_FIREBASE_APP_ID=your-app-id
```

### Step 5: Set Up Firestore Security Rules

1. In Firebase Console, go to **Firestore Database** > **Rules**
2. Replace the default rules with:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Contact submissions - allow write only
    match /contactSubmissions/{document=**} {
      allow read: if false; // Only allow writes, no reads from client
      allow write: if request.resource.data.keys().hasAll(['firstName', 'lastName', 'email', 'phone', 'details', 'timestamp']);
    }
    
    // Newsletter subscriptions - allow write only
    match /newsletterSubscriptions/{document=**} {
      allow read: if false; // Only allow writes, no reads from client
      allow write: if request.resource.data.keys().hasAll(['email', 'timestamp']);
    }
  }
}
```

3. Click **Publish**

## Testing

After setting up:
1. Start your development server: `npm run dev`
2. Test the contact form on `/contact` page
3. Test the newsletter form in the footer
4. Check Firebase Console > Firestore Database to see the submitted data

## Security Notes

- The API key in `.env` is safe to expose in client-side code (it's public)
- Firestore security rules prevent unauthorized reads/writes
- Never commit `.env` file to git (it's already in `.gitignore`)
- For production, consider setting up Firebase App Check for additional security

## Troubleshooting

### "Firebase: Error (auth/unauthorized)"
- Check that all environment variables are set correctly
- Verify Firestore security rules are published

### "Missing or insufficient permissions"
- Check Firestore security rules
- Ensure rules allow writes to the collections

### Forms not submitting
- Check browser console for errors
- Verify Firebase config is loaded correctly
- Ensure Firestore is enabled in Firebase Console
