// Client-side script for handling contact form submission

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';

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

// Contact form submission function
async function submitContactForm(data: {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  details: string;
}): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  // Validate required fields
  if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.details) {
    throw new Error('All fields are required');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  try {
    // Prepare submission data with timestamp
    const submissionData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      details: data.details.trim(),
      timestamp: serverTimestamp(),
    };

    // Push data to Realtime Database (with timeout)
    const contactRef = ref(db, 'contactSubmissions');
    const newContactRef = push(contactRef);
    
    const timeoutPromise = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Request timeout. Please try again.')), 10000)
    );
    
    await Promise.race([set(newContactRef, submissionData), timeoutPromise]);
    
    return newContactRef.key || '';
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    if (error.message.includes('timeout')) {
      throw new Error('Connection timeout. Please check your internet connection and try again.');
    } else if (error.message.includes('PERMISSION_DENIED')) {
      throw new Error('Permission denied. Please check Firebase security rules.');
    } else if (error.message) {
      throw error;
    } else {
      throw new Error('Failed to send message. Please try again later.');
    }
  }
}

export function initContactForm(formId: string = 'contact-form') {
  const form = document.getElementById(formId) as HTMLFormElement;
  if (!form) {
    console.error('Contact form not found');
    return;
  }

  const submitButton = form.querySelector('button[type="submit"]') as HTMLButtonElement;
  const originalButtonText = submitButton?.textContent || 'Send Message';
  const successMessage = form.querySelector('.success-message') as HTMLElement;
  const errorMessage = form.querySelector('.error-message') as HTMLElement;

  form.addEventListener('submit', async (e) => {
    e.preventDefault();

    // Disable submit button
    if (submitButton) {
      submitButton.disabled = true;
      submitButton.textContent = 'Sending...';
    }

    // Hide previous messages
    if (successMessage) successMessage.style.display = 'none';
    if (errorMessage) errorMessage.style.display = 'none';

    try {
      // Check if Firebase is initialized
      if (!db) {
        throw new Error('Firebase is not initialized. Please refresh the page and try again.');
      }

      // Get form data
      const formData = new FormData(form);
      const contactData = {
        firstName: (formData.get('hs-firstname-contacts') as string) || '',
        lastName: (formData.get('hs-lastname-contacts') as string) || '',
        email: (formData.get('hs-email-contacts') as string) || '',
        phone: (formData.get('hs-phone-number') as string) || '',
        details: (formData.get('hs-about-contacts') as string) || '',
      };

      // Validate required fields
      if (!contactData.firstName || !contactData.lastName || !contactData.email || 
          !contactData.phone || !contactData.details) {
        throw new Error('Please fill in all fields');
      }

      // Submit to Firebase
      await submitContactForm(contactData);

      // Show success message
      if (successMessage) {
        successMessage.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
        successMessage.style.display = 'block';
      }

      // Reset form
      form.reset();

    } catch (error: any) {
      // Show error message
      if (errorMessage) {
        errorMessage.textContent = error.message || 'An error occurred. Please try again.';
        errorMessage.style.display = 'block';
      }
      console.error('Form submission error:', error);
    } finally {
      // Re-enable submit button
      if (submitButton) {
        submitButton.disabled = false;
        submitButton.textContent = originalButtonText;
      }
    }
  });
}
