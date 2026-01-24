# Firebase Implementation Plan

## Overview
This document outlines the implementation plan for integrating Firebase Firestore to handle form submissions for:
1. **Contact Us Form** - Stores contact inquiries
2. **Stay Up to Date Form** - Stores newsletter subscriptions

## Implementation Strategy

### 1. Firebase Setup
- **Service**: Firebase Firestore (NoSQL database)
- **Collections**:
  - `contactSubmissions` - Stores contact form data
  - `newsletterSubscriptions` - Stores newsletter email subscriptions

### 2. Contact Form Implementation
**Location**: `src/components/sections/misc/ContactSection.astro`

**Fields to Store**:
- First Name
- Last Name
- Email
- Phone Number
- Details/Message
- Timestamp (auto-generated)
- Status (new, read, replied - optional for future)

**Implementation**:
- Add client-side JavaScript to handle form submission
- Validate form fields before submission
- Submit data to Firestore
- Show success/error messages to user
- Reset form on success

### 3. Newsletter Form Implementation
**Location**: `src/components/ui/forms/input/EmailFooterInput.astro` (used in FooterSection)

**Fields to Store**:
- Email
- Timestamp (auto-generated)
- Source (footer subscription)

**Implementation**:
- Add client-side JavaScript to handle form submission
- Validate email format
- Check for duplicate emails
- Submit to Firestore
- Show success/error messages

### 4. Technical Approach
- Use Firebase Web SDK v9+ (modular)
- Client-side only (no server-side API routes needed)
- Environment variables for Firebase config (security)
- Error handling and user feedback

## Firebase Configuration Required

You'll need to provide the following from your Firebase project:

1. **apiKey** - Web API Key
2. **authDomain** - Project authentication domain
3. **projectId** - Firebase project ID
4. **storageBucket** - Storage bucket URL
5. **messagingSenderId** - Messaging sender ID
6. **appId** - Firebase app ID

### How to Get These Values:
1. Go to Firebase Console (https://console.firebase.google.com/)
2. Select your project (or create a new one)
3. Go to Project Settings (gear icon)
4. Scroll down to "Your apps" section
5. Click on Web app (</>) icon or add a web app
6. Copy the config object values

## Security Rules (Firestore)

You'll need to set up Firestore security rules. Here's a basic setup:

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

## File Structure

```
src/
├── lib/
│   └── firebase/
│       ├── config.ts          # Firebase configuration
│       └── firestore.ts       # Firestore helper functions
├── components/
│   ├── sections/
│   │   └── misc/
│   │       └── ContactSection.astro  # Updated with Firebase
│   └── ui/
│       └── forms/
│           └── input/
│               └── EmailFooterInput.astro  # Updated with Firebase
└── .env                       # Environment variables (gitignored)
```

## Next Steps

1. ✅ Create implementation plan (this document)
2. ⏳ Install Firebase SDK
3. ⏳ Create Firebase configuration files
4. ⏳ Set up environment variables
5. ⏳ Create Firestore helper functions
6. ⏳ Update Contact Form with Firebase integration
7. ⏳ Update Newsletter Form with Firebase integration
8. ⏳ Test form submissions
9. ⏳ Set up Firestore security rules in Firebase Console
