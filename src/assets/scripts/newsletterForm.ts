// Client-side script for handling newsletter subscription form

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, get, query, orderByChild, equalTo, serverTimestamp } from 'firebase/database';

// Firebase configuration - must be client-side only
const firebaseConfig = {
  apiKey: import.meta.env.PUBLIC_FIREBASE_API_KEY || 'AIzaSyDFZkV4GMWUT1oZLLDMyF-bwf__Czd9ZFo',
  authDomain: import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN || 'sass-landing-page-49308.firebaseapp.com',
  databaseURL: import.meta.env.PUBLIC_FIREBASE_DATABASE_URL || 'https://sass-landing-page-49308-default-rtdb.asia-southeast1.firebasedatabase.app',
  projectId: import.meta.env.PUBLIC_FIREBASE_PROJECT_ID || 'sass-landing-page-49308',
  storageBucket: import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET || 'sass-landing-page-49308.firebasestorage.app',
  messagingSenderId: import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID || '1039256383449',
  appId: import.meta.env.PUBLIC_FIREBASE_APP_ID || '1:1039256383449:web:88a22916b6d37e034a33c8',
};

// Initialize Firebase client-side only
let db: any = null;
if (typeof window !== 'undefined') {
  try {
    let app;
    if (getApps().length === 0) {
      app = initializeApp(firebaseConfig);
    } else {
      app = getApps()[0];
    }
    db = getDatabase(app);
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Newsletter subscription function
async function submitNewsletterSubscription(email: string, source: string = 'footer'): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(email)) {
    throw new Error('Invalid email format');
  }

  const emailLower = email.toLowerCase().trim();

  try {
    const subscriptionsRef = ref(db, 'newsletterSubscriptions');
    
    // Try to check for duplicate email (optional - skip if it fails)
    try {
      const emailQuery = query(
        subscriptionsRef,
        orderByChild('email'),
        equalTo(emailLower)
      );
      
      // Shorter timeout for duplicate check (5 seconds)
      const duplicateCheckTimeout = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Duplicate check timeout')), 5000)
      );
      
      const snapshot = await Promise.race([get(emailQuery), duplicateCheckTimeout]) as any;
      
      if (snapshot.exists()) {
        throw new Error('This email is already subscribed');
      }
    } catch (duplicateError: any) {
      // If duplicate check fails due to timeout or permission, continue anyway
      // Only throw if it's actually a duplicate
      if (duplicateError.message.includes('already subscribed')) {
        throw duplicateError;
      }
      // Otherwise, log and continue (duplicate check is optional)
      console.warn('Duplicate check failed, continuing with subscription:', duplicateError);
    }

    // Prepare subscription data with timestamp
    const subscriptionData = {
      email: emailLower,
      timestamp: serverTimestamp(),
      source: source,
    };

    // Push data to Realtime Database (with longer timeout - 20 seconds)
    const newSubscriptionRef = push(subscriptionsRef);
    const writeTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Write timeout')), 20000)
    );
    
    await Promise.race([set(newSubscriptionRef, subscriptionData), writeTimeout]);
    
    return newSubscriptionRef.key || '';
  } catch (error: any) {
    console.error('Newsletter subscription error:', error);
    if (error.message.includes('timeout') || error.message.includes('Write timeout')) {
      throw new Error('Connection timeout. Please check your internet connection and try again.');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission denied. Please check Firebase security rules.');
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Failed to subscribe. Please try again later.');
    }
  }
}

export function initNewsletterForm(inputId: string = 'footer-input', buttonSelector: string = '.newsletter-submit') {
  const emailInput = document.getElementById(inputId) as HTMLInputElement;
  const submitButton = document.querySelector(buttonSelector) as HTMLElement;
  
  if (!emailInput || !submitButton) {
    console.error('Newsletter form elements not found');
    return;
  }

  // Create message elements if they don't exist
  let successMessage = document.querySelector('.newsletter-success') as HTMLElement;
  let errorMessage = document.querySelector('.newsletter-error') as HTMLElement;

  if (!successMessage) {
    successMessage = document.createElement('p');
    successMessage.className = 'newsletter-success mt-2 text-sm text-green-600 dark:!text-white';
    successMessage.style.display = 'none';
    emailInput.parentElement?.parentElement?.appendChild(successMessage);
  }

  if (!errorMessage) {
    errorMessage = document.createElement('p');
    errorMessage.className = 'newsletter-error mt-2 text-sm text-red-600 dark:text-red-400';
    errorMessage.style.display = 'none';
    emailInput.parentElement?.parentElement?.appendChild(errorMessage);
  }

  const handleSubmit = async (e: Event) => {
    e.preventDefault();

    // Hide previous messages
    successMessage.style.display = 'none';
    errorMessage.style.display = 'none';

    const email = emailInput.value.trim();

    // Validate email
    if (!email) {
      errorMessage.textContent = 'Please enter your email address';
      errorMessage.style.display = 'block';
      return;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
      errorMessage.textContent = 'Please enter a valid email address';
      errorMessage.style.display = 'block';
      return;
    }

    // Disable input and button
    emailInput.disabled = true;
    if (submitButton instanceof HTMLButtonElement) {
      submitButton.disabled = true;
    }
    const originalButtonText = submitButton.textContent;
    submitButton.textContent = 'Subscribing...';

    try {
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase is not initialized. Please refresh the page and try again.');
      }

      // Submit to Firebase
      await submitNewsletterSubscription(email, 'footer');

      // Show success message
      successMessage.textContent = 'Thank you for subscribing!';
      successMessage.style.display = 'block';
      // Ensure white text in dark mode
      if (document.documentElement.classList.contains('dark')) {
        successMessage.style.color = '#ffffff';
      }

      // Clear input
      emailInput.value = '';

    } catch (error: any) {
      // Show error message
      const errorMsg = error.message || 'An error occurred. Please try again.';
      errorMessage.textContent = errorMsg;
      errorMessage.style.display = 'block';
      console.error('Newsletter subscription error:', error);
    } finally {
      // Re-enable input and button
      emailInput.disabled = false;
      if (submitButton instanceof HTMLButtonElement) {
        submitButton.disabled = false;
      }
      submitButton.textContent = originalButtonText || 'Subscribe';
    }
  };

  // Handle form submission
  const form = emailInput.closest('form');
  if (form) {
    form.addEventListener('submit', handleSubmit);
  } else {
    // If no form, handle button click
    submitButton.addEventListener('click', handleSubmit);
  }
}
