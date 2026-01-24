// Client-side script for handling newsletter subscription form

import { submitNewsletterSubscription, type NewsletterFormData } from '../../lib/firebase/firestore';

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
    successMessage.className = 'newsletter-success mt-2 text-sm text-green-600 dark:text-green-400';
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
      // Submit to Firebase
      const subscriptionData: NewsletterFormData = {
        email: email,
        source: 'footer',
      };

      await submitNewsletterSubscription(subscriptionData);

      // Show success message
      successMessage.textContent = 'Thank you for subscribing!';
      successMessage.style.display = 'block';

      // Clear input
      emailInput.value = '';

    } catch (error: any) {
      // Show error message
      errorMessage.textContent = error.message || 'An error occurred. Please try again.';
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
