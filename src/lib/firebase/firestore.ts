// Firestore helper functions for form submissions

import { 
  collection, 
  addDoc, 
  serverTimestamp,
  query,
  where,
  getDocs,
  Timestamp 
} from 'firebase/firestore';
import { db } from './config';

// Types for form data
export interface ContactFormData {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  details: string;
  timestamp?: Timestamp;
}

export interface NewsletterFormData {
  email: string;
  timestamp?: Timestamp;
  source?: string;
}

/**
 * Submit contact form data to Firestore
 * @param data - Contact form data
 * @returns Promise with document ID on success
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

    // Add timestamp
    const submissionData = {
      ...data,
      timestamp: serverTimestamp(),
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'contactSubmissions'), submissionData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting contact form:', error);
    throw error;
  }
}

/**
 * Submit newsletter subscription to Firestore
 * @param data - Newsletter subscription data
 * @returns Promise with document ID on success
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

    // Check for duplicate email (optional - you can remove this if you want to allow duplicates)
    const emailQuery = query(
      collection(db, 'newsletterSubscriptions'),
      where('email', '==', data.email.toLowerCase().trim())
    );
    const existingDocs = await getDocs(emailQuery);
    
    if (!existingDocs.empty) {
      throw new Error('This email is already subscribed');
    }

    // Add timestamp and source
    const subscriptionData = {
      email: data.email.toLowerCase().trim(),
      timestamp: serverTimestamp(),
      source: data.source || 'footer',
    };

    // Add document to Firestore
    const docRef = await addDoc(collection(db, 'newsletterSubscriptions'), subscriptionData);
    
    return docRef.id;
  } catch (error) {
    console.error('Error submitting newsletter subscription:', error);
    throw error;
  }
}
