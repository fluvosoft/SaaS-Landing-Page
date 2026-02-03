// Client-side script for handling contact form submission

import { initializeApp, getApps } from 'firebase/app';
import { getDatabase, ref, push, set, serverTimestamp } from 'firebase/database';

// Firebase configuration from environment only (no hardcoded credentials)
function getFirebaseConfig() {
  const apiKey = import.meta.env.PUBLIC_FIREBASE_API_KEY;
  const authDomain = import.meta.env.PUBLIC_FIREBASE_AUTH_DOMAIN;
  const databaseURL = import.meta.env.PUBLIC_FIREBASE_DATABASE_URL;
  const projectId = import.meta.env.PUBLIC_FIREBASE_PROJECT_ID;
  const storageBucket = import.meta.env.PUBLIC_FIREBASE_STORAGE_BUCKET;
  const messagingSenderId = import.meta.env.PUBLIC_FIREBASE_MESSAGING_SENDER_ID;
  const appId = import.meta.env.PUBLIC_FIREBASE_APP_ID;
  if (!apiKey || !authDomain || !databaseURL || !projectId || !appId) {
    return null;
  }
  return {
    apiKey,
    authDomain,
    databaseURL,
    projectId,
    storageBucket: storageBucket || '',
    messagingSenderId: messagingSenderId || '',
    appId,
  };
}

// Initialize Firebase client-side only when config is available
let db: ReturnType<typeof getDatabase> | null = null;
if (typeof window !== 'undefined') {
  try {
    const firebaseConfig = getFirebaseConfig();
    if (firebaseConfig) {
      let app;
      if (getApps().length === 0) {
        app = initializeApp(firebaseConfig);
      } else {
        app = getApps()[0];
      }
      db = getDatabase(app);
    }
  } catch (error) {
    console.error('Firebase initialization error:', error);
  }
}

// Contact form submission function
async function submitContactForm(data: {
  firstName: string;
  lastName?: string;
  email: string;
  phone?: string;
  details: string;
  workPreference?: string;
  serviceNeeded?: string;
  projectBudget?: string;
}): Promise<string> {
  if (!db) {
    throw new Error('Firebase is not initialized. Please check your configuration.');
  }

  // Validate required fields (phone optional for new contact design)
  if (!data.firstName || !data.email || !data.details) {
    throw new Error('Please fill in Your Name, Email, and Additional Details');
  }

  // Validate email format
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (!emailRegex.test(data.email)) {
    throw new Error('Invalid email format');
  }

  try {
    // Build details string with optional work preference, service, budget
    let detailsText = data.details.trim();
    if (data.workPreference || data.serviceNeeded || data.projectBudget) {
      const extra = [data.workPreference, data.serviceNeeded, data.projectBudget].filter(Boolean).join(' | ');
      detailsText = extra ? `[${extra}]\n\n${detailsText}` : detailsText;
    }

    const submissionData = {
      firstName: data.firstName.trim(),
      lastName: (data.lastName ?? '').trim(),
      email: data.email.toLowerCase().trim(),
      phone: (data.phone ?? '').trim(),
      details: detailsText,
      timestamp: serverTimestamp(),
    };

    // Push data to Realtime Database (with longer timeout - 20 seconds)
    const contactRef = ref(db, 'contactSubmissions');
    const newContactRef = push(contactRef);
    
    const writeTimeout = new Promise((_, reject) => 
      setTimeout(() => reject(new Error('Write timeout')), 20000)
    );
    
    await Promise.race([set(newContactRef, submissionData), writeTimeout]);
    
    return newContactRef.key || '';
  } catch (error: any) {
    console.error('Contact form submission error:', error);
    if (error.message.includes('timeout') || error.message.includes('Write timeout')) {
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
        workPreference: (formData.get('hs-work-preference') as string) || '',
        serviceNeeded: (formData.get('hs-service-needed') as string) || '',
        projectBudget: (formData.get('hs-project-budget') as string) || '',
      };

      // Validate required fields
      if (!contactData.firstName || !contactData.email || !contactData.details) {
        throw new Error('Please fill in Your Name, Email, and Additional Details');
      }

      // Submit to Firebase
      await submitContactForm({
        ...contactData,
        workPreference: contactData.workPreference || undefined,
        serviceNeeded: contactData.serviceNeeded || undefined,
        projectBudget: contactData.projectBudget || undefined,
      });

      // Show success message
      if (successMessage) {
        successMessage.textContent = 'Thank you! Your message has been sent. We\'ll get back to you soon.';
        successMessage.style.display = 'block';
        // Ensure white text in dark mode
        if (document.documentElement.classList.contains('dark')) {
          successMessage.style.color = '#ffffff';
        }
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
