// Realtime Database helper functions for form submissions

import { 
  ref, 
  push, 
  set,
  get,
  query,
  orderByChild,
  equalTo,
  serverTimestamp
} from 'firebase/database';
import { db } from './config';

// Types for form data
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  details: string;
  timestamp?: number | object;
}

export interface NewsletterFormData {
  email: string;
  timestamp?: number | object;
  source?: string;
}

/**
 * Submit contact form data to Realtime Database
 * @param data - Contact form data
 * @returns Promise with reference key on success
 */
export async function submitContactForm(data: ContactFormData): Promise<string> {
  try {
    // Validate required fields
    if (!data.firstName || !data.lastName || !data.email || !data.phone || !data.details) {
      throw new Error('All fields are required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    // Prepare submission data with timestamp
    const submissionData = {
      firstName: data.firstName.trim(),
      lastName: data.lastName.trim(),
      email: data.email.toLowerCase().trim(),
      phone: data.phone.trim(),
      details: data.details.trim(),
      timestamp: serverTimestamp(),
    };

    // Push data to Realtime Database
    const contactRef = ref(db, 'contactSubmissions');
    const newContactRef = push(contactRef);
    await set(newContactRef, submissionData);
    
    return newContactRef.key || '';
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

/**
 * Submit newsletter subscription to Realtime Database
 * @param data - Newsletter subscription data
 * @returns Promise with reference key on success
 */
export async function submitNewsletterSubscription(data: NewsletterFormData): Promise<string> {
  try {
    // Validate email
    if (!data.email) {
      throw new Error('Email is required');
    }

    // Validate email format
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(data.email)) {
      throw new Error('Invalid email format');
    }

    const emailLower = data.email.toLowerCase().trim();

    // Check for duplicate email
    const subscriptionsRef = ref(db, 'newsletterSubscriptions');
    const emailQuery = query(
      subscriptionsRef,
      orderByChild('email'),
      equalTo(emailLower)
    );
    
    const snapshot = await get(emailQuery);
    
    if (snapshot.exists()) {
      throw new Error('This email is already subscribed');
    }

    // Prepare subscription data with timestamp
    const subscriptionData = {
      email: emailLower,
      timestamp: serverTimestamp(),
      source: data.source || 'footer',
    };

    // Push data to Realtime Database
    const newSubscriptionRef = push(subscriptionsRef);
    await set(newSubscriptionRef, subscriptionData);
    
    return newSubscriptionRef.key || '';
  } catch (error) {
    console.error('Error submitting newsletter subscription:', error);
    throw error;
  }
}
