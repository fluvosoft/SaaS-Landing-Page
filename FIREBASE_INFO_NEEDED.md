# Firebase Information Needed

## Quick Reference - What I Need From You

To complete the Firebase integration, please provide the following 6 values from your Firebase project:

### Required Firebase Configuration Values

| Variable Name | Description | Example Format |
|--------------|-------------|----------------|
| `PUBLIC_FIREBASE_API_KEY` | Web API Key | `AIzaSy...` (long string) |
| `PUBLIC_FIREBASE_AUTH_DOMAIN` | Authentication domain | `your-project.firebaseapp.com` |
| `PUBLIC_FIREBASE_PROJECT_ID` | Project ID | `your-project-id` |
| `PUBLIC_FIREBASE_STORAGE_BUCKET` | Storage bucket URL | `your-project.appspot.com` |
| `PUBLIC_FIREBASE_MESSAGING_SENDER_ID` | Messaging sender ID | `123456789012` (numbers) |
| `PUBLIC_FIREBASE_APP_ID` | App ID | `1:123456789:web:abcdef123456` |

## Where to Find These Values

1. **Go to Firebase Console**: https://console.firebase.google.com/
2. **Select/Create Project**
3. **Enable Firestore Database**:
   - Click "Firestore Database" in left menu
   - Click "Create database"
   - Choose "Start in test mode"
   - Select location
   - Click "Enable"
4. **Get Web App Config**:
   - Click ⚙️ (gear icon) → "Project settings"
   - Scroll to "Your apps" section
   - Click `</>` (Web icon) to add/register web app
   - Copy the config values from the `firebaseConfig` object

## Example Config Object

When you register a web app, Firebase will show you something like this:

```javascript
const firebaseConfig = {
  apiKey: "AIzaSyXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
  authDomain: "your-project-id.firebaseapp.com",
  projectId: "your-project-id",
  storageBucket: "your-project-id.appspot.com",
  messagingSenderId: "123456789012",
  appId: "1:123456789012:web:abcdef1234567890"
};
```

## What to Do With These Values

Once you have these values, I'll help you:
1. Create a `.env` file with your credentials
2. Set up Firestore security rules
3. Test the form submissions

## Quick Setup Checklist

- [ ] Firebase project created
- [ ] Firestore Database enabled
- [ ] Web app registered in Firebase
- [ ] All 6 config values copied
- [ ] Ready to configure `.env` file

---

**Note**: These values are safe to use in client-side code. The API key is public and designed to be exposed. Security is handled through Firestore security rules.
